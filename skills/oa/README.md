# OA Skills — ESGGO 萬能代理技能組

## 技能列表

### 既有技能（v1.0）

| 技能 | 用途 | 觸發詞 |
|------|------|--------|
| `oa-summon` | 入口 + 狀態顯示 | OA、召喚、啟動 |
| `oa-page-builder` | 頁面建置 | 建立頁面、建置 |
| `oa-design-fix` | 設計修復 | 顏色跑掉、修復 |
| `oa-deploy` | 一鍵部署 | 部署、上線 |
| `oa-5t-enforcer` | 5T 驗證 | 驗證、5T |
| `oa-supabase-query` | 資料查詢 | 查詢、資料庫 |
| `oa-memory-shards` | 記憶碎片 | 記憶、碎片 |
| `oa-ui-design-system` | 設計系統 | 設計、UI |
| `oa-vps-gateway` | VPS 閘道 | VPS、Gateway |

### 新增技能（v2.0）

| 技能 | 用途 | 觸發詞 |
|------|------|--------|
| `oa-skill-scaffold` | 技能腳手架產生器 | 建立技能、scaffold |
| `oa-task-orchestrator` | 子代理任務編排器 | 編排、同時跑、子代理 |
| `oa-report-assembler` | 永續報告自動組裝 | 產出報告、永續報告 |
| `oa-audit-scanner` | ESG 合規掃描器 | 掃描合規、稽核 |
| `oa-realtime-monitor` | 即時系統監控面板 | 監控、系統狀態 |
| `oa-research-analyzer` | ESG 研究分析器 | 研究、法規動態 |
| `oa-data-explorer` | 互動式資料探索 | 看看資料、查數據 |
| `oa-cron-scheduler` | 任務排程管理 | 排程、定時、cron |
| `oa-agent-trainer` | 代理訓練與優化 | 優化、加速、太慢 |

## 技能路由

```
用戶輸入 → oa-summon → 路由判斷
                              ├─ 建置 → oa-page-builder
                              ├─ 修復 → oa-design-fix
                              ├─ 部署 → oa-deploy
                              ├─ 驗證 → oa-5t-enforcer
                              ├─ 查詢 → oa-supabase-query
                              ├─ 記憶 → oa-memory-shards
                              ├─ 設計 → oa-ui-design-system
                              ├─ VPS  → oa-vps-gateway
                              ├─ 技能 → oa-skill-scaffold
                              ├─ 編排 → oa-task-orchestrator
                              ├─ 報告 → oa-report-assembler
                              ├─ 掃描 → oa-audit-scanner
                              ├─ 監控 → oa-realtime-monitor
                              ├─ 研究 → oa-research-analyzer
                              ├─ 探索 → oa-data-explorer
                              ├─ 排程 → oa-cron-scheduler
                              └─ 優化 → oa-agent-trainer
```

## 更新歷程

- v1.0 (2026-06-21): 初始 9 個技能
- v2.0 (2026-06-22): 新增 9 個技能（任務編排、報告組裝、合規掃描、監控、研究分析、資料探索、排程、代理訓練、技能腳手架）
