# Cron Job Tool Limitations for Queue Health Checks

## Error Encountered

When attempting to run queue health checks from a scheduled cron job:

```
read_terminal tool is only available in the Hermes desktop app.
```

This error occurs when:
- Running as a scheduled cron job
- The `read_terminal` tool is invoked
- The execution environment is NOT the Hermes desktop application

## Root Cause

The `read_terminal` tool is designed for interactive desktop use only. It is NOT available in:
- Automated cron job execution
- Background daemon processes
- Non-desktop execution environments

## Solution: Use Health Endpoint

### Primary Method (Recommended)

```bash
curl -s https://esggo-auto-repair.dingjunhong1028.workers.dev/health | jq '.status, .queue, .webhookConfigured, .patConfigured'
```

**Expected Output:**
```json
{"status":"ok","queue":true,"webhookConfigured":true,"patConfigured":true}
```

### Fallback Methods

#### Method 1: Direct Wrangler Commands
```bash
# From worker directory
cd /c/Project/esggo-learning-center/esggo-auto-repair/worker
npx wrangler queues info esggo-repair-queue
npx wrangler queues info esggo-repair-dlq
npx wrangler queues consumer list esggo-repair-queue --json
```

#### Method 2: Cloudflare API
```bash
curl -s "https://api.cloudflare.com/client/v4/accounts/<account_id>/workers/queues/esggo-repair-queue" \
  -H "Authorization: Bearer <api_token>" | jq '.result | {queue_name, consumers_total_count}'
```

## Script Path Verification

The healthcheck script may exist in multiple locations. Always verify before execution:

```bash
# Check both locations
ls -la /c/Project/esggo-learning-center/scripts/queue_healthcheck.sh
ls -la /c/Users/dingj/AppData/Local/hermes/scripts/queue_healthcheck.sh 2>/dev/null || echo "Not in user scripts dir"

# Find all instances
find /c -name "queue_healthcheck.sh" 2>/dev/null
```

## Common Cron Job Fail States

| Error | Cause | Solution |
|-------|-------|----------|
| `read_terminal is only available in the Hermes desktop app` | Using read_terminal in cron | Use health endpoint instead |
| `execute_code subprocess blocked` | Using execute_code in cron | Use direct shell or curl |
| `bot_detection_warning` | Cloudflare dashboard blocked | Use API or health endpoint |
| `curl: command not found` | Environment missing curl | Install curl or use wget |

## Best Practices for Cron Job Health Checks

1. **Always use the health endpoint first** - it's the fastest and doesn't require authentication
2. **Verify script paths exist** before assuming a location
3. **Test the health endpoint** manually before scheduling cron jobs
4. **Log all outputs** for debugging when cron runs fail
5. **Use absolute paths** in cron scripts to avoid PATH issues