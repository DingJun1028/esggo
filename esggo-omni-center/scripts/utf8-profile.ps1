# ── PowerShell UTF-8 強制設定 ─────────────────
# 加入 PowerShell profile:  notepad $PROFILE
# 或在每個 terminal 啟動時手動 dot-source: . .\scripts\utf8-profile.ps1

# 輸出編碼
$OutputEncoding = [System.Text.UTF8Encoding]::new()
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new()
[Console]::InputEncoding = [System.Text.UTF8Encoding]::new()

# 主控台 codepage
& chcp 65001 | Out-Null

# Write-Output / Out-File 預設 UTF8
$PSDefaultParameterValues['Out-File:Encoding'] = 'utf8'
$PSDefaultParameterValues['*:Encoding'] = 'utf8'

Write-Host "[utf8-profile] PowerShell encoding set to UTF-8 (chcp 65001)" -ForegroundColor Green
