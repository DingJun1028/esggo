---
name: browser-extension-unpacked-load
description: Build and load a Chrome unpacked extension.
---
# Browser Extension — Unpacked Load

## Trigger
- Build & load a Chrome/Chromium extension from source (e.g. hermes-browser-extension).
- computer_use/cua-driver types into Chrome's address bar but the navigation fails / goes to a search or garbage URL.
- User reports "folder not found" when picking the extension directory in the file dialog.

## Build (what to load)
- Most extension repos build with `node scripts/build.mjs` (no `npm install` needed — self-contained, vendors dompurify).
- **Load target is `dist/`, NOT the repo root and NOT `extension/`.** `dist/` is gitignored, so it must be built.
- Verify `dist/manifest.json` exists and is `manifest_version: 3` before loading.

## Pitfall: cua-driver cannot reliably type into Chrome's omnibox
Symptom: typing `chrome://extensions` via computer_use lands in a web search box or a mangled URL (observed: `project/hermes-browser-extension/dist`, or DNS error for a path without scheme). Ctrl+L / Alt+D / F6 + type all fail in multi-tab Chrome — the keystrokes go to a page input instead of the omnibox.
**Do NOT loop on it.** Workarounds, in order of reliability:
1. **Flag launch (best):** have the user run on the Windows host:
   `Start-Process chrome -ArgumentList "--load-extension=C:\abs\path\to\dist"`
   Requires Chrome fully closed first, OR add `--new-window`. The flag is only read at browser-process startup.
2. **Manual drag-drop:** user drags the `dist` folder onto the `chrome://extensions` page (Dev mode on). cua-driver handles native drag poorly, so this is a user action.
3. **Manual picker:** user clicks "Load unpacked" and navigates the file dialog by clicking the folder tree (never typing the path).

## Pitfall: OneDrive Personal Vault / Files On-Demand hides the folder on the host
Symptom: sandbox (mounted OneDrive) sees `dist/` with all files, but the Windows host's file dialog says "Windows cannot find 'C:\Users\<user>\OneDrive\...\dist'".
Cause: the project lives under OneDrive **Personal Vault** (protected/delayed-unlock) or files are "online-only" placeholders — not materialized locally.
**Workaround:** copy the built `dist` to a non-OneDrive local path the host always sees:
`C:\Users\<user>\AppData\Local\Temp\hermes-dist` (or `C:\Temp\dist`), then load from there. From the sandbox: `cp -r <onedrive dist> "/c/Users/<user>/AppData/Local/Temp/hermes-dist"`.

## Verify
- `chrome://extensions` lists the extension with NO red manifest error.
- Side-panel icon appears; extension can reach the local gateway.

## Note on paths
- Windows user dir may be `dingj` or `ding` — read the actual error path, don't assume.
- Never prefix commands with the "at-url" chat convention — it breaks pasted commands. See `windows-powershell-script-handoff`.
