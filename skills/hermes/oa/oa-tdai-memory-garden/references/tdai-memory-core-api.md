# TDAI memory-core API 探勘與誤判修正時間線

> 2026-08-23 實測於本機 Docker 棧（Windows + Docker Desktop）。
> 目標：把 OA-Team 30 代理接入 TDAI 記憶層（§4.2 知識花園）。

## 0. 服務發現
`docker ps` 暴露三容器（映像 `agentmemory/*`）：
- `tdai-memory-core` (8420) — 主 API（跑 `src/gateway/server.ts`，115KB）
- `tdai-memory-hub`  (8125)
- `tdai-proxy`      (8096)

本機 8420 經 Docker Desktop 轉發可連（無顯式 PORTS 映射）。

`GET /health` → `{"status":"ok","version":"0.1.0","stores":{"vectorStore":true,"embeddingService":true},"services":{"timerScanner":{...,"scansCompleted":20413},"pipelineWorker":{...},"stateBackend":"connected"}}`

## 1. 路由結構（反編 server.ts + v2-router.ts）
- `V2_PREFIX = "/v2"` → 子路徑集合：`/conversation/{add,query,search,delete,count}`
- `V3_PREFIX = "/v3"` → 同結構 + `/atomic/*` `/scenario/*` `/core/*` `/skill/*` `/meta/*` `/internal/meta/*`
- 所有 `/v2` `/v3` 請求先過 apiKey gate（Bearer 驗證），再分派
- **沒有 `/auth/verify` 路由**（omnicli 硬編的就是這條不存在的路）

## 2. 授權真機制
```
POST /v2/conversation/add
  Headers:
    Authorization: Bearer <TDAI_GATEWAY_API_KEY>   # 來自 OmniSecret 聖櫃 tdai_gateway.env
    x-tdai-service-id: <SVC>                       # 如 oa-team-swarm
    x-tdai-team-id:   oa-team-30                   # 隔離維度
    x-tdai-agent-id:  <萬能XX蜂 snake id>          # 隔離維度
  Body: {"messages":[{"role":"user","content":"..."}], "metadata":{...}}
  → 200 {"code":0,"message":"ok","data":{"accepted_ids":["msg-xxxx"],"total_count":1}}
```
狀態碼：
- 401 = 缺 `x-tdai-service-id`
- 400 = body 格式錯（如 `messages` 須為 array，錯誤訊息 `expected array, received undefined`）
- 404 = 路由不存在（如 `/auth/verify`、`/v2/health`、`/v3/meta`）
- 200 = 成功

`POST /v2/conversation/query` 同授權，body `{"query":"...","team_id":...,"agent_id":...}`。
注意：`query`/`search` 是**語意相似度搜尋 (top-K)**，非全列——團隊級查詢只回最相關 1 條（預期行為，不代表資料缺失）。要確認某 agent 寫入，用其 `agent_id` 隔離查詢。

## 3. 誤判修正時間線（本系列 session）
1. 初判「8420 是 Docker 空殼」→ 錯。實為 `tdai-memory-core` 真服務（`com.docker.backend.exe`/`wslrelay.exe` 是 Docker Desktop 轉發層，非空殼）。
2. `omni auth check --live` 回 502（CF `esggo.co` 頁）→ 初判「授權失敗」→ 錯。omnicli 硬編 `/auth/verify` 不存在；真授權走 Bearer gate 數據面。
3. `omni auth check --dry-run` 印 `[DRY-RUN]` 我誤判「授權成功」→ 錯。預演模式不驗證。
4. 最終：`POST /v2/conversation/add` 帶 Bearer+service-id → 200 真寫入 msg-4df863177cc7 → `query` 讀回 → 寫入讀回閉環全驗。

## 4. env 命名坑
`apps/gateway/sync/server.ts` 讀 `OMNI_KEY`/`GATEWAY_API_KEY`（裸名，無 `TDAI_` 前綴）。
聖櫃 `secret-vault/tdai_gateway.env` 只有 `TDAI_GATEWAY_API_KEY`。
→ 啟動 sync-engine 需：`GATEWAY_API_KEY=$TDAI_GATEWAY_API_KEY node dist/server.js`，否則 `FATAL: OMNI_KEY / GATEWAY_API_KEY not set`。

## 5. 代碼生成 `\n` 陷阱（Python）
用 `write_file`/`execute_code` 三重引號字串內寫 f-string 含 `\n`（如 `f"編碼蜂記憶:\n{var}"`）時，
`\n` 會被解釋為真換行 → `SyntaxError: unterminated f-string literal`。
**規避**：用字串拼接 `"編碼蜂記憶:\n" + var`，或 `textwrap.dedent` 區塊內避免 `\n`。
本次 session 因此重寫 `oa_cross_agent_task.py` 兩次才過。

## 6. urllib timeout 坑
本機 Python 環境對 `urllib.request.urlopen(timeout=...)` 偶發 `unexpected keyword argument 'timeout'`。
→ 改用 `http.client.HTTPConnection(host, port, timeout=5)`。
