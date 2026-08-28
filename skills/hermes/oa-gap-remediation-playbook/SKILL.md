---
name: oa-gap-remediation-playbook
category: software-development
version: "1.0"
author: OA-Team 30 蜂群
license: AGPL-3.0
description: 文檔缺口補齊與驗證閉環技法。修補枚舉矩陣、跨組配對、撰寫 verify 腳本時載入。
metadata:
  hermes:
    tags: [oa-team, soul, gap-remediation, verification, 5t, matrix, esggo]
    related_skills: [oa-team-soul-canon, oa-team-swarm, esggo-oa-team-swarm, oa-canon-compile-playbook]
---

# OA-Team 缺口補齊與驗證閉環技法手冊

> 本書由 OA-Team 30 蜂群 `oa-team-soul-canon` §四「缺口補齊」五輪實證提煉。
> 核心鐵律：**文檔聲稱不得以文字自證，任何枚舉矩陣必須配套可重複驗證腳本（EXIT=0 方得宣稱通過）。**

## When to use

- 修補 soul.md / 聖典 / 規格書的「跨組配對 / 陣列歸屬 / KPI / 角色映射」等枚舉矩陣缺口
- 把既有的「文檔聲稱」升級為「可重複驗證閉環」
- 發現跨文檔（工作區 soul.md ↔ 技能 canon）一致性斷裂
- 需要為文檔矩陣撰寫 verify_*.py 驗證器

## How to apply（五步閉環）

### 步驟 1：量化基線（先量後補）
先掃描現狀，算出缺口數字，避免盲目補。
- 陣列對覆蓋：N 大陣列兩兩組合 = C(N,2) 對（5 陣列 = 10 對）
- 成員觸達：列舉所有成員，確認每人至少出現 1 次跨組配對
- 編號矛盾：比對矩陣定義章（如 §二 30 矩陣）與配對章的編號/陣列歸屬是否一致

### 步驟 2：MECE 窮盡重構（補齊）
- 每陣列對採 1:1 職能映射 × 固定組數（如 6 組）= 基礎配對
- 疊加樞紐配對（如守衛組防護樞紐 6 + 蜂后總控樞紐 6）
- 結論數字須可驗：基礎 + 樞紐 = 總數，成員觸達 30/30，陣列對 10/10，零越界

### 步驟 3：命名矛盾清零
- 掃描全文，修正錯置職稱（如「探險蜂(22-26)」應回歸 §二 矩陣：22-24 營銷組、25-26 守衛組）
- 職級階梯名（如成長路徑）若與正式職稱同詞，改中性詞（探險蜂→歷練蜂）避免混淆
- 同步更新所有引用該數字/名稱的章節（如 §8.1 修正清單）

### 步驟 4：驗證閉環化（關鍵）
- 寫 `scripts/verify_*.py`：單一真相源 = 矩陣定義章的編號歸屬表，不讀敘述
- 正則必寬鬆雙軌：嚴格型抓 `編號 × 編號`，寬鬆型抓 `編號 × 全陣列 / 陣列+陣列`
- 斷言：陣列對覆蓋數、成員觸達數、零越界、退出碼 0/1
- 建立 `scripts/verify_all.sh` 三閘合一入口（聖典結構 / 矩陣缺口 / crew 結構）
- **實測 EXIT=0 才算完成**，否則回去修文檔或修腳本

### 步驟 5：跨文檔對齊 + 技法固化
- 工作區 soul.md（蜂王體系）與技能 canon（蜂后體系）是平行同源文檔，陣列一一對應
- 在兩側都補「對齊聲明」章節，標註阻塞項（如 paste 不可讀）為已知阻塞，不冒充
- 把反覆踩坑的可複用程序固化為 `references/doc-matrix-verification.md` 或獨立技能書

## Pitfalls（已實證，必避）

1. **正則格式混用漏算**：僅認 `編號×編號` 會漏 `編號×全陣列` → 用寬鬆正則 `(\d{2})\s+(\S+?)\s+×\s+(.+?)\s+→` 抓 §4.1.5 型，再依左側編號所屬陣列過濾。
2. **欄位解包錯配**：寬鬆正則回 3 欄（a, name, right），嚴格回 4 欄（a, na, b, nb），不可混用 `for a,na,b,nb`。
3. **重複函數定義**：`extract()` 定義兩次會靜默覆蓋，導致前者失效。
4. **Windows git-bash 路徑雙重轉換**：`cd "$(dirname "$0")/.."` 與 `readlink -f` 都會觸發 `/c/` 轉換成 `C:\c\Users\...` 找不到檔。解法：bash 入口硬編碼 Hermes 技能原生 `C:/...` 路徑，或改用 `execute_code` 的 Python `pathlib` 直讀。
5. **JSONC 註解**：驗證 `.jsonc` 前先剝離 `//` 註解行（`line[:line.find("//")]`）。
6. **squad 正則盲點**：`squad: (\\w+)` 抓不到 `"squad": "strategy"`，改用 `\\\"squad\\\":\\s*\\\"(\\w+)\\\"`。
7. **Node.js ESM on Windows 路徑雙重轉換**：`node -e` / `node scripts/*.mjs` 在 Windows Git-Bash 下，`import.meta.url` 經 `new URL().pathname` 會產生 `file:///C:/...`，進而被 Git-Bash 的 MSYS 路徑轉換雙重轉換為 `C:\\C:\\Project\\...` 導致 ENOENT。**解法**：在 `.mjs` 檔頭用 `import { fileURLToPath } from 'node:url'` 取代 `new URL(import.meta.url).pathname`，例如 `const __dirname = path.dirname(fileURLToPath(import.meta.url))`。這是 ESM + Windows + MSYS 三重坑的標準逃脫。
8. **TypeScript 巢狀物件 regex 擷取**: 從 TS `FLOAT_CANONICAL: { breakpoints: { mobile: { min, max }, ... } } = { ... }` 擷取陣列 key 時，`breakpoints:\s*\{([\s\S]*?)\s*\},` 這個 non-greedy regex 會提早停止在第一個內嵌 `},` (例如 `mobile: { min: 0, max: 600 },`)，漏掉 `tablet, desktop, ultrawide`。**解法**：(a) 用貪婪配到第二個 `},` 再過濾，或 (b) 在 regex 擷取後用 `key: {` 的 pattern 過濾已知結構，或 (c) 改為手動解析嵌套物件 (建議: 用 TypeScript AST 解析器如 `ts-morph` 而非 regex)。

## Verification（交付前必跑）

```bash
cd C:/Users/dingj/AppData/Local/hermes/skills/autonomous-ai-agents/oa-team-soul-canon
bash scripts/verify_all.sh
# 預期：結果：通過 3 / 失敗 0 + EXIT=0
```

- 若 EXIT≠0：讀錯誤輸出，區分「文檔錯」還是「腳本錯」——文檔錯改 SKILL.md，腳本錯改 verify_*.py，勿互掩。
- 跨文檔：確認工作區 §對齊聲明存在、阻塞項標註精準。

## 相關技能

- `oa-team-soul-canon`：靈魂核心聕典本體（§四 缺口補齊為本書實戰場）
- `oa-team-swarm` / `esggo-oa-team-swarm`：蜂群運維/部署
- `oa-canon-compile-playbook`：聖典編譯與三層落檔
- `references/float-matrix-verification.md`：本回合浮窗矩陣驗證腳本實戰 (BREAKPOINT_NAMES 對應, 19 CSS 變數完整性, ESM Windows 路徑陷阱)
