# Cloudflare Queue Processing Latency

## Problem

After sending a message to a Cloudflare Queue via webhook, the consumer may not process the message immediately. This leads to:
- No immediate logs in `wrangler tail`
- Delayed processing (seconds to minutes)
- Apparent "stuck" behavior

## Root Cause

Cloudflare Queues uses eventual consistency. Messages are not immediately delivered to consumers. The `max_batch_timeout` setting controls the polling interval.

## Solution

1. **Reduce max_batch_timeout** for faster processing:
```toml
[[queues.consumers]]
queue = "my-queue"
max_batch_timeout = 1  # Default is 30 seconds, reduce to 1-5 for testing
```

2. **Monitor DLQ** for failed messages:
```bash
npx wrangler queues info my-queue-dlq
```

3. **Check consumer status**:
```bash
npx wrangler queues info my-queue
# Verify: Number of Consumers: 1
```

## Debugging Checklist

- [ ] Verify Secrets are set correctly (cannot start with `GITHUB_`)
- [ ] Check queue has 1 consumer
- [ ] Reduce `max_batch_timeout` to 1 second
- [ ] Wait 10-30 seconds for message processing
- [ ] Check DLQ for failed messages

## Common Error Pattern

```
REPAIR_PAT not configured
```

This error can occur even when the secret is set correctly. The issue is often:
1. Secret name mismatch (`GITHUB_WEBHOOK_SECRET` vs `WEBHOOK_SECRET`)
2. Worker not re-deployed after secret changes
3. Queue consumer not receiving messages due to latency