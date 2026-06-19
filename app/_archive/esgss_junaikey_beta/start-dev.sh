#!/bin/bash

# AVOS v6.0 本地開發啟動腳本（使用 ngrok 隧道）

# 顏色定義
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  AVOS v6.0 開發環境啟動${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# 檢查 ngrok 是否安裝
if ! command -v ngrok &> /dev/null; then
    echo -e "${YELLOW}⚠️  ngrok 未安裝${NC}"
    echo "請訪問 https://ngrok.com/download 下載安裝"
    echo "或使用: brew install ngrok (Mac) / choco install ngrok (Windows)"
    exit 1
fi

# 檢查 ngrok authtoken
if ! grep -q "authtoken" ngrok.yml 2>/dev/null; then
    echo -e "${YELLOW}⚠️  請先配置 ngrok authtoken${NC}"
    echo "1. 訪問 https://dashboard.ngrok.com/get-started/your-authtoken"
    echo "2. 複製您的 authtoken"
    echo "3. 更新 ngrok.yml 中的 authtoken"
    exit 1
fi

# 確保 ngrok.yml 在正確位置
if [ ! -f "ngrok.yml" ]; then
    echo -e "${YELLOW}⚠️  ngrok.yml 未找到${NC}"
    exit 1
fi

echo -e "${GREEN}✓ 環境檢查通過${NC}"
echo ""

# 啟動前端開發服務器（背景執行）
echo -e "${BLUE}[1/3]${NC} 啟動前端開發服務器 (Port 5173)..."
npm run dev &
FRONTEND_PID=$!
echo -e "${GREEN}✓ Frontend PID: $FRONTEND_PID${NC}"
sleep 3

# 啟動後端服務器（背景執行）
echo -e "${BLUE}[2/3]${NC} 啟動後端 API 服務器 (Port 3001)..."
# npm run dev:server &
# BACKEND_PID=$!
# echo -e "${GREEN}✓ Backend PID: $BACKEND_PID${NC}"
# sleep 2

# 啟動 ngrok 隧道
echo -e "${BLUE}[3/3]${NC} 啟動 ngrok 隧道..."
echo ""
echo -e "${YELLOW}請選擇啟動模式：${NC}"
echo "1) 啟動所有隧道 (Frontend + Backend)"
echo "2) 只啟動 Frontend"
echo "3) 只啟動 Backend"
read -p "請選擇 (1-3): " choice

case $choice in
    1)
        echo -e "${BLUE}啟動所有隧道...${NC}"
        ngrok start --all --config=ngrok.yml
        ;;
    2)
        echo -e "${BLUE}啟動 Frontend 隧道...${NC}"
        ngrok start avos-frontend --config=ngrok.yml
        ;;
    3)
        echo -e "${BLUE}啟動 Backend 隧道...${NC}"
        ngrok start avos-backend --config=ngrok.yml
        ;;
    *)
        echo -e "${YELLOW}無效選擇，啟動所有隧道${NC}"
        ngrok start --all --config=ngrok.yml
        ;;
esac

# 清理函數
cleanup() {
    echo ""
    echo -e "${YELLOW}關閉開發服務器...${NC}"
    kill $FRONTEND_PID 2>/dev/null
    # kill $BACKEND_PID 2>/dev/null
    echo -e "${GREEN}✓ 已關閉${NC}"
    exit 0
}

# 捕獲 Ctrl+C
trap cleanup SIGINT SIGTERM

# 等待
wait
