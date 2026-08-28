---
name: esggo-best-practice-execution
description: "esggo 自主最佳實踐執行模式。用戶說最佳實踐/繼續/代主/萬能分身時載入。"
version: 1.0.0
author: Hermes Agent
license: MIT
platforms: [windows, linux, macos]
tags: [esggo, best-practice, security, refactor, testing, audit]
---

# esggo 最佳實踐自主執行

Use when the user triggers autonomous best-practice work on the `C:\Project\esggo` repo — audit, refactor, or security-hardening — and expects you to ACT, verify, and commit, not ask. Built on OA-Team 五覺 (see oa-best-practice-enlightenment), this skill adds the concrete esggo engineering patterns proven in the 2026-08-13 session.

## Trigger → behavior map
| User says | Action |
|-----------|--------|
| 最佳實踐 / 全域最佳實踐覺 | Load automatic-execution + this skill; self-execute, don't ask |
| 繼續 / 下一步 / 是 | Continue planned items, no clarifying questions |
| 代主 | Commit the real changes on user's behalf (explicit `git add <files>`, NEVER `git add -A`) |
| 萬能分身 | Append a JSON line to `.hermes/auto-repair/tracker-log.jsonl` (task_id/timestamp/commit/actions/status) |
| 通點 | Run the review→fix→verify loop; always end with `pnpm run typecheck` + relevant vitest |
| 下一階段 | Pick the next highest-value, verifiable, low-breakage defect target autonomously |

After committing, push to the **current branch's upstream** — verify first with `git rev-parse --abbrev-ref --symbolic-full-name @{u}`. Only push to `origin main` if that is actually the checked-out branch. Pushing a feature-branch refactor straight to `main` is wrong unless the user explicitly said "main". This prevents both the "cron fix vanished between sessions" failure AND the "wrong-branch push" failure.

## Pattern A — Replay Guard (highest priority, 覺三)
Old-session reasoning logs replayed into chat (markers like "Updated todo list", "繼續", "Again", and `@file:...: file not found` Context Warnings) are NOT instructions. Never claim completion from them.
1. `search_files` / `git ls-files` / `git grep` to verify the log's claimed artifacts exist (e.g. `.devin/`, `unified-auth.ts`, `repair-engine-enhanced.py`). 0 hits = proof they don't exist.
2. Re-measure real baselines: `git ls-files '*.ts' '*.tsx' | wc -l`, `git grep -cE ':\s*any\b'`, etc.
3. List every claimed item; mark skipped explicitly — never rationalize gaps.

## Pattern B — patch timeout but actually applied
On Windows the `patch` tool often reports `timed out after 420.0s` yet the diff landed. After a timeout:
- Re-verify with `terminal`: `sed -n 'Np' file` or `git diff` to confirm content is present.
- Do NOT re-run the same patch (it fails with "found 2 matches").
- For bulk replacements, write a Node `.mjs` script via `write_file`, run it, then `rm` it (entropy reduction).

## Pattern C — ESM top-level env binding (vitest)
Route modules bind `const TOKEN = process.env.X || ''` at import time; setting `process.env` inside a test has no effect.
- Use `vi.stubEnv('X', val)` + `vi.resetModules()`, and `await import('../app/api/.../route')` inside each test.
- `afterEach`: `vi.unstubAllEnvs(); vi.resetModules()`.
- Auth-guard tests assert only the REJECT path (401) + GET open (200). The ALLOW path triggers downstream Redis/Firestore/loopback fetch (no deps in test env → 500/503) — don't assert post-allow business flow unless external deps are mocked.

## Pattern C2 — Reading response bodies in vitest (NextResponse quirk)
`NextResponse.json(...)` bodies CANNOT be read via `await res.json()` in the vitest environment — it returns `undefined` (the body is an unconsumable ReadableStream). Three reliable postures:
1. **Assert only `res.status`** (best for auth-guard reject cases — no body needed).
2. **Parse via text**: `const body = await res.text().then(t => t ? JSON.parse(t) : undefined);`
3. **Test the service class directly**, bypassing the HTTP layer entirely (preferred for pure-logic routes):
   ```ts
   import { ZKPService } from '../src/lib/zkp-service';
   const res = ZKPService.verify('doc', hashLock);
   expect(res.valid).toBe(true);   // NOTE: verify returns { valid: boolean }, NOT boolean
   ```
   Pitfall surfaced 2026-08-13: `ZKPService.seal()` is NON-deterministic (uses randomBytes/timestamp), so do NOT assert equal hashes across calls; assert `hashLock` is a non-empty string instead. `getStats()` → object, `getProofs()` → array.

## Pattern G — `any` remediation convergence (覺四 entropy)
After clearing the dangerous `as any` casts (12) and `catch (error: any)` → `unknown` (8) + Firebase/vector narrowing, core-layer `any` converges to ~46 residual — ALL intentional escapes, do NOT force-fix:
- index signatures `[key: string]: any` (deliberate extension hatch; `unknown` breaks all callers)
- external JSON boundaries (`oracle-sync-service` `any[]` / `(r: any)` from a Python script)
- internal casts (`bus.ts` `cb as (event: any)` — omni-agent-bus simple type vs contracts generic)
- `eslint-disable-next-line @typescript-eslint/no-explicit-any` marked sites (e.g. `FnImpl`)
Declare convergence honestly; move to the next defect class rather than churning safe `any`.

## Pattern D — Firebase Admin without `as any`
`(adminDb as any).collection(path)` is redundant — `adminDb` already carries Firestore types. Use `adminDb.collection(path)` directly (typechecks). Import `QueryDocumentSnapshot` via `import type { QueryDocumentSnapshot } from 'firebase-admin/firestore'`.

## Pattern E — esggo auth-guard convention
Token-style guards (align across routes):
- cron → `CRON_SECRET` (headers `x-cron-secret` / `Bearer`); no secret configured → fall back to `x-user-id` internal context.
- memory → `MEMORY_API_KEY` (headers `x-memory-key` / `Bearer`); only POST/DELETE guarded, GET stays open.
- omni/sync → `OMNI_KEY || GATEWAY_API_KEY` (headers `x-omni-token` / `Bearer`).
Error responses use `jsonErrorInternal(error)` from `src/lib/api-utils.ts` (dual copy: root + `esggo-omni-center/src/lib/api-utils.ts`) to truncate internal messages; server-side `console.error` retains detail.

## Pattern F — Error-leak batch fix
1. Scan: `git grep -nE '\(error as Error\)\.message|error\.message' -- 'app/**/route.ts' 'esggo-omni-center/app/**/route.ts' | grep -vE 'console\.(error|log|warn)'`
2. Add root-cause helper `jsonErrorInternal(error, errorKey?, status?)` to BOTH `api-utils.ts` copies.
3. Scripted bulk replace call sites → `jsonErrorInternal(error)` or static 500; edge variants (with `, 500` / `|| '...'` / prefix-wrapped) need 2nd/3rd precise passes.
4. Re-run grep (expect 0) + `pnpm run typecheck` (expect exit 0) + vitest proof.

## Pattern H — Chinese commit messages via heredoc
`git commit -m "中文訊息"` with embedded special quotes triggers `unexpected EOF` in the bash tool. Use the heredoc form instead:
```bash
git commit -F - <<'EOF'
security(api): 全域錯誤洩漏清零 + cron/memory 路由認證守門

- 新增 jsonErrorInternal helper (5T Transparent)
- 修補 82 處 API 路由錯誤洩漏
EOF
```
(Or write to `.git/COMMIT_MSG_tmp` and `git commit -F .git/COMMIT_MSG_tmp`, then `rm` it.)

## Pattern I — root vitest 誤掃非 vitest 測試檔
Workspace 內若有 `node:test`（`node --test`）測試檔，根 vitest 仍會依副檔名 `.test.mjs` 抓取並報錯。
在 `vitest.config.ts` 明確排除，例如：
```ts
'exclude': [
  '**/node_modules/**',
  '**/dist/**',
  '**/__test__/**',
  'apps/gateway/sync/__test__/**',
  'apps/gateway/sync/dist/__test__/**',
  '**/.kilo/**',
  'esggo-omni-center/**',
  'apps/universal-translator/test/**',
  'e2e-k1/**',
  'apps/ftg-tools/**/*.test.mjs',   // node:test，非 vitest
],
```
驗證：
- `pnpm test` 全體 vitest 綠燈
- `cd apps/ftg-tools && node --test ftg-mcp/server.test.mjs fal-images.test.mjs` 獨立綠燈

## Pattern K — health/metrics 路由部署陷阱
1. `/api/health/metrics` 作為獨立路由在 Turbopack 輸出中曾無故消失；改成單一路由 `/api/health` + `?format=metrics` 最可靠。
2. 若 `/api/health` 與 `/api/healthz` 同時存在，務必確認只保留一個 health 實現，避免 compiled artifact 指向舊版。
3. 常見錯誤：修改 `app/api/health/route.ts` 後 build 仍吃到舊版 → 刪除 `.next/server/app/api/health` 目錄再 rebuild。

## Pattern L — webhook/token 常數時間守門
在 cron/memory/webhook 路由統一時，使用 `src/lib/webhook-auth.ts` 的 `verifyWebhookSignature()`：
```ts
const payload = `${req.method}:${req.url}`;
if (verifyWebhookSignature(payload, provided, secret) || provided === secret) { return null; }
```
- `verifyWebhookSignature` 內部用 `crypto.timingSafeEqual`。
- memory route 只守 POST/DELETE，GET 開放；cron route 守所有寫入操作。

## Pattern M — nginx HTTPS redirect 與快取頭實務
1. HTTP→HTTPS redirect：新檔案放 `sites-available/` + symlink 到 `sites-enabled/`；但先移除同名 `listen 80` 衝突，否則 nginx -t 會警告 conflicting server name。
2. 靜態資產快取：`expires`/`add_header` 必須寫在對應 site conf 的 `server {}` 內；放 `/etc/nginx/conf.d/*.conf` 會報 `location directive not allowed`。
3. 驗證：`curl -I https://esggo.co/` 看 `Cache-Control`/`x-nextjs-cache`。

## Pattern N — PM2 環境變數重載
- 當前的 pm2 在 ssh 中 `pm2` 不在 PATH → 用絕對路徑 `/usr/lib/node_modules/pm2/bin/pm2`。
- 重載 env：`pm2 restart <app> --update-env`。
- 驗證：讀 `/proc/<PID>/environ` 或用 `pm2 env <id>`。

## Pattern O — .env 驗證腳本
加入 `scripts/validate-env.ts`：
- 讀取 `.env` key/value，比對必要變數清單。
- build/deploy 前自動檢查，避免 `.env` 重寫後再次遺漏變數。

## Pattern V — Zenrows integration (CLI + API wrapper + HMAC)
1. Install CLI: `pnpm add -w zenrows` (workspace root) or `npm install -g @zenrows/cli`.
2. Authenticate: `zenrows login --api-key <key>` stores `.zenrows/secrets.json`.
3. Verify: `zenrows fetch https://example.com --output markdown` → artifact under `.zenrows/runs/`.
4. Add server-side wrapper `src/lib/zenrows-client.ts` with `zenrowsFetch()` and `verifyZenrowsWebhookSignature()` using `crypto.timingSafeEqual`.
5. Expose via API route with HMAC guard: `POST /api/zenrows/fetch` requires `X-Signature-256` when `WEBHOOK_SECRET` is set.
6. For MCP-style Hermes integration, add to `~/.hermes/config.yaml`:
   ```yaml
   mcp_servers:
     zenrows:
       url: "https://mcp.zenrows.com/mcp"
       headers:
         Authorization: "Bearer <ZENROWS_API_KEY>"
   ```
   Local stdio alt: `command: npx`, `args: ["-y", "@file:`zenrows/mcp`"]`, `env: { ZENROWS_API_KEY: "..." }`.
7. Graceful fallback: if `ZENROWS_API_KEY` is unset, the wrapper warns at import time and routes return 503 rather than crashing.

## Pattern W — health/metrics route consolidation
1. Do NOT create `/api/health/metrics` as a separate route directory; Turbopack may silently drop it from `.next/server`.
2. Use a single `/api/health` route with `?format=metrics` query param for Prometheus output.
3. If both `/api/health` and `/api/healthz` exist, confirm only one implementation serves; duplicate route directories cause compiled-artifact ambiguity.
4. After editing `app/api/health/route.ts`, delete the entire `.next` directory before rebuild; partial route-dir deletion is insufficient.

## Pattern X — TypeScript strict mode enablement
1. Enable `strict: true` in both `tsconfig.core.json` and `tsconfig.json`.
2. After enabling, existing `any` casts, implicit returns, and index-signature mismatches surface as build failures.
3. Fix strategy: prefer narrowing types over `as any`; if an `any` escape is intentional, document it in the skill's "intentional escapes" list.
4. Do NOT relax `ignoreBuildErrors` to mask strict-mode regressions — fix the type errors instead.

## Pattern Y — build artifact stale-chunk masking
Symptoms: source file shows new code, but runtime still returns old behavior; `grep` on compiled route artifact misses recent edits.
Root cause: Turbopack/Next.js reuses cached chunks (`.next/server/chunks/...`) that don't reflect current source.
Fix: full clean rebuild — `rm -rf .next && next build`. Partial deletes like `rm -rf .next/server/app/api/<route>` are NOT enough.
Verification: after rebuild, `grep` the new code path in `.next/server/app/api/<route>/route.js` before testing.

## Pattern Z — PM2 duplicate instance cleanup
After multiple `pm2 start` attempts, duplicate entries for the same app name appear in `pm2 list` with different IDs. Only the newest instance binds the port; older ones stay in `waiting …` or `online` with stale pids.
Fix before any restart:
```bash
pm2 delete esggo-core
cd /var/www/esggo
pm2 start npm --name esggo-core -- start
pm2 save
```
Verification: `pm2 list` must show exactly ONE `esggo-core` entry with nonzero pid and uptime > 0s; `ss -tlnp | grep :3000` must show the expected listener.

## Pattern AA — GCP/Firebase decoupling: prefer existing NCBDB layer
When the user asks to remove GCP dependencies (Firebase/Firestore/firebase-admin), the project ALREADY has a real data layer: **NCBDB** (`src/lib/ncb-utils.ts` → `ncbQuery<T>({ table, method, body, params })`, instance `54686_esg_go_userdb`). Do NOT build a brand-new local JSON/fs shim unless the user explicitly says so — the user corrected exactly this mid-flight with **"改用 NCBDB"**.
- Server routes (surveys/resources/learning-center/village/support/rag): rewrite the `adminDb.collection(...)` call sites to `ncbQuery({ table, method, body, params })`. NCBDB returns `[]` gracefully when `NCB_API_KEY` is unset (simulation mode) — keep a `isNcbdbConfigured()` memory fallback for dev.
- **Client `.tsx` components** (`omni-center/*`, `village/page`, `sustain-write/v5`): NCBDB is request/response, no realtime. Build a **client-safe zero-fs shim** (`src/lib/firebase.ts`) implementing the firebase/firestore functional API (`collection(db,name)`, `doc`, `getDocs`, `getDoc`, `query`, `where`, `orderBy`, `limit`, `addDoc`, `setDoc`, `updateDoc`, `deleteDoc`, `onSnapshot`, `writeBatch`) backed by `localStorage` (client) / `globalThis` (server). Client components keep importing these names; only the import source changes from `'firebase/firestore'` → `'@lib/firebase'`.
- `claims/route.ts` (Firebase Auth custom claims): NOT migratable to NCBDB. Set it to 503 "disabled" — custom claims need a real RBAC, out of scope for dependency removal.
- `firebase-admin/auth` (`getAuth().verifyIdToken/getUser/setCustomUserClaims`) and `firebase-admin/firestore` (`getFirestore`): replace with the local stub in `src/lib/firebase-admin.ts` whose methods `throw` "[LocalMode] ..." — call sites become graceful degradation (catch → null/403).

### Learning Center 獨立 repo 無縫轉移 (2026-08-25 supplemental)
Learning Center 是 **獨立 checkout** (`C:\Project\esggo-learning-center`)，Next.js + Firebase + Prisma，**不是** esggo monorepo 的子目錄。其 `AGENTS.md` 明文「Firebase import 保留」——但用戶授權可覆蓋此保護條款。轉移模式（對齊根專案，保留 Firebase 路徑 intact 以不斷線上）：

1. **三層 fallback 優先序**（插入 NCBDB 層，不刪 Firebase）：
   ```
   useFirebase && db  →  Firebase Firestore  (最高優先, intact)
   else if useNcb    →  NCBDB  (新增跨裝置後端)
   else              →  localStorage (既有 fallback)
   ```
2. **LC 的 `src/db.js` 本來就有完整 `useFirebase && db` → localStorage 雙層架構** → 只需在每個 CRUD 函式插入 `else if (useNcb)` 分支，透過 `NCB_API_KEY` 環境變數啟用（不設則維持原 localStorage，零停機）。
3. **NCBDB client 自帶**：LC 是獨立 repo，無法 import 根專案 `ncb-utils.ts` → 新增 `src/ncb-client.js`（對齊根專案 `ncbQuery` 介面），支援 `VITE_*` 與 `process.env.*` 雙源讀取。
4. **無感遷移函式** `migrateLocalToNcb()`：瀏覽器內把 localStorage 資料（submissions/profiles/tas/pairings）搬入 NCBDB，使用者開網頁時呼叫一次即完成，不丟資料。
5. **實查發現**：LC `.env` 的 `VITE_FB_*` 憑證全為空 → `useFirebase=false` → 線上實際已跑 localStorage 模式。無縫風險比預期低，但使用者要的是真·跨裝置後端（NCBDB）。
6. **推送陷阱**：LC 是獨立 repo，push 被拒（remote 有本地沒有的 commits）→ 先 `git pull --rebase origin main` 再 push（無衝突）。
7. **驗證門檻**（AGENTS.md 規定順序）：`pnpm run test`（683 passed / 20 skipped，oa-swarm 靈魂執行鏈偶發 flaky timeout 與 db.js 無關，重跑即綠）→ `pnpm run build`（需 `DATABASE_URL` 佔位 + `VITE_NCB_API_KEY` 設定值以通過 `validate-env.ts` 並編譯 NCBDB 路徑）。
8. **`useNcb` 旗標**：在 `src/db.js` 頂部 `export let useNcb = isNcbEnabled()`，各 repository 層（`pairing.repository.js` 等）保持 `useFirebase && db` 分支 intact，只加 `else if (useNcb)`。
9. **LC 的 Firebase 集合**：`platforms/{APP_ID}/submissions`、`platforms/{APP_ID}/profiles`、`platforms/{APP_ID}/tas`、`platforms/{APP_ID}/pairings`。
10. **commit 範圍**：只 add 本次相關檔（`src/db.js`、`src/ncb-client.js`、`.env.example`、`pnpm-lock.yaml`），不相關的 `oa-swarm/*` 未追蹤檔不動。

## Pattern AB — Build-error loop is the ONLY reliable Firebase-reference scanner
`search_files` regex with `(` (e.g. `getAuth\(`) errors out, and client `.tsx` files importing `firebase/firestore` do NOT fail grep (the string only surfaces at Next.js compile). The deterministic fix loop:
1. `pnpm run build 2>&1 | grep -E "Can't resolve|Cannot find|Type error|Module not found"` → read the FIRST error, fix that file's import/type, re-run.
2. Repeat until the loop prints `✓ Compiled successfully` AND `✓ Generating static pages` with NO `Failed to type check`.
3. Each iteration typically reveals 1–3 reference sites `search_files` missed (e.g. `app/village/page.tsx`, `app/sustain-write/v5/page.tsx`, `auth-claims.ts`, `unified-auth.ts`).
Firestore-compatible shim API surface that must be implemented (missing any one throws `Type error` at build): `QuerySnapshot.{docs,size,empty,forEach}`, `CollectionRef.doc(id?)` (id optional → auto-gen), `DocRef.set(data, {merge?})` (2nd arg ignored locally), `getDocs(CollectionRef|QueryBuilder)`, `query(CollectionRef|QueryBuilder, ...)`, `onSnapshot(ref, cb, onError?)`. See `references/firebase-shim-compat.md`.

## Verification gate (run every round)
Fresh n8n install on VPS may show setup page with no REST API access. Fix without redeploy:
1. Stop n8n, write a setup record directly into `~/.n8n/database.sqlite` (`user` table / owner row): set `setupDoneAt`, `credentialsEncrypted`, `personalizationAnswers` JSON.
2. Restart n8n; `/rest/owner` should return the owner object instead of `Cannot GET /rest/owner`.
3. Browse to `/setup` to create owner credentials, or complete setup via UI.

## Pattern R — n8n API key inspection
When REST returns `Unauthorized` despite a visible UI key:
1. Read key directly from SQLite: `SELECT apiKey FROM user_api_keys WHERE label='<name>'` in `~/.n8n/database.sqlite`.
2. Verify the key length/format (n8n API keys are JWTs, typically >200 chars).
3. Re-test with the DB-sourced key via `X-N8N-API-KEY`. If still `Unauthorized`, the instance likely requires session/browser auth for that endpoint.

## Pattern S — n8n workflow import fallback
If `POST /rest/workflows/import` returns `Unauthorized`:
- Do NOT loop on the same REST call.
- Use the browser UI: Workflows → Import from File → select `workflow.json`.
- Update workflow node URLs to public endpoints BEFORE import (e.g. `https://aistation.esggo.co/webhook/n8n`).

## Pattern T — SSH heredoc quoting on Windows bash
`ssh user@host "cmd <<'PY'\n...\nPY"` frequently fails with `unexpected token` because Git-Bash eats the heredoc. Workaround:
1. Write the script locally with `write_file`.
2. `scp` it to `/tmp/` on the VPS.
3. `ssh user@host "python3 /tmp/script.py"` for execution.
This is deterministic and avoids nested-quote escaping entirely.

## Pattern U — pytest stale verification enforcement
After any code edit, rerun the relevant pytest subset before claiming success. Targeted command pattern:
```bash
python -m pytest tests/<file>.py::<test_name> -v
```
If targeted tests pass but full-suite times out, report the targeted evidence explicitly and note the timeout; do not claim full-suite green from partial results.

## Pattern P — 重建快取重建機制
每次 git pull 後自動：
```bash
rm -rf .next/server/app/api/<changed-route>
timeout 240 node_modules/.bin/next build
```
避免 stale chunks 誤導 production。

## Pattern J — high 級 audit 消除路徑（override + 版本升級）
`pnpm audit --audit-level=high` 出現高風險：
1. 先看依賴鏈：`pnpm why <pkg>`，確認是否為傳入 vulnerability（如 `next -> sharp`）
2. 若傳入且該依賴有 `minimumReleaseAgeExclude`，改 `allowBuilds`/`onlyBuiltDependencies` 或 override：
   - 例：`pnpm-workspace.yaml` 加 `"nanoid": ">=3.3.18 <4"` 修補傳入 high
3. 若為核心依賴傳入且無相容封鎖，升級該依賴：
   - 例：`pnpm up next@16.3.1`，消掉 `sharp <0.35.0` 的 libvips CVE
4. 再次 `pnpm audit --audit-level=high` 驗證歸零

## Verification gate (run every round)
- `pnpm run typecheck` → must exit 0 (runs `tsc -p tsconfig.core.json`)
- `pnpm run check` → must exit 0 (typecheck + 精選 vitest)
- `pnpm run test` → must exit 0 (workspace vitest)
- 有 `node:test` 套件時，額外 `cd apps/<pkg> && node --test ...` 驗證
- `pnpm run build` → must exit 0
- `pytest` → must exit 0（Python 側）
- `pnpm audit --audit-level=high` → must exit 0；若 high 剩餘，先看是否為 workspace 內專案的 engine warning，再視鏈結擇 override 或版本升級

## References
- `references/esggo-audit-2026-08.md` — full session record: 82 error-leak fixes, cron/memory/omni-sync auth guards, 6 commits.
- `references/esggo-best-practice-playbook.md` — reusable command recipes: replay-guard grep, error-leak scan/fix, vitest body-parsing, commit+push workflow.
- `references/esggo-audit-2026-08-14.md` — session record: vitest range exclusion, nanoid override, next 16.2.11→16.3.1 upgrade.
- `references/soul-chapter-insertion-verification.md` — 2026-08-24 pattern for extracting missing soul.md chapters from git history (deleted `soul-full.md`), verifying chapter numbering, inserting before the Soul Seal, and checking the five seal gates with real tool output instead of template variables.
- `references/firebase-shim-compat.md` — 2026-08-25 GCP decoupling: NCBDB-first rule, client-safe zero-fs shim API matrix, `QuerySnapshot.{size,empty}`, `onSnapshot` 3-arg form, file import-source switch list, verification gate.

## Source
Derived from OA-Team 五覺 (oa-best-practice-enlightenment) + 2026-08-13 esggo hardening session.
