# 數據來源 Data Sources
路徑： /data-sources | 權限： ADMIN, IT_OPS | 所屬旅程： I. 初始導入與配置

1. 模組定位 (Core Purpose)
管理內部資料庫與 ESGGO 平台的資料流動，設定自動同步排程與資料清洗規則。

2. 客戶旅程與 UX 體驗 (Customer Journey & UX)
目標對象與痛點： IT 人員需要串接 ERP 或 BEMS 數據，但資料格式不一。
體驗高光時刻： 設定完映射後，測試同步成功，數據自動匯入環境數據表。

3. UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
桌面版佈局： 連接器列表與狀態監控。

4. 核心邏輯與 5T 協定 (Logic & 5T Protocol)
[T2 Traceable]： 每一筆導入數據都附帶 source_origin。

5. 功能項目解說和使用技術 (Features & Tech Stack)
技術： Supabase Edge Functions, Webhooks, API Connectors.

6. 品質達標與驗收紅線 (QA Red Lines)
🚨 邏輯體驗紅線： 同步失敗必須有明確報警。
