# 整合中心 [API Setup]
路徑： /api-setup | 權限： ADMIN, DEV_OPS | 所屬旅程： I. 初始導入與配置

1. 模組定位 (Core Purpose)
提供企業級 API 金鑰管理、Webhook 設定與第三方系統連接器配置，是 ESG GO 實現「數據自動化採集」的核心樞紐，負責將外部異質數據轉化為具備 5T 誠信的系統資產。

2. 客戶旅程與 UX 體驗 (Customer Journey & UX)
目標對象與痛點： IT 管理員或 DevOps 需將企業 ERP/CRM 數據對接到 ESG GO。他們過去常面臨手動同步緩慢、連線狀態不明以及安全性難以管控的痛點。
體驗高光時刻 (Aha Moment)： 當管理員點擊「連線測試」並瞬間看到綠色的 `System_Resonance_Optimal` 狀態點亮，且下方 Webhook 日誌即時噴出資料封裝成功的 Hash 值時，感受到「數據流動是透明且受控的」。
操作軌跡：
1. 進入整合中心，瀏覽當前 API 連接器與 Webhook 的健康度。
2. 配置新的 API Key 或第三方連接器（如 SAP, BEMS）。
3. 執行連線測試，確認 5T 協議層已正確握手。
4. 監控 Webhook 活動日誌，確保自動採集流程無誤。
5. 驗證環境變數 (ENV) 的配置狀態。

3. UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
**設計系統： InfoOne v8.1.0 (Light Mode Priority)**
桌面版佈局： 採用「Bento Grid」混合佈局。主區塊顯示連接器與 Webhook 列表，側邊欄顯示 ENV 狀態與安全性認證。
視覺風格： 極簡淺色系 (`bg-slate-50`)，卡片採用 `bg-white/70` 搭配 `backdrop-blur-xl`。
核心元件： `UniversalCard`, `ui/Button`, `ui/Badge`, `UniversalStatusDot` (具備脈衝動畫)。
行動端適配 (RWD)： 表格列表轉化為堆疊式卡片，隱藏次要 Token 資訊。

4. 核心邏輯與 5T 協定 (Logic & 5T Protocol)
資料流向： 外部 API -> 連接器封裝 -> ZK-Privacy 引擎加密 -> 寫入 `ncbdb_integrations` 表。
5T 實踐點：
*   [T2 善 Thankful - Transparent]：提供 Webhook 發送狀態與 API 請求日誌，過程全透明。
*   [T4 信 Trustful - Trustworthy]：Webhook 簽名驗證與金鑰非對稱加密儲存，確保來源不可篡改。
*   [T5 通 Transferful - Trackable]：所有資料交換行為皆記錄生命週期 Hook。

5. 功能項目解說和使用技術 (Features & Tech Stack)
連接器管理： 實作多種連接器模板（SAP, IoT, HCM）。
Webhook 監控： 使用 Supabase Realtime 實時推送 Event 日誌。
ENV 驗證器： 前端自動檢查關鍵環境變數（如 `NCBDB_TOKEN`）的存續性。

6. 品質達標與驗收紅線 (QA Red Lines)
🚨 UI 跑版紅線： 金鑰代碼區塊 (CodeBlock) 在小螢幕下不可溢出，必須提供橫向滾動或自動隱藏。
🚨 安全紅線： API 金鑰明文僅限生成時顯示一次，其後必須以 Masked 形式呈現。

7. 矩陣關聯 (Matrix Connection)
上游數據： 企業外部 ERP/CRM 系統、IoT 數據源。
下游影響： 直接提供原始數據給 Journey III 的數據採集模組 (`/environmental` 等)。
依賴組件： `UniversalCard`, `ui/Button`, `ui/Badge`, `SwarmMonitor`.
