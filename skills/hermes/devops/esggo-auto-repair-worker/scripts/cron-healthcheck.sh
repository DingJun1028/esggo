#!/bin/bash
# Cron-friendly Queue Healthcheck Script
# Designed for scheduled execution without subprocess limitations

WORKER_URL="https://esggo-auto-repair.dingjunhong1028.workers.dev"
HEALTH_ENDPOINT="${WORKER_URL}/health"
ROOT_ENDPOINT="${WORKER_URL}/"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=== esggo-auto-repair Queue Healthcheck ==="
echo "Timestamp: $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
echo ""

# Check root endpoint
echo "1. Checking worker root endpoint..."
ROOT_RESPONSE=$(curl -s --max-time 10 "${ROOT_ENDPOINT}" 2>/dev/null)
if [ "$ROOT_RESPONSE" = "esggo-auto-repair:ok" ]; then
    echo -e "   ${GREEN}✓ Worker responding${NC}"
    WORKER_RUNNING=true
else
    echo -e "   ${RED}✗ Worker not responding (got: $ROOT_RESPONSE)${NC}"
    WORKER_RUNNING=false
fi

# Check health endpoint
echo ""
echo "2. Checking health endpoint..."
HEALTH_RESPONSE=$(curl -s --max-time 10 "${HEALTH_ENDPOINT}" 2>/dev/null)
if [ -n "$HEALTH_RESPONSE" ]; then
    echo "   Response: $HEALTH_RESPONSE"
    
    # Parse JSON fields
    STATUS=$(echo "$HEALTH_RESPONSE" | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
    QUEUE=$(echo "$HEALTH_RESPONSE" | grep -o '"queue":[^,}]*' | cut -d':' -f2)
    WEBHOOK=$(echo "$HEALTH_RESPONSE" | grep -o '"webhookConfigured":[^,}]*' | cut -d':' -f2)
    PAT=$(echo "$HEALTH_RESPONSE" | grep -o '"patConfigured":[^,}]*' | cut -d':' -f2)
    
    # Report status
    if [ "$STATUS" = "ok" ]; then
        echo -e "   ${GREEN}✓ Worker status: ok${NC}"
    else
        echo -e "   ${RED}✗ Worker status: $STATUS${NC}"
    fi
    
    if [ "$QUEUE" = "true" ]; then
        echo -e "   ${GREEN}✓ Queue binding: exists${NC}"
    else
        echo -e "   ${RED}✗ Queue binding: missing${NC}"
    fi
    
    if [ "$WEBHOOK" = "true" ]; then
        echo -e "   ${GREEN}✓ Webhook secret: configured${NC}"
    else
        echo -e "   ${YELLOW}⚠ Webhook secret: NOT configured${NC}"
    fi
    
    if [ "$PAT" = "true" ]; then
        echo -e "   ${GREEN}✓ GitHub PAT: configured${NC}"
    else
        echo -e "   ${YELLOW}⚠ GitHub PAT: NOT configured${NC}"
    fi
else
    echo -e "   ${RED}✗ Health endpoint not accessible${NC}"
fi

echo ""
echo "=== Healthcheck Complete ==="

# Exit with appropriate code
if [ "$WORKER_RUNNING" = true ] && [ "$QUEUE" = "true" ]; then
    echo "Status: OK"
    exit 0
elif [ "$STATUS" = "ok" ]; then
    echo "Status: WARN - Worker running but secrets missing"
    exit 1
else
    echo "Status: FAIL - Worker not running"
    exit 2
fi