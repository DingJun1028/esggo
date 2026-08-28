# OAB / TencentDB v3 data-plane 寫入（oa-swarm 整合）

來源：`tencentdb-agent-memory` skill `references/v3-dataplane-api-2026-08.md` + 本會話實戰驗證（2026-08-20）。

## Base + auth
- Core: `http://127.0.0.1:8420`（VPS 私有網路內，本機 Hermes cronjob 連不到）
- Proxy `tdai-proxy` :8096（可選）
- Auth: `Authorization: Bearer <key>` + `x-tdai-service-id: default`
- key = `/opt/esggo/apps/tencentdb-memory/.admin-key`（39 bytes `sk-mem-...`）。VPS host shell 無 `TDAI_GATEWAY_API_KEY`，必讀檔案。

## 寫入（驗證成功）
```
POST /v3/conversation/add
headers: Authorization: Bearer <key>, x-tdai-service-id: default, Content-Type: application/json
body: {"messages":[{"role":"user","content":"<json-string-of-OABMessage>"}]}
→ {"code":0,"message":"ok","data":{"accepted_ids":["msg-..."],"total_count":1}}
```

## 查詢
```
POST /v3/conversation/query  body: {"limit":5}
→ {data:{messages:[{content:"..."}]}}
```

## 404 陷阱（全部不存在）
- `/v1/memory` `/memory` `/v3/{service}/memory` `/v3/default/knowledge` `/v1/default/ingest` `/knowledge/ingest`
- 用 **flat** `/v3/conversation/add`（service 來自 header，不在 URL）

## oa-swarm OABClient 整合模式
- `publish(msg)` 包 try/catch，失敗回 `false`（不阻塞蜂群 5T 流程）。
- `/oab` 端點回 `{connected, synced}` 供探活。
- 雙蜂隧道：`DualHiveTunnel` 分 local(`http://localhost:8420`) / vps(`https://memory.esggo.co/gateway`) 實例。
