---
name: oa-data-explorer
description: "Use when the user wants to explore ESG data interactively, query with natural language, or visualize database contents. Handles natural language to SQL conversion, Supabase data exploration, chart generation, and trend visualization. Load when user mentions data exploration, database query, or ESG data visualization."
version: 1.0.0
author: ESGGO OmniAgent
license: MIT
metadata:
  hermes:
    tags: [data, explorer, visualization, supabase, query, chart, esggo]
    related_skills: [oa-supabase-query, oa-summon, oa-report-assembler]
---

# OA Data Explorer — 互動式資料探索

## Overview

用自然語言探索 ESG 資料庫。自動轉成 Supabase REST 查詢、生成圖表、顯示趨勢分析。

## When to Use

- 用戶說「看看資料」、「查一下 ESG 數據」
- 需要互動式探索資料庫
- 需要生成圖表
- 需要趨勢分析

**Don't use for:** 報告生成（用 `oa-report-assembler`）、合規掃描（用 `oa-audit-scanner`）

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Data Explorer v1.0                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  User Query        NL→SQL         Supabase      Output      │
│  ─────────        ──────         ─────────     ──────      │
│  "看排放數據"  →   SELECT *  →   REST API  →   圖表+表格  │
│  "趨勢分析"    →   GROUP BY →   REST API  →   折線圖      │
└─────────────────────────────────────────────────────────────┘
```

## Core Workflow

### Step 1: 解析用戶意圖

將自然語言轉為查詢參數：

| 用戶說 | 解析 | Supabase 參數 |
|--------|------|--------------|
| "看排放數據" | 查詢排放表 | `table=emissions` |
| "最近 7 天" | 時間過濾 | `created_at=gte.7d_ago` |
| "按部門分組" | 分組 | `select=department,sum:co2` |
| "排序" | 排序 | `order=co2.desc` |

### Step 2: 執行查詢

```bash
# 排放數據
curl -s '<supabase_url>/rest/v1/emissions?select=*&created_at=gte.2026-01-01' \
  -H 'apikey: <_REDACTED> \
  -H 'Authorization: Bearer <_REDACTED>'
```

### Step 3: 格式化輸出

```
📊 ESG 資料探索結果
━━━━━━━━━━━━━━━━━━━━━━
🔍 查詢: 排放數據（2026 年）
📋 結果: 15 筆記錄

| 部門      | CO2 (噸) | 能耗 (MWh) | 水資源 (m³) |
|-----------|---------|-----------|------------|
| 製造部    | 1,250   | 3,200     | 8,500      |
| 銷售部    | 320     | 850       | 1,200      |
| 研發部    | 180     | 620       | 800        |
| 總計      | 1,750   | 4,670     | 10,500     |

📈 趨勢: 較去年 +5.2%
💡 洞察: 製造部占總排放 71%
━━━━━━━━━━━━━━━━━━━━━━
```

## Supported Query Types

### 列表查詢
```
"看所有 ESG 指標" → SELECT * FROM esg_metrics
"列出公司" → SELECT * FROM companies
```

### 過濾查詢
```
"2026 年的數據" → WHERE created_at >= 2026-01-01
"製造部的排放" → WHERE department = '製造部'
```

### 聚合查詢
```
"按部門分組" → SELECT department, SUM(co2)
"每月趨勢" → SELECT DATE_TRUNC('month', created_at), AVG(co2)
```

### 排序查詢
```
"排放量最高的" → ORDER BY co2 DESC LIMIT 10
"最近 7 天" → ORDER BY created_at DESC LIMIT 7
```

## Chart Types

| 資料類型 | 推薦圖表 | 用途 |
|---------|---------|------|
| 時間序列 | 折線圖 | 趨勢分析 |
| 分類比較 | 柱狀圖 | 部門對比 |
| 佔比 | 圓餅圖 | 排放來源 |
| 相關性 | 散點圖 | 能耗 vs 排放 |
| 分布 | 直方圖 | 數據分布 |

## Common Pitfalls

1. **Supabase REST API 限制** — 分頁用 `offset` + `limit`，大量資料需分批
2. **自然語言模糊** — 「看數據」太模糊，需要追問具體表和欄位
3. **圖表無法在 CLI 顯示** — 用文字表格或 ASCII 圖表代替
4. **SQL 注入風險** — 使用 Supabase REST API 避免直接 SQL

## Verification Checklist

- [ ] 用戶意圖已解析
- [ ] 查詢已執行
- [ ] 結果已格式化
- [ ] 圖表/趨勢已生成（如適用）
- [ ] 洞察已提供
