---
name: vps-bootstrap-and-deploy
description: "Bootstrap, configure, and deploy to a cloud VPS with reproducible artifacts. Covers cloning existing configs from a monorepo into a standalone VPS repo, SSH keypair rotation for OCI/AWS/GCP, lightweight deploy scripts, GitHub Actions SSH deploy, and verification. Use when the user asks to set up, rebuild, restart, deploy to, or stand up a VPS as their primary remote."
version: 1.1.0
author: DingJun1028 / Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [cloud, vps, ssh, ci-cd, github-actions, deployment, bootstrap, oci]
    related_skills: [github-repo-management, github-pr-workflow, cloud-instance-immutable-metadata, hermes-usage-best-practices]
---

# VPS Bootstrap and Deploy

## overview

Stand up a new VPS and make deployment reproducible through git, not one-off manual steps.

## Trigger

Use for any VPS work that needs:
- a dedicated remote repo for VPS config/scripts
- SSH keypair rebuild and re-upload
- CI-driven deploy (GitHub Actions -> SSH -> docker compose / pm2)
- post-bootstrap verification checklist

## Canonical flow

1. **Create remote repo** named after the project's VPS role, e.g. `esggo_vps`.
   - If secrets or live keys were accidentally committed, remove them in a follow-up commit and rotate at the provider before reuse.
2. **Migrate config layer only** from the main repo:
   - copy `vps/`, deploy scripts, env examples
   - explicitly exclude `.env.production` / actual private keys
   - keep path references stable because deploy scripts expect them
3. **Establish SSH access** with a dedicated keypair:
   - local: `ssh-keygen -t ed25519 -C "role@host" -f ~/.ssh/<name>`
   - provider: inject only the new public key
   - if provider metadata is immutable, recreate or pivot to console-agent injection
4. **Add deploy script** at repo root or under `scripts/`:
   - idempotent: git pull -> build -> up
   - safe paths and graceful failures where removable
5. **Add GitHub Actions cd workflow**:
   - checkout
   - ssh-agent for private key secret
   - scp deploy script
   - ssh execute + remove script
   - optional health check with `continue-on-error: true`
6. **Add CHECKLIST.md** covering firewall, container health, SSH auth, Firestore/external service status.

## Skill-specific pitfalls

- **GitHub repo init**: an empty repo clone is fine; do not use `GH_TOKEN`/gh secret values as filenames. If `.env.production` exists upstream, do not copy it.
- **GitHub Actions heredocs**: avoid inline `ssh <<'REMOTE' ... REMOTE`; GitHub shell environments sometimes choke on heredoc indentation. Upload a script via scp and execute it instead.
- **OCI/AWS metadata**: if the provider returns that `ssh_authorized_keys` cannot be updated/removed, do not retry. Either recreate the instance from the retained boot volume with a fresh keypair, or pivot to serial console / Cloud Shell / Inventory-based injection when available.
- **Windows path handling in deploy scripts**: always quote paths, prefer `'C:/path'` over backslashes, and keep `cd /opt/esggo` logic inside the remote script, not the workflow trigger.
- **Read private key content reliably on Windows PowerShell**: if `Get-Content $env:USERPROFILE\.ssh\id_rsa -Raw` errors out, the file path/name is wrong; list `$env:USERPROFILE\.ssh` first and use the existing filename. Do not paste the literal `Get-Content ...` command back as output.
- **Detect truncated SSH private key before use**: a corrupted key will raise `Load key "....pem": error in libcrypto` from ssh. Run `ssh-keygen -l -f <keyfile>` first; if it fails, regenerate and re-upload the new public key to the provider before setting GitHub secrets.
- **Rotate first if a private key may have been committed**: if any prior commit in the new VPS repo contained live private keys, remove that commit path, rotate at the provider, and only then reuse the keypair for `ORACLE_VPS_SSH_KEY`.
- **Workflow failure signal**: if `esggo_vps_cd` fails at `webfactory/ssh-agent` with `The ssh-private-key argument is empty`, the secret was not configured or was wiped; set `ORACLE_VPS_SSH_KEY`, `ORACLE_VPS_HOST`, and `ORACLE_VPS_USER`, then re-run.
- **Verification**: deploy scripts should have a no-op dry-run mode or a separate `bash -n` syntax check. Do not run the real deploy as your only verification.
- **Stop retrying the same SSH key against an unreachable VPS**: if SSH fails with `Permission denied (publickey)` after confirming the local key is intact and its fingerprint matches the provider-side public key, the instance's `authorized_keys` is the likely blocker. Switch to provider-side key injection via Console Connection / serial console, or recreate from boot volume. Do not loop on SSH retries.
- **Public health check timeout after local success**: after `next start` / `pnpm start` returns `Ready` on `127.0.0.1`, do not assume public IP access works. If `curl http://<public-ip>/` times out but `curl http://127.0.0.1:<port>/` works, the blocker is usually the provider-side Security List / firewall not allowing port `80`/`443`. Verify with `sudo ss -tlnp` first; if `0.0.0.0:80` is listening, the blockage is upstream of the VPS.
- **Never paste live private keys into chat**: if the user needs to verify a key, ask them to run diagnostic commands locally (`ssh-keygen -l -f`, `ssh-add -l`) and report fingerprints/status, not the key material itself.
- **Before first push, credential-scan staged content**: even a "script-only" deploy repo can contain private keys if you wrote them there for convenience. Run a scan such as `git diff --cached --name-only --diff-filter=A | xargs grep -HIn --binary-files=without-match -E '(^|\s)(SECRET|PRIVATE KEY|BEGIN RSA|BEGIN OPENSSH|BEGIN EC|BEGIN DSA|BEGIN PGP|api_key|token_secret|password|id_rsa_)('` before `git push`. Blocked matches mean don't commit; store those values in GitHub Secrets.
- **Force-cleaning history after an accidental key commit**: first remove the tracked file from HEAD and add `.gitignore`, then run a forced rewrite against the local repo: `git filter-repo --path <path> --invert-paths --force` and push with `git push --force-with-lease`. The force is unavoidable; skipping it leaves the secret in every clone/mirror.
- **ARM VPS resource guard**: `VM.Standard.A1.Flex` with `1 OCPU / 6GB` is easily OOM-killed when the full `docker-compose.prod.yml` starts at once. Prefer a single-service proof-of-life (Next.js or Gateway) before adding Redis/Omni/certbot. Keep swap on.
- **Node 22 required even when repo says `>=20`**: if `pnpm install` fails with `Unknown builtin module: node:sqlite`, the install is using pnpm 11+ which requires Node 22. Upgrade Node from the vendor repo (`nodesource setup_22.x`) instead of downgrading pnpm.
- **iptables persistence on Ubuntu 24.04**: `ufw` may be uninstalled. After inserting rules with `iptables`, persist them via `apt-get install -y iptables-persistent && netfilter-persistent save` or `iptables-save > /etc/iptables/rules.v4`. This survives reboot even if ufw is absent.
- **Nginx site swap on Ubuntu**: prefer replacing `/etc/nginx/sites-available/default` contents over deleting the `/etc/nginx/sites-enabled/default` symlink inside remote heredocs; the latter often triggers approvals/kills depending on shell policy.
- **Deploy script scp fallback**: if `rsync` is not installed on the local shell, the deploy script fails with `command not found`. Use `scp -r` as the fallback transfer method; it is available by default on Windows Git Bash and Linux/macOS.
- **SCP flattens nested paths — breaks ESM imports**: `scp $FILES host:/path/` where FILES contains `types/generated/lang-matrix.mjs` drops the file to `/path/lang-matrix.mjs` (loses the `types/generated/` subtree). A remote `import './types/generated/lang-matrix.mjs'` then fails with `ERR_MODULE_NOT_FOUND` and the service never binds (health check returns HTTP 000). Fix: scp the nested file to its explicit subdir (`scp types/generated/lang-matrix.mjs "$HOST:$RPATH/types/generated/"` after `mkdir -p`), or use `rsync -a`.
- **`npm install` inside a workspace subdir triggers unrelated ERESOLVE**: if the VPS `/opt/esggo/package.json` is a workspace root, running `npm install --omit=dev` inside `apps/<x>` resolves the WHOLE workspace graph and can fail on a peer conflict from an unrelated app (e.g. react19 vs lucide-react). The app's own dep (e.g. `ws`) may already be present — check `ls node_modules/ws` first and skip install. If install is required, use `npm install --omit=dev --legacy-peer-deps`. Never bare `npm install` in a workspace subdir (hits `workspace:` protocol / EUNSUPPORTEDPROTOCOL).
- **OCI Security List + public check pattern**: after local `curl 127.0.0.1:<port>` succeeds, if public IP timeout occurs, run `sudo ss -tlnp` to confirm listening, then ping the port from multiple vantage points before assuming external block. If OCI Security List blocks 80/443, GitHub Actions health checks will always fail.
- **GitHub Actions stage deploy scripts instead of inline heredocs**: inline heredocs over SSH are brittle across runner shells; stage a script, `chmod +x`, execute it, then remove it. Limit `pkill` to specific commands, never blanket `pkill node` from a session that may own the SSH transport.
- **Run app as systemd service with explicit user**: create `/etc/systemd/system/esggo-app.service` with `User=ubuntu`, `WorkingDirectory=/opt/esggo`, and `Restart=always`. Do not rely on ad-hoc `nohup pnpm start`; migrate manual listeners into the unit to avoid `EADDRINUSE` and zombie processes.
- **Migrate manual listener to systemd cleanly**: before starting the new unit, kill the old ad-hoc process by PID (`sudo kill <pid>` from `ss -tlnp`). If you restart the unit first and the old listener binds `127.0.0.1:<port>` while the unit binds `0.0.0.0:<port>`, the result is `EADDRINUSE` and a restart storm. Also remove any leftover systemd unit that points to the wrong compose service name.
- **Docker Compose v1 vs v2 on VPS**: Ubuntu 24.04 may ship only `docker-compose` v1.29.2 without the v2 plugin. If `docker compose -f ...` fails with `unknown shorthand flag: 'f'`, the command is being routed to `docker`, not compose. Use `/usr/bin/docker-compose -f /opt/esggo/vps/docker-compose.yml ...` explicitly, or add a wrapper `docker-compose` alias in the service ExecStart.
- **Compose service name must match unit management**: when systemd manages only one compose service, `ExecStop/ExecStartPre` must target the actual service name from `docker-compose.yml` (`omniagent-gateway` in this tree), not a guessed alias like `esggo-gateway`.
- **Robust compose rebuild when terminal tool cannot receive oob mid-process**: in environments where background job completion policy requires `process(action='wait')` on canonical completion, do not assume the first `docker-compose up --build` backgrounded from `terminal(command=...)` will be visible via oob. Instead, use a two-mode build policy on the VPS itself: a local `ssh ... 'nohup bash -lc '\''docker-compose ... up -d --build 2>&1 | tee /tmp/dc-run.log && echo YES_DONE >> /tmp/dc-run.log'\'' >/tmp/nohup.out 2>&1 &'` backgrounded command plus a separate foreground `terminal()` polling loop that inspects `/tmp/dc-run.log` and `docker ps --filter "name=esggo-core"` for a healthy stack output. Avoid interactive `docker compose -f ... up` in the foreground; it blocks indefinitely and forces awkward `process(action='wait')` timeouts.
- **Compose cwd must be absolute across SSH/remote shells**: `cd /opt/esggo/vps && docker-compose ...` works when run interactively over SSH, but `terminal(command=...)` runs in `CWD` and does not auto-resolve forwarded directories. Always use absolute compose paths: `/usr/bin/docker-compose -f /opt/esggo/vps/docker-compose.prod.yml ...`. If you see `cd /opt/esggo/vps: No such file or directory`, that is an agent-side PATH/compose cwd mismatch, not a server-side missing directory issue.
- **Dangling exited build containers are lookup bloat, not stuck builds**: if `docker ps -a` shows random short container names like `inspiring_booth` in `Exited (0)` status after a failed build, those are intermediate build containers. They do not indicate the build is running. Inspect them with `docker logs --tail 50 <name>`; if there are no logs, they are pure one-shot build stages. Clean them up with `docker rm -f <name>` once the next build attempt is planned.
- **Forward compose output to a known file when backgrounding from local shell**: use `nohup bash -lc '\''... 2>&1 | tee /tmp/dc-run.log; echo YES_DONE >> /tmp/dc-run.log'\'' >/tmp/nohup.out 2>&1 &` so the local `terminal(command=...)` caller can `tail -n 40 /tmp/dc-run.log` from a separate SSH session. Without the `tee`, the backgrounded process output is unrecoverable from local inspection.
- **Detect port conflict between host listener and containerized stack before docker up**: if host nginx already occupies `:80/:443` and host Next.js occupies `:3000`, the `docker-compose.prod.yml` stack with internal nginx and esggo cannot bind cleanly. Either stop the host listener first (`sudo systemctl stop nginx; sudo pkill -f 'next-server'`) and migrate routing fully into Docker, or keep the host stack and document it as the stable state instead of forcing a containerized rebuild.
- **Backwards-compatible Dockerfile fix for workspace ignores**: if `.dockerignore` filters workspace `node_modules`/`apps/*/node_modules`, do not copy those paths "just in case"; remove the invalid `COPY --from=deps /app/packages/.../node_modules` lines from the Dockerfile. A pattern like `COPY --from=deps /app/node_modules` still works because root `node_modules` is not ignored. Removing nonexistent-path copies makes the build more cacheable and avoids `COPY failed: stat ...: file does not exist` mid-stage failures.
- **Do not run the full compose stack on low-ARM VPS without a proof-of-life step**: an `Always Free` ARM VPS with ~6GB RAM can OOM-kill during simultaneous container startup. After patching an image build issue, start the runtime-critical services first: `redis` then `esggo-core`. Leave `nginx`, `certbot`, and `oracle-keepalive` for a later verified stable state rather than enabling everything in one `docker-compose up -d`.


- **UFW default-deny then allowlist**: after `ufw enable`, verify state with `ufw status verbose`. fail2ban on Ubuntu 24.04 may use `ssh.service` instead of `sshd.service`; update `/etc/fail2ban/filter.d/sshd.conf` journal match accordingly.
- **Never paste live private keys into chat**: if the user needs to verify a key, ask them to run diagnostic commands locally (`ssh-keygen -l -f`, `ssh-add -l`) and report fingerprints/status, not the key material itself.
- **Before first push, credential-scan staged content**: even a \"script-only\" deploy repo can contain private keys if you wrote them there for convenience. Run a scan such as `git diff --cached --name-only --diff-filter=A | xargs grep -HIn --binary-files=without-match -E '(^|\\s)(SECRET|PRIVATE KEY|BEGIN RSA|BEGIN OPENSSH|BEGIN EC|BEGIN DSA|BEGIN PGP|api_key|token_secret|password|id_rsa_)('` before `git push`. Blocked matches mean don't commit; store those values in GitHub Secrets.
- **Force-cleaning history after an accidental key commit**: first remove the tracked file from HEAD and add `.gitignore`, then run a forced rewrite against the local repo: `git filter-repo --path <path> --invert-paths --force` and push with `git push --force-with-lease`. The force is unavoidable; skipping it leaves the secret in every clone/mirror.
- **TypeScript shared-types sync pattern for multi-repo projects**: when two repos need shared TS types but aren't in a monorepo, emit a raw-block `.d.ts` from the source repo via a small generator script, then in the consumer repo write a drift checker that normalizes comments/imports and exits non-zero on mismatch. Wire both into CI so type drift fails the build before runtime.
- **Creating a branch copy of one repo in another**: to mirror one repo as a new branch in another repo, from the source repo run `git push <target-origin> HEAD:<new-branch-name>`. This preserves both repos' histories. If the target branch already exists and must be replaced, add `--force`; otherwise choose a new branch name.
- **Daily backup/health script pattern**: place `scripts/daily-backup-and-health.sh` in both the VPS repo and `/opt/esggo/scripts/` on the host, install it via `/etc/cron.d/` with explicit user and log redirect, and divert email by appending `>> /var/log/esggo-daily.log 2>&1`. Backup inclusion list should cover `.next`, `public`, package manifests, and workspace sources, excluding `.git` and `node_modules`.
- **Always Free resources split into two tiers**:
  - automatable from VPS: Object Storage uploads, daily backup/health cron, monitoring webhooks, iptables/nginx/systemd config
  - manual-only from Console: Autonomous DB, extra ARM instances, Load Balancer, Archive Storage. Provide the user a checkbox list of Console steps; do not loop on SDK automation for these.
- **OCI API key 401 anti-loop**: when `oci iam user list` returns 401 NotAuthenticated, the next action must be the Console batch playbook, not another SDK/CLI retry. See `references/oracle-always-free-batch-setup.md`.\n- **Dockerfile COPY path verification**: before `docker build`, confirm every `COPY <path>` exists in the build context git tree. Missing files fail mid-build and break CI. If `vps/Dockerfile.gateway` references `vps/omni-server.mjs` but the real file lives at `_analysis/root-gateway/omni-server.mjs`, patch the Dockerfile or rebuild context first.\n- **OmniAgent Gateway on VPS**: the complete gateway is `_analysis/root-gateway/omni-server.mjs` (Express + WebSocket + /stream + /omni-jules + /skills + /evolve + /swarm/broadcast). Cloudflare Worker is an optional edge cache layer, not required for full functionality. Deploy the gateway container first; only add Worker if CF creds are available.\n- **GitHub Actions full-deploy workflow structure**: multi-job workflow covering `deploy-app` (checkout app repo, SSH, git reset hard, pnpm install/build, systemd restart), `deploy-gateway` (docker build + restart), `deploy-worker` (wrangler deploy when CF secrets exist), and `verify` (curl public endpoints). All jobs must reference secrets explicitly; missing secrets should skip gracefully, not fail the workflow.

- **User language preference**: this user requires Traditional Chinese and English only, globally, for all deliverables. Encode replies, docs, scripts comments, and commit messages in 繁體中文 + English. Do not default to Simplified Chinese unless explicitly asked.

- **OCI API key register-before-use rule**: a locally generated OCI API keypair will not authenticate until the public key is registered in OCI Console Identity Users API Keys. Do not loop SDK/CLI 401 retries; register the pub key first.\n- **OCI fingerprint format gotcha**: the OCI Python SDK `validate_config()` accepts only lowercase hex colons matching `^([0-9a-f]{2}:){15}[0-9a-f]{2}$`. If validation says `malformed`, the fingerprint is almost certainly uppercase, missing colons, or contains a `SHA256:` prefix. `ssh-keygen -l -E md5` output is NOT the same form the SDK expects; match the exact lowercase colon form.\n- **Bash here-doc indentation for remote scripts**: avoid leading whitespace inside `sudo tee /path >/dev/null <<'EOF'` heredocs; start the heredoc opener at shell-prompt margin, otherwise the script gets leading spaces on every line and breaks executability.\n- **Node 24/.js ESM pitfall**: when `package.json` has `"type": "module"` and a script uses ESM imports, run it with `node` directly. CJS patterns like `require()` inside `.js` files will fail in strict ESM scope. Convert the script to ESM or rename to `.cjs` if you must keep `require()`.\n- **TypeScript shared-types sync pattern for multi-repo projects**: when two repos need shared TS types but aren't in a monorepo, emit a raw-block `.d.ts` from the source repo via a small generator script, then in the consumer repo write a drift checker that normalizes comments/imports and exits non-zero on mismatch. Wire both into CI so type drift fails the build before runtime.\n- **Daily backup/health script pattern**: place `scripts/daily-backup-and-health.sh` in both the VPS repo and `/opt/esggo/scripts/` on the host, install it via `/etc/cron.d/` with explicit user and log redirect, and divert email by appending `>> /var/log/esggo-daily.log 2>&1`. Backup inclusion list should cover `.next`, `public`, package manifests, and workspace sources, excluding `.git` and `node_modules`.\n- **OCI Always Free automation boundaries**: Only VPS-side actions that don't require OCI API auth can be automated directly. Creating OCI-managed resources (Object Storage buckets, Autonomous DB, ARM instances, Load Balancer) requires the API key to be registered first. Provide the user a step-by-step Console UI checklist for these resources and don't loop on SDK automation.\n- **Git rewrite after accidental key commit**: first remove the tracked path, add to `.gitignore`, then force-rewrite history with `git filter-repo --path <path> --invert-paths --force` and push with `git push --force-with-lease`. Rotate at the provider before reuse.

- **Always Free resources split into two tiers**:\n  - automatable from VPS: Object Storage uploads, daily backup/health cron, monitoring webhooks, iptables/nginx/systemd config\n  - manual-only from Console: Autonomous DB, extra ARM instances, Load Balancer, Archive Storage. Provide the user a checkbox list of Console steps; do not loop on SDK automation for these.\n- **OCI API key 401 anti-loop**: when `oci iam user list` returns 401 NotAuthenticated, the next action must be the Console batch playbook, not another SDK/CLI retry. See `references/oracle-always-free-batch-setup.md`.\n
- **Dockerfile COPY path verification**: before `docker build`, confirm every `COPY <path>` exists in the build context git tree. Missing files fail mid-build and break CI. If `vps/Dockerfile.gateway` references `vps/omni-server.mjs` but the real file lives at `_analysis/root-gateway/omni-server.mjs`, patch the Dockerfile or rebuild context first.

- **OmniAgent Gateway on VPS**: the complete gateway is `_analysis/root-gateway/omni-server.mjs` (Express + WebSocket + /stream + /omni-jules + /skills + /evolve + /swarm/broadcast). Cloudflare Worker is an optional edge cache layer, not required for full functionality. Deploy the gateway container first; only add Worker if CF creds are available.

- **GitHub Actions full-deploy workflow structure**: multi-job workflow covering `deploy-app` (checkout app repo, SSH, git reset hard, pnpm install/build, systemd restart), `deploy-gateway` (docker build + restart), `deploy-worker` (wrangler deploy when CF secrets exist), and `verify` (curl public endpoints). All jobs must reference secrets explicitly; missing secrets should skip gracefully, not fail the workflow.

- **Daily backup/health script pattern**: place `scripts/daily-backup-and-health.sh` in both the VPS repo and `/opt/esggo/scripts/` on the host, install it via `/etc/cron.d/` with explicit user and log redirect, and divert email by appending `>> /var/log/esggo-daily.log 2>&1`. Backup inclusion list should cover `.next`, `public`, package manifests, and workspace sources, excluding `.git` and `node_modules`.

- **Accidental private key commit triage**: when a private key file is committed, remove it in the next commit, add it to `.gitignore`, force-clean history with `git filter-repo --force`, and rotate the key at the provider before reuse. Treat this as a security incident, not a normal refactor.

- **TypeScript shared-types sync pattern for multi-repo projects**: when two repos need shared TS types but aren't in a monorepo, emit a raw-block `.d.ts` from the source repo via a small generator script, then in the consumer repo write a drift checker that normalizes comments/imports and exits non-zero on mismatch. Wire both into CI so type drift fails the build before runtime.
- **Creating a branch copy of one repo in another**: to mirror one repo as a new branch in another repo, from the source repo run `git push <target-origin> HEAD:<new-branch-name>`. This preserves both repos' histories. If the target branch already exists and must be replaced, add `--force`; otherwise choose a new branch name.
- **Daily backup/health script pattern**: place `scripts/daily-backup-and-health.sh` in both the VPS repo and `/opt/esggo/scripts/` on the host, install it via `/etc/cron.d/` with explicit user and log redirect, and divert email by appending `>> /var/log/esggo-daily.log 2>&1`. Backup inclusion list should cover `.next`, `public`, package manifests, and workspace sources, excluding `.git` and `node_modules`.
- **Always Free resources split into two tiers**:
  - automatable from VPS: Object Storage uploads, daily backup/health cron, monitoring webhooks, iptables/nginx/systemd config
  - manual-only from Console: Autonomous DB, extra ARM instances, Load Balancer, Archive Storage. Provide the user a checkbox list of Console steps; do not loop on SDK automation for these.
- **OCI API key 401 anti-loop**: when `oci iam user list` returns 401 NotAuthenticated, the next action must be the Console batch playbook, not another SDK/CLI retry. See `references/oracle-always-free-batch-setup.md`.
- **User language preference**: this user requires Traditional Chinese and English only, globally, for all deliverables. Encode replies, docs, scripts comments, and commit messages in 繁體中文 + English. Do not default to Simplified Chinese unless explicitly asked.

## Post-deploy reachability diagnosis (three SEPARATE blockers)

A deploy can report "success" (container up, loopback health OK) yet still be unreachable
from the public internet. Do NOT conflate these — diagnose each independently before
telling the user it's done:

1. **VPS-local firewall** (ufw/iptables) — FIXABLE over the SSH secret (you CAN open 80/443).
2. **Provider Security List** (Oracle/OCI ingress 80/443) — CONSOLE-ONLY; you CANNOT fix this from SSH.
3. **DNS A/AAAA record** for the subdomain — CONSOLE/Cloudflare-ONLY; you CANNOT fix this from SSH.

Add a `diag.yml` workflow (same SSH_PRIVATE_KEY-secret pattern as deploy) that ships a small
`diag.sh` via rsync and runs it on the VPS. It:
- opens 80/443 on the VPS-local firewall (`sudo ufw allow 80/tcp; sudo ufw allow 443/tcp`),
- proves nginx listens on the public interface (`sudo ss -ltnp | grep -E ':80 |:443 '` — must
  show `0.0.0.0:80`, NOT just `127.0.0.1`),
- curls the loopback health (`curl -fsS http://127.0.0.1:8000/api/health`),
- prints the public IP (`curl -fsS https://api.ipify.org`) — that's the A-record target for DNS.

**Interpretation:** if loopback works + nginx listens on `0.0.0.0:80` but the public IP still
times out from your machine, the blocker is #2 (Security List) or #3 (DNS) — both console-side.
Hand the user the exact console steps; don't loop on SSH retries (the SSH key is fine, the
public path is not). A reusable `diag.sh` / `verify_live.py` pair lives in
`references/live-verify-and-diag.md`.

## Templates

See `templates/` for:
- `deploy-via-ssh.sh`: idempotent remote deploy script template
- `cd_deploy.yml`: GitHub Actions workflow that scps + executes the deploy script
- `oracle-deploy/`: preserved OCI deploy patterns, CD workflow, and VPS verify scripts

## References

See `references/` for:
- OCI SSH metadata dead-end references
- GitHub Actions SSH secret patterns
- Oracle dtap checklists re: `/opt/esggo` pathing
- OACC capacity query pattern for `ap-singapore-1`
- docs/DEPLOY-FTG.md and scripts/deploy-production.ps1/occ-monitor.mjs for FTG and ESGGO deploy artifacts
- OCI SDK-based keypair injection and authorized_keys repair via serial console fallback
- Windows-local OCI SDK provisioning with `~/.oci/config` and API key fingerprint `7VjQYyId...`

## Docker Compose Deployment Pattern

When deploying Docker Compose stacks to a VPS:

### Docker Compose v1 vs v2
Ubuntu 24.04 may ship only `docker-compose` v1.29.2 without the v2 plugin. If `docker compose -f ...` fails with `unknown shorthand flag: 'f'`, use:
```bash
/usr/bin/docker-compose -f /opt/esggo/vps/docker-compose.yml up -d
```

### Multi-service Stack Deployment
For low-ARM VPS (1 OCPU / 6GB), start services sequentially to avoid OOM:
1. Start Redis first: `docker-compose up -d redis`
2. Then app: `docker-compose up -d esggo`
3. Finally nginx/certbot: `docker-compose up -d nginx certbot`

### Environment Variables
Store in `.env` file at compose root:
- AI keys: `GROQ_API_KEY`, `OPENROUTER_API_KEY`
- Database: `DATABASE_URL`
- Redis: `REDIS_URL`
- Never commit `.env` to git

### Health Checks
Verify each service:
```bash
curl -sS http://localhost:3000/api/health  # App
curl -sS http://localhost:8642/status     # Gateway
curl -sS http://localhost:80/health       # Nginx
```

### SCP Fallback for File Transfer
When `rsync` is unavailable:
```bash
scp -i keyfile -r ./vps ubuntu@161.118.252.147:/var/www/esggo/
```

---

## Offline-while-blocked pattern

When SSH/metadata blocks VPS access, still push non-blocking deliverables:
- `docs/DEPLOY-FTG.md` for static-site deploy options (Vercel, Netlify, VPS nginx)
- `scripts/deploy-production.ps1` idempotent deploy script for post-SSH use
- `scripts/occ-monitor.mjs` Node OCI Control Center capacity monitor using `ConfigFileAuthenticationDetailsProvider` and `oci-control-center`
- Always commit and push these from the VPS repo so they are not lost while access is restored.

## Skill-specific verification

Before pushing deploy artifacts, validate:
- `python -c "import yaml; yaml.safe_load(open('.github/workflows/cd_deploy.yml'))"`
- `bash -n scripts/deploy-via-ssh.sh`
- dry-run the remote script by replacing docker/git calls with `echo` and execute it locally

## ESGGO Dockerized Deployment Troubleshooting Notes
See `references/esggo-docker-build-fix.md` for session-specific detail on:
- `.dockerignore` vs `COPY --from=deps` conflicts in `vps/Dockerfile.arm64`
- removing invalid workspace `node_modules` copies from the deps stage
- stable host-based HTTPS state with host nginx + `next-server`

## Static-site deploy to VPS nginx

When the VPS already runs nginx as the single public listener on `:80`, do not install a second nginx instance. Instead, add a new site inside the existing nginx:

- create `/etc/nginx/sites-available/<site-name>` with its own `server_name` or distinct hostname
- link it into `/etc/nginx/sites-enabled/`
- before reloading, purge stale duplicates: an existing `/etc/nginx/sites-available/default` plus another `server_name _;` site will trigger `conflicting server name` warnings and may fail reload
- keep exactly one `listen 80 default_server;` across all enabled sites; others should use `listen 80;` with explicit `server_name`
- for SPA/React Router apps, add `try_files $uri $uri/ /index.html;`
- restrict `/health` and other operational endpoints to localhost and RFC1918 sources with `allow/deny`

If `nginx -t` fails with a `map` directive error, the `map` was placed inside a `server{}` block rather than the `http{}` context. Remove it or move it to `/etc/nginx/nginx.conf` outside any server block.

## ESGGO Learning Center specific deployment notes

For ESGGO Learning Center (Vite 6 + React 18 + Tailwind CSS + Firebase Spark):

### Docker setup for React SPA on VPS
```yaml
# docker-compose.yml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - VITE_FB_API_KEY=${VITE_FB_API_KEY}
      - VITE_FB_PROJECT_ID=${VITE_FB_PROJECT_ID}
      # ... other env vars
    restart: unless-stopped
```

### nginx configuration for SPA routing
```nginx
server {
    listen 80;
    server_name esggo.co www.esggo.co;
    
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location /api/ {
        proxy_pass http://127.0.0.1:3000/api/;
    }
}
```

### Environment variables (Spark tier limitations)
- Firebase Spark does NOT include Cloud Storage
- Use Firestore for file metadata, client-side upload base64 for small files
- Set `VITE_USE_ORACLE=false` for local Firestore mode

## Vite luxury-brand UI upgrade pattern

When refreshing a Vite + React + Tailwind static site toward a premium feel:

- extend `tailwind.config.js` with `colors.mist`, `colors.ink`, extra spacing, and larger `borderRadius` tokens
- clean `src/App.css` back to a placeholder; move all styles into `src/index.css`
- add reusable component classes in `index.css`: `section-label`, `section-title`, `section-subtitle`, `card-elevated`, `card-muted`, `btn-primary`, `btn-secondary`
- use one consistent hero pattern: full-bleed background image, dark gradient overlay, eyebrow label, serif display type, animated scroll-hint
- use one consistent subpage hero: dark tinted block with section label + `← 返回首頁`
- unify CTAs as elevated cards inside sections rather than floating buttons
- prefer `font-serif` for Chinese display headings and `font-sans` for body copy, with increased tracking and tighter line-height on titles

Avoid:
- decorative `map` blocks inside nginx `server{}` contexts
- blank `class="logo"` selectors referencing undefined custom elements
- `src/assets/vite.svg` in production builds without replacing or removing it

## Mobile and motion refinements

For RWD on post-redesign pages:

- use `grid-cols-1 / md:grid-cols-2 / lg:grid-cols-3 or 4` consistently
- use layout spacing progressive ramps such as `py-20 / md:py-32 / lg:py-32`
- use typography ramps such as `text-base / md:text-lg / lg:text-xl` rather than jumps
- keep mobile navigation in a full-width dropdown with `backdrop-blur` for readability over content
- animate with `transition-all duration-300`, limited to `transform`, `opacity`, `shadow`, and `translate`; avoid layout-triggering properties

## Verification pattern for static-site refresh

After a Vite site redesign, validate with:

- `pnpm run build` — must complete with zero runtime bundler errors
- `pnpm preview --port 4173` as a background process, followed by `curl` over every route including deep links; expect HTTP `200` for SPA routes
- `pnpm run lint` — must be `0 warnings and 0 errors`

For CSS ordering warnings such as `@import` after `@tailwind`, move every `@import` above the first `@tailwind` directive without changing font families or output files.

## Cloudflare DNS + HTTPS automation from VPS

When Cloudflare is the nameserver for a zone, automate DNS and HTTPS from the VPS SSH session rather than local shell:

- **API access restriction**: Cloudflare blocks API calls from some residential/cloud IP ranges with `9109 Cannot use the access token from location`. Always run Cloudflare API calls via SSH to the VPS, not from the local shell.
- **Cloudflare DNS update pattern**: use a short Python snippet on the VPS with `requests` to find/create/update A, AAAA, and CNAME records via `GET /zones/{zone_id}/dns_records?...` then `POST/PUT /zones/{zone_id}/dns_records/{record_id}`.
- **User token vs Account token**: `GET /user/tokens/verify` expects a user-scoped API token. Account-scoped tokens (`cfat_...`) must use `/accounts/{account_id}/tokens/verify` if you want to verify them. DNS record operations accept either token type as long as the token has `Zone:DNS:Edit` on the target zone.
- **Verify externally**: after updating, validation tools/vendors that use public resolvers may still see stale cached records. Use `dig @8.8.8.8` or `nslookup` against Google DNS to confirm propagation before running certbot.
- **certbot --nginx for multi-domain certs**: run `certbot --nginx -d root -d www -d sub` non-interactively. Certbot automatically creates the `/etc/letsencrypted/options-ssl-nginx.conf` include and HTTP→HTTPS redirect blocks.
- **SFTP/SCP fallback for deploy scripts**: not all shells have `rsync`. Use `scp -r` as a fallback transfer method; it is available by default on Windows Git Bash and Linux/macOS.
- **Bash heredoc safety for remote API scripts**: avoid leading whitespace inside heredoc openers and do not mix shell arrays with quoted strings when passing headers to `curl`. Prefer a short Python snippet via `ssh ... "python3 - <<'PY'` over complex bash header assembly.

## Single-VPS multi-site nginx pattern

When hosting more than one site on one VPS behind Cloudflare proxy:

- create explicit nginx sites with `server_name`; do **not** use `server_name _;` defaults that conflict
- keep exactly one `listen 80 default_server;` across all enabled sites
- for static SPA React Router apps: `try_files $uri $uri/ /index.html;`
- for Node.js origins: proxy only `/api/` to `127.0.0.1:<port>` and let `/ftg/` serve static files via `alias`
- certbot automatically adds `listen 443 ssl` blocks and HTTP→HTTPS redirect sites; verify with `nginx -t`

## Cloudflare API IP restriction and working around it

Cloudflare frequently returns `9109 Cannot use the access token from location` when calling API from certain residential/cloud IP ranges. The workaround is to run the API calls over SSH from the VPS itself, not from the user’s local shell. A short `python3 - <<'PY'` snippet with `requests` is more reliable than assembling curl headers in bash.

## Cloudflare token types

- Use `GET /user/tokens/verify` for user-scoped tokens (`cfut_...`)
- Use `GET /accounts/{account_id}/tokens/verify` for account-scoped tokens (`cfat_...`)

Both work for DNS record operations if you have `Zone:DNS:Edit` on the target zone.

## SCP fallback for deploy scripts

On minimal Windows Git Bash or restricted runners, `rsync` is not available. Use `scp -r -o StrictHostKeyChecking=accept-new -i <key> <src> <user>@<host>:<dst>` instead.

## certbot multi-domain

For multiple domains on one nginx server, run `certbot --nginx -d root -d www -d sub --non-interactive --agree-tos -m ...`. Certbot auto-creates the SSL includes and HTTP→HTTPS redirect blocks.

## DNS propagation wait rule

After updating DNS via API, wait for external propagation (`dig @8.8.8.8 <host>`) before re-running certbot. Retries before propagation just churns the log.

## Single-VPS multi-site nginx pattern

When adding sites on an already-VPS-hosted domain, ensure only one site has `listen 80 default_server;`. Do not leave `default` enabled while adding a new `server_name _;` site; this triggers `conflicting server name` warnings.

## Static-site deploy pattern

When deploying a Vite/React static site to `/var/www/<site>`:
- use `try_files $uri $uri/ /index.html;` for SPA fallback
- keep static assets outside the API proxying scope
- verify with `curl -I http://127.0.0.1/` and route checks after reload

For Vite/React static sites before deploy, run `pnpm build && pnpm preview --port 4173` as a background process, curl every route, then kill the preview process. This catches route/asset bundling issues that `build` alone misses. Use `terminal(background=true, notify_on_complete=true)` for the preview server, then a separate foreground `curl` loop across all expected paths.

If the consumer site uses nginx on the VPS and you see conflicting localhost responses after a site swap, inspect `/etc/nginx/sites-enabled/` for duplicate `server_name _;` defaults. Remove stale defaults and keep exactly one `default_server` on `:80`.
