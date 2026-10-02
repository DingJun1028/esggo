# journey.ftgesggo.esggo.co 產品功能規格書 · 終始矩陣

> 版本：v1.0 · 建立日期：2026-10-01
> 狀態：**守門實測通過**（`node scripts/verify-journey-matrix.mjs --probe` → exit 0）
> 產品代號：**FTG 永續旅程 App**（`apps/ftg-journey-web` + `apps/ftg-journey-server`）

---

## 1. 這份文件解決什麼問題

官網承諾六大服務，App 宣稱六流循環。若沒有可執行的歸屬結構，
「六流」就只是行銷文案 —— 無法回答「哪個功能屬於哪流」「這功能有人用嗎」「缺口在哪」。

本規格書把 journey 產品現存的 **71 個產物**（11 頁 + 42 API + 18 表）
收斂進 **7 域 × 6 柱 = 42 格**，並用守門腳本持續證明結構沒有腐化。

每一格必須同時說得出三件事 —— 缺一格就只是敘事，不算通過：

| 要素 | 意義 | 長度下限 |
|---|---|---|
| `endState` | 這格在終局世界的狀態（做成什麼） | ≥ 8 字 |
| `startChain` | 從現況走到 endState 的第一步（動什麼） | ≥ 8 字 |
| `probe` | 可執行的斷言（怎麼證明它真的成了） | — |

---

## 2. 檔案結構

| 檔案 | 行數 | 角色 |
|---|---|---|
| `src/matrix/journey/types.ts` | 51 | 六柱定義 + `JourneyCell` 型別 |
| `src/matrix/journey/j0.platform.matrix.ts` | 48 | J0 平台層 × 6 柱 |
| `src/matrix/journey/j1.foundation.matrix.ts` | 50 | J1 基礎流 × 6 柱 |
| `src/matrix/journey/j2.awareness.matrix.ts` | 49 | J2 覺曉流 × 6 柱 |
| `src/matrix/journey/j3.cohesion.matrix.ts` | 49 | J3 凝聚流 × 6 柱 |
| `src/matrix/journey/j4.restoration.matrix.ts` | 49 | J4 復元流 × 6 柱 |
| `src/matrix/journey/j5.mutuality.matrix.ts` | 49 | J5 共好流 × 6 柱 |
| `src/matrix/journey/j6.memorial.matrix.ts` | 49 | J6 留念流 × 6 柱 |
| `src/matrix/journey/index.ts` | 122 | 域註冊表 + 42 格扁平視圖 |
| `src/matrix/journey/routes.ts` | 141 | **產物歸屬 canonical**：71 個產物逐一歸屬 |
| `scripts/journey-canonical.dump.ts` | 23 | canonical JSON dump（給守門解析） |
| `scripts/verify-journey-matrix.mjs` | 267 | **守門**：零孤兒 + 42 格完整性 + API 消費比對 |
| `docs/JOURNEY-PRODUCT-INVENTORY.md` | 機讀產物 | 由 `--inventory` 重產，勿手編 |

### 為什麼要有獨立的 dump 檔

`verify-journey-matrix.mjs` 以 `spawnSync` 呼叫時，Windows shell 會吃掉 `tsx -e` 的引號，
導致 `Transform failed`。改以獨立檔案呼叫，零引號傳遞 —— 這是 Windows 專屬坑，
與主站矩陣 `scripts/domain-canonical.dump.ts` 同源。

---

## 3. 七大域

| 域 | 名稱 | 產物形態 | 凍結 | 產物數 | 官網對照 |
|---|---|---|---|---:|---|
| J0 | 平台層 | 身分驗證與基礎設施 | 免凍結（設定由環境變數承載） | 11 | （官網不描述登入機制） |
| J1 | 基礎流 | 行程主體資料 | 免凍結（completed 後才凍結） | 22 | 企業員工旅遊 |
| J2 | 覺曉流 | 現場任務紀錄 | 免凍結（append-only 原始紀錄） | 10 | ESG 戶外團隊日 |
| J3 | 凝聚流 | 主管共識紀錄 | 免凍結（僅定稿 Roadmap 凍結） | 4 | 高階主管共識營 |
| J4 | 復元流 | 身心狀態量測與追蹤 | 免凍結（需授權保護） | 8 | 員工身心平衡旅程 |
| J5 | 共好流 | 家庭共學紀錄 | 免凍結（敏感資料需下架留紀錄） | 11 | 企業家庭日 |
| J6 | 留念流 | 對外影響報告 | ✅ **需 Hash Lock** | 5 | ESG Impact Note |

> **MECE 基準**：域的劃分依「產物形態」而非功能名稱 —— 這是互斥性的判準。
> 同一份資料在不同域只出現一次；`frozen=false` 的域**必須**寫出理由（`frozenReason` 不得留空，守門會驗）。
> 只有 J6 需凍結：它是**對外揭露**的數字來源，竄改即誠信危機。

### 歸屬分布（實測）

```
J0=11  J1=22  J2=10  J3=4  J4=8  J5=11  J6=5   合計 71
```

---

## 4. 跑守門

```bash
cd C:/Project/esggo
node scripts/verify-journey-matrix.mjs            # 結構檢查
node scripts/verify-journey-matrix.mjs --probe    # 完整 5T（含探針實跑）
node scripts/verify-journey-matrix.mjs --inventory # 重產 docs/JOURNEY-PRODUCT-INVENTORY.md
```

### 實測輸出（2026-10-01）

```
✓ P1 頁面歸屬窮盡 (11 路由) — 全部命中
✓ P1 API 歸屬窮盡 (42 端點) — 全部命中
✓ P1 資料表歸屬窮盡 (18 表) — 全部命中
✓ P2 產物歸屬互斥 — 無重複宣告
✓ P3 42 格完整性 (7 域 × 6 柱) — 42/42 格三要素齊備
✓ P4 探針實跑 (40 檔案存在性斷言) — 全數存在
▲ P5 API 消費比對 — 前端呼叫 20 種路徑｜後端端點 42｜前端未直接呼叫 7 條

歸屬分布: J0=11  J1=22  J2=10  J3=4  J4=8  J5=11  J6=5
✅ journey 產品功能終始矩陣守門通過 — 42 格 + 零孤兒 + 歸屬互斥
```

### 檢查層級

| 層 | 內容 | 不通過代表 |
|---|---|---|
| P1 窮盡 | 每個產物都有域 | 有孤兒產物，結構有漏網 |
| P2 互斥 | 沒有重複宣告 | 同一產物多域，歸屬不唯一 |
| P3 完整性 | 42 格三要素齊備 + 官網對照齊備 | 有格子只是敘事 |
| P4 探針 | 實際斷言檔案存在 | 宣稱與現況脫節 |
| P5 消費 | API 有人呼叫嗎 | 端點存在卻是死碼 |

**P5 是本矩陣與主站矩陣的差異**：主站矩陣只驗「路由歸屬」，
但 journey 產品的教訓（見技能書 `ftg-journey-app-architecture`）是
**「API 存在」不代表功能可用**。P5 直接比對前端原始碼的呼叫點。

---

## 5. 六流的起承轉合現況（實測對照）

| 流 | 起 | 承 | 轉 | 合 | 狀態 |
|---|---|---|---|---|---|
| 基礎流 | Dashboard / 旅程 CRUD | Prep / Schedule / Notes | — | Checkin / Summary | 循環完整 |
| 覺曉流 | — | ESG 任務卡（6 類） | 任務提交 → impact 同步 | 勳章授予 | 循環完整 |
| 凝聚流 | — | Executive 工具頁 | 共識儲存 → Roadmap | — | **缺「合」**（無 Roadmap 總覽） |
| 復元流 | — | Wellbeing 六模組 | 診斷量測 | Follow-up 追蹤 | 循環完整（追蹤未實測 E2E） |
| 共好流 | — | FamilyDay 任務卡 | 觀察記錄 → 照片 | 相簿分享 | **照片分發鏈未實測** |
| 留念流 | Impact 數據 | Impact Note 總覽 | GRI/SDG 對應 | PPT 產出 | 前端完成，後端無凍結 |

---

## 6. 已登記的缺口

這些是**實測發現、尚未收斂**的問題：

| 缺口 | 內容 | 影響 | 對應格 |
|---|---|---|---|
| **JG1** | `/*` catch-all 靜默導向 `/` | 使用者打錯網址不會看到 404，誤以為頁面不存在 | J0/memory |
| **JG2** | `/family-day` 與 `/wellbeing` 路由不傳 `journeyId` | 這兩個入口進去必然無資料（API 需要 journey_id） | J4, J5 |
| **JG3** | `POST /api/upload` 歸平台層但實際只被 J5（家庭照片）消費 | 歸屬邊界模糊，待 J5 照片鏈路明確後再議 | J0/circular |
| **JG4** | `POST /api/contact` 無任何前端呼叫者 | 官網聯絡表單可能直打後端或另有實作 | J0 |
| **JG5** | `journeys/:id/members` 4 條端點**前端零呼叫** | 成員管理無 UI，但摘要計算隱含成員數 → 實質缺口 | J1/causality |
| **JG6** | `GET /api/badges`（全部勳章目錄）前端只呼叫 `/api/me/badges` | 使用者看不到「還差多少可解鎖」 | J2/circular |
| ~~**JG7**~~ **已修 2026-10-01** | ~~前端 `JourneyDetail.jsx:33` 有第二份 `ESG_TASKS` 副本~~ | 原欄位較後端多 → **規則雙真實**。現後端補齊 UI 欄位與 `unit`，前端改讀 API 目錄 | J2/memory ✅ |
| **JG8** | J3 凝聚流缺「合」：Roadmap 無總覽頁 | 共識產出無法被組織看見，閉環斷在最後一步 | J3/circular |

**JG7 是最嚴重的一項**：技能書記載 2026-09-30 已把 ESG 任務規則收斂到
`esg-tasks.js` 單一真實，但前端副本仍留在 `JourneyDetail.jsx`。
契約測試 `esg-tasks.test.js` 只驗「後端宣告的 metric 被前端 Impact Note 宣告」，
**沒有驗「前端 ESG_TASKS 與後端目錄一致」** —— 這是守門的盲區。


### 6.1 JG7 修復實錄（2026-10-01，實測）

| 動作 | 檔案 | 驗證 |
|---|---|---|
| 後端補齊 UI 欄位 + 為 6 任務補 `unit` | `apps/ftg-journey-server/esg-tasks.js` | `unit` 是前端任務卡直接渲染的欄位，原本後端沒宣告 → 不補則前端會顯示 `undefined` |
| 刪除前端本地 `ESG_TASKS` 常數（32 行） | `apps/ftg-journey-web/src/pages/JourneyDetail.jsx` | 既有 `esgTasks` state 已由 `GET /esg-tasks` 的 `data.tasks` 填充，直接改用，無需新增 fetch |
| 新增 5 條 P6 斷言 | `apps/ftg-journey-server/esg-tasks.test.js` | `vitest run esg-tasks.test.js` → **43 passed** |

新增的 P6 斷言（缺口一旦復發即失敗）：

1. `JourneyDetail.jsx` 不得再出現 `ESG_TASKS` 符號 —— 掃前先剝除註解，否則修正說明本身會誤觸
2. 前端確實消費 `data.tasks` 與 `updated.tasks`，並以 `esgTasks.map()` 渲染
3. 每個任務都有 `unit`
4. `unit` 與累積值對應的 impact 單位逐項一致（cleanup 件 / carbon kg / biodiversity 種 / local 元 / water L / waste 件）
5. carbon 累積值確實是 kg 碳排：用有排放樣本（汽車 100km）實測確認 kg 列存在，並用零排放樣本（步行 10km）確認**不會**憑空產生 kg 列

第 5 條本身是實測教訓的產物。斷言初版寫成「`rows[0].unit` 必須等於 `task.unit`」，
在步行樣本下 rows 只剩 `distance(km)` → 誤判成單位漂移。
**修法不是放寬門檻，而是改用明確對應表，再用真實樣本證明該表成立。**

前端建置實測：`node` 直接呼叫 vite `build()` API → `FE_BUILD_OK`（exit 0）。

---

## 7. 三個容易踩的坑

### 7.1 P5 只抓 `${API_BASE}` 會誤判大量端點無人使用

AuthContext 另暴露 `api.get/post/put/del()` 包裝。若掃描器只認 `${API_BASE}` 字面，
`/api/me` 等端點會被誤報為死碼。守門的第一版就踩了這個坑（P5 報 36 條未使用，
實際只有 7 條）。

### 7.2 參數名兩側不對稱會讓 P5 全數失配

前端寫 `/api/journeys/${id}`，後端寫 `/api/journeys/:id`。
比對前必須把 `${...}` 與 `:param` **都**正規化成同一形式，否則 42 條全被判未使用。

### 7.3 `contacts` 表由端點延遲建立，不在啟動 schema 中

`POST /api/contact` 內才 `CREATE TABLE IF NOT EXISTS contacts`。
這是「掃描 CREATE TABLE 必須掃整個檔案、不能只掃啟動區塊」的原因；
若只看啟動區塊會漏一張表，而漏掃會讓 P1 誤以為有孤兒。

---

## 8. 與主站矩陣的關係

| | 主站域層矩陣 | journey 產品矩陣 |
|---|---|---|
| 對象 | ESGGO 主站（Next.js） | journey App（Vite + Express） |
| 規模 | 30 頁 + 107 API | 11 頁 + 42 API + 18 表 |
| 格數 | 5 域 × 6 柱 = 30 | 7 域 × 6 柱 = 42 |
| canonical | `src/matrix/` | `src/matrix/journey/` |
| 守門 | `scripts/verify-domain-matrix.mjs` | `scripts/verify-journey-matrix.mjs` |
| 額外檢查 | P2b 陰影死碼偵測 | **P5 API 消費比對** |

**六柱命名刻意一致**（memory / time / space / causality / immortal / circular），
以便兩條產品線橫向對照；但歸屬對象不同，兩者各自獨立守門，互不影響。

---

## 9. 5T 對應

| 原則 | 本目錄如何落實 |
|---|---|
| **Traceable** | 每檔標 `source_origin`，標明是 `find`/實掃結果而非推論 |
| **Trackable** | 守門可重跑，輸出逐層結果；退出碼即機器可讀結論 |
| **Tangible** | 42 格各有 `probe` 可執行斷言，不止於文字 |
| **Transparent** | 歸屬全部外顯在 `routes.ts`，71 條可逐條審視 |
| **Trustworthy** | `frozen=false` 強制填 `frozenReason`；J6 對外揭露強制需凍結 |

---

## 10. 下一步（依優先序）

| 優先 | 項目 | 依據 | 負責 |
|---|---|---|---|
| P0 | ~~消除 JG7 前端 ESG_TASKS 副本~~ **已完成** | 規則雙真實已修，P6 五條斷言上鎖 | 15, 07 ✅ |
| P0 | 補 JG5 成員管理 UI | 4 條端點死碼，摘要計算已依賴成員數 | 07, 12 |
| P1 | 修 JG2 兩條無 journeyId 路由 | 入口必然無資料 | 07 |
| P1 | 補 J3「合」（Roadmap 總覽） | 閉環斷在最後一步 | 15, 12 |
| P1 | 守門加 P6：前後端 ESG_TASKS 一致性斷言 | 補上 JG7 暴露的盲區 | 11, 30 |
| P2 | 復元流 / 共好流 E2E 實測 | 技能書標記「未驗證」至今未補 | 11 |

---

## 11. 相關文件

| 文件 | 內容 |
|---|---|
| `docs/JOURNEY-PRODUCT-INVENTORY.md` | 71 個產物逐條歸屬 + 42 格全表（機讀產物） |
| `docs/ESGGO-DOMAIN-MATRIX-README.md` | 主站域層矩陣（30 格） |
| `docs/ftg-journey-architecture-matrix.md` | journey 架構矩陣（敘事版，非機讀） |
| `apps/ftg-journey-server/esg-tasks.js` | ESG 規則單一真實（本次矩陣的 source_origin） |

---

## 12. 協作者

萬能蜂后(01) · 萬能架構蜂(09) · 萬能數據蜂(10) · 萬能文案蜂(15) · 萬能質控蜂(30)

---

*建立於 2026-10-01 · ESGGO InfoOne Core · 源於實測，非推論*
