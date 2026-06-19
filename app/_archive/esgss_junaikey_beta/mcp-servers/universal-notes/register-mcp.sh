#!/bin/bash
# 萬能筆記 MCP 服務器註冊腳本
# Universal Notes MCP Server Registration Script

set -e

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 獲取腳本所在目錄
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}萬能筆記 MCP 服務器註冊工具${NC}"
echo -e "${BLUE}Universal Notes MCP Server Registration${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# 檢查 Node.js
echo -e "${YELLOW}檢查 Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}錯誤: 未找到 Node.js${NC}"
    echo "請先安裝 Node.js >= 18.0.0"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}錯誤: Node.js 版本過低 (需要 >= 18.0.0)${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js 版本: $(node -v)${NC}"
echo ""

# 安裝依賴
echo -e "${YELLOW}安裝依賴...${NC}"
cd "$SCRIPT_DIR"
npm install
echo -e "${GREEN}✓ 依賴安裝完成${NC}"
echo ""

# 構建項目
echo -e "${YELLOW}構建項目...${NC}"
npm run build
echo -e "${GREEN}✓ 構建完成${NC}"
echo ""

# 檢測操作系統
OS="$(uname -s)"
case "$OS" in
    Linux*)
        CONFIG_DIR="$HOME/.config/Claude"
        ;;
    Darwin*)
        CONFIG_DIR="$HOME/Library/Application Support/Claude"
        ;;
    CYGWIN*|MINGW*|MSYS*)
        CONFIG_DIR="$APPDATA/Claude"
        ;;
    *)
        echo -e "${RED}錯誤: 不支持的操作系統${NC}"
        exit 1
        ;;
esac

CONFIG_FILE="$CONFIG_DIR/claude_desktop_config.json"

# 創建配置目錄
if [ ! -d "$CONFIG_DIR" ]; then
    echo -e "${YELLOW}創建配置目錄: $CONFIG_DIR${NC}"
    mkdir -p "$CONFIG_DIR"
fi

# 獲取絕對路徑
SERVER_PATH="$SCRIPT_DIR/dist/index.js"

# 檢查配置文件是否存在
if [ ! -f "$CONFIG_FILE" ]; then
    echo -e "${YELLOW}創建新的配置文件...${NC}"
    cat > "$CONFIG_FILE" << EOF
{
  "mcpServers": {
    "universal-notes": {
      "command": "node",
      "args": [
        "$SERVER_PATH"
      ]
    }
  }
}
EOF
else
    echo -e "${YELLOW}更新現有配置文件...${NC}"

    # 檢查是否已經註冊
    if grep -q '"universal-notes"' "$CONFIG_FILE"; then
        echo -e "${YELLOW}萬能筆記 MCP 服務器已經註冊${NC}"
        read -p "是否要更新配置？(y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo -e "${GREEN}註冊完成${NC}"
            exit 0
        fi
    fi

    # 使用 Python 更新 JSON 配置
    python3 << PYTHON_SCRIPT
import json
import sys

config_file = "$CONFIG_FILE"
server_path = "$SERVER_PATH"

try:
    with open(config_file, 'r', encoding='utf-8') as f:
        config = json.load(f)
    
    if 'mcpServers' not in config:
        config['mcpServers'] = {}
    
    config['mcpServers']['universal-notes'] = {
        'command': 'node',
        'args': [server_path]
    }
    
    with open(config_file, 'w', encoding='utf-8') as f:
        json.dump(config, f, indent=2, ensure_ascii=False)
    
    print("配置文件更新成功")
except Exception as e:
    print(f"錯誤: {e}", file=sys.stderr)
    sys.exit(1)
PYTHON_SCRIPT
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✓ 註冊完成！${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}配置文件位置:${NC} $CONFIG_FILE"
echo -e "${BLUE}服務器路徑:${NC} $SERVER_PATH"
echo ""
echo -e "${YELLOW}下一步:${NC}"
echo "1. 重啟 Claude Desktop"
echo "2. 在 Claude 中使用萬能筆記工具"
echo ""
echo -e "${BLUE}可用工具:${NC}"
echo "  - create_note: 創建筆記"
echo "  - search_notes: 搜索筆記"
echo "  - sync_note: 同步筆記"
echo "  - get_note: 獲取筆記"
echo "  - update_note: 更新筆記"
echo "  - delete_note: 刪除筆記"
echo "  - get_related_notes: 獲取相關筆記"
echo "  - ask_ai: 向 AI 提問"
echo "  - generate_report: 生成報告"
echo "  - get_system_status: 獲取系統狀態"
echo ""
