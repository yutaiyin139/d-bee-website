import { SITE } from '../data/site.mjs';
import { pageHero, breadcrumbLd } from '../lib/layout.mjs';
import { esc, icon, brandIcon } from '../lib/html.mjs';
import { sectionHead, platformTable, btn, notice } from '../lib/components.mjs';

export default {
  id: 'get',
  href: 'get.html',
  title: '获取方式',
  description: '自律蜜蜂 Web 版已在 d-bee.cn 上线，浏览器直接可用；微信小程序、Android 与 iOS 内测中，尚未正式上架。这里如实公示各端状态。',
  jsonLd: breadcrumbLd({ title: '获取方式' }),
  cta: { kicker: '唯一的正式入口', title: '打开 Web 版，不用等安装包', text: '浏览器直接用，基础记录永久免费。' },
  render: () => `
${pageHero({ kicker: 'GET STARTED', crumb: '获取方式', title: '现在，<em>从这里开始用</em>', desc: '不绕弯子：Web 版是当前唯一正式可用的入口，移动端还在内测。' })}

<section class="section section-tight">
  <div class="wrap">
    <div class="get-hero-card">
      <div>
        <span class="kicker">WEB · 已上线</span>
        <h2>打开 ${esc('d-bee.cn')}，直接开始</h2>
        <p>无需下载安装，也不用等上架，手机或电脑浏览器打开即可记录。数据与账号在云端同步，换设备继续用。</p>
        <div class="get-actions">
          ${btn({ label: '打开 Web 版', href: SITE.productUrl, external: true, size: 'lg' })}
          ${btn({ label: '先了解功能', href: 'features.html', variant: 'ghost', size: 'lg' })}
        </div>
      </div>
      <div class="get-hero-side" aria-hidden="true">
        <span class="get-bee">${brandIcon('bee-logo', 76)}</span>
        <p>浏览器<br>打开即用</p>
      </div>
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="wrap">
    ${sectionHead({ kicker: '四端状态', title: '每一端，都照实说', desc: '状态会随进展更新；内测、体验版与内部测试都不等于正式上架。' })}
    ${platformTable({ detailed: true })}
    ${notice({ title: '关于安装与下载', text: '移动端正式分发渠道尚未开放，本站不提供安装包，也不提供二维码或商店跳转。请勿从非官方渠道获取所谓「安装包」。', tone: 'amber', iconName: 'shield' })}
  </div>
</section>

<section class="section">
  <div class="wrap">
    ${sectionHead({ kicker: '接下来', title: '移动端在做什么', desc: '以下是正在推进的工作，不承诺具体日期。' })}
    <div class="mini-grid mini-grid-3">
      <div class="mini-card">${icon('book')}<h3>备案与资质</h3><p>App 备案、小程序备案、软件著作权等按各自流程办理，尚未全部下证。</p></div>
      <div class="mini-card">${icon('activity')}<h3>内测与验收</h3><p>体验版全链路功能验收与包体检查，真机调试结果不等于体验版通过。</p></div>
      <div class="mini-card">${icon('tag')}<h3>收款通道</h3><p>相关资质与真实联调完成前，收款开关保持关闭，不会出现可下单入口。</p></div>
    </div>
    <div class="section-more"><a class="text-link" href="roadmap.html">查看上线进展 ${icon('arrow', 'ico-sm')}</a></div>
  </div>
</section>`,
};
