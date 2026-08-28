---
name: hermes-obsidian-plugin-build
description: Set up Hermes Obsidian plugin and fix Codex vault write.
version: 1.0.0
author: dingj
license: MIT
metadata:
  hermes:
    tags: [obsidian, hermes, plugin, codex, sandbox, vault]
    related_skills: [hermes-cli-ops, hermes-webui-windows-deploy]
---

# Hermes Agent Obsidian Plugin — Build, Install & Codex Vault-Write Fix

## When to Use
- Building or installing the "Hermes Agent" Obsidian plugin (id `hermes-agent`) from source or release.
- Obsidian agent reports "two read-only permission requests were rejected" or cannot read/write vault notes.
- Setting up the Hermes gateway + Obsidian integration, smart graph, or agent working folder.


# Hermes Agent Obsidian Plugin — Build, Install & Codex Vault-Write Fix

## Trigger
- User wants to build/install the "Hermes Agent" Obsidian plugin (id `hermes-agent`, author jsun2020).
- Agent in Obsidian reports "two read-only permission requests were rejected" or cannot read/write vault notes.
- User mentions Obsidian + Hermes gateway + file tools / working folder / smart graph.

## Prerequisites (Windows)
- Node.js installed (verify `node -v`, `npm -v`).
- Obsidian installed.
- Hermes Desktop run at least once (creates `~/.hermes`, generates `API_SERVER_KEY`), OR Hermes CLI with `hermes gateway` runnable.
- The build runs on the USER'S WINDOWS machine — NOT a Docker/Linux sandbox. esbuild emits a single `main.js` that Obsidian loads directly. If the agent's `terminal`/`execute_code` are Docker-backed and broken, drive Windows Terminal / PowerShell via `computer_use`, or have the user run the commands.

## Source (verified from repo main branch)
- Repo: https://github.com/jsun2020/hermes-agent-obsidian-plugin
- `manifest.json`: id `hermes-agent`, version `0.10.1`, `minAppVersion 1.7.2`, `isDesktopOnly: true`.
- `package.json` scripts (verified):
  - `npm run build` → `node esbuild.config.mjs production` → emits `main.js` next to `manifest.json` / `styles.css`
  - `npm test` → `npm run build:test && node --test` (protocol unit tests, Node built-in runner)
  - `npm run lint` → `eslint "src/**/*.ts"` (Obsidian community-review equivalent)
  - `npm run typecheck` → `tsc --noEmit`
- devDependencies: esbuild ^0.21.5, eslint ^9.39.4, typescript ^5.4.5, obsidian latest, @types/node ^20.11.0, typescript-eslint ^8.61.1.

## Build from source
```powershell
git clone https://github.com/jsun2020/hermes-agent-obsidian-plugin
cd hermes-agent-obsidian-plugin
npm install
npm run build      # produces main.js
npm test           # optional: protocol unit tests
npm run lint       # optional: lint
```
Note: example version tags in old docs (e.g. `0.8.3`) are stale; the manifest is `0.10.1`. Build commands themselves are correct.

## Install
Option A — Manual (after building or downloading a release):
Create a NEW folder (do NOT touch the existing `claudian` folder):
```
%USERPROFILE%\.obsidian\plugins\hermes-agent\
    main.js
    manifest.json
    styles.css
```
Then Obsidian → Settings → Community plugins → enable "Hermes Agent".

Option B — BRAT (recommended, no build needed):
1. Install BRAT community plugin, enable it.
2. Command: `BRAT: Add a beta plugin for testing`.
3. Paste repo URL: `https://github.com/jsun2020/hermes-agent-obsidian-plugin`
4. BRAT downloads the latest release and keeps it auto-updated; then enable under Community plugins.

## Configure the plugin (Settings → Hermes Agent)
- Gateway base URL: `http://127.0.0.1:8642` (named profiles use 8643–8742)
- API key: paste `API_SERVER_KEY` from `%USERPROFILE%\.hermes\.env`
- Model: e.g. `gpt-5.5`, or empty for gateway default
- Transport: Auto
- Agent workspace → Working folder: vault-relative folder (or absolute). Sent to gateway as run instructions; agent uses absolute paths under it.
- Click **Test connection** → expect "Connected. Transport: runs|chat. N model(s) available."

## Gateway must be running
- Easiest: open Hermes Desktop (auto-starts gateway). Key in `%USERPROFILE%\.hermes\.env` line `API_SERVER_KEY=...`.
- CLI only: add to `~/.hermes/config.yaml`:
  ```yaml
  platforms:
    api_server:
      enabled: true
      extra:
        port: 8642
        host: "127.0.0.1"
  ```
  Set `API_SERVER_KEY` in `~/.hermes/.env`, then `hermes gateway`. The TUI (`hermes` chat REPL) is NOT the gateway — run `hermes gateway` separately.
- Sanity check:
  ```powershell
  curl.exe -H "Authorization: Bearer $env:API_SERVER_KEY" http://127.0.0.1:8642/v1/models
  # JSON {"data":[...]} = OK; 401 = bad key; refused = gateway down
  ```

## Codex sandbox — let the agent read/write the vault (critical)
The gateway's `/v1/runs` has NO per-run cwd field, so with the gpt-5.5 / OpenAI-Codex provider the agent runs inside a Codex sandbox rooted at the gateway's launch dir, default **read-only**. Vault paths fall outside → escalations → auto-denied → "two read-only permission requests were rejected".

Fix in `~/.codex/config.toml` (gateway loads it at startup — RESTART Hermes Desktop after editing):
```toml
approval_policy = "never"
sandbox_mode = "workspace-write"

[sandbox_workspace_write]
writable_roots = ['C:\Users\you\Obsidian-vault']
network_access = true
```
This is the config equivalent of `codex exec -a never -s workspace-write`. The agent can then read anywhere, run commands, write into the vault.

### Windows caveat — CreateProcessWithLogonW failed: 1385
On locked-down / corporate Windows the Codex sandbox can't start (1385 = ERROR_LOGON_TYPE_NOT_GRANTED, account lacks "Log on as a batch job"). Both read-only and workspace-write need that sandbox, so they fail before startup. Only `danger-full-access` works there (no sandbox, no CreateProcessWithLogonW):
```toml
approval_policy = "never"
sandbox_mode = "danger-full-access"
```
Either grant the logon right via elevated `secedit` / `ntrights` (may be reverted by Group Policy), or use full-access. To revert, remove the added keys.

Turn OFF "Auto-approve tool requests" in plugin settings if you want plain tool-less chat (every tool request cancelled, run falls back to normal completion).

## Verification checklist
1. Hermes Desktop running → settings → Test connection → "Connected…".
2. Open panel, send "hello" → streamed reply under "Hermes".
3. Select text in a note → Send selection to Hermes → reply references it.
4. Stop button halts a mid-stream reply.
5. With gateway closed → clear "gateway unreachable" error.
6. (Vault write) Working folder set + auto-approve on + Codex config fixed → agent reads/writes under working folder without per-command prompts.

## Diagnose the "Test connection" result (real-world cases seen)
- **Green**: "Connected. Transport: runs|chat. N model(s) available." → done.
- **Red: "Reached the host but got no capabilities/models. Is the Hermes gateway started and the API key correct?"** → host `127.0.0.1:8642` IS reachable (so the gateway process is alive), but `/v1/capabilities` or `/v1/models` returned empty. In practice this means the **API key field still shows the placeholder `paste API_SERVER_KEY`** (not the real value), so the gateway rejects/empty-returns the unauthenticated probe. Fix: paste the real `API_SERVER_KEY` from `%USERPROFILE%\.hermes\.env` into Settings → Hermes Agent → API key, then click Test connection again.
- **Red: "Cannot reach the gateway" / connection refused** → gateway not running. Start Hermes Desktop or `hermes gateway`.
- **401/403** → key wrong/missing or mismatched profile. Re-paste `API_SERVER_KEY`.
- **Empty / non-200 from /v1/models** → older gateways may not expose it; chat still works, set model id manually.

### Where to find API_SERVER_KEY (do NOT paste the key into chat)
- File: `%USERPROFILE%\.hermes\.env` → line `API_SERVER_KEY=...`
- If missing: the gateway runs unauthenticated (history-load disabled) — either set it there, or check the gateway's startup terminal output.
- Verify the key without leaking it:
  ```powershell
  # just confirm the line EXISTS and is non-empty — do not echo the value into chat
  Select-String -Path "$env:USERPROFILE\.hermes\.env" -Pattern 'API_SERVER_KEY='
  # full sanity check (key stays local):
  curl.exe -H "Authorization: Bearer $env:API_SERVER_KEY" http://127.0.0.1:8642/v1/models
  ```

## Pitfalls
- Don't put the plugin in the `claudian` folder — separate folder `hermes-agent`.
- TUI ≠ gateway. `hermes` (chat) does not expose the HTTP API; use `hermes gateway`.
- Stale doc version tags (e.g. 0.8.3) — trust the manifest (0.10.1).
- Codex sandbox fix requires a gateway RESTART to take effect.
- `computer_use` cannot capture/drive the cua-driver authorization process itself; build via the user's own Windows Terminal / PowerShell.
- In this Hermes backend, `computer_use` capture returns an AX/SOM element list but NO `snapshot_id`/`element_token`, so `click`/`type` by element_index are refused ("bare element_index is not accepted; pass element_token, or snapshot_id together with element_index"). Workaround: drive the user's browser/terminal via the typed-browser or key routes, or have the user click/type. Don't loop on click.
- `Win+R` background key send is unverifiable on this backend; prefer having the user run commands, or use `computer_use` key with `delivery_mode:"foreground"` (still may not land). Build/verify through the user's own terminal.
- `web_extract` does NOT hit a bare localhost URL directly — it routes through a local Crawl4AI service (e.g. :11235). If that service is down, localhost fetches fail. Use it only for public URLs; for localhost health checks use the user's own `curl.exe`.
