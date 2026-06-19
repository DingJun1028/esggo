# 奧秘智庫系統 - 快速啟動腳本 (Windows)
# Quick Start Script for Omni Think Tank (Windows PowerShell)

Write-Host "🌌 奧秘智庫系統 - 快速啟動" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# 檢查 Node.js
try {
    $nodeVersion = node -v
    Write-Host "✅ Node.js 版本: $nodeVersion" -ForegroundColor Green
}
catch {
    Write-Host "❌ 錯誤: Node.js 未安裝" -ForegroundColor Red
    Write-Host "請先安裝 Node.js 18+: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# 檢查 PostgreSQL
try {
    $pgVersion = psql --version
    Write-Host "✅ PostgreSQL: $pgVersion" -ForegroundColor Green
}
catch {
    Write-Host "⚠️  警告: PostgreSQL 未安裝或未在 PATH 中" -ForegroundColor Yellow
    Write-Host "請確保 PostgreSQL 14+ 已安裝並運行" -ForegroundColor Yellow
}

# 檢查環境變數
if (-not (Test-Path .env)) {
    Write-Host "📝 創建環境變數檔案..." -ForegroundColor Yellow
    if (Test-Path .env.example) {
        Copy-Item .env.example .env
    }
    else {
        Write-Host "請手動創建 .env 檔案" -ForegroundColor Yellow
    }
}

# 安裝前端依賴
Write-Host ""
Write-Host "📦 安裝前端依賴..." -ForegroundColor Cyan
npm install

# 安裝後端依賴
Write-Host ""
Write-Host "📦 安裝後端依賴..." -ForegroundColor Cyan
Set-Location celestial-server
npm install
Set-Location ..

# 資料庫初始化
$initDb = Read-Host "是否初始化資料庫？(y/n)"
if ($initDb -eq 'y' -or $initDb -eq 'Y') {
    Write-Host ""
    Write-Host "🗄️  初始化資料庫..." -ForegroundColor Cyan
    
    $dbName = $env:VECTOR_DB_NAME
    if (-not $dbName) {
        $dbName = "omni_think_tank"
    }
    
    # 執行遷移
    psql -d $dbName -f migrations/001_create_omnipotent_schema.sql
    psql -d $dbName -f migrations/002_seed_default_data.sql
    psql -d $dbName -f migrations/003_agent_skill_taxonomy.sql
    psql -d $dbName -f migrations/004_esg_rag_integration.sql
    
    Write-Host "✅ 資料庫初始化完成" -ForegroundColor Green
}

# 編譯後端 TypeScript
Write-Host ""
Write-Host "🔨 編譯後端 TypeScript..." -ForegroundColor Cyan
Set-Location celestial-server
npm run build
Set-Location ..

Write-Host ""
Write-Host "✅ 系統準備完成！" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 啟動指令:" -ForegroundColor Cyan
Write-Host "   前端: npm run dev" -ForegroundColor White
Write-Host "   後端: cd celestial-server; npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "或在兩個終端分別執行以上指令" -ForegroundColor Yellow
Write-Host ""
