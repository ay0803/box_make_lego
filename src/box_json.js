// シンプルなボックスJSON生成＆UIバインド

export function makeBoxJSON(x, y, z, scale = 1) {
  x = Number(x);
  y = Number(y);
  z = Number(z);
  let k = Number.isFinite(Number(scale)) && Number(scale) > 0 ? Number(scale) : 1;

  if (!(x > 0 && y > 0 && z > 0)) return '';

  // チェックボタン式なので else は考えにくい (kは1,2,3のみのはず)
  if (k === 1) {
    return JSON.stringify({"sizes": [[x,1,z],[1,2,z],[1,2,z],[x-2,2,1],[x-2,2,1],[1,2,z-4],[1,2,z-4],[x-6,2,1],[x-6,2,1]],"positions": [[0,0,0],[(x-1)/2,3/2,0],[-(x-1)/2,3/2,0],[0,3/2,(z-1)/2],[0,3/2,-(z-1)/2],[(x-5)/2,3/2,0],[-(x-5)/2,3/2,0],[0,3/2,(z-5)/2],[0,3/2,-(z-5)/2]]});
  }
  if (k === 2) {
    return JSON.stringify({"sizes": [[x-2,1,y-2],[1,1,y-5],[1,1,y-5],[x,1,y-5]],"positions": [[0,0,0],[(x-1)/2,0,0],[-(x-1)/2,0,0],[0,1,0]]});
  }
  if (k === 3) {
    return JSON.stringify({"sizes": [[z-4,1,y-2],[z-4,1,y-5]], "positions": [[0,0,0],[0,1,0]]});
  }
  return JSON.stringify({sizes: [[1, 1, 1]],positions: [[0, 0, 0]]
  });
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
}
