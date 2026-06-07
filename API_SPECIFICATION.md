---
uuid: 'a76be9b4-bcfa-4076-80f0-5d16e3d708d6'
version: '1.0.0'
timestamp: '2026-06-04T10:36:12.368Z'
evidence: 'API_SPECIFICATION.md'
---

# 🏛️ OmniAgent X ESG GO | 全域 API 規格說明書 v1.2

## 數位治理主權與 5T 誠信協議標準

> **版本:** 1.2-Alpha | **核心協議:** 5T Integrity v1.1 | **基礎設施:** OmniBlue Hybrid Control

---

## 1. 設計哲學 (Architecture Philosophy)

本系統 API 旨在建立一個 **「高透明、不可篡改、自我生長」** 的數據通道。每一筆寫入操作均須符合 5T 誠信協議。

- **無縫交接:** 採用標準化 RESTful 與 GraphQL 雙軌設計，確保模組間零摩擦連通。
- **深貫廣通:** 數據與審計日誌（Audit Log）強耦合，任何狀態變更必留下 T3 軌跡。
- **無限進化:** 支援 Meta-Analysis 接口，允許 AI 代理對 API 流量進行行為分析與自我優化。

---

## 2. 通用規範 (Global Standards)

### 基路 (Base URL)

`https://api.esggo.com/v1` 或 `/api` (Internal)

### 認證與安全 (Security)

- **Bearer Token:** 所有請求需攜帶 `Authorization: Bearer <JWT>`。
- **RLS 整合:** 後端強制執行 Supabase Row Level Security。
- **5T 封印頭 (Optional):** 寫入操作可攜帶 `X-5T-Hash-Lock` 用於預校驗。

### OAuth 2.0 開發環境設定 (Development Environment OAuth 2.0 Setup)

為便於開發，特別是前端應用程式與本地主機環境的調試，OAuth 2.0 客戶端需配置以下授權憑證。這確保了應用程式在開發階段能夠安全地與認證服務互動。

- **Authorized JavaScript Origins (授權的 JavaScript 來源):**

  - `http://localhost:<PORT>` (例如: `http://localhost:3000`, `http://localhost:5173`)
  - `http://127.0.0.1:<PORT>` (例如: `http://127.0.0.1:3000`, `http://127.0.0.1:5173`)
  - **用途:** 允許您的前端應用程式在這些來源上運行時，能夠發起 OAuth 流程，如透過 Google Identity Services 進行登入。請根據您前端開發伺服器的實際端口號進行配置。

- **Authorized Redirect URIs (授權的重新導向 URI):**
  - `http://localhost:<PORT>/oauth2callback` (例如: `http://localhost:3000/oauth2callback`)
  - `http://127.0.0.1:<PORT>/oauth2callback` (例如: `http://127.0.0.1:3000/oauth2callback`)
  - **用途:** 在 OAuth 認證流程完成後，認證服務會將用戶導向這些指定的 URI。這對於 Web 應用程式接收授權碼或存取令牌至關重要。請確保此處的端口和路徑與您的應用程式處理回調的邏輯相符。

**重要注意事項:**

- 在生產環境中，請務必將 `<PORT>` 替換為實際的生產域名和 HTTPS 協議，並移除 `localhost` 相關的配置，以確保安全性。
- 為每個環境（開發、測試、生產）使用獨立的 OAuth 2.0 客戶端憑證。
- 此處的配置需在您的 OAuth 服務提供商的控制台中進行管理（例如：Google Cloud Console 的 API 和服務 > 憑證）。

### 響應格式 (Standard Response)

```json
{
  "status": "success | error",
  "t5_tag": "T1..T5",
  "data": { ... },
  "hash_lock": "sha256:...", // 該次操作的密碼學指紋
  "meta": {
    "node": "blue-edge-01",
    "timestamp": 1716422400000
  }
}
```

---

## 3. 模組 API 詳解

### 🟢 A. 環境指揮模組 (Environmental Hub)

- **GET `/environmental`**
  - 功能：獲取年度環境指標清單。
  - 參數：`category` (GHG, Energy, Water, Waste), `year`.
- **POST `/environmental`**
  - 功能：新增/更新環境數據（觸發 T1 Traceable 流程）。
  - 必填：`metric_name`, `metric_value`, `unit`.
- **POST `/environmental/seal`**
  - 功能：執行 5T 數位封印，將數據狀態轉為 `verified`。

### 🔵 B. 誠信證明中心 (Proof & Audit)

- **GET `/audit/logs`**
  - 功能：讀取全域審計軌跡。
  - 參數：`resource`, `action`, `limit`.
- **POST `/proof/seal`**
  - 功能：對任意 JSON 數據對象執行 Master Seal 聚合雜湊。
- **GET `/proof/verify/:hash`**
  - 功能：VerifyLink™ 接口，檢索並驗證特定雜湊的合法性。

### 🤖 C. AI 與算力調度 (Intelligence & Computing)

- **POST `/ai/generate`**
  - 功能：啟動 Omni-Agent 撰寫或諮詢任務。
  - 參數：`prompt`, `persona` (compliance, harmony, innovation).
- **GET `/ai/growth`**
  - 功能：獲取系統自我成長建議 (Self-Evolution Insight)。
- **GET `/blue/status`**
  - 功能：監控 OmniBlue 算力節點與 H100 負載狀態。

### 📋 D. 治理操作模組 (Operations)

- **GET/POST `/tasks`**
  - 功能：管理跨部門協作任務。
- **GET/PATCH `/profile`**
  - 功能：維護企業主權資料與 ESG 長期願景。

---

## 4. 5T 狀態碼 (Integrity Status Codes)

除了標準 HTTP Code 外，系統引入治理狀態碼：

- **`201-T1`**: 資料已建立，具備初步溯源。
- **`200-T4`**: 資料已完成雜湊鎖定，不可篡改。
- **`200-T5`**: 資料已完成 ZKP 封印，具備最高治理主權。
- **`403-INTEGRITY_FAIL`**: 偵測到哈希不匹配，可能存在非法篡改。

---

## 5. 無縫交接清單 (Handoff Checklist)

1.  **數據類型:** 統一使用 `lib/db.ts` 中的 TypeScript Interfaces。
2.  **錯誤處理:** 必須在 API 內寫入 `logAudit` 紀錄異常。
3.  **效能基準:** 所有 GET 請求響應應 < 200ms，AI 任務需支援 SSE 流式傳輸。

---

_ESG GO 全域 API 規格書 v1.2 | 2026-05-23 | Antigravity AI 簽發_
