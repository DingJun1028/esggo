# libs/incremental — ESM 消費驗證實錄 (esggo-monorepo-build Trap 10)

來源會話：2026-08-24，將 `libs/incremental`（soul.md §12 增量優化參考實作）扶正為
monorepo 一等公民。本檔是「vitest 綠 ≠ Node ESM 可消費」的真實復現與通過配方。

## 症狀（踩坑順序）
1. `vitest run` → 18 passed (18)。以為完成。
2. `node -e "import('@esggo/incremental')"` →
   `ERR_MODULE_NOT_FOUND: .../node_modules/@esggo/incremental/dist/stream-buffer`
   imported from `.../dist/index.js`。
3. 根因：源碼用 `from './stream-buffer'`（無 `.js`），tsconfig `moduleResolution: Bundler`
   → dist 仍輸出無副檔名 import；vitest 像 bundler 能補，原生 node ESM 不能。

## 修復（兩步都必要）
1. `tsconfig.build.json` 改 `module/moduleResolution: NodeNext`（並加 declaration 產 `.d.ts`）。
2. 7 個源檔相對 import 全補 `.js`：
   - event-bus / api-gateway / cache-manager / error-handler / etl-pipeline /
     service-orchestrator 的 `from './stream-buffer'` → `from './stream-buffer.js'`
   - index.ts 的 `export * from './x'` → `export * from './x.js'`

## 通過配方（真實鐵證，非宣稱）
```bash
# 1) 重建 dist（含 .d.ts）
node node_modules/typescript/bin/tsc -p libs/incremental/tsconfig.build.json
# 2) vitest
node node_modules/vitest/vitest.mjs run libs/incremental/test
# 3) 真實 ESM 消費（相對路徑避開 symlink/路徑轉換陷阱）
node libs/incremental/test/dist-smoke.mjs
#    → dist 匯出總數: 10 / ESM_CONSUMABLE=OK
```
`test/dist-smoke.mjs` 範本（放套件內，可被 `node` 直接跑）：
```js
import { EventBus, ServiceOrchestrator, ETLPipeline, APIGateway,
  CacheManager, ErrorHandler, hashLock, generateTraceableId,
  StreamBuffer, DeltaTracker } from '../dist/index.js';
const need = { EventBus, ServiceOrchestrator, ETLPipeline, APIGateway,
  CacheManager, ErrorHandler, hashLock, generateTraceableId, StreamBuffer, DeltaTracker };
const missing = Object.entries(need).filter(([,v]) => v === undefined).map(([k]) => k);
if (missing.length) { console.error('MISSING:', missing); process.exit(1); }
const bus = new EventBus();
const id = await bus.publish('demo', { x: 1 });
const locked = hashLock({ a: 1 });
if (!Object.isFrozen(locked)) { console.error('hashLock not frozen'); process.exit(1); }
console.log('dist 匯出總數:', Object.keys(need).length);
console.log('ESM_CONSUMABLE=OK');
```

## workspace 連結（Trap 4 回退，pnpm 被 uuid ENOENT 擋住時）
```bash
cd /c/Project/esggo
mkdir -p node_modules/@esggo
ln -s ../../libs/incremental node_modules/@esggo/incremental   # 相對路徑！
node -e "import('@esggo/incremental').then(m=>console.log('symlink keys',Object.keys(m).length))"
```
絕對 MSYS 路徑 `/c/Project/...` 會被原生 node 誤譯成 `C:\c\...` → 失敗。

## 不要捕捉的（環境噪音）
`pnpm install` 崩在 `uuid@14.0.1 ENOENT` 是 node_modules 預存損壞，與本變更無關
（lockfile 解析被跳過、報錯前已印 `Lockfile is up to date`）。不要寫「pnpm install 壞了」，
只記手動 symlink 回退法。
