---
name: esggo-learning-center-dev-lessons
description: esggo-learning-center 子專案建置硬傷與解法。新建或修復其子專案時載入。
---

# esggo-learning-center 開發硬傷與解法（經驗技能書）

適用：在 `C:\Project\esggo-learning-center` 下建置獨立 TS/Python 子專案，或接本機 Ollama / s2s 語音代理。

## 0. 通用原則
- 子專案**一律獨立**：自建 `package.json` + `pnpm-lock.yaml` + `pnpm install --ignore-workspace`，避免觸發根 monorepo 的 `prisma generate` / `setup-hooks` postinstall（會在子目錄失敗）。
- 驗證用**本地二進位** `./node_modules/.bin/tsc` / `./node_modules/.bin/vitest`，**不要**跑 `pnpm run build`（會觸發 deps-status-check → 向上找 workspace → 安裝失敗）。
- `tsconfig.json` 含 `test/**` 會讓 `tsc` 報 `rootDir` 錯；建 `tsconfig.build.json`（`include: ["src/**/*.ts"]`）給 build 用。

## 1. Python 隔離 venv 污染（Hermes Windows）
**症狀**：`import regex` 報 circular import、`huggingface_hub` "outside environment"、`speech_to_speech` CLI 起不來。
**根因**：Hermes 桌面 App 注入 `PYTHONPATH=C:\Users\dingj\AppData\Local\hermes\hermes-agent\venv\...`，所有 Python（含新建 venv）啟動先載 hermes 包。
**解法**：
```bash
uv venv C:/tmp/s2s_venv2
env PYTHONPATH="" "C:/tmp/s2s_venv2/Scripts/python.exe" -m pip install <pkg>
env PYTHONPATH="" "C:/tmp/s2s_venv2/Scripts/speech-to-speech.exe" --ws_host 127.0.0.1 --ws_port 8765 ...
```

## 2. speech-to-speech (HuggingFace) 0.2.12 本機參數（已驗證）
**CLI 格式**（無 `serve` 子命令，無 `--host/--port`）：
```
speech-to-speech.exe --ws_host 127.0.0.1 --ws_port 8765 \
  --stt parakeet-tdt --llm_backend chat-completions \
  --model_name "qwen2.5:3b-instruct-q4_K_M" \
  --responses_api_base_url "http://localhost:11434/v1" \
  --responses_api_api_key "ollama" --tts pocket --enable_live_transcription
```
**坑**：
- `--llm_backend transformers` 要 **HF repo id**，不接受 Ollama tag（`gemma4:26b` 報 `HFValidationError`）。VPS 走 `chat-completions` 指 Ollama `/v1`。
- TTS：`qwen3` 要 CUDA（CPU 報錯）；`kokoro` 安裝 numpy 衝突；`pocket` 需 `pip install pocket-tts`（純 torch CPU ✅）。
- 本機 Ollama `/v1/chat/completions` 對 `qwen2.5:3b` 正常；模型忙時會 timeout（等閒置再試）。
- WS 端點：`ws://127.0.0.1:8765/v1/realtime`（OpenAI Realtime-compatible）。`curl` GET 回 404 是預期（需 WS upgrade），用 `websockets.connect()` 驗證。

## 3. TypeScript → Node ESM 執行
**症狀**：`node dist/index.js` 報 `ERR_MODULE_NOT_FOUND: Cannot find module './swarm-core'`。
**根因**：`moduleResolution: Bundler` 輸出的 import 不加 `.js` 副檔名。
**解法**：
- `tsconfig.json` 改 `"module": "NodeNext", "moduleResolution": "NodeNext"`
- 所有相對 import 加 `.js`：`import { X } from './y.js'`（node 腳本批量替換）
- 或 build 後用 `tsx` 跑。

## 4. pnpm workspace 向上解析
- 子目錄即使不在 `pnpm-workspace.yaml`，pnpm 仍向上找到根 workspace 並套用根設定 → 獨立 `pnpm install` 會跑根 postinstall。
- **強制隔離**：`pnpm install --ignore-workspace`（產生獨立 `node_modules` + 本地 `.bin`）。
- `pnpm run <script>` 會先跑 deps-status-check（再觸發 install 失敗）；直接用 `./node_modules/.bin/<tool>`。

## 5. Cloudflare Workers / wrangler.toml 在 monorepo
- `[build] command = "npx --yes pnpm install --frozen-lockfile && pnpm run build"` 在孤立子目錄必失敗。
- **修正**：`command = "node my-worker/node_modules/typescript/bin/tsc -p my-worker/tsconfig.json"`（跨平台）。
- 子目錄需自建 `package.json` + `pnpm-lock.yaml`（`pnpm install --ignore-workspace --lockfile-only` 生成）。
- 驗證：`wrangler deploy --dry-run`。真 deploy 需 `wrangler login` + 實際 KV id + `wrangler secret put`。

## 6. Git 潔淨提交（Windows Hermes）
- `git add <dir>` 會把 `node_modules/` 一起加進去 → 撐爆 repo。
- 修復：`git rm -r --cached --quiet <dir>/node_modules` → 加 `<dir>/.gitignore` → `git commit --amend --no-edit`。
- 遠端拒絕時：`git stash` → `git pull --rebase` → `git stash pop` → `git push`。

## 7. VPS OOM 阻礙（Oracle ARM）
- Oracle ARM 5.8G 總 / 2.8G 可用。`gemma4:e4b`(9.6GB) 直接 OOM 凍結 SSH。
- 選型：`gemma4:e2b`(~1.5GB) 或 `qwen2.5:3b`。
- 看門狗：`watchdog_vps.sh` 每 10min 探活，VPS 恢復即自動部署。
- OCI CLI 本機不可用（SSL EOF / 簽章 401），首選 Oracle Console Reboot。

## 8. OA-Team 5T 協定實作要點
- `hashLock` 必須**確定性**（FNV-1a，不可含 `Math.random()`），否則 `verifyZeroHallucination` 重算不匹配。
- `DeltaTracker` 跨呼叫增量追蹤：用 `Map<string, DeltaTracker>` 按 source 共享實例，否則每次 `new` 會丟失 seen 狀態。
- 測試 ETL 增量：傳入物件需有 `version` 欄位（DeltaTracker 契約）。

## 9. VPS Ollama 在 pm2 下變 MOCK（已驗證根因）
**症狀**：oa-swarm `/execute` 回 `[MOCK]`，但宿主機 `node -e fetch('http://localhost:11434/api/generate')` 成功。
**三重根因**：
1. `callLLM` 預設 `OLLAMA_MODEL='qwen2.5:3b-instruct-q4_K_M'`，但 VPS 只裝 `qwen2.5:3b` → Ollama 404 → catch → MOCK。
2. pm2 fork 進程內全域 `fetch` 行為異常（宿主機直跑正常）→ 改用 `node:http` 模組（`postJson`）。
3. **VPS 上 tsc 重 build 漏跑** → pm2 跑舊 dist（含舊模型名/舊 fetch）→ 永遠 MOCK。
**解法**：
- `ecosystem.config.cjs` 設 `env: { PORT:8800, OLLAMA_BASE:'http://127.0.0.1:11434', OLLAMA_MODEL:'qwen2.5:3b' }`（VPS 實際模型名）。
- `llm.ts` 用 `node:http` 替代 `fetch`（避免 pm2 環境干擾）。
- 部署順序：`tar` 傳 VPS → `tar -xzf` → **`npx tsc -p tsconfig.build.json`** → `pm2 delete` → `pm2 start ecosystem.config.cjs`。
- 驗證：`pm2 logs oa-swarm --nostream` 看有無 `CALL_LLM_FAIL`；或直接 `curl /execute` 看 `llmEcho` 是否真回應。

## 10. Cloudflare DNS 設定（OAuth vs API Token）
**wrangler login 的 OAuth token 限制**：只能讀 zone（`/zones?name=` ✅），**不能寫 DNS**（`/dns_records` → `code:10000`），也不能管 token（`/user/tokens` → `9109`）。Cloudflare 安全設計，OAuth 無法自我升級。
**正確流程**：
1. 用戶在 CF 控制台（My Profile → API Tokens → Create Token）建 **API Token (Zone:DNS:Edit, Zone:esggo.co)**。
2. 用該 token 直打 API：
```bash
TOK="cfut_xxx"; ZONE="8dda3653e490290412f7be84a84e0dc9"
curl -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE/dns_records" \
  -H "Authorization: Bearer $TOK" -H "Content-Type: application/json" \
  --data '{"type":"A","name":"oa.esggo.co","content":"161.118.248.180","ttl":60,"proxied":false}'
```
3. **Hermes MCP 註冊**（避免 `setup_mcp` 卡 OAuth 彈窗 420s）：用 `hermes config set mcp_servers.cloudflare.url "https://mcp.cloudflare.com/mcp"` + `auth:oauth` + `enabled:true`（5 個：cloudflare / cloudflare-docs / cloudflare-bindings / cloudflare-builds / cloudflare-observability）。OAuth 留空，首次工具呼叫觸發。
**proxy 注意**：`proxied:true` 需 origin 有 SSL（否則 526）；關 proxy（灰雲）走 HTTP 直連。DNS 切換 5-30min edge 傳播，期間 `dig` 空 + 301 from CF 是 cache 殘留。強制測試：`curl --resolve oa.esggo.co:80:161.118.248.180 http://oa.esggo.co/health`。

## 快速檢查清單
- [ ] 子專案有獨立 package.json + lockfile + `--ignore-workspace` 安裝
- [ ] 驗證用 `./node_modules/.bin/tsc|vitest`，非 `pnpm run`
- [ ] TS ESM 用 NodeNext + import 加 `.js`
- [ ] Python venv 跑前 `env PYTHONPATH=""`
- [ ] s2s 用 `--ws_host/--ws_port` + `chat-completions` + `pocket` TTS
- [ ] git 提交前排除 node_modules/dist
- [ ] 遠端拒絕用 stash + pull --rebase + push
- [ ] VPS 部署 oa-swarm：ecosystem.config.cjs 設 OLLAMA_MODEL=實際模型 + VPS 上 `npx tsc` 重 build + `node:http` 替代 fetch
- [ ] Cloudflare DNS 寫入用控制台建的 API Token (Zone:DNS:Edit)，非 wrangler OAuth；MCP 用 `hermes config set` 註冊
- [ ] **soul.md 是受保護 agent-instruction 檔**：`patch`/`write_file` 寫入會被系統攔截（approval 逾時即靜默拒絕）。不重試、不從 terminal/execute_code 繞道寫。需改時請用戶明確授權或走 `hermes curator` 流程。
- [ ] **TS 終始矩陣純 .ts consumer 模式**（oa-swarm 雙向同步）：詳見 `esggo-ts-matrix-onboard` 技能（OA 領域型別用 `interface X extends ICanonical` 非 `implements`；本機 absolute path / VPS scp 產物雙軌；自帶 block-level `check-oa-types-sync.mjs` 守門）。
- [ ] **MPT zh-TW.json 重建**：opencc 裝在 VPS 宿主（`pip3 install --break-system-packages opencc-python-reimplemented`），容器內無 opencc；重導向後必 `ls -la` 確認 size > 0（空 stdout 會截斷 bind-mount 成 0 字節）。
