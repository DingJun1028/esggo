# CLAUDE.md — ESG GO Engineering Conventions & Enforcement Rules

> Version: 1.0.0
> Classification: Internal Standard
> Language: English Standard, Traditional Chinese Broad (英標繁博)
> Tags: [security:internal][agent:07][squad:符文契約][lifecycle:active][p1][platform:esggo][best-practice:awakened]

---

## Purpose (目的)

This file is the **single source of truth** for engineering conventions in the ESG GO
platform. It codifies enforceable rules for TypeScript strictness, API route conventions,
test coverage, and OmniTag artifact tagging — derived from a codebase audit (2026-08-01).

Rules marked **MUST** are enforced by CI or pre-commit and block merge if violated.
Rules marked **SHOULD** are conventions reviewed during code review.

---

## 0. OmniTag Requirements (萬能標籤規範)

Every artifact (PR, task, commit, issue, design doc) must carry OmniTag tags.
Required tags — each artifact must have **at least** `agent:*` + `lifecycle:*` + `p*`:

| Dimension | Key | Values |
|---|---|---|
| Security | `security:` | public / internal / confidential / restricted |
| Agent | `agent:` | 01–30 (Agent 07 = 符文契約 / API+TS+ZKP) |
| Squad | `squad:` | 智庫聖所 / 符文契約 / 光之羽翼 / 煉金熵減 / 5T驗算 |
| Lifecycle | `lifecycle:` | draft / active / frozen / archived |
| Priority | `p0`–`p3` | p0=blocking, p1=high, p2=normal, p3=noise |
| Platform | `platform:` | esggo / omni / vps / firebase / vercel / github |
| Best-practice | `best-practice:` | awakened / 结界 / draft |

**Syntax**: `[security:internal][agent:07][squad:符文契約][lifecycle:active][p1][platform:esggo][best-practice:awakened]`

**Forbidden combinations** (auto-reject):
- `lifecycle:frozen` + `lifecycle:active` · `security:public` + `security:restricted`
- `p0` + `p3` · `best-practice:awakened` + `lifecycle:draft`

Reference: `.agents/skills/omnitag/SKILL.md`.

---

## 1. TypeScript Strictness (型別嚴格度)

### MUST rules

1. **strict mode**: `tsconfig.json` MUST keep `"strict": true`. Do not weaken to satisfy
   a single file — fix the file instead.
2. **No `any` in production code** (`src/lib/**`, `src/core/**`, `src/agents/**`,
   `src/impl/**`, `packages/*/src/**`, `app/api/**/route.ts`).
   - `: any`, `as any`, `any[]`, `<any>` are forbidden outside `*.test.ts` / `__tests__/`.
   - Tests MAY use `as any` to reach private members, but prefer `vi.mocked` / helper fns.
3. **No `@ts-ignore` / `@ts-nocheck`**. `@ts-expect-error` is allowed only with a
   comment explaining the false positive.
4. **Explicit types on shared I/O**: function parameters and return types MUST be
   explicit on public functions exported from `src/lib`, `src/core`, `packages/*`.
   Use `interface`/`type` aliases, never inline `object` literals for contracts.
5. **RouteContext typing**: dynamic route handlers MUST type params as
   `{ params }: { params: Promise<{ id: string }> }`. Never regex-parse the pathname.
6. **Import alias discipline**:
   - App/business code imports from `@/*` (`@/lib/api-utils`, `@/types/...`).
   - Shared contracts import from `@esggo/shared`, `@esggo/errors`, `@esggo/ui`.
   - Relative deep imports into `src/` from `app/` (e.g. `../../../../src/...`) are forbidden.
7. **Single source of truth**: error codes come from `@esggo/errors` only
   (`ERROR_CODES`, `ErrorCodeKey`). `src/lib/errors.ts` is a compat re-export — do not add
   new definitions there.

### Verification

```bash
pnpm typecheck                                  # tsc -p tsconfig.core.json (CI gate)
pnpm lint:full                                  # eslint src/ --max-warnings 50
grep -rn ": any\|as any\|<any>" src app packages --include="*.ts" --include="*.tsx" \
  | grep -v "__tests__\|.test.ts" || true      # expect empty
grep -rn "@ts-ignore\|@ts-nocheck" src app packages || true  # expect empty
```

---

## 2. API Route Conventions (API 路由慣例)

### MUST rules

1. **Response envelope**: every non-streaming route returns
   `jsonResponse<T>(data, status)` → `{ success: true, data }` or
   `jsonError(errorKey, message?, status?)` → `{ success: false, error, code }`.
   - NEVER pass `{ success: true, ... }` INTO `jsonResponse` (double-envelope bug:
     `{ success: true, data: { success: true, ... } }`).
   - Raw `NextResponse.json(...)` / `Response.json(...)` in business routes is forbidden
     (only `app/api/healthz`, SSE stream routes, and binary/PDF download handlers are exempt).
2. **Error codes**: use `ErrorCodeKey` from `@esggo/errors`. Do not invent ad-hoc code
   strings (e.g. `LOCAL_AI_DISABLED`, `BAD_REQUEST`). All keys — including
   `UNKNOWN_TOOL`, `ALERT_NOT_FOUND` — come from `@esggo/errors`.
3. **Never leak internal errors**: catch blocks MUST return a generic message
   (`jsonError('INTERNAL_ERROR', 'Internal server error')`). Do NOT interpolate
   `error.message` / `err.message` into responses.
4. **Authentication on mutating routes**: every POST/PUT/DELETE route that writes data
   MUST authenticate the request. Patterns:
   - Internal/service: `X-Omni-Token` header compared to `OMNI_KEY || GATEWAY_API_KEY`
     (see `app/api/omni/sync/route.ts`).
   - User-facing: verify Firebase ID token server-side (`firebase-admin` `verifyIdToken`).
   - Insecure mutators (`app/api/cron/route.ts`, `app/api/memory/route.ts`,
     `app/api/rag/ingest/route.ts`, `app/api/sonnar/crawl/route.ts`,
     `app/api/tags/{universal,pair}/route.ts`, `app/api/village/*`) MUST be gated before merge.
5. **Input validation**: validate request bodies before use — `validateParams` /
   `validatePositiveNumber` from `@/lib/api-utils` as minimum; Zod
   (`src/lib/zod-validation.ts`) or manual type-guards for complex bodies.
6. **Method handling**: export ONLY the supported HTTP methods. No `OPTIONS` handlers;
   rely on Next.js auto-405. GET handlers MUST NOT perform writes or trigger jobs
   (`app/api/cron/route.ts` GET runs jobs — move to POST + auth).
7. **Runtime exports** on heavy/streaming routes: `export const runtime = 'nodejs'`,
   `export const dynamic = 'force-dynamic'`, `export const maxDuration = <seconds>`.
8. **File header comment**: each route file starts with a banner comment
   (purpose, methods, auth note) — see `app/api/omni/sync/route.ts`.

### Verification

```bash
# Double-envelope + error leaks (expect empty)
grep -rn "jsonResponse({ success: true" app/api --include="route.ts"
grep -rn "error.message\|err.message\|error instanceof Error" app/api --include="route.ts"
# Ad-hoc codes (expect only @esggo/errors keys)
grep -rn "jsonError('" app/api --include="route.ts" | grep -vE "ERROR_CODES|'INVALID_PARAMS'|'NOT_FOUND'|'INTERNAL_ERROR'|'UNAUTHORIZED'|'FORBIDDEN'|'SKILL_NOT_FOUND'|'PROJECT_NOT_FOUND'|'MEMBER_NOT_FOUND'|'INSUFFICIENT_POINTS'|'RATE_LIMITED'|'EMBEDDING_FAILED'|'RAG_QUERY_FAILED'|'SOURCE_NOT_FOUND'|'CRAWL_ERROR'|'TASK_NOT_FOUND'|'COMPANY_NOT_FOUND'|'INVALID_ACTION'|'UNKNOWN_ERROR'|'METHOD_NOT_ALLOWED'|'UNKNOWN_TOOL'|'ALERT_NOT_FOUND'" || true
```

---

## 3. Test Coverage (測試覆蓋)

### MUST rules

1. **New modules MUST ship with tests**: any new module under `src/lib/**`,
   `src/core/**`, `src/agents/**`, `src/impl/**`, or `packages/*/src/**` MUST include a
   co-located `__tests__/*.test.ts` covering core behaviors. A PR adding an untested
   module will be blocked.
2. **Test runner**: Vitest (`vitest.config.ts`, `globals: true`, `environment: node`,
   alias `@` → `./src`). Use `describe`/`it`/`expect` globals.
3. **Critical paths** (already covered — do not regress): ZKP service, 5T protocol,
   hash-lock, OmniTag/OmniBase, bus & omni-agent-bus, OmniGateway v2, omni-core ecosystem,
   omni-todo engine, AI skills registry, esg-analysis, esg-report, universal-tag-service,
   complete-delegation.
4. **Known coverage gaps** (currently untested — new code in these areas MUST add tests):
   `src/lib/{api-utils,safe-api,zod-validation,rate-limit,report-service,storage-service,vector-search,resource-library,ncb-client,user-profile,village-seeder,embedding-generator,cron-jobs,omni-core}.ts`,
   `src/lib/{omni-tag,omni-seed}/index.ts`, all `packages/*/src` (errors, shared, ui, cli),
   `src/core/services/*`, `src/core/ai/skills/*` (12 skills),
   `src/agents/twelve-omni/omni-tag.ts`, `src/impl/omni-*.ts`.
5. **Stale tests**: when renaming/deleting a module, update or remove its tests. CI runs
   the FULL suite (`vitest run`) — a stale test file that references missing modules fails
   the build.

### Commands

```bash
pnpm check           # fast gate: typecheck + core + twelve-omni suites
pnpm test            # full Vitest suite (CI runs this)
pnpm test:coverage   # coverage report
```

---

## 4. Commit & PR Rules (提交與 PR 規範)

- Conventional commits: `feat(scope):`, `fix(scope):`, `test(scope):`, `docs(scope):`,
  `refactor(scope):`, `chore(scope):`.
- Pre-commit hooks (`.githooks/pre-commit`) enforce: UTF-8 encoding check
  (`scripts/encoding-check.mjs`) and pnpm-lock.yaml sync. Do not bypass hooks.
- Never commit secrets. CI hard-fails on AWS/GitHub/Firebase key patterns.
- PR description MUST include the OmniTag block (see §0) and list verification commands run.
- English for code/technical naming; Traditional Chinese for user-facing copy (英標繁博).

---

## 5. Enforcement Matrix (執行矩陣)

| Rule | Gate | Command |
|---|---|---|
| TS strict + no `any` | CI `typecheck` + `eslint` | `pnpm typecheck` / `pnpm lint:full` |
| No `@ts-ignore` | review | grep (see §1) |
| API envelope & error codes | review + grep | see §2 verification |
| Auth on mutators | review + CI security-scan | manual audit |
| Tests for new modules | review | `pnpm test` |
| Encoding + lockfile | pre-commit | `node .githooks/pre-commit` |
| Secrets | CI `secret-scan` | grep credential patterns |
| Full regression | CI `test` (vitest run) | `pnpm test` |
| Build | CI `build` + `docker` | `pnpm build` |

---

## 6. Current Audit Findings (2026-08-01) — Reference

High-value cleanup targets identified during the audit (fixing these is a follow-up task,
not required for this file):

- **API**: 10 double-envelope lines across 7 route files (`daily-report`,
  `daily-report/generate`, `user/leaderboard`, `user/subscription`, `user/growth`,
  `user/growth/xp`, `user/tasks`); 27 error-leak sites across 20 routes (catch blocks
  interpolate `error.message`); 12+ business routes bypass `jsonResponse` (`esg/*`,
  `awaken/*`, `omni-core/status`, `surveys`, `sustain-center/dashboard`, `local-ai/chat`,
  `data/export`, `reconnaissance/gateway`, `sustain-write/c-version` — `healthz` and
  PDF-download are exempt); only 1 route uses Zod (`omni/sync`); 5 mutating routes have
  no auth (`cron`, `memory`, `sonnar/crawl`, `tags/universal`, `tags/pair`).
- **TypeScript**: 35 prod `any` sites in 20 files — hotspots `src/impl/core.ts` (7),
  `app/api/ai-notes/search/route.ts` (4), `app/api/village/trends/route.ts` (3),
  `app/api/reconnaissance/gateway/route.ts` (3), `packages/omni-agent/src/types.ts` (2),
  plus 15 single-site files (`src/types.ts`, `esg/*`, `awaken/*`, `omni-bus.ts`, etc.).
  `tsconfig.core.json` covers only `src/impl`, `src/lib/omni-core`, `src/lib/cloudflare`
  — broaden CI typecheck to `src/core`, `src/agents`, `src/lib` as strictness improves.
  Zero `@ts-ignore` / `@ts-nocheck` sites found.
- **Tests**: 228 src `.ts` files (non-test) vs 37 test files (18 in `src/`, 17 in
  `tests/`, 2 in `worker/`+`apps/`); `packages/*` have zero tests; `src/lib/omni-tag/`,
  `src/lib/omni-seed/`, and `src/core/sonnar` are untested.

---

ESG GO Engineering Conventions v1.0.0 · License: AGPL-3.0
