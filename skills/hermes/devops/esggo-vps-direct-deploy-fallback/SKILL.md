---
name: esggo-vps-direct-deploy-fallback
description: Use when esggo git push is blocked; deploy direct to VPS.
---

# ESGGO VPS Direct Deploy Fallback

## When to use
- `git push origin main` rejected: non-fast-forward, unrelated histories, or repeated rebase failures
- Local commit exists but remote `origin/main` has advanced and merge is not clean
- You still need the VPS at `161.118.248.180` to run the new code without waiting for GitHub sync

## Verified recipe (2026-08-15)

### 1) Prepare local commit
```bash
cd /c/Project/esggo
git add <paths>
git commit -m "fix: ..."
```

### 2) SCP changed files to VPS upload staging
```bash
scp -i ~/.ssh/ci_deploy_key \
  src/lib/webhook-auth.ts \
  src/lib/zenrows-client.ts \
  src/agents/omni-singularity.ts \
  app/api/verify-5t/route.ts \
  app/api/sonnar/crawl/route.ts \
  app/api/zenrows/fetch/route.ts \
  src/lib/__tests__/zenrows-client.test.ts \
  ubuntu@161.118.248.180:/var/www/esggo/
```

### 3) On VPS: relocate, rebuild, restart
```bash
ssh -i ~/.ssh/ci_deploy_key ubuntu@161.118.248.180
cd /var/www/esggo
mkdir -p src/lib/__tests__ app/api/verify-5t app/api/sonnar/crawl app/api/zenrows/fetch
mv -f webhook-auth.ts src/lib/
mv -f zenrows-client.ts src/lib/
mv -f omni-singularity.ts src/agents/
mv -f verify-5t/route.ts app/api/verify-5t/  2>/dev/null || true
mv -f sonnar/crawl/route.ts app/api/sonnar/crawl/ 2>/dev/null || true
mv -f zenrows/fetch/route.ts app/api/zenrows/fetch/ 2>/dev/null || true
rm -f route.ts zenrows-client.test.ts
rm -rf .next
timeout 240 node_modules/.bin/next build > /tmp/build_vps_direct.log 2>&1 || echo build_exit:$?
pm2 restart esggo-core --update-env
```

### 4) Verify
- `curl -s http://127.0.0.1:3000/api/health` → `{"status":"healthy"}`
- `curl -s https://esggo.co/api/health` → HTTP 200
- `curl -s 'https://esggo.co/api/health?format=metrics'` → Prometheus metrics

## Pitfalls
- SCP staging path is `/var/www/esggo/`, not a subdir; stray `route.ts` or `*.test.ts` at repo root can break `next build` if not moved/removed.
- `.next` must be removed before `next build` after source changes.
- `pm2 restart esggo-core --update-env` is required if new files reference new env vars.
- This fallback changes production before GitHub history does. Revisit git sync later; do not leave the repo dirty.