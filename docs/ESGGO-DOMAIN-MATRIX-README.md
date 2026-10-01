# ESGGO 域層終始矩陣（Domain Matrix）

> 版本：v1.0 · 建立日期：2026-10-01 · 分支：`fix/omnilive-zhtw-translation-and-api-guard`
> 狀態：**守門實測通過**（`node scripts/verify-domain-matrix.mjs --probe` → exit 0）

---

## 1. 這是什麼

把 ESGGO 現存的 **30 個頁面 + 107 條 API 路由**，收斂進 **5 域 × 6 柱 = 30 格**的單一結構。
每一格必須同時說得出三件事 —— 缺一格就只是敘事，不算通過：

| 要素 | 意義 |
|---|---|
| `endState` | 這格的最終狀態（做成什麼、驗收條件是什麼） |
| `startChain` | 從現況走到 endState 的起步鏈（第一步動什麼） |
| `probe` | 可執行的斷言（怎麼證明它真的成了） |

---

## 2. 檔案結構

| 檔案 | 行數 | 角色 |
|---|---|---|
| `src/matrix/index.ts` | 92 | 域註冊表 `DOMAINS` + 30 格扁平視圖 `MATRIX_30` |
| `src/matrix/routes.ts` | 105 | **路由歸屬 canonical**：30 頁逐一歸屬 + 24 條 API 前綴規則 |
| `src/matrix/d1.report.matrix.ts` | 68 | D1 永續報告 × 6 柱 |
| `src/matrix/d2.market.matrix.ts` | 48 | D2 商情中心 × 6 柱 |
| `src/matrix/d3.warroom.matrix.ts` | 48 | D3 ESG 戰情室 × 6 柱 |
| `src/matrix/d4.reading.matrix.ts` | 48 | D4 永續閱覽室 × 6 柱 |
| `src/matrix/d5.daily.matrix.ts` | 48 | D5 每日 ESGGO × 6 柱 |
| `scripts/domain-canonical.dump.ts` | 15 | canonical JSON dump（給守門解析用） |
| `scripts/verify-domain-matrix.mjs` | 299 | **守門**：E6 零孤兒 + 30 格完整性 |

### 為什麼要有 `domain-canonical.dump.ts`

`verify-domain-matrix.mjs` 以 `spawnSync` 呼叫時，Windows shell 會吃掉 `tsx -e` 的引號，
導致 `Transform failed`。改以獨立檔案呼叫，零引號傳遞 —— 這是 Windows 專屬坑。

另外：RegExp 無法 JSON 序列化（會變 `{}`），所以 dump 為 `pattern.source` 字串，
由守門端 rehydrate。**否則 `new RegExp(undefined)` 會匹配一切，全部誤判成 D1。**

---

## 3. 五大域

| 域 | 名稱 | 產物形態 | 凍結 | 歸屬數 |
|---|---|---|---|---|
| D1 | 永續報告 | 對外正式文件 | ✅ 需 Hash Lock | 26 |
| D2 | 商情中心 | 外部情報 | ❌ 情報具時效性，每分鐘變動，凍結會使 hash 失效 | 16 |
| D3 | ESG 戰情室 | 內部儀表狀態 | ❌ 瞬時狀態投影，非事實記錄 | 25 |
| D4 | 永續閱覽室 | 知識累積 | ✅ 需 Hash Lock | 22 |
| D5 | 每日 ESGGO | 每日觀察 | ❌ 每日重寫，歷史以 append-only archive 保留 | 15 |
| P0 | 平台層 | 導覽/登入/代理基礎設施 | — | 33 |

> **MECE 基準**：域的劃分依「產物形態」而非功能名稱 —— 這是互斥性的判準。
> 同一份資料在不同域只會出現一次；`frozen=false` 的域**必須**寫出理由（`frozenReason` 不得留空）。

---

## 4. 跑守門

```bash
cd C:/Project/esggo
node scripts/verify-domain-matrix.mjs            # 結構檢查
node scripts/verify-domain-matrix.mjs --probe    # 完整 5T（含探針實跑）
```

### 實測輸出（2026-10-01）

```
✓ P1 頁面歸屬窮盡 (30 頁) — 全部命中
✓ P1 API 歸屬窮盡 (107 路由) — 全部命中
✓ P2 路由歸屬互斥 — 無重複宣告
▲ P2b 陰影偵測 — 死碼 18 個已登記；新增回歸 0，已修復 0
✓ P3 30 格完整性 (5 域 × 6 柱) — 30/30 格三要素齊備
✓ P4 探針實跑 (1 檔案存在性斷言) — 全數存在

歸屬分布: D1=26  D2=16  D3=25  D4=22  D5=15  P0=33
✅ 域層終始矩陣守門通過
```

### 檢查層級

| 層 | 內容 | 不通過代表 |
|---|---|---|
| P1 窮盡 | 每條路由都有域 | 有孤兒路由，結構有漏網 |
| P2 互斥 | 沒有重複宣告 | 同一路由多域，歸屬不唯一 |
| P2b 陰影 | 被遮蔽的 `src/app` 死碼 | 新增死碼未被登記 |
| P3 完整性 | 30 格三要素齊備 | 有格子只是敘事 |
| P4 探針 | 實際斷言檔案存在 | 宣稱與現況脫節 |

---

## 5. 已登記的缺口

這些是**實測發現、尚未收斂**的結構問題，登記在 `routes.ts` 的 `note` 欄位：

| 缺口 | 內容 | 影響 |
|---|---|---|
| **D7** | `sustain-write` 同域雙版本（`/v5` 與 `/c-version`）並存 | D1 內部版本分歧 |
| **D3** | `/omni-center` 與 `/sustain-center` 職責重疊 | 戰情室入口混淆 |
| **D4** | `/resources`、`/learning-center` 待轉為 `/wiki` 分類視圖 | 知識入口分散 |
| **D8** | `src/app/omni-factory/page.tsx` 被 `app/` 遮蔽，屬死碼 | 陰影頁面 |

**P2b 目前登記死碼 18 個，新增回歸 0。** 這些是基線，不是待辦 —— 新增死碼才會讓守門轉紅。

---

## 6. 兩個容易踩的坑

### 6.1 目錄名是 `sonnar`（雙 n），不是 `sonar`

```ts
// ❌ 8 條情報路由全部變孤兒
{ pattern: /^\/api\/sonar\//, domain: 'D2' }

// ✅
{ pattern: /^\/api\/sonnar\//, domain: 'D2' }
```

### 6.2 `/omni-factory` 有兩個同名頁

`app/omni-factory/page.tsx`（活的）與 `src/app/omni-factory/page.tsx`（被遮蔽，死的）。
Next.js 只認 `app/`，所以 `src/app/` 那份永遠不會被路由到。

---

## 7. 相關文件

| 文件 | 內容 |
|---|---|
| `docs/ESGGO-ROUTE-INVENTORY.md` | 30 頁 + 107 路由完整清單（矩陣的 source_origin） |
| `docs/ESGGO-終始矩陣架構規劃書-2026-10-01.md` | 5 域 × 6 柱的架構規劃與缺口分析 |

---

## 8. 5T 對應

| 原則 | 本目錄如何落實 |
|---|---|
| **Traceable** | 每個檔案標 `source_origin`；`routes.ts` 註明為實測 `find` 結果 |
| **Trackable** | 守門可重跑，輸出逐層結果；死碼基線有計數 |
| **Tangible** | 30 格各自有 `probe` 可執行斷言，不止於文字 |
| **Transparent** | 歸屬規則全部外顯在 `API_PREFIX_RULES`，可逐條審視 |
| **Trustworthy** | `frozen` 域對應 Hash Lock；`frozen=false` 強制填 `frozenReason` |

---

## 9. 協作者

萬能蜂后(01) · 萬能架構蜂(09) · 萬能數據蜂(10) · 萬能質控蜂(30)

---

*建立於 2026-10-01 · ESGGO InfoOne Core · 源於實測，非推論*
