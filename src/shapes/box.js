import { THREE } from '../environment.js';

export function createBoxMesh(scene, size = [10, 10, 10], position = [0, 0, 0], color = 0xffffff) {
  const [sx, sy, sz] = size;
  const [x, y, z] = position;
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(sx, sy, sz),
    new THREE.MeshStandardMaterial({ color })
  );
  mesh.position.set(x, y, z);
  scene.add(mesh);
  return mesh;
}

