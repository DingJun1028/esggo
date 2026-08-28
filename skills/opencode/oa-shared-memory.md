---
name: oa-shared-memory
description: 蜂群雙蜂隊共享記憶後端(TencentDB)起站/部署/5T互引，對映 §18 知識花園與 §19 決策樹。
---

# OA-Team 共享記憶後端 (§20)

喚醒 OA-Team 蜂群、配置跨靈魂持久上下文基礎設施時載入。本技能是 `oa-dual-agent-obsidian` (§18 人讀層) 的互補機器級寫層。

## When to use
- 部署/運維 `apps/tencentdb-memory`（MemoryCore + MemoryHub + Proxy）
- 接 §18 雙生代理的持久 Trackable 軌跡
- 配置蜂群 `evidence` 庫之機器級沉澱層（§三 3.3）

## 雙記憶層（與 §18 互補）
| 層 | 載體 | 讀寫者 |
|---|---|---|
| 人讀層 | Obsidian vault `Agents/` | 用戶 + 雙生代理 |
| 蜂寫層 | TencentDB Agent Memory | 30 靈魂 + 蜂王 |

雙蜂隊（雲端助理 01+20+27 / 本機實習生 15+13+14+25）共用同一後端，斷線續傳不丟狀態（§三 3.2）。

## 架構
```
OA-Team 蜂群 → https://memory.esggo.co/gateway/ → nginx :80 → { :8420 core | :8125 panel }
Docker: tdai-memory-core + tdai-memory-hub + tdai-proxy
```

## 本機 5 分鐘起站 (Ollama 免費算立版)
```bash
cd esggo/apps/tencentdb-memory
cp .env.example .env          # Ollama 不需真實 API key，設為任意占位字串
sed -i 's/MEMORY_LLM_API_KEY=REPLACE_ME/MEMORY_LLM_API_KEY=ollama-local/' .env
sed -i 's/PROXY_UPSTREAM_API_KEY=REPLACE_ME/PROXY_UPSTREAM_API_KEY=ollama-local/' .env
# Windows 用戶取消 MEMORY_HUB_PROXY_PUBLIC_URL 註解 (host.docker.internal 回環)
sed -i 's/# MEMORY_HUB_PROXY_PUBLIC_URL=/MEMORY_HUB_PROXY_PUBLIC_URL=/' .env
chmod +x start-*.sh _lib.sh

# 一鍵啟動 (3 bugs 已修復: curl 路徑 / localhost→127.0.0.1 / /dev/null → tail -c 3)
./start-all.sh
# 驗證
curl http://localhost:8420/health     # {"status":"ok",...}
curl http://localhost:8125/           # Panel HTML
curl http://localhost:8424/health     # Knowledge API
curl http://localhost:8096/health     # Proxy
```

## 生產部署 (VPS + Cloudflare Tunnel, 不裸開端口)
```bash
# SSH alias — DO NOT use ssh ubuntu@IP directly
# ~/.ssh/config has: Host esggo-vps / HostName 161.118.248.180
ssh esggo-vps          # ← THIS works (fingerprint verified)
# ssh ubuntu@161.118.248.180  ← THIS fails (Permission denied)

# VPS 已部署 (26h+ uptime) — 只需更新 proxy config
# start-proxy.sh 使用 host networking → memory-core:8420 無法解析
# Fix: 設定 MEMORY_CORE_URL=http://127.0.0.1:8420 (see 關鍵修復 table)

# Cloudflare Tunnel 配置 (already running on VPS)
# /etc/cloudflared/config.yml:
#   hostname: memory.esggo.co → http://127.0.0.1:8096  (proxy)
#   hostname: gateway.esggo.co → http://127.0.0.1:8420  (memory-core)
# Restart tunnel: pkill -9 cloudflared; nohup cloudflared tunnel --config /etc/cloudflared/config.yml run esggo-tunnel

export GROQ_API_KEY=gsk_xxxxx
bash deploy.sh                 # → /opt/esggo/apps/tencentdb-memory/ → memory.esggo.co
```

## Cloudflare Tunnel 設定 (§17 網關)
```bash
# 1. 更新 /etc/cloudflared/config.yml (需要 sudo)
sudo tee /etc/cloudflared/config.yml << 'YAML'
ingress:
  - hostname: memory.esggo.co
    service: http://127.0.0.1:8096
  - hostname: gateway.esggo.co
    service: http://127.0.0.1:8420
  - service: http_status:404
YAML

# 2. 重啟 tunnel (old process runs as root, need sudo)
sudo pkill -9 cloudflared; sleep 2
nohup cloudflared tunnel --config /etc/cloudflared/config.yml run esggo-tunnel > /tmp/cloudflared.log 2>&1 &
```

## 5T 互引
- Traceable: 記憶寫入帶 `source_origin` (§一 1.1)
- Trackable: 生命週期 Hook 沉於此層 (§三 3.3 `evidence`)
- Tangible: Panel `8125` 可視化
- Transparent: Tunnel 終止 TLS, 不裸開端口 (§17.0)
- Trustworthy: `.env` 不進 git; admin key 存 `.admin-key` (§十 Kill Switch)

## 委託判定 (§19)
- 記憶後端運維 = H0 全自主 (`verify.sh` 排 cron)
- `.env` / admin key 變更 = H3 會同 (不可逆憑證, 禁 H0)

## 關鍵修復 (Windows git-bash)
| Bug | Root Cause | Fix |
|---|---|---|
| `init-admin HTTP=000` | `/usr/bin/curl` 不存在 | → `curl` (在 `/mingw64/bin`) |
| `verify_user_key fails` | `localhost` WSL2 回送失效 | → `127.0.0.1` |
| `curl: (23) ERROR on write` | git-bash curl 對 `/dev/null` 返回錯誤碼 23 | → `-w "%{http_code}" ... \| tail -c 3` |
| `proxy auth: fetch failed` | `start-proxy.sh` 用 `memory-core:8420` (Docker DNS) | → `MEMORY_CORE_URL` 變數，預設 `http://127.0.0.1:${MEMORY_CORE_PORT}` |

## Pitfalls
- **CRLF 陷阱**: Windows 編 `.env` 須 LF, 否則 `sed -i 's/\r$//' .env`
- **VPS `.venv-oci` encoding-check crash**: `git pull` on VPS triggers `encoding-check.mjs` hook which spawns `git diff --cached --name-only` on 23,000+ `.venv-oci` files → ENOBUFS. Fix: use `git fetch --depth=1 + git reset --hard origin/...` instead of `git pull`; or add `.venv-oci` to `.gitignore` + `git rm --cached -r .venv-oci`.
- **Docker 守護未就緒**: 啟動 Docker Desktop.exe 後需等待 60-90s 讓 WSL2 後端完全就緒
- **`start-all.sh` 自動生成 admin key**: 首次執行會 `init-admin` + 驗證 key + 保存 `.admin-key`
- **host.docker.internal**: Ollama 必須在主機 localhost:11434，容器內用 `host.docker.internal` 回環
- **MEMORY_HUB_PROXY_PUBLIC_URL**: Windows 上 `detect_host_ip` 回空，必須手動設定為 `http://host.docker.internal:8096`
- **勿裸開端口**: 生產必經 Cloudflare Tunnel + nginx :80, 不直曝 8420/8125/8096
- **憑證禁區**: `.env` / `.admin-key` 不進 git, 變更走 H3
- **SSH alias**: `ssh ubuntu@161.118.248.180` 失敗 → 用 `ssh esggo-vps` (見 `references/cloudflare-tunnel-vps-troubleshooting.md`)

## Verification
- `docker ps` 三 `tdai-*` healthy 為實證 (非聲稱)
- `curl /health` 回 `{"status":"ok"}` + Panel 可載
- proxy 端對端驗證: `curl http://localhost:8096/claude-code/default/v1/messages` 回傳 200 + Anthropic 格式 JSON

## Claude Code 設定
```bash
# proxy (auth 啟用, TDAI 記憶注入啟用)
export ANTHROPIC_BASE_URL=http://127.0.0.1:8096/claude-code/default
export ANTHROPIC_API_KEY=<admin_key_from_.admin-key>
export ANTHROPIC_MODEL=qwen2.5:3b-instruct-q4_K_M

# 或直接連 Ollama (無 memory injection)
export ANTHROPIC_BASE_URL=http://127.0.0.1:11434/v1
export ANTHROPIC_API_KEY=ollama

# VPS 公開端點 (24/7 running, Cloudflare Tunnel)
export ANTHROPIC_BASE_URL=https://memory.esggo.co/claude-code/default
export ANTHROPIC_API_KEY=<VPS_admin_key>
export ANTHROPIC_MODEL=gemma4:e4b
```

## Obsidian 三端同步 (§18 Knowledge Garden)

### 架構
```
Desktop (Windows)  ←Git sync→  GitHub repo (DingJun1028/esggo)  ←Git sync→  Mobile (iOS/Android)
   │                                                                      │
   └─ Obsidian Git ────────── Obsidian Git (60s auto-commit/push) ────────┘
   
   └─ TencentDB L0/L1/L2/L3 Memory ← every 5 convos ← 24h cron → VPS
```

### Plugins 安裝 (4 個)
| Plugin | Repo | 用途 |
|--------|------|------|
| obsidian-git | denolehov/obsidian-git | Git auto-commit + push (Desktop + Mobile) |
| obsidian42-brat | TfTHacker/obsidian42-brat | Beta plugin manager (for installing hermes-agent via deep link) |
| obsidian-local-rest-api | coddingtonbear/obsidian-local-rest-api | Local REST API for external integrations |
| hermes-agent | jsun2020/hermes-agent-obsidian-plugin | Bridge to Hermes Agent (requires BRAT) |

### 設定
- **Vault path**: `C:/Project/esggo/vault/`
- **Branch**: `feature/aistation-core-modules`
- **Desktop config**: `.obsidian/plugins/obsidian-git/config.json` (bashPath → Git bin)
- **Mobile config**: `.obsidian/plugins/obsidian-git/config.mobile.json` (60s sync interval)
- **app.json**: enables `obsidian-git`, `obsidian42-brat`, `obsidian-local-rest-api`, `hermes-agent`, `daily-notes`, `calendar`

### VPS cron
```bash
# Daily at 5:30 AM UTC — knowledge avatar → TencentDB memory
30 5 * * * /usr/bin/node /opt/esggo/scripts/tdai-memory-sync.mjs >> /home/ubuntu/logs/tdai-memory-sync.log 2>&1
# Daily at 5:00 AM UTC — avatar-daily (7-phase cycle)
0 5 * * * /bin/bash /home/ubuntu/deploy-scripts/avatar-daily.sh
```

## Hermex 24/7 (Hermes WebUI)
- **Container**: `hermes-webui-hermes-webui-1` — Up 30h, healthy
- **Port**: `8790 → 8787` (host → container)
- **Restart**: `unless-stopped` ✅
- **Public**: `https://hermex.esggo.co` → HTTP 200
- **Cloudflare Tunnel**: `hermex.esggo.co → http://127.0.0.1:8790`

## Hermes Agent Gateway (port 8642)
- **Local gateway**: `http://127.0.0.1:8642/health` → `{"ok":true,...}`
- **Public gateway**: `https://agent.esggo.co/health` → `{"ok":true,...}`
- **API key**: `***` from `~/.hermes/.env` (`API_SERVER_KEY`)
- **Auth scheme**: `Authorization: Bearer {key}` (local), the VPS gateway is OmniGateway with different auth
- **Capabilities**: `/v1/capabilities` → chat_completions, streaming, run_submission ✓
- **Cloudflare Tunnel**: `cloudflared tunnel route dns esggo-tunnel agent.esggo.co` → `http://127.0.0.1:8642`

## Obsidian Hermes Agent Plugin 配置
- **Desktop config**: `hermes-agent/config.json` → gateway: `http://127.0.0.1:8642`, apiKey from vault
- **Mobile config**: `hermes-agent/config.mobile.json` → gateway: `https://agent.esggo.co`, apiKey from vault
- **Install via BRAT**: `obsidian://show-plugin?id=hermes-agent` (requires BRAT plugin enabled first)
