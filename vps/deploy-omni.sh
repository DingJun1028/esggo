#!/usr/bin/env bash
# ESGGO Omni Deployment — Atomic release script for Oracle Cloud (Ubuntu 24.04 / ARM64)
# Run on the VPS via Oracle Serial Console (or SSH once reachable).
set -Eeuo pipefail

APP_NAME="esggo-app"
REPO_URL="https://github.com/DingJun1028/esggo.git"
BRANCH="main"
APP_DIR="/opt/esggo-app"
NODE_VERSION="22"
PORT="3000"
HEALTHCHECK_PATH="/"
BUILD_CMD="NODE_OPTIONS=--max_old_space_size=8192 npm run build"
PM2_SCRIPT="npm"
PM2_ARGS="run start"
KEEP_RELEASES="5"
TARGET_USER="ubuntu"

echo "=== [通] 啟動 ESGGO OCI-ARM 原子部署 ==="
TIMESTAMP="$(date +%Y%m%d%H%M%S)"
RELEASE_DIR="$APP_DIR/releases/$TIMESTAMP"
mkdir -p "$RELEASE_DIR"
echo "RELEASE_DIR=$RELEASE_DIR"

# 1. Pull latest source
echo "=== [真] 從 GitHub HTTPS 免密碼拉取代碼 ==="
git clone --depth 1 --branch "$BRANCH" "$REPO_URL" "$RELEASE_DIR"

# 2. Node env
echo "=== [環境] 切換至 $TARGET_USER 環境配置 Node.js $NODE_VERSION ==="
NODE_BIN="$APP_DIR/current/node_modules/.bin"
run_as() { sudo -u "$TARGET_USER" bash -c "export NVM_DIR=\$HOME/.nvm; [ -s \$NVM_DIR/nvm.sh ] && . \$NVM_DIR/nvm.sh; nvm use $NODE_VERSION >/dev/null 2>&1; $*"; }

# 3. Install deps
echo "=== [善] 安裝生產環境依賴 ==="
run_as "cd $RELEASE_DIR && npm ci --omit=dev || npm install --production"

# 4. Build
echo "=== [建] 執行 Next.js 生產編譯 ==="
run_as "cd $RELEASE_DIR && $BUILD_CMD"

# 5. Atomic symlink swap (0-downtime)
echo "=== [美] 原子級軟連結秒級切換 ==="
ln -sfn "$RELEASE_DIR" "$APP_DIR/current"

# 6. PM2 process management
echo "=== [真] 交付 PM2 守護，實施熱重載 ==="
run_as "pm2 stop $APP_NAME || true"
run_as "pm2 start $PM2_SCRIPT --name $APP_NAME -- $PM2_ARGS || pm2 restart $APP_NAME"
run_as "pm2 save"
echo "=== [優化] 清理歷史老舊版本 ==="
# keep only the newest KEEP_RELEASES releases
ls -1dt "$APP_DIR"/releases/*/ 2>/dev/null | tail -n +$((KEEP_RELEASES+1)) | xargs -r rm -rf

# 7. Health check
echo "=== [4/4] 啟動終端健全度審查 ==="
sleep 4
if curl -fsS "http://127.0.0.1:$PORT$HEALTHCHECK_PATH" >/dev/null 2>&1; then
  echo "=== [5T ALL COMPLIANT] ESGGO 全端平台已成功在 Oracle Cloud 上線！ ==="
  echo "請至瀏覽器直接存取: http://161.118.248.180:$PORT"
else
  echo "=== [WARN] 本地健康檢查未通過，請檢查 pm2 logs $APP_NAME ==="
  run_as "pm2 logs $APP_NAME --lines 30 --nostream" || true
fi
echo "=== DEPLOY_DONE ==="
