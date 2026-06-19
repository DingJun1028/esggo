# Google Stitch MCP 服務器註冊腳本 (PowerShell)
# 執行方式: .\mcp-servers\google-stitch\install.ps1

param(
    [string]$ProjectDir = (Split-Path -Parent (Split-Path -Parent $PSScriptRoot)),
    [string]$McpServerDir = $PSScriptRoot
)

Write-Host "🚀 開始註冊 Google Stitch MCP 服務器..." -ForegroundColor Green
Write-Host ""

# 變數定義
$McpConfigPath = "$env:APPDATA\Kilo-Code\MCP\mcp_settings.json"

Write-Host "📂 專案目錄: $ProjectDir" -ForegroundColor Cyan
Write-Host "📂 MCP 服務器目錄: $McpServerDir" -ForegroundColor Cyan
Write-Host ""

# 步驟 1: 檢查依賴
Write-Host "📦 步驟 1: 檢查依賴..." -ForegroundColor Yellow

try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js 已安裝: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ 錯誤: 未找到 Node.js，請先安裝 Node.js" -ForegroundColor Red
    exit 1
}

try {
    $npmVersion = npm --version
    Write-Host "✅ npm 已安裝: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ 錯誤: 未找到 npm，請先安裝 npm" -ForegroundColor Red
    exit 1
}

Write-Host ""

# 步驟 2: 安裝依賴
Write-Host "📦 步驟 2: 安裝依賴..." -ForegroundColor Yellow
Push-Location $McpServerDir
try {
    npm install
    Write-Host "✅ 依賴安裝完成" -ForegroundColor Green
} catch {
    Write-Host "❌ 依賴安裝失敗: $_" -ForegroundColor Red
    Pop-Location
    exit 1
}
Pop-Location
Write-Host ""

# 步驟 3: 編譯 TypeScript
Write-Host "🔧 步驟 3: 編譯 TypeScript..." -ForegroundColor Yellow
Push-Location $McpServerDir
try {
    npm run build
    Write-Host "✅ 編譯完成" -ForegroundColor Green
} catch {
    Write-Host "❌ TypeScript 編譯失敗: $_" -ForegroundColor Red
    Pop-Location
    exit 1
}
Pop-Location
Write-Host ""

# 步驟 4: 配置 MCP 設定
Write-Host "⚙️  步驟 4: 配置 MCP 設定..." -ForegroundColor Yellow

# 創建 MCP 設定目錄
$configDir = Split-Path -Parent $McpConfigPath
if (-not (Test-Path $configDir)) {
    New-Item -ItemType Directory -Force -Path $configDir | Out-Null
}

# 創建 MCP 設定檔案
$mcpConfig = @{
    mcpServers = @{
        "google-stitch" = @{
            command = "node"
            args = @("$McpServerDir\build\index.js")
            disabled = $false
            alwaysAllow = @(
                "get_design_tokens",
                "validate_design_tokens",
                "get_ui_ux_best_practices",
                "get_component_guidelines"
            )
            timeout = 60
        }
    }
}

# 寫入 JSON 設定檔案
try {
    $mcpConfig | ConvertTo-Json -Depth 10 | Out-File -FilePath $McpConfigPath -Encoding UTF8
    Write-Host "✅ MCP 設定已寫入: $McpConfigPath" -ForegroundColor Green
} catch {
    Write-Host "❌ 設定寫入失敗: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# 步驟 5: 驗證安裝
Write-Host "🧪 步驟 5: 驗證安裝..." -ForegroundColor Yellow

$serverJsPath = "$McpServerDir\build\index.js"
if (Test-Path $serverJsPath) {
    Write-Host "✅ MCP 服務器文件已創建" -ForegroundColor Green
} else {
    Write-Host "❌ 錯誤: MCP 服務器文件未找到" -ForegroundColor Red
    exit 1
}

if (Test-Path $McpConfigPath) {
    Write-Host "✅ MCP 設定檔案已創建" -ForegroundColor Green
    Write-Host ""
    Write-Host "📄 MCP 設定內容:" -ForegroundColor Cyan
    Get-Content $McpConfigPath | Write-Host
} else {
    Write-Host "❌ 錯誤: MCP 設定檔案未創建" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 Google Stitch MCP 服務器註冊完成！" -ForegroundColor Green
Write-Host ""
Write-Host "📝 下一步:" -ForegroundColor Cyan
Write-Host "   1. 重啟 Kilo Code 以載入新的 MCP 服務器" -ForegroundColor White
Write-Host "   2. 使用 MCP 工具:" -ForegroundColor White
Write-Host "      - mcp.google_stitch.get_design_tokens()" -ForegroundColor Gray
Write-Host "      - mcp.google_stitch.get_ui_ux_best_practices()" -ForegroundColor Gray
Write-Host "      - mcp.google_stitch.get_component_guidelines()" -ForegroundColor Gray
Write-Host ""
Write-Host "📚 使用範例:" -ForegroundColor Cyan
Write-Host "   1. 查看文檔: docs/GOOGLE_STITCH_MCP_COMPLETE_EXAMPLE.md" -ForegroundColor Gray
Write-Host "   2. 執行測試: node scripts/generate-ui-component.js" -ForegroundColor Gray
Write-Host ""
