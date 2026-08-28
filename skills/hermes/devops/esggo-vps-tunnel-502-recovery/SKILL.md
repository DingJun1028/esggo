---
name: esggo-vps-tunnel-502-recovery
description: "Recover esggo VPS Cloudflare 502 tunnel outages."
version: 1.0.0
author: OA-Team Swarm
license: MIT
platforms: [windows, linux, macos]
tags: [esggo, vps, cloudflare, 502, tunnel, recovery, best-practice]
metadata:
  hermes:
    tags: [esggo, vps, cloudflare, 502, tunnel, recovery]
    related_skills: [verify-done-claims, esggo-vps-sync-troubleshooting, esggo-vps-deploy-verify]
---

# esggo VPS 隧道 502 救活經驗技能書

Use when `*.esggo.co` subdomains return Cloudflare **502 Bad Gateway** while the
root `esggo.co` stays 200. This is the consolidated playbook from the 2026-08-22/23
outage (translate.esggo.co went 502, ports on 161.118.248.180 all closed).

## When to Use
- User pastes a Cloudflare 502 page for translate.esggo.co / any *.esggo.co
- Sandbox curl shows subdomain 502 but root 200
- VPS port probe shows 8420/8125/8424/8096 all CLOSED

## Symptom Signature (verified 2026-08-22 23:16 UTC)
```
Bad gateway Error code 502
translate.esggo.co  Host  Error
Cloudflare  Working
Browser/TLS  Working
Ray ID: a2f595a16a3b7db2
```
Root cause = **origin (the VPS service behind cloudflared) is not listening**,
NOT a Cloudflare-side problem. Cloudflare proxy is fine; it cannot reach the tunnel.

## Step 0 — OCI CLI unlock path (agent-driven, NO user SSH key needed)
The 2026-08-25 session proved the sandbox CAN reach the VPS via the **OCI CLI** even
when all 8 local SSH private keys are rejected by VPS `authorized_keys`. This is the
preferred first move when the user grants OCI CLI access — do NOT wait for the user to
run local SSH.

OCI CLI is installed at `C:\Program Files (x86)\Oracle\oci_cli\oci` (v3.90.1). Config at
`~/.oci/config` (region `ap-singapore-1`, tenancy + user ocid present). Auth works from
the sandbox. See `references/oracle-ssh-unlock.md` for the exact command sequence.

**CRITICAL Oracle limit (verified 2026-08-25):** you CANNOT add an SSH key by
`oci compute instance update --metadata file://...`. It returns:
`InvalidParameter: The 'ssh_authorized_keys' metadata field cannot be updated and must
be provided with the already existing value.` This CLI version ALSO has no
`--ssh-authorized-keys` flag. So the only agent-driven unlock is the **Serial Console**:
`oci compute instance-console-connection create --instance-id <id>
--ssh-public-key-file <pub>` — run it with `background=true` (takes >60s to provision).
Once the console connection is up, SSH into the console host with the matching private
key, then append the public key to `~/.ssh/authorized_keys` on the instance.

Target instance: `esggo-vps`
(`ocid1.instance.oc1.ap-singapore-1.anzwsljrkl3rykyc4fggmvq6kezm65dkzzj5nboi3ihax2qxtxyjnxvrpxza`).
List all: `oci compute instance list --compartment-id <tenancy_ocid> --region ap-singapore-1 --lifecycle-state RUNNING`
(note: `--compartment-id` is the TENANCY ocid; `instances[0]` is NOT always esggo-vps —
filter by `--display-name esggo-vps` or match in code).

## Step 0 — SSH key mismatch / fully lost (OCI CLI recovery)
When **every** local private key returns `Permission denied (publickey)` and you cannot
reach the VPS at all, the SSH layer itself is locked out: the VPS `authorized_keys` holds a
pubkey whose private half is no longer on this machine, OR a prior key rotation orphaned it.
Step 2 below is then impossible — recover SSH access FIRST via OCI CLI.

OCI CLI is at `C:\Program Files (x86)\Oracle\oci_cli\oci` (v3.90.1); config at
`~/.oci/config` (region `ap-singapore-1`; the tenancy ocid doubles as `compartment-id`).
Auth verified live this session — `oci compute instance list` works.

### Why `update-instance` will NOT inject a key
Oracle blocks `ssh_authorized_keys` mutation through the normal metadata path:
- `oci compute instance update --metadata file://x.json` →
  `InvalidParameter: The 'ssh_authorized_keys' metadata field cannot be updated and must
  be provided with the already existing value.`
- There is **no** `--ssh-authorized-keys` flag in 3.90.1.
→ You CANNOT push a new key through instance metadata. **Serial Console is the only API path.**

### Serial Console recovery (verified this session)
1. Locate the instance — do NOT use `instances[0]`; `esggo-vps` is 3rd in the list:
   ```
   TEN=$(grep tenancy ~/.oci/config | awk '{print $3}')
   oci compute instance list --compartment-id "$TEN" --region ap-singapore-1 \
     --lifecycle-state RUNNING --display-name esggo-vps --raw-output --query 'data[0].id'
   ```
2. If an ACTIVE console connection exists, delete it first (`--force` bypasses the y/N
   prompt; `echo y |` does NOT reach the TTY prompt):
   ```
   oci compute instance-console-connection delete --instance-console-connection-id "$CC" \
     --region ap-singapore-1 --force
   ```
3. Create a fresh one with the pubkey you want to use:
   ```
   oci compute instance-console-connection create --instance-id "$VPS" --region ap-singapore-1 \
     --ssh-public-key-file "C:/Users/dingj/.ssh/esggo_vps_fix.pub"
   ```
4. **Propagation delay**: the jump host rejects the key for ~2–3 min after create. Wait,
   then read the connection string:
   ```
   oci compute instance-console-connection get --instance-console-connection-id "$CC" \
     --region ap-singapore-1   # read `connection-string`
   ```
5. Connect — needs an **interactive pty** (Docker-sandbox terminal is NON-pty and cannot
   pass the `login:` prompt; run this on the USER's local PowerShell):
   ```
   ssh -i ~/.ssh/esggo_vps_fix -o ProxyCommand='ssh -W %h:%p -p 443 $CC@instance-console.ap-singapore-1.oci.oraclecloud.com' $VPS
   ```
   At `login:` type `dingj` + password, then:
   ```
   echo "PASTE_PUB" >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys
   ```
   Exit, then normal `ssh -i ~/.ssh/esggo_vps_fix dingj@161.118.248.180` works → go to Step 2.

### Pitfalls (verified this session)
- OCI CLI confirmation prompts are TTY-gated: `--confirm` does not exist;
  `OCI_CLI_SUPPRESS_CONFIRM=True` is ignored; `echo y |` often fails to reach the prompt.
  Use `--force` for destructive ops (delete). For create, the prompt is the replace-risk
  warning on `--metadata` — pipe `echo y |` or script it.
- User was on **PowerShell**, not git-bash: bash `for k in ...; do ...; done` fails there.
  Use PowerShell `foreach ($k in $keys) { ... }` for the key-trial loop.
- `grep tenancy ~/.oci/config` returned empty under MSYS (path/BOM); read the tenancy ocid
  directly from the file or pass the absolute ocid string.
- Console-connection `create` can exceed 60s on the Oracle backend — run in background or
  raise the timeout; it emits JSON on success, a jmespath/ServiceError on failure.
- Do NOT reuse a stale console connection: delete + recreate with the correct pubkey,
  otherwise the jump host denies your private key (`Permission denied (publickey)` at the
  `instance-console…@instance-console.ap-singapore-1.oci.oraclecloud.com` hop).
- Legacy `fix_vps_ssh.py` in `~/.oci/` uses `instances[0]` and SOFTSTOP/START to apply
  metadata keys — BROKEN by Oracle's metadata lock. Do not use it; use Serial Console.

## Step 1 — Sandbox pre-diagnosis (agent CAN do this, no SSH/creds needed)
```bash
# root vs subdomain split tells us where the break is
for u in "https://esggo.co/" "https://translate.esggo.co/" "https://translate.esggo.co/health"; do
  code=$(curl -sS -m 15 -o /dev/null -w "%{http_code}" "$u" 2>/dev/null); echo "$code  $u"
done
# probe the shared VPS directly (single VPS hosts ALL *.esggo.co subdomains)
for p in 8420 8125 8424 8096 8788; do
  (timeout 3 bash -c "echo > /dev/tcp/161.118.248.180/$p" 2>/dev/null && echo "OPEN $p") || echo "CLOSED $p"
done
```
### Interpretation matrix
| root | subdomain | ports | meaning |
|------|-----------|-------|---------|
| 200  | 502       | CLOSED| cloudflared/nginx/pm2 down on VPS → tunnel dead |
| 200  | 200       | OPEN  | healthy, nothing to do |
| 502  | 502       | any  | whole VPS/VPS network down (rare) |

## Step 1b — TWO FALSE-POSITIVE TRAPS (verified 2026-08-23 cron probe)

### Trap A: app ports are CLOSED **by design** — never read them as an outage
`8787 / 8788 / 8000 / 8420` probed from outside are **always CLOSED** on this
topology: containers bind `127.0.0.1:PORT` only and nginx (80/443) fronts them.
The matrix row "CLOSED → tunnel dead" therefore **fires on a perfectly healthy VPS**.
Trustworthy signal = HTTP status on 80/443 + the `Server:` header, not port reachability.
Only `80` and `443` are expected OPEN.

### Trap B: split proxied vs DNS-only subdomains BEFORE blaming Cloudflare
Resolve the A record first — the two classes fail differently:
```bash
python -c "
import socket
for h in ['esggo.co','live.esggo.co','translate.esggo.co','oa.esggo.co']:
    try: print(h, sorted({a[4][0] for a in socket.getaddrinfo(h,443,socket.AF_INET)}))
    except Exception as e: print(h,'NO_DNS')"
```
| A record | class | a 502 here means |
|----------|-------|------------------|
| `104.21.x` / `172.67.x` | Cloudflare-proxied | CF can't reach tunnel → check `cloudflared` |
| `161.118.248.180` | **DNS-only (grey cloud)** | request hit VPS nginx directly → nginx is ALIVE, its pm2 upstream is dead → `pm2 restart <app>` is enough, `cloudflared` is NOT involved |

Confirm by the response header: `Server: nginx/1.24.0 (Ubuntu)` with **no** `cf-ray`
= nginx's own 502 (upstream down). A Cloudflare 502 shows `Server: cloudflare` + `cf-ray`.

### Trap C: `nslookup | grep Address | tail -1` mis-parses → fake NXDOMAIN
That pipeline reported NXDOMAIN for `translate.esggo.co` while curl returned 200.
Use the `socket.getaddrinfo` snippet above; never report DNS state from the grep pipeline.

### Trap D: missing TLS cert looks like an outage (curl code 000/60)
`oa.esggo.co` → `curl: (60) schannel: SNI or certificate check failed
(SEC_E_WRONG_PRINCIPAL)` on 443 while **HTTP :80 returns 200**. The service is UP;
only the cert is absent for that `server_name`. Fix = issue/extend the cert
(`sudo certbot --nginx -d oa.esggo.co`), do **not** restart the app.
Always retry a 000 subdomain over plain `http://` before declaring it down.
Subdomains with **no A record at all** (blueprint/learn/ut) are unconfigured, not outages.

## Step 2 — Local remediation (USER runs on Windows, NOT sandbox)
Sandbox has no ssh keys / no `esggo-vps` host alias / no sudo — UNLESS the user grants
OCI CLI access (see Step 0), in which case the agent drives the unlock + fix directly.
Otherwise hand these to the user:

```powershell
# 1) diagnose what's broken
ssh -o StrictHostKeyChecking=accept-new esggo-vps "journalctl -u cloudflared -n 25 --no-pager; sudo nginx -t; sudo systemctl status nginx --no-pager"

# 2) recover: restart tunnel + web + app layer, then probe origin
ssh -o StrictHostKeyChecking=accept-new esggo-vps "sudo systemctl restart cloudflared; sudo systemctl restart nginx; pm2 restart all; sleep 3; curl -I http://127.0.0.1:8788/"
```

**PowerShell trap (verified 2026-08-25):** the user's terminal is PowerShell
(`PS C:\Users\dingj>`), NOT git-bash. Do NOT hand bash `for k in ...; do ...; done`
loops — they misbehave. Hand PowerShell-native syntax instead:
```powershell
$keys = @("esggo_original","esggo_vps_fix","id_rsa_esggo","id_rsa_esggo_new","id_rsa_esggo_new2","vps_deploy_key")
foreach ($k in $keys) {
  Write-Host "=== try $k ==="
  ssh -o StrictHostKeyChecking=accept-new -o BatchMode=yes -i "$HOME\.ssh\$k" dingj@161.118.248.180 "echo CONNECTED" 2>&1 | Select-Object -First 2
}
```
- `esggo-vps` resolves to `161.118.248.180` (single shared Oracle Always-Free ARM A1).
- ALL `*.esggo.co` subdomains resolve via nginx `server_name`; containers bind only `127.0.0.1:PORT` and are fronted by cloudflared tunnel.
- `pm2 restart all` revives node services (omni-blueprint-hub :8787, universal-translator :8788, etc.).
- If `curl -I http://127.0.0.1:8788/` returns 200 → origin alive; Cloudflare 502 will clear shortly.

## Step 3 — Post-fix verification (agent re-probes)
After user reports the SSH recovery ran, agent re-runs Step 1 curl/port probes.
Only declare "recovered" when subdomain returns 200 AND port 8788 OPEN.
Do NOT trust the user's "it's fixed" — verify with curl (see verify-done-claims).

## Pitfalls
- Treating 502 as "Cloudflare issue" → wrong; it's origin-not-listening.
- Running the SSH commands in the sandbox → impossible (no keys); they MUST run locally
  UNLESS the user grants OCI CLI access (Step 0) — then the agent drives it.
- Restarting only nginx but not cloudflared → tunnel stays dead, 502 persists.
- Forgetting `pm2 restart all` → app layer (8788) still down even if tunnel up.
- **`Permission denied (publickey)` vs `Connection timed out` are DIFFERENT (verified 2026-08-25):**
  `Permission denied` = sshd is up, your key is not in `authorized_keys` (real mismatch).
  `Connection timed out` on a key that was just `denied` = fail2ban / sshguard throttled
  your source IP after repeated failures — wait 5-10 min, don't treat it as a key problem.
- **OCI CLI auth quirk:** `oci compute instance list` needs `--compartment-id <TENANCY_OCID>`
  (root compartment = tenancy ocid, NOT a separate compartment). `grep tenancy ~/.oci/config`
  in MSYS can return empty due to CR/LF — prefer reading the ocid directly or use
  `search_files` to extract it. Suppress the API-key label warning with
  `export SUPPRESS_LABEL_WARNING=True`. `oci compute instance-console-connection create`
  exceeds the 60s foreground timeout → run with `background=true` + `notify_on_complete`.
- See `references/oracle-ssh-unlock.md` for the full agent-driven Serial Console sequence.

## Cross-refs
- verify-done-claims — verify before echoing "fixed"; force-push safety; aistation→OmniAuto move; **§10 corrupted-paste trap (real UT files live in esggo `apps/universal-translator/public/`, not aistation)**; §11 PR merge verify; §12 safe revert of bad push.
- esggo-vps-sync-troubleshooting — SSH key vault + fingerprint verification closure.
- esggo-vps-deploy-verify — subagent fake-completion guard on VPS deploys.

## Acceptance
- [ ] Sandbox curl split (root 200 / subdomain 502) captured as evidence
- [ ] Port probe shows which services are down
- [ ] Exact local SSH remediation handed to user (not run in sandbox)
- [ ] Post-fix re-probe confirms 200 before declaring recovered
