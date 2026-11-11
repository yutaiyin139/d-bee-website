import { SITE } from '../data/site.mjs';
import { esc, icon, BEE_ICON } from '../lib/html.mjs';
import { btn } from '../lib/components.mjs';

export default {
  id: 'notfound',
  href: '404.html',
  title: '页面未找到',
  noindex: true,
  description: '这个页面不存在。返回自律蜜蜂官网首页，或打开 Web 版开始记录。',
  withCta: false,
  render: () => `
<section class="nf-wrap">
  <div class="wrap nf-inner">
    <div class="nf-bee" aria-hidden="true">${BEE_ICON}</div>
    <span class="kicker">404</span>
    <h1>这一页没找到</h1>
    <p>链接可能换了位置，或者还没写出来。回到首页，或者直接打开 Web 版开始记录。</p>
    <div class="nf-actions">
      ${btn({ label: '回到官网首页', href: 'index.html', size: 'lg' })}
      ${btn({ label: '打开 Web 版', href: SITE.productUrl, external: true, variant: 'ghost', size: 'lg' })}
    </div>
    <div class="nf-links">
      <a href="features.html">产品功能</a><a href="pricing.html">定价与会员</a><a href="help.html">帮助中心</a><a href="legal.html">法务与协议</a>
    </div>
  </div>
</section>`,
};
