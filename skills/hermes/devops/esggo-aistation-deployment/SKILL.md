---
name: esggo-aistation-deployment
description: ESGGO + AI Station deploy/n8n troubleshooting cheat sheet.
---

# ESGGO + AI Station 部署實戰經驗技能書

> 提煉自真實部署/除錯回合，聚焦可重用檢查點、修復模式與命令片段。

---

## 1. esggo monorepo `pnpm -w build` 失敗：open evidence shape

### 1.1 典型錯誤
```
Type error: Object literal may only specify known properties, and 'martial_law' does not exist
Property 'type' does not exist in type '{ originCause: string; processTrace: string[]; finalEffect: string }'
```

### 1.2 根因
`evidence` 型別只宣告 `originCause / processTrace / finalEffect`，但多處實作會動態寫入額外鍵（`martial_law`、`type`、`name`、`purpose`、`action`…）。

### 1.3 修復腳本（一次性補齊所有 site）
```bash
cd /c/Project/esggo
python scripts/patch_evidence_types.py   # 加 [key: string]: unknown
python scripts/fix_evidence_types.py     # 補齊漏網的 inline 型別
pnpm -w build
```

### 1.4 關鍵檢查
```bash
cd /c/Project/esggo
rg -n "evidence: \{" src | wc -l       # 應 0（全改成 index signature）
rg -l "this\.evidence\[" src             # 確認無剩餘型別錯誤來源
```

---

## 2. AI Station VPS 部署阻塞：port conflict + permissions

### 2.1 port 8000 被占用
```bash
# 查看占用
ss -ltnp | grep ':8000'
# 典型：uvicorn (pid=3637820) 已在 8000 聽 listen

# 選項 A：重啟既有 uvicorn 服務
sudo systemctl restart aistation

# 選項 B：docker compose 改 port
# docker-compose.yml: "127.0.0.1:8001:8000"
# 同步改 cloudflared config.yml 路由
```

### 2.2 SQLite 權限錯誤導致 webhook 500
```bash
# 常見徵兆：curl /webhook/n8n 回 500，journalctl 查不到日誌
# 原因：jobs.db / storage/ 為 root:root，服務無法寫入

# 修復
sudo chown -R ubuntu:ubuntu /opt/esggo/apps/aistation/jobs.db /opt/esggo/apps/aistation/storage
sudo chmod 664 /opt/esggo/apps/aistation/jobs.db
sudo systemctl restart aistation
```

### 2.3 webhook 400：Content-Type / 欄位對應
```bash
# 正確：
curl -sS -X POST https://aistation.esggo.co/webhook/n8n \
  -H 'content-type: application/json' \
  --data-binary '{"script":"..."}'

# WebhookIn 對應：
# title -> title
# script / text -> body (property fallback)
```

### 2.4 /storage/ 公開路徑 404
- 雲端 tunnel 路由必須指向**實際監聽 port**（esggo 上 AI Station 走 `127.0.0.1:8000`，非 8001）
- 修改 `/etc/cloudflared/config.yml` → `sudo systemctl restart cloudflared`

---

## 3. n8n 匯入阻塞：REST API 401 + container 狀態不一致

### 3.1 觀察點
```bash
docker ps -a --filter name=n8n
ss -ltnp | grep ':5678'
curl -sS http://127.0.0.1:5678/healthz
```

### 3.2 API key 從 SQLite 取出
```python
# scripts/get_n8n_api_key2.py
import sqlite3
conn = sqlite3.connect('/home/ubuntu/.n8n/database.sqlite', timeout=10)
cur = conn.cursor()
cur.execute('SELECT apiKey FROM user_api_keys WHERE label=?', ('ai-station-scheduler',))
print(cur.fetchone()[0])
```

### 3.3 失敗備案
若 n8n REST API 持續 401 / container 不在Running：
1. 直接用 Hermes cron 排程觸發 `https://aistation.esggo.co/webhook/n8n`
2. 或請用戶在瀏覽器手動匯入 workflow.json

---

## 4. GitHub Actions CI：frozen lockfile / engine 不符

### 4.1 pnpm-lock.yaml 落後
```yaml
# 解法：移除 frozen-lockfile
pnpm install --no-frozen-lockfile
# 或在 CI 裡加上
# - run: pnpm install --no-frozen-lockfile
```

### 4.2 Node engine 警告（不阻擋建置）
```
[WARN] Unsupported engine: wanted: {"node":"20"} (current: {"node":"v24.x"...})
```
- 僅警告，不會阻止 install/build。
- 若想消除：CI 改用 `node20`，或本地裝 `fnm` / `nvm` 切 20。

### 4.3 prisma client version mismatch
- lockfile `^6.x` / manifest `^5.x`
- 先跑一次 `pnpm install --no-frozen-lockfile` 讓 lockfile 收斂到 manifest。
- 必要時刪 `pnpm-lock.yaml` + `node_modules` 重建。

---

## 5. 推送前處理
```bash
cd /c/Project/esggo
git pull --rebase origin main
git push origin main
```

---

## 6. 驗證 checklist
- [ ] `pnpm -w build` ✅ TypeScript + static generation 完成
- [ ] AI Station `https://aistation.esggo.co/api/health` → 200
- [ ] AI Station `https://aistation.esggo.co/webhook/n8n` POST → 200 + `ok:true`
- [ ] `https://aistation.esggo.co/storage/{job_id}/final.mp4` → 200 + Content-Type: video/mp4
- [ ] cloudflared tunnel `config.yml` 路由指向正確 port
- [ ] jobs.db / storage/ owner = 執行服務的使用者

---

## 8. Deployment reality vs stale README (learned 2026-08-21)

The aistation README/docs say `deploy to 161.118.252.147`, but the live VPS is
**161.118.248.180** (the esggo-vps running DeerFlow, n8n, oa, memory, etc.).
**Always treat README IPs as possibly stale — verify the live target first.**

- **Code lives in `DingJun1028/OmniAuto`** (not a standalone `aistation` repo). Local path:
  `C:/Project/aistation`. Deploy workflows (`deploy.yml`, `verify.yml`, `diag.yml`,
  `https.yml`, `dns-vps.yml`) are under `.github/workflows/` there.
- **aistation was ALREADY live** before this session: a container named `aistation-core`
  (image `dingjunhong1028/aistation:latest`) was `healthy running` on 180, and
  `aistation.esggo.co.conf` was already symlinked in `/etc/nginx/sites-enabled/`.
  Don't assume "not deployed" — check `docker ps` + nginx first.
- **Port binding is safe**: `docker-compose.yml` binds `127.0.0.1:8000:8000` only;
  nginx proxies `aistation.esggo.co` → `127.0.0.1:8000`. No conflict with DeerFlow (:2026).
- **DNS A record already correct**: `aistation.esggo.co → 161.118.248.180` already existed
  in Cloudflare (zone `8dda3653e490290412f7be84a84e0dc9`). Don't recreate — check first:
  ```bash
  curl -s -H "Authorization: Bearer $CF_TOKEN" \
    "https://api.cloudflare.com/client/v4/zones/$ZONE/dns_records?name=aistation.esggo.co&type=A"
  ```
- **HTTPS already had certbot**: `curl -k http://aistation.esggo.co/api/health` → 301,
  `https://...` → 200 with `{"status":"ok",...}`. Deploy docs' "run certbot" step was
  already done.
- **CI `deploy.yml` failure root cause**: it reads `secrets.DEPLOY_HOST` which still held
  the stale `161.118.252.147`. The fix is to update that secret to `161.118.248.180`
  (or add a `host` workflow input defaulting to 180). Direct SSH from a host holding
  `esggo_original` to `ubuntu@161.118.248.180` works and is faster for ad-hoc deploys.

## 9. External verification one-liner (use this, not assumptions)
```bash
curl -s --max-time 15 "https://aistation.esggo.co/api/health"
# expect: {"status":"ok","features":{...free paths...}}
curl -s --max-time 15 "https://aistation.esggo.co/" | grep -ioE "<title>[^<]+</title>"
# expect: <title>AI Station — 全自動影音生產線</title>
```
```bash
# esggo build
cd /c/Project/esggo && pnpm -w build

# AI Station 本地驗證
cd /c/Project/aistation && python -m pytest tests/test_aistation.py -k "n8n or render or metrics or best-practice" -q

# VPS webhook smoke test
curl -sS -X POST https://aistation.esggo.co/webhook/n8n \
  -H 'content-type: application/json' \
  --data-binary '{"script":"final verification"}'
```
