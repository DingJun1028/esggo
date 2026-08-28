# Queue Health Check Reference

## Script Location

The queue health check script is located at:
`cloudflare-queue-consumer/scripts/queue_healthcheck.sh`

## Usage

```bash
# Run from the worker directory
cd /c/Project/esggo-learning-center/esggo-auto-repair/worker
bash queue_healthcheck.sh
```

## Expected Output Format

```
[queue-health] 2026-07-29 17:57 OK consumer_count=1 dlq_messages=0
```

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | OK - Queue healthy, consumer active, DLQ empty |
| 1 | FAIL - Queue error, no consumer, or CD failure |

## Output Status Types

| Status | Condition |
|--------|-----------|
| OK | Consumer count ≥ 1, DLQ messages = 0 |
| FAIL | Consumer count = 0, or queue info error |
| WARN | DLQ messages > 0 |

## Manual Health Check Commands

```bash
# Check main queue
wrangler queues info esggo-repair-queue

# Check DLQ
wrangler queues info esggo-repair-dlq

# List consumers
wrangler queues consumer list esggo-repair-queue

# Stream logs
wrangler tail --format json
```

## Cron Job Setup

```bash
# Add to crontab (every 5 minutes)
*/5 * * * * cd /c/Project/esggo-learning-center/esggo-auto-repair/worker && bash queue_healthcheck.sh >> /var/log/queue-health.log 2>&1
```

## Health Endpoint

```bash
# Check worker health
curl https://esggo-auto-repair.dingjunhong1028.workers.dev/health

# Response
{
  "status": "ok",
  "queue": true,
  "webhookConfigured": true,
  "patConfigured": true
}
```

## Common Issues

### Consumer Count = 0
1. Check if worker is deployed: `wrangler deployments list`
2. Re-add consumer: `wrangler queues consumer add esggo-repair-queue esggo-auto-repair --batch-size 5 --message-retries 3`

### DLQ Messages > 0
1. Check logs: `wrangler tail --search "error"`
2. Identify failure pattern
3. Fix underlying issue
4. Re-process failed messages

### Secrets Not Synced
Wait 5-10 minutes after setting secrets via `gh secret set` before expecting them in the consumer.