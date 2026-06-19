# deploy-cloud-build-bypass.ps1
# Bypasses local Docker build by using Cloud Build
# Optimized for Taiwan Region (asia-east1)

$ProjectId = "esg-sunshine"
$Region = "asia-east1"
$ServiceName = "esg-dashboard-service"
$RepoName = "esg-apps"
$RegistryHost = "asia-east1-docker.pkg.dev"

# Ensure gcloud is in PATH
$env:Path += ";$env:LOCALAPPDATA\Google\Cloud SDK\google-cloud-sdk\bin;C:\Program Files (x86)\Google\Cloud SDK\google-cloud-sdk\bin"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Cloud Build Bypass Deployment         " -ForegroundColor Cyan
Write-Host "  Target: $ProjectId (Cloud Build)      " -ForegroundColor Cyan
Write-Host "========================================"
Write-Host ""

# 1. Set Project
Write-Host "[1/4] Setting Project..." -ForegroundColor Yellow
gcloud config set project $ProjectId
Write-Host "✓ Project set: $ProjectId" -ForegroundColor Green
Write-Host ""

# 2. Get Commit Hash
$gitCommit = (& git.exe rev-parse --short HEAD 2>$null)
if (-not $gitCommit) { $gitCommit = (Get-Date -Format "yyyyMMddHHmmss") }
$gitCommit = $gitCommit.Trim()
$imageTag = "$RegistryHost/$ProjectId/$RepoName/${ServiceName}:${gitCommit}"
$latestTag = "$RegistryHost/$ProjectId/$RepoName/${ServiceName}:latest"

Write-Host "Target Image: $imageTag" -ForegroundColor Cyan
Write-Host ""

# 3. Submit Build to Cloud Build
Write-Host "[2/4] Submitting Build to Cloud Build..." -ForegroundColor Yellow
# We tag with both specific version and latest
gcloud builds submit --tag $latestTag --project $ProjectId
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Cloud Build Failed" -ForegroundColor Red
    exit 1
}
# We can't easily push multiple tags with one build submit unless we use a config, 
# but deploying 'latest' is sufficient for now. 
# Ideally we'd use a cloudbuild.yaml but avoiding complex config for now to reduce failure surface.
Write-Host "✓ Cloud Build Success" -ForegroundColor Green
Write-Host ""

# 4. Deploy to Cloud Run
Write-Host "[3/4] Deploying to Cloud Run..." -ForegroundColor Yellow
gcloud run deploy $ServiceName `
    --image=$latestTag `
    --region=$Region `
    --platform=managed `
    --allow-unauthenticated `
    --memory=512Mi `
    --cpu=1 `
    --concurrency=80 `
    --timeout=30s `
    --min-instances=0 `
    --max-instances=5 `
    --cpu-throttling `
    --labels="env=production,region=taiwan,managed-by=cloud-build-bypass,version=${gitCommit}"

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "         🎉 DEPLOYMENT SUCCESS!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    
    $ServiceUrl = gcloud run services describe $ServiceName --region=$Region --format='value(status.url)'
    Write-Host "Service URL: $ServiceUrl" -ForegroundColor Cyan
} else {
    Write-Host "❌ Deployment Failed" -ForegroundColor Red
    exit 1
}
