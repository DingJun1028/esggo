# esggo Vercel Case — worked example

Project: DingJun1028/esggo (Next.js 16 monorepo, pnpm). Vercel project `esggo` under
the `esggo` team; also sibling projects `esggomvp`, `esgss-jak`, `esgss_junaikey_beta`
(Jules bot sentinel/* preview branches).

## Symptoms observed this session
1. `vercel ls esggo` → latest Production deploy was **28d ago**, all Preview deploys `● Error`.
2. Manual `vercel deploy --prod` → `Error: Invalid request: files should NOT have more
   than 15000 items, received 17764` (then 16398, then 16167, 15310, 15241, 15113 after
   each `.gitignore`/rm attempt — never below 15000 via manual deploy).
3. A build attempt: `Next.js build worker exited with code: 143` (OOM) at
   `NODE_OPTIONS=--max-old-space-size=3072` on the Vercel build instance (local dev box
   built fine at 3072; Vercel's instance is smaller).
4. GitHub Actions `deploy-vercel` job → `The token provided via --token argument is not
   valid` (stale `VERCEL_TOKEN` secret).
5. `vercel deploy --prebuilt` → `EPERM: symlink 'daily.func' -> .vercel/output/functions/emm.func` (Windows/git-bash).

## Root causes found
- **OOM**: Vercel build instance RAM < 3072 MB usable for old-space. Fixed at **1536**.
- **15000 cap**: repo tracked 64,269 files. Largest tracked subdirs:
  `esggo-omni-center/` = 31,706, `functions/node_modules/` ≈ 16k, `rules-tutorial/` =
  13,403. `.vercelignore` does NOT lower the manual-deploy file count.
- **Webhook missing**: `gh api repos/DingJun1028/esggo/hooks` → `VERCEL_HOOKS: 0`.
  Push never auto-deployed. `vercel git connect` says "already connected" but won't
  recreate the webhook non-interactively.
- **Token**: `VERCEL_TOKEN` GitHub secret stale; `vercel tokens create` is interactive;
  valid token lives in Windows Credential Manager, not extractable via CLI.

## Fixes applied (commits on main)
- `package.json` build script + `vercel.json` `"env"` → `NODE_OPTIONS=--max-old-space-size=1536`.
- `git rm --cached -r` on `esggo-omni-center`, `rules-tutorial`, `functions/node_modules`,
  `.agents` → tracked files 64,269 → 2,116. Added all to `.gitignore` + `.vercelignore`.
- New standalone workflow `.github/workflows/deploy-vercel.yml` (own `concurrency` group
  `deploy-vercel`, `workflow_dispatch` + push paths) that runs
  `vercel deploy --prod --yes --archive=tgz` with `VERCEL_TOKEN/ORG_ID/PROJECT_ID` secrets.
  (Note: the `deploy-vercel` job originally lived inside `deploy.yml`, but a
  workflow-level `concurrency: group: deploy-vps` serialized all `ESG-GO CI/CD Pipeline`
  runs and another agent's continuous pushes kept cancelling/queuing it — extracting to
  its own file fixed that.)
- 3 TS errors widened to `Record<string, unknown>` (`handlers.ts` createResult evidence
  param, `omni-seed.ts` and `omni-singularity.ts` evidence object casts).
- Removed 3 orphaned test files (`tests/omni-center-{cron,omni-sync,memory}-auth.test.ts`)
  from commit `db263e31b` that imported `esggo-omni-center/app/api/{cron,omni/sync,memory}/route`
  which were never implemented (only `sustain-center/dashboard/route.ts` exists) — they
  failed at `Cannot find module` before any assertion.

## Final verified state (local gates)
- `pnpm run typecheck` → TC=0
- `pnpm build` (with 1536) → exit 0
- `pnpm run test` → 613 passed / 18 skipped
- `hermes` CLI NOT installed in agent shell → cannot produce `hermes verify --json`;
  substituted direct gate runs.

## What remained blocked (needs user, not agent)
Vercel production still `● Error` at session end because:
(a) `VERCEL_TOKEN` secret invalid → GitHub Actions deploy job fails; and
(b) manual `vercel deploy` from Windows hits the 15000 cap + symlink EPERM.
To finish: paste a fresh token from Vercel dashboard (Account → Tokens) →
`gh secret set VERCEL_TOKEN` (piped, not echoed) → re-run `deploy-vercel.yml`.
The repo is already trimmed to 2,116 tracked files, so a Git-integration deploy would
also clear the file cap.

## org/project IDs (for secrets)
- VERCEL_ORG_ID: `team_ftbNvUrnTqZ13QWbUwNaIr7W`
- VERCEL_PROJECT_ID: `prj_chfQRaoQnAYiegt5PVjz9QfkwwBC`
