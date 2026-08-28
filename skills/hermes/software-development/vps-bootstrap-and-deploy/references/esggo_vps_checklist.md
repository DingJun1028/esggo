# ESGGO VPS 重建/部署驗證 - 2026-07-22

## Host facts
- VPS name: `esggo-vps`
- VPS IP: `161.118.252.147`
- User: `ubuntu`
- OS: Ubuntu 24.04 aarch64
- Shape: `VM.Standard.A1.Flex` (1 OCPU / 6GB RAM)
- Region: `ap-singapore-1`
- AD: `AD-1`
- VCN: `vcn-Ubuntu 24.04`
- Instance OCID: `ocid1.instance.oc1.ap-singapore-1.anzwsljrkl3rykyc4fggmvq6kezm65dkzzj5nboi3ihax2qxtxyjnxvrpxza`

## Local SSH key
- Key file: `C:\Users\dingj\.ssh\id_rsa_esggo_real`
- Fingerprint: `SHA256:YGMYtfuYxdV6hJ8yXySOLbQn3ziqnMIHS5+HZlzwyys`
- Usage: `ssh -i C:\Users\dingj\Ssh\id_rsa_esggo_real ubuntu@161.118.252.147`

## Must-pass checks
- [ ] SSH: `ssh -o BatchMode=yes -i ~/.ssh/id_rsa_esggo_real ubuntu@161.118.252.147 'echo OK'`
- [ ] `/api/health` public: `curl -sS http://161.118.252.147/api/health`
- [ ] App root public: `curl -sS http://161.118.252.147/ | head -c 50`
- [ ] nginx running: `ssh ... 'sudo systemctl status nginx --no-pager'`
- [ ] App running: `ssh ... 'pgrep -af next-server || pgrep -af "pnpm start"'`
- [ ] Ports listening: `ssh ... 'sudo ss -tlnp | grep -E ':80|:3000'`

## Host firewall triage
- If local `127.0.0.1:80` works but public IP times out:
  - `ssh ... 'sudo iptables -L INPUT -n --line-numbers'`
  - `ssh ... 'sudo ss -tlnp | grep -E ':80|:443|:3000'`
  - Likely fix: OCI VCN Security List missing ingress `0.0.0.0/0 TCP 80/443`,
    or host-side ALLOW rules before a default REJECT chain.

## Quick checks
- [ ] UFW/iptables allows 22/80/443
- [ ] Disk free: `df -h /` should show >10GB free
- [ ] Memory + swap: `free -h` should show swap >= 4GB on A1.Flex
- [ ] Docker group: `sg docker -c 'docker ps'` should not error
- [ ] Node version: `ssh ... 'node --version'` should satisfy `engines.node` in `/opt/esggo/package.json`

## Known degraded states (expected without env)
- `redis: fallback (memory)` — no Redis container or URL yet
- `agnes_api: missing_keys` — `AGNES_API` / `GEMINI_API_KEY` unset
- `firebase_admin: missing_config` — Firebase env unset
- `esgsonar_gateway: unavailable` — gateway not deployed
