# Monorepo TS Build Pitfalls — exact receipts

Condensed from a real session building `@esggo/oa-framework` + `@esggo/omni-agent-bus`
in a pnpm workspace and making the latter `import('@esggo/oa-framework')` at runtime.

## P1 — silent no-dist (root noEmit inherited)

Symptom: `tsc -p tsconfig.json` → `BUILD_EXIT=0`, but `ls dist` is empty / `dist`
dir absent.
Root cause: package tsconfig `extends ../../tsconfig.json` and root has `"noEmit": true`.
Fix applied:
```jsonc
// packages/<pkg>/tsconfig.json  (the package one, NOT root)
{ "extends": "../../tsconfig.json",
  "compilerOptions": { "outDir": "./dist", "rootDir": "./src",
    "module": "NodeNext", "moduleResolution": "NodeNext",
    "target": "ES2022", "declaration": true, "noEmit": false } }
```
After fix: `rm -rf dist && tsc -p tsconfig.json` → `dist/index.js` present.

## P2 — extensionless ESM imports

Symptom: `import { OAOrchestrator } from './core/orchestrator';` in dist →
Node `ERR_MODULE_NOT_FOUND: Cannot find module './core/orchestrator'`.
Cause: `"module": "ESNext", "moduleResolution": "Bundler"` emits no `.js`.
Fix: switch to `NodeNext`/`NodeNext` (see P1 block). Then dist contains
`import { OAOrchestrator } from './core/orchestrator.js';` — Node-resolvable.

## P3 — workspace symlink not created

Symptom: `oa-bridge.ts` does `await import('@esggo/oa-framework')` →
`Cannot find module '@esggo/oa-framework'`, even though
`packages/oa-framework` exists and is built.
Cause: `omni-agent-bus` did not declare it as a dependency, so pnpm never
symlinked it. `pnpm install` said "Already up to date".
Fix: add to `packages/omni-agent-bus/package.json`:
```jsonc
"dependencies": { "@esggo/oa-framework": "workspace:*" }
```
then `pnpm install` → `packages/omni-agent-bus/node_modules/@esggo/oa-framework`
→ symlink to `packages/oa-framework`. Import now resolves.

## P4 — pnpm runDepsStatusCheck gate

Symptom: `pnpm run test` → stack ending in `runDepsStatusCheck` / exit 1, while
the package's own tests are fine when run via `npx --no-install tsx`.
Cause: pnpm 11.5.2 blocks run-scripts when other workspace packages are
unbuilt/unsatisfied — a monorepo-state gate, not a code error.
Bypass for verification (does not change repo):
```bash
npx --no-install tsc -p tsconfig.json --noEmit --skipLibCheck   # TSC_EXIT=0
npx --no-install tsx test/smoke.ts                              # SMOKE_EXIT=0
```
Report: "`pnpm run test` blocked by workspace deps-status gate (other pkgs
unbuilt); verified via npx bypass — tests pass." Do NOT report the gate failure
as a test failure.

## P5 — optional peer dep dynamic import

Wrong: `await import('@google/adk')` (TS2307 when uninstalled) with
`// @ts-expect-error` (becomes "unused directive" under Bundler resolution).
Right (variable form, no static resolution):
```ts
const pkg = '@google/adk';
const adk = await import(pkg as string);  // graceful: try/catch → degrade
```

## P6 — execFileP stdout type

`execFileP` returns `stdout: string | Buffer`. Under `strict`, `.trim()`/regex
error. Fix: `{ encoding: 'utf8' }` option, or `String(stdout)`.
