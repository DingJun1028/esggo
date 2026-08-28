---
name: esggo-vps-ops
description: Operate ESGGO VPS pm2 services and OCI instance control.
---

# ESGGO VPS Operations Playbook

VPS: Oracle Cloud `ubuntu@161.118.248.180` (ap-singapore-1). Shape `VM.Standard.A1.Flex` 4 OCPU / 24 GB (always-free max, upgraded 2026-08-10 from 1/6). OCI CLI at `C:\Program Files (x86)\Oracle\oci_cli\oci`, `~/.oci/config` region `ap-singapore-1`. Instance OCID: `ocid1.instance.oc1.ap-singapore-1.anzwsljrkl3rykyc4fggmvq6kezm65dkzzj5nboi3ihax2qxtxyjnxvrpxza`.

Services are managed by a single `pm2` `ecosystem.config.cjs` at `/opt/esggo`. SSH key: `esggo_original` (use `-i ~/.ssh/esggo_original`, user `ubuntu@161.118.248.180`); `ci_deploy_key` (`-i ~/.ssh/ci_deploy_key`) also works (verified 2026-08-11). NOTE: `esggo-vps-sync-troubleshooting` confirms `git@` is ALWAYS `Permission denied` on this VPS — only `ubuntu@` connects.

**CRITICAL cwd correction (2026-08-11)**: esggo-core actually runs from **`/var/www/esggo`** (NOT `/opt/esggo`). The `ecosystem.config` shipped in-repo has a Windows-style `cwd: 'C:\\var\\www\\esggo'` — that is dead on Linux. VPS `/var/www/esggo` is a separate checkout that pm2 actually starts. Always `pm2 describe esggo-core | grep cwd` before assuming paths. SonarQube CE, MinIO also live on this VPS under `/opt/sonarqube`, `/opt/minio` (docker).

## esggo-core restart

**Preferred direct path** — avoids pnpm `postinstall` EPERM on `prisma generate`:
```bash
ssh -i ~/.ssh/ci_deploy_key ubuntu@161.118.248.180
pm2 delete esggo-core
cd /var/www/esggo
PRISMA_SKIP_POSTINSTALL_GENERATE=1 NODE_ENV=production HOSTNAME=127.0.0.1 PORT=3000 NEXT_TELEMETRY_DISABLED=1 \
  nohup ./node_modules/.bin/next start -H 127.0.0.1 -p 3000 > logs/next-direct.log 2>&1 &
curl -sf -m10 http://127.0.0.1:3000/omni/reports -o /dev/null && echo LOCAL_UP || echo LOCAL_DOWN
```

**Verified alt (2026-08-11)** — if `node_modules` already present and `pnpm` runtime works, this also starts cleanly:
```bash
pm2 delete esggo-core
cd /var/www/esggo
pm2 start pnpm --name esggo-core -- run start
```
Caveat: this path can still trip `postinstall` when deps are missing/corrupted. Fall back to the direct `next start` path above.

For pm2-managed persistence, write `/var/www/esggo/start-esggo.sh` that `source .env` then `exec ./node_modules/.bin/next start -H 127.0.0.1 -p 3000`, and `pm2 start /var/www/esggo/start-esggo.sh --name esggo-core`. (See esggo-vps-deploy-rescue for the env-loading caveat.)

## Service matrix (port → pm2 name → dependency)

| Port | pm2 name | Notes |
|---|---|---|
| 3000 | esggo-core | Next.js main site at `/var/www/esggo`; **do NOT use `pnpm run start`** (postinstall EPERM loop) — use direct `next start` above; crashes if port 3000 held by zombie next-server → kill stale pid + restart |
| 8642 | omniagent-gateway | Needs `apps/gateway/.env` with `GATEWAY_API_KEY` (random 32-byte hex) or restarts forever with "GATEWAY_API_KEY or GATEWAY_KEY is required" |
| 8788 | universal-translator | Needs `types/generated/lang-matrix.mjs` (toCanonical/toEngineLang) or import fails and 8788 never listens |
| 8791 | stt-whisper | Local faster-whisper (zero-key, free-compute). **MUST** use interpreter `/opt/esggo/apps/stt/.venv/bin/python3` or `ModuleNotFoundError: No module named 'fastapi'` |
| 2026 | deerflow | Docker Compose at `/opt/deer-flow` (not pm2-native); pm2 entry runs `vps-deploy/deerflow-watchdog.sh` which does `docker compose up -d`. pm2 log paths MUST be absolute under `/opt/esggo/logs` (NOT `/opt/deer-flow/logs` — root-owned → EACCES) |

## Standard fix/redeploy sequence (VPS)

```bash
ssh -i ~/.ssh/esggo_original ubuntu@161.118.248.180 'cd /opt/esggo && git pull origin main'
# then reload affected services (see pitfalls below)
pm2 start ecosystem.config.cjs --only <svc> --update-env   # incremental, NOT full start
pm2 save                                          # persist dump for auto-start on reboot
```

### Push → VPS sync runbook (verified 2026-08-11)
For pure code-sync after a local `git push origin main`:
1. Test channel BEFORE pull: `ssh -i ~/.ssh/esggo_original ubuntu@161.118.248.180 'echo OK'` — must print `OK`, else fix key (see esggo-vps-sync-troubleshooting).
2. `cd /opt/esggo && git pull origin main` (fast-forwards; VPS HEAD may land on a later CI auto-repair commit than your local one — normal).
3. Build if the package has a build step: `cd packages/<pkg> && npm run build` (oab uses `tsc`; run best-effort, ignore if no build script).
4. Reload affected pm2 services — SEE PITFALLS 6–7 below. Always pass `--update-env` or pm2 silently skips the restart.

Use `--only <svc>` (not bare `pm2 start ecosystem.config.cjs`) to avoid restarting healthy services.

## Recurring gotchas (verified, not guessed)

0. **`pm2` invocation through SSH can fail with `command not found` even when `which pm2` returns `/usr/bin/pm2`**: the symlink resolves differently inside non-interactive SSH command strings; `/usr/bin/pm2` may report `No such file or directory` while the actual binary lives at `/usr/lib/node_modules/pm2/bin/pm2`. **Workaround**: use the absolute binary path `/usr/lib/node_modules/pm2/bin/pm2` for all pm2 commands over SSH. If that still fails, prepend `export PATH=/usr/lib/node_modules/pm2/bin:$PATH` and invoke `pm2` in the same command. **Verify**: `/usr/lib/node_modules/pm2/bin/pm2 --version` must print the version before any restart. **Verified stable pattern (2026-08-15)**: `ssh ... "env PATH=/usr/bin:/usr/local/bin:/usr/sbin:/bin pm2 <cmd>"` also works when the shell PATH is otherwise broken for non-interactive sessions.
0a. **`src/app/api/...` route files may not compile/build into `.next/server/app/api/...` when a same-named route exists under `app/api/...`**: this repo has both `/var/www/esggo/app/api/health/route.ts` and `/var/www/esggo/src/app/api/health/route.ts`. The root `app/api` version is the one that actually serves; edits under `src/app/api` silently do not appear in production. **Detection**: `find .next/server/app/api -maxdepth 2 -type f | grep '/health'` — if the expected route is missing, check whether the source lives under `src/app/api` instead of `app/api`. **Fix**: put new routes in `app/api`, or if you intentionally use `src/app/api`, verify they appear in the build manifest before testing.
0b. **JSON payloads sent through SSH single quotes get mangled**: passing `-d '{"key":"value"}'` over SSH frequently breaks JSON parsing on the server due to shell expansion/quoting differences inside the remote command string. **Workaround**: write the payload on the VPS filesystem first (`python3 -c "import json; ..."` or `printf` to `/tmp/...json`), then use `curl --data-binary @/tmp/...json`. This guarantees byte-exact delivery.
0b. **Webhook HMAC secret injection**: when adding `WEBHOOK_SECRET` to `.env`, always follow with `pm2 restart <svc> --update-env` so the running process picks it up. Do not rely on `.env` file presence alone; `next start` does not reread `.env` on SIGHUP. **Verify**: read `/proc/<pid>/environ` for `WEBHOOK_SECRET=` after restart. If you cannot read environ due to permissions, verify indirectly by invoking a test route that requires HMAC and confirming it no longer returns `Missing authorization token` or `Invalid or expired token`.
0c. **OCI private key file provisioning**: after adding `OCI_PRIVATE_KEY_PATH` to `.env`, create the referenced PEM file with strict permissions: `chmod 600 /var/www/esggo/oci_user.pem`. Use a real placeholder-free key content; a placeholder key will cause OCI SDK `NotAuthenticated` or key-load errors at runtime. **Verify**: `ls -la /var/www/esggo/oci_user.pem` shows `-rw-------` and the file size is non-trivial (>100 bytes for RSA).
0b. **JSON payloads sent through SSH single quotes get mangled**: passing `-d '{"key":"value"}'` over SSH frequently breaks JSON parsing on the server due to shell expansion/quoting differences inside the remote command string. **Workaround**: write the payload on the VPS filesystem first (`python3 -c "import json; ..."` or `printf` to `/tmp/...json`), then use `curl --data-binary @/tmp/...json`. This guarantees byte-exact delivery.

0. **Docker-backed service on port 3000 masquerades as free**: `ss -tlnp | grep :3000` can show no listener, yet `curl localhost:3000` returns 200 from a **docker container** (`docker-pr` in `lsof`). On this VPS, `docker ps` may reveal a container like `esggo-core` bound to `127.0.0.1:3000->3000/tcp` that was started outside pm2. This is distinct from a zombie `next-server` process. Detection: `sudo lsof -iTCP:3000 -sTCP:LISTEN` showing `docker-pr` as COMMAND, or `docker ps --filter 'publish=3000'`. Resolution: `sudo docker stop <id> && sudo docker rm <id>` before starting pm2. **Verify**: `ss -tlnp | grep ':3000'` must show the expected pm2-owned `next-server` after restart.
1. **`set -a; source .env` with Chinese comments can blank runtime env vars**: bash `source` on UTF-8 `.env` with Chinese BOM/no-BOM comments has been observed to result in empty exported vars (`AGENTIC_TWIN_OLLAMA_URL=` blank) even though `cat .env` looks correct. Routes then silently fall back to heuristic/mock (`llmEnhanced:false`). Detection after restart: `ssh ... 'bash -c "set -a; source .env; set +a; echo URL=$AGENTIC_TWIN_OLLAMA_URL"'` must print the value. If blank, rewrite `.env` without Chinese comments or export vars directly in the pm2/systemd ExecStart line.
2. **Dual systemd + pm2 on port 3000 causes EADDRINUSE even after `pm2 delete`**: systemd `Restart=always` respawns `esggo-app.service` after `pm2 delete`, holding the port before pm2 can bind. Clean shutdown: `sudo systemctl stop esggo-app.service && sudo systemctl disable esggo-app.service && sudo pkill -9 -f 'next start'`, verify `ss -ltnp | grep :3000` is empty, then start via pm2. Single-manager rule: use pm2 only for esggo-core.
3. **Middleware auth list blocks public upload routes**: `PROTECTED_API_PREFIXES` in `esggo-omni-center/src/middleware.ts` can include public routes like `/api/evidence-upload`, causing spurious `401 Missing authorization token`. Move public routes into `PUBLIC_ROUTES` instead. **Important**: in a `readonly string[]`, use string literals (`'/api/evidence-upload'`), not regex literals (`/api/evidence-upload`) — Turbopack rejects regex literals in array elements with `Unknown regular expression flags`.
4. **New route env vars not loaded after restart**: if you add runtime vars (e.g. `AGENTIC_TWIN_OLLAMA_URL`, `MINIO_*`) for new Next routes, they must reach the `next start` process. `next start` reads `.env*` only when launched with those vars exported; the launcher `bash -c 'source .env'` does NOT read `.env.local`. Create `/var/www/esggo/.env` (or source it explicitly in the start script). Confirm post-restart: `tr '\\0' '\\n' < /proc/$(pgrep -f 'next start'|head -1)/environ | grep -cE 'AGENTIC_TWIN_OLLAMA_URL|MINIO_ENDPOINT'` → ≥1. If 0, routes silently fall back to heuristic/mock (`llmEnhanced:false`).
5. **stt-whisper venv**: ecosystem `interpreter` must be the venv python path. If system `python3` is used, fastapi import fails.
2. **universal-translator 8788 not listening**: almost always missing `types/generated/lang-matrix.mjs`. Generate it (toCanonical/toEngineLang min-impl) or run `scripts/sync-lang-matrix.mjs` if present.
3. **omniagent-gateway restart loop**: `.env` missing → generate `apps/gateway/.env` with `GATEWAY_API_KEY=$(openssl rand -hex 32)`. `.env` is gitignored, so `git reset --hard` wipes it — regenerate after every reset.
4. **deerflow EACCES**: pm2 `error_file`/`out_file` under `/opt/deer-flow/logs` fail (root-owned). Use `/opt/esggo/logs/...`.
5. **esggo-core port clash**: old `next-server` zombie holds :3000 → new pm2 instance exits immediately. `pm2 delete esggo-core` + `fuser -k 3000/tcp` (or kill pid from `ss -tlnp`) then restart.
6. **`pm2 reload` silently skips services without `--update-env`**: Running `pm2 reload a b c` (multiple names) prints only the FIRST app's ✓ and reports success for the rest WITHOUT actually restarting them — their pid/uptime stay unchanged. Always pass `--update-env` per `pm2 reload <svc> --update-env`. Verify each with `pm2 status` (pid changed + uptime reset) before declaring done.
7. **`pm2 reload` of multiple comma/space-separated names is unreliable**: even with `--update-env`, a batch reload printed only one app's result in the 2026-08-11 run. Reload services ONE AT A TIME (`pm2 reload <svc1> --update-env`, then `<svc2>`, then `<svc3>`) and confirm each via `pm2 status` grep.
8. **`git log --oneline | grep <sha>` can FALSE-NEGATIVE after pull**: in the 2026-08-11 run a fresh `git pull` then `git log --oneline | grep 79a07168` reported MISSING, but `git log --oneline --all | grep -i <msg>` and on-disk file checks proved the commit WAS present. After pull, verify presence with a content/file check (`ls packages/.../src/patterns/ | wc -l`) rather than trusting a single grep on `--oneline` output.
9. **`/var/www/esggo/apps/esggo-core` may be missing while Next.js root is `/var/www/esggo/`**: After 2026-08-11 maintenance, `apps/` listed only `cf-tunnel-manager`, `cloudflare-deepseek-v4-pro`, `gateway`, `learning-center`, `omni-blueprint-hub`, `stt`, `tencentdb-memory`, `universal-translator`. `pm2 start --cwd /var/www/esggo/apps/esggo-core` can show “online” while never actually listening. Always `ls /var/www/esggo/apps` first; if `esggo-core` is absent, start from `/var/www/esggo` itself with `pm2 start npm --name esggo-core --cwd /var/www/esggo -- start` and verify via `ss -ltnp`.
10. **Stray non-pm2 `next-server` zombie on port 3000 causes EADDRINUSE even after `pm2 delete esggo-core`**: Detected 2026-08-11 when a standalone `next-server v16.2.11` held :3000 after previous manual startup. `pm2 status` showed no `esggo-core`, yet any restart failed with `EADDRINUSE`. Detect via `ss -tlnp | grep ':3000'` or `fuser 3000/tcp`; kill by pid (`kill <pid>`) before restarting pm2 service. **Verify**: after kill + restart, confirm fresh pid via `pm2 status` and listening via `ss -tlnp`.
11. **`pm2 start npm --name esggo-core` can report `online` before the server is actually bound**: After successful start, the initial `uptime 0s`/`N/A pid` snapshot is not enough. Always follow with `sleep 3` then `pm2 status esggo-core` (expect nonzero pid and uptime > 0s), `ss -ltnp | grep :3000`, and `curl -sS http://127.0.0.1:3000/`. Do not declare success on the first status line alone.
12. **`pnpm approve-builds` blocks non-interactive deploy**: `pnpm approve-builds --all` must run before any `pnpm install` on this workspace, else install prompts interactively and never completes in scripts/CI. Add `pnpm approve-builds --all >/dev/null 2>&1 || true` before deploy steps on the VPS.
13. **Verification network isolation (2026-08-11)**: GitHub Actions runner cannot reach `esggo.co` (`page.goto` 30s timeout) — E2E-against-live CI jobs must be `if: vars.E2E_ENABLED == 'true'` (opt-in) or run locally against `localhost:3000`. Local Windows MSYS `curl` cannot reach VPS `:19000`/`:19001` (OCI security list blocks inbound) — verify SonarQube/MinIO from **VPS localhost** (`ssh ... 'curl http://localhost:19000/...'`), not from your laptop. Local Playwright CAN reach `localhost:3000` (dev server).
14. **New route env vars not loaded after restart**: if you add runtime vars (e.g. `AGENTIC_TWIN_OLLAMA_URL`, `MINIO_*`) for new Next routes, they must reach the `next start` process. `next start` reads `.env*` only when launched with those vars exported; the launcher `bash -c 'source .env'` does NOT read `.env.local`. Create `/var/www/esggo/.env` (or source it explicitly in the start script). Confirm post-restart: `tr '\\\\0' '\\\\n' < /proc/$(pgrep -f 'next start'|head -1)/environ | grep -cE 'AGENTIC_TWIN_OLLAMA_URL|MINIO_ENDPOINT'` → ≥1. If 0, routes silently fall back to heuristic/mock (`llmEnhanced:false`).
15. **Stale `.next/server` chunks can mask source-code changes**: Even after `git checkout -- route.ts` and a rebuild, `/api/agentic-twin` may still return old behavior because Turbopack/Next.js reuses cached chunks (`.next/server/chunks/...`) that don't reflect the current source. Symptoms: source shows new code but runtime behavior is old; `grep` on compiled route artifact misses recent edits. **Fix**: full clean rebuild — `pm2 stop esggo-core && rm -rf .next && next build && pm2 start ... --update-env`. Partial deletes like `rm -rf .next/server/app/api/agentic-twin` are NOT enough; delete the entire `.next` directory.
16. **nginx `proxy_read_timeout` too short for LLM routes**: default `proxy_read_timeout 30s` kills `/api/agentic-twin` before Ollama responds. In `/etc/nginx/sites-available/ftg-esggo`, add a location block for `/api/agentic-twin` with `proxy_read_timeout 300s; proxy_send_timeout 300s;` **before** the generic `/api/` catch-all, then `sudo nginx -t && sudo systemctl reload nginx`. Without this, HTTPS clients see 500/502 even when localhost:3000 works.
17. **`/etc/systemd/system/esggo-app.service` may point to wrong WorkingDirectory**: After 2026-08-11 recoveries, the service still had `WorkingDirectory=/opt/esggo` while the real checkout is `/var/www/esggo`. That makes `systemd` start succeed while the app directory is empty/mismatched. Verify with `systemctl show esggo-app.service --property=WorkingDirectory`; patch with `sudo sed -i 's#WorkingDirectory=/opt/esggo#WorkingDirectory=/var/www/esggo#' /etc/systemd/system/esggo-app.service` then `sudo systemctl daemon-reload && sudo systemctl restart esggo-app.service`.
18. **Middleware auth list blocks public upload routes**: `PROTECTED_API_PREFIXES` in `esggo-omni-center/src/middleware.ts` can include public routes like `/api/evidence-upload`, causing spurious `401 Missing authorization token`. Move public routes into `PUBLIC_ROUTES` instead. **Important**: in a `readonly string[]`, use string literals (`'/api/evidence-upload'`), not regex literals (`/api/evidence-upload`) — Turbopack rejects regex literals in array elements with `Unknown regular expression flags`.
19. **`npm start` via pm2 on monorepo root may run stale `.next` from previous deploy**: When `/var/www/esggo/.next/server/app/api/...` exists from a prior build, `npm start` can reuse it even after middleware patches. If middleware changes don't take effect, rebuild the omni-center app: `cd /var/www/esggo/esggo-omni-center && pnpm run build`, then restart the systemd/pm2 service. Note: Turbopack builds may fail on unrelated routes (e.g. `document-processor.ts` → `esg-sonnar-client` missing upstream APIs); in that case keep the running `.next` and only patch middleware/routes that already have compiled artifacts, or stub the missing upstream route.
20. **Dual systemd + pm2 on port 3000 causes EADDRINUSE even after `pm2 delete`**: systemd `Restart=always` respawns `esggo-app.service` after `pm2 delete`, holding the port before pm2 can bind. Clean shutdown: `sudo systemctl stop esggo-app.service && sudo systemctl disable esggo-app.service && sudo pkill -9 -f 'next start'`, verify `ss -ltnp | grep :3000` is empty, then start via pm2. Single-manager rule: use pm2 only for esggo-core.
19. **New route env vars not loaded after restart**: if you add runtime vars (e.g. `AGENTIC_TWIN_OLLAMA_URL`, `MINIO_*`) for new Next routes, they must reach the `next start` process. `next start` reads `.env*` only when launched with those vars exported; the launcher `bash -c 'source .env'` does NOT read `.env.local`. Create `/var/www/esggo/.env` (or source it explicitly in the start script). Confirm post-restart: `tr '\\0' '\n' < /proc/$(pgrep -f 'next start'|head -1)/environ | grep -cE 'AGENTIC_TWIN_OLLAMA_URL|MINIO_ENDPOINT'` → ≥1. If 0, routes silently fall back to heuristic/mock (`llmEnhanced:false`).

20. **Editing a service's source on the VPS host does NOT reach a docker-backed container** (silent loss, 2026-08-13): `omniagent-gateway` (port 8642) is a **docker container** (image `vps-omniagent-gateway`, `127.0.0.1:8642->8642/tcp`), NOT pm2 — even though a stray pm2 `omniagent-gateway` instance may also exist (orphaned; nothing connects to it). Editing the host file `/opt/esggo/esggo-omni-center/apps/gateway/omni-server.mjs`, then `docker cp` it into the container + `docker restart`, **silently reverts**: the container is built from the image layer with no volume mount on `/app`, so on restart the edit is gone. Symptoms: `docker exec grep` shows your route before restart, `node --check` passes, but after `docker restart` → `Cannot GET /your-route` and `docker exec grep` shows 0 matches.
   - **Detection before editing**: confirm where the service actually runs — `docker ps --format '{{.Names}}: {{.Ports}}' | grep <port>` shows a container → host file is decoupled; `sudo lsof -i :<port>` shows `docker-pr` (docker port proxy) confirms container-backed. A pm2 `omniagent-gateway` showing `online` with a real pid is a DIFFERENT process, not what serves 8642 — don't restart pm2 for it.
   - **Real fix**: edit in the **repo** (single source of truth) and let CI/CD rebuild the image, OR add a volume mount for the source dir, OR `docker build` a new image from the Dockerfile (`docker inspect <container> --format '{{.Config.Image}}'` to find it). Until then treat container source as immutable.
   - **Generic rule**: any VPS service that shows `docker-pr` as the port listener is docker-backed; host-file edits + `docker cp` + `docker restart` will not persist. Rebuild the image instead.

## OCI instance control (resize / restart)

```bash
export SUPPRESS_LABEL_WARNING=True
IID=ocid1.instance.oc1.ap-singapore-1.anzwsljrkl3rykyc4fggmvq6kezm65dkzzj5nboi3ihax2qxtxyjnxvrpxza
oci compute instance get   --region ap-singapore-1 --instance-id $IID | grep lifecycle-state
oci compute instance action --region ap-singapore-1 --instance-id $IID --action STOP      # graceful
oci compute instance action --region ap-singapore-1 --instance-id $IID --action START
# resize (needs STOPPED):
oci compute instance update --region ap-singapore-1 --instance-id $IID \
  --shape-config '{"ocpus":4,"memoryInGBs":24}' --force
```

- **Power actions (SOFTRESET/STOP/START) NEVER change shape (OCPU/RAM).** Shape only changes via `compute instance update --shape-config`, and only while STOPPED.
- `STOP`/`SOFTRESET` can hang in `STOPPING` for 20+ min if a CPU-bound process (e.g. `next build`) is blocking graceful shutdown. OCI force-powers-off after ~30 min. Wait it out; don't parallel-launch conflicting START scripts.
- `oci compute instance update` prompts `[y/N]` — pass `--force` or it aborts silently.
- List instances: `oci compute instance list --region ap-singapore-1 --compartment-id <tenancy_ocid>`.

## VPS OCI CLI installation (headless Ubuntu)

The VPS has **no OCI CLI by default**; install non-interactively:

```bash
bash -c "$(curl -L https://raw.githubusercontent.com/oracle/oci-cli/master/scripts/install/install.sh)" \
  -- --accept-all-defaults --install-dir $HOME/lib/oracle-cli --exec-dir $HOME/bin
```

- Installs to `$HOME/lib/oracle-cli` and symlinks `oci` to `$HOME/bin/oci`.
- **PATH pitfall**: `$HOME/bin` is added to PATH in `~/.profile` via profile.d, but **only for login shells**. Non-interactive SSH commands don't source `~/.profile`, so `oci` is `command not found` even after install. **Fix**: either call `/home/ubuntu/bin/oci` with absolute path, or prepend `source ~/.profile &&` to SSH commands.
- After install: `exec -l $SHELL` to reload shell config for interactive use.
- Verified on VPS: `oci --version` returns `3.90.2` (as of 2026-08-15).

## OCI wrapper script (`oci-wrapper`)

Deployed to `/home/ubuntu/bin/oci-wrapper` on VPS. Wraps common OCI instance operations with preset compartment/region so callers don't repeat OCIDs.

```bash
# Commands: list, status <name>, start <name>, stop <name>
/home/ubuntu/bin/oci-wrapper list
/home/ubuntu/bin/oci-wrapper status esggo-vps
/home/ubuntu/bin/oci-wrapper start oa-worker-01
```

- Uses absolute OCI binary path (`/home/ubuntu/bin/oci`) to avoid PATH issues.
- JMESPath `--query` uses **underscores** (`display_name`, `lifecycle_state`, `shape_config`), NOT dashes. Dash-form (`display-name`) causes `LexerError: Bad jmespath expression`.
- **5T**: all commands append to `/tmp/oci_ops.log` with timestamp/action/instance/result.

## OCI from subprocess / systemd service (AI Station integration)

When calling OCI CLI from a Python subprocess inside a systemd service, the call can fail with `oci error: Abort:` even though the same command works interactively. Root cause: missing HOME / config dir context for the subprocess.

**Fix**: in the subprocess env, explicitly set:
```python
env = {
    **os.environ,
    "HOME": "/home/ubuntu",
    "OCI_CONFIG_HOME": "/home/ubuntu/.oci",
    "SUPPRESS_LABEL_WARNING": "true",
}
```

- Verified 2026-08-15: without these, `subprocess.run(["oci", ...])` returns `Abort:`; with them, returns valid JSON.
- Affects `src/oci_controller.py` `_oci()` helper in AI Station.

## AI Station OCI Controller API

`src/oci_controller.py` exposes OCI instance control as REST endpoints mounted at `/oci/*`:

| Endpoint | Method | Purpose |
|---|---|---|
| `/oci/instances` | GET | List all instances (5T Traceable) |
| `/oci/instances/{name}` | GET | Single instance details (Trackable) |
| `/oci/instances/{name}/start` | POST | Start instance |
| `/oci/instances/{name}/stop` | POST | Stop instance (preserve boot volume) |
| `/oci/ops-log` | GET | Read recent OCI operations (Transparent) |

- Mounted in `src/app.py` via `app.include_router(oci_router)`.
- Tests: `tests/test_oci_controller.py` (unit) + `tests/test_oci_api.py` (integration).
- 5T: ops-log append-only; responses frozen via Pydantic models; instance list cached to `/tmp/oci_instances_cache.json`.
- Deployed to VPS `/opt/esggo/apps/aistation/`; restart `aistation.service` after deploy.

## Known instances (2026-08-15)

| Name | State | Shape | Region |
|---|---|---|---|
| esggo-vps | RUNNING | VM.Standard.A1.Flex | ap-singapore-1 |
| oa-worker-01 | RUNNING | VM.Standard.A1.Flex | ap-singapore-1 |

## n8n service on VPS (owner setup + API auth)

n8n runs as a **direct node process** on VPS (`n8n start --port 5678`), NOT via pm2 or docker. PID from `pgrep -af n8n`; listens on `*:5678`.

### Owner initialization via browser (when owner is uninitialized)

When `database.sqlite` has an owner row but `setupDoneAt` is missing, n8n shows the setup page at `/setup` instead of the dashboard.

**Workaround**: open `https://n8n.esggo.co/setup`, fill Email/First Name/Last Name/Password, click Next. After setup, `/workflows` shows the login page — sign in with the same credentials to reach the dashboard.

**Pitfall**: browser session state can be sticky. If navigating to `/workflows` still shows login after setup, reload `/setup` first or use an incognito window.

### API key auth pitfall

After creating an API key via Settings → n8n API, the key is stored in `user_api_keys` table with label. Verified schema on 2.34.4:

```sql
SELECT id, userId, label, apiKey, scopes, audience FROM user_api_keys;
```

**Critical**: `X-N8N-API-KEY` header with the raw `apiKey` value can return `{"status":"error","message":"Unauthorized"}` even when the key is correct. n8n logs show `browserId check failed on /rest/workflows/`. This is a known n8n browserId/cookie-based auth requirement on some endpoints.

**Workarounds** (in order):
1. Use the n8n web UI to import workflows manually (Settings → n8n API → Create API key, then UI import).
2. If REST import is required, use `Authorization: Bearer <apiKey>` header instead of `X-N8N-API-KEY`.
3. As fallback, use the browser to navigate to `/workflows` → import via UI.

**Verified import path via browser**:
1. Navigate to `https://n8n.esggo.co/workflows`
2. Sign in with owner credentials
3. Click `Add new item` → `New workflow`
4. Use the workflow editor to build or import

## Autonomous DB & Object Storage (tenancy assets)

- Autonomous DB `OmniUserRAG` (20 GB OLTP, Always-Free, APEX 24.2) may be STOPPED → start: `oci db autonomous-database start --autonomous-database-id <ocid>` (~1-2 min to AVAILABLE).
- Object Storage namespace: `ax6sc1wpkz6y`, bucket: `esggo-secret-backup` (Archive tier).
- Write-test: `oci os object put --namespace ax6sc1wpkz6y --bucket-name esggo-secret-backup --name healthcheck/<ts>.txt --file <f>`.
- **Anti-reclamation**: long-STOPPED Always-Free ADB can be reclaimed. Deploy `scripts/omni-adb-keepalive.py` with monthly cron to START if STOPPED.

## PM2 duplicate instance cleanup (2026-08-15)
After multiple `pm2 start` attempts, duplicate entries for the same app name appear in `pm2 list` with different IDs. Only the newest instance binds the port; older ones stay in `waiting …` or `online` with stale pids.
Fix before any restart:
```bash
pm2 delete esggo-core
cd /var/www/esggo
pm2 start npm --name esggo-core -- start
pm2 save
```
Verification: `pm2 list` must show exactly ONE `esggo-core` entry with nonzero pid and uptime > 0s; `ss -tlnp | grep :3000` must show the expected listener.

## Stale build artifacts (2026-08-15)
Symptoms: source file shows new code, but runtime still returns old behavior; `grep` on compiled route artifact misses recent edits.
Root cause: Turbopack/Next.js reuses cached chunks (`.next/server/chunks/...`) that don't reflect current source.
Fix: full clean rebuild — `rm -rf .next && next build`. Partial deletes like `rm -rf .next/server/app/api/<route>` are NOT enough.
Verification: after rebuild, `grep` the new code path in `.next/server/app/api/<route>/route.js` before testing.

## Health/metrics route consolidation (2026-08-15)
Do NOT create `/api/health/metrics` as a separate route directory; Turbopack may silently drop it from `.next/server`.
Use a single `/api/health` route with `?format=metrics` query param for Prometheus output.
After editing `app/api/health/route.ts`, delete the entire `.next` directory before rebuild.

## Verification (real, not claimed)

- `ssh ... 'curl -s -o /dev/null -w "%{http_code}" http://localhost:<port>/health'` per service.
- `pm2 ls` for status; `pm2 describe <svc>` for interpreter/status.
- `ss -tlnp | grep :<port>` to confirm actually listening (pm2 "online" can lie if the node process crashed after bind).
- Health endpoints: `curl -sS https://esggo.co/api/healthz` and `https://omniagent.esggo.co/health`. NOTE: esggo-core `/api/healthz` returns `{"status":"error",...}` with `checks` all `warn` ("Missing: ...apiKey...") when production env vars (DB/Redis/Firebase/AI keys) are unset — this is an ENVIRONMENT CONFIG warning, NOT a deploy/sync failure. The sync is good as long as HTTP 200 + JSON is returned and pm2 pid/uptime reflect a fresh reload. `omniagent-gateway /health` returning `{"ok":true}` is the clean signal.
- Local syntax: `node --check ecosystem.config.cjs`; bash: `bash -n script.sh`.
- **TencentDB Agent Memory 整合現狀**：見 `references/tencentdb-memory-integration-2026-08-13.md`。Verified 2026-08-14 recall/write paths: `POST /v3/conversation/add` (messages array) + header `x-tdai-service-id: default` + `Authorization: Bearer <key from /opt/esggo/apps/tencentdb-memory/.admin-key>`; recall `POST /v3/conversation/query`. (The §9a `/v3/default/memory/recall` serviceId-in-path form may be a stale probe — prefer `/v3/conversation/*`, empirically successful.)

## Oracle Always Free idle-reclamation defense (keepalive)

Oracle Always Free A1 instances are reclaimed if a 7-day sliding window shows CPU <20% AND network <20% AND memory <20% (memory check A1-only). OA_VPS runs omni/relay/next which keeps load ~0.5 (safe), but a silent service death could drift under 20% and get reclaimed — losing the box.

**Defense**: `scripts/oa-vps-keepalive.mjs` (repo `scripts/`, deployed to `/opt/esggo/scripts/`). Every 5 min (cron `*/5 * * * *`) reads `/proc/loadavg` load1, divides by `os.cpus().length` (4 on A1), and if `rate < 0.4` (~10%, below the 20% kill line with margin) runs a 60s Pi-computation loop (Leibniz, ~20% CPU, never 100% monopolizing) to keep the window warm. Writes `$HOME/logs/oa-keepalive.log` + `$HOME/logs/oa-keepalive-metrics.json`.

**Deploy + verify (verified 2026-08-14)**:
```bash
ssh -i ~/.ssh/ci_deploy_key ubuntu@161.118.248.180 "cat > /opt/esggo/scripts/oa-vps-keepalive.mjs" < scripts/oa-vps-keepalive.mjs
# cron line (use $HOME, not /var/log — see pitfall 21):
*/5 * * * * OA_KEEPALIVE_BOOST=60 /usr/bin/node /opt/esggo/scripts/oa-vps-keepalive.mjs --once >> \$HOME/logs/oa-keepalive.log 2>&1
# verify a single run:
ssh ... 'OA_KEEPALIVE_BOOST=3 node /opt/esggo/scripts/oa-vps-keepalive.mjs --once; tail -2 \$HOME/logs/oa-keepalive.log'
# expect: [keepalive] boosted: load X.XX → spent 3s  AND metrics JSON with boosted:true
```
- Threshold `0.4` = boost when under 40% of one core; on 4-core that's load1 < 1.6. OA_VPS normal load ~0.5–2.0 → skips when healthy, boosts only when quiet. Tune via `OA_KEEPALIVE_THRESHOLD`.
- BOOST=60s/5min = 20% duty = exactly the safe floor. Don't lower it or the window could still drift under 20%.
- Pi loop uses `Math` only (no I/O, no spin-lock) so it never starves real services.

### 21. VPS cron scripts must write to $HOME/logs, NOT /var/log
ubuntu user has **no write permission** to `/var/log/` (root-owned). A script doing `appendFileSync('/var/log/x.log')` fails silently (EACCES, caught) → NO log, cron looks broken. Fixes in `oa-vps-keepalive.mjs`:
- Default log/metrics paths resolve to `$HOME/logs/...` (e.g. `/home/ubuntu/logs/`), not `/var/log`.
- `log()` must `mkdirSync(dirname(LOG), {recursive:true})` for the **actual LOG path's parent** — NOT a hardcoded `if (!existsSync('/var/log'))`. The latter never creates `$HOME/logs` and the write still EACCESes.
- **Verify on VPS**: after a cron run, `ls -la $HOME/logs/oa-keepalive.log` must exist. If missing → script writes to a permission-denied path.

### 22. Other agents' unstaged changes block `git pull --rebase` before push (multi-agent repo)
When you have a local commit on `main` and `git push origin main` is rejected (non-fast-forward), `git pull --rebase origin main` is **blocked by unstaged changes** left in the working tree by other swarm agents — often just CRLF-noise (Git warns `CRLF will be replaced by LF`) plus a stray edit in an unrelated file (e.g. a skill `SKILL.md` description). The error is `cannot pull with rebase: You have unstaged changes` even after you `git stash push <specific-file>` (because MORE files are dirty).
- **Fix**: `git stash` (ALL, no path arg) → `git pull --rebase origin main` → `git push origin main` → `git stash pop`. The stash pop restores the other agents' changes (leave them for their own owner); your commit is rebased onto `origin/main` and pushed. Never `git checkout`/`git reset` to discard the stashed foreign changes.
- **Verify**: `git log --oneline -1` and `git log --oneline origin/main -1` must show the SAME sha after push.

### 23. Local/Hermes-side keepalive does NOT protect the VPS (honesty caveat, 2026-08-16)
A Hermes cronjob (`oa-vps-keepalive.py` in `~/.hermes/scripts/`, run `every 5m`) that probes `161.118.248.180` ports + runs a 60s Pi loop on the **laptop** does NOT defend against Oracle idle-reclamation — Oracle measures the **VPS's own** CPU/network/memory, not the laptop's. The laptop CPU loop only warms the local machine.
- **Real defense is VPS-side**: `scripts/oa-vps-keepalive.mjs` (above, §keepalive) running as a VPS cron is what actually keeps the 7-day window warm.
- The Hermes-side probe is still useful as a **reachability/alive monitor** (alerts if all VPS ports go `000`), but label it as monitoring, not reclamation-defense.
- Don't claim "keepalive deployed" if only the laptop script exists — that's a false sense of safety.

### 24. User-reported quota may override skill's cached values (2026-08-16)
The user supplied an authoritative Oracle Always Free report (dated 2026-08-15) that **contradicts this skill's cached assumptions**:
- Skill says OA_VPS is "4 OCPU / 24 GB (actually allocated)". User report: OA_VPS = **1 OCPU A1** (aarch64, Ubuntu 24.04), within the 2 OCPU/12 GB pool; a 2nd A1 for rescue would eat the cap.
- Skill assumes a single Autonomous DB `OmniUserRAG`. User report: **Autonomous AI DB = 2 instances** (each 1 OCPU/20 GB/20 sessions) — matches the `omni-adb-sync.py` 3-schema deployment target better.
- **Treat the skill's "4/24 actual" and "single ADB" statements as possibly STALE.** When the user gives a current quota report, prefer it; re-verify via `ssh ... 'nproc; free -h; uname -m'` and `oci db autonomous-database list` before acting on shape/quota assumptions. The 2026-06 doc downgrade (4→2 OCPU) may or may not be enforced — the user's live instance is the source of truth.

## Oracle Always Free capacity/quota reality (2026-08-14)
- OA_VPS **actually allocated 4 OCPU / 23 GB / aarch64** (verified `nproc` + `free -h` + `uname -m`), NOT the 2 OCPU/12 GB the 2026-06 docs claim. Oracle's doc downgrade is "execution-uncertain" — console still grants 4/24. Treat 4/24 as a **fuzzy always-free state**: if Oracle later enforces 2/12, OA_VPS still fits the reduced cap.
- **Rescue warning**: a 2nd A1 instance for recovery eats the 2-OCPU (old) / full (new) cap → deleted on Trial expiry. Prefer single-host `docker restart` / file-edit recovery over a 2nd box.
- **8420 is SonarQube, not tdai-gateway**: `ss` + `ps` show `0.0.0.0:8420` owned by `/opt/sonarqube/elasticsearch` (opc user). ufw labels it `tdai-gateway` but it's ES. Don't assume 8420 = memory core.
- **Autonomous AI DB — tenancy OCID IS available (2026-08-14 CORRECTION)**: the earlier "oci_*.sh has no tenancy OCID → blocker" was a FALSE diagnosis. OCI credentials live in `~/.oci/config` (NOT in the `oci_*.sh` shell scripts). Verified tenancy OCID: `ocid1.tenancy.oc1..aaaaaaaadof5rgb76zexk24q6fnhopqjnrqaxwmeuxunoynw46g3lj3lfnlq` (region `ap-singapore-1`). Confirm with `oci iam region-subscription list` → returns your region = credentials valid.
  - **OmniUserRAG** Autonomous DB already EXISTS (20 GB OLTP, Always-Free, built-in APEX 24.2 / Graph Studio / OML Notebook). May be STOPPED → start: `oci db autonomous-database start --autonomous-database-id <ocid>` (→ AVAILABLE ~1-2 min).
  - Object Storage namespace `ax6sc1wpkz6y` + bucket `esggo-secret-backup` (Archive tier) already exist; write-test: `oci os object put --namespace ax6sc1wpkz6y --bucket-name esggo-secret-backup --name healthcheck/<ts>.txt --file <f>`.
  - **Anti-reclamation**: Oracle may reclaim a long-STOPPED Always-Free ADB. Deploy `scripts/omni-adb-keepalive.py` to VPS `/opt/esggo/scripts/` with monthly cron `0 3 1 * * /opt/esggo/.venv-oci/bin/python /opt/esggo/scripts/omni-adb-keepalive.py` — reads state, skips if AVAILABLE, STARTs if STOPPED.
  - **OmniUserRAG ADB thin-mode sync (verified 2026-08-14)**: connect WITHOUT the Oracle Client lib, using `oracledb` 4.x pure-thin mode. Full recipe in `references/oracle-adb-thin-sync.md`. Key points: (1) `pip install oracledb` into `/opt/esggo/.venv-oci`; (2) ADB admin password may be unset — reset via OCI SDK `update_autonomous_database(adb_id, UpdateAutonomousDatabaseDetails(admin_password=pw))`; (3) download wallet via `generate_autonomous_database_wallet(adb_id, GenerateAutonomousDatabaseWalletDetails(password=pw, generate_type='ALL'))` → `resp.data.content` is zip bytes; unzip to `~/wallet`; (4) connect thin via `oracledb.ConnectParams(config_dir=WALLET, wallet_location=WALLET, wallet_password=pw)`, `.parse_connect_string('omniurag_high')`, `oracledb.connect(user='ADMIN', password=pw, params=params)`. **PITFALL**: never call `oracledb.init_oracle_client` — forces THICK mode → `DPI-1047`. Deployed `/opt/esggo/scripts/omni-adb-sync.py` (repo `scripts/omni-adb-sync.py`) creates `OMNI_KNOWLEDGE_INHERITANCE` + writes a row; verified `SYNC_VERIFIED`. ADB OCID `ocid1.autonomousdatabase.oc1.ap-singapore-1.anzwsljrkl3rykyabhb7gbnyoywlteaxfsnnjh43h6smzoz6maja5nvvzioa`; tns `omniurag_high`.
  - **3-schema sync extension (verified 2026-08-14)**: `omni-adb-sync.py` syncs THREE tables from the vault — `OMNI_KNOWLEDGE_INHERITANCE` (seed), `OMNI_AVATAR_REGISTRY` (from `.avatar-registry.json`, 101 avatars), `OMNI_MOC_INDEX` (from `00-Index.md` `[[wikilinks]]`, 10 nodes). **PITFALL — Oracle reserved word `FILE`**: `CREATE TABLE ... (file VARCHAR2(200))` fails `ORA-03050`; rename column to `source_file`. Daily sync cron `10 3 * * *` + monthly keepalive `0 3 1 * *` both in `/opt/esggo/.venv-oci/bin/python`. Readback verify: `SELECT COUNT(*) FROM OMNI_AVATAR_REGISTRY` → 101, `OMNI_MOC_INDEX` → 10, `OMNI_KNOWLEDGE_INHERITANCE` → 2.
- **OCI SDK on VPS (for keepalive / admin scripts)**: VPS ships NO oci CLI/SDK and PEP 668 blocks system `pip install oci`. Correct recipe (verified 2026-08-14):
  ```bash
  python3 -m venv /opt/esggo/.venv-oci
  /opt/esggo/.venv-oci/bin/pip install oci        # oci 2.184.x
  /opt/esggo/.venv-oci/bin/python -c 'import oci; print(oci.__version__)'
  ```
  - **VPS `~/.oci/config` fingerprint MUST match the working local one** (`3d:e1:62:cb:be:ef:81:35:20:de:ea:4d:d6:31:fc:e8`). A mismatched/truncated fingerprint on VPS → `NotAuthenticated` on every call. If VPS key differs, `scp` the local `~/.oci/oci_api_key` to VPS and rewrite `~/.oci/config` with the correct fingerprint. (A dropped hex char in the fingerprint is the silent killer — `sed -i` the full correct value.)
  - Prefer the official SDK in the venv over a hand-rolled pure-python OCI request signer (GET vs POST header sets differ → fragile → NotAuthenticated).
- **Exposure-surface caution (2026-08-14)**: ufw allows 8096/8125/8420/8421/8424 to Anywhere. 8420 = SonarQube ES (may not need external access → lock 127.0.0.1). 8042 is NOT listening (no action). 8788 (universal-translator) is behind nginx reverse-proxy, not a raw ufw rule. Before locking any tdai port, confirm no service depends on the public path — don't blind-remove ufw rules (risk killing a live integration). 22 is already pubkey-only (`PasswordAuthentication no`) so relatively safe.
