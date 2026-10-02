# 確保 PowerShell session 使用 UTF-8 編碼
# 放在 GitHub Actions VPS 指令前或本地開發時 source
$OutputEncoding = [System.Text.UTF8Encoding]::new()
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new()
[Console]::InputEncoding = [System.Text.UTF8Encoding]::new()
chcp 65001 | Out-Null
