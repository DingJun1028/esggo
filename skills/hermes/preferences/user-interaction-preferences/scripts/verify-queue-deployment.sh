#!/bin/bash
# verify-queue-deployment.sh - Verify Cloudflare Workers Queue deployment

set -e

WORKER_NAME="${1:-esggo-auto-repair}"
QUEUE_NAME="${2:-esggo-repair-queue}"
REPO_OWNER="${3:-DingJun1028}"
REPO_NAME="${4:-esggo-auto-repair}"

echo "=== Verifying Queue Deployment for $WORKER_NAME ==="

# Check worker deployment
echo ""
echo "1. Checking worker deployment..."
DEPLOY_STATUS=$(npx wrangler whoami 2>/dev/null | grep -o "Logged in to" || echo "not logged in")
if [ "$DEPLOY_STATUS" = "not logged in" ]; then
    echo "❌ Not logged in to wrangler"
    exit 1
fi
echo "✅ Wrangler authenticated"

# Check queue status
echo ""
echo "2. Checking queue status..."
QUEUE_INFO=$(npx wrangler queues info "$QUEUE_NAME" 2>/dev/null || echo "not found")
if echo "$QUEUE_INFO" | grep -q "Number of Producers: 1"; then
    echo "✅ Producer bound"
else
    echo "❌ Producer not bound"
fi

if echo "$QUEUE_INFO" | grep -q "Number of Consumers: 1"; then
    echo "✅ Consumer bound"
else
    echo "❌ Consumer not bound"
fi

# Check secrets
echo ""
echo "3. Checking secrets..."
SECRET_LIST=$(gh secret list -R "$REPO_OWNER/$REPO_NAME" 2>/dev/null || echo "")
if echo "$SECRET_LIST" | grep -q "REPAIR_PAT"; then
    echo "✅ REPAIR_PAT set"
else
    echo "❌ REPAIR_PAT missing"
fi

if echo "$SECRET_LIST" | grep -q "WEBHOOK_SECRET"; then
    echo "✅ WEBHOOK_SECRET set"
else
    echo "❌ WEBHOOK_SECRET missing"
fi

# Health check
echo ""
echo "4. Health check..."
HEALTH_URL="https://$WORKER_NAME.$REPO_OWNER.workers.dev/health"
HEALTH_RESPONSE=$(curl -s "$HEALTH_URL" 2>/dev/null || echo '{"status":"error"}')
if echo "$HEALTH_RESPONSE" | grep -q '"status":"ok"'; then
    echo "✅ Health check passed"
    echo "   Response: $HEALTH_RESPONSE"
else
    echo "❌ Health check failed"
    echo "   Response: $HEALTH_RESPONSE"
fi

echo ""
echo "=== Verification Complete ==="