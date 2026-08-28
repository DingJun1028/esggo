# DeerFlow local Docker deploy + verify, GUI-only (2026-08-04 session repro)

Goal: stand up DeerFlow (repo `C:\Project\esggo-deerflow`) locally on the user's
Windows box with NO usable shell (SSH terminal backend down, execute_code
blocked) — only `computer_use` + MCP file tools + staged `.bat` log-relay.

## What actually ran (sequence)

1. Wrote `_sandbox/deerflow-config.ps1` + `.bat` wrapper (log-relay pattern).
   - `.ps1`: `$ErrorActionPreference='Continue'`, UTF8-no-BOM log, steps:
     (1) `python scripts/configure.py` → `CONFIGURE_EXIT=0` (generates
     `config.yaml` ~246 KB, `.env`, `frontend/.env`);
     (2) verify `config.yaml` exists;
     (3) inject ONE DeepSeek model into the all-commented `models:` block using
     env-var placeholder `$DEEPSEEK_API_KEY` — NEVER a real key;
     (4) verify injection via `[System.IO.File]::ReadAllText(...).Contains('deepseek')`.
2. Double-clicked `.bat` in Explorer → ran. First `bash ./scripts/docker.sh init`
   FAILED: `bash` resolved to WSL relay →
   `execvpe(/bin/bash) failed: No such file or directory`.
3. Re-staged `deerflow-config2.ps1/.bat` calling Git Bash by absolute path:
   `$gitBash='C:\Program Files\Git\bin\bash.exe'; & $gitBash ./scripts/docker.sh init`
   → `DOCKER_INIT_EXIT=0`, "Detected local sandbox mode — no Docker image required"
   BUT also WARNED "Docker daemon is not reachable" — exit 0 ≠ full success.
4. Docker Desktop engine wasn't up: `docker info` empty, `DESKTOP_PROC=NOT_RUNNING`.
   Launched Docker Desktop via `docker-launch.bat` (`Start-Process`). Engine took
   **minutes** to init; a 150s daemon-wait loop in `docker-start.ps1` timed out
   (`DAEMON_READY=NO`, skipped compose) — yet the compose stack **ended up running
   anyway** once the engine booted (Docker Desktop auto-restarts known compose
   stacks). Lesson: don't trust your own start-script's short timeout; verify the
   actual container state via the Docker Desktop window (next).

## Final verification (the winner: read the GUI window, not a terminal)

- `focus_app('Docker Desktop')` → "No on-screen window found" (tray app).
- Desktop `double_click` the 「Docker Desktop」 shortcut → Containers window opened.
- `capture(app='Docker Desktop', mode='som')` → AX tree showed the containers grid:
  - `deer-flow-nginx` `nginx:alpine` `127.0.0.1:2026:2026 (TCP)` ✓ running
  - `deer-flow-gateway` `deer-flow-dev-gateway` ✓ running (0.32% CPU, 29m)
  - `deer-flow-frontend` `deer-flow-dev-frontend` ✓ running (3.26%)
  - `deer-flow-redis` `redis:7-alpine` ✓ running (3.1%)
  - `Engine running` status text; compose-stack row has an `expand` control that
    reveals these sub-containers.
- `browser_navigate http://127.0.0.1:2026` → `ERR_EMPTY_RESPONSE` (not
  CONNECTION_REFUSED) — service accepting but not yet serving; re-check rather
  than declaring down.

## Pitfalls hit (all already distilled into SKILL.md body)

- `bash` = WSL launcher, not Git Bash (use absolute Git Bash path).
- `docker.sh init` exit 0 with daemon warning = diagnose the warning.
- MCP `search_files` returns "No matches" on files >~100 KB (`config.yaml`).
- Explorer content rows below the viewport: one `click` (UIA Invoke) navigates
  into the folder — no scrolling needed.
- `focus_app` on a tray app finds no window; wake it via its desktop shortcut.
- Container "running" ≠ HTTP-ready: verify health separately; `ERR_EMPTY_RESPONSE`
  is startup, `ERR_CONNECTION_REFUSED` is down.
