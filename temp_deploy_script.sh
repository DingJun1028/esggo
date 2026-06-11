#!/usr/bin/env bash
set -euo pipefail

# --- Configuration (IMPORTANT: Verify these values!) ---
YOUR_VPS_USER="root"                      # <<< CONFIRM YOUR VPS USERNAME (e.g., root or dingjunhong1028)
YOUR_VPS_IP="161.118.248.180"             # <<< CONFIRM YOUR VPS PUBLIC IP
SSH_KEY_PATH="$HOME/.ssh/vps_key" # <<< Path to your custom SSH private key. VERIFY THIS! Moved to WSL home for reliability.
LOCAL_ENV_PATH=".env.production"          # <<< Path to your production environment file. Ensure it exists if needed.
APP_DIR_NAME="esggo-app"                  # Name of the application directory on the VPS
REMOTE_APP_PATH="/opt/${APP_DIR_NAME}"    # Final deployment path on VPS
TEMP_TAR_NAME="esggo-app.tar.gz"          # Temporary tarball name
LOCAL_TEMP_PATH="/tmp/${TEMP_TAR_NAME}"   # Temporary path on local machine
REMOTE_TEMP_PATH="/tmp/${TEMP_TAR_NAME}"  # Temporary path on VPS
REMOTE_SCRIPT_NAME="esggo_remote_deploy.sh" # Name for the script that will run on the VPS

LOCAL_SOURCE_DIR=$(pwd -P)                # Local project root (using -P for physical path)

echo "--- Deploying Node.js application to VPS (${YOUR_VPS_USER}@${YOUR_VPS_IP}) ---"

# --- SSH/SCP Options ---
SSH_OPTIONS=""
if [[ -n "${SSH_KEY_PATH}" ]]; then
  # Ensure the SSH key path is quoted properly for scp/ssh
  SSH_OPTIONS="-i "${SSH_KEY_PATH}""
fi

# 1️⃣ Archive local project directory (excluding node_modules and .git)
echo "Archiving local project directory..."
tar -czf "${LOCAL_TEMP_PATH}" --exclude='node_modules' --exclude='.git' --exclude='.kilo' --exclude='dist' --exclude='.next' -C "${LOCAL_SOURCE_DIR}" .

# 2️⃣ Securely copy the tar archive to the VPS
echo "Transferring '${LOCAL_TEMP_PATH}' to VPS at '${YOUR_VPS_IP}:${REMOTE_TEMP_PATH}'..."
eval scp ${SSH_OPTIONS} "${LOCAL_TEMP_PATH}" "${YOUR_VPS_USER}@${YOUR_VPS_IP}:${REMOTE_TEMP_PATH}"

# 3️⃣ Securely copy the environment file
if [ -f "${LOCAL_ENV_PATH}" ]; then
  echo "Transferring environment file '${LOCAL_ENV_PATH}' to VPS at '${YOUR_VPS_IP}:/tmp/.env'... "
  eval scp ${SSH_OPTIONS} "${LOCAL_ENV_PATH}" "${YOUR_VPS_USER}@${YOUR_VPS_IP}:/tmp/.env"
else
  echo "Warning: Environment file '${LOCAL_ENV_PATH}' not found. Skipping transfer."
fi

# NEW STEP: Create the remote deployment script locally based on user's input
echo "--- Creating remote deployment script locally ---"
cat << 'EOF_REMOTE_SCRIPT' > "/tmp/${REMOTE_SCRIPT_NAME}"
#!/usr/bin/env bash
set -Eeuo pipefail

########################################
# 🔧 核心配置區 (已為 OCI ARM 免費神機完美調校)
########################################
APP_NAME="esggo-app"
REPO_URL="https://github.com/DingJun1028/esggo.git"
BRANCH="main"
APP_DIR="/opt/esggo-app"
NODE_VERSION="20"
PORT="3000"
HEALTHCHECK_PATH="/"
BUILD_CMD="NODE_OPTIONS=--max_old_space_size=8192 npm run build"
PM2_SCRIPT="npm"
PM2_ARGS="run start"
KEEP_RELEASES="5"

ENV_FILE_CONTENT=$(cat <<'EOF'
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_SYSTEM_DESIGN_VERSION=8.5.0-Alpha
EOF
)

########################################
# 不用改下面（保持原腳本高度自動化邏輯）
########################################
RELEASES_DIR="${APP_DIR}/releases"
SHARED_DIR="${APP_DIR}/shared"
CURRENT_SYMLINK="${APP_DIR}/current"
RELEASE_TIMESTAMP=$(date +%Y%m%d%H%M%S)
NEW_RELEASE_DIR="${RELEASES_DIR}/${RELEASE_TIMESTAMP}"

echo "=== ⛓️ [通] 啟動 ESGGO OCI-ARM 原子滾動部署流水線 ==="
echo "當前操作使用者: $(whoami) | 目標目錄: ${APP_DIR}"

# 1️⃣ 建立核心目錄並接軌 dingjunhong1028 擁有者權限
if [ ! -d "$APP_DIR" ]; then
    echo "--- 🔒 [信] 偵測到核心區塊未初始化，自動提權鑄造 ---"
    sudo mkdir -p "$APP_DIR" "$RELEASES_DIR" "$SHARED_DIR"
fi
sudo chown -R "$(whoami):$(whoami)" "$APP_DIR"

# 2️⃣ 生產環境機密配置檔防護
if [ ! -f "${SHARED_DIR}/.env" ]; then
    echo "--- 🔐 [信] 初始化生產環境 .env 密鑰禁區 ---"
    echo "$ENV_FILE_CONTENT" > "${SHARED_DIR}/.env"
    chmod 600 "${SHARED_DIR}/.env"
fi

# 3️⃣ 原始碼拉取 (HTTPS 協議無痛免密碼)
echo "--- 📦 [真] 從 GitHub 拉取最新程式碼契約 ---"
git clone --depth 1 --branch "$BRANCH" "$REPO_URL" "$NEW_RELEASE_DIR"

# 4️⃣ 建立共享連結
ln -sfn "${SHARED_DIR}/.env" "${NEW_RELEASE_DIR}/.env"

# 5️⃣ NVM 與 Node.js 環境校準
export NVM_DIR="$HOME/.nvm"
if [ ! -d "$NVM_DIR" ]; then
    echo "未偵測到 NVM，正在啟動標準安裝..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
fi
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

nvm install "$NODE_VERSION"
nvm use "$NODE_VERSION"

# 6️⃣ 生產依賴安裝與編譯 (ARM 核心加速)
cd "$NEW_RELEASE_DIR"
npm cache clean --force || true
npm ci --omit=dev

echo "執行專案 Build 序章 (已解鎖 8GB 記憶體限制)..."
eval "$BUILD_CMD"

# 7️⃣ 原子級指針秒級切換 (0-Downtime 關鍵)
echo "--- 🔄 [美] 執行原子級軟連結指針更換 ---"
ln -sfn "$NEW_RELEASE_DIR" "$CURRENT_SYMLINK"

# 8️⃣ PM2 平滑熱重載
echo "--- 🚀 [真] 交付 PM2 守護進程，實施 0-Downtime 熱重載 ---"
cd "$CURRENT_SYMLINK"
npm install pm2 -g

if pm2 describe "$APP_NAME" > /dev/null 2>&1; then
    echo "既有服務在線，執行平滑熱重載..."
    pm2 reload "$APP_NAME"
else
    echo "初次上線，宣告守護實例..."
    pm2 start "$PM2_SCRIPT" --name "$APP_NAME" --max-memory-restart 2G -- $PM2_ARGS
fi
pm2 save

# 9️⃣ 歷史老舊版本洗滌 (環境熵減)
echo "--- 🧹 [優化] 清理歷史過期版本，釋放硬碟空間 ---"
cd "$RELEASES_DIR"
ls -1t | tail -n +$((KEEP_RELEASES + 1)) | xargs -I {} rm -rf {}

# 🔟 OCI 端後置健康檢查
echo "--- 🩺 [4/4] 啟動終端健全度審查 ---"
sleep 3
if curl -f -s "http://localhost:${PORT}${HEALTHCHECK_PATH}" > /dev/null; then
    echo "🎉 [5T ALL COMPLIANT] ESGGO 全端平台已成功在 Oracle Cloud 上線！"
    echo "公用存取網址: http://161.118.248.180:${PORT}"
else
    echo "❌ [⚠️ 部署熔斷警告]: 應用程序本地響應異常，請執行 'pm2 logs' 進行 Trace 溯源。"
    exit 1
fi
EOF_REMOTE_SCRIPT

# NEW STEP: Securely copy the remote deployment script to the VPS
echo "--- Transferring remote deployment script to VPS ---"
eval scp ${SSH_OPTIONS} "/tmp/${REMOTE_SCRIPT_NAME}" "${YOUR_VPS_USER}@${YOUR_VPS_IP}:/tmp/${REMOTE_SCRIPT_NAME}"

# 4️⃣ SSH into VPS and set up server and deploy application
echo "Connecting to VPS via SSH to set up server and run application..."
eval ssh ${SSH_OPTIONS} "${YOUR_VPS_USER}@${YOUR_VPS_IP}" "
  # --- Initial Server Setup (Nginx and UFW) ---
  echo '--- Installing Nginx and Configuring Firewall (UFW) ---'
  sudo apt update
  sudo apt install -y nginx -y

  # Configure UFW
  sudo ufw allow OpenSSH
  sudo ufw allow 'Nginx HTTP'
  sudo ufw allow 'Nginx HTTPS'
  echo "y" | sudo ufw enable # Auto-confirm enable

  # Execute the remote deployment script
  chmod +x /tmp/${REMOTE_SCRIPT_NAME}
  /tmp/${REMOTE_SCRIPT_NAME}
  rm /tmp/${REMOTE_SCRIPT_NAME} # Clean up remote script
"
# 5️⃣ Post-deployment health check (adjust as needed for your application's health endpoint)
echo "✅ Deploy initiated on VPS. Please check the VPS directly for application health and access."
# Example: curl -f -s "http://${YOUR_VPS_IP}:PORT/healthz" || { echo "Health check failed!"; exit 1; }

echo "✅ Deploy completed at $(date)"