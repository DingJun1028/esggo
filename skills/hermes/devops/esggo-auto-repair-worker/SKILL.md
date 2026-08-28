---
name: esggo-auto-repair-worker
description: Cloudflare Worker for automated PR repair with GitHub webhook integration and Queues processing. Handles webhook signature verification, queue-based async processing, and repo-specific repair rules.
tags:
  - cloudflare
  - workers
  - queues
  - github
  - webhook
  - automation
  - esggo
---

# esggo-auto-repair Worker

Automated PR repair system for DingJun1028/esggo projects using Cloudflare Workers, Queues, and GitHub API.

## Overview

This Worker processes GitHub webhook events for pull requests and automatically applies repo-specific repair rules. It uses:
- **GitHub Webhooks** for real-time PR event detection
- **Cloudflare Queues** for async message processing
- **Queue DLQ** for failed message handling
- **GitHub PAT** for repository operations

## Architecture

```
GitHub PR Event
      │
      ▼
Webhook Handler (/github/webhook)
      │
      ├── Verify signature (HMAC-SHA256)
      ├── Check trusted repos
      ├── Send to Queue
      ▼
Queue Consumer (background processing)
      │
      ├── Apply repo-specific repair rules
      ├── Create branches & PRs if needed
      └── Log results
```

## Quick Setup

### 1. Prerequisites

```bash
# Install wrangler 4.x+
npm install -g wrangler

# Authenticate
wrangler login

# Navigate to worker directory
cd esggo-auto-repair/worker
```

### 2. Secrets Configuration

| Secret | Purpose | Command |
|--------|---------|---------|
| `WEBHOOK_SECRET` | GitHub webhook signature verification | `gh secret set WEBHOOK_SECRET -R DingJun1028/esggo-auto-repair` |
| `REPAIR_PAT` | GitHub PAT for repo operations | `gh secret set REPAIR_PAT -R DingJun1028/esggo-auto-repair` |
| `AUTO_MERGE` | Auto-merge repair PRs | `gh variable set AUTO_MERGE -R DingJun1028/esggo-auto-repair` |

### 3. Deploy

```bash
# Deploy worker
wrangler deploy

# Verify deployment
curl https://esggo-auto-repair.dingjunhong1028.workers.dev/health
# Expected: {"status":"ok","queue":true,"webhookConfigured":true,"patConfigured":true}
```

### 4. Create Queues

```bash
# Create main queue
wrangler queues create esggo-repair-queue

# Create DLQ
wrangler queues create esggo-repair-dlq
```

### 5. Add Consumer

```bash
wrangler queues consumer add esggo-repair-queue esggo-auto-repair \
  --batch-size 5 \
  --message-retries 3
```

## Configuration (wrangler.toml)

```toml
name = "esggo-auto-repair"
main = "src/index.ts"
compatibility_date = "2025-03-01"
compatibility_flags = ["nodejs_compat"]

[[queues.producers]]
queue = "esggo-repair-queue"
binding = "REPAIR_QUEUE"

[[queues.consumers]]
queue = "esggo-repair-queue"
max_batch_size = 5
max_retries = 3
max_batch_timeout = 1
dead_letter_queue = "esggo-repair-dlq"
```

## Health Check Methods

### Method 1: Health Endpoint (Fastest - Recommended for Cron Jobs)

When direct script execution is blocked (cron jobs, tool limitations), use the health endpoint:

```bash
curl -s https://esggo-auto-repair.dingjunhong1028.workers.dev/health | jq .
```

**Expected Output:**
```json
{
  "status": "ok",
  "queue": true,
  "webhookConfigured": true,
  "patConfigured": true
}
```

**Interpretation:**
| Field | Meaning | Action if false |
|-------|---------|-----------------|
| `status` | Worker running | Redeploy worker |
| `queue` | Queue binding exists | Check wrangler.toml |
| `webhookConfigured` | WEBHOOK_SECRET set | `gh secret set WEBHOOK_SECRET` |
| `patConfigured` | REPAIR_PAT set | `gh secret set REPAIR_PAT` |

### Method 2: Root Endpoint

```bash
curl -s https://esggo-auto-repair.dingjunhong1028.workers.dev/
# Output: esggo-auto-repair:ok
```

### Method 3: Cron-Friendly Script

For scheduled cron jobs, use the dedicated script at `scripts/cron-healthcheck.sh`:

```bash
# Run directly
bash scripts/cron-healthcheck.sh
```

### Method 4: Wrangler Commands (Manual)

```bash
npx wrangler queues info esggo-repair-queue
npx wrangler queues info esggo-repair-dlq
npx wrangler queues consumer list esggo-repair-queue --json
```

## Cron Job Execution Considerations

⚠️ **CRITICAL**: When running as a scheduled cron job, the `execute_code` tool blocks subprocess calls. **Prefer the health endpoint method**:

### Cloudflare Dashboard Access Limitations

The Cloudflare Dashboard (`https://dash.cloudflare.com/`) actively blocks automated/bot access. Symptoms include:
- Empty page response with "bot_detection_warning"
- Page title "Cloudflare Dashboard | Manage Your Account" suggests bot detection
- Element count: 0 in browser tool responses

**Workaround**: Use one of these alternatives:
1. **Health endpoint** (fastest): `curl -s https://esggo-auto-repair.dingjunhong1028.workers.dev/health`
2. **Direct wrangler commands**: `npx wrangler queues info esggo-repair-queue`
3. **Cloudflare API**: Requires `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`

### ✅ RECOMMENDED for Cron Jobs

```bash
curl -s https://esggo-auto-repair.dingjunhong1028.workers.dev/health | jq '.status, .queue, .webhookConfigured, .patConfigured'
```

### Script Path Verification

The healthcheck script may exist in multiple locations. Always verify the actual path:

```bash
# Check both locations
ls -la C:/Project/esggo-learning-center/scripts/queue_healthcheck.sh
ls -la C:/Users/dingj/AppData/Local/hermes/scripts/queue_healthcheck.sh 2>/dev/null || echo "Not in user scripts dir"

# Find all instances
find /c -name "queue_healthcheck.sh" 2>/dev/null
```

**Common paths:**
- `C:\Project\esggo-learning-center\scripts\queue_healthcheck.sh` (primary)
- `C:\Users\dingj\AppData\Local\hermes\scripts\queue_healthcheck.sh` (user scripts directory)

## Tool Limitations in Cron Jobs

| Tool | Limitation | Workaround |
|------|------------|------------|
| `read_terminal` | Only available in Hermes desktop app | Use health endpoint at `/health` |
| `execute_code` | Blocks subprocess calls | Use direct shell commands or `curl` to health endpoint |
| `shell` tool | May not exist in all environments | Use `npx wrangler` directly or `curl` |

**Example of blocked vs working approach:**
```bash
# ❌ BLOCKED in cron - execute_code subprocess calls
# ❌ BLOCKED in cron - read_terminal unavailable
# ✅ WORKING - health endpoint
curl -s https://esggo-auto-repair.dingjunhong1028.workers.dev/health
```

## Monitoring

### Check Queue Status

```bash
# Main queue
wrangler queues info esggo-repair-queue

# DLQ
wrangler queues info esggo-repair-dlq
```

### View Live Logs

```bash
# Stream logs
wrangler tail --format json

# Filter errors
wrangler tail --search "error"
```

### Cloudflare Dashboard

- Worker: https://dash.cloudflare.com → Workers & Pages → esggo-auto-repair
- Queues: https://dash.cloudflare.com → Workers → Queues

## Troubleshooting

### Secret Sync Delay
After setting secrets via `gh secret set`, wait 5-10 minutes for Cloudflare to sync before expecting them in the consumer.

### Webhook Not Triggering
1. Verify webhook secret matches
2. Check `/health` endpoint for config status
3. Verify webhook is active in GitHub repo settings

### DLQ Has Messages
1. Check consumer logs: `wrangler tail`
2. Identify failure cause
3. Fix underlying issue
4. Re-queue or manually process DLQ messages

### Consumer Not Processing
1. Verify consumer is added: `wrangler queues consumer list esggo-repair-queue`
2. Check worker is deployed: `wrangler deployments list`
3. Verify secrets are synced

## Common Pitfalls

### Script Path Verification
The script path may differ from expectations. Always verify:
```bash
find /c/Project -name "queue_healthcheck.sh" 2>/dev/null
```

### Secret Naming
GitHub Actions secrets cannot start with `GITHUB_`. Use `WEBHOOK_SECRET` instead of `GITHUB_WEBHOOK_SECRET`.

### Queue Handler Pattern
For module workers, the queue handler MUST be part of the default export:

```typescript
// CORRECT
export default {
  fetch: app.fetch,
  async queue(batch, env, ctx) { /* handler */ }
};

// INCORRECT - separate named export won't work
export async function queue(...) { ... }
export default app;
```

### PowerShell curl Alias
On Windows PowerShell, `curl` is an alias for `Invoke-WebRequest`. Use `curl.exe` or `Remove-Item Alias:curl -Force`.

## Related Skills

- `cloudflare-queue-consumer` - Queue consumer management
- `hermes-usage-best-practices` - Cron and background job patterns with OmniTag reporting format
- `tool-availability-contexts` - Tool availability across execution contexts
- `cloudflare-queues-github-secrets` - GitHub webhook integration
- `wrangler` - Cloudflare Workers CLI
- `workers-best-practices` - Production best practices

## Quick Status Reference

| Health Field | Meaning | Action if false |
|--------------|---------|-----------------|
| `status` | "ok" | Worker running |
| `queue` | true | Queue binding exists |
| `webhookConfigured` | true | WEBHOOK_SECRET set |
| `patConfigured` | true | REPAIR_PAT set |

**Cron-friendly check**: `curl -s https://esggo-auto-repair.dingjunhong1028.workers.dev/health | jq`

## References

- Cron Job Queue Healthcheck → [references/cron-queue-healthcheck.md](references/cron-queue-healthcheck.md)
- Queue Size Check When Secrets Missing → [references/queue-size-check-missing-secrets.md](references/queue-size-check-missing-secrets.md)
- Cron Job Execution Considerations → [references/cron-execution-considerations.md](references/cron-execution-considerations.md)
- **2026-07-31 Session Tool Limitations** → [references/cron-job-tool-limitations-2026-07-31.md](references/cron-job-tool-limitations-2026-07-31.md)
- Cron Job Tool Limitations → [references/cron-tool-limitations.md](references/cron-tool-limitations.md)
- Health Check Incident (2026-07-31) → [references/health-check-incident-2026-07-31.md](references/health-check-incident-2026-07-31.md)
- **VPS Queue Healthcheck Execution (2026-07-31)** → [references/vps-queue-healthcheck-2026-07-31.md](references/vps-queue-healthcheck-2026-07-31.md)
- [Cloudflare Queues Docs](https://developers.cloudflare.com/queues/)--------|
| `status` | "ok" | ✅ Worker running |
| `queue` | true | ✅ Queue binding exists |
| `webhookConfigured` | false | ❌ Set `WEBHOOK_SECRET` via `gh secret set WEBHOOK_SECRET` |
| `patConfigured` | false | ❌ Set `REPAIR_PAT` via `gh secret set REPAIR_PAT` |

**Remediation:**
```bash
# Navigate to worker directory
cd esggo-auto-repair/worker

# Set secrets (requires GitHub PAT with repo scope)
gh secret set WEBHOOK_SECRET -b "your_webhook_secret"
gh secret set REPAIR_PAT -b "ghp_your_token_here"

# Redeploy worker
wrangler deploy

# Verify
curl https://esggo-auto-repair.dingjunhong1028.workers.dev/health
```

## Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/` | GET | Health check - returns `esggo-auto-repair:ok` |
| `/health` | GET | Detailed status - queue, webhook, PAT config |
| `/github/webhook` | POST | GitHub webhook receiver |

## GitHub Webhook Setup

```bash
# Create webhook on target repo
curl -X POST \
  -H "Authorization: token $(gh auth token)" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/OWNER/REPO/hooks \
  -d '{
    "name": "web",
    "active": true,
    "events": ["pull_request"],
    "config": {
      "url": "https://esggo-auto-repair.dingjunhong1028.workers.dev/github/webhook",
      "content_type": "json",
      "secret": "your-webhook-secret",
      "insecure_ssl": "0"
    }
  }'
```

## Repair Rules Engine

The worker uses a rule-based system for different repos:

### hermes-workspace-docs
- **Rule**: `routeTree-gitignore-check`
- **Detect**: PR with `/gen/` files, action: `synchronize`
- **Fix**: Add `src/routeTree.gen.ts` to `.gitignore`

### ftg-tours-website
- **Rule**: `missing-imagecarousel-import`
- **Detect**: Repo ends with `/ftg-tours-website`
- **Fix**: Add missing `ImageCarousel` import

### esggo_vps
- **Rule**: `no-speculative-patch`
- **Detect**: Repo ends with `/esggo_vps`
- **Fix**: Review for speculative changes

## Scripts

- `scripts/cron-healthcheck.sh` - Cron-friendly healthcheck script with colored output and exit codes
- `scripts/queue_healthcheck.sh` - Detailed queue status, DLQ status, and consumer list check

## Windows-Specific Considerations

### WSL Requirement for Bash Scripts

**Problem**: Bash scripts (like `queue_healthcheck.sh`) cannot run natively on Windows without WSL or Git Bash installed.

**Symptoms**:
- `bash: command not found` or similar errors
- WSL distribution not installed error

**Solutions**:
1. **Install WSL**: Run `wsl --install` in PowerShell (requires restart)
2. **Use Git Bash**: Available with Git for Windows installation
3. **Use PowerShell equivalents**: Translate bash commands to PowerShell syntax

### PowerShell Command Syntax Differences

| Bash | PowerShell |
|------|------------|
| `cmd1 && cmd2` | `cmd1; cmd2` or `cmd1 && cmd2` (in WSL/Git Bash) |
| `cmd1 || cmd2` | `cmd1; if (-not $?)` |
| `var=value` | `$var = "value"` |
| `#!/bin/bash` | N/A (PowerShell uses `.ps1` or direct commands) |

### wrangler First-Time Installation

When running wrangler for the first time on Windows:
```powershell
npx wrangler queues info esggo-repair-queue
# May prompt: "Ok to proceed? (y)" - type 'y' and press Enter
```

### PowerShell curl Alias Warning

On Windows PowerShell, `curl` is an alias for `Invoke-WebRequest`, not the actual curl. Use:
```powershell
# For actual HTTP requests, use:
curl.exe https://example.com
# Or use Invoke-RestMethod:
Invoke-RestMethod -Uri https://example.com
```