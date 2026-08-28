# 終始矩陣型別守門閉合實錄：68 → 0 error

實證於 2026-08 universal-translator。以下為可重複的「把 `npx tsc -p tsconfig.ut.json --noEmit` 從 N error 修到 0」方法論，非環境偶發。

## 總原則
- 紅線：**只補 JSDoc 型別註解 + 修正契約不符，絕不改運行邏輯、絕不調整 if/for/await/傳參順序**。
- 禁 `@ts-nocheck` / `@ts-ignore` / `any` 強制轉型消錯。隱式 any 一律用明確 JSDoc 型別解決。
- 契約不符優先回 canonical `shared/types.ts` 補欄位 → 重跑 `node ../../scripts/export-shared-types.js` → 再 tsc。

## 迭代流程（關鍵：小步快跑，每檔修完即 tsc）
```
cd apps/<app>
npx tsc -p tsconfig.ut.json --noEmit 2>&1 | grep -E "\.mjs\(|\.d\.ts\(" | grep -v "npm warn"
# 按檔分類錯誤 → 逐檔補 JSDoc / 修正契約 → 每輪重跑 tsc 直到 0
node --check server.mjs && node --check translate.mjs   # 確認語法未破
pnpm run test                                           # 確認行為未破
```

## 高頻錯誤型態與修法（按出現頻率）

### A. canonical 契約「欄位名不符」— 最陰險
現象：`Object literal may only specify known properties, and 'translations' does not exist in type 'ISpeechToSubtitleResult'`。
根因：canonical interface 用**單數** `translation`/`engine`，但運行碼（`translateToMany`）回傳**複數** `translations`/`engines`。這是 canonical 型別寫錯，不是沒同步。
修法：在 canonical 補**複數可選**欄位（保留單數向後相容），不是改運行碼：
```ts
export interface ISpeechToSubtitleResult {
  text: string;
  detected: 'zh-TW' | 'en';
  translation: string;            // 單語場景
  target: 'zh-TW' | 'en';
  translations?: Partial<Record<LanguageCode, string>>;  // 多語場景 (translateToMany 輸出)
  engine: string;
  engines?: Partial<Record<LanguageCode, string>>;       // 多語場景
  cached: boolean;
  trace?: string;
}
```
消費端用 `r.translations || {}` / `r.engines || {}` 防 undefined。

### B. 生成檔 `lang-matrix.mjs` 索引隱式 any（根因在 generator）
現象：`lang-matrix.mjs(113): Element implicitly has an 'any' type because expression of type 'string' can't be used to index type '{...}'`。
根因：生成器 `scripts/sync-lang-matrix.mjs` 輸出的 `const ALIAS_MAP = {...}` / `const ENGINE_MATRIX = {...}` **無 `@type` 註解**，strict 下索引報 any。
修法（**改 generator，一次永逸，regen 安全**）：
```js
/** @type {Record<string, string>} */
const ALIAS_MAP = ${JSON.stringify(aliasMap, null, 2)};
/** @type {Record<string, Record<string, string>>} */
const ENGINE_MATRIX = ${JSON.stringify(...)};
```
改完 `node scripts/sync-lang-matrix.mjs` 重新生成。

### C. `@returns` 型別過嚴
現象：`translateToMany` 回傳 `{translations, engines}` 卻標 `@returns {ISpeechToSubtitleResult}` → `missing the following properties: text, detected...`。
修法：回傳型別改用局部形 `Promise<{translations: Record<string,string>, engines: Record<string,string>}>`（與實際回傳一致），不強塞完整 interface。

### D. 函式參數隱式 any（最多，機械補）
每個導出/內部函式的參數補 JSDoc：
- 普通：`/** @param {string} text */`
- 解構物件：`/** @param {{room?:string, src:string, tgt?:string, from?:string, to?:string}} u */`
- 回呼參數內聯：`segments.map((/** @type {Array<string>} */ x) => x[0])`
- `Object.entries(MAP)` 解構：`for (const [/** @type {string} */ k, /** @type {string} */ v] of ...)`
- 外部 API 回應形狀：`parts.map((/** @type {{text?:string}} */ p) => p.text || '')`
- 空物件初始化先標型：`/** @type {Record<string, string>} */ const out = {};`

### E. `engineChain()` 回傳不可呼叫
現象：`fn is not a function` (TS2349)。
修法：函式加 `@returns {Array<[string, (text:string,from:string,to:string,ctxHint?:string)=>Promise<string>]>}`，**且** 區域變數也標：
```js
function engineChain() {
  /** @type {Array<[string, (text:string,from:string,to:string,ctxHint?:string)=>Promise<string>]>} */
  const chain = [];
  ...
}
```

### F. `req.url` possibly undefined
修法：函式開頭 `const rawUrl = req.url || '';` 再 `rawUrl.split('?')...`。

### G. `catch (e)` unknown
修法：`catch (/** @type {any} */ e)`（JSDoc cast 非 `@ts-ignore`，合規）。

### H. 壞的 reference 路徑
現象：`lang-matrix.d.ts` 不存在 (TS6053)。
修法：先查該符號是否真被使用。若 `lang-matrix.mjs` 才是生成檔（`.mjs` 非 `.d.ts`），把 reference 改成 `./types/generated/lang-matrix.mjs` 或直接移除（型別來自 `.d.ts` 即可）。

## 兩個關鍵 gotcha（本輪實證）

### gotcha 1：patch 後內容可能「看起來改了但實際已等於 HEAD」
現象：patch 回 `files_modified`，但後續 `read_file`/`git diff` 顯示內容仍是舊版（與 HEAD 一致）。
原因：同一邏輯編輯在前一輪已 commit（如 `c97ef9399`），本輪補同內容 → git 無 diff，tsc 報的錯來自別處。
**對策**：每次 patch 後立即 `git diff <file>` 或 `read_file` 確認變更「真的落地且與 HEAD 不同」。勿只信 tool 回傳的 diff 片段。若 `git diff` 為空但 tsc 仍報該檔錯誤，表示該檔已正確、錯在別檔。

### gotcha 2：delegate 子 agent 修 type-gate 不可靠
現象：派 leaf 子 agent 跑「68→0」，它讀完所有檔、跑數輪 tsc，但最終因 API 連線中斷**零 patch 產出**（transcript 只有 read/terminal，無 write/patch）。
**對策**：type-gate 閉合需在**同一 context 內小步迭代 tsc**（每改一檔即重跑），子 agent 的長程多輪迭代容易在中途失效且難驗證。直接自己做，或派 agent 時要求「每輪結束前必須 tsc 歸零一類錯誤並回報」。

## 部署後行為驗證的正確分層
- **型別/語法**：本地 `npx tsc --noEmit` + `node --check` + `pnpm run test`（本地 test 真打 API 快，75ms）。
- **VPS 上線**：`git pull` + `pm2 restart` 後用 `curl "...?cb=$(date +%s)"` cache-bust 確認靜態頁含新標記（如 `zoomBtn`）。
- **勿用 VPS curl 驗證翻譯行為**：VPS→google-gtx 上游延遲可能 180s timeout，這是網路非程式壞。行為正確性靠本地 `pnpm test` 證明。
