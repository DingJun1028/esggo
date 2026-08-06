# ESGGO Hub - Hermes desktop plugin install package

This folder is the verified, complete install package staged by the Hermes agent.
Constraint: this session has no shell channel and the MCP file tools can only write
into C:/Project/esggo-learning-center, so files cannot be dropped directly into
Hermes home (C:/Users/dingj/AppData/Local/hermes). Run install.ps1 locally to finish.

## Files
- plugin.js - frontend plugin (chip, right pane, command palette, full page + sidebar nav + keybind + theme). Already corrected: removed the trailing `as const` that caused a load-time SyntaxError in the uncompiled ESM loader.
- backend/manifest.json - backend mount manifest.
- backend/plugin_api.py - Python backend exposing GET /api/plugins/esggo-hub/status and WS /events. Uses the correct `router = APIRouter()` shape (the gateway mounts `router`, not `app`).
- install.ps1 - one-click installer (copy files + merge enable setting).

## Why the previous run failed (now fixed)
The old install.ps1 used PowerShell ConvertTo-Json, which serialized the single-element list as the JSON STRING "esggo-hub" instead of the ARRAY ["esggo-hub"]. A string value is silently ignored by the gateway, so the backend never mounted and the pane showed the backend-not-enabled hint. The new install.ps1 builds the JSON array string by hand, guaranteeing ["esggo-hub"].

## Install (run locally)
powershell -ExecutionPolicy Bypass -File "C:/Project/esggo-learning-center/esggo-hub-staging/install.ps1"

Then restart the gateway (hermes update --no-backup --yes or reopen the app) and Ctrl/Cmd+K -> Reload desktop plugins.

## Verify
- Status bar shows the ESGGO chip (click for a toast).
- Right pane shows branch / commit / status / dist / src count (backend now enabled).
- Ctrl/Cmd+K -> Open ESGGO Hub opens the page; page title bar has a copy-homework-link button.
- mod+shift+r refreshes.
- If the backend still shows not-enabled: check `hermes config get plugins.enabled` returns ["esggo-hub"] (an array, not a string).
