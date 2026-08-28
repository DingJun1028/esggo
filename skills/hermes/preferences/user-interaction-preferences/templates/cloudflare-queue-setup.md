# Cloudflare Workers Queue Setup Template

## wrangler.toml Configuration

```toml
# Queue Producer
[[queues.producers]]
queue = "YOUR-QUEUE-NAME"
binding = "QUEUE_BINDING"

# Queue Consumer
[[queues.consumers]]
queue = "YOUR-QUEUE-NAME"
max_batch_size = 5
max_retries = 3
max_batch_timeout = 10
dead_letter_queue = "YOUR-QUEUE-NAME-dlq"
```

## Worker Code Template

```typescript
// index.ts
export default {
  fetch: app.fetch,
  async queue(batch: MessageBatch<MessageType>, env: Env, ctx: ExecutionContext): Promise<void> {
    for (const msg of batch.messages) {
      const job = msg.body;
      console.log(JSON.stringify({
        event: 'queue.start',
        repo: job.repo,
        prNumber: job.prNumber,
        action: job.action,
      }));

      if (!env.YOUR_SECRET) {
        console.error(JSON.stringify({
          event: 'queue.error',
          error: 'YOUR_SECRET not configured',
        }));
        msg.retry({ delaySeconds: 60 });
        continue;
      }

      try {
        // Your processing logic
        const result = await processJob(job, env.YOUR_SECRET);
        console.log(JSON.stringify({
          event: 'queue.complete',
          result,
        }));
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        console.error(JSON.stringify({
          event: 'queue.error',
          error: errorMsg,
        }));
        msg.retry({ delaySeconds: 30 });
      }
    }
  },
};
```

## Secrets Setup

```bash
# Set secrets
echo "value" | gh secret set SECRET_NAME -R owner/repo --body /dev/stdin

# List secrets
gh secret list -R owner/repo

# Check queue status
npx wrangler queues list
npx wrangler queues info queue-name
```

## Common Pitfalls

1. **Secrets sync delay**: Wait 5-10 minutes after deployment
2. **GITHUB_ prefix**: GitHub blocks secrets starting with `GITHUB_`
   - Use `WEBHOOK_SECRET` instead of `GITHUB_WEBHOOK_SECRET`
3. **max_batch_timeout**: Default is 30s; set lower for faster processing
4. **DLQ**: Always configure dead_letter_queue for failed messages