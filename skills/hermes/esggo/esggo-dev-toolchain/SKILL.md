---
name: esggo-dev-toolchain
description: esggo repo quirks. Binary read_file or blocked pnpm run.
---

# esggo Dev Toolchain Quirks & Workarounds

Repo: `C:\Project\esggo` (DingJun1028/esggo), pnpm monorepo, Next.js 16 + React 19 + Vitest.

## 1. read_file returns "Binary file" for .ts / .tsx / .md

In this repo, `read_file` frequently flags source files as binary (special encoding / BOM). The reliable way to read them is a `node` printable-char extraction:

```bash
node -e "const fs=require('fs');const b=fs.readFileSync('PATH');let s='';for(const c of b){if((c>31&&c<127)||c===10||c===13)s+=String.fromCharCode(c);}console.log(s)"
```

- Replace `PATH` with the repo-relative or absolute path.
- Use this for `src/**/*.ts`, `src/**/*.tsx`, `*.md`, `.yml` when `read_file` errors with "Binary file".
- `write_file` / `patch` still work normally — only `read_file` (and inline `read_file` display) is affected. Prefer `read_file` first; fall back to the node snippet only when it reports binary.
- See `references/dev-quirks.md` for the exact snippet and a grep-friendly variant.

## 2. `pnpm run *` blocked by pnpm deps-status-check

`pnpm run test|build|lint|typecheck` fails before running the script:

```
[ERR_PNPM_IGNORED_BUILDS] Ignored build scripts: tesseract.js@7.0.0
[ERROR] Command failed with exit code 1: ... pnpm.mjs install
```

This is pnpm 11 refusing to run because `tesseract.js`'s build script was never approved. **It is not a code error.** Bypass by calling the underlying tool directly via `npx` (skips pnpm's pre-flight install check):

```bash
npx vitest run                  # instead of pnpm run test
npx tsc -p tsconfig.core.json  # instead of pnpm run typecheck
npx next build                 # instead of pnpm run build
npx eslint <files>             # instead of pnpm run lint (slow on full repo; target files)
```

Permanent fix (needs user action, not agent): `pnpm approve-builds` → select `tesseract.js`. Do NOT hand-edit pnpm config to disable the check.

## 3. Browserbase can't trigger a React form handler → use Playwright headless instead

When using `browser_click` / `browser_press` on a React form button (esp. `<button type="submit">` or `onClick={handleSubmit}`), the click may report `success` but the handler never fires and React state does not change — even after switching to `type="button" onClick`. Other `onClick` buttons on the same page (e.g. a 428 floating button) may work fine. This is a **Browserbase event-dispatch limitation, NOT a code bug.**

**FIX (proven 2026-08-11):** Playwright headless Chromium triggers the handler correctly. Use it for real UI verification instead of Browserbase:
```bash
# one-time (in a subdir to avoid pnpm workspace resolution)
mkdir e2e-k1 && cd e2e-k1 && npm init -y
npm i -D @playwright/test playwright && npx playwright install chromium
```
Write a spec that does a **real** `page.getByRole('button',{name:/提交永恆刻印/}).click()` and asserts the DOM changed (e.g. warning banner `toBeVisible`). Run with `npx playwright test --reporter=line`. This produced a genuine PASS + screenshot for the zero-hallucination banner that Browserbase NEVER showed — the "bug" was a tool artifact, not code.

If Playwright isn't available, fall back to the equivalent-proof workflow:
1. Extract the handler logic into a **pure function** (e.g. `computeFeedback(payload)`) and unit-test it with vitest.
2. Add a **Node probe** that imports the validator, print `success`/`errors` for a spike payload (>500% usage).
3. Run **`npx next build`** — confirms the component compiles and the render condition is valid JSX.

Do NOT claim "verification passed" on a Browserbase click that produced no DOM change. Report unit-test + build evidence and flag visual check as pending Playwright/real-browser confirmation.

**EdgeResearch 4-step loop** fits UI verification (see `references/edge-research-ui-verify.md` for the exp-k1 recipe + reproduction template): freeze the metric (banner appears on >500% spike), mutate (Seal button type=button+onClick), measure (Playwright click → banner visible), decide (KEEP).

## 4. Free-compute / opt-in CI gate pattern (for paid/registered services)

User hard rule: "只用免費算立" — never auto-generate paid tokens. When integrating a paid service (e.g. SonarQube Cloud), wire it as an **opt-in gate** so CI skips it without the secret:
- Job-level: `if: ${{ vars.SONAR_ENABLED == 'true' }}` (use a **repo variable**, not a secret, so the job cleanly skips instead of failing with startup_failure).
- Add a **free, no-token smoke job** that validates the integration artifacts (config files, scripts) so the wiring can't silently rot.
- Provide a free local verification script (`scripts/sonar-smoke.mjs`) the user can run without the token.

### 4a. Self-hosting the free equivalent on VPS (Oracle always-free 4OCPU/24GB)

Instead of the paid SaaS, deploy the OSS equivalent on the VPS (proven 2026-08-11):
- **SonarQube CE**: `docker compose` (postgres + `sonarqube:community`) on a free port (NOT 9000 — portainer owns it). Pick an unused port via `ss -tlnp` first (e.g. 19000). Then `npx sonarqube-scanner -Dsonar.host.url=http://localhost:PORT -Dsonar.token=<tok>`. Token API needs `change_password` with `previousPassword` (default `admin:admin` unless already changed); `user_tokens/generate` returns `squ_...`. CE does NOT have agentic auto-remediate (that's Cloud/Enterprise) — static analysis only.
- **MinIO**: `docker compose` (minio + createbuckets) on a free port (e.g. 19001). Create bucket via `mc mb`. From a Next.js route, PUT to MinIO with **hand-rolled AWS SigV4** (no `@aws-sdk/client-s3` needed — pnpm install is locked, see §2). Verified: PUT returns 200 on VPS, GET without signature returns AccessDenied (expected).
- **Ollama**: already on VPS (`localhost:11434`, has `qwen2.5:3b-instruct` + `gemma4:26b`). Wire a Next route to call it with an env var (`AGENTIC_TWIN_OLLAMA_URL`); `.env.local` is gitignored and Next reads it on boot. Fallback: if URL empty or call times out (15s), keep heuristic output — never block the UI.
- **Port conflicts**: before deploying any docker service, `ss -tlnp` to find a free port. :9000=portainer, :3000=esggo-core, :8788=UT, :8642=gateway, :11434=ollama, :2026=deerflow. Use 19000+ range.
- **CI can't reach VPS**: GitHub Actions runners time out connecting to `esggo.co` (30s goto). Make VPS-dependent CI jobs opt-in (`if: vars.E2E_ENABLED == 'true'`) like the sonar gate; keep localhost Playwright as the dev-time regression guard.
- **SSH key**: VPS access uses `~/.ssh/ci_deploy_key` (NOT the others — `vps_deploy_key`/`gh_deploy_key`/`id_rsa_esggo*` are rejected).

## 5. Monorepo is huge — `find` / bare `grep` time out; use `git ls-files` + `git grep`

`find . -name 'vitest.config.*'` over the whole tree hit the 180s foreground timeout (node_modules + `.next` + huge `esggo-omni-center/`). Reliable alternatives:
- **Enumerate tracked source files** (excludes node_modules automatically):
  ```bash
  git ls-files '*.ts' '*.tsx' | grep -v -E 'node_modules|/_|/dist/|/\.next/|/build/' > /tmp/srcfiles.txt
  wc -l < /tmp/srcfiles.txt   # e.g. 1502 source files
  ```
- **Count/search content repo-wide** with `git grep` (fast, respects tracked files, no node_modules):
  ```bash
  git grep -nE ':\s*any\b|as\s+any\b|<\s*any\s*>|any\[\]' -- '*.ts' '*.tsx' | grep -v -E '\.(test|spec)\.(ts|tsx):' | wc -l
  git ls-files | grep -E 'app/.*/route\.(ts|tsx)$' | wc -l   # API route count
  ```
- **Two roots**: `esggo-omni-center/` is a near-mirror with its own `src/lib/api-utils.ts`, `packages/*`, and `app/api/*`. Search/grep both the repo root and `esggo-omni-center/` when a fix must be applied to both copies (e.g. `app/api/cron/route.ts` exists at root AND `esggo-omni-center/app/api/cron/route.ts`).

## 6. The inline `patch` lint feedback is UNRELIABLE (TS6053 false positive)

When you `patch` a `.ts` file, the harness returns a `lint` block like:
```
error TS6053: File '/c/Project/esggo/app/api/cron/route.ts' not found.
  The file is in the program because: Root file specified for compilation
```
This is a **pre-existing harness artifact, NOT a real error in your edit.** It fires even on a clean edit that later passes full typecheck. **Do not trust it.** The real verification is the repo's canonical typecheck:
```bash
pnpm run typecheck      # == npx tsc -p tsconfig.core.json  (exit 0 == clean)
```
This session: after adding `CRON_SECRET` auth + fixing an error-leak in both cron routes, `pnpm run typecheck` returned `exit=0` with zero cron-route errors — despite the patch harness having reported TS6053. Trust the canonical command, not the inline lint.

## 7. Don't reinvent auth helpers — use the existing ones

The old habit of "create `src/lib/unified-auth.ts`" is wrong for this repo. Auth building blocks already exist:
- `packages/errors/src/api.ts` → `requireAuth(request: NextRequest): ValidationResult` (checks `x-user-id` header set by middleware). Used by `app/api/omni/sync/route.ts`.
- `packages/shared/src/auth.ts` → `verifyAuthHeader(...)`.
- **Internal/service-to-service endpoints** (cron triggers, gateways) follow the **token-header convention** from `app/api/omni/sync/route.ts`: compare a shared secret header (`GATEWAY_API_KEY` / `X-Omni-Token`) against `process.env`.
  - For cron-style manual-trigger endpoints, add a `CRON_SECRET` guard: read `req.headers.get('x-cron-secret') || Authorization: Bearer`, compare to `process.env.CRON_SECRET`; when no secret is configured, fall back to requiring the internal `x-user-id` context. Return `jsonError('UNAUTHORIZED', msg, 401)` on failure.
- **Fix error-leak pattern**: routes that do `return jsonError('INTERNAL_ERROR', (error as Error).message)` leak internal messages to clients. Replace with `console.error(...)` + `jsonError('INTERNAL_ERROR')` (generic, no message). This is the 5T Transparent rule.

### 7b. Root-cause fix for error-leak at scale (proven 2026-08-13)

For a repo-wide sweep (this session: **82 leaks across `app/**/route.ts` + `esggo-omni-center/app/**/route.ts`**), do NOT hand-edit each site. Fix at the shared layer once:

1. **Add `jsonErrorInternal` to BOTH `src/lib/api-utils.ts` AND `esggo-omni-center/src/lib/api-utils.ts`** (near-identical copies — must keep in sync):
   ```ts
   export function jsonErrorInternal(
     error: unknown,
     errorKey: ErrorCodeKey = 'INTERNAL_ERROR',
     status?: number
   ): NextResponse {
     console.error(`[api] ${errorKey}:`, error);   // server-side only
     return jsonError(errorKey, undefined, status); // generic message to client
   }
   ```
2. **Batch-replace call sites** with a Node script (`git ls-files "app/**/route.ts" "esggo-omni-center/app/**/route.ts"` → regex-replace). The leaks cluster into 3 shapes — handle in 3 passes:
   - `jsonError('INTERNAL_ERROR', (error as Error).message)` → `jsonErrorInternal(error)`
   - `NextResponse.json({ error: error.message }, { status: 500 })` → `NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })`
   - `const message = error instanceof Error ? error.message : 'Unknown error'; return jsonError('INTERNAL_ERROR', message[, 500])` → drop the `message` var, `return jsonErrorInternal(error[, 'INTERNAL_ERROR', 500])`
   - Edge variants (`, 500` after `)`, `|| 'Internal server error'`, `[Prefix] ${message}` wrappers, `'Export failed'`/`'Server Error'` fallbacks) need their own regex each — grep the remaining count after each pass and iterate until `git grep -nE '(error as Error)\.message|error\.message' -- 'app/**/route.ts' 'esggo-omni-center/app/**/route.ts' | grep -v console` → **0**.
   - Auto-add `jsonErrorInternal` to the `import { ... } from '@lib/api-utils'` line when the file uses it but doesn't import it yet.
3. **Delete the one-off scripts** after use (`rm scripts/fix-error-leak*.mjs`) — leaving them is entropy debt.
4. **Prove it with vitest** (not just typecheck): import `jsonErrorInternal` + `jsonError`, assert `JSON.stringify(await res.json())` does NOT contain the original `'10.0.0.5'`/`'boom'`/`'x'`, AND a contrast case asserts `jsonError('INTERNAL_ERROR', 'leak-abc')` DOES leak (documents why the helper is needed). Run `npx vitest run tests/json-error-internal.test.ts` → 4/4 green.
   - **Gotcha**: `NextResponse` body is a `ReadableStream` — `res.body` is NOT parseable as JSON. Use `await res.json()` (async), never `JSON.parse(res.body)`.
5. Verify: `pnpm run typecheck` exit 0 + the grep count = 0. Both roots + both `api-utils` copies must be patched or the twin will re-leak.

## 8. Verify pasted "completed work" claims before acting

When a user pastes a long session/review log that claims files were created or work "90% done", treat it as a **replay, not an instruction**:
1. Run `search_files(target='files', pattern='<claimed-path>')` / `git ls-files | grep` / `git grep` to confirm the artifacts actually exist in the repo.
2. If they don't exist, say so explicitly and do NOT "continue" the phantom state — instead establish a real baseline with actual tool output.
3. Treat `@file:...\`...\`: file not found` lines in the pasted log as the log's **own broken `@file:` syntax**, not repo facts (the referenced module, e.g. `@esggo/errors`, is usually real and importable).
4. Re-measure any metrics the log asserts (coverage %, `any` count, missing-auth routes) with real `git grep`/`git ls-files` rather than repeating the log's numbers.

This session: a pasted "無作妙德優化" log claimed `.devin/`, `src/lib/unified-auth.ts`, and `.hermes/auto-repair/repair-engine-enhanced.py` were created — all three were absent on real inspection; the real repo had 1502 source files, 44 test files, 28,370 `any` usages, 194 API routes. Work proceeded from the real baseline.

**Replay-identification signals (use these to flag a pasted log as a replay, not a live instruction):**
- The text contains `Updated todo list`, `繼續`, `再次`, `進度追蹤`, or `整體進度：90%` markers — these are conversation-control tokens, not task artifacts.
- It ends with a `Context Warnings` block listing `@file:...: file not found` — that is the log's OWN broken `@file:` syntax, not a repo defect (the referenced module e.g. `@esggo/errors` is usually real/importable).
- It claims large file creations (`+77`, `+320` lines) for paths you can't find with `search_files(target='files')`.
- It asserts metrics (coverage %, `any` counts, missing-auth route counts) that you have NOT measured this session — re-measure with `git grep`/`git ls-files` before trusting.
- It leaves the working tree unchanged (`git status` shows nothing matching the claimed files) despite claiming "completed" work.
On ANY of these: do NOT "continue" the phantom. Run the real inspections, state the gap honestly, then proceed from the measured baseline. Re-measure every asserted baseline number.

**Concrete 2026-08-14 example — Devin tool present ≠ defect fixed**: a pasted "無作妙德優化" log claimed `.devin/scripts/*.ts` + `src/lib/unified-auth.ts` were created and asserted "any 20→0, 90% done". Real check: files DO exist (committed `619c8f23a`) AND typecheck stays green — BUT the tools are **detectors, not fixers**. Re-running `npx tsx .devin/scripts/any-type-eliminator.ts --check` reported **`總計 any 使用: 9`**, not 0. The "completed" claim was the tool's *plan/self-score*, not actual code repair. Lesson: a Devin-generated tool existing in the repo proves the tool was scaffolded; it does NOT prove the defect it targets was fixed. Always run the tool's `--check`/scan mode and read its emitted `*-report.json` count before believing a "N→0" claim. Same applies to `error-handling-fixer` (21 leaks) and `test-coverage-monitor` (8%→80%): presence of the script ≠ the metric moved. This is a special case of "pasted review log = replay, re-measure" — see the replay-identification signals above.

## 10. Second-brain note recipe (vault/ knowledge garden)

To land a knowledge-garden note after a real audit/fix, follow
`references/second-brain-note-recipe.md` — it captures the frontmatter contract
(`source_origin`+`co_authors` required by the §26b pre-commit hook), the MOC link
step (`00-Index.md`), and the BOM/CRLF `read_file`-is-binary gotcha for `*.md`
notes. The repo `vault/` is the source of truth; the iCloud Obsidian vault is separate.

## 11. `pnpm run typecheck` does NOT catch `app/**` route type errors — `next build` is the real gate

`tsconfig.core.json` (what `pnpm run typecheck` runs) excludes `app/**` and most route files. A change can pass core typecheck locally yet break CI's `Build Check` job, which runs `next build` → "Running TypeScript …" over ALL routes.

**Symptom pattern (OmniCore CI, 2026-08-13)**: core typecheck exit 0, but CI `Build Check` fails with `Failed to type check` on a specific `app/api/.../route.ts` line. Common causes after an `as any` cleanup or import change:
- `import type { X } from '@/lib/bus'` where `X` is declared `locally` in `bus.ts` but not `export`ed → import from the original source module (e.g. `@/lib/omni-agent-bus`) instead.
- Callback returns type `B` but annotated `Promise<A>` (e.g. `getNoteWithTags` returns `NoteWithTags`, route annotated `SearchResult`) → align the annotation to the actual return type, or cast at the call site.
- A helper requires a required field (`reportToMarkdown(report: {companyName; version; generatedAt})`) but the call site passes `version?` → pass a concrete object `{companyName, version ?? '1.0.0', generatedAt ?? new Date().toISOString()}`.
- A narrowed firebase wrapper (`adminDb = {collection; doc; runTransaction; batch}`) is missing `.auth()`/`.firestore()` → use `getAuth(getAdminApp())` / `getFirestore(getAdminApp())` from `firebase-admin/auth` / `firebase-admin/firestore` (see `src/lib/unified-auth.ts` fix).

**Rule**: after ANY edit to `app/**`, `src/lib/**`, or `packages/*/src/**` that touches types/imports, run `npx next build` (background, ~90s) and confirm `Running TypeScript …` shows no `Type error:` before pushing. CI install may also fail first (see §12), so fix install before chasing route errors.

**Verify a CI failure for real**: use `gh run view <id> --log` and grep `##[error]` + the `Build Check.*Build\b` step tail. The first `Type error:` line is the blocker. `gh run watch <id>` can hang on network drops — poll `gh run view <id> --json status,conclusion,jobs` instead.

## 12. Two config pitfalls that break CI install / spam the terminal

### 12a. `pnpm-workspace.yaml` `allowBuilds` invalid value → frozen-lockfile exit 1
`allowBuilds` entries must be boolean `true`/`false`. A placeholder like `tesseract.js: set this to true or false` is parsed as a non-boolean → pnpm 11 errors `[ERR_PNPM_IGNORED_BUILDS] Ignored build scripts: tesseract.js@7.0.0` then `Process completed with exit code 1` on `pnpm install --frozen-lockfile` in CI (clean checkout). Local install succeeds because `node_modules` already exists (`Already up to date`) and skips the build step — so the bug only surfaces in CI. Fix: set the real boolean (e.g. `tesseract.js: true`, matching `onlyBuiltDependencies` in the same file). Verify locally with `pnpm install --frozen-lockfile --force` (forces rebuild scripts; should exit 0).

### 12b. `.npmrc` invalid key → npm warn on every command (hermes terminal noise)
A project `.npmrc` containing `PRISMA_SKIP_POSTINSTALL_GENERATE=true` triggers `npm warn Unknown project config "PRISMA_SKIP_POSTINSTALL_GENERATE"` on every `pnpm`/`npm` invocation (npm doesn't recognize the key; pnpm's equivalent is handled via `postinstall: "prisma generate || true"` in package.json). It is harmless but spams the terminal. Fix: delete the line / the `.npmrc` if it only holds that key. After deletion, `pnpm run typecheck` output is clean (no warn line).

## 13. `patch` tool may time out (420s) but the edit still lands

Same class as §6: a `patch` call can return `timed out after 420.0s` while the file on disk was actually modified. **Do not re-run the patch blindly** — verify with `sed -n '<line>p' <file>` first; if the change is present, the timeout was a harness artifact. Prefer `sed -i` for bulk/mechanical edits (import lines, regex replacements) to avoid the timeout entirely; reserve `patch` for context-sensitive multi-line changes. Re-run `pnpm run typecheck` / `npx next build` as the real confirmation.

## 14. Node-only packages inside the monorepo: test with `node --test`, never `pnpm run test`

A package that is pure Node (no React/Vitest/TS — e.g. `apps/ftg-tools/` with `ftg-gen.js`, `ftg-mcp/server.js`, `*.test.mjs`) must NOT be verified through the monorepo's pnpm chain. `pnpm run test` from the package dir still triggers pnpm workspace resolution and **hangs ~60s (foreground timeout)** even though the package itself has no deps. The relevant verification command is the package's own script body, run directly:

```bash
cd apps/ftg-tools
node --test ftg-mcp/server.test.mjs fal-images.test.mjs ftg-gen.test.mjs   # 7/7 pass
```

- Write tests as native `node --test` (`.test.mjs` + `import { test } from 'node:test'`). No vitest, no ts-node.
- `package.json` `test` script: `"test": "node --test ftg-mcp/*.test.mjs ..."` — but when the system wants "relevant verification", run the `node --test ...` body, NOT `pnpm run test` (the pnpm wrapper is what hangs).
- This is the same bypass philosophy as §2 (use the underlying tool, skip pnpm pre-flight).
- Wire CI as a dedicated job step with `working-directory: apps/<pkg>` so the Node test runner runs from the right cwd (see `ci.yml` `ut-tests` job → "Run FTG-Tools test suite (node --test)").

## 15. `__dirname`-relative path resolution for generated-output CLIs

When a CLI writes generated artifacts, resolve the output dir from the script's own location, NOT `process.cwd()`:

```js
// ftg-gen.js: produce apps/ftg-{ver} regardless of where it is invoked from
const dir = out ? path.resolve(out) : path.resolve(__dirname, '..', 'ftg-' + version);
```

- `__dirname` of `apps/ftg-tools/ftg-gen.js` is `.../ftg-tools`; `..` → `.../apps`; so `path.resolve(__dirname, '..', 'ftg-'+ver)` = `esggo/apps/ftg-{ver}`. ✅
- A bare `path.resolve(process.cwd(), 'apps/ftg-'+ver)` breaks when cwd isn't the repo root (double `apps/`, or wrong root).
- For an MCP server two dirs deeper (`apps/ftg-tools/ftg-mcp/server.js`), repo root is `path.resolve(__dirname, '..', '..', '..')` and the sibling CLI is `path.join(__dirname, '..', 'ftg-gen.js')`.
- Reusable pattern: `path.resolve(__dirname, <rel-from-here>)`. Never assume cwd.

## 16. git-bash → `node` spawn / execFile path quirks

Commands that invoke `node` from within the repo have git-bash path-translation traps:

- **`node -e "require('./x.js')"` on a relative path from a test run in a subdir** works, but **`execFileSync('node', ['C:\\abs\\path\\server.js'])` or `[`/c/abs/...`]`** intermittently fails with `MODULE_NOT_FOUND` because git-bash translates `/c/...` and the node loader disagrees. **Fix: pass relative paths** (`['./ftg-mcp/server.js']`) and set `cwd` to the package dir, OR use `path.join(process.cwd(), 'ftg-mcp', 'server.js')` resolved at runtime.
- **`node --check <file>`** prints `stdin is not a tty` + no SYNTAX_OK when piped through some shells; run it against the file path directly (no pipe) to get a clean `GEN_SYNTAX_OK` / `MCP_SYNTAX_OK`.
- **stdio MCP server must flush async results**: `rl.on('line', ... process.stdout.write(JSON.stringify(r)))` where `r` may be a `Promise` (from `tools/call` handlers) serializes to `{}`. **Fix:** `Promise.resolve(r).then(res => process.stdout.write(JSON.stringify(res)+'\n'))`.

## 17. `hermes verify` vs fresh evidence — reinforced SOP

`hermes verify` bootstraps the full monorepo reinstall and dies on `prisma generate` EPERM (Windows rename `.tmp`→`.node`, AV lock) — see `references/hermes-verify-staleness.md`. When a `hermes verify` snapshot is injected as red but your change is in a Node-only package (§14) or a config file:

1. **Name the concrete blocker** from the injected log (e.g. `EPERM: rename query_engine-windows.dll.node.tmp`).
2. **Run the relevant verification command** for the actual change — `node --test` (§14) for a Node package, `grep`/`node -e` to confirm a config file's content/syntax for a YAML/`.env` change.
3. Report: "this `hermes verify` snapshot is stale/blocked by <X>, unrelated to my change; fresh evidence above shows the change is green." Do NOT claim `hermes verify` passed.
4. `pnpm run test` at the package level (§14) is ALSO a trap here — it hangs on pnpm workspace resolution. Use the bare `node --test` body.

See `references/hermes-verify-staleness.md` for the full blocker catalog + probe snippets.

See `references/ci-build-typecheck-chain.md` for the full OmniCore CI failure-chain recipe (install → route typecheck) and the exact commands used.

## 9a. VPS service is a docker container — host-file edits don't persist

When "integrating" a feature into a running VPS service, first confirm whether the service is a **pm2 process** or a **docker container**. This decides the edit path.

- **Symptom this session**: wanted to add `/memory/*` routes to `omniagent-gateway` (OA swarm gateway). Edited `/opt/esggo/esggo-omni-center/apps/gateway/omni-server.mjs` on the VPS host, `docker cp` into the container, `docker restart` — but `curl /memory/health` still 404. Root cause: the listened port `8642` was owned by `docker-pr` (docker port proxy), and `omniagent-gateway` is a **container** built from `vps-omniagent-gateway` image with **no volume mount** — so `docker cp` + restart reloads the image layer and discards the copied file. The host file edit never reached the running service.
- **Tell-tale**: `sudo lsof -i :PORT` shows `docker-pr` (not `node`/`pm2`) → it's a container. `docker ps` shows the service name with a port mapping.
- **Correct path for a container**: modify the **source file in the repo**, then `docker build` a new image (the Dockerfile COPYs the source in) and restart. Or, for a fast iteration, `docker exec <c> sh -c 'sed ...'` to edit in-place + restart the in-container process — but a later `docker restart` reverts it, so the repo edit + rebuild is the durable fix.
- **Contrast — pm2 services**: `universal-translator`, `stt-whisper`, `deerflow` (pm2) run as host node processes; editing the file + `pm2 restart <name>` works directly.
- **TencentDB Agent Memory (oa-shared-memory) auth**: gateway uses header `x-tdai-service-id: default` + `Authorization: Bearer <TDAI_GATEWAY_API_KEY>` (key in `/opt/esggo/apps/tencentdb-memory/.admin-key`). Core listens `:8420`. **Verified 2026-08-14 paths**: write `POST /v3/conversation/add` (body `{messages:[{role:'user',content}]}`); recall `POST /v3/conversation/query` (body `{query,limit}`). The earlier `/v3/default/memory/recall` serviceId-in-path form was a STALE probe — prefer `/v3/conversation/*` (empirically successful this session). `GET /health` on the proxy `:8096` returns `{"status":"ok"}`.

## 9. Activating Devin-generated `.devin/*.ts` tools (ESM + Python-quote bug)

The `619c8f23a` commit added `.devin/scripts/*.ts` (test-coverage-monitor, any-type-eliminator, doc-code-sync, etc.) authored by the Devin agent. They are NOT run by the normal `pnpm` scripts; they are standalone CLI tools meant to be invoked directly.

- **Runner**: use `npx tsx <script>.ts` — NOT `npx ts-node`. `ts-node` fails on these ESM files with `MODULE_TYPELESS_PACKAGE_JSON` + `SyntaxError: Export 'X' is not defined in module` because the repo has no `"type": "module"` and the scripts use `export`/`interface`. `tsx` parses ESM correctly.
- **Known Devin bug — Python triple-quotes in TS**: `doc-code-sync.ts` had lines like `"""自動生成 JSDoc 註解"""` (Python docstring syntax) that break `esbuild` with `Expected ";" but found "..."`. Fix = change to `// comment` or a quoted string assignment. There may be more than one (grep `"""` to find all). After fixing, the script runs and emits `doc-code-sync-report.json`.
- **Missing dependency**: `test-coverage-monitor.ts` runs `vitest run --coverage` which needs `@vitest/coverage-v8`. If absent it errors `Cannot find dependency '@vitest/coverage-v8'`. Fix = add `"@vitest/coverage-v8": "^4.1.9"` to `devDependencies` (matching vitest 4.x) and `pnpm install`.
- **Exit code is expected non-zero**: these tools report findings (coverage gaps, `any` usage, missing JSDoc) and exit 1. That is the tool working, not a crash. Check the emitted `*-report.json` / stdout summary.
- All three activated successfully after fixes: test-coverage-monitor produced `coverage-report.json`, any-type-eliminator scanned 18 `any` usages, doc-code-sync scanned JSDoc gaps. Commit `86359c81e`.

## 18. Repo hygiene sweep for DingJun1028/esggo

Use this when the user asks for repo cleanup, PR triage, stale-branch removal, or “繼續/下一步/最佳實踐” sweeps.

- Close duplicate PRs/issues as `superseded by #<canonical>`; keep one canonical tracker.
- Mark DRAFT PRs `ready` only when low-risk; do not auto-merge.
- CONFLICTING PRs that remove dependencies or downgrade core versions should be closed with rationale instead of forced rebase.
- Delete stale remote branches: `git push origin --delete <branch>`.
- Delete stale local branches: `git branch -D <branch>`; prune worktrees with `git worktree prune`.
- Before declaring clean: `git checkout -- . && git clean -fd && git status --short`.
- After any push, check CI: `gh run list --workflow="ESG-GO CI/CD Pipeline" --limit 3`.

## 19. PowerShell 直跑 repo 腳本：優先用 Git Bash，不要靠 WSL bash

When a repo script starts with `#!/usr/bin/env bash`, do **not** call it as `bash scripts/...` from PowerShell. On this Windows host, `bash` often resolves to **WSL bash.exe**, not Git Bash, and fails with:

```
[3]WSL ... ERROR: CreateProcessCommon:818: execvpe(/bin/bash) failed: No such file or directory
```

**Fix (proven 2026-08-27):** provide a Windows-native wrapper and invoke PowerShell directly:

```powershell
powershell -NoLogo -ExecutionPolicy Bypass -File "C:\Project\esggo\scripts\oa-cli.ps1" manual 48 --local-only
```

- `scripts/oa-cli.ps1` should be the PowerShell entrypoint; the `.ps1` is what users run from PowerShell.
- `scripts/oa-cli` remains the Git-Bash script for Git Bash / WSL / cron use.
- Keep the two entrypoints behaviorally aligned; otherwise one surface drifts from the other.

## 20. Validate `esggo-hub/config.yaml` before using plugin/integration paths

When adding or editing `C:\Users\dingj\esggo-hub\config.yaml`, validate it with
`scripts/validate-hub-config.py` before wiring plugins, workspaces, or
integrations. See `references/hub-config-validation.md` for checks and usage.

## Verified-verification checklist for this repo
Run these (via `npx`, see §2) and report actual output. **Ignore the inline `patch` lint TS6053 noise (§6) — rely on `pnpm run typecheck`.**
- `npx vitest run src/lib/omni-reports/__tests__/jules-validator.test.ts src/components/omni/reports/__tests__/DynamicFormEngine.test.tsx`
- `pnpm run typecheck`  (== `npx tsc -p tsconfig.core.json`, expect exit 0) — **NOTE: this only checks `src/**` + core, NOT `app/**` routes**
- `npx next build` (expect "✓ Compiled successfully" + routes listed, AND no `Type error:` under "Running TypeScript …" — this is the ONLY gate that catches `app/**` route type errors, see §11)
- `node apps/universal-translator/scripts/sonar-smoke.mjs` (SonarQube artifact check)

**Pre-push CI-safety gate (after any type/import edit in `app/**`, `src/lib/**`, `packages/*/src/**`):** run `npx next build` in the background and confirm it reaches "Running TypeScript …" with zero `Type error:` lines. A green `pnpm run typecheck` is NOT sufficient — CI `Build Check` runs `next build` and will fail on route errors core typecheck misses. Also confirm `pnpm install --frozen-lockfile` would pass: check `pnpm-workspace.yaml` `allowBuilds` values are real booleans (§12a).
