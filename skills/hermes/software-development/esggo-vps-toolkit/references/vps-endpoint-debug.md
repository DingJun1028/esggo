# VPS Endpoint Debugging Reference

## Agentic-Twin `/api/agentic-twin` Body Parsing Over SSH
- Symptom: `curl -d '{"a":1}' https://esggo.co/api/agentic-twin` returns JSON parse errors from the route handler.
- Workaround:
  1. Write JSON on VPS: `python3 -c 'import json,sys; json.dump({...}, sys.stdout)' > /tmp/twin.json`
  2. Call with: `curl --data-binary @/tmp/twin.json http://127.0.0.1:3000/api/agentic-twin`
  3. For HTTPS, prefer `--data-binary` over `-d` through SSH.

## Next.js Route Change Rebuild Hygiene
- After editing `app/api/<route>/route.ts`, rebuild may serve stale chunks and return 500 with old error text.
- Fix before rebuild:
  - `rm -rf .next/server/app/api/<route>` or `rm -rf .next && npm run build`
- Verify with `grep` on `.next/server/app/api/<route>` before restarting.

## Root Middleware Public-Route Patch
- `src/middleware.ts` is the active auth gate in production.
- Patching only `esggo-omni-center/src/middleware.ts` has no effect.
- Add public routes to `src/middleware.ts` `PUBLIC_ROUTES`, rebuild, restart.

## OCI / DB Credential Integration
1. Append to `/var/www/esggo/.env` in ASCII only; no Chinese comments.
2. Restart with env reload: `/usr/lib/node_modules/pm2/bin/pm2 restart esggo-core --update-env`
   - On this VPS, `pm2` is not always on PATH; use the absolute path above.
3. Verify with: `cat /proc/<pid>/environ | tr '\0' '\n' | grep '^VAR='`
4. If `OCI_PRIVATE_KEY_PATH` is set, the key file must exist or downstream OCI calls will fail.

## Process / Port Conflict Cleanup
- systemd + pm2 running the same Next.js app causes port 3000 conflicts. Disable systemd; manage only via pm2.
- Stray Docker containers may occupy port 3000. Stop/remove before restart.
- Duplicate pm2 entries cause restart confusion; delete extras: `pm2 delete <id>`.

## Minimal Live Repair Flow
1. Edit source on VPS.
2. Delete stale `.next/server/app/api/<route>`.
3. `next build` with timeout 180-240s.
4. `pm2 restart esggo-core --update-env`.
5. Localhost verify with `--data-binary @file` for JSON APIs.
6. HTTPS verify only after localhost returns 200.
