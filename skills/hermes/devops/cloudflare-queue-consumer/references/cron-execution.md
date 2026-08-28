# Cron Job Execution for Queue Consumers

## Overview

When deploying queue consumers that need to be monitored via cron jobs, you may encounter execution limitations where subprocess calls are blocked.

## Problem

In cron job contexts, the standard `execute_code` tool blocks subprocess calls:
```
BLOCKED: execute_code runs arbitrary local Python (including subprocess calls that bypass shell-string approval checks).
```

## Solutions

### 1. Direct Shell Execution

```bash
# Run healthcheck directly
cd /path/to/worker && bash scripts/queue_healthcheck.sh

# Or use wrangler directly
npx wrangler queues info my-queue
npx wrangler queues consumer list my-queue --json
```

### 2. Health Endpoint (Recommended)

When wrangler commands are blocked or unavailable, use the Worker's health endpoint:

```bash
# Fastest method - no authentication required
curl -s https://<worker-name>.workers.dev/health | jq '.'

# Check critical fields
curl -s https://<worker-name>.workers.dev/health | jq '.status, .queue, .webhookConfigured, .patConfigured'
```

### 3. Cloudflare API Fallback

```bash
# Get queue status via API
curl -s "https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/workers/queues/my-queue" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" | jq '.result'

# Check DLQ
curl -s "https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/workers/queues/my-queue-dlq" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" | jq '.result'
```

### 4. Browser Tools Limitation

Cloudflare Dashboard (`https://dash.cloudflare.com/`) actively blocks automated browser sessions with bot detection. Symptoms include:
- "bot_detection_warning" in response
- element_count: 0
- Empty page response

**Solution**: Use health endpoint or API instead of browser automation.

### 3. Environment Setup

Ensure these are available in the cron environment:
- `CLOUDFLARE_API_TOKEN` (or `CF_API_TOKEN`)
- `CLOUDFLARE_ACCOUNT_ID` (or `CF_ACCOUNT_ID`)
- Node.js and wrangler installed

## Related

- See `esggo-auto-repair-worker` skill for detailed cron execution patterns
- See [wrangler documentation](https://developers.cloudflare.com/workers/platform Wrangler CLI reference)