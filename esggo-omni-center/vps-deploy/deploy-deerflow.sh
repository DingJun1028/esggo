#!/bin/bash
# DeerFlow 2.0 自動化部署腳本
# 目標 VPS: 161.118.248.180 (Oracle Cloud, Ubuntu 22.04/24.04)
# Domain: deerflow.esggo.co
# SSL: Let's Encrypt (dingjunhong1028@gmail.com)

set -e

echo "=========================================="
echo "  DeerFlow 2.0 自動化部署"
echo "  VPS: 161.118.248.180"
echo "  Domain: deerflow.esggo.co"
echo "=========================================="
echo ""

# ===== 1. 系統更新 =====
echo "[1/10] 系統更新..."
apt update -y && apt upgrade -y

# ===== 2. 安裝必要套件 =====
echo "[2/10] 安裝必要套件..."
apt install -y curl git ufw sudo

# ===== 3. 安裝 Docker =====
echo "[3/10] 安裝 Docker..."
curl -fsSL https://get.docker.com | sh
usermod -aG docker root

# ===== 4. 安裝 Docker Compose =====
echo "[4/10] 安裝 Docker Compose..."
apt install -y docker-compose-plugin

# ===== 5. Clone DeerFlow =====
echo "[5/10] Clone DeerFlow..."
cd /opt
rm -rf deer-flow 2>/dev/null || true
git clone https://github.com/bytedance/deer-flow.git
cd deer-flow

# ===== 5.5 套用部署補丁（若存在） =====
# upload-deploy.ps1 會先上傳補丁到 /opt/deer-flow-patches/files
PATCH_DIR=/opt/deer-flow-patches/files
if [ -d "$PATCH_DIR" ]; then
  echo "[5.5/10] 套用部署補丁 (SSL/HTTPS nginx 設定)..."
  cp -f "$PATCH_DIR/docker-compose-dev.yaml" docker/docker-compose-dev.yaml
  cp -f "$PATCH_DIR/docker-compose.yaml" docker/docker-compose.yaml
  cp -f "$PATCH_DIR/nginx.conf" docker/nginx/nginx.conf
  echo "  補丁已套用"
fi

# ===== 6. 配置環境 =====
echo "[6/10] 配置環境..."

# 生成安全密鑰
SECRET=$(openssl rand -hex 32)

# 寫入 .env
cat > .env << 'ENVEOF'
# Serper API Key (Google Search)
SERPER_API_KEY=your-serper-api-key

# TAVILY API Key
TAVILY_API_KEY=your-tavily-api-key

# Jina API Key
JINA_API_KEY=your-jina-api-key

# InfoQuest API Key
INFOQUEST_API_KEY=your-infoquest-api-key

# OpenRouter API Key (注入自環境變數，避免寫死在公開 repo)
OPENROUTER_API_KEY=${OPENROUTER_API_KEY:-your-openrouter-api-key}

# Binding - 允許遠端存取
BIND_HOST=0.0.0.0
PORT=2026
ENVEOF

# 配置 config.yaml - 加入免費 OpenRouter 模型
cp config.example.yaml config.yaml

# ===== 6.5 預先產生 fallback TLS 憑證 =====
# nginx 容器 443 需要憑證才能啟動；certbot 執行前先自簽一份墊底
echo "[6.5/10] 預先產生 fallback 憑證..."
mkdir -p /opt/deer-flow/certs
if [ ! -f /opt/deer-flow/certs/fullchain.pem ]; then
  openssl req -x509 -newkey rsa:2048 -nodes -days 3650 \
    -subj "/CN=deerflow.esggo.co" \
    -keyout /opt/deer-flow/certs/privkey.pem \
    -out /opt/deer-flow/certs/fullchain.pem
  echo "  fallback 憑證已產生: /opt/deer-flow/certs"
fi

# ===== 7. 啟動 Docker 服務 =====
echo "[7/10] 啟動 Docker 服務..."
docker compose -p deer-flow-dev -f docker/docker-compose-dev.yaml up --build -d --remove-orphans

# ===== 8. 等待服務啟動 =====
echo "[8/10] 等待服務啟動..."
sleep 30

# ===== 9. 配置防火牆 =====
echo "[9/10] 配置防火牆..."
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 2026/tcp
ufw --force enable

echo ""
echo "=========================================="
echo "  部署完成！"
echo "  存取網址: http://161.118.248.180:2026"
echo "  管理員帳號: dingjunhong1028@gmail.com"
echo "=========================================="
echo ""
echo "SSL 設定請執行: ./setup-ssl.sh"
