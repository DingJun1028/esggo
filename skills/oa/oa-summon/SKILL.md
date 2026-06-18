---
name: oa-summon
description: "Use when the user says 'OA', '召喚', '啟動 OmniAgent', or asks to open the OmniAgent console. Boot the OA console, check system status, display core metrics, and route to the appropriate sub-skill."
version: 1.0.0
author: ESGGO OmniAgent
license: MIT
metadata:
  hermes:
    tags: [omniagent, console, summon, boot, status, hub]
    related_skills: [oa-deploy, oa-design-fix, oa-page-builder, oa-5t-enforcer, oa-supabase-query]
---

# OA Summon — OmniAgent 召喚與啟動

## Overview

OA Summon 是 ESGGO 萬能代理（OmniAgent）的入口技能。當用戶召喚 OA 時，執行系統狀態檢查、顯示核心指標，並根據用戶意圖路由到對應的子技能。

## When to Use

- 用戶說「OA」、「召喚」、「啟動 OmniAgent」
- 用戶要求查看系統狀態或核心指標
- 用戶需要快速導航到 ESGGO 功能模組
- 用戶要求執行系統健康檢查

**Don't use for:** 具體的頁面建置（用 `oa-page-builder`）、部署（用 `oa-deploy`）、資料驗證（用 `oa-5t-enforcer`）

## Boot Sequence

### 1. 環境檢查

```bash
cd C:\Project\esggo\esggo
git status --short
git log --oneline -3
git branch --show-current
```

### 2. 回應格式

```
🌌 OA 已啟動
━━━━━━━━━━━━━━━━━━━━━━
📍 Branch: main
📝 Modified: X files
🕐 Last: <commit msg>
🔗 Live: https://esggo.vercel.app
━━━━━━━━━━━━━━━━━━━━━━
```

### 3. 路由意圖

根據用戶輸入路由到對應技能：

| 用戶輸入 | 路由到 |
|----------|--------|
| `OA 建置 <頁面>` | `oa-page-builder` |
| `OA 修復` | `oa-design-fix` |
| `OA 部署` | `oa-deploy` |
| `OA 驗證` | `oa-5t-enforcer` |
| `OA 查詢` | `oa-supabase-query` |
| `OA` / `召喚` | 顯示狀態 + 等待指令 |

## Sub-Skill Quick Reference

### oa-page-builder — 頁面建置
**觸發：** 「建立 <頁面> 頁面」、「建置 <名稱>」
**功能：** 根據 spec table 生成 Next.js 頁面，遵循亮色主題規範
**參考：** `references/design-tokens.md`

### oa-design-fix — 設計修復
**觸發：** 「顏色跑掉」、「背景變黑」、「看不到文字」
**功能：** 掃描並修復深色主題違規樣式
**工具：** `scripts/audit.sh` 自動掃描

### oa-deploy — 一鍵部署
**觸發：** 「部署」、「上線」、「push」
**功能：** git commit → git push → Vercel deploy
**工具：** `scripts/deploy.sh` 自動部署

### oa-5t-enforcer — 5T 驗證
**觸發：** 「5T 驗證」、「資料完整性」
**功能：** 檢查資料是否符合 5T 誠信協議
**參考：** `references/checklist.md`

### oa-supabase-query — 資料查詢
**觸發：** 「查詢 <資料>」、「資料庫」
**功能：** 通過 Supabase REST API 查詢資料

## Common Pitfalls

1. **不要在召喚時自動部署。** 召喚只是狀態檢查。
2. **不要在召喚時修改任何檔案。** 除非用戶明確要求。
3. **如果 git status 有大量未提交檔案，提醒用戶先 commit。**

## Verification Checklist

- [ ] 已確認專案目錄正確
- [ ] 已顯示目前 branch 和 modified 檔案數
- [ ] 已顯示最近 commit
- [ ] 已顯示生產環境 URL
- [ ] 已根據用戶意圖路由到正確子技能
- [ ] 未在未經用戶確認下修改任何檔案
