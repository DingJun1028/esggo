#!/bin/bash
# ==========================================
# 完全代主自行 - CLI 啟動腳本
# ==========================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 檢查 Node.js
if ! command -v node &> /dev/null; then
  echo "❌ 錯誤: 找不到 Node.js"
  exit 1
fi

# 檢查依賴
if [ ! -d "$SCRIPT_DIR/node_modules" ]; then
  echo "📦 安裝依賴..."
  cd "$SCRIPT_DIR" && npm install
fi

# 檢查構建
if [ ! -d "$SCRIPT_DIR/dist" ]; then
  echo "🔨 構建 CLI..."
  cd "$SCRIPT_DIR" && npm run build
fi

# 執行 CLI
node "$SCRIPT_DIR/dist/delegation.js" "$@"
