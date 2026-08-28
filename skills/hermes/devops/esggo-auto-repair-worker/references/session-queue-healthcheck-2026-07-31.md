# Session Queue Healthcheck Incident - 2026-07-31

## Incident Summary

**Date**: 2026-07-31  
**Context**: Scheduled cron job to check esggo-auto-repair Worker queue consumer status  
**Issue**: Script path mismatch + tool availability limitation in cron jobs

## The Problem

User requested: `C:\Users\dingj\AppData\Local\hermes\scripts\queue_healthcheck.sh`

Actual script location: `C:\Project\esggo-learning-center\scripts\queue_healthcheck.sh`

### Tool Availability Issue

When attempting to execute the healthcheck in a cron job context:

```
read_terminal tool is only available in the Hermes desktop app.
```

This error occurred because:
1. `read_terminal` is for reading the Hermes desktop GUI terminal pane, NOT for running shell commands
2. The task was running as a cron job where `read_terminal` is not available
3. `execute_code` also blocks subprocess calls in cron jobs

## Root Cause Analysis

### 1. Script Path Mismatch

The user specified `C:\Users\dingj\AppData\Local\hermes\scripts\queue_healthcheck.sh` but:
- This path is in the user scripts directory (not in allowed directories for file tools)
- The actual script is at `C:\Project\esggo-learning-center\scripts\queue_healthcheck.sh`

### 2. Execution Context Mismatch

- **read_terminal**: Only available in Hermes desktop app (not cron/background)
- **execute_code**: Blocks subprocess calls in cron mode
- **terminal**: Available but requires different invocation pattern

## Correct Approach

### Method 1: Health Endpoint (Recommended for Cron)

```bash
curl -s https://esggo-auto-repair.dingjunhong1028.workers.dev/health | jq '.'
```

Returns:
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
# Navigate to worker directory
cd /c/Project/esggo-learning-center/esggo-auto-repair/worker

# Check main queue
npx wrangler queues info esggo-repair-queue

# Check DLQ
npx wrangler queues info esggo-repair-dlq

# List consumers
npx wrangler queues consumer list esggo-repair-queue --json
```

### Method 3: Script with Correct Path

```bash
# Use the correct script path
bash /c/Project/esggo-learning-center/scripts/queue_healthcheck.sh
```

## Verification Checklist

- [ ] Verify script exists at expected path
- [ ] Check tool availability in execution context
- [ ] Use health endpoint for cron jobs (no auth required)
- [ ] Use wrangler commands as fallback
- [ ] Verify secrets are configured via `/health` endpoint

## Lessons Learned

1. **Always verify script paths** before attempting execution
2. **For cron jobs, prefer health endpoints** over shell scripts
3. **Don't confuse `read_terminal` with `terminal`** - they serve different purposes
4. **Check tool availability** in the execution target context
5. **Use `find` or `ls`** to locate scripts when paths are uncertain

## Related Skills

- `tool-availability-contexts` - Tool availability across execution contexts
- `esggo-auto-repair-worker` - Worker health check patterns
- `cloudflare-queue-consumer` - Queue consumer management
- `hermes-usage-best-practices` - Cron and background job patterns