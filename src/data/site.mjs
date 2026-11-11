/**
 * 站点级唯一事实源（机器可读）。
 *
 * 🔴 人的说明见 ../../FACTS.md；本文件是构建期唯一被读取的数据源。
 *    任何「主体 / 备案 / 上架状态 / 定价 / 法务版本」变化：
 *      先改 FACTS.md → 再改本文件 → node tools/build.mjs → node tools/check-facts.mjs 全绿 → 才部署。
 *
 * 数据来源（核对日期 2026-11-11）：
 *  主项目 zilv-mifeng / packages/shared/src/constants/index.ts
 *  主项目 zilv-mifeng / packages/shared/src/rules/index.ts
 *  主项目 zilv-mifeng / src/content/membership.ts、src/content/legal.ts
 *  docs/四端正式上线前置条件与实施序列-2026-11-11.md
 */

export const SITE = {
  brand: '自律蜜蜂',
  brandEn: 'D-Bee',
  subject: '北京迪蜂科技有限公司',
  domain: 'https://d-bee.com.cn',
  productUrl: 'https://d-bee.cn/',
  icp: '京ICP备2026075565号-1',
  icpQuery: 'https://beian.miit.gov.cn/',
  // 公安联网备案未下证，POLICE_BEIAN 为空；绝不展示假号
  policeBeian: '',
  policeQuery: 'https://beian.mps.gov.cn/',
  email: 'dbeeSupport@163.com',
  legalUpdated: '2026 年 11 月 2 日',
  lang: 'zh-CN',
  tagline: '让每一口都吃得明白',
  heroLead: '拍一张照片，就知道这餐吃了多少热量。',
  description:
    '自律蜜蜂（D-Bee）是北京迪蜂科技有限公司推出的 AI 饮食记录工具：拍照识别食物热量，记录饮食、饮水、体重与运动，用图表看见趋势。永久无广告，基础功能免费。',
  themeColor: '#FBF8F1',
  buildDate: '2026-11-11',
};

/** 主导航（所有页面共用；页脚另见 FOOTER_GROUPS） */
export const NAV = [
  { id: 'home', label: '首页', href: 'index.html' },
  { id: 'features', label: '产品功能', href: 'features.html' },
  { id: 'pricing', label: '定价与会员', href: 'pricing.html' },
  { id: 'get', label: '获取方式', href: 'get.html' },
  { id: 'help', label: '帮助中心', href: 'help.html' },
  { id: 'about', label: '关于我们', href: 'about.html' },
];

/** 页脚分组；href 可为本站点内相对地址或外链 */
export const FOOTER_GROUPS = [
  {
    title: '产品',
    links: [
      { label: '产品功能', href: 'features.html' },
      { label: '定价与会员', href: 'pricing.html' },
      { label: '获取方式', href: 'get.html' },
      { label: '上线进展', href: 'roadmap.html' },
    ],
  },
  {
    title: '支持',
    links: [
      { label: '帮助中心', href: 'help.html' },
      { label: '隐私与合规', href: 'trust.html' },
      { label: '法务与协议', href: 'legal.html' },
      { label: '联系我们', href: 'about.html#contact' },
    ],
  },
  {
    title: '访问',
    links: [
      { label: '打开 Web 版', href: SITE.productUrl, external: true },
      { label: '产品内隐私政策', href: `${SITE.productUrl}legal/privacy/`, external: true },
      { label: '产品内用户协议', href: `${SITE.productUrl}legal/terms/`, external: true },
      { label: '产品内免责声明', href: `${SITE.productUrl}legal/disclaimer/`, external: true },
    ],
  },
];

/** 四端真实状态（🔴 严禁写成「已上架」；Web 是唯一可用入口） */
export const PLATFORMS = [
  {
    name: 'Web 版',
    target: 'd-bee.cn',
    state: 'live',
    stateLabel: '已上线',
    note: '浏览器直接打开，无需安装；当前唯一的正式可用入口。',
    action: '打开 Web 版',
    href: SITE.productUrl,
  },
  {
    name: '微信小程序',
    target: '微信内',
    state: 'beta',
    stateLabel: '内测中',
    note: '正式版尚未发布，备案审核与体验版验收进行中。',
    action: null,
  },
  {
    name: 'Android',
    target: '安卓设备',
    state: 'beta',
    stateLabel: '内测中',
    note: '正式包已归档，分发渠道尚未开放。',
    action: null,
  },
  {
    name: 'iOS',
    target: 'iPhone / iPad',
    state: 'beta',
    stateLabel: '内测中',
    note: '尚未上架，签名与资质准备中。',
    action: null,
  },
];

/** 三档定价（真源 constants/index.ts:86-95；当前不售卖，卡片不可点击） */
export const PLANS = [
  {
    id: 'dbee_pro_monthly',
    name: 'Pro 月卡',
    price: '¥18',
    period: '1 个月',
    note: '适合先试一个月',
    badge: '',
  },
  {
    id: 'dbee_pro_yearly',
    name: 'Pro 年卡',
    price: '¥128',
    period: '12 个月',
    note: '约 ¥10.7 / 月',
    badge: '最划算',
  },
  {
    id: 'dbee_lifetime',
    name: '终身',
    price: '¥298',
    period: '一次买断',
    note: '一次付费，长期使用',
    badge: '买断',
  },
];

/** 免费版权益（membership.ts:23-33，Web 端口径） */
export const FREE_ITEMS = [
  '每日 3 次 AI 拍照识别（识别成功才扣次数）',
  '积分可再兑换拍照识别，每日最多 2 次（50 积分 / 次）',
  '蜜糖积分可兑 Pro 天数（100 分兑 1 天、2600 分兑 30 天）',
  '扫条码不限次数，永久免费',
  '文字描述识别、手动录入、体重 / 饮水 / 运动记录全部免费',
  'AI 问答不限次数（每分钟最多 3 次防刷）',
  '饮食报告可看近 7 天',
  '连续打卡 7 天再送拍照次数',
  '永久无广告、无隐藏扣费',
];

/** Pro / 终身权益（membership.ts:43-50） */
export const PRO_ITEMS = [
  'AI 拍照识别不限次数',
  'AI 问答不限流',
  '长文本 AI 复盘（本期解读）无限次',
  '个性化完整膳食计划与长期 AI 膳食规划',
  '宏量营养素深度分析',
  '饮食报告扩展到 30 天，并支持数据导出',
];

/** 次数口径（rules/index.ts:4-14） */
export const QUOTA_RULES = [
  { label: '计入次数', text: '仅 AI 拍照识别消耗次数，且识别成功才扣、失败不扣。' },
  { label: '不计次数', text: '手动录入、文字描述识别、包装营养表读取、条码扫码、体重 / 饮水 / 运动打卡均不占额度。' },
  { label: '重置规则', text: '基础额度按自然日 0 点重置，不累计、不结转；奖励额度带 7 天有效期。' },
  { label: '免费兜底', text: '额度用完仍可手动录入、扫码与查看历史记录，基础功能永久可用。' },
];

/** 产品三步（基于真实使用链路，非营销虚构） */
export const STEPS = [
  {
    n: '01',
    title: '拍一张 / 扫一下 / 写一句',
    text: '用相机拍下这一餐，或扫包装条码、直接输入文字。照片识别后不长期保存。',
    icon: 'camera',
  },
  {
    n: '02',
    title: 'AI 辅助填好这一餐',
    text: '由大模型识别菜名、份量并估算热量与营养；结果标注「AI 生成」，可随时手动修改。',
    icon: 'sparkles',
  },
  {
    n: '03',
    title: '看见趋势，慢慢调整',
    text: '饮食、饮水、体重与运动汇成图表，配合报告与 AI 问答，把「吃得明白」变成日常。',
    icon: 'chart',
  },
];

/** 值得公开的承诺（均有源可查，非营销修辞） */
export const PROMISES = [
  {
    icon: 'shield',
    title: '永久无广告，无隐藏扣费',
    text: '不接广告 SDK，不做诱导付费；免费版长期可用，不花钱也能完整记录每一餐。',
  },
  {
    icon: 'database',
    title: '数据存在境内，换设备不丢',
    text: '自建 PostgreSQL 云端同步，部署在境内云基础设施，数据不出境；账号与注销体系完整。',
  },
  {
    icon: 'tag',
    title: '明码标价，不因人定价',
    text: '三档价格对所有用户一致；当前收款通道未开通，本站与 Web 版均不收款。',
  },
  {
    icon: 'sparkles',
    title: 'AI 结果明确标识',
    text: 'AI 生成的回答、解读与识别条目均带「AI 生成」标识；结果仅供参考，不构成医疗或营养建议。',
  },
];

/** AI 能力（legal.ts:296-321；严禁写「精准 / 诊断 / 疗效」） */
export const AI_FACTS = [
  { name: '拍照识别', detail: '由已接入的第三方视觉大模型识别菜名、份量与热量，照片识别后不长期保存。' },
  { name: '问问小蜜', detail: 'AI 问答基于提问文本与必要的饮食记录摘要，不提供姓名 / 手机 / 邮箱，对话不用于训练。' },
  { name: '本期解读与膳食规划', detail: 'Pro 权益：长文本 AI 复盘、宏量营养素深度分析与个性化膳食计划。' },
];

/** 资质与备案真实状态（FACTS §2；不得写「已获批 / 资质齐备」） */
export const QUALIFICATIONS = [
  { name: '域名与 ICP 备案', state: 'done', label: '已下证', note: '本站 京ICP备2026075565号-1（2026-11-06 下证）' },
  { name: '软件著作权', state: 'pending', label: '申请中', note: '登记办理中' },
  { name: 'App 备案', state: 'pending', label: '审核中', note: '管局审核中' },
  { name: '小程序备案', state: 'pending', label: '审核中', note: '管局审核中' },
  { name: '算法备案', state: 'pending', label: '审核中', note: '管局审核中，另有材料需补正' },
  { name: '公安联网备案', state: 'todo', label: '办理中', note: '尚未下证，下证后再公示' },
];

/** 法务三页权威地址（链接到产品内版本，本站不复制全文，避免双份文本冲突） */
export const LEGAL_DOCS = [
  {
    title: '隐私政策',
    href: `${SITE.productUrl}legal/privacy/`,
    summary: '收集哪些信息、如何存储与同步、AI 能力的调用范围、第三方服务、账号注销与你的权利。',
  },
  {
    title: '用户协议',
    href: `${SITE.productUrl}legal/terms/`,
    summary: '服务内容、账号规则、会员与兑换码权益、费用与退款、免责与争议解决。',
  },
  {
    title: '免责声明',
    href: `${SITE.productUrl}legal/disclaimer/`,
    summary: '热量与营养数据为参考估算值，不构成医疗、诊断或营养建议。',
  },
];

/** 全局公告：当前不售卖会员（所有涉及定价的页面统一展示同一段） */
export const SALE_NOTICE = {
  title: '会员暂不售卖',
  text: '收款通道尚未开通，本站与 Web 版均不收款，也不创建订单。以下为明码标价公示：待正式开通后，价格与权益以产品内购买页为准。',
};
