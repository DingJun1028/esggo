#!/bin/bash
# vps/setup-ssl.sh — 自動化 Let's Encrypt 證書申請
# 使用方式：ssh root@VPS "bash -s" < vps/setup-ssl.sh yourdomain.com

set -euo pipefail

DOMAIN="${1:?Usage: setup-ssl.sh <domain>}"
EMAIL="${2:-admin@${DOMAIN}}"
NGINX_CONF="/etc/nginx/sites-enabled/esggo"

echo "=== SSL 證書申請 for ${DOMAIN} ==="

# 1. 安裝 Certbot
echo "[1/5] 安裝 Certbot..."
apt-get update -qq
apt-get install -y -qq certbot python3-certbot-nginx

# 2. 確認 Nginx 有 ACME challenge 路徑
echo "[2/5] 檢查 Nginx ACME challenge 配置..."
if ! grep -q ".well-known/acme-challenge" "$NGINX_CONF" 2>/dev/null; then
    cat > /etc/nginx/snippets/acme-challenge.conf << 'ACME'
location /.well-known/acme-challenge/ {
    root /var/www/html;
    allow all;
}
ACME

    # 插入到 esggo server block 的 location / 之前
    sed -i '/location \/ {/i\    include /etc/nginx/snippets/acme-challenge.conf;\n' "$NGINX_CONF"
    nginx -t && nginx -s reload
    echo "  ✓ ACME challenge 路徑已加入"
else
    echo "  ✓ ACME challenge 路徑已存在"
fi

# 3. 申請證書
echo "[3/5] 申請 Let's Encrypt 證書..."
certbot certonly \
    --nginx \
    --non-interactive \
    --agree-tos \
    --email "$EMAIL" \
    --domains "$DOMAIN" \
    --domains "www.${DOMAIN}" \
    --redirect \
    --hsts \
    --staple-ocsp

# 4. 更新 Nginx 為 HTTPS
echo "[4/5] 更新 Nginx HTTPS 配置..."
cat > "$NGINX_CONF" << HTTPS
# HTTP → HTTPS 跳轉
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN} www.${DOMAIN};
    include /etc/nginx/snippets/acme-challenge.conf;
    return 301 https://\$host\$request_uri;
}

# HTTPS 主伺服器
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name ${DOMAIN} www.${DOMAIN};

    # SSL 證書
    ssl_certificate /etc/letsencrypt/live/${DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${DOMAIN}/privkey.pem;
    ssl_trusted_certificate /etc/letsencrypt/live/${DOMAIN}/chain.pem;

    # SSL 安全設定
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;
    ssl_session_tickets off;

    # HSTS
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;

    # Security headers
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy strict-origin-when-cross-origin always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' ws: wss:;" always;

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;
    gzip_min_length 1000;

    # Max body size
    client_max_body_size 10M;

    # Proxy to Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;

        # SSE support
        proxy_buffering off;
        proxy_read_timeout 3600s;
        proxy_send_timeout 3600s;
    }

    # Static files cache
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Public assets cache
    location /public/ {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 7d;
        add_header Cache-Control "public, max-age=604800";
    }

    # WS endpoint
    location /api/hub/ws {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_read_timeout 86400s;
    }

    # OmniAgent Gateway (via HTTPS)
    location /omniagent-gateway/ {
        proxy_pass http://127.0.0.1:8642/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;

        # Disable buffering for SSE streaming
        proxy_buffering off;
        proxy_cache off;
        proxy_read_timeout 3600s;
        proxy_send_timeout 3600s;

        client_max_body_size 15M;
    }
}
HTTPS

nginx -t && nginx -s reload
echo "  ✓ HTTPS 配置已更新"

# 5. 設定自動續約
echo "[5/5] 設定自動續約..."
cat > /etc/cron.d/certbot-renew << 'CRON'
0 3 * * * root certbot renew --quiet --deploy-hook "nginx -s reload"
CRON
chmod 644 /etc/cron.d/certbot-renew

echo ""
echo "=== SSL 完成 ==="
echo "  域名: ${DOMAIN} / www.${DOMAIN}"
echo "  證書: /etc/letsencrypt/live/${DOMAIN}/"
echo "  自動續約: 每天 03:00"
echo "  測試: https://www.ssllabs.com/ssltest/analyze.html?d=${DOMAIN}"
