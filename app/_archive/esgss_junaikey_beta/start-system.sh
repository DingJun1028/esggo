#!/bin/bash

# ESG Sunshine JunAiKey System - 快速啟動腳本
# 善向永續 奧秘元鑰

echo "🌟 ESG Sunshine JunAiKey System - 善向永續 奧秘元鑰"
echo "=================================================="

# 檢查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安裝，請先安裝 Node.js 20+"
    exit 1
fi

# 檢查 Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安裝，請先安裝 Docker"
    exit 1
fi

# 檢查 Docker Compose
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose 未安裝，請先安裝 Docker Compose"
    exit 1
fi

echo "✅ 系統依賴檢查通過"

# 創建環境配置文件
if [ ! -f .env ]; then
    echo "📋 創建環境配置..."
    cp .env.unified .env
    echo "⚠️  請編輯 .env 文件並填入您的 API 金鑰"
    echo "   - GEMINI_API_KEY"
    echo "   - OPENAI_API_KEY"
    echo "   - 其他必要的配置"
    read -p "按 Enter 繼續 (請先配置 .env 文件)..."
fi

# 安裝根目錄依賴
echo "📦 安裝主應用依賴..."
npm install

# 安裝子系統依賴
echo "📦 安裝子系統依賴..."
echo "   - 安裝 API 服務..."
cd api && npm install && cd ..

echo "   - 安裝 JunAiKey 系統..."
cd jun-ai-key && npm install && cd ..

echo "   - 安裝 JunAiKey 資料庫服務器..."
cd junaikeydb-server && npm install && cd ..

echo "   - 安裝 Shan Xiang Tech..."
cd shan-xiang-tech && npm install && cd ..

echo "   - 安裝主後端服務器..."
cd server && npm install && cd ..

echo "✅ 所有依賴安裝完成"

# 啟動系統
echo "🚀 啟動 ESG Sunshine Universal System..."
echo ""
echo "系統服務將在以下端口運行："
echo "  🌐 API Gateway:     http://localhost"
echo "  🎨 前端應用:        http://localhost:3000"
echo "  🔧 主後端API:       http://localhost:3001"
echo "  📊 舊版API:         http://localhost:3002"
echo "  🧠 JunAiKey智庫:     http://localhost:3003"
echo "  🤖 Shan Xiang Tech:  http://localhost:3004"
echo "  📈 監控面板:        http://localhost:3005"
echo ""
echo "系統健康檢查: http://localhost/health"
echo ""

# 啟動 Docker 服務
docker-compose up --build -d

# 等待服務啟動
echo "⏳ 等待服務啟動..."
sleep 10

# 檢查服務狀態
echo "🔍 檢查服務狀態..."
docker-compose ps

echo ""
echo "🎉 ESG Sunshine JunAiKey System 啟動成功！"
echo "🌟 善向永續 奧秘元鑰"
echo ""
echo "訪問 http://localhost 開始使用系統"
echo ""
echo "管理命令："
echo "  停止系統: docker-compose down"
echo "  查看日誌: docker-compose logs -f"
echo "  重啟服務: docker-compose restart"