/**
 * 全站共享布局。所有页面由这里统一产出 head / SEO / 导航 / 页脚 / 合规骨架，
 * 消除原型「9 页各复制一份 header/footer」的问题。
 */
import { SITE, NAV, FOOTER_GROUPS } from '../data/site.mjs';
import { esc, attrs, icon, BEE_SVG, HONEYCOMB_SVG } from './html.mjs';

const YEAR = new Date().getFullYear();

function head(page) {
  const url = `${SITE.domain}/${page.id === 'home' ? '' : page.href}`;
  const title = page.id === 'home'
    ? `${SITE.brand} ${SITE.brandEn} 官网 — AI 拍照识别饮食热量，让每一口都吃得明白`
    : `${page.title} — ${SITE.brand} ${SITE.brandEn}`;
  const desc = page.description || SITE.description;
  const noindex = page.noindex ? '  <meta name="robots" content="noindex, nofollow">\n' : '';
  const jsonLd = [organizationLd(), ...(page.jsonLd ? page.jsonLd(url) : [])];

  return `<!doctype html>
<html lang="${SITE.lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}">
  <meta name="theme-color" content="${SITE.themeColor}">
  <link rel="canonical" href="${esc(url)}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${esc(SITE.brand + ' ' + SITE.brandEn)}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:url" content="${esc(url)}">
  <meta property="og:locale" content="zh_CN">
  <meta name="twitter:card" content="summary">
${noindex}  <link rel="icon" type="image/svg+xml" href="assets/img/bee.svg">
  <script>document.documentElement.classList.add('has-js')</script>
  <link rel="stylesheet" href="assets/css/site.css">
${jsonLd.map((o) => `  <script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`).join('\n')}
</head>`;
}

function organizationLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.subject,
    url: SITE.domain,
    email: SITE.email,
    brand: { '@type': 'Brand', name: SITE.brand },
  };
}

export const faqLd = (pairs) => () => [{
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: pairs.map(([q, a]) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
}];

export const breadcrumbLd = (page) => (url) => [{
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: '首页', item: SITE.domain + '/' },
    { '@type': 'ListItem', position: 2, name: page.title, item: url },
  ],
}];

function navLinks(page, mobile = false) {
  return NAV.map((n) =>
    `<a${attrs({
      href: n.href,
      'data-nav': n.id,
      'aria-current': page.id === n.id ? 'page' : false,
    })}>${esc(n.label)}${mobile ? ` <span aria-hidden="true">→</span>` : ''}</a>`,
  ).join('');
}

function header(page) {
  return `<header class="site-header" id="siteHeader">
  <div class="wrap header-inner">
    <a class="brand" href="index.html" aria-label="${esc(SITE.brand)}首页">${BEE_SVG}<span>${esc(SITE.brand)}<small>D-BEE</small></span></a>
    <nav class="nav" aria-label="主导航">${navLinks(page)}</nav>
    <div class="header-actions">
      <a class="btn btn-primary btn-sm" href="${SITE.productUrl}" target="_blank" rel="noopener noreferrer">打开 Web 版 ${icon('external', 'ico-sm')}</a>
      <button class="menu-btn" id="menuBtn" type="button" aria-label="打开菜单" aria-controls="mobileMenu" aria-expanded="false">${icon('menu')}</button>
    </div>
  </div>
</header>
<div class="mobile-menu" id="mobileMenu" role="dialog" aria-modal="true" aria-label="站点导航" aria-hidden="true">
  <div class="wrap mobile-menu-top">
    <a class="brand" href="index.html" tabindex="-1">${BEE_SVG}<span>${esc(SITE.brand)}<small>D-BEE</small></span></a>
    <button class="menu-btn" id="menuClose" type="button" aria-label="关闭菜单">${icon('close')}</button>
  </div>
  <nav class="mobile-nav" aria-label="移动端导航">${navLinks(page, true)}</nav>
  <div class="mobile-menu-foot">
    <a class="btn btn-primary btn-lg" href="${SITE.productUrl}" target="_blank" rel="noopener noreferrer" tabindex="-1">打开 Web 版 →</a>
    <p>Web 版已上线 · 移动端内测中</p>
  </div>
</div>`;
}

function footerGroups() {
  return FOOTER_GROUPS.map((g) => `<div class="footer-col">
      <h3>${esc(g.title)}</h3>
      <ul>${g.links.map((l) => `<li><a${attrs({ href: l.href, target: l.external ? '_blank' : false, rel: l.external ? 'noopener noreferrer' : false })}>${esc(l.label)}${l.external ? icon('external', 'ico-xs') : ''}</a></li>`).join('')}</ul>
    </div>`).join('\n    ');
}

function footer() {
  // 公安备案未下证前不渲染任何编号，只保留办理说明，避免展示假号
  const police = SITE.policeBeian
    ? `<a href="${SITE.policeQuery}" target="_blank" rel="noopener noreferrer">${esc(SITE.policeBeian)}</a> · `
    : '';
  return `<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div class="footer-brand">
        <a class="brand" href="index.html" aria-label="${esc(SITE.brand)}首页">${BEE_SVG}<span>${esc(SITE.brand)}<small>D-BEE</small></span></a>
        <p>AI 拍照识别饮食热量的记录工具。<br>记录每一餐，看见趋势，慢慢调整。</p>
        <p class="footer-note">营养与热量数据为参考估算值，不构成医疗或营养建议。</p>
      </div>
      ${footerGroups()}
    </div>
    <div class="footer-bottom">
      <p>© ${YEAR} ${esc(SITE.subject)} · 保留所有权利</p>
      <p class="footer-compliance">
        <a href="${SITE.icpQuery}" target="_blank" rel="noopener noreferrer">${esc(SITE.icp)}</a>
        <span aria-hidden="true">·</span> ${police}${esc(SITE.domain.replace('https://', ''))}
        <span aria-hidden="true">·</span> <a href="legal.html">法务与协议</a>
      </p>
    </div>
  </div>
</footer>`;
}

/** 全站统一 CTA 带 */
export function ctaBand({
  kicker = '现在就可以开始',
  title = '打开 Web 版，记录今天的第一餐',
  text = '浏览器直接可用，无需安装。基础记录功能永久免费，永久无广告。',
  primary = { label: '打开 Web 版', href: SITE.productUrl, external: true },
  secondary = null,
} = {}) {
  const link = (o, cls) => `<a${attrs({
    class: cls,
    href: o.href,
    target: o.external ? '_blank' : false,
    rel: o.external ? 'noopener noreferrer' : false,
  })}>${esc(o.label)} ${icon(o.external ? 'external' : 'arrow', 'ico-sm')}</a>`;
  return `<section class="cta-band-wrap"><div class="wrap">
    <div class="cta-band reveal">
      <span class="kicker kicker-light">${esc(kicker)}</span>
      <h2>${esc(title)}</h2>
      <p>${esc(text)}</p>
      <div class="cta-actions">${link(primary, 'btn btn-light btn-lg')}${secondary ? link(secondary, 'btn btn-outline-light btn-lg') : ''}</div>
      <span class="cta-honey" aria-hidden="true">${HONEYCOMB_SVG}</span>
    </div>
  </div></section>`;
}

/** 页面统一外壳 */
export function layout(page, body, { withCta = true } = {}) {
  return `${head(page)}
<body data-page="${esc(page.id)}">
<a class="skip-link" href="#main">跳到主要内容</a>
${header(page)}
<main id="main">
${body}
${withCta ? ctaBand(page.cta) : ''}
</main>
${footer()}
<div class="toast" id="toast" role="status" aria-live="polite"></div>
<script src="assets/js/site.js" defer></script>
</body>
</html>
`;
}

/** 子页统一页头（面包屑 + 标题 + 导语） */
export function pageHero({ kicker, title, desc, crumb }) {
  return `<section class="page-hero">
  ${HONEYCOMB_SVG}
  <div class="wrap">
    <nav class="crumb" aria-label="面包屑"><a href="index.html">首页</a><span aria-hidden="true">/</span><span aria-current="page">${esc(crumb)}</span></nav>
    ${kicker ? `<span class="kicker">${esc(kicker)}</span>` : ''}
    <h1>${title}</h1>
    ${desc ? `<p class="page-hero-desc">${desc}</p>` : ''}
  </div>
</section>`;
}
