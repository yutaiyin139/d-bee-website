import { SITE, PERPETUITY_NOTE } from '../data/site.mjs';
import { pageHero, breadcrumbLd } from '../lib/layout.mjs';
import { esc, icon } from '../lib/html.mjs';
import { sectionHead, qualificationList, legalCards, notice } from '../lib/components.mjs';

const DATA_ITEMS = [
  { icon: 'database', title: '存在哪里', text: '你的账号信息与记录数据存储在中国境内、由我们自己部署与运维的数据库中，数据不会出境存储；随账号云端同步，换设备登录可继续使用。' },
  { icon: 'camera', title: '照片怎么用', text: '使用「拍照识别」时，食物照片会上传至阿里云百炼模型服务（Qwen-VL 视觉模型）进行识别，识别完成后照片不会被长期保存；你也可以始终使用不涉及图像的方式记录。' },
  { icon: 'sparkles', title: 'AI 问答发什么', text: '使用「问问小蜜」时，你的提问与相关饮食记录摘要会发送至 DeepSeek 大模型服务以生成回答；不提供姓名、手机或邮箱，对话内容不用于模型训练。' },
  { icon: 'lock', title: '账号与注销', text: '账号支持注销，具体流程与数据处理范围以产品内隐私政策为准；官网不另立注销规则。' },
  { icon: 'shield', title: '广告与追踪', text: '产品承诺永久无广告、无隐藏扣费，不接入广告 SDK。' },
  { icon: 'info', title: '结果性质', text: '热量与营养数值为参考估算值，AI 结果可能存在误差，不构成医疗、诊断或营养建议。' },
];

export default {
  id: 'trust',
  href: 'trust.html',
  title: '隐私与合规',
  description: '自律蜜蜂的数据存储、AI 能力调用范围、AI 生成内容标识、资质与备案真实状态，以及产品内法务文本的权威入口。',
  jsonLd: breadcrumbLd({ title: '隐私与合规' }),
  cta: { kicker: '想看得更细？', title: '完整条款以产品内公示版本为准', text: '官网只提供摘要与入口，不另立版本。' },
  render: () => `
${pageHero({ kicker: 'TRUST & COMPLIANCE', crumb: '隐私与合规', title: '数据、AI 与资质，<em>逐项说清</em>', desc: '这一页讲「我们怎么处理你的数据」和「哪些事还在办理中」，完整表述以产品内三份法务文档为准。' })}

<section class="section section-tight">
  <div class="wrap">
    ${sectionHead({ kicker: '数据处理', title: '你的记录，怎么被对待', desc: '以下为摘要；处理的信息、用途与第三方清单见产品内隐私政策。' })}
    <div class="data-grid">${DATA_ITEMS.map((d, i) => `<article class="data-card reveal" data-delay="${i % 3}">
      <span class="data-ico">${icon(d.icon)}</span><h3>${esc(d.title)}</h3><p>${esc(d.text)}</p>
    </article>`).join('')}</div>
    ${notice({ title: '服务可用性', text: PERPETUITY_NOTE + '因网络故障、设备问题、第三方服务调整或不可抗力导致的服务中断或数据延迟，我们不承担赔偿责任；条款原文见产品内免责声明。', tone: 'soft', iconName: 'info' })}
  </div>
</section>

<section class="section section-alt">
  <div class="wrap">
    ${sectionHead({ kicker: 'AI 标识', title: 'AI 生成的内容，会明确标出来', desc: '按《人工智能生成合成内容标识办法》与产品内隐私政策「AI 生成内容标识说明」所列范围标注。' })}
    <div class="split-grid">
      <article class="split-card">
        <span class="split-ico">${icon('sparkles')}</span>
        <h3>标识范围以产品内条款为准</h3>
        <p>产品内对 AI 文本回答、长文本解读、AI 识别产生的记录条目等作界面可感知的显式标识；具体标注位置、措辞与元数据标识方式，以产品内隐私政策的「AI 生成内容标识说明」条款为准，官网不另立一份。</p>
      </article>
      <article class="split-card">
        <span class="split-ico">${icon('check')}</span>
        <h3>不同意也能继续用</h3>
        <p>首次使用 AI 功能前会单独征得同意；拒绝后可继续使用手动录入、扫码、记录与查看报告等非 AI 功能。AI 结果由大模型自动生成，可能存在误差，仅供参考，可自行核对与修改。</p>
      </article>
    </div>
    ${notice({ title: '不宣称的几件事', text: '不宣称 AI 识别精准、不提供诊断或疗效判断、不宣称算法或资质已完成备案。相关备案仍在审核中。', tone: 'soft', iconName: 'info' })}
  </div>
</section>

<section class="section">
  <div class="wrap">
    ${sectionHead({ kicker: '资质公示', title: '办到哪一步，就写到哪一步', desc: '状态如实公示，未下证的项目不会提前写成已完成。' })}
    ${qualificationList()}
    <p class="section-note">本站备案号 ${esc(SITE.icp)} 已于 2026-11-06 下证，可在 <a href="${esc(SITE.icpQuery)}" target="_blank" rel="noopener noreferrer">工业和信息化部备案管理系统</a> 查询。公安联网备案办理中，下证后另行公示，本站不会展示未下证的编号。</p>
  </div>
</section>

<section class="section section-alt">
  <div class="wrap">
    ${sectionHead({ kicker: '权威文本', title: '法务条款，看产品内那一份', desc: `产品内三份文档共用一个更新日期：${esc(SITE.legalUpdated)}。官网不复制全文，避免版本分歧。` })}
    ${legalCards()}
    <div class="section-more"><a class="text-link" href="legal.html">查看法务与协议说明 ${icon('external', 'ico-sm')}</a></div>
  </div>
</section>`,
};
