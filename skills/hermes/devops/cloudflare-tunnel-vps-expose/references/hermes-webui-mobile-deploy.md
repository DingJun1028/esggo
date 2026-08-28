# Deploying Hermes WebUI (mobile "Hermex") on VPS via cloudflared

Goal: make the Hermes Agent Dashboard reachable from a phone browser as
`https://hermex.yourdomain.com` (or any subdomain). The Hermes desktop app's
WebUI is a Vite/React SPA; the backend is `hermes serve` (JSON-RPC + WS gateway).

## Why `hermes serve` (not `hermes webui`)
- `hermes webui` is NOT a valid subcommand (CLI errors: `invalid choice: 'webui'`).
- The real serve command is `hermes serve [--port PORT] [--host HOST] [--skip-build] [--insecure]`.
  - Default port 9119. `--skip-build` serves an existing `web_dist` instead of rebuilding.
  - Official guidance: bind `127.0.0.1` + tunnel; a public bind always requires an auth provider.
- `hermes serve` needs the WebUI frontend built. The VPS Python package
  (`/opt/hermes-venv/lib/python3.12/site-packages/hermes_cli/`) ships WITHOUT the
  `web` source — so you must build on a machine that HAS it (the Windows desktop
  install at `C:/Users/<user>/AppData/Local/hermes/hermes-agent/web` has full src+node_modules).

## Step-by-step (verified 2026-08-24 on esggo / hermex.esggo.co)
1. **Build locally** (Windows desktop has the source + node_modules):
   ```bash
   cd "C:/Users/dingj/AppData/Local/hermes/hermes-agent/web"
   ./node_modules/.bin/vite build        # ~40s; outputs to ../hermes_cli/web_dist/
   ```
   - `pnpm build` FAILS non-interactively (it demands `pnpm approve-builds` TUI for
     `unicode-animations`). Bypass with direct `vite build`.
   - Output lands in `hermes_cli/web_dist/` (NOT `dist/`) — that's the path `hermes serve` serves.
   - Verify: `grep -o 'viewport' ../hermes_cli/web_dist/index.html` (mobile-friendly already).
2. **Ship web_dist to VPS** (VPS path is root-owned → use /tmp then sudo mv):
   ```bash
   cd "C:/Users/dingj/AppData/Local/hermes/hermes-agent/hermes_cli"
   tar czf - web_dist | ssh esggo-vps "sudo rm -rf /opt/hermes-venv/lib/python3.12/site-packages/hermes_cli/web_dist && sudo mkdir -p /opt/hermes-venv/lib/python3.12/site-packages/hermes_cli/web_dist && sudo tar xzf - -C /opt/hermes-venv/lib/python3.12/site-packages/hermes_cli/"
   ```
   - Do NOT `scp -r` directly into the python path — Permission denied (root-owned).
   - `tar | ssh` avoids scp's directory-canonicalization failures.
3. **Start backend** (persistent — use setsid + disown, NOT bare `&`, or SSH hang kills it):
   ```bash
   ssh esggo-vps "setsid bash -c 'hermes serve --port 9119 --skip-build > /tmp/hermex-serve.log 2>&1' < /dev/null & disown"
   # verify: tail /tmp/hermex-serve.log  -> "HERMES_BACKEND_READY port=9119"
   ```
   - If `hermes serve --status` dies with `PermissionError: /home/ubuntu/.hermes/.env`,
     fix with `sudo chown -R ubuntu:ubuntu /home/ubuntu/.hermes` (a prior run left it root-owned).
4. **nginx static + API reverse proxy** on a FREE port (check `ss -tulpn` first;
   `8791` was taken by stt-whisper — used `8795`):
   ```nginx
   server {
       listen 8795;
       server_name hermex.yourdomain.com localhost;
       root /opt/hermes-venv/lib/python3.12/site-packages/hermes_cli/web_dist;
       index index.html;
       location / { try_files $uri $uri/ /index.html; }
       location /api/ { proxy_pass http://127.0.0.1:9119; proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade; proxy_set_header Connection "upgrade";
           proxy_set_header Host $host; proxy_read_timeout 3600s; }
       location /api/ws { proxy_pass http://127.0.0.1:9119; proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade; proxy_set_header Connection "upgrade";
           proxy_set_header Host $host; proxy_read_timeout 3600s; }
   }
   ```
   - `sudo nginx -t && sudo systemctl reload nginx`. Verify `curl http://127.0.0.1:8795/` → 200.
5. **cloudflared tunnel** (see catch-all pitfall below) + `route dns`:
   ```bash
   ssh esggo-vps "cloudflared tunnel route dns <TUNNEL_ID> hermex.yourdomain.com"
   ```
6. **Verify from phone/browser**: `curl -s -o /dev/null -w '%{http_code}' https://hermex.yourdomain.com/`
   → expect `200` and `<title>Hermes Agent - Dashboard</title>`.

## Notes
- `hermes serve` backend is a single-user session: phone logs in with the user's Hermes creds.
- On Hermes upgrade, re-run steps 1-2 to refresh `web_dist`.
- If `https://hermex...` returns 404 but `127.0.0.1:8795` returns 200 locally →
  it's the catch-all-ordering / wrong-config-file bug (see SKILL.md §3b + below).
