import { THREE, DEFAULT_CYLINDER_SEGMENTS } from '../environment.js';

export function createCylinderMesh(scene, size = [10, 10], position = [0, 0, 0], color = 0xffffff) {
  const d = size?.[0];
  const h = size?.[1];
  // 後方互換: size[2] があっても無視して DEFAULT_CYLINDER_SEGMENTS を使う
  const r = Math.max(0.0001, (Number(d) || 0) / 2);
  const height = Math.max(0.0001, Number(h) || 0);
  const segments = Math.max(3, Math.floor(Number(DEFAULT_CYLINDER_SEGMENTS) || 50));
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(r, r, height, segments),
    new THREE.MeshStandardMaterial({ color })
  );
  const [x, y, z] = position;
  mesh.position.set(x, y, z);
  scene.add(mesh);
  return mesh;
}

