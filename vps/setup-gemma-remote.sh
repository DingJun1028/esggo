#!/usr/bin/env bash
# Install and Configure Ollama + Gemma 3/4 on OCI Ampere A1 Free Tier VPS
# Secured via Nginx Basic Auth on https://omniagent.esggo.co/ollama/

set -euo pipefail

echo "=== [Gemma 部署] 開始安裝與設定 ==="

# 1. 安裝 Ollama
if ! which ollama > /dev/null 2>&1; then
    echo "[1/4] 正在下載並安裝 Ollama..."
    curl -fsSL https://ollama.com/install.sh | sh
else
    echo "[1/4] Ollama 已經安裝，跳過此步驟。"
fi

# 2. 建立 Basic Auth 密碼檔
echo "[2/4] 設定 Nginx Basic Auth 憑證..."
sudo apt-get install -y apache2-utils
# 憑證從環境變數注入，避免明文寫入腳本/入庫。部署前：export OLLAMA_USER=... OLLAMA_PASS=...
USERNAME="${OLLAMA_USER:-esggo-ai}"
PASSWORD="${OLLAMA_PASS:?請先設定 OLLAMA_PASS 環境變數（例如 export OLLAMA_PASS='你的強密碼'）}"
sudo htpasswd -b -c /etc/nginx/.htpasswd "$USERNAME" "$PASSWORD"

# 3. 注入 Nginx Location 區塊到 omniagent-sub
NGINX_CONF="/etc/nginx/sites-available/omniagent-sub"
echo "[3/4] 更新 Nginx 設定檔 $NGINX_CONF ..."

sudo cp "$NGINX_CONF" "${NGINX_CONF}.bak"

sudo cat << 'INNER_EOF' > /tmp/omniagent-sub.new
# OmniAgent Gateway subdomain (Cloudflare proxied -> origin HTTP :80)
# Cloudflare provides Universal SSL at edge; origin receives HTTP with X-Forwarded-Proto: https
upstream omniagent_sub_backend {
    server 127.0.0.1:8642;
    keepalive 16;
}
server {
    listen 80;
    listen [::]:80;
    server_name omniagent.esggo.co;
    limit_req zone=api_perip burst=20 nodelay;

    location / {
        proxy_pass http://omniagent_sub_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_buffering off;
        proxy_read_timeout 3600s;
        proxy_send_timeout 3600s;
        proxy_next_upstream error timeout http_502 http_503 http_504;
        proxy_next_upstream_tries 3;
        proxy_next_upstream_timeout 10s;
    }

    location /ws {
        proxy_pass http://omniagent_sub_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 86400;
    }

    # === 🚀 Ollama / Gemma 安全反向代理 ===
    location /ollama/ {
        auth_basic "Ollama Secure Local Gateway";
        auth_basic_user_file /etc/nginx/.htpasswd;

        proxy_pass http://127.0.0.1:11434/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 3600s;
        proxy_send_timeout 3600s;
    }
}
INNER_EOF

sudo mv /tmp/omniagent-sub.new "$NGINX_CONF"

echo "測試 Nginx 設定語法..."
sudo nginx -t
echo "重新載入 Nginx..."
sudo systemctl reload nginx

# 4. 下載 Gemma 3 4B 模型
echo "[4/4] 正在拉取並啟動 Gemma 3 4B 模型..."
sudo systemctl start ollama
sleep 3
ollama pull gemma3:4b

echo "=== [Gemma 部署] 成功完成！ ==="
echo "=========================================="
echo "您的本地 Gemma API 現已安全部署於："
echo "Base URL: https://omniagent.esggo.co/ollama/v1"
echo "Username: $USERNAME"
echo "Password: $PASSWORD"
echo "=========================================="
