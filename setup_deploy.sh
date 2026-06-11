#!/usr/bin/env bash
set -Eeuo pipefail

########################################
# 核心配置區塊（已為 esggo-app 精度填寫）
########################################
APP_NAME="esggo-app"
REPO_URL="git@github.com:DingJun1028/esggo.git"
BRANCH="main"
APP_DIR="/opt/esggo-app"
NODE_VERSION="20"
PORT="3000"
HEALTHCHECK_PATH="/"
BUILD_CMD="NODE_OPTIONS=--max_old_space_size=4096 npm run build"
KEEP_RELEASES="5"

# 第一次自動建立 shared/.env 的內容
ENV_FILE_CONTENT=$(cat <<'EOF'
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_SYSTEM_DESIGN_VERSION="8.5.0-Alpha"
EOF
)

########################################
# 底層自動化織網架構（已修正防脆斷機制）
########################################

trap 'echo "❌ 系統熔斷：第 $LINENO 行出錯"; exit 1' ERR

if [ "${EUID}" -eq 0 ]; then
  SUDO=""
else
  SUDO="sudo"
fi

log() {
  echo -e "\n=== 🌟 $1 ==="
}

ensure_apt_pkg() {
  if command -v apt-get >/dev/null 2>&1; then
    $SUDO apt-get update -y
    $SUDO apt-get install -y curl git build-essential ca-certificates
  else
    echo "❌ 目前只支援 Ubuntu/Debian 系統環境。"
    exit 1
  fi
}

install_nvm_node_pm2() {
  log "環境初始化：安裝系統套件"
  ensure_apt_pkg

  export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
  if [ ! -s "$NVM_DIR/nvm.sh" ]; then
    log "環境初始化：下載並安裝 NVM"
    curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
  fi

  # shellcheck disable=SC1090
  source "$NVM_DIR/nvm.sh"

  log "環境初始化：鎖定 Node.js ${NODE_VERSION}"
  nvm install "$NODE_VERSION"
  nvm alias default "$NODE_VERSION"
  nvm use "$NODE_VERSION"

  if ! command -v pm2 >/dev/null 2>&1; then
    log "環境初始化：全局安裝 PM2 守護程序"
    npm install -g pm2
  fi
}

prepare_dirs() {
  log "架構建立：配置 /opt 部署目錄與權限"
  $SUDO mkdir -p "$APP_DIR/releases" "$APP_DIR/shared" "$APP_DIR/bin"
  $SUDO chown -R "$USER":"$(id -gn)" "$APP_DIR"
}

write_config() {
  log "契約鑄造：寫入 deploy.conf 與 PM2 生態配置文件"

  cat > "$APP_DIR/shared/deploy.conf" <<EOF
APP_NAME='$APP_NAME'
REPO_URL='$REPO_URL'
BRANCH='$BRANCH'
APP_DIR='$APP_DIR'
NODE_VERSION='$NODE_VERSION'
PORT='$PORT'
HEALTHCHECK_PATH='$HEALTHCHECK_PATH'
BUILD_CMD='$BUILD_CMD'
KEEP_RELEASES='$KEEP_RELEASES'
EOF

  if [ ! -f "$APP_DIR/shared/.env" ]; then
    cat > "$APP_DIR/shared/.env" <<EOF
$ENV_FILE_CONTENT
EOF
    echo "✅ 已初始化核心環境變數：$APP_DIR/shared/.env"
  fi

  # 【美與信支柱】修正：捨棄不穩定的 npm run start 殼，直接以 Node.js 執行 Next.js 核心二進位
  cat > "$APP_DIR/shared/ecosystem.config.cjs" <<EOF
module.exports = {
  apps: [
    {
      name: "$APP_NAME",
      cwd: "$APP_DIR/current",
      script: "./node_modules/next/dist/bin/next",
      args: "start",
      exec_mode: "fork",
      instances: 1,
      autorestart: true,
      max_restarts: 10,
      restart_delay: 3000,
      kill_timeout: 5000,
      env: {
        NODE_ENV: "production",
        PORT: "$PORT"
      }
    }
  ]
};
EOF
}

write_helper_scripts() {
  log "工具鏈刻印：建立原子化指令集 (deploy/rollback/status)"

  # 1. 核心自動化部署指令
  cat > "$APP_DIR/bin/deploy.sh" <<'EOF'
#!/usr/bin/env bash
set -Eeuo pipefail

BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
# shellcheck disable=SC1091
source "$BASE_DIR/shared/deploy.conf"

trap 'echo "❌ deploy 熔斷：第 $LINENO 行出錯"; exit 1' ERR

export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
# shellcheck disable=SC1090
source "$NVM_DIR/nvm.sh"
nvm use "$NODE_VERSION" >/dev/null

TIMESTAMP="$(date +%Y%m%d%H%M%S)"
RELEASE_DIR="$APP_DIR/releases/$TIMESTAMP"

echo "==== 📥 1. 抓取原始碼專案 (Branch: $BRANCH) ===="
# 【防脆斷機制】自動跳過第一次 SSH 的互動式主機憑證確認
export GIT_SSH_COMMAND="ssh -o StrictHostKeyChecking=no"
git clone --depth 1 --branch "$BRANCH" "$REPO_URL" "$RELEASE_DIR"

cd "$RELEASE_DIR"

echo "==== 🔗 2. 鏈結生產環境與資產證據庫 ===="
ln -sfn "$APP_DIR/shared/.env" "$RELEASE_DIR/.env"

echo "==== 📦 3. 安裝依賴 (npm ci 剛性鎖定) ===="
if [ -f package-lock.json ]; then
  npm ci
else
  npm install
fi

if [ -n "${BUILD_CMD:-}" ] && [ "$BUILD_CMD" != ":" ]; then
  echo "==== 🏗️ 4. 執行 Next.js 生產端編譯 ===="
  # 直接注入防記憶體溢出參數並編譯
  eval "$BUILD_CMD"
fi

echo "==== 🔄 5. 原子軟連結切換 (Zero-Downtime) ===="
ln -sfn "$RELEASE_DIR" "$APP_DIR/current"

echo "==== 🚀 6. PM2 熱重載啟動 ===="
if pm2 describe "$APP_NAME" >/dev/null 2>&1; then
  pm2 reload "$APP_DIR/shared/ecosystem.config.cjs" --update-env
else
  pm2 start "$APP_DIR/shared/ecosystem.config.cjs" --update-env
fi

echo "==== 🩺 7. 5T 健全度與零幻覺健康檢查 ===="
HEALTH_URL="http://127.0.0.1:${PORT}${HEALTHCHECK_PATH}"
ok="0"
for i in $(seq 1 15); do
  if curl -fsS --max-time 3 "$HEALTH_URL" >/dev/null 2>&1; then
    ok="1"
    break
  fi
  echo "等待應用就緒... ($i/15)"
  sleep 2
done

if [ "$ok" != "1" ]; then
  echo "❌ 錯誤：健康檢查於 $HEALTH_URL 失敗！服務未正常啟動。"
  echo "請立刻執行：$APP_DIR/bin/status.sh 查看錯誤日誌。"
  exit 1
fi

pm2 save

echo "==== 🧹 8. 系統自動化減熵（清掉舊版本，保留 $KEEP_RELEASES 版）===="
mapfile -t releases < <(find "$APP_DIR/releases" -mindepth 1 -maxdepth 1 -type d | sort -r)
if [ "${#releases[@]}" -gt "$KEEP_RELEASES" ]; then
  for old in "${releases[@]:$KEEP_RELEASES}"; do
    rm -rf "$old"
  done
fi

echo -e "
✅ 恭喜！esggo-app 部署成功！"
echo "當前運行版本目錄 -> $(readlink -f "$APP_DIR/current")"
pm2 status "$APP_NAME"
EOF
  chmod +x "$APP_DIR/bin/deploy.sh"

  # 2. 秒級回滾指令
  cat > "$APP_DIR/bin/rollback.sh" <<'EOF'
#!/usr/bin/env bash
set -Eeuo pipefail

BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
source "$BASE_DIR/shared/deploy.conf"

trap 'echo "❌ rollback 失敗"; exit 1' ERR

export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
source "$NVM_DIR/nvm.sh"
nvm use "$NODE_VERSION" >/dev/null

mapfile -t releases < <(find "$APP_DIR/releases" -mindepth 1 -maxdepth 1 -type d | sort -r)

if [ "${#releases[@]}" -lt 2 ]; then
  echo "❌ 熵減核心警告：歷史版本不足，無可供回滾之資產項目。"
  exit 1
fi

TARGET="${releases[1]}"
echo " 正在緊急原子回滾至前一版本：$TARGET"

ln -sfn "$TARGET" "$APP_DIR/current"
pm2 reload "$APP_DIR/shared/ecosystem.config.cjs" --update-env

echo "✅ 回滾完成。"
EOF
  chmod +x "$APP_DIR/bin/rollback.sh"

  # 3. 狀態檢查指令
  cat > "$APP_DIR/bin/status.sh" <<'EOF'
#!/usr/bin/env bash
set -Eeuo pipefail
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
source "$BASE_DIR/shared/deploy.conf"

echo -e "=== 📊 系統狀態面板 ==="
echo "應用名稱: $APP_NAME"
echo "當前連結路徑: $(readlink -f "$APP_DIR/current" 2>/dev/null || echo '尚未完成初次部署')"
echo -e "
--- PM2 監控進程 ---"
pm2 status "$APP_NAME"
echo -e "
--- 即時 Logs 摘要 ---"
pm2 logs "$APP_NAME" --lines 15 --no-stream
EOF
  chmod +x "$APP_DIR/bin/status.sh"
}

enable_pm2_startup() {
  log "系統守護：設定 PM2 開機自啟動服務"
  export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
  source "$NVM_DIR/nvm.sh"
  nvm use "$NODE_VERSION" >/dev/null

  NODE_BIN_DIR="$(dirname "$(command -v node)")"
  PM2_BIN_DIR="$(dirname "$(command -v pm2)")"

  $SUDO env PATH="$PATH:$NODE_BIN_DIR:$PM2_BIN_DIR" pm2 startup systemd -u "$USER" --hp "$HOME" >/dev/null 2>&1 || true
  pm2 save >/dev/null 2>&1 || true
}

main() {
  install_nvm_node_pm2
  prepare_dirs
  write_config
  write_helper_scripts
  
  log "自動發動：執行首次生產環境部署流水線"
  "$APP_DIR/bin/deploy.sh"
  
  enable_pm2_startup

  echo -e "
========================================================"
  echo "✅ 萬能原子部署架構建置完畢！"
  echo "核心運作指令快捷鍵："
  echo "  1. 觸發新版本發布： $APP_DIR/bin/deploy.sh"
  echo "  2. 檢查目前系統日誌： $APP_DIR/bin/status.sh"
  echo "  3. 緊急回滾上一版： $APP_DIR/bin/rollback.sh"
  echo "========================================================"
}

main
