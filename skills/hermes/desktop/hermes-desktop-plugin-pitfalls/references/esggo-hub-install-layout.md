# esggo-hub plugin — install layout & verification (2026-08-01)

Staging (inside the MCP-allowed dir, so the agent can read/verify everything):
`C:\Project\esggo-learning-center\esggo-hub-staging\` → install.ps1, plugin.js,
backend\manifest.json + backend\plugin_api.py, README.md.

## install.ps1 semantics (read the script before running — it's benign)
- `plugin.js` → ALWAYS copied to `%LOCALAPPDATA%\hermes\desktop-plugins\esggo-hub\plugin.js`
  (this is the reinstall / bug-fix target).
- Backend → copied to `%LOCALAPPDATA%\hermes\plugins\esggo-hub\dashboard\`
  (`manifest.json` + `plugin_api.py`) ONLY if missing, unless `-ForceBackend`.
- Config: `hermes config get plugins.enabled` → parse JSON array → append
  `'esggo-hub'` if absent → `hermes config set plugins.enabled <json>` (merge,
  never clobbers other plugins). `$ErrorActionPreference='Stop'`; a failing
  `hermes` CLI is caught and warns "Action needed: add 'esggo-hub' to
  plugins.enabled..." (script still exits 0).

## Post-install verification (the script's own "Next steps")
1. Restart the gateway: `hermes update --no-backup --yes` or restart the Hermes app.
2. Ctrl/Cmd+K → "Reload desktop plugins".
3. Verify: status-bar 'ESGGO' chip; right pane shows branch/commit; K → "Open
   ESGGO Hub" opens the page.
- If the backend didn't get enabled, the pane/page shows only 後端未啟用 /
  "backend not enabled" (no redirect) — a DIAGNOSTIC HINT, not a redirect bug.

## Executing from a restricted session (no terminal / execute_code)
The script header documents the one-liner:
`powershell -ExecutionPolicy Bypass -File "C:\Project\esggo-learning-center\esggo-hub-staging\install.ps1"`

For verifiable relay, wrap it in `go.bat` in the same staging dir:
```
@echo off
cd /d "C:\Project\esggo-learning-center\esggo-hub-staging"
powershell -NoProfile -ExecutionPolicy Bypass -File "install.ps1" > install.log 2>&1
echo EXITCODE=%ERRORLEVEL% >> install.log
pause
```
User double-clicks it → agent reads `install.log` back with file tools and
verifies the `[ok] plugin.js -> ...` / `[ok] plugins.enabled = [...]` lines and
`EXITCODE=0`. Artifact is the proof, not the user's word. (Full playbook:
`windows-desktop-automation`.)

## Desktop-automation attempts this session (all failed → handed off the .bat)
- `win+r` / `win+e` each returned "✅ Sent … via SendInput" but NO Run dialog /
  Explorer window appeared (`list_windows` confirmed) — win modifier dropped
  even via foreground delivery.
- cua-driver session died mid-flow: `session 'hermes-b64eed480edd' has ended;
  Call start_session …` — no `start_session` tool exposed to the agent; only an
  app restart revives it (or `hermes computer-use doctor`).
- `run_install.py` (subprocess → powershell) was staged but cron REJECTED the
  absolute script path: "Script path must be relative to ~/.hermes/scripts/" —
  cron is NOT a local-execution channel for project dirs; don't burn time on it.
