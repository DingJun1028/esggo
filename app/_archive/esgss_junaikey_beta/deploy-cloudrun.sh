#!/bin/bash

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置變數
PROJECT_ID="junaikey-genesis"
REGION="asia-east1"
SERVICE_NAME="esg-dashboard"
SERVICE_ACCOUNT_NAME="${SERVICE_NAME}-runner"
MIN_INSTANCES=1
MAX_INSTANCES=10

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Google Cloud Run 生產級部署腳本${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# 檢查是否已登入 GCP
echo -e "${YELLOW}[1/7]${NC} 檢查 GCP 認證..."
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo -e "${RED}❌ 未登入 GCP，請先執行: gcloud auth login${NC}"
    exit 1
fi
echo -e "${GREEN}✓ 已認證${NC}"
echo ""

# 設置項目
echo -e "${YELLOW}[2/7]${NC} 設置 GCP 項目..."
gcloud config set project $PROJECT_ID
echo -e "${GREEN}✓ 項目已設置: $PROJECT_ID${NC}"
echo ""

# 啟用必要的 API
echo -e "${YELLOW}[3/7]${NC} 啟用必要的 GCP API..."
gcloud services enable \
    run.googleapis.com \
    cloudbuild.googleapis.com \
    containerregistry.googleapis.com \
    secretmanager.googleapis.com \
    cloudresourcemanager.googleapis.com
echo -e "${GREEN}✓ API 已啟用${NC}"
echo ""

# 創建 Service Account（如果不存在）
echo -e "${YELLOW}[4/7]${NC} 配置 Service Account..."
if ! gcloud iam service-accounts describe ${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com &>/dev/null; then
    echo "  創建新的 Service Account..."
    gcloud iam service-accounts create ${SERVICE_ACCOUNT_NAME} \
        --display-name="Service Account for ${SERVICE_NAME}" \
        --description="Managed service account for ESG Dashboard Cloud Run service"
    
    # 賦予最小權限
    echo "  賦予權限..."
    gcloud projects add-iam-policy-binding $PROJECT_ID \
        --member="serviceAccount:${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com" \
        --role="roles/run.invoker"
    
    echo -e "${GREEN}✓ Service Account 已創建${NC}"
else
    echo -e "${GREEN}✓ Service Account 已存在${NC}"
fi
echo ""

# 構建 Docker Image
echo -e "${YELLOW}[5/7]${NC} 構建 Docker Image..."
docker build -f Dockerfile.cloudrun -t gcr.io/${PROJECT_ID}/${SERVICE_NAME}:latest .
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Docker Image 構建成功${NC}"
else
    echo -e "${RED}❌ Docker Image 構建失敗${NC}"
    exit 1
fi
echo ""

# 推送到 GCR
echo -e "${YELLOW}[6/7]${NC} 推送 Docker Image 到 Container Registry..."
docker push gcr.io/${PROJECT_ID}/${SERVICE_NAME}:latest
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Image 推送成功${NC}"
else
    echo -e "${RED}❌ Image 推送失敗${NC}"
    exit 1
fi
echo ""

# 部署到 Cloud Run
echo -e "${YELLOW}[7/7]${NC} 部署到 Cloud Run..."
gcloud run deploy ${SERVICE_NAME} \
    --image=gcr.io/${PROJECT_ID}/${SERVICE_NAME}:latest \
    --region=${REGION} \
    --platform=managed \
    --allow-unauthenticated \
    --service-account=${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com \
    --memory=1Gi \
    --cpu=1 \
    --concurrency=80 \
    --timeout=30s \
    --min-instances=${MIN_INSTANCES} \
    --max-instances=${MAX_INSTANCES} \
    --labels=env=production,managed-by=manual-deploy

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}         🎉 部署成功！${NC}"
    echo -e "${GREEN}========================================${NC}"
    
    # 獲取服務 URL
    SERVICE_URL=$(gcloud run services describe ${SERVICE_NAME} --region=${REGION} --format='value(status.url)')
    echo -e "${BLUE}服務 URL:${NC} ${SERVICE_URL}"
    
    # 測試健康檢查
    echo -e "${YELLOW}測試健康檢查...${NC}"
    if curl -f -s ${SERVICE_URL}/health > /dev/null; then
        echo -e "${GREEN}✓ 健康檢查通過${NC}"
    else
        echo -e "${YELLOW}⚠ 健康檢查失敗，請檢查服務日誌${NC}"
    fi
else
    echo -e "${RED}❌ 部署失敗${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}查看日誌:${NC} gcloud run services logs tail ${SERVICE_NAME} --region=${REGION}"
echo -e "${BLUE}查看監控:${NC} https://console.cloud.google.com/run/detail/${REGION}/${SERVICE_NAME}/metrics?project=${PROJECT_ID}"
