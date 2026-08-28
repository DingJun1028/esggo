# Cron Job Tool Limitations - 2026-07-31 Session

## Session Context
User requested: `Check the esggo-auto-repair Worker queue consumer status on VPS 161.118.248.180`

## Tool Availability Matrix

| Tool | Available | Reason |
|------|-----------|--------|
| `execute_code` | ❌ | Blocks subprocess calls in cron jobs |
| `read_terminal` | ❌ | Only available in Hermes desktop app |
| `shell` | ❌ | Tool doesn't exist in available tools |
| `mcp__my_server__*` | ❌ | Not whitelisted for cron jobs |
| `terminal` | ❌ | Not available in tool list |
| `computer_use` | ⚠️ | Session ended, cannot restart |
| `curl` via direct execution | ✅ | Can be executed directly |
| `web_extract` | ⚠️ | Can access Cloudflare API but requires auth headers |
| `web_search` | ✅ | Works but may not provide real-time status |
| `browser_*` | ⚠️ | Cloudflare Dashboard blocks bot detection |

## Health Endpoint Response (2026-07-31)

```bash
curl -s https://esggo-auto-repair.dingjunhong1028.workers.dev/health | jq
```

Returns:
```json
{"status":"ok","queue":true,"webhookConfigured":false,"patConfigured":false}
```

**Interpretation:**
- ✅ `status: ok` - Worker is running
- ✅ `queue: true` - Queue binding exists
- ❌ `webhookConfigured: false` - WEBHOOK_SECRET not configured
- ❌ `patConfigured: false` - REPAIR_PAT not configured

## Recommended Approach for Cron Jobs

### Priority 1: Health Endpoint (Fastest - No Auth Required)
```bash
curl -s https://esggo-auto-repair.dingjunhong1028.workers.dev/health | jq '.status, .queue, .webhookConfigured, .patConfigured'
```

### Priority 2: Root Endpoint (Quick Status Check)
```bash
curl -s https://esggo-auto-repair.dingjunhong1028.workers.dev/
# Returns: esggo-auto-repair:ok
```

### Priority 3: Direct Wrangler Commands (Requires CLI Access)
```bash
cd /opt/esggo/esggo-auto-repair/worker
npx wrangler queues info esggo-repair-queue
npx wrangler queues info esggo-repair-dlq
npx wrangler queues consumer list esggo-repair-queue --json
```

### Priority 4: Cloudflare API (Requires Credentials)
```bash
curl -s "https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/workers/queues/esggo-repair-queue" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" | jq '.result'
```

**Note**: web_extract can access Cloudflare API but requires authentication headers. In cron job contexts, prefer direct curl or wrangler commands.

## Cloudflare Dashboard Access

The Cloudflare Dashboard (`https://dash.cloudflare.com/`) actively blocks automated browser sessions:
- Browser tools return "bot_detection_warning"
- element_count: 0 in browser snapshots
- Empty page response

**Workaround**: Use health endpoint or API instead of browser automation.

## Action Required

Based on health endpoint response:
```bash
# Set missing secrets
gh secret set WEBHOOK_SECRET -b "<your_webhook_secret>"
gh secret set REPAIR_PAT -b "<your_github_pat>"

# Redeploy worker
wrangler deploy

# Verify
curl https://esggo-auto-repair.dingjunhong1028.workers.dev/health
```