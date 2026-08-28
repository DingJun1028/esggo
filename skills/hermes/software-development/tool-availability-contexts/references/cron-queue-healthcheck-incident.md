# Cron Queue Healthcheck Incident: read_terminal Misuse

## Incident Summary

**Date**: 2026-07-31
**Context**: Scheduled cron job to check Cloudflare Workers Queue consumer status
**Issue**: Agent attempted to use `read_terminal` to run shell commands in cron mode

## The Problem

When asked to run `C:\Users\dingj\AppData\Local\hermes\scripts\queue_healthcheck.sh` in a cron job context, the agent attempted to use `read_terminal` to execute the script. This failed with:

```
Error: read_terminal is only available in the Hermes desktop app
```

## Root Cause Analysis

1. **Tool Misunderstanding**: `read_terminal` is for reading the Hermes desktop GUI terminal pane, NOT for running shell commands
2. **Context Mismatch**: The task was running as a cron job, where `read_terminal` is not available
3. **Path Verification Needed**: The script exists at `C:\Project\esggo-learning-center\scripts\queue_healthcheck.sh` in allowed directories

## Correct Approach

### Method 1: Health Endpoint (Recommended for Cron)

```bash
curl -s https://esggo-auto-repair.dingjunhong1028.workers.dev/health | jq
```

This returns:
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
npx wrangler queues info esggo-repair-queue
npx wrangler queues info esggo-repair-dlq
npx wrangler queues consumer list esggo-repair-queue --json
```

### Method 3: File-Based Output

```bash
# Run script and output to file
bash C:/Project/esggo-learning-center/scripts/queue_healthcheck.sh --output /tmp/queue_status.txt

# Read output in Hermes
mcp__my_server__read_file(path="/tmp/queue_status.txt")
```

## Tool Availability Matrix (Cron Context)

| Tool | Available | Notes |
|------|-----------|-------|
| `read_terminal` | ❌ | Only in Hermes desktop app |
| `execute_code` | ❌ | Blocks subprocess calls |
| `terminal` | ✅ | Available for shell commands |
| `mcp__my_server__*` | ✅ | Available for file operations |
| `web_*` | ✅ | Available for HTTP requests |
| `curl` via shell | ✅ | Recommended for health checks |

## Script Path Verification

The script was found at:
- ✅ `C:\Project\esggo-learning-center\scripts\queue_healthcheck.sh` (ALLOWED)

NOT at:
- ❌ `C:\Users\dingj\AppData\Local\hermes\scripts\queue_healthcheck.sh` (NOT in allowed directories)

## Lessons Learned

1. **Always check tool availability first** - Use `tool-availability-contexts` skill
2. **For cron jobs, prefer health endpoints** - They don't require authentication
3. **Verify script paths** - Scripts must be in allowed directories for file tools
4. **Don't confuse `read_terminal` with `terminal`** - They are different tools with different purposes

## Related Skills

- `tool-availability-contexts` - Tool availability across execution contexts
- `cloudflare-queue-consumer` - Queue consumer management
- `esggo-auto-repair-worker` - Worker health check patterns
- `cloudflare-queues-github-secrets` - Secret management for queue consumers

## Prevention Checklist

- [ ] Verify tool availability in target execution context
- [ ] Prefer health endpoint for cron job status checks
- [ ] Verify script path is in allowed directories
- [ ] Use `terminal` tool for shell commands, not `read_terminal`
- [ ] Document context-specific limitations in skill files