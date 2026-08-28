# startup_failure where `yaml.safe_load` says OK — job-level `if:` using `env` (2026-08-11)

The 10th-class recipe reproduces a startup_failure with
`python3 -c "import yaml; yaml.safe_load(open('<wf>'))"`. That finds **syntax** faults only.
Actions *also* compiles the file against its own schema, so a schema/expression fault produces the
**identical** signature while PyYAML prints `YAML_OK` — following the recipe alone dead-ends.

## Signature

```
gh run list  → 31457481993 failure push 0e211258 .github/workflows/ci.yml
gh api repos/DingJun1028/esggo/actions/runs/31457481993/jobs --jq '.total_count'   → 0
gh run view 31457481993 --log-failed                        → failed to get run log: log not found
gh api repos/DingJun1028/esggo/actions/runs/31457481993 --jq '.conclusion'         → failure
python3 -c "import yaml; yaml.safe_load(open('ci.yml'))"    → YAML_OK      ← the trap
```

Note `conclusion` is plain **`failure`**, not `startup_failure`. Do not filter on the latter.

## The decisive tell: the workflow RECORD's name degrades to the file path

GitHub stores the parsed `name:` on the workflow record. When compilation fails it falls back to the
path. The file itself still contained `name: OmniCore CI` on line 8 — reading the file is what misleads;
read the **record**:

```bash
gh api repos/DingJun1028/esggo/actions/workflows --jq '.workflows[] | "\(.state)\t\(.name)\t\(.path)"'
```

```
active   .github/workflows/ci.yml            .github/workflows/ci.yml     ← broken
active   ESG-GO CI/CD Pipeline               .github/workflows/deploy.yml
active   🌌 ESG GO Sacred Pipeline (CI/CD)   .github/workflows/sacred-pipeline.yml
...23 siblings all showing real names
```

## Dating the breakage — the runs listing names the guilty sha

```bash
gh api "repos/DingJun1028/esggo/actions/workflows/285304224/runs?per_page=8" \
  --jq '.workflow_runs[] | "\(.id) \(.conclusion) \(.head_sha[0:8]) \(.name)"'
```

| sha | conclusion | name |
| --- | --- | --- |
| `06ab320a` | success | `OmniCore CI` |
| `679517a7` | **failure** | `.github/workflows/ci.yml` |
| `0e211258` | **failure** | `.github/workflows/ci.yml` |

The flip point IS the cause. Go straight there:

```bash
git log origin/main --oneline -6 -- .github/workflows/ci.yml
git diff <prev> <flip_sha> -- .github/workflows/ci.yml
```

## Root cause: `env` is not an available context in job-level `if:`

`jobs.<job_id>.if` allows only `github` / `needs` / `vars` / `inputs`. **`env` and `secrets` are not
available.** They *are* available at step level — which is why `${{ env.NODE_VERSION }}` inside a
step's `with:` coexists happily in the same file and makes the bad line look plausible.

```yaml
  sonar-agentic:
    if: ${{ env.SONAR_TOKEN != '' }}        # ← kills the ENTIRE workflow
```

Doubly broken here: `SONAR_TOKEN` was never in the workflow-level `env:` block either (only
`NODE_VERSION`, `PNPM_VERSION`, two ACTIONS flags), so the gate could never be non-empty.

Scan for it:
```bash
git show origin/main:.github/workflows/ci.yml | grep -nE '^    if:.*env\.'
```

Note the checks that do **not** catch this: no duplicate keys, no dangling `needs:` — a strict
duplicate-key loader plus a `needs`-vs-job-id validator both came back clean.

## Fix

No mechanism exists to gate a job on a *secret's presence* at job level. Use a repo variable —
one line, preserves "unconfigured ⇒ skip", allocates no runner:

```yaml
    if: ${{ vars.SONAR_ENABLED == 'true' }}
```
```bash
gh variable set SONAR_ENABLED --body true   # + gh secret set SONAR_TOKEN
```

Heavier alternatives: a gate job whose output feeds `needs:`, or step-level `if: env.X != ''`
(the job then always allocates a runner — worse under a free-compute constraint).

## Why this class is dangerous

The dead workflow was the main quality gate. For 38 minutes of pushes,
`typecheck / eslint / test / ut-tests / secret-scan / build / docker / lighthouse / agents-yaml /
validate-vps` ran **zero** times while CI merely looked "red as usual". Because the run emits no log,
**every log-grep class is structurally blind to it**.

> Rule: a `failure` run whose log cannot be fetched must be checked for `total_count: 0`
> before any classification is attempted.

## Verification (job scheduling, never run conclusion)

| metric | before `31457481993` | PR run `31458898565` | post-merge main `31459254058` |
| --- | --- | --- | --- |
| jobs `total_count` | **0** | **12** | **12** |
| `--log-failed` | `log not found` | normal | normal |
| record name | `.github/workflows/ci.yml` | — | **`OmniCore CI`** |
| run conclusion | failure | **success** | all jobs green |

`SonarQube Agentic Analysis (UT)` reporting **`skipped`** is positive confirmation the new `vars`
gate evaluates correctly rather than erroring.

Whole loop closed in one cron turn: fix in an isolated worktree → PR #596 → verify on the PR's own
run → `isDraft=false` + `MERGEABLE` + `changedFiles=1` → squash-merge → post-merge main re-verify →
evidence comments on trackers #594/#595 → close both.
