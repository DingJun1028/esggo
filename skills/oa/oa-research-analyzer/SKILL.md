---
name: oa-research-analyzer
description: "Use when the user wants to research ESG topics, search academic databases, monitor regulatory updates, or analyze sustainability trends. Handles arXiv searches, blog monitoring, regulation tracking, and ESG trend analysis. Load when user mentions research, ESG analysis, regulation update, or academic search."
version: 1.0.0
author: ESGGO OmniAgent
license: MIT
metadata:
  hermes:
    tags: [research, analysis, esg, academic, regulation, trend, esggo]
    related_skills: [oa-summon, oa-supabase-query, oa-audit-scanner]
---

# OA Research Analyzer — ESG 研究分析器

## Overview

搜尋學術資料庫、監控法規更新、分析 ESG 趨勢。整合 arXiv 論文、法規新聞、企業場景對照。

## When to Use

- 用戶說「研究 ESG」、「法規動態」、「趨勢分析」
- 需要搜尋學術論文
- 需要追蹤法規更新
- 需要競爭者/行業分析

**Don't use for:** 資料查詢（用 `oa-supabase-query`）、報告生成（用 `oa-report-assembler`）

## Core Workflow

### Step 1: 搜尋學術資料

使用 `arxiv` 技能搜尋 ESG 相關論文：

```bash
# 氣候風險
arxiv search "climate risk disclosure ESG" --limit 5

# 碳市場
arxiv search "carbon market pricing" --limit 5

# 永續報告
arxiv search "sustainability reporting GRI" --limit 5
```

### Step 2: 法規動態監控

```bash
# 使用 blogwatcher 監控 ESG 法規部落格
blogwatcher add "https://www.globalreporting.org/news/"
blogwatcher add "https://www.sasb.org/news/"
blogwatcher check
```

### Step 3: 趨勢分析

分析搜尋結果，產生摘要：

```
📚 ESG 研究分析報告
━━━━━━━━━━━━━━━━━━━━━━
🔍 搜尋主題: 氣候風險揭露
📅 分析日期: 2026-06-22

📄 學術論文 (5 篇):
  1. TCFD 框架下的氣候風險揭露研究 (2026)
  2. 碳定價對企業財務的影響 (2025)
  ...

📰 法規動態 (3 則):
  1. 歐盟 CSRD 揭露準則更新 (2026-06-15)
  2. 台灣金管會 ESG 報告指引 (2026-06-10)
  ...

📊 趨勢洞察:
  1. 氣候風險量化成為主流
  2. 供應鏈 Scope 3 揭露要求增加
  3. AI 輔助 ESG 數據分析興起

💡 建議行動:
  - 建立 TCFD 框架下的氣候風險評估
  - 準備 Scope 3 排放盤查
━━━━━━━━━━━━━━━━━━━━━━
```

## Data Sources

| 來源 | 類型 | 工具 |
|------|------|------|
| arXiv | 學術論文 | `arxiv` skill |
| Blogwatcher | 法規部落更新 | `blogwatcher` skill |
| Web Search | 一般搜尋 | `web_search` |
| Polymarket | 預測市場 | `polymarket` skill |

## Output Format

研究分析報告應包含：

1. **搜尋摘要** — 主題、日期、來源數量
2. **關鍵發現** — 3-5 個主要發現
3. **趨勢分析** — 目前趨勢方向
4. **法規動態** — 適用的新法規/準則
5. **企業應用** — 對照用戶場景的建議
6. **推薦資源** — 進一步閱讀的論文/報告

## Common Pitfalls

1. **搜尋範圍太廣** — 用精確關鍵詞，避免雜訊
2. **論文品質參差** — arXiv 未經同儕審查，需驗證
3. **法規更新延遲** — 法規網站 RSS 可能延遲，需手動確認
4. **趨勢主觀** — 需要多源驗證，避免單一來源偏見

## Verification Checklist

- [ ] 搜尋範圍已定義
[ ] 至少 3 個來源已查詢
- [ ] 摘要已產生
- [ ] 趨勢洞察已整理
- [ ] 企業場景已對照
