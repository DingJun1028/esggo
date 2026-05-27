$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "`n[1/2] Checking System Encoding..." -ForegroundColor Blue
chcp 65001 | Out-Null

Write-Host "[2/2] Environment Synchronized to UTF-8" -ForegroundColor Green
Write-Host "--------------------------------------------------"
Write-Host "System Prompt: Traditional Chinese environment is ready, icon rendering calibrated." -ForegroundColor Cyan
Write-Host "--------------------------------------------------`n"
