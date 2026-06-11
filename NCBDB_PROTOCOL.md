---
uuid: "979d575e-9a9a-4204-b259-2cdc76226bca"
version: "1.0.0"
timestamp: "2026-06-04T10:36:12.322Z"
evidence: "NCBDB_PROTOCOL.md"
---
# ESGGO 全域資料庫 (NCBDB) 使用規範 | Global Database Protocol 💎

> **實例 (Instance):** `54686_esggo`  
> **定位:** 全域數據展示層、代理人取用庫、5T 誠信感測終點。

## 1. 核心原則 (Core Principles)
- **單一真理源 (Single Source of Exhibit):** `54686_esggo` 是 ESGGO 系統唯一的全域共用展示資料庫。
- **4可1不可:** 所有數據必須符合「可溯源、可透明、可感知、可追蹤」且「不可篡改（透過 Supabase 錨點驗證）」。

## 2. 存取規範 (Access Protocol)
- **環境變數強制:** 嚴禁在程式碼中硬編碼 API Key 或 Instance ID。
  - `NCB_INSTANCE`: 實例識別。
  - `NCBDB_API_TOKEN`: 存取金鑰 (Server-only)。
- **代理存取機制:**
  - **後端 (Server-side):** 統一使用 `@/lib/ncbdb` 的 `ncbClient`。
  - **前端 (Client-side):** 透過 `/api/data/[...path]` 進行代理請求，確保 Token 不外洩。

## 3. 數據寫入規範 (Data Schema Standards)
每一原子數據寫入必須包含以下「刻印」欄位：
- `uuid`: 唯一識別碼。
- `timestamp`: 寫入時間。
- `user_email`: 操作者識別。
- `integrity_hash`: 對應 Supabase 原始數據的 Hash Lock。

## 4. 誠信監控 (Integrity Sensing)
- **Webhook 聯動:** 資料庫已配置 Webhook 感測器。任何手動透過 NCB 後台進行的數據變更，將觸發 `📡 NCBDB 誠信感測器` 並記錄於 `audit_log`。
- **自動修復:** 若感測到非授權變更，OmniAgent 將自動啟動「萬能修復」流程，從 Supabase 真理碑重新同步數據。

## 5. 擴展指令 (Extension Directives)
- 新增表 (Table) 時，必須同步更新 `lib/ncbdb.ts` 的類型定義。
- 所有展示組件 (OmniBaseTable/Form) 必須綁定此全域實例。

---
© 2026 ESGGO 善向永續 | OmniCore P0 創世規範擴展。
