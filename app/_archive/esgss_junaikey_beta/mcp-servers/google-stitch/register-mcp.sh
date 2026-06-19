#!/bin/bash
# Google Stitch MCP 服務器註冊腳本
# 執行方式: bash mcp-servers/google-stitch/register-mcp.sh

set -e

echo "🚀 開始註冊 Google Stitch MCP 服務器..."
echo ""

# 變數定義
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
MCP_SERVER_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MCP_CONFIG_PATH="$HOME/.config/kilocode/mcp_settings.json"

echo "📂 專案目錄: $PROJECT_DIR"
echo "📂 MCP 服務器目錄: $MCP_SERVER_DIR"
echo ""

# 步驟 1: 檢查依賴
echo "📦 步驟 1: 檢查依賴..."
if ! command -v node &> /dev/null; then
    echo "❌ 錯誤: 未找到 Node.js，請先安裝 Node.js"
    exit 1
fi
echo "✅ Node.js 已安裝: $(node --version)"

if ! command -v npm &> /dev/null; then
    echo "❌ 錯誤: 未找到 npm，請先安裝 npm"
    exit 1
fi
echo "✅ npm 已安裝: $(npm --version)"
echo ""

# 步驟 2: 安裝依賴
echo "📦 步驟 2: 安裝依賴..."
cd "$MCP_SERVER_DIR"
npm install
echo "✅ 依賴安裝完成"
echo ""

# 步驟 3: 編譯 TypeScript
echo "🔧 步驟 3: 編譯 TypeScript..."
npm run build
echo "✅ 編譯完成"
echo ""

# 步驟 4: 讀取現有 MCP 設定
echo "⚙️  步驟 4: 配置 MCP 設定..."
mkdir -p "$(dirname "$MCP_CONFIG_PATH")"

# 創建 MCP 設定檔案
MCP_CONFIG='{
  "mcpServers": {
    "google-stitch": {
      "command": "node",
      "args": ["'$MCP_SERVER_DIR'/build/index.js"],
      "disabled": false,
      "alwaysAllow": [
        "get_design_tokens",
        "validate_design_tokens",
        "get_ui_ux_best_practices",
        "get_component_guidelines"
      ],
      "timeout": 60
    }
  }
}'

# 寫入設定檔案
echo "$MCP_CONFIG" > "$MCP_CONFIG_PATH"
echo "✅ MCP 設定已寫入: $MCP_CONFIG_PATH"
echo ""

# 步驟 5: 驗證安裝
echo "🧪 步驟 5: 驗證安裝..."
if [ -f "$MCP_SERVER_DIR/build/index.js" ]; then
    echo "✅ MCP 服務器文件已創建"
else
    echo "❌ 錯誤: MCP 服務器文件未找到"
    exit 1
fi

if [ -f "$MCP_CONFIG_PATH" ]; then
    echo "✅ MCP 設定檔案已創建"
    echo ""
    echo "📄 MCP 設定內容:"
    cat "$MCP_CONFIG_PATH"
else
    echo "❌ 錯誤: MCP 設定檔案未創建"
    exit 1
fi

echo ""
echo "🎉 Google Stitch MCP 服務器註冊完成！"
echo ""
echo "📝 下一步:"
echo "   1. 重啟 Kilo Code 以載入新的 MCP 服務器"
echo "   2. 使用 MCP 工具:"
echo "      - mcp.google_stitch.get_design_tokens()"
echo "      - mcp.google_stitch.get_ui_ux_best_practices()"
echo "      - mcp.google_stitch.get_component_guidelines()"
echo ""
