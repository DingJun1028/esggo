# Cloudflare purge & origin diagnostic

## Symptom
Live custom domain (e.g. *.esggo.co) shows old content or 404s even after a
green deploy + `purge_cache` returned success.

## Step 1 — Is traffic even reaching GitHub Pages?
```bash
gh api zones/<ZONE>/dns_records?name=<domain>
```
- `content` = `<user>.github.io`  → origin is correct, skip to Step 3.
- `content` = `*.cfargotunnel.com` → it's a **Cloudflare Tunnel**; GitHub Pages
  changes are invisible. Change the record:
  ```bash
  RECID=$(gh api zones/<ZONE>/dns_records?name=<domain>\&type=CNAME \
    -H "X-Auth-Email:$CF_EMAIL" -H "X-Auth-Key:$CF_KEY" \
    | python3 -c "import sys,json;print(json.load(sys.stdin)['result'][0]['id'])")
  curl -X PATCH "https://api.cloudflare.com/client/v4/zones/<ZONE>/dns_records/$RECID" \
    -H "X-Auth-Email:$CF_EMAIL" -H "X-Auth-Key:$CF_KEY" -H "Content-Type: application/json" \
    --data '{"type":"CNAME","name":"<domain>","content":"<user>.github.io","proxied":true}'
  ```

## Step 2 — Token permission check (why purge "succeeds" but nothing changes)
A token scoped to **Edit zone DNS** CANNOT purge cache. It returns
`Authentication error` on `purge_cache`. You need:
- a token with `Zone: Cache Purge: Edit`, OR
- the **Global API Key** (`X-Auth-Email` + `X-Auth-Key`).

## Step 3 — Purge (Global Key)
```bash
curl -s -X POST "https://api.cloudflare.com/client/v4/zones/<ZONE>/purge_cache" \
  -H "X-Auth-Email:$CF_EMAIL" -H "X-Auth-Key:$CF_KEY" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'
```

## Step 4 — Bypass cache while testing
```bash
# on
curl -X PATCH "https://api.cloudflare.com/client/v4/zones/<ZONE>/settings/development_mode" \
  -H "X-Auth-Email:$CF_EMAIL" -H "X-Auth-Key:$CF_KEY" \
  -H "Content-Type: application/json" --data '{"value":"on"}'
# off (always turn off after)
  --data '{"value":"off"}'
```
With Dev Mode ON, `cf-cache-status: DYNAMIC` means the request hit the true
origin — use this to tell "Cloudflare cached old 404" from "origin itself 404s".

## Security note
Global API Keys / DNS tokens pasted in chat are EXPOSED. After use, rotate
them in the Cloudflare dashboard. Never treat a pasted token as reusable.
