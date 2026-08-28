---
name: deerflow-windows-docker-setup
description: Use when setting up DeerFlow 2.0 Docker env on Windows.
---

# DeerFlow 2.0 Windows Docker 建制 SOP

在 Windows 上建制/驗證 DeerFlow 2.0 Docker 環境（config 生成 → models 注入 → Docker compose up → HTTP 驗證）。已於 C:\Project\esggo-deerflow 實作成功（2026-08）。

## 觸發條件
- 用戶要求在 Windows 上跑 DeerFlow 2.0（docker compose dev 模式）
- 需要驗證 http://127.0.0.1:2026/ 是否可訪問

## 環境關鍵事實
- **Git Bash 絕對路徑**：`C:\Program Files\Git\bin\bash.exe`。**絕不能只寫 `bash`**——Windows 系統 `bash` 會解析到 WSL（`execvpe(/bin/bash) failed`）。
- **PowerShell 5.1 無 `&&`**：腳本內連續命令要用分號或獨立行。
- **configure.py 免 make**：直接 `python scripts/configure.py` 即可生成 config.yaml（官方 make 流程非必須）。
- **api key 只用環境變數名**：`api_key: $DEEPSEEK_API_KEY`（不寫真實金鑰；config.yaml 生成後 key 欄位是 `***` 佔位）。
- **`.bat`/`.ps1` 配對**：`@echo off` + `cd /d` + `powershell -NoProfile -ExecutionPolicy Bypass -File ...` + `pause`；log 用 UTF8(no BOM) 寫入；`$ErrorActionPreference='Continue'`。

## 建制步驟

### 1. config.yaml 生成 + models 注入
```powershell
python scripts/configure.py    # 生成 config.yaml + .env + frontend/.env
```
- 若 config.yaml 已存在，configure.py 會跳過——先刪除或確認。
- models 注入（1 筆 deepseek）：
  ```yaml
  models:
    - name: deepseek-chat
      use: langchain_openai:ChatOpenAI
      model: deepseek-chat
      api_key: $DEEPSEEK_API_KEY   # 環境變數佔位
  ```
- 驗證注入：用 PowerShell 讀 config.yaml 的 models 區塊實體輸出（MCP search 對大檔 246K 會失效）。

### 2. docker.sh init
```bash
"C:\Program Files\Git\bin\bash.exe" scripts/docker.sh init
```
- 成功訊號：`DOCKER_INIT_EXIT=0`、`Detected local sandbox mode — no Docker image required`。
- 警告 `"Docker does not appear to be installed..."` 非致命（daemon 未起而已）。

### 3. Docker Desktop 引擎啟動（最常卡關）
- Docker Desktop 程序在跑（tray）**≠ daemon 就緒**。首次啟動引擎可能需 2-5 分鐘+。
- daemon ready 檢查迴圈：`docker info` 回版本號才代表 ready。**每次 git bash 呼叫可能 hang 30-100s**，等待迴圈總時長請設 300s+，否則會誤判 DAEMON_NOT_READY。
- 若迴圈超時仍不 ready：重啟 Docker Desktop（`Stop-Process -Name "Docker Desktop"` 後 `Start-Process`）。
- 引擎就緒後 compose 可能自動復活先前容器；**驗證以 `docker ps` / Docker Desktop UI 為準**。

### 4. docker compose up
```bash
"C:\Program Files\Git\bin\bash.exe" scripts/docker.sh start
# 或直接：
docker compose -f docker/docker-compose-dev.yaml up -d --build
```
- 服務：nginx(2026) + frontend(3000 內部) + gateway(8001 內部) + redis。provisioner 僅 K8s 模式。
- nginx 綁定 `127.0.0.1:${PORT:-2026}:2026`（loopback-only，BIND_HOST 可覆寫）。

### 5. 驗證（分層）
- **容器層**：`docker ps` 或 Docker Desktop → Containers。4 容器全 running 且各容器有非零 CPU（非 crash-loop）。
- **HTTP 層**（本機 localhost）：**browser_navigate / web_extract 是遠端工具，連不到本機 Windows localhost**（ERR_EMPTY_RESPONSE 是工具限制，非服務故障）。必須用本機 Chrome GUI：
  - `computer_use` capture chrome → click 地址列（Edit「網址與搜尋列」）→ foreground type URL → Enter
  - **地址列聚焦**：background click 對 Chrome 地址列不可靠（type 會打進頁面內 input）。用 **Ctrl+L**（foreground）聚焦地址列再 type，最穩。
  - **成功判據**：載入後 Chrome 彈 **Google Translate 彈窗**（英文介面觸發）= HTTP 200 實證。若服務未起會是中文「無法連線」錯誤頁，不會彈翻譯。

## Pitfalls（實戰踩過）
1. **`bash` 解析到 WSL** → 一律 Git Bash 絕對路徑。
2. **Win 鍵組合被環境剝離**（win+r 只剩 "r"）→ 用 Ctrl+Esc（等效 Win，但可能也被 explorer 吞）、Ctrl+L（Chrome 地址列）、或 mouse 點擊。
3. **Chrome UIA 卡死**：載入複雜頁面後 `get_window_state timed out`、vision/som capture 全失敗。等待 10s+ 再試，或改用 Docker Desktop capture / 檔案層佐證，**不要重複相同 capture**。
4. **foreground type 落點錯誤**：click 沒聚焦時 type 會進錯 input（如 TwinMind 側欄）。務必先 Ctrl+L 或確認 Edit element 有 focus。
5. **existing-profile 瀏覽器綁定被拒**：standard mode 需 certified consent provider（Hermes 無）→ 用 native Chrome UI 而非 cua_browser_*。
6. **Docker Desktop 視窗可能離屏/最小化**（capture matched 不到）→ list_windows 找 window_id，或直接以容器狀態佐證。
7. **docker-start 的 STEP3 找錯路徑**：compose 檔在 `docker/docker-compose-dev.yaml`，不在 _sandbox。
8. **視窗被 minimize 後 restore 困難**：focus_app raise 對 minimize 視窗回 "no on-screen window"；雙擊桌面 Chrome 捷徑可開新窗。

## 完整服務鏈路
```
本機瀏覽器 → 127.0.0.1:2026 → nginx → frontend (Next.js 3000)
                              └→ gateway (uvicorn 8001) → redis + config.yaml (deepseek-chat)
```
gateway 掛載 `/app/project/config.yaml`（DEER_FLOW_CONFIG_PATH），config 修改後需重啟 gateway 容器。

## LLM 接通（Hermes 訂閱 / 真實 API key）— 建制後必做

- **建制完成 ≠ LLM 可用**。configure.py 產生的 `.env` 所有 key 是 `your-xxx-api-key` 佔位；config.yaml `api_key: $DEEPSEEK_API_KEY` 解析後是假值，實際呼叫必然 401。
- 把 DeerFlow 接到 Hermes 訂閱（Nous Portal `https://inference-api.nousresearch.com/v1`，OpenAI-compatible）：
  - 方案 A（免複製 key）：本機 `hermes proxy`（OpenAI-compatible 本地代理，用 Hermes 既有 OAuth credential）→ config model 指 `http://localhost:<PORT>/v1` + 任意佔位 key。
  - 方案 B：portal.nousresearch.com → API Keys → config `base_url: https://inference-api.nousresearch.com/v1` + 真實 key。
- 一鍵切換腳本：`_sandbox/apply_model.py`（`--name --model --base-url --key`，自動備份 config.yaml.bak）。
- config 修改後**必須重啟 gateway 容器**：`"C:\Program Files\Git\bin\bash.exe" -lc "docker compose -f docker/docker-compose-dev.yaml restart gateway"`（gateway 掛載 config.yaml）。

## 本機執行通道障礙（agent 側，2026-08 實測）
- `terminal`(SSH→VPS 161.118.248.180 斷線) / `computer_use`(cua-driver 卡死連 list_apps 也掛) / `execute_code`(cron_mode BLOCKED) / `cron` script(限 ~/.hermes/scripts，MCP 沙盒外) —— **全部無法碰本機 AppData\Local\hermes 憑證**。
- MCP my_server 沙盒三目錄：esggo-learning-center、esggo、esggo-deerflow；**不含 hermes 設定**（Access denied）。
- Hermes desktop 的 terminal pane（`read_terminal` 可讀本機 PS）**只讀不可寫**（輸入需 computer_use，掛掉時無解）。
- 阻塞時的誠實路徑：把 `_sandbox/` 準備好腳本/備忘，交給用戶本機執行（如 `hermes-llm-hookup.md`）。

## 驗收標準
- [ ] config.yaml 含 deepseek models（api_key 為 `$DEEPSEEK_API_KEY` 佔位）
- [ ] `docker ps` 4 容器全 running（nginx/gateway/frontend/redis）
- [ ] 本機 Chrome 開 http://127.0.0.1:2026/ 載入英文介面（翻譯彈窗為證）
