import { createBoxMesh } from './shapes/box.js';
import { createCylinderMesh } from './shapes/cylinder.js';

// JSONで配置を指定。色は全体デフォルトのみ。
export const DEFAULT_BLOCK_COLOR = 0xffffff;

// JSON で長さ（size）と座標（position）をまとめて定義できます。
// 必要な数だけ配列に追加してください。color は省略可（省略時はパレットから自動）。
export let BLOCKS_JSON = `{
  "box": {
    "sizes": [
      [10,10,20],
      [20, 5,10],
      [10,10,20],
      [10, 5,50]
    ],
    "positions": [
      [17, 5, 10],
      [ 5, 0, 10],
      [27, 0, 10],
      [ 5, 0, 40]
    ]
  },
  "cylinder": {
    "sizes": [
      [10,20]
    ],
    "positions": [
      [27, 5, 10]
    ]
  }
}`;

// BLOCKS_JSON をパースして size/position/color の配列に正規化
export function parseBlocksJSON() {
  try {
    const data = JSON.parse(BLOCKS_JSON);
    const out = [];
    for (const type of ['box', 'cylinder']) {
      const g = data?.[type];
      if (!g) continue;
      const sizes = Array.isArray(g.sizes) ? g.sizes : [];
      const positions = Array.isArray(g.positions) ? g.positions : [];
      const colors = Array.isArray(g.colors) ? g.colors : null;
      const defSize = type === 'cylinder' ? [10, 10] : [10, 10, 10];
      const defPos = [0, 0, 0];
      const n = Math.max(sizes.length, positions.length);
      for (let i = 0; i < n; i++) {
        const size = Array.isArray(sizes[i]) ? sizes[i] : (sizes[0] || defSize);
        const position = Array.isArray(positions[i]) ? positions[i] : (positions[0] || defPos);
        const color = colors && (Number.isFinite(colors[i]) ? colors[i] : (Number.isFinite(colors[0]) ? colors[0] : undefined));
        if (!Array.isArray(size) || !Array.isArray(position)) continue;
        out.push({ type, size, position, color });
      }
    }
    return out.length ? out : null;
  } catch (_) {
    return null;
  }
}

// 最小パレット。指定色が無い場合に循環で割り当て。
export const COLOR_PALETTE = [
  0xC0C0C0, 0x90CAF9, 0xA5D6A7, 0xFFE082, 0xFFAB91, 0xCE93D8
];
export function pickColor(index) {
  const p = COLOR_PALETTE;
  return p.length ? p[index % p.length] : DEFAULT_BLOCK_COLOR;
}

// 外部（UI等）からJSON文字列を差し替えるためのSetter
export function setBlocksJSON(text) {
  if (typeof text === 'string') {
    // 形式チェックは呼び出し側で行う前提。ここではそのまま設定。
    // 万一の余白等はtrimしておく。
    // @ts-ignore
    BLOCKS_JSON = text.trim();
  }
}

export function createBlocks(scene) {
  const items = parseBlocksJSON();
  if (!items) return [];
  return items.map((b, i) => {
    const color = (Number.isFinite(b.color) ? b.color : pickColor(i));
    return b.type === 'cylinder'
      ? createCylinderMesh(scene, b.size, b.position, color)
      : createBoxMesh(scene, b.size, b.position, color);
  });
}

