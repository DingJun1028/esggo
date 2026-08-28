---
name: cloudflare-pagerules
description: Cloudflare 網頁規則 (Page Rules) 操作指南
version: 1.0.0
---

# Cloudflare 網頁規則 (Page Rules)

## 簡介

網頁規則可讓您控制指定的 URL 會觸發哪些 Cloudflare 設定。每個 URL 只會觸發一個網頁規則，所以如果您按照優先順序排序網頁規則，然後盡可能地建立具體的 URL 模式，則會很有幫助。

## API 端點

### 列出網頁規則
```
GET https://api.cloudflare.com/client/v4/zones/{zone_id}/pagerules
```

### 網頁規則詳細資料
```
GET https://api.cloudflare.com/client/v4/zones/{zone_id}/pagerules/{identifier}
```

### 建立網頁規則
```
POST https://api.cloudflare.com/client/v4/zones/{zone_id}/pagerules
```

### 更新網頁規則
```
PUT https://api.cloudflare.com/client/v4/zones/{zone_id}/pagerules/{identifier}
```

### 編輯網頁規則
```
PATCH https://api.cloudflare.com/client/v4/zones/{zone_id}/pagerules/{identifier}
```

### 刪除網頁規則
```
DELETE https://api.cloudflare.com/client/v4/zones/{zone_id}/pagerules/{identifier}
```

## 使用方法

### 1. 取得 Zone ID

使用 Cloudflare API 或 CLI 取得 zone_id：

```bash
curl -X GET "https://api.cloudflare.com/client/v4/zones" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json"
```

### 2. 列出現有頁面規則

```bash
curl -X GET "https://api.cloudflare.com/client/v4/zones/{ZONE_ID}/pagerules" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json"
```

### 3. 建立新頁面規則

```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/{ZONE_ID}/pagerules" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "target": "example.com/path/*.html",
    "actions": [
      {
        "id": "always_online",
        "value": true
      }
    ],
    "priority": 1,
    "status": "active"
  }'
```

### 4. URL 模式規則

- `*` 用於通配符匹配
- `example.com/*` 匹配整個域名的所有路徑
- `example.com/api/*` 僅匹配 /api/ 開頭的路徑
- `example.com/path/*.html` 匹配特定路徑下的 HTML 檔案

## 注意事項

- 每個 URL 只能觸發一個網頁規則
- 按優先順序排序網頁規則
- 盡可能建立具體的 URL 模式
- 可用網頁規則數量有限（通常為 3-20 個，取決於訂閱方案）