# universal-translator 終始矩陣型別守門閉合 Recipe（2026-08-13）

> 狀態：已閉合。`npx tsc -p tsconfig.ut.json --noEmit` = **0 error**。
> 關鍵 commit：`3744e7fc9`（fix(universal-translator): 終始矩陣型別守門閉合 0 error (tsc 68→0)）

## 背景
universal-translator 的 `.mjs` 服務在 2026-08 累積了 prior-turn 的隱式 any 與契約不符，
`tsc` 長期報 ~65–68 errors。這不是功能 bug（運行期實測全通），但違反「終始矩陣雙綠燈前勿 push main」紅線。
本 recipe 紀錄一次把 68 個錯誤壓到 0 的確切手法。

## 閉合步驟（依序，每步後跑 tsc 收斂）

### 1. canonical 契約補欄位（shared/types.ts）
`ISpeechToSubtitleResult` 原只有單數 `translation`/`engine`，但 `translateToMany` 實際回傳
`{translations: Record<code,string>, engines: Record<code,string>}`（plural）。在 canonical 補：
```ts
export interface ISpeechToSubtitleResult {
  text: string;
  detected: 'zh-TW' | 'en';
  translation: string;        // 單語場景
  target: 'zh-TW' | 'en';
  translations?: Partial<Record<LanguageCode, string>>;  // ← 新增（多語場景）
  engine: string;
  engines?: Partial<Record<LanguageCode, string>>;        // ← 新增（多語場景）
  cached: boolean;
  trace?: string;
}
```
改完務必：`node ../../scripts/export-shared-types.js` → 重生成 `types/generated/esggo-shared.d.ts`。

### 2. 生成器加索引型別（scripts/sync-lang-matrix.mjs）
`lang-matrix.mjs` 的 `ALIAS_MAP` / `ENGINE_MATRIX` 原為裸物件，tsc 報 TS7053（string 不能索引 {}）。
在生成模板補 JSDoc：
```js
/** @type {Record<string, string>} */
const ALIAS_MAP = ${JSON.stringify(aliasMap, null, 2)};

/** @type {Record<string, Record<string, string>>} */
const ENGINE_MATRIX = ${JSON.stringify(...)};
```
然後 `node scripts/sync-lang-matrix.mjs` 重生成 `types/generated/lang-matrix.mjs`。

### 3. translate.mjs 修正
- 移除不存在的 reference：`/// <reference path="./types/generated/lang-matrix.d.ts" />`
  （生成檔是 `.mjs` 非 `.d.ts`，運行期已 `import './types/generated/lang-matrix.mjs'`）。
- 各引擎函式（`viaOllama`/`viaGeminiLive35`/`viaGoogleGtx`/`viaLibre`/`viaMyMemory`）補
  `@param {string} text @param {string} from @param {string} to @returns {Promise<string>}`。
- `translateDetailed`/`translateText`/`translateToMany` 補 JSDoc；`translateToMany` 的 `@returns`
  改為局部形 `{translations: Record<string,string>, engines: Record<string,string>}`（不強指全介面）。
- 助手：`cacheKey`/`sleep`/`applyGlossary`/`postProcess`/`hashOf` 參數標 `@type {string}`；
  `parts.map((/** @type {{text?:string}} */ p) => ...)`；`segments.map((/** @type {Array<string>} */ x) => ...)`。
- `engineChain()` 區域變數標
  `/** @type {Array<[string, (text:string,from:string,to:string,ctxHint?:string)=>Promise<string>]>} */ const chain = [];`

### 4. server.mjs 修正
- `r.translations` / `r.engines` 已成 optional → 消費處補 `|| {}`：
  `translations: r.translations || {}`、`Object.values(r.engines || {})`。
- `req.url` 防 undefined：`const rawUrl = req.url || '';` 再 `rawUrl.split('?')...`。
- `catch (/** @type {any} */ e)` 收 unknown。
- `recordUtterance({..., from: String(from), to: String(targets[0])})` 確保 string 型別。

### 5. context_buffer.mjs 修正
- Map 值型別：`/** @type {Map<string, Array<{src:string,tgt:string,from?:string,to?:string,ts:number}>>} */`
- `recordUtterance` 參數 JSDoc；`getContext`/`buildContextHint` 的 `lastN` 標 `@param {number}`；
  `contextStatus()` 的 `snapshot` 標 `/** @type {Record<string,number>} */`。

### 6. s2s_gemini_live.mjs 修正
- `createS2SSession` 的 `@param` 由 `{object} opts {...}` 改為
  `@param {{source?:string, target?:string, voice?:string}} opts`（JSDoc 內聯 `{...}` 非合法型別語法）。
- `@returns` 補 `url`/`source`/`target` 欄位；`const key = process.env.GEMINI_API_KEY || '';`（防 string|undefined）。

## 嚴禁事項（紅線）
- 禁用 `@ts-nocheck` / `@ts-ignore` / `any` 強轉。隱式 any 一律用明確 JSDoc 型別解決。
- 不改任何運行邏輯、不動 if/for/await/傳參順序。本 recipe 只加型別註解 + 補契約欄位。

## 驗證（閉合判定）
```bash
cd apps/universal-translator
npx tsc -p tsconfig.ut.json --noEmit     # 必須 0 error
node --check server.mjs && node --check translate.mjs \
  && node --check context_buffer.mjs && node --check s2s_gemini_live.mjs
pnpm run test                              # 6/6 pass
```
行為不變證明：`pnpm test` 的 `translateToMany` 仍 75ms 回 `{translations, engines}`、`translateDetailed` 雙向正常。

## 子 agent 陷阱（重要）
派 delegate_task 修矩陣時，子 agent 可能因底層 API 連線中斷而「自陳成功但沒實際寫入 patch」
（transcript 只有 read/terminal 探索、無 write/patch，獨立 `git diff` 為空）。
**任何「矩陣已修」宣告都必須親自跑 `npx tsc` 驗證 0 error**，勿信子 agent 自陳。
本輪即由主 agent 親自逐檔 patch 完成閉合。

## 部署
```bash
git add apps/universal-translator/server.mjs apps/universal-translator/translate.mjs
git commit -m "fix(universal-translator): 終始矩陣型別守門閉合 0 error (tsc 68→0)"
git push origin main
ssh -i ~/.ssh/esggo_original ubuntu@161.118.248.180 \
  'cd /opt/esggo && git pull --ff-only && pm2 restart universal-translator'
curl https://translate.esggo.co/health   # {"status":"ok","version":"1.7.0"}
```
