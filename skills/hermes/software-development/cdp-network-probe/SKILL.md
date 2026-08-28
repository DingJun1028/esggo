---
name: cdp-network-probe
description: "Reverse a SPA's hidden API via zero-dep CDP."
version: 1.0.0
author: Hermes Agent
license: MIT
platforms: [linux, macos, windows]
---

# CDP Network Probe (zero-dependency)

When a site is a JS-rendered SPA and `curl` only returns a shell, you need a real browser to see the network traffic. Puppeteer/Playwright are often unavailable here (npm hangs on git deps, VPS missing system libs like `libasound2t64` on Ubuntu 24.04, PEP 668 blocks pip). The escape hatch: drive an already-installed Chrome/Chromium via CDP using only Node built-ins.

## When to use
- SPA login/API endpoints hidden in JS bundles (curl gets only a 3-4KB Nuxt shell).
- Live-data streams (WebSocket / Agora RTM / WebRTC) whose URL only exists after JS runs.
- You have Chrome (e.g. Playwright's `chrome-win64/chrome.exe` or `chrome-headless-shell.exe`) but no automation library.

## Critical gotchas (cost real time if missed)
1. **Connect to a PAGE target, not the browser.** `GET /json/version` returns a *browser-level* WebSocket — sending `Page.enable`/`Network.enable` to it does nothing and you see zero requests. Instead `GET /json/list`, pick the entry with `type:"page"`, use its `webSocketDebuggerUrl`.
2. **Node 22+ has a native `WebSocket` global, but EventTarget-style.** Use `ws.addEventListener('open', ...)` / `ws.addEventListener('message', ev => ev.data)`, NOT `ws.on('open', ...)` (throws `ws.on is not a function`).
3. **ESM has no `require`.** In a `.mjs`: `import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);` then `require('node:http')`.
4. **Launch flags:** `--headless=new --no-sandbox --disable-gpu --disable-dev-shm-usage --remote-debugging-port=9397 about:blank`. Windows MSYS chrome path uses forward slashes and works.
5. **Enable domains then navigate:** send `Page.enable`, `Network.enable`, then `Page.navigate` with target URL. Filter `Network.requestWillBeSent` / `Network.responseReceived` by URL regex to surface API calls.
6. **Rendered DOM only?** `chrome-headless-shell --dump-dom <url>` is simpler — but it won't show dynamically-injected WebSocket params; use CDP for those.

## Minimal recipe
- Start chrome with remote-debugging port.
- Poll `http://127.0.0.1:PORT/json/list` until a `page` target appears; grab its `webSocketDebuggerUrl`.
- `new WebSocket(url)` → on open send the three CDP commands; on message parse `method`, log `Network.*` events.
- Keep alive ~15-20s, then kill chrome and exit.

See `references/akkadu-live-captions.md` for a worked example that found the real backend for Akkadu's live-caption room.
