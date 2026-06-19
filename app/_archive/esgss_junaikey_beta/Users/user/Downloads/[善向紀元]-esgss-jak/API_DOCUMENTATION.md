# 🌟 ESGss JunAiKey API 文檔
## ESG Sunshine Universal System v2.0 - Seraphim Edition

**版本**: 2.0.0
**最後更新**: 2026-01-04
**API 版本**: v1

---

## 📋 目錄

1. [概述](#概述)
2. [快速開始](#快速開始)
3. [認證](#認證)
4. [API 端點](#api-端點)
   - [健康檢查](#健康檢查)
   - [ESG 數據](#esg-數據)
   - [AI 分析](#ai-分析)
   - [趨勢預測](#趨勢預測)
   - [系統事件](#系統事件)
   - [Webhook 整合](#webhook-整合)
5. [錯誤處理](#錯誤處理)
6. [數據格式](#數據格式)
7. [部署指南](#部署指南)
8. [支持](#支持)

---

## 📖 概述

ESGss JunAiKey API 是 ESG Sunshine Universal System 的核心 API，提供完整的 ESG (環境、社會、治理) 數據管理、AI 智慧分析、趨勢預測和自動化整合功能。

### 🎯 主要功能

- **ESG 數據管理**: 完整的 ESG 指標數據存儲和檢索
- **AI 智慧分析**: 基於 Gemini/OpenAI 的深度 ESG 分析
- **趨勢預測**: AI 驅動的 ESG 趨勢分析和預測
- **自動化整合**: Make.com 和 Boost.space webhook 支持
- **實時監控**: 系統健康檢查和事件追蹤

### 🔧 技術規格

- **協議**: HTTP/HTTPS
- **數據格式**: JSON
- **編碼**: UTF-8
- **響應時間**: < 500ms (平均)
- **可用性**: 99.9% SLA

---

## 🚀 快速開始

### 基本請求

```bash
# 健康檢查
curl -X GET "http://localhost:3001/health"

# ESG 數據獲取
curl -X GET "http://localhost:3001/api/v1/esg-data"

# AI 分析請求
curl -X POST "http://localhost:3001/api/v1/analyze" \
  -H "Content-Type: application/json" \
  -d '{"data": {"carbon": 12500}, "type": "trend_analysis"}'
```

### JavaScript 示例

```javascript
// 使用 fetch API
const response = await fetch('/api/v1/esg-data');
const data = await response.json();

// AI 分析請求
const analysis = await fetch('/api/v1/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    data: { carbonEmissions: 12500 },
    type: 'environmental_impact'
  })
});
```

---

## 🔐 認證

目前版本使用簡單的 API 金鑰認證，生產環境建議使用 JWT 或 OAuth 2.0。

### API 金鑰設置

```bash
# 環境變數設置
export ESG_API_KEY="your-api-key-here"

# 或在請求頭中設置
curl -H "X-API-Key: your-api-key" \
     "http://localhost:3001/api/v1/esg-data"
```

### 未來認證升級

- JWT Bearer Token 認證
- OAuth 2.0 流程
- 多租戶 API 金鑰管理

---

## 📡 API 端點

### 基礎 URL

```
http://localhost:3001/api/v1
```

所有 API 端點都支持 CORS，並返回標準的 JSON 響應格式。

### 🔍 健康檢查

檢查 API 服務的健康狀態。

**端點**: `GET /health`

**響應示例**:
```json
{
  "status": "healthy",
  "timestamp": "2026-01-04T17:21:24.305Z",
  "version": "2.0.0",
  "environment": "development"
}
```

---

### 📊 ESG 數據

#### 獲取 ESG 數據

**端點**: `GET /api/v1/esg-data`

**描述**: 獲取最新的 ESG 指標數據

**響應示例**:
```json
{
  "success": true,
  "data": {
    "environmental": {
      "carbonEmissions": 12500.50,
      "energyConsumption": 87500.25,
      "waterUsage": 45200.75,
      "wasteGeneration": 1250.30
    },
    "social": {
      "employeeCount": 1250,
      "diversityRatio": 0.42,
      "trainingHours": 25600,
      "communityInvestment": 125000.00
    },
    "governance": {
      "boardIndependence": 0.75,
      "executiveCompensation": 2500000.00,
      "riskManagementScore": 0.88,
      "transparencyScore": 0.92
    }
  },
  "timestamp": "2026-01-04T17:21:24.305Z"
}
```

#### 數據字段說明

| 字段 | 類型 | 描述 | 單位 |
|------|------|------|------|
| carbonEmissions | number | 碳排放量 | 噸 CO₂e |
| energyConsumption | number | 能源消耗 | kWh |
| waterUsage | number | 水資源使用 | 立方米 |
| wasteGeneration | number | 廢棄物產生 | 噸 |
| employeeCount | integer | 員工人數 | 人 |
| diversityRatio | number | 多樣性比例 | 0-1 |
| trainingHours | integer | 培训小时 | 小时 |
| communityInvestment | number | 社区投资 | 美元 |
| boardIndependence | number | 董事会独立性 | 0-1 |
| executiveCompensation | number | 高管薪酬 | 美元 |
| riskManagementScore | number | 风险管理评分 | 0-1 |
| transparencyScore | number | 透明度评分 | 0-1 |

---

### 🤖 AI 分析

#### 請求 AI 分析

**端點**: `POST /api/v1/analyze`

**請求體**:
```json
{
  "data": {
    "carbonEmissions": 12500,
    "energyConsumption": 87500
  },
  "type": "trend_analysis"
}
```

**響應示例**:
```json
{
  "success": true,
  "data": {
    "type": "trend_analysis",
    "insights": [
      "碳排放量較去年同期下降8%",
      "能源效率提升15%",
      "建議投資再生能源項目"
    ],
    "recommendations": [
      "實施能源管理系統",
      "開發碳中和計劃",
      "優化供應鏈排放"
    ],
    "confidence": 0.89,
    "timestamp": "2026-01-04T17:21:24.305Z"
  }
}
```

#### 支持的分析類型

| 類型 | 描述 | 輸入數據 |
|------|------|----------|
| trend_analysis | 趨勢分析 | 時間序列數據 |
| environmental_impact | 環境影響評估 | ESG 環境指標 |
| social_impact | 社會影響分析 | ESG 社會指標 |
| governance_assessment | 治理評估 | ESG 治理指標 |
| risk_assessment | 風險評估 | 綜合風險數據 |

---

### 📈 趨勢預測

#### 獲取趨勢預測

**端點**: `GET /api/v1/trends`

**響應示例**:
```json
{
  "success": true,
  "data": {
    "carbonEmissions": {
      "current": 12500.50,
      "prediction": 11250.45,
      "change": -10.0,
      "confidence": 0.85
    },
    "energyConsumption": {
      "current": 87500.25,
      "prediction": 83250.24,
      "change": -4.8,
      "confidence": 0.78
    },
    "employeeSatisfaction": {
      "current": 4.2,
      "prediction": 4.4,
      "change": 4.8,
      "confidence": 0.92
    }
  },
  "period": "next_quarter"
}
```

#### 預測字段說明

| 字段 | 類型 | 描述 |
|------|------|------|
| current | number | 當前值 |
| prediction | number | 預測值 |
| change | number | 變化百分比 |
| confidence | number | 預測置信度 (0-1) |

---

### 📝 系統事件

#### 獲取系統事件

**端點**: `GET /api/v1/events`

**響應示例**:
```json
{
  "success": true,
  "data": [
    {
      "id": "evt_001",
      "type": "data_sync",
      "severity": "info",
      "message": "ESG數據同步完成",
      "timestamp": "2026-01-04T17:21:24.305Z"
    },
    {
      "id": "evt_002",
      "type": "ai_analysis",
      "severity": "info",
      "message": "AI趨勢分析完成",
      "timestamp": "2026-01-04T17:20:24.305Z"
    }
  ]
}
```

#### 事件類型

| 類型 | 嚴重性 | 描述 |
|------|--------|------|
| data_sync | info | 數據同步事件 |
| ai_analysis | info | AI 分析完成 |
| system_error | error | 系統錯誤 |
| security_alert | warning | 安全警報 |
| performance_issue | warning | 性能問題 |

---

### 🔗 Webhook 整合

#### webhook 端點

**端點**: `POST /api/v1/webhook/{service}`

支持的服務: `make`, `boost`

**Make.com webhook 示例**:
```json
{
  "event": "esg_data_updated",
  "data": {
    "company": "ABC Corp",
    "metrics": {
      "carbon": 12500,
      "energy": 87500
    }
  },
  "timestamp": "2026-01-04T17:21:24.305Z"
}
```

**Boost.space webhook 示例**:
```json
{
  "webhook": {
    "id": "boost_webhook_123",
    "event": "scenario_completed",
    "data": {
      "scenarioId": "esg_analysis_001",
      "result": "success"
    }
  }
}
```

---

## ⚠️ 錯誤處理

所有 API 錯誤都遵循統一的錯誤響應格式：

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "請求數據無效",
    "details": {
      "field": "data.type",
      "reason": "必須是有效的分析類型"
    }
  },
  "timestamp": "2026-01-04T17:21:24.305Z"
}
```

### HTTP 狀態碼

| 狀態碼 | 描述 | 示例 |
|--------|------|------|
| 200 | 成功 | 正常響應 |
| 400 | 請求錯誤 | 參數無效 |
| 401 | 未授權 | API 金鑰無效 |
| 403 | 禁止訪問 | 權限不足 |
| 404 | 未找到 | 端點不存在 |
| 429 | 請求過多 | 超出速率限制 |
| 500 | 服務器錯誤 | 內部錯誤 |
| 503 | 服務不可用 | 服務維護中 |

### 常見錯誤碼

| 錯誤碼 | 描述 |
|--------|------|
| VALIDATION_ERROR | 請求驗證失敗 |
| UNAUTHORIZED | 未授權訪問 |
| NOT_FOUND | 資源不存在 |
| RATE_LIMITED | 請求頻率超限 |
| INTERNAL_ERROR | 內部服務器錯誤 |
| SERVICE_UNAVAILABLE | 服務暫時不可用 |

---

## 📋 數據格式

### 請求格式

所有 POST 請求都應使用 JSON 格式：

```json
{
  "Content-Type": "application/json",
  "Accept": "application/json"
}
```

### 響應格式

標準響應結構：

```json
{
  "success": true|false,
  "data": { ... } | null,
  "error": { ... } | null,
  "timestamp": "ISO 8601 格式時間戳"
}
```

### 數據類型

| 類型 | 描述 | 示例 |
|------|------|------|
| string | 字符串 | "trend_analysis" |
| number | 數字 | 12500.50 |
| integer | 整數 | 1250 |
| boolean | 布爾值 | true |
| object | 對象 | {"key": "value"} |
| array | 數組 | [1, 2, 3] |

---

## 🚀 部署指南

### Docker 部署

```bash
# 1. 克隆項目
git clone https://github.com/your-org/esgss-junai.git
cd esgss-junai

# 2. 配置環境變數
cp .env.example .env
# 編輯 .env 文件設置 API 金鑰等

# 3. 啟動服務
docker-compose up -d

# 4. 檢查健康狀態
curl http://localhost:3001/health
```

### 環境變數

```bash
# 必需變數
NODE_ENV=production
PORT=3001

# 可選變數
ESG_API_KEY=your-secret-key
GEMINI_API_KEY=your-gemini-key
OPENAI_API_KEY=your-openai-key

# 數據庫配置
DATABASE_URL=postgresql://user:pass@localhost:5432/esg_db

# Redis 配置
REDIS_URL=redis://localhost:6379
```

### 生產環境配置

```nginx
# nginx.conf 配置示例
server {
    listen 80;
    server_name api.esg-dashboard.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

---

## 🆘 支持

### 聯絡方式

- **技術支持**: support@esg-dashboard.com
- **文檔更新**: https://github.com/DingJun1028/esgss-junai
- **問題反饋**: https://github.com/DingJun1028/esgss-junai/issues

### 版本歷史

| 版本 | 日期 | 主要更新 |
|------|------|----------|
| 2.0.0 | 2026-01-04 | 首次發佈 Seraphim Edition |
| 1.5.0 | 2025-12-15 | 添加 AI 分析功能 |
| 1.0.0 | 2025-10-01 | 初始版本發佈 |

### 致謝

感謝所有為 ESG Sunshine Universal System 做出貢獻的開發者和用戶。您的支持讓可持續發展變得更容易實現！

---

*本文檔由 ESGss JunAiKey API 自動生成。最後更新時間：2026-01-04 17:21:24 UTC+8*