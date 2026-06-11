---
uuid: "f456e552-eb9f-4c42-9f05-cd1617db83b7"
version: "1.0.0"
timestamp: "2026-06-04T10:36:23.475Z"
evidence: "docs\wiki\Data-Sources.md"
---
# 數據來源 [Data Sources]
路徑： /data-sources | 權限： ADMIN, IT_OPS | 所屬旅程： I. 初始導入與配置

1. 模組定位 (Core Purpose)
數據來源模組是 ESG GO 的「資料攝取中樞 (Data Hub)」。它負責對接企業內部異質資料庫（如 SAP, ERP, BEMS），執行資料清洗與映射，並確保每一筆流入系統的原始數據皆具備密碼學級的「誠信指紋」。

2. 客戶旅程與 UX 體驗 (Customer Journey & UX)
目標對象與痛點： IT 運運維人員面臨 ERP 數據格式不一、手動匯入易出錯且難以追溯源頭的困難。
體驗高光時刻 (Aha Moment)： 當使用者點擊「套用 ESG 模板」後，系統自動在 OmniTable 中生成符合 GRI 標準的資料表結構，並在測試同步後即時顯示「Hash 封印完成」，感受到資料治理的自動化與嚴謹。
操作軌跡：
1. 進入數據來源頁，透過左側導航器選擇 Workspace。
2. 瀏覽或篩選現有的 Datasheets。
3. 使用「ESG Template」快速建立符合法規要求的資料表。
4. 執行數據增刪改查，並監控同步狀態。
5. 點擊「Open OmniTable」進行高階視圖管理。

3. UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
**設計系統： InfoOne v8.1.0 (Light Mode Priority)**
桌面版佈局： 「左導航 + 右視圖」雙欄佈局。左側為 Workspace 導航器，右側為資料表格或欄位定義。
視覺風格： 極簡淺色系 (`bg-slate-50`)。表格視圖採用 `bg-white` 搭配細膩邊框與毛玻璃標頭。
核心元件： `OmniBaseCard` (用於導航與容器), `ui/Badge` (標示狀態), `ui/Button` (操作觸發)。
行動端適配 (RWD)： 左導航器在小螢幕下收合為抽屜，表格轉化為可橫向捲動的寬視圖。

4. 核心邏輯與 5T 協定 (Logic & 5T Protocol)
資料流向： OmniTable API -> 資料映射引擎 -> 5T 誠信封印 -> 寫入 `report_data_lake`。
5T 實踐點：
*   [T1 真 Truthful - Traceable]：每一筆 Record 皆自動附帶 `source_origin` (OmniTable UUID)。
*   [T2 善 Thankful - Transparent]：資料欄位類型與主鍵 (Primary Key) 全程透明展示。
*   [T3 美 Tasteful - Tangible]：透過資料加載時的 `Loader2` 動態與微互動提升感知。
*   [T4 信 Trustful - Trustworthy]：整合 `verifyHashLock` 確保同步後的資料未被篡改。

5. 功能項目解說和使用技術 (Features & Tech Stack)
Workspace Navigator： 實時串接 OmniTable Space API。
ESG Template Picker： 預設多種 GRI/ISSB 表格模板，加速 Onboarding。
Data Viewer： 實作分頁加載 (Page-based loading) 與即時搜尋篩選。
Record Editor： 彈窗式編輯器，支援原子化欄位更新。

6. 品質達標與驗收紅線 (QA Red Lines)
🚨 UI 跑版紅線： 表格欄位過多時不可撐破容器，必須提供橫向滾動。
🚨 邏輯紅線： 切換 Space 時必須正確重置 Datasheet 選擇狀態，不可載入跨 Workspace 的資料。

7. 矩陣關聯 (Matrix Connection)
上游數據： OmniTable AI 雲端空間。
下游影響： 為 `/environmental`, `/social` 提供底層數據支持。
依賴組件： `OmniBaseCard`, `ui/Badge`, `ui/Button`, `RecordEditor`.
