# OmniCore CI Failure Chain — Install → Route Typecheck (recipe)

Captured 2026-08-13. Repo: DingJun1028/esggo, pnpm 11.5.2, Next.js 16, Node 22 (CI runner forces Node 24).

## Symptom
Push a change → `OmniCore CI` run shows `failure`. All jobs under `entropy-reduction-test` / `TypeScript Check` / `Vitest Tests` / `ESLint` fail at the **`Install dependencies`** step with `##[error]Process completed with exit code 1`, BEFORE any lint/test runs.

## Layer 1 — install failure (root cause)
`pnpm install --frozen-lockfile` fails on a clean checkout because of an invalid `allowBuilds` entry in `pnpm-workspace.yaml`:

```
[ERR_PNPM_IGNORED_BUILDS] Ignored build scripts: tesseract.js@7.0.0
##[error]Process completed with exit code 1.
```

Cause: `allowBuilds.tesseract.js: set this to true or false` (placeholder, not a boolean). pnpm 11 treats non-boolean as a config error → exit 1.
Local install succeeds because `node_modules` already exists ("Already up to date") and skips the build step — so the bug only appears in CI.

Fix: set `tesseract.js: true` (boolean). Verify locally: `pnpm install --frozen-lockfile --force` → expect exit 0.

## Layer 2 — route typecheck failure (appears AFTER install is fixed)
Once install passes, CI `Build Check` job runs `next build`, which does a FULL route type check (`Running TypeScript …`). Errors surface that `pnpm run typecheck` (tsconfig.core.json, excludes `app/**`) never caught.

Real errors fixed this session (all after a P2 `as any` cleanup that passed core typecheck):
1. `app/api/agent/[id]/thought/stream/route.ts:9` — `import type { IBusEvent } from '@/lib/bus'` but `IBusEvent` is `local` in `bus.ts`, not exported. Fix: import from `@/lib/omni-agent-bus`. Plus `payload` was `(ev && ev.payload) || ev` with `payload?.runId` → `{}` type; fixed by one `as { runId?; step?; content?; [k:string]: unknown }` at L33.
2. `app/api/ai-notes/search/route.ts` — `.map(async (id): Promise<SearchResult | null> => getNoteWithTags(id))` but `getNoteWithTags` returns `NoteWithTags`. Fix: annotate `Promise<NoteWithTags | null>`, import `NoteWithTags` from `@/types/notes`, use `notes[index]!` at the merge (index-aligned), drop the post-map `filter`.
3. `app/api/sustain-write/c-version/route.ts` — `reportToMarkdown(report as {companyName; version?; generatedAt?})` but helper requires `version` required. Fix: pass `{companyName: report.companyName, version: report.version ?? '1.0.0', generatedAt: report.generatedAt ?? new Date().toISOString()}`; and `reportToHtml` takes only `{companyName; version}` (no `generatedAt`) — omit it there.
4. `src/lib/unified-auth.ts` — `private static firebaseAdmin = adminDb` (narrowed wrapper `{collection; doc; runTransaction; batch}`, no `.auth()`/`.firestore()`). Calls `this.firebaseAdmin.auth()` / `.firestore()` fail. Fix: remove the `firebaseAdmin` field; use `getAuth(getAdminApp())` / `getFirestore(getAdminApp())` from `firebase-admin/auth` / `firebase-admin/firestore`; import `getAdminApp` from `./firebase-admin`.

## Diagnostic commands
```bash
# Find the real CI failure (not just the annotation)
gh run view <run_id> --log | grep "##\[error\]"
gh run view <run_id> --log | grep -A40 "Build Check.*Build\b" | grep -iE "type error|exit code"
# Or poll job conclusions without hanging:
gh run view <run_id> --json status,conclusion,jobs \
  | python3 -c "import json,sys; d=json.load(sys.stdin); print(d['status'], d['conclusion']); [print(j['name'], j['conclusion']) for j in d['jobs']]"

# Local pre-push gate (background, ~90s):
npx next build 2>&1 | grep -iE "Compiled|Type check|Failed|error TS"
# expect: "✓ Compiled successfully" then NO "Type error:" under "Running TypeScript …"

# Confirm install would pass in CI:
pnpm install --frozen-lockfile --force
```

## Lesson
`pnpm run typecheck` (tsconfig.core.json) is NOT the CI gate for routes. Always run `npx next build` after type/import edits in `app/**`, `src/lib/**`, `packages/*/src/**` before pushing. CI install failures from `pnpm-workspace.yaml` only reproduce on a clean checkout, so verify with `--force`.
