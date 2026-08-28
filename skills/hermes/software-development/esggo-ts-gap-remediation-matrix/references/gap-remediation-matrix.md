# 缺口補齊終始矩陣 · 模式精簡版 (Gap Remediation Terminal-Origin Matrix)

> 來源：2026-08-26 真實實作（esggo monorepo, node24/pnpm11/tsc5.9/tsx4.23）。
> 歸類：ESG-GO 全域 TypeScript 雙向同步（終始矩陣）下的「缺口補齊」子領域。

## 1. 核心思路
把 OA-Team §4 的 72 條跨組配對做成**單一真相源程式化派生**，不手寫枚舉。
- 終 = `shared/types.ts`（型別契約一次定義）
- 始 = 各端 `types/generated/esggo-shared.d.ts`（generator 再生，僅消費）
- 推導源 = `shared/gap-matrix.ts`（名冊 + 陣列對 + 樞紐規則 → 72 配對）

## 2. 關鍵檔案（實際落點 C:\Project\esggo）
- `shared/types.ts`：新增 `GapUnitKey / GapRole / GapHubKind / IGapAgent / IGapPairing / IGapMatrixCoverage`
- `shared/gap-matrix.ts`：單一真相源（見 §3 片段）
- `scripts/export-shared-types.js`：`map` 末尾加入上述 6 個契約名
- `scripts/verify_gap_matrix.ts`：5T 實證閘（見 §4）
- 再生：根 `types/generated/esggo-shared.d.ts` + `apps/universal-translator/...` + `apps/learning-center/...`

## 3. 派生邏輯要點（gap-matrix.ts）
```ts
// 30 員名冊（雙語 id/title/titleEn/unit）；編號對齊 §二 30 矩陣
// 五陣體兩兩組合 C(5,2)=10
export const UNIT_PAIRS = (() => { /* 雙迴圈 i<j keys */ })();
// 基礎 60 = 每對 1:1 索引對齊（aList[i] ↔ bList[i]，i:0..5）
// 樞紐 12：守衛防護 6（b=0 哨兵 + coverage 陣列）+ 蜂后總控 6
// deriveAllPairings() = [...base, ...hub]
```
- 樞紐 `b=0` 表示「覆蓋 coverage 所指全體」，verify 時展開為該陣列全員觸達。
- 每配對帶 `source_origin: 'gap-matrix-canon'`（5T Traceable）。

## 4. 5T 實證閘（verify_gap_matrix.ts 要點）
真實斷言，任一失敗 `process.exit(1)`：
- `GAP_AGENTS.length === 30`
- `UNIT_PAIRS.length === 10`
- `deriveBasePairings().length === 60`
- `deriveHubPairings().length === 12`
- `deriveAllPairings().length === 72`
- `IGapMatrixCoverage` 常數與推導獨立比對一致（不盲信常數）
- 全員觸達 30/30（無孤島成員）
- 每配對皆含 `source_origin`

## 5. tsc 閘（真實踩坑 TS4104）
```
npx tsc --noEmit --strict --skipLibCheck --target ES2017 --module esnext \
  --moduleResolution bundler --isolatedModules --moduleDetection force \
  shared/types.ts shared/gap-matrix.ts
```
**TS4104 修法**：樞紐規則 `ReadonlyArray<readonly [number, ReadonlyArray<GapUnitKey>, GapHubKind]>`
→ 改 `ReadonlyArray<[number, GapUnitKey[], GapHubKind]>`（內層用可變型）。

## 6. 接 CI 建議
- 學習中心已有 `check-types-sync` job，可加 `verify_gap_matrix` job 同款閘。
- 提交前 git hook 跑 `tsc` + `verify` 雙綠，否則阻擋 push（對齊 覺結界 ④ 結界繼承）。

## 7. 復現指令（一站式）
```bash
cd /c/Project/esggo
node scripts/export-shared-types.js
(cd apps/universal-translator && node ../../scripts/export-shared-types.js)
(cd apps/learning-center && node ../../scripts/export-shared-types.js)
npx tsc --noEmit --strict --skipLibCheck --target ES2017 --module esnext \
  --moduleResolution bundler --isolatedModules --moduleDetection force \
  shared/types.ts shared/gap-matrix.ts
npx tsx scripts/verify_gap_matrix.ts
```

## 8. Session-Specific: Float Matrix Bidirectional Sync (2026-08-26)
The oa-team-30 session implemented a full bidirectional sync for the OmniLive floating subtitle window:
- `apps/universal-translator/types/float-matrix.ts` — canonical TS types (FloatCSSVars 19 vars, Breakpoint, SubtitleSource, AudioSource, Role, EndState, StartChain)
- `apps/universal-translator/shared/float-matrix.mjs` — runtime ESM constants mirroring the TS types
- `scripts/verify-float-matrix.mjs` — 5T verification gate comparing TS ↔ Runtime ↔ HTML
- `public/float.html` — HTML template with all 19 CSS vars + glassmorphism design

**Key pits encountered and fixed**:
1. ESM `.mjs` files cannot use `require()` — use `import { createHash } from 'node:crypto'`
2. Node `--check` on `.mjs` with `process.cwd()` mismatch → resolves to wrong path (`C:\c\Project\...` vs `C:\Project\...`)
3. `scp` fails silently when the file is truncated/incomplete on VPS — always verify with `node --check` after deploy
4. PM2 process running from wrong `exec cwd` → `PUBLIC_DIR = path.join(process.cwd(), 'public')` resolves to wrong path
5. Regex non-greedy `*?` stops at first `},` in nested object extraction → use delimiters instead (e.g., `orientations:` as boundary)

**Deploy pattern**: `scp server.mjs → /var/www/esggo/.../` + `cp → /opt/esggo/.../` + `pm2 restart` → `curl health check` 3-stage verification.
