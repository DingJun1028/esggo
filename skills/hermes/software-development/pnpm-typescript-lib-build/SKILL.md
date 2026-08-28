---
name: pnpm-typescript-lib-build
description: Build, link, verify TS lib packages in a pnpm monorepo.
version: 1.0.0
author: Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [typescript, pnpm, monorepo, esm, nodenext, build, workspace]
---

# pnpm TypeScript Library Build

Build, cross-link, and verify TypeScript **library** packages inside a pnpm
workspace so sibling packages can `import('@scope/pkg')` at runtime via Node ESM.
This is the library/runtime class — distinct from app builds (Next.js etc.,
covered by `typescript-build-cleanup`).

## When to use
- You add/fix a `packages/<name>` TS lib in a pnpm workspace and need it
  consumable by another workspace package (e.g. `import('@esggo/oa-framework')`).
- `tsc -p tsconfig.json` exits 0 but produces **no `dist/`**.
- Node throws `ERR_MODULE_NOT_FOUND` for a `./foo` import with no extension.
- `pnpm run test` fails with `runDepsStatusCheck` / `Cannot find module` for a
  sibling package that IS in the repo.
- A TS file dynamically imports an **optional peer dep** that isn't installed and
  tsc errors or an `@ts-expect-error` becomes "unused".

## Core workflow
1. **Build** with `tsc -p tsconfig.json` (not relying on root config).
2. **Link** so siblings resolve: declare `"<dep>": "workspace:*"` in the
   consumer's `package.json`, then `pnpm install`.
3. **Verify** with `npx --no-install tsc` / `npx --no-install tsx` — bypass the
   pnpm run-script gate (see Pitfall 4).

## Pitfalls (durable, all hit in one session)

### P1 — root `tsconfig.json` with `noEmit:true` silently kills `dist`
A package tsconfig that `extends` a root config containing `"noEmit": true`
inherits it. `tsc -p tsconfig.json` returns exit 0 and emits **nothing**.
The build "succeeds" but there is no `dist/`.
**Fix:** in the package tsconfig add `"noEmit": false` (overrides inherited
value). Verify with `ls dist/index.js`.

### P2 — `moduleResolution: "Bundler"` emits extensionless ESM imports
With `"module": "ESNext", "moduleResolution": "Bundler"`, tsc emits
`import { x } from './core/x';` (no `.js`). Node ESM requires the extension →
`ERR_MODULE_NOT_FOUND` at runtime even though `tsc` passes.
**Fix:** for a Node-runtime library use
`"module": "NodeNext", "moduleResolution": "NodeNext"`. tsc then emits
`import { x } from './core/x.js';` which Node resolves.

### P3 — pnpm only symlinks a workspace pkg when it's a declared dependency
`pnpm install` alone will NOT create `node_modules/@scope/<pkg>` for a package
no other package depends on. `import('@scope/pkg')` fails with
`Cannot find module` even though the package exists in `packages/`.
**Fix:** in the **consumer** package's `package.json` add the workspace dep:
`"dependencies": { "@scope/other-pkg": "workspace:*" }`, then `pnpm install`.
Now `packages/<consumer>/node_modules/@scope/other-pkg` → symlink to source.
(Add the dep even if the import is dynamic / `await import()`.)

### P4 — pnpm 11.x `runDepsStatusCheck` blocks `pnpm run <script>`
If any sibling workspace package is unbuilt or deps unsatisfied,
`pnpm run test` / `pnpm run typecheck` aborts with a `runDepsStatusCheck` stack
and exit 1 — even for a package that is itself fine. Environment/monorepo-state
gate, NOT a code error.
**Fix / verify anyway:** bypass the script gate with direct npx:
`npx --no-install tsc -p tsconfig.json --noEmit --skipLibCheck` and
`npx --no-install tsx test/smoke.ts`. Same compiler/runner the script would use,
without the workspace gate. Report honestly that `pnpm run` is blocked by the
gate; do not treat the gate failure as a test failure.

### P5 — dynamic import of optional peer dep: use the variable form
To import an optional peer dep (`@google/adk`, `genkit`, …) without tsc erroring
when uninstalled, do NOT write `await import('@google/adk')` (TS2307) and do NOT
wrap in `@ts-expect-error` (becomes "unused directive" under `Bundler` resolution).
**Fix:** route through a string variable so tsc can't statically resolve it:
```ts
const pkg = '@google/adk';
const mod = await import(pkg as string); // no TS2307, no unused directive
```
`// @ts-expect-error` is the WRONG tool here — prefer the variable form.

### P6 — `execFileP` stdout is `string | Buffer`
`child_process` promisified `execFile` returns `stdout: string | Buffer` even on
Node 20+. Calling `.trim()` / regex on it errors under `strict`.
**Fix:** pass `{ encoding: 'utf8' }` to `execFileP`, or wrap with `String(stdout)`
before string ops.

## Verification ladder (prove the build works)
1. `npx --no-install tsc -p tsconfig.json --noEmit --skipLibCheck` → exit 0.
2. `rm -rf dist && npx --no-install tsc -p tsconfig.json` → `ls dist/index.js`
   exists (proves P1 fixed and emits output).
3. `grep "from './" dist/index.js | head -1` shows a `.js` extension (proves P2).
4. `ls packages/<consumer>/node_modules/@scope/<dep>` is a symlink (proves P3).
5. `npx --no-install tsx test/smoke.ts` runs the cross-package import end-to-end.
6. **Consumer re-test after editing a consumed package**: if you edited package A that
   package B imports at runtime (e.g. `oa-framework` ← `omni-agent-bus`), ALSO run B's
   canonical test (`pnpm run test` if ungated, else `npx --no-install tsx test/...`),
   not just A's own checks. A green check on A alone is STALE if B now fails to
   resolve/import it. (A system "verification stale" flag fires on exactly this.)

### P7 — `extends` a root tsconfig that carries `include`/`files` → partial `dist`
When a package tsconfig `extends` a root that itself declares `include`/`files`
(or `composite`/`references`/`incremental` + stale `.tsbuildinfo`), `tsc -p` can emit
ONLY a SUBSET of `src/**` — e.g. `dist/index.js` + `dist/core/types.js` exist but
`dist/core/orchestrator.js` is MISSING. `tsc` exits 0, so the failure is invisible
until runtime: `ERR_MODULE_NOT_FOUND` for the missing import.
Symptom check: `find dist -name '*.js'` lists fewer files than `src/**/*.ts`.
**Fix:** make the package tsconfig FULLY STANDALONE — drop `extends`, write its own
`compilerOptions` + `include` so nothing from root silently scopes the program:
```json
{
  "compilerOptions": {
    "outDir": "./dist", "rootDir": "./src",
    "module": "NodeNext", "moduleResolution": "NodeNext",
    "target": "ES2022", "lib": ["ES2022", "DOM"],
    "declaration": true, "noEmit": false, "strict": true,
    "esModuleInterop": true, "skipLibCheck": true,
    "resolveJsonModule": true, "types": ["node"]
  },
  "include": ["src/**/*.ts"]
}
```
Verify with `find dist -name '*.js'` — every source file must appear.

## Support files
- `references/monorepo-build-pitfalls.md` — exact failure transcripts → fixes.
- `templates/tsconfig.lib.json` — known-good NodeNext library tsconfig to copy.
