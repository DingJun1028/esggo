---
name: node-e2e-verification
description: Boot Node SSE/HTTP servers in tests; dodge verify pitfalls.
---

# Node E2E Verification (servers + SSE)

Patterns for booting a Node HTTP/SSE server inside a test or verify script and probing it
with real requests — without a browser, without flaky globals, and without hanging the process.

## When to use
- Writing `node --test` integration tests that start `server.mjs` and hit `/health`, `/api/*`, `/stream`.
- Building a `verify.mjs` / `e2e-*.mjs` acceptance runner that spins up dependencies (e.g. a Python STT service) and asserts the full data path.
- Any time you need to confirm a streamed (SSE) endpoint actually pushes events to subscribers.

## Core pattern (server-in-test)
```js
import { spawn } from 'node:child_process';
import { test } from 'node:test';
import { readSSEOnce } from './sse-helper.mjs';

function startServer() {
  const s = spawn('node', ['server.mjs'], { cwd: ROOT, env: { ...process.env, PORT: '8796', OMNILIVE_TRANSLATE_MOCK: '1' } });
  s.stderr.on('data', () => {}); // keep silent; assertions come from HTTP
  return s;
}
const wait = (ms) => new Promise(r => setTimeout(r, ms));

test('SSE 推送雙語字幕', async () => {
  const srv = startServer();
  try {
    await wait(800);
    await fetch('http://localhost:8796/api/speak', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ text:'hi', room:'r' }) });
    const got = await readSSEOnce('http://localhost:8796/stream?room=r', p => p.data && p.data.source === 'hi');
    if (!got) throw new Error('SSE timeout');
  } finally {
    srv.kill('SIGKILL');
  }
});
```
Reusable SSE reader: `scripts/sse-helper.mjs` (`readSSEOnce(url, predicate, {timeoutMs})`).

## Hard pitfalls (validated, will bite you)
See `references/win-node-pitfalls.md` for full detail. TL;DR:
1. **`EventSource` is NOT a Node global** (even Node 24). Use `fetch()` + `response.body.getReader()` streaming — see `readSSEOnce`.
2. **`process.exit()` right after `child.kill('SIGKILL')` crashes Node 24 on Windows** with `Assertion failed: !(handle->flags & UV_HANDLE_CLOSING)`. Use `process.exitCode = 1` and let the event loop drain; never call `process.exit()` in a verify script.
3. **Background terminal commands swallow piped stdout** under this harness (`stdin is not a tty`, `no job control`). For long-running servers/tests, either run **foreground with `timeout 200 ...`**, or have the script **write results to a file you `read_file`**, instead of relying on captured stdout.

## Spawning a Python (non-Node) dependency
A STT/ML service is often Python (`server.py`), not Node — do NOT `spawn('node', ['server.py'])`.
```js
const py = path.join(depDir, '.venv', 'Scripts', 'python.exe'); // Windows venv
const s = spawn(py, ['server.py'], { cwd: depDir, env: { ...process.env, WHISPER_MODEL: 'tiny' } });
```
Reuse an already-running dependency: probe `/health` first; only spawn if not up (avoids EADDRINUSE on a warm port).

## Acceptance-script hygiene
- Print a checklist of `✅/❌` lines, set `process.exitCode` on any failure, exit naturally.
- Abort SSE `fetch` (AbortController) on first matching event so sockets close and the process can exit.
- Guard fixtures by size (`fs.statSync(f).size < 1000`) — a 0-byte stale file will silently trigger a re-synth loop that fails on network blips.
