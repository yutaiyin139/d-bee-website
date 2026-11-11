/** 可复用 UI 组件。所有组件只吃 src/data/* 的数据，不自带事实。 */
import { SITE, PLANS, FREE_ITEMS, PRO_ITEMS, QUOTA_RULES, STEPS, PROMISES, AI_FACTS, QUALIFICATIONS, PLATFORMS, LEGAL_DOCS, SALE_NOTICE } from '../data/site.mjs';
import { esc, attrs, icon, BEE_SVG } from './html.mjs';

export function sectionHead({ kicker, title, desc, center = false, light = false }) {
  return `<div class="sec-head${center ? ' sec-head-center' : ''}${light ? ' sec-head-light' : ''}">
    ${kicker ? `<span class="kicker${light ? ' kicker-light' : ''}">${esc(kicker)}</span>` : ''}
    <h2>${title}</h2>
    ${desc ? `<p class="sec-desc">${desc}</p>` : ''}
  </div>`;
}

export function btn({ label, href, variant = 'primary', size = '', external = false, iconName = 'arrow', extra = '' }) {
  return `<a${attrs({
    class: `btn btn-${variant} ${size ? 'btn-' + size : ''} ${extra}`.trim(),
    href,
    target: external ? '_blank' : false,
    rel: external ? 'noopener noreferrer' : false,
  })}>${esc(label)} ${icon(external ? 'external' : iconName, 'ico-sm')}</a>`;
}

export const statusBadge = (state, label) =>
  `<span class="status status-${esc(state)}"><span class="status-dot" aria-hidden="true"></span>${esc(label)}</span>`;

export function notice({ title, text, tone = 'amber', iconName = 'info' }) {
  return `<div class="notice notice-${esc(tone)}" role="note">
    <span class="notice-icon">${icon(iconName)}</span>
    <div><strong>${esc(title)}</strong><p>${esc(text)}</p></div>
  </div>`;
}

export const saleNotice = () => notice({
  title: SALE_NOTICE.title,
  text: SALE_NOTICE.text,
  tone: 'amber',
  iconName: 'info',
});

/** 首页视觉：用 HTML/CSS 绘制的产品界面示意（非截图），明确标注「界面示意」 */
export function homeVisual() {
  return `<div class="hero-visual reveal" data-delay="2">
    <span class="float-hex float-hex--1" aria-hidden="true">${BEE_SVG}</span>
    <span class="float-hex float-hex--2" aria-hidden="true">${BEE_SVG}</span>
    <div class="app-card" role="img" aria-label="产品界面示意：今日饮食记录，含热量进度与三餐条目，AI 识别条目带 AI 生成标识">
      <div class="app-card-top">
        <div><span class="app-eyebrow">今日 · 周三</span><strong>饮食记录</strong></div>
        <span class="app-avatar" aria-hidden="true">${BEE_SVG}</span>
      </div>
      <div class="app-energy">
        <div class="energy-ring"><span>1,240<small>/ 1,800 kcal</small></span></div>
        <div class="energy-meta">
          <span class="app-eyebrow">参考摄入</span>
          <p>还可摄入约 <b>560</b> kcal</p>
          <div class="macro-bar"><i style="width:62%"></i><i style="width:24%"></i><i style="width:14%"></i></div>
          <small>碳水 · 蛋白质 · 脂肪</small>
        </div>
      </div>
      <div class="app-meals">
        <div class="app-meal"><span class="meal-ico">${icon('leaf')}</span><div><b>早餐</b><small>燕麦牛奶 · 鸡蛋</small></div><span class="meal-kcal">320</span></div>
        <div class="app-meal"><span class="meal-ico">${icon('activity')}</span><div><b>午餐</b><small>鸡胸肉 · 米饭 · 青菜 <em class="ai-tag">AI 生成</em></small></div><span class="meal-kcal">560</span></div>
        <div class="app-meal"><span class="meal-ico">${icon('droplet')}</span><div><b>饮水</b><small>1,200 / 1,800 ml</small></div><span class="meal-kcal">67%</span></div>
      </div>
      <div class="app-tabs" aria-hidden="true"><span class="is-on">记录</span><span>报告</span><span>蜜糖</span><span>我的</span></div>
    </div>
    <p class="visual-caption">界面示意 · 数据为演示值，实际以 Web 版为准</p>
  </div>`;
}

/** 三步流程 */
export function stepsGrid() {
  return `<div class="steps-grid">${STEPS.map((s) => `<article class="step-card reveal">
    <div class="step-top"><span class="step-n">${esc(s.n)}</span><span class="step-ico">${icon(s.icon)}</span></div>
    <h3>${esc(s.title)}</h3><p>${esc(s.text)}</p>
  </article>`).join('')}</div>`;
}

/** 承诺四宫格（深色反差块） */
export function promisesGrid() {
  return `<section class="trust-wrap"><div class="wrap">
    ${sectionHead({ kicker: '我们把边界写在前面', title: '不打扰，也不含糊', desc: '这些不是宣传语，是产品里已经落地的规则。', light: true, center: true })}
    <div class="promise-grid">${PROMISES.map((p) => `<article class="promise-card reveal">
      <span class="promise-ico">${icon(p.icon)}</span><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p>
    </article>`).join('')}</div>
    <p class="trust-foot">AI 生成内容均带显式标识；热量与营养数值为参考估算值，不构成医疗或营养建议。</p>
  </div></section>`;
}

/** 免费 / Pro 权益对比 */
export function benefitsGrid() {
  const list = (items, cls) => `<ul class="benefit-list ${cls}">${items.map((t) => `<li>${icon('check')}<span>${esc(t)}</span></li>`).join('')}</ul>`;
  return `<div class="benefit-grid">
    <article class="benefit-col reveal">
      <div class="benefit-head"><span class="kicker">FREE</span><h3>免费版</h3><p>长期可用，不用付费也能完整记录</p></div>
      ${list(FREE_ITEMS, '')}
      <a class="text-link" href="features.html">查看全部功能 ${icon('arrow', 'ico-sm')}</a>
    </article>
    <article class="benefit-col benefit-col-pro reveal" data-delay="1">
      <div class="benefit-head"><span class="kicker">PRO / 终身</span><h3>Pro 权益</h3><p>更少的限制，更长的回顾周期</p></div>
      ${list(PRO_ITEMS, 'benefit-list-pro')}
      <a class="text-link" href="pricing.html">查看定价公示 ${icon('arrow', 'ico-sm')}</a>
    </article>
  </div>`;
}

/** 三档定价卡（不可购买：用 div 而非 button/a，明确 aria-disabled） */
export function planCards({ compact = false } = {}) {
  return `<div class="plan-grid${compact ? ' plan-grid-compact' : ''}">${PLANS.map((p) => `<article class="plan-card${p.badge === '最划算' ? ' plan-card-featured' : ''}" data-plan-id="${esc(p.id)}" aria-disabled="true">
    ${p.badge ? `<span class="plan-badge">${esc(p.badge)}</span>` : ''}
    <h3>${esc(p.name)}</h3>
    <div class="plan-price"><span>${esc(p.price)}</span><small>/ ${esc(p.period)}</small></div>
    <p class="plan-note">${esc(p.note)}</p>
    ${!compact ? `<ul class="plan-features">${PRO_ITEMS.slice(0, 4).map((t) => `<li>${icon('check')}<span>${esc(t)}</span></li>`).join('')}</ul>` : ''}
    <div class="plan-state">暂不售卖</div>
  </article>`).join('')}</div>`;
}

/** 计次口径表 */
export function quotaTable() {
  return `<div class="rule-table"><div class="rule-head"><span>规则</span><span>说明</span></div>
    ${QUOTA_RULES.map((r) => `<div class="rule-row"><b>${esc(r.label)}</b><p>${esc(r.text)}</p></div>`).join('')}
  </div>`;
}

/** 四端状态表 */
export function platformTable({ detailed = false } = {}) {
  return `<div class="platform-list">${PLATFORMS.map((p) => `<article class="platform-row">
    <div class="platform-main"><h3>${esc(p.name)}</h3><span class="platform-target">${esc(p.target)}</span></div>
    <div class="platform-status">${statusBadge(p.state, p.stateLabel)}</div>
    <p class="platform-note">${esc(p.note)}</p>
    <div class="platform-action">${p.action
      ? `<a class="btn btn-primary btn-sm" href="${esc(p.href)}" target="_blank" rel="noopener noreferrer">${esc(p.action)} ${icon('external', 'ico-sm')}</a>`
      : `<span class="platform-wait">敬请期待</span>`}</div>
  </article>`).join('')}</div>${detailed ? `<p class="table-foot">「内测中」包含体验版、真机调试与内部测试阶段，均不等于正式上架。具体进展见 <a href="roadmap.html">上线进展</a>。</p>` : ''}`;
}

/** FAQ（分类 tab + 搜索 + 手风琴），由 site.js 驱动 */
export function faqSection(groups, { searchable = true, limit = null } = {}) {
  const items = groups.flatMap((g) =>
    (limit ? g.items.slice(0, limit) : g.items).map((it, i) => ({ ...it, group: g.id, groupLabel: g.label, key: `${g.id}-${i}` })),
  );
  const tabs = searchable
    ? `<div class="faq-tabs" role="tablist" aria-label="问题分类">
        <button type="button" role="tab" class="faq-tab is-on" aria-selected="true" data-faq-group="all">全部</button>
        ${groups.map((g) => `<button type="button" role="tab" class="faq-tab" aria-selected="false" data-faq-group="${esc(g.id)}">${esc(g.label)}</button>`).join('')}
       </div>`
    : '';
  const search = searchable
    ? `<div class="faq-search">${icon('search')}<input type="search" id="faqSearch" placeholder="搜索问题，例如：额度、自动续费、数据" aria-label="搜索帮助问题" autocomplete="off"></div>`
    : '';
  return `<div class="faq-wrap" data-faq>
    ${tabs}${search}
    <div class="faq-list">${items.map((it) => `<details class="faq-item" data-group="${esc(it.group)}" data-question="${esc(it.q)} ${esc(it.a)}" name="faq">
      <summary><span class="faq-q-text">${esc(it.q)}</span><span class="faq-pm" aria-hidden="true">${icon('plus')}</span></summary>
      <div class="faq-a"><p>${esc(it.a)}</p></div>
    </details>`).join('')}</div>
    <p class="faq-empty" id="faqEmpty" hidden>没有找到相关问题，换个关键词试试，或<a href="about.html#contact">联系我们</a>。</p>
  </div>`;
}

/** 资质状态清单 */
export function qualificationList() {
  return `<div class="qual-list">${QUALIFICATIONS.map((q) => `<div class="qual-row">
    <span class="qual-name">${esc(q.name)}</span>${statusBadge(q.state, q.label)}<span class="qual-note">${esc(q.note)}</span>
  </div>`).join('')}</div>`;
}

/** AI 能力说明 */
export function aiFactsGrid() {
  return `<div class="ai-grid">${AI_FACTS.map((a) => `<article class="ai-card reveal">
    <span class="ai-ico">${icon('sparkles')}</span><h3>${esc(a.name)}</h3><p>${esc(a.detail)}</p>
  </article>`).join('')}</div>
  <div class="ai-disclaimer">${icon('info')}<p>以上能力的结果由大模型自动生成，属于人工智能生成合成内容，可能存在误差，仅供辅助参考，不构成医疗或营养建议，请自行核对。产品内对 AI 回答、解读与识别条目均标注「AI 生成」，首次使用 AI 功能前会单独征得同意；拒绝后仍可使用非 AI 功能。</p></div>`;
}

/** 法务文档入口卡 */
export function legalCards() {
  return `<div class="legal-grid">${LEGAL_DOCS.map((d) => `<article class="legal-card">
    <span class="legal-ico">${icon('book')}</span>
    <h3>${esc(d.title)}</h3><p>${esc(d.summary)}</p>
    <a class="text-link" href="${esc(d.href)}" target="_blank" rel="noopener noreferrer">阅读产品内公示版本 ${icon('external', 'ico-sm')}</a>
  </article>`).join('')}</div>`;
}

/** 上线进展时间线 */
export function roadmapTimeline(items) {
  return `<div class="timeline">${items.map((r) => `<article class="timeline-item tl-${esc(r.state)}">
    <div class="tl-marker" aria-hidden="true"></div>
    <div class="tl-body"><div class="tl-head">${statusBadge(r.state, r.label)}<h3>${esc(r.title)}</h3></div><p>${esc(r.text)}</p></div>
  </article>`).join('')}</div>`;
}

/** 首页 FAQ 精选 */
export function homeFaq(pairs) {
  return `<div class="faq-list faq-list-home">${pairs.map(([q, a]) => `<details class="faq-item" name="homefaq">
    <summary><span class="faq-q-text">${esc(q)}</span><span class="faq-pm" aria-hidden="true">${icon('plus')}</span></summary>
    <div class="faq-a"><p>${esc(a)}</p></div>
  </details>`).join('')}</div>`;
}
