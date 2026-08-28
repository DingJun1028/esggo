---
name: hermes-webui-deploy
description: Deploy Hermes WebUI where hermes-agent already runs.
---

# Hermes WebUI Deploy (host already runs hermes-agent)

Hermes WebUI (`nesquena/hermes-webui`) is a self-hosted browser UI for an existing
Hermes Agent. When the host ALREADY has hermes-agent installed system-wide, the
bootstrap refuses to build a separate venv — it demands you point it at the
agent's Python via `HERMES_WEBUI_PYTHON`.

## When to use
- User wants browser access to Hermes (instead of / alongside the CLI).
- Remote VPS: access via `ssh -N -L <port>:127.0.0.1:<port> user@vps` then open localhost.
- `ctl.sh` / `bootstrap.py` errors out with "cannot import both WebUI dependencies and Hermes Agent".
- **Native Windows + Tailscale**: user wants Hermes WebUI reachable from phone/iPhone
  over the tailnet. This is fully supported — see `references/windows-tailscale-deploy.md`.

## Steps
1. Clone: `git clone --depth 1 https://github.com/nesquena/hermes-webui.git ~/hermes-webui`
2. Find the agent venv Python: `readlink -f $(which hermes)` → e.g. `/opt/hermes-venv/bin/python`
3. Export required vars (see `references/deploy-hermes-webui.sh` for the full working script):
   - `HERMES_WEBUI_PYTHON=/opt/hermes-venv/bin/python`  ← REQUIRED when agent is installed system-wide
   - `HERMES_WEBUI_PORT=8799` (avoid 8787 if occupied — see Pitfalls)
   - `HERMES_WEBUI_HOST=127.0.0.1` (loopback only; expose via SSH tunnel, never raw 0.0.0.0 without password)
   - `HERMES_WEBUI_STATE_DIR=$HOME/.hermes/webui`, `HERMES_HOME=$HOME/.hermes`
4. `cd ~/hermes-webui && ./ctl.sh start` (background daemon; PID at `~/.hermes/webui.pid`, log `~/.hermes/webui.log`)
5. Health: `curl -sf http://127.0.0.1:8799/health` → `{"status":"ok",...}`
6. Browser: on your laptop, `ssh -N -L 8799:127.0.0.1:8799 user@vps`, then open `http://localhost:8799`

## Pitfalls
- **`HERMES_WEBUI_PYTHON` not set** → bootstrap error:
  `Python environment cannot import both WebUI dependencies and Hermes Agent.
  Set HERMES_WEBUI_PYTHON to the Hermes Agent venv Python or install the WebUI
  requirements into that environment.` Fix: export it before `ctl.sh start`.
- **Port 8787 already bound** → `ctl.sh` refuses: "a live server is already
  responding on 127.0.0.1:8787." Pick a free port (8799) and update
  `HERMES_WEBUI_PORT` + the tunnel command. Do NOT kill the existing service
  blindly — check `ps aux | grep 8787` / `ss -ltnp` first; it may be a real
  service (e.g. omni-blueprint-hub monitor-server).
- **`ctl.sh start` health check is too fast** → it polls `/health` within ~3s and
  may print "did not respond within 3s" even on a successful boot (the server
  keeps starting). Re-check with `curl` after ~60–120s. The deploy script retries
  5× with 3s gaps.
- **Native Windows IS supported** for `nesquena/hermes-webui` (it's a Python/FastAPI
  app, not Node). `ctl.sh` has an MSYS path bug that fails on Windows, but launching
  `bootstrap.py` directly with the native Windows Python works. See
  `references/windows-tailscale-deploy.md` for the full verified recipe
  (incl. Tailscale exposure + auto-start). Quick version:
  1. `.env`: `HERMES_WEBUI_PORT=8787`, `HERMES_WEBUI_HOST=0.0.0.0`,
     `HERMES_WEBUI_PASSWORD=<24-char>`, `HERMES_WEBUI_STATE_DIR`/`HERMES_HOME`.
  2. Launch: native `python.exe "C:\Project\hermes-webui\bootstrap.py" --no-browser --host 0.0.0.0 8787`
     (NOT `./ctl.sh start` — MSYS doubles the drive letter to `C:\c\...`).
  3. Tailscale: prefer `tailscale serve --bg 8787`; if Serve is disabled on the
     tailnet, the 0.0.0.0 bind above already makes it reachable at
     `http://<tailscale-ip>:8787` (password-enforced — server.py refuses 0.0.0.0
     without a password, so never set host 0.0.0.0 without it).
  NOTE: if you see `bootstrap ERROR: did not become healthy ... Server PID: <n>`
  with exit code 1, the CHILD SERVER IS STILL RUNNING — bootstrap just can't probe
  the literal `http://0.0.0.0:8787/health`. Verify with `curl http://127.0.0.1:8787/health`.
- **HERMES_HOME trap on THIS machine**: the real hermes home is
  `C:\Users\dingj\AppData\Local\hermes` (where `config.yaml` + `auth.json` with the
  Nous subscription live). `C:\Users\dingj\.hermes` is an EMPTY home — if WebUI uses
  it you get "no providers/models" because Nous OAuth isn't there. Set
  `HERMES_HOME=C:\Users\dingj\AppData\Local\hermes` in BOTH `.env` and the launch
  `.cmd`, never `C:\Users\dingj\.hermes`. After fixing, restart WebUI and confirm
  `/api/models` contains `nous`.
- **⚠️ VERIFY THE PASSWORD BEFORE YOU REPORT IT (burned the user once)**: never give
  the user a password from memory or a guess. Always (a) read the actual `.env`
  `HERMES_WEBUI_PASSWORD` line, and (b) `POST /api/auth/login` with that exact value
  and confirm `{"ok": true}` before pasting it into your reply. Reporting a wrong
  password wastes a full round-trip.
- **Changing the password requires a server restart**: the auth hash is cached at
  startup (server.py). Symptom: "I changed the password but it's still rejected" →
  the running process only knows the OLD hash. Kill the 8787 listener and relaunch.
  Verify the new password logs in before telling the user.
- **`terminal.backend: ssh` on Windows self-locks the terminal tool** — do NOT set
  `terminal.backend: ssh` on Windows Hermes. It makes every terminal/file call try
  the SSH backend, which fails with `getsockname failed: Not a socket` until a
  restart and even then the Windows paramiko backend is unreliable. Use
  `backend: local` + `ssh user@vps "..."` commands instead. (This is a Hermes
  Windows quirk, not a WebUI issue — noted here because it blocks VPS work.)

## Cron jobs that send Telegram (see `references/cron-telegram-pitfall.md`)
If you wire a cron job to notify via Telegram, set `deliver: local` and have the
script call the Telegram API directly. `deliver: all` routes through the Hermes
platform delivery layer, which can fail with Telegram DNS/timeout errors and mark
the whole cron `error` even when the agent logic succeeded.

## Windows Python path gotcha (see `references/windows-python-paths.md`)
In Git-Bash/Windows, `os.path.expanduser("~/...")` yields mixed-separator paths
(`C:\Users\dingj/.hermes/scripts/x.py`) that break `os.path.exists` checks and
`subprocess.run([python, script])` resolution. Use hardcoded absolute Windows paths
in scripts meant to run under Windows Python.

## Native Windows + Tailscale full recipe (see `references/windows-tailscale-deploy.md`)
Bypassing `ctl.sh`'s MSYS path bug, the 0.0.0.0+password safety gate, the
`tailscale serve` fallback, the bootstrap "did not become healthy" red herring,
and the Startup-folder `.lnk` auto-start that survives MSYS `schtasks` failures.
