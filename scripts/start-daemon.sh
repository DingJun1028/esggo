#!/bin/bash

# =====================================================================
# ESGGO Daemon Startup Script (Linux/Ubuntu)
# 這個腳本用於在 VPS 上一鍵編譯並以 PM2 啟動 ESGGO 的長久運行服務。
# =====================================================================

echo "🚀 [ESGGO Daemon] 開始部署與啟動長久運行服務..."

# 1. 確保目前在專案根目錄
cd "$(dirname "$0")/.." || exit 1

# 2. 檢查 PM2 是否已安裝
if ! command -v pm2 &> /dev/null
then
    echo "⚠️ 找不到 PM2。正在全域安裝 PM2..."
    npm install -g pm2
    if [ $? -ne 0 ]; then
        echo "❌ PM2 安裝失敗，請確認是否有 sudo 權限 (或嘗試使用 sudo npm install -g pm2)。"
        exit 1
    fi
    echo "✅ PM2 安裝完成。"
fi

# 3. 安裝依賴與建置專案 (確保是最新的 Production Build)
echo "📦 正在安裝 npm 依賴並編譯專案..."
npm install
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 專案編譯 (npm run build) 失敗！請檢查錯誤日誌。"
    exit 1
fi
echo "✅ 專案編譯完成。"

# 4. 建立日誌資料夾
mkdir -p logs

# 5. 使用 PM2 啟動服務
echo "🔄 正在使用 PM2 重啟/啟動 ESGGO 服務..."
pm2 start ecosystem.config.js --env production

# 6. 儲存 PM2 狀態並設定開機自啟
echo "💾 正在儲存 PM2 運行狀態與設定開機自啟..."
pm2 save
# 產生 startup 腳本 (若為首次設定，系統可能會提示需複製一段 sudo 指令並執行)
pm2 startup | tail -n 1 > /tmp/pm2_startup_cmd.sh
source /tmp/pm2_startup_cmd.sh || echo "⚠️ 開機自啟設定可能需要您手動執行 sudo 指令。請注意上方 PM2 的提示。"

echo "================================================================"
echo "🎉 [ESGGO Daemon] 部署成功！系統現已進入永久運行模式。"
echo "您可以隨時使用以下指令監控您的服務："
echo "  - 查看狀態： pm2 status"
echo "  - 查看日誌： pm2 logs esggo-core"
echo "  - 監控面板： pm2 monit"
echo "================================================================"
