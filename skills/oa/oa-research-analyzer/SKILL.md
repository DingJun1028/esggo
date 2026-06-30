---
name: oa-research-analyzer
description: "Use when the user wants ESG research analysis: policy tracking, regulation comparison, best practice benchmarking, trend analysis. Load when user mentions research, policy, regulation, benchmark, trend analysis."
version: 2.0.0
author: ESGGO OmniAgent
license: MIT
metadata:
  hermes:
    tags: [research, analysis, policy, regulation, benchmark, trend, esggo]
    related_skills: [oa-summon, oa-data-explorer, oa-memory-shards, oa-audit-scanner]
---

# OA Research Analyzer — ESG 研究分析器 v2

## Overview

ESG 研究分析：政策追蹤、法規比較、最佳實踐基準、趨勢分析。支援多源匯總、交叉驗證、結構化輸出。

## When to Use

- 用戶說「研究」、「政策分析」、「法規比較」、「基準研究」、「趨勢分析」
- 需要決策支援資料

**Don't use for:** 資料探索（用 `oa-data-explorer`）、合規掃描（用 `oa-audit-scanner`）

## Research Domains

| 領域 | 來源 | 更新頻率 |
|------|------|----------|
| 台灣金管會法規 | FSC 官網、法規資料庫 | 即時 |
| 國際準則 | GRI、ISSB、TCFD、SASB | 版本發布時 |
| 氣候政策 | UNFCCC、各國 NDC | 季度 |
| 產業最佳實踐 | CDP、DJSI、MSCI、Sustainalytics | 年度 |
| 綠色金融 | 綠色分類法、綠債標準 | 半年度 |

## Core Workflow

### Step 1: 定義研究問題

```typescript
{
  question: "台灣金管會最新永續報告書規範 vs ISSB S1/S2 差異？",
  scope: ["Taiwan FSC", "ISSB"],
  output_format: "comparison_table",
  deadline: "2026-07-01"
}
```

### Step 2: 多源蒐集

```bash
# 爬蟲 + API + 手工整理
node scripts/research-crawl.js --source=fsc --topic=sustainability-reporting
node scripts/research-crawl.js --source=issb --topic=s1-s2
```

### Step 3: 交叉驗證

```typescript
// 對照官方原文、二手解讀、專家評論
const verified = await crossVerify(sources, {
  primary_weight: 0.6,
  secondary_weight: 0.3,
  expert_weight: 0.1
});
```

### Step 4: 結構化輸出

```markdown
# 研究報告：台灣永續報告書規範 vs ISSB S1/S2 差異分析

## 執行摘要
...

## 詳細比較表
| 維度 | 台灣金管會 | ISSB S1/S2 | 差異等級 | 影響 |
|------|------------|------------|----------|------|
| 適用對象 | 上市櫃公司 | 所有實體（自願/強制） | 高 | 範圍擴大 |
| 氣候揭露 | TCFD 基礎 | IFRS S2 完整 | 高 | 需補強 |
| ... | ... | ... | ... | ... |

## 行動建議
1. 立即：對照 S2 補齊氣候揭露
2. 短期：建立 ISSB 對照表
3. 中期：導入雙軌編製流程

## 來源與引用
[1] 金管會 113 年修正版...
[2] ISSB S1/S2 正式版...
```

## Common Pitfalls

1. **非官方來源** — 優先引用官方原文，二手來源標註
2. **版本過舊** — 每次研究檢查來源發布日期
3. **缺乏可執行建議** — 必須給出具體下一步

## Verification Checklist

- [ ] 研究問題明確
- [ ] 多源蒐集完成
- [ ] 交叉驗證通過
- [ ] 輸出結構化、可執行
- [ ] 來源完整引用