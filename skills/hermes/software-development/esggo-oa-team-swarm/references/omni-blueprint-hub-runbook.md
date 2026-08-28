# Omni-Blueprint Hub (萬能藍圖中心) — Build / Run / Verify Runbook

Class-level workflow for the Omni-Blueprint Hub app: a native Node TypeScript engine
(`OmniBlueprintHub.ts`) that turns "萬能藍圖" specs into runnable products (5T + IComponentCore
+ single data table), plus an RWD Bento-Box UI and a monitor→SSE broadcast server.

App location: `C:\Project\esggo\apps\omni-blueprint-hub` (esggo `apps/*` pnpm workspace, writable).
Core files: `OmniBlueprintHub.ts` (engine, runnable on Node 24 native TS), `index.html` + `styles.css`
+ `data.js`/`app.js` (control dashboard, RWD), `live-sync.html`/`sync.js` (designated broadcast page),
`monitor-server.mjs` (poll fixed URL → SSE broadcast), `stream.html` (SSE client), `launcher.py`
(starts node detached from terminal).

## Core contract (do not break)
- 5T: Traceable / Trackable / Transparent / Tangible / Trustworthy.
- IComponentCore: `{ uuid, version, timestamp, evidence[] }`.
- Single data table: all entities (BLUEPRINT + PRODUCT + BROADCAST_LOG) converge in one Map.
- Hash Lock: sha256 on write + `Object.freeze()` (Trustworthy).

## Run / verify commands (all verified working)
Engine (Node 24 native TS, no build step):
```bash
node OmniBlueprintHub.ts        # EXIT=0; prints single-table table at end
```
Typecheck engine:
```bash
tsc --noEmit --module nodenext --target es2022 --skipLibCheck OmniBlueprintHub.ts
```
NOTE: the engine uses Node builtin `crypto` — needs `@types/node` only for zero tsc errors; runtime
works fine without it. The `.mjs` monitor/server is NOT covered by tsc — use `node --check`.

Monitor + SSE broadcast server:
```bash
python3 launcher.py            # starts node detached (start_new_session); survives agent terminal
# or foreground for debugging:
timeout 6 node monitor-server.mjs
```
Broadcast URL: `http://localhost:8787/stream?src=akkadu-kxxf`
Monitors `https://akkadu.ai/live/kxxf` every 15s, fetches page, hashes content, SSE-pushes
`snapshot` (on change OR immediately to a new subscriber) + `heartbeat` (every poll).

## CRITICAL: persistent local server on Windows terminal
`terminal(background=true)` launches bash that wraps node; node gets SIGHUP (`stdin is not a tty`,
`no job control in this shell`) and exits (~exit 1) even though the code is fine. A frontend
`python -m http.server` survives, but a node long-lived process does NOT under `background=true`.

WORKING FIX (verified): launch node via a small Python wrapper that calls `start_new_session=True`
so the child detaches from the agent's controlling terminal:
```python
# launcher.py
import subprocess, os
p = subprocess.Popen(['node','monitor-server.mjs'],
    stdin=subprocess.DEVNULL, stdout=open('/tmp/monitor.log','w'),
    stderr=subprocess.STDOUT, start_new_session=True,
    cwd=os.path.dirname(os.path.abspath(__file__)))
print(f'launched pid={p.pid}')
```
Then `python3 launcher.py` returns immediately and node keeps running. Kill it later via
`netstat -ano | grep :8787` → `taskkill /F /PID <pid>` (MSYS `//F` style is mis-parsed; use `/F /PID`).

## Modular ESM engine (new build, verified 2026-08-06)
The blueprint engine was refactored into 3 ESM TypeScript files (nodenext module resolution):
- `core-types.ts` — `IComponentCore`, `BlueprintType`, `BlueprintDefinition`, `BlueprintProduct`,
  `BroadcastPayload`, `UnifiedBlueprintEntity` interfaces.
- `hub-engine.ts` — `OmniBlueprintHub` class: `createBlueprint` / `manifestToProduct` /
  `pushBroadcastPayload` / `freezeProduct` / `getUnifiedTable`, all Hash-Locked + `Object.freeze()`.
- `hub-demo.ts` — self-running verification demo (creates both blueprint types, pushes payloads,
  prints the unified single-data-table via `console.table`).

### ESM rule (mandatory for nodenext)
Relative imports MUST carry explicit `.js` extension even though the source is `.ts`:
```ts
import { OmniBlueprintHub } from './hub-engine.js';   // ✓ NOT './hub-engine'
import { UnifiedBlueprintEntity } from './core-types.js';
```
Omitting it yields `error TS2835: Relative import paths need explicit file extensions` under
`--module nodenext`. Also annotate callback params (e.g. `.map((row: UnifiedBlueprintEntity) => …)`)
to satisfy `--strict` (avoids implicit `any`).

### Verified run + typecheck
```bash
# typecheck (strict, nodenext) — EXIT 0 when clean
npx tsc --noEmit --module nodenext --target es2022 --skipLibCheck --strict \
  core-types.ts hub-engine.ts hub-demo.ts

# run the demo (tsx handles .ts + .js-extension imports natively)
npx tsx hub-demo.ts        # EXIT 0; prints 6 unified-table rows (2 BLUEPRINT + 2 PRODUCT + 2 LOG)
```
`tsx` is the verified runner for this modular layout (plain `node hub-demo.ts` will not resolve
the `.js`-extensioned TS imports without a loader). The older single-file `OmniBlueprintHub.ts`
still runs under Node 24 native TS; prefer the modular files for new work.

### write_file stream-timeout pitfall (Hermes agent, 2026-08-06)
`write_file` with a large single payload (the full Omni-Blueprint Hub TS engine + demo, ~10K
tokens) caused **stream timeouts** 3× this session — the response never delivered. Fix: split any
large artifact into multiple smaller tool calls: write a first small file, then extend via
`patch`/`write_file` of <8K-token chunks. Each `core-types.ts` / `hub-engine.ts` / `hub-demo.ts`
above was written as a separate <5K-token `write_file` call and all succeeded. Applies repo-wide
when generating big source files, not just the Hub.

## Verifying SSE actually pushes (not just 200)
`curl` against an SSE endpoint returns partial/exit 23 because it's a streaming long-lived
connection — that is NOT a failure. Use a Python urllib client that reads byte-by-byte for ~10s:
```python
import urllib.request, time
url="http://localhost:8787/stream?src=akkadu-kxxf"
with urllib.request.urlopen(urllib.request.Request(url), timeout=15) as r:
    end=time.time()+10; buf=b""
    while time.time()<end:
        c=r.read(1)
        if not c: break
        buf+=c
        if b"\n\n" in buf:
            blk=buf.decode("utf-8","replace").split("\n\n")[0]
            print(blk[:400]); buf=b""
```
A correct stream prints `retry: 3000` then `event: snapshot` (with `text`, `sourceOrigin`,
`hash`, `timestamp`) on connect, plus `event: heartbeat` every 15s. If you only see `heartbeat` and
never `snapshot`, the server is NOT pushing the cached snapshot to new subscribers — fix: on SSE
connect, send `lastSnap.get(src)` directly to that `res` (not via broadcast()), because `poll()` only
broadcasts snapshot on hash CHANGE, so a reconnecting user would wait forever for the next change.

## RWD UI notes
- Bento Box grid: 1 col mobile → 2 (>=768) → 3 (>=1024) → 4 (>=1440). `clamp()` for fluid type.
- `viewport-fit=cover` + meta viewport. `prefers-reduced-motion` disables packet animation.
- 5T protocol chips + product cards + single-table `<table>` with horizontal scroll wrapper.

## Gotchas
- Akkadu live captions need browser login/WebSocket; backend polling only fetches the public
  marketing HTML. Real-time subtitle capture needs a browser-automation layer (computer_use / Playwright).
- `.mjs` files: lint via `node --check`, not tsc. Browser `.js` files: lint via `node --check` too
  (they reference `window`, so running them under node fails — that's expected, not a bug).
- Don't commit probe scripts (`_v.py`, `_verify.py`) — keep the dir clean.
