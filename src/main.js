import { setupEnvironment, startRenderLoop, enableCameraAutoOrbit, THREE } from './environment.js';
import { createBlocks, parseBlocksJSON, setBlocksJSON, BLOCKS_JSON } from './block.js';
import { exportOBJFromMeshes } from './exporters/obj.js';

// 環境の初期化
const { scene, camera, renderer } = setupEnvironment();

// 初期生成（JSONから）
let currentMeshes = [];
function clearCurrent() {
  for (const m of currentMeshes) {
    if (!m) continue;
    scene.remove(m);
    if (m.geometry) m.geometry.dispose?.();
    if (m.material) {
      if (Array.isArray(m.material)) m.material.forEach(mat => mat.dispose?.());
      else m.material.dispose?.();
    }
  }
  currentMeshes = [];
}

function computeCenter(meshes) {
  if (!meshes.length) return null;
  const box = new THREE.Box3();
  for (const m of meshes) box.expandByObject(m);
  const center = new THREE.Vector3();
  box.getCenter(center);
  return center;
}

function renderFromJSON() {
  clearCurrent();
  const blocks = parseBlocksJSON();
  if (!blocks) return;
  currentMeshes = createBlocks(scene);
  const center = computeCenter(currentMeshes);
  if (center) enableCameraAutoOrbit({ target: center, speed: 0.003 });
}

// UI 結線
const input = document.getElementById('blocks-json');
const sendBtn = document.getElementById('send-btn');
const errorEl = document.getElementById('json-error');
const downloadObjBtn = document.getElementById('download-obj');
if (input) input.value = BLOCKS_JSON;
if (sendBtn) {
  sendBtn.addEventListener('click', () => {
    errorEl && (errorEl.textContent = '');
    let text = input && input.value ? String(input.value) : '';
    try {
      const tmp = JSON.parse(text);
      if (!Array.isArray(tmp?.blocks) && !Array.isArray(tmp?.sizes) && !Array.isArray(tmp?.positions)) {
        throw new Error('blocks または sizes/positions が必要です');
      }
    } catch (e) {
      if (errorEl) errorEl.textContent = 'JSON パースエラー: ' + (e?.message || e);
      return;
    }
    setBlocksJSON(text);
    renderFromJSON();
  });
}

// (GLB export removed by request)

// Export current blocks as OBJ (geometry only; no .mtl)
function exportBlocksAsOBJ() {
  if (!currentMeshes.length) return;
  try {
    const objText = exportOBJFromMeshes(currentMeshes);
    const blob = new Blob([objText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    a.href = url;
    a.download = `blocks-${ts}.obj`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  } catch (e) {
    console.error('OBJ export error:', e);
    if (errorEl) errorEl.textContent = 'OBJエクスポートに失敗しました';
  }
}

// 初回描画
renderFromJSON();

// アニメーションループは環境側に委譲
startRenderLoop({ scene, camera, renderer });

if (downloadObjBtn) {
  downloadObjBtn.addEventListener('click', () => {
    errorEl && (errorEl.textContent = '');
    exportBlocksAsOBJ();
  });
}
