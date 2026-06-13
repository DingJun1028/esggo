#!/usr/bin/env bash
set -Eeuo pipefail

APP_DIR="${APP_DIR:-/var/www/esggo/omniagent-gateway}"
PORT="${PORT:-8642}"
NODE_MAJOR="${NODE_MAJOR:-20}"
PM2_NAME="${PM2_NAME:-omniagent-gateway}"

if [ "$(id -u)" -eq 0 ]; then
  SUDO=""
else
  SUDO="sudo"
fi

log() {
  echo "==> $1"
}

install_runtime() {
  log "Installing system packages"
  $SUDO apt-get update
  $SUDO apt-get install -y curl git build-essential ca-certificates ufw

  local node_major=""
  if command -v node >/dev/null 2>&1; then
    node_major="$(node -v | cut -d. -f1 | tr -d 'v')"
  fi

  if [ "${node_major}" != "${NODE_MAJOR}" ]; then
    log "Installing Node.js ${NODE_MAJOR}.x"
    curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" | $SUDO -E bash -
    $SUDO apt-get install -y nodejs
  fi

  if ! command -v pm2 >/dev/null 2>&1; then
    log "Installing PM2"
    $SUDO npm install -g pm2
  fi
}

configure_network() {
  log "Opening SSH, HTTP, HTTPS, and OmniAgent Gateway ports"
  $SUDO ufw allow OpenSSH || true
  $SUDO ufw allow 'Nginx Full' || true
  $SUDO ufw allow "${PORT}/tcp" || true
  $SUDO ufw --force enable || true
}

prepare_app() {
  log "Preparing ${APP_DIR}"
  mkdir -p "${APP_DIR}" logs

  if [ ! -f "${APP_DIR}/package.json" ]; then
    cat > "${APP_DIR}/package.json" <<'EOF_PKG'
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

  if [ ! -f "${APP_DIR}/.env" ]; then
    cat > "${APP_DIR}/.env" <<EOF_ENV
PORT=${PORT}
VPS_IP=161.118.248.180
GATEWAY_API_KEY=change-me
GEMINI_API_KEY=
OPENROUTER_API_KEY=
ALLOWED_ORIGINS=http://161.118.248.180,http://127.0.0.1:3000,http://localhost:3000
EOF_ENV
    chmod 600 "${APP_DIR}/.env"
  fi
}

install_dependencies() {
  log "Installing OmniAgent Gateway dependencies"
  cd "${APP_DIR}"
  if [ -f package-lock.json ]; then
    npm ci
  else
    npm install
  fi
}

start_pm2() {
  log "Starting OmniAgent Gateway under PM2"
  cd "${APP_DIR}"
  pm2 delete "${PM2_NAME}" >/dev/null 2>&1 || true
  pm2 start omni-server.mjs --name "${PM2_NAME}" --interpreter node
  pm2 save
  pm2 startup systemd -u "${USER}" --hp "${HOME}" >/dev/null 2>&1 || true
}

healthcheck() {
  log "Waiting for gateway health"
  local ok=0
  for _ in $(seq 1 20); do
    if curl -fsS --max-time 3 "http://127.0.0.1:${PORT}/status" >/dev/null 2>&1; then
      ok=1
      break
    fi
    sleep 2
  done

  if [ "${ok}" != "1" ]; then
    pm2 logs "${PM2_NAME}" --lines 80 --nostream || true
    exit 1
  fi
}

install_runtime
configure_network
prepare_app
install_dependencies
start_pm2
healthcheck

log "OmniAgent Gateway is ready on http://127.0.0.1:${PORT}/status"
