# Isolated TS sub-project build/test inside the esggo monorepo

The esggo repo is a pnpm workspace (`pnpm-workspace.yaml` at root). Sub-directories like
`my-worker/`, `oa-swarm/`, `libs/incremental/` are NOT in the workspace, but pnpm still
detects the parent workspace and runs the monorepo's lifecycle scripts (prisma generate,
setup-hooks) on any `pnpm install` / `pnpm run build` inside them. This breaks isolated
builds. The verified working pattern (from building oa-swarm + libs/incremental 2026-08-13):

## 1. Install isolated (no parent workspace interference)
```bash
cd libs/incremental
pnpm install --ignore-workspace          # local node_modules, skips monorepo postinstall
```
Do NOT run plain `pnpm install` — it finds `../pnpm-workspace.yaml` and runs the root
`postinstall`/`prepare` (prisma generate, setup-hooks) and pollutes the sub-project.

## 2. Build with the local tsc binary, NOT `pnpm run build`
`pnpm run build` re-runs a dependency-status check that triggers the monorepo install and
fails (it reports `failed: true` running the workspace install). Run the compiler directly:
```bash
cd libs/incremental
./node_modules/.bin/tsc -p tsconfig.build.json
```
For a `wrangler.toml` `[build] command`, NEVER use `npx --yes pnpm install
--frozen-lockfile && pnpm run build` (fails in isolated subdir). Use a cross-platform
Node call so execa doesn't try to exec a sh script on Windows:
```toml
[build]
command = "node my-worker/node_modules/typescript/bin/tsc -p my-worker/tsconfig.json"
```
(The `.bin/tsc` is a sh/cmd wrapper that execa on Windows cannot directly spawn;
`node .../typescript/bin/tsc` works on every OS.)

## 3. ESM executable output requires NodeNext + explicit .js extensions
`module: "ESNext"` + `moduleResolution: "Bundler"` compiles but produces `import './foo'`
WITHOUT extension → Node ESM throws `ERR_MODULE_NOT_FOUND` at runtime. Fix:
```jsonc
{ "compilerOptions": { "module": "NodeNext", "moduleResolution": "NodeNext" } }
```
AND add `.js` to every relative import in source: `import { X } from './foo.js'`.
(Vitest still runs fine with Bundler; only the emitted `dist/` needs NodeNext.)

## 4. tsc rootDir vs test files
`tsc` errors `File 'test/x.test.ts' is not under 'rootDir' 'src'` when `include` globs
both. Keep a `tsconfig.build.json` that extends the base but narrows:
```jsonc
{ "extends": "./tsconfig.json", "compilerOptions": { "rootDir": "./src" },
  "include": ["src/**/*.ts"] }
```
Run `tsc -p tsconfig.build.json` for emit; keep the broad `tsconfig.json` for vitest/IDE.

## 5. vitest needs a local config (parent workspace interference)
Without it, vitest finds the root `vitest.workspace.ts` and errors
`references a non-existing file .../vitest.config.ts`. Add a local one:
```ts
import { defineConfig } from 'vitest/config';
export default defineConfig({ test: { include: ['test/**/*.ts'], environment: 'node', globals: true } });
```
Run: `./node_modules/.bin/vitest run --config vitest.config.ts`

## 6. Don't embed HTML/JSX in a .ts template literal
A `function dashboardHtml() { return \`<!DOCTYPE html>...<script>...\` }` makes tsc parse
`<script>`/`<div>` as JSX (even without jsx config) → `TS1005` cascade. Extract to a
standalone `dashboard.html` and read it at runtime:
```ts
import { readFileSync } from 'node:fs';
function dashboardHtml(): string {
  return readFileSync(new URL('./dashboard.html', import.meta.url), 'utf-8');
}
```
When importing the built file, fall back to `../src/dashboard.html` too (dist path).

## 7. HashLock must be DETERMINISTIC for verify() round-trips
A `hashLock(obj)` using `Math.random()` produces a different hash every call, so any
`verifyZeroHallucination(artifact)` recomputing the hash fails. Use a deterministic FNV-1a
over `JSON.stringify(obj)` — no randomness.

## 8. Incremental DeltaTracker must persist per-source state
`DeltaTracker.getChanges(key, data)` filters `version > lastSeen[key]`. To track deltas
ACROSS multiple `process()` calls for the same source, store trackers in a `Map<source,
DeltaTracker>` and reuse — not a fresh `new DeltaTracker()` per call (that resets seen=0
and returns everything every time). Type it `new DeltaTracker<T>()` (infer from rows) rather
than hard-binding `DeltaTracker<{version?:number}>` (which blocks subtype return).

## 9. Keep node_modules out of git
After `pnpm install --ignore-workspace`, `git add <dir>` sweeps in `node_modules/`.
Add `<dir>/.gitignore` with `node_modules/` + `dist/` BEFORE committing, or
`git rm -r --cached <dir>/node_modules` + amend if it already landed.
