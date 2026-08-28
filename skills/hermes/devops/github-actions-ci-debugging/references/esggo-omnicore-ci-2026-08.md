# esggo OmniCore CI #1545 / #1547 — Case File (2026-08-01)

## Run resolution math (worked example)
- `OmniCore CI` = `.github/workflows/ci.yml`, workflow id `285304224`, ~1547 runs.
- User said「修復 OmniCore CI #1545」→ that's `run_number`. Query `workflows/285304224/runs?per_page=100&page=16` → newest-first ⇒ run #1545 = 3rd item from the top (`1548 − 1545`). Resolved: **run id `30685138609`**, head `61779e2` ("ci: fix docker syntax check - only validate compose files"), conclusion failure.
- Latest main (`4a86408c`, "feat: merge esggo-learning-center into monorepo as apps/learning-center") produced run #1547 with the **identical** two failing jobs — so the fix targets main, not the old commit.

## Failing jobs & root causes
1. **Build Check → Build (`pnpm build`) failure** — 7 root `app/api/**/route.ts` files, 11 broken `@/lib/...` imports. tsconfig `@/*` → `./src/*`, but these routes import root `lib/` modules as `@/lib/...` → resolves to nonexistent `src/lib/` → `Module not found`.
   Files (imports to rewrite to `@lib/...`):
   - `app/api/awaken/ritual/route.ts` (3: `adk/ten-wings-agents`, `adk/arvo-wings-agents`, `services/adk/apostle-squad-manager`)
   - `app/api/awaken/pulse/route.ts` (2: `services/adk/apostle-dispatcher-server`, `services/adk/apostle-squad-manager`)
   - `app/api/esg/go/route.ts` (1: `services/esg/DataOrchestratorServer`)
   - `app/api/esg/verify/route.ts` (1: `services/esg/DataOrchestratorServer`)
   - `app/api/esg/report/route.ts` (1: `services/esg/ReportGeneratorServer`)
   - `app/api/library/download/route.ts` (2: `services/google-drive`, `services/ncbdb`)
   - `app/api/reconnaissance/gateway/route.ts` (1: `core/5t-protocol`)
   One-line fix: `grep -rl "@/lib/" app/api --include="route.ts" | xargs sed -i "s|from '@/lib/|from '@lib/|g; s|from \"@/lib/|from \"@lib/|g"` (preserves valid `@/shared/types`).
2. **Validate VPS Scripts → Docker syntax check failure** — two compounding bugs:
   - `vps/docker-compose.yml` `esggo` service uses `build.context: /opt/esggo` (VPS-only absolute path) → `docker compose config --quiet` fails on runner. Fix: `context: ..` (matches `docker-compose.prod.yml`).
   - `.github/workflows/ci.yml` Docker step pipes `2>/dev/null` on both `docker compose config` and `docker build --check` → real error hidden. Fix: drop the redirect (hard-fail compose, demote `docker build --check` to warning since the Dockerfile COPY sources like `apps/gateway/model-router.mjs` only exist in prod context).
3. **learning-center-ci run #1 (bonus)** — both jobs died in 1s at **Setup pnpm**: `pnpm/action-setup@v4 with version: 11` (bare major) fails resolution; OmniCore CI uses `version: 11.5.2` (matches `packageManager: pnpm@11.5.2`) and succeeds. Fix: pin `11.5.2`.

## Repo structure facts (durable)
- esggo root `package.json`: `packageManager: pnpm@11.5.2`, workspaces `packages/*` + `apps/*`, engines `node >=20`, scripts `build` = `next build`, `typecheck` = `tsc -p tsconfig.core.json`.
- `pnpm-workspace.yaml`: packages `apps/*`, `apps/*/functions`, `packages/*`, `.`; `allowBuilds: esbuild=true, @prisma/*=true, sharp=true`; overrides postcss/uuid/gaxios/glob/minimatch.
- learning-center was merged INTO esggo as `apps/learning-center` (2026-08-01, commit `4a86408c`) — the old standalone sync direction (esggo → local learning-center copy) is obsolete for new work.
- `vps/docker-compose.prod.yml` uses `context: ..` + `vps/Dockerfile.arm64`; plain `vps/docker-compose.yml` used `/opt/esggo` (the bug).

## Deploy-oracle note (separate issue)
- Workflow `deploy-oracle.yml` (id 310301869, 168 runs): direct SSH mode → `Setup direct SSH key` OK (keyscan reached 161.118.248.180:22) then `Deploy direct` failed in 3s ⇒ **key auth failure, not network**. Verify/re-rotate `VPS_SSH_KEY` secret (watch CRLF corruption from `printf '%s\n' "${{ secrets.VPS_SSH_KEY }}"`).
- VPS services were healthy during the failure (`https://omniagent.esggo.co/health` → `{"status":"healthy"}`, `https://esggo.co` served) — old build still running, deploy just didn't land.
