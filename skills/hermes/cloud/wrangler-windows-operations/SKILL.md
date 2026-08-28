---
name: wrangler-windows-operations
description: Cloudflare Wrangler CLI operations on Windows hosts with specific environment setup, R2/Queue/Deployments commands, and common pitfalls. Load when running wrangler on Windows or when working with R2 buckets, Workers Queues, or deployments.
version: 1.0.0
author: Hermes Agent (DingJun1028)
platforms: [windows]
---

# Wrangler on Windows - Operations Guide

## Environment Setup

### Required Environment Variables

On Windows hosts (especially when using git-bash/MSYS), set these environment variables before running wrangler commands:

```bash
export PYTHONUTF8='1'
export NODE_OPTIONS='--max-old-space-size=4096 --icu-data-dir=/c/Users/dingj/AppData/Local/vm/cache/node-icu'
```

**Why needed:**
- `PYTHONUTF8=1`: Ensures Python handles UTF-8 encoding correctly
- `NODE_OPTIONS`: Increases memory limit and sets ICU data directory for proper internationalization support

## Common Wrangler Commands

### Deployments

```bash
# List deployments for a specific Worker (NOTE: requires --name flag)
wrangler deployments list --name <worker-name>

# Example:
wrangler deployments list --name esggo-r2-events-consumer
```

**Pitfall**: `wrangler deployments list <name>` does NOT work - the name must be passed via `--name` flag.

### Workers Queues

```bash
# List queues
wrangler queues list

# List consumers for a queue
wrangler queues consumer list <queue-name>

# Get queue info
wrangler queues info <queue-name>

# Add consumer to queue
wrangler queues consumer add <queue-name> <worker-name>

# Remove consumer from queue
wrangler queues consumer remove <queue-name> <worker-name>
```

### Queue Monitoring & Status Reporting

Use this section for monitoring queue health and generating status reports, especially for cron job deliveries.

#### Check Queue Status

```bash
# Check main queue status
wrangler queues info <queue-name>

# Check DLQ (Dead Letter Queue) status
wrangler queues info <queue-name>-dlq

# List consumers for a queue
wrangler queues consumer list <queue-name>
```

#### Status Report Format

For cron job deliveries, use the following format:

**If healthy (consumer count >= 1, no DLQ messages):**
```
[SILENT]
```

**If issues detected:**
```
## Queue Status Report

### <queue-name>
- Producers: <count>
- Consumers: <count>
- Status: <healthy/unhealthy>

### <queue-name>-dlq
- Messages: <count> (if > 0)
- Status: <requires attention>
```

#### Health Check Criteria

A queue is considered **healthy** when:
- `Number of Consumers >= 1`
- DLQ has no messages (or zero producers/consumers is acceptable for DLQ)

If consumer count is 0 and the queue is critical, redeploy the worker:
```bash
wrangler deploy --name <worker-name>
```

**Important**: Queue consumers must be configured in wrangler.toml using the `[[queues.consumers]]` array syntax, not just via CLI. The worker must export both `fetch` and `queue` handlers in a single `export default` object:

```ts
// CORRECT - Module Workers pattern
export default {
  fetch: app.fetch,
  async queue(batch: MessageBatch<MyJob>, env: Env, ctx: ExecutionContext): Promise<void> {
    // Queue handler
  },
};

// WRONG - This will fail with "Queue handler is missing"
export default app;
export async function queue(...) { }
```

### R2 Object Storage

```bash
# List buckets
wrangler r2 bucket list

# Create bucket
wrangler r2 bucket create <bucket-name>

# Upload object to R2 bucket
wrangler r2 object put <bucket-name>/path/file.txt --file ./local-file.txt --content-type text/plain

# Download object from R2 bucket
wrangler r2 object get <bucket-name>/path/file.txt

# Delete object from R2 bucket
wrangler r2 object delete <bucket-name>/path/file.txt
```

**Important Notes:**
- Object path format: `<bucket-name>/path/file.txt` (not `bucket path/file.txt`)
- R2 object listing is NOT available via CLI in all versions - use `wrangler r2 bucket list` or verify with `wrangler r2 object get`

### Creating Local Files for Testing

When testing R2 uploads, ensure the local file exists:

```bash
# Create a test file
echo "Hello from R2!" > tests/hello.txt

# Then upload
wrangler r2 object put esggo/tests/hello.txt --file tests/hello.txt --content-type text/plain
```

### Common Pitfalls and Solutions

#### 1. First-Time Package Installation Confirmation

When running wrangler commands for the first time on Windows, npm may prompt for confirmation:

```powershell
npx wrangler queues info esggo-repair-queue
# Output: "Ok to proceed? (y) |"
# Solution: Type 'y' and press Enter
```

**Tip**: Pipe 'y' automatically if scripting:
```powershell
echo "y" | npx wrangler queues info esggo-repair-queue
```

#### 2. Command Syntax Errors

| Error | Solution |
|-------|----------|
| `Unknown argument: <name>` | Use `--name` flag for deployments list (not positional argument) |
| `The file does not exist` | Create the file before uploading to R2 |
| `object list` command not working | Use `wrangler r2 bucket list` or verify with `wrangler r2 object get` |
| `bash: command not found` | Install WSL (`wsl --install`) or use Git Bash |
| `PowerShell: && is not recognized` | Use `;` instead of `&&` in PowerShell, or run in WSL/Git Bash |

### 2. Environment Variable Setup (POSIX vs Windows)

**Windows PowerShell syntax:**
```powershell
$env:PYTHONUTF8='1'
$env:NODE_OPTIONS='--max-old-space-size=4096 --icu-data-dir=$env:LOCALAPPDATA\vm\cache\node-icu'
```

**Git Bash / MSYS syntax:**
```bash
export PYTHONUTF8='1'
export NODE_OPTIONS='--max-old-space-size=4096 --icu-data-dir=/c/Users/dingj/AppData/Local/vm/cache/node-icu'
```

**Critical differences:**
- PowerShell: `$env:VAR='value'`, Windows paths `C:\Users\...`
- Git Bash: `export VAR='value'`, POSIX paths `/c/Users/...`
- Use `terminal` tool which runs through bash (git-bash / MSYS), NOT PowerShell

### 3. Object Path Format for R2

The `wrangler r2 object put` command requires the object path in format `bucket/key`:

```bash
# Correct:
wrangler r2 object put esggo/tests/hello.txt --file tests/hello.txt --content-type text/plain

# Incorrect (will fail):
wrangler r2 object put esggo tests/hello.txt --file tests/hello.txt --content-type text/plain
```

### 2. Windows-Specific Issues

| Issue | Solution |
|-------|----------|
| `Environment variable not found` | Use POSIX-style paths in bash: `/c/Users/...` instead of `C:\Users\...` |
| `Assertion failed` errors | Ensure proper environment variables are set |
| Path quoting issues | Use forward slashes and proper quoting |

### 3. Shell Tool Accessibility Issues

If the `shell` tool returns "shell tool does not exist":
- Use `execute_code` with subprocess to run CLI commands
- Use full node/npm paths if needed

## Verification Workflow

After running wrangler commands:

1. **Verify deployments**: `wrangler deployments list --name <name>`
2. **Verify R2 objects**: `wrangler r2 object get <bucket>/<path>`
3. **Verify queues**: `wrangler queues consumer list <queue-name>`
4. **Check logs**: `wrangler tail` for live logs
5. **Check queue health**: `wrangler queues info <queue-name>` and `wrangler queues info <queue-name>-dlq`
6. **Test webhook**: Send a test POST to the worker URL and observe logs with `wrangler tail`
7. **Verify Secrets sync**: If queue consumer logs show `env.X is not configured`, check that the Secret's update timestamp is AFTER the deployment's Version ID timestamp. If the Secret was set before the deploy, re-deploy to pick it up.

## Example Session

```bash
# Set environment
export PYTHONUTF8='1'
export NODE_OPTIONS='--max-old-space-size=4096 --icu-data-dir=/c/Users/dingj/AppData/Local/vm/cache/node-icu'

# List deployments
wrangler deployments list --name esggo-r2-events-consumer

# List queue consumers
wrangler queues consumer list esggo-event-queue

# Create test file and upload to R2
echo "Hello from R2!" > tests/hello.txt
wrangler r2 object put esggo/tests/hello.txt --file tests/hello.txt --content-type text/plain

# Verify bucket contents
wrangler r2 bucket list
wrangler r2 object get esggo/tests/hello.txt
```

## GitHub Secrets Management

### Setting secrets via `gh` CLI

```bash
# Set a single secret
gh secret set VERCEL_API_KEY -b "your-api-key"

# Set Telegram secrets
gh secret set TELEGRAM_BOT_TOKEN -b "your-bot-token"
gh secret set TELEGRAM_CHAT_ID -b "your-chat-id"

# Set Firebase CI token (from `firebase login:ci` output)
gh secret set FIREBASE_TOKEN -b "your-firebase-token"
```

### Common Secrets for OA-TEAM

| Secret Name | Source | Value |
|-------------|--------|-------|
| `VERCEL_API_KEY` | Vercel Dashboard → Settings → API Tokens | `vcp_...` |
| `VERCEL_ORG_ID` | Vercel Dashboard → Teams | `esggo` |
| `VERCEL_PROJECT_ID` | Vercel Dashboard → Project → Settings | Project-specific |
| `FIREBASE_TOKEN` | `firebase login:ci` command output | Long token string |
| `TELEGRAM_BOT_TOKEN` | @BotFather → /mybots | `1234567890:ABCdef...` |
| `TELEGRAM_CHAT_ID` | Telegram chat with bot | Numeric ID |

**Security Note**: Never echo or log secret values. Always use `-b` flag with `gh secret set` or pipe from a file.

## Cron Job Telegram Delivery Configuration

When configuring cron jobs for Telegram delivery, ensure the `channel_directory.json` is populated:

```json
{
  "updated_at": "2026-07-28T18:00:00.000000",
  "platforms": {
    "telegram": {
      "bot_token": "TELEGRAM_BOT_TOKEN",
      "chat_id": "TELEGRAM_CHAT_ID"
    }
  }
}
```

Then set in cron job:
```json
{
  "deliver": "telegram",
  "deliver_params": {
    "channel_id": "6387287462",
    "thread_id": "17585"
  }
}
```