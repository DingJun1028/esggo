---
name: verify-under-tool-breakage
category: software-development
description: When hermes verify is env-broken, run targeted checks.
tags: [verification, testing, ci, honesty, debugging]
---

# Verify Under Tool Breakage

## When to use
- The project's canonical verify command (`hermes verify`, `make test`, CI lint) fails at bootstrap for reasons **unrelated to your change** (venv METADATA corruption, OOM, missing binary, postinstall EPERM).
- You're told "continue / 最佳實踐 / 推進" and must prove your edit works without the blocked tool.
- A pasted "verify output" is a stale snapshot from before your fix — do NOT treat it as current evidence.

## Core rule
**Cite fresh, relevant, runnable evidence — never a stale snapshot.** Run the specific check that exercises *your changed files*; report exactly what passed/failed. Label any blocker as "environment, not a code defect."

## Targeted check recipe (Node/TS monorepo)
1. **Typecheck the changed surface**: `pnpm run typecheck` (usually `tsc -p tsconfig.core.json`). Exit 0 = pass.
2. **Unit tests**: `node --test test/*.test.mjs` or `pnpm test` for the affected package.
3. **Run scripts/tools directly** instead of via a broken runner:
   - Standalone TS scripts: `npx tsx <file>` (NOT `ts-node` for ESM — MODULE_TYPELESS error; NOT `node --check`/`npx tsc --noEmit <file>` which report misleading "file not found" for tsx-style files).
   - Server routes: boot the real server in background with `< /dev/null` (background launchers close stdin → Node exits "stdin is not a tty"), then probe with curl. On MSYS use `-o NUL` (not `-o /dev/null` — the write target confuses the pipe, curl error 23).
4. **Adversarial probes** for security routes: send a private-host URL to a proxy endpoint, assert 400 (not 200). Boot on a fresh port each time (`pkill -9 -f "server.mjs"` first) to avoid EADDRINUSE from a leftover process.

## esggo monorepo: hermes verify + pnpm run test both unusable (recurring)
- `hermes verify` fails at bootstrap on Prisma postinstall: `EPERM: rename query_engine-windows.dll.node.tmp` — an AV lock on the 17-workspace monorepo, NOT your code. Re-running it only re-hits the same EPERM.
- `pnpm run test` inside a pure-Node sub-package STILL resolves the workspace and hangs 60s+ on MSYS/git-bash. Do not use it.
- **Do this instead**: from the changed package dir, run the `test` script body directly — `node --test <files>` (e.g. `node --test ftg-mcp/server.test.mjs fal-images.test.mjs ftg-gen.test.mjs`). Zero install, no pnpm, no monorepo resolution. Report `tests/pass/fail` counts as fresh evidence.
- **Repeated stale warnings**: the harness may keep re-injecting the same old `hermes verify` failure text across turns. Treat it as a frozen snapshot; re-run your targeted command each time it asks and cite the fresh output. Confirm deleted scratch files (e.g. `patch_server.js`) with `ls` before claiming they are gone — the stale list often still names them.
- See references/esggo-verify-breakage.md for the full transcript pattern.

- **Stale-list hygiene**: the injected block may keep listing already-deleted scratch files (e.g. `patch_server.js`). Before claiming one is gone, `ls` it (`ls ftg-mcp/patch_server.js` -> "No such file" = confirmed gone).
- **CRLF noise**: `git status` may warn `CRLF will be replaced by LF` on `reports/*.html` / `ftg-*.js`. Cosmetic — do not churn files over it.

## Common environment blockers (label, don't fix blindly)
- **Hermes venv `pyyaml==6.0.3` METADATA missing** → `hermes verify` self-aborts before app build. Fix outside agent scope: restart Hermes, `pip install -e ".[all]"`. Not your code.
- **Windows `next build` Turbopack OOM (exit 143)** → add `NODE_OPTIONS=--max-old-space-size=8192` to the build script. Verified: build completes in ~50s, `.next/BUILD_ID` produced.
- **`pnpm install` postinstall EPERM** (Windows rename `.tmp`→`.node`) → `postinstall: "prisma generate || true"` so install doesn't abort; CI/VPS generate fine, local uses `npx prisma generate`. Also drop the package from `onlyBuiltDependencies` if present.
- **MSYS curl `-o /dev/null`** → use `-o NUL` (Win) or a temp file path.

## Activating ingested LLM-generated tooling (Devin / `.devin/` style)
- **Cross-language pollution**: Python triple-quotes `"""..."""` inside TS function bodies → esbuild `Expected ";" but found "..."`. Fix: `grep -n '"""' <file>`, replace with `//`.
- Missing deps (e.g. `@vitest/coverage-v8`): add to devDependencies, `pnpm install`, re-run.
- Use `npx tsx`, not `ts-node`, for ESM `.ts`.
- A non-zero exit from a *monitoring* script (coverage below threshold) is expected alerting, not tool failure — read its output.

## Report framing
(a) what you verified fresh + exact commands/results, (b) any blocker marked "environment, not a code defect" with the one-line fix outside your scope. Never say "verification passed" citing only a stale verify snapshot.
