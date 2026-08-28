# TencentDB Agent Memory — 完整服務棧部署（global-images / Docker）

不同於 npm `memory-tencentdb` 套件（Hermes 本地 Gateway），`TencentCloud/TencentDB-Agent-Memory` 倉庫的 `deploy/global-images/` 是**完整伺服器棧**：一鍵拉起 MemoryCore(8420) + MemoryHub/Panel(8125) + Knowledge(8424) + Proxy(8096)。

## 端口
| 服務 | 端口 | 用途 |
|---|---|---|
| memory-core | 8420 | 記憶核心 + Gateway API |
| memory-hub (Panel) | 8125 | 記憶中樞 UI |
| knowledge | 8424 | Knowledge/Wiki 工具接口（/v3） |
| proxy | 8096 | 上游 LLM 轉發（Claude Code 接此） |

## 一鍵啟動（start-all.sh）
順序：memory-core（等 healthy）→ memory-hub → proxy。`PROXY_FULL_STACK=1` 開完整流水線（auth + sessionInit + tdai 注入）。

## .env 注入（Groq 範例，雙組 LLM 共用）
`.env.example` 含 `REPLACE_ME` 佔位（MEMORY_LLM_* 與 PROXY_UPSTREAM_* 兩組）。VPS 端產生 .env：
```bash
sed -e 's#REPLACE_ME#<GROQ_KEY>#g' \
    -e 's#https://api.deepseek.com/v1#https://api.groq.com/openai/v1#g' \
    -e 's#deepseek-chat#openai/gpt-oss-20b#g' \
    .env.example > .env
echo 'MEMORY_LLM_PROTOCOL=openai' >> .env
echo 'PROXY_FULL_STACK=1' >> .env
```
- 密鑰**不進 git**（`.gitignore` 排除 `.env`；`.env.example` 可提交）。
- 無法讀 GitHub Secret 明文值時，需使用者貼 key 或由密鑰庫管理員調閱。

## 實戰坑（2026-08-06 esggo VPS 實際部署，全已踩過並解決）
1. **CRLF**：`.env.example` 經 Windows Git CRLF 轉換 → 產生的 `.env` 含 `\r` → `start-all.sh` 報 `$'\r': command not found` (EXIT 127)。修：`sed -i "s/\r$//" .env`。
2. **chmod +x**：`git reset --hard` 同步後腳本失去執行位 → `chmod +x start-*.sh _lib.sh verify.sh`（否則 `Permission denied` EXIT 126）。
3. **VPS /opt/esggo 權限**：巢狀子目錄若曾由 root 寫入，ubuntu 跑 `git pull` / docker 解包會 `Permission denied` / `failed to write object`。修：`sudo chown -R ubuntu:ubuntu /opt/esggo`（一次性）。
4. **慢 pull 超時**：`PULL=1 ./start-all.sh` 拉鏡像超 180s 終端超時（容器在背景繼續起，但 ssh 連線斷）。修：VPS 端 `nohup bash start-all.sh >/tmp/x.log 2>&1 &` 背景跑，再 `docker ps` 輪詢；或 `sleep 150` 後查 `tdai-memory-*` 容器狀態。
5. **ufw 未開端口**：VPS 只開 22/80/443，8125/8420 等未對外；內部 `curl localhost:8420/health` 驗活，公網需 nginx/Tunnel。**不要裸開端口**（Panel 含 admin key 風險）。

## 公網暴露（最佳實踐：Cloudflare Tunnel，不裸開端口、不需 certbot）
1. nginx `:80`-only 反向代理（tunnel 終止 TLS，origin 走明文 :80）：
   ```
   server { listen 80; server_name memory.esggo.co;
     location /gateway/ { proxy_pass http://127.0.0.1:8420/; ... }
     location / { proxy_pass http://127.0.0.1:8125; ... } }
   ```
   **不要**監聽 443、不要 certbot（certbot 會因 DNS 未解析而失敗）。
2. cloudflared tunnel ingress 加 `memory.esggo.co → http://127.0.0.1:80`，`sudo systemctl restart cloudflared`。
3. **建 DNS CNAME**（用 tunnel 自身憑證，不需外部 API token）：
   `cloudflared tunnel route dns <TUNNEL_ID> memory.esggo.co`
   等 ~60s 傳播。驗證：`nslookup memory.esggo.co 8.8.8.8` 應回 Cloudflare 邊緣 IP。

## 驗證
- 內部：`curl -sf localhost:8420/health` → `{"status":"ok",...}`；`curl -sf localhost:8125/` → Panel HTML。
- 公網（經 Tunnel）：`curl -s -o /dev/null -w "%{http_code}" https://memory.esggo.co/` → 200；`curl https://memory.esggo.co/gateway/health` → `{"status":"ok",...}`。
- admin key 存 `.admin-key`（`sk-mem-...`），供 OA-Team 蜂群 Gateway Bearer 用。
- OA-Team 蜂群在 VPS 內透過 `localhost:8420` 共享記憶（內網最安全）；跨機經 `https://memory.esggo.co/gateway/`。

## 與既有 tencentdb-agent-memory skill 的區別
- 該 skill 講的是 Hermes `memory.provider: memory_tencentdb`（npm 套件、本地 SQLite+Gateway 8420、L0–L3 管線）。
- 本棧是**獨立部署的記憶後端服務**（Docker 容器、多服務、可供多 agent 共享），非 Hermes 內建 provider。兩者可並存。

---

## Ollama 自託管路徑（2026-08-09 實戰，零 API 成本）

**觸發場景**：VPS 上無 Groq `gsk_` key（或缺 key 時不想依賴外部付費端點），改用 VPS 本機 Ollama（`gemma4:e4b` + `nomic-embed-text`）跑全套。本路徑已 commit 回倉庫（`apps/tencentdb-memory/start-*.sh`：`NETWORK=host` + `embedding=ollama`），作為預設自託管選項。

### 關鍵坑（本 VPS 實測，Groq 路徑不會遇到）
1. **`host.docker.internal` 在此 VPS 不可達**（`docker run --add-host=host.docker.internal:host-gateway` 失效，容器內 `curl` 該名 → UNREACHABLE）。→ 改 `--network host` 模式：core 容器共享宿主網路，`localhost:11434` = 宿主 Ollama。
   - 三腳本 `start-*.sh` 頂部 `NETWORK=tdai-memory-stack` → 改 `NETWORK=host`；並**刪除** `--network-alias <x>` 與 `--add-host=host.docker.internal:host-gateway` 兩行（host 模式不支援 alias）。
2. **Ollama 預設只聽 `127.0.0.1`** → 容器（即便 host 模式）連不到。修：systemd override 讓 Ollama 聽 `0.0.0.0`：
   ```bash
   sudo mkdir -p /etc/systemd/system/ollama.service.d
   printf '[Service]\nEnvironment="OLLAMA_HOST=0.0.0.0:11434"\n' | sudo tee /etc/systemd/system/ollama.service.d/override.conf
   sudo systemctl daemon-reload && sudo systemctl restart ollama
   ```
3. **`.env` 的 `MEMORY_LLM_BASE_URL` / `PROXY_UPSTREAM_URL` 用 `http://localhost:11434/v1`**（host 模式下容器內 localhost = 宿主 Ollama；勿用 `host.docker.internal` 或 `172.17.0.1`/`172.18.0.1`，因 docker bridge gateway 不對應宿主 `0.0.0.0` 監聽）。
4. **embedding 段要顯式啟用**：`start-memory-core.sh` 生成的 config 裡 `embedding:` 預設 `provider: none`。改為：
   ```yaml
   embedding:
     provider: ollama
     baseUrl: "${MEMORY_LLM_BASE_URL}"   # 用變數, 勿硬碼 localhost
     model: "nomic-embed-text"
   ```
   先 `ollama pull nomic-embed-text`（~274MB）。

### 已知限制（非配置錯誤，源碼層）
- `curl` 手測容器內 Ollama embed 正常（返回 768 維），core 日誌也識別 `embedding=ollama`，但 `/health` 仍回 `embeddingService:false` + `dimensions=0`，且 `docker restart` 無法修復。
- 根因：memory-core 在 `Store created` 階段只探測一次維度，拿到 0 就永久 `disabled`（即便後來 Ollama 已 ready）。這是鏡像啟動探測時序問題，非網路/配置問題。
- **影響**：vectorStore + bm25 檢索仍可用（記憶可存可取），僅語意 embedding 向量檢索弱。待 memory-core 鏡像升級才會完全啟用。部署時誠實報告此狀態，勿假稱 embedding 已通。

### 驗證（自託管路徑）
- `docker ps` 三 `tdai-*` healthy（core/hub/proxy）
- `curl -sf localhost:8420/health` → `{"status":"ok",...}`（注意 `embeddingService` 可能仍 false，屬已知限制）
- `docker exec tdai-memory-core curl -sf http://localhost:11434/api/embed -d '{"model":"nomic-embed-text","input":"x"}'` → 確認 Ollama 從容器內可達
- Panel `8125` HTTP 200、Knowledge `8424/health` 200
