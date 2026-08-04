# ==============================================================================
# ESGGO VPS Connection & SSH Key Permissions Automated Setup Script
# Formatted for Windows PowerShell (win32)
# Usage: .\vps\setup-permissions.ps1
# ==============================================================================

# Ensure UTF-8 output encoding for proper display of Chinese characters
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "🛡️  ESGGO VPS 設置權與 SSH 安全金鑰自動化建置腳本" -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "本腳本將在本地 Windows 電腦自動產生高安全度 ED25519 金鑰對，" -ForegroundColor DarkGray
Write-Host "配置 SSH 快速連線捷徑，並提供 VPS 端誠信防禦與權限加固之整合指引。" -ForegroundColor DarkGray
Write-Host ""

# 1. 檢測並建立本地 .ssh 目錄
$sshDir = Join-Path $Home ".ssh"
if (-not (Test-Path $sshDir)) {
    Write-Host ">> [1/4] 建立本地 .ssh 安全目錄..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $sshDir | Out-Null
    Write-Host "✅ 成功建立 $sshDir" -ForegroundColor Green
} else {
    Write-Host ">> [1/4] 本地 .ssh 目錄已存在，繼續執行..." -ForegroundColor Green
}

# 2. 檢測或生成 ED25519 金鑰對
$keyPath = Join-Path $sshDir "vps_key"
$pubKeyPath = "$keyPath.pub"

if (-not (Test-Path $keyPath)) {
    Write-Host ">> [2/4] 未偵測到預設金鑰對。正在生成高安全度 ED25519 金鑰對..." -ForegroundColor Yellow
    # 執行 ssh-keygen 產生金鑰對，使用 -N '""' 傳遞空密碼，防止引數解析錯誤
    ssh-keygen -t ed25519 -f $keyPath -C "esggo-vps-key" -N '""'
    if (Test-Path $keyPath) {
        Write-Host "✅ 成功生成私鑰：$keyPath" -ForegroundColor Green
        Write-Host "✅ 成功生成公鑰：$pubKeyPath" -ForegroundColor Green
    } else {
        Write-Host "❌ 錯誤：金鑰生成失敗，請確認系統已安裝 OpenSSH Client。" -ForegroundColor Red
        Exit 1
    }
} else {
    Write-Host ">> [2/4] 偵測到現有的 SSH 私鑰 $keyPath，將直接複用..." -ForegroundColor Green
}

# 讀取公鑰內容
$pubKeyContent = Get-Content $pubKeyPath -Raw
$pubKeyContent = $pubKeyContent.Trim()

# 3. 配置本地 SSH Config 快速捷徑
$configPath = Join-Path $sshDir "config"
$configEntry = '
Host esggo-vps
  HostName 161.118.248.180
  User root
  Port 22
  IdentityFile ~/.ssh/vps_key
  IdentitiesOnly yes
'

$hasConfig = $false
if (Test-Path $configPath) {
    $existingConfig = Get-Content $configPath -Raw
    if ($existingConfig.Contains("Host esggo-vps")) {
        $hasConfig = $true
    }
}

if (-not $hasConfig) {
    Write-Host ">> [3/4] 正在配置本地 SSH 快速連線捷徑..." -ForegroundColor Yellow
    Add-Content -Path $configPath -Value $configEntry
    Write-Host "✅ 已將 'esggo-vps' 捷徑寫入 $configPath" -ForegroundColor Green
} else {
    Write-Host ">> [3/4] 本地 config 中已存在 'esggo-vps' 連線捷徑，跳過寫入..." -ForegroundColor Green
}

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "🔑 請複製下方金鑰，將其登錄至您的 VPS 生產環境中：" -ForegroundColor Yellow
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host $pubKeyContent -ForegroundColor White
Write-Host "======================================================================" -ForegroundColor Cyan

# 4. 提供一鍵 VPS 授權登錄命令
Write-Host ">> [4/4] VPS 端快速授權指令：" -ForegroundColor Yellow
Write-Host "請登入 VPS 後，直接在遠端終端機執行下方一鍵貼上指令（將自動建立授權檔案並鎖定權限）：" -ForegroundColor DarkGray
Write-Host ""
$oneLiner = 'mkdir -p ~/.ssh && chmod 700 ~/.ssh && echo "' + $pubKeyContent + '" >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys'
Write-Host $oneLiner -ForegroundColor Cyan
Write-Host ""

# 5. 提供 SSH 安全加固指引
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "🛡️  VPS 設置權與 SSH 安全防禦加固指引 (Security Hardening)" -ForegroundColor Yellow
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "當您測試 'ssh esggo-vps' 免密碼成功連線後，建議執行以下安全防衛設定：" -ForegroundColor DarkGray
Write-Host ""
Write-Host "1. 編輯 VPS 上的 SSH 設定檔：" -ForegroundColor DarkGray
Write-Host "   sudo nano /etc/ssh/sshd_config" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. 修改或確認以下參數（禁用密碼登入與允許金鑰登入）：" -ForegroundColor DarkGray
Write-Host "   PubkeyAuthentication yes" -ForegroundColor Cyan
Write-Host "   PasswordAuthentication no" -ForegroundColor Cyan
Write-Host "   ChallengeResponseAuthentication no" -ForegroundColor Cyan
Write-Host "   PermitRootLogin prohibit-password" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. 重新載入遠端 SSH 服務生效：" -ForegroundColor DarkGray
Write-Host "   sudo systemctl reload sshd" -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "🎉 恭喜！本地金鑰與連線權限建置已全數完成！" -ForegroundColor Green
Write-Host "您現在只需在 CMD 或 PowerShell 中輸入：[ ssh esggo-vps ] 即可極速安全連線！" -ForegroundColor Green
Write-Host "======================================================================" -ForegroundColor Cyan
