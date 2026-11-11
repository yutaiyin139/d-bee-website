import { SITE, RENEWAL_NOTE, PERPETUITY_NOTE } from '../data/site.mjs';
import { pageHero, breadcrumbLd } from '../lib/layout.mjs';
import { esc, icon } from '../lib/html.mjs';
import { sectionHead, legalCards, notice, renewalNotice } from '../lib/components.mjs';

export default {
  id: 'legal',
  href: 'legal.html',
  title: '法务与协议',
  description: '自律蜜蜂隐私政策、用户协议与免责声明以产品内 d-bee.cn/legal/ 公示版本为准。本站仅提供入口与摘要，不另立版本。',
  jsonLd: breadcrumbLd({ title: '法务与协议' }),
  cta: { kicker: '需要帮助？', title: '关于条款有疑问，可以写信', text: '也可以先在帮助中心查看常见问题。' },
  render: () => `
${pageHero({ kicker: 'LEGAL', crumb: '法务与协议', title: '条款只有一份，<em>在产品里</em>', desc: '官网不复制全文，避免两处表述出现分歧。以下链接直达产品内公示版本。' })}

<section class="section section-tight">
  <div class="wrap">
    ${notice({ title: '以产品内公示版本为准', text: `隐私政策、用户协议与免责声明共用一个更新日期：${SITE.legalUpdated}。若产品内版本更新，以产品内页面为准；本站只更新入口与摘要。`, tone: 'amber', iconName: 'info' })}
    ${legalCards()}
  </div>
</section>

<section class="section section-alt">
  <div class="wrap">
    ${sectionHead({ kicker: '几个要点', title: '读条款前，先看这几条', desc: '以下是摘要，不替代条款正文。' })}
    <div class="rule-table">
      <div class="rule-head"><span>主题</span><span>摘要</span></div>
      <div class="rule-row"><b>服务性质</b><p>供个人用户记录自身饮食与生活习惯的工具，热量与营养数值为参考估算值，不构成医疗或营养建议。</p></div>
      <div class="rule-row"><b>数据与 AI</b><p>记录保存在境内自建数据库并随账号同步；AI 能力调用第三方大模型，相关内容带「AI 生成」标识，首次使用前单独征得同意。</p></div>
      <div class="rule-row"><b>会员与费用</b><p>当前收款通道未开通，本站与 Web 版均不收款、不创建订单；会员计费方式因购买渠道而异，以产品内购买页与用户协议「六、订阅与自动续费说明」为准。三档价格见<a href="pricing.html">定价公示</a>。</p></div>
      <div class="rule-row"><b>账号与注销</b><p>账号支持注销，具体流程与数据处理范围以产品内隐私政策为准。</p></div>
      <div class="rule-row"><b>服务可用性</b><p>${esc(PERPETUITY_NOTE)}</p></div>
      <div class="rule-row"><b>年龄</b><p>本服务不面向 14 周岁以下的儿童。</p></div>
    </div>
    ${renewalNotice()}
    <p class="section-note">运营主体：${esc(SITE.subject)} · 本站备案号 <a href="${esc(SITE.icpQuery)}" target="_blank" rel="noopener noreferrer">${esc(SITE.icp)}</a>。资质与数据处理概览见 <a href="trust.html">隐私与合规</a>。</p>
  </div>
</section>

<section class="section">
  <div class="wrap">
    ${sectionHead({ kicker: '版本纪律', title: '为什么官网不复制一份', desc: '一句解释，关于我们怎么避免「两份文本不一致」。' })}
    <div class="split-grid">
      <article class="split-card">
        <span class="split-ico">${icon('layers')}</span>
        <h3>单一真相源</h3>
        <p>法务文本由产品内的统一内容源渲染，四端共用。官网若再抄一份，任何一次更新都可能漏改，造成「哪份才算数」的争议。</p>
      </article>
      <article class="split-card">
        <span class="split-ico">${icon('clock')}</span>
        <h3>更新会打扰老用户</h3>
        <p>产品内法务更新日期变化会让老用户下次启动时重新确认同意。这是一项有真实用户影响的产品决策，因此不会为了同步官网而随意改动。</p>
      </article>
    </div>
  </div>
</section>`,
};
