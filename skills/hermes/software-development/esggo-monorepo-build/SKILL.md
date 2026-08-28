---
name: esggo-monorepo-build
description: "Build/verify TS packages in DingJun1028/esggo pnpm monorepo."
version: 1.0.0
author: Hermes Agent
license: MIT
platforms: [windows, linux, macos]
metadata:
  hermes:
    tags: [esggo, pnpm, typescript, monorepo, build, verify, node-next]
---

# esggo Monorepo — TypeScript Build & Verify Discipline

The `esggo` repo is a pnpm workspace with ~15 packages (`packages/*`) and apps (`apps/*`).
Building/verifying a single package here hits four recurring traps. This skill records the
working patterns so you don't rediscover them each session.

## When to use
- Editing/adding a `packages/*` or `apps/*` TypeScript package and needing to compile or test it.
- Wiring one package to import another (`@esggo/x`) and the import resolves to nothing.
- `pnpm run test`/`pnpm run typecheck` exits 1 with a stack mentioning `runDepsStatusCheck`.

## Trap 1 — pnpm `runDepsStatusCheck` gate blocks `pnpm run <script>`
**Symptom:** `pnpm run test` (or `typecheck`) fails before your script runs:
```
at runDepsStatusCheck (.../pnpm/dist/pnpm.mjs:...)
```
This is pnpm 11.x refusing to run because *other* workspace packages are unbuilt — not a defect
in your package. The script itself is fine.

**Fix (verification bypass):** run the underlying command directly. There are two levels:

1. **Preferred — package-local binary (most reliable, never hangs):**
   Each package has its own `node_modules/.bin/` with `tsc` and `tsx` already installed.
   Call them directly; this sidesteps BOTH the pnpm workspace gate AND the `npx` fetch hang.
   ```bash
   cd packages/<pkg>
   ./node_modules/.bin/tsc                 # build (emits dist/)
   ./node_modules/.bin/tsc --noEmit        # typecheck only
   ./node_modules/.bin/tsx test/smoke.ts   # run a smoke test
   ```
   Run these in the **background** (`terminal(background=true)`) if they may exceed ~120s —
   a single-package `tsc` here has taken 30–180s.

2. **Fallback — `npx --no-install`** (only if the local binary is somehow absent):
   ```bash
   npx --no-install tsc -p tsconfig.json --noEmit --skipLibCheck
   npx --no-install tsx test/smoke.ts
   ```
   ⚠️ **Never use bare `npx`** (no `--no-install`): it tries to fetch/resolve from the registry
   and **hangs for minutes** (observed: 180s foreground timeout on `pnpm run build`, and the
   `write_file` lint hook's bare `npx` call hangs at 30s). A bare-`npx` timeout is an
   environment hang, NOT a code defect.

Only use `pnpm run <script>` as the canonical command in *final* verification evidence; if it
still hits the gate/timeout, show both the `pnpm run` attempt (proving it's environmental) AND
the local-binary result (proving the code works).

## Trap 2 — tsconfig `extends` root inherits `noEmit:true` (silent no-dist)
**Symptom:** `tsc -p tsconfig.json` exits 0 but `dist/` is empty or missing `core/*.js`.
Root cause: the repo root `tsconfig.json` sets `"noEmit": true` and your package's
`tsconfig.json` does `extends: ../../tsconfig.json`, inheriting it.

**Fix:** in the package tsconfig, DON'T extend root for buildable libs. Use a standalone config:
```json
{
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "target": "ES2022",
    "lib": ["ES2022", "DOM"],
    "declaration": true,
    "noEmit": false,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "types": ["node"]
  },
  "include": ["src/**/*.ts"]
}
```
Critical: `module/moduleResolution: NodeNext` (NOT `Bundler`). `Bundler` emits import specifiers
without `.js` extensions, which Node ESM cannot resolve → downstream `import('@esggo/x')` fails
with `ERR_MODULE_NOT_FOUND: .../dist/core/orchestrator.js`. `NodeNext` emits `.js` specifiers.

## Trap 3 — optional peer-dep dynamic import
**Symptom:** `import('@google/adk')` or `@genkit-ai/google-genai` at top level → tsc TS2307
"Cannot find module" (the peer dep is optional and not installed). Adding
`// @ts-expect-error` then triggers "Unused '@ts-expect-error' directive" under `skipLibCheck`
because tsc doesn't treat the missing module as an error in some resolution modes.

**Fix:** use a *variable* dynamic import so tsc never statically resolves the module:
```ts
const pkg = '@google/adk';
const mod = await import(pkg as string);   // no TS2307, no unused-directive
```
Same for `genkit` / `@genkit-ai/google-genai`. Wrap in try/catch for graceful degrade.

## Trap 4 — cross-package `@esggo/x` import resolves to nothing
**Symptom:** `import('@esggo/oa-framework')` → module not found, even though the package exists.
pnpm only symlinks a workspace package into a consumer's `node_modules/@esggo/` if the consumer
declares it as a dependency. Isolated new packages are NOT auto-linked.

**Fix:** add the workspace dependency, then reinstall:
```jsonc
// packages/consumer/package.json
"dependencies": { "@esggo/oa-framework": "workspace:*" }
```
```bash
pnpm install --frozen-lockfile=false
# verify: ls -la packages/consumer/node_modules/@esggo/oa-framework -> symlink to packages/oa-framework
```
After that, dynamic `import('@esggo/oa-framework')` resolves to `<pkg>/dist/index.js`
(requires Trap 2's `dist` to exist). For graceful degradation when the dep may be absent,
wrap the import in try/catch and return `null`/scaffold — never fabricate output.

**Fallback when `pnpm install` is blocked by unrelated node_modules corruption** (e.g. it
dies on `uuid@14.0.1 ENOENT` — a pre-existing store breakage, NOT your change): manually
create the workspace symlink so `@esggo/x` resolves. Use a **relative** target:
```bash
cd /c/Project/esggo
mkdir -p node_modules/@esggo
ln -s ../../libs/<pkg> node_modules/@esggo/<pkg>   # relative! not /c/Project/...
# verify: node -e "import('@esggo/<pkg>').then(m=>console.log('keys',Object.keys(m).length))"
```
⚠️ Do NOT use an absolute MSYS path (`ln -s /c/Project/esggo/libs/x ...`) — native Windows
node reads the stored symlink target and mangles `/c/...` → `C:\c\...`, so the import fails.
Relative targets avoid the MSYS-absolute translation entirely. (See `windows-gitbash-fileops`
Trap 13.) Also avoid `cmd //c "mklink ..."` here: the `cmd //c` banner-swallow + MSYS path
mangling makes it unreliable from Git-Bash.

## Trap 5 — `write_file` / `patch` lint hook false-negative (`npx` hang → TS6053)
**Symptom:** after every `write_file`/`patch`, the tool returns `lint: {status:"error", output:"[Command timed out after 30s]"}` or
`error TS6053: File '.../src/x.ts' not found. The file is in the program because: Root file specified for compilation`,
even though the file was just written and the write pre-flight said `verified:true`.
Root cause: the built-in lint/post-edit hook shells out to **bare `npx`**, which hangs fetching and then
emits a bogus TS6053. This is NOT a real compile error and does NOT reflect your file's actual state.

**Fix:** ignore the lint-hook status during editing. Trust `verified:true` from the write. Do real verification
once at the end with the package-local `./node_modules/.bin/tsc` (Trap 1 level 1). A green `tsc` is the only
signal that counts; the per-edit lint errors are environment noise.

## Pitfalls — code patterns that compile-clean but fail at runtime
- **Frozen stored record + later mutation → `TypeError: Cannot assign to read only property`:**
  if you `Object.freeze(record)` and store it, you cannot later do `record.status = 'done'`.
  Keep mutable state in a *separate* `Map`/field (e.g. `statusMap.set(id,'done')`), and only freeze
  the returned/external reference. Found and fixed in `omni-agent-bus` ServiceOrchestrator.
- **5T gate test fixtures must satisfy BOTH length + keyword gates:** `bus5TGate`/`verify5T`
  (in `omni-agent-bus`) require each dimension to exceed a min length (traceable≥100, transparent≥150,
  tangible≥200, trustworthy≥120, trackable≥80 chars) AND match a keyword regex. A short or
  keyword-less string **silently fails** the gate. Write a deliberately long fixture that embeds all
  5 keyword classes, and add a negative case (`verify5T('short text')` → `!pass`) to prove the gate works.
- **`export *` from a barrel + locally-declared (non-exported) types:** if `patterns/index.ts` does
  `export type { EventRecord } from '../event-bus.js'` but `event-bus.ts` only declared `interface EventRecord`
  (not `export`), tsc errors `TS2459: declares locally, but not exported`. Fix: add `export type { EventRecord };`
  next to the interface, or make the interface `export interface`.
- **Cross-package internal import path:** a file under `packages/omni-agent-bus/src/patterns/` importing a type
  from the package root must use `'../types.js'` (NodeNext), NOT `'./types.js'`. Wrong relative depth → TS2305.

## Verification checklist (per package)
- [ ] `npx --no-install tsc -p tsconfig.json --noEmit --skipLibCheck` → exit 0 (no errors)
- [ ] If emitting: `dist/index.js` exists AND `grep "from './" dist/index.js` shows `.js` specifiers
- [ ] `npx --no-install tsx test/smoke.ts` → exit 0, prints expected OK marker
- [ ] Cross-package: symlink present under `node_modules/@esggo/`; dynamic import returns AVAILABLE
- [ ] Commit only; never push secrets/credentials; dist is usually gitignored

## Notes / gotchas
- **Proven end-to-end verify sequence** (used 2026-08-10 to land `src/patterns/*` in `omni-agent-bus`):
  see `references/proven-verify-sequence.md` — background `tsc` + per-test `tsx` with real exit codes.
- **Add new smoke tests to the package `test` script**: a new `test/<name>.smoke.ts` is NOT auto-run.
  Append `&& tsx test/<name>.smoke.ts` to `package.json` `"scripts"."test"` or it won't be in CI/final evidence.
  (A `for t in ...; do tsx test/$t.smoke.ts` loop bug: `smoke` → `smoke.smoke.ts`; name files exactly `<name>.smoke.ts`
  and call `tsx test/<name>.smoke.ts`.)
- `pnpm install` may print "Already up to date" yet still create new symlinks when a new
  `workspace:*` dep was added — re-run it after editing package.json deps.
- `rm -rf dist && tsc -p tsconfig.json` is a safe rebuild; the recursive delete is auto-approved by smart approval.
- The root tsconfig.json include is narrow (only specific paths); a package's own
  include of src files is what actually drives its compile once it stops extending root.

## Trap 6 — module-level config constant captured at import (test mock miss)
Symptom: a test sets monkeypatch.setenv("ESGO_HASHLOCK_URL", ...) but the function-under-test
still takes the `if not ESGO_HASHLOCK_URL: return local` branch and ignores the env var.
Root cause: the module reads ESGO_HASHLOCK_URL = os.getenv("ESGO_HASHLOCK_URL","") at import time;
the name resolves to the frozen module-level constant, not os.environ at call time.
Fix: in tests, override the attribute directly: monkeypatch.setattr(module, "ESGO_HASHLOCK_URL", "http://x").
Same trap bit kpi.ESGO_SUMMARY_URL (function returned None early, so the mock was never reached and the
test was a FALSE GREEN). Lesson: when a module caches an env var at import, setenv alone silently no-ops —
always setattr the module constant, and assert the mock path was actually exercised (e.g. capture the URL
the code posted to and assert it endswith('/api/verify-5t')).

## Trap 7 — esggo jsonResponse double-wraps {data:{data:{...}}}
Symptom: aistation fetch_esggo_summary() does resp.json().get("data") and gets caseCount: ? (or None)
even though the endpoint clearly returns caseCount.
Root cause: esggo route handlers call jsonResponse({ data: {...} }) and jsonResponse itself wraps once
more, so the wire shape is { success:true, data: { success:true, data: { caseCount:47 } } }.
Fix: unwrap defensively — inner = payload.get("data", payload); if isinstance(inner,dict) and "data" in inner: inner = inner["data"].
Add tests for BOTH shapes (double-nested and single data wrappers) and set
monkeypatch.setattr(kpi, "ESGO_SUMMARY_URL", "http://x") (Trap 6) so the fetch actually runs.

## Trap 8 — pushing to a shared remote with concurrent WIP (stash+rebase landmine)
Symptom: git push rejected (tip behind), or git rebase aborts with untracked working tree files
would be overwritten by checkout.
Root cause: (a) the shared repo carries other in-flight edits (11+ tracked-M files), and (b) an untracked
file on disk (e.g. tsc_errors_utf8.txt, node_modules) collides with what rebase wants to write.
Fix (proven, used 4+ times this session across esggo + learning-center):
1. git stash push -m "wip-before-X" — do NOT pass -u (it tries to stash node_modules and hangs/kills the stash).
   Stashing tracked-M only is enough to make the tree clean for rebase.
2. git fetch origin main && git rebase origin/main (clean tree succeeds).
3. git push origin main.
4. git stash pop to restore the users WIP.
If rebase aborts on an untracked file: rm -f <that-untracked-file> (local scratch artifact, e.g. tsc error log),
then re-run steps 2-4. After pop, verify `git status --short | grep -E '^ M|^M ' | wc -l` matches the
pre-stash count so no WIP was lost. Never git reset --hard (destroys concurrent edits).
Also: if you git commit your file BEFORE stash pop, the stash still holds your edit and push says
up-to-date — re-commit the single file AFTER pop.

## Trap 9 — `libs/*` orphaned: root workspaces missing the glob
Symptom: a package under `libs/` (e.g. `libs/incremental`) exists, compiles, even has
passing tests — but is never symlinked into `node_modules/@esggo/`, never appears as a
consumable `@esggo/x`, and `pnpm install` never picks it up.
Root cause: root `package.json` `workspaces` only listed `["packages/*","apps/*"]`. pnpm
only auto-links globs it is told about.
Fix: add `"libs/*"` to the workspaces array. Then re-link via `pnpm install` (or the
Trap 4 relative-symlink fallback if install is blocked).

## Trap 10 — vitest green ≠ Node ESM consumable (extensionless import in dist)
Symptom: `vitest run` passes 18/18, `dist/` builds, yet `node -e "import('@esggo/incremental')"`
throws `ERR_MODULE_NOT_FOUND: .../dist/index.js can't find './stream-buffer'`.
Root cause: the lib's tsconfig used `moduleResolution: "Bundler"` AND its source files used
bare relative imports (`from './stream-buffer'` with no `.js`). Vitest resolves like a
bundler (extensionless OK), but real Node ESM MUST have the `.js` specifier — and tsc will
not invent extensions the source doesn't carry. The emitted dist keeps the extensionless
import, so downstream consumption fails.
Fix (both parts required):
  1. Build tsconfig: `module: "NodeNext"`, `moduleResolution: "NodeNext"` (Trap 2).
  2. Add `.js` to EVERY relative import in `src/**`: `from './stream-buffer.js'`.
Real proof of consumability — do NOT trust vitest alone:
  - `node -e "import('@esggo/incremental').then(m=>{if(!m.EventBus)throw new Error('miss');console.log('OK',Object.keys(m).length)})"`
  - or a committed `test/dist-smoke.mjs` importing `../dist/index.js` and asserting key
    symbols + an instance-method call. (Recipe: `references/libs-incremental-esm-verify.md`.)

## Workflow note — duplicate-check before "landing" an orphaned package
Before promoting a seemingly-missing package to first-class, grep the repo for an existing
implementation of the same spec. Example: `libs/incremental` (soul.md §12 patterns) was
already fully implemented AND built under `packages/omni-agent-bus/src/patterns/`. Do NOT
blindly rewire the mature bus to import the orphan — their APIs differ (`EventBus.publish(source, payload)`
vs `publish({source,type,payload})`; HMAC sha256 `timingSafeEqual` vs simple concat) and the
rewire breaks the bus's smoke tests. Prefer: promote the orphan to a standalone first-class
package (register glob, build, emit `.d.ts`) and keep its contract tests as a regression
harness, OR demote it to a test-only layer — but don't create a parallel duplicate.

## Tooling note — hermes verify can be env-broken (not a code signal)
hermes verify --json failed this session with pyyaml Invalid metadata entry name / WinError 5 on
_yaml.cp311-win_amd64.pyd — the Hermes agent venv's own pyyaml install is corrupt (another hermes
process holds hermes.exe, permission denied). This is a tool-environment breakage, not a project-code
defect. Do NOT treat its failure as evidence your code is broken; fall back to project-native checkers
(pytest / tsc / tsx / json.load), which are authoritative for the code under test.
