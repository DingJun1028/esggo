---
name: github-actions-worker-deploy
description: "Patterns for GitHub Actions CI/CD workflows that deploy Cloudflare Workers via wrangler-action. Covers worker/src/index.ts TypeScript compile checks, secrets management, and the auditSink defensive-brace pitfall from PR #400."
version: 1.0.0
author: Hermes Agent (DingJun1028)
platforms: [linux, macos, windows]
---

# GitHub Actions Cloudflare Workers Deploy

## Overview
Pattern for CI/CD workflows that build and deploy Cloudflare Workers using `cloudflare/wrangler-action@v3` in GitHub Actions.

## Key Pitfall (PR #400 regression)
PR #400 (`386cb47`) added a defensive `if (ctx && typeof ctx.waitUntil === 'function') {` block to `auditSink` in `worker/src/index.ts` but **forgot the closing `}`**. `wrangler-action@v3` runs `npx tsc --noEmit` before deploy, so the TypeScript TS1005 error blocked the entire Cloudflare Workers deployment.

**Fix** (commit `1bd4966`): Added the missing `}` after `}).catch(() => {}));` in `auditSink`.

```typescript
// ❌ Broken — PR #400 had this:
function auditSink(ctx: ExecutionContext, event: Record<string, unknown>) {
  const record = { ts: Date.now(), ...event };
  if (ctx && typeof ctx.waitUntil === 'function') {   // ← opened if-block
    ctx.waitUntil(fetch('https://esggo.co/api/audit', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-omni-token': 'internal' },
      body: JSON.stringify(record),
    }).catch(() => {}));
  }  // ← MISSING closing brace — caused TS1005
}

// ✅ Fixed:
function auditSink(ctx: ExecutionContext, event: Record<string, unknown>) {
  const record = { ts: Date.now(), ...event };
  if (ctx && typeof ctx.waitUntil === 'function') {
    ctx.waitUntil(fetch('https://esggo.co/api/audit', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-omni-token': 'internal' },
      body: JSON.stringify(record),
    }).catch(() => {}));
  }  // ← closing brace present
}
```

## deploy-worker.yml Checklist
- `workingDirectory: worker` must match the directory containing `tsconfig.json` and `src/`
- `secretKeys` must match secrets defined in repo Settings → Secrets and variables → Actions
- Worker tests (vitest) run separately via `worker/__tests__/worker.test.ts` — they don't block deploy, but CI may catch issues earlier

## Secrets Required (GitHub Repo Secrets)
| Secret | Purpose |
|---|---|
| `CF_API_TOKEN` | Cloudflare API token for wrangler-action |
| `CF_ACCOUNT_ID` | Cloudflare account ID |
| `OPENROUTER_API_KEY` | Upstream AI provider |
| `GROQ_API_KEY` | Upstream AI provider |
| `GEMINI_API_KEY` | Upstream AI provider |

## Verify Before Pushing (pre-deploy TS check)
```bash
cd worker && npx tsc --noEmit -p tsconfig.json
echo $?  # must be 0
```