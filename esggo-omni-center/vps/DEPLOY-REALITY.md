# ESGGO VPS — 真實生產狀態文檔 (Reality Doc)

> 本文件記錄 VPS 的**實際運行狀態**（2026-07-10 核對）。
> 舊版 `DEPLOY-ORACLE.md` 描述的是 Docker Compose 藍圖（esggo.ai / Redis 容器），與現況不符，僅供歷史參考。
> 本文件以 `ssh esggo-bastion` 進 VPS 後實際觀察為準。

---

## 1. 硬體與存取

| 項目 | 值 |
|------|-----|
| 機型 | Oracle Cloud Always Free — VM.Standard.A1.Flex (ARM64 / aarch64) |
| OS | Ubuntu 24.04 |
| 公網 IP | 161.118.248.180 |
| 私網 IP | 10.0.0.119 (enp0s6) |
| 公開端口 | 僅 80 / 443（22、8042 公網已關） |
| 程序管理 | PM2 (fork mode) + systemd 開機自啟 |
| Web 伺服器 | nginx (master pid 1431) |

### 存取方式（重要）
公網 22 已關，必須經 **OCI Bastion managed-ssh session** 跳板：

```bash
# 本機腳本：重建 bastion session + 重寫 ~/.ssh/config 的 esggo-bastion 段 + 直連驗證
python vps-bastion.py

# session 每次約 1800s 過期，過期後重跑上面腳本即可
ssh esggo-bastion
```

---

## 2. DNS 與 TLS（關鍵校正）

**DNS 由 Cloudflare 管理，不是 GoDaddy。**

| 項目 | 真實狀態 |
|------|---------|
| NS | `becky.ns.cloudflare.com` / `tom.ns.cloudflare.com` |
| 代理模式 | Cloudflare 橙雲（proxied），A 記錄指向 Cloudflare 邊緣，回源 VPS |
| esggo.co 證書 | Let's Encrypt（VPS 上 certbot 簽，certbot.timer 自動續期，有效期至 2026-10-02） |
| zone SSL 模式 | **flexible**（Cloudflare→VPS 回源用 HTTP :80；瀏覽器→Cloudflare 為 HTTPS Universal SSL） |
| esggo.app | **未註冊**（NS 查 Non-existent domain），勿建 `*.esggo.app` 子域 |

> 註：GoDaddy 可能只是 esggo.co 的網域註冊商（registrar），但 DNS 實際由 Cloudflare 管。
> Cloudflare API Token 用於 DNS 操作（zone id: `8dda3653e490290412f7be84a84e0dc9`）。

---

## 3. 服務架構（真實）

```
Client
  │
  ▼  HTTPS (TLS 1.3, Cloudflare Universal SSL)
Cloudflare 邊緣 (esggo.co / omniagent.esggo.co)
  │  回源: flexible → HTTP :80 (VPS nginx)
  ▼
VPS nginx (pid 1431)
  ├─ server esggo.co:443  ─┬─ location /                  → 127.0.0.1:3000 (esggo-core, PM2)
  │                       └─ location /omniagent-gateway/ → 127.0.0.1:8642 (gateway, PM2)
  └─ server omniagent.esggo.co:80 → 127.0.0.1:8642 (gateway, PM2)   [Cloudflare 回源]

PM2 程序:
  ├─ esggo-core      (Next.js, port 3000, restart=0, online)
  └─ omniagent-gateway (Express, port 8642, v3.0.0, restart=0, online)
```

### 對外端點（2026-07-10 實測）

| 服務 | URL | 狀態 |
|------|-----|------|
| 主站 | https://esggo.co | 200 (HTTP→HTTPS 301) |
| www | https://www.esggo.co | 200 |
| API 健康 | https://esggo.co/api/health | 200 |
| Gateway (路徑) | https://esggo.co/omniagent-gateway/status | 200 |
| **Gateway (子域)** | **https://omniagent.esggo.co/status** | **200 (2026-07-10 新建)** |
| Gateway (裸 IP) | http://161.118.248.180:8642/status | 200 |

---

## 4. 監控棧（內網，不公網裸開）

| 服務 | 內部端口 | 程序 |
|------|---------|------|
| Prometheus | 9090 | prometheus (pid 1216) |
| Alertmanager | 9093 | prometheus-alertmanager (pid 1201) |
| Netdata | 19999 | netdata (pid 1192) |
| Telegram 告警轉發 | 9080 | nc (pid 1290) → telegram-alert.sh |

> UFW 只開 22/80/443 給公網；監控端口僅內網/跳板可達。

---

## 5. 安全

- ✅ UFW 啟用（公網僅 22/80/443）
- ✅ Fail2Ban 啟用（active）
- ✅ nginx 安全標頭（HSTS / X-Frame-Options / X-Content-Type-Options）
- ✅ TLS 1.2/1.3
- ⚠️ Cloudflare→VPS 為 flexible（明文回源），若要 Full(strict) 需 VPS 簽子域證書

---

## 6. 代碼版本

| 項目 | 值 |
|------|-----|
| VPS `/var/www/esggo` | `294ab437` (= GitHub main) |
| 已合併 PR | #171 (pg 依賴修復), #172 (ecosystem gateway→omni-server.mjs) |
| 本地 esggo repo | main = `294ab437` |

### 部署流程（VPS 同步新版本）
> 用「直連 SSH」（`esggo-vps`，公網 22 已開），不再走 bastion。

```bash
# 1. 本機打 bundle（用 HEAD，勿用 commit hash 否則報 empty bundle）
git bundle create /tmp/esggo.bundle HEAD
scp /tmp/esggo.bundle esggo-vps:/tmp/esggo.bundle

# 2. VPS
ssh esggo-vps
cd /var/www/esggo
git fetch /tmp/esggo.bundle HEAD:<newsha>
git checkout -f <newsha>
pnpm install --frozen-lockfile
pnpm run build
pm2 restart esggo-core omniagent-gateway   # 或 restart 對應 app
pm2 save
```

> 注意：VPS 用 pnpm（pnpm workspace，npm install 會噴 EUNSUPPORTEDPROTOCOL）。
> 本機 Windows git-bash 的 pnpm 壞，本機用 npm run。

---

## 7. 子域 omniagent.esggo.co 設置記錄（2026-07-10）

經 Cloudflare API 建立獨立 gateway 子域：

1. **DNS A 記錄**（Cloudflare API）
   - `omniagent.esggo.co → 161.118.248.180`，proxied=true
2. **VPS nginx** 新增 `omniagent-sub` 站
   - `server_name omniagent.esggo.co; listen 80;`
   - `proxy_pass http://127.0.0.1:8642;`（含 `/ws` WebSocket）
   - 不 301 重導（Cloudflare flexible 回源走 HTTP）
   - 配置檔：`/etc/nginx/sites-available/omniagent-sub`
3. **Cloudflare zone SSL** 設為 `flexible`（解 526 Invalid SSL certificate）

> 曾嘗試 certbot DNS-01 簽子域證書，但 certbot 在 VPS 端報
> `Error determining zone_id: 9109 Cannot use the access token from location: 161.118.248.180`
> （Cloudflare 對該 token 有來源 IP 限制）。故改用 flexible 模式（VPS 不需證書）。
> 若要 Full(strict)，需從本機（不被 IP 限制）跑 certbot 簽證再傳 VPS。

---

## 8. 故障排除速查

```bash
# 重啟服務
pm2 restart esggo-core omniagent-gateway
pm2 logs <app>

# nginx 配置檢查 / 重載
nginx -t
systemctl reload nginx

# 端口佔用檢查（gateway 啟動 EADDRINUSE 時）
ss -ltnp | grep 8642
# 清孤兒：pkill -f omni-server.mjs 後 pm2 restart omniagent-gateway

# 重置 PM2 restart 計數（不影響運行）
pm2 reset omniagent-gateway

# bastion 已停用（C1 infeasible）：改用直連 SSH
ssh esggo-vps

# ⚠️ 站點 301 無限重定向（redirect loop）排查
# 症狀：curl 對 https://esggo.co/* 一直 301 到同一網址
# 根因：Cloudflare 為 flexible 模式（回源走 HTTP :80），但 nginx :80 server block
#       有 `return 301 https://$host$request_uri;` → 回源 HTTP 被導回 https → 迴圈
# 修法：:80 server block 的 `location /` 改為 proxy_pass 到後端（與 :443 同），
#       不要做 http→https 重定向。改完 `nginx -t && systemctl reload nginx`。
# 備份檔請放 /root/nginx-backup/，勿放 /etc/nginx/sites-enabled/（會被載入造成
# server_name 衝突、重定向復發）。
# 修好的 :80/:443 設定已納入 repo：vps/nginx/esggo.conf 與 vps/nginx/omniagent-sub.conf
# VPS 重建時：
#   cp vps/nginx/esggo.conf /etc/nginx/sites-enabled/esggo
#   cp vps/nginx/omniagent-sub.conf /etc/nginx/sites-enabled/omniagent-sub
# 再 `nginx -t && systemctl reload nginx`（cert 路徑 /etc/letsencrypt/... 需先存在）。
```

---

## 9. 待辦 / 已知事項

- [ ] Cloudflare API token 已用於對話，建議到 Cloudflare 控制台 rotate（作廢舊 token）
- [ ] Notion API token (ntn_5498...095T) 已用於對話寫入「資料蒐集庫」，建議到 Notion my-integrations revoke/rotate
- [ ] 若改 Cloudflare SSL 為 Full(strict)，需為 omniagent.esggo.co 簽 VPS 證書
- [ ] VPS `git stash` 尚有 `pre-deploy-1783698234`（部署前備份），評估後未併回（會回退新功能）
- [ ] esggo.app 域名未註冊，勿建 `*.esggo.app` 子域
