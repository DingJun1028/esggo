# esggo OmniCore CI — round 3/4 rebase analysis + Vitest `@lib` alias root cause (PR #416)

Evidence chain from the cron session that pinned the Vitest failure and the rebase plan for
PR #416 (`fix/omnicore-ci`). Complements `esggo-omnicore-ci-2026-08-04-vps-down.md` (which
recorded the fast-fail/annotation symptoms) — this file records the ROOT CAUSE and the
rebase-conflict prediction that followed.

## Key SHAs (fetched live)
- PR #416 head `0d190841` · base `4a86408c` (1 commit / 76 files) · `mergeable_state: dirty`.
- main tip **`6185b8422`** (#418 "Refactor IComponentCore to strictly enforce cause-and-effect tracing").
- main commit **`8b9ff14c`** ("chore: unify global full-scale validation… 177 imports now use
  `@lib/*` (tsconfig contract); **add `@lib` alias in vitest.config**…") — authored
  2026-08-01 23:26Z, i.e. **AFTER** PR head run #1548 (2026-08-01 17:32Z).
  → the failure exists on the PR head precisely because the fix landed on main after the branch point.

## Vitest job identity (reverse lookup)
`GET /actions/jobs/{job_id}` is public and returns `run_id` + `workflow_name` + head_sha + steps[].
- job `91397123111` → `workflow_name: OmniCore CI`, run **`30710549207`**, failing step `Run Vitest`.
- job `91397123124` → same run, failing step `Docker syntax check`
  (annotation: `docker-compose.prod.yml docker configuration invalid` — the `config --quiet || exit 1` hardfail).

## Root cause chain (Vitest collection failure)
1. `tests/hashlock-freeze.test.ts` does `import { POST, GET } from '../app/api/hashlock/route'`
   (and `tests/api-routes.test.ts` imports more routes).
2. The PR rewrote those routes `@/lib/X` → `@lib/X` (e.g. `app/api/hashlock/route.ts`:
   `import { jsonResponse, jsonError } from '@lib/api-utils'`).
3. PR head's `vitest.config.ts` had ONLY `'@': path.resolve(__dirname, './src')` — **no `@lib` alias**
   (base `4a86408c` also lacked it; main first added it in `8bff14c`).
4. So vitest could not resolve `@lib/api-utils` while collecting the route →
   dead on **startup/collection** (seconds fast-fail + `No files found: test-results/` +
   annotation only `Process completed with exit code 1.`), exit code 1.
5. **Fix = `git rebase origin/main`**, which pulls in main's vitest `@lib` alias. Editing test files is
   the WRONG move — the touched-inspected test files (`5t-protocol`, `bus`, `omni-user-registry`,
   `omni-api`) all use relative imports and are fine.

## 3-version file comparison (the reusable technique)
Fetch the SAME file at `raw.githubusercontent.com/{owner}/{repo}/{sha}/{path}` for base / head / main tip
(use `raw.githubusercontent.com`, which has no api.github.com rate limit and separate IP budgets from browser/firecrawl).
Compare to attribute a change and predict a rebase:
- `vitest.config.ts`: base == head (both no `@lib`); main added `@lib` → **rebase is the fix**.
- `ci.yml`: base == main (main never touched it) → **rebase will NOT conflict on ci.yml**;
  the PR's only ci.yml edits (drop `2>/dev/null` on compose, demote Dockerfile `--check` to warning) apply cleanly,
  so the step-4 patch signal applies directly against the PR version.
- `app/api/hashlock/route.ts`: base `@/lib/{api-utils,five-t-protocol}`; head `@lib/{api-utils,five-t-protocol}`;
  main `@lib/api-utils` **but kept `@/lib/five-t-protocol`** (points at src/lib five-t-protocol, which EXISTS —
  the 5t-protocol test imports it). → **the `five-t-protocol` line WILL conflict on rebase**; resolve to `@lib`
  per convention. Also proves the blanket-rewrite hazard: main intentionally keeps `@/lib/*` for src/lib modules
  (Turbopack-safe re-export; see `8bff14c` message "repair sustain-write lib-side wrapper to @/lib alias").
- main ci.yml build job gained `npx prisma generate` step — three-way merge keeps it (PR edit only hits the
  validate-vps block), so no action needed.

## Repo alias rules (esggo, durable)
- `@lib/*` → root `lib/` modules. `@/lib/*` → `src/lib/` modules (deliberately kept as Turbopack-safe re-exports;
  DO NOT blanket-convert all `@/lib/` to `@lib/` — only convert when target exists in `lib/` and NOT in `src/lib/`).
- `vitest.config.ts` MUST carry a `@lib` alias, else any test that imports an app/api route fails at collection
  with `Cannot find module '@lib/…'`.