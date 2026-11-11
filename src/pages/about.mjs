import { SITE } from '../data/site.mjs';
import { pageHero, breadcrumbLd } from '../lib/layout.mjs';
import { esc, icon } from '../lib/html.mjs';
import { sectionHead, qualificationList, notice } from '../lib/components.mjs';
import { PRINCIPLES } from '../data/content.mjs';

export default {
  id: 'about',
  href: 'about.html',
  title: '关于我们',
  description: '北京迪蜂科技有限公司是自律蜜蜂（D-Bee）的运营主体。这里公示主体信息、品牌来历、资质办理状态与联系方式。',
  jsonLd: breadcrumbLd({ title: '关于我们' }),
  cta: { kicker: '先试试产品', title: '从 Web 版开始，认识自律蜜蜂', text: '浏览器打开即用，基础功能永久免费。' },
  render: () => `
${pageHero({ kicker: 'ABOUT', crumb: '关于我们', title: '把一件小事，<em>认真做久一点</em>', desc: `${esc(SITE.subject)}是自律蜜蜂（D-Bee）的运营主体。` })}

<section class="section section-tight">
  <div class="wrap">
    <div class="about-grid">
      <div class="about-copy">
        ${sectionHead({ kicker: '关于产品', title: '为什么叫「自律蜜蜂」', desc: '' })}
        <p>自律不该是一阵猛冲，更像蜜蜂每天一点点地采、一点点地攒。我们希望记录饮食这件事足够轻：拍一张、扫一下、写一句就好，剩下的交给工具。</p>
        <p>「让每一口都吃得明白」不是要你算得毫厘不差，而是让模糊的感觉变成看得见的趋势。热量与营养数值是参考估算值，能不能帮上忙，应该由你自己判断。</p>
        <p>所以我们把规则写在前面：哪些功能计次、AI 结果可能有误差、数据存在哪里、会员计费方式因购买渠道而异、价格对所有人一致。这些比一句漂亮的口号更重要。</p>
      </div>
      <aside class="about-facts">
        <h2>主体信息</h2>
        <dl>
          <dt>运营主体</dt><dd>${esc(SITE.subject)}</dd>
          <dt>品牌名称</dt><dd>${esc(SITE.brand)}（${esc(SITE.brandEn)}）</dd>
          <dt>本站域名</dt><dd>${esc(SITE.domain.replace('https://', ''))}</dd>
          <dt>产品入口</dt><dd><a href="${esc(SITE.productUrl)}" target="_blank" rel="noopener noreferrer">${esc(SITE.productUrl.replace('https://', ''))}</a></dd>
          <dt>本站备案</dt><dd><a href="${esc(SITE.icpQuery)}" target="_blank" rel="noopener noreferrer">${esc(SITE.icp)}</a></dd>
          <dt>支持邮箱</dt><dd><a href="mailto:${esc(SITE.email)}">${esc(SITE.email)}</a></dd>
        </dl>
        <p class="about-facts-note">统一社会信用代码与注册地址以登记机关公示信息为准，本站不另行填写未经核对的编号。</p>
      </aside>
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="wrap">
    ${sectionHead({ kicker: '我们做事的方式', title: '三条不太起眼的坚持' })}
    <div class="principle-grid">${PRINCIPLES.map((p, i) => `<article class="principle-card reveal" data-delay="${i}">
      <span class="principle-n">${esc(p.n)}</span><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p>
    </article>`).join('')}</div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    ${sectionHead({ kicker: '状态公示', title: '资质办理到哪一步', desc: '申请中就是申请中，内测就是内测，不提前写成结果。' })}
    ${qualificationList()}
    <p class="section-note">更完整的合规说明见 <a href="trust.html">隐私与合规</a>，各端上线状态见 <a href="roadmap.html">上线进展</a>。</p>
  </div>
</section>

<section class="section section-alt" id="contact">
  <div class="wrap">
    ${sectionHead({ kicker: 'CONTACT', title: '联系我们', desc: '反馈、合作与问题咨询，都走同一个邮箱。' })}
    <div class="contact-grid">
      <a class="contact-card" href="mailto:${esc(SITE.email)}">${icon('mail')}<div><b>支持邮箱</b><span>${esc(SITE.email)}</span></div>${icon('arrow', 'ico-sm')}</a>
      <a class="contact-card" href="help.html">${icon('book')}<div><b>帮助中心</b><span>先看常见问题，可能更快</span></div>${icon('arrow', 'ico-sm')}</a>
      <a class="contact-card" href="legal.html">${icon('shield')}<div><b>法务与协议</b><span>隐私政策 / 用户协议 / 免责声明</span></div>${icon('arrow', 'ico-sm')}</a>
      <a class="contact-card" href="${esc(SITE.productUrl)}" target="_blank" rel="noopener noreferrer">${icon('external')}<div><b>打开 Web 版</b><span>${esc(SITE.productUrl.replace('https://', ''))}</span></div>${icon('arrow', 'ico-sm')}</a>
    </div>
    ${notice({ title: '谨防非官方渠道', text: '移动端尚未正式上架，本站不提供安装包或二维码。任何声称「已可下载」的第三方页面都与我们无关。', tone: 'amber', iconName: 'shield' })}
  </div>
</section>`,
};
