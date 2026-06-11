---
uuid: "cfcd7be7-0fa6-4518-b44f-d1dee6d3fe27"
version: "1.0.0"
timestamp: "2026-06-04T10:36:23.486Z"
evidence: "docs\wiki\Audit-Log.md"
---
# Audit Log Audit Log [Audit Log]
路徑： /audit-log | 權限： ADMIN, CSO | 所屬旅程： VI. 系統管理與合規

1. 模組定位 (Core Purpose)
集中記錄系統內所有關鍵操作與資料變更，提供完整的行為軌跡，確保數據可追溯性與合規性，是內部控制與外部審計的核心依據。

2. 客戶旅程與 UX 體驗 (Customer Journey & UX)
目標對象與痛點： 系統管理員 (ADMIN) 或合規長 (CSO)。他們需要快速定位特定事件的發生時間、操作者與變更內容，以應對內部稽核或外部監管要求，避免因資訊不透明而導致的合規風險。
體驗高光時刻 (Aha Moment)： 當 ADMIN 收到資安警報，需要追查某筆關鍵數據的修改紀錄時，透過 Audit Log 的多維度篩選器，能在 5 秒內精準定位到「某年某月某日某人修改了某個欄位」，並看到修改前後的完整差異，瞬間感受到「一切盡在掌握」的安心感。
操作軌跡：
1. ADMIN 進入 Audit Log 頁面，預設顯示最新 100 筆紀錄。
2. 使用日期區間、操作者、模組類型等篩選器，縮小查詢範圍。
3. 點擊特定事件紀錄，展開查看詳細的變更內容（例如：舊值與新值）。
4. 確認無誤後，可選擇匯出篩選結果作為審計報告附件。

3. UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
桌面版佈局： 採用「頂部篩選器列 (Filter Bar)」與「下方全寬資料表格 (Data Table)」佈局。
核心液態玻璃元件： BrandDataTable (支援分頁、排序、搜尋)、BrandDatePicker (日期區間選擇)、BrandMultiSelect (多選篩選器)、BrandDrawer (事件詳情抽屜)。
行動端適配 (RWD)： < 768px 時，篩選器自動收合至「懸浮篩選按鈕 (FAB)」，點擊後彈出全螢幕篩選 Modal。資料表格轉化為「堆疊式事件卡片 (Stacked Event Cards)」，每張卡片顯示核心資訊，點擊後展開詳細內容。

4. 核心邏輯與 5T 協定 (Logic & 5T Protocol)
資料流向： 所有使用者在系統中的「寫入 (Create, Update, Delete)」操作，以及關鍵的「讀取 (Read)」操作（如敏感數據下載），都會觸發後端服務記錄事件，並寫入 `audit_logs` 資料表。此資料不直接影響 Dashboard KPI，但為其數據可信度提供底層支撐。
5T 實踐點：
[T2 Traceable 追溯]： 每一筆紀錄都包含操作者 ID、時間戳、IP 地址、操作類型 (CRUD)、受影響的模組與資料 ID，確保事件可完整追溯。
[T3 Trackable 追蹤]： 系統自動追蹤所有關鍵操作，並以時間序列方式儲存，形成不可篡改的行為軌跡。
[T4 Transparent 透明]： 授權使用者可透過篩選器與搜尋功能，清晰檢視所有被記錄的系統行為，提升內部透明度。
[T5 Trustworthy 信任]： 每一筆 Audit Log 寫入資料庫後，會自動計算其內容的 SHA-256 Hash 值並儲存。任何後續對 Log 內容的篡改，都會導致 Hash 值不匹配，從而觸發警報，確保 Log 本身的不可否認性。

5. 功能項目解說和使用技術 (Features & Tech Stack)
實時事件記錄與儲存 (Real-time Event Logging & Storage)： 捕獲使用者與系統的互動行為，並以非同步方式寫入資料庫。技術使用後端服務的 AOP (Aspect-Oriented Programming) 攔截器或 Middleware，搭配 Supabase 的 `pg_cron` 擴展進行批次寫入優化。
多維度篩選與全文檢索 (Multi-dimensional Filtering & Full-text Search)： 允許使用者依據時間、操作者、模組、操作類型或關鍵字進行查詢。技術使用 Supabase 的 `PostgREST` 搭配 `fts` (Full-Text Search) 功能，前端則使用 `React Query` 進行高效數據拉取與快取。
事件詳情與差異比對 (Event Details & Diff View)： 點擊紀錄可查看操作前後的資料變更細節。技術使用 `JSONB` 欄位儲存變更內容，前端利用 `react-diff-viewer` 或客製化 UI 呈現差異。
日誌完整性驗證 (Log Integrity Verification)： 系統自動為每筆日誌生成 SHA-256 Hash 值。技術使用 Node.js 的 `crypto` 模組在後端生成 Hash，並在前端提供按鈕觸發 Hash 重新計算與比對，以驗證日誌是否被篡改。

6. 品質達標與驗收紅線 (QA Red Lines)
🚨 UI 跑版紅線： 當事件詳情包含大量 JSON 數據時，抽屜或 Modal 內的內容必須正確換行與滾動，不可溢出容器或導致頁面卡頓。篩選器組合過多時，篩選按鈕與輸入框之間必須保持一致的間距，不可出現重疊或錯位。資料表格在載入大量數據時，分頁器必須正常運作，且頁碼顯示不可跳躍或重複。
🚨 邏輯/體驗紅線： 任何嘗試修改已寫入資料庫的 Audit Log 紀錄，都必須被後端 RLS (Row Level Security) 策略阻擋，並觸發資安警報。當篩選條件為空時，系統必須預設顯示最新紀錄，不可顯示空白頁面或錯誤訊息。在斷網情況下，使用者嘗試執行任何寫入操作時，必須彈出友善的「離線提示」，並在網路恢復後自動重試，而非直接失敗。對於敏感操作（如刪除使用者）， Audit Log 必須記錄操作前後的完整狀態，且該紀錄本身不可被刪除或修改。

7. 矩陣關聯 (Matrix Connection)
上游數據： 來自全系統所有模組的 Action Hooks。
下游影響： 提供審計證據給 `/audit-verify` 與 `/governance`。
依賴組件： BrandDataTable, BrandDatePicker, BrandMultiSelect, BrandDrawer.