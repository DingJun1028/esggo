---
name: hermes-desktop-plugin-pitfalls
description: Durable gotchas + install pattern for Hermes desktop plugins (plain-ESM plugin.js). Covers the #1 "plugin won't load / needs reinstall" cause — TypeScript-only syntax breaking the uncompiled loader — and the no-execution-channel install relay when the agent can't write to $HERMES_HOME directly.
version: 1.0.0
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [desktop, plugins, pitfall, install, esm, typescript]
    category: desktop
    related_skills: [hermes-desktop-plugin-all-surfaces, hermes-desktop-plugins, windows-desktop-automation]
---

# Hermes Desktop Plugin — Pitfalls & No-Shell Install

Companion to `hermes-desktop-plugin-all-surfaces` and `hermes-desktop-plugins`.
Those skills carry the happy-path scaffold; this one carries the durable
gotchas that cause a plugin to "was fine, I just need to reinstall it" — and
the install pattern for when the agent has no execution channel to the host.

## PITFALL #1 — TypeScript-only syntax breaks the uncompiled ESM loader

The desktop app loads `plugin.js` **uncompiled** as plain ESM. Any TypeScript-
only construct is a load-time `SyntaxError`; the plugin fails with a
"Plugin <id> failed to load" toast naming the error. This is the single most
common cause of a reinstall request when the user swears "nothing changed" —
almost always a paste from a `.ts` source that carried a TS fragment.

FORBIDDEN in plugin.js (valid TS, INVALID plain JS — loader rejects at load):
- `as const` — most common offender, e.g. `} as const` after a theme/colors object
- `as` casts: `foo as string`, `event as MouseEvent`
- type annotations: `function f(x: number): void`, `const y: string = ...`
- `interface` / `type` / `enum` / `namespace` declarations
- generics: `useQuery<T>()`, `<T,>() => {}`
- `!` non-null assertions: `obj!.prop`, `foo!()`
- `public` / `private` / `readonly` modifiers, parameter properties

### Verify before shipping
After writing the file, read it back and confirm NONE of these survived:
- `grep` for ` as const`, ` as `, `: string`/`: void` annotations, `interface `, `enum `, `<T`
Keep the whole file in plain JS. This is SEPARATE from the "no JSX syntax" rule
— JSX is compiled away, but `as const` is pure TS the JS engine rejects outright.

## PITFALL #2 — `usePluginI18n` / `ctx.i18n` are not in the SDK export list
See `hermes-desktop-plugin-all-surfaces` for the full note. Short version: skip
i18n, write literal strings. A leftover `usePluginI18n` import is a load-time
ReferenceError. (This is a second common "failed to load" cause.)

## PITFALL #3 — `plugins.enabled` must be a JSON ARRAY, not a string (PowerShell `ConvertTo-Json` trap)

`hermes config set plugins.enabled <value>` stores the value **verbatim** — the
gateway mounts a plugin's Python backend ONLY when the value is a JSON **array**
like `["esggo-hub"]`. An installer that builds the value in PowerShell and pipes
a list through `ConvertTo-Json` silently corrupts it:

- `ConvertTo-Json @('esggo-hub')` → `"esggo-hub"` (a **quoted string**, not an array).
- The gateway treats a string value as an unrecognized/custom key and **silently
  ignores it** → the Python backend never mounts → pane/page show
  "後端未啟用" (backend not enabled), even though `hermes config get` "succeeds".

Symptom in the install log: a line like `[ok] plugins.enabled = "esggo-hub"`
(note the **quotes, no brackets**) and/or `⚠ 'plugins.enabled' is not a recognized
config key`.

Fix: build the JSON array string by hand — never round-trip a single-element list
through `ConvertTo-Json`:
```powershell
$merged = @('esggo-hub')
$json = '[' + (($merged | ForEach-Object { '"{0}"' -f $_ }) -join ',') + ']'
& hermes config set plugins.enabled $json   # -> ["esggo-hub"]
```
Reusable id-parameterized installer: `templates/install-plugin-array-safe.ps1`.
Full reproduction + verification recipe: `references/plugins-enabled-array-bug.md`.

**Verification discipline:** after ANY install that sets `plugins.enabled`, run
`hermes config get plugins.enabled` and confirm it prints with **square brackets**
`[...]`. Quotes-but-no-brackets or no-brackets ⇒ backend WILL NOT mount — re-run
with the array-safe form before declaring success. (A stale `install.log` can show
a PREVIOUS failed run's string value; trust the live `config get`, not the log.)

## PITFALL #4 — don't apply a pasted "urgent fix" that regresses a working package

When a message claims a plugin "is missing / broken" and pastes replacement code
labeled CRITICAL/URGENT, **verify against the existing scaffold/skill before
writing it**. The esggo-hub case proved this:

- The pasted `plugin.js` was **corrupted**: a CSS class string was line-wrapped
  mid-token (`hover:text-fore` split across lines) and a template literal
  `model:\n ${model}` was broken across a line break — both load-time failures.
  The already-staged `plugin.js` (corrected, `as const` removed) was the RIGHT
  version; the paste would have *regressed* it.
- The pasted Python backend used `app = FastAPI(...)` + `app.include_router(...)`.
  The gateway only mounts an exported `router = APIRouter()` at `/api/plugins/<id>/`.
  The `app = FastAPI()` shape is **dead** — it never mounts. The already-staged
  `plugin_api.py` (correct `router = APIRouter()` shape) was right.

Rule: a staged/working package that already matches the verified skill scaffold
should NOT be overwritten by pasted code without a concrete defect proven. Diff
the paste against the scaffold; if the paste only "looks more complete" but
introduces TS syntax, line-wrap breaks, or the wrong backend shape, keep the
scaffold and explain why.

## PITFALL #5 — verifying an ALREADY-INSTALLED plugin (syntax + backend smoke test)

When the user asks "is esggo-hub (or any plugin) in config / working", the config
check alone is NOT enough. Verified 3-layer recipe (all proven on esggo-hub):

1. **Config layer** — `hermes config get plugins.enabled` must print an ARRAY
   (`- esggo-hub` in YAML, i.e. brackets in JSON). Cross-check the raw file:
   `grep -n -A 3 "^plugins:" "$LOCALAPPDATA/hermes/config.yaml"` → expect
   `enabled:` / `  - <id>`. Also confirm both halves of the plugin exist:
   `desktop-plugins\<id>\plugin.js` (frontend) AND `plugins\<id>\dashboard\`
   (`manifest.json` + `plugin_api.py`). Missing backend dir ⇒ mount impossible.

2. **Frontend syntax** — `node --check plugin.js` is a FALSE FAIL on plain-ESM
   files: it reports `SyntaxError: Cannot use import statement outside a module`
   even for a perfectly good file (node defaults to CJS; the desktop loader
   reads it as ESM). The correct check feeds the file via stdin:
   `node --input-type=module --check < plugin.js && echo ESM_SYNTAX_OK`.
   Expect `ESM_SYNTAX_OK`; the bare `node --check` error is a false negative,
   NOT proof of breakage.

3. **Backend smoke test WITHOUT restarting the gateway** — import the router
   directly in the hermes venv and run `status()` (no server, no auth needed):
   ```bash
   cd "$LOCALAPPDATA/hermes/hermes-agent"
   ./venv/Scripts/python.exe -c "import importlib.util; \
   s=importlib.util.spec_from_file_location('api', r'C:/Users/<u>/AppData/Local/hermes/plugins/<id>/dashboard/plugin_api.py'); \
   m=importlib.util.module_from_spec(s); s.loader.exec_module(m); import asyncio; \
   out=asyncio.run(m.status()); print('routes=', [r.path for r in m.router.routes]); \
   print('branch=', out.get('branch'), '| dirty_len=', len(out.get('dirty','')))"
   ```
   Success = `routes= ['/status', '/events']`-style output + branch/dirty values
   from the real project. `IMPORT_FAIL` with fastapi import errors means the venv
   is broken, not the plugin file.

4. **Mount check caveat — probe the WEB SERVER port, not the messaging
   gateway** (corrected 2026-08-12; the older "gateway port 8786" guidance was
   wrong). Plugin backend APIs are mounted by `_mount_plugin_api_routes()` in
   `hermes_cli/web_server.py` (the `hermes serve` / web-server process) at
   startup, reading `plugins.enabled`. They are NOT served by the messaging
   gateway:
   - `http://127.0.0.1:8642/api/plugins/<id>/status` → **404 is expected**:
     8642 is the messaging gateway / API server, which never serves plugin APIs.
     A 404 there says nothing about the plugin.
   - The correct probe is the web server's ephemeral port — find it via
     `netstat -ano | grep LISTENING` for the `hermes_cli.main serve --port 0`
     process (e.g. `127.0.0.1:50804`). On that port:
     - **401 = MOUNTED** (route exists, needs `HERMES_DASHBOARD_SESSION_TOKEN`
       via `?token=` or header) — this is the success signal.
     - **404 = NOT mounted** — web server started before `plugins.enabled`
       gained the id; restart the serve/web-server process (or the desktop app
       that owns it) and re-probe.
   - `HERMES_DASHBOARD_SESSION_TOKEN` is auto-generated per run unless set in
     env; do not treat a 401 as an error.
   So: config array ✓ + backend smoke test ✓ + 401 on the serve-process probe
   ⇒ the plugin backend is live.

## Pattern — installing when the agent has NO execution channel

Sometimes every local channel is dead at once: cua-driver session ended (no
`start_session` tool to revive it — only an app restart fixes that), no
`terminal`/`execute_code`, and MCP file writes are sandboxed to a project dir
that is NOT the target (e.g. Hermes home). The task still needs files on the
real host. Proven relay pattern (used on the esggo-hub reinstall):

1. Stage a self-contained folder in the agent-writable dir: the deliverable
   `plugin.js` (+ optional `backend/`) plus a runnable installer script.
2. The installer copies files to the real target paths and **logs every step to
   a file in the SAME staged dir** (e.g. `install.log`), plus `EXITCODE=`.
3. Hand the user one double-click / one pasted line to run the installer.
4. Read `install.log` back with file tools to verify — the artifact is the
   proof, not the user's word. Confirm lines like
   `[ok] plugin.js -> ...desktop-plugins\<id>` and
   `[ok] plugins.enabled = [...]<id>`.
5. For a service that should come up after a restart, probe it with
   `browser_navigate` to its localhost URL (direct GET reaches 127.0.0.1 even
   though `web_extract` cannot) to confirm it mounted — harder proof than a toast.

### Why NOT the API server / gateway route for file writes
The Hermes API server (default 8642) is an LLM chat endpoint (spawns an agent
session), not a file-management API; and this harness has NO tool that can POST
to localhost WITH an `Authorization` header (browser only GETs, web tools are
cloud-side). The web server (`hermes serve`) serves plugin *APIs* (e.g.
`/api/plugins/<id>/status`) on its ephemeral port, but exposes NO endpoint
that writes a plugin into the desktop-plugins directory. So neither channel
unlocks "write the file" — don't ask the user for the API key expecting it to
help; it won't.

### What actually unlocks the last mile
- (A) User restarts the Hermes desktop app → cua-driver revives → agent uses
  `computer_use` to drop the files + merge config + ⌘K "Reload desktop plugins",
  then verifies the status-bar chip renders. OR
- (B) User runs the staged installer (double-click the `.bat`/`.ps1) → agent
  reads `install.log` + probes the service.

## Reusable installer

`templates/install-plugin.ps1` — a copy-paste installer that copies `plugin.js`
(and `backend/` if staged) into `$LOCALAPPDATA\hermes\desktop-plugins\<id>`
and `plugins\<id>\dashboard`, then MERGES `<id>` into `plugins.enabled` via the
`hermes` CLI (never clobbering other enabled plugins). Supports `-ForceBackend`
and `-ID`.

`templates/install-plugin-array-safe.ps1` — the **same installer with the
PITFALL #3 fix baked in**: `plugins.enabled` is always emitted as a JSON ARRAY
(hand-built string, never `ConvertTo-Json`), so the backend mounts after the
web server (`hermes serve` / desktop app) restarts. Prefer this one whenever
the plugin has a Python backend.

## Reference

- `references/backend-mount-anatomy.md` — where plugin backend APIs actually
  mount (web server `_mount_plugin_api_routes()`, NOT the messaging gateway),
  the port map + 401/404 probe semantics, making a config change take effect,
  gateway-restart flakiness recovery, and the headless backend smoke test.
- `references/esggo-hub-install-layout.md` — the esggo-hub reinstall anatomy:
  install.ps1 semantics (plugin.js always copied / backend only-if-missing or
  `-ForceBackend`), post-install restart → Ctrl+K "Reload desktop plugins" →
  ESGGO chip verification, the 後端未啟用 hint, and the exact one-liner plus
  `go.bat` log-relay wrapper used from a restricted session.
