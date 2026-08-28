#!/bin/bash
# Verify esggo-auto-repair queue consumer health check
# Run: bash queue_healthcheck.sh
# 
# For cron jobs: Use health endpoint instead (see references/cron-tool-limitations.md)
#   curl -s https://esggo-auto-repair.dingjunhong1028.workers.dev/health | jq
#
# This script is for manual execution; cron jobs should use the health endpoint method.

set -euo pipefail

WORKER_NAME="esggo-auto-repair"
QUEUE_NAME="esggo-repair-queue"
DLQ_NAME="esggo-repair-dlq"
PROJ="/c/Project/esggo-learning-center/esggo-auto-repair/worker"

cd "$PROJ" || { echo "[queue-health] $(date '+%F %T') CD_FAIL: $PROJ"; exit 1; }

TS=$(date '+%Y-%m-%d %H:%M')

# Health endpoint fallback for quick status check (works in cron jobs)
HEALTH_URL="https://esggo-auto-repair.dingjunhong1028.workers.dev/health"

echo "[queue-health] $TS Checking via health endpoint..."
HEALTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$HEALTH_URL" 2>/dev/null || echo "000")

if [ "$HEALTH_RESPONSE" = "200" ]; then
  HEALTH_DATA=$(curl -s "$HEALTH_URL" 2>/dev/null || echo "{}")
  echo "[queue-health] $TS HEALTH_ENDPOINT OK"
  echo "$HEALTH_DATA" | jq -r 'to_entries[] | "\(.key)=\(.value)"' | while read line; do
    echo "[queue-health] $TS $line"
  done
  
  # Check for issues from health endpoint
  QUEUE_STATUS=$(echo "$HEALTH_DATA" | jq -r '.queue // false')
  PAT_STATUS=$(echo "$HEALTH_DATA" | jq -r '.patConfigured // false')
  WEBHOOK_STATUS=$(echo "$HEALTH_DATA" | jq -r '.webhookConfigured // false')
  
  if [ "$PAT_STATUS" = "false" ]; then
    echo "[queue-health] $TS WARN: REPAIR_PAT not configured - set via 'gh secret set REPAIR_PAT'"
  fi
  
  if [ "$WEBHOOK_STATUS" = "false" ]; then
    echo "[queue-health] $TS WARN: WEBHOOK_SECRET not configured - set via 'gh secret set WEBHOOK_SECRET'"
  fi
  
  exit 0
fi

# Fallback to wrangler commands (for manual execution)
echo "[queue-health] $TS Health endpoint unavailable, checking via wrangler..."

# Check queue consumer status
queue_info=$(npx wrangler queues info "$QUEUE_NAME" 2>&1)
rc=$?

if [ "$rc" -ne 0 ]; then
  echo "[queue-health] $TS FAIL rc=$rc - queue info error"
  echo "$queue_info" | tail -20
  exit 1
fi

# Parse consumer count
consumer_count=$(echo "$queue_info" | grep "Number of Consumers:" | awk '{print $NF}')

if [ "$consumer_count" -eq 0 ]; then
  echo "[queue-health] $TS FAIL consumer_count=0 - no consumer active"
  exit 1
fi

# Check DLQ status for messages (not consumers - DLQ should have 0 consumers)
dlq_info=$(npx wrangler queues info "$DLQ_NAME" 2>&1) || true
dlq_messages=$(echo "$dlq_info" | grep "Number of Messages:" | awk '{print $NF}' 2>/dev/null || echo "0")

if [ "${dlq_messages:-0}" -gt 0 ]; then
  echo "[queue-health] $TS WARN dlq_messages=$dlq_messages - check DLQ"
else
  echo "[queue-health] $TS OK consumer_count=$consumer_count dlq_messages=0"
fi

exit 0