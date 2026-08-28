# VPS Endpoint Debug Session — 2026-08-15

## Context
Stabilize `/api/agentic-twin` true LLM path, `/api/evidence-upload` public access, integrate OCI/DB creds, and harden webhook auth on `ubuntu@161.118.248.180`.

## Real verification evidence
- `/api/evidence-upload` POST → HTTP 200, MinIO URL returned.
- `/api/agentic-twin` POST with valid JSON body via `--data-binary @/tmp/twin_good.json` → HTTP 200, `llmEnhanced: true`.
- `/api/health?detail=true` → HTTP 200, components `redis=healthy`, `agnes_api=missing_keys`, `firebase_admin=missing_config`, `celestial_flow=active`, `esgsonar_gateway=healthy`.
- `/api/health?format=metrics` → HTTP 200 JSON. NOTE: metrics format currently returns JSON, not Prometheus text/plain. Route source may be under `src/app/api/health/route.ts` instead of `app/api/health/route.ts`; verify build artifact before changing nginx/metrics scrape.

## Commands that worked
```bash
# Write JSON payload safely through SSH
ssh ubuntu@161.118.248.180 "python3 -c 'import json; open(\"/tmp/twin_good.json\",\"w\").write(json.dumps({...}))'"
ssh ubuntu@161.118.248.180 "curl -s -m240 -w '\nHTTP_%{http_code}\n' http://127.0.0.1:3000/api/agentic-twin -H 'Content-Type: application/json' --data-binary @/tmp/twin_good.json"

# pm2 over SSH when PATH is broken
ssh ubuntu@161.118.248.180 "env PATH=/usr/bin:/usr/local/bin:/usr/sbin:/bin /usr/lib/node_modules/pm2/bin/pm2 restart esggo-core --update-env"
```

## Root causes found
- `src/app/api/...` route files do not always compile into `.next/server/app/api/...` if a duplicate route exists under `app/api/...`. Always inspect `.next/server/app/api/<route>/route.js` after build.
- `next build` is not caching `/api/agentic-twin` route code changes reliably; full clean rebuild `rm -rf .next && next build` was required after edits.
- `.env` Chinese comments can blank runtime env vars; rewrite to pure ASCII.

## Pending
- Real OCI private key content not yet inserted into `/var/www/esggo/oci_user.pem`.
- Webhook HMAC helper `src/lib/webhook-auth.ts` committed but not yet integrated into actual inbound webhook routes.
- Metrics endpoint currently returns JSON; if Prometheus scrape is needed, ensure the compiled route emits `text/plain; version=0.0.4`.
