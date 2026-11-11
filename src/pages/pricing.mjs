import { SITE, PLANS } from '../data/site.mjs';
import { pageHero, breadcrumbLd } from '../lib/layout.mjs';
import { esc, icon } from '../lib/html.mjs';
import { sectionHead, planCards, saleNotice, notice, faqSection } from '../lib/components.mjs';
import { FAQ_GROUPS } from '../data/content.mjs';

const memberFaq = FAQ_GROUPS.filter((g) => ['member', 'quota'].includes(g.id));

export default {
  id: 'pricing',
  href: 'pricing.html',
  title: '定价与会员',
  description: '自律蜜蜂 Pro 三档明码标价：月卡 ¥18、年卡 ¥128、终身 ¥298。一次性预付，不自动续费；当前收款通道未开通，会员暂不售卖。',
  jsonLd: breadcrumbLd({ title: '定价与会员' }),
  cta: { kicker: '不花钱也能用', title: '免费版长期可用，先去记一餐', text: '基础记录功能永久免费，永久无广告。' },
  render: () => `
${pageHero({ kicker: 'PRICING', crumb: '定价与会员', title: '价格写清楚，<em>选择留给你</em>', desc: '三档价格对所有用户一致，不因人定价。以下为明码标价公示，当前不收款。' })}

<section class="section section-tight">
  <div class="wrap">
    ${saleNotice()}
    ${planCards()}
    <div class="price-foot">
      <div>${icon('info')}<p>价格真源为产品内统一配置；正式开通后以产品内购买页为准。改价会四端同步。</p></div>
      <div>${icon('shield')}<p>道具直购为一次性预付，<b>不自动续费、不自动扣款</b>，到期无需手动取消。</p></div>
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="wrap">
    ${sectionHead({ kicker: '不一定要花钱', title: '免费版，以及把积分换成 Pro', desc: '我们认为「先能用起来」比「先付费」更重要。' })}
    <div class="split-grid">
      <article class="split-card">
        <span class="split-ico">${icon('check')}</span>
        <h3>免费版长期可用</h3>
        <p>每日 3 次 AI 拍照识别；扫条码永久免费；手动录入、文字描述识别、体重 / 饮水 / 运动记录、AI 问答与近 7 天报告全部免费。额度用完仍可继续记录。</p>
        <a class="text-link" href="features.html">查看免费版完整权益 ${icon('arrow', 'ico-sm')}</a>
      </article>
      <article class="split-card">
        <span class="split-ico">${icon('sparkles')}</span>
        <h3>蜜糖积分可兑 Pro</h3>
        <p>通过打卡与活动积累积分：100 分兑 1 天 Pro、2600 分兑 30 天 Pro，也可 50 分兑 1 次额外的 AI 拍照识别（每日最多 2 次）。连续打卡 7 天还会再送拍照次数。</p>
        <a class="text-link" href="help.html">查看积分与额度问答 ${icon('arrow', 'ico-sm')}</a>
      </article>
    </div>
    ${notice({ title: '关于兑换码', text: '兑换码一码一次，兑换成功后按刷新到的真实权益生效：终身档与 Pro 档不同，Pro 档带有效期且到期不自动续费。权益写入账号，换设备登录仍生效。', tone: 'soft', iconName: 'tag' })}
  </div>
</section>

<section class="section">
  <div class="wrap">
    ${sectionHead({ kicker: '购买前先问清', title: '会员与额度常见问题' })}
    ${faqSection(memberFaq, { searchable: false })}
    <div class="section-more"><a class="text-link" href="help.html">前往帮助中心查看全部问题 ${icon('arrow', 'ico-sm')}</a></div>
  </div>
</section>`,
};
