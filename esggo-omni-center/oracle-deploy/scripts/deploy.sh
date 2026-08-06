#!/bin/bash
# ============================================================
# ESG GO - Production Deployment Script
# 執行方式: bash scripts/deploy.sh
# ============================================================

set -e

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() { echo -e "${GREEN}[INFO]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# ============================================================
# 設定
# ============================================================
APP_DIR="/opt/esggo"
DOMAIN="esggo.ai"
EMAIL="admin@esggo.ai"

# ============================================================
# 1. 檢查環境
# ============================================================
log "Step 1/7: 檢查環境..."

if [ ! -f "$APP_DIR/.env.production" ]; then
    error "找不到 .env.production 檔案"
fi

if ! command -v docker &> /dev/null; then
    error "Docker 未安裝"
fi

if ! docker compose version &> /dev/null; then
    error "Docker Compose 未安裝"
fi

# ============================================================
# 2. 停止舊服務
# ============================================================
log "Step 2/7: 停止舊服務..."
cd "$APP_DIR"
docker compose -f docker-compose.prod.yml down --remove-orphans 2>/dev/null || true

# ============================================================
# 3. 建立 Nginx 配置
# ============================================================
log "Step 3/7: 建立 Nginx 配置..."
mkdir -p "$APP_DIR/nginx/conf.d"
mkdir -p "$APP_DIR/nginx/ssl"
mkdir -p /var/www/certbot

# 複製配置文件（如果不存在）
if [ ! -f "$APP_DIR/nginx/conf.d/default.conf" ]; then
    cp nginx/conf.d/default.conf "$APP_DIR/nginx/conf.d/"
fi

# ============================================================
# 4. 取得 TLS 憑證
# ============================================================
log "Step 4/7: 取得 TLS 憑證..."

if [ ! -f "$APP_DIR/nginx/ssl/fullchain.pem" ]; then
    # 先啟動 Nginx（僅 HTTP）以進行驗證
    cat > "$APP_DIR/nginx/conf.d/temp.conf" << 'EOF'
server {
    listen 80;
    server_name esggo.ai www.esggo.ai;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        return 200 'ok';
    }
}
EOF

    # 啟動暫時 Nginx
    docker run -d \
        --name nginx-temp \
        -p 80:80 \
        -v "$APP_DIR/nginx/conf.d/temp.conf:/etc/nginx/conf.d/default.conf:ro" \
        -v /var/www/certbot:/var/www/certbot \
        nginx:alpine

    sleep 3

    # 使用 Certbot 取得憑證
    docker run --rm \
        -v /var/www/certbot:/var/www/certbot \
        -v "$APP_DIR/nginx/ssl:/etc/letsencrypt" \
        certbot/certbot certonly \
        --webroot \
        --webroot-path=/var/www/certbot \
        --email "$EMAIL" \
        --agree-tos \
        --no-eff-email \
        -d "$DOMAIN" \
        -d "www.$DOMAIN"

    # 停止暫時 Nginx
    docker stop nginx-temp && docker rm nginx-temp

    # 刪除暫時配置
    rm -f "$APP_DIR/nginx/conf.d/temp.conf"

    log "TLS 憑證取得成功"
else
    warn "TLS 憑證已存在"
fi

# ============================================================
# 5. 建立環境變數
# ============================================================
log "Step 5/7: 檢查環境變數..."

# 檢查必要的環境變數
required_vars=(
    "DATABASE_URL"
    "FIREBASE_PROJECT_ID"
    "FIREBASE_CLIENT_EMAIL"
    "FIREBASE_PRIVATE_KEY"
    "OPENROUTER_API_KEY"
)

for var in "${required_vars[@]}"; do
    if ! grep -q "^${var}=" "$APP_DIR/.env.production"; then
        error "缺少環境變數: $var"
    fi
done

# ============================================================
# 6. 建置並啟動服務
# ============================================================
log "Step 6/7: 建置並啟動服務..."
cd "$APP_DIR"

# 建置映像
docker compose -f docker-compose.prod.yml build --no-cache

# 啟動服務
docker compose -f docker-compose.prod.yml up -d

# 等待服務就緒
log "等待服務就緒..."
sleep 30

# 檢查服務狀態
docker compose -f docker-compose.prod.yml ps

# ============================================================
# 7. 設定自動續期與防閒置
# ============================================================
log "Step 7/7: 設定自動續期與防閒置..."

# 設定 Certbot 自動續期
(crontab -l 2>/dev/null; echo "0 12 * * * docker run --rm -v /var/www/certbot:/var/www/certbot -v $APP_DIR/nginx/ssl:/etc/letsencrypt certbot/certbot renew --quiet --post-hook 'docker exec esggo-nginx nginx -s reload'") | crontab -

# 設定防閒置 cron
(crontab -l 2>/dev/null; echo "*/5 * * * * docker exec esggo-cron wget -q -O- http://nextjs:3000/api/health > /dev/null 2>&1") | crontab -

log "自動續期與防閒置設定完成"

# ============================================================
# 驗證部署
# ============================================================
echo ""
echo -e "${GREEN}============================================================${NC}"
echo -e "${GREEN}  ESG GO 部署完成！${NC}"
echo -e "${GREEN}============================================================${NC}"
echo ""
echo "服務狀態："
docker compose -f docker-compose.prod.yml ps
echo ""
echo "檢查日誌："
echo "  docker compose -f docker-compose.prod.yml logs -f"
echo ""
echo "檢查特定服務："
echo "  docker compose -f docker-compose.prod.yml logs -f nextjs"
echo "  docker compose -f docker-compose.prod.yml logs -f nginx"
echo ""
echo "網址：https://$DOMAIN"
echo ""
echo "常用指令："
echo "  重啟服務: docker compose -f docker-compose.prod.yml restart"
echo "  停止服務: docker compose -f docker-compose.prod.yml down"
echo "  查看日誌: docker compose -f docker-compose.prod.yml logs -f"
echo "  進入容器: docker exec -it esggo-app sh"
echo ""
