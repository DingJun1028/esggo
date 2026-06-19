# deploy-cloudrun-cloudbuild.ps1

$ProjectId = "junaikey-genesis"
$Region = "asia-east1"
$ServiceName = "esg-dashboard"
$ServiceAccountName = "$ServiceName-runner"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Cloud Run 部署腳本 (Cloud Build 版)" -ForegroundColor Cyan
Write-Host "========================================"
Write-Host ""

# 1. Check GCP Auth
Write-Host "[1/6] 檢查 GCP 認證..." -ForegroundColor Yellow
$authAccount = gcloud auth list --filter=status:ACTIVE --format="value(account)"
if (-not $authAccount) {
    Write-Host "❌ 未登入 GCP，請先執行: gcloud auth login" -ForegroundColor Red
    exit 1
}
Write-Host "✓ 已認證: $authAccount" -ForegroundColor Green
Write-Host ""

# 2. Set Project
Write-Host "[2/6] 設置 GCP 項目..." -ForegroundColor Yellow
gcloud config set project $ProjectId
Write-Host "✓ 項目已設置: $ProjectId" -ForegroundColor Green
Write-Host ""

# 3. Enable APIs
Write-Host "[3/6] 啟用必要的 GCP API..." -ForegroundColor Yellow
gcloud services enable run.googleapis.com cloudbuild.googleapis.com containerregistry.googleapis.com secretmanager.googleapis.com cloudresourcemanager.googleapis.com
Write-Host "✓ API 已啟用" -ForegroundColor Green
Write-Host ""

# 4. Configure Service Account
Write-Host "[4/6] 配置 Service Account..." -ForegroundColor Yellow
$saEmail = "$ServiceAccountName@$ProjectId.iam.gserviceaccount.com"
gcloud iam service-accounts describe $saEmail --project $ProjectId 2>&1 | Out-Null
$saExists = ($LASTEXITCODE -eq 0)

if (-not $saExists) {
    Write-Host "  創建新的 Service Account..."
    gcloud iam service-accounts create $ServiceAccountName --display-name="Service Account for $ServiceName" --description="Managed service account for ESG Dashboard Cloud Run service"
    
    Write-Host "  賦予權限..."
    gcloud projects add-iam-policy-binding $ProjectId --member="serviceAccount:$saEmail" --role="roles/run.invoker"
    Write-Host "✓ Service Account 已創建" -ForegroundColor Green
}
if ($saExists) {
    Write-Host "✓ Service Account 已存在" -ForegroundColor Green
}
Write-Host ""

# 5. Build and Push via Cloud Build
Write-Host "[5/6] 使用 Cloud Build 構建 Image..." -ForegroundColor Yellow
gcloud builds submit --tag "gcr.io/$ProjectId/$ServiceName:latest" .
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Cloud Build 構建失敗" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Cloud Build 構建成功" -ForegroundColor Green
Write-Host ""

# 6. Deploy to Cloud Run
Write-Host "[6/6] 部署到 Cloud Run..." -ForegroundColor Yellow
gcloud run deploy $ServiceName `
    --image="gcr.io/$ProjectId/${ServiceName}:latest" `
    --region=$Region `
    --platform=managed `
    --allow-unauthenticated `
    --service-account=$saEmail `
    --memory=1Gi `
    --cpu=1 `
    --concurrency=80 `
    --timeout=30s `
    --min-instances=1 `
    --max-instances=10 `
    --labels=env=production,managed-by=cloudbuild-deploy

$deployResult = $LASTEXITCODE

if ($deployResult -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "         🎉 部署成功！" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    
    $ServiceUrl = gcloud run services describe $ServiceName --region=$Region --format='value(status.url)'
    Write-Host "服務 URL: $ServiceUrl" -ForegroundColor Cyan
    
    Write-Host "測試健康檢查..." -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri "$ServiceUrl/health" -UseBasicParsing -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "✓ 健康檢查通過" -ForegroundColor Green
        }
    } catch {
        Write-Host "⚠ 健康檢查失敗或等待啟動中，請檢查服務日誌" -ForegroundColor Yellow
        Write-Host "  (服務可能需要幾秒鐘才能完全啟動)" -ForegroundColor Yellow
    }
}

if ($deployResult -ne 0) {
    Write-Host "❌ 部署失敗" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "查看日誌: gcloud run services logs tail $ServiceName --region=$Region" -ForegroundColor Cyan
