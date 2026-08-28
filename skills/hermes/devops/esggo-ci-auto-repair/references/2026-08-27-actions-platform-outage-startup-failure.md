# 24th class: `actions_platform_outage` — `startup_failure` that is NOT your workflow file

**Date:** 2026-08-27 cron poll · **Repo:** DingJun1028/esggo

## One-line lesson
GitHub prints the exact 10th-class message — `This run likely failed because of a workflow file
issue.` — for workflows whose YAML is **valid**, whenever Actions itself is degraded. Following the
10th-class playbook then burns the turn hunting a non-existent defect and can produce a bogus "fix"
commit churning a healthy file.

## What the poll saw
`oa-twins-tracker.py` returned `{"action": "none", "newest_run_id": "32985236605"}` — i.e. *nothing to
do* — while **5 runs were `startup_failure` and 3 more were stuck `queued`**:

```
32985897557  status=queued          a2804e8b  Deploy to Oracle VPS
32985805274  status=queued          a2804e8b  ESG-GO CI/CD Pipeline
32985805226  success                a2804e8b  🌌 ESG GO Sacred Pipeline (CI/CD)
32985802867  startup_failure        a2804e8b  OmniCore CI
32985286477  startup_failure        6cf0550c  🌌 ESG GO Sacred Pipeline (CI/CD)
32985280881  status=queued          6cf0550c  OmniCore CI
32985236605  startup_failure        51ee0310  🌌 ESG GO Sacred Pipeline (CI/CD)  ← state pointer
32985211918  startup_failure        6cf0550c  Build & publish AI Station image
32985151010  startup_failure        51ee0310  ESG-GO CI/CD Pipeline
```

Note the shape that should stop you cold: **Sacred Pipeline SUCCEEDED on `a2804e8b` while it
`startup_failure`d on `6cf0550c`** — same file, no `.github/` change between them. A YAML fault cannot
be non-deterministic.

## Why the watcher said `action=none` — burying mechanism #4
Both watchers filter `conclusion == 'failure'`. **`startup_failure` is a different conclusion
string**, so a total Actions outage is *structurally invisible* to them — the same shape as the 21st
class's check-runs blind spot. Select on `conclusion != "success"`, never `== "failure"`:

```bash
gh run list --repo DingJun1028/esggo --limit 15 \
  --json databaseId,workflowName,conclusion,status,headSha,event \
  --jq '.[] | "\(.databaseId) status=\(.status) concl=\(.conclusion) \(.headSha[0:8]) \(.workflowName)"'
```

An **empty** `concl` with `status=queued` is neither pass nor fail (burying #2's rule); during an
outage it can stay that way for hours, so do not score it in either direction.

## Discriminators — check BEFORE parsing any YAML

| Signal | 10th class (real YAML fault) | 24th class (outage) |
| --- | --- | --- |
| `runs/<id>/jobs --jq '.total_count'` | **0** — nothing scheduled | **> 0** (here 22, 5, 2) |
| job `status` / `conclusion` | no jobs at all | `queued` / `null` — never got a runner |
| `.github/` in head commits | edited | **untouched** |
| same file, same batch | deterministic | **one workflow passes, another fails on the same sha** |
| sibling runs | settled | several `queued` for **>1h** |

Evidence gathered this turn:

```bash
gh api repos/DingJun1028/esggo/actions/runs/32985802867/jobs --jq '.total_count'   # 22  (NOT 0)
gh api repos/.../runs/32985802867/jobs --jq '.jobs[] | "\(.status) \(.conclusion) \(.name)"'
#   queued null Vitest Tests / queued null ESLint / queued null TypeScript Check ...
git show --stat --oneline a2804e8bb | grep -E "\.github|workflows"   # EMPTY
git show --stat --oneline 6cf0550ce | grep -E "\.github|workflows"   # EMPTY
python3 -c "import yaml; yaml.safe_load(open('ci_main.yml')); print('YAML_OK')"   # YAML_OK
```

`gh run view 32985802867` still insisted: *"This run likely failed because of a workflow file issue."*
It is wrong. Do not trust that string alone.

## The confirming call

```bash
curl -s --max-time 25 https://www.githubstatus.com/api/v2/components.json \
  | python3 -c "import json,sys; d=json.load(sys.stdin); [print(c['name'],'->',c['status']) for c in d['components'] if c['name']=='Actions']"
# Actions -> major_outage

curl -s --max-time 25 https://www.githubstatus.com/api/v2/incidents/unresolved.json \
  | python3 -c "import json,sys; d=json.load(sys.stdin); [print(i['impact'],i['name'],i['incident_updates'][0]['body'][:200]) for i in d['incidents']]"
# critical | Incident with Actions | ...delayed queues are burning down...
```

Created `2026-08-26T15:11:58Z`, still unresolved at poll time.

## Correct cron outcome — filing issues is the WRONG move
- **0 issues.** External + transient; N startup_failures collapse to ONE non-repo cause that
  self-heals. Per-run trackers would spam the backlog with something nobody can act on.
- **0 repairs, 0 reruns.** `gh run rerun` just re-queues into the throttled backlog. (Contrast the
  **19th class** `qemu_sigill`, where rerun IS both the repair and the discriminator.)
- **0 merges — load-bearing.** `mergeable=UNKNOWN` is common during the incident because GitHub cannot
  compute mergeability; merging then lands code whose CI **never ran**. An Actions outage is a hard
  freeze on the "land it" rule, however green a PR looked earlier. Observed: every open PR was
  `draft=true`, `CONFLICTING`, or `UNKNOWN` — nothing landable anyway.
- **Do NOT advance the state pointer.** These runs must stay visible to be re-detected and re-run
  after recovery.
- **Do report**, deviating from `action=none` → 靜默, naming the incident and its recovery status.

## Also on the newest sha (separate, pre-existing)
`gh api "repos/DingJun1028/esggo/commits/a2804e8b/check-runs?per_page=100"` showed 3 `failure`
check-runs — `Workers Builds: wrangler-deploy / esggo / oa` — the chronic 21st–23rd class Cloudflare
reds (CF-side, not cron-repairable, trackers #909/#910). Unrelated to the outage; do not fold them in.

## Recovery follow-up — CORRECTED 2026-08-26T20:2x–20:35Z by the next cron turn

Step 2 as originally written (`gh run rerun <id> --failed`) is **empirically WRONG for this class**.
Verified on the very same run ids one poll later. What actually holds:

1. Confirm recovery from the status page, not from `gh`: `Actions -> operational`,
   `incidents/unresolved.json` → `unresolved_count=0`, and the incident's own `resolved_at`
   (here `Incident with Actions` created `15:11:58Z`, **resolved `18:01:30Z`**).
2. **`updated_at` vs `created_at` is the discriminator** between a frozen orphan and a live run —
   `status=queued` alone cannot tell them apart:

   | run | status | created → updated | verdict |
   | --- | --- | --- | --- |
   | `32985805274` ESG-GO CI/CD | queued | `15:40:11Z` → **`15:40:11Z`** | frozen orphan, untouched 4h47m |
   | `32985897557` Deploy to Oracle VPS | queued | `15:42:05Z` → **`15:42:05Z`** | frozen orphan |
   | `32985802867` OmniCore CI | queued | `15:40:08Z` → `20:26:13Z` | my rerun landed… and still never started |

3. **The orphans are WEDGED: two endpoints return mutually exclusive verdicts for the same run.**
   ```
   gh run cancel 32985805274  → Cannot cancel a workflow run that is completed
   gh run rerun  32985805274  → run ... cannot be rerun; This workflow is already running
   ```
   Neither cancellable nor rerunnable. Raw `runs/<id>` says `status=queued`, the cancel endpoint says
   *completed*, the rerun endpoint says *running*. Do not burn a turn fighting this.
4. **Rerunning a `startup_failure` orphan is ACCEPTED but does not recover it.** `gh run rerun` exited
   `0` for `32985802867` (OmniCore) and `32985211918` (image build) and bumped `updated_at` to
   `20:26:1xZ` — then both sat at `jobs total_count=0`, never scheduled, and **inherited the same wedge**
   (`cancel` → "already completed"). `rerun` exit `0` is NOT evidence of recovery; require
   `total_count > 0` **and** `status=in_progress`.
5. **The only thing that actually clears it is a FRESH TRIGGER.** A new push to main (`0e57bc1a`,
   `feat: ftg ESG … (#961)`) fanned out 6 workflows that ALL went `in_progress` within ~1 min — proof
   the platform was healthy for new work while the outage-window runs stayed wedged forever. A fresh
   push also **supersedes** the whole orphan batch, making main's verdict real again. So the correct
   cron posture is: verify recovery, do NOT chase the orphans, and let the next push resolve them
   (or wait for GitHub's ~24h queued expiry).
6. Skip orphans that are already moot before touching anything — this is most of them:
   - superseded sha where the newer sha already passed (Sacred `6cf0550c` startup_failure, but Sacred
     **succeeded** on `a2804e8b`);
   - `event=pull_request` runs whose PR is already **merged**
     (`51ee0310` = PR #960, merged `15:38:09Z` ⇒ its 2 startup_failures are meaningless).
   Check with `gh api repos/<r>/commits/<sha>/pulls --jq '.[] | "\(.number) \(.merged_at)"'`.
7. Never score `status=in_progress` / empty `conclusion` in either direction (burying #2), and
   re-verify any PR before landing it — its checks may have been skipped or throttled mid-incident.

**Net cron outcome for a recovery turn: 0 issues, 0 merges, 0 state advance, 2 useless reruns (now
documented so nobody repeats them), 1 report.**
