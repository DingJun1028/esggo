---
name: esggo-vercel-deploy
description: Fix esggo Vercel OOM, dead webhook, 15000-file errors.
---

# esggo Vercel Deploy

esggo's Next.js app deploys to Vercel (project `esggo`; preview URLs like `esggomvp-git-*-esggo.vercel.app`). This skill covers the recurring **systemic build-red** failure mode and its verified fix.

## Symptom
- Vercel dashboard: multiple preview deploys all show `● Error` (e.g. `esggomvp`, `esgss-jak`, `esgss_junaikey_beta`, `esggo-mvp`). `npm run build` exits 1.
- The Vercel build log shows ONLY `npm install` warnings (react peer-dep conflicts, `32 vulnerabilities`) and NO build error — the real failure is masked.
- Local `npm run build` AND `pnpm run build` BOTH pass (exit 0). So it is NOT a code bug.

## Root cause (verified)
`package.json` build script had hardcoded `NODE_OPTIONS=--max-old-space-size=8192` (8 GB). Vercel build instances (Hobby ≈1 GB, Pro default ≈3 GB) cannot allocate 8 GB → Node is OOM-killed during `next build` → `npm run build` exit 1. Vercel shows no useful log because the process dies before printing a build error (`never reached READY`).

## Memory tuning (proven by local reproduction — CORRECTED 2026-08-15)
- `NODE_OPTIONS='--max-old-space-size=2048' npx next build` → FAILS on /api/ai-notes/[id] (prerender crash, not OOM).
- `NODE_OPTIONS='--max-old-space-size=8192'` → passes locally, OOMs on Vercel (instance RAM < 8 GB).
- `NODE_OPTIONS='--max-old-space-size=3072'` → **STILL OOMs on Vercel**: `vercel build --yes` shows `Next.js build worker exited with code: 143` even at 3072. Vercel build RAM is below 3072.
- **`NODE_OPTIONS='--max-old-space-size=1536'` → passes locally (`pnpm build` exit 0) AND `vercel build --yes` reaches "✓ Compiled successfully" with no 143. This is the real fix.**

## Fix (must set in BOTH places, use 1536 NOT 3072)
1. `package.json` build script: `"build": "cross-env NEXT_TELEMETRY_DISABLED=1 NODE_OPTIONS=--max-old-space-size=1536 next build"`
2. `vercel.json`: `"env": { "NODE_OPTIONS": "--max-old-space-size=1536" }`

Why both: `hermes verify` / local `pnpm build` does NOT read `vercel.json` env, so `package.json` must carry it. Vercel's build step does NOT inherit `package.json`'s `NODE_OPTIONS` unless also declared in `vercel.json` `env`. Omit either → the red recurs.

## Diagnosis commands
- `vercel ls esggo` → list deploys; confirm systemic `● Error` across previews.
- `vercel inspect <preview-url>` → for build-stage failures returns `never reached READY and ended in ERROR` (no build log available).
- `vercel env ls` → esggo's env vars scoped to `Production` only. NOT the cause here: `prisma generate` works WITHOUT `DATABASE_URL` (project has `prisma.config.ts`, which skips env loading).
- Local reproduce: `NODE_OPTIONS='--max-old-space-size=2048' npx next build` (expect crash) vs `=3072` (expect pass).

## Notes
- `vercel.json`: `buildCommand: pnpm prisma generate && pnpm run build`, `installCommand: pnpm install --no-frozen-lockfile`, `framework: nextjs`.
- After fix: `git commit` + `git push origin main` → Vercel auto-redeploys. A specific failing PR branch (e.g. `sentinel/fix-hardcoded-api-keys-*`) may no longer exist in remotes (bot fork/branch cleaned up), but the systemic OOM root cause is fixed on `main`.
- `vercel` CLI: run via `npx vercel` or `vercel` if on PATH. `hermes` CLI binary is NOT installed in this env — cannot run `hermes verify`; verify via `pnpm build` + `vercel build --yes` instead.

## Webhook missing → no auto-deploy after push (2026-08-15)
- Symptom: `vercel ls esggo` last deploy 28d+ ago despite many pushes. `gh api repos/DingJun1028/esggo/hooks` → `[]` (VERCEL_HOOKS: 0).
- `vercel git connect` says "already connected" but does NOT recreate the GitHub webhook (y/N prompt blocks non-interactive). CLI cannot repair.
- Fix: add `deploy-vercel` job to `.github/workflows/deploy.yml` using `VERCEL_TOKEN` + `VERCEL_ORG_ID` + `VERCEL_PROJECT_ID` secrets (orgId/projectId from local `.vercel/project.json`), running `vercel deploy --prod --yes --archive=tgz`. This replaces the dead webhook.
- Pitfall: `deploy.yml` `paths:` may suppress the job if commit only touches `deploy.yml`+`docs/**`. Trigger with a `package.json`/`vercel.json` change, or `workflow_dispatch`. `git commit --allow-empty` does NOT match `paths`.

## VERCEL_TOKEN secret invalid (2026-08-15)
- `deploy-vercel` job fails: `The token provided via --token argument is not valid.` The GitHub secret `VERCEL_TOKEN` (created 2026-06-19) is expired/revoked.
- `vercel tokens list` shows tokens but `vercel tokens add` is interactive (y/N) — cannot create non-interactively from CLI.
- Local `vercel` CLI works (token in Windows credential manager, no plaintext file). Cannot extract the plaintext token to paste into GitHub.
- Fix: user copies a valid token from Vercel dashboard → GitHub secret `VERCEL_TOKEN`. Also needs `VERCEL_ORG_ID` + `VERCEL_PROJECT_ID` (from local `.vercel/project.json` orgId/projectId).

## CI concurrency starvation (2026-08-15)
- If `deploy-vercel` shares `concurrency: group: deploy-vps` with the VPS deploy job, other agents' continuous pushes cancel/queue it → `deploy-vercel` never completes (run shows `cancelled` or permanent `pending`).
- Fix: `deploy-vercel.yml` as a SEPARATE workflow with its own `concurrency: group: vercel-prod-deploy, cancel-in-progress: false`. Do not nest it inside `deploy.yml`.
- Monitor CI via `gh api repos/DingJun1028/esggo/actions/runs/{id}/jobs` (NOT `gh run view`/`gh run list --commit` — commit-scoped queries time out in this env).

## gh api monitoring note
- `gh run view <id> --json jobs` and `gh run list --commit <sha>` consistently time out in this shell env. Use `gh api "repos/DingJun1028/esggo/actions/runs?per_page=N"` (lists recent runs) or `gh api "repos/.../actions/runs/{id}/jobs"` directly.

## 15000-files limit on manual `vercel deploy` (2026-08-15)
- `vercel deploy` from local dir uploads ALL git-tracked files → `files should NOT have more than 15000 items, received 16167` (node_modules/vault counted).
- `.vercelignore` does NOT reduce git-tracked count. Git-integrated deploy (Actions) respects `.gitignore` and avoids this. Use `--archive=tgz` in Actions. On Windows git-bash `--archive=tgz` can hang >500s — run in Linux Actions runner.
- `vercel deploy --prebuilt` fails `npm install exited with 1` (ignores vercel.json installCommand) — avoid for pnpm projects.

## Reading the real build error
- `vercel inspect`/`vercel logs` return nothing for ERROR deployments ("never reached READY"). Get the actual error from the **GitHub Actions `vercel deploy` step log**, not Vercel CLI.

See `references/vercel-build-oom.md` for the full reproduction transcript.
