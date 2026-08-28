---
name: node-http-route-security
description: Secure Node http route handlers. SSRF and route guards.
---

# Node HTTP Route Security (verified patterns)

## When to use
- Adding a proxy/media-passthrough route to a `node:http` server (e.g. `/proxy-media?url=...`).
- Any handler that fetches a user-supplied URL, streams a response, or reads `req.url` query params.
- Diagnosing `ReferenceError: X is not defined` inside an http handler, or SSRF exposure in a proxy.

## Pattern: SSRF-safe proxy route
```js
if (urlPath === '/proxy-media' && req.method === 'GET') {
  const MAX_BYTES = 50 * 1024 * 1024;     // 50MB cap
  const TIMEOUT_MS = 20000;
  try {
    const raw = req.url.split('?')[1]
      ? new URLSearchParams(req.url.split('?')[1]).get('url') || '' : '';
    const target = new URL(raw, 'http://x');          // base prevents bare-host throw
    if (!/^https?:$/.test(target.protocol))
      { res.writeHead(400); return res.end('invalid protocol'); }

    // SSRF guard — BLOCK private/link-local/metadata. NOTE: NO trailing '$' (see Pitfalls).
    const host = target.hostname.toLowerCase();
    const isPrivate = /^(localhost|0\.0\.0\.0|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|169\.254\.|\[::1\]|::1)/.test(host)
      || host === 'metadata.google.internal' || host.endsWith('.internal') || host.endsWith('.local');
    if (isPrivate) { res.writeHead(400); return res.end('blocked: private host'); }

    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    const upstream = await fetch(target.toString(), { signal: ctrl.signal });
    clearTimeout(t);
    if (!upstream.ok) { res.writeHead(upstream.status); return res.end('upstream error'); }

    const cl = Number(upstream.headers.get('content-length') || 0);
    if (cl > MAX_BYTES) { res.writeHead(413); return res.end('payload too large'); }

    res.writeHead(200, {
      'content-type': upstream.headers.get('content-type') || 'video/mp4',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-store',
    });
    // Stream — do NOT arrayBuffer() the whole body (OOM on large files).
    if (!upstream.body) { res.end(Buffer.from(await upstream.arrayBuffer())); return; }
    let sent = 0;
    const reader = upstream.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      sent += value.byteLength;
      if (sent > MAX_BYTES) { res.end(); return; }
      res.write(Buffer.from(value));
    }
    res.end();
  } catch (e) { res.writeHead(500); res.end('proxy fail: ' + e.message); }
}
```

## Pitfalls (all hit & fixed this session)
1. **SSRF regex `$` anchor**: `/^...169\.254\.$/` with a trailing `$` only matches a host that *ends* in `169.254.` — but the metadata IP is `169.254.169.254`, which does NOT end in `169.254.`. Result: regex returns false, request reaches `fetch`, throws, caught as 500 (proxy fail) instead of a clean 400 block. **Fix**: drop the `$` (use `^...169\.254\.` prefix match) OR add `.*` before `$`. Always test with `169.254.169.254`, `127.0.0.1`, `localhost`, `10.0.0.5`.
2. **Block-scoped `urlPath` ReferenceError**: declaring `const urlPath = url.split('?')[0]` *inside* a nested `if` block, then referencing `urlPath` in a sibling route block → `ReferenceError: urlPath is not defined`. **Fix**: declare `const urlPath = url.split('?')[0];` once at the top of the request handler (right after `const url = req.url || '';`).
3. **`arrayBuffer()` whole-body load**: `Buffer.from(await upstream.arrayBuffer())` holds the entire upstream in memory → OOM on big media. **Fix**: stream via `upstream.body.getReader()` and `res.write()` per chunk with a running byte counter.
4. **No timeout**: a hung upstream holds the connection forever. **Fix**: `AbortController` + `setTimeout(...abort(), 20000)`.
5. **No size cap**: `content-length` check before streaming; abort mid-stream if `sent > MAX_BYTES`.
6. **Stale server in tests**: when re-probing a route, an old `node server.mjs` process often still holds the port → `EADDRINUSE`, and curl silently hits the *old* (unpatched) handler, making your fix look broken. **Fix**: `pkill -9 -f "server.mjs"` then boot on a fresh port (e.g. 8801), confirm `listening on :8801` in the boot log before probing.

## How to verify a route fix (repro recipe)
```bash
pkill -9 -f "server.mjs"; sleep 1
(PORT=8801 node server.mjs > /tmp/boot.log 2>&1 < /dev/null &) ; sleep 4
grep -iE "listening" /tmp/boot.log          # confirm NEW server up
curl -s -o NUL -w "meta=%{http_code}\n" "127.0.0.1:8801/proxy-media?url=http://169.254.169.254/"
curl -s -o NUL -w "local=%{http_code}\n" "127.0.0.1:8801/proxy-media?url=http://localhost:22/"
curl -s -o NUL -w "file=%{http_code}\n"  "127.0.0.1:8801/proxy-media?url=file:///etc/passwd"
pkill -9 -f "server.mjs"
```
Expect: `meta=400 local=400 file=400`. (`< /dev/null` avoids the "stdin is not a tty" background-exit on Windows.)
