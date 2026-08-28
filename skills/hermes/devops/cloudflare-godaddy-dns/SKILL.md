---
name: cloudflare-godaddy-dns
description: "Cloudflare DNS + GoDaddy domain management: API/CLI provisioning, A records, CNAME, SSL prerequisites via certbot/cloudflared, and failed-CLI fallback patterns."
version: 1.0.0
author: Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [DNS, Domains, Cloudflare, GoDaddy, DevOps, SSL]
---

# Cloudflare + GoDaddy DNS / Domain Automation

Manage `esggo.co` and subdomains across Cloudflare and/or GoDaddy. Covers when the named CLIs/tools are absent, when to use direct REST API, and how to hand off to certbot once DNS resolves.

## Quick triage: where is the domain registered?

1. Run `whois esggo.co | grep -i "Registrar\|Name Server"` to identify registrar and nameservers.
2. If nameservers point to Cloudflare, use Cloudflare API/CLI.
3. If nameservers point to GoDaddy, use GoDaddy REST API directly.
4. If nameservers are still at the registrar but API access is unavailable, fall back to guiding the user through the registrar console UI.

## Required credentials (ask user / secret manager once)

- Cloudflare: `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` (token must include `DNS: Edit` and, if tunnels are used, `Tunnel: Edit`)
- GoDaddy: `GODADDY_API_KEY` + `GODADDY_API_SECRET`
- VPS target: known public IP (`161.118.248.180`) and SSH path (`C:\\Project\\ESGGO VPS\\id_rsa_esggo_real`) — **NOTE: the IP `161.118.252.147` cited in older copies of this skill is WRONG; the live VPS is `161.118.248.180`. Always verify with `ssh esggo-vps` before writing DNS records.**

Store via `gh secret set` into `esggo_vps` before server-side automation.

## CRITICAL PITFALL: wrangler OAuth token ≠ Cloudflare DNS API token

`wrangler whoami` may report "logged in with an OAuth Token" — but that OAuth token is scoped to
Cloudflare product APIs (Workers, etc.) and **is rejected by the DNS REST API** with
`code:10000 Authentication error` or `code:9106 Authentication failed`.

You MUST use a dedicated API Token created in Cloudflare dashboard → My Profile → API Tokens with the
**DNS:Edit** permission (and Zone:Read). Set it as `CLOUDFLARE_API_TOKEN`.

Do NOT try to scrape the token out of `~/.wrangler/config/default.toml` and reuse it for `api.cloudflare.com`
DNS calls — it will fail auth. Also do not assume a pasted string like `DK3U3G3M/4` is the token; test it
(`GET /zones?name=esggo.co`) and report `code:10000/9106` honestly rather than retrying.

Zone ID for esggo.co (verified): `8dda3653e490290412f7be84a84e0dc9`. Account ID (wrangler): `d9d7ecd92cbad6d858fba3e529b9cb7b`.

## Cloudflare: preferred path

### Install cloudflared (daemon/tunnel agent)
```bash
# Debian/Ubuntu VPS
curl -fsSL https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb -o /tmp/cf.deb
sudo dpkg -i /tmp/cf.deb
```

### Optional: Cloudflare Wrangler CLI
```bash
npm install -g wrangler
wrangler login
```
Wrangler is convenient for DNS wrangling but **not required**. If absent, do direct `curl` to `https://api.cloudflare.com/client/v4/zones/{zone_id}/dns_records`.

### Cloudflare DNS records for `esggo.co`
```bash
ZONE_ID=$(curl -sS -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  https://api.cloudflare.com/client/v4/zones?name=esggo.co | jq -r '.result[0].id')

# Apex and www
for host in @ www; do
  curl -sS -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
    -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    -H "Content-Type: application/json" \
    --data "{\"type\":\"A\",\"name\":\"${host}\",\"content\":\"161.118.248.180\",\"ttl\":1,\"proxied\":false}" | jq .
done

# ftg subdomain
curl -sS -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"type":"A","name":"ftg","content":"161.118.248.180","ttl":1,"proxied":false}' | jq .

# Per-subdomain live example that actually worked (live.esggo.co, 2026-08-04):
#   ZONE_ID=8dda3653e490290412f7be84a84e0dc9  (esggo.co)
#   Used the account-level `cfat_...` token (carries zone DNS read/write); the
#   `cfut_...` "DNS-Admin" token passed /user/tokens/verify but 10000'd on zone calls.
#   1) POST dns_records {"type":"A","name":"live.esggo.co","content":"161.118.248.180","ttl":1,"proxied":false}
#   2) wait ~5s; nslookup live.esggo.co  ->  161.118.248.180
#   3) VPS: sudo certbot --nginx -d live.esggo.co --non-interactive --agree-tos
#      (per-subdomain cert at /etc/letsencrypt/live/live.esggo.co/, rewrites nginx conf)
#   4) sudo nginx -s reload
# Note: an EXISTING wildcard cert (*.esggo.co) does NOT cover a new subdomain's SAN
# unless that subdomain was in the original cert request — always run certbot per new host.
```

### Cloudflare quick caveats
- `proxied` must be `false` for root A records pointing to non-Cloudflare origins if you still serve directly from the VPS IP.
- TTL `1` = automatic.
- DNS changes propagate through Cloudflare quickly but client caches may need time.

### CRITICAL PITFALL: wrangler OAuth token ≠ Cloudflare DNS API token
`wrangler whoami` may report "logged in with an OAuth Token" — but that token is scoped to
Cloudflare *product* APIs (Workers, etc.) and is **rejected by the DNS REST API** with
`code:10000 Authentication error`. You MUST use a dedicated API Token created in the Cloudflare
dashboard with the **DNS:Edit** permission (and Zone:Read). The `cfat_...` account-level token
carries zone DNS read/write; the `cfut_...` "DNS-Admin" token passed `/user/tokens/verify`
but still 10000'd on zone calls in practice. Test a token with `GET /zones?name=esggo.co`
before trusting it; report `code:10000/9106` honestly rather than retrying blindly.
Verified values: zone `esggo.co` = `8dda3653e490290412f7be84a84e0dc9`; account = `d9d7ecd92cbad6d858fba3e529b9cb7b`.

### Per-subdomain live workflow that worked (live.esggo.co, 2026-08-04)
1. POST `dns_records` `{"type":"A","name":"live.esggo.co","content":"161.118.248.180","ttl":1,"proxied":false}`
2. wait ~5s; `nslookup live.esggo.co` -> `161.118.248.180`
3. VPS: `sudo certbot --nginx -d live.esggo.co --non-interactive --agree-tos`
   (per-subdomain cert at `/etc/letsencrypt/live/live.esggo.co/`, rewrites nginx conf)
4. `sudo nginx -s reload`
NOTE: an EXISTING wildcard cert (*.esggo.co) does NOT cover a new subdomain's SAN unless that
host was in the original cert request — always run certbot per new host.

### nginx SSE reverse proxy MUST disable buffering
For any SSE upstream (`text/event-stream`), default `proxy_buffering on` holds events so the
client never receives them live. Required in `location /`:
```
proxy_buffering off; proxy_cache off; chunked_transfer_encoding on;
proxy_read_timeout 3600s;  # SSE connections are long-lived
```
Verify with `curl -s -N --max-time 6 "http://127.0.0.1:PORT/stream?..."` — you should see
`event: heartbeat`/`event: snapshot` stream out, not a single buffered dump.

### Heredoc + nginx: write the conf locally, then scp it
When a conf contains `$host`, `$remote_addr`, `$proxy_add_x_forwarded_for`, etc., a remote
`sudo bash -c 'cat > ... <<EOF ... EOF'` via ssh expands those `$` vars (to empty) in the LOCAL
shell before they reach the server — producing `proxy_set_header Host ;` (invalid; nginx -t fails
"invalid number of arguments"). Fix: `write_file` the `.conf` locally with literal `$`, then `scp`
it to `/tmp/` and `sudo cp` into `/etc/nginx/sites-enabled/`.

## GoDaddy: direct REST API fallback

GoDaddy has **no official public CLI**. Use REST API with Basic Auth.

```bash
# List domains to confirm ownership
curl -sS -u "$GODADDY_API_KEY:$GODADDY_API_SECRET" \
  "https://api.godaddy.com/v1/domains?statuses=ACTIVE" | jq .

# Get existing records
curl -sS -u "$GODADDY_API_KEY:$GODADDY_API_SECRET" \
  "https://api.godaddy.com/v1/domains/esggo.co/records/A/@"

# Replace @ and www A records
curl -sS -X PUT -u "$GODADDY_API_KEY:$GODADDY_API_SECRET" \
  -H "Content-Type: application/json" \
  "https://api.godaddy.com/v1/domains/esggo.co/records/A/@|www" \
  -d '[{"data":"161.118.248.180","ttl":600,"type":"A","name":"@"},{"data":"161.118.248.180","ttl":600,"type":"A","name":"www"}]'

# Add ftg A record if missing
curl -sS -X PUT -u "$GODADDY_API_KEY:$GODADDY_API_SECRET" \
  -H "Content-Type: application/json" \
  "https://api.godaddy.com/v1/domains/esggo.co/records/A/ftg" \
  -d '[{"data":"161.118.248.180","ttl":600,"type":"A","name":"ftg"}]'
```

### GoDaddy API notes
- Provider-required TTL minimum is commonly `600`.
- `@` is the GoDaddy representation for the apex/root domain.
- Some API endpoints enforce exact-match names; use `www` and `ftg` as-needed per subdomain.

## OmniCLI: explicit gap

`OmniCLI` is referenced as a user preference but is **not a generally available public tool identity** in this environment. Do not fabricate commands. If the user insists on OmniCLI, request the install path or exact binary/package name, or execute the equivalent canonical API path above instead.

## Nginx preparation on VPS

Before DNS/SSL:
- `esggo.co / www.esggo.co` must reverse-proxy `127.0.0.1:3000`
- `ftg.esggo.co` must serve `/var/www/ftg-tours/` with `try_files $uri $uri/ /index.html`
- Include `location /.well-known/acme-challenge/ { root /var/www/certbot; }` in both server blocks for HTTP-01 validation.

Deploy with `ssh` + `sudo tee` from a heredoc, then `sudo nginx -t && sudo systemctl reload nginx`.

### SSE / long-poll reverse-proxy MUST disable buffering

If the upstream is a Server-Sent-Events stream (text/event-stream, e.g. `OmniBlueprintHub` monitor server,
or any `/stream` SSE endpoint), the default `proxy_buffering on` will hold events and the client never
receives them live. Required directives in the `location /` block:

```nginx
proxy_pass http://127.0.0.1:8787;
proxy_http_version 1.1;
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "upgrade";
proxy_buffering off;       # <-- critical for SSE, else events are buffered
proxy_cache off;
chunked_transfer_encoding on;
proxy_read_timeout 3600s;  # <-- SSE connections are long-lived
proxy_send_timeout 3600s;
```

Verify end-to-end with `curl -s -N --max-time 6 "http://127.0.0.1:PORT/stream?..."` — you should see
`event: heartbeat`/`event: snapshot` lines stream out, not a single buffered dump.

### Heredoc + nginx: always write the conf locally, then `scp` it

When the conf contains `$host`, `$remote_addr`, `$proxy_add_x_forwarded_for`, etc., a remote `sudo bash -c
'cat > ... <<EOF ... EOF'` via `ssh` will have those `$` vars expanded (to empty) by the LOCAL shell before
they reach the server — producing `proxy_set_header Host ;` (invalid, nginx -t fails with "invalid number
of arguments"). Fix: `write_file` the `.conf` locally with literal `$`, then `scp` it to
`/tmp/` and `sudo cp` into `/etc/nginx/sites-enabled/`. This avoids all shell-expansion surprises.

## SSL handoff sequence

After DNS propagation:
1. Verify records: `for h in esggo.co www.esggo.co ftg.esggo.co; do nslookup $h; done`
2. SSH into VPS.
3. Run:
```bash
sudo certbot --nginx -d esggo.co -d www.esggo.co -d ftg.esggo.co
```
4. Confirm auto-renew:
```bash
sudo certbot renew --dry-run
```

## Failed-CLI fallback pattern

If a requested CLI/tool is not installed or does not exist:
1. Stop after one install attempt.
2. Switch to direct REST API or `curl` + `jq`.
3. Tell the user exactly what was missing and what you switched to.
4. Do not retry the same install path multiple times in the same turn.
