---
name: docker-compose-vps-debug
description: >-
  Use when migrating VPS workloads to Docker Compose on small cloud hosts,
  or when existing Compose stacks fail to start/health-check. Covers parallel
  host-service conflicts, low-ARM CPU-cap errors, healthcheck design, env-file
  delivery into already-built images, build-time pnpm CI pitfalls, compose
  project-name collapse after host/VPS restore, manual container recreation
  with explicit port publication and network-alias DNS recovery, and tmux
  as an SSH-resilience wrapper for long Docker builds.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [docker, compose, vps, arm64, cloudflare, env-delivery]
    related_skills: [cloudflare-tunnel-vps, cloudflare-ssl-loop]
---

# Docker Compose VPS Debug

## Overview

This skill is for troubleshooting and hardening Docker Compose deployments on
small VPS hosts—especially Oracle Cloud Ampere A1 / ARM64 with 1 CPU. It also
covers SSH-resilience tactics for long builds and reliable secrets delivery
to already-built Gateway images.

## When to Use

- Host process owns a port needed by Compose (`next-server` on `:3000`).
- `docker compose up` fails with `range of CPUs is from 0.01 to 1.00`.
- `pnpm install --production` inside an image aborts with
  `ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY`.
- Healthcheck targets `127.0.0.1:8642/status` but host curl returns `000_`
  while container curl returns `200`.
- Secrets exist in an `env_file`/`.env` on disk but are missing inside the
  running container.

## Required Ordering

1. **Stop conflicting host units first**, not after:
   - `sudo systemctl stop <unit>`
   - `sudo systemctl disable <unit>`
2. **Verify port release** before `docker compose up`.
3. **Fix deploy.resources.limits.cpus** to `<= 0.99` on 1-CPU hosts.
4. **Set `CI=true` + confirmModulesPurge=false** for pnpm in non-interactive image builders.
5. **Validate health endpoints from inside the container** before blaming networking.
6. **Use direct `-e` injection or Docker secrets** when `--env-file` appears ignored by an image.

## Gateway Container Bind Address Failure

Symptom: `docker inspect` shows `Up`, health status may be `starting`/`unhealthy`, `docker logs` show secrets loaded, and internal container curl to `http://127.0.0.1:<port>/status` returns `200`, but host curl returns `000_` or `Empty reply from server`.

Root cause: the app inside the container binds to `127.0.0.1`, while docker-proxy forwards from the host/bridge network. The forwarded connection from `docker-proxy` cannot reach a loopback-only listener inside the container.

Diagnosis:
```bash
# inside container
curl -sS -o /dev/null -w "%{http_code}" http://127.0.0.1:<port>/status
# if this is 200, check listen address
grep -n "BIND_ADDR\|127.0.0.1\|0.0.0.0" /app/<server>.mjs
```

Fix:
- Set the app's bind-address env var to `0.0.0.0` when starting the container, e.g. `GATEWAY_BIND_ADDR=0.0.0.0`.
- Alternatively, change the app's default listen address if it lacks an override env var.
- After fixing bind address, port-published host curl should match the internal result.

## Healthcheck Tooling Gap in Alpine Node Images

Symptom: `HEALTHCHECK` uses `wget`, but image is based on `node:22-alpine` and `wget` is absent. Docker marks the container unhealthy even if the app is running.

Fix: install `wget` (and `curl`) in the image before declaring the healthcheck:
```dockerfile
RUN apk add --no-cache wget curl
```

## Container Name Conflict During Compose Recreation

Symptom: `service:esggo:1 Error response from daemon: Conflict. The container name "/esggo-core" is already in use...`

Fix:
```bash
docker rm -f esggo-core esggo-nginx omniagent-gateway
docker compose -f vps/docker-compose.prod.yml up -d --no-recreate
```

## Known Failures and Fixes

### Compose service fails because another container owns the name

Error:
```
Conflict. The container name "/esggo-core" is already in use...
```

Fix:
```bash
docker rm -f esggo-core esggo-nginx omniagent-gateway
docker compose -f vps/docker-compose.prod.yml up -d --no-recreate
```

### Low-ARM CPU cap crash

Error:
```
range of CPUs is from 0.01 to 1.00, as there are only 1 CPUs available
```

Fix:
```bash
# docker-compose.prod.yml
# esggo:       cpus: "0.90"
# omniagent-gateway: cpus: "0.20"
```

### pnpm non-TTY abort during image build

Error:
```
ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY
```

Fix inside Dockerfile:
```dockerfile
ENV CI=true \
    NEXT_TELEMETRY_DISABLED=1 \
    PNPM_HOME=/root/.npm-global
RUN pnpm install --frozen-lockfile --prod --ignore-scripts --config.confirmModulesPurge=false
```

### Long Docker build gets cut off by SSH timeout

Use a VPS-side `tmux` detached session to make the build job survive any Hermes
SSH timeout or context compaction. Write the build script to `/tmp`, then:

```bash
tmux kill-session -t esggo-build 2>/dev/null || true
tmux new-session -d -s esggo-build "bash /usr/local/bin/esggo-docker-build.sh"
```

Check status with:
```bash
tmux capture-pane -pt esggo-build -S -200 2>/dev/null | tail -30
tail -n 40 /tmp/esggo-build.log
```

### Docker image starts but host curl to healthcheck is `000_`

Class pattern: healthcheck binds `127.0.0.1` inside the container, and the
host `curl http://127.0.0.1:<port>` fails with `Recv failure: Connection reset
by peer` because docker-proxy forwards but the process rejects the forwarded
connection.

Diagnosis:
```bash
# inside container
apk add --no-cache curl
curl -sS -o /dev/null -w "%{http_code}" http://127.0.0.1:8642/status
# if internal is 200 but host is 000_, check entrypoint/env behavior next
```

Fix options:
- Rebind healthcheck target to a network-accessible address if the app supports it.
- Validate via `docker exec <container> curl ...` when the container expects
  loopback-only.
- Check the container's entrypoint/cmd: some Node images expect CMD/entrypoint
  semantics that `docker compose` does not honor identically.

### `--env-file` appears ignored by one specific image

Class pattern: alpine test images accept `--env-file`; target image does not.

Diagnosis:
```bash
sudo docker run --rm --env-file /opt/esggo/.env.test alpine env | grep TEST_VAR
sudo docker run --rm --env-file /opt/esggo/.env.test <target-image>:latest env | grep TEST_VAR
```

Workarounds:
- Pass secrets as explicit `-e KEY=$(awk ... file)` arguments.
- Rebuild the image so the runtime loader is visible in `/tmp` on the host.
- When entrypoint behavior is opaque, start the container with `--entrypoint`
  set to the runtime binary instead of the wrapper.

## Prisma on ARM64: Alpine 3.20 libssl1.1 Removal + Dual Binary Targets

Symptom: Next.js container starts but immediately crashes with `PrismaClientInitializationError: Unable to require(.../libquery_engine-linux-musl-arm64-openssl-1.1.x.so.node)` and `Error loading shared library libssl.so.1.1: No such file or directory`. On second attempt with Debian slim, it fails with `could not locate the Query Engine for runtime "linux-arm64-openssl-3.0.x"`.

Root cause: Alpine 3.20 removed `openssl1.1-compat` and `runtime/libcrypto1.1` packages, so Prisma 5.x can't load its default `openssl-1.1.x` engine. Even after switching to Debian slim, Prisma may generate only one binary target, so the correct-musl + correct-glibc dual engine pair must both exist in the generated client.

Fix A (preferred): switch the Docker runner stage to `node:22-slim` and pin both Prisma binary targets in `schema.prisma`:
```dockerfile
FROM --platform=linux/arm64 node:22-slim AS runner
RUN apt-get update && apt-get install -y --no-install-recommends libssl3 ca-certificates && rm -rf /var/lib/apt/lists/*
```

```prisma
// prisma/schema.prisma
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["linux-musl-arm64-openssl-3.0.x", "linux-arm64-openssl-3.0.x"]
}
```

After saving, re-run `npx prisma generate` inside the builder stage.

Fix B (only if staying on Alpine): downgrade to `node:20-alpine` where `openssl1.1-compat` still exists. Note: `binaryTargets` still needs the `linux-musl-arm64-openssl-1.1.x` line, plus you may need the `linux-arm64-openssl-1.1.x` variant depending on runtime linkage.

Pitfall: merely changing the base image is not enough. If `schema.prisma` did not match the runtime linkage, Prisma will emit a new error specifically naming the missing `linux-arm64-openssl-3.0.x` target. Always add BOTH musl + arm64 targets.

Verification:
```bash
docker exec <container> ls /app/node_modules/.prisma/client/*.so.node
# Expected: libquery_engine-linux-musl-arm64-openssl-3.0.x.so.node
#           query_engine-linux-arm64-openssl-3.0.x.so.node
```

## Worker Deploy Path Without Local Wrangler

Symptom: `npm install -g wrangler` is blocked on Windows because the shell package manager aliases `wrangler` to an unrelated `cf-wrangler` build shim. `npx wrangler` is also unavailable because the project workspace does not include wrangler.

Recommended pattern: validate locally, then deploy via GitHub Actions:
1. Worker typecheck: `npx tsc --noEmit -p worker/tsconfig.json`
2. Worker lint: `npx eslint worker/src/index.ts`
3. Commit worker source + `wrangler.toml` to `main`
4. Add a GitHub Actions workflow using `cloudflare/wrangler-action@v3` with secrets set in repo Settings → Actions Secrets
5. Push; the workflow runs `wrangler deploy --config wrangler.toml` from a clean Linux runner

Pros: avoids local Node-version / npm-alias interference; gives a reproducible deploy log; works cross-platform.

## Static Asset Deployment: Windows rsync Gap → scp Fallback

Symptom: after updating frontend assets (logos, images, etc.) in `public/` and
rebuilding, the live site still shows old content because the deploy step used
`rsync` over SSH with a Windows local path. This fails with:

```
ssh: Could not resolve hostname c: Temporary failure in name resolution
rsync: connection unexpectedly closed
```

Root cause: the Windows-side `rsync -e ssh` wrapper cannot translate a local
`C:/...` source into a remote path argument.

Workaround:
1. Build locally: `pnpm run build`
2. Upload with `scp` to `/tmp/` on the VPS:
   ```
   scp -r -i <key> dist/ user@host:/tmp/ftg-deploy/
   ```
   Note: if `/tmp/ftg-deploy/` does not exist, create it first with
   `ssh user@host 'mkdir -p /tmp/ftg-deploy'`.
3. Move into the web root with a native copy:
   ```
   ssh user@host 'sudo cp -a /tmp/ftg-deploy/. /var/www/<site>/'
   ```
4. Reload the web server:
   ```
   ssh user@host 'sudo systemctl reload nginx'
   ```

Best practice for official logos in Vite/React sites:
- Source file: `public/logos/brand-logo.jpg`
- Reference it as `<img src="/logos/brand-logo.jpg" alt="Brand" width={N} height={N} loading="eager|lazy" decoding="async" className="object-cover ..." />`
- After rebuild, verify:
  - File exists in `dist/logos/`
  - Built JS/HTML contains `/logos/brand-logo.jpg`
  - Grep built bundle for old text-icon patterns to ensure complete migration

## Verification

Before claiming success, always verify:
- `docker compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"` shows
  `Up` with ports bound.
- Curl from *inside* at least one container:
  - `docker exec <svc> sh -lc "curl -sS http://127.0.0.1:<port>/health"`
- Curl from host:
  - `curl -sS -I --max-redirs 0 -m 4 https://<domain>` returns `200`.
- For static deploy:
  - `ls -la /var/www/<site>/logos/` shows the new asset
  - `grep -o "/logos/[^\"]*" built.js` returns the expected path
  - No stale patterns remain in the built bundle
- For Gateway/Worker stacks:
  - Worker TS: `npx tsc --noEmit -p worker/tsconfig.json`
  - Worker lint: `npx eslint worker/src/index.ts`

## Compose Project Name Collapse After Host Change

Symptom: after switching machines or restoring a VPS snapshot, `docker compose up` no longer brings up a service that previously ran fine. Completely new project-prefixed resources are created (`esggo_esggo-net`, `esggo_esggo-redis-data`), while the old containers (`esggo-redis`) keep the plain Docker name. New compose up then fails with `Conflict. The container name "/esggo-redis" is already in use`.

Root cause: compose derives the project name from the current working directory / host identity. A different hostname or VPS restore can change that implicit project name, so compose treats existing containers as foreign even though they were originally created by the same stack.

Diagnosis:
```bash
docker compose ls
# shows only the current project's running services

docker ps -a --filter name=esggo
# reveals old containers without the current compose project prefix

docker network ls
# shows both old-project and new-project networks with similar names
```

Fix:
1. Decide which project name to keep; prefer the one whose containers are healthy.
2. Stop conflicting compose projects before removing containers:
   ```bash
   docker compose -p <old-project> -f <compose-file> down
   # or manually:
   docker rm -f <conflicting-container>
   ```
3. Bring up with the explicit project name to avoid subtle drift:
   ```bash
   docker compose -p <expected> -f <compose-file> up -d <service>
   ```
4. Verify with:
   ```bash
   docker compose -p <expected> -f <compose-file> ps --format 'table {{.Name}}\t{{.Service}}\t{{.Status}}'
   ```

## Manually Publishing a Compose Service Port

Symptom: a compose-managed app is `Up` and healthy from inside the container, but the host cannot connect to its published port. `docker compose ps` shows no port bindings, or `ss -tlnp` does not list the container's port.

Root cause: either the compose file omits `ports:` for that service, or compose never got far enough to start the service because of a name/network conflict.

Fix A (preferred long-term): add the port mapping to `docker-compose.yml`:
```yaml
ports:
  - "127.0.0.1:3000:3000"
```

Fix B (immediate/emergency): recreate the container manually with explicit publish:
```bash
docker stop <container> && docker rm <container>
docker run -d \
  --name <container> \
  --network <compose-project>_<network> \
  --network-alias <service-name> \
  -p 127.0.0.1:3000:3000 \
  -e <env>... \
  <image>:latest
```

After recreating:
```bash
sudo ss -tlnp | grep ':3000'
curl -sS --max-time 5 http://127.0.0.1:3000/health
```

## Manually Publishing a Compose Service Port

Symptom: a compose-managed app is `Up` and healthy from inside the container, but the host cannot connect to its published port. `docker compose ps` shows no port bindings, or `ss -tlnp` does not list the container's port.

Root cause: either the compose file omits `ports:` for that service, or compose never got far enough to start the service because of a name/network conflict.

Fix A (preferred long-term): add the port mapping to `docker-compose.yml`:
```yaml
ports:
  - "127.0.0.1:3000:3000"
```

Fix B (immediate/emergency): recreate the container manually with explicit publish:
```bash
docker stop <container> && docker rm <container>
docker run -d \
  --name <container> \
  --network <compose-project>_<network> \
  --network-alias <service-name> \
  -p 127.0.0.1:3000:3000 \
  -e <env>... \
  <image>:latest
```

After recreating:
```bash
sudo ss -tlnp | grep ':3000'
curl -sS --max-time 5 http://127.0.0.1:3000/health
```

## Split-Network DNS Failure After Manual Container Creation

Symptom: container can start but logs show `getaddrinfo ENOTFOUND <service-name>` for another compose service like Redis. Health endpoint returns `degraded` with `redis: fallback (memory)` instead of `healthy`.

Root cause: the manually recreated container joined the wrong Docker bridge network, or no network at all, so the Compose service DNS name (`esggo-redis`) is not in any search domain it knows about.

Diagnosis:
```bash
# from inside the broken container
getent hosts <service-name>
# if empty, inspect actual networks
docker inspect <container> --format 'Networks: {{json .NetworkSettings.Networks}}'
```

Fix: recreate the container on the exact compose-managed bridge network:
```bash
docker stop <container> && docker rm <container>
docker run -d \
  --name <container> \
  --network <compose-project>_<network> \
  --network-alias <service-name> \
  ...
```

Verify:
```bash
docker exec <container> getent hosts <service-name>
# should return the redis container IP, not fail
```

## Split-Network After Force Recreate (Compose Network Fragmentation)

Symptom: after `docker compose up --force-recreate`, containers report `Up` but
inter-service DNS resolves to `0.0.0.0` or `ENOTFOUND`. Gateway logs show
`No address associated with hostname` for redis. Nginx returns 502 to gateway
while gateway healthcheck on :8001 passes from inside.

Root cause: `--force-recreate` without `--no-deps` or after partial `rm -sf`
can leave Compose managing containers on different bridge networks. Compose
derives network names from the project directory name; if only a subset of
services were removed/recreated, the remaining services may be on an implicit
`<project>_<net>-dev` network while recreated ones join `<project>_<net>`.

Diagnosis from this real incident:
```bash
# All containers should report the SAME network name
docker inspect deer-flow-gateway --format '{{range $n := .NetworkSettings.Networks}}{{$n}}{{end}}'
# → docker_deer-flow
docker inspect deer-flow-redis --format '{{range $n := .NetworkSettings.Networks}}{{$n}}{{end}}'
# → docker_deer-flow-dev  ← MISMATCH!

# Check aliases (Docker Desktop bug: recreation loses compose aliases)
docker inspect deer-flow-gateway --format '{{range $n,$c := .NetworkSettings.Networks}}{{$c.Aliases}}{{end}}'
# Should show: [deer-flow-gateway gateway]

# Inside container DNS test (real test, not just HTTP):
docker exec deer-flow-nginx getent hosts gateway
# → 172.18.0.5 (correct) | empty (broken)
```

Fix:
```bash
# 1. Stop all services
docker compose down -v  # ← critical: removes anonymous volumes/network fragments
# OR if you need to keep data:
docker stop $(docker ps -q)
docker rm -f $(docker ps -aq)

# 2. Recreate ALL services simultaneously on same network
docker compose up -d --build --force-recreate

# 3. Verify network alignment
for c in gateway nginx frontend redis; do
  docker inspect "deer-flow-$c" \
    --format "{{.Name}}: net={{range \$n,{{end}}
done
```

Pitfall: `docker compose up --build --force-recreate gateway nginx` (partial)
leaves frontend/redis on the OLD network. Only a full `docker compose down -v`
followed by `up -d --build --force-recreate` guarantees single-network alignment.

Pitfall: If `.env.local` defines `DEER_FLOW_CONFIG_PATH` but the compose file
uses a different variable name, the gateway container starts with an empty path
→ config.yaml not found → app binds 127.0.0.1 → host curl returns 000. Always
validate: `docker exec <container> cat $DEER_FLOW_CONFIG_PATH`.

## Support Files

- `references/esggo-core-502-port-publication.md` — real-world transcript of the project-name collapse + missing port mapping failure mode on the ESGGO stack, including the exact manual `docker run` recovery command and why `--network-alias` matters for Redis DNS resolution across compose networks.
- `references/gateway-bind-addr-failure.md` — reproduction and config patch for the `0.0.0.0`/`127.0.0.1` bind-address mismatch that breaks Docker healthchecks on published ports, plus the missing-`wget` Alpine healthcheck pitfall.
- `references/prisma-arm64-dual-binary-targets.md` — Alpine 3.20 libssl1.1 removal, why Debian slim + `libssl3` is preferred, and why dual `binaryTargets` are required on ARM64.
- `references/aistation-port-route-recovery.md` — port-conflict recovery for the aistation-core container when host port 8000 is already in use: change host port to 8001, remove stale detached container, force recreate, update cloudflared ingress, verify public route.
- `references/n8n-owner-setup-recovery.md` — fresh n8n instance owner activation via SQLite patching and browser setup fallback; covers `userActivated=false`, REST API unavailability, and validation pitfalls on `/setup`.
- `references/esggo-core-502-port-publication.md` — real-world transcript of the project-name collapse + missing port mapping failure mode on the ESGGO stack, including the exact manual `docker run` recovery command and why `--network-alias` matters for Redis DNS resolution across compose networks.

## Secrets Hygiene

- Never pass full secrets through shell commands when avoidable.
- When debugging, mask outputs:
  - `sed -E "s|(=.*)|=***|g"`
  - `awk -F= "/^KEY=/{print $1}" file`
- Keep `.env.gateway` root-owned and mode 600.