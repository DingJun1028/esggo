#!/bin/bash
# ESG儀表板自動備份腳本

set -e

# 配置變數
BACKUP_DIR="/backup"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
ENVIRONMENT=${ENVIRONMENT:-production}

# 創建備份目錄
mkdir -p "$BACKUP_DIR/postgres"
mkdir -p "$BACKUP_DIR/redis"
mkdir -p "$BACKUP_DIR/logs"

echo "開始備份 ESG 儀表板數據 - $TIMESTAMP"

# PostgreSQL 備份
echo "備份 PostgreSQL 資料庫..."
if [ "$ENVIRONMENT" = "production" ]; then
    DB_CONTAINER="esg-db"
    DB_PASSWORD=$DB_PASSWORD
else
    DB_CONTAINER="esg-db-dev"
    DB_PASSWORD="esg_password"
fi

docker exec $DB_CONTAINER pg_dumpall -U esg_user > "$BACKUP_DIR/postgres/esg_dashboard_$TIMESTAMP.sql"

# 壓縮 PostgreSQL 備份
gzip "$BACKUP_DIR/postgres/esg_dashboard_$TIMESTAMP.sql"

# Redis 備份
echo "備份 Redis 數據..."
if [ "$ENVIRONMENT" = "production" ]; then
    REDIS_CONTAINER="esg-redis"
    REDIS_PASSWORD=$REDIS_PASSWORD
else
    REDIS_CONTAINER="esg-redis-dev"
    REDIS_PASSWORD="dev_esg_redis_password"
fi

docker exec $REDIS_CONTAINER redis-cli --raw -a "$REDIS_PASSWORD" SAVE
docker cp $REDIS_CONTAINER:/data/dump.rdb "$BACKUP_DIR/redis/redis_dump_$TIMESTAMP.rdb"

# 備份配置文件 (不包含敏感信息)
echo "備份配置文件..."
cp docker-compose.yml "$BACKUP_DIR/config_docker-compose_$TIMESTAMP.yml"
cp nginx.conf "$BACKUP_DIR/config_nginx_$TIMESTAMP.conf"

# 創建備份摘要
cat > "$BACKUP_DIR/backup_summary_$TIMESTAMP.txt" << EOF
ESG 儀表板備份摘要
==================
時間: $TIMESTAMP
環境: $ENVIRONMENT
PostgreSQL 備份: esg_dashboard_$TIMESTAMP.sql.gz
Redis 備份: redis_dump_$TIMESTAMP.rdb
配置文件: config_*_$TIMESTAMP.*

備份狀態: 成功
EOF

# 清理舊備份 (保留最近7天的備份)
echo "清理舊備份..."
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +7 -delete
find "$BACKUP_DIR" -name "*.rdb" -mtime +7 -delete
find "$BACKUP_DIR" -name "backup_summary_*.txt" -mtime +7 -delete
find "$BACKUP_DIR" -name "config_*" -mtime +7 -delete

# 記錄備份日誌
echo "$TIMESTAMP - 備份完成" >> "$BACKUP_DIR/logs/backup.log"

echo "備份完成！"

# 可選：上傳到雲端儲存
if [ -n "$AWS_ACCESS_KEY_ID" ]; then
    echo "上傳備份到 AWS S3..."
    aws s3 cp "$BACKUP_DIR/" s3://esg-dashboard-backups/$ENVIRONMENT/ --recursive --exclude "*" --include "*.gz" --include "*.rdb" --include "*summary*.txt"
fi

if [ -n "$GCP_SA_KEY" ]; then
    echo "上傳備份到 Google Cloud Storage..."
    echo "$GCP_SA_KEY" | base64 -d > /tmp/gcp-key.json
    gcloud auth activate-service-account --key-file=/tmp/gcp-key.json
    gsutil cp -r "$BACKUP_DIR/*" gs://esg-dashboard-backups/$ENVIRONMENT/
fi