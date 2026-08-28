# Burying mechanism #3 + the freshly-filed `(unknown)` issue as the only gap
_2026-08-08, 12:23Z cron poll. Outcome: 0 issues, 1 comment, 1 digest, 1 state advance._

## 1. A third way the state pointer buries failures

Mechanism #1 blames the later `workflow_run` auto-repair run (always the highest id).
Mechanism #2 blames runs that are still in flight at poll time (empty `conclusion`).
**Mechanism #3 needs neither:** within a single push fan-out, run_ids are assigned in an order
unrelated to which workflows fail, so an ordinary *passing* sibling can hold the highest id of the
batch. `save_state` parks the pointer on that success and the same push's failures sit below it.

Observed (push `12:22`, watcher poll `12:23:26`, head `8bb171c0` = docs-only):

```
31257103192  failure  OmniCore CI                        ← buried
31257103193  failure  🌌 ESG GO Sacred Pipeline          ← buried
31257103201  (running) Build & publish AI Station image
31257103202  success  learning-center-ci                 ← pointer parked HERE
```

Watcher output:

```json
{ "new_failures": [], "action": "none", "newest_run_id": "31257103202" }
```

Mechanisms #2 and #3 fired **together**: all four runs were still running at poll time, and the id
that eventually became the pointer belonged to a *success* sitting above two failures. The next
poll's `databaseId > 31257103202` filter would have skipped both failures permanently.

### Rule
**Never treat "pointer ≥ run_id" as evidence a run was handled.** Select the gap scan on the newest
`headSha` and ignore run_id ordering entirely — the only filter immune to all three mechanisms:

```bash
gh run list --repo DingJun1028/esggo --limit 15 \
  --json databaseId,workflowName,conclusion,headSha,event,createdAt \
  --jq '.[] | "\(.databaseId) \(.conclusion // "RUNNING") \(.event) \(.headSha[0:8]) \(.workflowName)"'
```

Runs printing `RUNNING` are neither pass nor fail — re-poll that sha before closing the turn. Here a
later re-poll returned `failure / failure / success` for the three settled push runs.

Then advance the pointer past everything handled (monotonic; read before writing):

```bash
gh run list --repo DingJun1028/esggo --limit 1 --json databaseId --jq '.[0].databaseId'
# → 31257270434, written to ~/.hermes/scripts/gh-error-watch.state and read back to confirm
```

## 2. `wc -l` is the cheapest no-regression pre-check

The skill already uses line-count *gaps* as a tell that a step moved or that jobs started passing.
The **identity** case is the free mirror: same workflow, different sha, identical line counts implies
a byte-identical failure set.

| workflow | main `035cba3c` | main `8bb171c0` |
| --- | --- | --- |
| OmniCore CI | 6360 lines | **6360 lines** |
| Sacred Pipeline | 283 lines | **283 lines** |

Run it before any grep, then confirm with the signal table — never rely on it alone.

## 3. Full inherited-red evidence (docs-only push)

head `8bb171c0c` = `docs(soul): 整合無作協定 §15 / 全域最佳實踐覺 §16 與 v4 FUSION 生產級聖典`.

Failing job/step, identical on both shas:

```
ESLint        Run ESLint
Secret Scan   Scan for committed secrets
Vitest Tests  Run Vitest
```

| Signal | `035cba3c` (31253147510) | `8bb171c0` (31257103192) |
| --- | --- | --- |
| `CLI build failed` | 6 | 6 |
| `Possible secret detected` | 2 | 2 |
| `Test Files` | `3 failed \| 44 passed (47)` | `3 failed \| 44 passed (47)` |
| ESLint summary | `205 problems (0 errors, 205 warnings)` | `205 problems (0 errors, 205 warnings)` |
| Sacred lint | `140 (0 errors, 140 warnings)` | `140 (0 errors, 140 warnings)` |

`static-components` = **0** (14th class stayed fixed); no `ERR_PNPM_*`, no `TYPES_OUT_OF_SYNC`.
Job → tracker mapping: Vitest → #465 (15th class), Secret Scan → #430, ESLint → #444. All pre-existing
⇒ **0 new issues**.

Remember the ANSI trap when reading these: `grep -ah "Test Files" <log> | sed -e 's/\x1b\[[0-9;]*m//g'`.
A spaced `-E` pattern returns empty because colour codes sit between the tokens.

## 4. The freshly-filed `(unknown)` issue is usually the ONE uncovered surface

In the steady state, trackers are the *most* likely surface to be sibling-covered and the newest
`(unknown)` issue the *least*, because `auto-repair.yml` files it seconds after the run settles —
typically after every sibling has finished its own poll.

| Surface | comments | newest | verdict |
| --- | --- | --- | --- |
| #465 tracker | 3 | 12:08:53Z | covered, facts unchanged → silent |
| #430 tracker | 5 | 11:47:28Z | covered → silent |
| #444 tracker | 1 | 11:47:16Z | covered → silent |
| PR #472 | 6 | — | covered → silent |
| **#474 `(unknown)`** | **0** | created 12:24:25Z | **genuine gap → post here** |

Check it last but expect it to be the gap. Cheap probe: `gh issue view <n> --json comments --jq '.comments | length'`.

## 5. Fourth "nothing-to-do" shape

`action=none` + burying (#2/#3) + docs-only push + every red tracked and sibling-covered + a brand-new
`(unknown)` issue at 0 comments ⇒ **0 issues, 1 comment, 1 digest, 1 state-pointer advance.**

The state advance is part of the deliverable here, not housekeeping: without it the two buried
failures are skipped forever.
