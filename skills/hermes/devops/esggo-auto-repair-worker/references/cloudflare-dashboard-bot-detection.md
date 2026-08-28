# Cloudflare Dashboard Bot Detection - Troubleshooting Guide

## Problem

Automated access to the Cloudflare Dashboard (`https://dash.cloudflare.com/`) may be blocked by bot detection mechanisms.

## Symptoms

When using browser automation tools (browser_use, etc.):

```json
{
  "success": true,
  "error": "Operation timed out. The page may still be loading or the element may not exist.",
  "bot_detection_warning": "Page title 'Cloudflare Dashboard | Manage Your Account' suggests bot detection.",
  "stealth_warning": "Running WITHOUT residential proxies. Bot detection may be more aggressive."
}
```

Or empty page response with element_count: 0.

## Root Cause

Cloudflare's dashboard employs aggressive bot detection that blocks:
- Automated browser sessions
- Requests from non-residential IPs
- Sessions without proper browser fingerprints

## Workarounds

### 1. Health Endpoint (Recommended)

Use the Worker's built-in health endpoint instead:

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

### 2. Wrangler CLI Commands

Run wrangler commands directly in shell:

```bash
npx wrangler queues info esggo-repair-queue
npx wrangler queues info esggo-repair-dlq
npx wrangler queues consumer list esggo-repair-queue --json
```

### 3. Cloudflare API (Requires Credentials)

```bash
curl -s "https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/workers/queues/esggo-repair-queue" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" | jq '.result'
```

## Prevention

- Always prefer API/health endpoint over dashboard scraping
- For dashboard access, use residential proxies or manual authentication
- Document this limitation in cron job workflows

## Related

- See `cron-execution-considerations.md` for cron job workarounds
- See `wrangler-windows-operations` for CLI command patterns