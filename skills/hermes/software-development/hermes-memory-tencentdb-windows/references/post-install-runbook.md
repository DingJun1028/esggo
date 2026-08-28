# 安裝後驗證與日常運維 Runbook（TencentDB Agent Memory / Windows Hermes）

## 安裝後立即驗證（10 分鐘內）
1. `curl.exe http://127.0.0.1:8420/health` → 期望 `{"status":"ok"}` 或 `"degraded"`（degraded = LLM key 未設或 LLM 不可達，Gateway 本身正常）。
2. 檢查 `C:\Users\dingj\AppData\Local\hermes\logs\memory_tencentdb\` 內 `gateway.stdout.log` / `gateway.stderr.log` 有無錯誤。
3. 檢查 `C:\Users\dingj\AppData\Local\hermes\config.yaml` 有 `memory:\n  provider: memory_tencentdb`。
4. 檢查 `C:\Users\dingj\AppData\Local\hermes\.env` 含 11 個 bat key + 2 個 apiKey key（`TDAI_GATEWAY_API_KEY` / `MEMORY_TENCENTDB_GATEWAY_API_KEY`，同值）。
5. **重啟 Hermes 桌面 app**（.env 啟動時載入）。重啟後 `logs\agent.log` 應出現：
   `INFO plugins.memory.memory_tencentdb: memory-tencentdb Gateway command auto-discovered: ...src/gateway/server.ts`（或 supervised 啟動）。

## 首次對話驗證（重啟後）
- 第一輪對話可能略慢（Popen 啟動 Gateway + warmup）。幾輪後資料應出現在 `%USERPROFILE%\.memory-tencentdb\memory-tdai\`：
  - `L0` JSONL（原始對話）、`persona.md`（L3，約每 50 條新記憶生成）、場景 Markdown（L2）。
- 若有 Groq key 且抽取正常：`\memory-tdai` 內會陸續長出 L1 記憶檔。

## 容量治理（0.3.6+）
- 調校檔：`%USERPROFILE%\.memory-tencentdb\memory-tdai\tdai-gateway.json`（參考 `references/tdai-gateway.json`）：
  - `recall.maxCharsPerMemory`（單條回憶注入上限，1500）
  - `recall.maxTotalRecallChars`（每輪回憶總預算，6000）
  - `bm25.language: "zh"`（jieba 分詞，繁中內容適用）
- 若 Gateway 沒吃到設定檔，改用官方 `memory-tencentdb-ctl.sh`（WSL/Git Bash）`config recall.maxCharsPerMemory 2000`。
- cleaner 護欄（內建）：L0 最少留 50 條、L1 留 20 條、expired/超 80% 禁刪——不用手動清。

## 常見故障
| 症狀 | 處置 |
|---|---|
| `memory-tencentdb Gateway not available` | 看 gateway.stderr.log；確認 8420 沒被佔用（`netstat -ano \| findstr 8420`）；重啟 Hermes |
| `circuit breaker tripped`（5 次失敗暫停 60s） | Gateway 卡住 → 查 LLM timeout / Groq 429（RPD 用罄） |
| capture backlog 警告 | Gateway 慢 → 檢查 Groq 限額（`openai/gpt-oss-20b`: 30 RPM / 1K RPD / 8K TPM） |
| 工具叫不出來 | `get_tool_schemas()` 在 Gateway 不可達時回空 → 確認 .env 有 `MEMORY_TENCENTDB_GATEWAY_*` 後重啟 |
| L1/L2/L3 不出東西 | TDAI_LLM_API_KEY 未設或 401 → Groq key 過期/額度盡；qwen3 系記得 `TDAI_LLM_DISABLE_THINKING=dashscope` |

## 重跑安裝（升級/修復）
- 官方 bat 冪等：重跑會複製新 provider + 重寫 .env 已知 key。**重跑前刪 .env 中舊的 `TDAI_GATEWAY_API_KEY` / `MEMORY_TENCENTDB_GATEWAY_API_KEY` 行**避免重複 key（後寫者可能勝出）。
- 版本升級：`git pull` repo（或重抓 tarball）→ 重跑 bat。

## 與 VPS/Gemma 私備援的關係
- 主要引擎 = Groq 免費 API（零本地負擔）。
- 選配私備援：VPS Ollama Gemma4 E4B（Q4 ~5GB）→ `TDAI_LLM_BASE_URL=http://<tunnel>/v1`、`TDAI_LLM_MODEL=gemma4:e4b`（127.0.0.1 綁定 + Cloudflare Tunnel + Access policy；Oracle A1 縮水 2/12 後 RAM 需 `free -h` 實測）。
