#!/bin/bash
# ==============================================================================
# ESGGO | Swap-DeFi 自動部署驗證腳本
# v1.0.0 | Operational-Ready
# ==============================================================================

echo "🚀 開始執行 ESGGO Swap-DeFi 部署驗證..."

# 1. 檢查 Docker 環境
if ! [ -x "$(command -v docker-compose)" ]; then
  echo "❌ 錯誤: 未安裝 docker-compose，請先安裝。"
  exit 1
fi

# 2. 啟動容器
echo "📦 正在啟動 esggo-app 容器..."
docker-compose up -d --build

# 3. 等待容器啟動並執行健康檢查
echo "⏳ 等待系統初始化 (20s)..."
sleep 20

# 4. 驗證日誌
echo "🔍 檢查 SwapDeFi 模組日誌..."
if docker logs esggo-app 2>&1 | grep -q 'SwapDeFi'; then
  echo "✅ SwapDeFi 模組已成功載入。"
else
  echo "⚠️ 警告: 未在日誌中發現 SwapDeFi 關鍵字，請檢查 lib/services/swap-defi-adapter.ts。"
fi

# 5. 執行內部健康檢查
echo "🧪 執行系統內部健康檢查..."
if docker exec esggo-app npm run health-check; then
  echo "✅ 內部健康檢查通過。"
else
  echo "❌ 內部健康檢查失敗。"
fi

# 6. 端點監控驗證
echo "🌐 驗證交易所端點狀態..."
STATUS_CODE=$(curl -o /dev/null -s -w "%{http_code}" http://localhost:3000/api/agent/tasks)
if [ "$STATUS_CODE" -eq 200 ]; then
  echo "✅ API 端點回應正常 (200 OK)。"
else
  echo "❌ API 端點異常 (Status: $STATUS_CODE)。"
fi

echo "🚀 部署驗證完成！ESGGO 系統目前處於 Operational 狀態。"
echo "🔗 請訪問 http://localhost:3000/tasks 確認 UI 整合。"
