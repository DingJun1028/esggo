---
name: nextjs-middleware-debugging
description: Fix stale Next.js middleware auth and port conflicts.
---

# Next.js Middleware Debugging (Production)

Use when middleware source changes don’t appear in live responses, or when auth/public route changes in `middleware.ts` still return old behavior on a deployed Next.js app.

## Core pitfall

Next.js 15/16 with Turbopack compiles `middleware.ts` into cached edge chunks under `.next/server/edge/chunks/`. Editing `src/middleware.ts` alone does **not** change runtime behavior. The running server continues to use the old compiled chunk until the app is rebuilt or the `.next` cache is invalidated.

## Safe patch/rebuild flow

1. **Patch the source** (`src/middleware.ts` or equivalent).
2. **Rebuild the app** from the app root that owns the middleware:
   ```bash
   cd /var/www/esggo            # or project root
   pnpm run build               # or next build
   ```
   If `pnpm approve-builds --all` has not been run, run it first; otherwise `pnpm install` may hang interactively.
3. **Restart the service** (pm2 or systemd, not both).
4. **Verify**:
   - The compiled middleware chunk’s mtime is newer than before:
     ```bash
     find .next/server/edge/chunks -name '*root-of-the-server*' -printf '%T@ %p\n' | sort -n | tail -3
     ```
   - The route now returns the expected response.

## Dual manager port conflict

If both `systemd` (`/etc/systemd/system/<app>.service`) and `pm2` try to start the same Next.js app on the same port:
- Result: `EADDRINUSE` loops; pm2 reports `online` while the actual bind fails.
- Fix: Pick **one** manager.
  - Disable systemd: `sudo systemctl disable <app>.service && sudo systemctl stop <app>.service`
  - Use pm2 exclusively: `pm2 delete <app> && pm2 start npm --name <app> -- start`
- Verify: `ss -ltnp | grep :<port>` shows a single listener with the expected pid.

## Temporary bypass via env

For diagnosis, a middleware auth block can be conditioned on an env flag:

```ts
if (isProtectedApi && process.env.EVIDENCE_UPLOAD_PUBLIC !== '1') {
  // auth check...
}
```

Launch with `EVIDENCE_UPLOAD_PUBLIC=1 pm2 start npm --name esggo-core -- start`. Remove before returning to production.

## Public route declaration

In `readonly string[]` arrays, use **string literals** (`'/api/evidence-upload'`), not regex literals (`/api/evidence-upload`). Turbopack rejects regex literals with `Unknown regular expression flags`.

Move public upload routes into `PUBLIC_ROUTES`, not `PROTECTED_API_PREFIXES`.

## Route rebuild gotcha

`next build app/api/agentic-twin/route.ts` can misparse the route file as a directory, producing:
`ENOTDIR: stat '/.../route.ts/.env.production'` and `mkdir '/.../route.ts/.next'` failures.

**Fix:** always build from the project root without a route-file argument:
```bash
cd /var/www/esggo && rm -rf .next && pnpm run build
```
If only one route needs refresh, delete its compiled dir first:
```bash
rm -rf .next/server/app/api/<route-handle>
```

## Docker port bind conflict

`EADDRINUSE` may come from Docker, not just systemd/pm2:
```bash
sudo lsof -iTCP:3000 -sTCP:LISTEN
# if COMMAND is docker-pr:
sudo docker ps --filter 'publish=3000'
sudo docker stop <container> && sudo docker rm <container>
```

## Verification checklist

- [ ] `middleware.ts` source patched
- [ ] App rebuilt from project root (`pnpm run build` exit 0)
- [ ] Compiled route chunk `.next/server/app/api/<route-handle>/route.js` mtime is newer
- [ ] Service restarted under single manager
- [ ] `ss -ltnp` shows expected pid on expected port (no docker-pr conflict)
- [ ] Route returns new behavior (not cached old response)