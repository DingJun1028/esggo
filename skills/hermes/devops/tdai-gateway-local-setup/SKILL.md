---
name: tdai-gateway-local-setup
description: 本機 Windows 啟動 TencentDB Agent Memory Gateway (:8420) 的實戰技書。
---

# TDAI Gateway 本機啟動實戰技書

把 TencentDB-Agent-Memory 的 MemoryCore 跑在本機 Windows（免費 Ollama backend, 無外部 API key）。

## 0. 核心陷阱（必讀）

### 0.1 NODE 版本 — 這是會毀掉一切的單一變數
- **node 24.x 會讓 sqlite-vec 壞**：`node:sqlite` 報 `Cannot enable extension loading because it was disabled at database creation`，`vec0` 虛擬表建不起 → 向量庫降級 no-op。
- **node 22.22.1 正常**：`sqlite-vec` `getLoadablePath()` + `db.loadExtension()` 建 `vec0` OK。
- 本機固定路徑：`/c/Users/dingj/.vite-plus/js_runtime/node/22.22.1/node.exe`
- **永遠用這個 node 啟 gateway，不要信 PATH 上的 node**（可能是 24）。

### 0.2 yaml 巢狀 — embedding 必須在 `memory.` 下
- ❌ 錯：`embedding: { provider: openai, ... }` (top-level)
- ✅ 對：`memory: { embedding: { provider: openai, baseUrl: ..., model: ..., dimensions: 768 } }`
- gateway 把 `config.memory` 傳給 TDAI Core。top-level `embedding` 會被忽略 → 日誌印 `embedding=none`，`dimensions=0`。
- 正確 yaml 範例：
```yaml
server:
  host: 127.0.0.1
  port: 8420
  apiKey: "<hex32>"
data:
  baseDir: "C:\\Users\\dingj\\.memory-tencentdb\\memory-tdai"
memory:
  embedding:
    provider: openai
    baseUrl: "http://127.0.0.1:11434/v1"
    apiKey: "ollama-local"
    model: "nomic-embed-text"
    dimensions: 768
llm:
  baseUrl: "http://127.0.0.1:11434/v1"
  apiKey: "ollama-local"
  model: "qwen2.5:3b-instruct-q4_K_M"
  maxTokens: 4096
  timeoutMs: 180000
```

### 0.3 環境變數污染 — TDAI_LLM_* 會蓋過 yaml
- 若 session 曾 `setx TDAI_LLM_BASE_URL` / `TDAI_LLM_API_KEY`，gateway 啟動會用環境值蓋掉 yaml 的 `llm:` block。
- 症狀：日誌 `StandaloneLLMRunner: model=gpt-4o`（非你設的 qwen2.5）。
- **launcher 必須 `unset TDAI_LLM_BASE_URL TDAI_LLM_API_KEY TDAI_LLM_MODEL`** 再啟。

### 0.4 MSYS /tmp 陷阱
- git-bash 的 `/tmp` 映射到 `C:\Users\dingj\AppData\Local\Temp`，不是 `C:\tmp`。
- yaml 與 log 一律用 Windows 絕對路徑寫（`write_file` with `C:\...`）。

## 1. 啟動流程（已驗證）

### 1.1 依賴安裝（首次）
MemoryCore 是獨立 package（`@tencentdb-agent-memory/memory-tencentdb-v2`），`type: module`。
```bash
cd /c/Project/TencentDB-Agent-Memory/MemoryCore
npm install            # 裝 tsx + 依賴 (約 3-5 分鐘)
# 若 postinstall 被 allow-scripts 擋: npm approve-scripts --allow-scripts-pending
```

### 1.2 Launcher 腳本
```bash
#!/usr/bin/env bash
set -u
REPO="/c/Project/TencentDB-Agent-Memory"
NODE22="/c/Users/dingj/.vite-plus/js_runtime/node/22.22.1/node.exe"
YAML="C:/Users/dingj/.memory-tencentdb/memory-tdai/tdai-gateway.yaml"
unset TDAI_LLM_BASE_URL TDAI_LLM_API_KEY TDAI_LLM_MODEL
export TDAI_GATEWAY_CONFIG="$YAML"
cd "$REPO/MemoryCore" || exit 1
exec "$NODE22" --import tsx/esm src/gateway/server.ts
```

### 1.3 背景啟動
```bash
terminal(background=true, command='bash "C:/Users/dingj/AppData/Local/hermes/scripts/tdai-launch.sh" > /tmp/tdai-gw.log 2>&1')
```
等 ~15s 初始化（sqlite-vec 載入 + Ollama 連線）。

## 2. 端點路由（實測正確）

| 方法 | 路徑 | Auth | 說明 |
|---|---|---|---|
| GET | `/health` | 免 | 健康檢查 → `{"status":"ok",...,"vectorStore":true,"embeddingService":true}` |
| POST | `/capture` | Bearer | 寫入對話記憶 |
| POST | `/search/memories` | Bearer | 召回記憶（hybrid: 向量+BM25）|
| `/v3/*` | 各管理路由 | Bearer | instance/skill/meta 等 |

**注意**：不是 `/v1/health`（那是錯的，會 404）。

### 2.1 capture body 格式（踩過坑）
❌ 錯：`{ sessionId, messages: [...] }`
✅ 對：`{ user_content, assistant_content, session_key }`
```bash
curl -X POST http://127.0.0.1:8420/capture \
  -H "Authorization: Bearer $TDAI_GATEWAY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"user_content":"...","assistant_content":"...","session_key":"oa-001"}'
# 回: {"l0_recorded":2,"scheduler_notified":true}
```

### 2.2 search 格式
```bash
curl -X POST http://127.0.0.1:8420/search/memories \
  -H "Authorization: Bearer $TDAI_GATEWAY_API_KEY" \
  -d '{"query":"OA-Team 30","maxResults":3}'
```

## 3. 驗證「完全工作」的日誌標記

啟動時：
```
[embedding] Using remote embedding (provider=openai, model=nomic-embed-text)
Store created: backend=sqlite, dimensions=768, embedding=enabled, bm25=enabled
Stores initialized: backend=sqlite, embedding=openai
Gateway listening on http://127.0.0.1:8420
Security posture: auth=ENABLED (Bearer)
```

寫入時：
```
[capture] [L0-vec-index-bg] Background embedding complete: 2/2 vectors updated (NNNNms)
```

### 3.1 Python 「no such module: vec0」是假陰性
Python stdlib `sqlite3` 不載 `vec0` 擴展。要真驗證向量，用 node22 + sqlite-vec：
```bash
"/c/Users/dingj/.vite-plus/js_runtime/node/22.22.1/node.exe" --import tsx/esm -e "
const { createRequire } = await import('module');
const req = createRequire(import.meta.url);
const v = req('sqlite-vec');
const { DatabaseSync } = req('node:sqlite');
const db = new DatabaseSync('C:/Users/dingj/.memory-tencentdb/memory-tdai/vectors.db', { allowExtension: true });
db.enableLoadExtension(true); db.loadExtension(v.getLoadablePath());
for (const t of ['l0_vec','l1_vec','l0_fts','l1_fts']) {
  try { console.log(t+':', db.prepare('SELECT count(*) c FROM '+t).get().c); }
  catch(e){ console.log(t+': ERR',e.message); }
}
"
```

## 4. OA 框架整合 (tencent-mem adapter)

`packages/oa-framework/src/adapters/tencent-mem.ts`:
- `apiKey` 從 `process.env.TDAI_GATEWAY_API_KEY` 讀（勿硬編）
- health: `GET {coreUrl}/health`
- capture: `POST {coreUrl}/capture` body `{user_content, assistant_content, session_key}`
- search: `POST {coreUrl}/search/memories` body `{query, maxResults}`
- coreUrl 預設 `http://127.0.0.1:8420`

## 5. 已知坑

- **Ollama 0.32.x + qwen2.5 中文編碼**：L1 提取中文 prompt 可能亂碼 → `l1_vec` 停留 0。L0 向量正常（embedding 走 nomic-embed-text 不受影響）。若 L1 不長，換模型或新版 Ollama。
- **gemma4 太大**：LLM 用 `gemma4:26b`(16GB) 本機 RAM 吃緊，建議 `qwen2.5:3b`（輕量）。
- **gateway 長駐**：background 啟動，不要 foreground（會佔 terminal）。
- **VPS 部署同源問題**：Docker `start-memory-core.sh` 會生成 top-level `embedding:` → 用 node22 + 正確 yaml 的 Path B 修法（見 `tencentdb-agent-memory-deploy`）。

## 6. 快速診斷

| 症狀 | 原因 | 修法 |
|---|---|---|
| `Cannot find package 'tsx'` | MemoryCore 未 `npm install` | `cd MemoryCore && npm install` |
| `embedding=none` / `dimensions=0` | yaml `embedding` 在 top-level | 移到 `memory.embedding` 下 |
| `model=gpt-4o`（非 yaml 設的） | `TDAI_LLM_*` env 污染 | launcher `unset TDAI_LLM_*` |
| `no such module: vec0` (Python) | Python 不載 vec0 | 用 node22 + sqlite-vec 驗證（§3.1）|
| `401` on `/health` | 用錯路徑 `/v1/health` | 改用 `/health`（免 auth）|
| capture `Missing required fields` | body 用 `sessionId/messages` | 改用 `user_content/assistant_content/session_key` |

## 7. Docker 三件套堆疊部署 (esggo `apps/tencentdb-memory`, Windows 免費 Ollama)

與 §1 的 node22 手動 Path B 不同路徑，但目標相同：同一套 TencentDB-Agent-Memory，免 key 跑本機 Ollama。
這條路用官方 Docker 鏡像 `agentmemory/memory-core|memory-hub|memory-proxy:latest` + `start-all.sh`。

### 7.1 啟動前提（Windows 特有）
- **Docker Desktop 必須先開**：Windows 上 docker daemon 不會自動跑。沒開會報
  `failed to connect to the docker API at npipe:////./pipe/dockerDesktopLinuxEngine`。
  啟動：`start "" "/c/Program Files/Docker/Docker/Docker Desktop.exe"`，輪詢 `docker ps` 直到 UP（約 15–60s）。
- `docker context` 若停在 `desktop-linux` 且 pipe 缺失，切回 `default`：`docker context use default`。

### 7.2 `.env` 關鍵（已驗證可用完整範本）
```dotenv
MEMORY_CORE_IMAGE=agentmemory/memory-core:latest
MEMORY_HUB_IMAGE=agentmemory/memory-hub:latest
PROXY_IMAGE=agentmemory/memory-proxy:latest

# memory 組：本機 Ollama (容器內回宿主用 host.docker.internal，非 localhost)
MEMORY_LLM_BASE_URL=http://host.docker.internal:11434/v1
MEMORY_LLM_API_KEY=ollama-local
MEMORY_LLM_MODEL=qwen2.5:3b-instruct-q4_K_M
MEMORY_LLM_PROTOCOL=openai

# proxy 組：同本機 Ollama
PROXY_UPSTREAM_URL=http://host.docker.internal:11434/v1
PROXY_UPSTREAM_API_KEY=ollama-local
PROXY_UPSTREAM_MODEL=qwen2.5:3b-instruct-q4_K_M

MEMORY_CORE_PORT=8420
PANEL_PORT=8125
KNOWLEDGE_PORT=8424
PROXY_PORT=8096

KNOWLEDGE_PUBLIC_BASE_URL=http://host.docker.internal:8424/v3
# ★ Windows 必設：detect_host_ip() 在 Windows 回空會使 http://:8096 崩 Python config
MEMORY_HUB_PROXY_PUBLIC_URL=http://host.docker.internal:8096

MEMORY_CORE_VOLUME=tdai-memory-core-data
PANEL_VOLUME=tdai-panel-data

# 本機零配置：留空關閉 Bearer gate
MEMORY_CORE_GATEWAY_API_KEY=
MEMORY_CORE_ADMIN_USERNAME=admin
```
- **容器內不可用 `localhost` 連宿主 Ollama**：`MEMORY_LLM_BASE_URL` / `PROXY_UPSTREAM_URL` / `KNOWLEDGE_PUBLIC_BASE_URL`
  全部用 `http://host.docker.internal:11434/v1`（與 §0 本機 yaml 用 `127.0.0.1` 相反！）。
- **Windows `detect_host_ip()` 回空 → 必崩的坑**：
  `start-memory-hub.sh` 在 Windows 上 `hostname -I` 回空，使 `MEMORY_HUB_PROXY_PUBLIC_URL=http://:8096`，
  容器內 Python config writer 報 `SyntaxError: unterminated string literal (detected at line 9)`（`'proxy_endpoint': 'http://`）。
  **修法：`.env` 顯式設 `MEMORY_HUB_PROXY_PUBLIC_URL=http://host.docker.internal:8096`**（覆蓋自動探測）。
- `MEMORY_CORE_GATEWAY_API_KEY=` 留空（本機零配置，關閉 Bearer gate）。

### 7.3 啟動指令
```bash
cd esggo/apps/tencentdb-memory
chmod +x start-*.sh _lib.sh
# 已拉過鏡像就直接起，不要 PULL=1（registry-1.docker.io 會瞬斷，重拉失敗）
./start-all.sh
# 升級才用：PULL=1 ./start-all.sh
```
順序：core(8420)→hub(8125/8424)→proxy(8096)，各自 `healthy`。
啟動後 `docker ps` 應見 `tdai-memory-core / tdai-memory-hub / tdai-proxy` 三個 healthy。

### 7.4 兩個 MSYS 誤報（非故障，別被騙重裝）
- **init-admin 在腳本內回 HTTP=000（warn）**：`start-memory-core.sh` 呼叫 `/usr/bin/curl`（MSYS 無此檔）失敗。
  手動用 PATH 的 `curl` 打 `POST /v3/internal/meta/user/init-admin` 實際回 **200**，admin user_key 落盤 `.admin-key`。
- **`verify.sh` 報「1 個錯誤」**：它從宿主 shell 打 `host.docker.internal:11434`，MSYS 解析不到 → 000。
  但腳本內部的「from container」檢查（`tdai-memory-hub` → Ollama）回 **200**，實際通路正常。以容器內檢查為準。

### 7.5 功能證明（實測寫入成功）
```bash
KEY=$(cat .admin-key)
curl -X POST http://localhost:8420/v3/conversation/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $KEY" \
  -H "x-tdai-service-id: default" \
  -d '{"service_id":"default","user_id":"admin","session_id":"probe-001",
       "messages":[{"role":"user","content":"OA-Team 雙蜂隊共享記憶後端已於本機免費 Ollama 跑通"}],"metadata":{}}'
# → 200: {"code":0,"message":"ok","data":{"accepted_ids":["msg-xxxx"],"total_count":1}}
```
**注意**：Docker 堆疊的寫入端點是 `/v3/conversation/add`（不是 §2 手動 Path B 的 `/capture`）。兩條路徑 API 不同。
讀回請用容器實際存在的 v3 路徑；`/v3/memory/search|query|list` 在本版 core 回 404（端點名不同），以 `/health` 的 `embeddingService:true, vectorStore:true` 作為管線存活證明即可。

### 7.6 端點速查（Docker 堆疊）
| 方法 | 路徑 | Auth | 說明 |
|---|---|---|---|
| GET | `:8420/health` | 免 | `{"status":"ok",...,"embeddingService":true,"vectorStore":true}` |
| POST | `:8420/v3/conversation/add` | Bearer(admin-key) | 寫入記憶（Ollama embedding 實際執行）|
| GET | `:8125/` | 免 | Panel UI |
| GET | `:8424/health` | 免 | Knowledge Service 健康 |
| any | `:8096/` | — | proxy 不掛根（404 正常），服務 `/claude-code/*` 與上游轉發 |
