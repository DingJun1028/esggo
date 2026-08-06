# OmniAgent Gateway v3.0 — Connection Guide

VPS 上跑的 OmniAgent 閘道(`apps/gateway/omni-server.mjs`, pm2 `omniagent-gateway`),
負責讓其他 VPS / 裝置 / agent 經 OmniAgentBus 網狀網路互聯。

## 接入方式（兩種）

### A. HTTPS + WSS（推薦，唯一對外公開路徑）
Cloudflare 邊緣 TLS 終結 → VPS:80 (nginx `omniagent-sub`) → `127.0.0.1:8642`。

- REST base: `https://omniagent.esggo.co`
- WebSocket: `wss://omniagent.esggo.co/ws`  (OmniAgentBus Bridge 廣播頻道)

### B. 本機（VPS 內部）
- `http://127.0.0.1:8642` / `ws://127.0.0.1:8642`
- 用途：VPS 上其他服務（esggo-core / Next.js）呼叫 gateway。

> ⚠️ 公網裸 `http://161.118.248.180:8642` 已收斂為只聽 localhost（2026-07-11, PR #232）。
> 直接連 IP:8642 會被拒（MITM 風險 + 繞過 Cloudflare WAF）。請一律走子域 TLS。

## 認證
- 需 API key：`X-Omni-Token` / `X-Api-Key` / `Authorization: Bearer <key>` header。
- key 存於 VPS `apps/gateway/.env` 的 `GATEWAY_API_KEY`，由 pm2 啟動時讀入。
- 免認證端點（僅資訊揭露，不執行、不花錢）：`/health` `/status` `/models` `/skills` `/sonnar/status`
- 需認證端點（會調 LLM / 執行）：`/execute` `/stream` `/omni-jules` `/evolve` `/esg/skills/:taskType`

## 端點速查
| Method | Path | Auth | 說明 |
|--------|------|------|------|
| GET  | `/health`        | 否 | 健康（clients / errors） |
| GET  | `/skills`        | 否 | 技能註冊表（8 absorbed/transcended） |
| GET  | `/models`        | 否 | 免費模型清單 |
| POST | `/execute`       | 是 | 標準 AI 任務 |
| POST | `/stream`        | 是 | SSE 串流輸出 |
| POST | `/omni-jules`    | 是 | OmniJules 自癒 |
| POST | `/evolve`        | 是 | OmniAgent→OmniAgent 演化 pull |
| POST | `/swarm/broadcast` | 是 | 蜂群任務事件中繼（廣播所有 WS client） |
| POST | `/sync` (AgentBus) | 是 | 狀態同步廣播 |

## 連線範例（裝置端）
```js
// WebSocket 加入 OmniAgentBus
const ws = new WebSocket('wss://omniagent.esggo.co/ws', {
  headers: { 'X-Omni-Token': process.env.GATEWAY_API_KEY }
});
ws.on('message', (m) => {
  const evt = JSON.parse(m);
  if (evt.type === 'CONNECTED') console.log('OmniAgentBus bridged');
  // SWARM / SYNC / 心跳 廣播事件
});

// REST 執行任務
fetch('https://omniagent.esggo.co/execute', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'X-Omni-Token': process.env.GATEWAY_API_KEY },
  body: JSON.stringify({ task: 'draft GRI report', skillId: 'gri_report_draft' })
});
```

## 架構
```
[其他裝置/agent] ──TLS──> Cloudflare (omniagent.esggo.co)
                              │ 邊緣 SSL
                              ▼
                         VPS :80 (nginx omniagent-sub)
                              │ proxy_pass 127.0.0.1:8642
                              ▼
                   omni-server.mjs (pm2 omniagent-gateway, 只聽 127.0.0.1)
                              │ OmniAgentBus WebSocket broadcast
                              ▼
                  esggo-core / 其他已連線 WS client
```

## 運維
- 重啟：`pm2 restart omniagent-gateway`
- 日誌：`pm2 logs omniagent-gateway`
- 輪換 key：改 `apps/gateway/.env` 的 `GATEWAY_API_KEY` → `pm2 restart omniagent-gateway`
  （舊 key 立即失效；所有裝置端需同步新 key）
- 部署：改 `apps/gateway/*` 經合規 PR 合併 main → GitHub Actions CD 自動部署。
