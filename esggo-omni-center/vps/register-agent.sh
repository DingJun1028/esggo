#!/bin/bash
# ==========================================
# 🛡️ VPS Agent Registration Script
# ==========================================
# 
# 在 VPS 上執行，將 VPS Agent 註冊到 OmniCore 生態系統
# 
# 使用方式：
#   bash vps/register-agent.sh
# 
# 功能：
# 1. 檢查 VPS 連接
# 2. 初始化 VPS Agent
# 3. 建立量子糾纏連接
# 4. 啟動定期健康檢查
# 5. 註冊到 PM2 進程管理
# ==========================================

set -e

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 配置
VPS_HOST="${VPS_HOST:-161.118.248.180}"
VPS_PORT="${VPS_PORT:-8642}"
PROJECT_PATH="${PROJECT_PATH:-/var/www/esggo}"
AGENT_NAME="vps-agent"
HEALTH_INTERVAL="${HEALTH_INTERVAL:-30000}"

echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  🛡️ VPS Agent Registration — 量子糾纏註冊${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo ""

# 1. 檢查 Node.js
echo -e "${BLUE}[1/6] 檢查 Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js 未安裝${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js $(node -v)${NC}"

# 2. 檢查項目路徑
echo -e "${BLUE}[2/6] 檢查項目路徑...${NC}"
if [ ! -d "$PROJECT_PATH" ]; then
    echo -e "${RED}❌ 項目路徑不存在: $PROJECT_PATH${NC}"
    exit 1
fi
echo -e "${GREEN}✅ 項目路徑: $PROJECT_PATH${NC}"

# 3. 檢查依賴
echo -e "${BLUE}[3/6] 檢查依賴...${NC}"
cd "$PROJECT_PATH"
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️ 安裝依賴...${NC}"
    npm install --production=false
fi
echo -e "${GREEN}✅ 依賴已就緒${NC}"

# 4. 停止舊的 Agent
echo -e "${BLUE}[4/6] 停止舊的 Agent...${NC}"
if pm2 list | grep -q "$AGENT_NAME"; then
    pm2 delete "$AGENT_NAME" 2>/dev/null || true
    echo -e "${GREEN}✅ 舊 Agent 已停止${NC}"
else
    echo -e "${GREEN}✅ 無舊 Agent 運行${NC}"
fi

# 5. 啟動 Agent
echo -e "${BLUE}[5/6] 啟動 VPS Agent...${NC}"
export VPS_HOST="$VPS_HOST"
export VPS_PORT="$VPS_PORT"
export HEALTH_INTERVAL="$HEALTH_INTERVAL"

pm2 start "$PROJECT_PATH/vps/agent-bootstrap.mjs" \
    --name "$AGENT_NAME" \
    --interpreter "node" \
    --max-memory-restart "256M" \
    --exp-backoff-restart-delay=1000 \
    --no-autorestart \
    --time

echo -e "${GREEN}✅ VPS Agent 已啟動${NC}"

# 6. 驗證
echo -e "${BLUE}[6/6] 驗證 Agent 狀態...${NC}"
sleep 3
if pm2 list | grep -q "$AGENT_NAME.*online"; then
    echo -e "${GREEN}✅ VPS Agent 運行中${NC}"
else
    echo -e "${RED}❌ VPS Agent 啟動失敗${NC}"
    pm2 logs "$AGENT_NAME" --lines 10
    exit 1
fi

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  ✨ VPS Agent 註冊完成！${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "  ${BLUE}Agent 名稱:${NC} $AGENT_NAME"
echo -e "  ${BLUE}VPS 主機:${NC}   $VPS_HOST:$VPS_PORT"
echo -e "  ${BLUE}健康檢查:${NC}   每 ${HEALTH_INTERVAL}ms"
echo -e "  ${BLUE}PM2 狀態:${NC}   $(pm2 list | grep $AGENT_NAME | awk '{print $18}')"
echo ""
echo -e "  ${YELLOW}常用命令:${NC}"
echo -e "    查看日誌: ${CYAN}pm2 logs $AGENT_NAME${NC}"
echo -e "    重啟:     ${CYAN}pm2 restart $AGENT_NAME${NC}"
echo -e "    停止:     ${CYAN}pm2 stop $AGENT_NAME${NC}"
echo -e "    刪除:     ${CYAN}pm2 delete $AGENT_NAME${NC}"
echo ""
echo -e "${CYAN}「萬能元件心核，量子糾纏永恆。」${NC}"
