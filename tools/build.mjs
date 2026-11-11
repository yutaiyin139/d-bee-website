#!/usr/bin/env node
/**
 * 官网静态构建器（零依赖，只用 Node 内置模块）。
 *
 *   node tools/build.mjs
 *
 * 输入：src/data/*（唯一事实源）+ src/pages/*（页面内容）+ src/lib/*（布局与组件）+ src/assets/*
 * 输出：app/ —— 仍是可直接扔进 nginx 的纯静态站点，无运行时依赖、无 CDN。
 *
 * 构建期门禁（失败即 exit 1，不产出半成品）：
 *   1. 页面 id / href 唯一
 *   2. 每页的站内链接目标都存在
 *   3. 每页都含运营主体、-1 备案号、工信部链接，且不含 -2 串号
 *   4. 每页有且仅有一个 h1、有 canonical / description / lang / viewport
 *   5. 每页均引用真实产品图标 icon-512.png（favicon / apple-touch / og:image / logo），
 *      且旧自绘 bee.svg 零残留；产物 img/ 目录先清空再拷
 * 发布前另跑 node tools/check-facts.mjs（内容合规）与 --selftest / --redtest（护栏自检）。
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync, existsSync, copyFileSync, statSync } from 'node:fs';
import { dirname, join, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pathToFileURL } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'src');
const APP = join(ROOT, 'app');
const PAGES_DIR = join(SRC, 'pages');

const { SITE } = await import(pathToFileURL(join(SRC, 'data/site.mjs')).href);
const { layout } = await import(pathToFileURL(join(SRC, 'lib/layout.mjs')).href);

const errors = [];
const fail = (msg) => { errors.push(msg); console.error(`  ❌ ${msg}`); };

console.log('=== D-Bee 官网构建 ===\n');

/* ---------- 1. 载入页面定义 ---------- */
const pageFiles = readdirSync(PAGES_DIR).filter((f) => f.endsWith('.mjs')).sort();
const pages = [];
for (const f of pageFiles) {
  const mod = await import(pathToFileURL(join(PAGES_DIR, f)).href);
  const p = mod.default;
  if (!p || !p.id || !p.href || typeof p.render !== 'function') {
    fail(`${f} 未导出合法的页面定义（需 id / href / render）`);
    continue;
  }
  pages.push(p);
}
console.log(`页面定义：${pages.length} 个（${pageFiles.join(', ')}）`);

const ids = new Set(), hrefs = new Set();
for (const p of pages) {
  if (ids.has(p.id)) fail(`页面 id 重复：${p.id}`);
  if (hrefs.has(p.href)) fail(`页面 href 重复：${p.href}`);
  ids.add(p.id); hrefs.add(p.href);
}

/* ---------- 2. 渲染 ---------- */
mkdirSync(join(APP, 'assets/css'), { recursive: true });
mkdirSync(join(APP, 'assets/js'), { recursive: true });
mkdirSync(join(APP, 'assets/img'), { recursive: true });

// 只清理旧的 .html 与 sitemap/robots，assets 由下面覆盖写入
for (const f of readdirSync(APP)) {
  if (f.endsWith('.html') || f === 'sitemap.xml' || f === 'robots.txt') rmSync(join(APP, f));
}

const outputs = new Map();
for (const p of pages) {
  let html;
  try {
    html = layout(p, p.render(), { withCta: p.withCta !== false });
  } catch (e) {
    fail(`渲染 ${p.href} 抛错：${e.message}`);
    continue;
  }
  outputs.set(p.href, html);
  writeFileSync(join(APP, p.href), html, 'utf8');
}
console.log(`已生成 HTML：${outputs.size} 个`);

/* ---------- 3. 静态资源 ---------- */
// 🔴 先清空产物 img 目录：旧版自绘 bee.svg 等资产必须彻底下线，不能随构建残留
rmSync(join(APP, 'assets/img'), { recursive: true, force: true });
mkdirSync(join(APP, 'assets/img'), { recursive: true });

for (const [from, to] of [
  ['assets/site.css', 'assets/css/site.css'],
  ['assets/site.js', 'assets/js/site.js'],
  ['assets/img/icon-512.png', 'assets/img/icon-512.png'],
  ['assets/img/favicon.png', 'assets/img/favicon.png'],
  ['assets/img/apple-touch-icon.png', 'assets/img/apple-touch-icon.png'],
  ['assets/img/icon-192.png', 'assets/img/icon-192.png'],
]) {
  const src = join(SRC, from), dst = join(APP, to);
  if (!existsSync(src)) { fail(`缺少资源：src/${from}`); continue; }
  copyFileSync(src, dst);
  console.log(`资源 ${to}  ${statSync(dst).size} B`);
}

/* ---------- 4. sitemap / robots ---------- */
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.filter((p) => !p.noindex).map((p) => `  <url><loc>${SITE.domain}/${p.id === 'home' ? '' : p.href}</loc><lastmod>${SITE.buildDate}</lastmod><changefreq>weekly</changefreq><priority>${p.id === 'home' ? '1.0' : '0.7'}</priority></url>`).join('\n')}
</urlset>
`;
writeFileSync(join(APP, 'sitemap.xml'), sitemap, 'utf8');
writeFileSync(join(APP, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SITE.domain}/sitemap.xml\n`, 'utf8');
console.log('已生成 sitemap.xml / robots.txt');

/* ---------- 5. 构建期门禁 ---------- */
console.log('\n=== 构建期门禁 ===');
const allHrefs = new Set(hrefs);
for (const [name, html] of outputs) {
  // 5.1 合规骨架
  if (!html.includes(SITE.subject)) fail(`${name} 缺运营主体全称`);
  if (!html.includes(SITE.icp)) fail(`${name} 缺 -1 备案号`);
  if (!html.includes(SITE.icpQuery)) fail(`${name} 缺工信部查询链接`);
  if (html.includes('京ICP备2026075565号-2')) fail(`${name} 出现 -2 串号`);

  // 5.2 基础 SEO / 无障碍
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) fail(`${name} 有 ${h1} 个 h1（应为 1）`);
  for (const needle of ['rel="canonical"', 'name="description"', 'lang="zh-CN"', 'name="viewport"', 'class="skip-link"']) {
    if (!html.includes(needle)) fail(`${name} 缺 ${needle}`);
  }

  // 5.2.1 品牌图标：全站唯一资产 icon-512.png，旧自绘 bee.svg 零残留
  for (const needle of [
    'href="assets/img/favicon.png"',
    'href="assets/img/apple-touch-icon.png"',
    'property="og:image"',
    'src="assets/img/icon-512.png"',
  ]) {
    if (!html.includes(needle)) fail(`${name} 缺真实产品图标引用：${needle}`);
  }
  if (/bee\.svg|<svg[^>]+class="bee-logo"/.test(html)) fail(`${name} 残留旧自绘蜜蜂图标`);

  // 5.3 站内链接完整性
  for (const m of html.matchAll(/href="([^"]+)"/g)) {
    const href = m[1];
    if (/^(https?:|mailto:|data:|#)/.test(href)) continue;
    const target = href.split('#')[0];
    if (!target) continue;
    if (target.endsWith('.html')) {
      if (!allHrefs.has(target)) fail(`${name} 指向不存在的页面：${target}`);
    } else if (!existsSync(join(APP, target))) {
      fail(`${name} 指向不存在的资源：${target}`);
    }
  }
}
console.log(`检查 ${outputs.size} 个页面：${errors.length === 0 ? '全绿 ✅' : `${errors.length} 项失败 ❌`}`);

if (errors.length) {
  console.error('\n🔴 构建失败：请修正后重跑，本次不视为可发布产物。');
  process.exit(1);
}

const totalBytes = [...outputs.values()].reduce((n, s) => n + Buffer.byteLength(s), 0);
console.log(`\n产物目录：${APP}`);
console.log(`HTML 合计：${(totalBytes / 1024).toFixed(1)} KB / ${outputs.size} 页`);
console.log('下一步：node tools/check-facts.mjs（内容合规）→ 本地预览 → 部署。');
