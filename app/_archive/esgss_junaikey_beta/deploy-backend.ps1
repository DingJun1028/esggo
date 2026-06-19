# Deploy Backend to Cloud Run via Cloud Build
$Project = "junaikey-genesis"
$Region = "asia-east1"

Write-Host "🚀 Starting Backend Deployment..." -ForegroundColor Green

# 1. Submit Build
Write-Host "📦 Submitting Cloud Build for Backend..." -ForegroundColor Yellow
gcloud builds submit --config cloudbuild-backend.yaml .

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Backend Build & Deploy Submitted Successfully!" -ForegroundColor Green
    Write-Host "   Service URL will be available in Cloud Run console."
}
else {
    Write-Host "❌ Build Failed" -ForegroundColor Red
}
