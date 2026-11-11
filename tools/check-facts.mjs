#!/usr/bin/env node
/**
 * 官网发布前护栏（零依赖）。
 *
 *   node tools/check-facts.mjs              # 检查 app/*.html + src/**.mjs，全绿 exit 0
 *   node tools/check-facts.mjs --selftest   # 用「合规样例站点」验证规则集可被满足
 *   node tools/check-facts.mjs --redtest    # 🔴 逐条规则红验证：故意违规，必须各自判红
 *
 * 🔴 铁律：新增/修改任一规则后必须跑 --selftest 与 --redtest，两者都通过才算护栏有效。
 *    规则匹配「实际使用」而非「标识符出现」；源码断言一律在 stripComments() 后的代码上做。
 *
 * 真相源：FACTS.md（人读） + src/data/site.mjs（机器可读） + 主项目 packages/shared
 *        / src/content/membership.ts / src/pages/PricingSheet.tsx / src/content/legal.ts。
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const APP = join(ROOT, 'app');
const SRC = join(ROOT, 'src');
const SITE_SOURCE = join(SRC, 'data/site.mjs');

const SUBJECT = '北京迪蜂科技有限公司';
const ICP = '京ICP备2026075565号-1';
const ICP_QUERY = 'https://beian.miit.gov.cn/';
const OTHER_ICP = '京ICP备2026075565号-2'; // 属于 d-bee.cn，本站绝不可出现
const PRODUCT_URL = 'https://d-bee.cn/';
const NAV_IDS = ['home', 'features', 'pricing', 'get', 'help', 'about'];
const PLAN_IDS = ['dbee_pro_monthly', 'dbee_pro_yearly', 'dbee_lifetime'];
const LEGAL_URLS = [
  'https://d-bee.cn/legal/privacy/',
  'https://d-bee.cn/legal/terms/',
  'https://d-bee.cn/legal/disclaimer/',
];

/* ==================== 主项目真源快照（2026-11-11 逐字抄录，不得润色） ==================== */

/** membership.ts:23-33 */
const SOURCE_FREE_ITEMS = [
  '每日 3 次免费 AI 拍照识别（识别成功才扣次数）',
  '积分可再兑换拍照识别，每日最多 2 次（50 积分/次）',
  '蜜糖积分可兑 Pro 天数（100 分兑 1 天、2600 分兑 30 天），在「蜜糖积分」页兑换',
  '扫条码不限次数永久免费',
  '文字描述识别、手动录入、体重饮水运动记录全部免费',
  'AI 问答不限次数（每分钟限 3 次防刷）',
  '饮食报告看近 7 天',
  '连续打卡 7 天再送拍照次数',
  '永久无广告、无隐藏扣费',
];
/** membership.ts:43-50 */
const SOURCE_PRO_ITEMS = [
  'AI 拍照识别不限次数',
  'AI 问答不限流',
  '长文本 AI 复盘（本期解读）无限次',
  '个性化完整膳食计划、长期 AI 膳食规划',
  '宏量营养素深度分析',
  '饮食报告扩展到 30 天 + 数据导出',
];
/** rules/index.ts PRODUCTS[].name + priceTag() */
const SOURCE_PLAN_NAMES = ['月订阅', '年订阅', '终身买断'];
const SOURCE_PRICE_TAGS = ['¥18 / 月', '¥128 / 年（约 ¥10.7/月）', '¥298 永久'];
/** PricingSheet.tsx:45-47 / :87-89 */
const PRICING_SHEET_NOTICE = '基础记录功能永久免费；会员为可选项，用于解锁更多 AI 识别次数与更长期限的饮食报告。';
const UNIFIED_PRICE_TEXT = '本页价格为统一定价，对所有用户一致，不因人定价。实际可购渠道与成交价格以对应购买页面展示为准。';
/** legal.ts「五、服务可用性」 */
const PERPETUITY_TEXT = '本服务免费版永久可用，不承诺服务不中断、无差错。';
/** legal.ts「六、订阅与自动续费说明」分渠道口径 */
const RENEWAL_KEY = '会员计费方式因购买渠道而异';
const RENEWAL_REQUIRED = [RENEWAL_KEY, '六、订阅与自动续费说明', '暂不售卖'];
const RENEWAL_PAGES = ['index.html', 'pricing.html', 'help.html', 'legal.html'];

/* ==================== 禁用表述 ==================== */

/** 绝对禁止出现的超前宣传 / 过期表述 */
const BANNED = [
  ['ICP 备案办理中', 'FACTS §1：-1 备案已下证，须公示备案号'],
  ['备案流程进行中', 'FACTS §1：-1 备案已下证'],
  ['全平台已上架', 'FACTS §3：四端均未全量上架'],
  ['全平台发布', 'FACTS §3：四端均未全量上架'],
  ['评分 4.9', 'FACTS §3：无可验证评分来源'],
  ['材料齐备', 'FACTS §2：软著申请中、商标未提交'],
  ['资质齐备', 'FACTS §2：多项备案仍在审核中'],
  ['已获批', 'FACTS §2：不得超前宣称'],
  ['应用商店', 'FACTS §3：商店未上架'],
  ['扫码下载', 'FACTS §6：二维码为占位图'],
  ['与 APP 内版本保持一致', 'FACTS §5：法务文案未逐条对齐'],
  ['鸿蒙全平台', 'FACTS §3：鸿蒙端不在四端定义内'],
  ['番茄专注', '原型定位错误：真实产品为饮食热量记录'],
  ['习惯打卡', '原型定位错误：真实产品为饮食热量记录'],
  ['AI 习惯养成', '原型定位错误：真实产品为饮食热量记录'],
  ['考研备考', '原型定位错误：无 persona 依据'],
];

/** 虚构数字 / 疗效类表述（真源中不存在） */
const FAKE_CLAIMS = [
  '1200+ 常见食物', '12 枚成就徽章', '首批 2000', '38.6MB', 'v1.2.0',
  'AI 精准识别', '减肥疗效', '医疗诊断', '保证效果', '减脂效果',
  '内测评分', '下载量', '好评率',
];

/**
 * 🔴 2026-11-11 新增：与主项目真源冲突的「自造 / 绝对化 / 超前」宣传口径。
 *    这些句子此前护栏完全漏检（如「除 iOS 内购订阅外…现有购买方式」），
 *    现同时作用于 HTML 产物与 src/**.mjs 源码。
 */
const BANNED_COPY = [
  ['除 iOS 内购订阅外', '收款未开通时不得描述现有购买方式；统一用 RENEWAL_NOTE'],
  ['现有购买方式', '收款通道未开通，不存在购买方式'],
  ['一次性预付，不自动续费', '绝对化续费断言，与用户协议 §六 分渠道口径冲突'],
  ['道具直购为一次性预付', '绝对化续费断言；改为分渠道口径'],
  ['不自动续费、不自动扣款', '绝对化续费断言；可写「到期后权益自然结束」'],
  ['几秒钟完成', '真源中无完成速度声称'],
  ['不靠打扰换增长', '产品含打卡 / 饮水提醒，属无依据绝对化表述'],
  ['不做诱导付费', '主端真源为「永久无广告、无隐藏扣费」，不得扩展'],
  ['账号与注销体系完整', '注销流程以产品内隐私政策为准，不得宣称体系完整'],
  ['自建 PostgreSQL', '法务口径为「由我们自己部署与运维的数据库」'],
  ['AI 显式标识已落地', '按产品内隐私政策「AI 生成内容标识说明」表述'],
  ['产品内已经落地的能力', '改为「产品内公示的能力」'],
  ['Pro 月卡', '档位名真源为「月订阅」'],
  ['Pro 年卡', '档位名真源为「年订阅」'],
  ['一次买断', '档位名真源为「终身买断」，且不得自造周期'],
  ['bee.svg', '旧自绘蜜蜂图标已下线，唯一图标资产为 icon-512.png'],
];

/** 旧原型资产 / 商店链接（改造后不得残留） */
const LEGACY_PATTERNS = [
  /qr-[\w-]+\.svg/,
  /\b(?:blog|changelog|download|privacy|terms)\.html/,
  /apps\.apple\.com|play\.google\.com|appgallery\.huawei/,
  /自动续订/,
];

/** 品牌图标：全站唯一资产（src 由 icon-512.png 原样复制，其余尺寸等比派生） */
const ICON_NEEDLES = [
  'href="assets/img/favicon.png"',
  'href="assets/img/apple-touch-icon.png"',
  'property="og:image"',
  'src="assets/img/icon-512.png"',
];
const ICON_ASSETS = [
  'assets/img/favicon.png', 'assets/img/apple-touch-icon.png',
  'assets/img/icon-192.png', 'assets/img/icon-512.png',
];

/** 否定语境豁免：把「不自动续费」等合规表述从待检文本中抹去 */
function maskNegations(t) {
  return t
    .replace(/不(?:会|需要|存在|支持)?自动续费/g, '')
    .replace(/不自动扣款/g, '')
    .replace(/无需(?:手动)?取消/g, '');
}

/** 🔴 源码断言必须在去注释后的代码上做（注释里出现禁用词属说明，不是使用） */
function stripComments(s) {
  return s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|\s)\/\/.*$/gm, '$1');
}
function stripHtmlComments(s) {
  return s.replace(/<!--[\s\S]*?-->/g, '');
}

const htmlFiles = (files) => files.filter(([n]) => n.endsWith('.html'));
const srcFiles = (files) => files.filter(([n]) => n.startsWith('__src/') || n === '__site.mjs');

/** 单文件规则包装器 */
function perFile(fn) {
  return (files) => htmlFiles(files).flatMap(([name, text]) =>
    fn(stripHtmlComments(text)).map((msg) => `    ${name}:${lineOf(text, msg.__needle)}  ${msg.text ?? msg}`),
  );
}
function hit(text, needle) { return { __needle: needle, text: text }; }
function lineOf(text, needle) {
  if (!needle) return '-';
  const i = text.indexOf(needle);
  return i < 0 ? '-' : text.slice(0, i).split('\n').length;
}

/** 把一组 [禁用词, 原因] 应用到给定文本 */
function copyHits(t, list) {
  return list.filter(([w]) => t.includes(w)).map(([w, why]) => hit(`命中「${w}」→ ${why}`, w));
}

/**
 * 规则集。每条 test(files) 返回违规描述数组（空 = 通过）。
 * files 含 ['__site.mjs', ...]、['__src/...', ...] 源码项，供源码级规则使用。
 */
const RULES = [
  {
    id: 'subject',
    desc: `每页必须公示运营主体「${SUBJECT}」`,
    test: perFile((t) => (t.includes(SUBJECT) ? [] : [hit('缺少运营主体全称', SUBJECT)])),
  },
  {
    id: 'icp-number',
    desc: `每页页脚必须含本站备案号「${ICP}」`,
    test: perFile((t) => (t.includes(ICP) ? [] : [hit('缺少本站 -1 备案号', ICP)])),
  },
  {
    id: 'icp-link',
    desc: `备案号须可点击指向 ${ICP_QUERY}`,
    test: perFile((t) => (t.includes(ICP_QUERY) ? [] : [hit('缺少工信部备案查询链接', ICP_QUERY)])),
  },
  {
    id: 'icp-no-cross',
    desc: `本站不得出现属于 d-bee.cn 的「${OTHER_ICP}」`,
    test: perFile((t) => (t.includes(OTHER_ICP) ? [hit('出现 -2 串号，合规违规', OTHER_ICP)] : [])),
  },
  {
    id: 'no-banned',
    desc: '不得含超前宣传 / 过期表述 / 错误产品定位（见 FACTS.md）',
    test: perFile((t) => {
      const checked = maskNegations(t);
      return BANNED.filter(([w]) => checked.includes(w))
        .map(([w, why]) => hit(`命中「${w}」→ ${why}`, w));
    }),
  },
  {
    id: 'no-autorenew-claim',
    desc: '不得出现肯定式「自动续费 / 订阅制」表述（否定式是合规要求，放行）',
    test: perFile((t) => {
      const bad = /(?:支持|默认|开启|到期前|将)(?:自动续费|自动扣款)|自动续费(?:扣款|开通|生效)|订阅制|自动续订/;
      const m = t.match(bad);
      return m ? [hit(`命中肯定式续费表述「${m[0]}」→ FACTS §4 分渠道口径`, m[0])] : [];
    }),
  },
  {
    id: 'no-fake-claims',
    desc: '不得出现无真源依据的数字、评分与疗效表述',
    test: perFile((t) => FAKE_CLAIMS.filter((w) => t.includes(w))
      .map((w) => hit(`命中无依据表述「${w}」`, w))),
  },
  {
    id: 'no-legacy',
    desc: '不得残留旧原型资产 / 商店链接 / 旧页面名',
    test: perFile((t) => LEGACY_PATTERNS.filter((re) => re.test(t))
      .map((re) => hit(`残留旧原型引用「${String(re)}」`, null))),
  },
  {
    id: 'brand-icon',
    desc: '每页必须使用真实产品图标 icon-512.png，且旧自绘 bee.svg 零残留',
    test: perFile((t) => {
      const out = ICON_NEEDLES.filter((n) => !t.includes(n))
        .map((n) => hit(`缺图标引用/元数据 ${n}`, n));
      if (/bee\.svg|<svg[^>]+class="bee-logo"/.test(t)) out.push(hit('残留旧自绘蜜蜂 SVG 图标', 'bee-logo'));
      return out;
    }),
  },
  {
    id: 'copy-truth',
    desc: `产物 HTML 不得出现 ${BANNED_COPY.length} 类自造 / 绝对化宣传口径`,
    test: perFile((t) => copyHits(t, BANNED_COPY)),
  },
  {
    id: 'source-scan',
    desc: 'src/**.mjs 源码同样受禁用词约束（在去注释后的代码上断言）',
    test: (files) => srcFiles(files).flatMap(([name, text]) => {
      const t = stripComments(text);
      const out = [];
      out.push(...copyHits(maskNegations(t), BANNED).map((h) => `    ${name}  ${h.text}`));
      out.push(...FAKE_CLAIMS.filter((w) => t.includes(w)).map((w) => `    ${name}  命中无依据表述「${w}」`));
      out.push(...copyHits(t, BANNED_COPY).map((h) => `    ${name}  ${h.text}`));
      out.push(...LEGACY_PATTERNS.filter((re) => re.test(t))
        .map((re) => `    ${name}  残留旧原型引用 ${String(re)}`));
      return out;
    }),
  },
  {
    id: 'renewal-truth',
    desc: '续费口径必须是分渠道 + 指向用户协议；不得残留绝对化断言',
    test: (files) => {
      const out = [];
      const src = files.filter(([n]) => n === '__site.mjs' || n === '__src/data/site.mjs');
      for (const [name, text] of src) {
        const note = (text.match(/RENEWAL_NOTE\s*=\s*([\s\S]*?);/) || [])[1] || '';
        const missing = RENEWAL_REQUIRED.filter((w) => !note.includes(w));
        if (missing.length) out.push(`    ${name}  RENEWAL_NOTE 缺 [${missing.join(', ')}]`);
      }
      for (const name of RENEWAL_PAGES) {
        const p = files.find(([n]) => n === name);
        if (!p) { out.push(`    缺少 ${name}`); continue; }
        if (!p[1].includes(RENEWAL_KEY)) out.push(`    ${name}  缺分渠道续费口径「${RENEWAL_KEY}」`);
      }
      return out;
    },
  },
  {
    id: 'membership-truth',
    desc: '免费版 9 条 + Pro 6 条权益须与 membership.ts 逐字一致',
    test: (files) => {
      const out = [];
      const targets = [
        ['__site.mjs', 'site.mjs 机器真源'],
        ['__src/data/site.mjs', 'site.mjs 源码'],
        ['features.html', '权益展示页'],
      ];
      for (const [name, label] of targets) {
        const p = files.find(([n]) => n === name);
        if (!p) { out.push(`    缺少 ${name}`); continue; }
        const t = stripComments(p[1]);
        const missing = [...SOURCE_FREE_ITEMS, ...SOURCE_PRO_ITEMS].filter((s) => !t.includes(s));
        if (missing.length) out.push(`    ${name} (${label}) 逐字缺 ${missing.length} 条：${missing.slice(0, 2).join(' / ')}${missing.length > 2 ? ' …' : ''}`);
      }
      return out;
    },
  },
  {
    id: 'pricing-language-truth',
    desc: '三档档位名 / priceTag / 定价页两段原文须逐字一致',
    test: (files) => {
      const out = [];
      const targets = ['__site.mjs', '__src/data/site.mjs', 'pricing.html'];
      for (const name of targets) {
        const p = files.find(([n]) => n === name);
        if (!p) { out.push(`    缺少 ${name}`); continue; }
        const t = stripComments(p[1]);
        const missing = [...SOURCE_PLAN_NAMES, ...SOURCE_PRICE_TAGS, PRICING_SHEET_NOTICE, UNIFIED_PRICE_TEXT]
          .filter((s) => !t.includes(s));
        if (missing.length) out.push(`    ${name} 逐字缺 ${missing.length} 项：${missing.slice(0, 2).join(' / ')}${missing.length > 2 ? ' …' : ''}`);
      }
      return out;
    },
  },
  {
    id: 'perpetuity-qualifier',
    desc: '凡写「永久 / 长期可用」的页面必须同时写「不承诺服务不中断、无差错」',
    test: perFile((t) => (/永久可用|长期可用|永久免费/.test(t) && !t.includes(PERPETUITY_TEXT)
      ? [hit('永久性表述缺免责限定', '永久')] : [])),
  },
  {
    id: 'ai-provider-truth',
    desc: '隐私与合规页须点名第三方大模型（DeepSeek / 阿里云百炼 Qwen-VL）',
    test: (files) => {
      const p = files.find(([n]) => n === 'trust.html');
      if (!p) return ['    缺少 trust.html'];
      const missing = ['DeepSeek', '阿里云百炼', 'Qwen-VL'].filter((w) => !p[1].includes(w));
      return missing.length ? [`    trust.html  缺第三方供应商 [${missing.join(', ')}]`] : [];
    },
  },
  {
    id: 'source-sync',
    desc: 'src/data/site.mjs 的机器真源须与护栏常量逐字一致',
    test: (files) => {
      const src = files.find(([n]) => n === '__site.mjs')?.[1] ?? '';
      const need = [
        [`subject: '${SUBJECT}'`, '运营主体'],
        [`icp: '${ICP}'`, '备案号'],
        [`icpQuery: '${ICP_QUERY}'`, '工信部链接'],
        [`productUrl: '${PRODUCT_URL}'`, '产品入口'],
      ];
      return need.filter(([s]) => !src.includes(s))
        .map(([, label]) => `    __site.mjs  ${label} 与护栏常量不一致`);
    },
  },
  {
    id: 'nav-consistency',
    desc: `每页主导航必须一致且覆盖 ${NAV_IDS.length} 个入口`,
    test: (files) => htmlFiles(files).flatMap(([name, text]) => {
      const found = [...new Set([...text.matchAll(/data-nav="([^"]+)"/g)].map((m) => m[1]))];
      const missing = NAV_IDS.filter((id) => !found.includes(id));
      const extra = found.filter((id) => !NAV_IDS.includes(id));
      return missing.length || extra.length
        ? [`    ${name}  导航缺 [${missing.join(',')}] / 多 [${extra.join(',')}]`]
        : [];
    }),
  },
  {
    id: 'cta-target',
    desc: `主 CTA 必须指向 ${PRODUCT_URL}，且不得出现商店下载链接`,
    test: perFile((t) => {
      const out = [];
      if (!new RegExp(`class="btn btn-primary btn-sm" href="${PRODUCT_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`).test(t)) {
        out.push(hit('头部主 CTA 未指向产品 Web 版', '打开 Web 版'));
      }
      if (/href="https?:\/\/[^"]*(?:apps\.apple|play\.google|appgallery)/.test(t)) {
        out.push(hit('出现应用商店下载链接（尚未上架）', 'apps.apple'));
      }
      return out;
    }),
  },
  {
    id: 'pricing-truth',
    desc: '定价页须含三档真源价格、三个商品 ID 与「暂不售卖」',
    test: (files) => {
      const p = files.find(([n]) => n === 'pricing.html');
      if (!p) return ['    缺少 pricing.html'];
      const t = p[1];
      const missing = [];
      for (const price of ['¥18', '¥128', '¥298']) if (!t.includes(price)) missing.push(price);
      for (const id of PLAN_IDS) if (!t.includes(id)) missing.push(id);
      if (!t.includes('暂不售卖')) missing.push('暂不售卖');
      return missing.length ? [`    pricing.html  缺 [${missing.join(', ')}]`] : [];
    },
  },
  {
    id: 'legal-canonical',
    desc: '法务页须链接到产品内三份权威文档，不得另立版本',
    test: (files) => {
      const p = files.find(([n]) => n === 'legal.html');
      if (!p) return ['    缺少 legal.html'];
      const missing = LEGAL_URLS.filter((u) => !p[1].includes(u));
      return missing.length ? [`    legal.html  缺权威法务链接 [${missing.join(', ')}]`] : [];
    },
  },
  {
    id: 'a11y-seo',
    desc: '每页须有单 h1、skip-link、lang、viewport、description、canonical',
    test: perFile((t) => {
      const out = [];
      const h1 = (t.match(/<h1[\s>]/g) || []).length;
      if (h1 !== 1) out.push(hit(`有 ${h1} 个 h1（应为 1）`, '<h1'));
      for (const needle of ['class="skip-link"', 'lang="zh-CN"', 'name="viewport"', 'name="description"', 'rel="canonical"']) {
        if (!t.includes(needle)) out.push(hit(`缺 ${needle}`, needle));
      }
      return out;
    }),
  },
  {
    id: 'internal-links',
    desc: '站内链接目标必须存在（无死链）',
    test: (files) => {
      const out = [];
      for (const [name, text] of htmlFiles(files)) {
        for (const m of text.matchAll(/href="([^"]+)"/g)) {
          const href = m[1];
          if (/^(https?:|mailto:|data:|#)/.test(href)) continue;
          const target = href.split('#')[0];
          if (!target) continue;
          const known = files.some(([n]) => n === target);
          if (!known && !existsSync(join(APP, target))) {
            out.push(`    ${name}  指向不存在：${target}`);
          }
        }
      }
      return out;
    },
  },
];

/* ============================ 自测样例 ============================ */

const NAV_HREFS = {
  home: 'index.html', features: 'features.html', pricing: 'pricing.html',
  get: 'get.html', help: 'help.html', about: 'about.html',
};

const COMPLIANT_RENEWAL_NOTE =
  '当前会员暂不售卖，官网与 Web 版均不收款、不创建订单。正式开通后，' + RENEWAL_KEY +
  '，以产品内购买页与用户协议「六、订阅与自动续费说明」为准。';

/** 合规单页基线：满足所有 per-file 规则 */
function basePage(extra = '') {
  const nav = NAV_IDS.map((id) => `<a href="${NAV_HREFS[id]}" data-nav="${id}">x</a>`).join('');
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>x</title><meta name="description" content="x"><link rel="canonical" href="https://d-bee.com.cn/x.html">
<link rel="icon" type="image/png" sizes="32x32" href="assets/img/favicon.png">
<link rel="icon" type="image/png" sizes="192x192" href="assets/img/icon-192.png">
<link rel="apple-touch-icon" href="assets/img/apple-touch-icon.png">
<meta property="og:image" content="https://d-bee.com.cn/assets/img/icon-512.png">
</head><body data-page="x"><a class="skip-link" href="#main">跳到主要内容</a>
<header><img class="bee-logo" src="assets/img/icon-512.png" alt="">
<nav>${nav}</nav><a class="btn btn-primary btn-sm" href="${PRODUCT_URL}">打开 Web 版</a></header>
<main id="main"><h1>x</h1><p>${PERPETUITY_TEXT}${COMPLIANT_RENEWAL_NOTE}</p>${extra}</main>
<footer><p>${SUBJECT}</p><a href="${ICP_QUERY}">${ICP}</a></footer></body></html>`;
}

const COMPLIANT_SITE_SOURCE = `export const SITE = {
  subject: '${SUBJECT}', icp: '${ICP}', icpQuery: '${ICP_QUERY}', productUrl: '${PRODUCT_URL}',
};
export const RENEWAL_NOTE = '${COMPLIANT_RENEWAL_NOTE}';
export const FREE_ITEMS = [
${SOURCE_FREE_ITEMS.map((s) => `  '${s}',`).join('\n')}
];
export const PRO_ITEMS = [
${SOURCE_PRO_ITEMS.map((s) => `  '${s}',`).join('\n')}
];
export const PLANS = [
${SOURCE_PLAN_NAMES.map((n, i) => `  { name: '${n}', priceTag: '${SOURCE_PRICE_TAGS[i]}' },`).join('\n')}
];
export const PRICING_NOTICE = '${PRICING_SHEET_NOTICE}';
export const UNIFIED_PRICE_NOTE = '${UNIFIED_PRICE_TEXT}';
`;

const SELF_PAGES = [
  'index.html', 'features.html', 'pricing.html', 'get.html', 'trust.html',
  'help.html', 'about.html', 'legal.html', 'roadmap.html', '404.html',
];
function selftestFiles() {
  const pricingExtra = `<div>${PLAN_IDS.map((id) => `data-plan-id="${id}"`).join(' ')} ${SOURCE_PLAN_NAMES.join(' ')} ${SOURCE_PRICE_TAGS.join(' ')} ${PRICING_SHEET_NOTICE} ${UNIFIED_PRICE_TEXT} 暂不售卖</div>`;
  const pages = SELF_PAGES.map((name) => {
    let extra = '';
    if (name === 'pricing.html') extra = pricingExtra;
    if (name === 'legal.html') extra = LEGAL_URLS.map((u) => `<a href="${u}">x</a>`).join('');
    if (name === 'features.html') extra = [...SOURCE_FREE_ITEMS, ...SOURCE_PRO_ITEMS].join(' ');
    if (name === 'trust.html') extra = 'DeepSeek 阿里云百炼 Qwen-VL';
    return [name, basePage(extra)];
  });
  return [
    ...pages,
    ...ICON_ASSETS.map((n) => [n, '']),
    ['__site.mjs', COMPLIANT_SITE_SOURCE],
    ['__src/data/site.mjs', COMPLIANT_SITE_SOURCE],
    ['__src/data/content.mjs', `export const FAQ = ['${COMPLIANT_RENEWAL_NOTE}'];`],
    ['__src/pages/home.mjs', `export default { render: () => '${PERPETUITY_TEXT}' };`],
    ['__src/lib/components.mjs', `export const x = '${PRICING_SHEET_NOTICE}';`],
  ];
}

/** 红验证：每条规则各给一个「故意违规」样例，必须能判红 */
const RED_CASES = {
  subject: (f) => f.map(([n, t]) => [n, n === 'index.html' ? t.replace(SUBJECT, '某某公司') : t]),
  'icp-number': (f) => f.map(([n, t]) => [n, n === 'index.html' ? t.replace(ICP, '备案号待补') : t]),
  'icp-link': (f) => f.map(([n, t]) => [n, n === 'index.html' ? t.replace(ICP_QUERY, 'https://example.com/') : t]),
  'icp-no-cross': (f) => f.map(([n, t]) => [n, n === 'index.html' ? t + OTHER_ICP : t]),
  'no-banned': (f) => f.map(([n, t]) => [n, n === 'index.html' ? t + '全平台已上架' : t]),
  'no-autorenew-claim': (f) => f.map(([n, t]) => [n, n === 'index.html' ? t + '订阅制，支持自动续费' : t]),
  'no-fake-claims': (f) => f.map(([n, t]) => [n, n === 'index.html' ? t + '1200+ 常见食物' : t]),
  'no-legacy': (f) => f.map(([n, t]) => [n, n === 'index.html' ? t + '<img src="qr-download.svg">' : t]),
  'brand-icon': (f) => f.map(([n, t]) => [n, n === 'index.html' ? t.replace('href="assets/img/favicon.png"', 'href="assets/img/bee.svg"') : t]),
  'copy-truth': (f) => f.map(([n, t]) => [n, n === 'index.html' ? t + '几秒钟完成' : t]),
  'source-scan': (f) => f.map(([n, t]) => [n, n === '__src/data/content.mjs' ? t + '全平台已上架' : t]),
  'renewal-truth': (f) => f.map(([n, t]) => [n, n === 'help.html' ? t.replace(RENEWAL_KEY, '') : t]),
  'membership-truth': (f) => f.map(([n, t]) => [n, n === 'features.html' ? t.replace(SOURCE_FREE_ITEMS[0], '每日 5 次 AI 识别') : t]),
  'pricing-language-truth': (f) => f.map(([n, t]) => [n, n === 'pricing.html' ? t.replace('月订阅', 'Pro 月卡') : t]),
  'perpetuity-qualifier': (f) => f.map(([n, t]) => [n, n === 'index.html' ? t.replace(PERPETUITY_TEXT, '免费版永久可用，随时可用。') : t]),
  'ai-provider-truth': (f) => f.map(([n, t]) => [n, n === 'trust.html' ? t.replace('DeepSeek', '') : t]),
  'source-sync': (f) => f.map(([n, t]) => [n, n === '__site.mjs' ? t.replace(SUBJECT, '错误主体') : t]),
  'nav-consistency': (f) => f.map(([n, t]) => [n, n === 'index.html' ? t.replace('data-nav="help"', '') : t]),
  'cta-target': (f) => f.map(([n, t]) => [n, n === 'index.html' ? t.replace(`href="${PRODUCT_URL}"`, 'href="download.html"') : t]),
  'pricing-truth': (f) => f.map(([n, t]) => [n, n === 'pricing.html' ? t.replace('¥128', '¥999') : t]),
  'legal-canonical': (f) => f.map(([n, t]) => [n, n === 'legal.html' ? t.replace(LEGAL_URLS[0], 'https://example.com/') : t]),
  'a11y-seo': (f) => f.map(([n, t]) => [n, n === 'index.html' ? t.replace('class="skip-link"', 'class="nope"') : t]),
  'internal-links': (f) => f.map(([n, t]) => [n, n === 'index.html' ? t + '<a href="missing-page.html">x</a>' : t]),
};

function report(label, results) {
  console.log(`=== ${label} ===`);
  for (const r of results) {
    console.log(`${r.hits.length === 0 ? 'PASS' : 'FAIL'}  ${r.id}  ${r.desc}`);
    r.hits.forEach((h) => console.log(h));
  }
  return results.filter((r) => r.hits.length > 0).length;
}

/* ============================ 入口 ============================ */
const mode = process.argv.includes('--redtest') ? 'redtest' : process.argv.includes('--selftest') ? 'selftest' : 'check';

if (mode === 'selftest') {
  const files = selftestFiles();
  const results = RULES.map((r) => ({ id: r.id, desc: r.desc, hits: r.test(files) }));
  const failed = report('selftest：合规样例站点验证规则集可满足', results);
  console.log(`\n${results.length - failed} 通过 / ${failed} 失败`);
  process.exit(failed ? 1 : 0);
}

if (mode === 'redtest') {
  console.log('=== redtest：逐条规则故意违规，必须各自判红 ===');
  let failed = 0;
  for (const rule of RULES) {
    const mutate = RED_CASES[rule.id];
    if (!mutate) { console.log(`FAIL  ${rule.id}  缺少红验证样例`); failed++; continue; }
    const bad = mutate(selftestFiles());
    const hits = rule.test(bad);
    const ok = hits.length > 0;
    if (!ok) failed++;
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${rule.id}  ${ok ? `判红 ${hits.length} 处` : '❌ 漏检'}`);
  }
  console.log(`\n${RULES.length - failed} 条规则通过红验证 / ${failed} 条漏检`);
  process.exit(failed ? 1 : 0);
}

if (!existsSync(APP)) { console.error(`找不到站点目录：${APP}`); process.exit(2); }
const files = readdirSync(APP).filter((f) => f.endsWith('.html')).sort()
  .map((f) => [f, readFileSync(join(APP, f), 'utf8')]);
if (existsSync(SITE_SOURCE)) files.push(['__site.mjs', readFileSync(SITE_SOURCE, 'utf8')]);

// 源码级扫描：data / pages / lib 全量纳入，防止「源码里有、当前页面恰好没渲染」的漏网
for (const sub of ['data', 'pages', 'lib']) {
  const dir = join(SRC, sub);
  if (!existsSync(dir)) continue;
  for (const f of readdirSync(dir).filter((x) => x.endsWith('.mjs')).sort()) {
    files.push([`__src/${sub}/${f}`, readFileSync(join(dir, f), 'utf8')]);
  }
}

console.log(`=== 官网发布前护栏 · ${htmlFiles(files).length} 个页面 / ${srcFiles(files).length} 个源文件 / ${RULES.length} 条规则 ===\n`);
const results = RULES.map((r) => ({ id: r.id, desc: r.desc, hits: r.test(files) }));
const failed = report('检查结果', results);
const totalHits = results.reduce((n, r) => n + r.hits.length, 0);
console.log(`\n${results.length - failed} 通过 / ${failed} 失败 / 共 ${totalHits} 处命中`);
if (failed) {
  console.log('\n整改依据：FACTS.md + 主项目 docs/官网原型与工作区治理评估-2026-11-11.md §二');
  console.log('🔴 检查未全绿前，本站点不得对外发布。');
}
process.exit(failed ? 1 : 0);
