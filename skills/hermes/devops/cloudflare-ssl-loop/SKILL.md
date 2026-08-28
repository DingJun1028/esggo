---
name: cloudflare-ssl-loop
description: >
  Use when diagnosing HTTPS redirect loops behind Cloudflare for an origin
  that is already verified healthy. Covers test methodology, role of
  Always Use HTTPS / Automatic HTTPS Rewrites, origin-vs-edge discrimination,
  and VPS follow-ups for Cloudflare-only credentials.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [cloudflare, ssl, loop, vps, cd]
    related_skills: [spa-ssl-deployment, spa-deploy, vps-bootstrap-and-deploy]
---

# Cloudflare HTTPS Redirect Loop

## Overview

When a site behind Cloudflare returns `ERR_TOO_MANY_REDIRECTS` or `301` loops,
the root cause is typically one of three things on the edge:

1. **Always Use HTTPS** enabled when the origin also redirects HTTP → HTTPS.
2. **Automatic HTTPS Rewrites** injecting `https://` into mixed content on some settings.
3. **Misconfigured SSL/TLS mode** or orphan edge state (cached redirect).

This skill makes discrimination fast: determine whether the loop is edge-only or origin-only before guessing config changes.

## When to Use

- `curl -I https://domain` shows `HTTP/1.1 301` → `Location: https://domain/`
  with no cache headers indicating a stale edge response.
- VPS origin responds `200` with the correct `Host:` header when addressed directly.
- Cloudflare Dashboard shows **zero Page Rules** yet the loop persists.

## Do NOT Use For

- DNS resolution failures. Use `cloudflare-godaddy-dns` instead.
- Bad origin TLS certs. Verify with `curl -vk https://origin/` first.
- Page Rule loops (redirect/forward rules visible in Dashboard).

## Loop Discrimination (priority order)

1. Check origin health without Cloudflare.
   ```bash
   curl -sS -o /dev/null -w "%{http_code}\n" -m 8 -H "Host: $HOST" "https://<VPS_IP>/"
   ```
   Status `200` → origin is clean.

2. Check Cloudflare behavior.
   ```bash
   curl -sS -I --max-redirs 2 -m 8 "https://$HOST" | head -20
   ```
   Repeated `301 Location: https://$HOST` → edge cache or Always Use HTTPS.

3. Rule out Page Rules.
   Cloudflare Dashboard → Rules → Page Rules → confirm empty.

4. Examine response headers.
   - `cf-cache-status: DYNAMIC` + `HTTP/1.1 301` → Cloudflare edge rule.
   - `x-redirect-by: WordPress/nginx` → origin-side redirect.

## Cloudflare Fix (dashboard actions)

If origin-is-clean:

1. **SSL/TLS** → **Overview** → ensure mode is **Full (strict)**.
2. **SSL/TLS** → **Edge Certificates** → toggle **Always Use HTTPS**:
   - If the origin also enforces `https` (e.g. Next.js `headers.js`, nginx `return 301 https://`), turn **Always Use HTTPS** OFF.
3. **SSL/TLS** → **Edge Certificates** → toggle **Automatic HTTPS Rewrites** OFF temporarily to rule it out.
4. **Speed** → **Optimization** → purge cache (or wait ~60–90 seconds for edge TTL).
5. Re-test: `curl -I https://<host>` should eventually return `200`.

## Origin Fix (VPS) — only if edge changes do not help

If the loop persists after Cloudflare settings, the origin is likely redirecting unconditionally.

### Next.js on systemd

```bash
sudo systemctl status esggo-app --no-pager | head -10
curl -sS -H "Host: <domain>" "https://127.0.0.1:3000/" | head -c 80
```

- Ensure redirect rules in `app/` are conditional, e.g. `headers.js` must only redirect when `x-forwarded-proto === 'http'`, but with **Full (strict)** Cloudflare mode the origin always sees HTTPS.

### nginx

```bash
sudo nginx -T 2>/dev/null | grep -E "return 301|rewrite .*https|proxy_set_header"
```

Typical conflict:

```nginx
# BAD behind Cloudflare
return 301 https://$host$request_uri;

# OK behind Cloudflare
if ($http_x_forwarded_proto = 'http') {
  return 301 https://$host$request_uri;
}
```

### Docker/compose (when in use)

```bash
docker compose -f <compose> ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"
docker compose -f <compose> logs --tail 50 <gateway|app>
```

Common follow-ups:
- Add `env_file:` for secrets (`.env.gateway`).
- Use `docker compose` v2, not legacy `/usr/bin/docker-compose`.
- If `KeyError: 'ContainerConfig'` appears, rebuild with `--no-cache`
  after cleaning the image state, or restart the daemon.

## Cloudflare API limits (funding-based workflow)

Your token may lack:
- Page Rules API → error 403.
- Zone settings read/write → error 9109 from non-VPS IP.

Fallback:
- Use VPS-egested API calls when blocked by IP restriction.
- Use Dashboard for Page Rules and global edge settings.

## Verification Checklist

- [ ] `curl -I https://<host>` returns `HTTP/1.1 200` (or `200 OK`) within 3 redirects.
- [ ] Subpaths return `200` (e.g. `/api/health`, `/corporate-travel`).
- [ ] `curl -I https://www.<host>` also `200` (or consistent 301 → 200 with `www` canonical).
- [ ] Cloudflare SSL/TLS mode: **Full (strict)**.
- [ ] `Always Use HTTPS` and `Automatic HTTPS Rewrites` are both **ON** only if the origin does not redirect on its own.

## One-Shot Recipes

### Edge-only loop, origin confirmed healthy

1. Dashboard → SSL/TLS → Edge Certificates → **Always Use HTTPS: OFF**.
2. Purge Cache → wait 30–90s.
3. Re-run `curl -I https://domain`; if `200`, flip HTTPS back on and refactor the origin to be conditional instead.

### Origin redirect behind Cloudflare

```bash
# Confirm origin behavior
curl -sS -h "$HOST" "https://<VPS_IP>/api/health" -o /dev/null -w "%{http_code}\n"
# Fix nginx to respect x-forwarded-proto
sudo nginx -t && sudo systemctl reload nginx
```

### Docker-compose v2 on Ubuntu 24.04 when `docker compose` triggers KeyError

```bash
sudo rm -f /var/run/docker.pid
sudo systemctl restart docker.service || true
# Or use legacy if v2 unavailable:
/usr/bin/docker-compose -f <file> ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"
```
