$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "`n[1/2] 🔍 Checking System Encoding..." -ForegroundColor Blue
chcp 65001 | Out-Null

Write-Host "[2/2] ✅ Environment Synchronized to UTF-8" -ForegroundColor Green
Write-Host "--------------------------------------------------"
Write-Host "系統提示: 繁體中文環境已就緒，圖示渲染已校準。" -ForegroundColor Cyan
Write-Host "--------------------------------------------------`n"
