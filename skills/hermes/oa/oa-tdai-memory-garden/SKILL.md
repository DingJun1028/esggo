---
name: oa-tdai-memory-garden
description: OA-Team × TDAI memory-core 知識花園接線與授權實戰。
---

# OA-Team × TDAI 知識花園接線

## 觸發條件
- 要讓 OA-Team 30 代理共享記憶 / 實作 §4.2 知識花園 (Knowledge Garden)
- 要讀寫 TDAI memory-core（本機 Docker `agentmemory/*` 映像）
- 遇到 `omni auth check` 回 404/502、`/auth/verify` 不存在等授權問題
- 要從 OmniSecret 聖櫃 (`secret-vault/tdai_gateway.env`) 取 TDAI 憑證

## 核心事實（2026-08-23 真測，已寫入讀回閉環驗證）
`omnicli` (`esggo/cli/omnicli/src/gateway.ts`) 硬編 `http://localhost:8420/auth/verify`，
但**本體 TDAI memory-core 沒有 `/auth/verify` 路由**。勿沿此錯路徑診斷。

**真實授權機制**：
- 服務：Docker 容器 `tdai-memory-core`(8420) · `tdai-memory-hub`(8125) · `tdai-proxy`(8096)
  （映像 `agentmemory/memory-core` 等，跑 `src/gateway/server.ts`）
- 授權：`Authorization: Bearer <TDAI_GATEWAY_API_KEY>` + `x-tdai-service-id: <SVC>`
- 路由：`POST /v2/conversation/{add,query,search}`（body=`{messages:[{role,content}], metadata}`）
- 隔離：body `team_id`/`agent_id` 或 header `x-tdai-team-id`/`x-tdai-agent-id`
- 語意：`query`/`search` 為相似度搜尋 (top-K)，非全列；團隊級查詢只回最相關 1 條（預期，非缺失）
- 狀態碼：401=缺 service-id · 400=body 格式錯（`messages` 須為 array）· 200=成功
- health：`GET /health` → `{"status":"ok","stores":{"vectorStore":true,"embeddingService":true}}`

## OA-Team 接入方式
- `team_id = "oa-team-30"`（固定，隔離生產資料）
- `agent_id = 萬能XX蜂` 的 snake 映射：`queen-bee`/`planner-bee`/`coder-bee`/`strategist-bee`/`optimizer-bee`...（見 `oa_agents_data.json`）
- 寫：`remember(content, agent_id)` · 讀：`recall(query, agent_id, team_wide=False)`
- 實戰橋接見 `scripts/oa_memory_bridge.py`（已真測 30/30 寫入 + 隔離讀回）

## 常踩坑（已實測）
1. **env 命名不一致**：sync-engine (`apps/gateway/sync/server.ts`) 讀 `OMNI_KEY`/`GATEWAY_API_KEY`（無 `TDAI_` 前綴）；聖櫃只有 `TDAI_GATEWAY_API_KEY` → 啟動需 `GATEWAY_API_KEY=$TDAI_GATEWAY_API_KEY` 映射，否則 `FATAL: OMNI_KEY not set`
2. **8420 被 Docker/WSL 佔用**：`com.docker.backend.exe`/`wslrelay.exe` 轉發到本機；實際是 memory-core 真服務，非空殼
3. **代碼生成 `\n` 陷阱**：用 `write_file`/`execute_code` 產 Python 時，三重引號內 f-string 的 `\n` 會被當真換行 → `SyntaxError: unterminated f-string literal`。改用字串拼接（`"a\n" + var`）或 `textwrap.dedent` 內避免 `\n`
4. **urllib timeout 參數**：本機 Python 環境對 `urllib.request.urlopen(timeout=...)` 偶發 `unexpected keyword argument 'timeout'` → 改用 `http.client.HTTPConnection(host,port,timeout=5)`
5. **熵減腳本路徑**：`swarm-entropy-iteration.py` 在 `skills/autonomous-ai-agents/oa-team-soul-canon/scripts/`，不在工作目錄 cwd

## 驗證清單
- [x] `docker ps` 確認 tdai-memory-core 在跑
- [x] `GET /health` 回 `status:ok`
- [x] `POST /v3/conversation/add` 帶 Bearer+service-id → 200（寫入 msg-7006f6eb0568）
- [x] Claude Code proxy: `POST /claude-code/default/v1/messages` → 200 (Anthropic JSON)
- [x] 不同 agent_id 隔離讀回各自記憶

## Proxy + Cloudflare Tunnel (§17 網關)
- **Proxy** (tdai-proxy:8096): full stack `auth=true, tdai=true, session-init=true`
  - Adds `/claude-code/default/v1/messages` route (Anthropic-compatible format)
  - TDAI memory injection on every request: `injectors=["skill","knowledge","tdai-memory"]`
  - Bug fix: proxy `start-proxy.sh` uses `MEMORY_CORE_URL` 變數 (default `http://127.0.0.1:8420` for host networking, NOT `memory-core:8420` Docker DNS)
- **Cloudflare Tunnel** (`/etc/cloudflared/config.yml`):
  - `memory.esggo.co → http://127.0.0.1:8096` (proxy: Claude Code API + Panel)
  - `gateway.esggo.co → http://127.0.0.1:8420` (memory-core: L0-L3 API)
  - `hermex.esggo.co → http://127.0.0.1:8790` (Hermes WebUI, 30h uptime, `unless-stopped`)
  - Restart: `sudo pkill -9 cloudflared; nohup cloudflared tunnel --config /etc/cloudflared/config.yml run esggo-tunnel`

## Obsidian 三端同步 (§18 Knowledge Garden)
- **Vault**: `C:/Project/esggo/vault/` (branch `feature/aistian-core-modules`)
- **3 端**: Desktop (Windows) + Mobile (iOS/Android) + Git (GitHub DingJun1028/esggo)
- **Plugins**: obsidian-git + obsidian-git (BRAT) + local-rest-api + hermes-agent
- **Daily cron**: `30 5 * * * tdai-memory-sync.mjs` → 140 知識分身 sync (100% success)
- **Memory capture**: 透過 `/v3/conversation/add` 把 `.avatar-registry.json` 寫入 TencentDB L0

## 關鍵修復 (Windows git-bash)
| Bug | Fix |
|-----|-----|
| `/usr/bin/curl` not found | → `curl` (in `/mingw64/bin`) |
| `localhost` WSL2 loopback fail | → `127.0.0.1` |
| `curl -o /dev/null` → error (23) | → `-w "%{http_code}" \| tail -c 3` |
| proxy `memory-core:8420` DNS fail (host networking) | → `MEMORY_CORE_URL=http://127.0.0.1:8420` |

## 參考
- `references/tdai-memory-core-api.md`：完整 API 探勘、路由結構、誤判修正時間線
- `scripts/oa_memory_bridge.py`：可重跑的 30 代理記憶橋接層（含 oa_agents_data.json 映射）
- `references/obsidian-3-endpoint-sync.md`：三端同步設置步驟
