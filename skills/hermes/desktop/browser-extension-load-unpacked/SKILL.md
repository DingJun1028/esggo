---
name: browser-extension-load-unpacked
description: Use when loading a Chrome MV3 extension from a source repo.
---

# Browser Extension — Load Unpacked from Source

## When to use
- User says "install this browser extension" and points at a GitHub repo (or local folder) of a Chrome/Edge/Chromium extension, and wants it usable in their browser.
- You cloned a Chrome extension repo and must get it "Load unpacked" in the user's Chrome/Edge.

## Core workflow
1. Clone the repo (or use the local path).
2. **Find the loadable folder — do NOT assume the repo root or an `extension/` subfolder is what Chrome loads.** Inspect in this order:
   - `manifest.json` at repo root: check `background.service_worker`, `action.default_icon`, `side_panel.default_path` paths. If they reference `extension/...`, the root manifest is for a *different* layout and the root itself is usually NOT the unpacked target.
   - `extension/manifest.json`: if it uses **bare** paths (`background.js`, `sidepanel.html`), that folder is loadable.
   - `.gitignore`: if `dist/` is ignored, the loadable artifact is *generated*, not committed — you MUST build.
   - `package.json` `scripts`: look for `build`, `build:*` (e.g. `node scripts/build.mjs`). The build copies/transforms source → `dist/`.
3. **Build if needed:** `node scripts/build.mjs` (or the repo's build script). Many repos need ONLY Node (built-ins + a vendored dep like `dompurify` at `extension/lib/vendor/`); `npm install` is often NOT required. Verify `dist/manifest.json` exists and uses bare paths.
4. **Load the correct folder** in Chrome: `chrome://extensions` → enable Developer mode → "Load unpacked" → select the built folder (e.g. `dist/`, NOT `extension/`, NOT repo root).
5. **Verify:** confirm every `manifest.json`-referenced file exists in the loaded folder (`background.js`, `sidepanel.html`, icons, `_locales`). A missing file = load error.

## computer_use / cua-driver caveat (IMPORTANT)
Typing a `chrome://` URL into Chrome's omnibox via `computer_use` is **unreliable in multi-tab sessions**: cua-driver routes keystrokes into a page search box, so the address bar ends up `google.com/search?q=chrome%3A%2F%2Fextensions` and never navigates. Confirmed failing across Ctrl+L, Alt+D, F6, Ctrl+T+type, even with `delivery_mode:"foreground"`.

**Working workarounds** (detail in `references/omnibox-workaround.md`):
- Launch directly from Windows: `Start-Process chrome -ArgumentList '--new-window','chrome://extensions'` (run on the user's Windows host — the sandbox Linux container cannot call `cmd.exe`/`powershell.exe`).
- OR drive the native "Load unpacked" **file dialog** directly (cua-driver handles native file pickers far more reliably than the omnibox). Ask the user to open `chrome://extensions` and screenshot it; then you click "Load unpacked" and navigate the file dialog to the built folder.

## Verification
- After build: `test -f dist/manifest.json && node -e "JSON.parse(require('fs').readFileSync('dist/manifest.json'))"` — must parse, `manifest_version: 3`.
- Grep the manifest's referenced paths and `test -f` each one.
- For secret scan before any public push: `grep -rEn 'ghp_|github_pat_|AKIA[0-9A-Z]{16}|sk-|xox|eyJ[A-Za-z0-9_-]{10,}\.' .` — no real secret values should appear (regex SOURCE code and test fixtures are fine).

## Concrete example
Repo `DingJun1028/hermes-browser-extension`: official flow runs `node scripts/build.mjs` → builds `extension/` into `dist/`; loads `dist/` (gitignored). Root `manifest.json` references `extension/...` paths so the root is NOT loadable. No `npm install` needed (vendored `dompurify` at `extension/lib/vendor/purify.es.mjs`).
