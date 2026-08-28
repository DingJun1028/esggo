# pnpm-workspace + `npm install` prisma path mismatch

## Symptom
On `esggo-learning-center` (a pnpm monorepo: `packageManager: pnpm@11.5.2`, `pnpm-workspace.yaml` present with `packages/*`, `apps/*`), the user ran `npm install` + `npm run test` (npm, not pnpm).

- `npm install` succeeded but emitted ERESOLVE peer warnings (react 19 root vs react-dom 18 peer). npm still symlinked `workspace:*` packages (`@esggo/errors`, `@esggo/shared`) OK.
- `npm run test` (vitest run) → 6 tests in `tests/api-health-tags.test.ts` FAILED with:
  `Error: @prisma/client did not initialize yet. Please run "prisma generate" and try to import it again.`
  at `src/lib/prisma.ts: new PrismaClient()`.

## Root cause
`postinstall: prisma generate` (from root package.json) ran during `npm install`, but npm generated the client into the **pnpm-style path**:
`node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/.prisma/client`
while `@prisma/client` (npm-resolved) looks in `node_modules/.prisma/client`. Path mismatch → runtime can't find it.

## Fix
```bash
npx prisma generate   # npm-resolved binary → lands in node_modules/.prisma/client
npm run test          # now 20/20 in that file
```
Then full `npm run test` → 554 passed (after re-run; see flakiness below).

## Preferred path
Use the declared manager to avoid the mismatch entirely:
```bash
pnpm install && pnpm test
```
npm ignores `pnpm-workspace.yaml`; mixing the two can desync workspace:* symlinks and prisma output location.

## Related flakiness (not a real failure)
CLI test files (`cli/omnicli/src/index.test.ts`, `cli/esggo-cli`) spawn child processes and **intermittently time out at 5s** under load (also emits `DEP0190` shell-escape warning). Re-running yields a clean pass:
- Run 1: 3 failed (omnicli timeouts) → 551/554
- Run 2: 0 failed → 554/554
- Run 3: 0 failed → 554/554 (stable)
These are flaky, not defects. A second/third consecutive `npm run test` confirms green.

## Repro summary
```
npm install            # ERESOLVE warnings, workspace:* symlinked
npm run test           # 6 prisma failures
npx prisma generate    # fix client location
npm run test           # 554 passed (re-run if CLI timeouts appear)
```
