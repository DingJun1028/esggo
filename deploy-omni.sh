#!/usr/bin/env bash
set -eu
set -o pipefail

VPS_USER="root"
VPS_HOST="161.118.248.180"
VPS_PORT="22"

APP_NAME="esggo"
REMOTE_DIR="/var/www/esggo"

# Git Bash / WSL 路徑自行修改
LOCAL_PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

NODE_MAJOR="20"

SSH_TARGET="${VPS_USER}@${VPS_HOST}"

echo "==> Ensure remote directory exists"
ssh -p "${VPS_PORT}" -n "${SSH_TARGET}" "mkdir -p '${REMOTE_DIR}'"

echo "==> Upload project files to VPS"
rsync -az --delete \
  -e "ssh -p ${VPS_PORT}" \
  --exclude ".git" \
  --exclude "node_modules" \
  --exclude ".next" \
  --exclude "dist" \
  --exclude "build" \
  --exclude ".env" \
  --exclude ".env.local" \
  --exclude ".DS_Store" \
  "${LOCAL_PROJECT_DIR}/" "${SSH_TARGET}:${REMOTE_DIR}/"

echo "==> Install runtime and deploy on VPS"
ssh -p "${VPS_PORT}" "${SSH_TARGET}" <<EOF
set -euo pipefail

if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_${NODE_MAJOR}.x | sudo -E bash -
  sudo apt-get update
  sudo apt-get install -y nodejs build-essential
fi

if ! command -v pm2 >/dev/null 2>&1; then
  sudo npm install -g pm2
fi

cd "${REMOTE_DIR}"

if [ -f ".env.production" ]; then
  cp .env.production .env
fi

if [ -f "package-lock.json" ]; then
  npm ci
else
  npm install
fi

if npm run | grep -q " build"; then
  npm run build
fi

pm2 delete "${APP_NAME}" >/dev/null 2>&1 || true
pm2 delete "omniagent-gateway" >/dev/null 2>&1 || true

if npm run | grep -q " start"; then
  pm2 start npm --name "${APP_NAME}" -- start
elif [ -f "server.js" ]; then
  pm2 start server.js --name "${APP_NAME}"
elif [ -f "app.js" ]; then
  pm2 start app.js --name "${APP_NAME}"
else
  echo "No start command or server entry found."
  exit 1
fi

# 啟動 AI 網關
if [ -f "omniagent-gateway/omni-server.mjs" ]; then
  pm2 start omniagent-gateway/omni-server.mjs --name "omniagent-gateway"
fi

pm2 save
pm2 startup systemd -u "${VPS_USER}" --hp "/home/${VPS_USER}" || true
EOF

echo "==> Done"
echo "Check with:"
echo "  ssh -p ${VPS_PORT} ${SSH_TARGET}"
echo "  pm2 status"
echo "  pm2 logs ${APP_NAME}"
