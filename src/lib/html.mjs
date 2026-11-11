/** 极简模板工具：零依赖、只做字符串拼接与转义。 */

export const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/** 属性拼接（值为 false/null 时跳过） */
export function attrs(obj) {
  return Object.entries(obj)
    .filter(([, v]) => v !== false && v != null && v !== '')
    .map(([k, v]) => (v === true ? ` ${k}` : ` ${k}="${esc(v)}"`))
    .join('');
}

/** 内联线性图标：统一 24×24 / currentColor / stroke-width 1.8，与原型图标规范一致 */
const PATHS = {
  camera: '<path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z"/><circle cx="12" cy="13" r="3.4"/>',
  sparkles: '<path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3Z"/><path d="M18.5 15l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.8Z"/><path d="M5 15l.5 1.3L6.8 17l-1.3.5L5 18.8l-.5-1.3L3.2 17l1.3-.5L5 15Z"/>',
  chart: '<path d="M4 19V5"/><path d="M4 19h16"/><rect x="7" y="12" width="3" height="5" rx="1"/><rect x="12" y="9" width="3" height="8" rx="1"/><rect x="17" y="6" width="3" height="11" rx="1"/>',
  shield: '<path d="M12 3l7 3v5c0 4.3-2.9 7.7-7 9-4.1-1.3-7-4.7-7-9V6l7-3Z"/><path d="M9 12l2 2 4-4"/>',
  database: '<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6"/><path d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/>',
  tag: '<path d="M12 3H4v8l9 9 8-8-9-9Z"/><circle cx="8" cy="8" r="1.3"/>',
  arrow: '<path d="M5 12h14"/><path d="M13 6l6 6-6 6"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4 4"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 7 8.5 6 8.5-6"/>',
  external: '<path d="M14 4h6v6"/><path d="M20 4l-8 8"/><path d="M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6"/>',
  lock: '<rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/>',
  info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5"/><path d="M12 8h.01"/>',
  leaf: '<path d="M5 19c0-8 5-13 14-14 0 9-4 14-11 14H5Z"/><path d="M5 19c3-4 6-6 10-8"/>',
  droplet: '<path d="M12 3s6 6.4 6 10.4A6 6 0 0 1 6 13.4C6 9.4 12 3 12 3Z"/>',
  activity: '<path d="M3 12h4l3-7 4 14 3-7h4"/>',
  book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5Z"/><path d="M8 7h7M8 11h5"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 16 9 5 9-5"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M18 6 6 18M6 6l12 12"/>',
};

export function icon(name, cls = '') {
  const body = PATHS[name];
  if (!body) throw new Error(`未知图标：${name}`);
  return `<svg${attrs({
    class: `ico ${cls}`.trim(),
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': 1.8,
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'aria-hidden': 'true',
  })}>${body}</svg>`;
}

/**
 * 🔴 品牌图标唯一资产：src/assets/img/icon-512.png（真实产品 App 图标）。
 * 源文件 E:/2026新起点/小宝/dbee/D-Bee图标备份/icon-512.png 原样复制；
 * favicon.png / apple-touch-icon.png / icon-192.png 均由它等比缩放派生。
 * 旧版自绘内联 SVG 蜜蜂（bee.svg）已整体下线 —— 官网不得再用自绘图形冒充产品图标。
 */
export const BRAND_ICON_PATH = 'assets/img/icon-512.png';

/** 品牌图标 <img>；alt 默认空（相邻文字已含品牌名，属装饰性重复） */
export function brandIcon(cls = 'bee-logo', size = 96, alt = '') {
  return `<img class="${esc(cls)}" src="${BRAND_ICON_PATH}" width="${size}" height="${size}" alt="${esc(alt)}" decoding="async">`;
}

/** header / footer / 装饰统一使用的品牌图标 */
export const BEE_ICON = brandIcon('bee-logo', 96);

/** 蜂巢纹样：沿用原型 hero 背景（视觉资产） */
export const HONEYCOMB_SVG = `<svg class="honeycomb" viewBox="0 0 560 240" aria-hidden="true"><path d="M90,44 129.8,67 129.8,113 90,136 50.2,113 50.2,67Z" fill="#FBE7C0"/><path d="M170,4 204.6,24 204.6,64 170,84 135.4,64 135.4,24Z" fill="none" stroke="#E7DCC3" stroke-width="2"/><path d="M170,96 204.6,116 204.6,156 170,176 135.4,156 135.4,116Z" fill="none" stroke="#E7DCC3" stroke-width="2"/><path d="M250,44 289.8,67 289.8,113 250,136 210.2,113 210.2,67Z" fill="#FBE7C0"/><path d="M330,4 364.6,24 364.6,64 330,84 295.4,64 295.4,24Z" fill="none" stroke="#E7DCC3" stroke-width="2"/><path d="M330,96 364.6,116 364.6,156 330,176 295.4,156 295.4,116Z" fill="none" stroke="#E7DCC3" stroke-width="2"/><path d="M410,44 449.8,67 449.8,113 410,136 370.2,113 370.2,67Z" fill="#F2A93B" opacity=".5"/><path d="M250,142 284.6,162 284.6,202 250,222 215.4,202 215.4,162Z" fill="none" stroke="#E7DCC3" stroke-width="2"/><path d="M90,142 124.6,162 124.6,202 90,222 55.4,202 55.4,162Z" fill="none" stroke="#E7DCC3" stroke-width="2"/><path d="M410,142 444.6,162 444.6,202 410,222 375.4,202 375.4,162Z" fill="none" stroke="#E7DCC3" stroke-width="2"/><path d="M490,4 524.6,24 524.6,64 490,84 455.4,64 455.4,24Z" fill="none" stroke="#E7DCC3" stroke-width="2"/><path d="M490,96 524.6,116 524.6,156 490,176 455.4,156 455.4,116Z" fill="none" stroke="#E7DCC3" stroke-width="2"/></svg>`;

/** 段落数组 → HTML */
export const paras = (arr) => arr.map((p) => `<p>${p}</p>`).join('\n');
