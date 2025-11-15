import { THREE } from './environment.js';

// ===== ここだけ編集すれば複数ブロックを指定できます =====
// 配置情報は BLOCKS_JSON にて JSON で指定します（従来の配列は廃止）。
// 全体のデフォルト色（個別に指定しなければこれが使われます）
export const DEFAULT_BLOCK_COLOR = 0xffffff;
// ======================================================

// JSON で長さ（size）と座標（position）をまとめて定義できます。
// 必要な数だけ配列に追加してください。color は省略可（省略時はパレットから自動）。
export let BLOCKS_JSON = `{
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
}`;

function createCubeMesh(
  scene,
  size = [10, 10, 10],
  position = [0, 0, 0], // JSON 未使用時の最小デフォルト
  color = DEFAULT_BLOCK_COLOR
) {
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

// BLOCKS_JSON をパースして size/position/color の配列に正規化
export function parseBlocksJSON() {
  try {
    const data = JSON.parse(BLOCKS_JSON);

    // 1) 推奨: sizes / positions / blocks 参照型
    if (Array.isArray(data?.blocks)) {
      const sizes = Array.isArray(data?.sizes) ? data.sizes : null;
      const positions = Array.isArray(data?.positions) ? data.positions : null;
      const out = [];
      for (let i = 0; i < data.blocks.length; i++) {
        const b = data.blocks[i];
        let size = Array.isArray(b?.size) ? b.size : null;
        if (!size && sizes && Number.isInteger(b?.sizeIndex)) size = sizes[b.sizeIndex] || sizes[0];
        if (!size && sizes && Number.isInteger(b?.s)) size = sizes[b.s] || sizes[0];
        let position = Array.isArray(b?.position) ? b.position : null;
        if (!position && positions && Number.isInteger(b?.positionIndex)) position = positions[b.positionIndex] || positions[0];
        if (!position && positions && Number.isInteger(b?.p)) position = positions[b.p] || positions[0];
        if (!Array.isArray(size) || !Array.isArray(position)) continue;
        out.push({ size, position, color: b?.color });
      }
      if (out.length) return out;
    }

    // 2) sizes と positions のみ（blocks 省略時）
    if (Array.isArray(data?.sizes) || Array.isArray(data?.positions)) {
      const sizes = Array.isArray(data?.sizes) ? data.sizes : [];
      const positions = Array.isArray(data?.positions) ? data.positions : [];
      const n = Math.max(sizes.length, positions.length);
      const out = [];
      for (let i = 0; i < n; i++) {
        const size = sizes[i] || sizes[0] || [10, 10, 10];
        const position = positions[i] || positions[0] || [0, 0, 0];
        out.push({ size, position });
      }
      if (out.length) return out;
    }

    // 3) 後方互換: blocks[] に size/position を直接記述
    const arr = Array.isArray(data) ? data : data?.blocks;
    if (Array.isArray(arr)) {
      const normalized = [];
      for (const item of arr) {
        const size = Array.isArray(item?.size) ? item.size : null;
        const pos = Array.isArray(item?.position) ? item.position : null;
        const color = item?.color;
        if (!size || !pos) continue;
        normalized.push({ size, position: pos, color });
      }
      return normalized.length ? normalized : null;
    }

    return null;
  } catch (_) {
    return null;
  }
}

export const COLOR_PALETTE = [
  0xD1CED7, 0xDBC0C7, 0xC57A8A, 0xB6574B, 0xC89D65,
  0xFFF4BB, 0xFFCEA2, 0xFFD1B2, 0xE5D07D, 0xB8CC80,
  0x8BBF6F, 0xA3D9B1, 0x82BACB, 0x6BA4CF, 0x8DA5BE,
  0x9099A4, 0x889E7F, 0xF2B6A0, 0xD7C3A7, 0xB3CBB9
];
function pickColorFromPalette(index, size, position) {
  const arr = [index,
    Math.floor(size?.[0] ?? 0), Math.floor(size?.[1] ?? 0), Math.floor(size?.[2] ?? 0),
    Math.floor(position?.[0] ?? 0), Math.floor(position?.[1] ?? 0), Math.floor(position?.[2] ?? 0),
  ];
  let h = 2166136261 >>> 0;
  for (const n of arr) {
    h ^= (n & 0xff) >>> 0;
    h = Math.imul(h, 16777619) >>> 0;
  }
  const palette = COLOR_PALETTE.length > 0 ? COLOR_PALETTE : [DEFAULT_BLOCK_COLOR];
  return palette[h % palette.length] ?? DEFAULT_BLOCK_COLOR;
}

// 外部（UI等）からJSON文字列を差し替えるためのSetter
export function setBlocksJSON(text) {
  if (typeof text === 'string') {
    // 形式チェックは呼び出し側で行う前提。ここではそのまま設定。
    // 万一の余白等はtrimしておく。
    // パースは parseBlocksJSON() 側で実施。
    // eslint等未導入のためシンプルに代入のみ。
    // @ts-ignore
    BLOCKS_JSON = text.trim();
  }
}

// indexでどのデフォルトキューブサイズか指定できるように
export function createCube(
  scene,
  sx = 10,
  sy = 10,
  sz = 10,
  position = [0, 0, 0], // JSON未使用のときの最小デフォルト
  color = DEFAULT_BLOCK_COLOR
) {
  // 引数が scene のみの場合は、上部配列定義に基づき複数作成
  if (arguments.length === 1) {
    // 1) JSON があれば JSON を優先
    const jsonBlocks = parseBlocksJSON();
    if (jsonBlocks) {
      const meshes = jsonBlocks.map((b, i) =>
        createCubeMesh(
          scene,
          b.size,
          b.position,
          b.color ?? pickColorFromPalette(i, b.size, b.position)
        )
      );
      return meshes[0] || null;
    }
    // 2) 従来の配列
    return null;
  }
  // 通常の単体生成
  return createCubeMesh(scene, [sx, sy, sz], position, color);
}

// blocks = 配列。各オブジェクトでindex: どのデフォルトサイズを使うか、もしくは独自サイズ指定
export function createBlocks(scene, blocks = []) {
  // blocks 未指定または空なら、JSON（BLOCKS_JSON）から一括生成
  if (!Array.isArray(blocks) || blocks.length === 0) {
    const jsonBlocks = parseBlocksJSON();
    if (!jsonBlocks) return [];
    return jsonBlocks.map((b, i) =>
      createCubeMesh(
        scene,
        b.size,
        b.position,
        b.color ?? pickColorFromPalette(i, b.size, b.position)
      )
    );
  }
  // blocks 指定時は各要素に従って生成（JSONを使わず引数優先）
  return blocks.map((b, idx) => {
    const finalSize = Array.isArray(b?.size)
      ? b.size
      : [b?.sizeX ?? 10, b?.sizeY ?? 10, b?.sizeZ ?? 10];
    const position = Array.isArray(b?.position) ? b.position : [0, 0, 0];
    const color = b?.color ?? pickColorFromPalette(idx, finalSize, position);
    return createCubeMesh(scene, finalSize, position, color);
  });
}

export const createBlock = createCube;
// opts.sizes などで複数キューブも作れるように
export const createBlocksGrid = (scene, opts = {}) => {
  // opts から blocks 配列を合成。未指定は JSON を使用
  if (Array.isArray(opts.sizes)) {
    const sizes = opts.sizes;
    const origins = Array.isArray(opts.origin) ? opts.origin : [];
    return sizes.map((size, i) =>
      createCubeMesh(
        scene,
        size,
        origins[i] || [0, 0, 0],
        (Array.isArray(opts.color) ? opts.color[i] : opts.color)
          ?? pickColorFromPalette(i, size, origins[i] || [0, 0, 0])
      )
    );
  }
  return createBlocks(scene);
};
export const createBlocksByCount = createBlocksGrid;
