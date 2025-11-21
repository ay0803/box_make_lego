// dot Make box: for now, generate the same shapes as make_box
// Later, we can change the internals to place studs using fixed specs.
import { DOT_DIAMETER_MM, DOT_SPACING_MM } from '../environment.js';

function q(n) {
  const v = Number(n);
  if (!Number.isFinite(v)) return v;
  return Math.round(v * 1000) / 1000;
}

// Note: l = 1 or 2. For now, both branches are identical; logic can diverge later.
function buildPartByK(x, y, z, k, l = 1) {
  const dotx = 8*(x-1)+5.1+6;
  const doty = 8*(y-1)+5.1+6;
  const dotz = 8*(z-1)+5.1+6;
  if (l === 1) {
    if (k === 1) {
      const b_sizes = [[dotx,1,dotz],[1,2,dotz],[1,2,dotz],[dotx-2,2,1],[dotx-2,2,1],[1,2,dotz-4],[1,2,dotz-4],[dotx-6,2,1],[dotx-6,2,1]];
      const b_positions = [[0,0,0],[(dotx-1)/2,3/2,0],[-(dotx-1)/2,3/2,0],[0,3/2,(dotz-1)/2],[0,3/2,-(dotz-1)/2],[(dotx-5)/2,3/2,0],[-(dotx-5)/2,3/2,0],[0,3/2,(dotz-5)/2],[0,3/2,-(dotz-5)/2]];
      const b_qs = b_sizes.map(a => a.map(q));
      const b_qp = b_positions.map(a => a.map(q));
      const c_sizes = [];
      const c_positions = [];
      const c_qs = c_sizes.map(a => a.map(q));
      const c_qp = c_positions.map(a => a.map(q));
      const t_sizes = [];
      const t_positions = [];
      const t_qs = t_sizes.map(a => a.map(q));
      const t_qp = t_positions.map(a => a.map(q));
      return {
        box: { sizes: b_qs, positions: b_qp },
        cylinder: { sizes: c_qs, positions: c_qp },
        tube: { sizes: t_qs, positions: t_qp }
      };
    }
    if (k === 2) {
      const b_sizes = [[dotx-2,1,doty-2],[1,1,doty-5],[1,1,doty-5],[dotx,1,doty-5]];
      const b_positions = [[0,0,0],[(dotx-1)/2,0,0],[-(dotx-1)/2,0,0],[0,1,0]];
      const b_qs = b_sizes.map(a => a.map(q));
      const b_qp = b_positions.map(a => a.map(q));
      const c_sizes = [];
      for (let i = 1; i <= x; i++) for (let j = 1; j <= y; j++) c_sizes.push([5.1, 2.5]);
      const c_positions = [];
      for (let i = 1; i <= x; i++) for (let j = 1; j <= y; j++) { let xpos = (i % 2 === 0 ? +4 * (i - 1) : -4 * i) + (x % 2 === 1 ? +4 : 0); 
        let zpos = (j % 2 === 0 ? +4 * (j - 1) : -4 * j) + (y % 2 === 1 ? +4 : 0); 
          c_positions.push([xpos, 2.5, zpos]); }
      const c_qs = c_sizes.map(a => a.map(q));
      const c_qp = c_positions.map(a => a.map(q));
      const t_sizes = [];
      const t_positions = [];
      const t_qs = t_sizes.map(a => a.map(q));
      const t_qp = t_positions.map(a => a.map(q));
      return {
        box: { sizes: b_qs, positions: b_qp },
        cylinder: { sizes: c_qs, positions: c_qp },
        tube: { sizes: t_qs, positions: t_qp }
      };
    }
    if (k === 3) {
      const b_sizes = [[dotz-4,1,doty-2],[dotz-4,1,doty-5]];
      const b_positions = [[0,0,0],[0,1,0]];
      const b_qs = b_sizes.map(a => a.map(q));
      const b_qp = b_positions.map(a => a.map(q));
      const c_sizes = [];
      for (let i = 1; i <= y; i++) for (let j = 1; j <= z; j++) c_sizes.push([5.1, 2]);
      const c_positions = [];
      for (let i = 1; i <= y; i++) for (let j = 1; j <= z; j++) { let zpos = (i % 2 === 0 ? +4 * (i - 1) : -4 * i) + (y % 2 === 1 ? +4 : 0); 
        let xpos = (j % 2 === 0 ? +4 * (j - 1) : -4 * j) + (z % 2 === 1 ? +4 : 0); 
          c_positions.push([xpos, 2.5, zpos]); }
      const c_qs = c_sizes.map(a => a.map(q));
      const c_qp = c_positions.map(a => a.map(q));
      const t_sizes = [];
      const t_positions = [];
      const t_qs = t_sizes.map(a => a.map(q));
      const t_qp = t_positions.map(a => a.map(q));
      return {
        box: { sizes: b_qs, positions: b_qp },
        cylinder: { sizes: c_qs, positions: c_qp },
        tube: { sizes: t_qs, positions: t_qp }
      };
    }
    return {
      box: { sizes: [[1, 1, 1]], positions: [[0, 0, 0]] },
      cylinder: { sizes: [], positions: [] },
      tube: { sizes: [], positions: [] }
    };
  }
  if (l === 2) {
    if (k === 1) {
      const b_sizes = [[dotx,1,dotz],[1,2,dotz],[1,2,dotz],[dotx-2,2,1],[dotx-2,2,1],[1,2,dotz-4],[1,2,dotz-4],[dotx-6,2,1],[dotx-6,2,1]];
      const b_positions = [[0,0,0],[(dotx-1)/2,3/2,0],[-(dotx-1)/2,3/2,0],[0,3/2,(dotz-1)/2],[0,3/2,-(dotz-1)/2],[(dotx-5)/2,3/2,0],[-(dotx-5)/2,3/2,0],[0,3/2,(dotz-5)/2],[0,3/2,-(dotz-5)/2]];
      const b_qs = b_sizes.map(a => a.map(q));
      const b_qp = b_positions.map(a => a.map(q));
      const c_sizes = [];
      const c_positions = [];
      const c_qs = c_sizes.map(a => a.map(q));
      const c_qp = c_positions.map(a => a.map(q));
      const t_sizes = [];
      const t_positions = [];
      const t_qs = t_sizes.map(a => a.map(q));
      const t_qp = t_positions.map(a => a.map(q));
      return {
        box: { sizes: b_qs, positions: b_qp },
        cylinder: { sizes: c_qs, positions: c_qp },
        tube: { sizes: t_qs, positions: t_qp }
      };
    }
    if (k === 2) {
      const b_sizes = [[dotx-2,1,doty-2+1],[1,1,doty-5+1],[1,1,doty-5+1],[dotx,2,1],[dotx,2,1],[3,2,doty-5-1],[3,2,doty-5-1]];
      const b_positions = [[0,0,0],[(dotx-1)/2,0,0],[-(dotx-1)/2,0,0],[0,1.5,(doty-5+1-1)/2],[0,1.5,-(doty-5+1-1)/2],[(dotx-2-1)/2,1.5,0],[-(dotx-2-1)/2,1.5,0]];
      const b_qs = b_sizes.map(a => a.map(q));
      const b_qp = b_positions.map(a => a.map(q));
      const c_sizes = [];
      const c_positions = [];
      const c_qs = c_sizes.map(a => a.map(q));
      const c_qp = c_positions.map(a => a.map(q));
      //const t_sizes = [ [5.1,6.6,2],[5.1,6.6,2],[5.1,6.6,2] ];
      const t_sizes = [];
      for (let i = 1; i <= x-1; i++) for (let j = 1; j <= y-1; j++) t_sizes.push([5.1, 6.6, 2]);
      //const t_positions = [ [0, 1.5, 0],[-8, 1.5, 0],[8, 1.5, 0]];
      const t_positions = [];
      for (let i = 1; i <= x-1; i++) for (let j = 1; j <= y-1; j++) { let xpos = (i % 2 === 0 ? -4 * (i - 1) : 4 * i)+ (x % 2 === 0 ? -4 : 0) ; 
        let zpos = (j % 2 === 0 ? -4 * (j - 1) : +4 * j)+ (y % 2 === 0 ? -4 : 0); 
          t_positions.push([xpos, 1.5, zpos]); }
      const t_qs = t_sizes.map(a => a.map(q));
      const t_qp = t_positions.map(a => a.map(q));
      return {
        box: { sizes: b_qs, positions: b_qp },
        cylinder: { sizes: c_qs, positions: c_qp },
        tube: { sizes: t_qs, positions: t_qp }
      };
    }
    if (k === 3) {
      const b_sizes = [[dotz-4,1,doty-2+1],[dotz-4,2,1],[dotz-4,2,1],[1,2,doty-5-1],[1,2,doty-5-1]];
      const b_positions = [[0,0,0],[0,1.5,-(doty-2+1-4)/2],[0,1.5,(doty-2+1-4)/2],[-(dotz-4-1)/2,1.5,0],[(dotz-4-1)/2,1.5,0]];
      const b_qs = b_sizes.map(a => a.map(q));
      const b_qp = b_positions.map(a => a.map(q));
      const c_sizes = [];
      const c_positions = [];
      const c_qs = c_sizes.map(a => a.map(q));
      const c_qp = c_positions.map(a => a.map(q));
      //const t_sizes = [ [5.1,6.6,2],[5.1,6.6,2]];
      const t_sizes = [];
      for (let i = 1; i <= y-1; i++) for (let j = 1; j <= z-1; j++) t_sizes.push([5.1, 6.6, 2]);
      //const t_positions = [ [4, 1.5, 0],[-4, 1.5, 0]];
      const t_positions = [];
      for (let i = 1; i <= y-1; i++) for (let j = 1; j <= z-1; j++) { let zpos = (i % 2 === 0 ? -4 * (i - 1) : 4 * i)+ (y % 2 === 0 ? -4 : 0) ; 
        let xpos = (j % 2 === 0 ? -4 * (j - 1) : +4 * j)+ (z % 2 === 0 ? -4 : 0); 
          t_positions.push([xpos, 1.5, zpos]); }
      const t_qs = t_sizes.map(a => a.map(q));
      const t_qp = t_positions.map(a => a.map(q));
      return {
        box: { sizes: b_qs, positions: b_qp },
        cylinder: { sizes: c_qs, positions: c_qp },
        tube: { sizes: t_qs, positions: t_qp }
      };
    }
    return {
      box: { sizes: [[1, 1, 1]], positions: [[0, 0, 0]] },
      cylinder: { sizes: [], positions: [] },
      tube: { sizes: [], positions: [] }
    };
  }
  return {
    box: { sizes: [[1, 1, 1]], positions: [[0, 0, 0]] },
    cylinder: { sizes: [], positions: [] },
    tube: { sizes: [], positions: [] }
  };
}

// parts: array of strings in ['top','sideA','sideB']
// parts: array of strings in ['top','sideA','sideB']
export function makeDotBoxJSON(x, y, z, parts = ['top'], dotType = 'A') {
  x = Number(x);
  y = Number(y);
  z = Number(z);
  if (!(x > 0 && y > 0 && z > 0)) return '';

  const out = {};
  const wantTop = parts.includes('top');
  const wantA = parts.includes('sideA');
  const wantB = parts.includes('sideB');
  const l = (dotType === 'B' || dotType === 2) ? 2 : 1;

  function mergeShapes(target, src) {
    if (!src) return;
    for (const type of ['box', 'cylinder', 'tube']) {
      const g = src[type];
      if (!g) continue;
      const sizes = Array.isArray(g.sizes) ? g.sizes : [];
      const positions = Array.isArray(g.positions) ? g.positions : [];
      // Skip creating this type when both arrays are empty
      if (sizes.length === 0 && positions.length === 0) continue;
      const t = (target[type] ||= { sizes: [], positions: [] });
      if (sizes.length) t.sizes.push(...sizes);
      if (positions.length) t.positions.push(...positions);
    }
  }

  if (wantTop) mergeShapes(out, buildPartByK(x, y, z, 1, l));
  if (wantA) mergeShapes(out, buildPartByK(x, y, z, 2, l));
  if (wantB) mergeShapes(out, buildPartByK(x, y, z, 3, l));

  if (!Object.keys(out).length) return '';
  return JSON.stringify(out);
}

export function setupDotBoxMakingUI() {
  const xI = document.getElementById('dot-box-size-x');
  const yI = document.getElementById('dot-box-size-y');
  const zI = document.getElementById('dot-box-size-z');
  const cBtn = document.getElementById('dot-box-create-btn');
  const err = document.getElementById('dot-box-json-error');
  const out = document.getElementById('dot-box-json-output');
  const blocks = document.getElementById('blocks-json');
  const sendBtn = document.getElementById('dot-box-send-above');
  const directBtn = document.getElementById('dot-box-direct-submit');
  const topSubmitBtn = document.getElementById('send-btn');
  const getScale = () => {
    const el = document.querySelector('input[name="dot-box-scale"]:checked');
    const v = el ? Number(el.value) : 1;
    return Number.isFinite(v) && v > 0 ? v : 1;
  };
  const getDotType = () => {
    const el = document.querySelector('input[name="dot-box-type"]:checked');
    const v = el ? String(el.value) : 'A';
    return v === 'B' ? 'B' : 'A';
  };

  if (!cBtn) return;

  cBtn.onclick = () => {
    err && (err.textContent = '');
    const k = getScale();
    const parts = k === 1 ? ['top'] : (k === 2 ? ['sideA'] : ['sideB']);
    const t = getDotType();
    const json = makeDotBoxJSON(xI?.value, yI?.value, zI?.value, parts, t);
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
