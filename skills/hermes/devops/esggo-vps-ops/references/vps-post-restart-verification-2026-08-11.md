# VPS esggo-core/post-restart verification — 2026-08-11 additions

Context: after the initial recovery in `vps-core-recovery-2026-08-11.md`, live integration tests exposed additional deploy/env issues on `161.118.248.180`.

## Verified fixes and checks

### 1) pnpm approve-builds blocks non-interactive deploy
`pnpm approve-builds --all` must run before any `pnpm install` on this workspace, otherwise postinstall prompts block automation. Safe one-liner on the VPS:
```bash
cd /var/www/esggo && pnpm approve-builds --all >/dev/null 2>&1 || true
```

### 2) pm2 online ≠ server bound
`pm2 start npm --name esggo-core --cwd /var/www/esggo -- start` can briefly show `online` with `0s` uptime and `N/A pid`. After restart, always verify:
```bash
sleep 3
pm2 status esggo-core
ss -ltnp | grep ':3000'
curl -sS http://127.0.0.1:3000/
```

### 3) Stale pm2 error logs
`/home/ubuntu/.pm2/logs/esggo-core-error.log` can retain old `EADDRINUSE` traces from prior failed starts. If current `pm2 status` and `ss -ltnp` are healthy but the log still shows `EADDRINUSE`, ignore the stale tail; do not conclude the bind is failing from old log lines alone.

### 4) nginx -t can fail on unrelated site cert permissions
`nginx -t` may error on a different site's `privkey.pem` symlink even when the site under repair is fine. Example: `deerflow.esggo.co` symlink under `/etc/letsencrypt/live/` owned by `root:root` with mode `640` caused full-config test failure. Fix path perms or temporarily remove broken symlinks when validating only the deploy under repair.

### 5) Route env loading check
After adding runtime env vars for new Next routes (e.g. `AGENTIC_TWIN_OLLAMA_URL`, `MINIO_*`), confirm they actually reached the running process:
```bash
tr '\0' '\n' < /proc/$(pgrep -f 'next start'|head -1)/environ | grep -cE 'AGENTIC_TWIN_OLLAMA_URL|MINIO_ENDPOINT'
```
Expected ≥1. Route-level fallbacks such as `llmEnhanced:false` or `Missing authorization token` are often env/loading issues rather than code breakage.

### 6) Middleware auth surface
`src/middleware.ts` protects `/api/evidence*` via `PROTECTED_API_PREFIXES`. Without a valid Firebase ID token, these endpoints return 401 before the route handler runs. Integration tests against live must supply a real token; a 401 is not evidence of route breakage.

### 7) MinIO SigV4 smoke test
When `/api/evidence-upload` appears broken, a host-side minimal `PUT` with hand-rolled SigV4 is a useful isolation check. If this succeeds, the endpoint, bucket, and credentials are fine; the issue is in the web handler, middleware, or request construction.

### 8) Ollama model tag alignment
`AGENTIC_TWIN_OLLAMA_MODEL` must match an existing Ollama model tag. A mismatched tag silently falls back to heuristic analysis with `llmEnhanced:false`. Verify with:
```bash
ollama list | grep '^qwen'
curl -s http://127.0.0.1:11434/api/chat -X POST -H 'Content-Type: application/json' -d '{"model":"<tag>","messages":[{"role":"user","content":"ping"}],"stream":false}'
```
Then `pm2 restart esggo-core --update-env`.
