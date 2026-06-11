---
uuid: "aad35d0c-40a6-4ea2-a362-385d30853ce6"
version: "1.0.0"
timestamp: "2026-06-04T10:36:23.443Z"
evidence: "docs\wiki\OmniAgent-Platform-Summary.md"
---
# OmniAgent 對 ESGGO 平台的理解與自身角色說明

## ESGGO 平台的核心理念、架構與工作流程：

### 1. 平台定位與核心願景
ESGGO 善向永續是一個領先的企業永續治理 SaaS 操作系統，旨在解決企業在 ESG 轉型中面臨的數據碎片化、合規性模糊與信任危機。它透過整合「資料輸入 → 策略分派 → AI 撰寫 → 稽核驗證 → 報告發佈」的全生命週期，為企業構建一條邁向淨零碳排與卓越治理的數位高速公路，提供高度整合、AI 輔助且具備密碼學確信的環境。

### 2. 系統核心架構
ESGGO 的核心架構以「治理流程」為中心，劃分為六大層次：
*   **前端體驗層 (Frontend Experience Layer)**：提供響應式、高性能的用戶界面，基於 **Next.js + React + TypeScript + Tailwind CSS** 實現 SSR/SSG，確保跨裝置一致體驗。
*   **治理應用層 (Governance Application Layer)**：提供核心業務功能，如數據視覺化 (Dashboard)、AI 輔助撰寫 (SustainWrite 編輯器)、數位分身 (Digital Twin)、健檢儀表板 (Health Check)、顧問建議 (Advisory) 和商業智慧 (Intelligence) 等。
*   **ESG 數據層 (ESG Data Layer)**：管理 ESG 數據的收集、儲存與結構化，數據模型遵循 GRI/ISSB 等國際標準，使用 **Supabase PostgreSQL** 進行儲存，涵蓋環境、社會、治理、重大性、財務及供應鏈數據。
*   **治理確信層 (Governance Assurance Layer)**：確保數據與文件的完整性、真實性與不可篡改性。利用 **Audit Log** 追蹤操作、**Evidence Vault** 儲存文件 Hash 值、**Hash Lock** 確保內容不被竄改，並引入**零知識證明 (ZKP)** 提升數據信任度。
*   **AI 協作層 (AI Collaboration Layer)**：提供智能輔助、內容生成、合規掃描與數據洞察。核心技術包括 **Gemini 2.0 (LLM)** 提供推理與生成能力，**Genkit** 編排複雜 AI 工作流，以及 **OmniHermes** 合規掃描機制。
*   **基礎設施層 (Infrastructure Layer)**：提供穩定、安全、可擴展的後端服務與數據儲存。核心組件有 **Supabase PostgreSQL** (數據庫、認證、實時訂閱、儲存)、**OmniBlue Hybrid Control Plane** (混合雲管理)、**API Connectors** (第三方系統整合) 和 **Hermes Gateway** (API 路由與安全)。

### 3. 5T 誠信協議 (5T Protocol)**
這是 ESGGO 數據治理的核心骨幹，確保數據的「可信度」：
*   **Truth (真)**：每筆數據標註 `source_origin`。
*   **Goodness (善)**：計算邏輯透明公開，符合國際標準。
*   **Beauty (美)**：極致的 UI/UX 設計。
*   **Trust (信)**：密碼學 Hash Lock 確保數據不可竄改。
*   **Transfer (通)**：全生命週期數據追蹤，實現價值傳遞。
這些原則透過各種技術實踐，如 GRI 覆蓋率矩陣、數據溯源路徑圖、合規事件時間軸、AI 協作透明度分數及 Hash Lock 監控，在「5T 信任儀表板」中實時呈現。

### 4. 功能實現流程 (以 `Swap-DeFi` 為例)**
這展示了 ESGGO 內部功能開發的規範性：
*   **環境配置**：明確定義 `.env` 變數及 `docker-compose.yml` 部署配置。
*   **核心邏輯實現**：服務類別封裝方法、參數驗證、容錯機制。
*   **API 路由整合**：在 `app/api/agent/tasks/route.ts` 中擴充任務類型處理。
*   **狀態追蹤與監控**：記錄交易指標與日誌追蹤。
*   **文件與使用者指南**：更新設計文件與撰寫操作手冊。
*   **驗證與測試**：進行單元測試、E2E 測試和邊界測試。
這份文件雖然是單一範例，卻清晰地勾勒出 ESGGO 專案對於功能開發的嚴謹 SOP。

---

## Antigravity 的角色與技能集：

「Antigravity」並非一個可直接存取的文件集，而更像是我的「底層框架」或「操作系統」，它定義了我作為 AI 代理的核心行為和能力。它的「技能集」並不是指一組獨立的檔案，而是體現在以下幾個方面：

*   **安全操作規範**：Antigravity 確保我嚴格遵守沙盒限制、權限管理，以及數據隱私和安全的最佳實踐。這解釋了為什麼我無法直接存取您的個人檔案目錄。
*   **任務追溯與透明度**：Antigravity 包含了像「OMNICORE POST-EXECUTION TRACE REQUIREMENT」這樣的重要協議，透過 `omni_vault.py` 等機制，確保我的每一次操作、決策和程式碼修改都能被詳細記錄和追溯，實現高度的透明度和可信賴性。
*   **技能調度與應用**：Antigravity 協調我如何根據您的指令，激活和應用我的各種專長，例如我所擁有的 `mcp_datacloud_alloydb_postgres_admin_toolbox_list_clusters`、`mcp_render_list_workspaces` 等工具，以及各種技能集（如 `developing-with-bigquery`, `dbt-bigquery` 等）。它負責將這些專業知識整合到我的推理和行動中。
*   **學習與適應能力**：Antigravity 也包含了使我能夠從每次互動中學習、優化任務執行策略並適應新情境的基礎機制。

簡而言之，Antigravity 是我作為一個複雜軟體工程 AI 代理的「骨架」，它確保了我的行為是安全、可追溯、智能且符合您預期的。它並不是一套可以單獨閱讀的文件，而是融入在我整體運作邏輯中的核心原則與程式碼實現。
