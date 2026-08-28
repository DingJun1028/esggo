# Cron Job Execution Considerations for Queue Healthchecks

## Problem Statement

When running queue healthcheck scripts from a scheduled cron job context, the standard `execute_code` tool with subprocess calls is **blocked**. This prevents automated healthcheck execution via the Hermes agent's normal subprocess mechanism.

## Error Message

```
BLOCKED: execute_code runs arbitrary local Python (including subprocess calls that bypass shell-string approval checks). Cron jobs run without a user present to approve it. Use normal tools instead, or set approvals.cron_mode: approve only if this cron profile is intentionally trusted.
```

## Tool Limitations in Cron Jobs

| Tool | Availability | Workaround |
|------|--------------|------------|
| `read_terminal` | ❌ Only in Hermes desktop app | Use direct shell or API |
| `shell` | ❌ Does not exist | Use `npx wrangler` directly |
| `execute_code` | ❌ Blocks subprocess calls | Run bash script directly |
| `terminal` | ⚠️ Desktop app only | Use background process tools |
| **Browser tools** | ⚠️ Bot detection blocks Cloudflare dashboard | Use health endpoint or API |

### Cloudflare Dashboard Bot Detection

The Cloudflare Dashboard (`https://dash.cloudflare.com/`) blocks automated access:
- Browser tools show "bot_detection_warning" and element_count: 0
- **Solution**: Use health endpoint or direct API instead

```bash
# ✅ Recommended for dashboard access issues
curl -s https://esggo-auto-repair.dingjunhong1028.workers.dev/health | jq '.'
```

## Alternative Execution Methods

### 1. Direct Shell Execution (Recommended)

Run the script directly in a shell environment:

```bash
# Navigate to worker directory
cd /c/Project/esggo-learning-center/esggo-auto-repair/worker

# Execute healthcheck
bash scripts/queue_healthcheck.sh
```

Or run individual wrangler commands:
```bash
# Check main queue
npx wrangler queues info esggo-repair-queue

# Check DLQ
npx wrangler queues info esggo-repair-dlq

# List consumers
npx wrangler queues consumer list esggo-repair-queue --json
```

### 2. Cloudflare API Direct Fallback

When wrangler commands are unavailable, use the Cloudflare API directly:

```bash
# Get queue info
curl -s "https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/workers/queues/esggo-repair-queue" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" | jq '.result | {queue_name, consumers_total_count}'

# Check DLQ
curl -s "https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/workers/queues/esggo-repair-dlq" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" | jq '.result | {queue_name, messages_total_count}'

# List consumers
curl -s "https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/workers/queues/esggo-repair-queue/consumers" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" | jq '.result'
```

### 3. Manual Trigger

For periodic checks, manually run the healthcheck:

```bash
# Check main queue
npx wrangler queues info esggo-repair-queue

# Check DLQ
npx wrangler queues info esggo-repair-dlq

# List consumers
npx wrangler queues consumer list esggo-repair-queue --json
```

## Required Environment Variables

For any of the above methods to work, ensure these environment variables are set:

| Variable | Purpose | Alternative Name |
|----------|---------|------------------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API authentication | `CF_API_TOKEN` |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account identifier | `CF_ACCOUNT_ID` |

## Cron Job Setup Template

```bash
# /etc/crontab entry (every 5 minutes)
*/5 * * * * cd /c/Project/esggo-learning-center/esggo-auto-repair/worker && bash scripts/queue_healthcheck.sh >> /var/log/queue-health.log 2>&1

# With environment variables
*/5 * * * * export CLOUDFLARE_API_TOKEN="your_token" && export CLOUDFLARE_ACCOUNT_ID="your_account" && cd /path/to/worker && bash scripts/queue_healthcheck.sh
```

## Related Skills

- `esggo-auto-repair-worker` - Main worker configuration
- `cloudflare-queue-consumer` - Queue consumer management with API fallback methods