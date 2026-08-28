# esggo OmniCore CI #1545 — round-6 (2026-08-04): PR supersede verdict

## Context
PR #416 (`fix/omnicore-ci` @ `0d19084`, 76 files) was opened to fix OmniCore CI runs #1545/#1547
(broken `@/lib/` imports + Docker syntax check). Round-6 (this session) was the user manually running
the rebase script because every cron bridge path had failed.

## Evidence chain

### 1. Rebase exploded — 24 content conflicts
User ran `git rebase origin/main` on `C:\Project\esggo`:
- 24 files conflicted, almost all `app/api/**/route.ts` — BOTH sides had rewritten them.
- Script's `$LASTEXITCODE -ne 0` guard aborted the rebase (correct behavior — no half-state).
- Root cause: PR parent was `4a86408c`; main had advanced `78c2283..6185b84` through multiple
  commits (#418 "Refactor IComponentCore … evidence" + Bolt perf series) that also touched the routes.

### 2. Main tip had already absorbed the PR's content
- `app/api/esg/go/route.ts` @ main `6185b842` → `import … from '@lib/services/esg/DataOrchestratorServer'`
  → **already `@lib/`** (broken imports fixed on main).
- `learning-center-ci.yml` @ main → `pnpm/action-setup@v4` (no version pin) and its workflow
  run #51 (`30796141835`, head `7bf035e`) → **success**.
- `vps/docker-compose.yml` @ main → **kept `context: /opt/esggo`** (VPS-only path).

### 3. Main CI is fully green — including the jobs the PR was "fixing"
- OmniCore CI (workflow 285304224) run **#1597** (`30796141846`, head `7bf035e`, base `6185b842`)
  → **conclusion: success** — typecheck/eslint/vitest/build/docker/lighthouse/agents all green.
- deploy-oracle (workflow 310301869) run **#188** (`30743300018`, head `6185b842`) → **success**
  (direct SSH mode; VPS health checks `omniagent.esggo.co/health` + `esggo.co` passed).

## Key corrections to earlier root-cause claims (be honest, record the reversal)

| Earlier claim (rounds 1–5) | Corrected finding (round-6) |
|---|---|
| `docker-compose.yml` `context: /opt/esggo` (VPS-only) fails `docker compose config` on runner | **FALSE** — `docker compose config` does NOT validate build-context existence. Main kept `/opt/esggo` + CI #1597 green. The PR's `context: ..` change was harmless but unnecessary. |
| Vitest red on PR head needs import fixes / rebase for `@lib` alias | Superseded — main's Vitest is green (#1597). (The alias-add-in-`8b9ff14` rebase guidance still holds for genuinely unmerged branches; here main moved past it entirely.) |
| `run 30692211290` deploy SSH failure needs key rotation | Self-healed — deploy #188 (8/2) succeeded; the old run id now 404s (history retained/expired). VPS_SSH_KEY is valid. |

## Decision & disposition
- **Supersede verdict**: main `6185b842` green on exactly the jobs the PR fixed + 24-file rebase conflict
  ⇒ PR #416 has no merge value. Disposition = close PR, delete `fix/omnicore-ci` locally & on origin.
- Final user instructions (PowerShell, all `gh`-authed):
  ```powershell
  git checkout main; git pull origin main
  git branch -D fix/omnicore-ci
  git push origin --delete fix/omnicore-ci
  gh pr close 416 --comment "Superseded: main 6185b842 already contains all fixes (CI #1597/#51/#188 green)."
  ```

## Durable lessons
1. **Check main's tip CI before "fixing" anything** — main self-heals fast on active repos; a green
   main-tip run on the same workflow IDs is the cheapest possible "no-op needed" signal.
2. **24-file rebase conflict == supersede smell** — when both sides rewrote the same files and main is
   green, closing the PR beats resolving conflicts by an order of magnitude.
3. **`docker compose config` ≠ context existence check** — it validates schema/interpolation; missing
   build context is not one of its failures. Don't patch contexts on a hunch.
4. Cron bridge remained unusable this whole round (agent framework down); manual command block was the
   only shipping path — see round-5 reference for the framework-failure signature.
