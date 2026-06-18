---
name: oa-supabase-query
description: "Use when the user needs to query or inspect the Supabase database. Executes REST API calls against the Supabase Data API to fetch ESG metrics, audit records, user data, or any database table. Use for data inspection, debugging, and verification — NOT for bulk data modification."
version: 1.0.0
author: ESGGO OmniAgent
license: MIT
metadata:
  hermes:
    tags: [supabase, database, query, data, api, rest]
    related_skills: [oa-5t-enforcer, oa-summon]
---

# OA Supabase Query — 資料庫查詢

## Overview

通過 Supabase Data API 查詢 ESGGO 資料庫。用於資料檢查、除錯、驗證，以及協助用戶了解資料庫內容。

## Supabase Connection

| 設定 | 值 |
|------|-----|
| API URL | `https://mruetmtibkbzfaawfjbm.supabase.co/rest/v1/` |
| Auth | anon key（從環境變數或 `.env` 讀取） |

## When to Use

- 用戶要求查詢資料庫內容
- 需要驗證資料是否符合 5T 協議
- 需要檢查特定資料表的結構或內容
- 除錯時需要確認資料是否存在

**Don't use for：** 大量資料寫入/修改、部署（用 `oa-deploy`）

## Query Patterns

### 基本查詢

```bash
# 查詢所有資料（限制 10 筆）
curl -s "https://mruetmtibkbzfaawfjbm.supabase.co/rest/v1/<table>?limit=10" \
  -H "apikey: <anon_key>" \
  -H "Content-Type: application/json"

# 查詢特定欄位
curl -s "https://mruetmtibkbzfaawfjbm.supabase.co/rest/v1/<table>?select=id,name,value&limit=5" \
  -H "apikey: <anon_key>"

# 條件查詢
curl -s "https://mruetmtibkbzfaawfjbm.supabase.co/rest/v1/<table>?status=eq.active&limit=10" \
  -H "apikey: <anon_key>"
```

### 常用查詢

```bash
# 取得資料表列表（通過 OpenAPI）
curl -s "https://mruetmtibkbzfaawfjbm.supabase.co/rest/v1/" \
  -H "apikey: <anon_key>"

# 計算資料筆數
curl -s "https://mruetmtibkbzfaawfjbm.supabase.co/rest/v1/<table>?select=count" \
  -H "apikey: <anon_key>" \
  -H "Accept: application/vnd.pgrst.object+json"

# 排序查詢
curl -s "https://mruetmtibkbzfaawfjbm.supabase.co/rest/v1/<table>?order=created_at.desc&limit=10" \
  -H "apikey: <anon_key>"
```

## Data Inspection Workflow

### 1. 確認資料表存在

```bash
# 查詢系統目錄取得資料表列表
curl -s "https://mruetmtibkbzfaawfjbm.supabase.co/rest/v1/?select=table_name&table_schema=eq.public" \
  -H "apikey: <anon_key>" \
  -H "Content-Type: application/json"
```

### 2. 取樣檢查

```bash
# 取 5 筆資料檢查結構
curl -s "https://mruetmtibkbzfaawfjbm.supabase.co/rest/v1/<table>?limit=5" \
  -H "apikey: <anon_key>" | jq .
```

### 3. 5T 合規檢查

搭配 `oa-5t-enforcer` 使用：

```bash
# 檢查 hash_lock 覆蓋率
curl -s "https://mruetmtibkbzfaawfjbm.supabase.co/rest/v1/<table>?hash_lock=not.is.null&select=count" \
  -H "apikey: <anon_key>" \
  -H "Accept: application/vnd.pgrst.object+json"

# 檢查 source_origin 覆蓋率
curl -s "https://mruetmtibkbzfaawfjbm.supabase.co/rest/v1/<table>?source_origin=not.is.null&select=count" \
  -H "apikey: <anon_key>" \
  -H "Accept: application/vnd.pgrst.object+json"
```

## Response Format

API 回應為 JSON 陣列：

```json
[
  {
    "id": 1,
    "date": "2026-06-01",
    "metric_name": "碳排放量",
    "metric_value": 1200,
    "unit": "tCO₂e",
    "hash_lock": "0x8f...3a21",
    "source_origin": "Auto-Agent",
    "created_at": "2026-06-01T08:00:00+00:00"
  }
]
```

## Common Pitfalls

1. **忘記 apikey。** 所有請求都必須帶 apikey header。
2. **查詢過大資料表時沒設 limit。** 始終加上 `?limit=N`。
3. **不了解 PostgREST 語法。** 使用 `eq.`、`neq.`、`gt.`、`lt.`、`like`、`is.null`、`not.is.null` 等運算子。
4. **不提供回饋。** 查詢後必須向用戶解釋資料含義。

## Verification Checklist

- [ ] 已確認 Supabase API URL 正確
- [ ] 已使用有效的 apikey
- [ ] 已加上 `?limit=N` 避免過大查詢
- [ ] 已使用 `jq` 或類似工具解析 JSON
- ] 已向用戶清楚解释查詢結果
