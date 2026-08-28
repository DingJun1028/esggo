# 2026-08-08 08:50 cron turn — stale sibling coverage + a failing step that MOVED

Two lessons in one poll. Both are about **not misreading a changed shape as a changed outcome**.

## Snapshot

Watcher: `action=delegate`, **6 new failures**. Provenance resolved first (before any log grep):

```
31249036755 failure pull_request 2782266b jules-omni-core-evidence-update…  🌌 Sacred Pipeline
31249036749 failure pull_request 2782266b jules-omni-core-evidence-update…  ESG-GO CI/CD
31249036744 failure pull_request 2782266b jules-omni-core-evidence-update…  OmniCore CI
31248970534 failure pull_request ced7b5f7 bolt/usememo-optimizations…       OmniCore CI
31248970532 failure pull_request ced7b5f7 bolt/usememo-optimizations…       🌌 Sacred Pipeline
31248970531 failure pull_request ced7b5f7 bolt/usememo-optimizations…       ESG-GO CI/CD
```

All `event=pull_request` → PR #470 (`2782266b`) and PR #468 (`ced7b5f7`). `main` unchanged at
`845e74bd` (07:44). **Zero** production breakage.

## Lesson 1 — sibling coverage is sha-scoped

Both PRs already had an OA-TWINS comment, which by the plain anti-spam rule means "stay silent":

| PR | existing comment | head sha at triage | verdict |
| --- | --- | --- | --- |
| #468 | `08:13:41` | `ced7b5f7` pushed 08:42 | **stale** |
| #470 | `08:19:09` (on `b13260c6`) | `2782266b` pushed 08:44 | **stale AND now wrong** |

#470's comment warned of `+1 @typescript-eslint/no-explicit-any`. On the new sha that increment was
gone: OmniCore `205 → 196` (**−9**). Staying silent would have left a false regression warning
standing. Rule: compare comment timestamp against the head sha's run before deciding to skip.

## Lesson 2 — the failing STEP moved (unmasking, not regression)

Line counts were the first clue:

| Workflow log | main `845e74bd` | PR #470 `2782266b` | PR #468 `ced7b5f7` |
| --- | --- | --- | --- |
| Sacred | 283 | 266 | **5397** |
| ESG-GO | 724 | 709 | **5829** |

`cut -f1,2 <log> | sort -u` named the culprit instantly:

- main Sacred → `🛡️ 原罪煉金 (Entropy Reduction)` / `🔍 零幻覺靜態掃描 (Linting)`
- PR #468 Sacred → `🛡️ 原罪煉金 (Entropy Reduction)` / `🧪 神聖契約驗證 (Unit Tests)`

Same job, **different step**. Both steps run sequentially inside that one job, so on `main` the job
died at Linting and Unit Tests never ran. #468 reduced warnings below the gate → Linting passed →
the job reached Unit Tests → hit the pre-existing `CLI build failed` (×9) with
`Test Files 3 failed | 44 passed (47)` — byte-identical to what `main`'s OmniCore CI already shows
(tracker #465). An improvement caused a new-looking red.

## Same-workflow evidence table (the actual no-regression proof)

| Workflow (ESLint) | main `845e74bd` | #470 `2782266b` | #468 `ced7b5f7` |
| --- | --- | --- | --- |
| OmniCore CI | `205 (0 errors, 205 warnings)` | `196 (0 errors)` | `190 (0 errors)` |
| 🌌 Sacred | `140 (0 errors, 140 warnings)` FAIL | `131 (0 errors)` FAIL | Lint **passed** |

| Signal | main | #470 | #468 | tracker |
| --- | --- | --- | --- | --- |
| `CLI build failed` (OmniCore) | 6 | 6 | 6 | #465 |
| `Test Files 3 failed \| 44 passed (47)` | yes | yes | yes | #465 |
| `Possible secret detected` | 2 | 2 | 2 | #430 |
| Trivy `Total: 8 (HIGH: 7, CRITICAL: 1)` | yes | yes | yes | #429 |
| Trivy `Total: 4 (HIGH: 4, CRITICAL: 0)` ×2 | yes | yes | yes | #429 |
| Trivy `Total: 1 (HIGH: 0, CRITICAL: 1)` | yes | yes | yes | #429 |
| `static-components` | **0** | **0** | **0** | closed #441 |

Both PRs reduce warnings; error count is `0` everywhere. Zero error-level regression.

## Outcome

- **0** new issues (every cause already tracked: #465 / #444 / #430 / #429 / #434).
- **2** superseding PR comments — [#468](https://github.com/DingJun1028/esggo/pull/468#issuecomment-5225409601)
  (unmasking explained), [#470](https://github.com/DingJun1028/esggo/pull/470#issuecomment-5225410044)
  (supersedes the stale `+1 warning` finding).
- **1** consolidated Telegram digest (`ok: True message_id: 20`); sibling-write warning fired on the
  shared buffer, so `wc -c` (1699) + `head` confirmed the bytes were ours before sending.
- Watcher state already `31249036775` = newest run id ⇒ **write skipped** deliberately.

## Reusable commands

```bash
# provenance first — before any log grep
gh run list --repo DingJun1028/esggo --limit 20 \
  --json databaseId,workflowName,conclusion,headSha,event,headBranch,createdAt \
  --jq '.[] | "\(.databaseId) \(.conclusion) \(.event) \(.headSha[0:8]) \(.headBranch) \(.workflowName)"'

# which JOB / STEP actually failed
cut -f1,2 /c/Project/_ci_logs/<log>.log | sort -u

# same-workflow lint deltas across three logs in one call
grep -ohE "✖ [0-9]+ problems \([0-9]+ errors, [0-9]+ warnings\)" main.log pr_a.log pr_b.log

# Vitest tally survives ANSI escapes only with -a and a plain pattern
grep -ah "Test Files" <log> | tail -2
```

Note: the ANSI-coloured Vitest summary does **not** match a strict
`Test Files +[0-9]+ failed \| ...` regex (escape codes sit between the fields) — `grep -ah "Test Files"`
then read the line.
