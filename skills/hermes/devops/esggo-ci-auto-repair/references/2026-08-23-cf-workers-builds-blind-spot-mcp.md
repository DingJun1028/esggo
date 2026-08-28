# 21st class — `cf_workers_build_env_gate`: the Cloudflare Workers Builds blind spot IS breakable

Verified 2026-08-23 on `DingJun1028/esggo`, `main` @ `3cc7d4fc`.

## Why every watcher misses it

Cloudflare Workers Builds report as **check-runs** under app slug `cloudflare-workers-and-pages`, not as
GitHub Actions workflow runs. So `gh run list` — the sole data source for `gh-error-watch.py` and
`oa-twins-tracker.py` — **cannot see them**. Consequence:

> GitHub Actions 100% green ≠ `main` is green.

On `3cc7d4fc` all four Actions workflows were `success` (`OmniCore CI`, `Sacred Pipeline`,
`learning-center-ci`, `Build & publish AI Station image`) while **3 Workers Builds were `failure`**.
The watcher returned `action=none`. This is a *structural* blind spot, not a script bug.

Enumerate them (the only reliable probe):
```bash
gh api repos/DingJun1028/esggo/commits/<sha>/check-runs \
  --jq '.check_runs[] | "\(.conclusion) \(.status) \(.name) | \(.app.slug)"'
```

## Breaking it: the MCP tool succeeds where wrangler OAuth fails

`check-runs` gives `output.summary` containing **only** a Build ID link and a Script link — zero log
text, `output.text` empty. So even a check-runs-aware watcher still cannot classify the failure.

A prior triage concluded "必須人工讀 CF dashboard" after
`GET /accounts/<id>/builds/builds/<uuid>/logs` with a local wrangler OAuth token returned
`{"success":false,"errors":[{"code":10000,"message":"Authentication error"}]}`.

**That conclusion is wrong — the deferred MCP tool works:**
```
tool_call mcp__cloudflare_builds__workers_builds_get_build_logs { "buildUUID": "<uuid>" }
```
Extract each `buildUUID` from the failing check-run's `output.summary` Build ID link. It returns the
complete timestamped build log. Always prefer this over declaring the class unreadable.

## The root cause it revealed (= 18th class, latent env gate)

All three builds run the SAME root command and end **byte-identically**:
```
Executing user build command: pnpm run build
$ cross-env NEXT_TELEMETRY_DISABLED=1 NODE_OPTIONS=--max-old-space-size=1536 tsx scripts/validate-env.ts && next build
No .env file at /opt/buildhome/repo/.env - falling back to process.env
Environment validation failed:
  - Missing required: DATABASE_URL
[ELIFECYCLE] Command failed with exit code 1.
```

| Script | Build UUID |
| --- | --- |
| `esggo` | `893219c4-0815-4762-873f-94aa79c16444` |
| `wrangler-deploy` | `c189fbb2-8783-4839-83de-77d71ac669bf` |
| `oa` | `d76a3a94-b83f-4596-bf58-51dd1501233c` |

One cause × three CF projects — **not** three incidents.

`DATABASE_URL` is the ONLY `required: true` entry in `scripts/validate-env.ts` (all 8 others are
`required: false`), so it is the sole blocker. The GitHub side already carries the 18th-class
placeholder, which is exactly why Actions is green and CF is red:
```
.github/workflows/ci.yml:244,303:  DATABASE_URL: "postgresql://build:***@localhost:5432/build"
.github/workflows/deploy-oracle.yml:284: export DATABASE_URL="${DATABASE_URL:-postgresql://...}"
.github/workflows/deploy-oracle.yml:281: # 建置期佔位: validate-env.ts 要求 DATABASE_URL 非空 (僅存在性檢查)
```
CF build env vars live in the **dashboard**, outside the repo ⇒ the repo-wide fix never propagated.

**NOT auto-repairable from cron:** the MCP reads builds (`get_build`, `get_build_logs`,
`list_builds`) but cannot SET build env vars, and cron has no user to authorise a dashboard change.
Fix = add `DATABASE_URL` build-var to each of the 3 Workers (placeholder is sufficient: the gate is
existence-only, per the repo's own comment). The alternative — giving `DATABASE_URL` a `defaultValue`
in `validate-env.ts` — weakens the gate on *every* deploy path, so it is a product decision, not an
auto-repair.

## Two traps that fabricate findings

### 1. `started_at == completed_at` is a打點 artifact, not "the build never ran"
Every CF check-run stamps both fields identically (e.g. `oa` = `06:11:11Z` for both), which reads like
an instant abort / Cloudflare-side `startup_failure`. **Disproved by the log**: `oa` ran `6:9:31 →
6:11:9` (~98s, including `Done in 1m 13.7s` of `pnpm install`).

Worse, there is **no control sample**: a 25-commit scan of `main` found **zero** successful Workers
Builds check-runs (2026-08-21T04:56 → 08-23T06:11), so you cannot establish that zero-duration
discriminates pass from fail. Never cite it as evidence.

### 2. Per-sha trigger gaps masquerade as new regressions — widen the sha sample
Sampling only 3 shas produced the claim "blast radius 2 → 3, `esggo` newly broken at `3cc7d4fc`".
A 25-commit scan refuted it:

| | 3-sha reading | 25-commit reality |
| --- | --- | --- |
| `esggo` first red | `3cc7d4fc` (08-23 06:07) | **`c92906c1` (08-21 04:56)** — 2 days earlier |
| nature | expanding blast radius | chronic, all three red ~3 days |
| successes in window | not measured | **0 / 25** |

`esggo` is simply **absent** from some shas' check-run lists (that sha did not trigger that project) —
absence is not green. Acting on the 3-sha reading sends you hunting a regression in the newest push
that does not exist.

Scan loop used:
```bash
shas=$(gh api "repos/DingJun1028/esggo/commits?sha=main&per_page=25" --jq '.[].sha')
for s in $shas; do
  r=$(gh api repos/DingJun1028/esggo/commits/$s/check-runs \
      --jq '.check_runs[] | select(.name|startswith("Workers Builds")) | "\(.conclusion) \(.name)"')
  if [ -n "$r" ]; then echo "== ${s:0:8} =="; echo "$r"; fi
done
```

## Ruling out the lockfile classes cheaply
All three logs show a clean install stage, which is what excludes the 11th/12th classes:
```
Scope: all 21 workspace projects
✓ Lockfile passes supply-chain policies (1715 entries in 16.1s)
Lockfile is up to date, resolution step is skipped
Done in 1m 13.5s using pnpm v11.5.2
```
`next build` never executed — failure is strictly at the env gate.

## Correct cron outcome for this shape
`action=none` + Actions green + CF check-runs red + tracker already exists ⇒
**0 issues created, 1 evidence comment on the existing tracker, 0 code changes, 0 secret changes,
0 state writes** (never hand-advance `oa-twins-tracker.py`'s state), plus one clearly-labelled manual
decision point (dashboard build var) in the digest.
