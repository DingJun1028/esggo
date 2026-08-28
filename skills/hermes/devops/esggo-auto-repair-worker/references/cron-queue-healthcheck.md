# Cron Job Queue Healthcheck - Troubleshooting Guide

## Problem: Script Execution Blocked in Cron Jobs

When running as a scheduled cron job, certain tools are blocked:
- `execute_code`: Blocks subprocess calls
- `read_terminal`: Only available in Hermes desktop app

## Solution: Multi-Method Approach

### Method 1: Health Endpoint (Recommended for Cron)
```bash
HEALTH=$(curl -s https://esggo-auto-repair.dingjunhong1028.workers.dev/health)
echo "$HEALTH" | jq '.'

# Parse critical fields
STATUS=$(echo "$HEALTH" | jq -r '.status')
QUEUE=$(echo "$HEALTH" | jq -r '.queue')
WEBHOOK=$(echo "$HEALTH" | jq -r '.webhookConfigured')
PAT=$(echo "$HEALTH" | jq -r '.patConfigured')

# Alert if issues
[ "$WEBHOOK" = "false" ] && echo "ALERT: WEBHOOK_SECRET not configured"
[ "$PAT" = "false" ] && echo "ALERT: REPAIR_PAT not configured"
```

### Method 2: Wrangler Commands (Direct Shell)
```bash
# Run from worker directory
cd /c/Project/esggo-learning-center/esggo-auto-repair/worker
bash ../../../scripts/queue_healthcheck.sh
```

### Method 3: Cloudflare API (When Wrangler Unavailable)
```bash
ACCOUNT_ID="dingjunhong1028"
API_TOKEN="$CF_API_TOKEN"

# Get queue info
curl -s "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/workers/queues/esggo-repair-queue" \
  -H "Authorization: Bearer $API_TOKEN" | jq '.result | {name, consumers_total_count, producers_total_count}'

# Get DLQ info
curl -s "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/workers/queues/esggo-repair-dlq" \
  -H "Authorization: Bearer $API_TOKEN" | jq '.result | {name, consumers_total_count}'
```

## Queue Healthcheck Script Content

```bash
#!/bin/bash
# Queue Healthcheck Script for esggo-auto-repair Worker

echo "=== esggo-auto-repair Queue Healthcheck ==="
echo ""

# Check queue status
echo "Checking esggo-repair-queue..."
npx wrangler queues info esggo-repair-queue 2>&1 || echo "ERROR: Failed to get queue info"

echo ""
echo "Checking esggo-repair-dlq..."
npx wrangler queues info esggo-repair-dlq 2>&1 || echo "ERROR: Failed to get DLQ info"

echo ""
echo "Checking consumer status..."
npx wrangler queues consumer list esggo-repair-queue --json 2>&1 || echo "ERROR: Failed to get consumer list"

echo ""
echo "=== Healthcheck Complete ==="
```

## Common Failure Patterns

### Pattern 0: Cloudflare Dashboard Bot Detection

**Symptoms**:
- Browser automation tools return "bot_detection_warning"
- Page title shows "Cloudflare Dashboard | Manage Your Account"
- element_count: 0 in browser tool responses

**Solution**: Use health endpoint or direct API instead:
```bash
curl -s https://esggo-auto-repair.dingjunhong1028.workers.dev/health | jq '.'
```

See [cloudflare-dashboard-bot-detection.md](cloudflare-dashboard-bot-detection.md) for details.

### Pattern 1: Secrets Not Configured
**Symptoms**:
- Health endpoint shows `webhookConfigured: false` or `patConfigured: false`
- Queue consumer logs show "REPAIR_PAT not configured"

**Fix**:
```bash
# Set secrets via GitHub
gh secret set WEBHOOK_SECRET -R DingJun1028/esggo-auto-repair
gh secret set REPAIR_PAT -R DingJun1028/esggo-auto-repair

# Sync to wrangler
echo -n "$WEBHOOK_SECRET" | npx wrangler secret put WEBHOOK_SECRET --env-production
echo -n "$REPAIR_PAT" | npx wrangler secret put REPAIR_PAT --env-production

# Redeploy
npx wrangler deploy
```

### Pattern 2: Consumer Not Processing
**Symptoms**:
- Messages stuck in queue
- No logs in `wrangler tail`

**Check**:
1. Consumer is attached: `wrangler queues consumer list esggo-repair-queue`
2. Worker is deployed: `wrangler deployments list`
3. Secrets are synced (wait 5-10 min after setting)

### Pattern 3: DLQ Has Messages
**Symptoms**:
- `wrangler queues info esggo-repair-dlq` shows messages > 0

**Diagnosis**:
```bash
# Get DLQ messages
wrangler queues consumer list esggo-repair-dlq --json

# Check consumer logs for error patterns
wrangler tail --search "queue.error"
```

## Verification Checklist

After any deployment or secret update:
- [ ] `/health` endpoint returns all `true` values
- [ ] `wrangler queues consumer list` shows 1 consumer
- [ ] `wrangler queues info esggo-repair-dlq` shows 0 messages
- [ ] `wrangler tail` shows no "REPAIR_PAT not configured" errors