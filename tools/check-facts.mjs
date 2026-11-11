#!/usr/bin/env node
/**
 * 官网发布前护栏（零依赖）。
 *
 *   node tools/check-facts.mjs              # 检查 app/*.html + src/data/site.mjs，全绿 exit 0
 *   node tools/check-facts.mjs --selftest   # 用「合规样例站点」验证规则集可被满足
 *   node tools/check-facts.mjs --redtest    # 🔴 逐条规则红验证：故意违规，必须各自判红
 *
 * 🔴 铁律：新增/修改任一规则后必须跑 --selftest 与 --redtest，两者都通过才算护栏有效。
 *    规则匹配「实际使用」而非「标识符出现」；否定语境（如「不自动续费」）不算违规。
 *
 * 真相源：FACTS.md（人读） + src/data/site.mjs（机器可读） + 主项目 packages/shared。
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const APP = join(ROOT, 'app');
const SITE_SOURCE = join(ROOT, 'src/data/site.mjs');

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

/** 旧原型资产 / 商店链接（改造后不得残留） */
const LEGACY_PATTERNS = [
  /qr-[\w-]+\.svg/,
  /\b(?:blog|changelog|download|privacy|terms)\.html/,
  /apps\.apple\.com|play\.google\.com|appgallery\.huawei/,
  /自动续订/,
];

/** 否定语境豁免：把「不自动续费」等合规表述从待检文本中抹去 */
function maskNegations(t) {
  return t
    .replace(/不(?:会|需要|存在|支持)?自动续费/g, '')
    .replace(/不自动扣款/g, '')
    .replace(/无需(?:手动)?取消/g, '');
}

const htmlFiles = (files) => files.filter(([n]) => n.endsWith('.html'));

/** 单文件规则包装器 */
function perFile(fn) {
  return (files) => htmlFiles(files).flatMap(([name, text]) =>
    fn(text).map((msg) => `    ${name}:${lineOf(text, msg.__needle)}  ${msg.text ?? msg}`),
  );
}
function hit(text, needle) { return { __needle: needle, text: text }; }
function lineOf(text, needle) {
  if (!needle) return '-';
  const i = text.indexOf(needle);
  return i < 0 ? '-' : text.slice(0, i).split('\n').length;
}

/**
 * 规则集。每条 test(files) 返回违规描述数组（空 = 通过）。
 * files 额外包含一项 ['__site.mjs', 源码文本]，供 source-sync 规则使用。
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
    desc: '不得出现肯定式「自动续费 / 订阅制」表述（否定式「不自动续费」是合规要求，放行）',
    test: perFile((t) => {
      const bad = /(?:支持|默认|开启|到期前|将)(?:自动续费|自动扣款)|自动续费(?:扣款|开通|生效)|订阅制|自动续订/;
      const m = t.match(bad);
      return m ? [hit(`命中肯定式续费表述「${m[0]}」→ FACTS §4 道具直购不自动续费`, m[0])] : [];
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

/** 合规单页基线：满足所有 per-file 规则 */
const NAV_HREFS = {
  home: 'index.html', features: 'features.html', pricing: 'pricing.html',
  get: 'get.html', help: 'help.html', about: 'about.html',
};
function basePage(extra = '') {
  const nav = NAV_IDS.map((id) => `<a href="${NAV_HREFS[id]}" data-nav="${id}">x</a>`).join('');
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>x</title><meta name="description" content="x"><link rel="canonical" href="https://d-bee.com.cn/x.html">
</head><body data-page="x"><a class="skip-link" href="#main">跳到主要内容</a>
<header><nav>${nav}</nav><a class="btn btn-primary btn-sm" href="${PRODUCT_URL}">打开 Web 版</a></header>
<main id="main"><h1>x</h1><p>Web 版已上线，移动端内测中，敬请期待。会员暂不售卖，不自动续费。</p>${extra}</main>
<footer><p>${SUBJECT}</p><a href="${ICP_QUERY}">${ICP}</a></footer></body></html>`;
}

const COMPLIANT_SITE_SOURCE = `export const SITE = {
  subject: '${SUBJECT}', icp: '${ICP}', icpQuery: '${ICP_QUERY}', productUrl: '${PRODUCT_URL}',
};`;

const SELF_PAGES = [
  'index.html', 'features.html', 'pricing.html', 'get.html', 'trust.html',
  'help.html', 'about.html', 'legal.html', 'roadmap.html', '404.html',
];
function selftestFiles() {
  const pages = SELF_PAGES.map((name) => {
    let extra = '';
    if (name === 'pricing.html') {
      extra = `<div>${PLAN_IDS.map((id) => `data-plan-id="${id}"`).join(' ')} ¥18 ¥128 ¥298 暂不售卖</div>`;
    }
    if (name === 'legal.html') extra = LEGAL_URLS.map((u) => `<a href="${u}">x</a>`).join('');
    return [name, basePage(extra)];
  });
  return [...pages, ['__site.mjs', COMPLIANT_SITE_SOURCE]];
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

console.log(`=== 官网发布前护栏 · ${files.length - 1} 个页面 / ${RULES.length} 条规则 ===\n`);
const results = RULES.map((r) => ({ id: r.id, desc: r.desc, hits: r.test(files) }));
const failed = report('检查结果', results);
const totalHits = results.reduce((n, r) => n + r.hits.length, 0);
console.log(`\n${results.length - failed} 通过 / ${failed} 失败 / 共 ${totalHits} 处命中`);
if (failed) {
  console.log('\n整改依据：FACTS.md + 主项目 docs/官网原型与工作区治理评估-2026-11-11.md §二');
  console.log('🔴 检查未全绿前，本站点不得对外发布。');
}
process.exit(failed ? 1 : 0);
