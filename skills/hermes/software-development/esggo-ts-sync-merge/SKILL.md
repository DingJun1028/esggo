---
name: esggo-ts-sync-merge
category: software-development
description: ESG-GO 全域 TypeScript 雙向同步驗證 + 子應用併入 esggo monorepo 的合併缺口盤點 + 覺結界合規審計。Use when verifying cross-repo type sync (shared/types.ts ↔ consumer .d.ts), planning a sub-app merge into DingJun1028/esggo, or auditing against OA-Team Swarm 覺結界條款.
---

# ESG-GO TypeScript 雙向同步與 monorepo 合併盤點（含覺結界審計）

## 何時使用
- 確認 `shared/types.ts` ↔ consumer `types/generated/*.d.ts` 是否 drift
- `learning-center` / 其他子應用併入 `DingJun1028/esggo` monorepo 前的缺口盤點
- 對合併/同步動作做 OA-Team Swarm 覺結界合規審計

## 已驗證拓撲（2026-08-01）
```
canonical = DingJun1028/esggo 的 shared/types.ts (v3.1.0-Omni, sha c745f68)
generator = scripts/export-shared-types.js (map 21 blocks: 4 enum + 17 interface → DEST=cwd/types/generated/)
consumer = DingJun1028/esggo-learning-center 的 types/generated/esggo-shared.d.ts
checker = scripts/check-types-sync.js (block-level 比對, 輸出 TYPES_IN_SYNC)
CI gate = esggo-learning-center/.github/workflows/ci.yml (check-types-sync job, 2026-07-28 部署)
```
合併後只需修正路徑契約，同步機制原樣沿用。

## Step 1：無 terminal 時驗證同步
1. canonical 源用 **browser raw**（`https://raw.githubusercontent.com/.../shared/types.ts`）抓取——**不要用 web_extract**，它會跳脫/吃掉 `<T>`、generics、`[]` 等，導致比對失真。
2. 重放 checker 演算法：抽取 `export (enum|interface|type) X` 起、到 `}` 止的 block，strip `//` 註解，比對 missing / extra / mismatched。逐 block 一致即 IN SYNC。
3. 線上 artifact 與 CI gate 狀態用 GitHub API（`/repos/.../contents/...`）確認。

## Step 2：合併缺口盤點（Gap 項）
- **G-1** 建置範式衝突：Vite SPA vs monorepo Next.js（turbo `build` 預設 `next build`）
- **G-2** React 大版號：18 → 19（需實機 `vite build` 驗證）
- **G-3** 依賴缺漏：consumer 獨有的包（如 `@supabase/supabase-js`）monorepo 未含 → 保留在 app package.json 即可
- **G-4** generator DEST=`cwd/types/generated/` 併入後 cwd 變 monorepo 根 → 須改 `apps/<app>/types/generated/`；checker SRC 亦須從 `../esggo/shared` 改 `../../shared`
- **G-5** Firebase Functions 落點：CJS 專案放 `apps/<app>/functions/` 即可
- **G-6** CI 搬移：`check-types-sync` job 搬入 monorepo workflows
- **G-7** 本地 `soul.md` 0-byte 空檔（真聖典在 monorepo）→ 刪除
- **G-8** lockfile 雙軌（pnpm + npm 並存）→ 刪 `package-lock.json` 統一 pnpm
- **G-9** 缺 `tsconfig.json`（Vite 隱式 esbuild）→ 補 app 級 tsconfig 並納入 verify 包含集

## Step 3：覺結界審計（OA-Team Swarm 最佳實踐 v1.0）
四條款：**① 預設合規 ② 不帶病上線 ③ 頂標要求 ④ 結界繼承**
- 紅線：C3/C4/C5/C6/C7/C10 任一未清零 → **禁止**執行遷移腳本實寫或 `git push` 到 main。
- 解禁條件：`pnpm -F <app> build` + `pnpm -F <app> check:types-sync` 雙綠燈且手動項清零。
- 降險：先 `.\scripts\merge-to-esggo.ps1 -DryRun` 驗證自動項無副作用。

## 遷移腳本範本（方案 A：apps/<app> 子應用保留 Vite）
見倉庫 `scripts/merge-to-esggo.ps1`：自動化 C1/C2部分/C3部分/C8/C9/G-9；手動決策項 C3(React19)/C4/C5/C6/C7/C10。腳本對來源樹**只讀**，寫入僅落 `apps/<app>/`（不可篡改原則）。

## esggo monorepo alias 拓撲（2026-08-27 驗證）
合併/同步/重構 TS 時，路徑 alias 是**最易踩的靜默破壞源**。esggo 根 `tsconfig.json` paths（已驗證）：
```
@/*          → ./src/*          # 故 @/lib/foo → ./src/lib/foo
@lib/*       → ./lib/*          # 故 @lib/foo  → ./lib/foo（根 lib/，非 src/lib/）
@esggo/shared → ./packages/shared/src
@shared/*    → ./shared/*
```
- 兩棵樹 `./src/lib/*` 與 `./lib/*` **並存且都合法**：app 內多數檔用 `@lib/...`（解析到根 `lib/`），而 Next.js route 檔用 `@/lib/...`（解析到 `src/lib/`）。**切勿把 route 的 `@/lib/...`「正規化」成 `@lib/...`**——這會把可解析 import 變成 module not found，Next build 直接紅。
- `pnpm run typecheck`（= `tsc -p tsconfig.core.json`）的 `include` 只含 `src/impl/**`、`src/lib/omni-core/**`、`src/lib/cloudflare/**`，**不含 `app/api/**`**。typecheck 綠燈≠app route 改動安全——app 改動須靠 `tsc --traceResolution` 或 `next build` 驗證。
- 驗證法：`npx tsc --traceResolution -p tsconfig.json 2>&1 | grep -A4 "moduleName"` 看 candidate location 是否真實存在。
- 紅線：任何 alias 改動若未經 traceResolution 證明兩端都解析到存在路徑，禁止 commit。

## Pitfalls
- web_extract 會毀 TS generics → 一律用 browser raw 抓源
- origin 指 `esggo.git` 可能是**有意決策**（user 確認非誤改）→ 勿當 bug 修
- monorepo 無 `learning-center/` 子目錄時，合併尚未落地，盤點先行
- 無 terminal / execute_code 阻擋的 session：只能產出檔案，實際 git/建置須正常 session 或用 `_hermes-cron\sync-esggo.ps1`

## Verification（正常 session）
```bash
cd <monorepo>
pnpm install
pnpm -F learning-center build          # vite build → dist/
pnpm -F learning-center check:types-sync   # 期望 TYPES_IN_SYNC
```
