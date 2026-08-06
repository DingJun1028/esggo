# Universal-Translator Cloudflare Tunnel 部署指引

> 本文件說明如何將 `universal-translator` 服務暴露至 `https://translate.esggo.co`

---

## 📋 前置條件

1. ✅ VPS 已安裝 `cloudflared`
2. ✅ `universal-translator` 服務在 `localhost:8788` 運行
3. ✅ Cloudflare 組織帳號 & Tunnel 權限

---

## 🚀 一鍵部署腳本

```bash
# 1. 連線至 VPS
ssh ubuntu@161.118.248.180

# 2. 下載並執行部署腳本
curl -fsSL https://raw.githubusercontent.com/DingJun1028/esggo/main/deploy/verify_universal_translator.sh | bash
```

---

## 🏗 手動部署步驟

### 步驟 1：編譯服務

```bash
cd /opt/esggo/apps/universal-translator
npm install --omit=dev
pm2 start server.mjs --name universal-translator --watch
pm2 save
```

### 步驟 2：配置 Nginx

```bash
# 建立反向代理配置
cat > /etc/nginx/sites-available/translate.esggo.co <<'NGINX'
server {
    listen 80;
    server_name translate.esggo.co;

    location / {
        proxy_pass http://127.0.0.1:8788;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
NGINX

ln -sf /etc/nginx/sites-available/translate.esggo.co /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

### 步驟 3：Cloudflare Tunnel

```bash
# 1. 建立 Tunnel (若未建立)
cloudflared tunnel create translate

# 2. 編輯配置
cat > ~/.cloudflared/config.yml <<'CLOUDFLARE'
tunnel: <YOUR-TUNNEL-ID>
credentials-file: /home/ubuntu/.cloudflared/<YOUR-TUNNEL-ID>.json

ingress:
  - hostname: translate.esggo.co
    service: http://localhost:8788
  - service: http_status:404
CLOUDFLARE

# 3. 啟動 Tunnel
cloudflared tunnel route dns translate translate.esggo.co
cloudflared service install
systemctl restart cloudflared
```

---

## ✅ 驗證部署

```bash
# 本地測試
curl -i http://localhost:8788/health

# 公開網址測試
curl -i https://translate.esggo.co/health
```

---

## 📖 相關文件

- [universal-translator QUICKSTART.MD](apps/universal-translator/QUICKSTART.md)
- [腳本驗證](apps/universal-translator/verify_full.mjs)
- [測試腳本](apps/universal-translator/test_remote.mjs)