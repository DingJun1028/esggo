#!/bin/bash

# 奧秘智庫系統 - 快速啟動腳本
# Quick Start Script for Omnipotent Think Tank

set -e

echo "🌌 奧秘智庫系統 - 快速啟動"
echo "================================"
echo ""

# 檢查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 錯誤: Node.js 未安裝"
    echo "請先安裝 Node.js 18+ : https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js 版本: $(node -v)"

# 檢查 PostgreSQL
if ! command -v psql &> /dev/null; then
    echo "⚠️  警告: PostgreSQL 未安裝或未在 PATH 中"
    echo "請確保 PostgreSQL 14+ 已安裝並運行"
fi

# 檢查環境變數
if [ ! -f .env ]; then
    echo "📝 創建環境變數檔案..."
    cp .env.example .env 2>/dev/null || echo "請手動創建 .env 檔案"
fi

# 安裝前端依賴
echo ""
echo "📦 安裝前端依賴..."
npm install

# 安裝後端依賴
echo ""
echo "📦 安裝後端依賴..."
cd celestial-server
npm install
cd ..

# 資料庫初始化（可選）
read -p "是否初始化資料庫？(y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🗄️  初始化資料庫..."
    
    # 讀取資料庫配置
    DB_NAME=${VECTOR_DB_NAME:-omnipotent_think_tank}
    
    # 執行遷移
    psql -d $DB_NAME -f migrations/001_create_omnipotent_schema.sql
    psql -d $DB_NAME -f migrations/002_seed_default_data.sql
    psql -d $DB_NAME -f migrations/003_agent_skill_taxonomy.sql
    psql -d $DB_NAME -f migrations/004_esg_rag_integration.sql
    
    echo "✅ 資料庫初始化完成"
fi

# 編譯後端 TypeScript
echo ""
echo "🔨 編譯後端 TypeScript..."
cd celestial-server
npm run build
cd ..

echo ""
echo "✅ 系統準備完成！"
echo ""
echo "🚀 啟動指令:"
echo "   前端: npm run dev"
echo "   後端: cd celestial-server && npm run dev"
echo ""
echo "或使用以下指令同時啟動:"
echo "   npm run start:all"
echo ""
