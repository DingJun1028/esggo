---
name: cloudflare-queue-consumer
description: Deploy and manage Cloudflare Workers Queue consumers with proper Secrets sync, DLQ handling, and troubleshooting
tags: ["cloudflare", "queues", "workers", "consumer", "secret-sync"]
---

# Cloudflare Workers Queue Consumer

Deploy a Worker as both producer and consumer for a Cloudflare Queue, with proper Secrets handling and DLQ configuration.

## Quick Start

```bash
# Create queue
wrangler queues create my-queue

# Create DLQ
wrangler queues create my-queue-dlq

# Deploy worker (producer + consumer)
wrangler deploy

# Add consumer
wrangler queues consumer add my-queue my-worker

# Verify
wrangler queues consumer list my-queue
```

## wrangler.toml Config

```toml
[[queues.producers]]
queue = "my-queue"
binding = "MY_QUEUE"

[[queues.consumers]]
queue = "my-queue"
max_batch_size = 5
max_retries = 3
max_batch_timeout = 10
dead_letter_queue = "my-queue-dlq"
```

## Worker Code Pattern

```typescript
export default {
  fetch: app.fetch,
  async queue(batch: MessageBatch<MyMessage>, env: Env, ctx: ExecutionContext): Promise<void> {
    const token = env.API_TOKEN
    for (const msg of batch.messages) {
      // process message
    }
  },
}
```

## Pitfalls

### Tool Limitations in Cron Jobs

| Tool | Availability | Workaround |
|------|--------------|------------|
| `read_terminal` | ❌ Only in Hermes desktop app | Use health endpoint or direct shell |
| `shell` | ❌ Does not exist | Use `npx wrangler` directly |
| `execute_code` | ❌ Blocks subprocess calls | Use health endpoint or direct bash |
| **Browser tools** | ⚠️ Cloudflare dashboard blocks bot access | Use health endpoint or API |

**Recommended for Cron Jobs**: Use the health endpoint instead of wrangler commands:
```bash
# Fastest method - no authentication required
curl -s https://<worker-name>.workers.dev/health | jq '.status, .queue, .webhookConfigured, .patConfigured'
```

**Browser Tools Note**: Cloudflare Dashboard (`https://dash.cloudflare.com/`) actively blocks automated browser sessions with bot detection. If browser tools return "bot_detection_warning" or element_count: 0, use API or health endpoint instead.

### Secret Sync Delay
After deploying a Worker with queue consumer, **Secrets may take several minutes to fully sync** to the consumer runtime. If `env.MY_SECRET` is `undefined` inside the consumer handler despite being set via `gh secret set`, do NOT immediately re-deploy. Instead:
1. Wait 5-10 minutes for Cloudflare's internal sync.
2. Verify secrets are visible in the Cloudflare Workers Dashboard → Settings → Secrets.
3. If still undefined, re-deploy with `--keep-vars` flag.

**Critical**: If `REPAIR_PAT` shows as `not configured` in queue consumer logs despite being set, the Secrets timestamp must be AFTER the deployment Version ID timestamp. Check with `gh secret list -R <repo>` and compare the `Updated` column to the deployment's `Current Version ID` timestamp. If the secret was set before the last deploy, re-deploy to pick it up.

### Consumer Starts Only After New Messages
Queue consumers are passive — they only wake up when a new message arrives. If `wrangler tail` shows no logs after sending a webhook, the consumer may still be initializing. Wait 30+ seconds and send another test message.

### SECRET Timestamp vs Deploy Version (Critical)
If `REPAIR_PAT` shows as not configured in queue logs despite being set, compare timestamps:
- `gh secret list -R <repo>` → "Updated" column
- `npx wrangler deployments list` → "Created" column under Version ID
- **Secret must be set AFTER the deployment** to be picked up. If the secret was set before the last deploy, re-deploy.

### Health Endpoint for Secret Verification
Use the `/health` endpoint to verify secret configuration without triggering consumer behavior:
```bash
curl https://<worker-name>.workers.dev/health
# Returns: {"status":"ok","queue":true,"webhookConfigured":false,"patConfigured":false}
# - queue: true if REPAIR_QUEUE binding exists
# - webhookConfigured: true if WEBHOOK_SECRET is set
# - patConfigured: true if REPAIR_PAT is set
```

### Direct Cloudflare API Fallback
When `wrangler queues info` times out or fails, use the Cloudflare API directly:
```bash
# Get queue info
curl -s "https://api.cloudflare.com/client/v4/accounts/<account_id>/workers/queues/<queue_name>" \
  -H "Authorization: Bearer <api_token>" | jq '.result | {queue_name, producers_total_count, consumers_total_count}'

# Check DLQ status (should have 0 consumers)
curl -s "https://api.cloudflare.com/client/v4/accounts/<account_id>/workers/queues/<dlq_name>" \
  -H "Authorization: Bearer <api_token>" | jq '.result | {queue_name, producers_total_count, consumers_total_count}'
```

### Missing Secrets Detection
Before checking queue health, always verify secrets are configured:
```bash
# Check wrangler secrets
npx wrangler secret list 2>&1

# Expected output should show WEBHOOK_SECRET, REPAIR_PAT, etc.
# If empty list `[]`, secrets are MISSING and must be set
```

**Critical**: Secrets set via `gh secret set` must be mirrored to wrangler secrets for the Worker runtime to access them. Use:
```bash
# Get wrangler API token from config
TOKEN=$(grep oauth_token ~/.wrangler/config/default.toml | cut -d'"' -f2)

# Set wrangler secret from GitHub secret value
echo -n "<secret_value>" | npx wrangler secret put WEBHOOK_SECRET --env-production
```

### Account ID Discovery
To find your Account ID for API calls:
```bash
npx wrangler whoami 2>&1 | grep "Account ID" | awk '{print $3}'
```

### DLQ Health Check Logic
The DLQ should have **0 consumers** (it's a dead-letter queue, not a processing queue). If DLQ has consumers:
1. Check if they're processing messages correctly
2. Verify the consumer logic handles DLQ messages appropriately
3. Consider if DLQ messages should be manually reviewed and purged after resolution

### DLQ Cannot Be Deleted While Bound
If `wrangler queues delete <dlq>` fails with "Cannot delete queue that serves as dead letter queue for consumers", first unbind with `wrangler queues consumer remove`, then delete.

### Consumer Restart Changes ID
After removing and re-adding a consumer, the `consumer_id` changes. Verify with `wrangler queues consumer list <queue-name>`.

### wrangler.toml Uses TOML Array-of-Tables
Use `[[queues.consumers]]` and `[[queues.producers]]` syntax, not JSON-style nesting.

### Cron Job Execution Limitations
- See `references/cron-healthcheck-results-2026-07-31.md` for session record of actual execution attempts
- See `references/execution-attempt-2026-07-31.md` for detailed tool limitations and workaround patterns
- See `references/cron-execution.md` for cron job execution patterns

#### Health Endpoint First Strategy
**Priority order for cron job health checks:**
1. **Health endpoint** (fastest, no auth required):
   ```bash
   curl -s https://<worker-name>.workers.dev/health | jq
   ```
   Returns: `{"status":"ok","queue":true,"webhookConfigured":true,"patConfigured":true}`

2. **wrangler queues info** (requires auth, slower):
   ```bash
   cd esggo-auto-repair/worker && npx wrangler queues info <queue-name>
   ```

3. **Cloudflare API fallback** (when CLI fails):
   ```bash
   curl -s "https://api.cloudflare.com/client/v4/accounts/<account_id>/workers/queues/<queue_name>" \
     -H "Authorization: Bearer <api_token>" | jq '.result'
   ```

**When health endpoint is blocked** (bot detection, network issues):
- Verify worker deployment status in Cloudflare Dashboard
- Check GitHub Actions deployment logs for errors
- Use `wrangler tail` to inspect live logs if accessible

#### Queue Healthcheck Script

Located at: `scripts/queue_healthcheck.sh` (in project root)

**Script Path Verification**: The script may exist in multiple locations. Always verify the actual path:
```bash
# Check both locations
ls -la C:/Project/esggo-learning-center/scripts/queue_healthcheck.sh
ls -la C:/Users/dingj/AppData/Local/hermes/scripts/queue_healthcheck.sh 2>/dev/null || echo "Not in user scripts dir"

# Find all instances
find /c -name "queue_healthcheck.sh" 2>/dev/null
```

**Common paths**:
- `C:\Project\esggo-learning-center\scripts\queue_healthcheck.sh` (primary - project directory)
- `C:\Users\dingj\AppData\Local\hermes\scripts\queue_healthcheck.sh` (user scripts directory)

**Windows Execution Note**: The script uses bash syntax (`&&` as command separator). On Windows PowerShell:
- Use `;` instead of `&&`
- Or run in WSL/Git Bash
- Or use direct wrangler commands instead

```bash
# PowerShell equivalent:
cd "C:\Project\esggo-learning-center"; npx wrangler queues info esggo-repair-queue; npx wrangler queues info esggo-repair-dlq; npx wrangler queues consumer list esggo-repair-queue --json

# Or use WSL/Git Bash:
bash scripts/queue_healthcheck.sh
```

**Common FAIL/WARN diagnostics:**
- `queue: false` in health → Queue binding misconfigured
## Related Skills

- `tool-availability-contexts` - Tool availability across execution contexts (CRITICAL for cron jobs)
- `esggo-auto-repair-worker` - Worker health check patterns and secrets management
- `references/health-check-incident-2026-07-31.md` - Specific health check incident from 2026-07-31

## References

- [references/cron-execution.md](references/cron-execution.md)
- [references/cron-job-tool-limitations-2026-07-31.md](references/cron-job-tool-limitations-2026-07-31.md)
- [references/deployment-checklist.md](references/deployment-checklist.md)
- [references/esggo-auto-repair-setup.md](references/esggo-auto-repair-setup.md)
- [references/health-check-incident-2026-07-31.md](references/health-check-incident-2026-07-31.md)
- [references/vps-queue-healthcheck-2026-07-31.md](references/vps-queue-healthcheck-2026-07-31.md)