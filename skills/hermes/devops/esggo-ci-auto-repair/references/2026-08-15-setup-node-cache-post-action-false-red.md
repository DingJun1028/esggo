# 17th class: `Post Setup Node.js` cache Path Validation — a POST-ACTION false red

Discovered 2026-08-15 cron turn. Fixed + merged same turn (PR #761, `50bd9ec04`).

## Signature

In `--log-failed`, **col 2 (step name) is `Post Setup Node.js`**:

```
##[error]Path Validation Error: Path(s) specified in the action for caching do(es) not exist,
hence no cache is being saved.
```

`cut -f1,2 <log> | sort -u` returning ONLY post-action steps is the whole tell:

```
Code Quality            Post Setup Node.js
Validate VPS Scripts    Post Setup Node.js
```

Every *real* step passed. `actions/setup-node`'s `cache:` post-action failed to save the pnpm store,
which flips the JOB to `failure` and `skipped`-s everything downstream. On esggo `e0340eff` that meant
`docker-build` **and** `deploy` were skipped — **a real deploy blocked by a non-failure.**

## Confirm it is a false red via STEP conclusions, never job conclusions

```bash
gh run view <id> --repo DingJun1028/esggo --json jobs \
  --jq '.jobs[] | select(.name=="<job>") | .steps[] | "\(.conclusion)\t\(.number)\t\(.name)"'
```

esggo run `31858448648` @ `e0340eff`:

| Job | Real steps | Post step |
| --- | --- | --- |
| `Validate VPS Scripts` | 5 `Lint vps shell / node / python scripts` **success**, 6 `Secret scan on vps scripts` **success** | 10 `Post Setup Node.js` **failure** ← only red |
| `Code Quality` | 5/9 install, 6/10 ESLint, 7/11 tsc, 12 tests — **all success** | 22 `Post Setup Node.js` **failure** ← only red |

## Two independent causes, both in `.github/workflows/deploy.yml`

| Job | Why the store path is absent at post time |
| --- | --- |
| `validate-vps-scripts` | declares `cache: 'pnpm'` but **never runs `pnpm install`** — store dir never created |
| `code-quality` | **duplicated `pnpm/action-setup@v4`** (2nd adds `version: ${{ env.PNPM_VERSION }}` = `11.5.2`) re-installs pnpm and relocates the store *after* setup-node resolved the path |

## It is INTERMITTENT — do not claim deterministic recurrence

Learned the hard way in the same turn. `deploy.yml` was **byte-identical** between the two shas
(`git diff e0340efff db0d94cf0 -- .github/workflows/deploy.yml` → **empty**):

| sha | run | `Code Quality` | `Validate VPS Scripts` |
| --- | --- | --- | --- |
| `e0340eff` 02:09 | 31858448648 | **failure** | **failure** |
| `db0d94cf` 02:21 | 31858975317 | **success** | **success** |

The condition depends on whether the store path happens to exist at post time (cache-hit / prior-run
state). So the inference *"YAML unchanged ⇒ will recur"* is **WRONG**. Frame the fix as
「間歇性 flake / 加固修復」, never as 「解除當前阻斷」 — and if you already published the wrong
inference, post an explicit self-correction comment.

## Repair: `repair-setup-node-cache`

Minimal, zero-risk, ideal cron scope. Caching is a pure speed optimisation;
`pnpm install --frozen-lockfile` behaviour is untouched. `validate-vps-scripts`'s cache declaration
was **never valid** in the first place (no install).

```yaml
        uses: actions/setup-node@v4
        with:
          node-version: '22'
-         cache: 'pnpm'
```

Use `patch` with `replace_all=true` — the block repeats identically per job. Match on the whole
`uses:`+`with:` block, not the bare `cache:` line.

### Verify: key gone from EVERY setup-node step + workflow `name` not degraded

```bash
python3 -c "
import yaml,sys
d=yaml.safe_load(open('.github/workflows/deploy.yml'))
print('YAML_OK name=',d.get('name'))
print('jobs=',list(d['jobs'].keys()))
bad=[j for j,v in d['jobs'].items() for s in (v.get('steps') or [])
     if 'setup-node' in str(s.get('uses','')) and 'cache' in (s.get('with') or {})]
print('REMAINING_CACHE_JOBS=',bad); sys.exit(1 if bad else 0)"
```

Actual output:
```
YAML_OK name= ESG-GO CI/CD Pipeline
jobs= ['security-scan', 'code-quality', 'docker-build', 'deploy', 'validate-vps-scripts']
REMAINING_CACHE_JOBS= []
EXIT=0
```
The `name` check doubles as the schema-startup_failure guard (a degraded `name` = path ⇒ schema fault).

## Proof of fix = the same STEP flipping

| | main `e0340eff` (31858448648) | PR #761 (31859984134) |
| --- | --- | --- |
| step 22 `Post Setup Node.js` | **failure** | **success** |
| job `Code Quality` | **failure** | **success** |

All 17 `Code Quality` steps success on the PR run. Post-merge `origin/main`:
`git show origin/main:.github/workflows/deploy.yml | grep -c "cache: 'pnpm'"` → **0**.

## TRAP 1 — `validate-vps-scripts` CANNOT be verified on a PR run

It carries `if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/production'`, so on a
`pull_request` event it reports **`skipped`**. Only a post-merge `main` run proves that job.

## TRAP 2 — `concurrency: group: deploy-vps` can cancel your post-merge proof

Seen this turn: the merge-commit run (`50bd9ec0`, 31860625871) and the next push's run
(`a882e9b2`, 31860726833) were **both `cancelled`** by the concurrency group before completing. So the
authoritative post-merge verification may simply be **unavailable inside the turn**.

Report it as an **open verification item**. Do not let `cancelled` read as pass or fail —
it is neither, exactly like an empty `conclusion`.

## Leave for a foreground session (deliberately NOT auto-fixed)

The duplicated `Setup pnpm` + `Install dependencies` + ESLint/tsc block in `code-quality` (steps 8–12
shadowing 3–7). It is the *co-cause* of this class, but removing it also drops `pnpm test` — only the
2nd round runs it. That is a product decision, not an auto-repair. Name it in the PR body.
