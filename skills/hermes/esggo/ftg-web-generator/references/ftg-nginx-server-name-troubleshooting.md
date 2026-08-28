# FTG nginx server_name Troubleshooting

## Problem
FTG官網 (ftg.esggo.co) 返回 Cloudflare 526 錯誤，所有版本頁面無法訪問。

## Symptoms
- `curl https://ftg.esggo.co/` 返回 526
- VPS IP 直接訪問 `http://161.118.248.180/` 返回 200（esggo-core 的 Next.js），但 `/2.0/`, `/2.5/` 等版本路徑返回 404
- `curl http://161.118.248.180/ftg/` 返回 404

## Root Cause
nginx `ftg-esggo` 配置檔案 (`/etc/nginx/sites-available/ftg-esggo`) 的 `server_name` 設定為 `esggo.co www.esggo.co`，而非 `ftg.esggo.co`。因此 nginx 收到 `ftg.esggo.co` 的請求後，不會進入這個 server block。

正確的 `ftg.esggo.co` 配置 actually 躺在 `ftg-esggo.bak` 文件中（包含 `server_name ftg.esggo.co` 和 `root /var/www/ftg-tours`），但這個 `.bak` 文件沒有在 `sites-enabled` 中啟用。

## Diagnosis Steps

1. 確認 sites-enabled 中的 ftg-esggo 是否正確：
   ```bash
   ssh ubuntu@161.118.248.180 'ls -la /etc/nginx/sites-enabled/ | grep ftg'
   ```

2. 檢查 ftg-esggo 配置中的 server_name：
   ```bash
   ssh ubuntu@161.118.248.180 'grep server_name /etc/nginx/sites-available/ftg-esggo'
   ```
   期望輸出包含 `ftg.esggo.co`。如果顯示 `esggo.co www.esggo.co`，就是配置錯誤。

3. 檢查是否有正確的 .bak 配置可用：
   ```bash
   ssh ubuntu@161.118.248.180 'grep -n "server_name ftg.esggo.co" /etc/nginx/sites-available/ftg-esggo.bak'
   ```

4. 確認 DNS 是否正確解析到 VPS：
   ```bash
   dig +short ftg.esggo.co A
   ```
   應該返回 Cloudflare Anycast IP（如 172.67.194.8, 104.21.12.97）。

## Fix

1. 備份現有錯誤配置：
   ```bash
   ssh ubuntu@161.118.248.180 'sudo cp -p /etc/nginx/sites-available/ftg-esggo /etc/nginx/sites-available/ftg-esggo.bak.dingjun-$(date +%Y%m%d-%H%M%S)'
   ```

2. 寫入正確配置，包含：
   - server_name ftg.esggo.co（80 和 443 兩個 server block）
   - 80 → 443 轉發
   - 443: root /var/www/ftg-tours, index index.html, try_files $uri $uri/ /index.html
   - 如果需要保留 esggo.co 的 Next.js 代理，保持原有的 proxy_pass 到 3000 的配置

3. 測試 nginx 配置：
   ```bash
   ssh ubuntu@161.118.248.180 'sudo nginx -t'
   ```

4. 如果測試通過，重新加載 nginx：
   ```bash
   ssh ubuntu@161.118.248.180 'sudo nginx -s reload'
   ```

5. 驗證：
   ```bash
   curl -sS -m10 -o /dev/null -w '%{http_code}' https://ftg.esggo.co/
   # 應該返回 200
   ```

## Prevention

- 在任何 nginx 配置變更後，始終驗證 server_name 是否與預期的域名匹配
- deploy 前檢查 `sites-enabled` 中是否有正確的符號鏈接
- 避免將配置文件命名為 `.bak` 並忘記啟用它
- 部署後立即測試：curl 各版本頁面，確認 HTTP 200 和 title 正確

## Related

- See `references/recipes.md` for deployment command sequences
- See P1-P9 in SKILL.md for other FTG deployment pitfalls
- Cloudflare cache issue (P1): max-age=14400, need cache-busting query string
