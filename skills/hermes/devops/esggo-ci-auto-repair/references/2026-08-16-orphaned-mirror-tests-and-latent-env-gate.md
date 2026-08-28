# 2026-08-16 — 17th class (orphaned mirror tests) + 18th class (latent `.env` build gate)

Cron poll at 01:4x–02:0x (UTC+8). `oa-twins-tracker.py` → `{"action":"delegate","failures":4,
"telegram_sent":4,"issues_created":0,"newest_run_id":"31897725338","state_written":true}`.
4 failures = 2 workflows (OmniCore CI, 🌌 Sacred Pipeline) × 2 pushes (`bec0b95a3`, `3a20bc653`).

## Provenance first: both pushes were inert

Both commits touched **only `.vercelignore`** (`+4/-2`, `+10/-10`) — outside every gated scope
(ESLint `src/`+`app/`, vitest globs, working-tree secret grep). Reds inherited by construction.
`git show --stat --oneline <sha>` is the whole check; do not judge by the commit type.

## 17th class — `ERR_MODULE_NOT_FOUND`: orphaned mirror test, source tree deleted + gitignored

Failing job/step (both workflows, ONE job each):
`cut -f1,2 r31897484651.log | sort -u` → `Vitest Tests	Run Vitest`
`cut -f1,2 r31897484665.log | sort -u` → `🛡️ 原罪煉金 (Entropy Reduction)	🧪 神聖契約驗證 (Unit Tests)`

```
Failed Tests 13
FAIL tests/omni-center-cron-auth.test.ts > ... 有 CRON_SECRET 時缺少密鑰 → 401
Error: Cannot find module '/esggo-omni-center/app/api/cron/route' imported from
       /home/runner/work/esggo/esggo/tests/omni-center-cron-auth.test.ts
Serialized Error: { code: 'ERR_MODULE_NOT_FOUND' }
Test Files  3 failed | 59 passed | 3 skipped (65)
```

**Tell vs the 15th class:** here 13 *assertions* fail (real imports missing); in the 15th class
`536 passed | 0 failed` with red FILES (a `beforeAll` env fault). Read the assertion count first.

Read-only diagnosis chain:

| Command | Result |
| --- | --- |
| `git ls-tree -r origin/main --name-only \| grep -c "^esggo-omni-center/"` | **0** (was **338** at `31ff79e13`) |
| `git show origin/main:.gitignore \| grep -n "esggo-omni-center/"` | `318:esggo-omni-center/` |
| `git show --stat --oneline b4ba0af5 \| tail -1` | `681 files changed, 94949 deletions(-)` |
| `git log --diff-filter=D -1 -- esggo-omni-center/app/api/cron/route.ts` | `f122a4d1d ... tests green` (source died BEFORE the ignore) |
| `git ls-tree origin/main --name-only tests/ \| grep -iE auth` | canonical twins present: `tests/{cron,memory,omni-sync}-auth.test.ts` → import `../app/api/*/route` which **still exist** |

So the 3 `tests/omni-center-*-auth.test.ts` were orphans of a deleted mirror copy, and deleting them
is **coverage-neutral** (the canonical auth-gate tests survive). Re-tracking the source would have
undone the user's deliberate Vercel file-count reduction.

**Fix landed mid-turn by the user (`59a401880`, 01:46) — expect this.** The tell was
`git show origin/main:tests/omni-center-cron-auth.test.ts` suddenly returning
`fatal: path ... does not exist in 'origin/main'` after an earlier `git ls-tree` had listed it.
Always `git fetch` again before concluding; origin/main advanced twice inside this turn.

| Job / workflow | run 31897484651 (`3a20bc65`) | run 31899263883 (`59a40188`) |
| --- | --- | --- |
| Vitest Tests | **failure** | **success** |
| 🌌 Sacred Pipeline (overall) | **failure** | **success** |
| Build Check | `skipped` | **failure** ← unmasked |

## 18th class — `Missing .env file`: latent build gate unmasked by `needs:` going green

```
Build Check	Build	$ cross-env NEXT_TELEMETRY_DISABLED=1 NODE_OPTIONS=--max-old-space-size=1536 tsx scripts/validate-env.ts && next build
Build Check	Build	Missing .env file at /home/runner/work/esggo/esggo/.env
Build Check	Build	[ELIFECYCLE] Command failed with exit code 1.
```
18-line `--log-failed`, ONE job. `scripts/validate-env.ts` (added `379fdfdd5`, 2026-08-15 12:08)
hard-exits when no `.env` FILE exists — but CI/Vercel inject env vars and never ship one, so
`pnpm build` could never pass. `build: needs: [typecheck, eslint, test, secret-scan]` had kept the
job `skipped` for as long as Vitest was red ⇒ **unmasking, not regression**.

### Repair (PR #797, merged)

1. `scripts/validate-env.ts`
```ts
const hasEnvFile = fs.existsSync(envPath);
if (!hasEnvFile) console.warn('No .env file at', envPath, '- falling back to process.env');
const env = hasEnvFile ? loadEnvFile(envPath) : {};
```
The required-var loop already did `env[rec.key] || process.env[rec.key]`, so the gate is untouched.
2. `.github/workflows/ci.yml` — BOTH `pnpm build` steps (lines ~240 `Build`, ~299 `Build (production)`;
find them with `git grep -n "pnpm build" origin/main -- .github/workflows`) gained
`DATABASE_URL: "postgresql://build:placeholder@localhost:5432/build"`.
`DATABASE_URL` is the only `required: true` entry and appeared **nowhere** in any workflow
(`git grep -n DATABASE_URL origin/main -- .github/workflows` → empty), so step 1 alone would only have
moved the failure to `Missing required: DATABASE_URL`.

### Verification (isolated worktree `C:/Project/_verify6` off origin/main — no `.env` there = CI conditions)

Binary borrowed from the shared clone, no install: `/c/Project/esggo/node_modules/.bin/tsx`.

| Case | Condition | Output | EXIT |
| --- | --- | --- | --- |
| calibration (pre-fix) | no `.env` | `Missing .env file at C:\Project\_verify6\.env` | **1** (reproduces CI) |
| A (post-fix, CI shape) | no `.env`, `DATABASE_URL` set | `No .env file ... falling back to process.env` + `Environment validation passed (10 checks).` | **0** |
| B (gate intact) | no `.env`, no `DATABASE_URL` | `Environment validation failed:` / `- Missing required: DATABASE_URL` | **1** |
| D (local dev unchanged) | `.env` present | `Environment validation passed (10 checks).` (no warn) | **0** |

`python3 -c "import yaml; yaml.safe_load(open('.github/workflows/ci.yml'))"` → `YAML_OK`.
Full `next build` was NOT run locally (needs a full install, OOM-prone) — stated as a gap in the PR
body and delegated to the PR's own run, which proved it.

### PR run → merge → post-merge main (the authoritative surface)

- PR run `31899693523` (OmniCore CI): `conclusion=success`; `Build Check pass 1m15s`, and
  `Lighthouse CI` + `Docker Build Test` went from `skipped` to **success**.
- External `Workers Builds: esggo` / `Workers Builds: oa` failed on the PR **and** on main head
  `59a401880` (`gh api repos/<r>/commits/<sha>/check-runs`) ⇒ inherited, safe to merge.
- `gh pr view 797 --json state,mergeable,isDraft` → `OPEN / MERGEABLE / false` ⇒ landable
  (always read `isDraft`; `MERGEABLE` alone is not enough).
- Merged `2026-08-15T18:02:57Z` (squash). Post-merge main run `31900044151` (`a8f3a7c0`):
  **conclusion=success**, `Build Check success` — OmniCore CI green, Sacred green, learning-center-ci green.

## Housekeeping performed

- `(unknown)` per-run issues #793/#794/#795 all had **0 comments** ⇒ genuine uncovered surfaces.
  Posted ONE consolidated classification comment on the newest (#795, `issuecomment-5303509557`), then
  closed all three with a pointer to it. **0 new issues filed** (deliberate: root cause A already
  fixed on main, cause B tracked by the PR).
- `oa-twins-tracker.py` state was NOT hand-advanced (per the two-state-paths rule); gap scan was done
  by `headSha` instead.
- `git worktree remove --force C:/Project/_verify6` printed `Permission denied` but the worktree was
  de-registered (absent from `git worktree list`) — benign on Windows.
