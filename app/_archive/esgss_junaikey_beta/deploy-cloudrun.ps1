# deploy-cloudrun.ps1
# 台灣地區優化版本 - Optimized for Taiwan Region
# 最佳實踐：使用 asia-east1（台灣彰化）提供最低延遲

$ProjectId = "esg-sunshine"
$Region = "asia-east1"
$ServiceName = "esg-dashboard-service" # Updated to match user's preferred service name
$RepoName = "esg-apps"
$RegistryHost = "asia-east1-docker.pkg.dev"

# Ensure gcloud is in PATH
$env:Path += ";$env:LOCALAPPDATA\Google\Cloud SDK\google-cloud-sdk\bin;C:\Program Files (x86)\Google\Cloud SDK\google-cloud-sdk\bin"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Google Cloud Run Deployment (v6)      " -ForegroundColor Cyan
Write-Host "  Target: $ProjectId (Artifact Registry)" -ForegroundColor Cyan
Write-Host "========================================"
Write-Host ""

# 1. Check GCP Auth
Write-Host "[1/8] Checking GCP Auth..." -ForegroundColor Yellow
$authAccount = gcloud auth list --filter=status:ACTIVE --format="value(account)"
if (-not $authAccount) {
    Write-Host "❌ Not logged in. Please run: gcloud auth login" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Authenticated: $authAccount" -ForegroundColor Green
Write-Host ""

# 2. Set Project
Write-Host "[2/8] Setting Project..." -ForegroundColor Yellow
gcloud config set project $ProjectId
Write-Host "✓ Project set: $ProjectId" -ForegroundColor Green
Write-Host ""

# 3. Enable APIs
Write-Host "[3/8] Enabling APIs..." -ForegroundColor Yellow
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com
Write-Host "✓ APIs enabled" -ForegroundColor Green
Write-Host ""

# 3.1 Ensure Artifact Registry Repository Exists
Write-Host "[3.1/8] Checking Artifact Registry..." -ForegroundColor Yellow
$repoCheck = gcloud artifacts repositories describe $RepoName --location=$Region --format="value(name)" 2>$null
if (-not $repoCheck) {
    Write-Host "  Creating repository '$RepoName'..."
    gcloud artifacts repositories create $RepoName --repository-format=docker --location=$Region --description="ESG Apps Repository"
    Write-Host "✓ Repository created" -ForegroundColor Green
} else {
    Write-Host "✓ Repository exists" -ForegroundColor Green
}
Write-Host ""

# 4. Configure Service Account (Optional for now, user might be Owner)
# Skipping strictly for speed unless needed, using default compute service account if not specified, 
# but user script had --service-account. We'll simplify to allow-unauthenticated first.

# 5. Get Git Commit Hash
Write-Host "[5/8] Getting Git commit hash..." -ForegroundColor Yellow
$gitCommit = (& git.exe rev-parse --short HEAD 2>$null)
if ($LASTEXITCODE -ne 0 -or -not $gitCommit) {
    $gitCommit = (Get-Date -Format "yyyyMMddHHmmss")
    Write-Host "-> Could not get Git commit. Using timestamp: $gitCommit" -ForegroundColor Yellow
} else {
    $gitCommit = $gitCommit.Trim()
    Write-Host "✓ Git commit: $gitCommit" -ForegroundColor Green
}
Write-Host ""

# 6. Build Docker Image
Write-Host "[6/8] Building Docker Image..." -ForegroundColor Yellow
$imageTag = "$RegistryHost/$ProjectId/$RepoName/${ServiceName}:${gitCommit}"
$latestTag = "$RegistryHost/$ProjectId/$RepoName/${ServiceName}:latest"

Write-Host "  Configuring Docker Auth for $RegistryHost..."
gcloud auth configure-docker $RegistryHost --quiet

docker build -f Dockerfile -t $imageTag -t $latestTag .
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker Build Failed" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Docker Build Success" -ForegroundColor Green
Write-Host ""

# 7. Push to Artifact Registry
Write-Host "[7/8] Pushing to Artifact Registry..." -ForegroundColor Yellow
docker push $imageTag
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker Push Failed ($imageTag)" -ForegroundColor Red
    exit 1
}
docker push $latestTag
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker Push Failed ($latestTag)" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Docker Push Success" -ForegroundColor Green
Write-Host ""

# 8. Deploy to Cloud Run（台灣地區 - 成本優化配置）
Write-Host "[8/8] Deploying to Cloud Run (Taiwan Region)..." -ForegroundColor Yellow
gcloud run deploy $ServiceName `
    --image=$imageTag `
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
    --labels="env=production,region=taiwan,managed-by=bilateral-integration,version=${gitCommit}"

$deployResult = $LASTEXITCODE

if ($deployResult -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "         🎉 DEPLOYMENT SUCCESS!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    
    $ServiceUrl = gcloud run services describe $ServiceName --region=$Region --format='value(status.url)'
    Write-Host "Service URL: $ServiceUrl" -ForegroundColor Cyan
    
    Write-Host "Testing Health..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
    try {
        $response = Invoke-WebRequest -Uri "$ServiceUrl/health" -UseBasicParsing -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "✓ Health Check Passed" -ForegroundColor Green
        }
    } catch {
        Write-Host "⚠ Health Check failed or still initiating (Check logs)" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ Deployment Failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Logs: gcloud run services logs tail $ServiceName --region=$Region" -ForegroundColor Cyan