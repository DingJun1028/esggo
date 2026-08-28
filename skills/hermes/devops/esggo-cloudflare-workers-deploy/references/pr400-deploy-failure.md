# Cloudflare Workers Deploy Failure — PR #400 (2026-07-27)

## What happened
PR #400 (`chore: enforce Omni Restoration evidence schema on IComponentCore`) was pushed to `main`. The Cloudflare Workers deploy (`deploy-worker.yml` workflow) FAILED with `conclusion: failure`.

## Root cause
PR #400 introduced a defensive `if` block in `auditSink()` within `worker/src/index.ts` (PR diff):
```diff
-  ctx.waitUntil(fetch('https://esggo.co/api/audit', {
+  if (ctx && typeof ctx.waitUntil === 'function') {
+    ctx.waitUntil(fetch('https://esggo.co/api/audit', {
```
The closing `}` for the `if` block was **never added** before the function's own closing `}`. This shifted the brace count from 125/125 (balanced) to 126/125 (unbalanced — one extra `{`).

**TypeScript error:** `worker/src/index.ts(310,1): error TS1005: '}' expected`
**wrangler-action@v3** aborted on this compile error.

## Fix applied
Two commits pushed to `origin/main`:

1. **`1bd4966`** — `fix: close missing brace in auditSink if-block (PR #400 regression)`
   - Added `  }` to close the `if` block in `auditSink()` before the function's `}`
   - TypeScript check passes (exit 0)

2. **`d0f278f`** — `chore: pin wrangler-action@v4 for Cloudflare Workers deploy stability`
   - Upgraded `cloudflare/wrangler-action@v3` → `@v4` in `deploy-worker.yml`
   - `wrangler-action@v4` uses the repo's own TypeScript installation instead of bundling a stale tsc that was printing the "not the tsc command you are looking for" npm warning (tsc@2.0.4)

## Verification
- `npx tsc --noEmit -p worker/tsconfig.json` → exit 0 (PASS)
- `cloudflare/wrangler-action@v4` in deploy-worker.yml (verified)
- Next push to `worker/**` triggers deploy automatically

## Lesson captured in skill
The `auditSink` brace pitfall is documented in the `esggo-cloudflare-workers-deploy` skill under "TS1005: '}' expected (auditSink brace pitfall)" — the exact diff pattern, exit code, and fix.