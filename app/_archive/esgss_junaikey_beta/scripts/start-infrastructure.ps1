Write-Host "🚀 Starting ESGss Infrastructure (Redis + DB)..." -ForegroundColor Cyan

# Check if docker is running
docker info > $null 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
    exit 1
}

Write-Host "Starting Containers..."
docker-compose up -d redis esg-db

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Infrastructure is ONLINE." -ForegroundColor Green
    Write-Host "   - Redis: Port 6379"
    Write-Host "   - Postgres: Port 5432"
    Write-Host "`nYou can now run: npm run verify-all" -ForegroundColor Yellow
} else {
    Write-Host "❌ Failed to start Docker containers." -ForegroundColor Red
}
