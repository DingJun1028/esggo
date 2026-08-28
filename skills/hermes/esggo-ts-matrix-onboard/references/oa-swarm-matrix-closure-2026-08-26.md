# OA-Team 雙蜂戰隊 60 · 終始矩陣閉環實證 (純 TypeScript consumer)

> 日期: 2026-08-26 · 來源: oa-swarm (esggo-learning-center/oa-swarm) 接入 esggo/shared/types.ts
> 雙向 TS 架構終始矩陣 — 純 .ts 專案模式（不同於 universal-translator 的 .mjs + @ts-check 模式）

## 拓撲
```
終 (canonical):  esggo/shared/types.ts          ← OA 領域型別集中定義
生成器:           esggo/scripts/export-shared-types.js → oa-swarm/types/generated/esggo-shared.d.ts
始 (consumer):   oa-swarm/types/generated/esggo-shared.d.ts  ← 僅消費，不可改
守門:             oa-swarm/tsconfig.ut.json (原生 tsc, strict) → npx tsc -p tsconfig.ut.json --noEmit
缺口閉環:         oa-swarm/scripts/verify-oa-gap.mjs (EXIT=0)
型別同步守門:     oa-swarm/scripts/check-oa-types-sync.mjs (block-level, TYPES_IN_SYNC)
```

## OA 領域型別清單 (canonical 新增)
- `HiveSide` (type): 'local' | 'vps'  — 雙蜂側 (蜂王 OA-LOCAL / 蜂后 OA-VPS)
- `ArrayKey` (type): 'sanctum'|'rune'|'wing'|'alchemy'|'audit'  — 五陣列 MECE
- `ISoulAgent` (interface): id/title/tags/array/side/task
- `IComponentCore` (interface): uuid/version/timestamp/evidence (5T 核心契約)
- `ISoulArtifact extends IComponentCore`: + source_origin/lifecycle/hash_lock/author
- `ISwarmTask` (interface): task/source_origin + 選填 array/side
- `SwarmTaskResult` (type): Readonly<ISoulArtifact>
- `IOABMessage` (interface): serviceId/topic/payload/trace?/ts
- `I5TVerification` (interface): 5 布林 + passed

generator `map` 補 9 條 (HiveSide/ArrayKey/ISoulAgent/IComponentCore/ISoulArtifact/ISwarmTask/SwarmTaskResult/IOABMessage/I5TVerification)。

## 純 .ts consumer 對齊模式 (與 .mjs 模式差異)
.mjs 用 `// @ts-check` + JSDoc；.ts 用原生 `implements/extends` + 引用生成檔。

1. **src 檔頭加 reference**：
   ```ts
   /// <reference path="../types/generated/esggo-shared.d.ts" />
   import type { ISoulArtifact } from '../types/generated/esggo-shared.js';
   ```
2. **interface 對齊 canonical（extends，非 implements）**：
   ```ts
   export interface SoulArtifact extends ISoulArtifact { /* 同欄位 */ }
   export interface SoulAgent60 extends ISoulAgent { /* 同欄位 */ }
   ```
   ⚠️ `interface` **不能用 `implements`**（TS1176）。用 `extends` 表達「對齊 canonical 契約」。
   ⚠️ 若 consumer 型別與 canonical 欄位完全重複，`extends` 即足（redundant 但合法，表達契約繼承）。
3. **tsconfig.ut.json**（純 TS 版，不同於 .mjs 的 allowJs+checkJs）：
   ```json
   {
     "compilerOptions": {
       "target": "ES2022", "module": "NodeNext", "moduleResolution": "NodeNext",
       "strict": true, "noEmit": true, "skipLibCheck": true,
       "esModuleInterop": true, "types": ["node"]
     },
     "include": ["src/**/*.ts", "types/generated/esggo-shared.d.ts"]
   }
   ```
4. **package.json 腳本**：
   ```json
   "sync:types": "node C:/Project/esggo/scripts/export-shared-types.js",  // 本機絕對路徑
   "check:types-sync": "node scripts/check-oa-types-sync.mjs",
   "typecheck": "tsc -p tsconfig.ut.json"
   ```
   ⚠️ VPS 部署時 generator 路徑不同（/opt/esggo/scripts），用 scp 直接同步 types/generated 產物，不依賴 package.json 路徑。

## 缺口補齊 verify (oa-gap-remediation-playbook 五步閉環)
`scripts/verify-oa-gap.mjs` 驗證：
1. canonical 含 OA 型別 (grep ISoulAgent/shared/types.ts)
2. consumer 含 OA 型別 (grep types/generated/esggo-shared.d.ts)
3. 五陣列 MECE 配對 = 10/10 (C(5,2))
4. 雙蜂 60 員觸達 (A(' 條目 60/60 + .map 重編 id)
5. 5T 協定 purify + verifyZeroHallucination 存在
→ 全過 EXIT=0

⚠️ 雙蜂 60 員檢查：原始源碼用 `A(...)` 工廠 (id 初始 0) + `.map((a,i)=>({...a,id:i+1}))` 賦值，掃 `id: 數字` 會誤判。正確：數 `A('` 出現次數 + 檢查 `.map((a,i)=>({...a,id:i+1}))` 重編。

## 型別同步守門 (check-oa-types-sync.mjs)
⚠️ **不要用 esggo 根 scripts/check-types-sync.js**（它全文比對 canonical vs 生成檔，但 generator 只匯出 map 中的 block，必然 OUT_OF_SYNC）。
oa-swarm 用**自帶 block-level 守門**：只比對 map 中匯出的 block 是否與生成檔一致。

## 驗收閉環 (本輪實證)
```
cd oa-swarm
node scripts/check-oa-types-sync.mjs   # TYPES_IN_SYNC
node scripts/verify-oa-gap.mjs         # EXIT=0 (缺口補齊閉環通過)
npx tsc -p tsconfig.ut.json --noEmit   # 0 error
npm run build                          # BUILD=0
```
VPS: pull esggo repo (帶入 canonical) → scp 產物 → node scripts/check-oa-types-sync.mjs → TYPES_IN_SYNC → verify EXIT=0 → typecheck 0 → npm run build → pm2 restart oa-swarm → HTTP 200.

## 跨文檔對齊
- 聖典 (soul.md §三/§七) 定義 IComponentCore/PurifiedArtifact/SwarmTask 契約 → canonical 對應 ISoulArtifact/ISwarmTask/SwarmTaskResult
- 雙蜂 60 矩陣 (soul-matrix-60.ts) → canonical ISoulAgent
- 5T 協定 (protocol-5t.ts) → canonical ISoulArtifact + I5TVerification

## OA 影音領域契約 (OmniAutoVideo / MPT)
canonical 新增 `IVideoGenerationTask` + `IVideoGenerationResult`，對齊 MPT `/api/v1/videos` (video_subject/script/source/voice)。
oa-swarm `swarm-core.ts` 對齊：
```ts
import type { IVideoGenerationTask, IVideoGenerationResult } from '../types/generated/esggo-shared.js';
export interface VideoGenerationTask extends IVideoGenerationTask {}
export interface VideoGenerationResult extends IVideoGenerationResult {}
```
generator map 補 2 條 (IVideoGenerationTask/Result)。dashboard.html 5T 驗算卡對齊 `I5TVerification` 契約：
- 從 `/execute` 回傳的 `ISoulArtifact` 推導 5 布林 (source_origin→traceable / lifecycle→trackable / evidence→tangible / hash_lock→trustworthy / verifyZeroHallucination→transparent)
- `render5T(v)` 更新 UI (5 枚 chip on/off + passed 狀態)

## 固化要點 (可複用)
- 純 .ts consumer 用 `extends` 對齊 canonical（非 implements）
- 本機 absolute path / VPS scp 產物 雙軌（避免跨平台路徑坑）
- verify-oa-gap.mjs 五步閉環 EXIT=0 才宣稱完成（覺一）
- 自帶 block-level 同步守門（根 check-types-sync.js 全文比對不適用）
