---
name: oa-summon
description: "Use when the user says 'OA', '召喚', '啟動 OmniAgent', or asks to open the OmniAgent console. Boot the OA console, check system status, and display core metrics."
version: 1.0.0
author: ESGGO OmniAgent
license: MIT
metadata:
  hermes:
    tags: [omniagent, console, summon, boot, status]
    related_skills: [oa-deploy, oa-design-fix]
---

# OA Summon — OmniAgent 召喚與啟動

## Overview

OA Summon 是 ESGGO 萬能代理（OmniAgent）的入口技能。當用戶召喚 OA 時，執行系統狀態檢查、顯示核心指標，並引導用戶進入對應功能模組。

## When to Use

- 用戶說「OA」、「召喚」、「啟動 OmniAgent」
- 用戶要求查看系統狀態或核心指標
- 用戶需要快速導航到 ESGGO 功能模組
- 用戶要求執行系統健康檢查

**Don't use for:** 具體的頁面建置（用 `oa-page_builder`）、部署（用 `oa-deploy`）、資料驗證（用 `oa-5t-enforcer`）

## System Boot Sequence

### 1. 環境檢查

```bash
# 確認專案目錄
cd C:\Project\esggo\esggo

# 檢查 git 狀態
git status --short
git log --oneline -3

# 確認 node_modules 存在
ls node_modules/.package-lock.json 2>/dev/null && echo "deps ok" || echo "need install"
```

### 2. 核心指標顯示

| 指標 | 說明 | 檢查方式 |
|------|------|----------|
| Branch | 目前分支 | `git branch --show-current` |
| Modified | 未提交檔案數 | `git status --short \| wc -l` |
| Last Commit | 最近提交 | `git log -1 --oneline` |
| Build Status | 上次建置 | `ls -la .next/BUILD_ID 2>/dev/null` |
| Deploy URL | 生產環境 | https://esggo.vercel.app |

### 3. 系統狀態回應

召喚成功後，以簡潔格式回應：

```
🌌 OA 已啟動
━━━━━━━━━━━━━━━━━━
📍 Branch: main
📝 Modified: X files
🕐 Last: <commit msg>
🔗 Live: https://esggo.vercel.app
━━━━━━━━━━━━━━━━━━
請輸入指令或選擇功能：
[1] 頁面建置  [2] 設計修復  [3] 部署
[4] 5T 驗證   [5] 資料查詢  [6] 其他
```

## Quick Commands

| 用戶輸入 | 對應動作 |
|----------|----------|
| `OA` / `召喚` | 執行 boot sequence |
| `OA 部署` | 跳轉 `oa-deploy` |
| `OA 建置 <頁面>` | 跳轉 `oa-page-builder` |
| `OA 修復` | 跳轉 `oa-design-fix` |
| `OA 驗證` | 跳轉 `oa-5t-enforcer` |
| `OA 查詢` | 跳轉 `oa-supabase-query` |

## Common Pitfalls

1. **不要在召喚時自動部署。** 召喚只是狀態檢查，部署需要明確指令。
2. **不要在召喚時修改任何檔案。** 除非用戶明確要求。
3. **如果 git status 有大量未提交檔案，提醒用戶先 commit。**

## Verification Checklist

- [ ] 已確認專案目錄正確
- [ ] 已顯示目前 branch 和 modified 檔案數
- [ ] 已顯示最近 commit
- [ ] 已顯示生產環境 URL
- [ ] 未在未經用戶確認下修改任何檔案
