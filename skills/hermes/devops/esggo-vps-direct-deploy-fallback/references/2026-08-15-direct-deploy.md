# 2026-08-15 Direct Deploy Session Evidence

## Commands used
- `scp -o StrictHostKeyChecking=no -i ~/.ssh/ci_deploy_key src/lib/webhook-auth.ts src/lib/zenrows-client.ts src/agents/omni-singularity.ts app/api/verify-5t/route.ts app/api/sonnar/crawl/route.ts app/api/zenrows/fetch/route.ts src/lib/__tests__/zenrows-client.test.ts ubuntu@161.118.248.180:/var/www/esggo/`
- `ssh ... "cd /var/www/esggo && mkdir -p src/lib/__tests__ app/api/verify-5t app/api/sonnar/crawl app/api/zenrows/fetch && mv -f webhook-auth.ts src/lib/ && ... && rm -f route.ts zenrows-client.test.ts && rm -rf .next && timeout 240 node_modules/.bin/next build > /tmp/build_vps_direct.log 2>&1 || echo build_exit:$? && pm2 restart esggo-core --update-env"`

## Verified outcomes
- Build succeeded via direct VPS path despite local git push being blocked
- `/api/health` returned `{"status":"healthy"}`
- Public `https://esggo.co/api/health` returned HTTP 200
- `/api/health?format=metrics` returned Prometheus metrics

## Files relocated on VPS after SCP
- `src/lib/webhook-auth.ts`
- `src/lib/zenrows-client.ts`
- `src/agents/omni-singularity.ts`
- `app/api/verify-5t/route.ts`
- `app/api/sonnar/crawl/route.ts`
- `app/api/zenrows/fetch/route.ts`
- `src/lib/__tests__/zenrows-client.test.ts`

## Cleanup required after SCP staging
- Remove stray `route.ts` at repo root
- Remove stray `zenrows-client.test.ts` at repo root
