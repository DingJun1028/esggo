---
name: vps-next-service-recovery
description: Recover Next.js/PM2 on VPS after 502/EADDRINUSE.
---

# VPS Next.js Service Recovery

Use this when the running Next.js app behind nginx shows `502`, `Connection reset by peer`, route auth failures, or stale log lines that no longer match current `pm2 status`.

## Core principle

Treat `pm2 online` as necessary but not sufficient. Always verify bind, HTTP, and live endpoint in three separate checks before declaring recovery.

## Port-EADDRINUSE recovery

1. Identify holder: `ss -ltnp | grep ':3000'` or `fuser 3000/tcp`.
2. Kill holder pid: `kill <pid>`. On VPS the holder can be `root`, not only `ubuntu`.
3. Clean stale pm2 entry: `pm2 delete esggo-core` if present.
4. Start from the correct cwd. If `/var/www/esggo/apps/esggo-core` is missing, start from `/var/www/esggo/` itself:
   ```bash
   pm2 start npm --name esggo-core --cwd /var/www/esggo -- start
   ```
5. Verify after `sleep 3`:
   ```bash
   pm2 status esggo-core   # nonzero pid, uptime > 0s
   ss -ltnp | grep ':3000'
   curl -sS http://127.0.0.1:3000/
   curl -sS https://<domain>/
   ```

## pnpm non-interactive prerequisite

If `pnpm install` is involved, pre-approve build scripts or deploy will hang:

```bash
cd /var/www/esggo && pnpm approve-builds --all >/dev/null 2>&1 || true
```

## Env propagation verification

After adding route-specific env vars (e.g. `AGENTIC_TWIN_OLLAMA_URL`, `MINIO_ENDPOINT`, `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY`, `MINIO_BUCKET`), confirm the running process loaded them:

```bash
tr '\0' '\n' < /proc/$(pgrep -f 'next start'|head -1)/environ \
  | grep -cE 'AGENTIC_TWIN_OLLAMA_URL|MINIO_ENDPOINT'
```

Expected output ≥ 1. If 0, the route will silently fall back to heuristic/mock behavior (`llmEnhanced:false`) or `Missing authorization token` from another guard; that is not code breakage.

## Middleware auth surface

A global middleware may protect broad path prefixes before route handlers run. If `/api/evidence-*` returns 401 without a valid Firebase ID token, the route itself may be fine. Integration tests must supply a real token; otherwise the 401 is expected behavior, not a regression.

## nginx -t false negatives

`nginx -t` can fail on an unrelated site's `privkey.pem` symlink and block validation for the site under repair. If the repaired site is live and the failing symlink belongs to another domain, fix or temporarily remove the broken symlink before relying on `nginx -t` for the repair.

## Storage-auth smoke test

When a file-upload route fails with auth/storage errors, isolate with a host-side hand-rolled SigV4 PUT against the same backend (MinIO/S3). If that succeeds, the storage backend and credentials are correct; debug the web handler, middleware, or request construction next.

## Dual-ownership port conflict: systemd + pm2

When both `/etc/systemd/system/esggo-app.service` and a pm2 process try to run `next start -H 127.0.0.1 -p 3000`, recovery appears successful but live requests keep returning `502`. Symptoms:
- `pm2 status esggo-core` shows `online`
- `sudo systemctl status esggo-app.service` shows `active (running)`
- `curl https://esggo.co` is `502`
- `journalctl -u esggo-app.service` and pm2 error logs both show `EADDRINUSE 127.0.0.1:3000`

Fix: keep exactly one supervisor.
```bash
# Disable systemd copy
sudo systemctl disable --now esggo-app.service
# Clean pm2
pm2 delete esggo-core
# Restart from workspace root, not /opt/esggo
cd /var/www/esggo && pm2 start npm --name esggo-core -- start
```
Verify single owner:
```bash
ss -ltnp | grep ':3000'
# expect exactly one next-server pid
```
Legacy docs and `/etc/systemd/system/esggo-app.service` may still point to `/opt/esggo`. The actual repo is `/var/www/esggo`; if you must keep systemd, patch its `WorkingDirectory` and `ExecStart` accordingly and `sudo systemctl daemon-reload`.

## Log interpretation

Stale pm2 error logs can retain old stack traces after recovery. If current `pm2 status`, `ss`, and `curl` all show healthy, ignore old `EADDRINUSE` lines in the log tail; they are history, not current failure.
