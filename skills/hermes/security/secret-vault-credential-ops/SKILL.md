---
name: secret-vault-credential-ops
description: Use when writing/validating the Hermes secret-vault .env.
---

# Secret Vault Credential Ops (this user)

## When to use
- User asks to store/update `.env` or credential files ("存入秘密聖櫃", "secret vault", "ENV20230818").
- User pastes a `.env` block and wants it used ("完整運用").
- You need to verify a credential (GitHub token, SSH key, API key) actually works.

## Canonical vault
- Path: `C:\Users\dingj\secret-vault\ENV20230818.env`
  (WSL/Docker mount: `/c/Users/dingj/secret-vault/ENV20230818.env`).
- ALWAYS `chmod 600` after every write.
- NEVER echo secret values back. Validate structurally (parse `KEY=VALUE`) and live (API calls) without printing the secret.

## CRITICAL boundary rule — Docker terminal backend
- The Hermes terminal backend is `docker`. It mounts `/c/Users/dingj` (secret-vault + OneDrive reachable) but **NOT** `/c/Users/dingj/.ssh`.
- Therefore from the terminal tool you CANNOT run `ssh-keygen -lf` on Windows SSH keys, nor `ssh` to hosts using those keys. Any recursive `find /c/Users/dingj -name id_rsa*` will hang/time out scanning the large mount.
- **Route all SSH-key fingerprint verification and SSH connections to the Windows host**: ask the user to run `ssh-keygen -lf <path>` and paste the `SHA256:...` line, OR drive a host terminal via computer_use. Never claim a key "matched" a host without that verification.
- computer_use synthetic keypresses (Win+R / Win+X) were unreliable for surfacing a usable terminal in testing (effect "unverifiable", foreground refused on desktop-icon click). If the host check is needed, prefer asking the user to paste command output rather than fighting the desktop.

## Malformed-paste handling (pitfall)
- Pasted `.env` blocks sometimes include corrupted trailing lines:
  - stray triple-backticks leaked into a value: `HASS_URL=``` `
  - instruction text glued onto a value: `HASS_TOKEN=*** Windows **PowerShell** WSL " 存入...`
- Do NOT write those lines. Write everything well-formed verbatim, exclude the broken lines, and flag the exclusion explicitly to the user.
- After writing, run a guard:
  - `grep -c '`' file` → want 0 (no stray backticks)
  - `grep -vE '^\s*#|^\s*$|^[A-Za-z_][A-Za-z0-9_]*=' file | wc -l` → want 0 (all lines parse as KEY=VALUE)
  - `grep -c '^TERMINAL_SSH_HOST=' file` → warn if >1 (duplicate = last-wins, often a sign of a bad copy)
  - `grep -c '^TERMINAL_SSH_USER=User=' file` → want 0 (typo: extra "User=" prefix)

## Live validation recipes (no secret echo)
- GitHub token:
  `curl -s -o /tmp/gh.json -w "%{http_code}" -H "Authorization: Bearer $TOKEN" https://api.github.com/user`
  → expect `200`; parse login with `grep -o '"login"[ ]*:[ ]*"[^"]*"' /tmp/gh.json`.
- Generic API key: call the provider's lightweight auth endpoint, assert HTTP 200, never print the key.
- SSH key: HOST-SIDE ONLY — `ssh-keygen -lf <keyfile>` → compare the `SHA256:...` fingerprint to the expected/claimed one before any "matched" claim. Also confirm the pubkey's fingerprint matches what the target host's `known_hosts`/trust list expects.

## User discipline to honor (verbatim habit)
> 加入主機信任清單前先用 ssh-keygen -lf 驗證 fingerprint，確認無誤才回 done；未核對不假稱匹配。

If verification is impossible from the sandbox, report BLOCKED honestly with the reason. Do not fabricate a success or a match. This aligns with the user's standing rule: reject fabricated output, want real tool evidence.

## Verification checklist
- [ ] Written to canonical vault path (`C:\Users\dingj\secret-vault\...`)
- [ ] `chmod 600` applied (verify with `stat -c '%a'`)
- [ ] Malformed lines excluded + flagged to user
- [ ] All lines parse as `KEY=VALUE` (grep guard passes)
- [ ] Live creds validated without echo — OR explicitly BLOCKED with reason
- [ ] SSH keys NOT claimed verified unless host-side `ssh-keygen -lf` fingerprint check done

## Support files
- `references/verification-recipes.md` — expanded recipes + the Docker/.ssh boundary note.
- `scripts/validate_vault.sh` — structural validator (chmod, backticks, KEY=VALUE parse, duplicate SSH_HOST, User= typo).
