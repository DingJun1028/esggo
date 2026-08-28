---
name: vps-ts-service-deploy
description: Deploy tsx service on VPS via SSH + Cloudflare Tunnel.
---

# VPS TypeScript Service Deploy

Deploy/update a `node --import tsx server.ts` service on a remote Linux VPS and expose it via Cloudflare Tunnel. Covers transfer → syntax check → restart → DNS → verify.

## When to use
- A `.ts` service runs with `tsx` (NOT docker-compose build).
- Target is a Linux VPS reachable over SSH.
- External access goes through Cloudflare Tunnel (not raw port open).
- You must satisfy a `pnpm run typecheck` gate (e.g. a system reminder) on edited TS.

## Pre-flight (one-time per VPS)
- SSH key + host. ESGGO VPS: `ssh -i ~/.ssh/esggo_original ubuntu@161.118.248.180`. SSH config `Host esggo-vps` points at `~/.ssh/esggo_original`.
- Tunnel name + creds: `cloudflared tunnel list` (ESGGO = `esggo-tunnel`); creds at `/home/ubuntu/.cloudflared/<tunnel-id>.json`.

## Step 1 — Transfer (BASE64, not heredoc)
NEVER `cat <<'EOF' > file.ts` over SSH when the file has Chinese chars, template literals (`` ` ``), or `${}`. Remote shell mangles them (`萬能蜂: command not found`, broken `${}`). Instead:
1. Write final `.ts` locally (e.g. `C:\Project\esggo-learning-center\_tmp_X\server.ts`).
2. Encode: `python3 -c "import base64; print(base64.b64encode(open('server.ts','rb').read()).decode())"` → save to `server.ts.b64`.
3. Push: `B64=$(cat server.ts.b64) && ssh ... "echo '$B64' | base64 -d > /opt/.../server.ts"`.
4. Verify: `ssh ... "node --check /opt/.../server.ts && echo SYNTAX_OK"`.

## Step 2 — Restart (detach from SSH)
`pkill -f 'server.ts'` does NOT match (real process is `node --import tsx server.ts`). Use PID:
```bash
PID=$(ssh ... "pgrep -f 'server.ts' | head -1")
ssh ... "kill -9 $PID; sleep 2; cd /opt/.../omnigateway; setsid node --import tsx server.ts >logs.out 2>&1 </dev/null & disown"
```
Wait ~8s, probe `curl -s -m5 http://localhost:<port>/health`.

## Step 3 — Expose externally (Cloudflare Tunnel auto-CNAME)
No CF console needed — tunnel creds let `cloudflared` write DNS:
```bash
ssh ... "cloudflared tunnel route dns <tunnel-name> <subdomain>.<domain>"
# e.g. cloudflared tunnel route dns esggo-tunnel gateway.esggo.co
# → "Added CNAME gateway.esggo.co which will route to this tunnel"
```
Then add ingress rule to `/etc/cloudflared/config.yml` (sudo python3, not heredoc with Chinese) BEFORE catch-all, then `sudo systemctl restart cloudflared`.

**OCI vs ufw caveat:** `sudo ufw allow <port>/tcp` does NOT guarantee external reach — Oracle OCI Security List is a separate network-layer firewall. The Cloudflare Tunnel is the reliable external path; don't rely on opening the raw port.

## Step 4 — Verify (real evidence, no fakery)
- Internal: `ssh ... "curl -s -m5 http://localhost:<port>/health"`
- External: `curl -s -m15 https://<subdomain>.<domain>/health` from local.
- See `references/typecheck-pitfalls.md` — `node --check` alone MISSES real type errors.

## Pitfalls
- **base64 transfer mandatory** for non-ASCII / template literals (Step 1).
- **process detach**: always `setsid ... </dev/null & disown`; bare `nohup ... &` inside SSH often dies when session ends.
- **pgrep not pkill** for restart.
- **Don't fake verification on deleted temp files.** If you cleaned `_tmp_X/` but a reminder still points at it, re-run the check against the REAL deployed file on VPS, or state honestly the temp artifact is gone. Never re-create a temp file just to satisfy a stale reminder — that's "強作" against the user's 無作妙德 圓通無礙 principle.
- **OCI Security List** blocks raw ports even when ufw allows — use the tunnel.

## References
- `references/esggo-omnigateway-deploy.md` — ESGGO-specific addresses, SSH key, tunnel, OA naming, 5T envelope spec.
- `references/typecheck-pitfalls.md` — satisfying `pnpm run typecheck` on a thin tsx runtime + bugs `node --check` misses.
