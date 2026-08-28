# esggo-core Docker Rescue — validated recipe (2026-08-11)

Concrete sequence that actually brought the B/D-enabled image to a clean build + running container.
Captured because the earlier §C/§D systemd-vs-pm2 note was incomplete; the real blockers were Prisma libssl
(only fixed by Prisma 6 upgrade, not Dockerfile restore) and three independent port-3000 squatters.

## 1. Code fixes (local, committed to origin/main)
- `package.json`: `prisma` + `@prisma/client` `^5.22.0` -> `^6.19.3`.
- `pnpm-workspace.yaml`: add `onlyBuiltDependencies: [tesseract.js, prisma, sqlite3]` (lets `pnpm install`
  pass the build-script gate on CI + docker deps stage).
- `Dockerfile`: builder stage `RUN pnpm run build` -> `RUN npx next build` (bypass pnpm 11 deps-status-check).
  Do NOT downgrade base to alpine3.19 (corepack keyid + node<22.13 breakage). Keep `node:22-alpine`.
  Runner stage: `RUN apk add --no-cache curl` + `RUN mkdir -p /app/data /app/public/uploads`.
- Commit `package.json pnpm-lock.yaml pnpm-workspace.yaml Dockerfile`, push.

## 2. VPS: pull + rebuild
```bash
ssh -i ~/.ssh/ci_deploy_key ubuntu@161.118.248.180
cd /var/www/esggo && git pull origin main
docker rm -f esggo-core 2>&1 | tail -1
nohup docker compose -f vps/docker-compose.yml build esggo > /tmp/docker-build.log 2>&1 &
# tail -c 300 /tmp/docker-build.log   ->  expect "Image vps-esggo Built"
```
Build ~ 48-60s. If it fails on `pnpm install` keyid -> you forgot `onlyBuiltDependencies`. If it fails on
`libssl.so.1.1` at runtime after build -> Prisma still 5.x; you missed the version bump.

## 3. Clear ALL three port-3000 squatters, then start
```bash
pm2 stop esggo-core 2>&1 | tail -1; pm2 delete esggo-core 2>&1 | tail -1
sudo systemctl disable --now esggo-app.service 2>&1 | tail -1
fuser -k 3000/tcp 2>/dev/null; sleep 3
ss -tlnp 2>/dev/null | grep 3000 && echo STILL_HELD || echo PORT_FREE
docker rm -f esggo-core 2>&1 | tail -1
cd /var/www/esggo && docker compose -f vps/docker-compose.yml up -d esggo
sleep 45
docker exec esggo-core wget -q -O - http://127.0.0.1:3000/  | head -c 50   # expect HTML / 200
```
Note: `systemctl disable` without `--now` leaves the process running and it respawns next-server on 3000.
Always re-check `ss -tlnp | grep 3000` is empty before `up -d`.

## 4. Env wiring for B/D (Agentic Twin + Evidence Vault)
VPS `/var/www/esggo/.env` (NOT `.env.local` -- compose `source .env` only):
```
AGENTIC_TWIN_OLLAMA_URL=http://127.0.0.1:11434
AGENTIC_TWIN_OLLAMA_MODEL=qwen2.5:3b-instruct-q4_K_M
MINIO_ENDPOINT=127.0.0.1:19001
MINIO_ACCESS_KEY=***
MINIO_SECRET_KEY=***
MINIO_BUCKET=evidence-vault
MINIO_PUBLIC_BASE=https://esggo.co/evidence
```
`vps/docker-compose.yml` `esggo.environment:` must reference `${AGENTIC_TWIN_OLLAMA_URL:-}` etc.
Verify in-container: `docker exec esggo-core sh -c 'echo $AGENTIC_TWIN_OLLAMA_URL'`.
Live proof: `curl -s https://esggo.co/api/agentic-twin -X POST -d '{"uuid":"x"}'` -> `llmEnhanced:true`.

## 5. Diagnostic decision tree
- build fails on `tesseract.js` -> `npx next build` + `onlyBuiltDependencies`.
- container up but `curl 127.0.0.1:3000` DOWN while `docker exec ... curl 3000` = 200 -> port mapping dead, restart container.
- `/api/healthz` 503 but `/omni/reports` 200 -> incomplete DB/REDIS env; app works, LB gating only.
- external `esggo.co` 502 after container healthy -> Cloudflare Tunnel `/etc/cloudflared/config.yml` proxies to 3000;
  restart `cloudflared` service if origin went away during the port swap.
