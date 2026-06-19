# 🏛️ OmniAgent X ESG GO | 全域 API 規格說明書 v1.2
## 數位治理主權與 5T 誠信協議標準

> **版本:** 1.2-Alpha | **核心協議:** 5T Integrity v1.1 | **基礎設施:** BlueCC Hybrid Control

---

## 1. 設計哲學 (Architecture Philosophy)
本系統 API 旨在建立一個 **「高透明、不可篡改、自我生長」** 的數據通道。每一筆寫入操作均須符合 5T 誠信協議。

*   **無縫交接:** 採用標準化 RESTful 與 GraphQL 雙軌設計，確保模組間零摩擦連通。
*   **深貫廣通:** 數據與審計日誌（Audit Log）強耦合，任何狀態變更必留下 T3 軌跡。
*   **無限進化:** 支援 Meta-Analysis 接口，允許 AI 代理對 API 流量進行行為分析與自我優化。

---

## 2. 通用規範 (Global Standards)

### 基路 (Base URL)
`https://api.esggo.com/v1` 或 `/api` (Internal)

### 認證與安全 (Security)
*   **Bearer Token:** 所有請求需攜帶 `Authorization: Bearer <JWT>`。
*   **RLS 整合:** 後端強制執行 Supabase Row Level Security。
*   **5T 封印頭 (Optional):** 寫入操作可攜帶 `X-5T-Hash-Lock` 用於預校驗。

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
*   **GET `/environmental`**
    *   功能：獲取年度環境指標清單。
    *   參數：`category` (GHG, Energy, Water, Waste), `year`.
*   **POST `/environmental`**
    *   功能：新增/更新環境數據（觸發 T1 Traceable 流程）。
    *   必填：`metric_name`, `metric_value`, `unit`.
*   **POST `/environmental/seal`**
    *   功能：執行 5T 數位封印，將數據狀態轉為 `verified`。

### 🔵 B. 誠信證明中心 (Proof & Audit)
*   **GET `/audit/logs`**
    *   功能：讀取全域審計軌跡。
    *   參數：`resource`, `action`, `limit`.
*   **POST `/proof/seal`**
    *   功能：對任意 JSON 數據對象執行 Master Seal 聚合雜湊。
*   **GET `/proof/verify/:hash`**
    *   功能：VerifyLink™ 接口，檢索並驗證特定雜湊的合法性。

### 🤖 C. AI 與算力調度 (Intelligence & Computing)
*   **POST `/ai/generate`**
    *   功能：啟動 Omni-Agent 撰寫或諮詢任務。
    *   參數：`prompt`, `persona` (compliance, harmony, innovation).
*   **GET `/ai/growth`**
    *   功能：獲取系統自我成長建議 (Self-Evolution Insight)。
*   **GET `/blue/status`**
    *   功能：監控 BlueCC 算力節點與 H100 負載狀態。

### 📋 D. 治理操作模組 (Operations)
*   **GET/POST `/tasks`**
    *   功能：管理跨部門協作任務。
*   **GET/PATCH `/profile`**
    *   功能：維護企業主權資料與 ESG 長期願景。

---

## 4. 5T 狀態碼 (Integrity Status Codes)
除了標準 HTTP Code 外，系統引入治理狀態碼：
*   **`201-T1`**: 資料已建立，具備初步溯源。
*   **`200-T4`**: 資料已完成雜湊鎖定，不可篡改。
*   **`200-T5`**: 資料已完成 ZKP 封印，具備最高治理主權。
*   **`403-INTEGRITY_FAIL`**: 偵測到哈希不匹配，可能存在非法篡改。

---

## 5. 無縫交接清單 (Handoff Checklist)
1.  **數據類型:** 統一使用 `lib/db.ts` 中的 TypeScript Interfaces。
2.  **錯誤處理:** 必須在 API 內寫入 `logAudit` 紀錄異常。
3.  **效能基準:** 所有 GET 請求響應應 < 200ms，AI 任務需支援 SSE 流式傳輸。

---
*ESG GO 全域 API 規格書 v1.2 | 2026-05-23 | Antigravity AI 簽發*
