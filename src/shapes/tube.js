import { THREE, DEFAULT_CYLINDER_SEGMENTS } from '../environment.js';

// Create a hollow cylinder (tube) by extruding a ring shape.
// size: [innerDiameter, outerDiameter, height]
export function createTubeMesh(
  scene,
  size = [4, 10, 10],
  position = [0, 0, 0],
  color = 0xffffff
) {
  const innerD = Number(size?.[0]);
  const outerD = Number(size?.[1]);
  const height = Math.max(0.0001, Number(size?.[2]) || 0);

  // Radii with clamping and ordering
  let rIn = Math.max(0, (Number.isFinite(innerD) ? innerD : 0) / 2);
  let rOut = Math.max(0.0001, (Number.isFinite(outerD) ? outerD : 0) / 2);
  if (rIn >= rOut) {
    // Ensure a proper ring, keep a tiny wall thickness
    const eps = 1e-4;
    rIn = Math.max(0, rOut - eps);
  }

  // Create a ring shape (annulus) centered at origin on XY plane
  const shape = new THREE.Shape();
  // Use opposite windings for outer and inner to ensure correct solid caps
  shape.absarc(0, 0, rOut, 0, Math.PI * 2, true);
  const hole = new THREE.Path();
  hole.absarc(0, 0, rIn, 0, Math.PI * 2, false);
  shape.holes.push(hole);

  const segments = Math.max(3, Math.floor(Number(DEFAULT_CYLINDER_SEGMENTS) || 50));
  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: height, // extrude along +Z
    bevelEnabled: false,
    curveSegments: segments,
  });

  // Center the geometry like CylinderGeometry (center at origin)
  // Extrusion is along Z from 0..height; rotate so Z->Y and recenter
  geom.rotateX(-Math.PI / 2);
  geom.translate(0, -height / 2, 0);

  const mat = new THREE.MeshStandardMaterial({ color });
  const mesh = new THREE.Mesh(geom, mat);
  const [x, y, z] = position;
  mesh.position.set(x, y, z);
  scene.add(mesh);
  return mesh;
}
