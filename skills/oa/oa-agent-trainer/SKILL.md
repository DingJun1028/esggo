---
name: oa-agent-trainer
description: "Use when the user wants to optimize agent performance, analyze conversation bottlenecks, or improve prompt quality. Handles agent conversation analysis, prompt optimization suggestions, skill pruning, and performance benchmarking. Load when user mentions agent optimization, prompt tuning, or performance improvement."
version: 1.0.0
author: ESGGO OmniAgent
license: MIT
metadata:
  hermes:
    tags: [trainer, optimization, prompt, performance, agent, esggo]
    related_skills: [oa-summon, oa-memory-shards, oa-task-orchestrator]
---

# OA Agent Trainer — 代理訓練與優化

## Overview

分析代理對話記錄，找出瓶頸，建議 prompt 調整、skill 裁剪，提升整體代理效能。

## When to Use

- 用戶說「優化代理」、「加速」、「太慢」
- 需要分析代理效能瓶頸
- 需要建議 prompt 調整
- 需要裁剪/合併冗餘 skill

**Don't use for:** 建立新 skill（用 `oa-skill-scaffold`）、部署（用 `oa-deploy`）

## Core Workflow

### Step 1: 收集對話記錄

使用 `session_search` 搜尋過去對話：

```
session_search(query="slow OR timeout OR error", limit=5)
session_search(query="agent performance", limit=5)
```

### Step 2: 分析瓶頸

常見瓶頸類型：

| 瓶頸 | 症狀 | 原因 |
|------|------|------|
| 工具呼叫過多 | 回應 > 5min | 任務未正確分解 |
| 重複嘗試 | 同一指令執行 3+ 次 | context 不足 |
| 超時 | timeout 錯誤 | 任務太複雜 |
| 循環 | 反復做同一件事 | 停止條件未定義 |
| 上下文丟失 | 回答牛頭不對馬嘴 | context 太長被截斷 |

### Step 3: 優化建議

根據分析結果產生建議：

```
🤖 代理效能分析報告
━━━━━━━━━━━━━━━━━━━━━━
📊 分析期間: 最近 7 天
💬 對話數: 25 次
⏱️  平均回應時間: 3m 45s

🔴 發現的瓶頸:
  1. 過多工具呼叫（平均 12 次/任務，理想 < 5）
  2. 重複嘗試率 24%（理想 < 5%）
  3. 上下文溢出 3 次

💡 建議優化:
  1. 複雜任務先分解再執行（用 oa-task-orchestrator）
  2. 提供完整 context，減少追問
  3. 設定超時停止條件
  4. 合併重複的 skill 呼叫

📈 預期改善: 回應時間 -40%, 成功率 +15%
━━━━━━━━━━━━━━━━━━━━━━
```

### Step 4: Prompt 優化

分析現有 skill 的 prompt，建議改進：

| 問題 | 建議 |
|------|------|
| Prompt 太長 | 拆分到 references/，主 prompt 保留核心 |
不 | 加入具體觸發條件 |
| 輸出格式不明 | 定義明確的輸出模板 |
| 邊界模糊 | 加入 "Don't use for" 反向觸發 |

### Step 5: Skill 裁剪

識別冗餘 skill：

| 類型 | 處理 |
|------|------|
| 從未被載入的 skill | 考慮刪除 |
| 功能重疊的 skill | 合併 |
| 過時的 skill | 更新或刪除 |
| 太窄的 skill | 合併到相關 skill |

## Optimization Techniques

### Prompt 優化
1. **明確觸發條件** — "Use when X" 比 "Handle X" 更清晰
2. **加入範例** — 提供輸入/輸出範例
3. **定義邊界** — "Don't use for Y" 避免誤路由
4. **控制長度** — 8-15k chars 最佳

### Skill 結構優化
1. **拆分 references/** — 詳細內容移到 references/
2. **使用 linked_files** — 避免單檔過大
3. **定期清理** — 移除過時資訊

### 工作流程優化
1. **任務分解** — 複雜任務先用 oa-task-orchestrator
2. **快取結果** — 重複查詢使用快取
3. **批次操作** — 減少工具呼叫次數

## Common Pitfalls

1. **過度優化** — 不要為了 5% 效能重寫整個 skill
2. **忽略上下文** — 優化前先了解實際使用情境
3. **未驗證改動** — 優化後要測試新舊差異
4. **刪除過多** — 有些 skill 極少用但關鍵時有用

## Verification Checklist

- [ ] 對話記錄已分析
- [ ] 瓶頸已識別
- [ ] 優化建議已產生
- [ ] Prompt 已優化
- [ ] Skill 裁剪建議已提供
- [ ] 改善效果可量化
