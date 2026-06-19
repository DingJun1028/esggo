$npmPath = "C:\Program Files\nodejs\npm.cmd"
$npxPath = "C:\Program Files\nodejs\npx.cmd"

Write-Host "🚀 Starting Validation Protocols..." -ForegroundColor Cyan

# 1. Check Node
& "C:\Program Files\nodejs\node.exe" -v

# 1.2 Ensure Dependencies
Write-Host "📦 Verifying Dependencies..." -ForegroundColor Cyan
& $npmPath install

# 1.5 Install Browsers
Write-Host "🌍 Checking Browser Binaries..." -ForegroundColor Cyan
& $npxPath playwright install chromium

# 2. Run Tests
Write-Host "🧪 Executing 24-Service Smoke Test..." -ForegroundColor Yellow
& $npxPath playwright test e2e/smoke-services.spec.ts --project=chromium

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ All Systems Operational." -ForegroundColor Green
}
else {
    Write-Host "❌ Validation Failed." -ForegroundColor Red
}
