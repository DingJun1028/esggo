---
name: oa-cron-scheduler
description: "Use when the user wants to manage scheduled tasks, create cron jobs, or set up automated reports. Handles cron job creation, modification, monitoring, and history review. Load when user mentions cron, scheduled task, daily report, or automation."
version: 1.0.0
author: ESGGO OmniAgent
license: MIT
metadata:
  hermes:
    tags: [cron, scheduler, automation, scheduled, report, esggo]
    related_skills: [oa-summon, oa-vps-gateway, oa-report-assembler]
---

# OA Cron Scheduler — 任務排程管理

## Overview

互動式管理 Hermes cron job。建立、修改、監控定時任務，顯示執行歷史和下次執行時間。

## When to Use

- 用戶說「排程」、「定時」、「cron」、「自動化」
- 需要建立定時報告
- 需要修改現有排程
- 需要查看執行歷史

**Don't use for:** VPS 系統 cron（用 `oa-vps-gateway`）、一次性任務

## Core Workflow

### Step 1: 建立 Cron Job

使用 Hermes `cronjob` 工具：

```json
{
  "action": "create",
  "name": "每日 ESG 報告",
  "schedule": "0 9 * * *",
  "prompt": "搜尋今日 ESG 法規動態，用繁體中文報告",
  "deliver": "telegram:6387287462"
}
```

### Step 2: 管理指令

| 指令 | 動作 |
|------|------|
| `cron list` | 列出所有任務 |
| `cron create` | 建立新任務 |
| `cron pause <id>` | 暫停任務 |
| `cron resume <id>` | 恢復任務 |
| `cron run <id>` | 手動執行 |
| `cron remove <id>` | 刪除任務 |

### Step 3: 顯示狀態

```
⏰ 排程管理
━━━━━━━━━━━━━━━━━━━━━━
📋 任務列表:

| ID | 名稱 | 排程 | 狀態 | 下次執行 |
|----|------|------|------|---------|
| 1  | 每日 ESG 報告 | 0 9 * * * | ✅ 運行中 | 2026-06-23 09:00 |
| 2  | 每週系統健康 | 0 * * 0 | ✅ 運行中 | 2026-06-28 00:00 |
| 3  | 月度永續報告 | 0 1 * * * | ⏸️ 暫停 | - |

📊 執行歷史（最近 5 次）:
  ✅ 2026-06-22 09:00 — 成功（耗時 45s）
  ✅ 2026-06-21 09:00 — 成功（耗時 52s）
  ❌ 2026-06-20 09:00 — 失敗（timeout）
  ✅ 2026-06-19 09:00 — 成功（耗時 48s）
━━━━━━━━━━━━━━━━━━━━━━
```

## Schedule 格式

### 標準 Cron
```
┌───────────── 分 (0-59)
│ ┌────────── 時 (0-23)
│ │ ┌──────── 日 (1-31)
│ │ │ ┌────── 月 (1-12)
│ │ │ │ ┌──── 星期 (0-6, 日=0)
│ │ │ │ │
0 9 * * *      → 每天 09:00
0 * * 0        → 每週日 00:00
0 1 * * *      → 每月 1 號 00:00
*/30 * * * *   → 每 30 分鐘
0 9 * * 1-5    → 工作日 09:00
```

### 間隔格式
```
30m           → 每 30 分鐘
every 2h      → 每 2 小時
```

### 一次性
```
2026-06-25T09:00:00  → 2026-06-25 09:00 一次
```

## Common Job Types

### 每日報告
```json
{
  "name": "每日 ESG 報告",
  "schedule": "0 9 * * *",
  "prompt": "搜尋今日 ESG 法規動態、AI 突破、碳市場趨勢，用繁體中文報告"
}
```

### 系統監控
```json
{
  "name": "系統健康檢查",
  "schedule": "*/30 * * * *",
  "prompt": "檢查系統健康狀態，如有異常通知用戶"
}
```

### 週報
```json
{
  "name": "週度摘要",
  "schedule": "0 10 * * 1",
  "prompt": "彙整本週系統進度、完成事項、下週計畫"
}
```

### 月度報告
```json
{
  "name": "月度永續報告",
  "schedule": "0 10 1 * *",
  "prompt": "產出月度永續報告，包含 ESG 指標、合規狀態、改善建議"
}
```

## Common Pitfalls

1. **時區問題** — Hermes cron 使用 UTC，台灣時間需 +8h（09:00 台灣 = 01:00 UTC）
2. **Prompt 太長** — prompt 應簡潔明確，避免過長影響執行
3. **忘記 deliver** — 未設定 deliver 的任務結果不會送到任何地方
4. **任務衝突** — 避免同時執行大量任務導致資源競爭

## Verification Checklist

- [ ] 任務已建立
- [ ] 排程格式正確
- [ ] deliver 目標已設定
- [ ] 手動執行成功
- [ ] 歷史記錄可查看
