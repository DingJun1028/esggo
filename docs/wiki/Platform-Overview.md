---
uuid: "00ed85fb-aaa1-49b9-b951-97b4ac143aae"
version: "1.0.0"
timestamp: "2026-06-04T10:36:23.442Z"
evidence: "docs\wiki\Platform-Overview.md"
---
# 平台總覽 Platform Overview [Platform Overview]
路徑： / | 權限： ALL_USERS | 所屬旅程： 核心概念

1. 模組定位 (Core Purpose)
ESGGO善向永續是一套領先的企業永續治理「SaaS 操作系統 (OS)」。本平台旨在解決企業在 ESG 轉型過程中的數據碎片化、合規黑盒子與信任危機。透過整合「資料輸入 → 策略分派 → AI 撰寫 → 稽核驗證 → 報告發佈」的全生命週期，為企業打造一條邁向淨零碳排與卓越治理的數位高速公路。

2. 客戶旅程與 UX 體驗 (Customer Journey & UX)
目標對象與痛點：
*   **CSO (永續長)**：面對龐雜的國際準則與供應鏈壓力，難以掌握全域進度。
*   **PM (專案經理)**：深陷於催稿、彙整 Excel 與應對稽核的行政泥淖。
*   **各部門填報者**：不理解 ESG 指標，認為填報是額外負擔。
體驗高光時刻 (Aha Moment)：
當使用者登入後，首頁顯示的不是冰冷的表格，而是「5T 誠信指標」的實時脈動，以及 AI 助手自動摘要的「今日治理重點」。那一刻，使用者感受到自己不是在填表，而是在參與一場「真實、透明、受信任」的價值創造。
操作軌跡：
1. **地基建立**：透過 Onboarding 旅程完成企業 Profile 與 API 串接。
2. **意志確立**：執行重大性評估，定義年度治理優先順序。
3. **數據採集**：各部門根據自動生成的任務清單，輸入原始佐證數據。
4. **AI 賦能**：使用 SustainWrite 編輯器，在 AI 協作下將數據轉化為合規文本。
5. **信任刻印**：所有數據點自動掛載 Hash 鎖，進入證據金庫等待審計。
6. **價值發布**：一鍵生成高品質、可追溯的 ESG 報告，對外展現真實影響力。

3. UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
桌面版佈局： 採用 **Sovereign Bento Grid** 佈局。所有核心指標、捷徑與通知皆以網格卡片形式呈現，資訊密度極高且層次分明。
核心液態玻璃元件： Liquid Glass Cyan 系列原子元件，具備 Backdrop Blur (12px) 與細緻邊框。
行動端適配 (RWD)： 採用側邊導航收合機制與底部 Tab 導航。複雜圖表在手機端自動轉化為核心數值卡片，確保在行動裝置上也能掌握治理現況。

4. 核心邏輯與 5T 協定 (Logic & 5T Protocol)
本平台運行的底層邏輯嚴格遵循 **5T 誠信協議**：
*   **Truth (真)**：每一筆進入系統的數據都必須標註 `source_origin`。
*   **Goodness (善)**：所有計算邏輯透明公開，符合國際 ISO 標準。
*   **Beauty (美)**：極致的 UI/UX，讓治理過程具備感知的美感與流暢度。
*   **Trust (信)**：密碼學 Hash Lock 確保數據「不可竄改」。
*   **Transfer (通)**：全生命週期的數據追蹤，讓價值可在供應鏈中傳遞。

5. 功能項目解說和使用技術 (Features & Tech Stack)
*   **前端**：Next.js 15 + TypeScript + Tailwind CSS (Vanilla CSS Priority).
*   **後端**：Supabase (PostgreSQL, Auth, Storage, Edge Functions).
*   **AI**：Gemini 2.0 + Genkit (用於編排複雜的治理工作流).
*   **通信**：Hermes API Gateway + WebSocket Realtime.

6. 品質達標與驗收紅線 (QA Red Lines)
🚨 UI 跑版紅線： Z-index 分層必須絕對正確，彈窗不得被背景遮擋或導致頁面抖動。
🚨 體驗紅線： 首次載入時間必須 < 2s (LCP)，確保極致的 SaaS 響應感。
🚨 數據紅線： 任何未經 5T 驗證的數據不得出現在「確信報告」中。

7. 矩陣關聯 (Matrix Connection)
上游數據： 企業原始治理意志、外部法規環境、供應鏈壓力。
下游影響： 全系統所有模組的基礎路徑與權限控制中心。
依賴組件： AppShell, BrandHeader, BrandSidebar, UniversalCard.
