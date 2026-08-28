# 21st class: `cloudflare_workers_builds` — `gh run list` is STRUCTURALLY BLIND (2026-08-23)

Not a burying mechanism (#1/#2/#3 are all run_id / state-pointer artifacts). This is a **data-source**
gap, and it makes `action=none` *permanent* rather than merely wrong once.

Cloudflare's `cloudflare-workers-and-pages` GitHub App publishes **check-runs**. There is no
corresponding Actions workflow run at all. `gh run list` — the sole data source for
`oa-twins-tracker.py`, `gh-error-watch.py`, **and the skill's own gap scan** — therefore returns
nothing for these failures, and the watcher reports `action=none` no matter how many times you poll or
where the state pointer sits.

## Observed shape (esggo `main` @ `3cc7d4fc5`)

| Check surface | Source | Result |
| --- | --- | --- |
| `OmniCore CI` `32621554424` | GitHub Actions | success |
| `🌌 Sacred Pipeline` `32621554412` | GitHub Actions | success |
| `learning-center-ci` `32621554377` | GitHub Actions | success |
| `Build & publish AI Station image` `32621554416` | GitHub Actions | success |
| `Workers Builds: esggo` | Cloudflare check-run | **failure** |
| `Workers Builds: oa` | Cloudflare check-run | **failure** |
| `Workers Builds: wrangler-deploy` | Cloudflare check-run | **failure** |

So `gh run list --branch main` reading all-green is **偽綠 (false green)**. Chronic case: ≥3 main shas,
>24h, missed by every prior poll. Blast radius grew `2 → 3` (`esggo` appeared only on the newest sha).

## Detection — add to the standing gap scan

```bash
gh api "repos/DingJun1028/esggo/commits/<sha>/check-runs?per_page=100" \
  --jq '.check_runs[] | select(.conclusion=="failure") | "\(.name) \(.conclusion)"'

# legacy commit-statuses are a DIFFERENT surface and are empty here:
gh api repos/DingJun1028/esggo/commits/<sha>/status --jq '"state=\(.state) total=\(.total_count)"'
# → state=pending total=0     ⇒ total=0 is NOT "clean"
```

A compact whole-sha census that surfaces both surfaces at once:

```bash
gh api "repos/DingJun1028/esggo/commits/<sha>/check-runs?per_page=100" \
  --jq '.check_runs[] | "\(.status) \(.conclusion // "-") \(.name)"' | sort | uniq -c | sort -rn
```

## TRAP — `started_at == completed_at` (0s) is a RED HERRING

Tempting and **wrong**. All three failing check-runs stamp identical start/finish times (e.g. `oa`
both `06:11:11Z`), which reads exactly like the 10th class (`startup_failure`, "never executed") and
invites the conclusion "the build never ran, so it's a CF config/auth/quota fault".

**Disproven by the actual build log:** `oa` ran `06:09:31 → 06:11:09` (~98s, including a *successful*
`1m13.7s pnpm install`). Zero duration is merely how CF stamps the check-run.

Worse, it can never be validated: a 25-commit sample contained **no successful** Workers Builds
check-run, so there is no contrast sample that could give the 0s signal discriminative power.
**Fetch the log before classifying.** Recorded here so future polls do not re-derive it as "decisive".

## The blind spot is API-LEVEL, not just script-level

For the failing check-runs, `output.summary` carries only a Build ID + Script link and `output.text` is
empty — so **even a check-runs-aware watcher cannot obtain the failure reason**. You must go to the
Cloudflare side.

Read the real logs through the Cloudflare Workers Builds MCP (deferred catalog; load with
`tool_describe` then `tool_call`):

- `mcp__cloudflare_builds__workers_builds_list_builds`
- `mcp__cloudflare_builds__workers_builds_get_build_logs`

Local `wrangler` OAuth scope is **not** sufficient. MCP is **read-only** — it can read builds but
cannot set build environment variables.

## Root cause found this way was the 18th class, not a CF fault

All three Workers run the *same* root build command, so this is **one cause × 3 CF projects** ⇒ file
**ONE** tracker, not three. The three logs ended verbatim identically:

```
Executing user build command: pnpm run build
$ cross-env NEXT_TELEMETRY_DISABLED=1 NODE_OPTIONS=--max-old-space-size=1536 tsx scripts/validate-env.ts && next build
No .env file at /opt/buildhome/repo/.env - falling back to process.env
Environment validation failed:
  - Missing required: DATABASE_URL
[ELIFECYCLE] Command failed with exit code 1.
Failed: error occurred while running build command
```

| Script | Build UUID | Failed (UTC) |
| --- | --- | --- |
| `esggo` | `893219c4-0815-4762-873f-94aa79c16444` | 06:07:42 |
| `wrangler-deploy` | `c189fbb2-8783-4839-83de-77d71ac669bf` | 06:09:28 |
| `oa` | `d76a3a94-b83f-4596-bf58-51dd1501233c` | 06:11:09 |

**Rules out 11th/12th class:** `pnpm install` and the lockfile are fully healthy in the log
(`Scope: all 21 workspace projects`, `Lockfile passes supply-chain policies`, `Lockfile is up to
date`, `Done in 1m 13.5s using pnpm v11.5.2`). The gate fires *before* `next build` ever runs.

**Asymmetry to name explicitly: GitHub-side fixed, Cloudflare-side unfixed.** The Actions workflows
already had a `DATABASE_URL` placeholder added to their build steps (18th class remediation); CF's
build environment never got one. Same repo, same command, different env ⇒ green on Actions, red on CF.

## NOT cron-repairable — exactly one human decision point

The fix surface (CF dashboard build env vars) **does not exist in the repo**, and MCP cannot write it.

1. **(recommended, aligns with existing design)** In the CF dashboard add a build-time env var to each
   of `esggo`, `oa`, `wrangler-deploy`, reusing the placeholder semantics already documented in-repo:
   `DATABASE_URL = postgresql://build:***@localhost:5432/build`.
   Safe because `validate-env.ts` performs an **existence** check only — the placeholder never touches
   a real database.
2. **(product decision — do NOT let cron do this)** Give `DATABASE_URL` a `defaultValue` in
   `scripts/validate-env.ts`. This relaxes the gate on *every* deploy path and can mask real runtime
   misconfiguration. Product decision, not auto-repair.

### Acceptance criteria (either path)

- `gh api repos/DingJun1028/esggo/commits/<new_sha>/check-runs` shows
  `Workers Builds: esggo|oa|wrangler-deploy` flipping `failure → success`;
- the build log no longer prints `Missing required: DATABASE_URL`, and shows `next build` actually
  executing.

## Poll discipline this class forces

Add the check-runs query to **every** gap scan, not just when something looks wrong: this class is
invisible to the `action` field by construction, so the only defence is asking the check-runs endpoint
about the newest `main` sha on each poll. Treat `action=none` + all-green `gh run list` as **unproven**
until the check-runs census comes back clean.
