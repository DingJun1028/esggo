---
uuid: "da5aaeb7-f3da-4959-969d-e07f78b02f77"
version: "1.0.0"
timestamp: "2026-06-04T10:36:12.280Z"
evidence: "WIKI_FUNCTION_FLOW.md"
---
## 🛠️ Swap-DeFi-TEST-UMES-ONLINE 功能實現流程

### 1. 環境配置 (Environment Setup)
- **變數定義**：在 `.env.example` 及 `.env.local` 中定義關鍵變數：
  - `SWAP_DEFI_API_KEY`: 交易所 API 金鑰
  - `SWAP_DEFI_TOKEN`: 認證令牌
  - `SWAP_DEFI_ENDPOINT`: API 端點 (`https://test-umes.online/api/v1`)
- **部署配置**：建立 `docker-compose.yml` 實現容器化部署，將前端與後端服務及環境變數統一管理。

### 2. 核心邏輯實現 (Core Implementation)
- **服務類實作**：建立 `SwapDeFiClient` 類別，封裝 `getPoolStatus` (流動池查詢) 與 `executeSwap` (交易執行) 方法。
- **參數驗證**：實作 `validateTransactionParams` 嚴格檢查交易 ID、代幣對、交易金額 (正數) 及錢包地址 (0x 格式)。
- **容錯機制**：實作 fallback 機制，當遠端 API 無回應或失敗時，回傳 `is_mock: true` 確保系統不崩潰。

### 3. API 路由整合 (API Integration)
- **端點擴充**：在 `app/api/agent/tasks/route.ts` 中增加 `swap_defi` 任務類型處理邏輯。
- **任務流程**：
  - 接收 `swap_defi` 請求 $\rightarrow$ 呼叫 `SwapDeFiClient` $\rightarrow$ 執行交易 $\rightarrow$ 回傳結果 $\rightarrow$ 記錄至 `AgentStore`。

### 4. 狀態追蹤與監控 (Tracking & Monitoring)
- **指標記錄**：在 `lib/agent/store.ts` 建立 `SWAP_STATS` 狀態對象，追蹤交易成功/失敗總數。
- **日誌追蹤**：實作 `recordSwapSuccess` 與 `recordSwapFailure` 函數，將交易結果與錯誤訊息實時記錄於後端。

### 5. 文件與使用者指南 (Documentation)
- **設計同步**：更新 `app/tasks/DESIGN.md` 記錄整合邏輯。
- **操作手冊**：撰寫 `docs/SwapDeFi-USER-GUIDE.md` 完整使用者指南 (包含前置條件、API 範例、FAQ 與部署注意事項)。
- **入門嚮導**：在 `README.md` 中增加快速連結，讓開發者能一鍵存取指南。

### 6. 驗證與測試 (Validation)
- **單元測試**：在 `lib/omni-core.test.ts` 撰寫 Swap-DeFi 測試案例。
- **E2E 測試**：驗證從 API 呼叫 $\rightarrow$ 交易執行 $\rightarrow$ 結果回傳的完整端到端路徑。
- **邊界測試**：測試負數金額、非法地址等異常路徑，確保攔截機制生效。