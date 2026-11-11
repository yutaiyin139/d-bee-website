import { PERPETUITY_NOTE } from '../data/site.mjs';
import { pageHero, breadcrumbLd } from '../lib/layout.mjs';
import { esc, icon } from '../lib/html.mjs';
import {
  sectionHead, planCards, saleNotice, notice, faqSection,
  pricingNotice, renewalNotice, unifiedPriceNote, benefitsGrid,
} from '../lib/components.mjs';
import { FAQ_GROUPS } from '../data/content.mjs';

const memberFaq = FAQ_GROUPS.filter((g) => ['member', 'quota'].includes(g.id));

export default {
  id: 'pricing',
  href: 'pricing.html',
  title: '定价与会员',
  description: '自律蜜蜂 Pro 三档明码标价：月订阅 ¥18 / 月、年订阅 ¥128 / 年（约 ¥10.7/月）、终身买断 ¥298 永久。当前收款通道未开通，会员暂不售卖。',
  jsonLd: breadcrumbLd({ title: '定价与会员' }),
  cta: { kicker: '不花钱也能用', title: '基础记录功能永久免费，先去记一餐', text: '浏览器直接可用，无需安装。永久无广告、无隐藏扣费。' },
  render: () => `
${pageHero({ kicker: 'PRICING', crumb: '定价与会员', title: '价格写清楚，<em>选择留给你</em>', desc: '本页价格为统一定价，对所有用户一致，不因人定价。以下为明码标价公示，当前不收款。' })}

<section class="section section-tight">
  <div class="wrap">
    ${saleNotice()}
    ${pricingNotice()}
    ${planCards()}
    ${renewalNotice()}
    ${unifiedPriceNote()}
    <div class="price-foot">
      <div>${icon('info')}<p>三档档位与价格文案由产品内统一配置生成；最终以支付平台商品与产品内购买页公示为准，改价会四端同步。</p></div>
      <div>${icon('shield')}<p>${esc(PERPETUITY_NOTE)}会员为可选项，用于解锁更多 AI 识别次数与更长期限的饮食报告。</p></div>
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="wrap">
    ${sectionHead({ kicker: '权益清单', title: '免费能用什么，Pro 多些什么', desc: '与产品内「会员定价」页逐字一致；端差异见「产品功能」页。' })}
    ${benefitsGrid()}
  </div>
</section>

<section class="section">
  <div class="wrap">
    ${sectionHead({ kicker: '不一定要花钱', title: '免费版，以及把积分换成 Pro', desc: '「先能用起来」比「先付费」更重要。' })}
    <div class="split-grid">
      <article class="split-card">
        <span class="split-ico">${icon('check')}</span>
        <h3>基础记录功能永久免费</h3>
        <p>每日 3 次免费 AI 拍照识别（识别成功才扣次数）；扫条码不限次数永久免费；文字描述识别、手动录入、体重饮水运动记录、AI 问答不限次数（每分钟限 3 次防刷）、饮食报告看近 7 天全部免费。</p>
        <a class="text-link" href="features.html">查看免费版完整权益 ${icon('arrow', 'ico-sm')}</a>
      </article>
      <article class="split-card">
        <span class="split-ico">${icon('sparkles')}</span>
        <h3>蜜糖积分可兑 Pro 天数</h3>
        <p>蜜糖积分可兑 Pro 天数（100 分兑 1 天、2600 分兑 30 天），在「蜜糖积分」页兑换；积分可再兑换拍照识别，每日最多 2 次（50 积分/次）。连续打卡 7 天再送拍照次数。</p>
        <a class="text-link" href="help.html">查看积分与额度问答 ${icon('arrow', 'ico-sm')}</a>
      </article>
    </div>
    ${notice({ title: '关于兑换码', text: '兑换码一码一次，兑换成功后按刷新到的真实权益生效：终身档与 Pro 档的提示文案不同，Pro 档带有效期，到期后权益自然结束。权益写入账号，换设备登录仍生效。', tone: 'soft', iconName: 'tag' })}
  </div>
</section>

<section class="section section-alt">
  <div class="wrap">
    ${sectionHead({ kicker: '购买前先问清', title: '会员与额度常见问题' })}
    ${faqSection(memberFaq, { searchable: false })}
    <div class="section-more"><a class="text-link" href="help.html">前往帮助中心查看全部问题 ${icon('arrow', 'ico-sm')}</a></div>
  </div>
</section>`,
};
