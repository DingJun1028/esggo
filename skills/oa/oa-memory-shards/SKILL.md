---
name: oa-memory-shards
description: "Use when the user wants to manage, query, or inspect the OmniMemory Shards system. Handles memory shard extraction (from conversations, error logs, code reviews, web crawls), skill ultimate synthesis, shard relation management, and shard usage tracking. Load when user mentions memory shards, skill ultimates, or knowledge extraction."
version: 2.0.0
author: ESGGO OmniAgent
license: MIT
metadata:
  hermes:
    tags: [memory, shards, knowledge, extraction, synthesis, supabase, esggo]
    related_skills: [oa-supabase-query, oa-5t-enforcer, oa-summon, oa-deploy]
---

# OA Memory Shards — 記憶碎片完整體系 v2.0

## Overview

ESGGO 記憶碎片系統是一個基於 Supabase 的知識管理框架，負責從各種來源（對話、錯誤、審查、爬取）萃取有價值的記憶碎片，並透過 AI 合成技能奧義。

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Memory Shards v2.0                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Sources          Extraction         Storage                │
│  ──────────      ──────────         ──────────              │
│  conversation → AI extract    → omni_memory_shards          │
│  error_log    → AI extract    → omni_memory_shards          │
│  code_review  → AI extract    → omni_memory_shards          │
│  web_crawl    → Firecrawl + AI → omni_memory_shards          │
│  manual       → User input     → omni_memory_shards          │
│  auto_extract → Bus events     → omni_memory_shards          │
│                              ↓                              │
│                    synthesize (≥2 shards)                    │
│                              ↓                              │
│                    omni_skill_ultimates                      │
│                              ↓                              │
│                    omni_shard_relations                      │
│                    omni_shard_usage_log                      │
└─────────────────────────────────────────────────────────────┘
```

## Data Model

### omni_memory_shards

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| title | Text | 碎片標題 |
| description | Text | 詳細描述 |
| tags | Text[] | 關鍵技能標籤 |
| extracted_code_snippets | Text[] | 程式碼片段 |
| entropy_level | Integer | 熵值 (0=無有, 100=混亂) |
| importance_score | Numeric | 重要性 (0-1) |
| source_type | Text | 來源類型 |
| source_id | Text | 來源識別碼 |
| usage_count | Integer | 使用次數 |
| created_at | Timestamptz | 建立時間 |
| metadata | JSONB | 額外資料 |

### omni_skill_ultimates

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| skill_name | Text | 技能奧義名稱 |
| mastery_level | Text | Novice/Adept/Expert/Master |
| core_principles | Text[] | 核心原則 |
| synthesis | Text | 深度總結 |
| source_shards | UUID[] | 來源碎片 ID |
| void_dimension | Text | 無有維度 |
| application_count | Integer | 應用次數 |
| success_rate | Numeric | 成功率 (0-1) |

### Source Types

- `conversation` — 對話萃取
- `error_log` — 錯誤日誌
- `code_review` — 程式碼審查
- `web_crawl` — Firecrawl 網頁爬取
- `manual` — 手動建立
- `auto_extract` — Bus 自動萃取

### Void Dimensions (無有維度)

| Dimension | Description |
|-----------|-------------|
| Structural Void | 結構之無 — 消除 DOM 臃腫 |
| Logical Void | 邏輯之無 — 算力歸核 |
| Stateful Void | 狀態之無 — 量子糾纏 |
| Unified | 三元合一 |

## API Endpoints

### POST /api/agent/memory-shards

**Actions:**
- `extract_shard` — 從對話萃取碎片
- `synthesize_ultimate` — 合成技能奧義
- `create_manual` — 手動建立碎片
- `search` — 搜尋碎片
- `get_stats` — 取得統計
- `get_related` — 取得相關碎片
- `log_usage` — 記錄碎片使用

### GET /api/agent/memory-shards

**Types:**
- `shards` — 取得碎片列表
- `ultimates` — 取得奧義列表
- `stats` — 取得統計

## Usage Patterns

### Extract from conversation
```bash
curl -X POST /api/agent/memory-shards \
  -d '{"action":"extract_shard","conversationLog":"..."}'
```

### Synthesize ultimate from shards
```bash
curl -X POST /api/agent/memory-shards \
  -d '{"action":"synthesize_ultimate","shards":[{...},{...}]}'
```

### Search shards
```bash
curl -X POST /api/agent/memory-shards \
  -d '{"action":"search","filters":{"tags":["react"],"limit":10}}'
```

### Get stats
```bash
curl -X POST /api/agent/memory-shards \
  -d '{"action":"get_stats"}'
```

## Frontend Page

`/memory-shards` — 記憶碎片管理頁面

Tabs:
- 記憶碎片 — 卡片列表、搜尋、過濾
- 技能奧義 — 奧義列表、層級顯示
- 統計分析 — 數據卡片
- 碎片關聯 — 關聯圖（開發中）

## NCBDB Bidirectional Sync Pattern

### Architecture
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Local JSON  │ ←→  │  NCBDB API  │ ←→  │  Supabase   │
│  (VPS)       │     │  (Remote)   │     │  (Backup)   │
└─────────────┘     └─────────────┘     └─────────────┘
       ↑
       │ WebSocket Broadcast
       ↓
┌─────────────┐
│  Next.js    │
│  (Vercel)   │
└─────────────┘
```

### Key Files
- `omniagent-gateway/shared-memory.ts` — TypeScript 共享記憶層（VPS 端）
- `lib/ncbdb.ts` — NCBDB 客戶端
- `lib/dataconnect-memory.ts` — 三向同步

### Sync Flow
1. **Push**: 本地 `ncbSynced=false` 的 entries → NCBDB API POST
2. **Pull**: NCBDB API GET（since lastSync）→ 本地 cache
3. **Persist**: 本地 JSON 每 30 秒自動保存
4. **Broadcast**: WebSocket 即時通知所有代理

## User Preferences

### "最大效率輸出" (Maximum Efficiency Output)
停止測試/確認，直接修復並部署。批次所有修改到一個 commit。

### "打成記憶碎片" / "聖典文獻" (Sacred Texts)
從舊資料夾萃取知識到 `docs/archive/`，然後封存/刪除原始資料夾。

### "如果太麻煩 就重作" (Too Troubled → Rebuild)
立即從零重建。將舊程式碼封存到 `_archive/`，不要刪除。

## Common Pitfalls

1. **Supabase 未配置** — 碎片僅返回不存檔
2. **萃取失敗** — 對話內容太短或 AI 金鑰未設定
3. **合成失敗** — 至少需要 2 個碎片
4. **搜尋無結果** — tags 使用 contains 精確匹配
5. **Vercel Turbopack 構建失敗** — API route 不要直接 import `.ts` 檔案（特別是含有複雜 types 的）
6. **VPS Node.js 支援直接執行 TypeScript** — 不需要 tsc 編譯，直接將 `.mjs` 改名為 `.ts` 即可執行

## Verification Checklist

- [ ] Supabase 資料表已建立（執行 SQL migration）
- [ ] `SUPABASE_SERVICE_ROLE_KEY` 已設定
- [ ] `GEMINI_API_KEY` 已設定（AI 萃取用）
- [ ] API 路由正常運作
- [ ] 前端頁面可訪問
