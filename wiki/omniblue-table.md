# OmniBlueTable 系統

> **簡述 (Brief Description)**: 藍碳混合雲控制平面 (OmniBlue) × OmniTable 資料表整合系統 — 實現 ESG 數據 Sovereignty、多雲協調與 Logic Node 同步。

---

## 邏輯上下文 (Logical Context)

OmniBlueTable 處於 **ESGGO 5T 協議門** 的核心樞紐位置，連接「數據源」與「治理行動」：

```
OmniBlue Control Plane (多雲/混合部署)
    ↓ 監控、部署、資源調度
    ↓ syncLogicNodesToOmniTable()
OmniTable (ESG 數據表)
    ↓ getRecords / createRecords / updateRecords
    ↓
ESG Governance Actions (證據封印、UCC 封裝、最佳實踐套用)
```

| 上下文物件 | 角色定位 | 關聯文件 |
| :--- | :--- | :--- |
| `OmniBlueClient` | 上游：多雲 Agent 控制平面 | `lib/services/omni-blue.ts` |
| `OmniTableBlueBridge` | 核心橋接層：雙向同步 | `lib/services/omni-table-blue-bridge.ts` |
| `OmniTable API Proxy` | 介面層：Server-side API 代理 | `app/api/omni-table/route.ts` |
| `useOmniTable` React Hook | 前端：型別安全資料表操作 | `lib/omni-table/useOmniTable.ts` |
| `syncLogicNodesToOmniTable` | 伺服器端整合：Logic Node 同步 | `server/src/integrations/omni-table-client.ts` |
| `OmniCommander.runOmniBlueToOmniTableIntegration` | 代理任務：自動化同步任務 | `lib/agents/omni-commander.ts` |
| `BestPracticeRegistry` | 智庫：登記 OmniBlueTable 最佳實踐 | `lib/agent/best-practice-registry.ts` |

---

## 系統架構

### 1. OmniBlue Control Plane (`lib/services/omni-blue.ts`)

```
OmniBlueClient (blueCC singleton)
    ├── getSystemStatus()       → 集群健康狀態
    ├── deployAgent(name, specs) → 部署 AI Agent 至雲端
    └── listResources()         → GPU_NODE / VECTOR_DB 資源清單
```

| 屬性 | 說明 |
| :--- | :--- |
| `apiKey` / `token` | 認證憑證 (BLUE_CC_API_KEY, BLUE_CC_TOKEN) |
| `baseUrl` | `https://api.blue.cc/v1` (預設) |
| `cluster_id` | 目標集群識別碼 |
| `mode` | `CLOUD_OPTIMIZED` |

### 2. OmniTable 前端整合 (`lib/omni-table/`)

```
useOmniTable Hook
    ├── fetchSpaces()          → 取得空間清單
    ├── fetchNodes(spaceId)    → 取得 Logic Nodes
    ├── fetchRecords(datasheetId, opts) → 分頁查詢記錄
    ├── fetchFields(datasheetId) → 取得欄位定義
    ├── fetchViews(datasheetId)  → 取得視圖定義
    ├── createRecords(...)     → 批次建立記錄
    ├── updateRecords(...)     → 批次更新記錄
    ├── deleteRecords(...)     → 批次刪除記錄
    └── createDatasheet(...)   → 建立新資料表
```

所有操作經由 `/api/omni-table` Server-side Proxy，確保 `OMNITABLE_API_KEY` 不暴露於 Client Bundle。

### 3. OmniTable Blue Bridge (`lib/services/omni-table-blue-bridge.ts`)

雙向同步核心：

```typescript
class OmniTableBlueBridge {
  syncMetricsToCloud(datasheetId: string)      // OmniTable → OmniBlue
  reportCloudStatusToOmniTable(datasheetId, recordId)  // OmniBlue → OmniTable
}
```

**同步觸發邏輯**：
- 讀取 OmniTable 記錄
- 若 `Status === 'Deploy' || Status === 'Trigger'` → 觸發 `blueCC.deployAgent()`
- 部署完成後，透過 `omniAgentBus` 發布事件至 Event Stream

### 4. Server-side Integration (`server/src/integrations/omni-table-client.ts`)

```typescript
syncLogicNodesToOmniTable(nodes: LogicNode[]) → boolean
```

功能：
- 取得/建立 OmniTable Space 中的 `Logic Nodes` Datasheet
- 將 `omniblue_nodes` 轉換為 Logic Nodes (包含合規分數、類型、時間戳)
- 批次 upsert (chunk size = 10，避免 API limit)
- 內建 exponential backoff retry (3 次)

---

## 5T 協議門映射

| 協議 | OmniBlueTable 實作 |
| :--- | :--- |
| `真 (Truth)` | `source_origin` 追蹤每個 Logic Node 的來源系統 |
| `善 (Goodness)` | Zod schema + TRPCError 全鏈路驗證 |
| `美 (Beauty)` | Liquid Glass Cyan 元件整合於 Think Tank Dashboard |
| `信 (Trust)` | Hash Lock 封印於每条 OmniTable 記錄更新 |
| `通 (Transferful)` | EventBus 廣播同步事件 (AGENT_TASK, MISSION_COMPLETE) |

---

## 關鍵元件檔案對照

| 元件 | 檔案路徑 | 職責 |
| :--- | :--- | :--- |
| OmniBlueClient | `lib/services/omni-blue.ts` | 多雲控制平面客戶端 |
| OmniTableBlueBridge | `lib/services/omni-table-blue-bridge.ts` | OmniTable ↔ OmniBlue 雙向同步 |
| omni-table-client | `server/src/integrations/omni-table-client.ts` | Server-side Logic Node 同步 |
| API Proxy | `app/api/omni-table/route.ts` | Next.js API Route，保護 API Key |
| useOmniTable Hook | `lib/omni-table/useOmniTable.ts` | React Hook，型別安全操作 |
| OmniCommander | `lib/agents/omni-commander.ts` | 代理任務調度 (Mission: SYNC_OMNIBLUE_OMNITABLE) |
| BestPracticeRegistry | `lib/agent/best-practice-registry.ts` | 最佳實踐智庫 |

---

## 相依環境變數

| 變數名稱 | 用途 | 預設值 |
| :--- | :--- | :--- |
| `BLUE_CC_API_KEY` | OmniBlue API 認證 | - |
| `BLUE_CC_TOKEN` | OmniBlue Bearer Token | - |
| `OMNITABLE_API_KEY` | OmniTable API 認證 | - |
| `SPACE_ID` | OmniTable 預設 Space | - |
| `OMNITABLE_SPACE_ID` | Logic Node 同步目標 Space | - |

---

## 相關概念

*   [5T Protocol: `真 (Truth)` → `通 (Transferful)`](../GEMINI.md#3-5t-協議門數據治理矩陣-the-5t-protocol)
*   [Best Practices 智庫](./best-practice/page.tsx)
*   [Think Tank Mission Control](./think-tank/page.tsx)
*   [OmniCommander Missions](./lib/agents/omni-commander.ts)
*   [OmniSpace Service](./src/server/services/omnispace.service.ts)

---

## 備註 (Notes)
> **2026-05-31 最佳實踐重構**：OmniBlueTable 系統已全面對齊 5T 協議與分層架構原則。`OmniBlueClient` 與 `OmniTableBlueBridge` 為核心橋接層；`syncLogicNodesToOmniTable` 為伺服器端整合模組。所有作業均可透過 Think Tank Dashboard 的 `SYNC_OMNIBLUE_OMNITABLE` Mission 觸發，並經由 `OmniAgentBus` 進行即時狀態廣播。

---

*(Document registered in Think Tank: 2026-05-31)*
