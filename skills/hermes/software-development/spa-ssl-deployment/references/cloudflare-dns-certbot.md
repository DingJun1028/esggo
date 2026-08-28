# Cloudflare + certbot + nginx reference

Proven commands from the `esggo.co` + `ftg.esggo.co` production deployment.

## cloudflared install on Ubuntu

```bash
curl -fsSL https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64.deb -o /tmp/cf.deb
sudo dpkg -i /tmp/cf.deb
```

## Cloudflare API response shapes

- success: `{"success":true,"result":{...}}`
- 9109 IP restriction: `{"success":false,"errors":[{"code":9109,"message":"Cannot use the access token from location: ..."}]}`
- mitigation: run API calls from inside the VPS.

## token verify

```bash
curl -sS https://api.cloudflare.com/client/v4/user/tokens/verify \
  -H "Authorization: Bearer $CF_TOKEN"
```

Returns `"status":"active"` on success.

## zone lookup

```bash
curl -sS "https://api.cloudflare.com/client/v4/zones?name=esggo.co" \
  -H "Authorization: Bearer $CF_TOKEN"
```

Extract `result[0].id` for `ZONE_ID`.

## ensure dns records (Python)

```python
import requests
BASE=f"https://api.cloudflare.com/client/v4/zones/{ZONE_ID}/dns_records"
H={"Authorization":f"Bearer {TOKEN}","Content-Type":"application/json"}

def ensure(name, rtype, content, ttl=1, proxied=True):
    q=requests.get(BASE, headers=H, params={"name":name,"type":rtype}).json()["result"]
    payload={"type":rtype,"name":name,"content":content,"ttl":ttl,"proxied":proxied}
    if not q:
        return requests.post(BASE, headers=H, json=payload).json()
    return requests.put(f"{BASE}/{q[0]['id']}", headers=H, json=payload).json()
```

## certbot

```bash
sudo certbot --nginx \
  -d esggo.co -d www.esggo.co -d ftg.esggo.co \
  --non-interactive --agree-tos -m admin@esggo.co
```

Success output contains `Congratulations! You have successfully enabled HTTPS on ...`

Puts nginx `listen 443 ssl` blocks and `.well-known/acme-challenge` roots into the active site.

## nginx multi-app conflict cleanup

When certbot or old deploys leave stale listeners:

```bash
sudo rm -f /etc/nginx/sites-enabled/ftg-tours
sudo rm -f /etc/nginx/sites-enabled/app
sudo rm -f /etc/nginx/sites-enabled/default
sudo rm -f /etc/nginx/sites-enabled/gateway
sudo ln -sf /etc/nginx/sites-available/ftg-esggo /etc/nginx/sites-enabled/ftg-esggo
sudo nginx -t && sudo systemctl reload nginx
```

Only one config should hold `listen 80 default_server`.

## SPA deploy via scp fallback

If `rsync` is unavailable, use:

```bash
scp -r -o StrictHostKeyChecking=accept-new -i "$SSH_KEY" "$DIST_DIR"/* "$VPS_USER@$VPS_HOST:$TARGET_DIR/"
```

Then reload nginx.

## ContactSection component placement

Late-added shared full-width components like `ContactSection` should replace
the original closing section element directly, not be wrapped in a leftover
`<div class="card-elevated">` that breaks JSX balance.

## Known pitfalls

- On Windows, complex heredocs with `$` break through git-bash; prefer Python
  over SSH for quoted Cloudflare bodies.
- `nslookup` output shape varies; validate with `dig +short` or CF API, not string
  parsing against local resolver.
- `pnpm run build` may succeed while remote nginx still serves old content;
  re-run deploy after certbot modifies nginx config.
