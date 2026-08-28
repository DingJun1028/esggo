---
name: typescript-build-cleanup
description: "Fix Next.js/TS build errors one-by-one without retry loops."
version: 1.0.0
author: Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [typescript, nextjs, turbopack, build, remediation]
    related_skills: [systematic-debugging, test-driven-development]
---

# TypeScript Build Cleanup

## Overview

Production builds often fail with a sequence of type errors. The fastest path is **fix one error, rebuild once, repeat** — not retrying the same build in a loop.

**Core principle:** Every rebuild must be preceded by a code change, not a re-run of the same command.

## When to Use

- `pnpm run build` / `next build` fails during TypeScript validation
- Turbopack reports 1-N type errors across `app/`, `lib/`, `src/`
- Error pattern: missing imports, wrong API names, duplicate object keys, undefined variables, constructor signature mismatches
- After dependency upgrades that change return types or method names

## Anti-Loop Rule

**STOP immediately when you see:**
- The same tool returns the same error with identical arguments >= 2 times
- The tool emits `same_tool_failure_warning` or `repeated_exact_failure_warning`
- No file content changed between retries

**Mandatory actions before retrying:**
1. Read the exact failing file and line
2. Fix the reported error in the source file
3. Rebuild once

If a patch tool reports success but the file content is unchanged, switch strategy immediately:
- `patch` -> `write_file` or `execute_code`/`sed`
- `search_files` -> `terminal` + `rg`/`find`
- `read_file` on glob paths -> `terminal` with exact quoted path

## Sequential Remediation Pattern

### 1. Capture the first error only

Turbopack/TypeScript stops at the first error. Fix that one, rebuild, and capture the next error. Do not batch-fix 10 errors at once.

### 2. Fix minimal, verified changes

For each error, prefer the smallest possible edit:
- Missing import -> add the import
- Wrong API/method name -> correct the method name, then search the repo for remaining occurrences
- Duplicate object key -> remove the duplicate, keep the intended final value
- Possibly undefined -> add a guard, assertion, or narrow the type
- Implicit any -> add a type annotation or cast
- `params` shape mismatch in Next.js 16 -> change to `Promise<{ ... }>` and `await params`

### 3. Common Next.js 16 / TS patterns

| Error pattern | Fix pattern |
|---------------|-------------|
| `params` type mismatch | `{ params }: { params: Promise<{ id: string }> }`, then `const { id } = await params;` |
| Firebase Admin `setCustomClaims` not found | Rename to `setCustomUserClaims`; grep repo for stale usages |
| `docRef.id` possibly undefined | Guard with `if (!docRef) return ...;` before accessing `.id` |
| Module has no exported member | Remove the stale import; inline the local interface if it was only used for typing |
| Duplicate object key | Remove all but the intended final key/value |
| `result.data` possibly wrong shape | Cast or widen the utility return type once at the source |
| Constructor signature mismatch | Read the library types or package README; pass an options object instead of positional args |

### 4. After all build errors clear

Run the full verification suite:
```bash
pnpm run test
pnpm run lint
pnpm run typecheck
pnpm run check
pnpm run build
```

If `build` still fails, the new error is a new problem — apply the same sequential pattern.

## Pitfalls

- **Do not** run `pnpm run build` twice without changing code between runs.
- **Do not** fix 8 errors at once and then rebuild; you will not know which change fixed or broke what.
- **Do not** trust a tool's success message blindly if the read-back shows the same content.
- **Do not** trust a typed import is valid because the path exists; verify the exported member actually exists.
- **Alias-rewrite trap (`@/x` → `@x` or reversed):** An alias key existing in `tsconfig.json` `paths` does NOT make a rewrite safe. `@/*` and `@lib/*` (and similar) can map to DIFFERENT physical dirs — e.g. in esggo, `@/*` → `./src/*` but `@lib/*` → `./lib/*`. A "normalization" `@/lib/foo` → `@lib/foo` then silently breaks resolution because the module lives in `./src/lib/foo`, not `./lib/foo`. Decisive check before staging any alias rewrite:
  ```bash
  npx tsc --traceResolution -p tsconfig.json 2>&1 | grep -A4 "moduleName"
  ```
  Read the `Trying substitution ... candidate module location: './lib/foo'` line and confirm that path exists on disk. If the trace points at a non-existent dir while the original `@/lib/foo` pointed at an existing one, REVERT the rewrite. Under a "commit/stage everything" authorization, do NOT blindly `git add` all modified files — verify build-impacting edits (alias rewrites, config changes) first, exactly as superpowers' "Evidence over claims" demands.
- **Do not** retry the same patch on the same region after two failures; read the file back and use a different edit method.
- **Stop immediately** when the runtime emits `repeated_exact_failure_warning` or `same_tool_failure_warning`. These mean you are in a retry loop; switch strategy before the next build.
- **Avoid same-file thrashing:** if you have already edited a file and the next build still fails in that same file, read the surrounding context first instead of blind-retrying. On Windows, paths with `[` `]` can mislead `read_file`/`patch`; fall back to `terminal` + `sed`/`rg` for those files.
- **Bulk regex patches on type shapes can introduce duplicates:** if you use a regex to add an index signature to `evidence:` blocks across many files, it can land twice on the same block or create `finalEffect: string;;`. After a bulk patch, run a normalization script to remove duplicate semicolons and duplicate consecutive index-signature lines before rebuilding.
- **Canonical type first, inline duplicates second:** when a core interface like `IComponentCore.evidence` is defined in multiple places, patch the canonical/root type first (`src/types/...`), then normalize inline re-declarations. Don't rely on a single regex sweep over the whole repo to be idempotent.
- **Interface/class name collision:** a module exporting both `interface Foo` and `class Foo` can break structural typing for factory-returned objects. Prefer one shape, or ensure the object shape satisfies both declarations explicitly.
- **Stale dependency stubs:** when a package like `@google/adk` is removed but source still imports its classes (`LlmAgent`, `Runner`), replace with local stubs that preserve the call surface rather than re-adding the dependency.
- **Duplicate object keys in spreads:** when merging with `...source`, do not also declare the same keys before the spread; TypeScript treats later duplicates as overwrites and can error. Keep only the final authoritative key after the spread.
- **`null` vs `undefined` in strict TS:** Prisma/ Zod types often require `undefined`, but database rows may emit `null`. Coerce with `?? undefined` or `|| ''` at the mapping boundary instead of loosening the schema.
- **Dev preview on Windows:** `browser_vision`/`open_preview` may fail to reach `localhost` from the Hermes desktop session and can incorrectly report a blank page. Verify with `curl -s http://localhost:3000 | head` first; if HTML is present, use `computer_use` desktop capture for visual confirmation instead of trusting the blank-page verdict.

## ESLint Warning Reduction Workflow

After a clean `build`, `pnpm run lint` may report many warnings. Use this workflow to reduce them safely:

1. **Run auto-fix first:** `pnpm eslint src/ app/ lib/ --fix --max-warnings 999`
2. **Capture the canonical count:** Run `pnpm run lint` and read the final `✖ N problems (0 errors, M warnings)` line. Do not trust intermediate counts from raw JSON parsing unless you handle the output format correctly.
3. **Fix only high-confidence, low-risk warnings first:**
   - `require()` in ESM modules → use `createRequire(import.meta.url)` at the top, or switch to `await import()` in async contexts.
   - Unused imports → remove the import statement entirely. Do not keep imports "just in case."
   - Unused variables that are local to a function → remove the assignment. Check whether the variable feeds another expression before deleting it.
4. **Avoid introducing new warnings:** When removing an unused variable, verify it is not used downstream in the same block. If it is, remove the dependent code too, or keep the variable and suppress the warning with a comment.
5. **Stop before type-architecture changes:** `any` warnings across core interfaces are structural; local patches will not clear them cleanly and may introduce regressions. Surface these as a separate refactoring task instead of mass-replacing `any` with `unknown`.

### ESLint Report Parsing Pitfalls

- `--format json` may include stderr warnings mixed with stdout, producing invalid JSON. If parsing fails, use `--format unix` and grep for ` - error ` instead.
- In ESLint JSON, `severity: 1` = warning, `severity: 2` = error. Do not treat warnings as blocking errors.
- The project's `pnpm run lint` script wraps eslint with custom tooling (`celestial-gate.ts`) that prints additional diagnostics. Always anchor on the final eslint summary line for the true count.

## Verification

The build is complete only when:
- `next build` reports success with no TypeScript errors
- All prior test/lint/typecheck gates still pass
- `pnpm run lint` shows 0 errors; warnings may remain but should not increase after your changes

## References

- `references/esggo-build-fix-log.md` — session-specific build errors fixed in C:\Project\esggo and the exact edits applied.
- `references/eslint-warning-reduction-log.md` — session-specific ESLint warning reduction patterns and counts from C:\Project\esggo.

## References

- `references/esggo-build-fix-log.md` — session-specific build errors fixed in C:\Project\esggo and the exact edits applied.
