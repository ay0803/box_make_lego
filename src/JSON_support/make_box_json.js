// シンプルなボックスJSON生成＆UIバインド

export function makeBoxJSON(x, y, z, scale = 1) {
  x = Number(x);
  y = Number(y);
  z = Number(z);
  let k = Number.isFinite(Number(scale)) && Number(scale) > 0 ? Number(scale) : 1;

  if (!(x > 0 && y > 0 && z > 0)) return '';

  // 最小限の丸め（小数第3位まで）。構造は固定なので配列だけ丸める。
  const q = (n) => {
    const v = Number(n);
    if (!Number.isFinite(v)) return v;
    return Math.round(v * 1000) / 1000;
  };

  if (k === 1) {
    const sizes = [[x,1,z],[1,2,z],[1,2,z],[x-2,2,1],[x-2,2,1],[1,2,z-4],[1,2,z-4],[x-6,2,1],[x-6,2,1]];
    const positions = [[0,0,0],[(x-1)/2,3/2,0],[-(x-1)/2,3/2,0],[0,3/2,(z-1)/2],[0,3/2,-(z-1)/2],[(x-5)/2,3/2,0],[-(x-5)/2,3/2,0],[0,3/2,(z-5)/2],[0,3/2,-(z-5)/2]];
    const qs = sizes.map(a => a.map(q));
    const qp = positions.map(a => a.map(q));
    return JSON.stringify({ box: { sizes: qs, positions: qp } });
  }
  if (k === 2) {
    const sizes = [[x-2,1,y-2],[1,1,y-5],[1,1,y-5],[x,1,y-5]];
    const positions = [[0,0,0],[(x-1)/2,0,0],[-(x-1)/2,0,0],[0,1,0]];
    const qs = sizes.map(a => a.map(q));
    const qp = positions.map(a => a.map(q));
    return JSON.stringify({ box: { sizes: qs, positions: qp } });
  }
  if (k === 3) {
    const sizes = [[z-4,1,y-2],[z-4,1,y-5]];
    const positions = [[0,0,0],[0,1,0]];
    const qs = sizes.map(a => a.map(q));
    const qp = positions.map(a => a.map(q));
    return JSON.stringify({ box: { sizes: qs, positions: qp } });
  }
  return JSON.stringify({ box: { sizes: [[1, 1, 1]], positions: [[0, 0, 0]] } });
}

export function setupBoxMakingUI() {
  const xI = document.getElementById('box-size-x');
  const yI = document.getElementById('box-size-y');
  const zI = document.getElementById('box-size-z');
  const cBtn = document.getElementById('box-create-btn');
  const err = document.getElementById('box-json-error');
  const out = document.getElementById('box-json-output');
  const blocks = document.getElementById('blocks-json');
  const sendBtn = document.getElementById('box-send-above');
  const directBtn = document.getElementById('box-direct-submit');
  const topSubmitBtn = document.getElementById('send-btn');

  if (!cBtn) return;

  const getScale = () => {
    const el = document.querySelector('input[name="box-scale"]:checked');
    const v = el ? Number(el.value) : 1;
    return Number.isFinite(v) && v > 0 ? v : 1;
  };

  cBtn.onclick = () => {
    err && (err.textContent = '');
    const json = makeBoxJSON(xI?.value, yI?.value, zI?.value, getScale());
    if (!json) {
      err && (err.textContent = 'サイズは正の数を入力してください');
      return;
    }
    out ? (out.value = json) : (blocks && (blocks.value = json));
  };

  sendBtn && sendBtn.addEventListener('click', () => {
    if (!out || !blocks) return;
    if (!out.value.trim()) {
      err && (err.textContent = '送信するJSONがありません');
      return;
    }
    err && (err.textContent = '');
    blocks.value = out.value;
  });

  // DIRECT SUBMIT: 外側から擬似的に「Send JSON Above」→「SUBMIT」の順に押す
  directBtn && directBtn.addEventListener('click', () => {
    if (!out || !blocks) return;
    if (!out.value.trim()) {
      err && (err.textContent = '送信するJSONがありません');
      return;
    }
    err && (err.textContent = '');
    // まず既存の「Send JSON Above」をクリック
    sendBtn && sendBtn.click();
    // すぐに最上段のSUBMITをクリック（値反映後に行うため微小ディレイ）
    setTimeout(() => { topSubmitBtn && topSubmitBtn.click(); }, 0);
  });
}
