# Oracle VPS / OCI Deployment Notes

Context: deploying an Oracle proxy sidecar to an OCI Ubuntu 24.04 instance.

## What this is
- Not a detailed OCI how-to; just the durable facts from this project's VPS bootstrap attempts.

## SSH access
- User: `ubuntu`
- Port: 22
- Key file: `scripts/oracle_vps_ssh_key.pem`
- Windows warning: OpenSSH on Windows may reject the key format if it uses the new OpenSSH format but the server expects PEM. Conversion: `ssh-keygen -p -m PEM -f key.pem -N ""`.
- If auth still fails with `Permission denied (publickey)`, the instance likely has a different `authorized_keys` entry than the key provided. Confirm the exact public key in OCI Console before assuming the key is wrong.

- Do NOT confuse OCI User API Keys from **Identity → API Keys** with VM SSH keypairs. API keys authenticate the OCI control plane; they are not installed in `~/.ssh/authorized_keys` on the VM. Trying to SSH with an API key private key will always fail with `Permission denied (publickey)`.
- When keypair mismatch persists, use **OCI Console → Compute → Instance → Console Connection**. Its browser-based serial console bypasses SSH auth and is the fastest recovery path when the launch-time keypair is lost.

## Registry / quick checks
```bash
ssh -i scripts/oracle_vps_ssh_key.pem ubuntu@<PUBLIC_IP> "uname -a && whoami && pwd"
```

## Proxy deploy target layout (template)
```
/opt/esggo-oracle-proxy/
  deploy_oracle_proxy.py   # FastAPI entrypoint from repo `scripts/`
  .env                     # FRONTEND_ORIGIN, Oracle connect string, CORS
```

## Env vars to set on VPS (do NOT commit these)
- `FRONTEND_ORIGIN` = `https://esggo-learning-center.web.app`
- `PORT` = `8080`
- Oracle DB creds / wallet path go here or into a secrets manager; never in repo or frontend `VITE_` envs.

## Systemd unit shape
```
[Unit]
Description=esggo-oracle-proxy
After=network.target

[Service]
Type=simple
WorkingDirectory=/opt/esggo-oracle-proxy
EnvironmentFile=/opt/esggo-oracle-proxy/.env
ExecStart=/usr/bin/python3 deploy_oracle_proxy.py
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

## Frontend wiring
- `VITE_USE_ORACLE=true` only when proxy is reachable.
- `VITE_ORACLE_API_BASE=https://<proxy-host>:8080`
- Frontend retries/fallback must stay intact: if proxy is unreachable, the app continues with the default Firestore flow.

## Sensitive-data rule
Do not paste SSH private keys, OCI API keys, or DB passwords in plaintext into the chat. Use existing secrets manager / local files / one-time SSH agents when possible.
