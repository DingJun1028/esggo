# 2026-08-14 esggo 全面升級偵察 Session Record

## Context
User requested 全面升級 on the `C:\Project\esggo` repo. The repo was on `master` with recent commits around FTG tools and ESG docs.

## Commands run
- `pnpm test` → exit 1 initially because root vitest was picking up `apps/ftg-tools/**/*.test.mjs` files written with `node:test`.
- `pnpm lint` → exit 0
- `pnpm typecheck` → exit 0
- `pnpm check` → 24/24 tests passed
- `pnpm build` → Next.js build succeeded (54/54 static pages)
- `pnpm audit --audit-level=high` → initially reported 2 high vulnerabilities:
  1. `sharp <0.35.0` inherited via `next@16.2.11`
  2. `nanoid <3.3.18` via `postcss` chain

## Files changed
- `vitest.config.ts` — added `'apps/ftg-tools/**/*.test.mjs'` to `exclude`
- `pnpm-workspace.yaml` — added `"nanoid": ">=3.3.18 <4"` override
- `pnpm-lock.yaml` — updated by `pnpm install` / `pnpm up`
- `package.json` / lock — `next` upgraded from `16.2.11` to `16.3.1`

## Commit
- `179b51aaa` — feat(esggo): 全面升級偵察修補 — vitest範圍+nanoid覆蓋+lock同步

## Final verification
- `pnpm audit --audit-level=high` → exit 0, `No known vulnerabilities found`
- `pnpm test` → 597 passed, 18 skipped
- `pnpm build` → exit 0
- `pytest` → 62 passed
- `apps/ftg-tools` → `node --test ftg-mcp/server.test.mjs fal-images.test.mjs` → 5/5 passed

## Notes
- `apps/learning-center/functions` still emits an engine warning: `wanted: {"node":"20"} (current: v24.19.0)`. This did not block verification.
- Next upgrade from `16.2.11` to `16.3.1` was validated by inspecting `npm view next@16.3.1 dependencies/peerDependencies` to confirm no `sharp` field remained in the resolved tree, then rerunning audit.
