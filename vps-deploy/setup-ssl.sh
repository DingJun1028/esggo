#!/bin/bash
# SSL/TLS Setup for DeerFlow — the deer-flow nginx container terminates TLS.
# Domain: deerflow.esggo.co
# Email: dingjunhong1028@gmail.com
#
# How it works:
#   1. Pre-seeds a self-signed fallback cert at /opt/deer-flow/certs so nginx
#      can boot before certbot has ever run (the nginx container serves
#      whatever is in /etc/nginx/certs and refreshes it from /etc/letsencrypt
#      at container start).
#   2. Stops the nginx container (it binds host port 80), runs
#      certbot --standalone, then restarts nginx with the real cert.
#   3. Installs an auto-renew cron that stops nginx before renewal and
#      restarts it (refreshing the active certs) only when a cert is renewed.

set -e

DOMAIN=deerflow.esggo.co
EMAIL=dingjunhong1028@gmail.com
COMPOSE_FILE=/opt/deer-flow/docker/docker-compose-dev.yaml
COMPOSE_PROJECT=deer-flow-dev
CERT_DIR=/opt/deer-flow/certs

echo "=========================================="
echo "  SSL/TLS 設定 (Let's Encrypt)"
echo "  Domain: $DOMAIN"
echo "=========================================="
echo ""

# 1. 安裝 Certbot
echo "[1/5] 安裝 Certbot..."
apt install -y certbot

# 2. 預先產生 fallback 自簽憑證（certbot 執行前 nginx 也能啟動）
echo "[2/5] 預先產生 fallback 憑證..."
mkdir -p "$CERT_DIR"
if [ ! -f "$CERT_DIR/fullchain.pem" ]; then
  openssl req -x509 -newkey rsa:2048 -nodes -days 3650 \
    -subj "/CN=$DOMAIN" \
    -keyout "$CERT_DIR/privkey.pem" \
    -out "$CERT_DIR/fullchain.pem"
  echo "  fallback 憑證已產生: $CERT_DIR"
fi

# 3. 停止 nginx 容器，讓 certbot standalone 綁定 port 80
echo "[3/5] 停止 nginx 容器..."
docker compose -p "$COMPOSE_PROJECT" -f "$COMPOSE_FILE" stop nginx

# 4. 取得 SSL 憑證
echo "[4/5] 取得 SSL 憑證..."
certbot certonly --standalone \
  --agree-tos \
  --email "$EMAIL" \
  --no-eff-email \
  -d "$DOMAIN"

# 5. 更新作用中憑證並重啟 nginx
echo "[5/5] 更新憑證並重啟 nginx..."
cp -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" "$CERT_DIR/fullchain.pem"
cp -f "/etc/letsencrypt/live/$DOMAIN/privkey.pem" "$CERT_DIR/privkey.pem"
docker compose -p "$COMPOSE_PROJECT" -f "$COMPOSE_FILE" start nginx

# 自動續期：renewal 前先停 nginx 釋放 port 80，續期成功後刷新憑證並重啟
(
  crontab -l 2>/dev/null | grep -v 'certbot renew' || true
  echo "0 3 * * * certbot renew --quiet --pre-hook \"docker compose -p $COMPOSE_PROJECT -f $COMPOSE_FILE stop nginx\" --deploy-hook \"cp -f /etc/letsencrypt/live/$DOMAIN/fullchain.pem $CERT_DIR/fullchain.pem && cp -f /etc/letsencrypt/live/$DOMAIN/privkey.pem $CERT_DIR/privkey.pem && docker compose -p $COMPOSE_PROJECT -f $COMPOSE_FILE start nginx\""
) | crontab -

echo ""
echo "=========================================="
echo "  SSL 設定完成！"
echo "  憑證路徑: /etc/letsencrypt/live/$DOMAIN/"
echo "  自動續期: 每日 03:00 (僅在續期成功時重啟 nginx)"
echo "=========================================="
echo ""
sleep 5
echo "驗證:"
curl -sI "https://$DOMAIN" | head -1
