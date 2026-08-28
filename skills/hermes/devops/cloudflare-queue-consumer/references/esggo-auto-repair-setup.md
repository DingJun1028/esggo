# esggo-auto-repair Setup Reference

## Worker Configuration

- **Queue name**: `esggo-repair-queue`
- **DLQ name**: `esggo-repair-dlq`
- **Worker URL**: `https://esggo-auto-repair.dingjunhong1028.workers.dev`
- **Repo**: `DingJun1028/esggo-auto-repair`

## Secrets Required

| Secret | Purpose | Set via |
|--------|---------|---------|
| `WEBHOOK_SECRET` | Verify GitHub webhook signatures | `gh secret set WEBHOOK_SECRET -R DingJun1028/esggo-auto-repair` |
| `REPAIR_PAT` | GitHub PAT for repo operations | `gh secret set REPAIR_PAT -R DingJun1028/esggo-auto-repair` |
| `AUTO_MERGE` | Auto-merge repair PRs | `gh variable set AUTO_MERGE -R DingJun1028/esggo-auto-repair` |

## Webhook Setup

```bash
# Create webhook on target repo (e.g., DingJun1028/esggo)
curl -X POST \
  -H "Authorization: token $(gh auth token)" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/DingJun1028/esggo/hooks \
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

## Health Check Endpoints

- `GET /` - Returns `esggo-auto-repair:ok`
- `GET /health` - Returns queue status, webhook config status, PAT config status
- `POST /github/webhook` - Receives GitHub webhook events

## Secrets Verification Commands

### Check wrangler secrets
```bash
npx wrangler secret list
# Expected: Should show WEBHOOK_SECRET, REPAIR_PAT
# If empty `[]`: Secrets are MISSING
```

### Check GitHub secrets
```bash
gh secret list --repo DingJun1028/esggo-learning-center
# Verify WEBHOOK_SECRET and REPAIR_PAT exist
```

### Health endpoint verification
```bash
curl https://esggo-auto-repair.dingjunhong1028.workers.dev/health
# Returns: {"status":"ok","queue":true,"webhookConfigured":false,"patConfigured":false}
# - queue: true if REPAIR_QUEUE binding exists
# - webhookConfigured: true if WEBHOOK_SECRET is set
# - patConfigured: true if REPAIR_PAT is set
```

## Cloudflare API Verification

### Get Account ID
```bash
npx wrangler whoami 2>&1 | grep "Account ID" | awk '{print $3}'
# Returns: d9d7ecd92cbad6d858fba3e529b9cb7b
```

### Check queue status via API
```bash
curl -s "https://api.cloudflare.com/client/v4/accounts/<account_id>/workers/queues/esggo-repair-queue" \
  -H "Authorization: Bearer <api_token>" | jq '.result | {queue_name, producers_total_count, consumers_total_count}'
```

## Known Issues

1. **Secret Sync Delay**: After `gh secret set`, the consumer may show `REPAIR_PAT not configured` for several minutes. Wait 5-10 minutes before re-deploying.
2. **GitHub Secret Name Restriction**: Secret names cannot start with `GITHUB_`. Use `WEBHOOK_SECRET` instead of `GITHUB_WEBHOOK_SECRET`.
3. **Trusted Repos**: The webhook handler only processes PRs from repos in `TRUSTED_REPOS` list in `src/index.ts`.
4. **DLQ Must Have 0 Consumers**: The dead letter queue should have no consumers. If it does, investigate the consumer logic.
5. **Worker URL Format**: The worker URL format is `https://<worker-name>.<account-id>.workers.dev` (note: uses account ID, not username).