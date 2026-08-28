---
name: cloud-instance-immutable-metadata
description: "Diagnosis pattern for cloud VM access failures caused by immutable metadata, especially lost SSH keypairs. Covers canonical path elimination, API evidence interpretation, supported recovery options, and concise troubleshooting communication."
version: 1.0.0
author: DingJun1028 / Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [cloud, oci, ssh, debugging, troubleshooting, infrastructure]
    related_skills: [systematic-debugging, hermes-usage-best-practices]
---

# Cloud VM Immutable Metadata Recovery

## Overview

When access to a VM depends on metadata-bound SSH keys and that metadata field is immutable or cannot be updated, repeated fixes are waste. Detect the dead end early and move to supported recovery paths.

Use this skill when the user reports:
- `Permission denied (publickey)` after generating or importing new keys
- Missing private key for the original instance keypair
- Console Connection / Execute Command both unavailable or returning nothing
- API responses stating a metadata field must already contain the provided value

## Canonical Path Checklist

Before deciding a metadata field is immutable, validate these paths in order:

1. **SSH with existing private keys**
   - Try all local candidate `.pem` / private files named around instance creation.
   - If `Permission denied (publickey)` is consistent, do not retry without changing keys.

2. **Console Connection / serial console**
   - OCI: Actions → **Console Connection** / **主控台連線** / Launch
   - AWS: EC2 → Serial console
   - GCP: Interactive serial port
   - If provider requires Cloud Shell specifically, verify the shell target is the instance, not a jump host.
   - If Cloud Shell opens but agent commands stay in `ACCEPTED` forever, treat agent access as unavailable.

3. **Execute Command / Run Command / Cloud Agent**
   - Run a zero-effect read command such as `whoami` or `ls`.
   - Long-term `ACCEPTED` without output means the agent is absent or blocked; do not keep polling.

4. **Metadata update API**
   - Some providers return explicit immutability errors:
     - `The 'ssh_authorized_keys' metadata field cannot be updated or removed and must be provided with the already existing value`
   - That message is a hard stop for credential rotation.
   - Do not attempt additional identical update commands after this response.

## Decision Rule

If all four paths fail or hard-stop in provider responses, treat original SSH access to the instance as an architectural dead end.

Supported recovery path:
1. **Do not terminate the boot dependency**
   - For OCI: terminate the instance with **Delete Boot Volume** left unchecked.
2. **Create a new instance from the retained/boot volume**
   - During creation, inject the fresh SSH public key.
3. **Store the corresponding private key immediately**
   - Treat it as required infrastructure, not optional.

## Communication Guidance

### For Best-Practice Requests
Give a one-line decision: the VM is unrecoverable under current constraints; preserve boot storage and rebuild with a new keypair.

### For Frustrated Users
Do not repeat the same menu steps.
- State the failed path once.
- Present the concrete choice: rebuild now, or pause and return to productive work.
- Avoid explaining why prior attempts "should have worked" beyond one sentence.

### Curse of Knowledge Avoidance
Assume users have not read prior turns. State only the current actionable step, not the full prior history.

## OCI-Specific Notes

- `oci compute instance update --metadata '{"ssh-authorized-keys": ...}'` or `--metadata '{"ssh_authorized_keys": ...}'` may return immutability errors even when supplying previous + new keys combined.
- OCI on ARM64 has additional constraints: omit unsupported fields like `ssh-keys` when targeting instance metadata.
- Cloud Shell commands pointing to instance management are available, but do not confuse Cloud Shell terminal logs with instance-local terminal access.
- If a public key was accidentally committed or pasted into a metadata-enabled path, treat it as compromised: rotate the keypair immediately and remove it from any public repo or log.
- On Windows, Git Bash + OpenSSH may fail with libcrypto errors. If SSH fails after key generation, retry with PowerShell's native ssh-keygen and use PowerShell ssh.

## Templates

See `templates/` for CLI-ready snippets if needed.
