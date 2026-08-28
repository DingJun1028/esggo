---
name: esggo-ts-gap-remediation-matrix
category: software-development  
description: Build OA-Team gap-remediation as a TS terminal-origin matrix
---

# ESG-GO 缺口補齊終始矩陣 (TypeScript Terminal-Origin Gap Remediation Matrix)

## 何時使用
- 用戶要求把 OA-Team §4「缺口補齊」做成可驗證的 TypeScript 矩陣（雙向同步 / 終始契約）。
- 任何需要「N 單位 × M 成員」的組合配對（如跨組 1:1、樞紐疊加）且要**證明無遺漏**（深貫廣通無礪圓通）。
- 在既有的 esggo 終始矩陣框架（`shared/types.ts` 為終、`types/generated/esggo-shared.d.ts` 為始）內新增一組契約。
- 實作 float.html ↔ TypeScript ↔ Runtime 雙向同步驗證閘 (2026-08-26 更新)

## 核心原則：單一真相源程式化派生（勿手寫枚舉）
手寫 72 行配對表必漂移且無法證明「深貫廣通」。正確做法：
1. 在 `shared/types.ts` 定義型別契約（終）。
2. 在 `shared/<topic>-matrix.ts` 放**名冊 + 陣列對 + 樞紐規則**，用函式派生全部配對。
3. 在 `scripts/export-shared-types.js` 的 `map` 納入新契約 → 重跑再生各端 `.d.ts`（始，雙向同步）。
4. 寫 `scripts/verify_<topic>.ts` 做**真實斷言**，任一違反 `exit 1`（5T Trustworthy 閉環）。

## Step 1：型別契約（終 / canonical）
在 `shared/types.ts` 追加（例見缺口補齊）：
```ts
export type GapUnitKey = 'strategy' | 'technology' | 'creative' | 'marketing' | 'guard';
export type GapRole = 'base' | 'hub';
export type GapHubKind = 'guard-defense' | 'queen-command';
export interface IGapAgent { id: number; title: string; titleEn: string; unit: GapUnitKey; }
export interface IGapPairing { a: number; b: number; aUnit: GapUnitKey; bUnit: GapUnitKey; role: GapRole; hubKind?: GapHubKind; coverage?: GapUnitKey[]; source_origin: 'gap-matrix-canon'; }
export interface IGapMatrixCoverage { totalAgents: 30; totalBase: 60; totalHub: 12; totalPairings: 72; arrayPairs: 10; reach: '30/30'; }
```

## Step 2：單一真相源（派生）
- `GAP_AGENTS`：30 員雙語名冊（編號對齊 §二 30 矩陣），**唯一**成員來源。
- `UNIT_PAIRS`：雙迴圈 i<j 推 C(5,2)=10 對（固定小→大順序，MECE）。
- `deriveBasePairings()`：每對 `aList[i] ↔ bList[i]`（i:0..5）→ 60 條；索引對齊避免越界。
- `deriveHubPairings()`：樞紐 12（守衛防護 6 用 `b=0` 哨兵 + `coverage` 陣列；蜂后總控 6 為具名配對）。
- `deriveAllPairings()` = `[...base, ...hub]`（72）。
- `b=0` 語意：覆蓋 `coverage` 所指全體，非單一成員；verify 時展開為該陣列全員觸達。

## Step 3：雙向同步（始 / consumer）
在 `scripts/export-shared-types.js` 的 `map` 末尾加入新契約名（加 `'interface'`/`'type'` 標記），重跑：
```bash
node scripts/export-shared-types.js
(cd apps/universal-translator && node ../../scripts/export-shared-types.js)
(cd apps/learning-center && node ../../scripts/export-shared-types.js)
```

## Step 4：5T 實證閘（verify_<topic>.ts）
真實斷言，任一失敗 `process.exit(1)`：名冊數=30 / 陣列對=10 / 基礎=60 / 樞紐=12 / 全量=72 / `IGapMatrixCoverage` 常數與推導獨立比對一致 / 全員觸達 30/30 / 每配對含 `source_origin`。

## 型別閘（真實踩坑）
```bash
npx tsc --noEmit --strict --skipLibCheck --target ES2017 --module esnext \
  --moduleResolution bundler --isolatedModules --moduleDetection force \
  shared/types.ts shared/gap-matrix.ts
```
**Pitfall — TS4104 readonly 推導型錯**：樞紐規則若宣告 `ReadonlyArray<readonly [number, ReadonlyArray<GapUnitKey>, GapHubKind]>`，會報 `readonly GapUnitKey[]` 無法指派可變 `GapUnitKey[]`。改為 `ReadonlyArray<[number, GapUnitKey[], GapHubKind]>`（內層用可變型，僅外層 readonly）。

## 雙綠原則
宣稱「通過」前須 `tsc --noEmit` 綠 + `verify_<topic>.ts` 綠 雙關；缺一即視為未過（對齊 覺結界 ④ 結界繼承 / 5T Trustworthy）。

## Verification（一站式復現）
見 `references/gap-remediation-matrix.md`（關鍵片段 + 完整復現指令 + 接 CI 建議）。
另有 `references/float-matrix-verification.md`（2026-08-26 真實實作 — float.html 雙向同步驗證閘）。

## Pitfalls
- 勿手寫配對枚舉表 → 必漂移、無法證明窮盡。
- 勿在 tsc 閘外宣稱通過 → 須 tsc + verify 雙綠。
- 樞紐 `b=0` 哨兵須在 verify 展開為 coverage 全員，否則觸達數算錯。
- 雙語欄位（title/titleEn）為 OA-Team 標準，勿只留單語。
- ESM `.mjs` 文件不可使用 `require()` → 使用 `import { createHash } from 'node:crypto'`
- Node `--check` 使用 `process.cwd()` 時，路徑大小寫不一致會導致 `Cannot find module`
- `scp` 部署後必驗證 `node --check` + `curl health` 三階段驗證
- Regex non-greedy `*?` 會停在第一個 `},` → 用下游關鍵字 (如 `orientations:`) 作為分界

## 與 esggo-ts-sync-merge 的關係
本技能是 `esggo-ts-sync-merge`（用戶自有 / 未納管）之下「缺口補齊終始矩陣」子領域的獨立收納點。該 umbrella 同樣涵蓋終始矩陣雙向同步；若未來 `hermes curator adopt esggo-ts-sync-merge` 將其納管，可把本技能合併回去。