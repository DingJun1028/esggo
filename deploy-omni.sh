#!/usr/bin/env bash
set -Eeuo pipefail

VPS_USER="${VPS_USER:-root}"
VPS_HOST="${VPS_HOST:-161.118.248.180}"
VPS_PORT="${VPS_PORT:-22}"
SSH_KEY_PATH="${SSH_KEY_PATH:-}"
SSH_ARGS_EXTRA="${SSH_ARGS_EXTRA:-}"
REMOTE_DIR="${REMOTE_DIR:-/var/www/esggo}"
LOCAL_ENV_PATH="${LOCAL_ENV_PATH:-.env.production}"
APP_NAME="${APP_NAME:-esggo}"
GATEWAY_NAME="${GATEWAY_NAME:-omniagent-gateway}"
NODE_MAJOR="${NODE_MAJOR:-20}"
APP_PORT="${APP_PORT:-3000}"
GATEWAY_PORT="${GATEWAY_PORT:-8642}"
HEALTHCHECK_PATH="${HEALTHCHECK_PATH:-/}"
BUILD_MEMORY_MB="${BUILD_MEMORY_MB:-4096}"
HARDEN_SSH="${HARDEN_SSH:-false}"
NEXT_PUBLIC_OMNIAGENT_GATEWAY_URL="${NEXT_PUBLIC_OMNIAGENT_GATEWAY_URL:-http://${VPS_HOST}:${GATEWAY_PORT}}"
OMNIAGENT_API_URL="${OMNIAGENT_API_URL:-http://127.0.0.1:${GATEWAY_PORT}}"

LOCAL_PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SSH_TARGET="${VPS_USER}@${VPS_HOST}"

if [[ ! -d "$LOCAL_PROJECT_DIR" ]]; then
  echo "Local project directory not found: ${LOCAL_PROJECT_DIR}" >&2
  exit 1
fi

if [[ -n "$SSH_KEY_PATH" && ! -f "$SSH_KEY_PATH" ]]; then
  echo "SSH key not found: ${SSH_KEY_PATH}" >&2
  exit 1
fi

if ! command -v rsync >/dev/null 2>&1; then
  echo "rsync is required on the local machine." >&2
  exit 1
fi

SSH_ARGS=(-p "${VPS_PORT}" -o StrictHostKeyChecking=accept-new -o ConnectTimeout=20)
if [[ -n "$SSH_KEY_PATH" ]]; then
  SSH_ARGS+=(-i "${SSH_KEY_PATH}")
fi
if [[ -n "$SSH_ARGS_EXTRA" ]]; then
  read -r -a EXTRA_SSH_ARGS <<<"${SSH_ARGS_EXTRA}"
  SSH_ARGS+=("${EXTRA_SSH_ARGS[@]}")
fi

SSH_EXEC="$(printf 'ssh %q ' "${SSH_ARGS[@]}")"

echo "==> Preparing ESGGO VPS deployment target: ${SSH_TARGET}"
ssh "${SSH_ARGS[@]}" "${SSH_TARGET}" "mkdir -p '${REMOTE_DIR}'"

if [[ -f "$LOCAL_ENV_PATH" ]]; then
  echo "==> Uploading ${LOCAL_ENV_PATH} as ${REMOTE_DIR}/.env.production"
  scp "${SSH_ARGS[@]}" "$LOCAL_ENV_PATH" "${SSH_TARGET}:${REMOTE_DIR}/.env.production"
else
  echo "==> ${LOCAL_ENV_PATH} not found; remote deployment will keep existing .env.production or create a minimal one"
fi

echo "==> Uploading project files"
rsync -az --delete \
  -e "$SSH_EXEC" \
  --exclude ".git" \
  --exclude "node_modules" \
  --exclude ".next" \
  --exclude "dist" \
  --exclude "build" \
  --exclude ".env" \
  --exclude ".env.*" \
  --exclude ".DS_Store" \
  "${LOCAL_PROJECT_DIR}/" "${SSH_TARGET}:${REMOTE_DIR}/"

echo "==> Configuring VPS runtime, PM2, Nginx, firewall, and SSH policy"
ssh "${SSH_ARGS[@]}" "${SSH_TARGET}" 'bash -s' <<REMOTE
set -Eeuo pipefail
export DEBIAN_FRONTEND=noninteractive

VPS_USER="${VPS_USER}"
VPS_HOST="${VPS_HOST}"
REMOTE_DIR="${REMOTE_DIR}"
APP_NAME="${APP_NAME}"
GATEWAY_NAME="${GATEWAY_NAME}"
NODE_MAJOR="${NODE_MAJOR}"
APP_PORT="${APP_PORT}"
GATEWAY_PORT="${GATEWAY_PORT}"
HEALTHCHECK_PATH="${HEALTHCHECK_PATH}"
BUILD_MEMORY_MB="${BUILD_MEMORY_MB}"
HARDEN_SSH="${HARDEN_SSH}"
NEXT_PUBLIC_OMNIAGENT_GATEWAY_URL="${NEXT_PUBLIC_OMNIAGENT_GATEWAY_URL}"
OMNIAGENT_API_URL="${OMNIAGENT_API_URL}"

if [ "$(id -u)" -eq 0 ]; then
  SUDO=""
else
  SUDO="sudo"
fi

log() {
  echo "==> \$1"
}

install_packages() {
  log "Installing Ubuntu packages"
  \$SUDO apt-get update
  \$SUDO apt-get install -y curl git build-essential ca-certificates nginx ufw
}

install_node() {
  local node_major=""
  if command -v node >/dev/null 2>&1; then
    node_major="\$(node -v | cut -d. -f1 | tr -d 'v')"
  fi

  if [ "\${node_major}" != "${NODE_MAJOR}" ]; then
    log "Installing Node.js ${NODE_MAJOR}.x"
    curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" | \$SUDO -E bash -
    \$SUDO apt-get install -y nodejs
  fi
}

install_pm2() {
  if ! command -v pm2 >/dev/null 2>&1; then
    log "Installing PM2"
    \$SUDO npm install -g pm2
  fi
}

configure_firewall() {
  log "Opening SSH, HTTP, HTTPS, and OmniAgent Gateway ports"
  \$SUDO ufw allow OpenSSH || true
  \$SUDO ufw allow 'Nginx Full' || true
  \$SUDO ufw allow "\${GATEWAY_PORT}/tcp" || true
  \$SUDO ufw --force enable || true
}

optional_ssh_hardening() {
  if [ "\${HARDEN_SSH}" != "true" ]; then
    return
  fi

  log "Applying optional SSH hardening"
  \$SUDO cp /etc/ssh/sshd_config "/etc/ssh/sshd_config.bak.\$(date +%Y%m%d%H%M%S)"
  \$SUDO sed -i 's/^#\?PermitRootLogin .*/PermitRootLogin no/' /etc/ssh/sshd_config
  \$SUDO sed -i 's/^#\?PasswordAuthentication .*/PasswordAuthentication no/' /etc/ssh/sshd_config
  \$SUDO sed -i 's/^#\?PubkeyAuthentication .*/PubkeyAuthentication yes/' /etc/ssh/sshd_config
  \$SUDO systemctl reload ssh || \$SUDO systemctl reload sshd
}

write_minimal_env() {
  if [ ! -f "\${REMOTE_DIR}/.env.production" ]; then
    log "Creating minimal .env.production"
    cat > "\${REMOTE_DIR}/.env.production" <<EOF_ENV
NODE_ENV=production
PORT=${APP_PORT}
OMNIAGENT_API_URL=${OMNIAGENT_API_URL}
NEXT_PUBLIC_OMNIAGENT_GATEWAY_URL=${NEXT_PUBLIC_OMNIAGENT_GATEWAY_URL}
NEXT_PUBLIC_SYSTEM_DESIGN_VERSION=8.5.0-Alpha
EOF_ENV
    chmod 600 "\${REMOTE_DIR}/.env.production"
  fi

  if [ ! -f "\${REMOTE_DIR}/omniagent-gateway/.env" ]; then
    log "Creating minimal OmniAgent Gateway .env"
    cat > "\${REMOTE_DIR}/omniagent-gateway/.env" <<EOF_ENV
PORT=${GATEWAY_PORT}
VPS_IP=${VPS_HOST}
GATEWAY_API_KEY=change-me
GEMINI_API_KEY=
OPENROUTER_API_KEY=
ALLOWED_ORIGINS=http://${VPS_HOST},http://127.0.0.1:${APP_PORT},http://localhost:${APP_PORT}
EOF_ENV
    chmod 600 "\${REMOTE_DIR}/omniagent-gateway/.env"
  fi
}

write_nginx_config() {
  log "Writing Nginx reverse proxy configuration"
  \$SUDO tee /etc/nginx/sites-available/esggo >/dev/null <<EOF_NGINX
server {
  listen 80;
  server_name _;
  client_max_body_size 20m;

  location /omniagent-gateway/ {
    proxy_pass http://127.0.0.1:${GATEWAY_PORT}/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade \$http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
  }

  location / {
    proxy_pass http://127.0.0.1:${APP_PORT};
    proxy_http_version 1.1;
    proxy_set_header Upgrade \$http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
  }
}
EOF_NGINX
  \$SUDO ln -sfn /etc/nginx/sites-available/esggo /etc/nginx/sites-enabled/esggo
  \$SUDO rm -f /etc/nginx/sites-enabled/default
  \$SUDO nginx -t
  \$SUDO systemctl reload nginx || \$SUDO systemctl restart nginx
}

install_gateway_dependencies() {
  if [ -f "\${REMOTE_DIR}/omniagent-gateway/package.json" ]; then
    log "Installing OmniAgent Gateway dependencies"
    cd "\${REMOTE_DIR}/omniagent-gateway"
    mkdir -p logs
    if [ -f package-lock.json ]; then
      npm ci
    else
      npm install
    fi
  fi
}

deploy_app() {
  log "Installing production dependencies"
  cd "\${REMOTE_DIR}"
  if [ -f package-lock.json ]; then
    npm ci
  else
    npm install
  fi

  log "Building Next.js production bundle"
  NODE_OPTIONS="--max_old_space_size=${BUILD_MEMORY_MB}m" npm run build

  log "Starting ESGGO with PM2"
  pm2 delete "\${APP_NAME}" >/dev/null 2>&1 || true
  pm2 start npm --name "\${APP_NAME}" -- start
}

deploy_gateway() {
  if [ ! -f "\${REMOTE_DIR}/omniagent-gateway/omni-server.mjs" ]; then
    log "OmniAgent Gateway source not found; skipping gateway PM2 start"
    return
  fi

  log "Starting OmniAgent Gateway with PM2"
  cd "\${REMOTE_DIR}"
  pm2 delete "\${GATEWAY_NAME}" >/dev/null 2>&1 || true
  pm2 start omniagent-gateway/omni-server.mjs --name "\${GATEWAY_NAME}" --interpreter node
}

wait_for_http() {
  local url="\$1"
  local label="\$2"
  local ok=0

  for _ in \$(seq 1 30); do
    if curl -fsS --max-time 5 "\${url}" >/dev/null 2>&1; then
      ok=1
      break
    fi
    sleep 2
  done

  if [ "\${ok}" != "1" ]; then
    echo "Health check failed for \${label}: \${url}" >&2
    pm2 status || true
    pm2 logs --lines 80 --nostream || true
    exit 1
  fi
}

install_packages
install_node
install_pm2
configure_firewall
optional_ssh_hardening
write_minimal_env
write_nginx_config
install_gateway_dependencies
deploy_app
deploy_gateway

log "Saving PM2 process list and enabling startup"
pm2 save
pm2 startup systemd -u "\${VPS_USER}" --hp "/home/\${VPS_USER}" >/dev/null 2>&1 || true

wait_for_http "http://127.0.0.1:\${APP_PORT}\${HEALTHCHECK_PATH}" "ESGGO Next.js app"
wait_for_http "http://127.0.0.1:\${GATEWAY_PORT}/status" "OmniAgent Gateway"

log "Deployment complete"
pm2 status "\${APP_NAME}" "\${GATEWAY_NAME}" || pm2 status
REMOTE

echo "==> Verifying public endpoints"
curl -fsS --max-time 10 "http://${VPS_HOST}${HEALTHCHECK_PATH}" >/dev/null || true
curl -fsS --max-time 10 "http://${VPS_HOST}:${GATEWAY_PORT}/status" >/dev/null || true

echo "==> Done"
echo "SSH: ssh -p ${VPS_PORT} ${SSH_TARGET}"
echo "App:  http://${VPS_HOST}${HEALTHCHECK_PATH}"
echo "Gateway status: http://${VPS_HOST}:${GATEWAY_PORT}/status"
echo "Optional SSH hardening: set HARDEN_SSH=true only after confirming SSH key access."
