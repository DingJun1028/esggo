# ESG GO - Gitclaw + OpenRouter Stable Launch Script

# 1. API Credentials
$env:OPENAI_API_KEY = "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"

# 2. Redirect to Local Proxy - Using 127.0.0.1 for maximum compatibility
$env:OPENAI_API_BASE = "http://127.0.0.1:3001/v1"
$env:OPENAI_BASE_URL = "http://127.0.0.1:3001/v1"

Write-Host ">>> 🌊 ESG GO x OpenRouter STABLE LAUNCH <<<" -ForegroundColor Cyan

# 3. Clean up Port 3001
Write-Host "[1/3] Cleaning up Port 3001..." -ForegroundColor Gray
Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }
Start-Sleep -Seconds 1

# 4. Start Proxy in a VISIBLE window
Write-Host "[2/3] Launching Proxy window..." -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-Command", "node gitclaw-proxy.js"

# 5. Wait for Proxy to be ready
Write-Host "Waiting for proxy to start..." -NoNewline
for ($i = 0; $i -lt 10; $i++) {
    $conn = Test-NetConnection -ComputerName 127.0.0.1 -Port 3001 -WarningAction SilentlyContinue
    if ($conn.TcpTestSucceeded) {
        Write-Host " OK" -ForegroundColor Green
        break
    }
    Write-Host "." -NoNewline
    Start-Sleep -Seconds 1
}

# 6. Start Gitclaw
Write-Host "[3/3] Launching Gitclaw..." -ForegroundColor Green
Write-Host "Please watch the Proxy window for traffic." -ForegroundColor Yellow
Write-Host ""

gitclaw --dir .
