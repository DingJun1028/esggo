# Queue Size Check When Secrets Are Missing

## Problem
When health endpoint shows `webhookConfigured: false` or `patConfigured: false`, you cannot determine actual queue backlog from the health endpoint alone. The worker is running but consumer is blocked.

## Cloudflare API Method (Requires Auth)
```bash
# Get queue info with message count
curl -s "https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/workers/queues/esggo-repair-queue" \
  -H "Authorization: Bearer ${CF_API_TOKEN}" \
  | jq '.result.messages_count'

# Get DLQ message count
curl -s "https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/workers/queues/esggo-repair-dlq" \
  -H "Authorization: Bearer ${CF_API_TOKEN}" \
  | jq '.result.messages_count'
```

## Wrangler CLI Method (Local Access)
```bash
# Check main queue
npx wrangler queues info esggo-repair-queue | grep -E "(messages|size)"

# Check DLQ
npx wrangler queues info esggo-repair-dlq | grep -E "(messages|size)"
```

## Health Endpoint Limitation
The `/health` endpoint returns:
```json
{"status":"ok","queue":true,"webhookConfigured":false,"patConfigured":false}
```

**Key insight**: `queue: true` means queue binding exists, NOT that the queue is empty. Missing secrets cause messages to accumulate.

## Remediation Priority
1. First: Set missing secrets via `gh secret set`
2. Second: Wait 5-10 minutes for Cloudflare sync
3. Third: Redeploy worker
4. Fourth: Verify with health endpoint

## Expected Behavior After Fix
```json
{"status":"ok","queue":true,"webhookConfigured":true,"patConfigured":true}
```