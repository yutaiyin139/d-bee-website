# 自律蜜蜂 D-Bee 官网（d-bee.com.cn）

品牌官网：产品介绍 / 定价公示 / 帮助中心 / 隐私与合规 / 法务入口。
**源码驱动、零运行时依赖、产物为纯静态 HTML**，nginx 直接托管 `app/`。

> ✅ **当前状态（2026-11-11）：已完成整体设计与改造，可对外发布。**
> 10 个页面由 `src/` 统一构建；构建门禁、`check-facts` **23 条规则**、selftest 23/23、redtest 23/23 全绿。
> 2026-11-11 追加：品牌图标全站替换为真实产品 `icon-512.png`，宣传口径逐字对齐主项目真源。
> 原型已归档到 `reference/prototype-2026-11-01/`，**不再部署、不再维护**。

---

## 1. 为什么重写，而不是修 8 处文案

2026-11-01 的原型描述的是「AI 习惯养成 / 番茄专注 / 打卡追踪」，而自律蜜蜂真实产品是
**「AI 拍照识别饮食热量的记录工具」** —— 是完全不同的产品。因此重写的是产品逻辑、信息架构与内容，
只沿用原型已被验证的视觉语言（米白奶油底 + 蜂蜜琥珀 `#F2A93B`、卡片体系、蜂巢纹样）；
品牌 logo 已改用真实产品 App 图标 `icon-512.png`，原自绘蜜蜂 SVG 全部下线。

原型的 8 项合规硬伤在重写中一并消解（不是逐条打补丁）：

| 原硬伤 | 现在的做法 |
| --- | --- |
| 页脚「ICP 备案办理中」 | 共享页脚统一输出 `京ICP备2026075565号-1` + 工信部链接 |
| 「全平台已上架 / 评分 4.9 / v1.2.0 全平台发布」 | 四端状态由 `PLATFORMS` 单一真源驱动，如实标注「已上线 / 内测中」 |
| 「应用商店 / 扫码下载」 | 无二维码、无商店链接；唯一 CTA 指向 `https://d-bee.cn/` |
| 「软著与商标材料齐备」 | 资质真源 `QUALIFICATIONS` 逐项公示「申请中 / 审核中 / 办理中」 |
| 「订阅制 / 自动续费」 | 定价页统一「暂不售卖」，计费方式按 `RENEWAL_NOTE` 指向产品内用户协议「六、订阅与自动续费说明」，卡片 `aria-disabled` |
| 隐私政策自称「与 APP 内版本保持一致」 | 官网**不复制法务全文**，只提供产品内三份权威文档的入口与摘要 |
| 「本地优先 / 不接统计 SDK」 | `trust.html` 如实写明境内自建数据库云端同步，并点名 DeepSeek / 阿里云百炼 Qwen-VL |
| 虚构的 changelog / blog / 证言 | 全部删除，改为「上线进展」页公示真实状态，不承诺日期 |

---

## 2. 架构：单一事实源 + 共享布局 + 零依赖构建

```
E:\DEV\d-bee-website\
├ src/
│  ├ data/
│  │   ├ site.mjs          🔴 站点级唯一事实源（主体/备案/域名/导航/四端/三档/资质/法务链接）
│  │   └ content.mjs       页面级文案（FAQ / 理念 / 进展）
│  ├ lib/
│  │   ├ html.mjs          转义、线性图标系统、🔴 品牌 App 图标（icon-512.png）、蜂巢 SVG
│  │   ├ layout.mjs        全站 head / SEO / JSON-LD / 导航 / 页脚 / CTA / 合规骨架
│  │   └ components.mjs    可复用组件（定价卡、状态表、FAQ、时间线、界面示意…）
│  ├ pages/*.mjs           10 个页面，只声明内容与 SEO，外壳全部复用
│  └ assets/               site.css（设计系统）/ site.js / img/icon-512.png 及派生尺寸
├ tools/
│  ├ build.mjs             构建器：渲染 app/ + sitemap/robots + 构建期门禁（含图标唯一性）
│  └ check-facts.mjs       发布前护栏：23 条规则 + selftest + redtest + 源码级扫描
├ app/                     ✅ 构建产物（= 部署 web root，随仓库发布）
├ reference/prototype-2026-11-01/   原型归档，仅供样式参考
├ deploy/                  双域名 nginx 配置与幂等安装脚本
├ FACTS.md                 🔴 人读唯一事实清单
└ package.json             脚本入口（零 dependencies）
```

**改一处，全站生效**：主体、备案号、导航、四端状态、三档价格、资质状态、法务链接全部只在 `site.mjs` 定义一次；
页脚、SEO、结构化数据、跳转链接由 `layout.mjs` 统一注入，不存在「9 页各复制一份 header/footer」。

产物仍是纯静态：无 CDN、无 webfont、无第三方 JS、无表单后端，断网也能打开。

---

## 3. 页面清单

| 页面 | 内容 |
| --- | --- |
| `index.html` | 首屏（真实 slogan + 产品界面示意）、三步流程、能力概览、四项承诺、定价预览、四端状态、FAQ 精选 |
| `features.html` | 免费版 9 条 / Pro 6 条权益、计次口径、AI 能力与标识、饮水体重运动与报告 |
| `pricing.html` | 三档明码标价、暂不售卖公告、免费版与蜜糖积分、兑换码、会员 FAQ |
| `get.html` | Web 版入口、四端状态表、移动端在做什么（无安装包 / 无二维码） |
| `trust.html` | 数据处理、AI 生成内容标识、资质与备案状态、法务文档入口 |
| `help.html` | 5 类 20 问，带分类与搜索；FAQPage 结构化数据 |
| `about.html` | 主体信息、品牌理念、资质状态、联系方式 |
| `legal.html` | 法务入口页：只链接产品内三份权威文档，不另立版本 |
| `roadmap.html` | 上线进展时间线，如实公示、不承诺日期 |
| `404.html` | 未找到页（`noindex`） |

### 品牌图标资产（2026-11-11 全站替换）

唯一源图 `src/assets/img/icon-512.png`，来自
`E:/2026新起点/小宝/dbee/D-Bee图标备份/icon-512.png`（512×512 真实产品 App 图标，原样复制）。
`favicon.png`(32) / `apple-touch-icon.png`(180) / `icon-192.png`(192) 均由它等比缩放派生。
构建时 `app/assets/img/` 先清空再拷，旧自绘 `bee.svg` 不会残留；
`html.mjs` 的 `brandIcon()` / `BEE_ICON` 是全站唯一入口，favicon、apple-touch、og:image、
JSON-LD `Organization.logo` 与 header / footer / 示意卡 / 404 全部指向同一资产。

---

## 4. 命令

```bash
npm run build       # 渲染 app/，构建期门禁失败即 exit 1
npm run check       # 发布前护栏（23 条规则，扫 10 页 HTML + 16 个源文件）
npm run selftest    # 合规样例站点：证明规则集可被满足
npm run redtest     # 🔴 逐条规则故意违规，验证能判红（不得漏检）
npm run verify      # build + selftest + redtest + check 一次跑完
npm run dev         # 本地预览 http://127.0.0.1:8080/
```

🔴 **新增/修改任一护栏规则后必须同时跑 selftest 与 redtest**（项目铁律）。
规则匹配「实际使用」而非「标识符出现」：例如「不自动续费」放行、「订阅制」判红；
源码级断言一律在 `stripComments()` 之后做，注释里提到禁用词不算违规。
`membership-truth` / `pricing-language-truth` 把主项目 `membership.ts` 的 15 条权益文案、
`rules/index.ts` 的三档档位名与 `priceTag()`、`PricingSheet.tsx` 的两段原文**钉成逐字快照**，
主项目改口径而官网没跟上会直接判红。

### 构建期门禁（`tools/build.mjs`）
页面 id/href 唯一 · 站内链接目标存在 · 每页含主体 / `-1` 备案号 / 工信部链接且无 `-2` 串号 ·
单 `<h1>` · skip-link / canonical / description / lang / viewport 齐备 ·
**每页含 favicon / apple-touch / og:image / `icon-512.png` 品牌图标，且无 `bee.svg` 残留**。

### 发布前护栏（`tools/check-facts.mjs`）
在门禁之上再查：禁用词与错误产品定位 · 肯定式自动续费 · 无真源依据的数字与疗效 ·
旧原型资产残留 · **品牌图标唯一性** · **自造/绝对化宣传口径（HTML + 源码）** ·
**分渠道续费口径** · **权益与定价逐字快照** · **永久性表述的免责限定** · **第三方 AI 供应商点名** ·
`site.mjs` 与护栏常量同步 · 导航一致性 · 主 CTA 目标 · 定价三档真源 ·
法务权威链接 · SEO/无障碍 · 内部链接无死链。

---

## 5. 变更纪律

1. 主项目任一**上架状态 / 定价 / 备案 / 法务版本**变化 → 24h 内同步 `FACTS.md`。
2. 先改 `FACTS.md` → 再改 `src/data/site.mjs` / `content.mjs` / 对应页面 → `npm run verify` 全绿。
3. 才部署到 `/var/www/d-bee-corp/`；每次发布前打 tag 留痕。
4. 回滚 = 恢复上一版 `app/` 文件（纯静态，无需重建服务）。

> 🔴 绝不手工编辑 `app/` 下的 HTML：它会在下次 `npm run build` 时被覆盖。

---

## 6. 双域名部署（与自律蜜蜂 Web 端同机、零影响）

服务器 `150.158.51.106`，**不新增端口**：nginx 已监听 80/443，靠 `server_name` 分流。

| 域名 | root | 证书 | 网关 |
| --- | --- | --- | --- |
| `d-bee.cn` / `www`（产品 Web App，`-2`） | `/var/www/d-bee` | `d-bee.cn` | 反代 `127.0.0.1:8080` |
| `d-bee.com.cn` / `www`（本站，`-1`） | `/var/www/d-bee-corp` | 独立 `d-bee-corp` | **不反代**，纯静态 |

线上配置已于 2026-11-11 14:38 完成：`sites-enabled/00-d-bee-corp` 独立块 + 独立证书（到期 2027-02-09），
主配置文件 `sites-available/d-bee` **一行未改**。脚本与两阶段 conf 见 `deploy/`，
含 `nginx -t` → reload → `sleep 8` → 强制验收 `d-bee.cn` 200/308 → 失败自动回滚。

**日常发布只需同步文件**，不改 nginx、不 reload：

```bash
# 把 app/ 内容同步到 /var/www/d-bee-corp/（保留 index.html 备份以便回滚）
sudo cp -a app/. /var/www/d-bee-corp/
```

> 详情页脚备案号、公安联网备案（**12-06 前**，下证前不展示假号）、证书续期注意事项见 `FACTS.md`。

---

## 7. 已知边界（发布后仍需如实维护）

- 移动端（小程序 / Android / iOS）**未正式上架**，官网不提供安装包、二维码或商店链接。
- 会员收款通道**未开通**，三档价格只做明码标价公示，卡片不可点击。
- 法务条款以 `d-bee.cn/legal/` 产品内公示版本为准；官网不复制全文。
- 公安联网备案办理中，`POLICE_BEIAN` 为空时页脚不渲染任何编号。
- 「内测 / 体验版 / 真机调试」不等于正式上线，状态变化先改 `FACTS.md`。

---

## 8. Git

- 本地仓库 `main`；远程 **`https://github.com/yutaiyin139/d-bee-website.git`**（2026-11-11 由用户创建空仓库）。
- 与主项目 `github.com/yutaiyin139/d-bee.git` **严格分离**：`-1` / `-2` 备案号不串、发布节奏不耦合。

```bash
git add -A && git commit -m "..."
git -c http.sslBackend=openssl push origin main
```

Windows 若遇 `schannel: failed to receive handshake` 或代理 `502 CONNECT tunnel failed`，用上面的 openssl 后端；
本机直连 `github.com:443` 不通，必须走代理，代理故障通常瞬时、稍后重试即可。

---

## 9. 相关文档

- 主项目 `docs/四端正式上线前置条件与实施序列-2026-11-11.md` —— 四端状态与依赖
- 主项目 `docs/官网原型与工作区治理评估-2026-11-11.md` —— 原型 8 项硬伤逐条依据
- 主项目 `packages/shared/src/constants/index.ts` —— 备案号、定价、主体、法务版本的代码级真源
- 主项目 `packages/shared/src/rules/index.ts` —— 三档档位名（`PRODUCTS`）与 `priceTag()`
- 主项目 `src/content/membership.ts` —— 免费版 9 条 / Pro 6 条权益逐字真源
- 主项目 `src/pages/PricingSheet.tsx` —— 「会员是可选的」notice 与统一定价声明
- 主项目 `src/content/legal.ts` —— §六 分渠道计费、§五 服务可用性、AI 供应商与标识条款
