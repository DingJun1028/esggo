#!/bin/bash
# Multi-Alpha ESG GO: Non-Interactive Deployment Script
# Usage: ./deploy.sh [PROJECT_ID] [REGION]

PROJECT_ID=$1
REGION=${2:-us-central1}
SERVICE_NAME="esggo-alpha"

if [ -z "$PROJECT_ID" ]; then
  echo "Error: PROJECT_ID is required."
  exit 1
fi

echo "🚀 Deploying $SERVICE_NAME to $PROJECT_ID in $REGION..."

# Setup environment for non-interactive GCP commands
gcloud config set project "$PROJECT_ID"

# Build and Push container (Simplified for demo purposes)
# In production, this would use Cloud Build or Docker push
# gcloud builds submit --tag gcr.io/$PROJECT_ID/$SERVICE_NAME .

# Deploy to Cloud Run without prompts
gcloud run deploy "$SERVICE_NAME" \
  --image "gcr.io/cloudrun/hello" \
  --platform managed \
  --region "$REGION" \
  --allow-unauthenticated \
  --set-env-vars="DEPLOYMENT_MODE=multi-tenant,TRUST_PROTOCOL=5T,ZKP_ENABLED=true" \
  --quiet

echo "✅ Deployment complete!"
