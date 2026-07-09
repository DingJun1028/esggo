#!/usr/bin/env bash
# =============================================================================
# ESG GO — Oracle Cloud VPS 一鍵安裝腳本
# =============================================================================
# 適用於: Oracle Cloud Always Free ARM Ampere A1 (4 OCPU / 24 GB)
#
# 使用方式:
#   1. SSH 進入 Oracle VPS (Ubuntu 22.04/24.04)
#   2. curl -fsSL https://raw.githubusercontent.com/your-repo/setup-oracle-vps.sh | bash
#   或:
#   2. chmod +x setup-oracle-vps.sh
#   3. sudo ./setup-oracle-vps.sh --domain your-domain.com --email your@email.com
# =============================================================================

set -euo pipefail

# ─── 預設值 ──────────────────────────────────────────────────────
DOMAIN=""
EMAIL=""
REPO_URL="https://github.com/your-org/esggo.git"
BRANCH="main"
APP_DIR="/opt/esggo"
SWAP_SIZE="4G"

# ─── 顏色 ────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

log()   { echo -e "${GREEN}[✓]${NC} $*"; }
warn()  { echo -e "${YELLOW}[!]${NC} $*"; }
error() { echo -e "${RED}[✗]${NC} $*"; exit 1; }
info()  { echo -e "${BLUE}[i]${NC} $*"; }
banner() {
  echo -e "${CYAN}"
  echo "╔══════════════════════════════════════════════════╗"
  echo "║     ESG GO — Oracle VPS Deployment Script       ║"
  echo "║     ARM Ampere A1 (4C/24G) Optimized           ║"
  echo "╚══════════════════════════════════════════════════╝"
  echo -e "${NC}"
}

# ─── 解析參數 ────────────────────────────────────────────────────
parse_args() {
  while [[ $# -gt 0 ]]; do
    case $1 in
      --domain)   DOMAIN="$2"; shift 2 ;;
      --email)    EMAIL="$2"; shift 2 ;;
      --repo)     REPO_URL="$2"; shift 2 ;;
      --branch)   BRANCH="$2"; shift 2 ;;
      --app-dir)  APP_DIR="$2"; shift 2 ;;
      --swap)     SWAP_SIZE="$2"; shift 2 ;;
      -h|--help)  show_help; exit 0 ;;
      *)          error "未知參數: $1" ;;
    esac
  done
}

show_help() {
  cat <<EOF
Oracle VPS 部署腳本

用法: sudo ./setup-oracle-vps.sh [選項]

選項:
  --domain DOMAIN     網域名稱 (例: esggo.ai)
  --email  EMAIL      Let's Encrypt SSL 憑證電子郵件
  --repo   URL        Git 倉庫 URL
  --branch BRANCH     Git 分支 (預設: main)
  --app-dir DIR       應用安裝目錄 (預設: /opt/esggo)
  --swap    SIZE      Swap 大小 (預設: 4G)
  -h, --help          顯示說明

範例:
  sudo ./setup-oracle-vps.sh --domain esggo.ai --email admin@esggo.ai
EOF
}

# ─── 系統檢查 ────────────────────────────────────────────────────
check_system() {
  info "檢查系統環境..."

  # 檢查是否為 root
  if [[ $EUID -ne 0 ]]; then
    error "請使用 root 執行此腳本 (sudo ./setup-oracle-vps.sh)"
  fi

  # 檢查 OS
  if ! grep -q "Ubuntu" /etc/os-release 2>/dev/null; then
    warn "此腳本針對 Ubuntu 優化，其他 OS 可能需要調整"
  fi

  # 檢查架構
  ARCH=$(uname -m)
  if [[ "$ARCH" != "aarch64" ]]; then
    warn "偵測到架構: $ARCH (建議使用 ARM aarch64)"
  else
    log "架構確認: ARM64 (aarch64)"
  fi

  # 檢查記憶體
  TOTAL_MEM=$(free -g | awk '/^Mem:/{print $2}')
  if [[ $TOTAL_MEM -lt 16 ]]; then
    warn "記憶體僅 ${TOTAL_MEM}GB，建議至少 16GB"
  else
    log "記憶體: ${TOTAL_MEM}GB"
  fi
}

# ─── 系統更新 ────────────────────────────────────────────────────
update_system() {
  info "更新系統套件..."
  apt-get update -qq
  apt-get upgrade -y -qq
  apt-get install -y -qq \
    curl wget git unzip jq htop tmux \
    ufw fail2ban \
    apt-transport-https ca-certificates \
    gnupg lsb-release
  log "系統更新完成"
}

# ─── 設定 Swap ───────────────────────────────────────────────────
setup_swap() {
  info "設定 Swap: ${SWAP_SIZE}..."

  if swapon --show | grep -q "/swapfile"; then
    log "Swap 已存在，跳過"
    return
  fi

  fallocate -l "${SWAP_SIZE}" /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab

  # 調整 swappiness (減少 Swap 使用)
  sysctl vm.swappiness=10
  echo 'vm.swappiness=10' >> /etc/sysctl.d/99-swappiness.conf

  log "Swap 設定完成: ${SWAP_SIZE}"
}

# ─── 安裝 Docker ─────────────────────────────────────────────────
install_docker() {
  info "安裝 Docker..."

  if command -v docker &> /dev/null; then
    log "Docker 已安裝: $(docker --version)"
    return
  fi

  # 安裝 Docker 官方 GPG key
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  chmod a+r /etc/apt/keyrings/docker.gpg

  # 加入 Docker repo
  echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
    $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
    tee /etc/apt/sources.list.d/docker.list > /dev/null

  apt-get update -qq
  apt-get install -y -qq docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

  # 啟用 Docker
  systemctl enable docker
  systemctl start docker

  log "Docker 安裝完成: $(docker --version)"
}

# ─── 設定防火牆 ──────────────────────────────────────────────────
setup_firewall() {
  info "設定 UFW 防火牆..."

  ufw default deny incoming
  ufw default allow outgoing
  ufw allow ssh
  ufw allow 80/tcp
  ufw allow 443/tcp

  echo "y" | ufw enable
  log "防火牆設定完成"
}

# ─── 設定 Fail2Ban ───────────────────────────────────────────────
setup_fail2ban() {
  info "設定 Fail2Ban..."

  cat > /etc/fail2ban/jail.local <<EOF
[DEFAULT]
bantime  = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true
port    = ssh
filter  = sshd
logpath = /var/log/auth.log
maxretry = 3
EOF

  systemctl enable fail2ban
  systemctl restart fail2ban

  log "Fail2Ban 設定完成"
}

# ─── 克隆專案 ────────────────────────────────────────────────────
clone_project() {
  info "克隆 ESG GO 專案..."

  if [[ -d "$APP_DIR/.git" ]]; then
    warn "專案已存在，執行 git pull..."
    cd "$APP_DIR"
    git pull origin "$BRANCH"
  else
    git clone --branch "$BRANCH" "$REPO_URL" "$APP_DIR"
    cd "$APP_DIR"
  fi

  log "專案就緒: $APP_DIR"
}

# ─── 設定環境變數 ────────────────────────────────────────────────
setup_env() {
  info "設定環境變數..."

  ENV_FILE="$APP_DIR/vps/.env"

  if [[ -f "$ENV_FILE" ]]; then
    warn ".env 檔案已存在，跳過（如需重新設定請手動刪除）"
    return
  fi

  # 複製範本
  cp "$APP_DIR/vps/.env.example" "$ENV_FILE"

  # 互動式填入
  echo ""
  echo -e "${CYAN}═══════════════════════════════════════════════════${NC}"
  echo -e "${CYAN}  請填入以下環境變數（按 Enter 跳過可選項目）${NC}"
  echo -e "${CYAN}═══════════════════════════════════════════════════${NC}"

  read -p "GROQ_API_KEY (必填): " GROQ_KEY
  read -p "OPENROUTER_API_KEY (必填): " OR_KEY
  read -p "GEMINI_API_KEY (選填): " GEMINI_KEY
  read -p "GATEWAY_API_KEY (選填): " GW_KEY

  # 寫入 .env
  sed -i "s/^GROQ_API_KEY=.*/GROQ_API_KEY=${GROQ_KEY}/" "$ENV_FILE"
  sed -i "s/^OPENROUTER_API_KEY=.*/OPENROUTER_API_KEY=${OR_KEY}/" "$ENV_FILE"
  [[ -n "$GEMINI_KEY" ]] && sed -i "s/^GEMINI_API_KEY=.*/GEMINI_API_KEY=${GEMINI_KEY}/" "$ENV_FILE"
  [[ -n "$GW_KEY" ]] && sed -i "s/^GATEWAY_API_KEY=.*/GATEWAY_API_KEY=${GW_KEY}/" "$ENV_FILE"

  # 限制權限
  chmod 600 "$ENV_FILE"

  log "環境變數設定完成"
}

# ─── 設定 Nginx ──────────────────────────────────────────────────
setup_nginx() {
  info "設定 Nginx..."

  mkdir -p "$APP_DIR/vps/nginx/conf.d"

  # 主配置
  cat > "$APP_DIR/vps/nginx/nginx.conf" <<'NGINX_CONF'
user nginx;
worker_processes auto;
pid /run/nginx.pid;
error_log /var/log/nginx/error.log warn;

events {
    worker_connections 1024;
    multi_accept on;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # 日誌格式
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    # 效能優化
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 50M;

    # Gzip 壓縮
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;

    # 安全標頭
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    include /etc/nginx/conf.d/*.conf;
}
NGINX_CONF

  # 站點配置
  cat > "$APP_DIR/vps/nginx/conf.d/esggo.conf" <<'NGINX_SITE'
upstream esggo_backend {
    server esggo-core:3000;
    keepalive 32;
}

upstream gateway_backend {
    server omniagent-gateway:8642;
    keepalive 16;
}

# HTTP → HTTPS 重新導向
server {
    listen 80;
    server_name _;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

# HTTPS 主站點
server {
    listen 443 ssl http2;
    server_name _;

    # SSL 憑證 (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/esggo.ai/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/esggo.ai/privkey.pem;

    # SSL 安全設定
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;

    # HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # 靜態資源快取
    location /_next/static/ {
        proxy_pass http://esggo_backend;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location /public/ {
        proxy_pass http://esggo_backend;
        proxy_cache_valid 200 30d;
        add_header Cache-Control "public, max-age=2592000";
    }

    # AI Gateway API
    location /api/gateway/ {
        proxy_pass http://gateway_backend/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_send_timeout 300s;
    }

    # 主應用
    location / {
        proxy_pass http://esggo_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINX_SITE

  log "Nginx 設定完成"
}

# ─── 設定 SSL ────────────────────────────────────────────────────
setup_ssl() {
  if [[ -z "$DOMAIN" || -z "$EMAIL" ]]; then
    warn "未指定 --domain 或 --email，跳過 SSL 設定"
    warn "稍後手動執行: certbot certonly --webroot -w /var/www/certbot -d YOUR_DOMAIN --email YOUR_EMAIL --agree-tos"
    return
  fi

  info "設定 SSL 憑證..."

  mkdir -p "$APP_DIR/vps/certbot/conf" "$APP_DIR/vps/certbot/www"

  # 先啟動 nginx (HTTP only)
  # 取得憑證
  docker compose -f "$APP_DIR/vps/docker-compose.prod.yml" up -d nginx
  sleep 5

  docker run --rm \
    -v "$APP_DIR/vps/certbot/conf:/etc/letsencrypt" \
    -v "$APP_DIR/vps/certbot/www:/var/www/certbot" \
    certbot/certbot certonly \
    --webroot \
    -w /var/www/certbot \
    -d "$DOMAIN" \
    --email "$EMAIL" \
    --agree-tos \
    --no-eff-email

  docker compose -f "$APP_DIR/vps/docker-compose.prod.yml" down nginx

  log "SSL 憑證設定完成"
}

# ─── 設定保活腳本 ────────────────────────────────────────────────
setup_keepalive() {
  info "設定 Oracle 保活 Cron..."

  mkdir -p /opt/scripts

  cat > /opt/scripts/oracle-keepalive.sh <<'KEEPALIVE'
#!/bin/bash
# Oracle Cloud 保活腳本 — 防止閒置回收
# 每 5 分鐘消耗 ~60 秒 CPU，維持 ~20% 使用率

LOG="/var/log/oracle-keepalive.log"

load_cpu() {
  local cores=${1:-4}
  local duration=${2:-60}
  local pids=""

  echo "$(date '+%Y-%m-%d %H:%M:%S') Loading $cores CPUs for ${duration}s" >> "$LOG"

  for ((i=0; i<cores; i++)); do
    while :; do :; done &
    pids="$pids $!"
  done

  sleep "$duration"
  for p in $pids; do kill "$p" 2>/dev/null; done
}

load_cpu 4 60
KEEPALIVE

  chmod +x /opt/scripts/oracle-keepalive.sh

  # 加入 crontab（每 5 分鐘執行）
  (crontab -l 2>/dev/null | grep -v "oracle-keepalive"; echo "*/5 * * * * /opt/scripts/oracle-keepalive.sh") | crontab -

  log "Oracle 保活腳本設定完成"
}

# ─── 啟動服務 ────────────────────────────────────────────────────
start_services() {
  info "啟動 ESG GO 服務..."

  cd "$APP_DIR/vps"

  # 建置並啟動
  docker compose -f docker-compose.prod.yml build --no-cache
  docker compose -f docker-compose.prod.yml up -d

  # 等待健康檢查
  info "等待服務就緒..."
  sleep 30

  # 檢查狀態
  docker compose -f docker-compose.prod.yml ps

  log "所有服務已啟動！"
}

# ─── 設定自動更新 ────────────────────────────────────────────────
setup_autoupdate() {
  info "設定自動更新..."

  cat > /opt/scripts/esggo-autoupdate.sh <<'AUTOUPDATE'
#!/bin/bash
# ESG GO 自動更新腳本
cd /opt/esggo/vps

git -C /opt/esggo pull origin main --quiet

docker compose -f docker-compose.prod.yml build --quiet
docker compose -f docker-compose.prod.yml up -d --remove-orphans

echo "$(date '+%Y-%m-%d %H:%M:%S') Auto-update completed" >> /var/log/esggo-autoupdate.log
AUTOUPDATE

  chmod +x /opt/scripts/esggo-autoupdate.sh

  # 每天凌晨 4 點自動更新
  (crontab -l 2>/dev/null | grep -v "esggo-autoupdate"; echo "0 4 * * * /opt/scripts/esggo-autoupdate.sh") | crontab -

  log "自動更新設定完成（每日 04:00）"
}

# ─── 輸出摘要 ────────────────────────────────────────────────────
print_summary() {
  PUBLIC_IP=$(curl -s ifconfig.me)

  echo ""
  echo -e "${CYAN}╔══════════════════════════════════════════════════════════╗${NC}"
  echo -e "${CYAN}║          ESG GO 部署完成！                              ║${NC}"
  echo -e "${CYAN}╠══════════════════════════════════════════════════════════╣${NC}"
  echo -e "${CYAN}║${NC}  公網 IP:    ${GREEN}$PUBLIC_IP${NC}"
  echo -e "${CYAN}║${NC}  應用目錄:   ${GREEN}$APP_DIR${NC}"
  echo -e "${CYAN}║${NC}  Docker:     ${GREEN}docker compose -f docker-compose.prod.yml${NC}"
  echo -e "${CYAN}║${NC}"
  echo -e "${CYAN}║${NC}  ${YELLOW}常用指令:${NC}"
  echo -e "${CYAN}║${NC}    查看狀態:  cd $APP_DIR/vps && docker compose -f docker-compose.prod.yml ps"
  echo -e "${CYAN}║${NC}    查看日誌:  docker compose -f docker-compose.prod.yml logs -f esggo"
  echo -e "${CYAN}║${NC}    重啟服務:  docker compose -f docker-compose.prod.yml restart"
  echo -e "${CYAN}║${NC}    停止服務:  docker compose -f docker-compose.prod.yml down"
  echo -e "${CYAN}║${NC}"

  if [[ -n "$DOMAIN" ]]; then
    echo -e "${CYAN}║${NC}  ${GREEN}https://$DOMAIN${NC}"
  else
    echo -e "${CYAN}║${NC}  ${GREEN}https://$PUBLIC_IP${NC}"
  fi

  echo -e "${CYAN}║${NC}"
  echo -e "${CYAN}║${NC}  ${YELLOW}⚠️  Oracle 保活提醒:${NC}"
  echo -e "${CYAN}║${NC}    - Cron 已設定每 5 分鐘消耗 CPU"
  echo -e "${CYAN}║${NC}    - 確保服務有實際流量避免被標記為閒置"
  echo -e "${CYAN}║${NC}    - 建議設定 Budget Alert 防止意外費用"
  echo -e "${CYAN}╚══════════════════════════════════════════════════════════╝${NC}"
}

# ─── 主程式 ──────────────────────────────────────────────────────
main() {
  parse_args "$@"
  banner
  check_system
  update_system
  setup_swap
  install_docker
  setup_firewall
  setup_fail2ban
  clone_project
  setup_env
  setup_nginx
  setup_ssl
  setup_keepalive
  start_services
  setup_autoupdate
  print_summary
}

main "$@"
