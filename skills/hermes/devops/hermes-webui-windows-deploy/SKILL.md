---
name: hermes-webui-windows-deploy
description: Deploy Hermes WebUI on Windows for Tailscale iPhone access.
---

# Hermes WebUI — Windows (MSYS) Deployment

## Trigger
User wants Hermes WebUI reachable (e.g. from iPhone via Tailscale). Repo `https://github.com/nesquena/hermes-webui`.

## Critical facts (avoid re-debugging)
1. **Python, not Node.** Launched via `bootstrap.py` (creates venv, pip-installs, execs `server.py`/uvicorn). `package.json` has no deps — ignore it.
2. **`ctl.sh start` FAILS on MSYS**: `REPO_ROOT` → `/c/Project/...` gets mangled to `C:\c\Project\...` → `can't open file`. Do NOT use `ctl.sh`.
3. **Launch directly** with NATIVE Windows Python + native paths:
   `"C:\Users\dingj\AppData\Local\Python\pythoncore-3.14-64\python.exe" "C:\Project\hermes-webui\bootstrap.py" --no-browser --host 0.0.0.0 8787`
   (find exe via `ls "C:/Users/dingj/AppData/Local/Python/pythoncore-3.14-64/python.exe"`; MSYS `python3` is a store reparse point that triggers the path bug).
4. **Password auth**: `HERMES_WEBUI_PASSWORD` in repo `.env`. `server.py` REFUSES 0.0.0.0 bind without a password (safe-by-default). Verify: `GET /api/sessions` → 401, `GET /` → 302.
5. **Tailscale Serve DISABLED on this tailnet** → fallback `0.0.0.0` + password (not `tailscale serve --bg 8787`). If enabled later, prefer serve.
6. **Task Scheduler fails under MSYS** (`schtasks /Create` mangles `//Create`). Use Startup folder `.lnk`: write `.ps1` creating shortcut (WindowStyle=7) to `start-webui.cmd`, `powershell -File script.ps1`, place `.lnk` in `C:\Users\dingj\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup\`.
7. **Kill server**: native Windows python PID — MSYS `kill` can't see it. Use `cmd /c "taskkill /PID <pid> /F"`.
8. **`sed` mangles Windows backslash paths on MSYS**: `sed -i 's|X|\\Users\\dingj\\AppData...|'` turns `\U \d \A \L` into garbage (e.g. `C:SERSDINGJAPPDATAocalhermes`). Never `sed`-edit `.env`/`.cmd` with backslashes. Instead: `grep -v '^KEY=' file > tmp && mv tmp file` to drop a line, then `printf 'KEY=value\n' >> file` with forward slashes (works for HERMES_HOME on Windows). Or rewrite the whole file via write_file.
9. **`proc exited code 1` from `bootstrap.py` is a FALSE NEGATIVE**: bootstrap health-checks `http://0.0.0.0:8787/health` (a non-routable literal) and reports "did not become healthy" even though it already spawned + detached the server. Always verify with a SEPARATE `curl http://127.0.0.1:8787/health` — if that is `{"status":"ok"}`, the server is fine despite the exit-1 log line.
10. **Password change in `.env` requires a SERVER RESTART.** `auth.py` caches the PBKDF2 password hash at process start (`_AUTH_HASH_COMPUTED`). Editing `.env` alone does nothing until the server is killed + relaunched. Symptom of missing this: "changed password, still rejected" — the running process still only knows the old hash. Kill via step 7, relaunch via start-webui.cmd, then re-verify login.

## CRITICAL: HERMES_HOME MUST point at the REAL hermes home
The WebUI reads the agent runtime (providers, models, skills, OAuth) from `HERMES_HOME`. If it points at a WRONG/empty home, the UI shows **no providers/models** and no login session — even though the server itself starts fine.

- **Real home on this machine**: `C:\Users\dingj\AppData\Local\hermes` (env var `HERMES_HOME` is already set to this system-wide).
- The hermes-agent config (`config.yaml`), `auth.json` (Nous subscription OAuth), and skills all live there.
- The older `~/.hermes` (`C:\Users\dingj\.hermes`) is EMPTY for this install — do NOT use it.
- A past run hardcoded `HERMES_HOME=C:\Users\dingj\.hermes` (copied from a Linux `~/.hermes` example) → WebUI launched against the empty home → "providers/models all gone" until `HERMES_HOME` was corrected to `AppData\Local\hermes` and the server restarted.
- **Fix**: set `HERMES_HOME=C:/Users/dingj/AppData/Local/hermes` (forward slashes, avoids the sed/backslash trap). It also inherits the already-authenticated Nous subscription, so no re-login needed.

## Wiring the provider/model (Nous subscription)
1. After fixing `HERMES_HOME` + restart, login (cookie jar) and hit `GET /api/models` with the session cookie. It lists `groups` including **"Nous Portal"** (your subscription models, e.g. `@nous:anthropic/claude-sonnet-4.6`, `@nous:openai/gpt-5.4-mini`, `@nous:google/gemini-3.1-pro-preview`, opus/sonnet-5, etc.).
2. Set the default model via `POST /api/default-model` (NOT `/api/config/set-default-model` — that path 404s):
   `curl -b cookie.jar -X POST http://127.0.0.1:8787/api/default-model -H 'Content-Type: application/json' -d '{"model":"@nous:anthropic/claude-sonnet-4.6","provider":"nous"}'`
   Returns `{"ok":true,"model":"anthropic/claude-sonnet-4.6","provider":"nous"}` and writes `model.default`/`model.provider: nous` into the real `config.yaml`.
3. Verify: `GET /api/models` → `default_model: anthropic/claude-sonnet-4.6`, `active_provider: nous`.
4. **Never guess a Nous model ID** — pull the exact ID from the `/api/models` "Nous Portal" group first.

## .env
```
HERMES_WEBUI_PORT=8787
HERMES_WEBUI_HOST=0.0.0.0
HERMES_WEBUI_PASSWORD=<24-char random>
HERMES_WEBUI_STATE_DIR=C:\Users\dingj\.hermes\webui
HERMES_HOME=C:\Users\dingj\AppData\Local\hermes
```

## start-webui.cmd (no hardcoded password — bootstrap reads .env)
```
@echo off
set HERMES_WEBUI_HOST=0.0.0.0
set HERMES_WEBUI_PORT=8787
set HERMES_WEBUI_STATE_DIR=C:\Users\dingj\.hermes\webui
set HERMES_HOME=C:\Users\dingj\AppData\Local\hermes
"C:\Users\dingj\AppData\Local\Python\pythoncore-3.14-64\python.exe" "C:\Project\hermes-webui\bootstrap.py" --no-browser --host 0.0.0.0 8787
```

## Verify before reporting
- `curl http://127.0.0.1:8787/health` → `{"status":"ok"}`
- **Read password from `.env`** (never recall), then `curl -X POST http://127.0.0.1:8787/api/auth/login -d '{"password":"<from .env>"}'` → `{"ok":true}` 200. Negative: wrong → 401.
- **Report the EXACT password read from `.env`** — a past run gave a wrong password (not re-read) → "password rejected".

## iPhone access
- Hermex URL: `http://<tailscale-ip>:8787` (e.g. `http://100.103.244.34:8787`). Hostname `http://dingjun.tail658f8b.ts.net:8787` also works.
- "Connection green" = network OK; only password matters after.
- After wiring `HERMES_HOME` correctly, the model picker shows the **Nous Portal** group — select a Nous model (default already set via `/api/default-model`). If the picker is empty, the server is still pointing at the wrong/empty `HERMES_HOME` → re-check step "CRITICAL: HERMES_HOME".
