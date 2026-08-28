---
name: chrome-extension-unpacked-install
category: software-development
description: Build and load a Chrome MV3 extension via Load unpacked.
tags: [chrome, chromium, edge, mv3, browser-extension, load-unpacked, manifest-v3, dev-mode]
---

# Chrome MV3 Extension — Build & Load Unpacked

## When to use
- User says "install this browser extension from GitHub", "load unpacked", "use it in Chrome/Edge", or pastes a `github.com/.../*.git` for a browser extension.
- You cloned an MV3 extension repo and need to get it running in Chrome/Edge.
- A previous "half install" left Chrome unable to load it (missing background.js / manifest errors).

## The #1 pitfall (read first)
Many MV3 extension repos are **source trees**, not directly loadable. They require a **build step** that copies/compiles `extension/` → a build output folder (commonly `dist/`). That output folder is almost always listed in `.gitignore`, so:
- A fresh `git clone` does **NOT** contain it.
- Loading the **repo root** or the `extension/` subfolder fails (manifest path mismatches: root manifest references `extension/...`; extension/manifest references bare paths; only `dist/` has the right manifest + flat layout).
- You MUST run the build first. Chrome then loads the **`dist/`** folder.

> Rule of thumb: if the repo has `scripts/build.mjs` / `package.json` `build` script and a `dist/` in `.gitignore`, build it and load `dist/`.

## Steps (verified on hermes-browser-extension)
1. **Clone** (if not present):
   ```bash
   git clone https://github.com/DingJun1028/hermes-browser-extension.git
   cd hermes-browser-extension
   ```
2. **Inspect layout** — confirm which folder is loadable:
   - Root `manifest.json`: references `extension/background.js`, `extension/sidepanel.html` (paths include `extension/`).
   - `extension/manifest.json`: bare paths (`background.js`, `sidepanel.html`).
   - The **built** `dist/manifest.json` matches `extension/manifest.json` (bare paths) AND contains every referenced file. → `dist/` is the load target.
3. **Build** (no `npm install` needed for this repo — uses only Node built-ins + a vendored `dompurify` under `extension/lib/vendor/`):
   ```bash
   node --version          # needs >=20 (repo engines); v20+ OK
   node scripts/build.mjs
   # → "Built unpacked extension: <repo>/dist"
   # → also stamps build-info.json
   ```
   - `build.mjs` regenerates `extension/content-extractor.js` from `.mjs` source modules, runs a self-contained check, then copies `extension/` → `dist/`.
   - If you see `content-extractor.js is missing or stale`, run `npm run build:content-runtime` (same as `node scripts/build.mjs`).
4. **Verify the build** before loading:
   ```bash
   node -e "const m=require('./dist/manifest.json'); console.log(m.manifest_version, m.background, m.side_panel)"
   ls dist/background.js dist/sidepanel.html dist/content.js
   ```
5. **Load unpacked in Chrome/Edge**:
   - Open `chrome://extensions` (or `edge://extensions`).
   - Toggle **Developer mode** ON (top-right).
   - Click **Load unpacked** → select the **`dist/`** folder (NOT repo root, NOT `extension/`).
   - Windows path for this repo (OneDrive-synced):
     `C:\Users\dingj\OneDrive\Documents\Default Project\hermes-browser-extension\dist`
   - The extension appears as "Hermes Browser Extension" (v0.2.0). Pin it; use `Alt+H` / `Ctrl+Shift+H`.
6. **API key (this extension only)**: copy `API_SERVER_KEY` from `%USERPROFILE%\.hermes\.env` into the extension's settings → Test connection. (Run the included `Copy_Hermes_Browser_API_Key.cmd` or paste manually.)

## Driving the Load step with computer_use
- Capture Chrome with `computer_use(action='capture', app='Chrome', mode='som')`.
- Address bar clicks need a **snapshot token** — element-index alone is refused. Click the address bar by **coordinate** (e.g. native bounds center ≈ 531,24) then type the URL.
- After `Load unpacked`, the folder picker is a native OS dialog (background input may not land in it) — prefer foreground or let the user pick the folder manually if it won't take input.

## Verification
- Chrome shows the extension with no "Error" badge; click **Inspect views → service worker** opens without console errors.
- `dist/manifest.json` parses and every `background`/`side_panel`/content-script file exists in `dist/`.

## Pitfalls / gotchas
- **Never load the repo root.** Root `manifest.json` points at `extension/...` paths; `dist/` is the only self-consistent flat build.
- **`dist/` is gitignored** → it will NOT exist after a clean clone. Building is mandatory, not optional.
- **No `npm install` for this repo** — `npm ci` would pull eslint/web-ext (dev only) but the build itself needs none of them. Don't block on a failed `npm install`.
- **Self-contained check fails** if any `extension/` file references an `http(s)://` script or dynamic import — repo is CSP `'self'` only; vendored deps live under `extension/lib/vendor/`.
- **OneDrive path quirk in sandbox**: the Docker terminal sees `/c/Users/dingj/...` and may report a resolved path like `\\c\\Users\\dingj\\...` "outside workspace" — that warning is just the Unix-mount prefix; the Windows path is correct and Chrome on the host reads it fine.

## Related skills
- `windows-desktop-automation` / `computer-use` skill — for driving Chrome UI to complete the Load unpacked click.
- `oa-team-soul-canon` — unrelated to this task; soul/5T canon.
