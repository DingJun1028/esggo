---
name: hermes-webui-vps-deploy
description: "Deploy Hermes WebUI to a VPS via Docker."
version: 1.0.0
license: MIT
platforms: [linux, macos]
---

# Hermes WebUI → VPS Deployment

## When to use this skill
- User asks to "install / deploy Hermes WebUI" (the browser UI for Hermes Agent) on a server/VPS.
- User wants a web-accessible Hermes Agent console instead of (or alongside) the terminal/CLI.
- You need browser access to a Hermes Agent running on a remote host.

## What Hermes WebUI is
A lightweight dark-themed web app (Python + vanilla JS, no build step) that gives **1:1 CLI parity** with Hermes Agent through a browser. It needs a **standard hermes-agent backend** to actually chat — without it the UI loads but shows no agent/sessions.

Repo: `https://github.com/nesquena/hermes-webui.git`. Default port `8787`. Binds `127.0.0.1` (loopback) by default; expose via SSH tunnel or password + `0.0.0.0`.

## Pre-flight (MUST do before any install)
1. **Check VPS disk:** `ssh host "df -h /"`. If `Use% >= 95%`, STOP. A full disk (this user's VPS is 45G, runs ~13GB of service images) will break `docker exec` (`OCI runtime exec failed: write /tmp/runc-process...: no space left on device`) and the hermes-agent installer (`cat: write error: No space left on device`). Tell the user to resize the Oracle boot volume first. Do NOT try to squeeze an install onto a full disk.
2. **Check SSH auth:** `ssh -o BatchMode=yes esggo-vps-root 'echo OK'`. Use the host alias from `~/.ssh/config` (this env: `esggo-vps-root` → `root@161.118.248.180` with `IdentityFile ~/.ssh/esggo_original`). Direct `root@<ip>` fails with `Permission denied (publickey)` if no key is specified.
3. **Check existing port usage:** `ssh host "ss -ltnp | grep -E '8787|8788|8790'"`. The default `8787` is very likely taken on a busy VPS (this one had `8787` = omni-blueprint-hub, `8788` = universal-translator). Pick a free port.

## Deployment steps (verified 2026-08-07)
Run on the VPS via `ssh host "bash -s <<'REMOTE' ... REMOTE"` (use `background=true` on the agent `terminal` call if it contains `docker compose up -d`, or the precheck blocks it as a "long-lived server").

```bash
ssh esggo-vps-root bash -s <<'REMOTE'
  set -e
  cd ~
  [ -d hermes-webui ] || git clone --depth 1 https://github.com/nesquena/hermes-webui.git
  cd hermes-webui
  cp -n .env.docker.example .env
  # Password auth (REQUIRED if you bind 0.0.0.0; safe even on 127.0.0.1)
  echo "HERMES_WEBUI_PASSWORD=$(openssl rand -base64 18 | tr -d '/+' | head -c 24)" >> .env
  echo "HERMES_WEBUI_PORT=8790" >> .env
  docker compose up -d
  # wait for health
  for i in $(seq 1 25); do curl -sf http://127.0.0.1:8790/health >/dev/null 2>&1 && break; sleep 2; done
  curl -s http://127.0.0.1:8790/health
REMOTE
```

### ⚠️ CRITICAL: docker-compose.yml hardcodes port 8787
The shipped `docker-compose.yml` does **NOT** read `HERMES_WEBUI_PORT` from `.env` for the port binding — it has a literal `"127.0.0.1:8787:8787"` (and a commented `"8787:8787"`). If `8787` is taken you get:
```
Error response from daemon: failed to set up container networking: ... failed to bind host port 127.0.0.1:8787/tcp: address already in use
```
**Fix:** `sed -i 's/127.0.0.1:8787:8787/127.0.0.1:8790:8787/' docker-compose.yml` (map host 8790 → container 8787). Re-run `docker compose up -d`. Verify with `docker ps` showing `127.0.0.1:8790->8787/tcp`.

### ⚠️ The container needs hermes-agent to chat
After deploy, `/health` returns `{"status":"ok"}` but the UI has **no agent** until hermes-agent is installed. The WebUI container logs show: `set one of: HERMES_WEBUI_AGENT_DIR=... / HERMES_HOME=...`. To install inside the container:
```bash
# Get the REAL running container ID (docker ps, NOT a cached ID — compose/daemon state drift caused "is not running" false errors)
CID=$(ssh esggo-vps-root "docker ps --filter name=hermes-webui-hermes-webui-1 --format '{{.ID}}'")
ssh esggo-vps-root "docker exec $CID bash -c 'curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash'"
```
Then `docker compose restart` so WebUI discovers `~/.hermes/hermes-agent`.

**Disk caveat:** this install needs ~500MB+ (pip + node_modules). On a near-full VPS it fails (see Pre-flight). Resolve disk first.

### ⚠️ Docker daemon state drift
`docker ps` showed `Up (healthy)` but `docker exec`/`docker compose exec` reported `is not running` / `container ... is not running`. Cause: a prior `docker compose restart` created a new container while a stale ID was cached. **Always re-fetch the ID with `docker ps --filter name=... --format '{{.ID}}'` right before `docker exec`.** A clean `docker compose down && docker compose up -d` also resolves it.

## Exposing to your browser (SSH tunnel)
WebUI binds `127.0.0.1` by default. From your local machine:
```bash
ssh -N -L 8790:127.0.0.1:8790 esggo-vps-root    # then open http://localhost:8790/
```
Or run one tunnel for several services at once:
```bash
ssh -f -N -L 8790:127.0.0.1:8790 -L 8788:127.0.0.1:8788 esggo-vps-root
```
Then `curl -s http://127.0.0.1:8790/health` locally proves the tunnel works. Finally use the agent `open_preview(url="http://localhost:8790/")` to show the user the live UI (it does NOT return content to the agent — the user sees it in the preview pane).

If a service binds `*:8788` (all interfaces, like universal-translator here) you can also open `http://<vps-ip>:8788/` directly without a tunnel.

## Verification checklist
- [ ] `curl -s http://127.0.0.1:8790/health` on VPS → `{"status":"ok"}`
- [ ] `docker ps` shows `hermes-webui-hermes-webui-1 Up (healthy)`
- [ ] SSH tunnel established; `curl http://127.0.0.1:8790/health` locally → ok
- [ ] `open_preview` shows the login page (enter the generated `HERMES_WEBUI_PASSWORD`)
- [ ] After agent install + restart: WebUI shows sessions/agent (not "no agent")

## Notes on this user's VPS (161.118.248.180)
- `omniagent-gateway` container runs OA's agent gateway on `127.0.0.1:8642`. "OmniAgent (OA)" = `/opt/esggo/packages/omni-agent` which is the **OmniJules 5T Gate Verification Engine** (a TypeScript package), NOT a chat-compatible Hermes Agent. WebUI cannot use it as a backend without protocol confirmation.
- VPS already runs universal-translator on `:8788` and omni-blueprint-hub on `:8787` — hence WebUI went to `:8790`.
- `hermes-webui` clone lives at `~/hermes-webui` on the VPS; state in `~/.hermes/webui` (written by the container as user `opc`).

## Pitfalls summary
- Docker compose precheck in the agent `terminal` blocks `docker compose up -d` as "long-lived" → use `background=true`.
- `docker compose restart/down` triggers approval (auto-approved here) — expect a prompt.
- A full VPS disk breaks `docker exec` and agent install — check `df -h /` first.
- Don't delete running service images to free space — they're the user's live stack; resize the volume instead.
- `open_preview` shows the UI to the user but returns no content to the agent; verification needs real `curl`.
