---
name: esggo-vps-toolkit
description: >
  Operational patterns for DingJun1028/esggo VPS on Oracle Cloud, FTG Tours site,
  esggo-learning-center, and esggo monorepo.
  Use for: OCI Bootstrap → VPS SSH → nginx path/domain routing → HTTPS via certbot →
  Cloudflare DNS API → GitHub Actions deploy → monorepo next.js systemd service →
  duplicate deploy script conflicts → secrets hygiene.
  trigger keywords: esggo vps, oracle always free, cloudflare dns, certbot,
   ftg esggo co, deploy to vps, nginx path routing, next.js systemd, github actions deploy,
   canonical ip 161.118.248.180, omnitag, ftg static site build, fal image
  generation, browser verify card images, scp deploy ftg.esggo.co.

  references/ftg-static-deploy.md, references/pm2-crashloop-cf-bust.md, references/vps-endpoint-debug.md — FTG 靜態站 SCP 部署配方 + PM2 crash loop / CF 緩存繞過 實戰配方 + Agentic-Twin / evidence-upload 線上除錯與 OCI 整合實錄
triggers:
  - esggo vps
  - ftg esggo co
  - cloudflare dns api
  - certbot nginx
  - deploy-to-vps
  - legacy docker-compose
  - duplicate nginx defaults
  - github actions ssh deploy
  - next.js health check nginx
  - cloudflare ssl loop
  - docker daemon recovery
  - gateway secrets injection
  - cloudflare tunnel login
  - docker desktop virtualization issues
  - windows docker setup
  - oracle free tier capacity halving
  - ollama gemma4 self-host
  - groq free api llm engine
  - vps self-host llm
  - oracle payg upgrade
---

# ESGGO VPS Toolkit

Class-level patterns for the ESGGO stack: OCI VM + Ubuntu 24.04 (aarch64) + nginx + Next.js + certbot + Cloudflare DNS + GitHub Actions CI.

---

## 1. OCI Bootstrap

### Cloud_init / bootstrap essentials
- `VPS user`: `ubuntu` ARM Ampere A1 (`VM.Standard.A1.Flex`).
- `Cloud-init`: blocks UFW até gerar `/root/.ssh/authorized_keys` during initial boot; user-data script must append public key to that file.
- **Pitfall**: Oracle console **cannot paste externally generated private keys**. Generate the API key pair inside the Oracle Console. Never paste private keys.

### SSH keypair choice for operators
预留兩把 key：
- OCI 主控台生成 pair：private key 放在 `C:\Project\ESGGO VPS\`（不進 git）。
- 唯一用於 GitHub Actions 部署的 key：`C:\Project\esggo\actions_deploy_key`，只裝**公鑰**到 VPS 的 `~/.ssh/authorized_keys`，private key 餵進 repo Secret `VPS_SSH_KEY`。

---

## 2. Nginx Routing

### Path-based (dev / quick multi-app)
One site config, three roles:
- `/` + `/api/` → `http://127.0.0.1:3000/`
- `/ftg/` → `/var/www/ftg-tours` static SPA dir
- `/api/` proxy preserves `Host`, `X-Real-IP`, `X-Forwarded-For`, `X-Forwarded-Proto`

### Domain-based (recommended for production)
Per-host server blocks:
- `esggo.co` / `www.esggo.co` → `proxy_pass` to 127.0.0.1:3000
- `ftg.esggo.co` → `root /var/www/ftg-tours` + `try_files $uri $uri/ /index.html`
- Separate HTTP→HTTPS 301 blocks per host

### Best practice: collapse duplicate HTTP `return 404` rules
Certbot often injects multiple HTTP blocks. Merge into one per `server_name` to avoid accidental mismatches between stdio listener port ordering.

---

## 3. HTTPS / Certbot

- Install: `apt-get install certbot python3-certbot-nginx`
- Multi-Domain: `sudo certbot --nginx -d esggo.co -d www.esggo.co -d ftg.esggo.co`
- Cert **SAN** will include all 3 hostnames.
- Renewal: systemd timer (certbot installs by default)
- **Pitfall**: DNS must first resolve (A/CNAME → VPS IP). Certbot will fail if DNS returns old/nonexistent records.

---

## 4. Cloudflare DNS (API)

- Token must have **Zone:DNS:Edit** for zone `esggo.co`.
- Zone ID: `8dda3653e490290412f7be84a84e0dc9`
- Account ID: `d9d7ecd92cbad6d858fba3e529b9cb7b`
- Verify before use: `GET https://api.cloudflare.com/client/v4/user/tokens/verify`
- Update A record:
  - `GET /zones/{zone}/dns_records?type=A&name=esggo.co`
  - `PUT /zones/{zone}/dns_records/{id}` with new IP
- Add CNAME: `POST /zones/{zone}/dns_records` with `type=CNAME`, `name=www`, `content=esggo.co`
- **Pitfall**: Cloudflare "Manage Access" flows need browser; do NOT append `/proxied=true` if origin is plain HTTP; use `proxied: false` for A record serving HTTP or Full SSL origin.

### Page Rules / Cache
- Page Rules API requires separate token scope.
- If you suspect stale redirect loop, **Purge Cache** manually from Dashboard.

---

## 5. GitHub Actions Deploy

### Generic CI/CD Workflow Structure
Standard CI/CD pipeline for Vite/React projects:
- **Build job**: `npm ci` → `npm run build` → upload `dist/` artifact
- **Lint job**: `npm run lint` (optional, separate job for faster feedback)
- **Test job**: `npm run test:run` (or `npm run test:coverage` for coverage reports)
- **Deploy job**: depends on [build, lint, test] → download artifact → deploy

### Deployment Targets
**GitHub Pages** (static SPA):
```yaml
uses: peaceiris/actions-gh-pages@v3
with:
  github_token: ${{ secrets.GITHUB_TOKEN }}
  publish_dir: ./dist/
```

**Vercel**:
```yaml
uses: amondnet/vercel-action@v25
with:
  vercel-token: ${{ secrets.VERCEL_TOKEN }}
  vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
  vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

**Netlify**:
```yaml
uses: nwtgck/actions-netlify@v2
with:
  publish-dir: './dist'
  netlify-auth-token: ${{ secrets.NETLIFY_AUTH_TOKEN }}
  netlify-site-id: ${{ secrets.NETLIFY_SITE_ID }}
```

### Non-Docker (VPS host-process)
VPS already runs `next-server` on port 3000 via systemd-like manual process; GitHub Actions only needs to:
1. `npm ci` (or `pnpm install` if using pnpm lockfile)
2. `npm run build`
3. SCP `dist/` to `/var/www/ftg-tours` (fallback when rsync unavailable)
4. SSH nginx reload

**Package manager pitfall**: If both `package-lock.json` and `pnpm-lock.yaml` exist, `npm ci` may conflict with pnpm-managed node_modules. Choose one package manager consistently.

### SSH Key Management for GitHub Actions Deploy (VERIFIED 2026-08-10)

> Full recipe + host-key pinning + gate-diagnosis in `references/github-actions-vps-deploy.md`.

- **Actual deploy key**: local `C:\Users\dingj\.ssh\ci_deploy_key` (comment `github-actions-esggo-deploy`). The older `C:\Project\esggo\actions_deploy_key` note is STALE.
- **Required Secrets**: `VPS_SSH_KEY` (=`ci_deploy_key` contents), `VPS_HOST` (`161.118.248.180`), `VPS_USER` (`ubuntu`), `VPS_HOST_KEY` (pinned ed25519 host key).
- **Install hardened**: append pubkey with a `restrict` prefix (no port/agent/X11/pty forwarding) to `~ubuntu/.ssh/authorized_keys`, `chmod 600`. Dedupe on the `github-actions-esggo-deploy` comment.
- **Host-key pinning (MITM + avoids CI first-connect hang)**: store `ssh-keyscan -t ed25519 161.118.248.180` as `VPS_HOST_KEY`; write it to runner `~/.ssh/known_hosts` BEFORE the ssh step. Do NOT use `StrictHostKeyChecking=accept-new` (silently trusts MITM).
- **Set secrets from file** (no plaintext in history): `gh secret set VPS_SSH_KEY < /c/Users/dingj/.ssh/ci_deploy_key`.
- **End-to-end proof**: simulate the runner with the same private key + pinned host key before claiming success (see reference §5).

**Deploy workflow YAML template** (add to `.github/workflows/deploy.yml`):
```yaml
name: VPS Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: SSH Deploy
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /opt/esggo
            git pull origin main
            pm2 reload ecosystem.config.js
```

**SSH Key Restoration Protocol**: When primary key fails:
1. Restore from backup: `cp ~/.ssh/esggo_original.bak.* ~/.ssh/esggo_original`
2. Fix permissions: `chmod 600 ~/.ssh/esggo_original`
3. Regenerate public key: `ssh-keygen -y -f ~/.ssh/esggo_original > ~/.ssh/esggo_original.pub`

### Docker Compose on this VPS
Historical state: legacy `/usr/bin/docker-compose` v1 was present and `docker compose` was unavailable. After reinstall/socket repair, verify which CLI is active before scripting.
```
docker compose version   # v2 plugin
/usr/bin/docker-compose --version   # legacy v1
```
If both exist, **prefer `docker compose` (v2 plugin)**. Legacy v1 can raise `KeyError: 'ContainerConfig'` on some image metadata states and fail on `up --build` after Dockerfile edits.

### Docker daemon repair (Ubuntu 24.04 / Oracle ARM)
If `systemctl start docker` fails with exit-code but manual `dockerd` starts, the failure is usually a stale `/var/run/docker.pid` or socket unit mismatch. Fast path:
```
sudo rm -f /var/run/docker.pid
sudo systemctl daemon-reload
sudo systemctl restart docker.socket docker.service
```
If that still fails, reinstall from Ubuntu repo for a clean unit:
```
sudo apt-get install -y docker.io docker-compose-plugin containerd
sudo systemctl enable --now docker.service
```
`docker info` / `docker compose version` confirms recovery.

### Gateway Dockerfile fix
`vps/Dockerfile.gateway` must copy all imported modules into `/app`:
- `vps/omni-server.mjs`
- `vps/omni-server-secure.mjs`
- `vps/omni-master-key.mjs`
- `vps/ecosystem.esggo.config.cjs`
- `apps/gateway/model-router.mjs` (if `omni-server.mjs` imports it via `./model-router.mjs`)

### Known Dockerfile pitfall (esggo-core)
If you copy monorepo `packages/*/node_modules` from multi-stage deps build and `.dockerignore` excludes them, container build fails. Either remove those COPY lines or ensure `node_modules` exists during build context.

### ARM64 CPU limit pitfall
This VPS has only **1 OCPU**. Do not set `cpus: "3.0"` or `"0.5"` exceeding `1.00`. Use `cpus: "0.90"` for app and `cpus: "0.20"` for gateway.

### pnpm non-TTY build failure in Docker
`pnpm install` inside Docker fails with `ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY` because it prompts before purging `node_modules`. Fix:
- Set `ENV CI=true` in Dockerfile
- Append `--config.confirmModulesPurge=false` to pnpm commands
- Alternatively, use `pnpm install --frozen-lockfile --ignore-scripts` in deps stage and copy `node_modules` to runner stage instead of re-running install.

### Runner stage should copy built artifacts, not run pnpm again
The stable pattern for ARM64 Next.js:
```dockerfile
FROM --platform=linux/arm64 node:22-alpine AS runner
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/packages ./packages
CMD ["node", "node_modules/next/dist/bin/next", "start", "-H", "0.0.0.0", "-p", "3000"]
```

### Host nginx vs docker nginx port conflict
Host nginx binds `0.0.0.0:80` and `0.0.0.0:443`. Docker nginx service with `ports: ["80:80","443:443"]` will fail to start. Either stop host nginx before `docker compose up`, or remove port bindings and connect docker nginx to host network.

### Container name conflict on compose up
If a prior manual `docker run --name esggo-core` created a container outside compose, `docker compose up -d` fails with `Conflict. The container name is already in use`. Fix: `docker rm -f <conflicting-name>` before compose up.

---

## 6. Next.js + nginx health checks
- Health route: `/api/health` bundled by Next.js.
- nginx proxy from `/api/` to `127.0.0.1:3000/api/` should forward correctly. Verify with:
  ```
  curl -sS -w "HTTP %{http_code}" http://127.0.0.1:3000/api/health
  curl -sS -I -H "Host: esggo.co" http://127.0.0.1/api/health
  ```

## 6b. esggo-core unhealthy diagnosis on ARM64

When `docker compose -f /opt/esggo/vps/docker-compose.prod.yml ps` shows `esggo-core` `unhealthy`, use this sequence instead of blind restarts:

1. Inspect recent logs:
   ```
   docker logs --tail 120 --timestamps esggo-core
   ```
2. Look for two distinct failure shapes:
   - **Port-binding failure**: container starts but `curl 127.0.0.1:3000/api/health` returns connection refused. Cause is usually another container or process already on `3000`.
   - **App-degraded because `/health` code crashes**: logs show Prisma validation errors like `Environment variable not found: DATABASE_URL`, Redis failing, or gateway fetch failures. This can still show HTTP 200/503 depending on route implementation, but cron jobs will throw.
3. Rule out port conflicts first:
   ```
   docker ps --format "table {{.Names}}\t{{.Ports}}"
   ss -ltnp | rg ':3000'
   ```
4. Rebuild image from prod compose:
   ```
   docker compose -f /opt/esggo/vps/docker-compose.prod.yml build --no-cache esggo
   ```
5. Restart with compose:
   ```
   docker compose -f /opt/esggo/vps/docker-compose.prod.yml up -d --no-deps esggo
   ```
6. Verify with bounded retry loop:
   ```
   for i in {1..12}; do
     status=$(docker compose -f /opt/esggo/vps/docker-compose.prod.yml ps --format "{{.Name}} {{.Status}}" | rg 'esggo-core' || true)
     echo "$status"
     curl -sS -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/api/health && break
     sleep 5
   done
   ```

Pitfall: Do not infer `/health` health from container status alone. A container can be `Up` but still return `000` from `curl` if port 3000 is bound elsewhere or if the app never started listening.

## 6c. Compose container-name conflict recovery

If `docker compose up` fails with `Conflict. The container name "/esggo-core" is already in use`, remove the orphan before bring-up:
```
docker rm -f esggo-core
docker compose -f /opt/esggo/vps/docker-compose.prod.yml up -d
```

This commonly happens after manual `docker run --name esggo-core` experiments outside compose.

## 6d. Stable ARM64 rebuild and redeploy sequence

For recurring esggo-core update cycles on this VPS, prefer:

1. Confirm compose file in use: `/opt/esggo/vps/docker-compose.prod.yml`
2. Build with compose (not bare `docker build`):
   ```
   docker compose -f /opt/esggo/vps/docker-compose.prod.yml build --no-cache esggo
   ```
   This ensures `--platform=linux/arm64` from `Dockerfile.arm64` is honored.
3. If compose `up -d` fails on container name conflict, remove orphan container and retry.
4. If a manual `docker run` was used mid-session, remove that container before compose `up`; otherwise compose cannot claim the name.
5. After `up -d`, wait for `health: starting` to clear rather than polling immediately.

## 6e. Compose build context and host-facing service binding

Use `/opt/esggo` as the compose build context so relative `COPY` paths resolve correctly on the VPS. Do **not** run another nginx service inside compose on this host; the system nginx already binds `0.0.0.0:80` and `0.0.0.0:443`. If compose still tries to start container nginx, remove its `ports` or drop the service to avoid bind conflicts.

## 6f. Healthcheck command choice

Some runtime images in this stack do not include `wget`. Prefer `curl` for container and host health probes:
```
curl -sS -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/api/health
curl -sS -I -H "Host: esggo.co" http://127.0.0.1/
```

## 6g. Floating IP and DNS sync after VPS recovery

After an OCI stop/start, the public IP can change. After recovery:
- confirm current VPS IP from the runtime environment
- update Cloudflare A records to the new IP
- update local deploy scripts and workflow references
- bind the new IP as an OCI reserved public IP to avoid repeat drift

---

## 7. Duplicate deploy script conflict (deploy-to-vps.sh anti-pattern)
Every release used to re-write `/etc/nginx/sites-available/ftg-tours`, conflicting with shared `ftg-esggo` config. Best practice:
- **Deploy script only uploads build artifacts**.
- Nginx config is managed separately, public dir ownership normalized via `chown`, then reload.

---

## 8. Gateway systemd unit pattern
Service name must match container name used by compose, or use a lightweight watcher. Current stable unit:
```
[Unit]
After=network.target docker.service
Requires=docker.service

[Service]
Type=simple
ExecStart=/bin/bash -c "while true; do docker ps --filter name=omniagent-gateway --format '{{.Status}}' | grep -q Up && sleep 30 || sleep 5; done"
Restart=always
RestartSec=5
```
Then: `systemctl daemon-reload && systemctl enable --now esggo-gateway.service`

---

## 9. Firebase Firestore Integration (esggo-learning-center)

### Current state
- `src/db.js` uses modular v10: `initializeApp`, `getAuth`, `initializeFirestore` + `persistentLocalCache {}`.
- Firestore rules already written for prod: `authenticated()` + `isAdmin()`.
- `.env.example` template matches Firebase `projectId`, `authDomain`, `storageBucket`, `messagingSenderId`, `appId`, `measurementId`.
- **Smoke test available**: `scripts/firestore-smoke.mjs` writes `platforms/esggo/submissions/{id}` and prints the document id.

### Remaining steps
1. Console → Build → Firestore Database → Create → Test mode.
2. Fill 6 `VITE_FB_*` into `.env`.
3. `firebase deploy --only firestore:rules` to push security rules.
4. `node scripts/firestore-smoke.mjs` to verify auth-aware writes.

---

## 10. Brand copy rules
- Brand string: **墾趣旅遊** (FTG TOURS) — never **望趣旅遊**.
- Chinese SPA `index.html` Twitter title must match `<title>` brand string exactly.

## 20. Static asset branding workflow (logo replacement)

Context: user-supplied high-fidelity logo image replacing prior SVG/HTML text icons.

Repo pattern:
- Put final logo under `public/logos/` with descriptive filename, e.g. `public/logos/ftg-logo.png`.
- Keep both raster formats if needed: a compressed `.jpg` for quick fallback and a `.png` for transparency/retina.
- Update **every** component that renders a brand identifier: `Navbar`, `Footer`, and any offline layout shell.
- Replace inline SVG/div-based logo placeholders with `<img src="/logos/ftg-logo.png" alt="...">`.
- Do **not** inline the image as base64 in JSX; that bloats the main bundle and bypasses browser image caching.

Verification:
- Rebuild, then grep built JS and `dist/index.html` for `/logos/ftg-logo`.
- Deploy with: local `dist/` → SCP to `/tmp/ftg-deploy/` on VPS → `sudo cp -a /tmp/ftg-deploy/. /var/www/ftg-tours/` → `sudo systemctl reload nginx`.
- If `rsync` is unavailable on the local host, SCP is the reliable fallback; do not retry `rsync` blindly.

**FTG static deploy caveat (tunnel-fronted, not nginx):** `ftg.esggo.co` is served by the Cloudflare Tunnel (`esggo-tunnel` ingress → `/var/www/ftg-tours/`), NOT nginx — so SCP alone makes it live; skip the nginx reload. Full recipe + verification in `references/ftg-deploy-vps.md`.

Pitfall: Windows git-bash path quoting. Use POSIX-style paths inside `scp -r "C:/Project/..."` or quote with forward-slash form. Avoid backslashes and bare `C:\...` in remote ssh/rsync commands.

## 21. Subpage hero image carousel with text readability

Requirement: rotate background images automatically while keeping hero text clean and not visually noisy.

Pattern:
- Absolute-positioned `<img>` stack with `object-cover`, `inset-0`, fade-only transition (`opacity`, 800ms).
- Single overlay between images and text to preserve contrast: `absolute inset-0 bg-ftg-forest/75` (or matching brand color). Do **not** use multiple gradients or blur layers unless needed.
- Keep animation minimal: no scale/pan/slide; pure fade avoids motion noise and text distraction.
- Interval: 5–7 seconds (`interval={6000}`) is a good default for corporate content.
- Accessibility: `aria-live="polite"` on carousel container; current slide `alt=""`, others `aria-hidden="true"`.
- Images: use reliable CDN URLs with `w=1920&q=80` to cap payload; avoid local image hosting unless brand assets require it.
- Do **not** base64-encode images into the bundle when external URLs are acceptable.

Implementation shape:
- `src/components/ImageCarousel.jsx`: expose `images`, `interval`, `className`.
- Each subpage imports `ImageCarousel` at the top and drops it into its hero `<section>` before the `max-w-7xl` content wrapper.
- Maintain `z-10` on the text wrapper so it stays above the overlay.

---

## 20. Static asset branding workflow (logo replacement)

Context: user-supplied high-fidelity logo image replacing prior SVG/HTML text icons.

Repo pattern:
- Put final logo under `public/logos/` with descriptive filename, e.g. `public/logos/ftg-logo.png`.
- Keep both raster formats if needed: a compressed `.jpg` for quick fallback and a `.png` for transparency/retina.
- Update **every** component that renders a brand identifier: `Navbar`, `Footer`, and any offline layout shell.
- Replace inline SVG/div-based logo placeholders with `<img src=\"/logos/ftg-logo.png\" alt=\"...\">`.
- Do **not** inline the image as base64 in JSX; that bloats the main bundle and bypasses browser image caching.

Verification:
- Rebuild, then grep built JS and `dist/index.html` for `/logos/ftg-logo`.
- Deploy with: local `dist/` → SCP to `/tmp/ftg-deploy/` on VPS → `sudo cp -a /tmp/ftg-deploy/. /var/www/ftg-tours/` → `sudo systemctl reload nginx`.
- If `rsync` is unavailable on the local host, SCP is the reliable fallback; do not retry `rsync` blindly.

Pitfall: Windows git-bash path quoting. Use POSIX-style paths inside `scp -r \"C:/Project/...\"` or quote with forward-slash form. Avoid backslashes and bare `C:\\...` in remote ssh/rsync commands.

## 21. Subpage hero image carousel with text readability

Requirement: rotate background images automatically while keeping hero text clean and not visually noisy.

Pattern:
- Absolute-positioned `<img>` stack with `object-cover`, `inset-0`, fade-only transition (`opacity`, 800ms).
- Single overlay between images and text to preserve contrast: `absolute inset-0 bg-ftg-forest/75` (or matching brand color). Do **not** use multiple gradients or blur layers unless needed.
- Keep animation minimal: no scale/pan/slide; pure fade avoids motion noise and text distraction.
- Interval: 5–7 seconds (`interval={6000}`) is a good default for corporate content.
- Accessibility: `aria-live=\"polite\"` on carousel container; current slide `alt=\"\"`, others `aria-hidden=\"true\"`.
- Images: use reliable CDN URLs with `w=1920&q=80` to cap payload; avoid local image hosting unless brand assets require it.
- Do **not** base64-encode images into the bundle when external URLs are acceptable.

Implementation shape:
- `src/components/ImageCarousel.jsx`: expose `images`, `interval`, `className`.
- Each subpage imports `ImageCarousel` at the top and drops it into its hero `<section>` before the `max-w-7xl` content wrapper.
- Maintain `z-10` on the text wrapper so it stays above the overlay.

---


## 11. Cloudflare HTTPS redirect loop diagnosis and repair

### Discrimination

1. Test origin directly:
```bash
curl -sS -o /dev/null -w "%{http_code}\n" -m 8 -H "Host: esggo.co" "https://<VPS_IP>/"
```
Status `200` → origin is clean; loop is at Cloudflare or nginx 80→443 redirect.

2. Test domain:
```bash
curl -sS -I --max-redirs 2 -m 8 "https://esggo.co" | head -10
```
Repeated `HTTP/2 301` → `Location: https://esggo.co/` with `Server: cloudflare` is a Cloudflare-side redirect loop.

3. Test nginx direct on 443:
```bash
curl -sS -D - -o /dev/null -m 8 -H "Host: esggo.co" "https://127.0.0.1:443/"
```

### Common root causes

- **Always Use HTTPS + origin HTTP→HTTPS redirect**: When both Cloudflare and origin enforce HTTPS, clients see a loop. Origin should NOT redirect when Cloudflare terminates TLS.
- **Certbot-injected HTTP 80→443 redirects conflict with nginx origin redirect**: On a host-running-next-server stack, certbot adds HTTP blocks that redirect/return 404. Because Cloudflare hits origin over HTTPS on 443 through nginx, those HTTP blocks are irrelevant; the real issue is often an unconditional `return 301 https://...` inside a 443 server block.
- **Stale Cloudflare edge cache**: Changing origin behavior does not clear cached 301 immediately.

### Repair sequence

1. Remove conflicting nginx 80→HTTPS redirect blocks if origin is behind Cloudflare HTTPS.
2. Ensure 443 server blocks proxy without forcing another HTTPS redirect:
   - Remove `return 301 https://$host$request_uri;` from the 443 server block.
3. Reload nginx: `sudo nginx -t && sudo systemctl reload nginx`.
4. Purge Cloudflare cache:
   - Dashboard → **Speed** → **Optimization** → **Purge Cache**
   - Or toggle GitHub Actions env: **SSL/TLS** → **Overview** → **Full** → save → **Full (strict)** → save. This forces Cloudflare to re-verify origin and effectively clears edge cache.
5. Re-test domain + subdomains.

Pitfall: Page Rules API may return 403 even with Zone:DNS:Edit; use Dashboard for cache purge / SSL mode changes.

## 12. Cloudflare Tunnel quickstart on VPS

Prerequisite: token with `Tunnel:Edit`.

```bash
sudo cloudflared tunnel login
# 1. Open the printed dashboard URL and authorize.
# 2. cert downloads to /root/.cloudflared/<UUID>.json
sudo cloudflared tunnel create esggo-tunnel
sudo cloudflared tunnel route dns esggo-tunnel esggo.co
sudo cloudflared tunnel route dns esggo-tunnel www.esggo.co
sudo cloudflared tunnel route dns esggo-tunnel ftg.esggo.co
sudo cloudflared tunnel run esggo-tunnel
```

Pitfall: `tunnel login` opens a browser URL that expires quickly; if it times out, re-run. On headless VPS without browser, run from your local machine and manually copy the downloaded cert into `/root/.cloudflared/` via SCP.

To expose an ADDITIONAL host service on a new subdomain WITHOUT a new tunnel, append an `ingress` rule to `/etc/cloudflared/config.yml` and restart `cloudflared` (see §33.4). No nginx/certbot/OCI Security List change needed — the tunnel terminates TLS.

## 23. SSH key permissions and restoration (Windows Git-Bash context)

When transferring SSH keys to a new machine or restoring from backup:

### Common issue: Permission denied (publickey) on Windows Git-Bash

The `esggo_original` key may have incorrect permissions after transfer or restoration.

**Fix:**
```bash
# Restore from backup
cp ~/.ssh/esggo_original.bak.* ~/.ssh/esggo_original
chmod 600 ~/.ssh/esggo_original

# Regenerate public key
ssh-keygen -y -f ~/.ssh/esggo_original > ~/.ssh/esggo_original.pub
chmod 644 ~/.ssh/esggo_original.pub
```

**Pitfall:** Windows Git-Bash sometimes reports "Permission denied (publickey)" even with correct key contents. Always verify:
1. File exists at exact path: `~/.ssh/esggo_original`
2. Private key mode is 600 (owner read/write only)
3. Use full path `-i ~/.ssh/esggo_original`, NOT `~/.ssh/esggo_original` (tilde expansion issues)
4. Test with verbose: `ssh -v -i ~/.ssh/esggo_original git@161.118.248.180`

### Multiple key strategy

Always maintain separate keys for different purposes:
- `esggo_original`: Primary VPS access (ubuntu@161.118.248.180)
- `esggo_vps_fix`: Alternative/backup deploy key
- `gh_deploy_key`: GitHub Actions deployment (public key only to VPS authorized_keys)

**Pitfall (verified 2026-08-08):** `~/.ssh/vps_deploy_key` (created 2026-08-05) returns `Permission denied (publickey)` against `ubuntu@161.118.248.180`. The working key for direct SSH is `~/.ssh/esggo_original` (also dated 2026-08-05, 1679 bytes). Always use `-i ~/.ssh/esggo_original` for interactive VPS SSH; do NOT assume `vps_deploy_key` is the active credential. If `Permission denied` appears, switch to `esggo_original` before debugging further.

### Windows path note

Avoid PowerShell-style paths in SSH. Use POSIX form:
- ✅ `~/.ssh/esggo_original`
- ❌ `%USERPROFILE%/.ssh/esggo_original` or `C:\Users\dingj\.ssh\esggo_original`

---

## 24. Docker daemon recovery (Ubuntu 24.04 / OCI ARM64)

If `systemctl start docker.service` fails with exit-code but manual `dockerd` starts:
1. Check pid/socket mismatch:
```bash
sudo rm -f /var/run/docker.pid
sudo systemctl daemon-reload
sudo systemctl restart docker.socket docker.service
```
2. If still failed, reinstall from Ubuntu repo:
```bash
sudo apt-get install -y docker.io docker-compose-plugin containerd
sudo systemctl enable --now docker.service
```
3. Confirm: `docker compose version` and `docker ps`.

## 14b. Non-destructive CI secret-scan fix (protected-branch safe)

When TruffleHog (or any full-history secret scanner) fails a push to a **protected branch** that forbids `--force`, do NOT rewrite git history. Force-push is blocked by GitHub `GH006` and the user may not want history altered. Instead scope the scan to the push diff:

```yaml
      - name: Check for secrets in code
        if: github.event_name == 'push'
        uses: trufflesecurity/trufflehog@main
        with:
          base: ${{ github.event.before }}
          head: ${{ github.event.after }}
          extra_args: --only-verified
```
- `if: github.event_name == 'push'` makes `workflow_dispatch` / `pull_request` runs skip the full-history scan (those modes fall back to scanning all of git history, which would re-fail on old committed plaintext).
- On a normal `push`, TruffleHog only scans `before..after` (the incremental diff), so old plaintext in earlier commits no longer triggers the job.
- This is the best-practice path when a real secret was already rotated/revoked but still lingers in git history: rotation kills the leak's value; scoping the scan kills the CI failure — without force-pushing.
- If you DO need history rewrite (user explicitly authorized), use `git filter-repo --replace-text` (NOT `git filter-branch` / sediment scripts — those have corrupted `.git` mid-run before). Backup `.git` first; expect a non-fast-forward push that protected branches will reject unless branch protection is temporarily lifted.

## 14. Gateway secrets injection

`vps/.env.gateway` is expected by compose `env_file`. Values for:
- `OMNI_KEY`
- `OMNI_MASTER_KEY`
- `GEMINI_API_KEY`
- `MYSQL_HOST`, `MYSQL_PASS`
- `ADB_PASS`, `ADB_SERVICE`

Inject via:
```bash
ssh ubuntu@<vps> "sudo tee /opt/esggo/vps/.env.gateway" <<'EOF'
OMNI_KEY=...
EOF
sudo systemctl daemon-reload  # if using gateway systemd watcher
docker compose -f /opt/esggo/vps/docker-compose.prod.yml up -d omniagent-gateway
```

Pitfall: compose v1 fails with `KeyError: 'ContainerConfig'`; install compose v2 plugin (`docker compose version`). Also restart Docker daemon after a crash before compose commands.

## 16. Cloudflare AI Gateway + AI Crawl Control + Workers VPC (OmniGateway)

### Architecture pattern
Deploy a Cloudflare Worker as the unified AI entry point in front of private APIs:

```
[User / AI Agent / Crawler] → Cloudflare WAF → OmniGateway Worker → upstream providers / VPC private models
```

Bindings to configure in `wrangler.toml` or Dashboard:
- `OMNI_GATEWAY_KEY`: Bearer token for protected routes
- `OPENROUTER_API_KEY`, `GROQ_API_KEY`, `GEMINI_API_KEY`: upstream keys
- `OMNI_KV`: KV namespace for semantic cache
- `PRIVATE_API`: VPC service binding to private model / API
- `AI_CRAWL_CONTROL`: `strict` | `moderate` | `off`
- `TELEGRAM_BOT_TOKEN` / `DISCORD_ALERT_WEBHOOK_ID`: optional alert transport

### Route contract
- `POST /v1/chat/completions` → authenticated generation with semantic cache + fallback chain
- `GET  /v1/models` → provider catalog
- `GET  /status`, `/health` → readiness + crawl mode

### AI Crawl Control
Reject suspicious AI crawler signatures before protected paths. In `strict` mode, deny request immediately for known bot paths (`*.bot.*`, known UAs). In `moderate` mode, allow with KV-backed rate limit.

### Fallback policy
Try providers in order until one succeeds: OpenRouter → Groq → Gemini → VPC private. Do not cache failures.

### Audit + alerting
Every request is fire-and-forget `POST` to origin `/api/audit`. Failures in audit sink must not break user flow. Optional Telegram/Discord webhook for spend-cap / rate-limit alerts.

### VPC private model access
Use `env.PRIVATE_API.fetch(new Request(...))` inside the Worker. Register each private target as a VPC Service in Cloudflare Dashboard, then add it as a binding in `wrangler.toml`.

### Known issue: TS types in Worker project
`wrangler` ships Worker types, but `@cloudflare/workers-types` may not be present in a workspace root. Minimal ambient declarations for `cloudflare:workers` plus `declare type` aliases for `KVNamespace`, `Fetcher`, `ExecutionContext` keeps `tsc --noEmit` passing without installing the package.

### Worker ESLint
If the worker directory is ignored by the root flat config, ensure `eslint.config.js` includes an explicit non-ignored file glob or lint the worker file directly.

### 16b. Deploying a Workers AI Worker (`env.AI.run`) — verified path

Goal: run `const r = await env.AI.run('deepseek/deepseek-v4-pro', {messages})` from a Worker. The `env.AI.run` binding ONLY exists inside a deployed Worker — it cannot be called via `curl`/REST on the local machine (no `env` object). Two paths:

**Path A — REST API (needs a token with AI:Run scope):**
`POST https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/ai/run/{model}` with `Authorization: Bearer <token>`.
- Pitfall: the `cfut_...`/`cfat_...` tokens the user pasted were either `Invalid API Token` (1000) or had no AI scope (`No route for that URI`, 7000). A token that passes `/user/tokens/verify` is NOT guaranteed to have AI:Run. Verify scope before assuming.

**Path B — Worker deploy (works with wrangler OAuth login, no API token needed):** ✅ VERIFIED 2026-08
1. `wrangler.toml`:
   ```toml
   name = "esggo-deepseek-v4-pro"
   main = "src/index.js"
   compatibility_date = "2025-01-01"
   [ai]
   binding = "AI"
   [vars]
   MODEL = "deepseek/deepseek-v4-pro"
   ```
2. `src/index.js`: `export default { async fetch(request, env) { const r = await env.AI.run(env.MODEL, { messages }); return Response.json(r); } }`
3. `wrangler whoami` — if it reports `redefine an already defined table`, the ROOT `wrangler.toml` has duplicate `[build]` blocks; collapse to one. (esggo repo root had 5 duplicate `[build]` blocks — fix by keeping a single `[build]` and deleting the rest.)
4. `wrangler deploy` — uses the existing OAuth token (stored at `C:\Users\dingj\AppData\Roaming\xdg.config\.wrangler\config\default.toml`), account `d9d7ecd92cbad6d858fba3e529b9cb7b`. No API token required.
5. Test: `curl https://<name>.<subdomain>.workers.dev/health` and `/chat`.

- Pitfall: a model may exist in the catalog but not be **authorized** for the account → `/chat` returns `error code: 1042` even though `/health` works. That is a model-access permission issue, not a code bug. Switch to a known-available model (e.g. `@cf/deepseek-ai/deepseek-r1-distill`) to prove the pipeline, then request v4-pro access separately.
- Verification of the Worker artifact itself (before/after deploy): `node --check src/index.js` (use Windows path `C:/...` form to avoid the MSYS `\c\Project...` path phantom), and `wrangler deploy --dry-run` to confirm bindings.

## 17. Long-running VPS commands (tmux fallback)

Long-running SSH commands often fail with `Connection reset by peer` after ~90s. Do not re-run inside Hermes; use VPS-local tmux:

```bash
tmux kill-session -t <name> 2>/dev/null || true
tmux new-session -d -s <name> "bash /usr/local/bin/<script>.sh"
tmux list-sessions
tmux capture-pane -pt <name> -S -200 2>&1 | tail -80
# Or read log:
cat /tmp/<log>.log
```

Pattern: write the long command to `/usr/local/bin/esggo-*.sh` first, then run it in tmux. Avoids nested SSH heredoc quoting issues.

## 18. pnpm non-TTY in ARM64 Docker builds

`pnpm install` inside Docker aborts with:
`[ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY]`

Fix in Dockerfile:
```dockerfile
ENV CI=true
# and/or append
--config.confirmModulesPurge=false
```

For ARM64 Next.js monorepo, the stable pattern is:
- Stage `deps`: `pnpm install --frozen-lockfile --ignore-scripts`
- Stage `builder`: copy workspace source, `npx prisma generate`, `pnpm run build`
- Stage `runner`: copy `node_modules`, `.next`, `public`, `packages`, `package.json` from builder; start with `next start`, not re-running pnpm.

Update `esggo-core` CPU limits to `0.90` (1 OCPU VM). Gateway to `0.20`.

## 19. Container name conflict resolution

If prior manual `docker run --name` created containers outside compose:
```bash
docker ps -a --filter "name=esggo-core" --format "{{.Names}}"
docker rm -f <id_or_name>
docker compose -f /opt/esggo/vps/docker-compose.prod.yml up -d
```

## 21. Docker Desktop Virtualization Issues (Windows)

### Common Error: "Virtualization support not detected"
Docker Desktop fails to start with: "Virtualization support wasn't detected. Contact your IT admin to enable virtualization or check system requirements."

### Pre-deployment Check
```powershell
# Check virtualization support
Get-CimInstance -ClassName Win32_Processor | Select-Object VirtualizationFirmwareEnabled
# Alternative
wmic cpu get VirtualizationFirmwareEnabled
```

### Resolution Steps

#### 1. BIOS/UEFI Configuration
- **Restart computer** and enter BIOS/UEFI (F2, F12, DEL, ESC during boot)
- **Enable virtualization**:
  - Intel: `Intel VT-x` or `Vanderpool`
  - AMD: `AMD-V` or `SVM`
- **Save and exit**

#### 2. Windows Features
```powershell
# Run as Administrator
dism /online /enable-feature /featurename:Microsoft-Hyper-V-All /all /norestart
dism /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
dism /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
```

#### 3. WSL 2 Setup
```powershell
# Install WSL 2
wsl --install
# Set as default
wsl --set-default-version 2
```

#### 4. Windows Edition Requirements
| Edition | Docker Desktop Support |
|---------|----------------------|
| Windows 10/11 Pro | ✅ Full support with Hyper-V |
| Windows 10/11 Home | ✅ WSL 2 backend |
| Windows 10/11 Enterprise | ✅ Full support |
| Windows 10/11 Education | ✅ Full support |

#### 5. Alternative Solutions
- **Docker Toolbox** (legacy, no WSL 2 required)
- **Use Linux VM** if Windows limitations persist
- **Docker Desktop with WSL 2 backend** (recommended for Home edition)

### Deployment Checklist
- [ ] Virtualization enabled in BIOS
- [ ] Windows 10/11 Pro or Home with WSL 2
- [ ] Docker Desktop installed
- [ ] WSL 2 distro (Ubuntu) installed
- [ ] `docker compose version` shows v2+

### Common Pitfalls
1. **Hyper-V conflicts**: Other virtualization software (VMware, VirtualBox) may block Hyper-V
2. **Fast Startup**: Disable in Control Panel → Power Options
3. **Group Policy**: Corporate environments may disable virtualization via GPO
4. **ARM64 Windows**: Docker Desktop on ARM has limited WSL 2 support; consider remote Docker host

## 31. omni-blueprint-hub startup (pm2, port 8787)

The 萬能藍圖中心 service lives at `/opt/esggo/apps/omni-blueprint-hub` on the VPS. It is NOT auto-started by the base image; you may need to launch it manually.

Verified bring-up (2026-08-08):
```bash
ssh -i ~/.ssh/esggo_original ubuntu@161.118.248.180
cd /opt/esggo/apps/omni-blueprint-hub
# 1. Create .env from template if missing (no external keys needed — runs free)
cat > .env <<'EOF'
PORT=8787
REPLAY_MAX=20
RATE_MAX=60
LANG_TARGETS=zh-CN,en,ja,es,ko,fr
LANG_DEFAULT=en
TRANSLATE_TIMEOUT_MS=8000
TRANSLATE_RETRIES=2
TRANSLATE_CACHE_MAX=1000
EOF
# 2. Ensure deps present. **VERIFIED 2026-08-14: `npm install` HANGS on this VPS** — zero
#    output, `timeout 110` kills it (RC=124), even with --prefer-offline / alt registry /
#    `npm cache clean --force`. Do NOT loop on `npm install`. Use pnpm instead:
ls node_modules >/dev/null 2>&1 || CI=true pnpm install --prod --config.confirmModulesPurge=false
#    pnpm completes in ~24s and runs `prisma generate` in postinstall. CI=true +
#    --config.confirmModulesPurge=false are mandatory (non-TTY abort otherwise, see §18).
# 3. Start via pm2 ecosystem
pm2 start ecosystem.config.cjs && pm2 save
```
Health probes:
- `curl http://localhost:8787/` → HTML dashboard
- `curl http://localhost:8787/healthz` → `{"ok":true,"bootAt":...,"uptimeSec":...,"sources":[...]}`

Pitfall: if `node_modules` is absent the pm2 process shows `online` but crashes on import — check `pm2 logs omni-blueprint-hub` for `Cannot find module`. Run `npm install --omit=dev` then `pm2 restart omni-blueprint-hub`.

### 31.1 VPS `git pull` dirty-state repeat offenders (VERIFIED 2026-08-13)

When `git pull origin main` on `/opt/esggo` aborts with "would be overwritten by merge" / "untracked working tree files would be overwritten", the VPS has long-accumulated WIP that collides with upstream. This happens **repeatedly** — each pull fixes one conflict and the next reveals another. Known offenders seen this session:
- `vault/Agents/context/00-Index.md` (modified, conflicts with upstream) → `git checkout -- vault/Agents/context/00-Index.md`
- `scripts/avatar-cleanup.mjs` (untracked) → `mv scripts/avatar-cleanup.mjs /tmp/avatar-cleanup.mjs.bak`
- `scripts/oa-memory-recall.mjs` (untracked) → `mv scripts/oa-memory-recall.mjs /tmp/oa-memory-recall.mjs.bak`
- `scripts/oa-vps-keepalive.mjs` (untracked) → `mv scripts/oa-vps-keepalive.mjs /tmp/oa-vps-keepalive.mjs.bak`  ← seen 2026-08-14

Pattern: loop `git pull` → read the abort message → `git checkout -- <modified conflict>` + `mv <untracked conflict> /tmp/` → retry, until pull fast-forwards. The `oa-vps-keepalive.mjs` case: upstream also has it, so after `mv` to /tmp the pull restores upstream's copy (VPS-local backup kept separately in /tmp). **Do NOT** `git checkout --` the tencentdb-memory/*.sh, omni-server.mjs, or docker-compose.prod.yml (those are intentional prod config — they don't appear in the conflict list because upstream didn't change them; leave them alone). Pure-markdown soul-chapter syncs need only `git pull` (no service restart).

### 31.2 npm install on this VPS: HANGS, not just slow (VERIFIED 2026-08-14, supersedes 2026-08-13 "just slow" note)

`npm install --omit=dev` in `/opt/esggo/apps/omni-blueprint-hub` **does NOT progress** on this VPS. Empirical result 2026-08-14: `timeout 110 npm install --omit=dev` returned `RC=124` with **zero stdout/stderr** (no `http fetch` lines at all), and identical failure with `--prefer-offline`, `--registry=https://registry.npmmirror.com`, and after `npm cache clean --force`. It is genuinely HUNG, not slow.

**Reliable fix = pnpm** (see §31 step 2): `CI=true pnpm install --prod --config.confirmModulesPurge=false` completes in ~24s. If you see a stale `EXIT=1` in `/tmp/hub-*.log` but `pgrep` says npm is "running", that is a **zombie from a prior SSH-reset-aborted attempt**, not real progress — kill it (`pkill -9 -f "npm install"`) and switch to pnpm. Do NOT waste 2–4 min re-trying `npm install`.

## 33. Deploying a thin TypeScript Node service to VPS (OmniGateway pattern)

When you need a small TS service on the VPS that the LOCAL CLI talks to, prefer deploying a standalone `node --import tsx server.ts` process (host-mode, not docker) — it avoids the `docker compose build` rebuild cycle entirely ("圓通無礙": don't force a rebuild when a host process works).

### 33.1 Transfer non-ASCII TS to VPS without corruption
SSH heredocs mangle Chinese characters and `${...}` template literals (shell parses them). Base64-encode locally, pipe through `base64 -d` on the VPS:
```bash
# local (git-bash)
B64=$(base64 -w0 server.ts)   # -w0 = no line wrap (GNU base64)
ssh -i ~/.ssh/esggo_original ubuntu@161.118.248.180 \
  "echo '$B64' | base64 -d > /opt/esggo/vps/omnigateway/server.ts"
# verify on VPS
ssh -i ~/.ssh/esggo_original ubuntu@161.118.248.180 "node --check /opt/esggo/vps/omnigateway/server.ts && echo SYNTAX_OK"
```
Pitfall: `base64 -w0` is GNU; on macOS use `base64 -b0`. If you pipe through `cat file.b64` instead of a shell var, ensure no trailing newline injects into the decoded file.

### 33.2 Keep the process alive after SSH exits
Background `nohup ... &` inside an SSH command still dies when the session closes because the subshell gets SIGHUP. Detach fully:
```bash
ssh -i ~/.ssh/esggo_original ubuntu@161.118.248.180 \
  "cd /opt/esggo/vps/omnigateway; setsid node --import tsx server.ts >logs.out 2>&1 </dev/null & disown; echo RELAUNCHED"
# then verify in a SEPARATE ssh call after a short sleep
ssh -i ~/.ssh/esggo_original ubuntu@161.118.248.180 "curl -s -m5 http://localhost:8421/health"
```
Do NOT chain the `sleep` + `curl` into the same SSH command that launches the process — the launcher's own sleep can get cut off and you lose the verification.

### 33.3 Kill the old process by PID (pkill -f is unreliable here)
`pkill -f 'omnigateway/server.ts'` did NOT match `node --import tsx server.ts` (the actual argv). Get the real PID first:
```bash
PID=$(ssh -i ~/.ssh/esggo_original ubuntu@161.118.248.180 "pgrep -f 'server.ts' | head -1")
ssh -i ~/.ssh/esggo_original ubuntu@161.118.248.180 "kill -9 $PID; sleep 2; echo killed"
```

### 33.4 Expose a new port via Cloudflare Tunnel (no nginx/certbot)
The VPS runs `cloudflared` tunnel `esggo-tunnel` (config `/etc/cloudflared/config.yml`). To expose a host service on a subdomain, append an ingress rule and restart the tunnel — no OCI Security List or UFW port opening needed for the public path (tunnel terminates TLS):
```bash
sudo python3 - <<'PYEOF'
p='/etc/cloudflared/config.yml'
s=open(p,encoding='utf-8').read()
if 'gateway.esggo.co' not in s:
    rule="\n  - hostname: gateway.esggo.co\n    service: http://127.0.0.1:8421\n"
    anchor="  - hostname: translate.esggo.co\n    service: http://127.0.0.1:8788"
    assert anchor in s
    s=s.replace(anchor, anchor+rule)
    open(p,'w',encoding='utf-8').write(s)
PYEOF
sudo systemctl restart cloudflared
```
Pitfall: the config file at `/etc/cloudflared/config.yml` requires `sudo` to write (PermissionError otherwise).

**CORRECTION (verified 2026-08-08):** You CAN register/verify the tunnel DNS CNAME **locally** without a
Cloudflare API token. The `cloudflared` login cert (`~/.cloudflared/cert.pem`, downloaded when
`cloudflared tunnel login` ran) carries Tunnel:DNS admin rights. From the local machine:
```bash
cloudflared tunnel route dns esggo-tunnel gateway.esggo.co
# idempotent — if already routed, prints:
#   "gateway.esggo.co is already configured to route to your tunnel tunnelID=..."
```
This both registers the CNAME (if missing) and verifies it (if present). Use it as the closure
check for any `*.esggo.co → esggo-tunnel` route — no Dashboard, no `CF_API_TOKEN` needed. The
manual Dashboard add is only a fallback when the local `cert.pem` is absent. Local-host
`curl http://localhost:8421` always works for verification; public `curl https://gateway.esggo.co/...`
returns empty only while the tunnel origin (VPS `cloudflared`) has 0 active connections — that is a
separate origin-up problem, not a DNS problem (see §33.6).

### 33.5 OmniGateway bring-up (verified 2026-08-08)
Service at `/opt/esggo/vps/omnigateway/` (port 8421). Bring-up:
```bash
ssh -i ~/.ssh/esggo_original ubuntu@161.118.248.180
cd /opt/esggo/vps/omnigateway
# package.json: { "type":"module", "scripts":{ "start":"node --import tsx server.ts" }, "dependencies":{ "express":"^4","cors":"^2" }, "devDependencies":{ "tsx":"^4" } }
npm install tsx express cors   # --omit=dev hides tsx; install tsx explicitly
# start detached (§33.2), verify /health returns {"role":"OA-VPS 萬能蜂后"}
```
OA naming convention (self-identifies in `/oa/status` and `/oab/status`):
OC=OmniCore 萬能心核 · OA=OmniAgent/OmniAvata/OmniAssistant (多義) · OA-TWINS=萬能雙生 · OA-LOCAL=萬能蜂王(本地) · OA-VPS=萬能蜂后(VPS) · OAB=OmniAgentBus(同步總線, /sync/stream SSE + RWED).
The service aligns with ESG GO × OmniHermes API v1.2: standard envelope `{status,t5_tag,data,hash_lock,meta}`, 5T tags (T1/T4/T5), bilingual zh/en, RWED bidirectional sync via SSE.

### 33.6 VPS OOM-recovery SSH signature (diagnosis, not just "down")

When the user reports "unfinished task blocked by VPS," distinguish three SSH failure shapes — they
imply different fixes and different honesty in reporting:

| SSH symptom | Meaning | Recovery |
|---|---|---|
| `Connection refused` / `/dev/tcp` to 22 **closed** | VPS fully down or sshd not listening (e.g. instance stopped) | OCI console start/restart; or wait |
| `getsockname failed: Not a socket` (Hermes SSH backend only) | **LOCAL** Hermes SSH-client socket error, NOT VPS downtime | fix via `hermes config set terminal.ssh_*` + restart (§27.1) |
| **TCP 22 OPEN but `ssh` times out at `Connection timed out during banner exchange`** | Box is **alive** but sshd cannot complete the handshake — typically OOM-killer thrash / memory exhaustion (e.g. a 9.6 GB model on 2.8 GB free RAM) | Box will self-recover once OOM-killer frees RAM, OR do an OCI console **soft reboot**; do NOT keep hammering SSH (each attempt re-times-out and wastes a 90–180s slot) |

**Verified this session (2026-08-08):** `timeout 5 bash -c 'cat < /dev/null > /dev/tcp/161.118.248.180/22'`
returned port OPEN, but three `ssh esggo-vps` attempts (up to 90s timeout) all died at the banner
exchange. This is the middle row — the instance is recovering from an OOM event, not dead. Tunnel
`cloudflared tunnel list` showed `esggo-tunnel` with **0 active connections** for the same reason:
the origin `cloudflared` process on the VPS is not running.

**Honest reporting rule:** when you see the banner-timeout signature, do NOT claim "VPS is down" and
do NOT claim "tunnel restored." State precisely: "VPS TCP reachable but sshd handshake blocked by
OOM recovery; tunnel has 0 connections because the origin process is not up." Then either (a) wait
and retry on a timer, or (b) hand the user the one-step recovery: OCI console → soft reboot → origin
self-heals if `cloudflared` is enabled as a service, else `ssh` in and `sudo systemctl restart cloudflared`
(or `cloudflared tunnel run esggo-tunnel` detached per §17 tmux pattern).

**Windows DNS probe note:** in git-bash on this host `dig` is absent; `nslookup` works (output is
codepage-garbled but usable). Prefer `cloudflared tunnel route dns` (§33.4) for tunnel CNAME checks —
it is cleaner than parsing `nslookup -type=cname`.

## 34.6 Speech-to-Speech voice agent × OmniBlueprint Hub integration (VERIFIED LOCAL 2026-08-10)

Goal: bolt HuggingFace `speech-to-speech` (VAD→STT→LLM→TTS, OpenAI-Realtime-compatible WS at `ws://host:8765/v1/realtime`) onto the live.esggo.co real-time translation hub (OmniBlueprint Hub, pm2 port 8787).

### Architecture
```
語音 → s2s (VPS :8765, VAD/STT/LLM/TTS)
            └→ 文本 → HUB /voice/bridge → /speak → 多語翻譯 SSE /stream
觀眾 → stream.html 字幕 + s2s 音訊
```
- s2s text hits HUB `/voice/bridge` (POST JSON `{text, role}`); handler calls `translateToMany()` and `broadcast()`s a `voice-agent` translation event.
- 5T alignment: `sourceOrigin: 's2s:'+role`, hash_lock on text, full lifecycle via OAB/HUB event stream.
- Reference deploy script lives at `esggo-learning-center/_tmp_vps/deploy_voice_agent.sh` (watchdog in §34.5 scp+runs it on VPS recovery).

### VERIFIED local bring-up (Windows, CPU-only, 16 GB RAM) — 2026-08-10
The pipeline was run end-to-end locally and the WS endpoint connected. Reproduce:
1. Isolated venv (CRITICAL — see pitfall #6): `uv venv C:/tmp/s2s_venv2` then install with `PYTHONPATH=""` cleared.
2. `env PYTHONPATH="" <venv>/Scripts/python.exe -m pip install speech-to-speech` (base, NO `[kokoro]` extra).
3. `env PYTHONPATH="" <venv>/Scripts/python.exe -m pip install pocket-tts` (CPU-friendly TTS; kokoro/qwen3 need extra handling, see pitfalls).
4. LLM via Ollama (local or VPS): Ollama must serve `http://localhost:11434/v1` (OpenAI-compatible). Confirm with `curl -XPOST http://localhost:11434/v1/chat/completions -d '{"model":"qwen2.5:3b-instruct-q4_K_M","messages":[{"role":"user","content":"hi"}],"max_tokens":15}'` → must return JSON (not empty/timeout).
5. Start s2s (VERIFIED WORKING COMMAND):
```bash
env PYTHONPATH="" <venv>/Scripts/speech-to-speech.exe \
  --ws_host 127.0.0.1 --ws_port 8765 \
  --stt parakeet-tdt \
  --llm_backend chat-completions \
  --model_name "qwen2.5:3b-instruct-q4_K_M" \
  --responses_api_base_url "http://localhost:11434/v1" \
  --responses_api_api_key "ollama" \
  --tts pocket \
  --enable_live_transcription
```
6. Verify WS: `python -c "import websockets; asyncio.run(websockets.connect('ws://127.0.0.1:8765/v1/realtime'))"` → prints `WS_CONNECT_OK`. (A plain `curl http://127.0.0.1:8765/v1/realtime` returns 404 — that is EXPECTED for a WS endpoint hit with GET; do not treat 404 as down.)

### Pitfalls (DISCOVERED + VERIFIED this session — do NOT repeat the 2026-08-08 draft)
1. **`pip install speech-to-speech[kokoro]` → ResolutionImpossible**: `speech-to-speech[kokoro] 0.2.1/0.2.0` pins `kokoro>=0.9.2` and pip cannot resolve. Fix: install base `pip install speech-to-speech` FIRST, then add TTS separately (`pip install pocket-tts`). Do NOT assume the `[kokoro]` extra installs.
2. **s2s 0.2.12 has NO `serve` subcommand and NO `--host/--port`.** Flags are `--ws_host` / `--ws_port` (HfArgumentParser dataclass fields). Running `speech-to-speech serve --host ... --port ...` fails with `ValueError: Some specified arguments are not used by the HfArgumentParser: ['serve', '--host', ...]`.
3. **`--llm_backend transformers` rejects Ollama tags** (e.g. `gemma4:e2b`): raises `HFValidationError: Repo id must use alphanumeric chars ... 'gemma4:e2b'`. It wants a HuggingFace repo id (e.g. `google/gemma-4-...`), NOT an Ollama tag. For an Ollama-hosted model use `--llm_backend chat-completions --responses_api_base_url http://localhost:11434/v1` (VPS/Windows Ollama serves OpenAI-compatible `/v1`).
4. **TTS backend choices on CPU-only boxes**: `qwen3` needs CUDA (`ValueError: CUDA graphs require CUDA device`) → use `pocket` (pure torch, CPU). `kokoro` base install fails (numpy metadata conflict) → `pip install pocket-tts` works. So `--tts pocket` is the reliable CPU choice.
5. **Reverse-proxy path detection**: the VPS may front `live.esggo.co` via Cloudflare Tunnel, NOT nginx `sites-enabled`. Detect the real config before appending a `/voice/ws` location — probe `/etc/nginx/sites-enabled/`, `/etc/nginx/conf.d/*.conf`, `/etc/nginx/nginx.conf`, and fall back to a `cloudflared config.yml` ingress rule (`voice.esggo.co → http://127.0.0.1:8765`). The deploy script (`esggo-learning-center/_tmp_vps/deploy_voice_agent.sh`) already does this probe loop.
6. **PYTHONPATH pollution from Hermes venv** (Windows only): Hermes injects `PYTHONPATH=C:\Users\dingj\AppData\Local\hermes\hermes-agent;C:\...\venv\Lib\site-packages`. Any new venv you create PRE-INHERITS hermes site-packages → `regex` circular import / `huggingface_hub outside environment` conflicts. FIX: run every pip/run command with `env PYTHONPATH=""` (or `PYTHONPATH=` prefix) so only the isolated venv's own packages load. Confirm with `python -c "import sys; print(any('hermes' in p for p in sys.path[1:]))"` → must be `False`. Full recipe + verified example: `references/windows-venv-pythonpath-isolation.md`.
7. **VPS RAM reality (post-2026-08-10 resize = 4 OCPU / 24 GB, see §35.4)**: s2s full pipeline (Parakeet ~600 MB + TTS ~400 MB + LLM) fits comfortably now. But if Ollama ALSO runs gemma4 for HUB `/generate`, keep the s2s LLM small (`qwen2.5:3b` or `gemma4:e2b`) and avoid `gemma4:26b` (26B CPU load = very slow warmup, and on the old 2.8 GB box it OOMs). For VPS, prefer pointing s2s at the already-running Ollama (`chat-completions` backend) rather than a second transformers load — single LLM host.
8. **Verify `.sh` edits with `bash -n`, NOT `pnpm run typecheck`/tsc** — that is a TypeScript command and does not apply to Bash scripts. The watchdog (§34.5) guards re-runs with a `DEPLOY_DONE` flag.

### Bring-up order (after VPS Console Reboot / recovery, §34.2)
1. SSH in, `ollama rm gemma4:e4b` if present (prevent auto-load OOM on old boxes).
2. Ensure Ollama serves `/v1` with the target model pulled (`ollama pull gemma4:e2b` or `qwen2.5:3b-instruct-q4_K_M`).
3. On VPS: `pip install speech-to-speech` (base) + `pip install pocket-tts`.
4. Start s2s with the VERIFIED command above (swap `--model_name` to the Ollama tag, `--ws_host 0.0.0.0` for public).
5. Patch HUB `monitor-server.mjs` `/voice/bridge` (python heredoc, §33.1 base64-safe pattern), `node --check`, `pm2 restart omni-blueprint-hub`.
6. Expose `:8765` via tunnel/ingress; verify `ws://127.0.0.1:8765/v1/realtime` connects and `curl -XPOST localhost:8787/voice/bridge -d '{"text":"test","role":"user"}'` returns `{"ok":true}`.



## 35. OCI instance reboot/resize via CLI + SSH-session stall recovery (VERIFIED 2026-08-10)

### 35.1 OCI CLI setup for esggo-vps
- Config: `C:\Users\dingj\.oci\config` — `[DEFAULT]` with `user`, `tenancy`, `region=ap-singapore-1` (NOT tokyo/seoul).
- CLI binary: `C:\Program Files (x86)\Oracle\oci_cli\oci`. Set `SUPPRESS_LABEL_WARNING=True` to silence the API-key-label warning.
- `oci compute instance list` returns EMPTY unless you pass `--compartment-id <TENANCY_OCID>` (the tenancy OCID doubles as root compartment). The tenancy OCID is in the config file.
- Instance OCID (ap-singapore-1): `ocid1.instance.oc1.ap-singapore-1.anzwsljrkl3rykyc4fggmvq6kezm65dkzzj5nboi3ihax2qxtxyjnxvrpxza` (display-name `esggo-vps`).

### 35.2 SSH session stalls because a remote command hogs CPU (banner-exchange timeout, NOT OOM)
A running CI `Deploy to VPS` step (or any long `pnpm install`/`next build`) can saturate the single/limited vCPU so sshd cannot fork the handshake. Symptom is **identical** to §34.6 (TCP:22 OPEN, ping OK, `ssh` → `Connection timed out during banner exchange`) but the root cause is a stuck foreground remote command, not OOM.
- Diagnosis: `timeout 10 bash -c 'cat < /dev/null > /dev/tcp/161.118.248.180/22'` → OPEN; `ping` → 0% loss; yet `ssh` times out. That combination = box alive, sshd handshake blocked.
- Recovery: cancel the runaway GitHub Actions run (`gh run cancel <id>`) to release the SSH/CPU, THEN SSH in. If the remote `next build` already forked and keeps running after cancel, the VPS is still CPU-bound — go to §35.3 (OCI reboot).

### 35.3 OCI reboot when SSH unreachable
`oci compute instance action --region ap-singapore-1 --instance-id <ID> --action SOFTRESET` (or STOP then START). This does NOT change the shape — purely a power cycle.
- `SOFTRESET` from a stuck `STOPPING` state may never transition (guest OS cannot acknowledge ACPI shutdown because it is CPU-saturated). OCI force-powers-off after ~20–30 min. If you need it faster, issue `STOP` explicitly; it behaves the same way (graceful → forced).
- **Pitfall**: after a forced reboot the instance often goes `STOPPING → RUNNING` directly, SKIPPING a pollable `STOPPED` state. Any script doing `wait for STOPPED then resize then START` will miss the window and the instance comes back up with the OLD shape. Always (a) resize in a separate step AFTER confirming RUNNING, or (b) poll for `STOPPED OR RUNNING` and act accordingly.

### 35.4 Resize A1.Flex (always-free max = 4 OCPU / 24 GB)
- `oci compute instance update --region ap-singapore-1 --instance-id <ID> --shape-config '{"ocpus":4,"memoryInGBs":24}'` **requires `--force`** or it prompts `[y/N]` and aborts (the CLI will not auto-confirm shape changes).
- A1.Flex **live resize** from RUNNING triggers a brief `STOPPING → STARTING → RUNNING` cycle (no separate `STOPPED` state). After it settles, `oci compute instance get ... | grep -iE 'ocpus|memory-in-gbs'` should show `4.0` / `24.0`.
- This is within the Always-Free Ampere quota (≤4 OCPU + 24 GB total). No PAYG charges. Resizing does NOT wipe the boot volume or app data.
- NOTE: esggo-vps was successfully resized to **4 OCPU / 24 GB** on 2026-08-10 (was 1/6). §26's "2026 halving → 2/12" note does NOT apply to this instance — it is running at the full free allotment.

### 35.5 faster-whisper local STT service (zero-key, free-compute) — VERIFIED 2026-08-10
Universal-translator (`apps/universal-translator`) calls a local STT microservice at `127.0.0.1:${STT_PORT||8791}/transcribe`. The repo previously had NO STT service, so UT returned HTTP 502 ("轉錄錯誤"). Fix = deploy `apps/stt/server.py` (FastAPI + faster-whisper, CPU-only).
- `apps/stt/server.py`: `POST /transcribe?lang=zh-TW|en` (body=audio bytes) → `{text, language, engine}`; `GET /health` → `{status:"ok"}`. First run downloads the `base` model (~140 MB) to `~/.cache/huggingface`.
- VPS deploy:
  ```bash
  cd /var/www/esggo/apps/stt
  python3 -m venv .venv && . .venv/bin/activate
  pip install -r requirements.txt   # fastapi, uvicorn, faster-whisper
  ```
- **pm2 ecosystem integration** (`ecosystem.config.cjs`): the STT entry must set `interpreter` to the **venv python**, NOT bare `python3`, or it crashes with `ModuleNotFoundError: No module named 'fastapi'`:
  ```js
  { name:'stt-whisper', cwd:'/var/www/esggo/apps/stt', script:'server.py',
    interpreter:'/var/www/esggo/apps/stt/.venv/bin/python3',
    env:{ STT_PORT:'8791', WHISPER_MODEL:'base', WHISPER_DEVICE:'cpu', WHISPER_COMPUTE:'int8' },
    max_memory_restart:'2G' }
  ```
  UT entry also needs `env.STT_PORT:'8791'` so `stt_client.mjs` targets the right port.
- Verified chain: UT `8788/health`=200, STT `8791/health`=200, `omniagent.esggo.co/health`=200, and `POST /speech-to-subtitle` no longer 502 (returns `{"error":"empty audio"}` for null body = chain alive).
- CPU-only whisper on 4/24 is usable but slow per segment; acceptable for the free-compute constraint. Do NOT add cloud STT (violates "只用免費算立").

## 36. Four-service pm2 architecture on esggo-vps (VERIFIED 2026-08-10)

`/var/www/esggo/ecosystem.config.cjs` manages **four** services via pm2, dependency-layered:

| Layer | Service | Port | Depends on | Notes |
|---|---|---|---|---|
| L2 inference | `stt-whisper` | 8791 | none | local faster-whisper (venv python) |
| L3 app | `universal-translator` | 8788 | 8791 | front-end bilingual subtitles |
| L3 app | `omniagent-gateway` | 8642 | none (needs `.env`) | OmniGateway; needs `GATEWAY_API_KEY` |
| L4 app | `esggo-core` | 3000 | none | Next.js; needs `pnpm build` output |

Root README "VPS 服務架構" section mirrors this table — keep both in sync when adding a service.

### 36.1 Three restart-loop root causes (all hit 2026-08-10, all fixed)
1. **`stt-whisper` ModuleNotFoundError: fastapi** — `ecosystem.config.cjs` interpreter MUST be the venv python (`/var/www/esggo/apps/stt/.venv/bin/python3`), NOT bare `python3`. Bare `python3` cannot see `faster-whisper`/`fastapi` installed in the venv. Verify after any deploy with `pm2 describe stt-whisper | grep interpreter`.
2. **`omniagent-gateway` restart loop (CRITICAL: GATEWAY_API_KEY required)** — gateway reads `apps/gateway/.env` at startup (`loadGatewayEnv` in `omni-server.mjs`) and exits if `GATEWAY_API_KEY`/`GATEWAY_KEY` absent. `.env` is gitignored, so `git reset --hard` wipes it. Fix: generate a random key on the VPS, store ONLY in `apps/gateway/.env` (never git, never GitHub Secret): `printf 'GATEWAY_API_KEY=%s\nGATEWAY_KEY=%s\n' "$(openssl rand -hex 32)" "$(openssl rand -hex 32)" > apps/gateway/.env && chmod 600 apps/gateway/.env`. `GEMINI_API_KEY` is optional (translation only) — gateway still starts without it.
3. **`universal-translator` 8788 not listening (ERR_MODULE_NOT_FOUND lang-matrix.mjs)** — `translate.mjs` imports `./types/generated/lang-matrix.mjs`, a *build-generated* file whose generator `scripts/sync-lang-matrix.mjs` does NOT exist in the repo. UT process shows `online` in pm2 but port 8788 never binds. Fix: the generated file now lives in repo at `apps/universal-translator/types/generated/lang-matrix.mjs` (minimal `toCanonical`/`toEngineLang` impl). If UT shows online but `curl :8788/health` = 000, check `ss -tlnp | grep :8788` — if not listening, the import crashed; read `pm2 logs universal-translator` for the real error.

### 36.2 esggo-core port-3000 stale-bind trap
On `pm2 start ecosystem.config.cjs` (full restart), the old `next-server` pid sometimes survives the restart and keeps port 3000, so the new `esggo-core` crashes with `[ELIFECYCLE] exit code 1` immediately after "Ready". Symptom: pm2 shows `waiting restart` / high restart count for esggo-core while `ss -tlnp | grep :3000` shows a DIFFERENT pid than the pm2-managed one. Fix: `pm2 delete esggo-core` → confirm `ss -tlnp | grep :3000` is empty → `pm2 start ecosystem.config.cjs --only esggo-core --update-env`. Do NOT rely on full `pm2 start ecosystem` for a single broken service.

### 36.3 deploy-oracle.yml full-start cascade pitfall
`deploy-oracle.yml` runs `pm2 start ecosystem.config.cjs --update-env` (or `pm2 kill` + start) on every deploy. This restarts ALL four services, including healthy ones, and re-triggers the §36.2 port race for esggo-core. Prefer incremental deploys: `pm2 start ecosystem.config.cjs --only <svc> --update-env` for the one service that changed. Also: `git reset --hard origin/main` in the deploy step silently deletes `apps/gateway/.env` (§36.1.2) — a deploy can re-break the gateway unless the key is re-injected or the `.env` is outside the repo / symlinked.

### 36.4 Service bring-up order after a fresh VPS reboot
1. `git fetch && git reset --hard origin/main` (pulls latest ecosystem + lang-matrix fix).
2. `pm2 start ecosystem.config.cjs --update-env` (all four).
3. If gateway loops: re-inject `apps/gateway/.env` (§36.1.2).
4. If UT 8788 down: check lang-matrix import (§36.1.3).
5. `pm2 save` to persist. Health probes: `for p in 3000 8642 8788 8791; do curl -s -m8 -o /dev/null -w "$p=%{http_code} " http://localhost:$p/health; done; echo`. (esggo-core root `/` returns 404 — that is NORMAL for Next.js, not a down signal; the 3000 listener existing is what matters.)

## 32. Gateway route contract (API mismatch pitfall — RESOLVED 2026-08-08)

There are **two** distinct Gateways on the VPS; do not confuse them:

1. **`:8420`** = `tdai-memory-core` container (docker-proxy). Has only `GET /health` (`{"status":"ok","version":"0.1.0",...}`); `/status`, `/oa/status`, etc. return `Not found` (verified 2026-08-08).
2. **`:8642`** = `omniagent-gateway` container (docker-compose, from `vps/omni-server.mjs`). Has `GET /status` (`{"status":"online","version":"0.14.1",...}`) but NOT the local CLI's `/oa/status`, `/gateway/status`, `/auth/verify`, `/routes` paths.

**Critical pitfall:** the LOCAL CLI tooling (esggo-cli / oa-cli / omnicli under `C:\Project\esggo-learning-center\cli\*`) was built expecting routes like `/status`, `/oa/status`, `/gateway/status` — these DO NOT exist on either V1 Gateway. The VPS Gateways are **different implementations** than the local CLI's assumed contract.

**Resolution (2026-08-08):** Deployed a NEW unified **OmniGateway** as a standalone host Node service at **`:8421`** (`/opt/esggo/vps/omnigateway/server.ts`, see §33.5). It implements the full local CLI contract AND aligns with ESG GO × OmniHermes API v1.2 envelope. Local CLI targets it via `~/.esggo/gateway.json` = `{"url":"http://161.118.248.180:8421","token":""}` — note `gateway.ts` `loadGatewayConfig()` reads ONLY `gateway.json` paths, NOT env vars, so `GATEWAY_TOKEN=...` env is ignored.

Connection-from-local behavior: a `fetch` from the local Windows host to `http://161.118.248.180:8421` may exceed a 3s `AbortController` timeout even when the port is open (the CLI's `gateway.ts` has a 3s timeout). A `401` = "connected, token missing"; `aborted` = "connected but slow"; `fetch failed` = "port not reachable". Local-host `curl http://localhost:8421/health` always works; public `https://gateway.esggo.co/...` needs the Cloudflare DNS CNAME (§33.4) added manually in the Dashboard.

| Check | Command |
|---|---|
| Next.js live | `curl -sS -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/api/health` |
| NGINX live | `curl -sS -I -H "Host: esggo.co" http://127.0.0.1/` |
| FTG live | `curl -sS -o /dev/null -w "%{http_code}" -H "Host: ftg.esggo.co" http://127.0.0.1/` |
| Gateway live | `curl -sS -o /dev/null -w "%{http_code}" http://127.0.0.1:8642/status` |
| HTTPS end-to-end | `curl -sS -I https://esggo.co/` + `curl -sS -I https://ftg.esggo.co/` |
| Build | `pnpm run build` or `npm run build` |
| Lint | `pnpm run lint` or `npm run lint` |
| Tests | `pnpm run test:run` or `npm run test:run` |

For HTTPS loops: bypass Cloudflare by hitting VPS IP with the correct Host header. If IP route succeeds but domain route loops, the loop is in Cloudflare cache / Page Rules / Always Use HTTPS interaction.

## 23. esggo-hub runtime syntax error diagnosis

When `esggo-hub` or a plugin reports a runtime syntax error from `/opt/esggo`, the failure is usually one of three shapes:

1. `SyntaxError: Unexpected identifier` from ESM-style syntax in a CommonJS/non-module context
2. `SyntaxError: Unexpected token 'export'` / `'import'`
3. ReferenceError from top-level `await` or bare `import()` outside an ES module

### Search strategy

Do not assume SSH is available. Use the first successful path in this order:

1. Direct SSH to `root@161.118.248.180` with key at `C:\Project\ESGGO VPS\id_rsa_esggo_real`
2. If port 22/2222 timeout, suspect firewall/network block and fall back to local checkout under `C:\Users\dingj\Downloads\esggo_v1.0-main\esggo_v1.0-main` or `C:\Users\dingj\esggo-learning-center`
3. If no local checkout exists, clone the repo or ask for a tarball before guessing

Target files to inspect unconditionally:

- `package.json` files containing `"name": "esggo-hub"` or directories named `esggo-hub`
- Plugin entry points: `src/`, `packages/`, `plugins/`, `.plugins/`, `hooks/`
- Systemd/docker entrypoints: `ecosystem.config.cjs`, `docker-compose*.yml`, `Dockerfile*`

### Quick surface-level triage without SSH

If you can load the running page in a browser:

- Open DevTools Console: `browser_console()`. Absence of JS errors on a reported runtime syntax failure suggests the plugin script is **never executed**, so the syntax error is caught at load time in a separate runtime context.
- A `SyntaxError` inside an `eval()`/`new Function()`/`require()` chain will not appear in the page console by default.

### Offending patterns to grep for

```bash
grep -RInE '^(await |import\(|export )' /opt/esggo  # top-level await / dynamic import / bare export
grep -RInE '^\s*(const|let|var)\s+\w+\s*=\s*require\(' /opt/esggo  # mix of CJS require and ESM syntax in same file
```

Common combinations that fail:

| Code shape | Why it fails | Fix |
|---|---|---|
| Top-level `await "x"` in `.js` without `"type":"module"` | Node interprets as CJS | Move into `async function` or add `"type":"module"` |
| `export default ...` in plugin loaded via `require()` | CJS loader rejects `export` | Use `module.exports = ...` or load via ESM |
| `import("data:...")` at top level in CJS | Not available outside module | Use `require()` or wrap in async function |
| `try { ... } catch (e) { console.error(e); }` swallowing syntax errors | SyntaxError thrown before execution, so `catch` never runs | Look at loader logs, not app logs |

### Minimal patch shape

- **Add `"type":"module"`** to the plugin's nearest `package.json` if the whole package uses ESM.
- **Wrap top-level `await` / dynamic `import()`** in an `async function init() { ... }` and call it from a normal execution path.
- **Replace bare `as` assertions** in non-module script contexts with normal assignments; `import { x as y }` and `export { x as y }` are only valid in modules.

Pitfall: Changing `package.json` `"type"` cascades to every `.js` file in that package. If the package mixes CJS and ESM, prefer renaming offending files to `.mjs` or moving ESM into a sub-module.

---

## 24. Restricted-environment git & repo sync (no terminal / execute_code blocked)

Context: Telegram/restricted sessions can lack `terminal` and have `execute_code` BLOCKED
(cron_mode approval), with `my_server` MCP scoped to ONE allowed dir (e.g.
`C:\Project\esggo-learning-center`). Git/GitHub work is still possible — but NEVER attempt
per-file copies (web_extract + write_file) for repos larger than a few hundred files.

### Current repo-state facts (2026-07-31)
- `C:\Project\esggo-learning-center` working dir: `origin` now points to
  `https://github.com/DingJun1028/esggo.git` (was esggo-learning-center.git) — changed by editing
  `.git/config` directly. Local content is STILL learning-center code, NOT yet synced to esggo.
  Verify the target before ANY push.
- esggo monorepo scale: **1,566 files / 526 dirs / ~35 MB** (TypeScript, 568 commits, 82 branches,
  default `main`; latest commit d9dd3f4 = PR #409 "fix(ci): Node 24 - typecheck, lint, vitest").
  Use git (clone / fetch+reset), never per-file extraction, at this scale.
- `soul.md` inside esggo-learning-center is a 0-byte placeholder; the real soul.md lives at
  `C:\Project\esggo\soul.md`.

### Techniques
1. **Change git remote without terminal**: edit `.git/config` directly (INI format) — swap the
   `url` line under `[remote "origin"]`, then read the file back to verify.
   Equivalent to `git remote set-url origin <url>`.
2. **Size a GitHub repo / list files without auth**: `browser_console` expression
   `fetch('https://api.github.com/repos/OWNER/REPO/git/trees/main?recursive=1').then(r=>r.json())`
   then count `type==='blob'` entries and sum `size`. Public repos work unauthenticated.
3. **Probe for a usable terminal**: dispatch `delegate_task` and have the subagent REPORT which
   tools it has and whether they reach the local Windows dir or a remote SSH host — then only
   proceed with git ops if it can actually touch the target dir. Don't assume.
4. **PowerShell fallback for the user** (safe one-liner pattern):
   ```powershell
   cd C:\Project\esggo-learning-center
   New-Item -ItemType Directory -Force _backup-<date> | Out-Null
   Copy-Item docs, AGENTS.md, IDEA.md, firebase.json, firestore.rules, .firebaserc, `
     esggo-auto-repair, scripts, types -Destination _backup-<date> -Recurse -Force
   git fetch origin main
   git reset --hard origin/main   # untracked files (.env, node_modules, _backup) survive reset
   ```
5. **Preserve-first copy strategy**: when merging repo A's files over a working dir holding
   valuable files (docs/, AGENTS.md, .env, firebase configs), inventory them first
   (my_server list_directory), keep them in place or back them up, and only overwrite genuinely
   conflicting paths (package.json and the like).

Worked example with exact commands/output: `references/restricted-env-git-ops.md`

---

## 25. Remote health check with no shell (restricted-session fallback)

When a session has NO terminal/execute_code (cron-mode subagent, Telegram, etc.) but the
task is "check VPS health / docker status", do NOT fabricate `docker ps` output. Instead:

1. **Probe public HTTPS endpoints** with `web_extract` (works without any shell):
   - `https://esggo.co/api/health` → JSON with `status`, `uptime`, and
     `components.{redis, agnes_api, firebase_admin, celestial_flow, esgsonar_gateway}`.
     `status:"degraded"` + `firebase_admin:"missing_config"` / `esgsonar_gateway:"unavailable"`
     pinpoints which dependency is down without docker access.
   - `https://esggo.co/api/healthz` → per-check JSON: `checks:[{name:"database",
     status:"error", message:"..."}, {name:"ai_model",...}]`. More diagnostic than /api/health.
   - Homepage `https://esggo.co/` and `https://ftg.esggo.co/` title/content → nginx + Next.js
     serving confirmed. `/resources` page returning "系統發生錯誤" is an app-level symptom,
     not a proof of downtime — cross-check the health endpoints first.
   - Gateway `https://esggo.co:8642/status` is NOT publicly reachable (tunnel/port closed) —
     don't count a failed scrape of it as evidence of gateway downtime.
   - Bare IP `http://161.118.248.180/` — verified 2026-08-04, probe WORKS (returns the nginx
     "AI Station 全自動影音生產線" app page, HTTP 200). Earlier sessions saw raw-IP DNS failure in
     the extractor; if the raw-IP probe fails, fall back to the domain (esggo.co) — but try the
     IP first, it is a valid independent channel.
   - Gateway health: `https://omniagent.esggo.co/health` → `{"status":"healthy"}` (verified
     2026-08-04). The raw `:8642` gateway port stays closed publicly — use the /health domain
     path, not a port probe.
   - **Hermes SSH backend IS this VPS**: the terminal tool failing with `getsockname failed:
     Not a socket` / `Read from remote host 161.118.248.180: Unknown error` is a LOCAL socket
     error in the Hermes SSH client — NOT VPS downtime and NOT evidence of IP drift. Confirm the
     real state via OCI console (instance Running + current public IP, authoritative) plus the
     external HTTP probes above before ever claiming the VPS is down.
2. **Report honestly**: container names/status/ports require real SSH
   (`ssh esggo-vps "docker ps -a --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'"`).
   Hand the exact command back to the parent/user if the session can't run it.
3. **Tool-probing order in restricted sessions** (detect the constraint fast, don't loop):
   - `read_terminal` is desktop-GUI-only → errors in headless/restricted sessions.
   - `close_terminal`/`process list` manage background processes — they do NOT execute commands;
     don't mistake them for a shell.
   - `execute_code` may be BLOCKED (cron_mode approval) — one attempt, then move on.
   - `computer_use` cua-driver session can be dead ("session has ended", no start_session
     action exposed) — after one failed capture, pivot to web_extract probes instead of retrying.
   - Check `my_server` `list_allowed_directories` to learn the session's file scope; the
     esggo SSH alias/key will NOT be reachable from an allowed dir in restricted sessions.

### DATABASE_URL ESSLREQUIRED signature
`/api/healthz` returning `database: error (ESSLREQUIRED) SSL connection is required for
user: postgres` means the Supabase pooler URL is missing the SSL flag. Fix on the VPS:
```bash
# in /opt/esggo/vps/.env (or wherever DATABASE_URL is set for esggo-core):
# DATABASE_URL=postgresql://postgres.<ref>@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres?sslmode=require
docker compose -f /opt/esggo/vps/docker-compose.prod.yml up -d esggo-core
```
Then re-check `https://esggo.co/api/healthz` until `database: ok`. The session pooler
requires `sslmode=require`; a bare URL gives this exact ESSLREQUIRED error.

## 29. OCI Boot Volume Online Expansion (resolve disk-full blocker)

When `df -h /` shows ~97% and `docker exec` fails with `No space left on device`, the root cause is usually a small boot volume (47 GB on esggo-vps). Expansion is **online, no instance recreation**:

1. Locate the boot volume OCID: `bv boot-volume list --region ap-singapore-1 --compartment-id <TENANCY>` → find `esggo-vps (Boot Volume)` → copy its `id`.
2. Expand at OCI layer: `bv boot-volume update --region ap-singapore-1 --boot-volume-id <BV_ID> --size-in-gbs 200` (state → PROVISIONING → AVAILABLE).
3. **SSH into the VPS and expand the OS view** — OCI layer alone is invisible to the kernel:
   ```bash
   echo 1 > /sys/class/block/sda/device/rescan
   growpart /dev/sda 1
   resize2fs /dev/sda1
   df -h /   # now ~193G total, ~151G avail
   ```
4. Verify both layers (OCI `get` shows 200G AVAILABLE; VPS `df` shows ~193G).

Pitfalls: OCI `update` does NOT grow the partition — you MUST `rescan`+`growpart`+`resize2fs` on the VPS or `growpart` reports `NOCHANGE`. `compute instance launch` with both `--image-id` and `--source-details` → `CannotParseRequest` (dedupe imageId). New AMD `E2.1.Micro` Always Free via CLI may loop on `CannotParseRequest` — use the Console UI for that. Full recipe + OCID parse notes: `references/oci-boot-volume-expand.md`.

## 5c. GitHub Actions secret injection (CREWAI_API_KEY / OPENAI_API_KEY pattern)

When a CI job needs a secret the user stored via `gh secret set`:
- `gh secret get <NAME>` **always exits 1 locally** — GitHub does not return secret values via CLI. This is by design, not a missing secret.
- The only reliable way to confirm a secret is correctly mounted is to **run the workflow** and echo `length=${#VAR}` in a step. If it prints `0`, the secret is NOT in the repo-level Actions scope (check Settings → Secrets → Actions, not Dependabot/environment).
- Verification standard for `.github/workflows/*.yml`: YAML parses (GitHub triggers the run = proof), and a real `run` shows the step executes. No `pnpm test` for workflows — assert structure with `yaml.safe_load` + a dry `gh workflow run` when blocked on a secret value.
- CrewAI execution in CI: install via `uv run --with 'crewai[litellm]'` (not `pip install` into setup-python's interpreter — that yields `ModuleNotFoundError: No module named 'crewai'`). Drive the LLM with `OPENAI_API_KEY: ${{ secrets.CREWAI_API_KEY }}` + `OPENAI_MODEL_NAME: gpt-4o-mini` when agents have no per-agent `llm` field.

## 34. VPS OOM freeze + self-hosted LLM model-size hard limit (VERIFIED 2026-08-08)

### 34.1 The 1.5× RAM rule (prevents OOM freeze)
This VPS has **5.8 GB total / ~2.8 GB available** RAM (Oracle Always Free ARM, post-2026-halving). Loading a model larger than ~1.5× available RAM freezes the box:
- `ollama pull gemma4:e4b` (9.6 GB) then `ollama serve` auto-loading it → **OOM kill / SSH banner-exchange timeout / system unreachable**.
- Symptom: `ssh -o ConnectTimeout=8 ubuntu@161.118.248.180` returns `Connection timed out during banner exchange` repeatedly; not a network issue, the box is swapping itself to death.
- **Rule**: on this VPS only run models ≤ ~2 GB (e.g. `gemma4:e2b` ~1.5 GB, `qwen2.5:3b` ~2 GB). `gemma4:e4b`/`gemma4:26b`/`gemma4:31b` DO NOT FIT. The §26 size table is the ceiling; when the esggo stack is also running, subtract its footprint first.
- The user's **local Windows Ollama** can run `gemma4:latest` (custom modelfile, RENDERER gemma4) fine — that is a different machine with more RAM. Do NOT assume the VPS can load the same tag.

### 34.2 VPS OOM unlock SOP (SSH down, box frozen)
When SSH times out but the instance shows `Running` in OCI Console:
1. **Oracle Cloud Console → Compute → Instances → Reboot** (1–2 min). This is the ONLY reliable unlock from the agent side when SSH is down.
2. Do NOT rely on OCI CLI/SDK to reboot: a valid API key may still return **401 NotAuthenticated** (public key not registered in Console, or OPENSSH-vs-PEM key format). 401 means you cannot issue `instanceAction SOFTRESET` — fall back to Console Reboot.
3. After reboot, SSH in IMMEDIATELY and `ollama rm gemma4:e4b` (or whichever oversized model) so it does not auto-load on next `ollama serve`. Then `ollama pull gemma4:e2b`.
4. Set the consuming service's model env to the small tag (e.g. HUB `.env` `OLLAMA_MODEL=gemma4:e2b`) and `pm2 restart <svc>`.

### 34.3 Cloudflare Tunnel WAF 403 on Python httpx/urllib (container → tunnel)
From inside a VPS Docker container, `httpx`/`urllib.request` calls to a Cloudflare-fronted subdomain (e.g. `https://gateway.esggo.co/...`) return **HTTP 403 Forbidden** (TLS/JA3 fingerprint blocked by WAF), even though `curl` from the same container returns 200.
- `curl https://gateway.esggo.co/health` → 200 ✅
- `python3 -c "urllib.request.urlopen(...)"` → 403 ❌
- **Fix**: in server code that must call a Cloudflared subdomain, shell out to `curl` via `subprocess` (or `asyncio.create_subprocess_exec`) instead of `httpx`. This is what `oab_sync.py` does for the OA-TWINS bridge (RWED PUT/DELETE to `/sync/deerflow:{user_id}:*`).
- DNS/network is fine (container resolves + curl works); only the Python TLS fingerprint is blocked. Do NOT "fix" by opening OCI ports or switching to raw IP — the tunnel is correct, just use curl.

### 34.4 git-bash `/c/` vs `C:/` path phantom inside Python/Node
When a Python script or Node `require()` runs under git-bash (Hermes terminal), a hardcoded `/c/Users/dingj/...` path is NOT resolved by the Python/Node runtime (they want Windows paths). Symptom: `FileNotFoundError: '/c/Users/dingj/.oci/config'` from Python, or `MODULE_NOT_FOUND: C:\\c\\Project\\...` from Node.
- **Fix**: use the Windows form `C:/Users/dingj/.oci/config` (forward slashes, explicit drive) inside Python `open()` / Node `require()`.
- For `git-bash` *shell* commands (ssh, scp, curl), `/c/Users/...` or `~` works — the phantom only bites the in-process runtime, not the shell.
- Never hardcode `/c/` in a `.py`/`.js` file; use `C:/` or `os.path.expanduser('~')`.

### 34.5 OCI config `[DEFAULT]` parse + reboot-via-REST (when CLI/SDK won't install)
- `configparser` hides `[DEFAULT]` (neither `cp["DEFAULT"]` nor `cp.defaults()` returns it when CRLF/git-bash interfere). **Parse the file manually** (split lines, skip `[` and lines without `=`). See `references/oci-reboot-via-rest-api.md`.
- If you must reboot a frozen VPS and OCI CLI/SDK install fails (pip SSL EOF, uv venv lock, npm 404/`oci-sdk` hang, MSI download fail), the **only** path that produced a correctly-signed request was a hand-rolled REST call using `cryptography` + stdlib `urllib`. But it still returns **401** if the API key's fingerprint isn't Console-validated — so the real unlock remains **OCI Console → Reboot** (§34.2). The REST script is a reference, not a reliable unlock.
- **Watchdog auto-deploy on recovery**: a background bash loop polling SSH every 10 min, scp + run deploy once (guarded by a `DEPLOY_DONE` flag). Launch with `terminal(background=true, notify_on_complete=true)` — NOT `nohup &` (runtime rejects shell wrappers). Pattern in `references/oci-reboot-via-rest-api.md`.

## 26. Oracle Always Free capacity (2026 halving) + free LLM engine options

Oracle quietly halved Always Free A1 on 2026-06-15 (4 OCPU/24GB → 2 OCPU/12GB; quotas
3,000/18,000 → 1,500/9,000 OCPU-hr/GB-hr) with NO announcement. Free-only accounts get
over-limit instances SHUT DOWN until resized; PAYG accounts may incur overage charges.
**However, esggo-vps was explicitly resized to the full 4 OCPU / 24 GB on 2026-08-10 via
`oci compute instance update --shape-config` (see §35.4) and is running at the always-free max —
do NOT assume it is still 2/12. Verify with `oci compute instance get` before any capacity decision.**
Plan around this for anything new on the VPS (Ollama/Gemma, memory gateways):

- Model fit under 2/12: Gemma 4 **E4B Q4 (~5GB)** is the ceiling alongside the esggo stack;
  26B/31B no longer fit — prefer free LLM APIs (Groq verified limits, Gemini Flash, CF Workers AI).
- Upgrade to PAYG to keep 4/24 (Always Free allotment stays free, ARM overage is cheap);
  stay Free-only → resize to 2/12 first.
- Ollama security: loopback bind `127.0.0.1:11434` + Cloudflare Tunnel/API-key in front
  (Ollama has no built-in auth).

Full decision tree, verified Groq limits, Gemma size table, and deploy sketch:
`references/oracle-free-tier-2026.md`
Related: `tencentdb-agent-memory` skill for wiring any free LLM engine into the TDAI memory gateway.

## 27. Hermes SSH terminal backend: env-var config + restricted-shell workarounds

### 27.1 Fixing "getsockname failed: Not a socket" — the SSH backend reads ENV VARS, not config keys

The Hermes terminal tool in this profile SSHes to this VPS. A failure like
`SSH connection failed: getsockname failed: Not a socket` / `Read from remote host <ip>: Unknown error`
is a LOCAL client-side error inside Hermes `tools/environments/ssh.py` (ControlPath/ControlMaster socket
setup), NOT VPS downtime — confirm real state with the §25 external probes before claiming anything.

Authoritative config (verified 2026-08 against ssh.py source + official docs):
- The SSH backend takes its settings from ENV VARS, not from `config.yaml` keys.
- `terminal.ssh_key` in config.yaml is a CUSTOM top-level key — `hermes config set terminal.ssh_key ...`
  saves it, but Hermes does NOT read it. The CLI even warns: "'terminal.ssh_key' is not a recognized
  config key – it was saved anyway, but Hermes may not read it."
- Required env vars belong in `.env` (secrets file), e.g.:
  TERMINAL_SSH_HOST=<vps-ip>
  TERMINAL_SSH_USER=ubuntu
  TERMINAL_SSH_PORT=22
  TERMINAL_SSH_KEY=C:\Users\dingj\.ssh\<key>
  TERMINAL_SSH_PERSISTENT=true
- Env changes require a Hermes RESTART — the SSH environment is built once per session; a new key/host
  does not hot-reload mid-conversation.
- After restart, verify with a real `terminal` command (echo/whoami). `hermes doctor`'s SSH check may
  lag: issue #29481 reported it ignoring configured SSH user/port/key; fix PR #29509 made it .env-aware.

### 27.2 computer_use self-injection pitfall (driving the Hermes TUI window)

When driving the local Windows desktop with computer_use to run a LOCAL command:
- The "Windows PowerShell"/WindowsTerminal window that HOSTS the running Hermes TUI is the agent's OWN
  terminal. Typing into it feeds Hermes' input line → you get "Redirected current turn" and phantom
  OUT-OF-BAND messages echoing your own keystrokes (self-injection loop). Never type there.
- To get a clean shell: click 新增索引標籤 (new-tab +) in Windows Terminal, then VERIFY the new tab shows
  a real prompt `PS C:\Users\dingj>` (no Hermes status bar / `$> msg=interrupt` line) BEFORE typing.
- Windows Terminal (CASCADIA_HOSTING_WINDOW_CLASS) drops background keystrokes → use
  delivery_mode='foreground' for key/type, then verify with capture.

### 27.3 Verifying GitHub Actions run state without gh/terminal (browser_console API fetch)

When terminal/gh CLI is unavailable, browser_console can fetch the GitHub API directly from the page
context — live and authoritative for public repos (avoids the cached page view):
```js
await fetch('https://api.github.com/repos/DingJun1028/esggo/actions/runs/<run_id>/jobs').then(r=>r.json())
// jobs[].{name, conclusion, status} — real terminal state per job
await fetch('https://api.github.com/repos/DingJun1028/esggo/actions/runs/<run_id>').then(r=>r.json())
// run_attempt = how many reruns happened; conclusion/status = terminal state
```
Semantics that matter:
- `gh run rerun <id> --failed` on a run whose jobs are ALL success is a NO-OP ("could not find any
  failed jobs"); it does not create a new run. Force a full re-run with `gh run rerun <id>` (no --failed).
- `run_attempt` in the run object = times rerun (attempt 2 = one prior rerun already done).
- Unauthenticated API GETs work for public repos; POSTs (rerun-failed-jobs) need auth — use UI or gh.

## 28. Cloudflare TypeScript SDK (v7) + npm workspace install gotcha

### 28.1 SDK v7 API shape (differs from v5-era docs / the internal gitlab README)
The public `npm install cloudflare@^7` package is API-compatible with the internal
`git+ssh://git@gitlab.cfdata.org:cloudflare/sdks/cloudflare-typescript.git` source (use the public one;
the gitlab source needs Cloudflare intranet SSH). Verified paths in v7.0.0:
- Tunnels are under **`client.zeroTrust.tunnels.cloudflared`**, NOT `client.accounts.tunnels`
  (the latter does not exist in v7).
  - list: `client.zeroTrust.tunnels.cloudflared.list({ account_id })` → `page.result[]` (each has `.id`, `.name`, both typed `string | undefined` → assert `!` when storing).
  - create: `client.zeroTrust.tunnels.cloudflared.create({ account_id, name, config_src: 'cloudflare' })`.
- DNS: `client.dns.records.list({ zone_id, name })` / `.create({ zone_id, name, type:'CNAME', content, ttl:1, proxied:true })`.
  The create param is a **union** (`CNAMERecord | ARecord | ...`); pass `as any` on the object to
  dodge the branded `Name` type friction (acceptable in an isolated tool script, not in core `src/`).
- Zones: `client.zones.list({ name })` → `.result.find(z => z.name === ZONE)` → `.id`. No `zones.get` by name.
- Auth: `new Cloudflare({ apiToken: process.env.CLOUDFLARE_API_TOKEN })`. Needs an **Account API Token**
  with `Zone:DNS:Edit` + `Account:Cloudflare Tunnel:Edit`. Prefer reading the token from env, never hardcode.
- Reference impl: `apps/cf-tunnel-manager/ensure-tunnel.ts` in the esggo repo (declarative ensure-tunnel:
  idempotent, fails closed with a clear message when `CLOUDFLARE_API_TOKEN` is absent).
- Copy-paste artifacts (SDK sketch + npm fix command): `references/cf-sdk-v7-and-npm-workspace-install.md`.

### 28.2 `npm install` crashes inside a pnpm workspace subdir (closure-net corruption)
When you `cd` into a leaf package under a pnpm workspace root and run `npm install`, npm detects the
**parent workspace root** (`/opt/esggo` had `pnpm-workspace.yaml`) and tries to resolve the ENTIRE
monorepo's dependency tree. If any transitive dep pulls a `git+https` source that is corrupted/unreachable
(e.g. `closure-net@git+https://github.com/google/closure-net.git` → tarball corrupted), npm aborts with
`Cannot read properties of null (reading 'matches')` and installs NOTHING — so the package's own dep
(e.g. `ws`) never lands, and the pm2 service crashes at start with
`Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'ws'`.
- Symptom: `npm install ws` still pulls `closure-net` and dies; `node_modules/ws` absent; pm2 shows
  `online` but the process immediately exits on import.
- Fix: disable workspace crawl for the isolated install:
  `npm install ws@^8.18.0 --no-package-lock --no-audit --no-fund --omit=dev --workspaces=false --include-workspace-root=false`
  → `added 1 package`, `ws` lands, service starts.
- Better: just use `pnpm --filter <pkg> add <dep>` from the repo root (pnpm respects the workspace and
  does not crawl git deps the way npm does). The crash was specific to invoking bare `npm` inside the tree.
- Hardening: in VPS deploy scripts that `cd` into a leaf and `npm install`, always pass
  `--workspaces=false --include-workspace-root=false` (or run from outside the workspace tree).

### 28.3 Credential self-retrieval before asking the user
When a task needs a Cloudflare/GitHub/API token, the agent's FIRST move is to try to fetch it itself
(per user direction "和秘密管理員索取密碼"): check 1Password CLI (`op`, requires desktop-app
integration sign-in — `op account get` returns `No accounts configured` if not signed in), VPS env,
local env, existing `cloudflared` cert, GitHub Secrets (`gh secret set/list` only — values are not
retrievable). If self-retrieval fails (1Password unsigned-in / no Account Token on VPS / GitHub
unreadable), report honestly and ask the user to paste — do not fabricate. After the user pastes a
plaintext secret, recommend rotating it (it is now in chat history). See also the `cf-tunnel-manager`
pattern: the live bring-up used the VPS `cloudflared` CLI + cert (no token), while the SDK script is
written but blocked on the missing Account Token — both paths documented, neither faked.

---

## 30. Lightweight Node service deploy-then-verify (universal-translator pattern)

Small single-file Node services (e.g. `apps/universal-translator/server.mjs`, no build step) deploy differently from the Next.js monorepo above. Verified recipe 2026-08:

### 30.1 Deploy flow
- `deploy.sh` shape: `node --check` all `.mjs` → `rsync`/`scp` to `/opt/esggo/apps/<app>/` → `pm2 restart <name> --update-env` (or `pm2 start server.mjs --name <name>` first time) → `pm2 save`.
- SSH key (Windows Git-Bash): always `-i ~/.ssh/esggo_original` (full path, not tilde). VPS user `ubuntu`, host `161.118.248.180`.
- Cloudflare Tunnel already routes subdomains: e.g. `translate.esggo.co` → `127.0.0.1:8788` is declared in `/etc/cloudflared/config.yml` `ingress`. **No nginx/certbot needed** for new subdomains behind the tunnel — just confirm the `hostname:` / `service:` line exists, then hit the public HTTPS URL.

### 30.2 Disk-full blocker (the #1 deploy failure)
- Symptom: `scp` silently fails / `df -h /` shows `100%` (`/dev/sda1 45G 45G 0 100%`). Docker overlay (image layers) is the usual root cause, NOT logs.
- Diagnose fast (avoid slow `du /`): `docker images -q | wc -l`, `docker images --format '{{.Size}} {{.Repository}}:{{.Tag}}'`, `docker builder prune -f` (often 0B), check dangling volumes `docker volume ls -qf dangling=true`.
- Free space: find an image with **no running container** (`docker ps --filter ancestor=<id>` empty) and `docker rmi <id>` it. Verified this session: removing orphan `esggo-core:latest` (2GB, no container) dropped disk 100%→97% and unblocked scp. If `docker rmi` hangs (I/O saturated at 100%), run it in a **background terminal** and poll `df -h /`.
- Do NOT delete images that have a running container (redis, deer-flow, hermes-webui, etc.) — those restart would fail.

### 30.3 Static-route 404 pitfall
- If `server.mjs` only maps `/`→`index.html`, sub-pages (`/studio.html`, `/stream.html`) return 404 externally even though the file exists in `public/`. Fix: serve any `public/*.html` by path, and add extension-less aliases (`/studio`, `/stream`, `/broadcaster`, `/receiver`). Verify with `curl -sSf -o /dev/null -w "%{http_code}" https://<subdomain>/studio.html` → expect 200.

### 30.4 Verify with REAL browser, not curl strings
- curl/Greetings-only checks miss visual breakage. This session a page referenced `var(--line)`/`var(--shadow)` never declared in `:root` → borders/shadows invisible; curl "contained the text" passed but the UI was broken.
- Correct verify: `browser_navigate` the public URL → `browser_snapshot` (DOM) + `browser_vision` (visual) → only then claim UI done. For live interaction (WebSocket translate): `browser_console` to set inputs + click connect, then read the result box after a bounded wait.
- Headless browser CANNOT grant mic permission — local Web Speech mic test must be done by the user on their own Chrome/Edge. Flag that step as user-action, don't fake it.
