---
name: cloudflare-tunnel-vps
description: >
  Use when wiring a Cloudflare Tunnel from a VPS origin behind an existing
  Cloudflare zone. Covers tunnel login, credential placement, config path
  quirks under sudo, ingress routing, systemd service install, and the common
  metrics-port failure mode on Ubuntu hosts.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [cloudflare, tunnel, vps, systemd, dns]
    related_skills: [cloudflare-godaddy-dns, cloudflare-ssl-loop]
---

# Cloudflare Tunnel on a VPS Origin

## Overview

Cloudflare Tunnel replaces public IP routing for a VPS origin by running a
lightweight connector that outbound-connects to Cloudflare edge. The origin
never needs port 80/443 open; Cloudflare becomes the ingress point for the
domain names that already proxy to the zone.

This skill focuses on the *VPS-side* setup only: cert, tunnel record, config
file, systemd unit, and ingress rules.

## When to Use

- You have a VPS running services on localhost ports and a Cloudflare-hosted
  domain with proxy enabled.
- You want to remove or stop relying on public A records while keeping the
  existing DNS names.
- `cloudflared tunnel login` succeeded but `tunnel run` cannot find the cert
  or credentials.

## Conventions

- All secrets stay on the VPS:
  - cert + credentials JSON in a protected user home
  - tunnel token issued by `tunnel login` stored in GitHub Secrets for
    future vault/automation use
- Config paths are **absolute** when the service runs under systemd.
- **No** public A record is strictly required when `route dns` succeeds,
  but existing records conflict must be removed first.

## Tunnel Intake

1. Place the origin cert in the intended runtime user's home:
   - `cloudflared tunnel login` writes `/root/.cloudflared/cert.pem` when run via `sudo`
   - Copy it to the real user home:
     ```bash
     mkdir -p ~/.cloudflared
     sudo cp /root/.cloudflared/cert.pem ~/.cloudflared/cert.pem
     sudo chown $(whoami):$(whoami) ~/.cloudflared/cert.pem
     ```

2. Create the tunnel under the same runtime user, not root:
   ```bash
   cloudflared tunnel create esggo-tunnel
   ```
   This produces:
   - `/home/<user>/.cloudflared/<tunnel-id>.json`

3. Write `/etc/cloudflared/config.yml` with **absolute paths**:
   ```yaml
   tunnel: <tunnel-id>
   credentials-file: /home/<user>/.cloudflared/<tunnel-id>.json
   origincert: /home/<user>/.cloudflared/cert.pem
   metrics: 127.0.0.1:9090

   ingress:
     - hostname: <domain>
       service: http://127.0.0.1:<port>
     - service: http_status:404
   ```

4. Install as systemd-managed daemon:
   ```bash
   sudo cloudflared service install
   sudo systemctl enable --now cloudflared
   ```

## Known Failures and Fixes

### tunnel run cannot locate origin cert

Cloudflared searches these paths in order:
- `~/.cloudflared/`
- `~/.cloudflare-warp/`
- `/usr/local/etc/cloudflared/`
- `/etc/cloudflared/`

Fix: copy `cert.pem` into the runtime user's home and set `origincert:` in config.

### tunnel run cannot locate credentials.json

`tunnel create` writes the JSON to whichever user ran the command; this can
differ from the systemd daemon user. Ensure the path in `credentials-file:`
exists and is readable by the process.

### systemd unit fails with metrics port bind error

Error: `Error opening metrics server listener error="failed to bind to address (127.0.0.1:9090)"`

Fix: remove or move the `metrics:` line in `config.yml`, or stop the
conflicting process. Do not rely on `Type=notify` alone to mask this.

### tunnel route dns rejects duplicate record

Error: `An A, AAAA, or CNAME record with that host already exists`

Fix: delete the existing record via Cloudflare Dashboard or API before
re-running `cloudflared tunnel route dns`.

### route dns auto-creates the DNS record (no console needed)

`cloudflared tunnel route dns <tunnel-name> <subdomain>.<zone>` uses the
tunnel's own credentials to call the Cloudflare API and create the CNAME
record automatically — **no manual Cloudflare Dashboard visit required**.
This is the path of least resistance when the user says "set up DNS" for an
already-running tunnel. After it returns, verify with `nslookup` + a real
`curl https://<subdomain>.<zone>/<health>` (the CNAME resolves to a
Cloudflare edge IP like 104.21.x.x within seconds; if curl returns empty,
the zone NS/CNAME in the Cloudflare console is the missing piece, NOT the
tunnel).

Example that closed the OmniGateway ESGGO loop (2026-08):
```bash
cloudflared tunnel route dns esggo-tunnel gateway.esggo.co
# → CNAME created; then:
nslookup gateway.esggo.co   # → 104.21.12.97 (Cloudflare edge)
curl -s https://gateway.esggo.co/health   # → {"status":"ok","service":"OmniGateway",...}
```

## Verification

- `cloudflared tunnel info <name>` shows nonzero connections.
- `curl -I https://<host>` returns `200`, not `301 loop`.
- `ss -tlnp | grep cloudflared` shows the QUIC listeners.
- `journalctl -u cloudflared --no-pager | tail -30` is clean after `systemctl start`.

## Secrets Hygiene

- The tunnel credential JSON is a bearer token equivalent: treat it as a
  secret and never commit it.
- After successful `tunnel login`, the browser token page cannot be shown again;
  if the cert is lost, rerun `tunnel login`.
