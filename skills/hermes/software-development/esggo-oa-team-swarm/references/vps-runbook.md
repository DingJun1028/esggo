# VPS Runbook

## Access

- Primary key: `~/.ssh/esggo_original`
- Alt aliases: `esggo-vps`, `esggo-vps-root`, `esggo-vps-fix`
- Target: `ubuntu@161.118.252.147`
- Deploy path: `/opt/esggo`
- Do not use old IP `161.118.248.180` unless the user explicitly reverts.

## Recovery checks

```bash
sudo systemctl status nginx
docker ps
docker compose -f /opt/esggo/vps/docker-compose.yml ps
curl -I http://localhost:3000
curl -I http://localhost:8642
curl -I http://localhost:8000
```

## Docker rebuild pattern

```bash
cd /opt/esggo
docker compose -f vps/docker-compose.yml build --no-cache
docker compose -f vps/docker-compose.yml up -d
docker exec esggo-core which curl
```

## Environment files

- Runtime env file: `/opt/esggo/vps/.env`
- Required keys: `DATABASE_URL`, `GATEWAY_API_KEY`, `SUPABASE_DB_URL` via GitHub Secret sync
- `DATABASE_URL` must use Supabase session pooler IPv4 endpoint
- Never commit `.env` or `.env.local`

## Cloudflare/Nginx update sequence

1. Update Cloudflare A record target to `161.118.252.147`
2. Update local scripts/docs/search-replace old IP
3. On VPS: rewrite nginx site configs to new IP, then `sudo nginx -t && sudo systemctl reload nginx`

## OCI retention

- OCI Console -> Networking -> Reserved Public IPs -> assign `161.118.252.147` to keep it across stop/start.

## Handoff rule

If SSH execution is unavailable from this environment, give the user one command and one expected output shape.
Do not repeat generic SSH instruction menus.