---
name: oa-realtime-monitor
description: "Use when the user wants to monitor real-time system status, check SSE connections, view API health, or track service metrics. Displays OmniHub connection status, Redis cache hit rate, API response time, and PM2 service health. Load when user mentions monitoring, system status, health check, or realtime dashboard."
version: 1.0.0
author: ESGGO OmniAgent
license: MIT
metadata:
  hermes:
    tags: [monitor, realtime, health, sse, metrics, dashboard, esggo]
    related_skills: [oa-summon, oa-deploy, oa-vps-gateway]
---

# OA Realtime Monitor — 即時系統監控面板

## Overview

顯示 ESGGO 系統的即時運行狀態。包含 SSE 連線、Redis 快取、API 回應時間、PM2 服務健康等指標。

## When to Use

- 用戶說「監控」、「系統狀態」、「health」
- 需要檢查即時連線狀態
- 需要查看服務健康指標
- 需要效能監控

**Don't use for:** 部署（用 `oa-deploy`）、VPS 管理（用 `oa-vps-gateway`）

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  Realtime Monitor v1.0                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Sources              Metrics            Display            │
│  ───────              ───────            ───────            │
│  /api/health    →    Uptime      →    狀態面板            │
│  /api/hub       →    SSE Count   →    連線數              │
│  Redis          →    Hit Rate    →    快取率              │
│  PM2            →    CPU/Mem     →    資源使用率          │
└─────────────────────────────────────────────────────────────┘
```

## Core Workflow

### Step 1: 健康端點檢查

```bash
# 本地
curl -s http://127.0.0.1:3000/api/health

# VPS
curl -s http://161.118.248.180/api/health
```

預期回應：
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "node": "v22.x",
  "uptime": 3600,
  "memory": { "used": 128, "total": 512 },
  "services": { "redis": true, "pm2": true }
}
```

### Step 2: SSE 連線狀態

```bash
# 檢查 Hub 統計
curl -s 'http://127.0.0.1:3000/api/hub?action=stats'
```

預期回應：
```json
{
  "activeConnections": 5,
  "totalEvents": 1234,
  "uptime": 7200
}
```

### Step 3: 系統指標

```
🖥️  系統監控面板
━━━━━━━━━━━━━━━━━━━━━━
📍 環境: Production (Vercel)
🟢 狀態: 健康
⏱️  運行時間: 2h 15m

📡 SSE 連線: 5 個活躍
📊 事件總數: 1,234
⚡ API P95: 120ms
💾 Redis 命中率: 94%

🔧 服務狀態:
  ✅ Vercel: 運行中
  ✅ Supabase: 運行中
  ✅ Redis: 運行中
  ✅ PM2 (VPS): 運行中
━━━━━━━━━━━━━━━━━━━━━━
```

## Metrics Reference

### API Response Time

| P95 | 狀態 | 顏色 |
|-----|------|------|
| < 200ms | 優秀 | 🟢 |
| 200-500ms | 正常 | 🟡 |
| 500ms-1s | 偏慢 | 🟠 |
| > 1s | 異常 | 🔴 |

### Redis Cache

| Hit Rate | 狀態 | 顏色 |
|----------|------|------|
| > 90% | 優秀 | 🟢 |
| 70-90% | 正常 | 🟡 |
| 50-70% | 偏低 | 🟠 |
| < 50% | 異常 | 🔴 |

### PM2 Resources

| CPU | Memory | 狀態 |
|-----|--------|------|
| < 50% | < 70% | 🟢 健康 |
| 50-80% | 70-85% | 🟡 注意 |
| > 80% | > 85% | 🔴 警告 |

## Alert Rules

| 條件 | 嚴重性 | 動作 |
|------|--------|------|
| API P95 > 2s | 🔴 嚴重 | 通知 + 檢查 |
| SSE 斷線 > 5min | 🔴 嚴重 | 通知 + 重啟 |
| Redis 命中率 < 50% | 🟠 警告 | 檢查快取策略 |
| PM2 CPU > 90% | 🟠 警告 | 檢查程序 |
| 記憶體 > 90% | 🔴 嚴重 | 通知 + 重啟 |

## Common Pitfalls

1. **健康端點未設置** — 需要 `app/api/health/route.ts` 存在
2. **SSE 連線數不準確** — 需要 Hub 有追蹤連線數的邏輯
3. **Redis 指標無法取得** — 需要 Redis INFO 命令支援
4. **VPS 指標需要 SSH** — 遠端監控需要 SSH 到 VPS 執行命令

## Verification Checklist

- [ ] `/api/health` 端點可訪問
- [ ] `/api/hub?action=stats` 返回正確格式
- [ ] SSE 連線數正確
- [ ] 指標顏色邏輯正確
- [ ] 告警規則已設定
