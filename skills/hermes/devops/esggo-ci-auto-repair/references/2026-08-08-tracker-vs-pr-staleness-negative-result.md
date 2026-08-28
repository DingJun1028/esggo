# Tracker staleness ≠ PR staleness, and why a NEGATIVE result is the payload (2026-08-08, 12:04 poll)

## Shape of the turn
- Watcher: `{"new_failures": [], "action": "none", "newest_run_id": "31253187601"}`
- Gap scan by sha: main head `035cba3c` red in **OmniCore CI** (`31253147510`) and
  **🌌 Sacred Pipeline** (`31253147487`).
- State pointer `31253187601` was the `OA-TWINS Auto-Repair` **success** run (10:37), sitting *above*
  the two 10:36 failures — burying mechanism #1, the normal steady state.
- Outcome: **0 new issues, 1 comment, 0 delegations.**

## Provenance: docs-only push ⇒ reds inherited by construction
```
$ git show --stat --oneline 035cba3c6
035cba3c6 docs+script: 萬能即時翻譯平台 × Speech-to-Speech 語音代理整合
 SPEECH_TO_SPEECH_INTEGRATION.md | 143 ++++++++++++++
 _tmp_vps/ollama_downgrade.sh    |  34 +++++
 2 files changed, 177 insertions(+)
```
No code touched. `_tmp_vps/` is **not** `vps/scripts/`, so `Validate VPS Scripts` was unaffected and
indeed stayed `success`.

Identical-count baseline table (same workflow, three consecutive main shas):

| Signal | `845e74bd` (31246837246) | `0bd4c3a4` (31250979668) | `035cba3c` (31253147510) |
| --- | --- | --- | --- |
| `CLI build failed` | 6 | 6 | 6 |
| `Test Files` | 3 failed \| 44 passed (47) | same | same |
| `Possible secret detected` | 2 | 2 | 2 |
| ESLint (OmniCore) | 205 (0 errors, 205 warnings) | 205 | 205 |
| Sacred lint | 140 (0 errors, 140 warnings) | — | 140 |

Job conclusions on `31253147510` (`--json jobs`, not log inference):
`failure Vitest Tests` (#465) · `failure Secret Scan` (#430) · `failure ESLint` (#444);
everything else `success`/`skipped`.

## The finding: one surface uncovered, and the PR staleness rule would have missed it

Coverage sweep:

| Surface | Newest comment | Verdict |
| --- | --- | --- |
| #473 (`(unknown)` for run 31253147510) | 10:50:35 | covered — sibling already wrote "紅燈 100% 繼承" |
| #444 (ESLint) | 11:47:16 | covered |
| #430 (secret) | 11:47:28 | covered |
| PR #472 (head `8f9aa8f7`, pushed 10:33:15) | 10:51:22 | covered (comment newer than push) |
| PR #449 / #450 | 05:42 ×4 / ×6 block-warnings | already warned ⇒ silence |
| **#465 (CLI build failed)** | **09:20** | **STALE — but not by the PR rule** |

#465's comment was sha-current for PR #469's head `f25b2463` (pushed ~08:58). By the head-sha rule it
looks covered. It was not, because two facts had landed since:
1. main advanced two shas and the class was still live;
2. **PR #470 appeared and looks like a fix for this exact class — and is not.**

Right question for a tracker: *would a reader acting on the newest comment alone do the wrong thing?*
Yes — they would merge #470 expecting #465 to close.

## The negative result, proven on the authoritative metric
```bash
gh run view 31252137447 --repo DingJun1028/esggo --log-failed > r31252137447.log
grep -ah "Test Files" r31252137447.log | sed -e 's/\x1b\[[0-9;]*m//g' | tail -1
```

| | main `31253147510` | PR #470 `31252137447` |
| --- | --- | --- |
| `Test Files` | `3 failed \| 44 passed (47)` | `3 failed \| 44 passed (47)` |

Identical ⇒ root `tsx`/`commander` cannot fix an **unregistered workspace tree** (15th class).
Note the earlier `grep -c "CLI build failed"` 6 → 3 on these same two runs was pure code-frame
rendering difference — the `Test Files` line is what settles it.

## The positive half, from job conclusions (invisible to `--log-failed`)
```bash
gh run view 31249545861 --repo DingJun1028/esggo --json jobs --jq '.jobs[] | "\(.conclusion)\t\(.name)"'
```

| Job | main `31253147510` | PR #469 `31249545861` (head `f25b2463`) |
| --- | --- | --- |
| Vitest Tests | failure | **success** |
| Secret Scan | failure | **success** |
| ESLint | failure | failure (#444, pre-existing) |

So the tracker must name **both**: land #469, ignore #470. Either half alone is misread.

Blocker: `gh pr view 469 --json state,mergeable,isDraft` → `state=OPEN mergeable=UNKNOWN
isDraft=true`. `UNKNOWN` is GitHub still computing the merge commit — neither green light nor
conflict. `isDraft=true` is the field that decides: cron does **not** `gh pr ready` someone's draft.

## Duplicate sibling comments are ONE coverage event
#465 carried two byte-identical comments at `09:20:18` and `09:20:33` — two siblings racing. Count
recency from `.comments[-1].createdAt`, but skim bodies: N identical comments give the confidence of
one and never license "well-covered".

## Reusable probes
```bash
# tracker coverage: length first (0 ⇒ genuine gap), then recency, then bodies
gh issue view <n> --repo DingJun1028/esggo --json comments --jq '"count=\(.comments|length) newest=\(.comments[-1].createdAt // "none")"'
# batch across trackers
for n in 465 444 430; do echo "--- #$n"; gh issue view $n --repo DingJun1028/esggo --json comments \
  --jq '"count=\(.comments|length) newest=\(.comments[-1].createdAt // "none")"'; done
# PR head real push time (NOT --json createdAt)
gh api repos/DingJun1028/esggo/commits/<headRefOid> --jq '.commit.author.date'
```

## Report shape used
Declared both standing cron-prompt deviations inline (3a: 0 issues filed, all causes tracked;
3b: no `delegate_task`, subagents discarded at cron exit), plus the deviation from the
`action=none → 靜默` instruction, with the gap-scan evidence that justified it. State file already
equal to newest run id ⇒ write skipped and said so.
