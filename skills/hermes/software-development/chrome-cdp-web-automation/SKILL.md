---
name: chrome-cdp-web-automation
description: "Scrape pages or monitor SSE with headless Chrome/CDP."
version: 1.0.0
author: Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [chrome, cdp, headless, scraping, sse, automation, playwright, monitoring]
---

# Chrome / Chromium Headless + CDP Web Automation

For dynamic pages where `curl` only returns a JS shell (SPA). Two modes.

## Chrome binaries (no npm install needed)
- Playwright cache (Windows): `C:/Users/<user>/AppData/Local/ms-playwright/chromium-1228/chrome-win64/chrome.exe` (full build, has CDP)
- Headless shell: `.../chromium_headless_shell-1228/chrome-headless-shell-win64/chrome-headless-shell.exe` (lighter; --dump-dom only)
- Linux VPS without chromium: `python3 -m playwright install chromium` needs system deps first (Ubuntu 24.04: `libnss3 libasound2t64` etc.). If apt deps fail, run automation on a machine that already has chromium — don't fight the dep rabbit hole.

## Mode 1: Static rendered DOM (simplest)
```
chrome --headless=new --no-sandbox --disable-gpu --disable-dev-shm-usage \
       --virtual-time-budget=5000 --dump-dom <url>
```
Spawn it, accumulate `stdout`, resolve on `close`. Parses DOM after JS runs. Good for pages where the text you want ends up in the DOM. Extract with regex for `aria-live` containers or `[class*=caption]` blocks.

**Pitfall:** `--dump-dom` snapshots DOM at virtual-time end. SPA forms mounted late may be absent → use Mode 2 and wait.

## Mode 2: CDP live (network + DOM events)
Use **Node's native `WebSocket`** (Node 22+, global). Critical gotchas that wasted a full session:
1. **Connect to the PAGE target, not the browser.** `GET /json/list`, find the entry with `type==="page"`, use ITS `webSocketDebuggerUrl`. `/json/version`'s ws URL is browser-level — sending `Page.enable`/`Network.enable` there silently does nothing (zero network events fire).
2. Native WebSocket is **EventTarget-based**: use `ws.addEventListener('open'|'message'|'error', ...)`. `ws.on(...)` throws `ws.on is not a function`.
3. Flow: `Page.enable` → `Network.enable` → `Page.navigate`. Listen `Network.requestWillBeSent` / `Network.responseReceived` to discover the real backend (e.g. `/api/...`, `wss://...`, token endpoints).

## Keeping node alive under Hermes background terminal
`terminal(background=true)` wraps node in a bash process that receives SIGHUP when the tty detaches → node exits 1 with NO output. Fixes:
- **VPS:** `pm2 start script.mjs --name x` (daemon, survives; `pm2 save` persists across reboot). Best option.
- **Local:** a Python launcher `subprocess.Popen([...], start_new_session=True, stdin=subprocess.DEVNULL)` detaches from the controlling terminal so node stays up.
- Never use `&` in terminal (blocked). Don't rely on background=true for long-lived node.

## Verification (no pnpm/tsc for .mjs)
- `node --check file.mjs` for syntax.
- Live proof: `curl -sN --max-time N "http://host:port/stream?..." | grep -E '^event:'` confirms SSE actually pushes.
- nginx SSE reverse proxy MUST set `proxy_buffering off; proxy_cache off; chunked_transfer_encoding on; proxy_read_timeout 3600s;` or events buffer and never flush to the client. See `templates/nginx-sse-proxy.conf`.

## Pitfalls (domain knowledge)
- Minified JS: class names are single letters — you CANNOT grep selectors. Instead capture network requests via CDP to find the API endpoints.
- Akkadu-style caption products push text over **Agora RTM** (binary WS protocol), not into a DOM `aria-live` you can scrape. Headless DOM capture misses them unless the page renders captions into a known container. The reliable path is the vendor SDK or discovering the room/REST endpoints (see `references/akkadu-live-caption.md`).
- SSE clients: `curl -sN` is the quickest probe; Python `urllib` with a read loop also works (read 1 byte at a time, split on `\n\n`).

## Support files in this skill
- `references/akkadu-live-caption.md` — real Akkadu REST endpoints reverse-engineered via CDP (room status, Agora audience token, why captions aren't DOM-scrapable).
- `templates/nginx-sse-proxy.conf` — drop-in nginx `location /` block for an SSE upstream (buffering off + long read timeout).
