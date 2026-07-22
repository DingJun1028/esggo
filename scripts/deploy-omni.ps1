# InfoOne 終極部署腳本：聖典刻印 v3.1
# 目標：在 Windows 環境下初始化 5T 秩序環境

Write-Host "🌟 [JunAiKey] 啟動聖典刻印程序..." -ForegroundColor Cyan

# 1. 建立必要目錄
Write-Host "📂 建立萬能智庫存儲區..."
New-Item -ItemType Directory -Force -Path ".\omni_vault\eternal_storage"
New-Item -ItemType Directory -Force -Path ".\omni_vault\audit_logs"

# 2. 安裝核心依賴 (TypeScript & Crypto)
Write-Host "📦 檢查並安裝聖典核心依賴..."
npm install typescript ts-node crypto-js --save-dev

# 3. 測試 Holy Linter 整合
Write-Host "🛡️ 驗證聖典 Linter 狀態..."
if (Test-Path ".\lib\core\omni-linter.ts") {
    Write-Host "✅ Holy Linter 已就緒。" -ForegroundColor Green
} else {
    Write-Host "❌ 找不到 Holy Linter，請檢查檔案路徑。" -ForegroundColor Red
}

# 4. 提醒 Git Hook 設定
Write-Host "`n🔒 提醒：建議手動激活 Git Pre-commit Hook 以強制執行 5T 校驗。" -ForegroundColor Yellow
Write-Host "指令範例: echo 'npx ts-node ./lib/core/omni-linter.ts' > .git/hooks/pre-commit"

Write-Host "`n✅ [聖典刻印完成] InfoOne 已進入 5T 秩序態。" -ForegroundColor Cyan
