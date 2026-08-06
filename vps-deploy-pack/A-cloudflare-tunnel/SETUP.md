# A. Cloudflare Tunnel 設置（在 VPS 上執行）

1. 安裝 cloudflared（Ubuntu aarch64）
curl -fsSL https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64 -o /usr/local/bin/cloudflared
chmod +x /usr/local/bin/cloudflared
cloudflared --version

2. 登入並建立 named tunnel
cloudflared tunnel login
cloudflared tunnel create esggo
cloudflared tunnel token esggo   # 複製這行 token

3. 設定 DNS（免真實 IP）
cloudflared tunnel route dns esggo app.esggo.co

4. 寫入 token 並啟動
echo "CF_TUNNEL_TOKEN=<token>" > /opt/esggo/.env.cf
docker network inspect esggo-net >/dev/null 2>&1 || docker network create esggo-net
cd /opt/esggo/vps-deploy-pack/A-cloudflare-tunnel
docker compose --env-file /opt/esggo/.env.cf up -d

5. 驗證
cloudflared tunnel list
docker logs esggo-cloudflared --tail 20
curl -sI https://app.esggo.co

注意：tunnel 進 VPS 後由本機 nginx 依域名分流。可與 OmniGateway Worker 並存。
