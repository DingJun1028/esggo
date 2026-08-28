# check-runs pagination is a SECOND false-green layer (2026-08-25)

Sequel to the 21st class (`cloudflare_workers_builds`). That entry established that the Cloudflare
App writes **check-runs**, not workflow runs, so `gh run list` — and therefore both the watcher and
the sha-based gap scan — are structurally blind to CF failures. The prescribed defence is to probe
`gh api repos/{o}/{r}/commits/<sha>/check-runs` every poll.

**That defence has its own false-green mode, and it fired on 2026-08-25.**

## What happened

Poll at `2026-08-24T20:1xZ` (08-25 04:1x CST). `oa-twins-tracker.py` returned:

```json
{"action": "none", "newest_run_id": "32774602901"}
```

Actions face on the newest sha `cb358aa2` was almost entirely green (OmniCore CI, Sacred Pipeline,
ESG-GO CI/CD, learning-center-ci, Build & publish AI Station image, Deploy to Oracle VPS — all
`success`). Only `Deploy to Vercel` was red there.

The first check-runs probe used the **default** page size:

```bash
gh api repos/DingJun1028/esggo/commits/cb358aa2/check-runs --jq '.total_count'
# → 72

gh api repos/DingJun1028/esggo/commits/cb358aa2/check-runs \
  --jq '.check_runs[] | "\(.conclusion // "RUNNING") \(.name) [\(.app.slug)]"'
# → 30 rows, EVERY ONE of them success or skipped
```

Read literally, that says the CF blind spot is clear on this sha. It is not. `total_count` is **72**
and the API returned only the first **30**. All three CF failures sat beyond page 1:

```bash
gh api "repos/DingJun1028/esggo/commits/cb358aa2/check-runs?per_page=100" \
  --jq '.check_runs[] | select(.conclusion != "success" and .conclusion != "skipped")
        | "\(.conclusion) \(.name) [\(.app.slug)]"'
failure Workers Builds: oa              [cloudflare-workers-and-pages]
failure Workers Builds: wrangler-deploy [cloudflare-workers-and-pages]
failure Workers Builds: esggo           [cloudflare-workers-and-pages]
failure Deploy esggo to Vercel (production) [github-actions]
```

App distribution on that sha: `github-actions` 68, `cloudflare-workers-and-pages` 3, `supabase` 1.
With 68 of 72 check-runs belonging to Actions — most of them `skipped` auto-repair jobs — the 3 CF
rows are *statistically likely* to fall off page 1. This is the normal case, not an edge case.

## Why it is dangerous

It stacks a second blindness on top of the first, and the failure mode is the same shape as the
aborted-linter false PASS: **absence of a signal is indistinguishable from absence of a problem.**

| Probe | Result | Naive reading | Truth |
| --- | --- | --- | --- |
| `gh run list` | CF absent entirely | "no CF failures" | CF never appears here at all |
| check-runs, default 30 | 30 × success/skipped | "CF is green on this sha" | 3 CF failures on page 2+ |
| check-runs, `per_page=100` + `select()` | 3 CF failures | correct | correct |

A poll that does the 21st-class probe *but forgets pagination* will report the blind spot as resolved
and close or stop superseding the tracker.

## Rule

Always pass `?per_page=100`, always `select()` rather than eyeballing rows, and **read
`total_count`** so you know whether even 100 truncated:

```bash
gh api "repos/DingJun1028/esggo/commits/<sha>/check-runs?per_page=100" --jq '.total_count'
gh api "repos/DingJun1028/esggo/commits/<sha>/check-runs?per_page=100" \
  --jq '.check_runs[] | select(.conclusion != "success" and .conclusion != "skipped")
        | "\(.conclusion) \(.name) [\(.app.slug)]"'
```

If `total_count > 100`, paginate with `&page=2` before concluding anything.

## Corollary: use build UUIDs to prove the reds are FRESH

A stale check-run carried over from an earlier sha and a genuinely re-triggered failing build look
identical in a conclusion list. Read `details_url` — the CF build UUID distinguishes them:

```bash
gh api "repos/DingJun1028/esggo/commits/<sha>/check-runs?per_page=100" \
  --jq '.check_runs[] | select(.app.slug=="cloudflare-workers-and-pages")
        | "\(.name) | \(.conclusion) | started=\(.started_at) completed=\(.completed_at) | \(.details_url)"'
```

On `cb358aa2` all three UUIDs were new (`d1dcd83b…`, `d99414c8…`, `4d5c88f8…`), proving the builds
were re-triggered for this sha. Cite them when superseding a tracker comment — it is the difference
between "still red" and "red again", and only the latter justifies a new supersede comment.

Note `started_at == completed_at` on all three (apparent `0s`). That remains the **red herring**
documented in the 21st class — the real build ran ~98s. Never score `0s` as "did not execute".

## Also confirmed this turn (unchanged rules, fresh evidence)

- **Burying mechanism #1 again.** State pointer parked at `32774602901`
  (`OA-TWINS Auto-Repair`, `workflow_run`-triggered ⇒ highest id), while the real failure
  `32771690172` (`Deploy to Vercel`) sat **below** it ⇒ the next poll's `databaseId > state` filter
  would skip it forever. Only the headSha gap scan found it. Did not hand-advance
  `oa-twins-tracker.py`'s state (per the two-state-paths rule).
- **Push scope beats commit type.** Head commit `cb358aa2b` is typed `fix(omni-factory):` — reads as
  production code — but touched exactly one file, `apps/omni-factory/assemble.mjs` (+121/-24), which
  is outside every failing job's consumed scope ⇒ both reds inherited *by construction*. Positive
  evidence rather than mere unchanged colour: the jobs that WOULD have caught a regression from this
  commit (`ESLint`, `TypeScript Check`, `Build Check`, `Docker Build Test`, `Worker Check`,
  `OA Framework Self-Check`, `Lighthouse CI`, `agents.yaml Verification`) all reported `success`.
- **Vercel = pure credential failure, not auto-repairable.**
  `Error: The token provided via --token argument is not valid.` after `Retrieving project…`, with
  all three secrets rendering as `***` (set, non-empty) ⇒ the token is sent and rejected, i.e.
  expired/revoked, not missing. 6 consecutive shas red. Correct cron output is a tracker comment with
  a single manual decision point (rotate `VERCEL_TOKEN`, or `gh workflow disable "Deploy to Vercel"`
  — permitted only because it is a *deploy* workflow, never for core CI), not a `gh run rerun`.
