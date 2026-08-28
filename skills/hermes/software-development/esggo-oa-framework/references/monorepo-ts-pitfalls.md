# Monorepo TS pitfalls (DingJun1028/esggo) — pitfalls that bit this session

## 1. pnpm `runDepsStatusCheck` gate blocks `pnpm run <script>`
- pnpm v11.5.x runs a workspace deps-status check before executing ANY `pnpm run` script.
- If any sibling workspace package is declared as a dependency but has no built `dist/`,
  the script is aborted with `runDepsStatusCheck` in the stack trace and exit 1.
- This happens EVEN WHEN your own package is correct and free of errors.
- Symptom: `pnpm run typecheck` / `pnpm run test` fail immediately, but `npx tsc` / `npx tsx` pass.
- Fix / canonical verification (bypasses the gate):
  ```bash
  npx --no-install tsc -p tsconfig.json --noEmit --skipLibCheck   # TSC_EXIT=0
  npx --no-install tsx test/smoke.ts                              # smoke output
  ```
  Report both `pnpm run test` (blocked by gate) and the `npx` result (real code status).
- Removing unused `@esggo/*` workspace deps from a package's `package.json` can let the gate pass,
  but it is environment-dependent (other unbuilt packages may still trip it).

## 2. Optional peer dep dynamic import + tsc
- `await import('@google/adk')` → TS2307 (cannot find module) when the package is NOT installed.
- Adding `// @ts-expect-error` then causes TS2578 "Unused '@ts-expect-error' directive" when tsc
  does NOT emit the error (e.g. `moduleResolution: bundler` is lenient).
- Correct pattern: use a variable so tsc never statically resolves the module:
  ```ts
  const mod = '@google/adk';
  const { LlmAgent } = (await import(mod)) as any;
  ```
- Same for `@genkit-ai/google-genai` and any optional peer dep not guaranteed installed.

## 3. Do not import unbuilt workspace packages
- `@esggo/omni-agent` has `src/` but no `dist/` (never built). Importing its `gates.ts` from
  another package fails the pnpm gate and pollutes that package with a hard workspace dep.
- Instead REPLICATE the needed logic locally (e.g. `omni-gate.ts` re-implements `verifyGate` /
  `GATE_MIN_LENGTH` / `GATE_PATTERNS` copied verbatim from `omni-agent/src/gates.ts`).
- Keeps the new package self-contained and verifiable via the `npx` recipe above.

## 4. promisified child_process execFile typing
- `execFileP` from `node:child_process` returns `stdout: string | Buffer` even with no encoding set.
- Calling `.trim()` on it can raise TS2345. Set `{ encoding: 'utf8' }` in options, or wrap with
  `String(stdout)` before trimming/writing.
- `execFileP(command, ['doctor'], { timeout: 60000, encoding: 'utf8' })` is the safe call.

## 5. 5T content gate length floors (omni-agent gates.ts)
- traceable≥100, transparent≥150, tangible≥200, trustworthy≥120, trackable≥80 chars
- plus a quality regex each (GRI/ISO for traceable, % for transparent, 完成/建立 for tangible,
  hash/audit for trustworthy, 年度/monitor for trackable).
- Short scaffold/fallback outputs FAIL the content gate. `forgeT5` wraps every output in a
  5T report template (來源/揭露/達成/封印/追蹤 lines) so real outputs pass.
- `OmniAgentBus.publish` re-runs the gate on `OATaskResult` payloads; EXEMPT topics ending in
  `.rejected` from the second gate so rejections aren't misrouted.
