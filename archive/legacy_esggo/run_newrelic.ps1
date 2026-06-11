# ==========================================
# ESGGO - New Relic APM Startup Script
# ==========================================
Write-Host "啟動 ESGGO 平台 (包含 New Relic APM 監控)..." -ForegroundColor Cyan

# 確保設定了正確的應用程式名稱與金鑰 (或透過環境變數傳入)
$env:NEW_RELIC_APP_NAME = "ESGGO-OmniCore"
$env:NEW_RELIC_NO_CONFIG_FILE = "true"

# 載入 newrelic 模組並啟動 Next.js 生產環境
node -r newrelic node_modules/next/dist/bin/next start