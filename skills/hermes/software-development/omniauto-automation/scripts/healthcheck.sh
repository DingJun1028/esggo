#!/bin/bash
# scripts/healthcheck.sh
# OmniAuto 健康檢查腳本
# 用於 CI 中驗證專案健康狀態

set -e  # 遇到錯誤即退出

PROJECT_NAME="OmniAuto"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

echo "[$PROJECT_NAME-health] 開始健康檢查..."
echo "[$PROJECT_NAME-health] 目錄: $ROOT_DIR"

# 變更到專案根目錄
cd "$ROOT_DIR"

# 步驟 1: 依賴檢查
echo "[$PROJECT_NAME-health] 步驟 1/5: 檢查依賴..."
if [ ! -f "package.json" ]; then
    echo "[$PROJECT_NAME-health] FAIL - package.json 不存在"
    exit 1
fi

if [ ! -f "package-lock.json" ] && [ ! -f "pnpm-lock.yaml" ]; then
    echo "[$PROJECT_NAME-health] WARN - 沒有 lock 檔案，可能需要手動安裝依賴"
fi

# 步驟 2: 依賴安裝
echo "[$PROJECT_NAME-health] 步驟 2/5: 安裝依賴..."
if command -v pnpm &> /dev/null; then
    pnpm install --frozen-lockfile || pnpm install
elif command -v npm &> /dev/null; then
    npm ci --prefer-offline || npm install
else
    echo "[$PROJECT_NAME-health] FAIL - 沒有安裝 npm 或 pnpm"
    exit 1
fi

# 步驟 3: 運行測試
echo "[$PROJECT_NAME-health] 步驟 3/5: 運行測試..."
if npm test 2>&1; then
    echo "[$PROJECT_NAME-health] 測試通過"
else
    echo "[$PROJECT_NAME-health] FAIL - 測試失敗"
    exit 1
fi

# 步驟 4: 建置檢查
echo "[$PROJECT_NAME-health] 步驟 4/5: 建置檢查..."
if npm run build 2>&1; then
    echo "[$PROJECT_NAME-health] 建置成功"
else
    echo "[$PROJECT_NAME-health] FAIL - 建置失敗"
    exit 1
fi

# 步驟 5: 輸出目錄檢查
echo "[$PROJECT_NAME-health] 步驟 5/5: 檢查輸出目錄..."
if [ -d "dist" ]; then
    FILE_COUNT=$(find dist -type f | wc -l)
    echo "[$PROJECT_NAME-health] dist/ 目錄包含 $FILE_COUNT 個檔案"
else
    echo "[$PROJECT_NAME-health] FAIL - dist/ 目錄不存在"
    exit 1
fi

echo "[$PROJECT_NAME-health] OK - 健康檢查通過"
exit 0