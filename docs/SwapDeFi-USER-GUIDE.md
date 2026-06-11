---
uuid: "b3ee6865-11a7-45c3-8a2b-eafe6d7ff44c"
version: "1.0.0"
timestamp: "2026-06-04T10:36:23.405Z"
evidence: "docs\SwapDeFi-USER-GUIDE.md"
---
# Swap‑DeFi‑TEST‑UMES‑ONLINE 使用者指南

## 目標
本指南說明如何在 **ESG GO** 平台上使用 **Swap‑DeFi‑TEST‑UMES‑ONLINE** 服務，從環境設定、交易驗證、API 呼叫到錯誤處理，適合新手快速上手。

## 1. 前置條件
1. **Node.js 18+** 已安裝。
2. 已完成 ESG GO 專案的 `npm install` 並能正常執行 `npm run dev`。
3. 取得以下測試金鑰（測試環境專用）並設定於 `.env.local`：
   ```dotenv
   SWAP_DEFI_API_KEY=YOUR_TEST_API_KEY
   SWAP_DEFI_TOKEN=YOUR_TEST_TOKEN
   SWAP_DEFI_ENDPOINT=https://test-umes.online/api/v1
   ```
4. 確認本機已啟動 **OmniAgent Gateway**（預設 `http://127.0.0.1:8642`），或在 `omni-config.ts` 中設定正確的 `BASE_URL`。

## 2. 交易結構說明
```ts
export interface SwapDefiTransaction {
  id: string;            // 交易唯一識別碼
  fromToken: string;      // 來源代幣 (例: "USDC")
  toToken: string;        // 目標代幣 (例: "UMES")
  amount: number;         // 交易金額，必須大於 0
  userAddress: string;    // 來源錢包地址，必須符合 0x…40 位十六進位
  recipient?: string;     // 可選，接收者錢包，未提供則預設為 userAddress
  slippageTolerance?: number; // 可選，容忍的滑點百分比
  deadline?: number;      // 可選，Unix 時間戳，交易過期時間
}
```
- **驗證規則**：
  - `id` 為非空字串。
  - `fromToken`、`toToken` 不能相同。
  - `amount` 必須為正數。
  - `userAddress` 必須符合 `0x` 開頭、40 位十六進位或最少 20 位長度。

## 3. 使用 API 進行 Swap
### 3.1 建立任務 (POST `/api/agent/tasks`)
```http
POST /api/agent/tasks HTTP/1.1
Content-Type: application/json

{
  "taskType": "swap_defi",
  "transaction": {
    "id": "swap-001",
    "fromToken": "USDC",
    "toToken": "UMES",
    "amount": 100.5,
    "userAddress": "0x1234567890123456789012345678901234567890"
  }
}
```
- **回應**：
  ```json
  {
    "task": { … OmniAgent task meta … },
    "result": {
      "transactionId": "swap-001",
      "status": "success" | "failed",
      "is_mock": true   // 測試環境 fallback
    },
    "ok": true
  }
  ```
- 若驗證失敗，API 會直接拋出錯誤訊息，回傳 `400 Bad Request`。

### 3.2 查詢流動池狀態 (GET `/api/agent/tasks/pool/{poolId}`)
目前已在 `SwapDeFiClient` 中實作 `getPoolStatus(poolId)`，可直接在程式內呼叫或透過自訂端點封裝。

## 4. 錯誤處理
- **驗證錯誤**：會在 `SwapDeFiClient.validateTransactionParams` 中拋出 `Error`，API 回傳 400，訊息包含失敗原因。
- **遠端呼叫失敗**：若外部 API 回傳非 2xx，會捕捉並回傳 fallback 物件 `{ is_mock: true, status: "failed" }`，方便前端顯示「交易失敗」狀態。
- **日誌追蹤**：所有錯誤皆以 `console.warn('[SwapDeFi] …')` 記錄，可在 `omni‑gateway` 或本機終端中檢視。

## 5. 測試指引
執行完整測試 (包含 Swap‑DeFi) ：
```bash
npm run test   # Vitest 執行 lib/**/*.test.ts
```
- 失敗測試會顯示驗證錯誤、fallback 行為。
- 若想只跑 Swap‑DeFi 測試：
```bash
npx vitest run lib/omni-core.test.ts --testNamePattern "SwapDeFi"
```

## 6. 常見問題 (FAQ)
| 問題 | 解答 |
|------|------|
| **交易總是回傳 `is_mock:true`** | 測試環境的 `test-umes.online` 尚未提供真實 API，回傳 fallback 為預期行為。上線前請切換 `SWAP_DEFI_ENDPOINT` 為正式端點。
| **地址驗證失敗** | 確認錢包地址為 `0x` 開頭且長度 42（含 `0x`）的十六進位字串。
| **金額為 0.0 時仍通過** | 金額必須大於 0，0 或負數會在 `validateTransactionParams` 中拋錯。
| **想要自訂滑點容忍** | 在 `SwapDefiTransaction` 中加入 `slippageTolerance` 欄位，服務端會自動傳遞至後端 API（目前仍為測試模式）。 |

## 7. 部署注意事項
- **環境變數** 必須在部署管道（Vercel、Docker、PM2）中正確注入。
- 若使用 **Docker**，可在 `Dockerfile` 中加入：
  ```Dockerfile
  ENV SWAP_DEFI_API_KEY=${SWAP_DEFI_API_KEY}
  ENV SWAP_DEFI_TOKEN=${SWAP_DEFI_TOKEN}
  ENV SWAP_DEFI_ENDPOINT=${SWAP_DEFI_ENDPOINT}
  ```
- **監控**：建議在 `omni‑gateway` 中加入 Prometheus 指標，監測 `swap_deFi_success_total`、`swap_deFi_failure_total`。

---
*本指南已同步至 `app/tasks/DESIGN.md`，並在 `README.md` 中加入快速連結。*
