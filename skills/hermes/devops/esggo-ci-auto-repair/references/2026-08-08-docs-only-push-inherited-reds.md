# Docs-only push to main + stale-by-sha PR coverage (2026-08-08, 09:45 cron poll)

The steady-state turn shape on a busy repo: watcher says nothing new, `main` is red anyway, every
cause is already tracked, and the only real work is *re-verification*. Full evidence chain.

## 1. Watcher output — and why it was not the answer

```json
{"repo":"DingJun1028/esggo","checked_at":"2026-08-08T09:37:38Z",
 "new_failures":[],"action":"none","newest_run_id":"31250979702"}
```

The cron prompt's literal step 2 says `action == "none"` → 靜默結束. Following it would have
missed two red workflows. Gap scan by sha instead:

```
31250979702  failure  push  0bd4c3a4  🌌 ESG GO Sacred Pipeline (CI/CD)
31250979684  success  push  0bd4c3a4  Build & publish AI Station image
31250979673  success  push  0bd4c3a4  learning-center-ci
31250979668  failure  push  0bd4c3a4  OmniCore CI          ← LOWER than the state pointer
```

Note the burial again: the pointer sat at `31250979702`, so `31250979668` would be dropped by the
next poll's `databaseId > state` filter. The sha-based gap scan is what caught it.

## 2. Provenance: `event=push` cleared the PR filter — so read the commit

```bash
git fetch origin --quiet
git log origin/main --oneline -3 --pretty='%h %ad %s' --date=short
```
```
0bd4c3a49 2026-08-08 docs(soul): 第十九章 DeerFlow 2.5 × ESGGO 整合 (OA-TWINS 雙向同步)
845e74bd5 2026-08-08 fix(vps): 修復 Bash 語法錯誤 — 巢狀 heredoc 分隔符衝突 + 未閉合引號 (#466)
```

Head commit is markdown only ⇒ any red is inherited by construction.

## 3. Job/step decomposition, then map each to an existing tracker

```bash
cut -f1,2 /c/Project/_ci_logs/r31250979668_omni.log | sort -u
```
```
ESLint         Run ESLint
Secret Scan    Scan for committed secrets
Vitest Tests   Run Vitest
```

| Job | Signal | Tracker |
| --- | --- | --- |
| ESLint | `✖ 205 problems (0 errors, 205 warnings)` | #444 |
| Secret Scan | `Possible secret detected` ×2 | #430 |
| Vitest Tests | `CLI build failed` ×6, `Test Files 3 failed \| 44 passed (47)` | #465 |
| Sacred `🔍 Linting` | `✖ 140 problems (0 errors, 140 warnings)` | #444 (same cause) |

Sacred's 140 vs OmniCore's 205 is the cross-workflow scope difference, **not** a delta.

## 4. Inheritance proof — identical counts vs the previous main baseline

| Signal | `845e74bd` run 31246837246 | `0bd4c3a4` run 31250979668 |
| --- | --- | --- |
| `CLI build failed` | 6 | 6 |
| `Possible secret detected` | 2 | 2 |
| ESLint summary | `205 (0 errors, 205 warnings)` | `205 (0 errors, 205 warnings)` |
| `static-components` | 0 | 0 |

`static-components` staying at 0 also re-confirms the 14th class remains fixed on main.

## 5. The actual uncovered work: two PRs whose coverage went stale

| PR | last OA-TWINS comment | head sha | head sha first ran | verdict |
| --- | --- | --- | --- | --- |
| #468 | `08:55:00Z` (about `ced7b5f7`) | `ff9e9114` | `08:57:12Z` | **stale** |
| #470 | `08:56:06Z` | `9798ef06` | `08:59:13Z` | **stale** |

Re-verified against the same-workflow main baseline (OmniCore 205 / 0 errors):

| PR | OmniCore warnings | errors | `CLI build failed` | secret | judgement |
| --- | --- | --- | --- | --- | --- |
| #468 `ff9e9114` | **190 (−15)** | 0 | 6 | 2 | no regression |
| #470 `9798ef06` | **196 (−9)** | 0 | 6 | 2 | no regression; prior `−9` still holds |

#470's verdict was *unchanged* from the stale comment and was still worth re-posting — a verdict is
only trustworthy for the sha it names. One supersede comment each:
`pull/468#issuecomment-5225565970`, `pull/470#issuecomment-5225566439`.

## 6. Nothing landable

All of #468 / #469 / #470 were `isDraft=true` (#469 additionally `mergeable=UNKNOWN`). #469 is the
high-leverage one — it clears #465 *and* the Secret Scan job — but flipping someone's draft to ready
is not a cron call. #449 / #450 remained the stale route-B lockfile PRs, already block-warned ×3, so
no fourth warning.

## 7. State file — nothing to write

`~/.hermes/scripts/gh-error-watch.state` already read `1|31251017511`, exactly the newest run id
(the successful auto-repair run). Equal-to-newest ⇒ skip the write, and say so in the report rather
than issuing a redundant write that trips a sibling warning.

## Turn outcome

0 new issues (deliberate — every cause tracked) · 2 supersede verification comments · 1 consolidated
Telegram digest (`ok: True message_id: 23`) · 1 flagged manual step (mark #469 ready).
