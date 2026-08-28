# Hermes plugin backend mount anatomy (verified 2026-08-12, esggo-hub)

## Where plugin backend APIs actually mount

`hermes_cli/web_server.py:17420 _mount_plugin_api_routes()` — NOT the
messaging gateway. The web server (`hermes serve`) iterates
`_get_dashboard_plugins()`, and for each plugin with `_api_file` that is in
`plugins.enabled` (and not in `plugins.disabled`), imports the Python file and
calls:

    app.include_router(router, prefix=f"/api/plugins/{plugin['name']}")

- user-source plugins: mount ONLY if id is in `plugins.enabled` (security
  gate GHSA-mcfc-hc25-cjv7 / #46435). Bundled plugins always mount unless
  explicitly disabled.
- project plugins (`./.hermes/plugins/`) NEVER auto-import Python (GHSA-5qr3
  -c538-wm9j) — their `api` file is skipped with a warning.
- The routing gate `_plugin_api_runtime_gate` (web_server.py:569) also blocks
  requests at runtime for disabled plugins.

## Port map (Windows, v0.20.0)

| Port | Process | Serves plugin APIs? |
|------|---------|---------------------|
| 8642 | messaging gateway (`hermes_cli.main gateway run --replace`) | NO — 404 expected |
| ephemeral (e.g. 50804) | web server (`hermes_cli.main serve --port 0`) | YES — 401 = mounted |

Find the web-server port:

    netstat -ano | grep LISTENING | grep 127.0.0.1
    # cross-ref PID with: powershell "(Get-CimInstance Win32_Process -Filter 'ProcessId=<pid>').CommandLine"
    # look for 'serve --port 0' (there may be many: one per desktop session/profile)

Probe semantics on the web-server port:

    curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:<port>/api/plugins/esggo-hub/status
    # 401 = route exists, needs HERMES_DASHBOARD_SESSION_TOKEN (auto-generated per run unless env-set)
    # 404 = not mounted (web server started before plugins.enabled gained the id)

## Making a config change take effect

- After `hermes config set plugins.enabled '[...]'`, the backend mounts only
  after the WEB SERVER (serve) process restarts — for the desktop app that
  means restarting the app / reloading; for a headless serve, kill and
  re-run `hermes serve`. The messaging gateway restart does NOT mount plugin
  APIs.
- The old "gateway port 8786" guidance was wrong for v0.20.0; 8786 did not
  exist on this host.

## Gateway restart flakiness (environment note)

`hermes gateway restart` can hang with empty output when a previous
`hermes update` left an interrupted-install marker (venv pyyaml METADATA
damaged + hermes.exe locked by a running instance). The restart may kill the
old gateway (8642 goes connection-refused) without bringing up the new one.
Recovery used this session: relaunch the gateway in the background from the
hermes-agent dir:

    cd "$LOCALAPPDATA/hermes/hermes-agent"
    ./venv/Scripts/python.exe -m hermes_cli.main gateway run --replace

then poll `netstat` for 8642 LISTENING and curl `/v1/capabilities` (expect the
gateway_auth_error JSON — that means the API is up). Startup logs show benign
warnings (bluebubbles missing env, relay no adapter, Telegram DNS probing);
wait through them.

## Backend smoke test without any server

Headless import of the router in the hermes venv (no auth, no server):

    cd "$LOCALAPPDATA/hermes/hermes-agent"
    ./venv/Scripts/python.exe -c "import importlib.util,sys; s=importlib.util.spec_from_file_location('api', r'C:/Users/<u>/AppData/Local/hermes/plugins/<id>/dashboard/plugin_api.py'); m=importlib.util.module_from_spec(s); s.loader.exec_module(m); import asyncio; out=asyncio.run(m.status()); print('routes=', [r.path for r in m.router.routes]); print('branch=', out.get('branch'), '| dirty_len=', len(out.get('dirty','')))"

NOTE: use an absolute Windows path (`C:/Users/...`), NOT `~/.hermes/...`
(raw strings do not expand `~`). MSYS paths like `/c/Users/...` also fail
inside Windows python — it prefixes them as `C:\c\Users\...`.

## Query-param token caveat

`_SESSION_TOKEN = _resolve_session_token()` (web_server.py:331) reads
`HERMES_DASHBOARD_SESSION_TOKEN` env or generates a fresh random token per
process run. To probe with auth: `?token=<value>` or an Authorization header.
A 401 is the SUCCESS signal for "route exists"; don't chase it as an error.
