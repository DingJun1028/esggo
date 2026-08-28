# OCI VM Session Notes (DingJun 2026-07-21)

## Case
- Lost SSH keypair for Always Free Ubuntu 24.04 aarch64 instance `161.118.248.180`
- Console Connection UI was unavailable; Cloud Shell execution was available.
- Execute Command showed only `ACCEPTED` with no output; Oracle Cloud Agent was not present on the image.
- `oci compute instance get --query 'data.metadata' --output json` succeeded; `--output text` does **not** work on this CLI version.

## Root cause summary
- Private key was missing. The existing metadata `ssh_authorized_keys` is immutable after instance creation.
- Multiple `oci compute instance update --metadata ...` attempts failed with:
  - `The 'ssh_authorized_keys' metadata field cannot be removed and must be provided with the already existing value.`
  - `The 'ssh_authorized_keys' metadata field cannot be updated and must be provided with the already existing value.`
- Retrying `instance update` with reconstructed JSON never succeeds; the issue is immutability, not format.

## Keypair mismatch trap
- Even after the user provides a public key that matches the local private key's fingerprint, SSH can still fail with `Permission denied (publickey)` if that public key was never written into the instance's `~/.ssh/authorized_keys`.
- Users often retry SSH or paste the same pub key repeatedly without changing the VM state. Stop and pivot to provider-side key injection instead.

## Working recovery path used
1. Generate new keypair in Cloud Shell:
   `ssh-keygen -t rsa -b 4096 -f ~/vpskey -N '' -q`
2. Read existing metadata to confirm immutable `ssh_authorized_keys`:
   `oci compute instance get --instance-id <ID> --query 'data.metadata' --output json`
3. Terminate the instance **without deleting boot volume**.
4. Create new instance from that **Boot Volume**; paste new public key into SSH Key field during wizard.

## Recreate blockers observed
- `VM.Standard.E2.1.Micro` capacity was unavailable in `AD-1` in ap-singapore-1.
- Console UI did not expose a way to switch AD; retry after waiting 5–15 minutes or use a different region/shape.

## Hermes Telegram config used alongside
- Config file: `C:\Users\dingj\AppData\Local\hermes\config.yaml`
- Token storage: `C:\Users\dingj\AppData\Local\hermes\.env`
- Set with:
  `sed -i "s/^# TELEGRAM_BOT_TOKEN=\$/TELEGRAM_BOT_TOKEN=<token>/" C:/Users/<user>/AppData/Local/hermes/.env`

## Takeaway
Do not attempt `instance update --metadata` to replace `ssh_authorized_keys`. Use Boot Volume recreate; it preserves data and accepts a new authorized key.

If fingerprint matches but SSH still fails, the instance's `authorized_keys` is missing the matching pub key. Inject via Console Connection or recreate from boot volume; do not loop on SSH retries.
