---
name: esggo-vps-deploy-rescue
description: Oracle VPS SSH timeout, stuck deploy run, or UT HTTP 502.
---

# ESGGO VPS Deploy Rescue

## When to use
- SSH to `ubuntu@161.118.248.180` fails with `Connection timed out during banner exchange` but `ping` works
- A `deploy-oracle.yml` GitHub Actions run is stuck `in_progress` for >10 min
- universal-translator UI shows `轉錄錯誤: HTTP 502` (transcription error)
- Need to reboot VPS without losing data or changing specs

## Quick diagnosis tree
0. **Instance lifecycle-state? (CHECK FIRST — cheapest root cause)** `oci compute instance get --instance-id <ocid> --region ap-singapore-1 | python -c "import sys,json; print(json.load(sys.stdin)['data']['lifecycle-state'])"`. If `STOPPED`, the 502 / port-closed / `Connection timed out` is because the **whole VM is off** — not an sshd/key/auth problem. Fix = `oci compute instance action --instance-id <ocid> --region ap-singapore-1 --action START`, then wait ~2 min (ARM boot) and re-test ports. **This was the actual root cause of the 2026-08-25 live.esggo.co 502**: esggo-vps was STOPPED (Oracle ARM reclaim or a prior stop), not an SSH/authorized_keys issue. No key recovery or Serial Console needed for this case.
1. **Ping?** `ping -n 3 161.118.248.180` → 0% loss means host is alive
2. **Port 22 open?** `bash -c 'cat < /dev/null > /dev/tcp/161.118.248.180/22'` → "PORT 22 OPEN" means sshd listening
3. **SSH banner timeout + above two OK = VPS CPU/memory exhausted** (usually a stuck `next build` from a deploy run occupying all CPU)
   → Cancel the stuck GH Actions run FIRST; if SSH still dead after ~3 min, do OCI SOFTRESET

Key fact: `Connection timed out during banner exchange` (exit 255) with open port + working ping is NOT a network/auth problem — it is resource exhaustion. sshd accepts the TCP connection but cannot fork a session because the box is saturated.

## OCI CLI rescue (Oracle Cloud)
OCI CLI is at `C:\Program Files (x86)\Oracle\oci_cli\oci`. Config at `~/.oci/config` (region `ap-singapore-1`). No `OCI_*` env vars needed when config exists. Set `SUPPRESS_LABEL_WARNING=True` to silence the API-key label warning.

```bash
# List instances — MUST pass --compartment-id (defaults don't apply, empty result otherwise)
# Use the tenancy OCID as compartment-id
oci compute instance list --region ap-singapore-1 \
  --compartment-id ocid1.tenancy.oc1..aaaaaaaadof5rgb76zexk24q6fnhopqjnrqaxwmeuxunoynw46g3lj3lfnlq

# Get lifecycle-state + shape (confirms spec unchanged across reboots)
oci compute instance get --region ap-singapore-1 \
  --instance-id ocid1.instance.oc1.ap-singapore-1.anzwsljrkl3rykyc4fggmvq6kezm65dkzzj5nboi3ihax2qxtxyjnxvrpxza

# Soft reboot — PRESERVES OCPU / memory / boot volume. Does NOT change shape.
oci compute instance action --region ap-singapore-1 --instance-id <ocid> --action SOFTRESET

# Poll until RUNNING (STOPPING can linger 2-3 min under load)
for i in $(seq 1 20); do sleep 20; \
  oci compute instance get --region ap-singapore-1 --instance-id <ocid> \
  | grep '"lifecycle-state"'; done
```

**CRITICAL for user questions**: `SOFTRESET` / `RESET` never changes instance shape. OCPU, memory, and disk capacity stay identical across reboots. If the user asks "did the reboot change my VPS capacity/performance tier", the answer is **no** — only the OS restarted.

esggo-vps shape (stable): `VM.Standard.A1.Flex`, 1 OCPU (Oracle free-tier ARM).

## SSH key recovery (all local keys get Permission denied / Connection timed out)
When every local private key is rejected by `161.118.248.180` yet other subdomains return 200, the trusted pubkey is no longer present locally. Recovery path:

### Step 0 — Windows OpenSSH REJECTS 644-permission private keys (check FIRST)
Before assuming key mismatch or fail2ban, rule out the **Windows private-key permission trap** — this was the actual root cause of every `Permission denied (publickey)` in the 2026-08-25 session, not a key/auth problem.

Symptom: `ssh -v` shows `loaded pubkey from /c/Users/dingj/.ssh/KEY: RSA SHA256:xxxx` followed immediately by `no identity pubkey loaded from /c/Users/dingj/.ssh/KEY` and then server `Permission denied (publickey)`. The key is correct (pubkey matches VPS), but Windows OpenSSH refuses to USE a private key whose file ACL lets others read it.

Root cause: `chmod 600` in MSYS/git-bash is a **NO-OP** on Windows — `ls -la` still shows `-rw-r--r--` (644) and the key stays rejected. You must strip inheritance and grant only the owner via `icacls`:
```bat
icacls "C:\Users\dingj\.ssh\id_rsa_esggo" /inheritance:r /grant:r "dingj:(R)"
```
Verify: `icacls "C:\Users\dingj\.ssh\id_rsa_esggo"` should list only `NT AUTHORITY\SYSTEM:(F)`, `BUILTIN\Administrators:(F)`, `DINGJUN\dingj:(R)` (no `(F)` for dingj, no group read). After this, `Permission denied` changes to either a real auth result or `Connection timed out` (fail2ban/port-closed) — confirming the permission block is gone.

Do this for EVERY candidate key before troubleshooting further. A quick loop:
```bash
for k in /c/Users/dingj/.ssh/id_rsa_esggo /c/Users/dingj/.ssh/esggo_original /c/Users/dingj/.ssh/vps_aug18.key; do
  [ -f "$k" ] || continue
  icacls "$(cygpath -w "$k")" /inheritance:r /grant:r "dingj:(R)" >/dev/null 2>&1 && echo "fixed $k"
done
```

### Step 1 — identify the trusted pubkey (fingerprint cross-check)
Ask the user to paste the VPS `authorized_keys` pubkey line (or read it from Serial Console). Then find which local private key produces that pubkey:
```bash
for k in /c/Users/dingj/.ssh/id_rsa_esggo /c/Users/dingj/.ssh/esggo_original /c/Users/dingj/.ssh/esggo_original.bak.* ; do
  [ -f "$k" ] || continue
  pub=$(ssh-keygen -y -P "" -f "$k" 2>/dev/null) || continue
  echo "$pub" | grep -q "<PASTED_PUBKEY_PREFIX>" && echo "MATCH: $(basename $k)"
done
```
Reusable script: `scripts/find-matching-key.sh <pubkey-prefix-or-file>`.
Confirmed 2026-08-25: VPS trusted `ssh-key-2026-07-22` matched local `id_rsa_esggo` / `esggo_original` / `esggo_original.bak.*` (same keypair copies — three filenames, one key).

### Step 2 — fail2ban false-negative trap (DISTINCT from resource exhaustion)
Repeated `Permission denied (publickey)` attempts trigger VPS fail2ban/sshguard to TEMP-BLOCK the source IP. Subsequent attempts then return `Connection timed out` (NOT denied). This looks identical to "VPS dead / banner timeout" but is an **auth-rate lock, not resource exhaustion**:
- Wait ~10 min for auto-unban, OR connect from a different source IP.
- Do NOT reboot/SOFTRESET for this — the box is fine.
- Distinguisher: `Connection timed out during banner exchange` WITH open port + working ping = resource exhaustion (cancel stuck GH run first). `Connection timed out` ONLY AFTER a burst of `Permission denied` = fail2ban. The prior `Permission denied` is the tell.

### Step 3 — OCI CLI CANNOT add ssh_authorized_keys
`oci compute instance update --metadata file://meta.json` REJECTS any change to the `ssh_authorized_keys` field:
`InvalidParameter: The 'ssh_authorized_keys' metadata field cannot be updated and must be provided with the already existing value.`
OCI CLI 3.90.1 has NO `--ssh-authorized-keys` param. The API path to inject a new key is **blocked by design** — do not waste rounds retrying `update --metadata`. Options: (a) recover the matching private key (Step 1) + wait out fail2ban (Step 2), then SSH normally; (b) Serial Console (Step 4).

### Step 4 — Serial Console (only if no matching key exists)
```bash
# list existing (needs compartment-id = tenancy OCID)
oci compute instance-console-connection list --instance-id <ocid> --compartment-id <tenancy-ocid> --region ap-singapore-1
# delete if ACTIVE (else create fails IncorrectState); --force skips the y/N prompt (non-pty safe)
oci compute instance-console-connection delete --instance-console-connection-id <cc-ocid> --region ap-singapore-1 --force
# create — DIRECT path, NOT file://
oci compute instance-console-connection create --instance-id <ocid> --region ap-singapore-1 --ssh-public-key-file "C:/Users/dingj/.ssh/<key>.pub"
# get connection string (ProxyCommand through instance-console host)
oci compute instance-console-connection get --instance-console-connection-id <cc-ocid> --region ap-singapore-1
```
Connection string: `ssh -o ProxyCommand='ssh -W %h:%p -p 443 <cc-ocid>@instance-console.ap-singapore-1.oci.oraclecloud.com' <instance-ocid>`.
CAVEAT (2026-08-25, unresolved): jump-host `<cc-ocid>@instance-console...` returned `Permission denied (publickey)` — key propagation or key mismatch; AND the agent's non-pty terminal cannot complete the interactive `login:` prompt Serial Console presents. If Serial Console auth fails, fall back to recovering the matching private key (Step 1). Do not present Serial Console as a reliable unlock path.

## GitHub Actions unstick
```bash
gh run list --repo DingJun1028/esggo --workflow deploy-oracle.yml --status in_progress
gh run cancel <run_id>          # frees the stuck run
gh workflow run deploy-oracle.yml --repo DingJun1028/esggo   # trigger fresh
```
`deploy-oracle.yml` uses concurrency group `deploy-oracle-vps` with `cancel-in-progress: false` → a new run **waits** for the old one. Always `gh run cancel` stuck runs before triggering new ones, or the new run sits `pending` forever.

## universal-translator STT 502
Root cause: `apps/universal-translator/server.mjs` (line ~237) and `stt_client.mjs` call `http://127.0.0.1:8791/transcribe` for STT, but **no faster-whisper service was deployed** (repo had no STT service until `apps/stt/server.py` was added). The UI shows generic "HTTP 502" because the fetch fails connecting to the missing service.

Fix (see references/ut-stt-deploy.md):
- Deploy `apps/stt/server.py` (FastAPI + faster-whisper, CPU int8, zero-key — satisfies the "only free compute" rule)
- Add `stt-whisper` service to `ecosystem.config.cjs` (interpreter `python3`, env `STT_PORT=8791`, `WHISPER_MODEL=base`)
- UT service env needs `STT_PORT: '8791'`
- `stt_client.mjs` should distinguish `502/ECONNREFUSED` (STT not deployed) from other errors so the UI shows a clear message instead of a bare 502

## Production topology: esggo.co is DOCKER, not pm2

**First diagnostic**: `docker ps` on VPS. If a container named `esggo-core` exists with `127.0.0.1:3080->3000/tcp`, **production is a Docker container** built from `Dockerfile` (service name `esggo` in `vps/docker-compose.yml`). The `pm2` `esggo-core` you may also see is a *zombie watchdog* — do NOT fix production via pm2. (Verified 2026-08-11: a session spent many rounds editing `ecosystem.config.js`/pm2 only to discover the live site is the docker container.)

Two distinct failure modes:

### A) Docker container up but app unhealthy / 502
Container `esggo-core` shows `Up` but `unhealthy`, and `curl 127.0.0.1:3080/api/healthz` fails. Usually a **stale image** (no new code) or a missing env var. Fix = rebuild image (below) + ensure compose `environment:` has the vars. **Do not** `pm2` anything.

### B) No container / image won't rebuild (pnpm + Prisma lock)
`docker compose build esggo` fails. Two independent locks bite:

1. **pnpm 11 deps-status-check**: `RUN pnpm run build` in the builder stage triggers `ERR_PNPM_IGNORED_BUILDS: tesseract.js@7.0.0` → build exit 1. **Fix: change `RUN pnpm run build` → `RUN npx next build`** (skips pnpm, matches local verification). Also add to `pnpm-workspace.yaml`:
   ```yaml
   onlyBuiltDependencies:
     - tesseract.js
     - prisma
     - sqlite3
   ```
   so `pnpm install` (CI + docker deps stage) passes the build-script gate. This alone unblocks most builds.
2. **Prisma `libssl.so.1.1` on Alpine 3.24 — FINAL WORKING FIX = upgrade Prisma, do NOT restore old Dockerfile.**
   `node:22-alpine` = Alpine 3.24 (no openssl-1.1). Prisma 5.22's musl engine links `libssl.so.1.1` → `PrismaClientInitializationError` at runtime even if build succeeds.
   **Things that DO NOT work** (verified 2026-08-11, many rounds wasted):
   - `apk add openssl1.1-compat` (package absent in 3.24 repo)
   - `wget` the v3.19 `.apk` and copy `.so` (no network inside build/container)
   - adding v3.19 repo to `/etc/apk/repositories` (no network; also arch mismatch)
   - base `node:22-alpine3.19` (corepack keyid signature error + pnpm 11 needs node ≥22.13 but 3.19 ships 22.11)
   - restoring `e0e5a2eb9` Dockerfile + `npx next build` (still builds 5.22 engine → same libssl crash at runtime)
   **Working fix (2026-08-11, `45f9b1690`+`88243d2f1`):**
   ```bash
   # package.json: prisma + @prisma/client ^5.22.0 -> ^6.19.3
   npm view prisma@6 version   # 6.19.3
   # update lock: pnpm install --frozen-lockfile (onlyBuiltDependencies lets it pass)
   # schema.prisma binaryTargets already has linux-musl-arm64-openssl-3.0.x (correct)
   git add package.json pnpm-lock.yaml pnpm-workspace.yaml Dockerfile
   git commit -m "fix(docker): prisma 5.22->6.19.3 openssl-3 native"
   git push
   # VPS: git pull && docker compose build esggo   # Image vps-esggo Built ~48s, no libssl error
   ```
   Prisma 6.x engine links `libssl.so.3` (native in Alpine 3.24). No compat package, no base downgrade.
3. **`/app/data` EROFS at runtime** (after Prisma fixed): app does `mkdir /app/data` → `ENOENT`, then `EROFS: open '/app/data/ncbdb.json'`. Fix: in Dockerfile runner stage `RUN mkdir -p /app/data /app/public/uploads`, and in compose `volumes:` add `esggo-data:/app/data` (the existing `esggo-data:/app/public/uploads` is not enough).
4. **healthz 503 but page 200**: `/api/healthz` returns 503 when env (`DATABASE_URL`/`REDIS_*`/`FIREBASE_*`) is incomplete (route returns 503 if <half configured). `/omni/reports` still renders 200. Cloudflare Tunnel / LB may treat 503 as down → external 502. Fix: ensure VPS `.env` has the DB/REDIS vars, OR change the healthcheck to TCP. The app works regardless; this only affects LB health gating.
5. **host `curl 127.0.0.1:3000` DOWN but `docker exec ... curl 127.0.0.1:3000` = 200**: docker `127.0.0.1:3000->3000` mapping shows in `docker port` and `ss`, but host-side curl fails. Means docker userland-proxy/bridge isn't forwarding to the container (common when the legacy systemd/pm2 `next` was the thing actually serving 3000 and got killed). The real serving process may be dead. Diagnose: `docker stats esggo-core` (is it Using CPU?) + `docker exec esggo-core wget -q -O - http://127.0.0.1:3000/` (200 = app alive inside). If inside=200 but host=down, the port mapping is the problem → restart the container (`docker rm -f esggo-core && docker compose up -d esggo`) after clearing port 3000 squatters (see Restart section). Cloudflare Tunnel config `/etc/cloudflared/config.yml` proxies `esggo.co → http://127.0.0.1:3000`, so once the container owns 3000 cleanly, Tunnel serves it.

### Restart the container (clear port 3000 first!)
Old `next-server` zombies (root, Aug-era) AND the pm2 `esggo-core` watchdog AND legacy `esggo-app.service` (systemd, `Restart=always`) all grab port 3000, causing `failed to bind host port 127.0.0.1:3000/tcp: address already in use`. Clear ALL three before `up -d`:
```bash
ssh -i ~/.ssh/ci_deploy_key ubuntu@161.118.248.180
# 1) stop pm2 watchdog (it auto-restarts next)
pm2 stop esggo-core 2>&1 | tail -1
pm2 delete esggo-core 2>&1 | tail -1
# 2) stop legacy systemd (root, Restart=always — disable so it stays dead)
sudo systemctl disable --now esggo-app.service 2>&1 | tail -1
# 3) kill any stray next-server holding 3000
fuser -k 3000/tcp 2>/dev/null; sleep 3
ss -tlnp 2>/dev/null | grep 3000 && echo STILL_HELD || echo PORT_FREE
docker rm -f esggo-core 2>&1 | tail -1
cd /var/www/esggo && docker compose -f vps/docker-compose.yml up -d esggo
sleep 45
curl -sf -m10 http://127.0.0.1:3000/api/healthz -o /dev/null && echo HEALTH_OK || echo HEALTH_FAIL
```
Note: `systemctl disable` alone may not kill a running instance — pair with `--now` (stop) and re-check `ss`. Service name is **`esggo`** in compose (container is `esggo-core`). `docker compose build esggo` / `up -d esggo`.

### Activating Agentic Twin (Ollama) + Evidence Vault (MinIO) on VPS
B/D code is in the tree; only env wiring is needed. VPS already runs Ollama (:11434), MinIO (:19001), SonarQube CE (:19000) — all free, no new installs.
- VPS `vps/docker-compose.yml` `esggo` service `environment:` must reference `${AGENTIC_TWIN_OLLAMA_URL:-}` and `${MINIO_ENDPOINT:-}` etc. (docker compose reads `.env`, NOT `.env.local`).
- VPS `/var/www/esggo/.env` needs: `AGENTIC_TWIN_OLLAMA_URL=http://127.0.0.1:11434`, `AGENTIC_TWIN_OLLAMA_MODEL=qwen2.5:3b-instruct-q4_K_M`, `MINIO_ENDPOINT=127.0.0.1:19001`, `MINIO_ACCESS_KEY/SECRET_KEY/BUCKET/PUBLIC_BASE`.
- Verify in-container: `docker exec esggo-core sh -c 'echo $AGENTIC_TWIN_OLLAMA_URL'` → should print the URL. If empty, the compose env block or `.env` is missing the var.
- Live proof: `curl -s https://esggo.co/api/agentic-twin -X POST -H 'Content-Type: application/json' -d '{"uuid":"x"}'` → `llmEnhanced:true` means Ollama path active.

### Legacy pm2-only fix (ONLY if `docker ps` shows NO esggo-core container)
Bypass pnpm and run `next start` directly (kept for non-docker hosts):
```bash
ssh -i ~/.ssh/ci_deploy_key ubuntu@161.118.248.180
pm2 delete esggo-core
cd /var/www/esggo
PRISMA_SKIP_POSTINSTALL_GENERATE=1 \
  NODE_ENV=production HOSTNAME=127.0.0.1 PORT=3000 NEXT_TELEMETRY_DISABLED=1 \
  nohup ./node_modules/.bin/next start -H 127.0.0.1 -p 3000 > logs/next-direct.log 2>&1 &
curl -sf -m10 http://127.0.0.1:3000/omni/reports -o /dev/null && echo LOCAL_UP || echo LOCAL_DOWN
```
Env-loading caveat: `next start` only sees vars if exported at launch. Confirm: `tr '\0' '\n' < /proc/$(pgrep -f 'next start'|head -1)/environ | grep -cE 'AGENTIC_TWIN_OLLAMA_URL|MINIO_ENDPOINT'` → ≥1.

## Pitfalls
- **"回復到之前的等級" is ambiguous** — user may mean VPS specs (shape/capacity), NOT code rollback. Always clarify before rolling back commits or redeploying old state. In this session the user meant VPS capacity tier, which SOFTRESET never alters anyway.
- OCI `instance list` returns EMPTY if `--compartment-id` is omitted. Pass the tenancy OCID.
- SOFTRESET can sit in `STOPPING` for 2-3 min under heavy load — poll, do not re-issue.
- VPS SSH dies because a deploy run's `pnpm install` + `next build` saturate CPU. Cancel the run BEFORE OCI reset when possible; reset is the last resort.
- After VPS reboot, pm2 services that were `online` before reboot stay managed but may need `pm2 start ecosystem.config.cjs --update-env` to come back.
- **pnpm postinstall crash loop**: `pnpm run start` on VPS can loop-crash on `prisma generate` EPERM. Don't restart via pnpm — switch to direct `next start` + `PRISMA_SKIP_POSTINSTALL_GENERATE=1` (see section above).
- **VPS repo cwd is `/var/www/esggo`**, NOT `/opt/esggo` (older docs wrong). Verify with `pm2 describe esggo-core | grep cwd`. SSH key that worked 2026-08-11: `ci_deploy_key` (`-i ~/.ssh/ci_deploy_key`); `esggo_original` also valid.
- **Verification network isolation (2026-08-11)**:
  - GitHub Actions runner **cannot reach `esggo.co`** (`page.goto` 30s timeout) → E2E-against-live CI jobs must be `if: vars.E2E_ENABLED == 'true'` (opt-in) or run locally. NOT a code bug.
  - Local Windows MSYS `curl` **cannot reach VPS `:19000`/`:19001`** (OCI security list blocks inbound on those ports) → verify SonarQube/MinIO from **VPS localhost** (`ssh ... 'curl http://localhost:19000/...'`), never from your laptop.
  - Local Windows **Playwright CAN reach `localhost:3000`** (dev server) → E2E against local `next dev` is the reliable regression gate.
- **`.env` on VPS may not exist** even though the launcher does `source .env 2>/dev/null` (silent fail). To add runtime vars (AGENTIC_*/MINIO_*), create `/var/www/esggo/.env` (or source it explicitly in the start script) — `.env.local` is NOT sourced by `bash -c 'source .env'`.
- **Pivot-to-hub when stuck in deploy firefighting (2026-08-11 lesson)**: if you burn >~5 rounds on VPS port/docker/prisma issues without the site coming up, the user may say "納入 esggo hub" / "消先納入esggo hub" — meaning: STOP poking the server, and instead **consolidate the verified gains into the repo** (commit B/D code + soul.md §24.1/§25.1/§25.2 records + backup落檔 + patch the wake skill). Code-in-main IS the deliverable; the live 502 can be resolved later by the legacy-systemd-disable recipe above. Do not loop forever on the running container.
- **`hermes verify` EPERM on local Windows (not a code bug)**: `hermes verify` bootstrap runs `pnpm install` → postinstall `prisma generate`, which fails on Windows with `EPERM` renaming `query_engine-*.tmp` → `.node`. This is a **local dev-machine file-permission limit**, not a defect in the change under test. Verify instead with `npx` paths that bypass pnpm: `npx vitest run <paths>`, `npx tsc -p tsconfig.json --noEmit`, `node --check app/api/.../route.ts`. For local prisma generate set `PRISMA_SKIP_POSTINSTALL_GENERATE=1` and run `npx prisma generate` explicitly. Do NOT "fix" this by editing project code.
- **Vercel preview/production build OOM (exit 143 / exit 1, "Next.js build worker exited with code: 143")**: symptom — ALL `esggo/*` Vercel preview deployments show `● Error` (esggomvp, esgss-jak, esgss_junaikey_beta, esggo-mvp, etc.), while local `npm run build` / `pnpm run build` succeed. Root cause: `package.json` build script had `NODE_OPTIONS=--max-old-space-size=8192` hardcoded → Vercel's build instance (Hobby 1 GB / Pro ~3 GB) cannot allocate 8 GB → OOM-kill → `npm run build` exits 1 (logs show only `npm install` warnings, hiding the real OOM). **Validated fix (2026-08-14)**:
  ```json
  // package.json — keep NODE_OPTIONS in the build script at a Vercel-safe value
  "build": "cross-env NEXT_TELEMETRY_DISABLED=1 NODE_OPTIONS=--max-old-space-size=3072 next build"
  ```
  ```json
  // vercel.json — mirror it in env so Vercel build uses the same
  "env": { "NODE_OPTIONS": "--max-old-space-size=3072" }
  ```
  - **3072 is the validated sweet spot**: 2048 is TOO LOW (page-data collection for `/api/ai-notes/[id]` crashes with `Failed to collect page data` → exit 1); 8192 OOMs Vercel. 3072 builds clean locally AND on Vercel.
  - **Both places must carry it**: putting it ONLY in `vercel.json` env and removing from `package.json` breaks local/`hermes verify` builds (they don't read `vercel.json` env → default memory → Turbopack OOM at 143). Putting it ONLY in `package.json` (at 8192) OOMs Vercel. Keep 3072 in BOTH.
  - Node 24.x is set on the Vercel project (`nodeVersion: 24.x`), so the value is the only memory lever.
  - After fix, push to `main` → Vercel auto-redeploys; any open preview PR (e.g. Jules-bot `sentinel/*` branches) rebased on new `main` builds green. If a specific `sentinel/*` branch can't be fetched (bot fork/branch already deleted), fix on `main` and let it inherit.
  - **Diagnosis pitfall**: `vercel inspect` / `vercel logs` return "deployment never reached READY and ended in ERROR" with no build log — you cannot see the OOM from Vercel CLI. Reproduce locally with `NODE_OPTIONS="--max-old-space-size=<n>" npx next build` to find the working value.

- **Credential source of truth (2026-08-25)**: Pasted deployment guides (e.g. "SSH login: root, password !S...") may describe a DIFFERENT or STALE VPS. The authoritative login user is what the OCI Serial Console `login:` prompt accepts, and the OCI console "SSH 金鑰" field shows the trusted pubkey. For esggo-vps the login user is **`ubuntu`** (confirmed via Serial Console web terminal), NOT `root`/`dingj` from a pasted doc. Don't burn rounds trying `root`/`dingj` from a stale guide — the `login:` prompt tells you the real username. Also: the VPS **SSH password login is disabled** (key-only), so a pasted password is useless for SSH; only the web Serial Console terminal accepts the account password (it bypasses sshd's PasswordAuthentication).
- **Boot Volume rescue is a trap for SSH-lockout (2026-08-25, verified dead-end)**: Do NOT detach/attach the Boot Volume to a temp rescue instance to edit `authorized_keys`. OCI eventual consistency causes `Conflict: Volume currently attached` even when `boot-volume-attachment list` shows `DETACHED`, and re-attaching to a *different* instance also conflicts. The lock persisted >3 min across multiple retries. If you already stopped the instance, the safe recovery is: re-attach the Boot Volume to the **ORIGINAL** instance (`oci compute boot-volume-attachment attach --instance-id <vps-ocid> --boot-volume-id <bv-ocid> --region ap-singapore-1` — note: NO `--compartment-id`/`--availability-domain`; detach uses `--boot-volume-attachment-id <instance-ocid> --force`), wait for consistency, then `instance action START`. The reliable unlock for an empty `authorized_keys` is the **OCI web-console interactive Serial Console terminal** (Console Connection → 啟動 Cloud Shell 連線), NOT boot-volume surgery.

### C) systemd + pm2 port conflict → 502 after restart
Symptoms: `esggo-app.service` shows `active (running)`, but `curl https://esggo.co` returns 502. Logs show `EADDRINUSE 127.0.0.1:3000` for `next-server` while another process also holds 3000.
Root cause: both `systemd` (`/etc/systemd/system/esggo-app.service`) and `pm2` were trying to run `next start -H 127.0.0.1 -p 3000` from overlapping working directories. After a deploy or restart, the old process keeps port 3000 and the new one crashes immediately.
Fix:
```bash
ssh -i ~/.ssh/ci_deploy_key ubuntu@161.118.248.180
# Identify the real owner of 3000
ss -ltnp | grep ':3000'
# If both systemd pid and another pid show up, pick ONE supervisor
# Option 1: disable systemd service, keep pm2
sudo systemctl disable --now esggo-app.service
pm2 delete esggo-core
cd /var/www/esggo && pm2 start npm --name esggo-core -- start
# Option 2: keep systemd, kill stray/duplicate
sudo systemctl daemon-reload && sudo systemctl restart esggo-app.service
```
Key: do NOT run both at once. Confirm with `ss -ltnp | grep ':3000'` showing only one `next-server`.

### D) Middleware public-route omission → 401 on public APIs
Symptom: `/api/evidence-upload` returns `401 Missing authorization token` even though the route handler does not require auth.
Root cause: `src/middleware.ts` protects by prefix list; any public API route must be in `PUBLIC_ROUTES` or it falls through to Firebase auth. The default list often omits newer routes.
Fix: edit `src/middleware.ts` and add the route to `PUBLIC_ROUTES` with a **string literal**, not a regex literal. Turbopack/Next 16 rejects `/api/foo` in a string array (`Unknown regular expression flags`).
```ts
const PUBLIC_ROUTES: readonly string[] = [
  '/api/evidence-upload',   // must be quoted
  '/api/healthz',
  ...
];
```
Then rebuild/restart. If the running app uses compiled `.next/server` middleware, a rebuild is required for the change to take effect.

### E) pnpm approve-builds blocking CI deploy (non-interactive)
Symptom: deploy log shows `Run "pnpm approve-builds" to pick which dependencies should be allowed to run scripts.` and `pnpm install` exits 1.
Fix: run `pnpm approve-builds --all` before `pnpm install` in any non-interactive deploy script. Example:
```bash
cd /var/www/esggo
pnpm approve-builds --all
pnpm install --frozen-lockfile
```
Note: this also resolves `postinstall` prompts like `opencollective-postinstall` that would otherwise fail headless builds.

### F) Ollama local verification from VPS
When `/api/agentic-twin` returns `llmEnhanced:false` but Ollama is running locally, verify the model path directly:
```bash
curl -s -m90 http://127.0.0.1:11434/api/chat \
  -d '{"model":"qwen2.5:3b","messages":[{"role":"user","content":"hi"}],"stream":false}'
```
A 200 with `message.content` means Ollama is healthy; the Next route is failing before or during the LLM call. Check that the running process actually sources `.env` with `AGENTIC_TWIN_OLLAMA_URL`.

### G) Next.js build failures from unrelated app routes
When building a sub-app such as `esggo-omni-center` fails on `/api/sustain-write/v5/documents` due to `esg-sonnar-client` imports, the route depends on live `/api/sonnar/*` backends. If those backends are missing, `next build` can fail on dynamic routes. Workaround: build from the root workspace app that actually contains the production route tree, or stub the missing backend routes during build. Do not assume all `apps/*` directories are independently buildable.

### live.esggo.co 502 (nginx upstream down, DNS-only subdomain)
`live.esggo.co` is **grey-cloud / DNS-only** → A record `161.118.248.180` (NOT Cloudflare-proxied like esggo.co / translate.esggo.co). A 502 with `Server: nginx/1.24.0 (Ubuntu)` and NO `cf-ray` header = the VPS nginx itself returned 502 because its `proxy_pass` upstream (a pm2 service) is dead. This is a DISTINCT failure mode from the docker esggo.co stack (§Production topology) — live.esggo.co is served by a standalone pm2 service behind nginx, not the docker container.
Fix once SSH works:
```bash
grep -r "live.esggo.co" /etc/nginx/sites-enabled/      # find proxy_pass port
pm2 list                                            # find EXITED service
pm2 restart all                                     # revive node upstreams
sudo nginx -t && sudo nginx -s reload
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:<live-port>/
```
Confirm with `curl -sI https://live.esggo.co` from laptop: `Server: nginx` + no `cf-ray` ⇒ VPS nginx 502 (not Cloudflare tunnel).

## Support files
- `references/ut-stt-deploy.md` — detailed STT service deployment recipe (venv, pip, pm2, health check)
- `references/esggo-core-docker-rescue-2026-08-11.md` — validated end-to-end recipe: Prisma 6 upgrade + pnpm lock bypass + 3-way port-3000 squatter clear + B/D env wiring + diagnostic tree
- `scripts/find-matching-key.sh` — cross-check local private keys against a pasted VPS pubkey (SSH key recovery Step 1)
