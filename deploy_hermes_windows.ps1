# OmniAgent Gateway v3.0 Deployment Script for Windows
# Origin: OmniAgent (Open Source) → ESGGO OmniAgent (ESG Specialized)

param(
    [string]$Port = "8642",
    [string]$GatewayApiKey = "omniagent_gold_2026"
)

Write-Host "=== [萬能網關] OmniAgent Gateway v3.0 部署 (Windows) ===" -ForegroundColor Cyan

# 1. Check Node.js
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Node.js not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# 2. Install Node.js dependencies
Write-Host "Installing Node.js gateway dependencies..." -ForegroundColor Yellow
npm install express cors helmet express-rate-limit ws @google/generative-ai --prefix $PWD

# 3. Configure environment
$env:PORT = $Port
$env:GATEWAY_API_KEY = $GatewayApiKey

if ([string]::IsNullOrEmpty($env:OPENROUTER_API_KEY)) {
    Write-Host "Please set OPENROUTER_API_KEY environment variable." -ForegroundColor Yellow
    $env:OPENROUTER_API_KEY = Read-Host "Enter OpenRouter API key"
}

# Create .env file
$envFile = Join-Path $PWD ".env"
@"
PORT=$Port
GATEWAY_API_KEY=$GatewayApiKey
OPENROUTER_API_KEY=$env:OPENROUTER_API_KEY
NODE_ENV=production
"@ | Out-File -FilePath $envFile -Encoding UTF8

# 4. Start the gateway
Write-Host "=== 部署完成 ===" -ForegroundColor Green
Write-Host " Gateway URL: http://localhost:$Port/health" -ForegroundColor Cyan
Write-Host " Health Check: http://localhost:$Port/health" -ForegroundColor Cyan
Write-Host ""
Write-Host "按 Ctrl+C 停止服務" -ForegroundColor Yellow

node apps/gateway/omni-server.mjs