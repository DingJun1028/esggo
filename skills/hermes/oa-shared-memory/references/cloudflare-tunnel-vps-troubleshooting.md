# Cloudflare Tunnel VPS Troubleshooting (Session: 2026-08-27)

## Problem: gateway.esggo.co → 502 Bad Gateway

### Root Cause
- `start-proxy.sh` generates config with `http://memory-core:8420` (Docker DNS name)
- Proxy runs with `--network host` on VPS → Docker DNS doesn't resolve `memory-core`
- Old cloudflared process (PID 1463316, running as root) was holding port 9090
- New process couldn't start → old config cached

### Fix Steps
1. `sed -i 's|http://memory-core:8420|http://127.0.0.1:8420|g' config.yaml`
2. `sudo pkill -9 -x cloudflared` (needs sudo — runs as root)
3. `nohup cloudflared tunnel --config /etc/cloudflared/config.yml run esggo-tunnel`
4. Wait 10s for propagation

### Verification
```bash
pgrep -a cloudflared
curl -sf https://gateway.esggo.co/health | python3 -c "import json,sys; print(json.load(sys.stdin)['status'])"
```

## SSH Alias Gotcha
- `ssh ubuntu@161.118.248.180` → Permission denied (publickey)
- `ssh esggo-vps` → WORKS (uses ~/.ssh/config alias with IdentityFile ~/.ssh/esggo_original)
- Fingerprint: SHA256:YGMYtfuYxdV6hJ8yXySOLbQn3ziqnMIHS5+HZlzwyys
