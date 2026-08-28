---
name: oa-swarm-vps-deploy
description: oa-swarm 部署 VPS 實戰（Docker/pm2/nginx/Ollama/OAB/s2s）。部署時載入。
---

# oa-swarm VPS 生產部署實戰（oa-swarm-vps-deploy）

OA-Team 蜂群守護（oa-swarm）部署上 VPS（Oracle ARM 161.118.248.180）的已驗證流程。
姊妹技能 `esggo-learning-center-dev-lessons` 管**本機建置**；本技能管**VPS 生產部署**（二者互補，但 dev-lessons 為 user-owned，本技能為 curator-managed 可維護副本）。

## 0. 前置（一次）
- VPS SSH：`ssh -i ~/.ssh/esggo_original ubuntu@161.118.248.180`
- 部署目錄：`/var/www/esggo/apps/oa-swarm`
- Ollama 監聽 `0.0.0.0:11434`，模型 `qwen2.5:3b`（VPS 實有且安全；`qwen2.5:3b-instruct-q4_K_M` 不存在 → 404 → MOCK）
- OAB core：`http://localhost:8420`（healthy），admin-key `/opt/esggo/apps/tencentdb-memory/.admin-key`

## 1. 傳送 + 容器內 build（固定流程）
```bash
# 本機
cd C:/Project/esggo-learning-center/oa-swarm
tar --exclude=node_modules --exclude=dist -czf /tmp/oa-swarm.tar.gz .
scp -o ConnectTimeout=8 -i ~/.ssh/esggo_original /tmp/oa-swarm.tar.gz ubuntu@161.118.248.180:/var/www/esggo/apps/oa-swarm/

# VPS — 關鍵：解壓後必重 tsc，否則跑舊 dist
ssh -i ~/.ssh/esggo_original ubuntu@161.118.248.180 "
  cd /var/www/esggo/apps/oa-swarm
  tar -xzf oa-swarm.tar.gz && rm oa-swarm.tar.gz
  npx tsc -p tsconfig.build.json && echo BUILD_OK
"
```
- Docker 路徑（可選）：Dockerfile 內 `npm install` + `npm install --no-save @types/node` + `npx tsc -p tsconfig.build.json`（容器內編譯，避免漏 dist）。

## 2. pm2 啟動（陷阱集中）
- `package.json` 有 `"type":"module"` → `ecosystem.config.js` 被當 ESM 報錯 → **用 `ecosystem.config.cjs`**（CommonJS）。
- ecosystem 內必設 `cwd: '/var/www/esggo/apps/oa-swarm'` + `env: { PORT:8800, OLLAMA_BASE:'http://127.0.0.1:11434', OLLAMA_MODEL:'qwen2.5:3b', OAB_KEY_PATH:'/opt/esggo/apps/tencentdb-memory/.admin-key' }`。
- **STALE-DIST 陷阱**：pm2 跑的是解壓時的舊 dist；本機改碼後若 VPS 沒重 tsc，`/execute` 仍回舊行為。每次部署固定 `npx tsc` 後再 `pm2 delete oa-swarm && pm2 start ecosystem.config.cjs`。
- `fetch` 在 pm2 fork 子進程靜默失敗 → oa-swarm 的 `llm.ts` 已改用 `node:http` 模組（零依賴可靠）。

## 3. 驗證（真準）
```bash
curl -s -m5 http://localhost:8800/health      # {"ok":true,...}
curl -s -m30 -X POST http://localhost:8800/execute -H 'Content-Type: application/json' -d '{"task":"x"}'
  # 看 llmEcho：含 "[MOCK]" = Ollama 沒連（模型名/網路錯）；真回應 = 成功
curl -s -m5 http://localhost:8800/matrix | grep -o '"id":[0-9]*' | wc -l   # 60 = 雙蜂戰隊
curl -s -m5 http://localhost:8800/oab         # {"connected":true,"synced":1} = OAB 寫入成功
```

## 4. nginx 子網域反向代理
- 本地寫 `oa.esggo.co.conf` → scp /tmp → `sudo bash -c 'cat /tmp/x > /etc/nginx/sites-available/x.conf'` → `sudo ln -sf ../sites-available/x.conf /etc/nginx/sites-enabled/` → `sudo nginx -t && sudo systemctl reload nginx`。
- 本機驗證不等 DNS：`curl -H 'Host: oa.esggo.co' http://127.0.0.1/health`。模板見 `templates/nginx-oa.conf`。
- Cloudflare 加 A 記錄 `oa.esggo.co → 161.118.248.180`。

## 5. s2s 語音代理
- `python3 -m venv /opt/s2s_venv` → `pip install speech-to-speech pocket-tts`（隔離 `PYTHONPATH=""`）。
- pm2 啟動腳本設 `PYTHONPATH=""` + `--llm_backend chat-completions --responses_api_base_url http://localhost:11434/v1 --tts pocket`。
- Parakeet 載入 ~30s 後 `8765` LISTEN；啟動後 `sleep 30 && ss -ltnp | grep 8765` 驗證。

## 6. OAB 寫入（詳 `references/oab-v3-endpoint.md`）
- `POST /v3/conversation/add` + Bearer admin-key + `x-tdai-service-id: default` → `{"code":0}`。
- 404 陷阱：`/v1/memory` `/memory` `/v3/{service}/memory` 全 404；用 flat `/v3/conversation/add`。

## 7. 常見阻礙
- VPS 偶發 OOM 凍結 SSH（gemma4:e4b 9.6GB）→ Oracle Console Reboot，看門狗自動恢復。實測 24G 可用，qwen2.5:3b 安全。
- `npm install` 不裝 devDeps → `@types/node` 缺 → tsc 報 `Cannot find type definition file for 'node'`；加 `npm install --no-save @types/node`。
- `pm2 delete all` 會删掉所有 pm2 服務（含 omniagent-gateway 等）；只 `pm2 delete oa-swarm`。

## 相關
- `esggo-learning-center-dev-lessons`（本機建置，user-owned — 建議 `hermes curator adopt` 以合併維護）
- `oa-team-60-colony` / `oa-shared-memory` / `oa-swarm-operations` / `tencentdb-agent-memory`
