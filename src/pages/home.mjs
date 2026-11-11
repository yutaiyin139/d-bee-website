import { SITE, PLATFORMS } from '../data/site.mjs';
import { HOME_FAQ_KEYS, FAQ_GROUPS, PRINCIPLES } from '../data/content.mjs';
import { esc, icon } from '../lib/html.mjs';
import { sectionHead, btn, homeVisual, stepsGrid, promisesGrid, planCards, saleNotice, platformTable, homeFaq } from '../lib/components.mjs';

const pairs = HOME_FAQ_KEYS.map(([gid, idx]) => {
  const g = FAQ_GROUPS.find((x) => x.id === gid);
  return [g.items[idx].q, g.items[idx].a];
});

const HIGHLIGHTS = [
  { icon: 'camera', title: '拍照识别', text: '拍下这一餐，AI 辅助填好菜名、份量与热量，可随时手动修改。' },
  { icon: 'layers', title: '怎么记都行', text: '扫条码、写一句话、直接手动录入，都不消耗拍照次数。' },
  { icon: 'chart', title: '看得见趋势', text: '饮食、饮水、体重与运动汇成图表，饮食报告看近 7 天。' },
  { icon: 'sparkles', title: '问问小蜜', text: 'AI 问答不限次数，回答带「AI 生成」标识，仅供参考。' },
  { icon: 'droplet', title: '不止于吃', text: '饮水、体重、运动一起记，把日常放在同一条时间线上。' },
  { icon: 'shield', title: '永久无广告', text: '不接广告 SDK，无隐藏扣费，基础记录功能永久免费。' },
];

export default {
  id: 'home',
  href: 'index.html',
  title: '首页',
  description: SITE.description,
  cta: {
    kicker: '今天就可以开始',
    title: '打开 Web 版，记录今天的第一餐',
    text: '浏览器直接可用，无需安装。基础记录功能永久免费，永久无广告。',
    secondary: { label: '先看产品功能', href: 'features.html' },
  },
  render: () => `
<section class="hero">
  ${'' /* 蜂巢背景由 CSS 绘制，避免每页重复 SVG */}
  <div class="hero-bg" aria-hidden="true"></div>
  <div class="wrap hero-grid">
    <div class="hero-copy">
      <span class="hero-badge reveal"><span class="dot" aria-hidden="true"></span>Web 版已上线 · 移动端内测中</span>
      <h1 class="reveal" data-delay="1">让每一口<br><em>都吃得明白</em></h1>
      <p class="hero-sub reveal" data-delay="2">${esc(SITE.heroLead)}<br>自律蜜蜂（D-Bee）用 AI 辅助记录饮食、饮水、体重与运动，把模糊的「大概吃了点什么」变成看得见的趋势。</p>
      <div class="hero-ctas reveal" data-delay="3">
        ${btn({ label: '打开 Web 版', href: SITE.productUrl, external: true, size: 'lg' })}
        ${btn({ label: '了解产品功能', href: 'features.html', variant: 'ghost', size: 'lg' })}
      </div>
      <ul class="hero-points reveal" data-delay="4">
        <li>${icon('check')}基础记录功能永久免费</li>
        <li>${icon('check')}永久无广告</li>
        <li>${icon('check')}无需安装，浏览器直接用</li>
      </ul>
    </div>
    ${homeVisual()}
  </div>
</section>

<section class="section section-tight">
  <div class="wrap">
    ${sectionHead({ kicker: '三步，一餐就记完了', title: '记录这件事，本该很轻', desc: '没有复杂的表单，也不要求你把每一样都称一遍。' })}
    ${stepsGrid()}
  </div>
</section>

<section class="section section-alt">
  <div class="wrap">
    ${sectionHead({ kicker: '产品能力', title: '你需要的功能，都在一条记录里', desc: '以下均为产品内公示的能力，完整清单见「产品功能」。' })}
    <div class="feature-grid">${HIGHLIGHTS.map((h, i) => `<article class="feature-card reveal"${i < 3 ? ` data-delay="${i % 3}"` : ''}>
      <span class="feature-ico">${icon(h.icon)}</span><h3>${esc(h.title)}</h3><p>${esc(h.text)}</p>
    </article>`).join('')}</div>
    <div class="section-more"><a class="text-link" href="features.html">查看免费版与 Pro 的完整权益 ${icon('arrow', 'ico-sm')}</a></div>
  </div>
</section>

${promisesGrid()}

<section class="section">
  <div class="wrap">
    ${sectionHead({ kicker: '为什么这样做', title: '把边界写在前面', center: true })}
    <div class="principle-grid">${PRINCIPLES.map((p, i) => `<article class="principle-card reveal" data-delay="${i}">
      <span class="principle-n">${esc(p.n)}</span><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p>
    </article>`).join('')}</div>
  </div>
</section>

<section class="section section-alt" id="pricing-preview">
  <div class="wrap">
    ${sectionHead({ kicker: '明码标价', title: '价格先说清，买不买以后再说', desc: '本页价格为统一定价，对所有用户一致，不因人定价。当前收款通道未开通，只做公示。' })}
    ${saleNotice()}
    ${planCards({ compact: true })}
    <p class="section-note">会员计费方式因购买渠道而异，以产品内购买页与用户协议「六、订阅与自动续费说明」为准。蜜糖积分可兑 Pro 天数（100 分兑 1 天、2600 分兑 30 天），在「蜜糖积分」页兑换。<a href="pricing.html">查看完整定价说明 →</a></p>
  </div>
</section>

<section class="section">
  <div class="wrap">
    ${sectionHead({ kicker: '现在在哪里能用', title: '四端状态，如实公示', desc: 'Web 版是当下唯一的正式可用入口；其余端内测中，敬请期待。' })}
    ${platformTable()}
    <div class="section-more"><a class="text-link" href="get.html">查看获取方式与内测说明 ${icon('arrow', 'ico-sm')}</a></div>
  </div>
</section>

<section class="section section-alt" id="faq">
  <div class="wrap faq-home-layout">
    <div>${sectionHead({ kicker: '常见问题', title: '先看这几个', desc: '更完整的问题清单在帮助中心。' })}
      <a class="text-link" href="help.html">前往帮助中心 ${icon('arrow', 'ico-sm')}</a>
    </div>
    ${homeFaq(pairs)}
  </div>
</section>`,
};
