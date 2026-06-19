# 永續報告書研製中心 - 完整技術驗證文檔

## 1. 系統架構總覽

### 1.1 核心服務層

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          永續報告書研製中心架構                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                      Frontend Layer (React + TypeScript)              │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                │    │
│  │  │  CarbonForm  │  │ ExcelUploader│  │ WarRoom    │                │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘                │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                │    │
│  │  │ ReportHub   │  │PrototypePage│  │ Dashboard   │                │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘                │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                     │                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                      Service Layer                                    │    │
│  │  ┌─────────────────┐  ┌─────────────────┐                           │    │
│  │  │ AIAnalysisEngine│  │Verification4T   │                           │    │
│  │  │  - Gemini API   │  │  - Truth        │                           │    │
│  │  │  - Emission Calc │  │  - Transparency │                           │    │
│  │  │  - Anomaly Det. │  │  - Traceability │                           │    │
│  │  │  - Suggestions  │  │  - Trust        │                           │    │
│  │  └─────────────────┘  └─────────────────┘                           │    │
│  │  ┌─────────────────┐  ┌─────────────────┐                           │    │
│  │  │ReportGeneration │  │  Reporting      │                           │    │
│  │  │  - GRI Template │  │  - Evidence 5T  │                           │    │
│  │  │  - TCFD Template│  │  - Integrity    │                           │    │
│  │  │  - SASB Template│  │  - Blockchain   │                           │    │
│  │  └─────────────────┘  └─────────────────┘                           │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                     │                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                     Data Layer (Supabase)                            │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                │    │
│  │  │  Profiles   │  │  Reports    │  │ Emissions   │                │    │
│  │  │  Templates  │  │  Templates  │  │  Logs       │                │    │
│  │  │  Settings   │  │  Versions   │  │  Audit      │                │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘                │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 核心服務說明

| 服務名稱 | 功能說明 | 技術棧 |
|---------|---------|--------|
| AIAnalysisEngine | Gemini AI 整合、碳排計算、異常偵測 | AI SDK, Gemini |
| Verification4T | Truth/Transparency/Traceability/Trust 驗證 | SHA-256, 區塊鏈風格 |
| ReportGeneration | GRI/TCFD/SASB/Carbon 報告書生成 | AI SDK, 範本引擎 |
| Reporting | 5T 證據鏈、完整性驗證 | 加密, 數位簽章 |

---

## 2. API 規格

### 2.1 碳排放計算 API

```
POST /api/v1/emissions/calculate
```

**Request Body:**
```typescript
{
  electricity: {
    consumption: number;  // 消耗量
    unit: 'kWh';          // 單位
    region?: string;      // 地區 (預設 'taiwan')
  };
  fuel?: Array<{
    type: 'diesel' | 'gasoline' | 'naturalGas' | 'lpg';
    consumption: number;
    unit: 'L' | 'm3' | 'kg';
  }>;
}
```

**Response:**
```typescript
{
  success: boolean;
  data: {
    scope1: {
      fixedCombustion: number;    // kg CO2e
      mobileCombustion: number;  // kg CO2e
      fugitiveEmissions: number; // kg CO2e
    };
    scope2: {
      purchasedElectricity: number; // kg CO2e
      purchasedHeat: number;        // kg CO2e
    };
    scope3: {
      purchasedGoods: number;
      capitalGoods: number;
      // ... 其他類別
    };
    totalEmission: number; // kg CO2e
  };
}
```

### 2.2 異常偵測 API

```
POST /api/v1/anomalies/detect
```

**Request Body:**
```typescript
{
  currentData: Record<string, number>;
  historicalData: Array<Record<string, number>>;
  context?: string;
}
```

**Response:**
```typescript
{
  isAnomaly: boolean;
  anomalies: Array<{
    field: string;
    expectedRange: { min: number; max: number };
    actualValue: number;
    deviation: number;
    severity: 'low' | 'medium' | 'high';
    suggestion: string;
  }>;
  overallConfidence: number;
}
```

### 2.3 報告書生成 API

```
POST /api/v1/reports/generate
```

**Request Body:**
```typescript
{
  type: 'gri' | 'tcfd' | 'sasb' | 'carbon' | 'esg';
  organizationName: string;
  reportingPeriod: {
    start: string;  // ISO 8601
    end: string;    // ISO 8601
  };
  data: Record<string, any>;
  options?: {
    includeCharts?: boolean;
    includeVerification?: boolean;
    language?: 'zh-TW' | 'en-US';
    format?: 'pdf' | 'docx' | 'html';
  };
}
```

**Response:**
```typescript
{
  id: string;
  type: ReportType;
  title: string;
  content: string;  // Markdown 格式
  sections: Array<{
    id: string;
    title: string;
    content: string;
    indicators?: Array<{
      code: string;
      name: string;
      value: any;
      unit: string;
    }>;
  }>;
  metadata: {
    generatedAt: string;
    pageCount: number;
    wordCount: number;
  };
  verification?: {
    status: 'verified' | 'pending' | 'failed';
    score: number;
    badge: string;
  };
}
```

### 2.4 4T 驗證 API

```
POST /api/v1/verify/4t
```

**Request Body:**
```typescript
{
  data: Record<string, any>;
  previousData?: Record<string, any>;
  validator?: string;
  enableThirdParty?: boolean;
}
```

**Response:**
```typescript
{
  truth: {
    score: number;
    isVerified: boolean;
    digitalSignature: string;
    timestamp: string;
  };
  transparency: {
    score: number;
    dataCompleteness: number;
    auditTrailLength: number;
  };
  traceability: {
    score: number;
    versionChain: Array<{
      version: string;
      timestamp: string;
      changes: string[];
    }>;
  };
  trust: {
    score: number;
    confidenceLevel: 'high' | 'medium' | 'low';
  };
  overallScore: number;
  status: 'verified' | 'pending' | 'failed';
}
```

---

## 3. 資料庫綱要 (Supabase)

### 3.1 資料表結構

```sql
-- 組織設定表
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  industry VARCHAR(100),
  employee_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 碳排放記錄表
CREATE TABLE emissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  reporting_period_start DATE NOT NULL,
  reporting_period_end DATE NOT NULL,
  
  -- 範疇一
  scope1_fixed_combustion DECIMAL(18, 4),    -- kg CO2e
  scope1_mobile_combustion DECIMAL(18, 4),   -- kg CO2e
  scope1_fugitive_emissions DECIMAL(18, 4), -- kg CO2e
  
  -- 範疇二
  scope2_electricity DECIMAL(18, 4),         -- kg CO2e
  scope2_heat DECIMAL(18, 4),               -- kg CO2e
  
  -- 範疇三
  scope3_purchased_goods DECIMAL(18, 4),
  scope3_capital_goods DECIMAL(18, 4),
  scope3_fuel_energy DECIMAL(18, 4),
  scope3_upstream_transport DECIMAL(18, 4),
  scope3_waste_generated DECIMAL(18, 4),
  scope3_business_travel DECIMAL(18, 4),
  scope3_employee_commuting DECIMAL(18, 4),
  scope3_downstream_transport DECIMAL(18, 4),
  
  total_emission DECIMAL(18, 4),
  
  -- 4T 驗證
  verification_hash VARCHAR(64),
  verification_signature VARCHAR(128),
  verification_status VARCHAR(20) DEFAULT 'pending',
  verification_score DECIMAL(5, 2),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 報告書表
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  type VARCHAR(20) NOT NULL,           -- gri, tcfd, sasb, carbon, esg
  title VARCHAR(500) NOT NULL,
  content TEXT,
  
  -- 元數據
  reporting_period_start DATE NOT NULL,
  reporting_period_end DATE NOT NULL,
  page_count INTEGER,
  word_count INTEGER,
  
  -- 4T 驗證
  verification_status VARCHAR(20) DEFAULT 'pending',
  verification_score DECIMAL(5, 2),
  verification_badge VARCHAR(20),
  
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 報告書版本表
CREATE TABLE report_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES reports(id),
  version VARCHAR(20) NOT NULL,
  content TEXT,
  changes TEXT[],                        -- 變更說明陣列
  hash VARCHAR(64),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 稽核日誌表
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  action VARCHAR(50) NOT NULL,
  user_id UUID,
  details JSONB,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 異常偵測記錄表
CREATE TABLE anomaly_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  field_name VARCHAR(100) NOT NULL,
  expected_range JSONB,                 -- { min, max }
  actual_value DECIMAL(18, 4),
  deviation DECIMAL(5, 2),
  severity VARCHAR(20),
  suggestion TEXT,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3.2 RLS (Row Level Security) 策略

```sql
-- 組織成員只能存取自己的資料
ALTER TABLE emissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own organization emissions"
  ON emissions FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
  ));

-- 組織管理員可以完全控制
CREATE POLICY "Admins can manage emissions"
  ON emissions FOR ALL
  USING (organization_id IN (
    SELECT organization_id FROM organization_members
    WHERE user_id = auth.uid() AND role = 'admin'
  ));
```

---

## 4. 排放係數資料庫

### 4.1 電力排放係數

| 地區 | 係數 (kg CO2e/kWh) | 來源 | 備註 |
|-----|-------------------|------|------|
| 台灣 | 0.509 | 台電 2023 | 預設值 |
| 日本 | 0.457 | TEPCO 2023 | |
| 韓國 | 0.424 | KEPCO 2023 | |
| 中國 | 0.555 | NEA 2023 | |
| 美國 (平均) | 0.386 | EPA 2023 | |
| 歐盟 (平均) | 0.276 | Eurostat 2023 | |

### 4.2 燃料排放係數

| 燃料類型 | 係數 | 單位 | 來源 |
|--------|------|------|------|
| 柴油 | 2.689 | kg CO2e/L | IPCC 2006 |
| 汽油 | 2.331 | kg CO2e/L | IPCC 2006 |
| 天然氣 | 2.020 | kg CO2e/m³ | IPCC 2006 |
| 液化石油氣 | 1.510 | kg CO2e/L | IPCC 2006 |
| 煤炭 (煙煤) | 2.420 | kg CO2e/kg | IPCC 2006 |
| 煤炭 (無煙煤) | 2.770 | kg CO2e/kg | IPCC 2006 |

### 4.3 GRI 指標對照表

| 指標代碼 | 名稱 | 類別 | 資料類型 |
|---------|------|------|----------|
| GRI 302-1 | 組織內部能源消耗量 | 環境 | 數值 |
| GRI 302-3 | 能源強度 | 環境 | 比率 |
| GRI 303-3 | 取水量 | 環境 | 數值 |
| GRI 305-1 | 直接溫室氣體排放 (範疇一) | 環境 | 數值 |
| GRI 305-2 | 能源間接溫室氣體排放 (範疇二) | 環境 | 數值 |
| GRI 305-3 | 其他間接溫室氣體排放 (範疇三) | 環境 | 數值 |
| GRI 305-4 | 溫室氣體排放強度 | 環境 | 比率 |
| GRI 306-3 | 廢棄物產生 | 環境 | 數值 |
| GRI 401-1 | 新進與離職員工 | 社會 | 數值 |
| GRI 403-9 | 職業傷害 | 社會 | 數值 |
| GRI 405-1 | 治理單位多元化 | 社會 | 比率 |

---

## 5. 完整使用流程

### 5.1 碳盤查流程

```
1. 選擇盤查範疇
   ├── 範疇一：直接排放
   │   ├── 固定燃燒 (鍋爐、發電機)
   │   ├── 移動燃燒 (公司車輛)
   │   └── 逸散排放 (冷媒)
   ├── 範疇二：能源間接排放
   │   ├── 外購電力
   │   └── 外購蒸汽/熱能
   └── 範疇三：其他間接排放
       ├── 採購商品
       ├── 商務差旅
       └── 員工通勤

2. 輸入數據
   ├── 手動輸入
   └── Excel 批次匯入

3. AI 自動計算
   ├── 套用排放係數
   └── 異常值偵測

4. 4T 驗證
   ├── 數位簽章
   ├── 版本鏈
   └── 信任徽章

5. 生成報告書
```

### 5.2 報告書生成流程

```
選擇報告書類型
    │
    ├── GRI 永續報告書
    │   └── 符合 GRI 2021 標準
    │
    ├── TCFD 氣候揭露
    │   └── 治理 / 策略 / 風險管理 / 指標與目標
    │
    ├── SASB 產業標準
    │   └── 環境 / 社會資本 / 人力資本 / 商業模式 / 治理
    │
    └── 碳盤查報告書
        └── ISO 14064-1 結構

    ↓

AI 智能生成
    ├── 數據分析
    ├── 指標計算
    └── 建議生成

    ↓

4T 驗證
    ├── Truth：數位簽章
    ├── Transparency：透明度評分
    ├── Traceability：版本追蹤
    └── Trust：信任徽章

    ↓

匯出交付
    ├── PDF 格式
    ├── Word 格式
    └── HTML 格式
```

---

## 6. 部署指南

### 6.1 環境變數

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Gemini API
GEMINI_API_KEY=your_gemini_api_key

# 應用設定
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 6.2 開發環境啟動

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev

# 執行測試
npm run test

# 類型檢查
npm run type-check
```

### 6.3 生產環境部署

```bash
# 建置
npm run build

# 部署到 Vercel
npx vercel --prod
```

---

## 7. 版本歷史

| 版本 | 日期 | 變更說明 |
|-----|------|----------|
| 1.0.0 | 2024-10-20 | 初始版本 |
| 1.1.0 | 2024-11-15 | 新增 TCFD 報告書模板 |
| 1.2.0 | 2024-12-01 | 新增 SASB 報告書模板 |
| 1.3.0 | 2025-01-10 | 新增 4T 驗證機制 |
| 1.4.0 | 2025-02-01 | 新增 War Room 指揮中心 |

---

## 8. 技術支援

### 聯繫方式
- 技術支援：support@esgss.com
- 文件網站：docs.esgss.com
- GitHub：github.com/esgss

### 常見問題
1. **如何新增自訂排放係數？**
   - 在後台「設定」→「排放係數管理」中新增
   
2. **如何整合第三方 API？**
   - 使用「整合中心」功能設定 API 金鑰與端點

3. **報告書支援哪些語言？**
   - 目前支援繁體中文 (zh-TW) 與英文 (en-US)
