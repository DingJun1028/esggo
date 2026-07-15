#!/usr/bin/env bash
# scripts/setup-vps.sh — VPS 一次性初始化（monorepo 感知）
# 用法: ssh root@VPS_IP 'bash -s' < scripts/setup-vps.sh
set -Eeuo pipefail

APP_DIR="${APP_DIR:-/var/www/esggo}"
DOMAIN="${DOMAIN:-esggo.app}"
NODE_MAJOR="${NODE_MAJOR:-22}"
GIT_REMOTE="${GIT_REMOTE:-}"
VPS_IP=$(curl -s http://checkip.amazonaws.com 2>/dev/null || echo "0.0.0.0")

if [ "$(id -u)" -eq 0 ]; then SUDO=""; else SUDO="sudo"; fi

log() { echo "==> $1"; }

# ─── Runtime ───
install_runtime() {
  log "Installing system packages"
  $SUDO apt-get update -qq
  $SUDO apt-get install -y -qq curl git build-essential ca-certificates ufw nginx rsync

  local node_ver=""
  command -v node >/dev/null 2>&1 && node_ver="$(node -v | cut -d. -f1 | tr -d 'v')"
  if [ "${node_ver}" != "${NODE_MAJOR}" ]; then
    log "Installing Node.js ${NODE_MAJOR}.x"
    curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" | $SUDO bash -
    $SUDO apt-get install -y -qq nodejs
  fi

  if ! command -v corepack >/dev/null 2>&1; then
    log "Installing corepack"
    $SUDO corepack enable
  fi
  corepack prepare pnpm@latest --activate

  if ! command -v pm2 >/dev/null 2>&1; then
    log "Installing PM2"
    $SUDO npm install -g pm2
  fi
}

# ─── Firewall ───
configure_firewall() {
  log "Configuring firewall"
  $SUDO ufw allow OpenSSH
  $SUDO ufw allow 'Nginx Full'
  $SUDO ufw --force enable
}

# ─── Application directory ───
prepare_app_dir() {
  log "Preparing ${APP_DIR}"
  $SUDO mkdir -p "${APP_DIR}" "${APP_DIR}/logs" "${APP_DIR}/prisma"
  $SUDO chown -R "$USER:$USER" "${APP_DIR}"

  # .env template (user must fill in secrets)
  if [ ! -f "${APP_DIR}/.env" ]; then
    cat > "${APP_DIR}/.env" <<-EOF
# === ESGGO Production .env ===
NODE_ENV=production
PORT=3000
DATABASE_URL="file:${APP_DIR}/prisma/dev.db"

# Redis
UPSTASH_REDIS_URL=
UPSTASH_REDIS_TOKEN=

# AI Provider (pick one)
OPENROUTER_API_KEY=
GEMINI_API_KEY=

# Telegram
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=

# Gateway
EMM_GATEWAY_URL=http://127.0.0.1:8642
EOF
    chmod 600 "${APP_DIR}/.env"
    log "!!! EDIT .env WITH YOUR SECRETS !!!"
  fi
}

# ─── Git-based deployment (optional) ───
setup_git_deploy() {
  if [ -z "$GIT_REMOTE" ]; then
    log "Skipping git deploy (no GIT_REMOTE set)"
    return
  fi
  log "Setting up git remote: ${GIT_REMOTE}"
  cd "${APP_DIR}"
  if [ ! -d .git ]; then
    git init
    git remote add origin "${GIT_REMOTE}"
    git fetch origin main
    git checkout main
  fi

  # post-receive hook: auto-deploy
  mkdir -p .git/hooks
  cat > .git/hooks/post-receive <<-'HOOK'
#!/usr/bin/env bash
set -Eeuo pipefail
APP_DIR="/var/www/esggo"
log() { echo "==> $1"; }
cd "${APP_DIR}"
git checkout -f main
log "Installing dependencies"
pnpm install --frozen-lockfile --no-optional 2>/dev/null || pnpm install
log "Building"
pnpm run build
log "Restarting services"
pm2 reload ecosystem.config.cjs 2>/dev/null || pm2 start ecosystem.config.cjs
pm2 save
log "Deploy complete"
HOOK
  chmod +x .git/hooks/post-receive
  log "Git post-receive hook installed"
}

# ─── PM2 ecosystem ───
setup_pm2() {
  log "Setting up PM2 ecosystem"
  cat > "${APP_DIR}/ecosystem.config.cjs" <<-'EOF'
module.exports = {
  apps: [
    {
      name: 'esggo-core',
      cwd: '/var/www/esggo',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      env: { NODE_ENV: 'production', PORT: 3000 },
      instances: 1,
      exec_mode: 'fork',
      max_memory_restart: '1G',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: 'logs/error.log',
      out_file: 'logs/out.log',
      merge_logs: true,
      autorestart: true,
    },
    {
      name: 'omniagent-gateway',
      cwd: '/var/www/esggo/apps/gateway',
      script: 'omni-server.mjs',
      interpreter: 'node',
      env: { PORT: 8642, NODE_ENV: 'production' },
      instances: 1,
      exec_mode: 'fork',
      max_memory_restart: '512M',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: 'logs/gateway-error.log',
      out_file: 'logs/gateway-out.log',
      merge_logs: true,
      autorestart: true,
    },
  ],
};
EOF
  log "PM2 ecosystem written"
}

# ─── Health monitor ───
setup_health_monitor() {
  log "Setting up health monitor"
  cat > "${APP_DIR}/health-monitor.sh" <<-'MONITOR'
#!/usr/bin/env bash
LOGFILE="/var/www/esggo/logs/health.log"
APP_DIR="/var/www/esggo"
check() {
  local name="$1" url="$2"
  if curl -sf --max-time 5 "$url" >/dev/null 2>&1; then
    echo "[$(date)] $name OK" >> "$LOGFILE"
  else
    echo "[$(date)] $name FAIL -> restarting" >> "$LOGFILE"
    cd "$APP_DIR" && pm2 restart "$name" 2>/dev/null
  fi
}
check "esggo-core" "http://127.0.0.1:3000/api/health"
check "omniagent-gateway" "http://127.0.0.1:8642/status"
MONITOR
  chmod +x "${APP_DIR}/health-monitor.sh"

  # Cron: every 5 minutes
  (crontab -l 2>/dev/null; echo "*/5 * * * * ${APP_DIR}/health-monitor.sh") | crontab -
  log "Health monitor cron installed (every 5 min)"
}

# ─── Nginx ───
setup_nginx() {
  log "Configuring Nginx"
  $SUDO tee /etc/nginx/sites-available/esggo >/dev/null <<-NGINX
server {
    listen 80;
    server_name ${DOMAIN} ${VPS_IP};
    return 301 https://\$server_name\$request_uri;
}
server {
    listen 443 ssl http2;
    server_name ${DOMAIN} ${VPS_IP};

    ssl_certificate /etc/letsencrypt/live/${DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${DOMAIN}/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    location /api/emm/metrics/stream {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Connection '';
        proxy_buffering off;
        proxy_cache off;
        chunked_transfer_encoding on;
    }
}
server {
    listen 443 ssl http2;
    server_name gateway.${DOMAIN};

    ssl_certificate /etc/letsencrypt/live/gateway.${DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/gateway.${DOMAIN}/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:8642;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
NGINX
  $SUDO ln -sf /etc/nginx/sites-available/esggo /etc/nginx/sites-enabled/
  $SUDO rm -f /etc/nginx/sites-enabled/default
  $SUDO nginx -t && $SUDO systemctl reload nginx
  log "Nginx configured"
}

# ─── SSL ───
setup_ssl() {
  log "Setting up Let's Encrypt SSL"
  $SUDO apt-get install -y -qq certbot python3-certbot-nginx
  $SUDO certbot --nginx -d "${DOMAIN}" --non-interactive --agree-tos --email "admin@${DOMAIN}" || true
  # Auto-renewal
  $SUDO systemctl enable certbot.timer
  $SUDO systemctl start certbot.timer
}

# ─── Main ───
install_runtime
configure_firewall
prepare_app_dir
setup_pm2
setup_health_monitor
setup_git_deploy
setup_nginx

log ""
log "=== VPS Setup Complete ==="
log "App: ${APP_DIR}"
log "Next:"
log "  1. Edit ${APP_DIR}/.env with secrets"
log "  2. Run: cd ${APP_DIR} && pnpm install && pnpm run build"
log "  3. Run: pm2 start ecosystem.config.cjs && pm2 save"
log "  4. Run: setup-ssl.sh to get HTTPS certificates"
log "  5. Verify: curl http://127.0.0.1:3000/api/health"
log ""
