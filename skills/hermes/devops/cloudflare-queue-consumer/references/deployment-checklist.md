# Queue Consumer Deployment Checklist

Use this checklist when deploying a Worker as both producer and consumer for a Cloudflare Queue.

## Pre-Deployment

- [ ] Queue created (`wrangler queues create my-queue`)
- [ ] DLQ created (`wrangler queues create my-queue-dlq`)
- [ ] Worker code has `export default { fetch, queue }` pattern (NOT independent named exports)
- [ ] `wrangler.toml` has `[[queues.consumers]]` section
- [ ] Secrets set (`WEBHOOK_SECRET`, `REPAIR_PAT`, etc.)

## Deployment

- [ ] Run `wrangler deploy --dry-run` to validate config
- [ ] Run `wrangler deploy`
- [ ] Verify producer: `wrangler queues info my-queue` shows "Producers: worker:my-worker"
- [ ] Add consumer: `wrangler queues consumer add my-queue my-worker`

## Post-Deployment

- [ ] Wait 5-10 minutes for Secrets sync (critical!)
- [ ] Send test webhook event
- [ ] Check consumer logs: `wrangler tail my-worker --format json`
- [ ] Verify DLQ is empty: `wrangler queues info my-queue-dlq`
- [ ] Run health check: `bash queue_healthcheck.sh`

## Troubleshooting

### "REPAIR_PAT not configured" in consumer
1. Wait 5-10 minutes (Secret sync delay)
2. Check Cloudflare Dashboard → Settings → Secrets
3. Re-deploy with `--keep-vars` if needed

### "Queue handler is missing" error
1. Worker must use `export default { fetch, queue }` object
2. DO NOT use `export async function queue()` as independent named export

### Consumer not processing messages
1. Verify consumer is bound: `wrangler queues consumer list my-queue`
2. Check worker is running: `wrangler tail my-worker`
3. Verify queue has messages in Cloudflare Dashboard