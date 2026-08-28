---
name: hermes-agent-obsidian-plugin
description: Hermes Obsidian plugin setup; codex fix needs OpenAI-Codex.
---

# Hermes Agent — Obsidian plugin

## When to use
- User wants to chat with their local Hermes Agent from inside Obsidian.
- User wants the agent to read/write/search their vault via the plugin's "agent workspace".
- User pastes the plugin README (`jsun2020/hermes-agent-obsidian-plugin`) and asks to set it up, build it, configure the gateway, or fix the message "two read-only permission requests were rejected".

## How it works (brief)
- Hermes Desktop runs a local gateway, default `http://127.0.0.1:8642`.
- Plugin capability-detects via `GET /v1/capabilities`, then uses the **Runs** transport (`POST /v1/runs` + `GET /v1/runs/{id}/events`, gives tool/reasoning/usage events) or **Chat Completions** (`POST /v1/chat/completions`, OpenAI-compatible, streaming) as fallback.
- Auth: `Authorization: Bearer <API_SERVER_KEY>` from `%USERPROFILE%\.hermes\.env` (line `API_SERVER_KEY=...`).
- This plugin is SEPARATE from the Claudian plugin — never touch the `claudian` folder.

## Install — check first, usually already done
- On dingj's machine the plugin is already installed via BRAT (v0.10.1, author Jason) into `<vault>/.obsidian/plugins/hermes-agent/`. Confirm presence before building from source — a source build is only needed if you intend to MODIFY the plugin.
- BRAT: install BRAT community plugin → command `BRAT: Add a beta plugin for testing` → paste `https://github.com/jsun2020/hermes-agent-obsidian-plugin`. BRAT auto-updates.
- Manual: copy `main.js` + `manifest.json` + `styles.css` from the latest GitHub release into `<vault>/.obsidian/plugins/hermes-agent/`.
- Build (only if modifying): `npm install && npm run build` (emits `main.js`); `npm test` = protocol unit tests; `npm run lint` = Obsidian community-review lint.

## CRITICAL GOTCHA — file read/write depends on the PROVIDER
The plugin README's "Filesystem access & the Codex sandbox" section instructs you to add to `~/.codex/config.toml`:
```toml
approval_policy = "never"
sandbox_mode = "workspace-write"
[sandbox_workspace_write]
writable_roots = ['C:\Users\you\Obsidian-vault']
network_access = true
```
**This fix ONLY applies when the gateway uses the OpenAI-Codex provider (model `gpt-5.5`).** The gateway drives Codex via `~/.codex/config.toml` ONLY on that provider.

For ANY other provider (e.g. `tencent/hy3:free` / nous, or local Ollama), the agent does NOT run inside a Codex sandbox, so editing `~/.codex/config.toml` is a **NO-OP** — the "two read-only permission requests were rejected" symptom will NOT be fixed by it. File access then depends on the gateway process's own permissions and launch directory, not the codex sandbox.

**Therefore: verify the gateway provider BEFORE applying the codex fix.**
- Read `~/.hermes/config.yaml` → `model.default` (and the active profile's model).
- If it is NOT `gpt-5.5` / OpenAI-Codex, do NOT edit `~/.codex/config.toml`. Instead tell the user the documented codex fix does not apply to their provider, and suggest the no-config alternative: use the plugin's **current note / selection** context toggles (with "Include full note content" on), or paste the notes into the message.

Full reasoning + the Windows `CreateProcessWithLogonW failed: 1385` caveat: `references/provider-compatibility.md`.

## Verify the gateway is up (before configuring the plugin)
The gateway is a Windows-HOST process. The Docker-sandbox terminal CANNOT reach it, and background `computer_use` global hotkeys (Win+R / Win+X / Win) are unreliable for opening a host terminal — ask the user to open PowerShell themselves if needed. Then from the HOST PowerShell:
```powershell
curl.exe -H "Authorization: Bearer $env:API_SERVER_KEY" http://127.0.0.1:8642/v1/models
```
- JSON `{ "data": [ ... ] }` → reachable, key works.
- `401` → wrong/missing key.
- connection refused → gateway not running (launch Hermes Desktop, which auto-starts it; or `hermes gateway` on a CLI/TUI install).

### VPS / Docker deployment (different gateway API surface)
On the VPS, the Hermes WebUI runs as a Docker container (`hermes-webui-hermes-webui-1`) with an **embedded gateway** on port 8642. Unlike the local CLI gateway, the VPS gateway uses custom endpoints:
```
GET  /health    — health check
GET  /models    — list models (requires auth)
GET  /status    — gateway status (requires auth)
GET  /skills    — list skills (requires auth)
POST /exec      — execute skill (requires auth)
```
**Pitfall**: The VPS gateway API key is NOT stored in `~/.hermes/config.yaml` or the container env. It is auto-generated on first container startup and embedded in the server process. The vault key (`API_SERVER_KEY` in `secret-vault/ENV*.env`) works for **local** Hermes gateway, NOT the VPS container gateway.

**Recommended approach**: Configure the Obsidian plugin to connect to the **local** gateway (`http://127.0.0.1:8642`) for direct vault editing, and use Cloudflare Tunnel (`hermex.esggo.co:8642`) only when the local gateway is unavailable.

## Configure (Settings → Hermes Agent)
- Gateway base URL: `http://127.0.0.1:8642` (named profiles bind 8643–8742).
- API key: paste `API_SERVER_KEY`.
- Model: e.g. `gpt-5.5`, or empty for the gateway default. Use **Test connection** to list models.
- Transport: Auto (recommended).
- Agent workspace → Working folder: folder the agent operates in, relative to vault root (or absolute path). The plugin sends this to the gateway as the run's instructions (the gateway has NO cwd field on the API path).
- Auto-approve tool requests (default on): lets the agent use file/terminal tools without prompting; off → plain tool-less replies.

## Pitfalls
- The plugin sends `cwd` on every run, but `/v1/runs` exposes NO per-run working-directory field — so the agent's sandbox (when Codex) is NOT rooted at the vault. The agent must use absolute paths under the working folder; treat that folder as "the current directory".
- Windows corporate lock-down: `sandbox_mode = "workspace-write"` AND `read-only` can fail with `CreateProcessWithLogonW failed: 1385` (account lacks "Log on as a batch job"). Only `sandbox_mode = "danger-full-access"` works there. See references.
- History is saved to `<plugin>/.obsidian/plugins/hermes-agent/history.json` (not `data.json`), so the API key stays isolated. Newest 100 conversations kept.
- Smart graph: needs the gateway reachable + a model configured; results cached to `graph-cache.json`.

## References
- `references/provider-compatibility.md` — full codex/provider reasoning, Windows sandbox caveats, and doc excerpts.
