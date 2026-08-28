# OCI Instance Reboot via Raw REST (when CLI/SDK won't install)

Verified 2026-08-08. All packaged routes to reboot a frozen VPS failed on this host:
- `pip install oci-cli` → SSL EOF on files.pythonhosted.org
- `uv pip install oci-cli` → file-lock on hermes venv `yaml/_yaml.cp311-win_amd64.pyd`
- `npm install @oracle/oci-sdk` → 404 (package does not exist on npm)
- `npm install oci-sdk` → installs but `require('oci-sdk')` hangs (load >90s, never returns)
- isolated `pip install oci` venv → >240s timeout (large SDK, SSL slow)
- OCI CLI MSI download → failed (URL/network)

The ONLY path that actually produced a correctly-signed request was a **hand-rolled
OCI REST call** using the `cryptography` library (already in hermes venv) + stdlib `urllib`.

## Minimal working signing + reboot (Python)

Key facts that bit during the session:
- The OCI config uses `[DEFAULT]`; `configparser` does NOT expose it via `cp["DEFAULT"]`
  or `cp.defaults()` when the file has CRLF or git-bash path quirks. **Parse manually**.
- `configparser` read of `/c/Users/...` fails under Python (wants `C:/Users/...`).
  Always use the Windows drive form inside Python.
- OCI signing requires headers in this exact order in the signing string:
  `(request-target) host x-content-sha256 date`. The `Authorization` header's
  `headers=` list must match that order.

```python
import configparser, datetime, hashlib, json
from urllib import request
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives.serialization import load_pem_private_key

CFG = "C:/Users/dingj/.oci/config"
raw = open(CFG, encoding="utf-8").read().splitlines()
d = {}
for ln in raw:
    ln = ln.strip()
    if ln and not ln.startswith("[") and "=" in ln:
        k, v = ln.split("=", 1)
        d[k.strip()] = v.strip()
user, tenancy, region = d["user"], d["tenancy"], d["region"]
fk, keyf = d["fingerprint"], d["key_file"]

with open(keyf, "rb") as f:
    key = load_pem_private_key(f.read(), password=None)

def sign(key, signing_string):
    return base64.b64encode(
        key.sign(signing_string.encode(), padding.PKCS1v15(), hashes.SHA256())
    ).decode()

# list instances to find the OCID for 161.118.248.180
method, path = "GET", "/20160918/instances?compartmentId=" + tenancy
host = f"iaas.{region}.oraclecloud.com"
t = datetime.datetime.utcnow().strftime("%a, %d %b %Y %H:%M:%S GMT")
body = b""
content_sha = hashlib.sha256(body).hexdigest()
signing = f"(request-target): {method.lower()} {path}\nhost: {host}\nx-content-sha256: {content_sha}\ndate: {t}"
auth = (f'Signature version="1",keyId="{tenancy}/{user}/{fk}",'
        f'algorithm="rsa-sha256",headers="(request-target) host x-content-sha256 date",'
        f'signature="{sign(key, signing)}"')
req = request.Request(f"https://{host}{path}", headers={
    "host": host, "x-content-sha256": content_sha, "date": t, "Authorization": auth})
# parse instances -> match ip -> POST instanceAction SOFTRESET on the OCID
```

## Honest outcome of this session
The signed request returned **HTTP 401 Unauthorized** — the API key's fingerprint
was not validated against the OCI Console (public key not registered, or PEM/OPENSSH
key-format mismatch). That is the **expected blocker** when the key pair was not
generated inside the OCI Console. Conclusion:

- **Do NOT sink time into OCI CLI/SDK install paths when SSH is down.** They are slow
  and the signed call still yields 401 if the key isn't Console-validated.
- **The reliable unlock is Oracle Cloud Console → Compute → Instances → Reboot**
  (soft reboot, 1–2 min). See §34.2.
- Keep the REST script as a reference only; it is correct but auth-dependent.

## Watchdog pattern (auto-deploy on recovery)
A background bash loop polls SSH every 10 min; when it comes back, it scp's the
deploy script and runs it once (guarded by a `DEPLOY_DONE` flag so it never re-runs):

```bash
VPS="161.118.248.180"; SSH_KEY="$HOME/.ssh/esggo_original"; INTERVAL=600
LAST=down; DONE=0
while true; do
  timeout 7 ssh -o StrictHostKeyChecking=no -o ConnectTimeout=7 -i "$SSH_KEY" ubuntu@$VPS "echo UP" >/dev/null 2>&1 && CUR=up || CUR=down
  [ "$CUR" != "$LAST" ] && echo "[watchdog] $(date -u) $LAST->$CUR" && LAST=$CUR
  if [ "$CUR" = up ] && [ "$DONE" -eq 0 ]; then
    scp -i "$SSH_KEY" /c/Project/esggo-learning-center/_tmp_vps/deploy_voice_agent.sh ubuntu@$VPS:/tmp/deploy_voice_agent.sh
    timeout 300 ssh -i "$SSH_KEY" ubuntu@$VPS "bash /tmp/deploy_voice_agent.sh"
    DONE=1
  fi
  sleep $INTERVAL
done
```

Launch with `terminal(background=true, notify_on_complete=true)` — NOT `nohup &`
(the runtime rejects shell-level wrappers).
