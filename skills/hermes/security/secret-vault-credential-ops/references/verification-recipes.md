# Verification Recipes & Boundary Notes (as-of 2026-08)

## Docker terminal backend ↔ Windows host boundary
- Terminal backend = `docker`. Mounted: `/c/Users/dingj` (includes `secret-vault/`, `OneDrive/`).
- NOT mounted: `/c/Users/dingj/.ssh` → `ls /c/Users/dingj/.ssh` returns "No such file or directory".
- Consequence: `ssh-keygen -lf`, `ssh`, and any key-based auth MUST run on the Windows host.
- Do NOT `find /c/Users/dingj -name id_rsa*` from the sandbox — it scans the huge mount and times out (observed: 60s timeout).

## GitHub token live check
```bash
curl -s -o /tmp/gh.json -w "%{http_code}\n" \
  -H "Authorization: Bearer $GITHUB_TOKEN" https://api.github.com/user
# expect 200
grep -o '"login"[ ]*:[ ]*"[^"]*"' /tmp/gh.json   # prints login only, not the token
```

## Generic API-key liveness (pattern)
- Call the provider's `/v1/models` or `/user` or a lightweight ping endpoint.
- Assert HTTP 200 via `-w "%{http_code}"`; print only the code, never the key or response body that may echo it.

## SSH key fingerprint (HOST-SIDE only)
```powershell
# Windows host (user runs, pastes output back):
ssh-keygen -lf C:\Users\dingj\.ssh\esggo_original
# expected shape: 3072 SHA256:AbCdEf...  user@host  (ED25519)
```
- Compare the `SHA256:` fingerprint to the claimed/expected one.
- Only after match confirmed may the key be added to a host's trust list and a connection attempted.

## Structural vault guard (quick)
```bash
F=/c/Users/dingj/secret-vault/ENV20230818.env
stat -c '%a' "$F"                 # want 600
grep -c '`' "$F"                  # want 0
grep -vE '^\s*#|^\s*$|^[A-Za-z_][A-Za-z0-9_]*=' "$F" | wc -l   # want 0
grep -c '^TERMINAL_SSH_HOST=' "$F"   # warn if >1
grep -c '^TERMINAL_SSH_USER=User=' "$F"   # want 0
```
