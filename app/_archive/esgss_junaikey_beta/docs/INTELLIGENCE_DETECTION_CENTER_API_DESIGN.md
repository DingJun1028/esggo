# 商情偵測中心 API 設計文件

**文件版本：** v1.0  
**建立日期：** 2026-02-11  
**文件狀態：** 正式版  
**適用範圍：** ESGss JunAiKey 平台商情偵測中心 API

---

## 📋 目錄

1. [執行摘要](#1-執行摘要)
2. [API 概覽](#2-api-概覽)
3. [認證與授權](#3-認證與授權)
4. [情報 API](#4-情報-api)
5. [分析 API](#5-分析-api)
6. [通知 API](#6-通知-api)
7. [偏好 API](#7-偏好-api)
8. [錯誤處理](#8-錯誤處理)
9. [速率限制](#9-速率限制)
10. [Webhook](#10-webhook)

---

## 1. 執行摘要

### 1.1 文件目的

本文件定義商情偵測中心的完整 API 設計，包括端點、請求/回應格式、認證機制、錯誤處理和速率限制。

### 1.2 API 基礎資訊

| 項目 | 值 |
|------|-----|
| **Base URL** | `https://api.esgss-junaikey.com/v1` |
| **協議** | HTTPS |
| **資料格式** | JSON |
| **字元編碼** | UTF-8 |
| **認證方式** | Bearer Token (JWT) |

### 1.3 API 版本控制

API 使用 URL 路徑版本控制：

```
https://api.esgss-junaikey.com/v1/intelligence/items
```

---

## 2. API 概覽

### 2.1 API 端點分類

| 分類 | 端點數量 | 描述 |
|------|----------|------|
| **情報 API** | 5 | 情報項目的 CRUD 操作 |
| **分析 API** | 3 | 情報分析功能 |
| **通知 API** | 4 | 通知管理功能 |
| **偏好 API** | 2 | 用戶偏好設定 |
| **總計** | 14 | - |

### 2.2 API 端點列表

| 方法 | 端點 | 描述 |
|------|------|------|
| GET | `/intelligence/items` | 取得情報項目列表 |
| GET | `/intelligence/items/:id` | 取得單一情報項目 |
| POST | `/intelligence/items` | 建立情報項目 |
| PUT | `/intelligence/items/:id` | 更新情報項目 |
| DELETE | `/intelligence/items/:id` | 刪除情報項目 |
| POST | `/intelligence/analysis/:intelligenceId` | 分析情報項目 |
| GET | `/intelligence/analysis/:intelligenceId` | 取得分析結果 |
| GET | `/intelligence/trends/:category` | 取得趨勢預測 |
| GET | `/intelligence/notifications` | 取得用戶通知 |
| PUT | `/intelligence/notifications/:id/read` | 標記通知為已讀 |
| PUT | `/intelligence/notifications/read-all` | 標記所有通知為已讀 |
| DELETE | `/intelligence/notifications/:id` | 刪除通知 |
| GET | `/intelligence/preferences` | 取得用戶偏好 |
| PUT | `/intelligence/preferences` | 更新用戶偏好 |

---

## 3. 認證與授權

### 3.1 認證方式

API 使用 Bearer Token (JWT) 認證：

```http
Authorization: Bearer <JWT_TOKEN>
```

### 3.2 取得 Token

用戶需要透過登入端點取得 JWT Token：

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**回應：**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600,
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "role": "user"
    }
  }
}
```

### 3.3 Token 刷新

Token 過期後可以使用 Refresh Token 刷新：

```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "refresh_token_here"
}
```

### 3.4 權限等級

| 等級 | 描述 | 權限 |
|------|------|------|
| **admin** | 管理員 | 所有 API 端點 |
| **user** | 一般用戶 | 情報查詢、偏好設定 |
| **read-only** | 唯讀用戶 | 僅 GET 端點 |

---

## 4. 情報 API

### 4.1 取得情報項目列表

**端點：** `GET /intelligence/items`

**Query Parameters:**

| 參數 | 類型 | 必填 | 描述 | 預設值 |
|------|------|------|------|--------|
| `page` | number | 否 | 頁碼 | 1 |
| `limit` | number | 否 | 每頁數量 | 20 |
| `category` | string | 否 | 情報類別 | - |
| `priority` | string | 否 | 優先級 | - |
| `impactLevel` | string | 否 | 影響等級 | - |
| `persona` | string | 否 | 角色類型 | - |
| `search` | string | 否 | 搜尋關鍵字 | - |
| `startDate` | string | 否 | 開始日期 (ISO 8601) | - |
| `endDate` | string | 否 | 結束日期 (ISO 8601) | - |
| `sortBy` | string | 否 | 排序欄位 | `createdAt` |
| `sortOrder` | string | 否 | 排序方向 | `desc` |

**請求範例：**
```http
GET /intelligence/items?page=1&limit=20&category=regulatory_update&priority=high
Authorization: Bearer <JWT_TOKEN>
```

**回應範例：**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "int_123",
        "title": "台灣碳稅法規更新",
        "summary": "環保署公告新的碳稅法規，預計 2027 年實施",
        "content": "詳細內容...",
        "source": "環保署",
        "sourceUrl": "https://example.com/article",
        "category": "regulatory_update",
        "priority": "high",
        "relevanceScore": 85,
        "impactLevel": "high",
        "createdAt": "2026-02-11T00:00:00Z",
        "updatedAt": "2026-02-11T00:00:00Z",
        "publishedAt": "2026-02-10T00:00:00Z",
        "tags": ["碳稅", "法規", "台灣"],
        "relatedStandards": ["GRI 305", "SASB CG-AC-430a"],
        "suggestedActions": [
          {
            "id": "action_1",
            "title": "評估碳稅影響",
            "description": "評估新碳稅法規對公司的影響",
            "priority": "high",
            "estimatedCost": {
              "min": 500000,
              "max": 1000000,
              "currency": "TWD"
            },
            "deadline": "2026-03-31T00:00:00Z",
            "status": "pending"
          }
        ],
        "personaRelevance": [
          {
            "persona": "ceo",
            "relevanceScore": 90,
            "customSummary": "⚠️ 風險：新碳稅法規可能增加營運成本 5-10%",
            "customActions": ["召開策略會議", "評估成本影響"]
          }
        ],
        "metadata": {
          "author": "環保署",
          "language": "zh-TW",
          "region": "TW",
          "industry": "all",
          "sentiment": "neutral",
          "confidence": 0.95
        }
      }
    ],
    "total": 100,
    "page": 1,
    "limit": 20,
    "hasMore": true
  }
}
```

### 4.2 取得單一情報項目

**端點：** `GET /intelligence/items/:id`

**路徑參數：**

| 參數 | 類型 | 必填 | 描述 |
|------|------|------|------|
| `id` | string | 是 | 情報項目 ID |

**請求範例：**
```http
GET /intelligence/items/int_123
Authorization: Bearer <JWT_TOKEN>
```

**回應範例：**
```json
{
  "success": true,
  "data": {
    "id": "int_123",
    "title": "台灣碳稅法規更新",
    "summary": "環保署公告新的碳稅法規，預計 2027 年實施",
    "content": "詳細內容...",
    "source": "環保署",
    "sourceUrl": "https://example.com/article",
    "category": "regulatory_update",
    "priority": "high",
    "relevanceScore": 85,
    "impactLevel": "high",
    "createdAt": "2026-02-11T00:00:00Z",
    "updatedAt": "2026-02-11T00:00:00Z",
    "publishedAt": "2026-02-10T00:00:00Z",
    "tags": ["碳稅", "法規", "台灣"],
    "relatedStandards": ["GRI 305", "SASB CG-AC-430a"],
    "suggestedActions": [...],
    "personaRelevance": [...],
    "metadata": {...}
  }
}
```

### 4.3 建立情報項目

**端點：** `POST /intelligence/items`

**權限：** admin

**請求 Body：**
```json
{
  "title": "台灣碳稅法規更新",
  "summary": "環保署公告新的碳稅法規，預計 2027 年實施",
  "content": "詳細內容...",
  "source": "環保署",
  "sourceUrl": "https://example.com/article",
  "category": "regulatory_update",
  "priority": "high",
  "tags": ["碳稅", "法規", "台灣"],
  "relatedStandards": ["GRI 305", "SASB CG-AC-430a"]
}
```

**回應範例：**
```json
{
  "success": true,
  "data": {
    "id": "int_123",
    "title": "台灣碳稅法規更新",
    "summary": "環保署公告新的碳稅法規，預計 2027 年實施",
    "content": "詳細內容...",
    "source": "環保署",
    "sourceUrl": "https://example.com/article",
    "category": "regulatory_update",
    "priority": "high",
    "relevanceScore": 85,
    "impactLevel": "high",
    "createdAt": "2026-02-11T00:00:00Z",
    "updatedAt": "2026-02-11T00:00:00Z",
    "publishedAt": "2026-02-11T00:00:00Z",
    "tags": ["碳稅", "法規", "台灣"],
    "relatedStandards": ["GRI 305", "SASB CG-AC-430a"],
    "suggestedActions": [],
    "personaRelevance": [],
    "metadata": {
      "author": "admin",
      "language": "zh-TW",
      "region": "TW",
      "industry": "all",
      "sentiment": "neutral",
      "confidence": 1.0
    }
  }
}
```

### 4.4 更新情報項目

**端點：** `PUT /intelligence/items/:id`

**權限：** admin

**路徑參數：**

| 參數 | 類型 | 必填 | 描述 |
|------|------|------|------|
| `id` | string | 是 | 情報項目 ID |

**請求 Body：**
```json
{
  "title": "台灣碳稅法規更新（更新版）",
  "summary": "環保署公告新的碳稅法規，預計 2027 年實施，影響範圍擴大",
  "priority": "critical"
}
```

**回應範例：**
```json
{
  "success": true,
  "data": {
    "id": "int_123",
    "title": "台灣碳稅法規更新（更新版）",
    "summary": "環保署公告新的碳稅法規，預計 2027 年實施，影響範圍擴大",
    "content": "詳細內容...",
    "source": "環保署",
    "sourceUrl": "https://example.com/article",
    "category": "regulatory_update",
    "priority": "critical",
    "relevanceScore": 85,
    "impactLevel": "high",
    "createdAt": "2026-02-11T00:00:00Z",
    "updatedAt": "2026-02-11T01:00:00Z",
    "publishedAt": "2026-02-11T00:00:00Z",
    "tags": ["碳稅", "法規", "台灣"],
    "relatedStandards": ["GRI 305", "SASB CG-AC-430a"],
    "suggestedActions": [],
    "personaRelevance": [],
    "metadata": {...}
  }
}
```

### 4.5 刪除情報項目

**端點：** `DELETE /intelligence/items/:id`

**權限：** admin

**路徑參數：**

| 參數 | 類型 | 必填 | 描述 |
|------|------|------|------|
| `id` | string | 是 | 情報項目 ID |

**請求範例：**
```http
DELETE /intelligence/items/int_123
Authorization: Bearer <JWT_TOKEN>
```

**回應範例：**
```json
{
  "success": true,
  "message": "情報項目已刪除"
}
```

---

## 5. 分析 API

### 5.1 分析情報項目

**端點：** `POST /intelligence/analysis/:intelligenceId`

**路徑參數：**

| 參數 | 類型 | 必填 | 描述 |
|------|------|------|------|
| `intelligenceId` | string | 是 | 情報項目 ID |

**請求 Body：**
```json
{
  "analysisTypes": ["sentiment", "relevance", "impact", "trend", "risk"]
}
```

**回應範例：**
```json
{
  "success": true,
  "data": [
    {
      "id": "analysis_1",
      "intelligenceId": "int_123",
      "analysisType": "sentiment",
      "result": {
        "score": 0.3,
        "details": {
          "positive": 0.2,
          "negative": 0.5,
          "neutral": 0.3
        },
        "recommendations": ["建議關注負面情緒", "準備回應策略"]
      },
      "createdAt": "2026-02-11T00:00:00Z",
      "processedBy": "ai",
      "confidence": 0.95
    },
    {
      "id": "analysis_2",
      "intelligenceId": "int_123",
      "analysisType": "relevance",
      "result": {
        "score": 85,
        "details": {
          "environmental": 90,
          "social": 70,
          "governance": 95
        },
        "recommendations": ["高度相關，建議優先處理"]
      },
      "createdAt": "2026-02-11T00:00:00Z",
      "processedBy": "ai",
      "confidence": 0.92
    }
  ]
}
```

### 5.2 取得分析結果

**端點：** `GET /intelligence/analysis/:intelligenceId`

**路徑參數：**

| 參數 | 類型 | 必填 | 描述 |
|------|------|------|------|
| `intelligenceId` | string | 是 | 情報項目 ID |

**Query Parameters:**

| 參數 | 類型 | 必填 | 描述 | 預設值 |
|------|------|------|------|--------|
| `analysisType` | string | 否 | 分析類型 | - |

**請求範例：**
```http
GET /intelligence/analysis/int_123?analysisType=sentiment
Authorization: Bearer <JWT_TOKEN>
```

**回應範例：**
```json
{
  "success": true,
  "data": [
    {
      "id": "analysis_1",
      "intelligenceId": "int_123",
      "analysisType": "sentiment",
      "result": {
        "score": 0.3,
        "details": {
          "positive": 0.2,
          "negative": 0.5,
          "neutral": 0.3
        },
        "recommendations": ["建議關注負面情緒", "準備回應策略"]
      },
      "createdAt": "2026-02-11T00:00:00Z",
      "processedBy": "ai",
      "confidence": 0.95
    }
  ]
}
```

### 5.3 取得趨勢預測

**端點：** `GET /intelligence/trends/:category`

**路徑參數：**

| 參數 | 類型 | 必填 | 描述 |
|------|------|------|------|
| `category` | string | 是 | 情報類別 |

**Query Parameters:**

| 參數 | 類型 | 必填 | 描述 | 預設值 |
|------|------|------|------|--------|
| `timeframe` | string | 否 | 時間範圍 | `6m` |
| `region` | string | 否 | 地區 | - |

**請求範例：**
```http
GET /intelligence/trends/regulatory_update?timeframe=6m&region=TW
Authorization: Bearer <JWT_TOKEN>
```

**回應範例：**
```json
{
  "success": true,
  "data": {
    "category": "regulatory_update",
    "timeframe": "6m",
    "region": "TW",
    "trend": "increasing",
    "confidence": 0.85,
    "predictions": [
      {
        "date": "2026-03-01",
        "value": 15,
        "description": "預計 3 月將有 15 項法規更新"
      },
      {
        "date": "2026-04-01",
        "value": 20,
        "description": "預計 4 月將有 20 項法規更新"
      }
    ],
    "recommendations": [
      "建議提前準備法規合規",
      "關注碳稅相關法規"
    ]
  }
}
```

---

## 6. 通知 API

### 6.1 取得用戶通知

**端點：** `GET /intelligence/notifications`

**Query Parameters:**

| 參數 | 類型 | 必填 | 描述 | 預設值 |
|------|------|------|------|--------|
| `page` | number | 否 | 頁碼 | 1 |
| `limit` | number | 否 | 每頁數量 | 20 |
| `unreadOnly` | boolean | 否 | 僅未讀 | false |
| `type` | string | 否 | 通知類型 | - |

**請求範例：**
```http
GET /intelligence/notifications?page=1&limit=20&unreadOnly=true
Authorization: Bearer <JWT_TOKEN>
```

**回應範例：**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "notif_1",
        "userId": "user_123",
        "intelligenceId": "int_123",
        "type": "new_intelligence",
        "title": "新情報：台灣碳稅法規更新",
        "message": "環保署公告新的碳稅法規，預計 2027 年實施",
        "read": false,
        "createdAt": "2026-02-11T00:00:00Z",
        "expiresAt": "2026-02-18T00:00:00Z",
        "actionUrl": "/intelligence/items/int_123"
      }
    ],
    "total": 50,
    "unreadCount": 10
  }
}
```

### 6.2 標記通知為已讀

**端點：** `PUT /intelligence/notifications/:id/read`

**路徑參數：**

| 參數 | 類型 | 必填 | 描述 |
|------|------|------|------|
| `id` | string | 是 | 通知 ID |

**請求範例：**
```http
PUT /intelligence/notifications/notif_1/read
Authorization: Bearer <JWT_TOKEN>
```

**回應範例：**
```json
{
  "success": true,
  "data": {
    "id": "notif_1",
    "userId": "user_123",
    "intelligenceId": "int_123",
    "type": "new_intelligence",
    "title": "新情報：台灣碳稅法規更新",
    "message": "環保署公告新的碳稅法規，預計 2027 年實施",
    "read": true,
    "createdAt": "2026-02-11T00:00:00Z",
    "expiresAt": "2026-02-18T00:00:00Z",
    "actionUrl": "/intelligence/items/int_123"
  }
}
```

### 6.3 標記所有通知為已讀

**端點：** `PUT /intelligence/notifications/read-all`

**請求範例：**
```http
PUT /intelligence/notifications/read-all
Authorization: Bearer <JWT_TOKEN>
```

**回應範例：**
```json
{
  "success": true,
  "message": "所有通知已標記為已讀",
  "data": {
    "updatedCount": 10
  }
}
```

### 6.4 刪除通知

**端點：** `DELETE /intelligence/notifications/:id`

**路徑參數：**

| 參數 | 類型 | 必填 | 描述 |
|------|------|------|------|
| `id` | string | 是 | 通知 ID |

**請求範例：**
```http
DELETE /intelligence/notifications/notif_1
Authorization: Bearer <JWT_TOKEN>
```

**回應範例：**
```json
{
  "success": true,
  "message": "通知已刪除"
}
```

---

## 7. 偏好 API

### 7.1 取得用戶偏好

**端點：** `GET /intelligence/preferences`

**請求範例：**
```http
GET /intelligence/preferences
Authorization: Bearer <JWT_TOKEN>
```

**回應範例：**
```json
{
  "success": true,
  "data": {
    "id": "pref_1",
    "userId": "user_123",
    "persona": "ceo",
    "preferredCategories": ["regulatory_update", "risk_alert"],
    "preferredPriorities": ["high", "critical"],
    "preferredIndustries": ["manufacturing", "technology"],
    "preferredRegions": ["TW", "CN"],
    "notificationSettings": {
      "email": true,
      "push": true,
      "inApp": true,
      "frequency": "daily",
      "quietHours": {
        "start": "22:00",
        "end": "08:00"
      }
    },
    "dashboardLayout": {
      "sections": [
        {
          "id": "daily_briefing",
          "type": "daily_briefing",
          "position": 1,
          "visible": true,
          "config": {}
        },
        {
          "id": "trend_prediction",
          "type": "trend_prediction",
          "position": 2,
          "visible": true,
          "config": {}
        }
      ]
    },
    "createdAt": "2026-02-11T00:00:00Z",
    "updatedAt": "2026-02-11T00:00:00Z"
  }
}
```

### 7.2 更新用戶偏好

**端點：** `PUT /intelligence/preferences`

**請求 Body：**
```json
{
  "persona": "ceo",
  "preferredCategories": ["regulatory_update", "risk_alert", "opportunity"],
  "preferredPriorities": ["high", "critical"],
  "preferredIndustries": ["manufacturing", "technology"],
  "preferredRegions": ["TW", "CN", "JP"],
  "notificationSettings": {
    "email": true,
    "push": true,
    "inApp": true,
    "frequency": "daily",
    "quietHours": {
      "start": "22:00",
      "end": "08:00"
    }
  },
  "dashboardLayout": {
    "sections": [
      {
        "id": "daily_briefing",
        "type": "daily_briefing",
        "position": 1,
        "visible": true,
        "config": {}
      },
      {
        "id": "trend_prediction",
        "type": "trend_prediction",
        "position": 2,
        "visible": true,
        "config": {}
      }
    ]
  }
}
```

**回應範例：**
```json
{
  "success": true,
  "data": {
    "id": "pref_1",
    "userId": "user_123",
    "persona": "ceo",
    "preferredCategories": ["regulatory_update", "risk_alert", "opportunity"],
    "preferredPriorities": ["high", "critical"],
    "preferredIndustries": ["manufacturing", "technology"],
    "preferredRegions": ["TW", "CN", "JP"],
    "notificationSettings": {
      "email": true,
      "push": true,
      "inApp": true,
      "frequency": "daily",
      "quietHours": {
        "start": "22:00",
        "end": "08:00"
      }
    },
    "dashboardLayout": {
      "sections": [
        {
          "id": "daily_briefing",
          "type": "daily_briefing",
          "position": 1,
          "visible": true,
          "config": {}
        },
        {
          "id": "trend_prediction",
          "type": "trend_prediction",
          "position": 2,
          "visible": true,
          "config": {}
        }
      ]
    },
    "createdAt": "2026-02-11T00:00:00Z",
    "updatedAt": "2026-02-11T01:00:00Z"
  }
}
```

---

## 8. 錯誤處理

### 8.1 錯誤回應格式

所有錯誤回應都遵循以下格式：

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "錯誤訊息",
    "details": {
      "field": "錯誤欄位",
      "reason": "錯誤原因"
    }
  }
}
```

### 8.2 HTTP 狀態碼

| 狀態碼 | 描述 |
|--------|------|
| 200 | 成功 |
| 201 | 已建立 |
| 400 | 請求錯誤 |
| 401 | 未授權 |
| 403 | 禁止存取 |
| 404 | 資源不存在 |
| 429 | 請求過多 |
| 500 | 伺服器錯誤 |

### 8.3 錯誤代碼

| 錯誤代碼 | HTTP 狀態碼 | 描述 |
|----------|-------------|------|
| `INVALID_REQUEST` | 400 | 請求格式錯誤 |
| `MISSING_PARAMETER` | 400 | 缺少必要參數 |
| `INVALID_PARAMETER` | 400 | 參數值無效 |
| `UNAUTHORIZED` | 401 | 未授權 |
| `INVALID_TOKEN` | 401 | Token 無效 |
| `TOKEN_EXPIRED` | 401 | Token 過期 |
| `FORBIDDEN` | 403 | 禁止存取 |
| `NOT_FOUND` | 404 | 資源不存在 |
| `RATE_LIMIT_EXCEEDED` | 429 | 超過速率限制 |
| `INTERNAL_ERROR` | 500 | 內部伺服器錯誤 |

### 8.4 錯誤回應範例

**未授權：**
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "未授權存取",
    "details": {}
  }
}
```

**資源不存在：**
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "情報項目不存在",
    "details": {
      "id": "int_999"
    }
  }
}
```

**參數錯誤：**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_PARAMETER",
    "message": "參數值無效",
    "details": {
      "field": "priority",
      "reason": "priority 必須是 critical, high, medium, low 其中之一"
    }
  }
}
```

---

## 9. 速率限制

### 9.1 速率限制規則

| 等級 | 限制 | 時間窗口 |
|------|------|----------|
| **免費用戶** | 100 請求 | 1 小時 |
| **付費用戶** | 1000 請求 | 1 小時 |
| **企業用戶** | 10000 請求 | 1 小時 |

### 9.2 速率限制標頭

API 回應會包含以下標頭：

| 標頭 | 描述 |
|------|------|
| `X-RateLimit-Limit` | 時間窗口內的請求限制 |
| `X-RateLimit-Remaining` | 剩餘請求數量 |
| `X-RateLimit-Reset` | 限制重置時間 (Unix timestamp) |

### 9.3 超過限制回應

當超過速率限制時，API 會回傳 429 狀態碼：

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "超過速率限制",
    "details": {
      "limit": 100,
      "remaining": 0,
      "resetAt": 1676169600
    }
  }
}
```

---

## 10. Webhook

### 10.1 Webhook 事件類型

| 事件類型 | 描述 |
|----------|------|
| `intelligence.created` | 情報項目已建立 |
| `intelligence.updated` | 情報項目已更新 |
| `intelligence.deleted` | 情報項目已刪除 |
| `notification.created` | 通知已建立 |
| `analysis.completed` | 分析已完成 |

### 10.2 Webhook 設定

**端點：** `POST /webhooks`

**請求 Body：**
```json
{
  "url": "https://your-domain.com/webhook",
  "events": ["intelligence.created", "intelligence.updated"],
  "secret": "your_webhook_secret"
}
```

**回應範例：**
```json
{
  "success": true,
  "data": {
    "id": "webhook_1",
    "url": "https://your-domain.com/webhook",
    "events": ["intelligence.created", "intelligence.updated"],
    "secret": "your_webhook_secret",
    "active": true,
    "createdAt": "2026-02-11T00:00:00Z"
  }
}
```

### 10.3 Webhook Payload

**intelligence.created 事件：**
```json
{
  "event": "intelligence.created",
  "timestamp": "2026-02-11T00:00:00Z",
  "data": {
    "id": "int_123",
    "title": "台灣碳稅法規更新",
    "summary": "環保署公告新的碳稅法規，預計 2027 年實施",
    "category": "regulatory_update",
    "priority": "high",
    "createdAt": "2026-02-11T00:00:00Z"
  }
}
```

### 10.4 Webhook 驗證

Webhook 請求會包含以下標頭：

| 標頭 | 描述 |
|------|------|
| `X-Webhook-Signature` | HMAC SHA256 簽名 |
| `X-Webhook-Timestamp` | 請求時間戳 |
| `X-Webhook-Event` | 事件類型 |

驗證簽名：

```javascript
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload);
  const expectedSignature = hmac.digest('hex');
  return signature === expectedSignature;
}
```

---

## 附錄

### A. 相關文件

- [`INTELLIGENCE_DETECTION_CENTER_IMPLEMENTATION_SPEC.md`](INTELLIGENCE_DETECTION_CENTER_IMPLEMENTATION_SPEC.md) - 實作規格文件
- [`INTELLIGENCE_DETECTION_CENTER_DATA_MODEL.md`](INTELLIGENCE_DETECTION_CENTER_DATA_MODEL.md) - 資料模型設計

### B. 版本歷史

| 版本 | 日期 | 變更內容 | 作者 |
|------|------|----------|------|
| v1.0 | 2026-02-11 | 初始版本 | Kilo Code |
