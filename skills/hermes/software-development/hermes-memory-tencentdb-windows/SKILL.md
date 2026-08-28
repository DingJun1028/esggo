---
name: hermes-memory-tencentdb-windows
description: Build TencentDB Agent Memory (memory_tencentdb provider) into an existing Windows-native Hermes install — official bat path, HERMES_HOME override, Groq free LLM, Gateway Bearer auth, verification. Use when adding/repairing TencentDB memory on the user's Windows Hermes (C:\Users\dingj\AppData\Local\hermes).
---

# Hermes + TencentDB Agent Memory（Windows native 最佳實踐）

把 TencentDB Agent Memory（`memory_tencentdb` provider + Node Gateway sidecar）掛進既有 Windows Hermes。資料來源：README §2.B / §3（Windows native）+ provider README + CHANGELOG（0.4.x/0.3.6）。以官方文件為準（https://github.com/TencentCloud/TencentDB-Agent-Memory）。

## 架構（5T 可溯源）
```
Hermes (Windows, C:\Users\dingj\AppData\Local\hermes)
 └─ memory.provider: memory_tencentdb（plugins\memory_tencentdb\，底線非連字號）
     ├─ GatewaySupervisor（Popen 子程序 / 自動探索 / 30s health 輪詢 / crash tail）
     └─ HTTP 127.0.0.1:8420 → Gateway (Node, node --import tsx src/gateway/server.ts)
         ├─ LLM: TDAI_LLM_*（OpenAI 相容。本用戶=Groq 免費 API）
         ├─ 資料: TDAI_DATA_DIR 預設 ~/.memory-tencentdb/memory-tdai（L0~L3 + tdai-gateway.json）
         └─ 工具: memory_tencentdb_memory_search / memory_tencentdb_conversation_search
```

## 關鍵環境變數（勿搞混）
| 變數 | 用途 |
|---|---|
| `HERMES_HOME` | 本用戶 = `C:\Users\dingj\AppData\Local\hermes`（官方 bat 預設 `%USERPROFILE%\.hermes`，**必須覆寫**） |
| `TDAI_LLM_API_KEY/BASE_URL/MODEL` | Gateway 側 LLM（Groq: `https://api.groq.com/openai/v1`，模型 **`openai/gpt-oss-20b`** 30 RPM/1K RPD/8K TPM（2026-08-01 驗證）；`qwen/qwen3-32b` 60/1K 需 `TDAI_LLM_DISABLE_THINKING=dashscope`。**Groq 模型 ID 需帶前綴（openai/ 或 qwen/），裸名 404**） |
| `MEMORY_TENCENTDB_GATEWAY_CMD/HOST/PORT` | provider 啟動 Gateway 用（bat 自動寫：`cmd /d /s /c "…setup…bat" --gateway-only`，內部用 `node --import tsx/esm` 非 npx——nvm PATH 安全） |
| `TDAI_DATA_DIR` | Gateway 資料目錄（0.4.x 起統一在 `%USERPROFILE%\.memory-tencentdb\memory-tdai`；舊 `~/memory-tdai` 會自動遷移） |
| `TDAI_GATEWAY_API_KEY` + `MEMORY_TENCENTDB_GATEWAY_API_KEY` | Bearer 鑑權（0.3.6+，gateway 側讀前者、plugin 側讀後者；兩端設同值） |
| `MEMORY_TENCENTDB_LOG_DIR` | 預設 `$HERMES_HOME\logs\memory_tencentdb`（gateway.stdout/stderr.log） |

## 安裝步驟（官方 bat 薄包裝）
1. 前置：node ≥ 22.16（本機 v24.18.1 ✓）、npm、python3。Groq key：console.groq.com → API Keys（免費）。
2. 取 repo：**官方 Windows .bat 只存在 GitHub repo，不在 npm tarball**（2026-08-01 unpkg 檔案樹實證：npm `scripts/` 只有 .sh）。→ `curl.exe -L -o tdai-main.tar.gz https://github.com/TencentCloud/TencentDB-Agent-Memory/archive/refs/heads/main.tar.gz` → `tar -xzf` → 在 repo 根目錄跑 bat。npm tarball 可作 fallback（含 `src/gateway/server.ts` + `hermes-plugin/` 但無 bat → 需手動複製 provider + 設 `MEMORY_TENCENTDB_GATEWAY_CMD`）。**npm registry 不穩（曾 11 分鐘 stall）→ 在 repo 根放 `.npmrc`：`registry=https://registry.npmmirror.com` 再跑**。
3. 設 env：`$env:HERMES_HOME='C:\Users\dingj\AppData\Local\hermes'` + `TDAI_LLM_*`。
4. 跑 `scripts\setup-hermes-memory-tencentdb.bat`（npm install --omit=dev → 複製 provider 到 `$HERMES_HOME\plugins\memory_tencentdb` → 寫 `$HERMES_HOME\.env` → 起 Gateway → 輪詢 /health）。
5. config.yaml 已存在時 bat 只提示不修改 → **手動補**：
   ```yaml
   memory:
     provider: memory_tencentdb
   ```
6. 補 Bearer（bat 不寫 apiKey 變數）：`$HERMES_HOME\.env` 追加 `TDAI_GATEWAY_API_KEY="<hex32>"` + `MEMORY_TENCENTDB_GATEWAY_API_KEY="<同值>"`。
7. 驗證：`curl.exe http://127.0.0.1:8420/health` → `{"status":"ok"|"degraded"}`；`Invoke-RestMethod` 同。
8. **重啟 Hermes 桌面 app**（.env 啟動時載入）。首次對話觸發自動探索/Popen（略慢正常）。

## 陷阱
- **unlock-ssh.py 必須含 `terminal.ssh_key`（2026-08-03 實證）**：原版只寫 5 鍵（backend/host/user/port/cwd），SSH backend 未設 ssh_key 時回退 ssh-agent；若 key 未載入 agent（如 ~/.ssh/esggo_original 或 Downloads 的 OCI key），連線會報 `getsockname failed: Not a socket` / `Read from remote host ... Unknown error`——config 已生效但握手失敗。必須 `hermes config set terminal.ssh_key "C:\...\key"`（現在 unlock-ssh.py 已自動偵測並寫入第 6 鍵；也支援 `--ssh-key` 顯式指定）。
- **HERMES_HOME 不覆寫 = 裝錯位置**（`%USERPROFILE%\.hermes`，本機 Hermes 在 AppData\Local\hermes）。
- 目錄名必須 `memory_tencentdb`（底線）；連字號只是 config alias，不能當目錄名。
- Gateway 自動探索路徑：in-tree → `~/.memory-tencentdb/tdai-memory-openclaw-plugin/` → legacy `~/tdai-memory-openclaw-plugin/` → `~/.hermes/plugins/tdai-memory-openclaw-plugin/`；要釘死路徑就設 `MEMORY_TENCENTDB_GATEWAY_CMD`。
- 工具名是 `memory_tencentdb_memory_search`（新），舊 `tdai_memory_search` 會回 "Unknown tool"。
- 「Gateway not available」→ 看 `gateway.stderr.log`；「circuit breaker tripped」= 5 次失敗暫停 60s；capture backlog = Gateway 卡住（檢查 LLM timeout）。
- `TDAI_LLM_DISABLE_THINKING`：策略 `dashscope`(Qwen 頂層 enable_thinking=false)、`deepseek`、`openai`(reasoning_effort=low)、`anthropic`、`gemini`、`vllm`、`kimi`。
- 0.3.6+ 容量治理：`recall.maxCharsPerMemory` / `recall.maxTotalRecallChars`（0=不裁）、cleaner 保留護欄 L0:50/L1:20、`timezone` 可配。
- npm tarball 另有 `memory_tencentdb_v2` provider + `scripts/install-hermes-plugin-v2.sh`（Linux 導向，gateway 有 /v2 路由）——Windows 走官方 bat 的 v1 路徑；v2 為進階選項。
- **v1 vs v2（1.0.1 實證）**：v1 = 本機 supervisor 子程序（/recall /capture /search/*），v2 = **純 client**，連「已運行」的外部 Gateway（`/v2/*`，Python SDK `tencentdb_agent_memory`，wheel 未上 PyPI 需從 cnb.cool 直載）。v2 環境變數：`TDAI_MEMORY_ENDPOINT`（預設 http://127.0.0.1:8420）、`TDAI_MEMORY_API_KEY`（預設 "local"；**Gateway 開 TDAI_GATEWAY_API_KEY 時設同值**）、`TDAI_MEMORY_SERVICE_ID`（預設 "default"，送 x-tdai-service-id）。v2 工具：`tdai_memory_search` / `tdai_conversation_search` / `tdai_read_scene`。**VPS/容器跑 Gateway + Windows Hermes 連入 = v2**；本機一條龍 = v1（bat）。`memory.provider: memory_tencentdb_v2`。
- Oracle Always Free A1 2026-06-15 縮水 4/24→2/12（無公告）→ LLM 引擎用 Groq 免費 API 最省心；自託管 Gemma4 E4B（Q4 ~5GB）僅當 VPS RAM 有餘裕才考慮。
- **SSH 解鎖工具**：`scripts/unlock-ssh.py` = 單命令解鎖，一次補齊 **5 鍵**（`terminal.backend=ssh`、`ssh_host=161.118.248.180`、`ssh_user=ubuntu`、`ssh_port=22`、`cwd=/opt/esggo`；`python <skill>/scripts/unlock-ssh.py` 預設列印狀態，`--watchdog` 靜默）。**chicken-and-egg 陷阱（2026-08-01 實證）**：agent 自身的 terminal/execute_code 走的就是待修的 SSH backend → 腳本**必須由使用者在本機 PowerShell 手動執行**，agent 無法自跑。**HERMES_HOME 陷阱（2026-08-01 實證）**：unlock 前必須強制 `HERMES_HOME=C:\Users\dingj\AppData\Local\hermes`（腳本已內建），否則 `hermes config set` 寫進 `%USERPROFILE%\.hermes\config.yaml`（錯誤位置）→ 腳本自報 OK 但執行中的 Hermes 永遠看不到；驗證必須**直接讀檔**（腳本已內建 `file_configured()`），不可信任 hermes CLI 自報。**cron 自動化不可行**：cron `script:` 只接受 `<hermes home>/scripts/` 內相對檔名，該目錄 agent 不可寫、絕對路徑被拒 → ssh-unlock-helper cron 建立失敗。解鎖後需**重啟 session/gateway**（config 於 process 啟動時載入，`/new` 不重載）。

## 驗證清單
- [ ] `/health` ok、`.env` 含 11 個 bat key + 2 個 apiKey key
- [ ] `config.yaml` 有 `memory.provider: memory_tencentdb`
- [ ] 重啟後 agent.log 出現 `Gateway command auto-discovered` 或 supervised 啟動
- [ ] 對話幾輪後 `~/.memory-tencentdb/memory-tdai/` 出現 L0 JSONL / L1 資料
