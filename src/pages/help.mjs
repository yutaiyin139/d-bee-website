import { SITE } from '../data/site.mjs';
import { pageHero, breadcrumbLd, faqLd } from '../lib/layout.mjs';
import { esc, icon } from '../lib/html.mjs';
import { sectionHead, faqSection, notice } from '../lib/components.mjs';
import { FAQ_GROUPS } from '../data/content.mjs';

const allPairs = FAQ_GROUPS.flatMap((g) => g.items.map((i) => [i.q, i.a]));

export default {
  id: 'help',
  href: 'help.html',
  title: '帮助中心',
  description: '自律蜜蜂常见问题：额度与积分、会员与兑换码、数据与隐私、平台与版本。答案按产品内规则与法务条款给出。',
  jsonLd: (url) => [...breadcrumbLd({ title: '帮助中心' })(url), ...faqLd(allPairs)(url)],
  cta: { kicker: '没找到答案？', title: '也可以直接联系我们', text: '或打开 Web 版，在产品内查看说明。' },
  render: () => `
${pageHero({ kicker: 'HELP CENTER', crumb: '帮助中心', title: '关于自律蜜蜂，<em>你可能想问</em>', desc: `${allPairs.length} 个问题，按主题分好类；答案只写产品里确实如此的事。` })}

<section class="section section-tight">
  <div class="wrap">
    ${sectionHead({ kicker: 'FAQ', title: '常见问题' })}
    ${faqSection(FAQ_GROUPS)}
  </div>
</section>

<section class="section section-alt" id="contact-start">
  <div class="wrap">
    ${sectionHead({ kicker: '联系与反馈', title: '还有问题，写信给我们', desc: '邮件由运营主体统一接收；请勿在邮件中发送密码或兑换码。' })}
    <div class="split-grid">
      <article class="split-card">
        <span class="split-ico">${icon('mail')}</span>
        <h3>支持邮箱</h3>
        <p><a class="text-link" href="mailto:${esc(SITE.email)}">${esc(SITE.email)}</a></p>
        <p>功能建议、问题反馈与商务合作都可用这个邮箱。</p>
      </article>
      <article class="split-card">
        <span class="split-ico">${icon('book')}</span>
        <h3>法务与协议</h3>
        <p>隐私、协议与免责声明以产品内公示版本为准，<a class="text-link" href="legal.html">从官网这里进入</a>。</p>
        <p>更新日期：${esc(SITE.legalUpdated)}。</p>
      </article>
    </div>
    ${notice({ title: '关于时间', text: '移动端上架与会员开售都没有可承诺的日期；有确切进展会在本站「上线进展」页更新，请勿相信非官方渠道的「已开放下载」说法。', tone: 'soft', iconName: 'clock' })}
  </div>
</section>`,
};
