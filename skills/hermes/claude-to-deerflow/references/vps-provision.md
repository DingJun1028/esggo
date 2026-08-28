# DeerFlow — VPS 建制 Runbook (provisioning, sequence-ordered)

建立一套可被 `claude-to-deerflow` 技能連線的 DeerFlow 實例。所有指令皆以
bytedance/deer-flow main 的 `Makefile` 與 `Install.md` 為準（非臆造）。
跑這份 runbook 前，本 session 的 `terminal` 已被實測鎖死（走無效 SSH→161.118.248.180），
所以下面的「執行」步驟須在你的本機/VPS shell 手動或待 SSH 恢復後跑。

## 前置檢查（Step 0）
- VPS 有 `docker` 且 daemon 可達：`docker info >/dev/null 2>&1 && echo DOCKER_OK`
  - 有 → 走「Step A (Docker)」
- 無 Docker 走本地路徑：需 `node`、`pnpm`、`uv`、`nginx`、`python3`
  驗證：`make check`（在 repo 內）
- 一台可連線網路的 shell（本機 WSL/Git Bash，或 VPS）

## Step A (Docker 路徑，偏好)
```bash
git clone https://github.com/bytedance/deer-flow.git /opt/deerflow && cd /opt/deerflow
make config            # 產生 config.yaml（已存在會中止）
make docker-init       # 拉 sandbox image（只備前置，不算啟動）
# 填入 config.yaml 的 models（至少 1 筆）後：
make docker-start      # 啟動服務，listen localhost:2026
```
## Step B — 本地路徑
```bash
git clone https://github.com/bytedance/deer-flow.git /opt/deerflow && cd /opt/deerflow
make config
make check             # 缺 node/pnpm/uv/nginx → 先裝，勿 sudo 盲裝
make install
make dev               # dev 模式；或 make dev-daemon（背景）
```

## 補齊模型設定（兩條路徑都必做）
- `config.yaml` 的 `models` 需 ≥1 筆，並以環境變數名稱（如 `$<PROVIDER>_API_KEY`）引入。
- 依本技能自己的原意，不讀 `.env` / `config.yaml` 的實值（security 約束）。
- 範例變數名（**僅名，不填值**）：`OPENAI_API_KEY`、`GROQ_API_KEY`、`ANTHROPIC_API_KEY`、`DEEPSEEK_API_KEY` 等。
- 執行時務必把你真實 key 另存 secrets（勿入 commit）。

## 驗證序列（按序，缺一不可宣稱成功）
```bash
# 1) 目標已起：health
curl -s http://localhost:2026/health

# 2) 本技能 scripts 語法（在含本技能 script 的機器上）
chmod +x <skill_dir>/scripts/*.sh
bash -n <skill_dir>/scripts/chat.sh && bash -n <skill_dir>/scripts/status.sh && echo SYNTAX_OK
#    ↑ 若你在 Windows PowerShell 貼這行：PS5.1 不支援 &&，請逐行跑或改用「;」：
#    bash -n <skill_dir>/scripts/chat.sh; bash -n <skill_dir>/scripts/status.sh; echo SYNTAX_OK

# 3) 狀態探測（VPS 本機）
DEERFLOW_URL=http://localhost:2026 bash <skill_dir>/scripts/status.sh health
DEERFLOW_URL=http://localhost:2026 bash <skill_dir>/scripts/status.sh models

# 4) 對真實 DeerFlow 發一條訊息（flash 最快）
DEERFLOW_URL=http://localhost:2026 bash <skill_dir>/scripts/chat.sh "hi, 一句話自我介紹" flash

# 5) 進入本 session 的連線方式
#    本 Hermes session 無本機 shell、且 VPS SSH 暫死 → 改從你的本機 Windows 終端開隧道：
ssh -L 2026:localhost:2026 <vps-user>@<vps-ip> &
DEERFLOW_URL=http://localhost:2026 bash <skill_dir>/scripts/status.sh health
```

## 常駐化（建議）
DeerFlow make 的 daemon 為 `make start-daemon`（本地/生產優化）。若要開機自啟，
寫一個 systemd unit（以 root/你的 user 見機）：
```ini
[Unit]
Description=DeerFlow
After=network.target

[Service]
WorkingDirectory=/opt/deerflow
ExecStart=/bin/bash -c "cd /opt/deerflow && make start-daemon"
Restart=on-failure

[Install]
WantedBy=multi-user.target
```
注意 `start` / `up` 都停在 `localhost:2026`，nginx 614(C/P) 反向代理到 gateway 8001 —
暴露口不要直接開到公網（見 SKILL.md 「Security Note」）。

## 與本技能對接
跑起來後，`claude-to-deerflow` 的連線 URL 即為：
- 帳覽 / 本機：`DEERFLOW_URL=http://localhost:2026`
- 外部連 VPS：`DEERFLOW_URL=http://<vps-ip>:2026`（需先把 2026 透過安全的 reverse proxy 或 SSH tunnel 護住）

## 阻塞欄（誠實記錄）
- 2026-08-03 本 session：`terminal`/`execute_code`/`read_file`/`search_files` 全被無效 SSH（161.118.248.180）擋住。
- 上述 runbook「執行步驟」需本機/VPS shell 才能檢視真輸出。
- 一旦 SSH 恢復或你在本機任一 shell 跑完 bash -n，把輸出貼回本、代理（本 session）即據實閉合。