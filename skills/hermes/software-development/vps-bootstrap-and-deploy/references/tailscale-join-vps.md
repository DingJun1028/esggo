# Tailscale join via auth key — verified pattern (Ubuntu 24.04 aarch64 VPS)

Use when the user wants a VPS added to a Tailscale network for secure cross-node
tunneling (OA-Team 30 / OmniJules infra). Pattern below was exercised end-to-end
and confirmed working (VPS got `100.x` IP, appeared in `tailscale status`).

## Preconditions
- Auth key (`tskey-auth-...`) + API token (`tskey-api-...`) stored in local `.env`
  (gitignored). Read-only API verify uses the token; join uses the auth key.
- SSH access to the VPS with a working private key.

## Steps (copy + adapt)

```bash
# 1. From local .env, export the auth key into the shell (do NOT echo it)
export $(grep -E "^TAILSCALE_AUTH_KEY=" .env | xargs)

# 2. SSH in with the correct key. If default key is rejected with
#    "Permission denied (publickey)", try each local key — do NOT assume backend lock:
for k in id_rsa_esggo id_rsa_esggo_new esggo_vps_fix vps_deploy_key; do
  ssh -o BatchMode=yes -i ~/.ssh/$k root@<VPS_IP> 'echo OK' 2>&1 | head -1
done
# The one that prints OK is your key.

# 3. Install Tailscale on the VPS if absent
ssh -i ~/.ssh/<KEY> root@<VPS_IP> 'command -v tailscale || (curl -fsSL https://tailscale.com/install.sh | sh)'

# 4. Push the auth key onto the VPS (heredoc via env var — key never in args/log)
ssh -i ~/.ssh/<KEY> root@<VPS_IP> "echo 'TAILSCALE_AUTH_KEY=$TAILSCALE_AUTH_KEY' >> /root/.env && echo WROTE"

# 5. Join the network
ssh -i ~/.ssh/<KEY> root@<VPS_IP> \
  'export $(grep -E "^TAILSCALE_AUTH_KEY=" /root/.env | xargs); tailscale up --authkey="$TAILSCALE_AUTH_KEY" --hostname=esggo-vps-omni'

# 6. Verify
ssh -i ~/.ssh/<KEY> root@<VPS_IP> 'tailscale status'
```

Read-only API verification (no SSH needed, confirms token validity):
```bash
export $(grep -E "^TAILSCALE_API_TOKEN=" .env | xargs)
curl -s -o /tmp/ts.json -w "HTTP %{http_code}\n" \
  -H "Authorization: Bearer $TAILSCALE_API_TOKEN" \
  "https://api.tailscale.com/api/v2/tailnet/-/devices"
python3 -c "import json;print('devices:',len(json.load(open('/tmp/ts.json')).get('devices',[])))"
```

## Pitfalls
- `tailscale up` on the VPS WITHOUT the auth key present on the host fails — the key
  must live on the VPS (step 4), not only in your local shell.
- `Permission denied (publickey)` = wrong key, NOT a locked SSH backend. Iterate keys.
- Store auth key in VPS `/root/.env` only because the join step requires it there
  (user-authorized). Recommend rotating at Tailscale console after use.
- Never paste the raw key into chat logs beyond what the user already shared.
