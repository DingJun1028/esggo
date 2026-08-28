# In-flight runs bury failures, and `createdAt` inverts the stale-coverage verdict

Cron poll, 2026-08-08 **09:37–09:42Z**, repo `DingJun1028/esggo`.
Outcome: **0 new issues, 0 delegations, 2 superseding PR verifications, 1 Telegram digest.**

Two independent lessons, both of which would have produced a *wrong silent turn* if followed as
previously documented.

---

## 1. The watcher reported `action=none` while main was red — because the runs were still RUNNING

```
python3 gh-error-watch.py
{ "checked_at": "2026-08-08T09:37:36Z", "new_failures": [], "action": "none",
  "newest_run_id": "31250979702" }
```

A push had landed **40 seconds earlier** (`0bd4c3a4` @ `09:36:56`). Its runs existed but had not
concluded, so a `conclusion == 'failure'` filter saw nothing:

```
31250979702  <empty>  push 0bd4c3a4  🌌 ESG GO Sacred Pipeline
31250979684  <empty>  push 0bd4c3a4  Build & publish AI Station image
31250979673  <empty>  push 0bd4c3a4  learning-center-ci
31250979668  <empty>  push 0bd4c3a4  OmniCore CI
```

Minutes later the same sha resolved to:

```
31250979702  failure  push 0bd4c3a4  🌌 ESG GO Sacred Pipeline
31250979673  success  push 0bd4c3a4  learning-center-ci
31250979668  failure  push 0bd4c3a4  OmniCore CI
```

`save_state` had written **`31250979702`**. Note `31250979668` is *below* that pointer, so the next
poll's `databaseId > state` filter would never revisit the OmniCore failure. This is a **second**
burying mechanism, distinct from the documented "auto-repair's run_id is always highest": here the
pointer is poisoned by runs that were merely *pending*, not by ordering against a later success.

**Rule:** an empty `conclusion` is neither pass nor fail. Select the gap scan on `headSha` and
re-read conclusions before ending the turn:

```bash
gh run list --repo DingJun1028/esggo --limit 10 \
  --json databaseId,workflowName,conclusion,headSha,event \
  --jq '.[] | select(.headSha|startswith("0bd4c3a4")) | "\(.databaseId) \(.conclusion) \(.event) \(.workflowName)"'
```

### Main state once it settled — all pre-existing, all tracked

`OmniCore CI #31250979668` decomposed by job (`--json jobs` + `cut -f1,2 <log> | sort -u`):

| Job / Step | Signature | Tracker |
| --- | --- | --- |
| ESLint / Run ESLint | `✖ 205 problems (0 errors, 205 warnings)` | #444 |
| Secret Scan / Scan for committed secrets | `Possible secret detected` ×2 | #430 |
| Vitest Tests / Run Vitest | `CLI build failed` ×6 | #465 |

`static-components` = **0** (14th class stayed fixed), no `ERR_PNPM_*` (11th/12th stayed fixed)
⇒ correct output was **zero** new issues.

---

## 2. `gh pr list --json createdAt` is the wrong field for sibling-coverage staleness

The documented check compared the newest OA-TWINS comment against the PR's `createdAt`. That is PR
**open** time, which is almost always older than everything, so it reads "covered" and licenses
silence. The field that matters is when the **current head sha** was pushed:

```bash
gh pr list --repo DingJun1028/esggo --state open --limit 20 --json number,headRefOid,headRefName
gh api repos/DingJun1028/esggo/commits/<headRefOid> --jq '.commit.author.date'
gh issue view <pr#> --repo DingJun1028/esggo --json comments --jq '.comments[-1].createdAt'
```

| PR | `createdAt` (wrong) | newest comment | **head sha pushed** (right) | verdict by `createdAt` | true verdict |
| --- | --- | --- | --- | --- | --- |
| #470 | 08:14:32 | 08:56:06 | `9798ef06` @ **08:59:07** | "covered" ❌ | **stale** ⇒ re-verify |
| #468 | 07:58:16 | 08:55:00 | `ff9e9114` @ **08:57:06** | "covered" ❌ | **stale** ⇒ re-verify |
| #469 | 08:06:24 | **09:19:44** | `f25b2463` | covered | covered ⇒ silent ✅ |

Both stale comments were written against superseded shas, so re-posting was a correction, not spam.
#469's comment postdated its head ⇒ correctly left alone.

---

## 3. The re-verification itself (same-workflow only)

All reds were `event=pull_request` — PR fan-out, not main breakage. Comparison confined to
**OmniCore CI** on both sides (cross-workflow warning counts are not comparable):

| Run | sha | ESLint | `CLI build failed` | secret | `static-components` |
| --- | --- | --- | --- | --- | --- |
| main `31246837246` | `845e74bd` | 205 problems (0 err, 205 warn) | 6 | 2 | 0 |
| main `31250979668` | `0bd4c3a4` | 205 problems (0 err, 205 warn) | 6 | 2 | 0 |
| PR #470 `31249578658` | `9798ef06` | **196** (0 err, 196 warn) → **−9** | 6 | 2 | 0 |
| PR #468 `31249508701` | `ff9e9114` | **190** (0 err, 190 warn) → **−15** | 6 | 2 | 0 |

Two-directional check via `--json jobs`: the failing job set was **identical** on main and both PRs
(ESLint / Secret Scan / Vitest), so neither a regression nor a resolution — the reds are inherited.
Both PRs are net improvements blocked only by the `--max-warnings 50` gate.

Landed: `pull/470#issuecomment-5225564577`, `pull/468#issuecomment-5225564693`.

---

## 4. Draft status still blocked the highest-leverage action

All three in-flight PRs (#468/#469/#470) were `isDraft=true`. #469 was previously verified to clear
both #465 and the Secret Scan. Per the draft rule: do **not** `gh pr ready`, do **not** merge — post
evidence and surface exactly one manual step in the report and the Telegram digest.

## 5. Housekeeping that did fire

- State advanced `31250979702` → `31251017511` (monotonic; read-before-write confirmed).
- Telegram buffer produced the documented sibling-write warning; content (not just `wc -c`) was
  re-checked immediately before dispatch, then `ok: True message_id: 22`.
- A sibling was concurrently writing `r31250979668_omni.log` into `_ci_logs/` during this turn —
  the suffixed-filename convention (`c470_oatwins_0942.md`) kept the comment bodies uncontended.
