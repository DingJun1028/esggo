# OCI CLI v3.90+ / systemd integration (2026-08-18)

## Verified syntax changes
- `--instance-name` removed; use `--instance-id <OCID>`.
- `oci compute instance action start ...` removed; use `oci compute instance action --instance-id <OCID> --action START`.
- `--compartment-id` is no longer required for instance list/get/action if `~/.oci/config` has the tenancy.

## Env wrapper for subprocess/systemd
Create `/home/ubuntu/bin/oci-env`:
```bash
#!/bin/bash
export HOME="/home/ubuntu"
export OCI_CONFIG_HOME="/home/ubuntu/.oci"
export SUPPRESS_LABEL_WARNING="true"
exec /home/ubuntu/bin/oci "$@"
```
Then set `OCI_BIN = "/home/ubuntu/bin/oci-env"` in Python callers.

Also add `User=ubuntu` to the `[Service]` section of systemd services that call OCI.

## Name-to-OCID resolver
Do not pass display-names to `--instance-id`.
Call `oci compute instance list --region ap-singapore-1 --output json` and match `display-name` → `id`.

## AI Station OCI Controller API
Endpoints: `/oci/instances`, `/oci/instances/{name}`, `/oci/instances/{name}/start`, `/oci/instances/{name}/stop`, `/oci/ops-log`.
Deploy path: `/opt/esggo/apps/aistation/src/oci_controller.py`; restart `aistation.service`.

## n8n v2.34.4 auth update
- `N8N_API_KEY` env is NOT trusted by REST API; only UI-created personal API tokens work.
- Owner password reset via sqlite if login is broken: update `user.password` to a bcrypt `$2a$10$...` hash, then restart n8n.
- n8n login payload field is `emailOrLdapLoginId`, not `email`.
