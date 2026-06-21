---
name: oa-audit-scanner
description: "Use when the user wants to scan for ESG compliance gaps, check regulatory alignment, or audit data integrity. Scans all LBX regulations, SUSTAIN matrix completeness, and generates compliance radar charts. Load when user mentions audit, compliance scan, gap analysis, or regulatory check."
version: 1.0.0
author: ESGGO OmniAgent
license: MIT
metadata:
  hermes:
    tags: [audit, scanner, compliance, gap, regulation, esg, esggo]
    related_skills: [oa-5t-enforcer, oa-supabase-query, oa-summon]
---

# OA Audit Scanner — ESG 合規掃描器

## Overview

全面掃描 ESG 合規缺口。檢查 LBX 法規/準則合規性、SUSTAIN 矩陣完整度，產生合規雷達圖 + 缺口清單。

## When to Use

- 用戶說「掃描合規」、「合規缺口」、「稽核」
- 需要檢查法規遵循狀態
- 需要產生合規雷達圖
- 需要缺口優先級排序

**Don't use for:** 資料查詢（用 `oa-supabase-query`）、5T 驗證（用 `oa-5t-enforcer`）

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Audit Scanner v1.0                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Data Sources         Checks              Output             │
│  ──────────         ──────              ──────             │
│  Supabase     →    LBX法規    →    合規雷達圖            │
│  Codebase     →    SUSTAIN     →    缺口清單              │
│  Configs      →    準則對齊    →    優先級排序            │
└─────────────────────────────────────────────────────────────┘
```

## Core Workflow

### Step 1: 掃描法規合規

檢查所有適用的 ESG 法規：

| 法規/準則 | 檢查項目 | 狀態 |
|-----------|---------|------|
| GRI Standards | 揭露完整度 | ✅/⚠️/❌ |
| SASB | 行業特定指標 | ✅/⚠️/❌ |
| TCFD | 氣候風險揭露 | ✅/⚠️/❌ |
| SDGs | 目標對齊 | ✅/⚠️/❌ |
| CSRF (歐盟) | 雙重重大性 | ✅/⚠️/❌ |
| 台灣 ESG | 永續報告書 | ✅/⚠️/❌ |

### Step 2: SUSTAIN 矩陣檢查

```bash
# SUSTAIN 矩陣維度
S - Social    : 社會面向完整度
U - Universal : 通用準則覆蓋
S - Sustainable: 永續發展目標
T - Transparent: 透明度
A - Accountable: 問責制
I - Integrated : 整合度
N - Numeric    : 量化指標
```

每個維度 0-100 分，產生雷達圖。

### Step 3: 缺口分析

輸出格式：

```
🔍 ESG 合規掃描報告
━━━━━━━━━━━━━━━━━━━━━━
📊 合規分數: 72/100

✅ 已合規 (18/24):
  GRI-2, GRI-3, GRI-201, SDG-17...

⚠️ 部分合規 (4/24):
  TCFD, SASB-EN, CSRF-2...

❌ 未合規 (2/4):
  GRI-305 (排放數據缺失)
  GRI-403 (職安數據缺失)

🔴 高優先缺口:
  1. GRI-305 — 需要建立排放盤查
  2. GRI-403 — 需要職安統計系統
```

### Step 4: 建議行動

為每個缺口提供修復建議：

| 缺口 | 建議 | 難度 | 時間 |
|------|------|------|------|
| GRI-305 | 建立排放盤查系統 | 🔴 高 | 3 個月 |
| GRI-403 | 職安統計表單 | 🟡 中 | 1 個月 |
| TCFD | 氣候風險評估 | 🔴 高 | 2 個月 |

## Common Pitfalls

1. **法規列表過時** — ESG 法規每年更新，確保使用最新版本
2. **SUSTAIN 主觀評分** — 需要明確定義每項的評分標準
3. **忽略行業差異** — 不同行業適用不同準則（SASB 有 77 個行業）
4. **缺口清單太長** — 優先報告高風險缺口，避免資訊過載

## Verification Checklist

- [ ] 所有適用法規已掃描
- [ ] SUSTAIN 矩陣已評分
- [ ] 缺口清單已產生
- [ ] 優先級已排序
- [ ] 修復建議已提供
