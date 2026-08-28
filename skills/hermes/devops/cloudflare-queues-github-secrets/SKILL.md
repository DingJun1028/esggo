---
name: cloudflare-queues-github-secrets
description: Cloudflare Workers Queues with GitHub webhook integration, handling GitHub Actions Secret naming constraints and webhook signature verification.
tags:
  - cloudflare
  - github
  - workers
  - queues
  - webhook
  - secrets
---

# Cloudflare Workers Queues + GitHub Webhook Integration

## Overview

This skill covers deploying Cloudflare Workers with Queue bindings for GitHub webhook processing, including handling GitHub Actions Secret naming constraints.

## GitHub Secret Naming Constraint

**Critical**: GitHub Actions Secrets cannot start with `GITHUB_` prefix. GitHub API returns HTTP 422 for such names.

### Safe Secret Names

| Problematic Name | Safe Alternative |
|------------------|-------------------|
| `GITHUB_WEBHOOK_SECRET` | `WEBHOOK_SECRET` |
| `GITHUB_TOKEN` | `GITHUB_PAT` or `ACCESS_TOKEN` |
| `GITHUB_API_KEY` | `API_KEY` |

### Code Example

```typescript
// wrangler.toml
[[queues.producers]]
queue = "my-queue"
binding = "QUEUE"

[[queues.consumers]]
queue = "my-queue"
max_batch_size = 10
max_retries = 3
dead_letter_queue = "my-queue-dlq"

// src/index.ts
export interface Env extends CloudflareBindings {
  WEBHOOK_SECRET?: string;  // Note: NOT GITHUB_WEBHOOK_SECRET
  REPAIR_PAT?: string;
  AUTO_MERGE?: boolean;
}
```

## Webhook Signature Verification

Always verify GitHub webhook signatures using HMAC-SHA256 in the Worker runtime via `crypto.subtle.importKey` + `crypto.subtle.sign`. Use `string | null | undefined` for the signature header parameter since `c.req.header()` returns all three in Hono.

```typescript
async function verifyWebhookSignature(
  payload: string,
  signatureHeader: string | null | undefined,
  secret: string
): Promise<boolean> {
  if (!signatureHeader) return false;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const expectedSig = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  const expectedHex = Array.from(new Uint8Array(expectedSig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  const prefix = 'sha256=';
  const received = signatureHeader.startsWith(prefix) 
    ? signatureHeader.slice(prefix.length) 
    : signatureHeader;
  // ... timing-safe comparison
}
```

## Queue Consumer Handler Pattern

```typescript
export default {
  fetch: app.fetch,
  async queue(batch: MessageBatch<MyJob>, env: Env, ctx: ExecutionContext) {
    for (const msg of batch.messages) {
      const job = msg.body;
      try {
        await processJob(job, env);
      } catch (err) {
        console.error('Queue error:', err);
        msg.retry({ delaySeconds: 30 });
      }
    }
  },
};
```

## References

- Cloudflare Wrangler Queues: https://developers.cloudflare.com/queues/
- GitHub Webhook Events: https://docs.github.com/en/developers/webhooks-and-events/webhooks/webhook-events-and-payloads

## Queue Processing Latency

Cloudflare Queues has eventual consistency for message delivery. Messages may take several seconds to be processed by the consumer after being sent. The `max_batch_timeout` setting controls how long the consumer waits before processing a batch.

**Recommendation**: Set `max_batch_timeout` to a lower value (1-5 seconds) for faster message processing during development and testing. Production workloads may benefit from higher values (10-30 seconds) to batch multiple messages.

```toml
[[queues.consumers]]
queue = "my-queue"
max_batch_size = 10
max_retries = 3
max_batch_timeout = 1  # Lower for faster processing
dead_letter_queue = "my-queue-dlq"
```

## Windows PowerShell Pitfalls

### curl Alias Conflict

On Windows PowerShell 5.1, `curl` is a built-in alias for `Invoke-WebRequest`, not the real `curl.exe`. `Invoke-WebRequest` requires a `-Uri` parameter, so bare `curl https://...` fails with "Missing mandatory parameter: Uri".

**Fix**: Use `curl.exe` explicitly to bypass the alias:
```powershell
curl.exe -s https://example.com
```

Or remove the alias in the session:
```powershell
Remove-Item Alias:curl -Force
```

### wget and cat Aliases

Similarly, `wget` and `cat` are aliases that shadow the real executables on Windows PowerShell.

## Module Workers Queue Handler Pattern

For Cloudflare Module Workers, the queue handler MUST be part of the default export object, not a separate named export:

```typescript
// CORRECT - queue handler in default export
export default {
  fetch: app.fetch,
  async queue(batch: MessageBatch<RepairJob>, env: Env, ctx: ExecutionContext) {
    // handler logic
  },
};

// INCORRECT - separate named export
export async function queue(...) { ... }
export default app;
```

## Trust List Management

Always maintain a `TRUSTED_REPOS` list to filter webhook events:
```typescript
const TRUSTED_REPOS = [
  'DingJun1028/esggo',
  'DingJun1028/esggo-learning-center',
  // add other trusted repos
];

function isTrustedRepo(repo: string): boolean {
  return TRUSTED_REPOS.some((t) => repo.startsWith(t));
}
```