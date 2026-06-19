# 🎯 ESGss JunAiKey 系統整合樞紐文檔

## 📋 目錄

1. [系統概述](#系統概述)
2. [整合架構](#整合架構)
3. [模組狀態](#模組狀態)
4. [工作流程](#工作流程)
5. [事件流機制](#事件流機制)
6. [數據同步](#數據同步)
7. [API 端點](#api-端點)
8. [使用情境](#使用情境)

---

## 系統概述

### 🎯 什麼是整合樞紐？

整合樞紐（Integration Hub）是 ESGss JunAiKey 平台的核心組件，負責統一管理和協調所有 ESG 相關模組之間的數據流和工作流程。它提供了一個集中的監控和管理界面，使系統能夠實現：

- **無縫數據流動**：跨模組數據同步和共享
- **自動化工作流程**：減少人工操作，提高效率
- **即時監控追蹤**：掌握所有系統事件的狀態
- **統一配置管理**：集中管理所有整合設定

### 🌟 核心功能

| 功能 | 描述 | 狀態 |
|------|------|------|
| 模組狀態監控 | 實時追蹤所有模組的運行狀態 | ✅ 已完成 |
| 工作流程管理 | 自動化跨模組工作流程 | ✅ 已完成 |
| 事件流追蹤 | 監控和記錄所有系統事件 | ✅ 已完成 |
| 數據同步控制 | 管理跨模組數據同步 | ✅ 已完成 |

---

## 整合架構

### 🏗️ 系統架構圖

```
┌─────────────────────────────────────────────────────────────────────┐
│                        ESGss JunAiKey 平台                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐          │
│  │     CRM      │◄──►│   AGENCY    │◄──►│   FINANCE    │          │
│  │  客戶管理     │    │  代理聯盟    │    │   財務管理   │          │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘          │
│         │                   │                   │                   │
│         ▼                   ▼                   ▼                   │
│  ┌──────────────────────────────────────────────────────────┐       │
│  │                   整合樞紐 (Integration Hub)             │       │
│  │                                                          │       │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │       │
│  │  │  事件匯流排  │  │  工作流程    │  │   數據同步   │      │       │
│  │  │  Event Bus │  │  Workflow   │  │ Data Sync   │      │       │
│  │  └─────────────┘  └─────────────┘  └─────────────┘      │       │
│  │                                                          │       │
│  └──────────────────────────┬───────────────────────────────┘       │
│                             │                                        │
│                             ▼                                        │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐          │
│  │    REPORT   │◄──►│     OCR     │◄──►│  ANALYTICS  │          │
│  │  報告書生成  │    │  文件解析    │    │   數據分析   │          │
│  └──────────────┘    └──────────────┘    └──────────────┘          │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 🔗 數據流說明

#### 1. CRM → REPORT（客戶專案到報告書生成）
```
CRM 系統檢測到專案資料更新 
    ↓ 發布 DATA_UPDATED 事件
整合樞紐接收事件 
    ↓ 觸發工作流程
REPORT 系統自動生成相應報告書
```

#### 2. AGENCY → FINANCE（代理分潤到財務核算）
```
AGENCY 系統計算完成分潤資料
    ↓ 發布 COMMISSION_CALCULATED 事件
整合樞紐接收事件 
    ↓ 觸發工作流程
FINANCE 系統自動更新帳務記錄
```

#### 3. REPORT → ANALYTICS（報告書到數據分析）
```
REPORT 系統生成新的報告書
    ↓ 發布 REPORT_GENERATED 事件
整合樞紐接收事件 
    ↓ 觸發工作流程
ANALYTICS 系統更新分析數據
```

#### 4. OCR → REPORT（文件解析到報告書萃取）
```
OCR 系統解析上傳文件完成
    ↓ 發布 DATA_CREATED 事件
整合樞紐接收事件 
    ↓ 觸發工作流程
REPORT 系統萃取關鍵資料
```

---

## 模組狀態

### 📊 模組清單

| 模組名稱 | 狀態 | 最後同步 | 待處理變更 |
|----------|------|----------|-----------|
| CRM 客戶管理 | 🟢 active | 2026-02-08 13:45 | 3 |
| AGENCY 代理聯盟 | 🟢 active | 2026-02-08 13:44 | 1 |
| FINANCE 財務管理 | ⚪ idle | 2026-02-08 13:30 | 0 |
| REPORT 報告書 | 🟡 processing | 2026-02-08 13:45 | 5 |
| OCR 文件解析 | 🟢 active | 2026-02-08 13:44 | 2 |
| ANALYTICS 分析 | 🟢 active | 2026-02-08 13:45 | 0 |

### 🔄 狀態定義

| 狀態 | 圖示 | 說明 |
|------|------|------|
| active | 🟢 | 模組正常運行，可接收和處理數據 |
| idle | ⚪ | 模組空閒，等待觸發事件 |
| processing | 🟡 | 模組正在處理任務中 |
| error | 🔴 | 模組遇到錯誤，需要檢查 |

---

## 工作流程

### 🚀 預定義工作流程

#### 1. CRM_TO_REPORT（客戶專案 → 報告書生成）

| 屬性 | 值 |
|------|-----|
| ID | crm_to_report |
| 名稱 | 客戶專案 → 報告書生成 |
| 源模組 | CRM |
| 目標模組 | REPORT |
| 觸發事件 | DATA_UPDATED |
| 執行次數 | 128 |
| 狀態 | active |

**流程步驟**：
1. CRM 系統發布專案更新事件
2. 整合樞紐接收並驗證事件
3. 調用 REPORT API 生成報告書
4. 更新同步狀態

#### 2. AGENCY_TO_FINANCE（代理分潤 → 財務核算）

| 屬性 | 值 |
|------|-----|
| ID | agency_to_finance |
| 名稱 | 代理分潤 → 財務核算 |
| 源模組 | AGENCY |
| 目標模組 | FINANCE |
| 觸發事件 | COMMISSION_CALCULATED |
| 執行次數 | 45 |
| 狀態 | active |

#### 3. REPORT_TO_ANALYTICS（報告書 → 數據分析）

| 屬性 | 值 |
|------|-----|
| ID | report_to_analytics |
| 名稱 | 報告書 → 數據分析 |
| 源模組 | REPORT |
| 目標模組 | ANALYTICS |
| 觸發事件 | REPORT_GENERATED |
| 執行次數 | 67 |
| 狀態 | active |

#### 4. OCR_TO_REPORT（文件解析 → 報告書萃取）

| 屬性 | 值 |
|------|-----|
| ID | ocr_to_report |
| 名稱 | 文件解析 → 報告書萃取 |
| 源模組 | OCR |
| 目標模組 | REPORT |
| 觸發事件 | DATA_CREATED |
| 執行次數 | 23 |
| 狀態 | paused |

---

## 事件流機制

### 📡 事件類型

| 事件類型 | 來源 | 目標 | 說明 |
|----------|------|------|------|
| DATA_CREATED | OCR | REPORT | 新數據已創建 |
| DATA_UPDATED | CRM | REPORT | 數據已更新 |
| COMMISSION_CALCULATED | AGENCY | FINANCE | 分潤已計算 |
| REPORT_GENERATED | REPORT | ANALYTICS | 報告書已生成 |
| SYNC_REQUIRED | 任意 | 任意 | 需要同步 |

### 🔔 事件流程

```
事件發布者
    │
    ▼
┌───────────────┐
│  事件驗證     │
│  Validation  │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│  事件路由     │
│  Routing     │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│  事件處理     │
│  Processing  │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│  狀態更新     │
│  Status Upd  │
└───────────────┘
```

---

## 數據同步

### 🔄 同步策略

| 同步類型 | 說明 | 觸發方式 |
|----------|------|----------|
| 實時同步 | 事件驅動，即時同步 | 事件發布 |
| 批量同步 | 定時批量處理 | Cron Job |
| 手動同步 | 用戶手動觸發 | API 調用 |

### 📊 同步統計

| 同步路徑 | 方向 | 待同步 | 最後同步 |
|----------|------|--------|----------|
| CRM → REPORT | forward | 3 | 13:45 |
| AGENCY → FINANCE | forward | 1 | 13:44 |
| REPORT → ANALYTICS | forward | 0 | 13:45 |
| OCR → REPORT | forward | 2 | 13:44 |

---

## API 端點

### 📍 基礎 URL

```
/api/v1/integration
```

### 🔗 模組狀態 API

#### GET /status
取得所有模組狀態

**Response**:
```json
{
  "success": true,
  "data": {
    "modules": [...],
    "workflows": [...]
  }
}
```

#### GET /modules/:name
取得特定模組狀態

**Response**:
```json
{
  "success": true,
  "data": {
    "name": "CRM",
    "status": "active",
    "lastSync": "2026-02-08T13:45:00Z"
  }
}
```

#### POST /modules/:name/sync
同步特定模組數據

**Request Body**:
```json
{
  "target": "REPORT"
}
```

### 🚀 工作流程 API

#### GET /workflows
取得所有工作流程

#### POST /workflows/:id/execute
執行特定工作流程

**Request Body**:
```json
{
  "data": {
    "projectId": "123",
    "action": "generate_report"
  }
}
```

#### POST /workflows/:id/pause
暫停工作流程

#### POST /workflows/:id/resume
恢復工作流程

### 📡 事件 API

#### POST /events/publish
發布自定義事件

**Request Body**:
```json
{
  "type": "DATA_UPDATED",
  "source": "CRM",
  "target": "REPORT",
  "payload": {
    "projectId": "123",
    "changes": [...]
  }
}
```

#### GET /events/logs
取得事件日誌

### 🔄 同步 API

#### POST /sync/crm-to-report
CRM → REPORT 同步

#### POST /sync/agency-to-finance
AGENCY → FINANCE 同步

#### POST /sync/report-to-analytics
REPORT → ANALYTICS 同步

#### POST /sync/ocr-to-report
OCR → REPORT 同步

#### POST /sync/all
執行全量同步

### ✅ 健康檢查

#### GET /health
整合中心健康檢查

**Response**:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "modules": {
      "total": 6,
      "active": 5
    },
    "workflows": {
      "total": 4,
      "active": 3
    },
    "timestamp": "2026-02-08T13:45:00Z"
  }
}
```

---

## 使用情境

### 📖 情境一：自動化報告書生成

**情境描述**：當 CRM 系統中的客戶專案更新時，自動觸發報告書生成流程。

**執行步驟**：
1. 用戶在 CRM 中更新專案資料
2. CRM 發布 `DATA_UPDATED` 事件
3. 整合樞紐接收事件並驗證
4. 觸發 `CRM_TO_REPORT` 工作流程
5. REPORT 系統生成新的報告書
6. 生成完成後發布 `REPORT_GENERATED` 事件
7. 整合樞紐觸發 `REPORT_TO_ANALYTICS` 工作流程
8. ANALYTICS 系統更新分析數據

**API 調用順序**：
```
POST /api/v1/integration/events/publish
POST /api/v1/integration/sync/crm-to-report
POST /api/v1/integration/sync/report-to-analytics
```

### 📖 情境二：分潤自動核算

**情境描述**：當 AGENCY 系統計算完分潤後，自動更新財務記錄。

**執行步驟**：
1. AGENCY 完成分潤計算
2. AGENCY 發布 `COMMISSION_CALCULATED` 事件
3. 整合樞紐接收事件
4. 觸發 `AGENCY_TO_FINANCE` 工作流程
5. FINANCE 系統自動創建帳務記錄
6. 更新分潤狀態為「已核算」

### 📖 情境三：文檔智能解析

**情境描述**：用戶上傳永續報告書 PDF，系統自動解析並萃取關鍵數據。

**執行步驟**：
1. 用戶通過 OCR 模組上傳文件
2. OCR 系統解析文件內容
3. OCR 發布 `DATA_CREATED` 事件
4. 整合樞紐接收事件
5. 觸發 `OCR_TO_REPORT` 工作流程
6. REPORT 系統萃取關鍵數據
7. 生成結構化報告書草稿
8. 通知用戶完成

---

## 🎯 總結

整合樞紐作為 ESGss JunAiKey 平台的核心組件，提供了：

- ✅ **統一管理**：集中管理所有模組狀態
- ✅ **自動化流程**：減少人工操作，提高效率
- ✅ **即時監控**：掌握所有系統事件
- ✅ **靈活擴展**：易於添加新的模組和工作流程

通過整合樞紐，各模組之間實現了無縫的數據流動和功能協同，為企業提供了一站式的 ESG 管理解決方案。

---

**文檔版本**：1.0.0  
**更新日期**：2026-02-08  
**維護團隊**：ESGss JunAiKey Development Team
