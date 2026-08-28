# A "sole remaining blocker" claim is CONDITIONAL — and a sibling comment can contradict its own table

**Turn:** 2026-08-08 12:25Z cron poll. **Outcome:** 0 new issues, 2 comments, 1 Telegram digest.

This is the case where every existing coverage heuristic says "stay silent" and silence is still
wrong. The tracker had comments, the newest one was recent, it was sha-current for the run it named,
and it was written by a competent sibling. It was also **factually overstated in its headline**.

---

## 1. What the poll saw

Watcher: `action: "none"`, `new_failures: []`, `newest_run_id: 31257144486`.

Gap scan by sha (never trust the pointer):

```
31257144486 success workflow_run 8bb171c0 12:24:01 OA-TWINS Auto-Repair   ← state pointer HERE
31257103202 success push         8bb171c0 12:22:52 learning-center-ci
31257103193 failure push         8bb171c0 12:22:52 🌌 ESG GO Sacred Pipeline  ← buried
31257103192 failure push         8bb171c0 12:22:52 OmniCore CI                ← buried
```

Standard burying mechanism #1: the `workflow_run`-triggered auto-repair run is created ~1 min later
and therefore always outranks the failures it reacted to.

Head commit `8bb171c0` = `docs(soul): 整合無作協定 §15 …` — the **third consecutive docs-only push**
(`0bd4c3a4` → `035cba3c` → `8bb171c0`). Reds inherited by construction.

## 2. Zero-regression baseline table (vs main `035cba3c`)

| Signal | baseline `035cba3c` | new `8bb171c0` |
| --- | --- | --- |
| OmniCore / Sacred log lines | 6360 / 283 | **6360 / 283** |
| `CLI build failed` | 6 | **6** |
| `Possible secret detected` | 2 | **2** |
| `Test Files` | `3 failed \| 44 passed (47)` | **identical** |
| OmniCore ESLint | `205 problems (0 errors, 205 warnings)` | **identical** |
| Sacred ESLint | `140 problems (0 errors, 140 warnings)` | **identical** |
| `static-components` | 0 | **0** |

## 3. The authoritative job conclusions

```bash
gh run view 31257103192 --repo DingJun1028/esggo --json jobs --jq '.jobs[] | "\(.conclusion)\t\(.name)"'
```

```
failure  ESLint
failure  Secret Scan
failure  Vitest Tests
success  TypeScript Check
success  Validate VPS Scripts
success  agents.yaml Verification
success  Worker Check
skipped  Build Check / Lighthouse CI / Docker Build Test
```

**Three** failing jobs on `main`, mapping to three existing trackers: #444 (ESLint max-warnings),
#430 (committed secret), #465 (`cli/*` unregistered workspace → `CLI build failed`).

## 4. The finding — headline vs body

Surface scan:

```bash
for n in 474 465 430 444; do printf "%s comments=" "$n"; \
  gh issue view $n --repo DingJun1028/esggo --json comments --jq '.comments | length'; done
# 474 comments=0    465 comments=3    430 comments=5    444 comments=1
```

`#474` (this run's auto-filed `(unknown)` issue) at **0** was the obvious gap. The non-obvious one was
`#444`, whose single comment (11:47Z) read:

> ## 🐝 OA-TWINS 巡檢 — 本追蹤單現為 `main` **唯一剩餘阻斷原因**（首次留言）

…while **§2 of that same comment** contained:

> | 失敗 job/step | ESLint / Secret Scan / Vitest | **完全相同** |

The body was right. The headline was wrong. §3 revealed the hidden condition:

> ### 3. 關鍵狀態變化：PR #469 讓 ESLint 成為**唯一**失敗 job

That is true **on PR #469's own run**. It is not true on `main`, because:

```bash
gh pr list --repo DingJun1028/esggo --state open --json number,isDraft
# 469 draft=true
```

A draft cannot have landed, so the condition backing "唯一" had never been met.

## 5. The generalizable rule

A "sole remaining blocker" statement is **always** implicitly conditional — "once PR #N lands, X is
the only blocker". Two ways it goes wrong:

1. The author measured on a **PR run** instead of the newest **main** run.
2. The PR the claim depends on never landed (draft / closed / stale).

Verification is two cheap calls:

```bash
gh run view <newest_main_run> --repo DingJun1028/esggo --json jobs \
  --jq '.jobs[] | select(.conclusion=="failure") | .name'      # >1 name ⇒ no sole blocker
gh pr view <n> --repo DingJun1028/esggo --json isDraft,state    # has the condition been met?
```

### Third staleness axis

| Axis | Stale / wrong when |
| --- | --- |
| PR | newest comment predates the head sha's push |
| Tracker | a new fact (main advanced / rival PR appeared / claimed fix disproven) is unrecorded |
| **Claim** | **a conditional was written as unconditional and the condition has not been met** |

The `.comments | length > 0` + fresh-timestamp heuristic **cannot** detect axis 3. Only reading the
body can. Budget one body read on any tracker whose comment makes a scope claim ("唯一", "only",
"now unblocked", "last remaining").

### How to write the correction

Post the **delta only**:
- name the overstated claim and where it contradicts its own evidence,
- give the current `--json jobs` failing-job table,
- name the unmet condition (`#469` is `isDraft=true`).

Do **not** re-post the body's already-correct table — that is exactly the duplicate-warning spam the
anti-duplication rules forbid. The correction posted here was ~1.8KB against the original's ~6KB.

## 6. Fourth "nothing-to-do" shape

`action=none` + failures buried below the state pointer + docs-only push + every red already tracked
+ trackers sha-covered — **but** the run's own `(unknown)` issue has 0 comments **and** one tracker
carries an overstated claim ⇒ **0 issues, 2 comments, 1 digest**.

State file already equalled `newest_run_id` (`31257144486`) ⇒ **skip the write**, and say so in the
report rather than issuing a redundant write that trips a sibling warning.

## 7. Log-reading footnote

Even **after** stripping ANSI, extracting failing test paths misfired:

```bash
grep -ah "FAIL" r31257103192.log | sed -e 's/\x1b\[[0-9;]*m//g' | grep -oE "FAIL cli/[a-z0-9/_.-]+" | sort -u
# → (empty)
grep -ah "FAIL" r31257103192.log | sed -e 's/\x1b\[[0-9;]*m//g' | grep -oE "FAIL [a-z0-9/_.-]+" | sort -u
# → FAIL on
```

Do not burn calls tuning that regex. `Test Files N failed | M passed (T)` and `--json jobs` already
answer the question and are immune to log formatting.

## 8. Ops notes from the same turn

- The Telegram send-buffer `_auto_repair_alert.txt` raised the sibling-write warning again; `wc -c`
  + `head -1` confirmed the bytes were ours before dispatch. Delivery proof: `ok: True message_id: 31`.
- `gh issue comment <n> -F "C:/Project/_ci_logs/<file>.md"` (drive-letter form, quoted) landed both
  comments; confirmed by grepping the output for `issuecomment-<id>`, not by exit code.
- All four open PRs (#472/#470/#469/#468) were drafts ⇒ no `gh pr ready`, no merge from cron.
  #449/#450 already carried multiple block-warnings ⇒ no further warning.

## 9. Escalation actually reported

PR #469 fixes **two** trackers (#465 + #430) but is blocked solely by draft status. The correct cron
output is one clearly-labelled manual step — "press Ready for review" — not a silent downgrade to
"posted a comment".
