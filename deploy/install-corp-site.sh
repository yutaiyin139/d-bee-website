#!/usr/bin/env bash
# 官网 d-bee.com.cn 站点安装（在服务器 150.158.51.106 上用 sudo 执行）
#
#   sudo bash install-corp-site.sh phase1     # 仅 80：ACME 校验 + 503 占位，不暴露任何内容
#   sudo env CERT_EMAIL=you@example.com bash install-corp-site.sh phase2  # 签独立证书 + 启用 80/443
#                  ↑ 必须用 `sudo env VAR=...`：部分 sudoers 的 env_reset 会剥掉前置变量赋值
#   sudo bash install-corp-site.sh verify     # 验收（含主站 d-bee.cn 零影响对照）
#   sudo bash install-corp-site.sh rollback  # 摘掉官网配置，reload
#
# 🔴 零影响保证：全程**不修改** /etc/nginx/sites-available/d-bee 的任何一行，
#    只新增 sites-available/d-bee-corp* 与一个 sites-enabled/00-d-bee-corp 软链。
#    nginx -t 会输出 "conflicting server name ... ignored" 警告，属预期（见 acme.conf 头注释）。
# 🔴 nginx reload 有优雅退出窗口：reload 后 sleep 8 再验收，否则会读到旧 worker 造成假红。
# 🔴 本脚本**不上传官网 HTML 内容**；内容须在 `node tools/check-facts.mjs` 全绿后单独部署。

set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SA=/etc/nginx/sites-available
SE=/etc/nginx/sites-enabled
LINK="$SE/00-d-bee-corp"
WWW=/var/www/d-bee-corp
MAIN="$SA/d-bee"
EXPECT_IP="${EXPECT_IP:-150.158.51.106}"
PHASE="${1:-}"

[ "$(id -u)" -eq 0 ] || { echo "!! 请用 sudo 运行"; exit 1; }
case "$PHASE" in phase1|phase2|verify|rollback) ;; *)
  echo "用法: sudo bash $0 {phase1|phase2|verify|rollback}"; exit 1 ;;
esac

TS="$(date +%Y%m%d-%H%M%S)"

rollback() {
  echo "== 回滚：摘除官网软链 =="
  rm -f "$LINK"
  nginx -t >/tmp/_corp_nt.log 2>&1 || { echo "!! 回滚后 nginx -t 仍失败"; tail -20 /tmp/_corp_nt.log; exit 1; }
  systemctl reload nginx
  sleep 8
  echo "== 已回滚；主站自检 =="
  curl -sS -o /dev/null -w '  https://d-bee.cn/ -> %{http_code}\n' --max-time 10 https://d-bee.cn/ || true
}

on_error() {
  echo "!! 步骤失败（行 $1）。自动回滚官网配置。"
  rollback || true
  exit 1
}
trap 'on_error $LINENO' ERR

verify() {
  local phase="${1:-phase2}"
  echo "== 验收（reload 后已等待优雅退出窗口）=="
  # 主站零影响：这是本脚本最重要的断言
  local main_code main_http
  main_code=$(curl -sS -o /dev/null -w '%{http_code}' --max-time 10 https://d-bee.cn/ || echo 000)
  main_http=$(curl -sS -o /dev/null -w '%{http_code}' --max-time 10 http://d-bee.cn/ || echo 000)
  echo "  主站 https://d-bee.cn/     -> $main_code  (期望 200)"
  echo "  主站 http://d-bee.cn/      -> $main_http  (期望 308)"
  [ "$main_code" = "200" ] || { echo "!! 主站 HTTPS 异常，立即回滚"; return 1; }
  [ "$main_http" = "308" ] || { echo "!! 主站 308 跳转异常（certbot 可能改回 301），立即回滚"; return 1; }

  if [ "$phase" = "phase1" ]; then
    local c1
    c1=$(curl -sS -o /dev/null -w '%{http_code}' --max-time 10 http://d-bee.com.cn/ || echo 000)
    echo "  官网 http://d-bee.com.cn/ -> $c1  (期望 503 占位)"
    [ "$c1" = "503" ] || { echo "!! 官网 80 块未生效"; return 1; }
  else
    local c2 c3
    c2=$(curl -sS -o /dev/null -w '%{http_code}' --max-time 10 http://d-bee.com.cn/ || echo 000)
    c3=$(curl -sSk -o /dev/null -w '%{http_code}' --max-time 10 https://d-bee.com.cn/ || echo 000)
    echo "  官网 http://d-bee.com.cn/ -> $c2  (期望 308)"
    echo "  官网 https://d-bee.com.cn/ -> $c3  (空目录 403 / 缺文件 404 / 内容上传后 200)"
    [ "$c2" = "308" ] || { echo "!! 官网 80 跳转未生效"; return 1; }
    # 空目录时 nginx 返回 403（directory index forbidden），不是 404；只把 000/5xx 判红
    case "$c3" in 200|403|404) ;; *) echo "!! 官网 443 响应异常，立即回滚"; return 1 ;; esac
  fi
  echo "== 验收通过：主站行为未变 =="
}

check_dns() {
  for d in d-bee.com.cn www.d-bee.com.cn; do
    local ip
    ip=$(getent ahostsv4 "$d" | awk '{print $1; exit}' || true)
    [ "$ip" = "$EXPECT_IP" ] || { echo "!! DNS 未生效：$d -> '${ip:-无A记录}'，期望 $EXPECT_IP"; return 1; }
    echo "  DNS OK: $d -> $ip"
  done
}

case "$PHASE" in
phase1)
  echo "== 阶段 1：仅 80 端口（ACME + 503 占位）=="
  [ -f "$DIR/nginx.corp.acme.conf" ] || { echo "!! 缺 nginx.corp.acme.conf"; exit 1; }
  cp -a "$MAIN" "$MAIN.bak.corp-$TS"          # 只读备份，绝不修改原文件
  echo "  已备份主配置 -> $MAIN.bak.corp-$TS（原文件未改）"
  mkdir -p "$WWW"; chmod 755 "$WWW"
  cp "$DIR/nginx.corp.acme.conf" "$SA/d-bee-corp.acme"
  ln -sfn "$SA/d-bee-corp.acme" "$LINK"
  nginx -t 2>&1 | tail -8
  systemctl reload nginx
  sleep 8
  verify phase1
  echo "== 阶段 1 完成。下一步：确认 DNS 后执行 phase2 签证书 =="
  ;;

phase2)
  echo "== 阶段 2：签独立证书 + 启用 80/443 =="
  [ -f "$DIR/nginx.corp.conf" ] || { echo "!! 缺 nginx.corp.conf"; exit 1; }
  check_dns
  : "${CERT_EMAIL:?请设置 CERT_EMAIL，例如 sudo env CERT_EMAIL=you@example.com bash $0 phase2}"
  if [ ! -f /etc/letsencrypt/live/d-bee-corp/fullchain.pem ]; then
    echo "  certbot certonly --webroot（独立证书，不碰 d-bee.cn 证书）"
    certbot certonly --webroot -w "$WWW" \
      -d d-bee.com.cn -d www.d-bee.com.cn \
      --cert-name d-bee-corp -n --agree-tos -m "$CERT_EMAIL" 2>&1 | tail -20
  else
    echo "  证书已存在，跳过签发"
  fi
  [ -f /etc/letsencrypt/live/d-bee-corp/fullchain.pem ] || { echo "!! 证书未生成"; exit 1; }
  cp "$DIR/nginx.corp.conf" "$SA/d-bee-corp"
  ln -sfn "$SA/d-bee-corp" "$LINK"
  nginx -t 2>&1 | tail -8
  systemctl reload nginx
  sleep 8
  verify phase2
  echo "== 阶段 2 完成。内容仍为空目录，须 check-facts 全绿后单独上传 =="
  ;;

verify)
  verify phase2
  ;;

rollback)
  rollback
  ;;
esac
