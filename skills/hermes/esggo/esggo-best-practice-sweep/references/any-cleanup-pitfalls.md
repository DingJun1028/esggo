# any-cleanup pitfalls (Devin-tool-driven sweeps)

Session 2026-08-14. Running `npx tsx .devin/scripts/any-type-eliminator.ts --check`
and `error-handling-fixer.ts --check` from commit `619c8f23a`.

## 1. `unknown[]` is NOT a safe drop-in for `any[]` in dynamic fn-library boundaries

`src/lib/omni-core/omni-function.ts` had `type FnImpl = (...args: any[]) => unknown`
with an eslint-disable. Replacing `any[]` → `unknown[]` breaks EVERY `fns.set('x', (a: T) => ...)`
call site with TS2345: "Type 'unknown' is not assignable to type 'T'" — because
function parameters are contravariant. 8 call sites failed typecheck.

**Rule**: keep `any[]` (with eslint-disable) for the stored fn signature; the dynamic
boundary is intentional (see sweep SKILL.md Step 5 KEEP-list). Only convert the
*leaf* `any` usages where the value is immediately narrowed (e.g. `.map((n: unknown) => …)`
then `const raw = n as Record<string, unknown>`).

## 2. Devin tool `--check` counts ≠ "fixed"

The tool's self-score / pasted "90% done / N→0" claims are the tool's PLAN, not proof
of repair. Re-run `--check` and read the emitted count:
- any-type-eliminator: claimed 0, actual `總計 any 使用: 9` (3 in omni-function boundary KEEP, 6 safe to fix).
- error-handling-fixer: claimed 21 leaks, actual `總計洩漏: 3` (nexus/route.ts:147, console/route.ts:412×2).
- add-auth-middleware: claimed 4 missing-auth routes, actual all 4 ALREADY had
  project-specific secret guards (cron/route.ts CRON_SECRET, memory/route.ts MEMORY_API_KEY).
  The tool only recognizes `unified-auth.ts` middleware pattern and mis-flags bespoke guards as "none".

**Rule**: a Devin tool existing in the repo proves scaffolding; it does NOT prove the
defect moved. Always read `--check` / `*-report.json` counts before believing N→0.

## 3. Safe `any`→`unknown` replacements that DID pass typecheck this session

- `Record<string, any>` → `Record<string, unknown>` (packages/omni-agent/src/types.ts Task.params/metadata).
- `result?: any` → `result?: unknown` (TaskResult, StepResult).
- `data?: any` → `data?: unknown` (page.tsx ApiResponse, with eslint-disable kept).
- `(n: any) =>` in `.map` → `(n: unknown)` + `const raw = n as Record<string, unknown>` (note-crud.tsx).
- `as any[]` → define local `type InteractionStep = { type?: string; content?: GeminiContent }`
  then `as InteractionStep[]` (village/trends/route.ts). Do NOT use bare `as unknown[]`
  — downstream `.filter((s) => s.type)` needs the shape.
