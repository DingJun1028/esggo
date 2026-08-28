# 2026-08-08 (09:20 cron turn) — a PR that FIXED two trackers, blocked only by draft status

Worked example for three rules added the same turn:
- `mergeable: MERGEABLE` does not mean landable (draft refuses)
- the PR-vs-main comparison is two-directional (a PR can RESOLVE causes)
- esggo's Secret Scan is filesystem-scoped, so a green scan can hide a live leak

## Snapshot

Watcher: `action=delegate`, 6 `new_failures`.

Provenance call made FIRST (per the existing rule) — all six were `event=pull_request`:

| run | conclusion | event | sha | PR |
| --- | --- | --- | --- | --- |
| 31249578667 | failure | pull_request | `9798ef06` | #470 |
| 31249578663 | failure | pull_request | `9798ef06` | #470 |
| 31249578658 | failure | pull_request | `9798ef06` | #470 |
| 31249545879 | failure | pull_request | `f25b2463` | #469 |
| 31249545861 | failure | pull_request | `f25b2463` | #469 |
| 31249508701 | failure | pull_request | `ff9e9114` | #468 |
| 31249508645 | failure | pull_request | `ff9e9114` | #468 |

`main` was unchanged at `845e74bd` since 07:44. **Zero new production incidents.** Filing per-failure
trackers (the cron prompt's literal step 3d) would have spammed three in-flight PRs.

## Stale sibling coverage on all three PRs

All three already carried an OA-TWINS comment, which naively reads as "stay silent":

| PR | newest comment | head sha at triage | verdict |
| --- | --- | --- | --- |
| #468 | 08:55:00 (@ `ced7b5f7`) | `ff9e9114` | stale |
| #469 | 08:16:02 | `f25b2463` | stale **and now factually wrong** |
| #470 | 08:56:06 (@ `2782266b`) | `9798ef06` | stale, conclusion still correct |

Only #469 warranted a re-post: its 08:16 comment asserted the PR "不會關閉 #430 的密鑰告警", which the
new sha had falsified. #468/#470 were re-verified and found unchanged in conclusion → deliberately
**not** re-commented (anti-spam), and that decision was stated in the report.

## The line-count tell

`wc -l` on each `--log-failed`, versus the same-workflow `main` baseline @ `845e74bd`:

| Workflow | main | #470 | #469 | #468 |
| --- | --- | --- | --- | --- |
| OmniCore CI | 6360 | 6343 | **465** | 6267 |
| Sacred Pipeline | 283 | 266 | 278 | **5391** |
| ESG-GO CI/CD | 724 | 707 | cancelled | cancelled |

Two anomalies, opposite directions, different meanings:
- **#469 OmniCore 465 vs 6360** → jobs stopped failing (a FIX).
- **#468 Sacred 5391 vs 283** → the failing step MOVED (unmasking; already-documented class).

## Job-level diff proved the fix

`--log-failed` alone could not show this, because passing jobs leave no lines:

```bash
gh run view 31246837246 --json jobs --jq '.jobs[] | "\(.conclusion) \(.name)"'   # main
gh run view 31249545861 --json jobs --jq '.jobs[] | "\(.conclusion) \(.name)"'   # PR #469
```

| Job | main | PR #469 |
| --- | --- | --- |
| Secret Scan | failure | **success** |
| Vitest Tests | failure | **success** |
| ESLint | failure | failure |
| TypeScript Check / Worker Check / Validate VPS Scripts / agents.yaml | success | success |

Signature counts, same pair:

| signature | main | PR #469 |
| --- | --- | --- |
| `CLI build failed` | 6 | **0** |
| `Possible secret detected` | 2 | **0** |
| `Test Files 3 failed \| 44 passed (47)` | 1 | **0** |
| `✖ N problems` | 205 (0 err) | 200 (0 err) |

Sacred Pipeline lint: 140 → 135 warnings, 0 errors. No regression anywhere.

## Why the fix was safe to endorse

```
 package.json (root devDependencies)
+    "commander": "^12.1.0",
+    "tsx": "^4.23.8",
```

`pnpm-lock.yaml` was **`+6/-0`** — purely additive. That is the route-A-compatible shape: it cannot
prune importers or roll back `overrides:`, so it does not collide with the 11th/12th-class hazard.
Contrast the stale route-B PRs #449/#450 (`+56/-86`), which remain block-warned (4 and 6 comments
already — not re-warned this turn).

This `tsx`-at-root addition is exactly the fix the 15th-class section predicted was needed, arriving
via a different agent's PR.

## The blocker

```
$ gh pr merge 469 --repo DingJun1028/esggo --squash --delete-branch
GraphQL: Pull Request is still a draft (mergePullRequest)
```

Preceding call had shown `state=OPEN mergeable=MERGEABLE mergeState=UNSTABLE` — no hint of draft.
`gh pr view 469 --json isDraft,author` → `isDraft=true author=DingJun1028` (bot-authored PRs land
under the user's account, so the author field does not license flipping it ready).

Decision: **do not `gh pr ready`, do not merge.** Post evidence, flag the single manual step.

## Turn output

- 2 comments: `pull/469#issuecomment-5225487131` (superseding re-verification),
  `issues/465#issuecomment-5225489938` (fix evidence; that tracker had **0** prior comments).
- **0** new issues — every root cause already tracked (#465/#444/#430/#429/#434). Stated explicitly
  in the report as a deliberate deviation from the prompt's literal "one issue per failure".
- 1 consolidated Telegram digest (`ok: True message_id: 21`), buffer byte-verified before dispatch
  after a sibling-write warning.
- Watcher state already `31249578667` = newest → write skipped (monotonic rule).

## Open caveat carried into the tracker

#430 must **not** be closed on the green Secret Scan. `firebase-service-account.json` is still
retrievable from git history; the scanner is filesystem-scoped. Revocation/rotation at the provider
is the close condition.
