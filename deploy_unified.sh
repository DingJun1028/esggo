#!/bin/bash
# Unified Deployment Script for ESGGO Platform
# OmniAgent (Open Source) → ESGGO OmniAgent (ESG Specialized)

set -e

PROJECT_ROOT="${1:-/var/www/esggo}"
PORT="${2:-8642}"

echo "=== [萬能網關] Unified Deployment v3.0 ==="

# 1. Sync source code
echo "[Step 1] 同步源代碼..."
git pull --rebase

# 2. Install dependencies
echo "[Step 2] 安裝 Node.js 依賴..."
npm install

# 3. Configure environment
echo "[Step 3] 配置環境變量..."
cat > "$PROJECT_ROOT/.env" << EOL
PORT=$PORT
GEMINI_API_KEY=${GEMINI_API_KEY:-}
OPENROUTER_API_KEY=${OPENROUTER_API_KEY:-}
VPS_IP=$(curl -s ifconfig.me)
GATEWAY_API_KEY=${GATEWAY_API_KEY:-}
TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN:-}
TELEGRAM_ALLOWED_USERS=${TELEGRAM_ALLOWED_USERS:-}
EOL

# 4. Deploy gateway service
echo "[Step 4] 部署 Gateway..."
cd "$PROJECT_ROOT/apps/gateway"
cp omni-server.mjs ../gateway/
chmod +x ../gateway/omni-server.mjs

# 5. Set up systemd service
echo "[Step 5] 設定 systemd 服務..."
cat > "/etc/systemd/system/omnigateway.service" << SERVICE
[Unit]
Description=[萬能網關] OmniAgent Gateway v3.0
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=$PROJECT_ROOT/apps/gateway
ExecStart=/usr/bin/node /var/www/esggo/apps/gateway/omni-server.mjs
Restart=always
RestartSec=10
Environment=NODE_ENV=production
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
SERVICE

# 6. Start service
systemctl daemon-reload
systemctl enable omnigateway
systemctl start omnigateway

# 7. Verify
sleep 5
STATUS=$(systemctl is-active omnigateway)
echo "Service status: $STATUS"

if [ "$STATUS" = "active" ]; then
    echo "[Step 6] 部署完成！"
    echo "訪問地址: http://$(curl -s ifconfig.me):$PORT/health"
else
    echo "[Step 6] 服務啟動失敗！"
    journalctl -u omnigateway -n 20
    exit 1
fi