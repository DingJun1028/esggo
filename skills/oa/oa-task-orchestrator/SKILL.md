---
name: oa-task-orchestrator
description: "Use when the user wants to orchestrate multiple sub-agent tasks, manage delegate_task workflows, monitor agent status, or coordinate parallel work. Handles task decomposition, assignment to sub-agents, progress tracking, failure retry, and result aggregation. Load when user mentions task orchestration, sub-agents, parallel work, or delegate."
version: 1.0.0
author: ESGGO OmniAgent
license: MIT
metadata:
  hermes:
    tags: [orchestrator, tasks, delegate, sub-agent, parallel, coordination, esggo]
    related_skills: [oa-summon, oa-deploy, oa-page-builder]
---

# OA Task Orchestrator — 子代理任務編排器

## Overview

管理 OmniAgent 的子代理任務編排。負責分解複雜任務、分配給 delegate_task 子代理、追蹤進度、處理失敗重試、匯總結果。

## When to Use

- 用戶說「編排任務」、「同時跑」、「一起做」、「子代理」
- 需要平行執行多個獨立任務
- 需要分解複雜工作為子任務
- 需要監控子代理進度和狀態

**Don't use for:** 單一簡單任務（直接做）、部署（用 `oa-deploy`）

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                OmniAgent (總代理)                    │
│                     ↓                               │
│              Task Orchestrator                       │
│         ┌─────────┼─────────┐                       │
│         ↓         ↓         ↓                       │
│     Agent A    Agent B    Agent C                   │
│     (研究)     (建置)     (驗證)                      │
│         ↓         ↓         ↓                       │
│         └─────────┼─────────┘                       │
│                   ↓                                 │
│            Result Aggregator                        │
└─────────────────────────────────────────────────────┘
```

## Core Workflow

### Step 1: 任務分解

分析用戶請求，拆解為獨立子任務：

```
用戶: "建立頁面 + 部署 + 驗證"
  → Task A: 建立頁面 (delegate_task)
  → Task B: 部署 (oa-deploy)
  → Task C: 驗證 (oa-5t-enforcer)
```

### Step 2: 平行分派

使用 `delegate_task` 的 `tasks` 陣列同時啟動：

```typescript
delegate_task(
  tasks: [
    { goal: "建立 X 頁面", toolsets: ["terminal", "file"] },
    { goal: "修復 Y 樣式", toolsets: ["terminal", "file"] },
    { goal: "執行 Z 測試", toolsets: ["terminal"] },
  ]
)
```

### Step 3: 結果匯總

子代理完成後，匯總結果並回報用戶。

## Task Decomposition Rules

### 可並行（無依賴）
- 多個頁面建置
- 多個檔案修改
- 研究 + 建置
- 驗證 + 測試

### 必須串行（有依賴）
- 建置 → 部署 → 驗證
- 查詢 → 分析 → 報告
- 安裝 → 設定 → 測試

### 混合模式
```
Phase 1: 平行 [研究A, 研究B, 研究C]
         ↓
Phase 2: 串行 [分析研究結果]
         ↓
Phase 3: 平行 [建置X, 建置Y, 建置Z]
```

## Failure Handling

### 自動重試
- 子代理失敗 → 重試 1 次（換 context）
- 仍然失敗 → 回報用戶，提供錯誤詳情

### 降級策略
- AI 生成失敗 → 使用預寫範本
- 遠端 API 失敗 → 使用本地快取
- 子代理超時 → 簡化任務重試

## Status Display

```
📋 任務編排狀態
━━━━━━━━━━━━━━━━━━━━━━
🔄 Agent A: 研究中... (2m 30s)
✅ Agent B: 建置完成 (1m 15s)
⏳ Agent C: 等待中...
━━━━━━━━━━━━━━━━━━━━━━
進度: 2/3 | 預計剩餘: 30s
```

## Common Pitfalls

1. **太多並行子代理** — 最多 3 個同時執行（delegate_task 限制）
2. **任務依賴未處理** — 有依賴的任務必須串行
3. **子代理 context 不足** — 提供完整的 goal + context，不要假設子代理知道背景
4. **忘記匯總結果** — 子代理完成後主動匯總，不要等用戶問
5. **超時未處理** — 子代理可能卡住，設定合理等待時間

## Verification Checklist

- [ ] 任務已正確分解
- [ ] 依賴關係已識別
- [ ] 子代理已啟動
- [ ] 結果已匯總
- [ ] 錯誤已處理或回報
