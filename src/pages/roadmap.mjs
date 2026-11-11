import { pageHero, breadcrumbLd } from '../lib/layout.mjs';
import { esc, icon } from '../lib/html.mjs';
import { sectionHead, roadmapTimeline, notice } from '../lib/components.mjs';
import { ROADMAP } from '../data/content.mjs';

export default {
  id: 'roadmap',
  href: 'roadmap.html',
  title: '上线进展',
  description: '自律蜜蜂四端上线进展如实公示：Web 已上线，移动端内测中，资质与备案审核中，会员收款未开通。不承诺具体日期。',
  jsonLd: breadcrumbLd({ title: '上线进展' }),
  cta: { kicker: '不用等', title: 'Web 版已经可以用了', text: '浏览器打开 d-bee.cn 即可开始记录。' },
  render: () => `
${pageHero({ kicker: 'ROADMAP', crumb: '上线进展', title: '做到哪一步，<em>就公示到哪一步</em>', desc: '没有版本号故事，也没有承诺日期。只有当前状态与正在推进的事。' })}

<section class="section section-tight">
  <div class="wrap">
    ${sectionHead({ kicker: '当前状态', title: '进展一览', desc: '状态变化时，本站会先更新事实清单，再更新页面。' })}
    ${roadmapTimeline(ROADMAP)}
  </div>
</section>

<section class="section section-alt">
  <div class="wrap">
    ${sectionHead({ kicker: '口径说明', title: '这些词我们不会乱用', desc: '避免把过程写成结果，是这个页面存在的理由。' })}
    <div class="mini-grid mini-grid-3">
      <div class="mini-card">${icon('info')}<h3>内测 ≠ 上架</h3><p>体验版、真机调试、TestFlight 内部测试都属于过程，不等于正式发布。</p></div>
      <div class="mini-card">${icon('clock')}<h3>审核中 ≠ 已下证</h3><p>备案与著作权在管局流程里时，只写「审核中 / 申请中」。</p></div>
      <div class="mini-card">${icon('tag')}<h3>公示 ≠ 可售</h3><p>展示价格是明码标价要求，不代表当前可以下单；收款开关保持关闭。</p></div>
    </div>
    ${notice({ title: '关于时间', text: '备案审核、著作权登记与平台审核的周期不由我们决定，本站不承诺具体上线日期。确切进展会更新在本页。', tone: 'amber', iconName: 'clock' })}
    <div class="section-more"><a class="text-link" href="get.html">查看各端获取方式 ${icon('arrow', 'ico-sm')}</a></div>
  </div>
</section>`,
};
