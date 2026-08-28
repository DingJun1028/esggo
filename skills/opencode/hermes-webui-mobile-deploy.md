---
name: hermes-webui-mobile-deploy
description: Deploy Hermes WebUI to VPS for phone access (Hermex).
---

# Hermes WebUI Mobile Deploy (VPS)

Deploy the Hermes desktop WebUI so a phone can reach it. The WebUI is a Vite/React SPA; the backend is `hermes serve` (JSON-RPC + WebSocket). You need BOTH served: static files + the API/WS backend, behind one host.

## Triggers
- "手機版 Hermes" / "mobile Hermes WebUI" / "Hermex" / expose Hermes dashboard on phone.
- `hermes serve` alone returns 404 on `/` (backend only — no static root; expected, not a failure).

## Prerequisites
- Hermes installed locally WITH `hermes-agent/web` (has `node_modules`) and on VPS (`/opt/hermes-venv/.../hermes_cli`, has `hermes serve`).
- VPS reachable via SSH. `cloudflared` already running on VPS with a tunnel.
- You (or the user, via Cloudflare console) can create a DNS CNAME for the subdomain.

## Validated workflow (tested 2026-08-24 → HTTP 200 on :8795)

### 1. Local build — bypass pnpm interactive approve-builds
`pnpm build` hangs on an interactive TUI (`unicode-animations` postinstall approval). Run vite directly:
```
cd <hermes-home>/hermes-agent/web
./node_modules/.bin/vite build
# vite outputs to ../hermes_cli/web_dist  (NOT ./dist)
ls ../hermes_cli/web_dist/index.html   # confirm
```

### 2. Ship web_dist to VPS — scp fails with Permission denied on /opt
Use tar|ssh + sudo (scp to /opt/hermes-venv is denied for the ubuntu user):
```
cd <hermes-home>/hermes-agent/hermes_cli
tar czf - web_dist | ssh esggo-vps "sudo rm -rf /opt/hermes-venv/lib/python3.12/site-packages/hermes_cli/web_dist && sudo mkdir -p /opt/hermes-venv/lib/python3.12/site-packages/hermes_cli/web_dist && sudo tar xzf - -C /opt/hermes-venv/lib/python3.12/site-packages/hermes_cli/ && sudo chown -R root:root /opt/hermes-venv/lib/python3.12/site-packages/hermes_cli/web_dist"
```

### 3. Start backend — must survive SSH disconnect
Bare `nohup &` dies when the SSH session closes. Use `setsid` + `disown` + stdin from /dev/null:
```
ssh esggo-vps "setsid bash -c 'hermes serve --port 9119 --skip-build > /tmp/hermex-serve.log 2>&1' < /dev/null & disown"
# log prints: HERMES_BACKEND_READY port=9119
# curl http://127.0.0.1:9119/ → 404 is EXPECTED (backend only)
```

### 4. nginx — static serve + API/WS reverse proxy
Pick a FREE port. **8791 was taken by stt-whisper** (find with `sudo ss -tulpn`). Use 8795.
See `references/nginx-hermex.conf` for the full server block.
```
sudo nginx -t && sudo systemctl reload nginx
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:8795/   # → 200
```
Frontend connects to backend via `/api/ws` (WebSocket, session-token auth) and `/api/*`. Proxy MUST set `Upgrade`/`Connection` headers + `proxy_read_timeout 3600s`.

### 5. cloudflared tunnel (hostname mode)
Append to `~/.cloudflared/config.yml`:
```
  - hostname: hermex.esggo.co
    service: http://127.0.0.1:8795
```
Validate YAML (`python3 -c "import yaml; yaml.safe_load(open('config.yml'))"`) then `sudo systemctl restart cloudflared`.

### 6. REQUIRED — Cloudflare DNS CNAME (easy to forget)
cloudflared hostname mode does NOT auto-create DNS. Until the CNAME exists, `https://hermex.esggo.co` returns empty (HTTP 000) even though the tunnel shows "active".
Create in Cloudflare console (esggo.co zone): Type `CNAME`, Name `hermex`, Target `<tunnel-id>.cfargotunnel.com`, Proxy ON.
This gap is identical for ANY subdomain added this way (omni.esggo.co had the exact same miss). **Do not claim "deployed" until the CNAME exists and the subdomain returns 200.**

## Phone verification
After DNS propagates: open `https://hermex.esggo.co`. WebUI auto-connects to backend via `/api/ws`. Direct `IP:port` without the tunnel will not auth (page must be served by the dashboard server).

## Pitfalls
- **pnpm build hangs** on interactive `approve-builds` TUI → use `./node_modules/.bin/vite build`.
- **scp Permission denied** to `/opt` → `tar | ssh sudo tar xzf`.
- **Backend dies on SSH close** → `setsid ... < /dev/null & disown`, not bare `nohup &`.
- **Port taken** → `ss -tulpn` to find free port (8791 = stt-whisper; used 8795).
- **nginx -t passes but reload silently fails** when the port is already bound → check `/var/log/nginx/error.log` for `bind() ... Address already in use`.
- **DNS CNAME missing** = #1 cause of "deployed but phone can't reach it".

## Verification pitfall (general, cross-cutting)
Hermes `read_file` / secret-vault REDACTS any line containing `key` as `***` in terminal display, but the on-disk file is REAL (e.g. `CFG.geminiApiKey`). Never conclude a value is wrong from `***` alone — confirm with `python -c "print(open(f).read())"` or `execute_code` repr(). Mid-session this caused a false "geminiApiKey not fixed" diagnosis.
