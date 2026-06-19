# 善向永續數據中台 (Sunshine ESG Hub)

## 🏛️ 系統概述

善向永續數據中台是一個專為 ESG (環境、社會、治理) 數據管理打造的企業級解決方案。基於 Supabase 雲原生架構，提供：

- **單一真理來源**：集中化的 ESG 數據存儲和計算
- **自動化碳排計算**：智能係數管理和 Trigger 驅動計算
- **企業級權限控制**：基於角色的訪問控制 (RBAC)
- **審核工作流**：標準化的數據審核和鎖定機制

## 🚀 核心功能

### 1. ESG 數據管理
- 多維度指標追蹤 (環境、社會、治理)
- 自動碳排係數計算
- 歷史數據版本控制
- 佐證資料上傳和關聯

### 2. 智慧審核系統
- 四階段工作流：草稿 → 審核 → 核准 → 鎖定
- 角色-based 權限控制
- 審核軌跡記錄

### 3. 數據分析儀表板
- 即時統計指標
- 多廠區數據對比
- 趨勢分析和報表

### 4. 數據匯入工具
- Excel/CSV 批量匯入
- 自動數據驗證和轉換
- 錯誤檢查和修復指引

## 📋 技術架構

```
┌─────────────────────────────────────────────────────────────┐
│                    前端層 (React + TypeScript)               │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐  │
│  │   ESG Console   │ │  Data Import   │ │   Analytics      │  │
│  │   儀表板        │ │   數據匯入      │ │   分析工具       │  │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                    API 層 (Supabase)                         │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐  │
│  │  RESTful API   │ │   RPC Functions │ │   Realtime      │  │
│  │   CRUD 操作     │ │   業務邏輯      │ │   實時更新      │  │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                    數據層 (PostgreSQL)                       │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐  │
│  │ ESG Readings   │ │   RLS Policies  │ │   Triggers      │  │
│  │ 數據事實        │ │   權限策略      │ │   自動計算      │  │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 🛠️ 快速開始

### 1. 環境準備

#### 系統需求
- Node.js 18+
- Python 3.8+
- Supabase 帳號

#### 安裝依賴
```bash
# 安裝前端依賴
npm install

# 安裝 Python 依賴 (用於數據匯入)
pip install supabase pandas openpyxl
```

### 2. Supabase 專案設定

#### 創建新專案
1. 前往 [Supabase](https://supabase.com) 註冊帳號
2. 創建新專案
3. 記錄專案 URL 和 API Keys

#### 初始化資料庫
1. 在 Supabase SQL Editor 中執行 `supabase-schema.sql`
2. 設定 Row Level Security (RLS) 策略
3. 創建 Storage Bucket: `esg-evidence` (設為私有)

### 3. 環境變數配置

複製並配置環境變數：

```bash
cp .env.example .env

# 編輯 .env 文件，填入 Supabase 資訊
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. 數據庫初始化

#### 執行 Schema 初始化
```bash
# 在 Supabase SQL Editor 中執行
# 檔案位置: supabase-schema.sql
```

#### 設定初始管理員
```sql
-- 創建第一個管理員用戶 (替換為真實的 UUID)
insert into public.user_profiles (id, role)
values ('your-user-uuid', 'admin');
```

### 5. 前端啟動

```bash
# 安裝依賴
npm install

# 啟動開發服務器
npm run dev
```

### 6. 數據匯入 (可選)

```bash
# 準備 Excel 文件 (欄位: OrgName, MetricCode, PeriodStart, PeriodEnd, Value)
# 執行匯入腳本
python scripts/import_esg_data.py path/to/your/data.xlsx

# 或使用環境變數
SUPABASE_URL=https://your-project.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=your-key \
python scripts/import_esg_data.py data.xlsx
```

## 📊 數據格式說明

### Excel 匯入格式
```csv
OrgName,MetricCode,PeriodStart,PeriodEnd,Value,TargetValue
善向科技總部,E-Elec,2025-01-01,2025-01-31,12500,12000
台北研發中心,E-GHG-S1,2025-01-01,2025-01-31,500,
```

### 支持的指標代碼
- `E-Elec`: 用電量 (kWh)
- `E-GHG-S1`: Scope 1 直接排放 (tCO2e)
- `S-Emp-Turn`: 新進員工離職率 (%)

## 👥 用戶角色與權限

### 1. Admin (管理員)
- ✅ 所有數據的讀寫權限
- ✅ 用戶和權限管理
- ✅ 數據審核和鎖定
- ✅ 系統配置

### 2. Editor (填報員)
- ✅ 所屬部門數據的讀寫
- ✅ 提交審核請求
- ❌ 無法修改已鎖定數據

### 3. Auditor (稽核員)
- ✅ 所有數據的唯讀權限
- ❌ 無法修改任何數據

## 🔐 安全特性

### Row Level Security (RLS)
- 自動化的數據訪問控制
- 基於用戶角色和部門的權限過濾

### 數據完整性
- 外鍵約束確保數據一致性
- Trigger 自動驗證和計算

### 審計軌跡
- 所有數據修改自動記錄
- 不可篡改的審核日誌

## 📈 API 使用範例

### 數據查詢
```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(URL, KEY);

// 獲取已核准數據
const { data, error } = await supabase
  .from('esg_readings')
  .select(`
    value, calculated_value, period_start,
    metric:metric_definitions(name, unit),
    org:org_units(name)
  `)
  .eq('status', 'approved');
```

### 數據提交
```javascript
const { error } = await supabase
  .from('esg_readings')
  .insert({
    metric_id: 'uuid',
    org_unit_id: 'uuid',
    period_start: '2025-01-01',
    period_end: '2025-01-31',
    value: 1250.5
  });
```

### 審核操作
```javascript
const { error } = await supabase.rpc('process_approval', {
  reading_id: 'uuid',
  action: 'approve'
});
```

## 🔧 維護與更新

### 定期維護任務
- 監控數據庫效能
- 更新排放係數
- 清理舊的審核日誌

### 版本升級
1. 備份現有數據
2. 執行 Schema 遷移
3. 更新應用程式代碼
4. 驗證數據完整性

## 📞 支援與聯繫

如有技術問題或功能建議，請聯繫開發團隊。

**開發團隊**: JunAiKey & ESG Sunshine
**版本**: v1.0.0
**更新日期**: 2025-01-04

---

*「善向永續，數據先行」 - 讓數據驅動永續轉型*