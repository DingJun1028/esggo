# VPS Direct Connection Guide

本指南用於 ESGGO 生產 VPS 的 SSH、PM2、Nginx 與 OmniAgent Gateway 維護。

## Connection

- Host: `161.118.248.180`
- SSH port: `22`
- Default user: `root`
- Oracle standard user: `opc`
- App path: `/var/www/esggo`
- OmniAgent Gateway path: `/var/www/esggo/omniagent-gateway`
- Nginx config: `/etc/nginx/sites-available/esggo`
- Environment files:
  - `/var/www/esggo/.env.production`
  - `/var/www/esggo/omniagent-gateway/.env`

```bash
ssh root@161.118.248.180
```

## Ports

| Port | Purpose |
|---|---|
| 22 | SSH |
| 80 | Nginx public HTTP |
| 443 | HTTPS, if Certbot is configured |
| 3000 | ESGGO Next.js app on localhost |
| 8642 | OmniAgent Gateway on localhost and public status endpoint |

## Local deployment

```bash
./deploy-omni.sh
```

Optional variables:

```bash
SSH_KEY_PATH=~/.ssh/vps_key VPS_USER=root VPS_HOST=161.118.248.180 ./deploy-omni.sh
NEXT_PUBLIC_OMNIAGENT_GATEWAY_URL=http://161.118.248.180:8642 ./deploy-omni.sh
```

Only enable SSH hardening after confirming key-based access works:

```bash
HARDEN_SSH=true SSH_KEY_PATH=~/.ssh/vps_key ./deploy-omni.sh
```

## Gateway-only setup on the VPS

```bash
cd /var/www/esggo
./vps/deploy-omni.sh
```

## PM2

```bash
pm2 status
pm2 logs esggo
pm2 logs omniagent-gateway
pm2 restart esggo omniagent-gateway
pm2 save
```

## Health checks

```bash
curl -fsS http://127.0.0.1:3000/
curl -fsS http://127.0.0.1:8642/status
curl -fsS http://161.118.248.180/status
curl -fsS http://161.118.248.180:8642/status
```

## Nginx

ESGGO is proxied from port 80 to the Next.js app on `127.0.0.1:3000`.

OmniAgent Gateway is proxied under `/omniagent-gateway/` to `127.0.0.1:8642`.

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Environment variables

Do not print or commit `.env` files.

Required ESGGO variables:

```env
NODE_ENV=production
PORT=3000
OMNIAGENT_API_URL=http://127.0.0.1:8642
NEXT_PUBLIC_OMNIAGENT_GATEWAY_URL=http://161.118.248.180:8642
NEXT_PUBLIC_GATEWAY_KEY=change-this-on-production
```

Required OmniAgent Gateway variables:

```env
PORT=8642
VPS_IP=161.118.248.180
GATEWAY_API_KEY=change-this-on-production
GEMINI_API_KEY=
OPENROUTER_API_KEY=
ALLOWED_ORIGINS=http://161.118.248.180,http://127.0.0.1:3000
```

## Security notes

- Use SSH keys instead of passwords.
- Keep port 22 open only for verified administrators.
- Keep `GATEWAY_API_KEY` out of source control.
- Use `NEXT_PUBLIC_GATEWAY_KEY` only for browser-to-gateway calls that are intentionally public.
- Set `HARDEN_SSH=true` only after testing SSH key login.
