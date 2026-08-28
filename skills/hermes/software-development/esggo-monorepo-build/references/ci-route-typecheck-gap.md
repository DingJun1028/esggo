# CI Route Type-Check Gap & pnpm frozen-lockfile Fixes (esggo)

Captured 2026-08-13 while a P2 `any`-removal sweep passed `pnpm run typecheck` but broke CI
`Build Check` (`next build`) on 4 route files, plus a separate `pnpm install --frozen-lockfile`
CI failure. These are durable, repo-specific traps.

## 1. `pnpm run typecheck` (tsconfig.core.json) does NOT catch Next route type errors

`tsconfig.core.json` (what `pnpm run typecheck` uses) has a narrow `include` that excludes most
`app/api/**/route.ts`. `next build` runs a FULL TypeScript check over every bundled route. So a
type error that only appears when the route compiles (missing export on an imported type, payload
field mismatch after removing `any`, needed non-null assertion) is invisible to core typecheck but
breaks CI Build Check.

**Gate before pushing any `app/**/route.ts` type change:** `pnpm run typecheck` exit 0 AND
`npx next build` clean (run `next build` in background; 30-60s compile + type check; foreground 280s
is too short). Either alone is insufficient.

Common error shapes this session + fix:
- `Module 'X' declares 'Y' locally, but it is not exported` → import `Y` from its DEFINING module,
  not a re-exporting module that only uses it locally. e.g. `IBusEvent` lives in
  `src/lib/omni-agent-bus.ts`, NOT `@/lib/bus`.
- `Property 'runId' does not exist on type '{}'` → `const payload = (ev && ev.payload) || ev` widens
  to `{}`. Assert once: `const payload = ((ev && ev.payload) || ev) as { runId?: string; step?: string; content?: string; [k: string]: unknown };` then use `payload.runId` directly.
- `Type 'NoteWithTags' is missing properties from 'SearchResult': note, similarity` → a `.map`
  callback returning `NoteWithTags` was annotated `Promise<SearchResult | null>`; change annotation
  to the actual return type (`NoteWithTags | null`), import it, and use `note: notes[index]!` where
  the index aligns and null was already filtered upstream.
- `Argument of type '{...version?:...}' is not assignable` → helper requires `version`/`generatedAt`
  as REQUIRED; pass a constructed object
  `{ companyName, version: x.version ?? '1.0.0', generatedAt: x.generatedAt ?? new Date().toISOString() }`
  instead of `as`-casting the partial.

## 2. `pnpm install --frozen-lockfile` exits 1 in clean CI (invalid allowBuilds value)

CI `Install dependencies` fails `exit 1` with `[ERR_PNPM_IGNORED_BUILDS] Ignored build scripts:
tesseract.js@7.0.0` but local `pnpm install` works. Cause: `pnpm-workspace.yaml` `allowBuilds:` had a
placeholder non-boolean `tesseract.js: set this to true or false`. pnpm 11 treats a non-true/false
value as a config error → install exits 1. Local works only because `node_modules` exists
(`Already up to date`) so the build-script phase is skipped; a clean CI checkout always re-runs it.

Fix (agent can do): set explicit boolean in `pnpm-workspace.yaml`:
```yaml
allowBuilds:
  tesseract.js: true      # was: "set this to true or false"
```
Verify locally with `pnpm install --frozen-lockfile --force` (the `--force` re-runs build scripts
even when node_modules exists, reproducing the CI path). exit 0 == fixed.
NOTE: `onlyBuiltDependencies` (separate block) is the pnpm-10+ canonical list; `allowBuilds` is the
pnpm-11 alias. Keep both consistent. Do NOT "fix" by switching to `npx` — that only hides the real
yaml defect and CI stays red. (The `esggo-dev-toolchain` §2 previously mis-framed this as a pure
`npx` bypass; the yaml boolean is the real fix.)

## 3. `.npmrc` `PRISMA_SKIP_POSTINSTALL_GENERATE=true` spams terminal warnings

Every `pnpm`/`npm` call prints `npm warn Unknown project config "PRISMA_SKIP_POSTINSTALL_GENERATE"`
(hermes terminal noise). The key is pnpm-specific in the repo-root `.npmrc`; npm warns on every
invocation. `postinstall` already has `prisma generate || true`, so the key is redundant.
Fix: `rm -f .npmrc`. After deletion `pnpm run typecheck` output is clean.
