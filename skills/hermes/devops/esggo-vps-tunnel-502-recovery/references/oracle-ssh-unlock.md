# Oracle VPS SSH Unlock — Agent-Driven (OCI CLI from sandbox)

Condensed from the 2026-08-25 session where all 8 local SSH private keys were rejected
by VPS `authorized_keys` and the agent had to unlock the VPS via OCI CLI.

## Preconditions (verified present)
- OCI CLI: `C:\Program Files (x86)\Oracle\oci_cli\oci` (v3.90.1)
- Config: `C:\Users\dingj\.oci\config` — section `[DEFAULT]`, has `user=ocid1.user...`,
  `tenancy=ocid1.tenancy...`, `region=ap-singapore-1`
- Tenancy ocid (root compartment): `ocid1.tenancy.oc1..aaaaaaaadof5rgb76zexk24q6fnhopqjnrqaxwmeuxunoynw46g3lj3lfnlq`
- Target instance `esggo-vps`:
  `ocid1.instance.oc1.ap-singapore-1.anzwsljrkl3rykyc4fggmvq6kezm65dkzzj5nboi3ihax2qxtxyjnxvrpxza`
- Fix public key to inject: `C:\Users\dingj\.ssh\esggo_vps_fix.pub`

## Working command sequence (sandbox = git-bash MSYS)

```bash
export SUPPRESS_LABEL_WARNING=True
TEN="ocid1.tenancy.oc1..aaaaaaaadof5rgb76zexk24q6fnhopqjnrqaxwmeuxunoynw46g3lj3lfnlq"
REG="ap-singapore-1"
VPS="ocid1.instance.oc1.ap-singapore-1.anzwsljrkl3rykyc4fggmvq6kezm65dkzzj5nboi3ihax2qxtxyjnxvrpxza"

# 1) list instances (compartment-id = TENANCY, not a sub-compartment)
oci compute instance list --compartment-id "$TEN" --region "$REG" --lifecycle-state RUNNING \
  --query 'data[].{name:display-name,id:id,state:lifecycle-state}'

# 2) read current SSH keys (proves which key VPS trusts)
oci compute instance get --instance-id "$VPS" --region "$REG" \
  --query "data.metadata.ssh-authorized-keys" --raw-output
```

## HARD LIMIT — do NOT try this (wastes a turn)
```bash
# This FAILS with InvalidParameter:
oci compute instance update --instance-id "$VPS" --region "$REG" --metadata file://meta.json
# Error: The 'ssh_authorized_keys' metadata field cannot be updated and must be
#        provided with the already existing value.
# Also: this CLI version has NO --ssh-authorized-keys flag.
```

## Only working agent-driven unlock: Serial Console
```bash
# Runs >60s — MUST use background=true + notify_on_complete
oci compute instance-console-connection create \
  --instance-id "$VPS" --region "$REG" \
  --ssh-public-key-file "C:/Users/dingj/.ssh/esggo_vps_fix.pub" \
  > "C:/Users/dingj/AppData/Local/Temp/console_conn.json" 2>&1
```
After it provisions, `get` the connection to obtain the console SSH endpoint + tunnel
command, SSH in with `esggo_vps_fix` private key, then append the desired public key to
`~/.ssh/authorized_keys` on the instance. From there `pm2 restart all` + `sudo nginx -t`
recovers a 502 caused by a dead pm2 upstream.

## SSH key triage (what the 8 local keys told us)
- `esggo_original` / `esggo_vps_fix` / `id_rsa_esggo` / `id_rsa_esggo_new`
  → `Permission denied (publickey)` (sshd alive, key not in authorized_keys)
- `id_rsa_esggo_new2` → `Connection timed out` (fail2ban throttled IP after the prior
  denials — NOT a key mismatch; wait 5-10 min)
- VPS currently trusted exactly ONE key: `ssh-rsa ... ssh-key-2026-07-22`
  (did not match any of the 8 local private-key fingerprints → key was regenerated or
  authorized_keys was overwritten at some point)

## PowerShell note (user side)
User terminal is PowerShell. For key-triage loops hand:
`$keys = @("esggo_original","esggo_vps_fix","id_rsa_esggo","id_rsa_esggo_new","id_rsa_esggo_new2","vps_deploy_key"); foreach ($k in $keys) { ssh -o StrictHostKeyChecking=accept-new -o BatchMode=yes -i "$HOME\.ssh\$k" dingj@161.118.248.180 "echo CONNECTED" 2>&1 | Select-Object -First 2 }`
Do NOT hand bash `for ...; do ...; done` — it misbehaves under PowerShell.
