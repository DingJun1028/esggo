# OmniAgent Windows Environment Fixer v1.1
# High Compatibility Version - ASCII Symbols

Write-Host ">>> Fixing Windows Environment (Clean Mode)..." -ForegroundColor Cyan

# 1. Add Linux Aliases for PowerShell
if (!(Get-Alias grep -ErrorAction SilentlyContinue)) {
    Set-Alias -Name grep -Value Select-String -Description "OmniAgent Helper"
    Write-Host "[v] Alias 'grep' -> 'Select-String' created." -ForegroundColor Green
}

if (!(Get-Alias head -ErrorAction SilentlyContinue)) {
    function Get-Head { $input | Select-Object -First $args[0] }
    Set-Alias -Name head -Value Get-Head -Description "OmniAgent Helper"
    Write-Host "[v] Alias 'head' created." -ForegroundColor Green
}

# 2. Force UTF-8 Encoding for the current session
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
Write-Host "[v] Console Output Encoding set to UTF-8." -ForegroundColor Green

# 3. Clean up display in CLI tool
Write-Host "[*] Sanitizing Omni CLI display..." -ForegroundColor Cyan
node -e "const fs = require('fs'); const path = './cli/omni.mjs'; let c = fs.readFileSync(path, 'utf8'); c = c.replace(/🛠️/g, '[#]').replace(/✅/g, '[v]').replace(/❌/g, '[x]').replace(/📡/g, '[o]').replace(/🔍/g, '[?]').replace(/☁️/g, '[~]').replace(/🤖/g, '[A]').replace(/🧠/g, '[M]').replace(/🧩/g, '[+]').replace(/📦/g, '[P]').replace(/🔒/g, '[S]').replace(/👁️/g, '[V]').replace(/📊/g, '[R]').replace(/🔥/g, '[!]'); fs.writeFileSync(path, c, 'utf8');"

Write-Host "`n[v] All clear! Environment finalized." -ForegroundColor Green
Write-Host "[i] To start the platform, use: .\ctl.ps1 start" -ForegroundColor Cyan
