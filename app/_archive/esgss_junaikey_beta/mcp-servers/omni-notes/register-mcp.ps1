# Omni 筆記 MCP 服務器註冊腳本 (Windows)
# Omni Notes MCP Server Registration Script (Windows)

$ErrorActionPreference = "Stop"

# 顏色輸出函數
function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

Write-ColorOutput Cyan "========================================"
Write-ColorOutput Cyan "Omni 筆記 MCP 服務器註冊工具"
Write-ColorOutput Cyan "Omni Notes MCP Server Registration"
Write-ColorOutput Cyan "========================================"
Write-Output ""

# 檢查 Node.js
Write-ColorOutput Yellow "檢查 Node.js..."
try {
    $nodeVersion = node -v
    $majorVersion = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
    if ($majorVersion -lt 18) {
        Write-ColorOutput Red "錯誤: Node.js 版本過低 (需要 >= 18.0.0)"
        exit 1
    }
    Write-ColorOutput Green "✓ Node.js 版本: $nodeVersion"
} catch {
    Write-ColorOutput Red "錯誤: 未找到 Node.js"
    Write-Output "請先安裝 Node.js >= 18.0.0"
    exit 1
}
Write-Output ""

# 獲取腳本所在目錄
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent (Split-Path -Parent $ScriptDir)

# 安裝依賴
Write-ColorOutput Yellow "安裝依賴..."
Set-Location $ScriptDir
npm install
Write-ColorOutput Green "✓ 依賴安裝完成"
Write-Output ""

# 構建項目
Write-ColorOutput Yellow "構建項目..."
npm run build
Write-ColorOutput Green "✓ 構建完成"
Write-Output ""

# 獲取配置目錄
$ConfigDir = Join-Path $env:APPDATA "Claude"
$ConfigFile = Join-Path $ConfigDir "claude_desktop_config.json"

# 創建配置目錄
if (-not (Test-Path $ConfigDir)) {
    Write-ColorOutput Yellow "創建配置目錄: $ConfigDir"
    New-Item -ItemType Directory -Path $ConfigDir -Force | Out-Null
}

# 獲取絕對路徑
$ServerPath = Join-Path $ScriptDir "dist\index.js"
$ServerPath = $ServerPath -replace '\\', '/'

# 檢查配置文件是否存在
if (-not (Test-Path $ConfigFile)) {
    Write-ColorOutput Yellow "創建新的配置文件..."
    $config = @{
        mcpServers = @{
            "omni-notes" = @{
                command = "node"
                args = @($ServerPath)
            }
        }
    }
    $config | ConvertTo-Json -Depth 10 | Out-File -FilePath $ConfigFile -Encoding utf8
} else {
    Write-ColorOutput Yellow "更新現有配置文件..."

    # 讀取現有配置
    $config = Get-Content $ConfigFile -Raw | ConvertFrom-Json

    # 檢查是否已經註冊
    if ($config.mcpServers.PSObject.Properties.Name -contains "omni-notes") {
        Write-ColorOutput Yellow "Omni 筆記 MCP 服務器已經註冊"
        $response = Read-Host "是否要更新配置？(y/n)"
        if ($response -ne "y" -and $response -ne "Y") {
            Write-ColorOutput Green "註冊完成"
            exit 0
        }
    }

    # 更新配置
    if (-not $config.mcpServers) {
        $config | Add-Member -Type NoteProperty -Name "mcpServers" -Value @{}
    }

    $config.mcpServers | Add-Member -Type NoteProperty -Name "omni-notes" -Value @{
        command = "node"
        args = @($ServerPath)
    } -Force

    # 保存配置
    $config | ConvertTo-Json -Depth 10 | Out-File -FilePath $ConfigFile -Encoding utf8
}

Write-Output ""
Write-ColorOutput Green "========================================"
Write-ColorOutput Green "✓ 註冊完成！"
Write-ColorOutput Green "========================================"
Write-Output ""
Write-ColorOutput Cyan "配置文件位置: $ConfigFile"
Write-ColorOutput Cyan "服務器路徑: $ServerPath"
Write-Output ""
Write-ColorOutput Yellow "下一步:"
Write-Output "1. 重啟 Claude Desktop"
Write-Output "2. 在 Claude 中使用 Omni 筆記工具"
Write-Output ""
Write-ColorOutput Cyan "可用工具:"
Write-Output "  - create_note: 創建筆記"
Write-Output "  - search_notes: 搜索筆記"
Write-Output "  - sync_note: 同步筆記"
Write-Output "  - get_note: 獲取筆記"
Write-Output "  - update_note: 更新筆記"
Write-Output "  - delete_note: 刪除筆記"
Write-Output "  - get_related_notes: 獲取相關筆記"
Write-Output "  - ask_ai: 向 AI 提問"
Write-Output "  - generate_report: 生成報告"
Write-Output "  - get_system_status: 獲取系統狀態"
Write-Output ""
