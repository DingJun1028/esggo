# OA Skills — ESGGO 萬能代理技能組 v2.0

## 架構分层

```
┌─────────────────────────────────────────────┐
│           應用層 (Application)              │
│  oa-summon            — 入口 + 狀態         │
│  oa-task-orchestrator — 子代理編排          │
│  oa-report-assembler  — 報告自動組裝        │
│  oa-audit-scanner     — 合規掃描            │
│  oa-realtime-monitor  — 即時監控            │
│  oa-data-explorer     — 資料探索            │
├─────────────────────────────────────────────┤
│           領域層 (Domain)                    │
│  oa-page-builder      — 頁面建置            │
│  oa-design-fix        — 設計修復            │
│  oa-5t-enforcer       — 5T 驗證             │
│  oa-research-analyzer — 研究分析            │
│  oa-memory-shards     — 記憶碎片            │
│  oa-agent-trainer     — 代理訓練            │
├─────────────────────────────────────────────┤
│           基礎層 (Infrastructure)            │
│  oa-deploy            — 一鍵部署            │
│  oa-supabase-query    — 資料查詢            │
│  oa-vps-gateway       — VPS 閘道            │
│  oa-cron-scheduler    — 排程管理            │
│  oa-ui-design-system  — 設計系統            │
│  oa-skill-scaffold    — 技能腳手架          │
└─────────────────────────────────────────────┘
```

## 技能列表

### 應用層

| 技能 | 用途 | 觸發詞 |
|------|------|--------|
| `oa-summon` | 入口 + 狀態顯示 | OA、召喚、啟動 |
| `oa-task-orchestrator` | 子代理任務編排 | 編排、同時跑、子代理 |
| `oa-report-assembler` | 永續報告自動組裝 | 產出報告、永續報告 |
| `oa-audit-scanner` | ESG 合規掃描 | 掃描合規、稽核 |
| `oa-realtime-monitor` | 即時系統監控 | 監控、系統狀態 |
| `oa-data-explorer` | 互動式資料探索 | 看看資料、查數據 |

### 領域層

| 技能 | 用途 | 觸發詞 |
|------|------|--------|
| `oa-page-builder` | 頁面建置 | 建立頁面、建置 |
| `oa-design-fix` | 設計修復 | 顏色跑掉、修復 |
| `oa-5t-enforcer` | 5T 驗證 | 驗證、5T |
| `oa-research-analyzer` | ESG 研究分析 | 研究、法規動態 |
| `oa-memory-shards` | 記憶碎片 | 記憶、碎片 |
| `oa-agent-trainer` | 代理訓練與優化 | 優化、加速、太慢 |

### 基礎層

| 技能 | 用途 | 觸發詞 |
|------|------|--------|
| `oa-deploy` | 一鍵部署 | 部署、上線 |
| `oa-supabase-query` | 資料查詢 | 查詢、資料庫 |
| `oa-vps-gateway` | VPS 閘道 | VPS、Gateway |
| `oa-cron-scheduler` | 任務排程 | 排程、定時、cron |
| `oa-ui-design-system` | 設計系統 | 設計、UI |
| `oa-skill-scaffold` | 技能腳手架 | 建立技能、scaffold |

## 技能路由

```
用戶輸入 → oa-summon → 路由判斷
                              ├─ 應用層
                              │   ├─ 編排 → oa-task-orchestrator
                              │   ├─ 報告 → oa-report-assembler
                              │   ├─ 掃描 → oa-audit-scanner
                              │   ├─ 監控 → oa-realtime-monitor
                              │   └─ 探索 → oa-data-explorer
                              ├─ 領域層
                              │   ├─ 建置 → oa-page-builder
                              │   ├─ 修復 → oa-design-fix
                              │   ├─ 驗證 → oa-5t-enforcer
                              │   ├─ 研究 → oa-research-analyzer
                              │   ├─ 記憶 → oa-memory-shards
                              │   └─ 優化 → oa-agent-trainer
                              └─ 基礎層
                                  ├─ 部署 → oa-deploy
                                  ├─ 查詢 → oa-supabase-query
                                  ├─ VPS  → oa-vps-gateway
                                  ├─ 排程 → oa-cron-scheduler
                                  ├─ 設計 → oa-ui-design-system
                                  └─ 技能 → oa-skill-scaffold
```

## 更新歷程

- v1.0 (2026-06-21): 初始 9 個技能（summon/page-builder/design-fix/deploy/5t-enforcer/supabase-query/memory-shards/ui-design-system/vps-gateway）
- v2.0 (2026-06-22): 新增 9 個技能，分三層架構
  - 應用層: task-orchestrator / report-assembler / audit-scanner / realtime-monitor / data-explorer
  - 領域層: research-analyzer / agent-trainer
  - 基礎層: cron-scheduler / skill-scaffold
