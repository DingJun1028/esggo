#!/bin/bash

echo "🚀 開始部署 InfoOne v8.1.0..."

# 1. 建置 Docker 映像
echo "🐳 建置 Docker 映像..."
docker-compose -f docker-compose.prod.yml build --no-cache

# 2. 停止舊容器
echo "🛑 停止舊容器..."
docker-compose -f docker-compose.prod.yml down

# 3. 啟動新容器
echo "▶️  啟動新容器..."
docker-compose -f docker-compose.prod.yml up -d

# 4. 檢查健康狀態
echo "🏥 檢查服務健康狀態..."
sleep 10
docker-compose -f docker-compose.prod.yml ps

echo "🎉 所有服務運行正常 (ETERNAL_MODE 已啟動)"
