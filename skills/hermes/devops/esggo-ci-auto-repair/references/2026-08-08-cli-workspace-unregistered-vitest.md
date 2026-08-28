# `CLI build failed` — an unregistered workspace tree masquerading as a test failure

Worked example from the 2026-08-08 07:2x cron poll. Repo `DingJun1028/esggo`, sha `ab77f5c`,
run `31245950407` (OmniCore CI). Tracker filed: **#465**.

## 1. What the watcher said vs. what was true

`gh-error-watch.py` reported two new failures and labelled them:

| run | workflow | watcher `error_type` | actual class |
| --- | --- | --- | --- |
| 31245950436 | 🌌 Sacred Pipeline | `eslint` | max-warnings only (#444) |
| 31245950407 | OmniCore CI | `typescript` | **four** causes, one brand new |

Both labels were wrong, and both `log_excerpt`s contained only `##[group]` header lines — zero real
error text. Standard outcome; re-derive from `--log-failed` every time.

## 2. One run, four independent root causes

`31245950407` decomposed by failing JOB:

| job | real signal | tracker |
| --- | --- | --- |
| Validate VPS Scripts | `vps/scripts/setup-infrastructure.sh: line 783: syntax error near unexpected token '}'`; also `FAIL immediate-deploy-omni.sh` | existing #433 |
| ESLint | `✖ 205 problems (0 errors, 205 warnings)` → `--max-warnings` | existing #444 |
| Vitest Tests | `Error: CLI build failed` ×3 | **new → #465** |
| Secret Scan | `##[error]Possible secret detected in source code — aborting.` | existing P0 #430 |

Filing one issue "for the run" would have buried the single new cause under three known ones.

## 3. The signature, and the tell that decides the diagnosis

```
FAIL cli/esggo-cli/src/index.test.ts [ cli/esggo-cli/src/index.test.ts ]
Error: CLI build failed
 ❯ cli/esggo-cli/src/index.test.ts:17:33
     15|  beforeAll(() => {
     16|    const build = spawnSync('npx', ['tsx', src, '--version'], { encoding…
     17|    if (build.status !== 0) throw new Error(
       |                                  ^
FAIL cli/oa-cli/src/index.test.ts    [ same, 17:33 ]
FAIL cli/omnicli/src/index.test.ts   [ same, 17:33 ]

 Test Files  3 failed | 44 passed (47)
      Tests  536 passed | 18 skipped (554)
```

**Three test FILES failed and ZERO assertions failed.** `536 passed | 18 skipped`, nothing in the
failed column. That combination can only mean a `beforeAll` hook threw — the environment is broken,
not the code. Reading `FAIL <testfile>` as "the CLI tests are broken" sends you into the CLI source
and wastes the turn.

## 4. Evidence chain — three read-only commands, no install, no checkout

```bash
cd /c/Project/esggo && git fetch origin --quiet

# (a) the package declares tsx itself
git show origin/main:cli/esggo-cli/package.json
#   "devDependencies": { "@types/node": "^20.0.0", "tsx": "^4.7.0",
#                        "typescript": "^5.5.0", "vitest": "^2.1.0" }

# (b) but cli/* is NOT a workspace member
git show origin/main:pnpm-workspace.yaml | sed -n '/^packages:/,/^overrides:/p'
#   packages:
#     - 'apps/*'
#     - 'apps/*/functions'
#     - 'packages/*'
#     - '.'
#   ← no cli/*

# (c) and the lockfile has no cli/ importer
git show origin/main:pnpm-lock.yaml | grep -nE "^  (cli/|apps/|packages/|\.)"
#   .:  apps/cf-tunnel-manager:  apps/gateway:  apps/learning-center:
#   apps/learning-center/functions:  apps/omni-blueprint-hub:  apps/universal-translator:
#   packages/cli:  packages/errors:  packages/oa-framework:  packages/omni-agent:
#   packages/omni-agent-bus:  packages/shared:  packages/ui:

# and the root has no tsx to fall back on
git show origin/main:package.json | grep -nE '"(tsx|typescript|vitest|ts-node)"'
#   "ts-node": "^10.9.2",  "typescript": "^5.9.3",  "vitest": "^4.1.9"   ← no tsx
```

Conclusion: `pnpm install --frozen-lockfile` never installs `cli/*`, so no
`node_modules/.bin/tsx` exists; `npx tsx` falls through to a registry fetch and exits non-zero.
The root vitest glob still *collects* `cli/*/src/index.test.ts`, so the tests run with dependencies
that were never installed.

### TRAP: `packages/cli` is not `cli/`

Step (c)'s importer list contains `packages/cli`. Skimming it reads as "cli is registered". It is a
different package under the `packages/*` glob. Match the exact `cli/` prefix.

## 5. Repairability decision — read (c) before proposing anything

| lockfile already has the importers? | adding the glob to `packages:` is | correct cron action |
| --- | --- | --- |
| yes | lockfile-neutral, a one-line edit | fix inline |
| **no** (this case) | a lockfile regeneration | **file a tracker only** |

Because (c) was empty, adding `- 'cli/*'` forces three new importers into `pnpm-lock.yaml`. That
collides with the 11th/12th-class hazard: stale PRs **#449** and **#450** were still open, each
changing only `pnpm-lock.yaml` on an older base. Whichever landed last would roll the other back and
re-introduce `ERR_PNPM_OUTDATED_LOCKFILE` — the P0 that #455 had fixed hours earlier. So the turn
filed #465 with the full method and deliberately did not execute it.

Recorded acceptance criteria (so a foreground session can verify unambiguously):

- `grep -c "CLI build failed"` on the new log → `0`
- `Test Files` line → `47 passed` (from `3 failed | 44 passed`)

Method recorded in the tracker, isolated worktree only:

```bash
git worktree add -b auto-repair/cli-workspace-<date> C:/Project/_verify origin/main
cd C:/Project/_verify
# add  - 'cli/*'  to pnpm-workspace.yaml packages:
pnpm install --lockfile-only
pnpm install --frozen-lockfile --lockfile-only        # must print EXIT=0
git add pnpm-workspace.yaml pnpm-lock.yaml            # explicit paths, never git add -A
```

Lighter alternative named in the tracker: exclude `cli/**` from the root vitest config — zero
lockfile churn, but it silently drops CLI coverage, so it is a product decision, not an auto-repair.

## 6. Confirming the previous fix held (same turn)

The 14th class (`react-hooks/static-components`) had been repaired earlier. One grep proved it across
both newest logs:

```bash
grep -c "static-components" r31245950407.log r31245950436.log
#   r31245950407.log:0
#   r31245950436.log:0

grep -ohE "✖ [0-9]+ problems \([0-9]+ errors, [0-9]+ warnings\)" r31245950407.log r31245950436.log
#   ✖ 205 problems (0 errors, 205 warnings)
#   ✖ 140 problems (0 errors, 140 warnings)
```

`20 errors → 0 errors` in both workflows; both now red **only** on `--max-warnings` (#444).
`learning-center-ci` also flipped to `success` (its `TYPES_OUT_OF_SYNC` cleared), and

```bash
grep -l "ERR_PNPM" r31245950407.log r31245950436.log   # no output ⇒ install stage still clean
```

confirmed no install-stage regression. All of that is *unmasking*, not regression — state it in
words in the tracker or the next poll re-files.

## 7. Housekeeping notes from this turn

- Dedup pre-check before filing caught nothing, but is worth the one call because it also covers
  **closed** issues, which `gh issue list --state open` does not:
  ```bash
  gh search issues --repo DingJun1028/esggo "CLI build failed" --json number,title,state --limit 10
  #   []
  ```
- The watcher had **already advanced its own state file** (`1|31245988797`, equal to the newest run).
  Read it before writing: the value is monotonic, so "already at newest" means there is nothing to
  write, not that the write failed.
- Stale PRs #449 / #450 carried **4** and **6** comments respectively — already saturated with
  block-warnings. Cheap check before deciding to add another:
  ```bash
  gh issue view <pr#> --repo DingJun1028/esggo --json comments --jq '.comments | length'
  ```
  Correct action at that count is silence on the PR, recorded in the report.
- The sibling-write warning fired on `_auto_repair_alert.txt` as expected; the
  `wc -c` + `head`/`tail` verification before dispatch confirmed the bytes were ours, and the send
  returned `HTTP 200` / `ok: True message_id: 16`.
