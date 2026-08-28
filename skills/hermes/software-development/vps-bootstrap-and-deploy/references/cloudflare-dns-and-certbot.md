# Cloudflare API + DNS + certbot production notes

## Token selection
- `cfut_...` user tokens often fail with `9109 Cannot use the access token from location: ...`
- Prefer `cfat_...` account tokens.

## Geo-block bypass
- If local API calls are geo-blocked, SSH into the VPS and run Cloudflare API calls from there.
- The VPS egress IP is usually treated differently than the local workstation.

## DNS batch update Python pattern
Use Python `requests` from VPS to avoid bash heredoc header quoting pitfalls.

## External verification before certbot
- After Cloudflare API update, do not run certbot immediately.
- Have the user verify external visibility with `dig +short <host> @8.8.8.8` or `nslookup <host> 8.8.8.8`.
- Only re-run `sudo certbot --nginx -d ...` once external resolvers report the correct IP.
- Blind retries waste Let's Encrypt rate-limit quota.

## Nginx server_name consistency
- Keep exactly one `listen 80 default_server;` block per `:80`.
- All other sites use `listen 80;` plus explicit `server_name` values.
- Multiple `server_name _;` blocks trigger `conflicting server name "_" ... ignored`.
