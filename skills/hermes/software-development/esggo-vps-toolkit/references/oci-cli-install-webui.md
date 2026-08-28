# OCI CLI install + Hermes WebUI on VPS (verified 2026-08-07)

## Install OCI CLI on Windows (uv tool)
`oci` is NOT preinstalled. Install via uv:
```bash
uv tool install oci-cli --python 3.13      # bins: oci, create_backup_from_onprem
OCI_BIN="$(cygpath -u 'C:/Users/dingj/AppData/Roaming/uv/tools/oci-cli/Scripts/oci.exe')"
```
- Config already at `~/.oci/config` (tenancy/user/region=ap-singapore-1/key_file/fingerprint).
- Suppress the API-key warning: `export SUPPRESS_LABEL_WARNING=true` before every `oci` call.
- Always run with `env -u PYTHONPATH "$OCI_BIN" ...` to avoid Hermes venv pydantic pollution.
- Windows Python path trap: `python3` in terminal is MSYS python; write OCI JSON output to a
  Windows path (`C:/Users/dingj/AppData/Local/Temp/oci_*.json`) then parse with `python3 -c`,
  NOT `/tmp/...` (MSYS `/tmp` ≠ Windows python `/tmp`).

## Boot volume expansion — full round trip (df 45G → 193G)
1. OCI layer: `bv boot-volume update --region ap-singapore-1 --boot-volume-id <BV_ID> --size-in-gbs 200`
   (state PROVISIONING → AVAILABLE). List OCIDs: `bv boot-volume list`.
2. **OS layer is mandatory** — OCI alone is invisible to the kernel:
   ```bash
   ssh esggo-vps-root "echo 1 > /sys/class/block/sda/device/rescan
   growpart /dev/sda 1
   resize2fs /dev/sda1
   df -h /"            # → 193G total, ~151G avail
   ```
   `growpart` reports `NOCHANGE` until you `rescan`. (Full recipe already in SKILL.md §29.)

## Hermes WebUI (:8790) on esggo-vps — gotchas
- WebUI is **single-container**: mounts host `${HOME}/.hermes` → `/home/hermeswebui/.hermes`
  and runs hermes **in-process**. It needs a real `hermes` binary on the VPS.
- `hermes-agent` is a **Python** package (PEP 668). Install in a venv, not system:
  ```bash
  python3 -m venv /opt/hermes-venv
  /opt/hermes-venv/bin/pip install hermes-agent        # v0.19.0
  ln -sf /opt/hermes-venv/bin/hermes /usr/local/bin/hermes
  ```
- Password: the compose `environment` section ships `HERMES_WEBUI_PASSWORD` **commented out**.
  Uncomment and parameterize: `      - HERMES_WEBUI_PASSWORD=${HERMES_WEBUI_PASSWORD}`
  so it reads from `~/hermes-webui/.env`. Without this the container logs
  `WARNING: Binding to 0.0.0.0 with NO PASSWORD SET`.
- hermes-agent needs `~/.hermes/config.yaml` (model/provider). For a self-hosted LLM on the
  same VPS, point `base_url: http://host.docker.internal:11434/v1` and add to compose:
  ```yaml
      - HERMES_WEBUI_DEFAULT_WORKSPACE=/workspace
    extra_hosts:
      - "host.docker.internal:host-gateway"
  ```
  Linux Docker does NOT resolve `host.docker.internal` without `extra_hosts`.

## OCI `compute instance launch` — AMD E2.1.Micro Always Free
- New AMD Micro via CLI loops on `CannotParseRequest` (400) even with a provably-valid JSON
  body (debug-confirmed: no duplicate fields, correct shape). This is a **console-UI-only**
  action for this account — use Oracle Cloud Console to provision the Always Free Micro,
  not the CLI. (ARM A1.Flex quota was already exhausted: 2 instances running.)
- AD discovery quirk: `iam availability-domain list` sometimes returns empty via CLI; the
  known AD for esggo-vps is `ap-singapore-1-AD-1`.
