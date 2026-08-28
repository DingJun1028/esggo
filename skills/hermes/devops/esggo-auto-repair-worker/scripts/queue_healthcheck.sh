#!/bin/bash
# Verify esggo-auto-repair queue consumer health check
# Run: bash queue_healthcheck.sh
set -euo pipefail

WORKER_NAME="esggo-auto-repair"
QUEUE_NAME="esggo-repair-queue"
DLQ_NAME="esggo-repair-dlq"
PROJ="/c/Project/esggo-learning-center/esggo-auto-repair/worker"

cd "$PROJ" || { echo "[queue-health] $(date '+%F %T') CD_FAIL: $PROJ"; exit 1; }

TS=$(date '+%Y-%m-%d %H:%M')

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

# ============================================================================
# WINDOWS POWERSHELL ALTERNATIVE (for cron jobs where bash is unavailable)
# ============================================================================
# Run in PowerShell:
# cd "C:\Project\esggo-learning-center\esggo-auto-repair\worker"
# $TS = Get-Date -Format "yyyy-MM-dd HH:mm"
# $QueueInfo = npx wrangler queues info esggo-repair-queue 2>&1
# Write-Host "[queue-health] $TS - Checking queue status..."
#
# Or use health endpoint (recommended for cron jobs):
# curl.exe -s https://esggo-auto-repair.dingjunhong1028.workers.dev/health | ConvertFrom-Json | Format-List