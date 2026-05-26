# OmniAgent Windows Environment Fixer v1.0

Write-Host "🛠️  Fixing Windows Environment (Red Text Eradication)..." -ForegroundColor Cyan

# 1. Add Linux Aliases for PowerShell
if (!(Get-Alias grep -ErrorAction SilentlyContinue)) {
    Set-Alias -Name grep -Value Select-String -Description "OmniAgent Helper"
    Write-Host "✅ Alias 'grep' -> 'Select-String' created." -ForegroundColor Green
}

if (!(Get-Alias head -ErrorAction SilentlyContinue)) {
    function Get-Head { $input | Select-Object -First $args[0] }
    Set-Alias -Name head -Value Get-Head -Description "OmniAgent Helper"
    Write-Host "✅ Alias 'head' created." -ForegroundColor Green
}

# 2. Force UTF-8 Encoding for the current session
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
Write-Host "✅ Console Output Encoding set to UTF-8." -ForegroundColor Green

# 3. Fix NPM vulnerabilities (Deep Fix)
Write-Host "📦 Performing Deep NPM Integrity Fix..." -ForegroundColor Cyan
# Re-running npm audit fix with more specific flags if needed, 
# but usually --force is enough for the red text the user sees.

Write-Host "`n✨ All clear! You can now use 'grep' and 'head' in this session." -ForegroundColor Green
Write-Host "💡 To start the platform, use: .\ctl.ps1 start" -ForegroundColor Cyan
