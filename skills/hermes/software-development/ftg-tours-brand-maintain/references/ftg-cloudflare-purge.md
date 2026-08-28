# FTG Cloudflare Cache Purge — working recipe (verified 2026-08-28)

`ftgtours.esggo.co` is orange-clouded behind Cloudflare (zone `esggo.co`,
id `8dda3653e490290412f7be84a84e0dc9`). GitHub Pages serves correct content on
`gh-pages`, but Cloudflare caches it — including stale 404s. After any deploy,
purge before declaring live.

## Symptom that means "Cloudflare is serving stale cache"
```
$ curl -sI https://ftgtours.esggo.co/images/esg-impact-note/hero.png
HTTP/2 404
server: cloudflare
cf-cache-status: HIT        <-- proof it's the cache, not GitHub
```
Even `?v=2` cache-busting stays `HIT` (this zone caches query strings).

## Token scope trap
A token created as "編輯區域 DNS / Edit zone DNS" has ONLY `Zone:DNS:Edit`.
It cannot purge and cannot mint another token:
```
POST /client/v4/zones/8dda3653e490290412f7be84a84e0dc9/purge_cache
  -H "Authorization: Bearer <DNS-only token>"
  --data '{"purge_everything":true}'
=> {"success":false,"errors":[{"code":10000,"message":"Authentication error"}]}
```
`/user/tokens/verify` returns `active` for it (valid token — just wrong scope).
You cannot self-serve a purge with it. Get a `Zone → Cache Purge → Edit` token
from the user, or have the user purge in the dashboard.

## Purge (agent side, once a Cache-Purge token exists)
```bash
TOKEN="cfut_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"   # user-provided, Cache Purge scope
ZONE="8dda3653e490290412f7be84a84e0dc9"
curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE/purge_cache" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'
# expect: {"success":true,"errors":[],"messages":[],"result":{"id":"...","status":"success"}}
```

## Verify live (real curl, the only proof)
```bash
B="https://ftgtours.esggo.co"
# pages
for p in "" esg-impact-note wellbeing-retreat family-day executive-retreat esg-team-day corporate-travel; do
  printf "/%s -> %s\n" "$p" "$(curl -s -o /dev/null -w '%{http_code}' "$B/$p")"
done
# images (65 total across 6 dirs)
for img in /images/esg-impact-note/hero.png /images/wellbeing-retreat/bring-3-nature.png \
           /images/family-day/exp-6-nature-obs.png /images/executive-retreat/consensus-3-leadership.png \
           /images/esg-team-day/team-3-local-env.png /images/corporate-travel/value-4-esg-note.png; do
  printf "%s -> %s\n" "$img" "$(curl -s -o /dev/null -w '%{http_code}' "$B$img")"
done
# canonical must be the new domain
curl -s "$B/" | grep -oE 'canonical" href="[^"]*"'
# first hit after purge should be MISS, not HIT
curl -sI "$B/images/esg-impact-note/hero.png" | grep -i cf-cache-status
```
Success = all pages 200, sampled images 200, canonical = `https://ftgtours.esggo.co/`,
and `cf-cache-status: MISS` (or `REVALIDATED`) on first post-purge hit.

## Security note
Tokens pasted in chat are exposed. After use: recommend the user deletes/rolls
the token in Cloudflare dashboard. Stash temp copies in `secret-vault/` with a
`ROTATE AFTER USE` header; do not treat them as safe in context.
