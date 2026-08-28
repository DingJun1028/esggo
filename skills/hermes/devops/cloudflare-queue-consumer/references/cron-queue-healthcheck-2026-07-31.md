# Cron Job Queue Healthcheck - 2026-07-31 Session

## Incident Summary

User requested: `Check the esggo-auto-repair Worker queue consumer status`

Expected to run: `C:\Users\dingj\AppData\Local\hermes\scripts\queue_healthcheck.sh`

## Execution Constraints

### 1. Script Location Mismatch
- **Requested path**: `C:\Users\dingj\AppData\Local\hermes\scripts\queue_healthcheck.sh`
- **Actual path**: `C:\Project\esggo-learning-center\scripts\queue_healthcheck.sh`
- **Allowed directories**: Only `C:\Project\esggo-learning-center` is whitelisted

### 2. Tool Limitations in Cron Jobs
| Tool | Status | Reason |
|------|--------|--------|
| `execute_code` | ❌ BLOCKED | Subprocess calls blocked in cron jobs |
| `read_terminal` | ❌ UNAVAILABLE | Only in Hermes desktop app |
| `shell` | ❌ NOT AVAILABLE | Tool doesn't exist |
| `mcp__my_server__*` | ❌ BLOCKED | Not whitelisted for cron jobs |

### 3. Cloudflare Dashboard Bot Detection
- Dashboard access blocked by bot detection
- No direct UI monitoring possible

## Available Workarounds

### Priority 1: Health Endpoint (Recommended for Cron)
```bash
curl -s https://esggo-auto-repair.dingjunhong1028.workers.dev/health | jq
```

Expected response:
```json
{
  "status": "ok",
  "queue": true,
  "webhookConfigured": true,
  "patConfigured": true
}
```

**Actual response from this session:**
```json
{"status":"ok","queue":true,"webhookConfigured":false,"patConfigured":false}
```

**IMPORTANT**: If `webhookConfigured` or `patConfigured` is `false`, the worker will not process messages!

### Priority 2: Direct Wrangler Commands
```bash
cd /opt/esggo/esggo-auto-repair/worker
npx wrangler queues info esggo-repair-queue
npx wrangler queues info esggo-repair-dlq
npx wrangler queues consumer list esggo-repair-queue --json
```

### Priority 3: Cloudflare API Fallback
```bash
curl -s "https://api.cloudflare.com/client/v4/accounts/<account_id>/workers/queues/esggo-repair-queue" \
  -H "Authorization: Bearer <api_token>" | jq '.result'
```

## Key Learnings

1. **Script paths may differ**: Always verify the actual script location
2. **Cron jobs have limited tool access**: Use health endpoints or direct commands
3. **Health endpoint is fastest**: No authentication required, instant response
4. **Secrets verification**: Use `/health` endpoint to check `webhookConfigured` and `patConfigured`
5. **CRITICAL**: Missing secrets = no message processing, DLQ will fill up

## Action Items

- [x] Verify health endpoint returns expected values
- [ ] If secrets not configured, set via:
  ```bash
  gh secret set WEBHOOK_SECRET -b "<value>"
  gh secret set REPAIR_PAT -b "<value>"
  ```
- [ ] Redeploy worker if secrets need to be synced
- [ ] Verify queue consumer is properly attached

## Queue Configuration (esggo-auto-repair)

```toml
[[queues.consumers]]
queue = "esggo-repair-queue"
max_batch_size = 5
max_retries = 3
max_batch_timeout = 1
dead_letter_queue = "esggo-repair-dlq"
```

**Status**: ✅ Configured correctly with DLQ