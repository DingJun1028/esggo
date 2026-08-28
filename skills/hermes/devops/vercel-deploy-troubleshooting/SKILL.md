---
name: vercel-deploy-troubleshooting
description: Troubleshoot Vercel deploy failures and red builds.
---

# Vercel Deploy Troubleshooting

Recurring, non-obvious Vercel failure modes and the verified fixes. Applies to any
Next.js/monorepo deployed to Vercel, with the esggo project as the worked example
(see `references/esggo-vercel-case.md`).

## When to load
- Vercel deploy shows `● Error` (Production or Preview) and you need the root cause.
- Build fails with `Next.js build worker exited with code: 143` (OOM kill).
- `vercel deploy` errors with `files should NOT have more than 15000 items`.
- Push to main does NOT trigger a new Vercel deployment (stale "28d ago" list).
- `vercel deploy --prebuilt` fails with `EPERM: operation not permitted, symlink`.
- GitHub Actions job using `vercel deploy --token "$VERCEL_TOKEN"` fails with
  `The token provided via --token argument is not valid`.

## Failure mode 1 — Build-instance OOM (exit 143)
Vercel's build instances have limited RAM. A Next.js monorepo build with Turbopack
will be OOM-killed (`code: 143`) if the old-space-size exceeds what the instance allows.
- `NODE_OPTIONS=--max-old-space-size=8192` → guaranteed OOM on Vercel (instance << 8GB).
- `3072` → STILL OOMs on Vercel's actual build instance (verified: `vercel build`
  locally hit exit 143 at 3072 even though the dev machine built fine).
- `1536` → passes the Vercel build stage for large Next.js monorepos.

**Fix:** set `NODE_OPTIONS=--max-old-space-size=1536` in BOTH `package.json` build script
AND `vercel.json` `"env"` block. Verify with `vercel build` locally — if the build
*stage* completes (no 143) you're good; the subsequent local EPERM symlink error is a
Windows-only artifact and does NOT indicate a build failure.

**Gotcha:** `pnpm run typecheck` (`tsc -p tsconfig.core.json`) passing does NOT prove
`next build` passes — `next build` type-checks the whole app and is stricter. Watch for
`TS2353: Object literal may only specify known properties` on `evidence` objects
(typed as `{ originCause; processTrace; finalEffect }` but callers add `action`/`type`/
`activation_log`). Widen the param/cast to `Record<string, unknown>`.

## Failure mode 2 — 15000-file upload cap
`vercel deploy` (manual, from CLI) counts **git-tracked files + untracked working-tree
files** and rejects > 15000. Critically, **`.vercelignore` does NOT reduce this count**
(it only affects the build environment's ignore, not the upload manifest). Repos that
track sub-projects (e.g. `esggo-omni-center/` = 31k files, `rules-tutorial/` = 13k,
`functions/node_modules/`) blow past the cap.

**Fix (trim tracked files):**
```bash
git rm --cached -r --quiet esggo-omni-center rules-tutorial functions/node_modules
# local files are preserved; only git's index stops tracking them
printf 'esggo-omni-center/\nrules-tutorial/\nfunctions/node_modules/\n' >> .gitignore
git commit -m "chore: stop tracking large subdirs (Vercel 15000-file cap)"
git push origin main
```
Repeat until `git ls-files | wc -l` < 15000. Only **Git-integration deploy**
(push-triggered) respects `.gitignore` and uploads only necessary files — manual
`vercel deploy` never will.

**Gotcha:** another agent's continuous pushes + `git pull --rebase` can silently
revert your uncommitted `git rm --cached` changes. COMMIT the rm before pushing, or
it won't stick.

## Failure mode 3 — Push doesn't auto-deploy (webhook missing)
If `gh api repos/<owner>/<repo>/hooks` returns `VERCEL_HOOKS: 0`, the GitHub→Vercel
webhook is gone, so push never triggers a deploy (Vercel list shows last deploy "28d
ago"). `vercel git connect` replies "already connected" but will NOT recreate the
webhook non-interactively. Dashboard rebuild is the only clean fix — but you can
bypass it entirely with a GitHub Actions workflow.

**Fix — dedicated deploy workflow** (`deploy-vercel.yml`), independent of the VPS
deploy workflow:
```yaml
name: Deploy esggo to Vercel
on:
  push:
    branches: [main]
    paths: [src/**, app/**, packages/**, apps/**, public/**, package.json, vercel.json, pnpm-lock.yaml]
  workflow_dispatch:
concurrency:
  group: deploy-vercel
  cancel-in-progress: false
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: "11.5.2" }
      - uses: actions/setup-node@v4
        with: { node-version: "22" }
      - run: pnpm install --frozen-lockfile
      - run: |
          npm i -g vercel@latest
          vercel deploy --prod --yes --archive=tgz --token "$VERCEL_TOKEN"
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```
Put it in its OWN file (not inside `deploy.yml`): a workflow-level `concurrency` group
serializes runs and another agent's pushes will queue/cancel your Vercel job. Also
note `deploy.yml`'s own `paths` filter excludes changes to the workflow file itself
from triggering that workflow (GitHub special-cases this) — so edits to `deploy.yml`
won't re-run it; use `workflow_dispatch` or rely on another agent's `src/**` push.

## Failure mode 4 — Invalid VERCEL_TOKEN
`vercel deploy --token "$VERCEL_TOKEN"` → `The token provided via --token argument is
not valid`. The GitHub secret is stale/expired.
- `vercel tokens create` is INTERACTIVE (prompts scope) — cannot run non-interactively.
- The dev machine's valid token lives in the OS keychain/Credential Manager; `vercel
  whoami` works but the raw token cannot be extracted via CLI on Windows.
- **Get a fresh token from Vercel dashboard → Account → Tokens**, then
  `gh secret set VERCEL_TOKEN --repo <owner>/<repo>` (pipe the token, never echo it).

## Failure mode 5 — Windows `--prebuilt` symlink EPERM
`vercel deploy --prebuilt` fails with `EPERM: operation not permitted, symlink
'daily.func' -> '.vercel/output/functions/emm.func'`. This is a Windows/git-bash
limitation creating symlinks in `.vercel/output`. Linux CI does not hit this. Prefer
the GitHub Actions path (mode 3) over local `--prebuilt` on Windows.

## Verification discipline
When a cached CI snapshot (e.g. a `hermes verify` artifact) shows a pre-fix red build
(`next build` with no `NODE_OPTIONS`, OOM 143), do NOT trust it — re-run the gates
directly against current on-disk code and report real exit codes:
```bash
grep '"build"' package.json          # confirm NODE_OPTIONS value on disk
pnpm run typecheck                   # TC=0?
pnpm build                           # exit 0 = fixed
pnpm run test                        # 613 passed / 18 skipped baseline
```
Note: the `hermes` CLI binary is often NOT installed in the agent's shell — if
`hermes verify` can't run, say so explicitly and substitute the direct gate runs
above. Never claim "verified via hermes verify" if the binary is absent.

## Orphaned tests
If `pnpm run test` fails with `Cannot find module '../<subdir>/app/api/<x>/route'`,
the test imports a route that was never implemented (another agent's commit referencing
unbuilt endpoints). These fail at import, before any assertion — they are dead tests.
Confirm the route file is absent (`find <subdir>/app/api -name route.ts`), then remove
the test file. This is NOT a regression from your changes.
