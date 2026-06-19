# deploy-backend-cloudrun.ps1
# Backend Deployment Script for ESGss JunAiKey Beta
# Target: esg-sunshine (Artifact Registry)

$ProjectId = "esg-sunshine"
$Region = "asia-east1"
$ServiceName = "esg-backend-service"
$RepoName = "esg-apps"
$RegistryHost = "asia-east1-docker.pkg.dev"

# Ensure gcloud is in PATH
$env:Path += ";$env:LOCALAPPDATA\Google\Cloud SDK\google-cloud-sdk\bin;C:\Program Files (x86)\Google\Cloud SDK\google-cloud-sdk\bin"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Backend Deployment (Node.js)          " -ForegroundColor Cyan
Write-Host "  Target: $ProjectId (Artifact Registry)" -ForegroundColor Cyan
Write-Host "========================================"
Write-Host ""

# 1. Check GCP Auth
Write-Host "[1/7] Checking GCP Auth..." -ForegroundColor Yellow
$authAccount = gcloud auth list --filter=status:ACTIVE --format="value(account)"
if (-not $authAccount) {
    Write-Host "❌ Not logged in. Please run: gcloud auth login" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Authenticated: $authAccount" -ForegroundColor Green

# 2. Set Project
Write-Host "[2/7] Setting Project..." -ForegroundColor Yellow
gcloud config set project $ProjectId

# 3. Enable APIs (Assume enabled by frontend script, but good to ensure)
# gcloud services enable run.googleapis.com artifactregistry.googleapis.com

# 4. Get Git Commit Hash
Write-Host "[4/7] Getting Git commit hash..." -ForegroundColor Yellow
$gitCommit = (& git.exe rev-parse --short HEAD 2>$null)
if ($LASTEXITCODE -ne 0 -or -not $gitCommit) {
    $gitCommit = (Get-Date -Format "yyyyMMddHHmmss")
    Write-Host "-> Could not get Git commit. Using timestamp: $gitCommit" -ForegroundColor Yellow
} else {
    $gitCommit = $gitCommit.Trim()
    Write-Host "✓ Git commit: $gitCommit" -ForegroundColor Green
}

# 5. Build Docker Image (Backend)
Write-Host "[5/7] Building Backend Docker Image..." -ForegroundColor Yellow
$imageTag = "$RegistryHost/$ProjectId/$RepoName/${ServiceName}:${gitCommit}"
$latestTag = "$RegistryHost/$ProjectId/$RepoName/${ServiceName}:latest"

Write-Host "  Using Dockerfile.backend context: ."
docker build -f Dockerfile.backend -t $imageTag -t $latestTag .
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker Build Failed" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Backend Build Success" -ForegroundColor Green

# 6. Push to Artifact Registry
Write-Host "[6/7] Pushing to Artifact Registry..." -ForegroundColor Yellow
docker push $imageTag
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker Push Failed" -ForegroundColor Red
    exit 1
}
docker push $latestTag
Write-Host "✓ Push Success" -ForegroundColor Green

# 7. Deploy to Cloud Run
Write-Host "[7/7] Deploying Backend to Cloud Run..." -ForegroundColor Yellow
# Note: Backend often needs env vars (DB, API Keys). 
# This script assumes they are set in Cloud Run revision or via Secret Manager.
# We deploy with --allow-unauthenticated for ease of access (API)
gcloud run deploy $ServiceName `
    --image=$imageTag `
    --region=$Region `
    --platform=managed `
    --allow-unauthenticated `
    --memory=512Mi `
    --cpu=1 `
    --min-instances=0 `
    --max-instances=3 `
    --port=3001 `
    --labels="env=production,type=backend,version=${gitCommit}"

if ($LASTEXITCODE -eq 0) {
    $ServiceUrl = gcloud run services describe $ServiceName --region=$Region --format='value(status.url)'
    Write-Host ""
    Write-Host "🎉 BACKEND DEPLOYMENT SUCCESS!" -ForegroundColor Green
    Write-Host "Service URL: $ServiceUrl" -ForegroundColor Cyan
    Write-Host "API Health: $ServiceUrl/api/health"
} else {
    Write-Host "❌ Deployment Failed" -ForegroundColor Red
    exit 1
}
