---
name: oa-audit-scanner
description: "Use when scanning for ESG compliance gaps. Checks GRI 2021, SASB, TCFD, SDGs, IFRS S1/S2, Taiwan FSC requirements. Load when user mentions audit, compliance scan, gap analysis, or regulatory check."
version: 2.0.0
author: ESGGO OmniAgent
license: MIT
metadata:
  hermes:
    tags: [audit, compliance, scanner, gri, sasb, tcfd, sdgs, ifrs, esggo]
    related_skills: [oa-summon, oa-5t-enforcer, oa-report-depth, oa-supabase-query]
---

# OA Audit Scanner — ESG 合規掃描器 v2

## Overview

掃描 ESG 報告與數據的合規缺口。支援 GRI 2021、SASB、TCFD、SDGs、IFRS S1/S2、台灣金管會永續報告書規範。

## When to Use

- 用戶說「合規掃描」、「缺口分析」、「審計」、「合規檢查」
- 報告生成前驗證
- 定期合規巡檢

**Don't use for:** 深度報告生成（用 `oa-report-depth`）、5T 驗證（用 `oa-5t-enforcer`）

## Supported Standards

| 標準 | 版本 | 關鍵檢查點 |
|------|------|------------|
| GRI | 2021 | 通用揭露、主題標準、行業標準 |
| SASB | 2023 | 行業特定指標、財務影響 |
| TCFD | 2021 | 治理、策略、風險管理、指標目標 |
| SDGs | 2015 | 17 目標、169 指標對應 |
| IFRS | S1/S2 | 一般揭露、氣候相關揭露 |
| 台灣金管會 | 2024 | 上市櫃永續報告書編製規範 |

## Core Workflow

### Step 1: 載入檢查清單

```bash
# 從 skills/oa/oa-audit-scanner/references/ 載入各標準檢查清單
```

### Step 2: 執行掃描

```typescript
// 對照報告內容檢查每個揭露要求
const gaps = await scanReport({
  report: 'output/report.html',
  standards: ['GRI', 'SASB', 'TCFD', 'SDGs', 'IFRS', 'FSC'],
  companyId: '<id>'
});
```

### Step 3: 生成缺口報告

```json
{
  "standard": "GRI 2021",
  "total_requirements": 84,
  "met": 78,
  "partial": 4,
  "missing": 2,
  "gaps": [
    {
      "code": "GRI 303-5",
      "title": "Water consumption",
      "status": "MISSING",
      "recommendation": "Add water stress area data"
    }
  ]
}
```

## Output

```
audit-scan-<timestamp>/
├── summary.json          # 整體合規率
├── gaps/                 # 各標準缺口詳情
├── recommendations.md    # 修補建議
└── evidence-map.json     # 證據對應表
```

## Common Pitfalls

1. **標準版本過舊** — 必須用最新版（GRI 2021、SASB 2023、IFRS S1/S2 2023）
2. **行業標準遺漏** — SASB 必須按行業載入對應標準
3. **證據鏈斷裂** — 每個揭露必須追溯到原始數據

## Verification Checklist

- [ ] 所有適用標準掃描完成
- [ ] 缺口報告生成
- [ ] 修補建議具體可執行
- [ ] 證據對應表完整