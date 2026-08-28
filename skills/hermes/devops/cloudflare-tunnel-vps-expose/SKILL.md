---
name: cloudflare-tunnel-vps-expose
description: Expose VPS services via cloudflared tunnel + nginx :80.
tags: [devops, cloudflare, tunnel, nginx, vps, wrangler, deployment]
triggers:
  - expose a VPS service publicly
  - cloudflared tunnel ingress
  - cloudflare tunnel route dns
  - nginx reverse proxy vps
  - wrangler deploy oauth
  - no open ports / no certbot
  - verify nginx conf / bash / mjs change

---

# Cloudflare Tunnel VPS Service Exposure

Best-practice pattern for putting an internal VPS service on a public `*.yourdomain.com` URL
**without opening firewall ports and without running certbot**. The tunnel terminates TLS at
the Cloudflare edge; the origin only serves plaintext on `:80`, so nginx needs NO `listen 443`
and NO certificate.

## When to use
You have a service on the VPS at `127.0.0.1:PORT` (Docker container, pm2 app, node server) and
want it reachable as `https://sub.yourdomain.com/`. The VPS already runs `cloudflared tunnel`.

## Step-by-step

### 1. nginx conf — `:80` ONLY, no cert
```nginx
server {
    server_name sub.yourdomain.com;
    client_max_body_size 20m;
    proxy_connect_timeout 10s;
    proxy_send_timeout 3600s;
    proxy_read_timeout 3600s;
    location /gateway/ {
        proxy_pass http://127.0.0.1:8420/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_buffering off; proxy_cache off;
    }
    location / {
        proxy_pass http://127.0.0.1:8125;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        chunked_transfer_encoding on;
    }
    listen 80;
}
```
Do NOT add `listen 443 ssl` or cert lines — the tunnel handles TLS.

### 2. Deploy to VPS
```bash
scp file.conf ubuntu@vps:/tmp/file.conf
ssh ubuntu@vps 'sudo mv /tmp/file.conf /etc/nginx/sites-available/sub.yourdomain.com.conf \
  && sudo ln -sf /etc/nginx/sites-available/sub.yourdomain.com.conf /etc/nginx/sites-enabled/ \
  && sudo nginx -t && sudo nginx -s reload'
```

### 3. DNS CNAME via the tunnel's OWN credentials (NOT the Cloudflare REST API)
```bash
ssh ubuntu@vps 'cloudflared tunnel route dns <TUNNEL_ID> sub.yourdomain.com'
# -> "Added CNAME sub.yourdomain.com which will route to this tunnel"
```
**PITFALL**: Do NOT use the Cloudflare REST API (`curl .../zones/<id>/dns_records`) with a
`cfat_*` / `cfut_*` token to create the record. Those tokens usually report
`Invalid access token` / `No route for that URI` (scope lacks DNS or AI).
`cloudflared tunnel route dns` uses the tunnel's stored credentials and bypasses the token problem.
**No Account API Token needed** for this step — the tunnel cert (`~/.cloudflared/cert.pem`) plus the
tunnel credentials JSON already authorize the DNS route. Verified 2026-08: brought
`translate.esggo.co` live on the existing `esggo-tunnel` this way with zero Cloudflare API tokens
in play (VPS had no Account Token, 1Password had no CF creds).

### 3b. systemd reads `/etc/cloudflared/config.yml`, NOT `~/.cloudflared/config.yml`
The `cloudflared` systemd unit's `ExecStart` points at `/etc/cloudflared/config.yml` (absolute path).
Editing `~/.cloudflared/config.yml` and restarting the service changes NOTHING — the old ingress
keeps serving. Verified 2026-08 on `esggo-tunnel`:
- Symptom: new hostname (`translate.esggo.co`) resolves NXDOMAIN even after `systemctl restart cloudflared`.
- Fix: edit `/etc/cloudflared/config.yml` (keep its absolute `credentials-file:` / `origincert:` paths),
  `sudo cp` a timestamped backup FIRST, then `sudo systemctl restart cloudflared`.
- `cloudflared service install` warns about conflicting `/etc` vs `~` configs — they had drifted
  (the `~` copy lacked a `memory.esggo.co` ingress the `/etc` copy had). Treat `/etc` as source of truth.
- `systemctl restart cloudflared` needs sudo; plain `restart` fails with `Interactive authentication required`.
- Add new ingress entries ABOVE the `- service: http_status:404` catch-all line.

### 4. Verify
```bash
curl -s -o /dev/null -w "%{http_code}\n" https://sub.yourdomain.com/
curl https://sub.yourdomain.com/gateway/health
```
If `nslookup sub.yourdomain.com` returns your router IP (`192.168.x.x`), that's local-DNS lag,
not a config error — the CNAME is live on Cloudflare (confirm via `cloudflared tunnel route dns`
re-run showing "already configured").

## wrangler / Cloudflare Workers pitfalls
- **Check existing login before hunting tokens**: `wrangler whoami` may already show
  `logged in with an OAuth Token (dingjunhong1028@gmail.com)`. Credentials live at
  `C:\Users\<user>\AppData\Roaming\xdg.config\.wrangler\config\default.toml` on Windows
  (**not** `~/.config/wrangler` or `~/.wrangler` — those doc paths are wrong on this host).
- **Duplicate `[build]` in `wrangler.toml`** → `redefine an already defined table or value`.
  Collapse to a single `[build]` block.
- **Worker AI needs the Worker runtime, not REST**: `env.AI.run('deepseek/deepseek-v4-pro', ...)`
  only works inside a Worker (`wrangler.toml` → `[ai] binding = "AI"`). The REST endpoint
  `accounts/{id}/ai/run/...` fails with auth/model errors because the API token lacks AI scope.
  `wrangler deploy --name x` uses the OAuth session — no token needed.
- Model error `code: 1042` = account not entitled to that model (not a code bug).

## Verifying non-TypeScript changes (avoid blind typecheck)
`pnpm run typecheck` / `tsc -p tsconfig.core.json` only scan TS. Changes to YAML / bash / nginx
`.conf` / `.mjs` / `.md` are NOT covered. Use the right tool:
- nginx `.conf` → `sudo nginx -t` (VPS)
- bash `.sh` → `bash -n`
- JS `.mjs` → `node --check` (use `C:/path/file.mjs` native form; MSYS rewrites `/c/...` to
  `C:\c\...` and breaks `node --check`)
- live endpoint → `curl` the real URL (including Tunnel URLs)
- If `npm install` hangs (external pkg like `ws` over slow net), verify the logic with a
  **self-contained script**: import only node-builtins + the engine module, spin an `http`
  server on a temp port, `fetch` it internally, then `process.exit(0)`. See
  `references/self-contained-verify.md`.

## VPS git sync permission traps
- `insufficient permission .git/objects` / `Permission denied` on unpack → a nested dir was
  written by root: `sudo chown -R ubuntu:ubuntu /opt/esggo`.
- scripts lose `+x` after `git reset --hard`: `chmod +x start-*.sh _lib.sh`.
- `.env` with CRLF → `$'\r': command not found` in bash `source`: `sed -i 's/\r$//' .env`.
- slow docker pull exceeds terminal timeout → `nohup bash start-all.sh > /tmp/x.log 2>&1 &`
  then poll `docker ps`.
