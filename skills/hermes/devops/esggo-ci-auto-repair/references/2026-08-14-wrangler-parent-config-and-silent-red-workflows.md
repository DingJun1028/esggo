# 17th class: `wrangler_parent_config_resolution` — deps installed in the WRONG tree

Discovered 2026-08-14 cron turn (03:2x). Run `31617019222`, `Deploy OmniGateway Worker`, sha `c6179199`.
**Invisible to the 9/15-class log-grep triage**: no TS / ESLint / pnpm / Trivy / secret signature appears
anywhere in the log.

> NOTE: this class could not be added to `SKILL.md` — that file is already at its **100,000-character
> limit** (a candidate patch measured 103,169). SKILL.md needs splitting into references before any new
> inline class can be documented. Treat that as an open maintenance task.

## Signature
Job `Deploy OmniGateway Worker` → step `Deploy to Cloudflare Workers`:
```
[custom build] Error: Cannot find module
  '/home/runner/work/esggo/esggo/worker/my-worker/node_modules/typescript/bin/tsc'
✘ [ERROR] Command failed with exit code 1:
  node my-worker/node_modules/typescript/bin/tsc -p my-worker/tsconfig.json
✘ [ERROR] Running custom build `node my-worker/node_modules/...` failed
##[error]The process '.../npx' failed with exit code 1
```
`cut -f1,2 <log> | sort -u` → exactly one job/step pair. The *typecheck* step passes and therefore never
appears in `--log-failed` at all: **the code is fine, the wiring is not.**

## Root-cause chain — all provable read-only (no install, no checkout in the shared clone)
```bash
git show origin/main:.github/workflows/deploy-worker.yml | grep -nE "working-directory|run:|workingDirectory"
git ls-tree -r --name-only origin/main worker      # is there a wrangler config HERE?
git show origin/main:wrangler.toml | grep -nA2 "\[build\]"
git ls-tree -r --name-only origin/main my-worker   # package.json + lockfile present, never installed
```

| # | Fact | Evidence |
| --- | --- | --- |
| 1 | workflow installs typescript ONLY in `worker/` | `deploy-worker.yml:31-33` → `working-directory: worker` + `npm init -y && npm install --save-dev typescript @types/node` |
| 2 | `worker/` contains **no wrangler config**, so wrangler v4 walks UP to the repo-root `wrangler.toml` — a *different* worker (`name = "esggo"`, `main = "my-worker/src/index.ts"`) | `git ls-tree -r origin/main worker` → only `.gitignore / README.md / __tests__ / sim.mjs / src / tsconfig.json`; workflow passes only `workingDirectory: worker` |
| 3 | that root config's `[build]` needs `my-worker/node_modules`, which CI never installs | `[build] command = "node my-worker/node_modules/typescript/bin/tsc -p my-worker/tsconfig.json"`; `my-worker/` has `package.json` + `pnpm-lock.yaml` but no install step targets it |

**One-line diagnosis: deps installed in `worker/`, build command requires `my-worker/`.**

### The scarier half is silent
`workingDirectory: worker` + parent-config resolution means CI is deploying the **ROOT** worker — a
different worker than the workflow's name implies. Write that into the tracker; it is a product-intent
question, not a lint fix.

## NOT auto-repairable under cron
All three candidate fixes change **production deploy targets** and none can be mechanically verified
without a real Cloudflare deploy:
- **A (smallest):** add `Install my-worker deps` step — `working-directory: my-worker` + `npm ci`
  (lockfile already present).
- **B:** change root `[build]` to `npx tsc -p my-worker/tsconfig.json` (no hard-coded `node_modules` path).
- **C (root fix):** give `worker/` its own wrangler config so wrangler stops resolving the parent one.

Correct cron output: **comment with evidence, do not push.**
Acceptance: `grep -c "Cannot find module"` → **0**, job `Deploy to Cloudflare Workers` → `success`,
**and** the Cloudflare worker actually updated matches intent (A/B leave it as root `name = "esggo"`).

---

## Companion lesson: a CLEAN gap scan does not mean every workflow is green

Both trackers audited this turn were red at their **latest run** while being completely absent from a
newest-sha gap scan, for two different structural reasons:

| Tracker | Workflow | All-time | Why the gap scan misses it | Class |
| --- | --- | --- | --- | --- |
| #686 | `Deploy OmniGateway Worker` | **5/5 red** (08-05 → 08-12) | `paths:` filter — never re-runs on unrelated pushes | 17th (above) |
| #634 | `deploy-deerflow-vps` | **2/2 red** (08-01, 08-11) | `event=workflow_dispatch` only — never push-triggered | `repair-ssh-deploy-key` |

`deploy-deerflow-vps` signature: `***@***: Permission denied (publickey).` + `exit code 255` on the
first `ssh` — a credential-state problem, so re-running just re-fails. Not auto-repairable; needs VPS
`authorized_keys` / secret rotation from a foreground session.

Audit such workflows explicitly:
```bash
gh run list --repo <r> --workflow "<name>" --limit 5 --json databaseId,conclusion,headSha,createdAt,event
```

### Sixth "nothing-to-do" shape
watcher `action=none` + gap scan clean + all newest-sha runs green + the one genuinely-red workflow
already sibling-covered — **but** old OPEN trackers sitting at **0 comments** whose workflow is still red
at its latest run ⇒ **0 issues, 2 root-cause comments, 0 pushes, 0 state writes**.

`gh issue view <n> --json comments --jq '.comments | length'` → `0` on an OPEN tracker is the cheapest
uncovered-surface probe available. **Run it even on a turn that looks silent** — it was this turn's entire
deliverable.

### `cancelled` is not `failure`
On a busy repo, consecutive pushes concurrency-cancel the previous run: `bb1088b6` OmniCore CI was
`cancelled` because `fc0f8d0f` landed 3 minutes later. Never triage a `cancelled` run as a red, and never
count it as a pass either — resolve the newest sha and read that.

### Do NOT hand-advance `oa-twins-tracker.py` state
The script calls `save_state` itself. This turn wrote **0** state files deliberately (the skill's
two-state-paths warning); the only writes were two GitHub comments.
