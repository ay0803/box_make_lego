import { THREE } from '../environment.js';

function toFixed(n) {
  return Number.isFinite(n) ? (+n).toFixed(6).replace(/\.0+$/,'').replace(/(\.[0-9]*?)0+$/,'$1') : '0';
}

function addFacet(lines, ax, ay, az, bx, by, bz, cx, cy, cz) {
  // Compute normal from triangle (A,B,C)
  const ux = bx - ax, uy = by - ay, uz = bz - az;
  const vx = cx - ax, vy = cy - ay, vz = cz - az;
  const nx = uy * vz - uz * vy;
  const ny = uz * vx - ux * vz;
  const nz = ux * vy - uy * vx;
  const len = Math.hypot(nx, ny, nz) || 1;
  lines.push(`  facet normal ${toFixed(nx/len)} ${toFixed(ny/len)} ${toFixed(nz/len)}`);
  lines.push(`    outer loop`);
  lines.push(`      vertex ${toFixed(ax)} ${toFixed(ay)} ${toFixed(az)}`);
  lines.push(`      vertex ${toFixed(bx)} ${toFixed(by)} ${toFixed(bz)}`);
  lines.push(`      vertex ${toFixed(cx)} ${toFixed(cy)} ${toFixed(cz)}`);
  lines.push(`    endloop`);
  lines.push(`  endfacet`);
}

// ASCII STL export suitable for most slicers
export function exportSTLFromMeshes(meshes = []) {
  const lines = [];
  lines.push('solid scene');

  for (let i = 0; i < meshes.length; i++) {
    const mesh = meshes[i];
    if (!mesh || !(mesh.isMesh) || !mesh.geometry) continue;
    mesh.updateWorldMatrix(true, false);
    const geom = mesh.geometry.index ? mesh.geometry.toNonIndexed() : mesh.geometry.clone();
    geom.applyMatrix4(mesh.matrixWorld);
    const pos = geom.getAttribute('position');
    if (!pos) continue;
    for (let j = 0; j < pos.count; j += 3) {
      addFacet(
        lines,
        pos.getX(j), pos.getY(j), pos.getZ(j),
        pos.getX(j+1), pos.getY(j+1), pos.getZ(j+1),
        pos.getX(j+2), pos.getY(j+2), pos.getZ(j+2)
      );
    }
  }

  lines.push('endsolid scene');
  return lines.join('\n') + '\n';
}

