---
name: esggo-ts-matrix-onboard
description: Wire an esggo app into the bidirectional TS 終始矩陣.
---

# ESG-GO 雙向 TS 終始矩陣 · 新 consumer 接入

## 何時使用
- 要把 `apps/<app>`（純 `.mjs` Node 服務 + 前端 `.html`）接入 `esggo/shared/types.ts` 契約
- 跑 `scripts/export-shared-types.js` 報錯或生成檔斷裂
- 為 `.mjs` 建立 `// @ts-check` 型別守門（strict 模式）
- 用戶說「套用全域全端全量全面雙向 TypeScript 架構終始矩陣」之類指令

## 架構（終始矩陣）
```
終 (canonical):  esggo/shared/types.ts        ← 所有型別一次性定義
生成器:           scripts/export-shared-types.js → 各 consumer 的 types/generated/esggo-shared.d.ts
始 (consumer):   apps/<app>/types/generated/esggo-shared.d.ts  ← 僅消費，不可改
守門:             apps/<app>/tsconfig.ut.json (allowJs+checkJs+strict) → npx tsc -p tsconfig.ut.json --noEmit
```
矩陣原則：任一端改需求 → 回饋 canonical → 重跑 generator → 全端同步。consumer 只 import 生成的 `.d.ts`，絕不手改 canonical。

## Step-by-step（universal-translator 實例，2026-08 全數驗證通過）

1. **canonical**：在 `shared/types.ts` 末尾追加領域型別。例：
   - `export enum TranslateEngine { GOOGLE_GTX='google-gtx', LIBRETRANSLATE='libretranslate', MYMEMORY='mymemory', PASSTHROUGH='passthrough', FALLBACK_ORIGIN='fallback-origin' }`
   - `export type LanguageCode = 'auto' | 'zh' | 'zh-CN' | 'zh-TW' | 'zh-Hant' | 'en' | 'ja' | 'ko' | 'es' | 'fr'`
   - `ITranslateRequest` / `ITranslateResult` / `ISpeakPayload` / `ISseTranslationEvent` / `IOmniTypeMatrix`
   - **關鍵**：`engine` 欄位刻意寬鬆為 `string`（5T 溯源輸出動態引擎標記，運行期不綁 enum 值；標 enum 會與 `'passthrough'` 字串衝突）。

2. **generator map**：在 `scripts/export-shared-types.js` 的 `map` 陣列補條目：
   ```js
   ['TranslateEngine', 'enum'],
   ['LanguageCode', 'type'],
   ['ITranslateRequest', 'interface'],
   ['ITranslateResult', 'interface'],
   ['ISpeakPayload', 'interface'],
   ['ISseTranslationEvent', 'interface'],
   ['IOmniTypeMatrix', 'interface'],
   ```

3. **generate**：從 consumer 目錄執行 `node ../../scripts/export-shared-types.js` → 產 `types/generated/esggo-shared.d.ts`。

4. **consumer 型別守門**：新建 `apps/<app>/tsconfig.ut.json`：
   ```json
   {
     "compilerOptions": {
       "target": "ES2022", "lib": ["ES2022","DOM","DOM.Iterable"],
       "module": "NodeNext", "moduleResolution": "NodeNext",
       "allowJs": true, "checkJs": true, "strict": true,
       "noEmit": true, "skipLibCheck": true, "esModuleInterop": true,
       "resolveJsonModule": true, "types": ["node"],
       "baseUrl": ".",
       "paths": { "@shared/*": ["../../shared/*"], "@ut-types/*": ["./types/generated/*"] }
     },
     "include": ["server.mjs","translate.mjs","types/generated/esggo-shared.d.ts","types/decl.d.ts"],
     "exclude": ["node_modules"]
   }
   ```
   `types/decl.d.ts` 補 `declare module 'ws'`（pnpm 隔離下 tsc 找不到型別，最小宣告即可過 strict）。

5. **.mjs 對齊**：檔頭加
   ```js
   // @ts-check
   /// <reference path="./types/generated/esggo-shared.d.ts" />
   ```
   導出函式補 JSDoc：`@param {string} text` / `@returns {Promise<import('./types/generated/esggo-shared.d.ts').ITranslateResult>}`。

6. **前端 .html**：`<script type="module">` 開頭加 `/// <reference path="./types/generated/esggo-shared.d.ts" />`。

7. **驗證**：`npx tsc -p tsconfig.ut.json --noEmit` 須 **0 error** 才算矩陣閉合。

## Pitfalls（實證，見 references/export-shared-types-generator-gotchas.md）
- **generator ESM**：`__dirname` 在 ESM 下未定義 → 改用 `import { fileURLToPath } from 'url'; const __dirname = path.dirname(fileURLToPath(import.meta.url));`
- **SRC 路徑**：原 `path.resolve(process.cwd(),'..','esggo','shared','types.ts')` 從 `apps/universal-translator` 跑會解析成 `apps/esggo/shared/types.ts`（錯）。須 `path.resolve(__dirname,'..','shared','types.ts')`（以 scripts 位置為基準，與 caller cwd 無關）。
- **type 多行 union 截斷**：`LanguageCode = \n | 'auto' | ...` 原用大括號配對截斷，生成檔斷裂（TS1005）。`findExportBlock` 對 `kind==='type'` 且無 `{` 時改以 `;` 結尾偵測。
- **`.mjs` + strict 隱式 any 清單**（`@ts-check` 才暴露）：
  - `req.url` 可能 `undefined` → 回調開頭 `const url = req.url || ''` 且標 `/** @type {string} */`（否則 `url === '/health'` 報 no-overlap）。
  - `ws` connection/message 參數標 `/** @type {any} */`。
  - `engineChain()` 回傳值須顯式標 `@type {Array<[string, fn]>}` 否則解構出的 name 被推論成 fn（TS2349 not callable）。
  - `engine` 欄位契約放寬 `string`（見上）。
- **Payload 欄位 ↔ canonical 型別必須雙向同步**: 若 `.mjs` 在廣播/回應 payload 多輸出欄位（如 `server.mjs` 在 `ISseTranslationEvent` 加 `context`），**必須同時** 在 `shared/types.ts` 的該 interface 加欄位並重跑 generator，否則 `npx tsc` 報 `Object literal may only specify known properties, and 'context' does not exist in type 'ISseTranslationEvent'`。矩陣是雙向的：運行期 payload 與型別要一致，漏一邊就破窗。修法見 references/universal-translator-matrix-verification.md。
- **型別守門已閉合（2026-08-13 實證，commit `3744e7fc9`）**：`npx tsc -p tsconfig.ut.json --noEmit` 現為 **0 error**，終始矩陣正式閉合。舊版技能曾寫「~65 errors、0-error 是獨立修繕項不阻塞」——**該說法已作廢**。閉合的關鍵修繕（缺一不可）：
  1. **canonical `shared/types.ts` 的 `ISpeechToSubtitleResult` 補 `translations?` / `engines?` 欄位**（plural，對齊 `translateToMany` 實際回傳的 `{translations, engines}`，非舊版的單數 `translation`/`engine`）。改完務必重跑 `node ../../scripts/export-shared-types.js`。
  2. **`translateToMany` 的 `@returns` 改為局部形** `{translations: Record<string,string>, engines: Record<string,string>}`（不再強指 `ISpeechToSubtitleResult` 全欄位，因該函式只產 translations/engines）。
  3. **`scripts/sync-lang-matrix.mjs` 生成器**：`ALIAS_MAP` / `ENGINE_MATRIX` 輸出加 `/** @type {Record<string,string>} */` / `/** @type {Record<string, Record<string,string>>} */`，根治 `lang-matrix.mjs` 的 index 隱式 any（TS7053）。
  4. **server.mjs 消費 `.translations`/`.engines` 處補 `|| {}` 回落**（因已成 optional）。
  5. 各 `.mjs` 引擎/助手函式補 JSDoc `@param {string}`/`@returns`；`engineChain()` 區域 `const chain` 標 `@type {Array<[string, fn]>}`；`req.url` 防 `undefined`；`catch(e)` 標 `/** @type {any} */`。
  6. **嚴禁 `@ts-nocheck`/`@ts-ignore`/`any` 強轉**；隱式 any 一律用明確 JSDoc 型別解決（本輪即此法閉合）。
  - 完整閉合 recipe 見 `references/universal-translator-matrix-closure-2026-08-13.md`。
  - 子 agent 陷阱警示：派 delegate 修矩陣時，子 agent 可能因 API 連線中斷而未實際寫入 patch（自陳成功但 `git diff` 為空）。**任何「矩陣已修」宣告都必須獨立跑 `npx tsc` 驗證 0 error + `node --check` 4 檔 + `pnpm test` 綠燈**，勿信子 agent 自陳。
  - **技能自體維護（編輯本技能 SKILL.md）：通用 `patch` 工具對技能目錄路徑會報 `Failed to read file`（含反斜線或誤加 `esggo/` 前綴層級皆失敗）。改用 `skill_manage(action='patch', name='esggo-ts-matrix-onboard')`（以技能名解析，非檔案路徑），或用 `execute_code` 跑 Python `open(path,encoding='utf-8').read()` → `replace` → `write` 最穩。真實路徑為 `~/AppData/Local/hermes/skills/<skill-name>/SKILL.md`（**無**額外 `esggo/` 前綴；`find` 輸出易誤導層級）。同輪實證：先 `find` 確認精確路徑，再用 Python 編輯成功。
- **部署驗證要 cache-bust**: VPS `git pull` + `pm2 restart` 後 Cloudflare 可能回傳舊版靜態 HTML。確認新內容上線用 `curl "https://<host>/<page>.html?cb=$(date +%s)"` 查新標記（如 `id="zoomBtn"`）。
- **延伸實證細節**: 債務清單 / payload 同步範例 / 部署 recipe / Jules 檔 stash 解決 → 見 `references/universal-translator-matrix-verification.md`。

## 復用模式（非環境偶發，可重複）
- **驗證 node server**：`terminal(background=true)` 在 Git-Bash 子 shell 下 node 會被 SIGHUP 殺（exit 1）。改用 `execute_code` 內 `subprocess.Popen` 啟 node、同程序 urllib 探測、再 `proc.terminate()`。
- **舊 node 殘留佔埠**：遠端/舊 session 殘留 node 佔用 port（如 8788）會攔截所有 curl 測試（回舊結果）。先 `taskkill /PID <n> /F` 清場再測。
- **git push non-fast-forward**：`git rebase origin/main` 因未暫存修改失敗 → 先 `git stash push -u` → `rebase` → `push` → `git stash pop`。
- **改 canonical 後型別守門必跑**: 動 `shared/types.ts` 後務必 `node ../../scripts/export-shared-types.js` → `npx tsc -p tsconfig.ut.json --noEmit`。新領域型別會在 consumer `.mjs`（`@ts-check`）立刻暴露 strict 錯誤，最常見兩種：(1) `URLSearchParams.get()` 回 `string|null` 不能直接傳 `string|undefined` 參數 → 先 `const raw = q.get('x'); const x = raw === 'a' || raw === 'b' ? raw : ''`；(2) `Record<string, X>[s]` 隱式 any → 標 `/** @type {Record<string, string>} */` 或加 index signature。
- **大檔編輯會 stream 逾時**: `patch`/`write_file` 單次 payload > ~8K token 會導致工具流中斷（"Stream stalled mid tool-call"）。拆成多個小 `patch`（每次只改一個函式/區塊）或分次 `write_file`，勿一次貼整檔。
- **驗證鏈順序**: regen → `node --check *.mjs` → `npx tsc --noEmit` → 行為實測（mock 依賴）→ 才 push。型別守門 0 error 才算矩陣閉合。
- **行為實測免真依賴**: 本機缺 STT/LLM 時，用 `terminal(background=true)` 起最小 mock 服務（Python `http.server` 回固定 JSON）佔該 port，再打真實端點驗證編排邏輯；Ollama 偶發逾時會自動回落 gtx（證明 fallback 正常，非 bug）。

## Domain Example: Universal Translator (萬能即時翻譯) 雙向矩陣
實證案例見 `references/universal-translator-bilingual-matrix.md`：收斂語域為繁中↔英文雙向、Ollama 自託管 LLM 引擎置鏈首、新增 `/speech-to-subtitle` 語音轉雙語字幕、前端 `studio.html`/`stream.html` 雙語浮層，全部通過型別守門 0 error。

## Domain Example: OA-Team 雙蜂戰隊 60 (oa-swarm 純 .ts consumer)
實證案例見 `references/oa-swarm-matrix-closure-2026-08-26.md`：純 TypeScript 專案（非 .mjs）接入終始矩陣，OA 領域型別 (HiveSide/ArrayKey/ISoulAgent/IComponentCore/ISoulArtifact/ISwarmTask/SwarmTaskResult/IOABMessage/I5TVerification) 納入 canonical `shared/types.ts`。對齊模式用 `interface X extends ICanonical`（**非** `implements`，TS1176 禁止 interface implements）+ `tsconfig.ut.json` 原生 tsc 守門 + `verify-oa-gap.mjs` 缺口閉環 (EXIT=0) + 自帶 block-level `check-oa-types-sync.mjs`（根 `check-types-sync.js` 全文比對不適用）。VPS 部署用 scp 同步 types/generated 產物（本機 absolute path / VPS 路徑雙軌）。

## P8 — Standalone TypeScript Library Compilation Error Patterns (2026-08-28)

When building a standalone TypeScript library (not Next.js monorepo consumer), these error patterns frequently occur. Fix them sequentially: capture first error → fix → recompile → next error.

- **Redeclare block-scoped variable**: A `const` is declared (`const X = 2`) and then re-exported (`export const X = X`). Fix: declare as `export const X = 2` at the top, delete the bottom re-export line.
- **`import type` used as value**: Importing an enum with `import type` then using it as a constructor or in a value position (e.g., `Vendor.OpenAI`). Fix: split the import — `import { Vendor } from '../types/index.js'` (value) + `import type { OtherInterface } from '../types/index.js'` (type-only).
- **Cannot assign to 'x' because it is a read-only property**: Interface declares `readonly field` but code later mutates it. Fix: remove `readonly` from that interface field, or use `(record as any).field = value` at the single mutation site.
- **Argument of type 'unknown' is not assignable to parameter of type 'X'**: JSON schema `args` objects from tool executor functions are typed as `unknown`. Fix: at the top of each execute function, add `const args_ = args as any;` and use `args_.field` instead of `args.field` throughout.
- **Export declaration conflicts with exported declaration of 'X'**: A type is declared with `export interface X` and then re-exported with `export type { X }`. Fix: delete the re-export line; the interface export at definition is sufficient.
- **`verbatimModuleSyntax` requires `export type`**: Re-exporting types as values (`export { X }`) when `verbatimModuleSyntax: true`. Fix: use `export type { X }` for type-only re-exports.
- **A required parameter cannot follow an optional parameter**: Method signature like `method(a, b?, c)` where `c` is required. Fix: make the trailing parameter optional (`c?`).
- **Async generator typed as `Promise`**: An `async *stream()` generator method incorrectly has return type `Promise<...>` instead of `AsyncIterable<any>`. Fix: return type must be `AsyncIterable<any>` for async generators.
- **Type 'string | string[]' not assignable to type 'string'**: A field typed as `string | string[]` (e.g., `instructions?: string | string[]`) assigned to a `string` parameter. Fix: normalize with `Array.isArray(x) ? x[0] : x` or cast `as string`.
- **`npx tsc` reports "not the tsc command"**: TypeScript not registered in devDependencies. Fix: `npm install --save-dev typescript`, then use `./node_modules/.bin/tsc` (not `npx` which may resolve wrong version).
- **`npm install` fails on `@file:` peer deps**: `package.json` has invalid peer dependency entries like `"@file:./openai/codex-sdk": "*"`. Fix: remove invalid `@file:` entries from `peerDependencies` and `optionalDependencies`.
- **Duplicate const export self-reference**: `export const X = X` at the bottom of a file when `X` was already declared as `const X = 2` at the top. Fix: declare as `export const X = 2` at the top, remove the bottom re-export.

## Verification
```bash
# For matrix consumers (.mjs projects)
cd apps/<app>
node ../../scripts/export-shared-types.js     # 期望 OK types/generated/esggo-shared.d.ts
npx tsc -p tsconfig.ut.json --noEmit          # 期望 0 error
node --check server.mjs && node --check translate.mjs   # 語法

# For standalone TS libs
npx --no-install tsc -p tsconfig.json --noEmit --skipLibCheck  # exit 0
npx --no-install tsc -p tsconfig.json  # should produce dist/
ls dist/index.js  # must exist
```
