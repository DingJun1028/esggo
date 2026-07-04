# ESGGO VPS 一鍵部署腳本 (PowerShell)
# 執行方式：在 PowerShell 中直接執行此檔案

$ErrorActionPreference = "Stop"

$SSH_KEY = "C:\Users\Administrator\Downloads\ssh-key-2026-04-25.key"
$VPS_IP = "161.118.248.180"
$LOCAL_VPS_DIR = "C:\var\www\esggo\vps"
$TARBALL = "C:\var\www\esggo\esggo-vps-optimization.tar.gz"

Write-Host "=== ESGGO VPS 一鍵部署 ===" -ForegroundColor Cyan

# 1. 打包 vps/ 目錄
Write-Host "[1/5] 打包 vps/ 目錄..." -ForegroundColor Yellow
Set-Location "C:\var\www\esggo"
tar -czvf $TARBALL vps\

# 2. 上傳 tarball
Write-Host "[2/5] 上傳部署包到 VPS..." -ForegroundColor Yellow
scp -i $SSH_KEY $TARBALL "root@${VPS_IP}:/root/"

# 3. 在 VPS 上解壓並執行部署
Write-Host "[3/5] 執行部署腳本..." -ForegroundColor Yellow
$deployCmd = @"
cd /root
tar -xzf esggo-vps-optimization.tar.gz
cd vps
chmod +x deploy-vps-optimization.sh
sudo bash deploy-vps-optimization.sh
"@

ssh -i $SSH_KEY "root@${VPS_IP}" $deployCmd

# 4. 啟用 Telegram 告警服務
Write-Host "[4/5] 啟用 Telegram 告警服務..." -ForegroundColor Yellow
$telegramCmd = "sudo systemctl enable --now telegram-alert"
ssh -i $SSH_KEY "root@${VPS_IP}" $telegramCmd

# 5. 驗證部署結果
Write-Host "[5/5] 驗證服務狀態..." -ForegroundColor Yellow
$verifyCmd = @"
echo '=== Nginx ==='; systemctl is-active nginx
echo '=== Prometheus ==='; systemctl is-active prometheus
echo '=== Alertmanager ==='; systemctl is-active alertmanager
echo '=== Netdata ==='; systemctl is-active netdata
echo '=== Telegram Alert ==='; systemctl is-active telegram-alert
echo '=== PM2 ==='; pm2 list
"@
ssh -i $SSH_KEY "root@${VPS_IP}" $verifyCmd

Write-Host ""
Write-Host "=== 部署完成 ===" -ForegroundColor Green
Write-Host "可透過以下指令持續監控：" -ForegroundColor Cyan
Write-Host "  ssh -i $SSH_KEY root@$VPS_IP 'journalctl -u telegram-alert -f'" -ForegroundColor White
Write-Host "  ssh -i $SSH_KEY root@$VPS_IP 'pm2 logs'" -ForegroundColor White
