#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════
# 🌌 萬能系統 + ESGGO 完整部署腳本
# ═══════════════════════════════════════════════════════════════
# VPS: 161.118.248.180
# 功能: 部署 ESGGO 主應用 + OmniAgent Gateway + 萬能系統組件
# ═══════════════════════════════════════════════════════════════
set -Eeuo pipefail

# ─── 配置 ───────────────────────────────────────────────────
VPS_IP="161.118.248.180"
APP_DIR="${APP_DIR:-/var/www/esggo}"
GATEWAY_DIR="${APP_DIR}/apps/gateway"
NODE_MAJOR="${NODE_MAJOR:-20}"
ESGGO_PORT="${ESGGO_PORT:-3000}"
GATEWAY_PORT="${GATEWAY_PORT:-8642}"

# ─── 工具函數 ───────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

log()   { echo -e "${BLUE}==> ${NC}$1"; }
ok()    { echo -e "${GREEN}✅ $1${NC}"; }
warn()  { echo -e "${YELLOW}⚠️  $1${NC}"; }
fail()  { echo -e "${RED}❌ $1${NC}"; exit 1; }

if [ "$(id -u)" -eq 0 ]; then
  SUDO=""
else
  SUDO="sudo"
fi

# ═══════════════════════════════════════════════════════════════
# PHASE 1: 系統基礎設施
# ═══════════════════════════════════════════════════════════════
phase1_system() {
  log "═══ PHASE 1: 系統基礎設施 ═══"

  # 安裝系統套件
  log "安裝系統套件"
  $SUDO apt-get update -qq
  $SUDO apt-get install -y -qq curl git build-essential ca-certificates \
    ufw nginx certbot python3-certbot-nginx jq htop tree

  # 安裝 Node.js
  local node_major=""
  if command -v node >/dev/null 2>&1; then
    node_major="$(node -v | cut -d. -f1 | tr -d 'v')"
  fi

  if [ "${node_major}" != "${NODE_MAJOR}" ]; then
    log "安裝 Node.js ${NODE_MAJOR}.x"
    curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" | $SUDO -E bash -
    $SUDO apt-get install -y -qq nodejs
  fi
  ok "Node.js $(node -v)"

  # 安裝 pnpm
  if ! command -v pnpm >/dev/null 2>&1; then
    log "安裝 pnpm"
    npm install -g pnpm
  fi
  ok "pnpm $(pnpm -v)"

  # 安裝 PM2
  if ! command -v pm2 >/dev/null 2>&1; then
    log "安裝 PM2"
    npm install -g pm2
  fi
  ok "PM2 $(pm2 -v)"

  # 安裝 Docker (可選)
  if ! command -v docker >/dev/null 2>&1; then
    log "安裝 Docker"
    curl -fsSL https://get.docker.com | $SUDO sh
    $SUDO usermod -aG docker "$USER" || true
  fi
  ok "Docker $(docker --version 2>/dev/null || echo 'not installed')"

  # 安裝 Docker Compose
  if ! command -v docker-compose >/dev/null 2>&1 && ! docker compose version >/dev/null 2>&1; then
    log "安裝 Docker Compose"
    $SUDO curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" \
      -o /usr/local/bin/docker-compose
    $SUDO chmod +x /usr/local/bin/docker-compose
  fi
  ok "Docker Compose ready"
}

# ═══════════════════════════════════════════════════════════════
# PHASE 2: 防火牆與網路
# ═══════════════════════════════════════════════════════════════
phase2_network() {
  log "═══ PHASE 2: 防火牆與網路 ═══"

  $SUDO ufw allow OpenSSH || true
  $SUDO ufw allow 'Nginx Full' || true
  $SUDO ufw allow "${ESGGO_PORT}/tcp" || true
  $SUDO ufw allow "${GATEWAY_PORT}/tcp" || true
  $SUDO ufw --force enable || true
  ok "防火牆規則已設定"
}

# ═══════════════════════════════════════════════════════════════
# PHASE 3: ESGGO 主應用
# ═══════════════════════════════════════════════════════════════
phase3_esggo() {
  log "═══ PHASE 3: ESGGO 主應用 ═══"

  cd "${APP_DIR}"

  # 安裝依賴
  log "安裝 ESGGO 依賴"
  pnpm install --frozen-lockfile 2>/dev/null || pnpm install
  ok "ESGGO 依賴安裝完成"

  # 構建
  log "構建 ESGGO"
  pnpm build
  ok "ESGGO 構建完成"
}

# ═══════════════════════════════════════════════════════════════
# PHASE 4: OmniAgent Gateway (萬能系統網關)
# ═══════════════════════════════════════════════════════════════
phase4_gateway() {
  log "═══ PHASE 4: OmniAgent Gateway (萬能系統) ═══"

  mkdir -p "${GATEWAY_DIR}" logs

  # 複製 Gateway 文件
  log "複製 Gateway 文件"
  if [ -f "${APP_DIR}/vps/omni-server.mjs" ]; then
    cp "${APP_DIR}/vps/omni-server.mjs" "${GATEWAY_DIR}/"
  fi

  # 設定 package.json
  if [ ! -f "${GATEWAY_DIR}/package.json" ]; then
    cat > "${GATEWAY_DIR}/package.json" <<'EOF_PKG'
{
  "name": "omniagent-gateway",
  "version": "3.0.0",
  "private": true,
  "type": "module",
  "main": "omni-server.mjs",
  "scripts": {
    "start": "node omni-server.mjs"
  },
  "dependencies": {
    "@google/generative-ai": "^0.21.0",
    "cors": "^2.8.5",
    "express": "^4.18.2",
    "express-rate-limit": "^7.1.5",
    "helmet": "^7.1.0",
    "ws": "^8.18.0"
  }
}
EOF_PKG
  fi

  # 設定 .env
  if [ ! -f "${GATEWAY_DIR}/.env" ]; then
    GATEWAY_KEY="esggo_$(openssl rand -hex 16)"
    cat > "${GATEWAY_DIR}/.env" <<EOF_ENV
PORT=${GATEWAY_PORT}
VPS_IP=${VPS_IP}
GATEWAY_API_KEY=${GATEWAY_KEY}
GEMINI_API_KEY=${GEMINI_API_KEY:-}
OPENROUTER_API_KEY=${OPENROUTER_API_KEY:-}
ALLOWED_ORIGINS=http://${VPS_IP},http://127.0.0.1:3000,http://localhost:3000
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
EOF_ENV
    chmod 600 "${GATEWAY_DIR}/.env"
    warn "已生成 GATEWAY_API_KEY: ${GATEWAY_KEY}"
    warn "請保存此密鑰！"
  fi

  # 安裝依賴
  log "安裝 Gateway 依賴"
  cd "${GATEWAY_DIR}"
  npm install
  ok "Gateway 依賴安裝完成"
}

# ═══════════════════════════════════════════════════════════════
# PHASE 5: Redis
# ═══════════════════════════════════════════════════════════════
phase5_redis() {
  log "═══ PHASE 5: Redis ═══"

  if ! command -v redis-cli >/dev/null 2>&1; then
    log "安裝 Redis"
    $SUDO apt-get install -y -qq redis-server
    $SUDO systemctl enable redis-server
    $SUDO systemctl start redis-server
  fi

  if redis-cli ping 2>/dev/null | grep -q PONG; then
    ok "Redis 運行中"
  else
    warn "Redis 未運行，嘗試啟動..."
    $SUDO systemctl start redis-server || true
  fi
}

# ═══════════════════════════════════════════════════════════════
# PHASE 6: Nginx 反向代理
# ═══════════════════════════════════════════════════════════════
phase6_nginx() {
  log "═══ PHASE 6: Nginx 反向代理 ═══"

  cat > /tmp/esggo-nginx.conf <<'NGINX_CONF'
# ESGGO + OmniAgent Gateway Nginx 配置
upstream esggo_app {
    server 127.0.0.1:3000;
}

upstream omniagent_gateway {
    server 127.0.0.1:8642;
}

server {
    listen 80;
    server_name _;

    # ESGGO 主應用
    location / {
        proxy_pass http://esggo_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 60s;
    }

    # OmniAgent Gateway API
    location /omniagent-gateway/ {
        proxy_pass http://omniagent_gateway/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 300s;
        proxy_connect_timeout 60s;
    }

    # WebSocket 支持
    location /ws {
        proxy_pass http://omniagent_gateway;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_read_timeout 86400;
    }

    # 健康檢查
    location /health {
        proxy_pass http://esggo_app/api/health;
        access_log off;
    }

    location /gateway/status {
        proxy_pass http://omniagent_gateway/status;
        access_log off;
    }
}
NGINX_CONF

  $SUDO cp /tmp/esggo-nginx.conf /etc/nginx/sites-available/esggo
  $SUDO ln -sf /etc/nginx/sites-available/esggo /etc/nginx/sites-enabled/esggo
  $SUDO rm -f /etc/nginx/sites-enabled/default
  $SUDO nginx -t
  $SUDO systemctl reload nginx
  ok "Nginx 配置完成"
}

# ═══════════════════════════════════════════════════════════════
# PHASE 7: PM2 進程管理
# ═══════════════════════════════════════════════════════════════
phase7_pm2() {
  log "═══ PHASE 7: PM2 進程管理 ═══"

  cd "${APP_DIR}"

  # 停止舊進程
  pm2 delete esggo-core 2>/dev/null || true
  pm2 delete omniagent-gateway 2>/dev/null || true

  # 啟動 ESGGO
  log "啟動 ESGGO (port ${ESGGO_PORT})"
  pm2 start ecosystem.config.cjs --only esggo-core

  # 啟動 OmniAgent Gateway
  log "啟動 OmniAgent Gateway (port ${GATEWAY_PORT})"
  pm2 start "${GATEWAY_DIR}/omni-server.mjs" \
    --name omniagent-gateway \
    --interpreter node \
    --cwd "${GATEWAY_DIR}"

  # 保存並設定開機自啟
  pm2 save
  pm2 startup systemd -u "$USER" --hp "$HOME" 2>/dev/null || true

  ok "PM2 進程已啟動"
}

# ═══════════════════════════════════════════════════════════════
# PHASE 8: 定時任務
# ═══════════════════════════════════════════════════════════════
phase8_cron() {
  log "═══ PHASE 8: 定時任務 ═══"

  # 健康監控
  (crontab -l 2>/dev/null | grep -v "health-monitor"; echo "*/5 * * * * ${APP_DIR}/vps/health-monitor.sh >> /var/log/esggo-health.log 2>&1") | crontab -

  # 日誌清理
  (crontab -l 2>/dev/null | grep -v "log-cleanup"; echo "0 3 * * 0 ${APP_DIR}/vps/log-cleanup.sh >> /var/log/esggo-cleanup.log 2>&1") | crontab -

  # SSL 自動續約
  (crontab -l 2>/dev/null | grep -v "certbot"; echo "0 2 * * 1 certbot renew --quiet --post-hook 'systemctl reload nginx'") | crontab -

  ok "定時任務已設定"
}

# ═══════════════════════════════════════════════════════════════
# PHASE 9: 健康檢查
# ═══════════════════════════════════════════════════════════════
phase9_healthcheck() {
  log "═══ PHASE 9: 健康檢查 ═══"

  local ok_count=0
  local total=3

  # 檢查 ESGGO
  log "檢查 ESGGO (port ${ESGGO_PORT})..."
  for _ in $(seq 1 20); do
    if curl -fsS --max-time 3 "http://127.0.0.1:${ESGGO_PORT}" >/dev/null 2>&1; then
      ok "ESGGO 運行中"
      ok_count=$((ok_count + 1))
      break
    fi
    sleep 2
  done

  # 檢查 Gateway
  log "檢查 OmniAgent Gateway (port ${GATEWAY_PORT})..."
  for _ in $(seq 1 20); do
    if curl -fsS --max-time 3 "http://127.0.0.1:${GATEWAY_PORT}/status" >/dev/null 2>&1; then
      ok "OmniAgent Gateway 運行中"
      ok_count=$((ok_count + 1))
      break
    fi
    sleep 2
  done

  # 檢查 Redis
  log "檢查 Redis..."
  if redis-cli ping 2>/dev/null | grep -q PONG; then
    ok "Redis 運行中"
    ok_count=$((ok_count + 1))
  fi

  # 檢查 Nginx
  log "檢查 Nginx..."
  if curl -fsS --max-time 3 "http://127.0.0.1" >/dev/null 2>&1; then
    ok "Nginx 運行中"
  fi

  echo ""
  log "═══ 部署摘要 ═══"
  echo -e "  ${CYAN}ESGGO:${NC}        http://${VPS_IP}:${ESGGO_PORT}"
  echo -e "  ${CYAN}Gateway:${NC}      http://${VPS_IP}:${GATEWAY_PORT}/status"
  echo -e "  ${CYAN}Nginx:${NC}        http://${VPS_IP}"
  echo -e "  ${CYAN}Redis:${NC}        127.0.0.1:6379"
  echo -e "  ${CYAN}Health:${NC}       ${ok_count}/${total} services healthy"
  echo ""
  log "部署完成！"
}

# ═══════════════════════════════════════════════════════════════
# 主程序
# ═══════════════════════════════════════════════════════════════
main() {
  echo ""
  echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
  echo -e "${CYAN}  🌌 萬能系統 + ESGGO 完整部署                      ${NC}"
  echo -e "${CYAN}  VPS: ${VPS_IP}                                     ${NC}"
  echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
  echo ""

  phase1_system
  phase2_network
  phase5_redis
  phase3_esggo
  phase4_gateway
  phase6_nginx
  phase7_pm2
  phase8_cron
  phase9_healthcheck
}

main "$@"
