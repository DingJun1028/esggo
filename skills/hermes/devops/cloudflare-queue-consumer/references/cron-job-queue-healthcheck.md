# Cron Job Execution for Queue Consumers

## Overview

When running queue healthchecks from cron jobs, you'll encounter tool limitations that require alternative approaches.

## Tool Limitations in Cron Jobs

| Tool | Availability | Workaround |
|------|--------------|------------|
| `read_terminal` | ❌ Only in Hermes desktop app | Use health endpoint or direct shell |
| `execute_code` | ❌ Blocks subprocess calls | Use direct shell commands or curl |
| `terminal` | ✅ Available | Use for shell commands |

## Recommended Approach for Cron Jobs

### Method 1: Health Endpoint (Primary)

The fastest and most reliable method for cron jobs:

```bash
curl -s https://esggo-auto-repair.dingjunhong1028.workers.dev/health | jq
```

Expected output:
```json
{
  "status": "ok",
  "queue": true,
  "webhookConfigured": true,
  "patConfigured": true
}
```

### Method 2: Direct Wrangler Commands

```bash
cd /opt/esggo/esggo-auto-repair/worker
npx wrangler queues info esggo-repair-queue
npx wrangler queues info esggo-repair-dlq
npx wrangler queues consumer list esggo-repair-queue --json
```

### Method 3: API Fallback

When wrangler is unavailable:

```bash
curl -s "https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/workers/queues/esggo-repair-queue" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" | jq '.result | {queue_name, producers_total_count, consumers_total_count}'
```

## Common Pitfalls

### 1. read_terminal Misuse

**WRONG**: Trying to use `read_terminal` to run shell commands in cron mode
**RIGHT**: Use health endpoint or `terminal` tool for shell commands

### 2. execute_code Subprocess Blocking

**WRONG**: Using `execute_code` with subprocess calls in cron mode
**RIGHT**: Use direct shell commands or health endpoint

### 3. Script Path Verification

Always verify the script exists in an allowed directory:
```bash
# Check both locations
ls -la C:/Project/esggo-learning-center/scripts/queue_healthcheck.sh
ls -la C:/Users/dingj/AppData/Local/hermes/scripts/queue_healthcheck.sh 2>/dev/null || echo "Not in user scripts dir"
```

## Related Skills

- `tool-availability-contexts` - Tool availability across execution contexts (CRITICAL for cron jobs)
- `esggo-auto-repair-worker` - Worker health check patterns and secrets management