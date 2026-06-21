---
name: oa-report-assembler
description: "Use when the user wants to assemble sustainability reports, generate ESG documents, or combine templates with live data. Handles report generation from 24-section templates, Supabase data fetching, GRI/SASB framework mapping, and final document assembly. Load when user mentions report generation, sustainability report, ESG document, or 永續報告."
version: 1.0.0
author: ESGGO OmniAgent
license: MIT
metadata:
  hermes:
    tags: [report, assembler, esg, sustainability, gri, sasb, template, esggo]
    related_skills: [oa-supabase-query, oa-summon, oa-5t-enforcer]
---

# OA Report Assembler — 永續報告自動組裝

## Overview

將 Supabase 即時資料 + 資源庫預寫範本按 GRI/SASB/SDGs 框架自動組裝成完整永續報告。支援 24 段 × 1 萬字 = 24 萬字零算力報告產出。

## When to Use

- 用戶說「產出報告」、「永續報告」、「ESG 文件」
- 需要從資料庫抓取資料組合報告
- 需要按 GRI/SASB 框架生成章節
- 用戶說「24 段」、「24 萬字」

**Don't use for:** 即時 AI 生成內容（用 `sustain-write` API）、設計修復（用 `oa-design-fix`）

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Report Assembler v1.0                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Supabase Data        Templates           Frameworks        │
│  ───────────         ──────────         ──────────         │
│  esg_metrics    →   24 sections    →   GRI Standards      │
│  audit_records  →   × 10k chars    →   SASB               │
│  compliance    →   each            →   SDGs               │
│                   ──────────                          │
│                   240k chars total                       │
│                         ↓                                   │
│                   Assembled Report                         │
│                   (Markdown/PDF)                            │
└─────────────────────────────────────────────────────────────┘
```

## Core Workflow

### Step 1: 收集資料

從 Supabase 拉取報告所需資料：

```bash
# 使用 oa-supabase-query 技能
curl -X POST '<supabase_url>/rest/v1/esg_metrics' \
  -H 'apikey: <_REDACTED> \
  -H 'Authorization: Bearer <_REDACTED>'
```

### Step 2: 載入範本

從資源庫（omnipotent-repository）載入 24 段預寫範本：

```bash
# 24 段範本結構
1.  前言與公司概覽
2.  永續治理架構
3.  利害關係人分析
4.  重大議題評估
5.  環境面向總覽
6.  氣候變遷與碳管理
7.  水資源管理
8.  廢棄物與循環經濟
9.  能源效率
10. 社會面向總覽
11. 員工福祉與多樣性
12. 職業安全衛生
13. 社區參與
14. 供應鏈管理
15. 產品責任
16. 經濟面向總覽
17. 財務績效
18. 間接經濟影響
19. 反腐敗與誠信
20. 法規遵循
22. 創新與研發
22. 夥伴關係
23. 目標與承諾
24. 附錄與索引
```

### Step 3: 組裝報告

將資料注入範本，組合完整報告：

```markdown
# 永續報告 2026

## 第 1 章：前言與公司概覽
[範本內容] + [公司資料 from Supabase]

## 第 2 章：永續治理架構
[範本內容] + [治理資料 from Supabase]
...
```

### Step 4: 輸出格式

| 格式 | 用途 | 工具 |
|------|------|------|
| Markdown | 原始報告 | 直接輸出 |
| PDF | 正式文件 | pandoc / puppeteer |
| DOCX | 可編輯 | python-docx |
| HTML | 網頁展示 | 內聯樣式 |

## 24-Section Template Index

區段編號對應到 `omnipotent-repository/` 中的範本檔案：

| Section | Template File | Framework |
|---------|---------------|-----------|
| 1 | `01-company-overview.md` | GRI-2 |
| 2 | `02-governance.md` | GRI-1 |
| 3 | `03-stakeholders.md` | GRI-3 |
| 4 | `04-materiality.md` | GRI-3 |
| 5 | `05-environmental-overview.md` | GRI-3 |
| 6 | `06-climate-carbon.md` | GRI-305 |
| 7 | `07-water.md` | GRI-303 |
| 8 | `08-waste-circular.md` | GRI-306 |
| 9 | `09-energy.md` | GRI-302 |
| 10 | `10-social-overview.md` | GRI-4 |
| 11 | `11-employees.md` | GRI-401 |
| 12 | `12-safety.md` | GRI-403 |
| 13 | `13-community.md` | GRI-413 |
| 14 | `14-supply-chain.md` | GRI-308 |
| 15 | `15-product.md` | GRI-416 |
| 16 | `16-economic-overview.md` | GRI-201 |
| 17 | `17-financial.md` | GRI-201 |
| 18 | `18-indirect-impact.md` | GRI-203 |
| 19 | `19-anti-corruption.md` | GRI-205 |
| 20 | `20-compliance.md` | GRI-2-6 |
| 21 | `21-innovation.md` | SDG-9 |
| 22 | `22-partnerships.md` | SDG-17 |
| 23 | `23-goals.md` | SDG-17 |
| 24 | `24-appendix.md` | GRI-1 |

## Common Pitfalls

1. **Supabase 連線失敗** — 檢查 URL 和 API key 是否正確
2. **範本缺失** — 24 段範本必須完整，缺少任何一段報告就不完整
3. **資料注入格式錯誤** — 確保 Supabase 資料是 JSON 可解析格式
4. **報告字數不足** — 每段應達 10,000 字，不足表示範本有問題
5. **Framework 對映錯誤** — 每段應標註對應的 GRI/SASB/SDG 準則

## Verification Checklist

- [ ] Supabase 資料已拉取
- [ ] 24 段範本已載入
- [ ] 報告已組裝完成
- [ ] 總字數 ≥ 240,000 chars
- [ ] Framework 對映正確
- [ ] 輸出格式正確
