#!/usr/bin/env node
/**
 * 官网发布前事实一致性护栏（零依赖、零构建）
 *
 *   node tools/check-facts.mjs              # 检查 app/*.html，有违规 exit 1
 *   node tools/check-facts.mjs --selftest   # 用「整改后样例」验证规则本身可满足（必须全绿）
 *
 * 🔴 当前状态（2026-11-11）：原型有 8 项待整改，默认运行**预期为 FAIL**。
 *    这正是护栏有效的红验证；整改完成后必须转绿，否则不得部署。
 * 🔴 新增/修改规则后必须红验证：故意破坏样例文本，确认对应规则判红。
 *
 * 真相源见 ../FACTS.md；主项目 packages/shared/src/constants/index.ts。
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const APP = join(ROOT, 'app');

const SUBJECT = '北京迪蜂科技有限公司';
const ICP = '京ICP备2026075565号-1';
const ICP_QUERY = 'https://beian.miit.gov.cn/';
const OTHER_ICP = '京ICP备2026075565号-2'; // 属于 d-bee.cn，本站绝不可出现

/** 超前宣传 / 过期表述禁用词：命中即违规，附整改指向 */
const BANNED = [
  ['ICP 备案办理中', 'FACTS §1：-1 备案已下证，须公示备案号'],
  ['备案流程进行中', 'FACTS §1：-1 备案已下证'],
  ['全平台已上架', 'FACTS §3：四端均未全量上架'],
  ['全平台发布', 'FACTS §3：四端均未全量上架'],
  ['评分 4.9', 'FACTS §3：无可验证评分来源'],
  ['材料齐备', 'FACTS §2：软著申请中、商标未提交'],
  ['自动续费', 'FACTS §4：道具直购不自动续费'],
  ['应用商店', 'FACTS §3/§4：商店未上架、且不按商店定价'],
  ['扫码下载', 'FACTS §6：二维码为占位图'],
  ['与 APP 内版本保持一致', 'FACTS §5：法务文案未逐条对齐，不得自称一致'],
];

/**
 * 规则作用于「单个页面的文本」。返回违规描述数组，空数组 = 通过。
 * 每条规则独立、可单测；--selftest 用同一组规则跑合规样例。
 */
const RULES = [
  {
    id: 'subject',
    desc: `每页必须公示运营主体「${SUBJECT}」`,
    test: (t) => (t.includes(SUBJECT) ? [] : ['缺少运营主体全称']),
  },
  {
    id: 'icp-number',
    desc: `每页页脚必须含本站备案号「${ICP}」`,
    test: (t) => (t.includes(ICP) ? [] : ['缺少本站 -1 备案号']),
  },
  {
    id: 'icp-link',
    desc: `备案号须可点击指向 ${ICP_QUERY}`,
    test: (t) => (t.includes(ICP_QUERY) ? [] : ['缺少工信部备案查询链接']),
  },
  {
    id: 'icp-no-cross',
    desc: `本站不得出现属于 d-bee.cn 的「${OTHER_ICP}」`,
    test: (t) => (t.includes(OTHER_ICP) ? ['出现 -2 串号，合规违规'] : []),
  },
  {
    id: 'no-banned',
    desc: '不得含超前宣传 / 过期表述（见 FACTS.md）',
    test: (t) =>
      BANNED.filter(([word]) => t.includes(word)).map(
        ([word, why]) => `命中「${word}」→ ${why}`,
      ),
  },
];

/** 合规样例：仅用于 --selftest，证明规则集可被满足（不是永远判红） */
const COMPLIANT_SAMPLE = `<html><body>
  <p>${SUBJECT}</p>
  <footer><a href="${ICP_QUERY}">${ICP}</a> · 内测中，敬请期待</footer>
  <p>Web 版已上线，移动端内测预约开放。会员暂不售卖。</p>
</body></html>`;

function lineOf(text, needle) {
  const i = text.indexOf(needle);
  return i < 0 ? 0 : text.slice(0, i).split('\n').length;
}

function run(files) {
  const results = [];
  for (const rule of RULES) {
    const hits = [];
    for (const [name, text] of files) {
      for (const msg of rule.test(text)) {
        const word = BANNED.find(([w]) => msg.includes(`「${w}」`))?.[0];
        hits.push(`    ${name}:${word ? lineOf(text, word) : '-'}  ${msg}`);
      }
    }
    results.push({ ...rule, hits });
  }
  return results;
}

const selftest = process.argv.includes('--selftest');

if (selftest) {
  const sample = [['<合规样例>', COMPLIANT_SAMPLE]];
  const results = run(sample);
  console.log('=== selftest：用整改后样例验证规则可满足 ===');
  for (const r of results) {
    console.log(`${r.hits.length === 0 ? 'PASS' : 'FAIL'}  ${r.id}  ${r.desc}`);
    r.hits.forEach((h) => console.log(h));
  }
  const failed = results.filter((r) => r.hits.length > 0).length;
  console.log(`\n${results.length - failed} 通过 / ${failed} 失败`);
  process.exit(failed > 0 ? 1 : 0);
}

if (!existsSync(APP)) {
  console.error(`找不到站点目录：${APP}`);
  process.exit(2);
}

const files = readdirSync(APP)
  .filter((f) => f.endsWith('.html'))
  .sort()
  .map((f) => [f, readFileSync(join(APP, f), 'utf8')]);

console.log(`=== 官网事实一致性检查 · ${files.length} 个页面 ===\n`);
const results = run(files);
for (const r of results) {
  console.log(`${r.hits.length === 0 ? 'PASS ✅' : 'FAIL ❌'}  ${r.id}  ${r.desc}`);
  r.hits.forEach((h) => console.log(h));
}

const failed = results.filter((r) => r.hits.length > 0).length;
const totalHits = results.reduce((n, r) => n + r.hits.length, 0);
console.log(`\n${results.length - failed} 通过 / ${failed} 失败 / 共 ${totalHits} 处命中`);
if (failed > 0) {
  console.log('\n整改依据：FACTS.md + docs/官网原型与工作区治理评估-2026-11-11.md §二');
  console.log('🔴 检查未全绿前，本站点不得对外发布。');
}
process.exit(failed > 0 ? 1 : 0);
