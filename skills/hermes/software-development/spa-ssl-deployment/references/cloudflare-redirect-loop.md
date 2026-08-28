# Cloudflare self-referential redirect loop notes

## Symptom
`curl -I https://<host>` returns:
```
HTTP/1.1 301 Moved Permanently
Server: cloudflare
Location: https://<host>/
```
Following redirects yields the same response indefinitely. App on the VPS
returns `200` for `Host: <host>`.

## Likely causes
- Cloudflare Page Rule + Always Use HTTPS creating duplicate `/` appends
- Multiple certbot-managed SSL server blocks conflicting with app proxy block
- Deploy script overwriting nginx config and breaking certbot stanzas

## Quick diagnosis sequence
1. `curl -I --max-redirs 1 https://<host>`; if `Server: cloudflare`, problem is
   at CF edge.
2. `curl -sS -I -H "Host: <host>" http://127.0.0.1:3000/`; if `200`, app is
   fine; skip app changes.
3. Inspect nginx config for duplicate `listen 80 default_server` or broken SSL
   stanzas.

## Fixes applied in session
- Removed stray `ftg-tours` HTTP site that conflicted with HTTPS site
- Preserved single `listen 80 default_server` rule
- Stopped deploy script from overwriting nginx config
- Confirmed Cloudflare token scope: DNS Edit works, Page Rules API returns 403
