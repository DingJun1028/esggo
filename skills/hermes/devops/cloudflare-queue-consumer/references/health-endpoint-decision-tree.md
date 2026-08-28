# Health Endpoint Decision Tree for Queue Consumers

## Quick Reference: Interpreting Health Endpoint Results

### Health Endpoint Response Format
```bash
curl -s https://<worker-name>.workers.dev/health | jq
```

Response:
```json
{
  "status": "ok",
  "queue": true,
  "webhookConfigured": false,
  "patConfigured": false
}
```

### Field Meanings
| Field | Description | Impact if false |
|-------|-------------|-----------------|
| `queue` | Queue binding exists | Consumer won't start |
| `webhookConfigured` | WEBHOOK_SECRET is set | Webhook events won't be accepted |
| `patConfigured` | REPAIR_PAT is set | Messages will fail in consumer |

### Decision Tree

```
┌─────────────────────────────────────┐
│ Health Endpoint Response            │
└─────────────────────────────────────┘
                  │
          ┌───────┴───────┐
          │ queue = false?│
          └───────┬───────┘
                  │
              ┌───┴───┐
              │  YES  │
              │ CRITICAL: Check wrangler.toml queue binding
              │         [[queues.consumers]] section exists?
              │         Queue name matches?
              └───┬───┘
                  │
          ┌───────┴───────┐
          │ queue = true? │
          └───────┬───────┘
                  │
              ┌───┴───┐
              │  YES  │
              │ Now check secrets
              └───┬───┘
                  │
          ┌───────┴───────┐
          │ Both secrets  │
          │ configured?   │
          └───────┬───────┘
                  │
          ┌───────┴───────┐
          │       NO      │
          │ Check which   │
          │ secret is     │
          │ missing       │
          └───────┬───────┘
                  │
        ┌─────────┼─────────┐
        │         │         │
    webhookConfigured  patConfigured
    = false           = false
        │         │         │
        └───┬───┘     └───┬───┘
            │             │
    Set WEBHOOK_SECRET   Set REPAIR_PAT
    via gh secret set    via gh secret set
    -b "<value>"         -b "<value>"
```

### Action Matrix

| Scenario | Command |
|----------|---------|
| Missing both secrets | `gh secret set WEBHOOK_SECRET -b "..." && gh secret set REPAIR_PAT -b "..."` |
| Missing WEBHOOK_SECRET only | `gh secret set WEBHOOK_SECRET -b "..."` |
| Missing REPAIR_PAT only | `gh secret set REPAIR_PAT -b "..."` |
| Secrets set but not working | Redeploy: `wrangler deploy --keep-vars` |

### Critical Warning
A queue showing `queue: true` but `patConfigured: false` will accept messages but the consumer will fail to process them, causing them to accumulate in the DLQ. Always verify all three fields are `true`.

## Session 2026-07-31 Finding
In the July 31, 2026 session, the health endpoint returned:
```json
{"status":"ok","queue":true,"webhookConfigured":false,"patConfigured":false}
```

This indicated:
- ✅ Queue infrastructure healthy
- ❌ Worker cannot process messages (missing PAT)
- ❌ Webhook endpoint not functional (missing secret)

**Action Required**: Set both secrets and redeploy.