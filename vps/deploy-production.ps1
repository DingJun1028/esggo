<#
.SYNOPSIS
  ESGGO OmniAgent 平台全自動化生產部署腳本 (Production Deployment Script)

.DESCRIPTION
  此腳本會執行完整的建置 (Build)、獨立輸出打包 (Standalone Packaging)、上傳至 VPS 並重新啟動 PM2 進程。
  它遵循了 5T 協議中的 Traceable 精神，確保每次部署的產出與執行結果一致。

.PARAMETER VpsHost
  VPS 的 IP 位址或 Hostname，預設為 161.118.248.180

.EXAMPLE
  .\vps\deploy-production.ps1 -VpsHost 161.118.248.180
#>

param (
    [string]$VpsHost = "161.118.248.180"
)

$ErrorActionPreference = "Stop"

# VPS 連線資訊
$VPS_USER = "root"
$VPS_DEST_DIR = "/var/www/esggo"
$TAR_NAME = "update-prod.tar.gz"

Write-Host "🚀 [1/5] 開始建置生產環境 (Running npm run build)..." -ForegroundColor Cyan
# 執行建置，確保產出最新的 .next/standalone
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 建置失敗，中斷部署程序。" -ForegroundColor Red
    exit 1
}

if (-Not (Test-Path ".\.next\standalone")) {
    Write-Host "❌ 找不到 .next/standalone 目錄，請檢查 next.config.ts 中的 output 屬性。" -ForegroundColor Red
    exit 1
}

Write-Host "📦 [2/5] 打包 Standalone 檔案與靜態資源..." -ForegroundColor Cyan
# 移除舊的壓縮檔
if (Test-Path $TAR_NAME) {
    Remove-Item $TAR_NAME -Force
}

# 僅打包需要的檔案 (standalone, public, .next/static)
# 使用 tar 指令（Windows 10/11 內建支援）
# 將 .next/static 複製到 standalone 內以維持正確結構
Copy-Item -Path ".\public" -Destination ".\.next\standalone\public" -Recurse -Force
Copy-Item -Path ".\.next\static" -Destination ".\.next\standalone\.next\static" -Recurse -Force
Copy-Item -Path ".\ecosystem.config.js" -Destination ".\.next\standalone\ecosystem.config.cjs" -Force

# 將打包範圍切換到 .next/standalone 內部
Push-Location ".\.next\standalone"
tar -czf "..\..\$TAR_NAME" .
Pop-Location

Write-Host "🌐 [3/5] 上傳部署包至 VPS ($VpsHost)..." -ForegroundColor Cyan
# 透過 SCP 傳輸檔案
scp -o BatchMode=yes ".\$TAR_NAME" "${VPS_USER}@${VpsHost}:${VPS_DEST_DIR}/${TAR_NAME}"

Write-Host "🔄 [4/5] 於遠端伺服器進行解壓縮與服務重啟..." -ForegroundColor Cyan
# 執行遠端指令
$remoteCommand = @"
cd $VPS_DEST_DIR
echo '解壓縮部署包...'
tar -xzf $TAR_NAME
echo '更新權限與重啟 PM2 (esggo-core)...'
chown -R root:root .

# 確認 PM2 模組 pm2-logrotate 已安裝 (永續進化)
echo '確保 pm2-logrotate 已安裝...'
pm2 install pm2-logrotate 2>/dev/null || true

pm2 delete esggo-core 2>/dev/null
pm2 start ecosystem.config.cjs
pm2 save
echo '✅ 遠端部署與服務啟動完成！'
"@

ssh -o BatchMode=yes "${VPS_USER}@${VPS_HOST}" $remoteCommand

Write-Host "🧹 [5/5] 清理本地暫存檔..." -ForegroundColor Cyan
Remove-Item $TAR_NAME -Force

Write-Host "🎉 部署作業圓滿成功！ESGGO OmniAgent 系統已處於最新狀態。" -ForegroundColor Green
