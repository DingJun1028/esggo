#!/bin/bash
# ESG儀表板SSL證書設置腳本

set -e

DOMAIN=${DOMAIN:-esg-dashboard.com}
EMAIL=${SSL_EMAIL:-admin@esg-dashboard.com}

echo "設置 SSL 證書 for $DOMAIN"

# 安裝 certbot 如果還沒有安裝
if ! command -v certbot &> /dev/null; then
    echo "安裝 certbot..."
    apt-get update
    apt-get install -y certbot
fi

# 停止 nginx 暫時
docker-compose -f docker-compose.prod.yml stop esg-dashboard

# 獲取 SSL 證書
echo "獲取 Let's Encrypt SSL 證書..."
certbot certonly --standalone \
    --non-interactive \
    --agree-tos \
    --email "$EMAIL" \
    --domain "$DOMAIN" \
    --domain "www.$DOMAIN"

# 複製證書到 nginx 目錄
echo "複製證書到容器..."
mkdir -p ssl
cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem ssl/
cp /etc/letsencrypt/live/$DOMAIN/privkey.pem ssl/

# 設置正確權限
chmod 600 ssl/privkey.pem
chmod 644 ssl/fullchain.pem

# 更新 nginx 配置使用 SSL
cp nginx-ssl.conf nginx.conf

# 重啟服務
docker-compose -f docker-compose.prod.yml up -d esg-dashboard

# 設置自動續期
echo "設置自動續期..."
cat > /etc/cron.d/certbot-renew << EOF
0 12 * * * root certbot renew --quiet && docker-compose -f /path/to/docker-compose.prod.yml restart esg-dashboard
EOF

chmod 644 /etc/cron.d/certbot-renew

echo "SSL 設置完成！"
echo "證書將每 90 天自動續期。"