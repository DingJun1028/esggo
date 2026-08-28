# OCI Controller API Integration — Session 2026-08-15

## Evidence

1. OCI CLI installed on VPS: `/home/ubuntu/bin/oci` v3.90.2
2. Config: `/home/ubuntu/.oci/config` with user/tenancy/region=ap-singapore-1
3. Instances: `esggo-vps` RUNNING (A1.Flex 4/24), `oa-worker-01` RUNNING (A1.Flex 1/6)
4. Wrapper script: `/home/ubuntu/bin/oci-wrapper` (list/status/start/stop)
5. OCI Controller API: `src/oci_controller.py` with 5 endpoints
6. App integration: `src/app.py` includes `oci_router`
7. Tests: `test_oci_controller.py` + `test_oci_api.py` (4 passed)
8. Commit: `e00f1f8` "feat(oci): add OCI Controller API"

## Root Cause: systemd service runs as root

Symptom: `/oci/instances` returns `{"detail":"oci error: Abort:"}`

Diagnosis:
```bash
systemctl show aistation.service --property=User,MainPID
# User= (empty)
# MainPID=3635437

ps -o user,pid,cmd -p 3635437
# root     3635437 /opt/esggo/apps/aistation/.venv/bin/uvicorn ...
```

OCI CLI reads config from `$HOME/.oci/config`. When running as root, HOME=/root, but the config lives in /home/ubuntu/.oci/. This causes the Abort.

## Fix Applied

```bash
sudo sed -i '/^\[Service\]/a User=ubuntu' /etc/systemd/system/aistation.service
sudo systemctl daemon-reload
sudo systemctl restart aistation.service
```

Verification:
```bash
curl -s http://127.0.0.1:8000/oci/instances
# [{"name":"esggo-vps","state":"RUNNING",...},...]
```

## Pitfalls

1. jmespath quoting: use snake_case field names in --query, not kebab-case
2. OCI wrapper must set PATH or call /home/ubuntu/bin/oci directly
3. SUPPRESS_LABEL_WARNING=true silences the key security warning
4. deploy via git archive + scp + cp to preserve permissions

## Files Changed

- `src/oci_controller.py` (new)
- `src/app.py` (add include_router)
- `tests/test_oci_controller.py` (new)
- `tests/test_oci_api.py` (new)
- `/etc/systemd/system/aistation.service` (VPS: added User=ubuntu)
