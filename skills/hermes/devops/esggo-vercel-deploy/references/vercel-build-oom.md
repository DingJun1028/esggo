# Vercel build OOM — full reproduction (CORRECTED 2026-08-15)

## IMPORTANT CORRECTION
Prior version claimed `3072` is the fix. WRONG. `vercel build --yes` at 3072 STILL OOMs
with `Next.js build worker exited with code: 143`. Vercel build instance RAM is below 3072.
**The real fix is `1536` (set in BOTH package.json and vercel.json).**

## Signal
Vercel `esggo` project: preview deploys `esggomvp`, `esgss-jak`, `esgss_junaikey_beta` all `● Error`.
Build log shows only `npm install` noise; no build error. `vercel ls esggo` last deploy 28d+ ago
(despite many pushes) → GitHub→Vercel webhook gone (`VERCEL_HOOKS: 0`).

## Local reproduction (the decisive test)
```
pnpm build                                        -> exit 0 (large local RAM)
vercel build --yes  @3072  -> ✓ Compiled successfully ... then:
   Next.js build worker exited with code: 143
   Error: Command "pnpm prisma generate && pnpm run build" exited with 143   <-- STILL OOM
vercel build --yes  @1536  -> ✓ Compiled successfully, serverless fns created,
   then EPERM symlink on Windows git-bash (NOT a build failure; Linux Vercel has no symlink limit)
pnpm build @1536            -> exit 0
```
Conclusion: 1536 is the value that fits Vercel build RAM.

## Root cause (two parts)
1. OOM: build script / vercel.json NODE_OPTIONS exceeded Vercel instance RAM. 8192 and 3072 both OOM.
2. No auto-deploy: GitHub webhook to Vercel missing (`vercel git connect` says "already connected"
   but won't recreate the webhook in non-interactive shells). Manual `vercel deploy` also fails the
   15000-files upload limit (git-tracked node_modules/vault = 16167 files).

## Fixes applied
- `package.json`: `"build": "cross-env NEXT_TELEMETRY_DISABLED=1 NODE_OPTIONS=--max-old-space-size=1536 next build"`
- `vercel.json`: `"env": { "NODE_OPTIONS": "--max-old-space-size=1536" }`
- `.github/workflows/deploy.yml`: added `deploy-vercel` job (uses VERCEL_TOKEN/ORG_ID/PROJECT_ID
  secrets; `vercel deploy --prod --yes --archive=tgz`). Replaces the dead webhook.
- Secrets set via `gh secret set`: VERCEL_TOKEN (NOT VERCEL_API_KEY), VERCEL_ORG_ID +
  VERCEL_PROJECT_ID from local `.vercel/project.json` (orgId/projectId).

## Pitfalls
- `deploy.yml` `paths:` can suppress the job if commit only touches deploy.yml+docs. Trigger with a
  package.json/vercel.json change or `workflow_dispatch`. `git commit --allow-empty` won't match.
- `.vercelignore` does NOT reduce git-tracked file count for `vercel deploy` (16167 stays → limit).
- `vercel deploy --prebuilt` fails `npm install exited with 1` (ignores vercel.json installCommand).
- `vercel inspect`/`vercel logs` return nothing for ERROR deployments. Read the Actions job log.

## Verify after fix
```
pnpm build          -> exit 0
vercel build --yes  -> reaches "✓ Compiled successfully", no 143
git push main       -> ESG-GO CI/CD Pipeline includes deploy-vercel -> vercel ls esggo shows ● Ready
```
