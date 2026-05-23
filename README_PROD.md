# ESG GO v11.7 雲端部屬與驗收手冊 (Vercel)

本手冊旨在引導技術團隊將 **ESG GO Sovereign Governance OS** 順利部屬至 Vercel 雲端環境，並進行交付前的最終驗收。

## 1. 前置準備
*   **GitHub 倉庫存取權**：確保已連接 `DingJun1028/esggo_original`。
*   **Supabase 專案**：需具備運行中的 Supabase 實例（資料庫與 Auth）。
*   **Google GenAI Key**：需具備有效之 Gemini 2.0 API 存取權限。

## 2. Vercel 部屬流程
1.  在 Vercel 儀表板點擊 **"New Project"**。
2.  導入本倉庫。
3.  **Framework Preset** 選擇 **Next.js**。
4.  **Environment Variables** (關鍵步驟)：請務必從 `.env.example` 複製並填入以下變數：
    *   `NEXT_PUBLIC_SUPABASE_URL`
    *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    *   `SUPABASE_SERVICE_ROLE_KEY` (用於後端管理)
    *   `NEXT_PUBLIC_GEMINI_API_KEY`
    *   `NEXT_PUBLIC_SITE_URL` (填入您的 Vercel 網址，如 `https://esg-go.vercel.app`)
5.  點擊 **Deploy**。

## 3. 系統核心功能驗收 (v11.7)

### A. 三欄式佈局驗收
*   **操作**：在任何標準頁面點擊右側懸浮的 `Layout` 圖示或按下 `Ctrl+B`。
*   **預期結果**：**Workspace Panel** 應從右側滑出，主內容區自動調整寬度。
*   **檢查項**：切換面板內的「對話脈絡」與「執行軌跡」標籤。

### B. 全局 Composer 驗收
*   **操作**：觀察畫面底部中央的指令列。
*   **檢查項**：
    *   **Agent 切換**：點擊左側圖示應可切換「GRI 審核員」或「碳盤查專家」。
    *   **Context Ring**：輸入文字時，右側圓環應有微弱脈搏動畫，並顯示目前的 Token 消耗。

### C. ADK 框架就緒度回報
*   **路徑**：前往 `/ai-platform`。
*   **驗收點**：查看 **"ADK Framework Readiness"** 面板。
*   **預期狀態**：核心調度器、技能註冊庫應顯示為 **100% READY**。

### D. 5T 誠信協議驗收
*   **操作 1 (UI)**：進入 `/vault` (證據金庫) 上傳一份測試 PDF 並點擊 **"Seal_5T"**。
*   **預期結果**：系統應在 2 秒內完成 SHA-256 雜湊鎖定，並顯示為 **Verified**。
*   **操作 2 (CLI 壓力測試)**：在終端機執行 `node cli/omni.mjs audit stress -i 100`。
*   **預期結果**：系統應在 500ms 內完成 100 筆併發封印，吞吐量應大於 200 items/sec。

## 4. 技術規格摘要
*   **Node.js 版本**：v20.x+ (Recommended)
*   **Next.js 版本**：15.0+ (App Router)
*   **設計系統**：v11.7 "Minimalist Extreme" (14px base font, 8px grid)
*   **安全合規**：Dependabot 漏洞已降至最低，關鍵依賴項已鎖定 (Overrides enabled)。

## 5. 緊急排除
*   **Build 失敗**：請檢查 `next.config.ts` 是否有殘留的 `eslint` 設定（v11.7 已移除）。
*   **AI 無回應**：確認 `NEXT_PUBLIC_GEMINI_API_KEY` 已在 Vercel Environment Variables 中正確設置，且無配額限制。

---
**ESG GO 研發團隊 · 2026/05/23**
