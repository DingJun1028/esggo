# ESGGO pnpm audit remediation — 2026-08-08 session

## Context
Working in `C:\Project\esggo-learning-center` (the esggo monorepo sandbox). Task: drive
`pnpm audit` from 20 vulns down to an acceptable residual, and keep the 3 CLIs (esggo-cli /
oa-cli / omnicli) green.

## What worked (real commands, real output)
1. Removed the **invalid** `pnpm.overrides` block from root `package.json` (pnpm 11.5.2 silently
   ignores it — confirmed: audit stayed at 20 after install).
2. Added overrides to `pnpm-workspace.yaml` with `<major` upper bounds (AGENTS.md #4):
   ```yaml
   overrides:
     "tar": ">=7.5.21 <8"
     "js-yaml": ">=4.3.1 <5"
     "postcss": ">=8.5.23"
     "uuid": ">=11.1.1"
     "gaxios": ">=7.1.4"
     "glob": ">=10.5.0"
     "minimatch": ">=9.0.7"
     "fast-uri": ">=3.1.5 <4"
     "fast-xml-parser": ">=5.10.1"
     "brace-expansion": ">=5.0.9"
   ```
3. `pnpm install --no-frozen-lockfile` in **background** (took ~7m46s; foreground 180s times out).
   This is required in esggo — `--lockfile-only` does NOT run postinstall (prisma generate,
   .githooks encoding-check) and does NOT write patched packages into `node_modules`.
4. Verify: `pnpm audit --prod` → dropped from 18 to **6** (was 20 total before overrides).
   Remaining 6: `tar@6.2.1`, `@opentelemetry/*`, `adm-zip`, `@tootallnate/once` — all via
   `sqlite3 → node-gyp → ...` or `firebase > @genkit-ai > @google/cloud` (deep, build/runtime-optional).

## Pitfalls hit & resolved
- **Residual `tar@6.2.1` is fine.** `find node_modules -path '*/tar/package.json'` still shows
  `6.2.1` alongside `7.5.22`. Trace parent: it's only `sqlite3 → node-gyp → make-fetch-happen →
  http-proxy-agent → @tootallnate/once → tar@6.2.1` — a native build chain, never required at
  runtime. `pnpm audit --prod` count dropping is the real signal; don't chase build-only paths.
- **`git stash` + `git pull --no-rebase` + `git stash pop` conflicted** on
  `apps/learning-center/package.json` (postcss version). Resolved with
  `git checkout --ours apps/learning-center/package.json` then `git add`. For `pnpm-workspace.yaml`
  itself, took the remote `sqlite3: false` (§7 hygiene) instead of `--ours`.
- **soul.md is gitignored** (line 144). Had to `git add -f soul.md` to commit it.

## Numbers (audit --prod JSON)
Before overrides: 1 critical, 13 high, 5 moderate, 1 low (20 total).
After: 1 low, 1 moderate, 4 high (6 total) — all deep/optional.
GitHub remote still reports 121 (includes devDependencies + CI-resolution differences, not
introduced by this work).

## CLI test note
esggo-cli / oa-cli / omnicli each have vitest 6/6 (18/18 total). `--live` mode hits
`http://localhost:8420` with a 3s `AbortController` timeout and prints `[BLOCKER] ...` via
`console.log` (NOT `console.error` — tests assert on stdout). Gateway was unreachable this
session (VPS not started); BLOCKER path verified.
