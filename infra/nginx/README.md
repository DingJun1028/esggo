# Nginx config（唯讀參照）

本 repo 不再追蹤系統設定檔 `/etc/nginx/sites-available/*`。
線上仍由 system nginx 讀取原路徑。

連動：
- nginx `proxy_pass` → PM2 `127.0.0.1:3000` / `127.0.0.1:8642`
- SSL 憑證路徑 `/etc/letsencrypt/live/esggo.co/*` 不進 repo
