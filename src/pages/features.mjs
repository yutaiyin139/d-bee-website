import { SITE } from '../data/site.mjs';
import { pageHero, breadcrumbLd } from '../lib/layout.mjs';
import { esc, icon } from '../lib/html.mjs';
import { sectionHead, benefitsGrid, quotaTable, aiFactsGrid, notice, btn } from '../lib/components.mjs';

export default {
  id: 'features',
  href: 'features.html',
  title: '产品功能',
  description: '自律蜜蜂功能清单：AI 拍照识别、条码扫码、手动录入、饮食报告、AI 问答、蜜糖积分，以及免费版与 Pro 的完整权益与计次规则。',
  jsonLd: breadcrumbLd({ title: '产品功能' }),
  cta: { kicker: '功能都在 Web 版里', title: '现在就打开，试着记一餐', text: '基础记录功能永久免费，无需安装。' },
  render: () => `
${pageHero({ kicker: 'PRODUCT', crumb: '产品功能', title: '把一餐记清楚，<em>不该花太多力气</em>', desc: '下面是产品内公示的能力，以及免费版与 Pro 之间说得清清楚楚的边界。' })}

<section class="section section-tight">
  <div class="wrap">
    ${sectionHead({ kicker: '权益清单', title: '免费能用什么，Pro 多些什么', desc: '基础记录功能永久免费，不因额度用完而失去记录能力。' })}
    ${benefitsGrid()}
    <p class="section-note">端差异：扫条码与数据导出在小程序端不可用，以上清单按 Web 端口径列出；实际以你使用的端内展示为准。</p>
  </div>
</section>

<section class="section section-alt">
  <div class="wrap">
    ${sectionHead({ kicker: '次数怎么算', title: '只有一件事会消耗额度', desc: '规则写在明处，省得用的时候还要猜。' })}
    ${quotaTable()}
    <div class="mini-grid">
      <div class="mini-card">${icon('clock')}<h3>自然日重置</h3><p>基础额度每天 0 点恢复，不累计、不结转。</p></div>
      <div class="mini-card">${icon('sparkles')}<h3>积分可再兑</h3><p>积分可再兑换拍照识别，每日最多 2 次（50 积分/次）；蜜糖积分也可兑 Pro 天数。</p></div>
      <div class="mini-card">${icon('check')}<h3>失败不扣次</h3><p>识别成功才计数，识别失败不消耗当日额度。</p></div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    ${sectionHead({ kicker: 'AI 能力', title: 'AI 是辅助，不是结论', desc: '哪些环节用到大模型、结果怎么标识、数据怎么被使用，都在这里说明。' })}
    ${aiFactsGrid()}
  </div>
</section>

<section class="section section-alt">
  <div class="wrap">
    ${sectionHead({ kicker: '还有这些', title: '记录之外的日常', desc: '饮食不是孤立的数字，和它们放在一起才看得出变化。' })}
    <div class="feature-grid feature-grid-4">
      <article class="feature-card reveal">${icon('droplet')}<h3>饮水</h3><p>设定目标，随时补记，和饮食显示在同一天。</p></article>
      <article class="feature-card reveal" data-delay="1">${icon('activity')}<h3>体重与运动</h3><p>记录趋势而非单点数值；活动消耗只按 50% 计入可吃回额度。</p></article>
      <article class="feature-card reveal" data-delay="2">${icon('chart')}<h3>饮食报告</h3><p>饮食报告看近 7 天，Pro 饮食报告扩展到 30 天 + 数据导出。</p></article>
      <article class="feature-card reveal" data-delay="3">${icon('database')}<h3>云端同步</h3><p>账号信息与记录数据存储在中国境内、由我们自己部署与运维的数据库中，随账号同步；账号支持注销，流程以产品内隐私政策为准。</p></article>
    </div>
    ${notice({ title: '关于数值', text: '热量与营养数值均为参考估算值，不构成医疗、诊断或营养建议，请自行核对；识别结果可手动修改。', tone: 'soft', iconName: 'info' })}
    <div class="section-more">${btn({ label: '看看定价与会员', href: 'pricing.html', variant: 'ghost' })}</div>
  </div>
</section>`,
};
