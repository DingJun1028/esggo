# deploy_v2.ps1

$ProjectId = "junaikey-genesis"
$Region = "asia-east1"
$ServiceName = "esg-dashboard"
$ServiceAccountName = "esg-dashboard-runner"
$ImageName = "gcr.io/$ProjectId/$ServiceName" + ":latest"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Google Cloud Run Deploy (v2)" -ForegroundColor Cyan
Write-Host "========================================"
Write-Host ""

# 1. Check GCP Auth
Write-Host "[1/7] Checking Auth..." -ForegroundColor Yellow
$authAccount = gcloud auth list --filter=status:ACTIVE --format="value(account)"
if (-not $authAccount) {
    Write-Host "❌ Not logged in. Run: gcloud auth login" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Authenticated: $authAccount" -ForegroundColor Green

# 2. Set Project
Write-Host "[2/7] Setting Project..." -ForegroundColor Yellow
gcloud config set project $ProjectId
Write-Host "✓ Project set: $ProjectId" -ForegroundColor Green

# 3. Enable APIs
Write-Host "[3/7] Enabling APIs..." -ForegroundColor Yellow
gcloud services enable run.googleapis.com cloudbuild.googleapis.com containerregistry.googleapis.com
Write-Host "✓ APIs enabled" -ForegroundColor Green

# 4. Configure Service Account
Write-Host "[4/7] Checking Service Account..." -ForegroundColor Yellow
$saEmail = "$ServiceAccountName@$ProjectId.iam.gserviceaccount.com"
gcloud iam service-accounts describe $saEmail --project $ProjectId 2>&1 | Out-Null
$saExists = $LASTEXITCODE -eq 0

if (-not $saExists) {
    Write-Host "  Creating Service Account..."
    gcloud iam service-accounts create $ServiceAccountName --display-name="Service Account for $ServiceName"
    
    Write-Host "  Adding permissions..."
    gcloud projects add-iam-policy-binding $ProjectId --member="serviceAccount:$saEmail" --role="roles/run.invoker"
    Write-Host "✓ Service Account Created" -ForegroundColor Green
}
if ($saExists) {
    Write-Host "✓ Service Account Exists" -ForegroundColor Green
}

# 5. Build & Push via Cloud Build (since local Docker is unavailable)
Write-Host "[5/7] Building & Pushing via Cloud Build..." -ForegroundColor Yellow
gcloud builds submit --config cloudbuild-build.yaml --substitutions="_IMAGE_NAME=$ImageName" .
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Cloud Build failed" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Cloud Build successful" -ForegroundColor Green

# Skip explicit Push step as Cloud Build does it
# 6. Push to GCR (Skipped)
Write-Host "[6/7] Push step handled by Cloud Build." -ForegroundColor Green


# 7. Deploy
Write-Host "[7/7] Deploying to Cloud Run..." -ForegroundColor Yellow
gcloud run deploy $ServiceName `
    --image=$ImageName `
    --region=$Region `
    --platform=managed `
    --allow-unauthenticated `
    --service-account=$saEmail `
    --memory=1Gi `
    --cpu=1 `
    --min-instances=1 `
    --max-instances=10

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "🎉 Deployment Successful!" -ForegroundColor Green
}
else {
    Write-Host "❌ Deployment Failed" -ForegroundColor Red
    exit 1
}
