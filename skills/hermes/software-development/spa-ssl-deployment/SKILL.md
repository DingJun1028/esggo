---
name: spa-ssl-deployment
description: >
  Deploy Vite/SPA sites to a cloud VPS behind nginx, manage DNS via Cloudflare API,
  and enable HTTPS via certbot. Use when the user asks to deploy a frontend site to
  a VPS, configure domains/subdomains, obtain SSL certificates, expose multiple
  apps under the same IP with nginx virtual hosts or path-based routing, or
  automate DNS records through Cloudflare API.
---

# SPA SSL Deployment

## Scope

This skill covers end-to-end delivery of a Vite/SPA frontend onto a cloud VPS:

- local build + lightweight upload to VPS via `scp` (no rsync dependency)
- nginx single-IP virtual hosting for multiple apps
- Cloudflare API token flow for DNS creation and correction
- certbot HTTPS issuance with nginx plugin

It does **not** cover app-native SSR or non-static backends beyond reverse
proxying a running Node server.

## Required evidence before starting

Before changing DNS or issuing certificates, confirm:

1. VPS public IP (`curl ifconfig.me` from the VPS)
2. nginx root(s) currently in use on that IP
3. the SPA's intended hostname and subdomain(s)
4. Cloudflare API token scope: Zone DNS Edit + Zone Read for the target zone

## Preferred order of operations

1. `pnpm run build` locally; inspect `dist/`
2. upload with `scp -r dist/* user@host:/var/www/<site>` (works on Windows git-bash)
3. write/reload nginx config for the site:
   - `root /var/www/<site>` for SPA static
   - `try_files $uri $uri/ /index.html;` for SPA routing
   - dedicated `location /api/ { proxy_pass ... }` if API needs proxy
4. if domain via Cloudflare:
   - verify token with `/user/tokens/verify`
   - get zone ID from `/zones?name=<domain>`
   - `PUT` existing A/CNAME records; `POST` missing ones
   - `proxied=true` for Cloudflare proxy; HTTP-only records for apex DMARC/SPF
5. run `sudo certbot --nginx` for the exact hostnames — **only after** external DNS
   resolution matches the target IP. If Let's Encrypt cannot validate the domain,
   wait for propagation instead of retrying blindly.
6. verify with `curl -I https://<host>` and confirm `200`/`301` on real route

## Deploy-script hygiene

A deploy script must **not** overwrite the site's nginx config unless its explicit
job is nginx management. Overwriting can destroy certbot-managed `listen 443`
blocks or create conflicting `listen 80 default_server` sites, causing redirect
loops or 404s.

- keep nginx authorship separate from artifact upload
- if a deploy script must touch nginx, guard with `nginx -t` and preserve
  certbot-added SSL stanzas

## Redirect-loop triage

When `https://<host>` returns a self-referential `301 → https://<host>/`, the
loop may be at the Cloudflare edge rather than in VPS nginx or the app.

Diagnosis order:
1. `curl -I --max-redirs 1 https://<host>` — if `Server: cloudflare` returns
   `301 → https://<host>/`, suspect Cloudflare Page Rule / Always Use HTTPS
   interaction.
2. `curl -sS -I -H "Host: <host>" http://127.0.0.1:3000/` — if this returns
   `200`, the app itself is fine; skip app debugging.
3. then inspect nginx via loopback only as a last confirmatory step

Fixes:
- If Cloudflare Page Rules exist, remove or consolidate conflicting rules
- If Cloudflare `Always Use HTTPS` is on, ensure no additional host-level
  rewrite also forces `/` appending
- On nginx: keep exactly **one** `listen 80 default_server`, avoid duplicate
  SSL server blocks, and preserve certbot-managed redirect stanzas

## nginx rules for multi-app on one VPS

- keep exactly **one** `listen 80 default_server` across all sites
- prefer path-based routing (`/ftg/`) when API + SPA share root domain
- prefer domain-based route (`ftg.esggo.co`) when SEO / SSL isolation matters
- always maintain `location /.well-known/acme-challenge/ { root /var/www/certbot; }`
  before `listen 443` so certbot renewals keep working
- remove stale symlinks in `/etc/nginx/sites-enabled/` before `systemctl reload nginx`

## Vite deploy pitfalls

- Windows git-bash quoting breaks heredocs with `$`-variables; drive `bash`/`scp`
  via explicit env vars, heredoc only on SSH host
- do **not** use `html` / `body` / `div` wrappers for late-added shared components
  like a ContactSection; place them at section root level inside existing JSX
- children do not invalidate later flow, but structural JSX must remain valid XML
- rebase/force-fetch can wipe working tree; restore then re-target only intended
  files instead of relying on reflog every time

## Cloudflare API quick reference

```bash
# Verify token
curl -sS https://api.cloudflare.com/client/v4/user/tokens/verify \
  -H "Authorization: Bearer $CF_TOKEN"

# Zone lookup
curl -sS "https://api.cloudflare.com/client/v4/zones?name=esggo.co" \
  -H "Authorization: Bearer $CF_TOKEN"

# List DNS
curl -sS "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
  -H "Authorization: Bearer $CF_TOKEN" \
  -H "Content-Type: application/json"

# Ensure A/CNAME records
curl -sS -X PUT "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records/$RECORD_ID" \
  -H "Authorization: Bearer $CF_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"type":"A","name":"esggo.co","content":"<IP>","ttl":1,"proxied":true}'
```

Note: Cloudflare account tokens call `/user/tokens/verify`; zone-scoped tokens
should also work there. If `9109` / IP restricton appears, execute from the VPS,
not the local workstation.

## Verification checklist

- `pnpm run build` exits 0
- `pnpm run lint` exits 0
- `curl -I https://<host>` returns 200 or appropriate 301
- SPA route deep link returns `index.html` content, not 404
- `sudo certbot certificates` shows expected SANs
- external `dig +short A <host>` matches target IP after propagation

## GoDaddy handling

If the domain registrar is GoDaddy but already using Cloudflare nameservers
(`becky.ns.cloudflare.com`, `tom.ns.cloudflare.com`), no GoDaddy DNS changes
are required. Only proceed with GoDaddy CLI if the domain is still on their
nameservers and Cloudflare-only nameserver changes are not enough.

## References

See `references/cloudflare-dns-certbot.md` for the exact API error codes,
nginx site shapes used in this class, and VPS verification snippets.
