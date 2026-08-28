---
name: oa-gap-matrix-terminal-origin
category: software-development
version: 1.3.0
author: OA-Team
license: MIT
description: Use when building OA-Team 缺口補齊終始矩陣 (TS 雙向同步 + 5T verify 閘).
metadata:
  hermes:
    tags: [oa-team, 終始矩陣, typescript, 雙向同步, 5t, gap-remediation]
    related_skills: [esggo-ts-sync-merge, esggo-ts-matrix-onboard, oa-team-soul-canon]
---

# OA-Team 缺口補齊 · 終始矩陣 (Terminal-Origin Matrix)

## 何時使用
- 把 soul.md §4「缺口補齊」轉成可驗證 TypeScript 契約（單一真相源派生配對，杜絕手寫枚舉漂移）。
- 需要「全域全端全量全面 / 繁中+英文 / 雙向同步」的 OA-Team 領域型別矩陣。
- 子應用併入 monorepo 前，確認 shared 型別契約與 consumer 生成檔同步。

## 已驗證拓撲（2026-08-26）
```
canonical   = esggo/shared/types.ts        (終: 型別一次定義)
generator   = scripts/export-shared-types.js (map → DEST=cwd/types/generated/esggo-shared.d.ts)
roster/derive = shared/gap-matrix.ts        (單一真相源: 名冊(30)+陣列對(10)+樞紐規則 → 派生 72)
verify gate = scripts/verify_gap_matrix.ts  (5T 實證: 任一違反 exit 1)
consumers   = types/generated/ + apps/*/types/generated/esggo-shared.d.ts (始: 僅消費)
CI job      = .github/workflows/ci.yml → job `gap-matrix`
npm script  = pnpm verify:gap-matrix
unified gate = scripts/verify-terminal-origin.mjs (併入多矩陣: 缺口補齊 72 + OmniLive Float 5柱)
npm script  = pnpm verify:matrix
CI job      = .github/workflows/ci.yml → job `terminal-origin`


## 數理不變式（深貫廣通無礙圓通）
- 5 陣列 MECE: strategy / technology / creative / marketing / guard
- 陣列對 C(5,2) = **10**（兩兩窮盡）
- 基礎配對 = 10 × 6 = **60**（每陣列對內 6 條跨組 1:1，編號 1–30 不越界、不重複同陣列）
- 樞紐配對 = **12**（守衛防護 6：27/30×全陣列, 25/26/28/29×子集 + 蜂后總控 6：01/07/12/17/22/27）
- 全量 = 60 + 12 = **72**；觸達 **30/30**（無孤島成員）
- 每配對帶 `source_origin: 'gap-matrix-canon'`（5T Traceable）

## Step 1：擴充 canonical 契約
在 `shared/types.ts` 末尾追加（終）：
```ts
export type GapUnitKey = 'strategy' | 'technology' | 'creative' | 'marketing' | 'guard';
export type GapRole = 'base' | 'hub';
export type GapHubKind = 'guard-defense' | 'queen-command';
export interface IGapAgent { id: number; title: string; titleEn: string; unit: GapUnitKey; }
export interface IGapPairing { a: number; b: number; aUnit: GapUnitKey; bUnit: GapUnitKey; role: GapRole; hubKind?: GapHubKind; coverage?: GapUnitKey[]; source_origin: 'gap-matrix-canon'; }
export interface IGapMatrixCoverage { totalAgents: 30; totalBase: 60; totalHub: 12; totalPairings: 72; arrayPairs: 10; reach: '30/30'; }
```

## Step 2：單一真相源（杜絕枚舉漂移）
`shared/gap-matrix.ts` 只手寫：
- `GAP_AGENTS`: 30 員 `IGapAgent[]`（title 繁中 + titleEn 英文 + unit 陣列）
- `UNIT_PAIRS`: `C(5,2)` 組合（硬編 10 對）
- 派生函式：`deriveBasePairings()`（UNIT_PAIRS × 6 跨組 1:1）、`deriveHubPairings()`（guardHubs + queenHubs 規則）、`deriveAllPairings()`（60+12）、`deriveNamedExemplars()`（§4.1 具名配對由名冊 title 解析，不盲從 canon 漂移標頭）
- 關鍵：具名配對以 `byTitle` Map 解析 (a,b) 編號 → 5T 誠實（名冊單位優先於 §4.1 標頭）

## Step 3：雙向同步（終→始）
`scripts/export-shared-types.js` 的 `map` 陣列加入新契約名（如 `['GapUnitKey','type']`、`['IGapAgent','interface']`…）。
再生：`node scripts/export-shared-types.js`（根）+ 各 consumer `cd apps/<x> && node ../../scripts/export-shared-types.js`。

## Step 4：5T 實證閘（不可宣稱通過）
`scripts/verify_gap_matrix.ts` 9–10 項斷言（失敗 `process.exit(1)`）：
成員 30 / 陣列對 10 / 基礎 60 / 樞紐 12 / 全量 72 / 觸達 30·30 / 無孤島 / source_origin / 基礎 MECE / §4.1 具名 15 對跨陣列。

## Step 5：CI + npm 腳本
- `package.json` 加 `"verify:gap-matrix": "node scripts/export-shared-types.js && npx tsx scripts/verify_gap_matrix.ts"`
- `.github/workflows/ci.yml` 加 `gap-matrix` job：checkout → pnpm/action-setup → `pnpm install --frozen-lockfile` → `node scripts/export-shared-types.js` → `npx tsx scripts/verify_gap_matrix.ts`

## Step 6：多終始矩陣併入統一閘（多子應用複用）
當 monorepo 出現第二套以上終始矩陣（例: 缺口補齊 gap + OmniLive Float float），不要各自獨立 verify job，
應併入同一套 5T 守門，避免「部分綠燈就宣稱矩陣健康」的幻覺。

新增 `scripts/verify-terminal-origin.mjs`（純 node，無 TS 依賴，串接各子閘）：
```js
import { spawnSync } from 'node:child_process';
function runGate(name, cmd, args, cwd) {
  const r = spawnSync(cmd, args, { cwd, encoding: 'utf-8' });
  if (r.stdout) process.stdout.write(r.stdout);
  if (r.stderr) process.stderr.write(r.stderr);
  const ok = r.status === 0;
  console.log(`${ok ? '✓' : '✗'} ${name} ${ok ? 'PASS' : 'FAIL'} (exit=${r.status})`);
  return ok;
}
const gapOk = runGate('缺口補齊 終始矩陣', 'npx', ['tsx', 'scripts/verify_gap_matrix.ts'], root);
const floatOk = runGate('OmniLive Float 終始矩陣', 'node', ['scripts/verify-float-matrix.mjs'], path.join(root, 'apps/universal-translator'));
process.exit(gapOk && floatOk ? 0 : 1); // 任一失敗 → 統一閘 exit 1
```
註冊：`package.json` 加 `"verify:matrix": "node scripts/verify-terminal-origin.mjs"`；
CI 把 `gap-matrix` job 升級為 `terminal-origin`，最後一步跑 `node scripts/verify-terminal-origin.mjs`。

關鍵不變式：統一閘本身不重算數學，只聚合子閘 exit code → 任一子矩陣紅燈即整體紅燈（5T 不可篡改）。
日後加第三套（如 learning-center / oa-swarm）只需在 mjs 多 `runGate(...)` 一行 + 該子應用自有 verify 腳本。

## Step 7：三套矩陣併閘實戰（本專案已落地，2026-08-26）
終始矩陣統一閘最終涵蓋三路，任一紅燈即整體紅燈：
1. **缺口補齊 (gap)**：`scripts/verify_gap_matrix.ts`（tsx）— 72 不變式
2. **OmniLive Float (float)**：`apps/universal-translator/scripts/verify-float-matrix.mjs` — 5 柱 RWD
3. **Learning-Center (lc)**：`apps/learning-center/scripts/verify-matrix.mjs` — consumer 端閘

關鍵 scope 教訓（踩過）：**lc 的 consumer `.d.ts` 只含缺口補齊契約（IGap*），不含 Float 契約**——
Float 是 universal-translator 的 canonical，不進 `export-shared-types.js` 的 map，故不分發給 lc。
因此 lc 閘只斷言「它實際消費的缺口補齊 6 契約 + 重放根層 72 不變式」，切勿把 Float 契約（FloatEndBeginMatrix 等）也列進斷言，否則必紅燈。
統一閘 `verify-terminal-origin.mjs`：`allPass = gapOk && floatOk && lcOk`，純聚合子閘 exit code。

## Pitfalls（真實踩坑，續）
- **分支異常**：`git stash pop` 後 cwd 可能停留在非 main 分支（如 feature/beautiful-float-window），
  導致後續 commit 落錯分支。對策：每次 commit 前 `git branch --show-current` 確認在 main；落錯就用 `git cherry-pick <sha>`
  到 main 再 push，原 stray 分支不動。
- **統一閘勿重算**：mjs 只聚合子閘 exit code，不要自己複製 72/10/30 斷言，否則兩處真相源會漂移。

## Step 7：第三套矩陣併閘 + 環境異常處理（實戰補遺）
新增 consumer 自有閘時（例 learning-center），該 consumer 只消費它實際同步到的契約集合：
- learning-center 的 `.d.ts` 來自根層 `export-shared-types.js` map → 只含缺口補齊契約（IGap*），**不含** Float 契約（Float 是 ut app-local canonical，不經根生成器分發）。
- 故 consumer 閘斷言只能驗「該 consumer 實際消費的契約」+ 重放根層 72 不變式，不可多驗 Float 契約（否則假紅燈）。
- 統一閘 `verify-terminal-origin.mjs` 加 `runGate('Learning-Center …', 'node', ['scripts/verify-matrix.mjs'], path.join(root,'apps/learning-center'))` 一行即併入第三路。

### 環境異常（git index 鎖 / stash 失敗）
- 症狀：`git stash` 報 `could not write index`、舊 stash 堆積、rebase 被 unstaged 改動擋住。
- 此時**勿強行 `git stash` / `git rebase`**：index 異常 + 多他人 WIP 下強行操作會吞掉別人工作。
- 對策：(1) 只 `git add` 本輪檔案後 `git commit`（本地 main，不 push）；(2) push 需 rebase 對齊 origin/main，留待 index 解鎖、環境安全後由使用者確認再執行。
- MSYS 陷阱：`>nul` 重定向在 git-bash 會誤生成名為 `nul` 的空檔 → 用完 `rm -f nul` 清掉。

- **MSYS `>nul` 誤生空檔**：在 Git-Bash/MSYS 用 `>nul` 重定向會真的建立一個名為 `nul` 的檔案（非 /dev/null）。對策：一律用 `>/dev/null 2>&1`；若已誤生 `nul` 立即 `rm -f nul` 清掉，免得被當成未追蹤檔帶進 commit。
- **閘 exit code 誤判**：抓驗證閘退出碼時，勿在 `$?` 前接 `| tail` / `| head`（抓到的是 pager 退出碼，非閘本身），也不要依賴無 TTY 環境下 `npx tsx` 子程序的 stderr 警告來判斷。對策：`node x.mjs >/dev/null 2>&1; echo $?` 直抓，或乾脆直跑看最後一行 `EXIT=0`。
- **git index 損壞 + 堆疊 stash**：工作樹有他人 WIP 且 `git stash` 報 "could not write index"、舊 stash 已堆多個（wip-log / wip-junk…）時，勿強行 `git rebase` / `git push`（會吞他人工作或卡死）。對策：先只 `git add` 本輪檔 commit（不含他人 WIP），暫緩 rebase/push，向使用者報告環境異常待其確認後再處理。

```bash
# 型別閘 (直跑, 避開 pnpm 長 postinstall)
npx tsc --noEmit --strict --skipLibCheck --target ES2017 --module esnext --moduleResolution bundler --isolatedModules --moduleDetection force shared/types.ts shared/gap-matrix.ts scripts/verify_gap_matrix.ts
# 5T 實證
node scripts/export-shared-types.js && npx tsx scripts/verify_gap_matrix.ts
```

## Pitfalls（真實踩坑）
- **pnpm run verify:gap-matrix 會卡 120s+**：`pnpm run` 觸發 `postinstall`(prisma generate)+supply-chain 掃描 → 直跑底層命令（`node … && npx tsx …`）即可，CI 也用 `npx tsx` 直跑。
- **readonly 推導型錯 TS4104**：`ReadonlyArray<readonly [number, ReadonlyArray<GapUnitKey>, …]>` 不能指派給 `GapUnitKey[]` → 改 `ReadonlyArray<[number, GapUnitKey[], GapHubKind]>`。
- **web_extract 會吞 TS generics**：要比對 canonical/consumer 一律用 browser raw 抓源，不用 web_extract。
- **只提交本變更**：工作樹常有其他人半成品，commit 時 `git add` 只列本任務檔（shared/gap-matrix.ts、scripts/verify_gap_matrix.ts、shared/types.ts、scripts/export-shared-types.js、3×.d.ts、ci.yml、package.json），勿 `git add -A`。
- **push 屬對外副作用**：自主執行授權下可 push main，但務必先實跑三關全 EXIT=0 再 push。
- **monorepo verify 腳本相對路徑脆弱**：子套件內 verify 腳本解析根層 canonical 時，勿寫 `path.join(ROOT,'..','..','esggo','shared','types.ts')`——依賴「oa-swarm 位於某父目錄下的 esggo/oa-swarm」目錄巧合，搬目錄即 404/找不到檔。對策：直接 `path.resolve(ROOT, '..', 'shared', 'types.ts')`；`ROOT = path.resolve(__dirname,'..')` 已是 `esggo/oa-swarm`，`ROOT/..` 就是 repo 根 `esggo`，再加 `shared/types.ts` 穩健。實戰修復 `oa-swarm/scripts/verify-oa-gap.mjs` 原寫法跑通只是巧合，改 `path.resolve(ROOT,'..','shared','types.ts')` 後復測仍 EXIT=0（更耐搬遷）。

## 5T 對應
- Traceable: 每配對 `source_origin`
- Trackable: derive 函式可重放，CI 每跑重生
- Tangible: 終→始 .d.ts 實體落檔，consumer import 可用
- Transparent: 72/10/30 由名冊程式化派生，非手寫清單
- Trustworthy: verify_gap_matrix.ts 任一違反 exit 1，CI 阻斷

## Step 8：第二大腦知識結點投影 + wikilink 閉合（避免 dangling link）
把矩陣知識吸收進 OA 第二大腦（Obsidian vault）時，新結點若用 `[[Target]]` 互鏈，**目標結點必須同步建立**，否則知識圖譜留下斷鏈。
實戰（2026-08-26）：建 `vault/Agents/context/TypeMatrixUnifiedGate.md` 後，其 `[[GapRemediation]]`/`[[FloatMatrix]]`/`[[OA60Matrix]]` 三者初始不存在 → 必須補三個獨立結點（各含 5T frontmatter + 不變式），並在 `00-Index.md` MOC 補條目。
流程：
1. 寫父結點（如 TypeMatrixUnifiedGate），wikilink 指向子主題。
2. 用 `search_files` 查 `vault/Agents/context/*.md` 確認每個 link 目標是否已存在；不存在就建。
3. 建子結點（GapRemediation / FloatMatrix / OA60Matrix），frontmatter 必含 `source_origin`+`co_authors`+`lifecycle:active`（30 號質控蜂 pre-commit 校驗）。
4. 更新 `00-Index.md` 索引。
5. `npx tsx scripts/sync-types-to-vault.ts`（canonical→vault 鏡像，EXIT=0）+ `node scripts/knowledge-avatar.mjs`（本地孵化；TencentDB 8420 僅 VPS 內網，本機 graceful skip，不假裝已上雲）。
6. commit vault 變動（質控蜂會自動攔 5T）+ push。
關鍵：`.avatar-types.d.ts` / `.avatar-registry.json` 是 gitignored 機讀產物，勿 `-f` 強加。
