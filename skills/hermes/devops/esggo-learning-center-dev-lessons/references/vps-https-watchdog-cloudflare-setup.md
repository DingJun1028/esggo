# VPS HTTPS + 看門狗 + Cloudflare Agent Setup（補充技術銀行）

本檔補充 `esggo-learning-center-dev-lessons` SKILL.md §2/§9/§10 之外的生產部署技術，來自雙蜂戰隊 60 公開部署實戰（2026-08-25）。

## A. Let's Encrypt DNS-01 + Cloudflare 橙雲（生產級 HTTPS）
**適用**：VPS 服務要公開 HTTPS 且不開 443 對外（只用 80 或純 DNS 驗證）。

1. 裝 certbot Cloudflare 插件（Ubuntu）：
```bash
sudo apt-get update -qq
sudo apt-get install -y -qq python3-certbot-dns-cloudflare
certbot plugins | grep cloudflare   # 確認 dns-cloudflare 出現
```
2. 寫 CF 憑證檔（用 §10 的 API Token，非 OAuth）：
```bash
echo 'dns_cloudflare_api_token = cfut_XXX' | sudo tee /etc/letsencrypt/cloudflare.ini
sudo chmod 600 /etc/letsencrypt/cloudflare.ini
```
3. 領證（DNS-01 挑戰，不需開 port）：
```bash
sudo certbot certonly --dns-cloudflare \
  --dns-cloudflare-credentials /etc/letsencrypt/cloudflare.ini \
  -d oa.esggo.co --non-interactive --agree-tos -m dingjunhong1028@gmail.com
# 證書: /etc/letsencrypt/live/oa.esggo.co/{fullchain.pem,privkey.pem}
# 自動續期已設 (certbot renew 排程)
```
4. nginx 443 + 80→443 重定向 + WS 升級（語音代理 /voice/ws → 8765）：見 `templates/nginx-oa-esggo-co.conf`。
5. 開 CF 橙雲：`proxied:true`（API PATCH dns_records，同 §10 格式）。

**坑**：
- `proxied:true` 但 origin 無 SSL → CF 回 **526**。先裝好 nginx 443 再開橙雲。
- 灰雲→橙雲切換 5-30min edge 傳播；期間 `dig` 空 + 301 from cloudflare 是 cache 殘留。
- 強制測試繞 DNS：`curl --resolve oa.esggo.co:443:161.118.248.180 https://oa.esggo.co/health`。

## B. VPS 看門狗 + pm2 持久化（自體修復）
**適用**：確保 oa-swarm/s2s/OAB 崩潰後自動重啟 + reboot 後自啟 + 異常告警。

1. 看門狗腳本（每 5min crontab）：見 `scripts/watchdog_oa.sh`（探活 8800/8765/8420，崩潰 `pm2 delete`+`pm2 start`，Telegram 告警，熵值 >0.5 告警）。
2. 安裝：
```bash
sudo cp watchdog_oa.sh /opt/esggo/scripts/ && sudo chmod +x /opt/esggo/scripts/watchdog_oa.sh
(crontab -l 2>/dev/null | grep -v watchdog_oa; echo '*/5 * * * * /opt/esggo/scripts/watchdog_oa.sh') | crontab -
```
3. pm2 持久化（reboot 自啟）：
```bash
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu
pm2 save   # 寫 dump.pm2
```
**坑**：pm2 `ecosystem.config.cjs` 用 `.cjs`（package.json 有 `"type":"module"` 時 .js 被當 ESM 導致 pm2 start 讀錯）。

## C. Cloudflare Agent Setup（官方 prompt.md 流程）
**適用**：Hermes 要接 Cloudflare MCP + Skills（對齊 https://developers.cloudflare.com/agent-setup/prompt.md）。

1. Skills：`npx -y skills add cloudflare/skills --skill '*' --yes --global`（裝到 `~/.agents/skills/`，含 workers-best-practices / wrangler / durable-objects 等）。
2. MCP 註冊（Hermes 歸「other agents」）：**勿用 `setup_mcp`**（會彈 OAuth 卡 420s 超時）。改用：
```bash
hermes config set mcp_servers.cloudflare.url "https://mcp.cloudflare.com/mcp"
hermes config set mcp_servers.cloudflare.auth "oauth"
hermes config set mcp_servers.cloudflare.enabled true
# 同理: cloudflare-docs (無 auth) / cloudflare-bindings / cloudflare-builds / cloudflare-observability
```
   OAuth 留空，首次工具呼叫自動觸發握手。改完**重啟 Hermes** 載入。
3. wrangler 登入（OAuth，僅 zone:read）：`wrangler login` → 瀏覽器授權 → token 存 `~/.config/.wrangler/` 或 `C:\Users\dingj\AppData\Roaming\xdg.config\.wrangler\config\default.toml`。**OAuth token 不能寫 DNS**（見 §10）。
