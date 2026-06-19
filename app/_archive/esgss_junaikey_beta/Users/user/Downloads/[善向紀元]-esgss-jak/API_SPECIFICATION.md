# 善向永續數據中台 (Sunshine ESG Hub) API 契約書 v1.0

## 概述

本 API 基於 Supabase (PostgreSQL) 架構，採用 RESTful 風格。所有請求必須包含 `apikey` 與 `Authorization: Bearer <JWT>` 標頭。

### 核心原則
- **單一真理**：所有數據邏輯由 Database Trigger 處理（如碳排計算）。
- **權限最小化**：依賴 RLS，前端只能請求當前使用者有權限的數據。
- **自動化**：碳排計算和狀態流轉由資料庫函數自動處理。

---

## 認證與授權

### JWT Token
```javascript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@company.com',
  password: 'password'
});
```

### 請求標頭
```javascript
headers: {
  'Authorization': `Bearer ${session.access_token}`,
  'apikey': process.env.SUPABASE_ANON_KEY
}
```

---

## 核心資源 (Resources)

### 1. ESG 數據讀數 (Readings)

#### GET /rest/v1/esg_readings
獲取 ESG 填報數據。支援 Supabase 標準過濾語法。

**參數：**
- `org_unit_id`: `eq.{uuid}` (可選，過濾部門)
- `status`: `eq.approved` (可選，過濾狀態)
- `select`: `*, metric:metric_definitions(name, unit), org:org_units(name)` (強烈建議使用關聯查詢)

**範例：**
```javascript
// 獲取當前用戶部門的所有已核准數據
const { data, error } = await supabase
  .from('esg_readings')
  .select(`
    id, value, calculated_value, status, period_start,
    metric:metric_definitions(name, unit),
    org:org_units(name)
  `)
  .eq('status', 'approved');
```

#### POST /rest/v1/esg_readings
填報員提交新的 ESG 數據。

**請求體：**
```json
{
  "metric_id": "uuid",
  "org_unit_id": "uuid",
  "period_start": "2025-01-01",
  "period_end": "2025-01-31",
  "value": 1250.5,
  "target_value": 1200.0
}
```

**注意：** 請勿傳送 `calculated_value`，後端會自動計算。

#### PATCH /rest/v1/esg_readings
更新數據（僅限草稿狀態且本人所有）。

---

### 2. 組織架構 (Organization Units)

#### GET /rest/v1/org_units
獲取組織架構層次。

#### POST /rest/v1/org_units
新增組織單位（僅限 Admin）。

---

### 3. ESG 指標定義 (Metric Definitions)

#### GET /rest/v1/metric_definitions
獲取所有可用指標。

---

## 業務邏輯函數 (RPC)

### process_approval
處理數據的提交、核准與駁回。

**端點：** /rest/v1/rpc/process_approval

**方法：** POST

**參數：**
```json
{
  "reading_id": "target-uuid",
  "action": "approve", // 選項: "submit", "approve", "reject"
}
```

**權限：**
- `approve/reject`: 僅限 Admin
- `submit`: 僅限數據擁有者 (Editor)

### get_esg_stats
獲取儀表板統計數據。

**端點：** /rest/v1/rpc/get_esg_stats

**回傳：**
```json
{
  "totalEmission": 9.08,
  "pendingReviews": 1,
  "dataCompleteness": 98
}
```

---

## 數據模型

### ESG Readings
```typescript
interface ESGReading {
  id: string;
  metric_id: string;
  org_unit_id: string;
  period_start: string;
  period_end: string;
  period_type: 'monthly' | 'quarterly' | 'yearly';
  value: number;
  target_value?: number;
  calculated_value?: number; // 由 Trigger 自動計算
  factor_used?: number;     // 使用的係數
  status: 'draft' | 'review' | 'approved' | 'rejected' | 'locked';
  created_by?: string;
  approved_by?: string;
  created_at: string;
  updated_at: string;
}
```

### Metric Definitions
```typescript
interface MetricDefinition {
  id: string;
  code: string;           // 唯一代碼，如 'E-GHG-scope1'
  name: string;           // 顯示名稱
  category: 'Environmental' | 'Social' | 'Governance';
  unit: string;           // 單位，如 'tCO2e', 'kWh', '%'
  description?: string;
  standard_ref?: string;  // GRI 標準參考
  is_active: boolean;
}
```

---

## 錯誤代碼參考

| HTTP Code | 描述 | 可能原因 |
|-----------|------|----------|
| 200 | 成功 | 請求成功處理 |
| 401 | 未授權 | Token 過期或未登入 |
| 403 | 禁止訪問 | 違反 RLS 策略 |
| 409 | 衝突 | 違反唯一性約束 |
| 422 | 無法處理 | 業務邏輯錯誤 |
| 500 | 伺服器錯誤 | 系統內部錯誤 |

---

## 前端整合範例

### 初始化 Supabase
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

### 填報員提交數據
```typescript
const submitReading = async (data: {
  metricId: string;
  orgId: string;
  periodStart: string;
  periodEnd: string;
  value: number;
}) => {
  const { error } = await supabase
    .from('esg_readings')
    .insert({
      metric_id: data.metricId,
      org_unit_id: data.orgId,
      period_start: data.periodStart,
      period_end: data.periodEnd,
      value: data.value,
    });

  if (!error) {
    console.log("數據已提交，碳排量將自動計算");
  }
};
```

### 管理員進行審核
```typescript
const approveReading = async (readingId: string) => {
  const { error } = await supabase
    .rpc('process_approval', {
      reading_id: readingId,
      action: 'approve'
    });
};
```

### 獲取報表數據
```typescript
const fetchReport = async () => {
  const { data } = await supabase
    .from('esg_readings')
    .select(`
      period_start,
      value,
      calculated_value,
      metric:metric_definitions(name, unit),
      org:org_units(name)
    `)
    .eq('status', 'approved')
    .order('period_start', { ascending: false });
};
```

---

## 部署與環境變數

### 生產環境變數
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Supabase 專案設定
1. 啟用 RLS (Row Level Security)
2. 設定 Storage Bucket: `esg-evidence` (私有)
3. 設定 Authentication Providers
4. 執行 `supabase-schema.sql` 初始化資料庫

---

## 效能考量

### 查詢優化
- 使用 `select` 指定需要的欄位
- 利用 Supabase 的關聯查詢減少請求次數
- 對於大量數據，使用分頁 (`range()`)

### 快取策略
- 靜態數據（如指標定義）可在前端快取
- 統計數據可使用 SWR 或 React Query
- 考慮使用 Supabase Realtime 訂閱重要更新

---

## 版本控制

| 版本 | 日期 | 變更 |
|------|------|------|
| v1.0 | 2025-01-04 | 初始版本，核心 ESG 功能 |

---

*本 API 規格由 JunAiKey 系統自動生成，遵循「單一真理」與「最小權限」原則。*