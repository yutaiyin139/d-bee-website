# 自律蜜蜂 D-Bee 官网（d-bee.com.cn）

品牌官网 / 下载落地页 / 法务公示站。**纯静态、零构建、零运行时依赖**。

> 🔴 **当前状态：原型阶段，不得对外发布。** `app/` 为 2026-11-01 生成的原型原样副本（9 页），
> 存在 **8 项发布前合规硬伤**（见 `docs` 于主项目的评估文档 §二）。
> `node tools/check-facts.mjs` **预期为 FAIL** —— 这就是护栏的红验证，整改后必须转绿。

---

## 为什么是独立项目（与自律蜜蜂主项目分开）

主项目 `zilv-mifeng`（React18 + Vite5 + TS + 四端 + 22 道护栏）里已经写死这条架构决策：

> `packages/shared/src/constants/index.ts:55`
> 「**官网不在本仓库，本仓库任何地方都不该出现 -1**」

- **备案号隔离**：`d-bee.com.cn` = `京ICP备2026075565号-1`（本站）；`d-bee.cn` = `-2`（主项目四端）。两号绝不可串，主项目 `deploy/verify-legal.mjs` 会做双向校验。
- **技术栈隔离**：本站零构建；并入会让 vite/native 共用 `dist/` 的互斥问题扩散，也无谓扩大护栏扫描范围。
- **发布节奏隔离**：本站改文案即可发；主项目须过 887 项测试 + 四端验收 + 生产实证（铁律 #13）。

---

## 目录结构

```
E:\DEV\d-bee-website\
  ├ app/                     ← 站点根目录（部署时以此为 web root），原型原样、本次零改动
  │   ├ index.html … 9 页
  │   └ assets/  css · js · 4 张二维码 SVG（占位图）
  ├ FACTS.md                 ← 🔴 唯一事实清单：主体 / 备案 / 资质 / 上架状态 / 定价 / 法务
  ├ tools/check-facts.mjs    ← 发布前护栏（零依赖）
  ├ .gitignore
  └ README.md
```

> 若托管平台要求**仓库根目录**就含 `index.html`：把 `app/` 内容上提一级即可
> （`git mv app/* .` 后删除空的 `app/`），随后同步 `check-facts.mjs` 里的 `APP` 常量。
> 本次未做此调整，以免动到你刚放入的原型文件。

---

## 本地预览

```bash
cd E:/DEV/d-bee-website/app
python -m http.server 8080
# 打开 http://localhost:8080/
```

或用编辑器 Live Server 直接打开 `app/index.html`。

---

## 发布前检查

```bash
node tools/check-facts.mjs              # 检查 app/*.html，有违规 exit 1
node tools/check-facts.mjs --selftest   # 验证规则本身可满足（应全绿）
```

检查项：运营主体全称 · `-1` 备案号 · 工信部查询链接 · 禁止 `-2` 串号 · 超前宣传/过期表述禁用词。
逐条依据见 `FACTS.md`。**全绿是部署的必要条件，不是充分条件**——还需人工核对法务三页与 App 内版本。

---

## 8 项待整改（按优先级）

1. **9 页页脚**「ICP 备案办理中」→ 改为 `京ICP备2026075565号-1` + 指向 `beian.miit.gov.cn` 的可点击链接；`about.html:89` 同步。
2. **删除超前宣传**：「全平台已上架 / 应用商店下载 / 评分 4.9 / v1.2.0 全平台发布 / 鸿蒙全平台」→ 过渡期改「内测中 / 敬请期待」。
3. `index.html:218`「软件著作权与商标材料齐备」→ 软著申请中、商标未提交，改为如实表述。
4. `terms.html` 订阅制/自动续费/商店定价 → 对齐「道具直购不自动续费」+ 收款开关全 `false` + 三档真源（¥18 / ¥128 / ¥298）。
5. `privacy.html` 与 App 内隐私政策逐条对齐；删除「与 APP 内版本保持一致」的不实声明。
6. 二维码占位图与 `download.html` 商店 URL：上架后换真实链接，过渡期移除「扫码下载」。
7. 主体名称与统一社会信用代码：与营业执照/软著/商标/备案**逐字核对**后写入 `FACTS.md`。
8. 公安联网备案：**2026-12-06 前**办理，下证后两端页脚同步；未下证不得展示假号。

另需核对 `changelog.html` 版本时间线、`blog.html` 文章内容是否与真实发版记录一致。

详细逐条依据 → 主项目 `docs/官网原型与工作区治理评估-2026-11-11.md` §二。
四端真实上架状态 → 主项目 `docs/四端正式上线前置条件与实施序列-2026-11-11.md` §二。

---

## 部署与端口（与 `d-bee.cn` 同一台服务器）

### 结论：**不需要配置任何新端口**

服务器 `150.158.51.106` 上 nginx 已监听 `80` / `443`（另有 `127.0.0.1:8080` 网关、`127.0.0.1:5432` PG，**均仅回环**）。
两个域名共用这两个端口，靠 **`server_name` 虚拟主机**分流到不同 `root`：

| 域名 | server 块 | root | 网关 |
| --- | --- | --- | --- |
| `d-bee.cn` / `www.d-bee.cn` | 现有主块 | `/var/www/d-bee` | 反代 `127.0.0.1:8080` |
| `d-bee.com.cn` / `www.d-bee.com.cn` | **新增独立块** | `/var/www/d-bee-corp` | **不反代**（纯静态） |

🔴 **不要**为官网另开 8081 之类的端口：多一个公网端口 = 多一份暴露面与安全组配置，且用户要带端口访问，毫无收益。

### 线上实测现状（2026-11-11 13:38 基线，与仓库模板不一致）

> 🔴 **状态更新 2026-11-11 14:39：下方「未上线 / 无 A 记录 / 证书不匹配」是执行前基线，现已全部闭环。**
> 已完成：两条 A 记录生效 → `phase1` → `phase2` → `verify` 三步 EXIT=0。
> 当前态：`d-bee.com.cn` / `www` 使用**独立证书** `d-bee-corp`（CN=d-bee.com.cn，到期 2027-02-09）；
> 80 → 308，443 由独立 server 块服务（目录为空故 `/` 返回 **403**）；
> 主站 `https://d-bee.cn/`=200、`http://d-bee.cn/`=308 未变，主配置文件 md5 与执行前备份完全一致。
> 下方原文保留作历史基线与「为何需要 `00-` 前缀」的依据，**不再代表当前状态**。

- `/etc/nginx/sites-available/d-bee` **只有一个站点**，其 `server_name`（第 25、120 行）把
  `_ d-bee.cn www.d-bee.cn 150.158.51.106 d-bee.com.cn www.d-bee.com.cn` **全写在同一个块里**；
  模板里设计的官网独立 server 块**并未上线**。
- 证书 `/etc/letsencrypt/live/d-bee.cn/` 的 SAN **只有 `d-bee.cn, www.d-bee.cn`**，不含官网域名
  → 直接访问 `https://d-bee.com.cn` 会证书不匹配。
- `/var/www/d-bee-corp/` **不存在**；`http://d-bee.com.cn/` 当前落到主块 80 的 `return 404`。
- DNS：`d-bee.cn` / `www.d-bee.cn` → `150.158.51.106` ✅；**`d-bee.com.cn` / `www.d-bee.com.cn` 无 A 记录**。

### 零影响方案（已备好配置与脚本）

| 文件 | 用途 |
| --- | --- |
| `deploy/nginx.corp.acme.conf` | 阶段 1：仅 80，ACME 校验 + 503 占位，**不暴露任何官网内容** |
| `deploy/nginx.corp.conf` | 阶段 2：80 → 308，443 独立证书 + 静态服务 |
| `deploy/install-corp-site.sh` | 幂等安装 / 验收 / 回滚 |

核心保证：
1. **不改 `/etc/nginx/sites-available/d-bee` 任何一行**——只新增配置文件与一个
   `sites-enabled/00-d-bee-corp` 软链（`00-` 前缀让官网块先加载，从而赢下同名 `server_name` 匹配；
   `nginx -t` 会有 `conflicting server name ... ignored` 警告，属预期、不影响运行）。
2. **独立证书** `certbot certonly --webroot --cert-name d-bee-corp`，不碰 `d-bee.cn` 的证书与续期。
3. **独立目录** `/var/www/d-bee-corp`——主项目 `deploy/deploy.sh` 只写 `/var/www/d-bee`，天然隔离。
4. 脚本每次 reload 后 `sleep 8` 等 nginx 优雅退出，并**强制验收 `https://d-bee.cn/` = 200、`http://d-bee.cn/` = 308**，任一不符自动回滚。
5. `rollback` 子命令 = 删软链 + reload，主配置从未被改，回滚零风险。

### 执行顺序（在服务器上）

```bash
# 前置：DNS 生效后；两个 conf + 脚本放到服务器同一目录
sudo bash install-corp-site.sh phase1                       # 80 占位，供 ACME 校验
sudo env CERT_EMAIL=<你的邮箱> bash install-corp-site.sh phase2  # 签独立证书 + 启用 443
sudo bash install-corp-site.sh verify                       # 含主站零影响对照
# check-facts.mjs 全绿后，才把 app/ 内容同步到 /var/www/d-bee-corp/
```

> ⚠️ `phase1` 只返回 503 占位；`phase2` 刚完成时目录为空、`/` 为 **403**（空目录无索引，非故障）。
>
> **2026-11-11 14:49 起**已把 `deploy/holding/index.html` 部署为 `/var/www/d-bee-corp/index.html`，
> 官网 `d-bee.com.cn` / `www` 现均返回 **200**（纯「官网建设中」页：主体全称 + `京ICP备2026075565号-1`
> + 工信部链接 + 指向 `https://d-bee.cn/` 的链接）。部署方式 = 只写静态文件，**未改 nginx 配置、未 reload**。
>
> 🔴 该页**不是官网正式内容**：零产品/定价/上架表述、零外部资源、`noindex`；位于 `deploy/holding/`
> 而非 `app/`，故 `check-facts.mjs` 不扫描它；正式内容上线时直接覆盖同名 `index.html`。
> **正式内容必须在 `node tools/check-facts.mjs` 全绿后才能上传公开**——当前原型仍有 8 项合规硬伤
> （默认检查 2 通过 / 3 失败 / 44 处命中）。

- 静态托管 **web root = `/var/www/d-bee-corp`**（对应本地 `app/`）；域名 `d-bee.com.cn`（含 `www`），备案号 `-1`。
- 产品 Web App 在 `d-bee.cn`（`-2`），两域名互做单向链接；过渡期下载 CTA 指向 `d-bee.cn` 或预约入口。
- 内容回滚 = 恢复上一版本文件；每次发布前打 tag 留痕。
- 🔴 任一四端上架状态 / 定价 / 备案 / 法务版本变化 → **先改 `FACTS.md` → 再改 HTML → 跑检查 → 才部署**。

---

## Git

- 本地仓库已初始化（首次提交为原型 + 项目骨架，**未改原型任何一行**）。
- 远程仓库：**`https://github.com/yutaiyin139/d-bee-website.git`**（`origin` / 分支 `main`，2026-11-11 由用户创建空仓库并首次推送）。
- 后续提交：
  ```bash
  git add -A && git commit -m "..."
  git -c http.sslBackend=openssl push origin main
  ```
  Windows 若遇 `schannel: failed to receive handshake` 或代理 `502 CONNECT tunnel failed`，用上面的 openssl 后端；
  本机**直连 github.com:443 不通，必须走代理**，代理故障属瞬时问题，稍后重试即可。
- 仓库 public/private 以 GitHub 建库时的设置为准；官网代码无秘密，`FACTS.md` 含主体与备案信息（均为公开信息）。
  主项目「是否转 private」仍属待拍板项，两者不必一致。
