# VPS esggo-core recovery — 2026-08-11

Context: after VPS maintenance, `https://esggo.co` returned 502. Investigation and exact recovery sequence.

## Root cause chain
1. `/var/www/esggo/apps/esggo-core` missing; repo apps/ contained only cf-tunnel-manager, cloudflare-deepseek-v4-pro, gateway, learning-center, omni-blueprint-hub, stt, tencentdb-memory, universal-translator.
2. A manual/legacy `next-server v16.2.11` was already bound to `127.0.0.1:3000` (pid 2461959, started 2026-08-11 12:51:38).
3. `pm2 start --cwd /var/www/esggo/apps/esggo-core -- start` created a phantom `esggo-core` entry with `N/A pid` and `0s` uptime, repeatedly crashing with `EADDRINUSE` while pm2 falsely reported `online`.
4. `pnpm approve-builds` was pending interactive approval, causing install to abort before build.

## Verified recovery sequence
```bash
# 1) confirm holder of :3000
ss -ltnp | grep ':3000'
# 2) kill stray next-server
kill $(fuser 3000/tcp 2>/dev/null | tr -d ' ')
# 3) clean phantom pm2 entry
pm2 delete esggo-core
# 4) pre-approve build scripts non-interactively
cd /var/www/esggo && pnpm approve-builds --all >/dev/null 2>&1 || true
# 5) start from actual root (apps/esggo-core missing)
pm2 start npm --name esggo-core --cwd /var/www/esggo -- start
# 6) wait + verify actual bind
sleep 3
pm2 status esggo-core
ss -ltnp | grep ':3000'
curl -sS http://127.0.0.1:3000/
curl -sS https://esggo.co/
```

## End state
- `pm2 status esggo-core`: pid 2468552, version 5.1.0, uptime > 0s, online.
- `localhost:3000` = 200; `https://esggo.co/` = 200; `https://esggo.co/omni/reports` = 200.
