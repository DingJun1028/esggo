---
name: headless-scrape-no-deps
description: "Scrape DOM via cached Chromium --dump-dom, no deps."
version: 1.0.0
author: Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [scraping, headless, chromium, playwright, automation, captions, SSE]
---

# Headless scrape with no npm dependencies

When you need to extract JS-rendered DOM (live captions, `aria-live` containers, SPA content) but
`npm i playwright` / `playwright-core` FAILS (e.g. a corrupted git dependency `closure-net` that
times out at 180–200s), do NOT keep retrying the install. You already have a Chromium binary in the
Playwright browser cache — drive it directly with `--dump-dom`.

## When to use
- Scrape a page whose content only appears after JS runs (SPA, live captions).
- Monitor a fixed URL for DOM changes (captions, price, status) and broadcast diffs (e.g. via SSE).
- Any environment where `npm i playwright` is blocked but `ms-playwright` cache has a browser.

## Step 1 — locate the chromium binary
```
# Windows (MSYS path)
C:/Users/<user>/AppData/Local/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-win64/chrome-headless-shell.exe
C:/Users/<user>/AppData/Local/ms-playwright/chromium-1228/chrome-win64/chrome.exe
# Linux
~/.cache/ms-playwright/chromium-*/chrome-linux/chrome
```
`chrome-headless-shell` is enough for `--dump-dom`. Verify with `fs.existsSync(CHROME)` in Node.

## Step 2 — dump rendered DOM (no CDP, no WS libs)
Spawn with `--dump-dom` + `--virtual-time-budget=N` (lets JS run N ms before serializing). Read
stdout fully; resolve on `close` when `out.length > 0`.

```js
import { spawn } from 'node:child_process';
function dumpDom(url, CHROME) {
  return new Promise((resolve) => {
    const p = spawn(CHROME, [
      '--headless=new', '--no-sandbox', '--disable-gpu',
      '--disable-dev-shm-usage', '--virtual-time-budget=5000',
      '--dump-dom', url
    ], { stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '', err = '';
    p.stdout.on('data', d => { out += d; });
    p.stderr.on('data', d => { err += d; });
    const to = setTimeout(() => {
      p.kill('SIGKILL');
      resolve(out.length > 0 ? { ok: true, dom: out } : { ok: false, error: 'timeout-no-output' });
    }, 25000);
    p.on('close', () => { clearTimeout(to); out.length > 0 ? resolve({ ok: true, dom: out }) : resolve({ ok: false, error: err.slice(0,200) }); });
    p.on('error', e => { clearTimeout(to); resolve({ ok: false, error: String(e) }); });
  });
}
```
This works even when the page needs no auth. If the target needs login (Agora/WebSocket live captions),
the dumped DOM is only the public landing/error shell — real captions require a logged-in session
(which `--dump-dom` alone cannot establish). Capture that limitation honestly; do not fabricate captions.

## Step 3 — extract the live region
```js
function extractCaptions(dom) {
  const caps = [];
  const liveRe = /<[^>]*aria-live[^>]*>([\s\S]*?)<\/[^>]+>/gi;
  let m; while ((m = liveRe.exec(dom)) !== null) {
    const t = m[1].replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
    if (t) caps.push(t);
  }
  // fallback: common caption class
  const capRe = /<[^>]*class="[^"]*caption[^"]*"[^>]*>([\s\S]*?)<\/[^>]+>/gi;
  while ((m = capRe.exec(dom)) !== null) {
    const t = m[1].replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
    if (t && !caps.includes(t)) caps.push(t);
  }
  return caps;
}
```

## Step 4 — Node ESM self-test guard (critical)
A bare `if (import.meta.url === `file://${process.argv[1]}`) { ... }` self-test **silently skips** when
you run `node script.mjs` — `process.argv[1]` is a RELATIVE path while `import.meta.url` is an absolute
`file://` URL, so the strings never match and nothing logs. Fix:
```js
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
const isMain = import.meta.url === pathToFileURL(resolve(process.argv[1])).href;
if (isMain) { /* run self-test */ }
```
Also prefer a sequential `for` loop with `await` + `process.exit(0)` over `setInterval` for self-tests,
so the first `await dumpDom()` actually returns before the process exits.

## Verification
- `node --check script.mjs` for syntax.
- Run the self-test directly (`node script.mjs`); expect 3 caption lines (or "(empty / no live captions — not logged in)") — NOT silence.
- End-to-end with SSE: a Python `urllib` client reading 1 byte at a time for ~10s, counting `event:` lines, confirms broadcast works without needing a browser.

## Pitfalls
- `npm i playwright` hanging on `closure-net` → use the cached binary + `--dump-dom`, never retry the install blindly.
- MSYS `cd` with backslashes gets mangled — always use forward slashes or `cygpath -u`.
- `curl -s -N` against an SSE endpoint returns exit 23 ("partial") — that is a long-connection success signal, not a failure.
