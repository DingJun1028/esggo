#!/bin/bash
# OmniAgent Gateway v3.0 Deployment Script for Ubuntu 24.04 LTS (ARM64)
# Origin: OmniAgent (Open Source) → ESGGO OmniAgent (ESG Specialized)

set -e

echo "=== [萬能網關] OmniAgent Gateway v3.0 部署 ==="

# 1. Install prerequisites
echo "Updating system and installing dependencies..."
apt-get update && apt-get install -y curl wget git python3 python3-pip nodejs npm ffmpeg

# 2. Install Node.js dependencies for gateway
echo "Installing Node.js gateway dependencies..."
cd apps/gateway
pnpm install --prod

# 3. Create environment directory
HERMES_HOME="$HOME/.hermes"
mkdir -p "$HERMES_HOME"

# 4. Configure OpenRouter API key
if [ -z "$OPENROUTER_API_KEY" ]; then
    echo "Please set OPENROUTER_API_KEY environment variable."
    read -s -p "Enter OpenRouter API key: " OPENROUTER_API_KEY
    echo
fi

if [ -z "$GATEWAY_API_KEY" ]; then
    echo "Please set GATEWAY_API_KEY environment variable."
    read -s -p "Enter Gateway API key: " GATEWAY_API_KEY
    echo
fi

cat > "$HERMES_HOME/.env" << EOF
PORT=8642
GEMINI_API_KEY=${GEMINI_API_KEY:-}
OPENROUTER_API_KEY=$OPENROUTER_API_KEY
VPS_IP=$(curl -s ifconfig.me)
GATEWAY_API_KEY=$GATEWAY_API_KEY
FREE_TIER_ONLY=true
EOF

# 5. Create systemd service for OmniGateway
cat > /etc/systemd/system/omnigateway.service << EOF
[Unit]
Description=[萬能網關] OmniAgent Gateway v3.0
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$HOME/apps/gateway
Environment=OPENROUTER_API_KEY=$OPENROUTER_API_KEY
ExecStart=$(which node) $HOME/apps/gateway/omni-server.mjs
Environment=GEMINI_API_KEY=${GEMINI_API_KEY:-}
Environment=VPS_IP=$(curl -s ifconfig.me)
Environment=GATEWAY_API_KEY=$GATEWAY_API_KEY
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
Environment=NODE_ENV=production
Environment=FREE_TIER_ONLY=true

[Install]
WantedBy=multi-user.target
EOF

# 6. Enable and start service
systemctl daemon-reload
systemctl enable omnigateway
systemctl start omnigateway

echo "=== 部署完成 ==="
echo "檢查狀態: systemctl status omnigateway"
echo "查看日誌: journalctl -u omnigateway -f"
echo "訪問地址: http://\$(curl -s ifconfig.me):8642/health"