# Proven verify sequence — esggo monorepo TS package

Captured 2026-08-10 while landing `packages/omni-agent-bus/src/patterns/*` (6 §12 advanced-integration
patterns + incremental-output infra). Use this exact shape; it avoids the pnpm gate + bare-`npx` hang.

## Setup facts (this repo)
- Package-local binaries are preinstalled: `packages/<pkg>/node_modules/.bin/{tsc,tsx}` (tsc 5.9.3, tsx 4.23.8).
- `pnpm run build`/`pnpm run test` timed out at 180s foreground (workspace `runDepsStatusCheck` gate + slow resolve).
- The `write_file`/`patch` lint hook hangs on bare `npx` at 30s — its errors are noise; ignore them.
- Node here is v24.x; `type: module` + NodeNext everywhere.

## Sequence (copy-paste, adjust `<pkg>`)
```bash
cd packages/<pkg>

# 1) Typecheck / build — background because tsc can take 30-180s
./node_modules/.bin/tsc            # emit dist/  (exit 0 = clean)
# or: ./node_modules/.bin/tsc --noEmit   # typecheck only

# 2) Run each smoke test directly (don't rely on `pnpm run test`)
./node_modules/.bin/tsx test/smoke.ts
./node_modules/.bin/tsx test/deploy-gate.smoke.ts
./node_modules/.bin/tsx test/oa-bridge.smoke.ts
./node_modules/.bin/tsx test/patterns.smoke.ts
```
Run the test lines as a chained `&&` in one background command and capture exit codes:
```bash
./node_modules/.bin/tsx test/smoke.ts && \
./node_modules/.bin/tsx test/deploy-gate.smoke.ts && \
./node_modules/.bin/tsx test/oa-bridge.smoke.ts && \
./node_modules/.bin/tsx test/patterns.smoke.ts; echo "FULL_EXIT=$?"
```
Real evidence from this session: `FULL_EXIT=0`, `patterns` printed `=== 結果: 23 passed, 0 failed ===`
and `✅ 全部通過 — §12 六模式 + 增量基礎設施合規`. `tsc` printed no errors → `BUILD_EXIT=0`.

## Gotcha: loop naming
A shell loop `for t in smoke deploy-gate oa-bridge patterns; do tsx test/$t.smoke.ts` turns `smoke`
into `smoke.smoke.ts` (file not found). Files are already named `<name>.smoke.ts`; call
`tsx test/<name>.smoke.ts` literally, or keep the list in sync with exact filenames.

## Real bugs caught by the run (so you know what "green" actually validates)
1. `Object.freeze(record)` then `record.status = 'done'` → `TypeError: Cannot assign to read only property`.
   Fix: store mutable status in a separate `Map` (`statusMap.set(id,'done')`).
2. `verify5T('short text')` passed when it should fail — the 5T gate has length + keyword gates.
   Fix: long fixture with all 5 keyword classes; add negative case.
3. Cross-file type import used `'./types.js'` instead of `'../types.js'` → TS2305.
4. Barrel `export type { EventRecord }` from a file that only had `interface EventRecord` (not exported) → TS2459.
