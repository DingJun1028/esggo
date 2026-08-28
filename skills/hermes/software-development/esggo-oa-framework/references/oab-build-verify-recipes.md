# oab-build-verify-recipes.md

Canonical, session-validated recipes for building and verifying the OA TS packages
(`packages/oa-framework`, `packages/omni-agent-bus`). Captured 2026-08-11.

## 1. Strict build (catches type gaps `--noEmit` hides)

`tsc -p tsconfig.json` (no `--skipLibCheck`, no `--noEmit`) is the STRICT check.
`--noEmit --skipLibCheck` can pass while the real build fails (e.g. `IComponentCore.evidence`
typed gap, incomplete `dist/`). Always run the strict build after editing `types.ts` or any
interface consumed by `forgeT5`.

```bash
cd /c/Project/esggo/packages/oa-framework
npx --no-install tsc -p tsconfig.json --noEmit --skipLibCheck   # fast pre-check
npx --no-install tsc -p tsconfig.json                           # STRICT build (emits dist/)
echo "BUILD_EXIT=$?"
```

oa-framework tsconfig MUST be standalone (no `extends` root): `noEmit:false`,
`module/moduleResolution: NodeNext`, `include: ["src/**/*.ts"]`. NodeNext makes emitted
imports carry `.js` (required for Node ESM dynamic import by OAB bridge).

## 2. Background test (slow-env timeout avoidance)

Foreground `pnpm run test` / `npx tsc` hit the 120s tool timeout on this host even when
correct. Launch in background and poll:

```bash
# oa-framework
terminal(background=true, notify_on_complete=true):
  cd /c/Project/esggo/packages/oa-framework && timeout 300 npx --no-install tsx test/smoke.ts

# omni-agent-bus (full suite = 3 smokes)
terminal(background=true, notify_on_complete=true):
  cd /c/Project/esggo/packages/omni-agent-bus && timeout 400 pnpm run test

# then: process(action='wait'/'poll', session_id=<id>)
```

Expect: oa-framework `RESULT: ALL_9_ROUTED_OK` (routeTo has 9 non-networking adapters;
`agentreach` is excluded — it runs real CLI and hangs). omni-agent-bus:
`OMNI_AGENT_BUS_OK` + `DEPLOY_GATE_OK` + `oa-framework 載入: AVAILABLE` + `OA_PIPELINE_OK`.

## 3. Cross-package regression (MANDATORY after editing either package)

After any oa-framework change, REBUILD its `dist/` (recipe 1) so the OAB bridge's
dynamic `import('@esggo/oa-framework')` resolves the new code, THEN run OAB `pnpm run test`.
Reporting only one package's green result triggers the stale-verification guard.

```bash
cd /c/Project/esggo/packages/oa-framework && rm -rf dist && npx --no-install tsc -p tsconfig.json
cd /c/Project/esggo/packages/omni-agent-bus && pnpm run test   # background per recipe 2
```

If OAB shows `oa-framework 載入: UNAVAILABLE` after a rebuild, check: dist exists +
`dist/index.js` imports carry `.js` (NodeNext) + `packages/omni-agent-bus/package.json` has
`"@esggo/oa-framework": "workspace:*"` and `pnpm install` was run (symlink present at
`packages/omni-agent-bus/node_modules/@esggo/oa-framework`).

## 4. Branch-drift guard (commit lands on main, not a side branch)

This repo's working tree is frequently on a non-`main` branch (another session's WIP).
Before committing OA work:

```bash
git branch --show-current          # if NOT 'main', note it
# ... stage only oa-framework/omni-agent-bus files ...
git commit -q -m "feat(oa): ..."
git checkout main
git merge <branch-name> --no-edit
git push origin main              # confirm push line ends "main -> main"
```

Tell-tale you missed it: `git push origin HEAD` prints `* [new branch] HEAD -> <branch>`.
Fix by merging the side branch into main and pushing main.

## 5. GitHub-error-watch cron (auto-repair + OA swarm tracking)

`C:\Users\dingj\AppData\Local\hermes\scripts\gh-error-watch.py` polls
`DingJun1028/esggo` workflow runs, detects NEW failures (state file suppresses repeats),
downloads real failed logs, classifies error type. Cron job `gh-error-mail-watch`
(every 15m, skill `esggo-ci-auto-repair`) runs it and, on `action=="delegate"`, opens a
tracking issue (label `OmniAgent`) + delegates OA-swarm repair.

Real run proof (this session): detected 5+ real CI failures (ESG-GO CI/CD, Deploy to VPS,
Sacred Pipeline, learning-center-ci, AI Station image). `action` flips to `none` once the
state file records the newest run id.

`gh issue create` gotcha: use `-l`/`--label` (singular), labels must pre-exist
(`OmniAgent`, `auto-fix`, `github_actions` exist; `auto-repair`/`swarm` do NOT in repo).

## 6. What NOT to use for OA verification

`hermes verify --json` — triggers Hermes's own update-recovery and fails on a corrupted
hermes venv (`pyyaml` METADATA missing). Says nothing about OA packages. Use recipe 2.
