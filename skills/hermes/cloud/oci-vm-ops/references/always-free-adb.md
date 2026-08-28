# Always Free Autonomous Database (ADB) — audit / start / verify recipe

Session: 2026-08-14. Tenancy `ocid1.tenancy.oc1..aaaaaaaadof5rgb76zexk24q6fnhopqjnrqaxwmeuxunoynw46g3lj3lfnlq`, region `ap-singapore-1`.

## 0. Credential discovery (avoid false BLOCKER)

Do NOT grep `oci_*.sh` for the tenancy OCID — those scripts hold instance-create logic, not creds.
Creds are in `C:\Users\<user>\.oci\config` (`[DEFAULT]` block: user/tenancy/region/fingerprint/key_file).
Verify with: `oci iam region-subscription list` (suppress warning: `export OCI_CLI_SUPPRESS_FILE_PERMISSIONS_WARNING=True`).
A successful region list = key+fingerprint+tenancy all valid → task UNBLOCKED.

## 1. List + audit ADBs

```bash
export OCI_CLI_SUPPRESS_FILE_PERMISSIONS_WARNING=True
TENANCY=ocid1.tenancy.oc1..aaaaaaaadof5rgb76zexk24q6fnhopqjnrqaxwmeuxunoynw46g3lj3lfnlq
oci db autonomous-database list --compartment-id $TENANCY --all \
  | python -c "import sys,json; d=json.load(sys.stdin); [print(f\"{db['display-name']:20} always_free={db.get('is-always-free')} state={db['lifecycle-state']:10} storage={db.get('data-storage-size-in-gbs')}GB\") for db in d['data']]"
```
Real ADB this session: `OmniUserRAG` (20GB OLTP, state STOPPED → started). `omniurag_*` display-names are connection-service aliases, NOT separate DBs.

## 2. Start a STOPPED ADB (prevents idle recycle)

```bash
DBID=ocid1.autonomousdatabase.oc1.ap-singapore-1.anzwsljrkl3rykyabhb7gbnyoywlteaxfsnnjh43h6smzoz6maja5nvvzioa
oci db autonomous-database start --autonomous-database-id $DBID   # → STARTING
for i in $(seq 1 8); do
  oci db autonomous-database get --autonomous-database-id $DBID | grep -o '"lifecycle-state": "[^"]*"'
  sleep 15
done   # AVAILABLE after ~1-2 min
```

## 3. Confirm built-in free components (APEX / Graph / OML)

`oci db autonomous-database get --autonomous-database-id $DBID` returns `apex-details`
(apex-url, apex-version 24.2.17), `graph-studio-url`, `machine-learning-notebook-url`.
These are Always Free ADB标配 — no extra sign-up. ("各種 LOGO 免費永久免費".)

## 4. Object Storage free backup (10GB tier)

```bash
NS=$(oci os ns get | python -c "import sys,json;print(json.load(sys.stdin)['data'])")   # ax6sc1wpkz6y
printf 'hc %s' "$(date -u +%Y%m%dT%H%M%SZ)" > C:/Users/dingj/hc.txt
oci os object put --namespace $NS --bucket-name esggo-secret-backup \
  --name "healthcheck/$(date -u +%Y%m%dT%H%M%SZ).txt" --file C:/Users/dingj/hc.txt
# → "Uploading object" + etag  (etag 8ae84e7c-5547-4d97-83b8-510204905f70 this session)
```
Pitfall: Windows git-bash `/tmp/x.txt` may be invisible to `oci.exe` — use `C:/Users/<user>/` path.

## 5. Free-tier compliance (終生不荒廢)

- ADB 20GB ≤ Always Free cap (no charge).
- A1 4OCPU/24GB: docs say 2/12 but box实测 4/24 (fuzzy cap) — verify with `nproc`/`free`, not docs.
- Object Storage 10GB free (bucket exists).
- Keep ADB STARTED periodically (VPS cron monthly wake-up) to avoid Oracle reclaiming idle free resources.

## 6. VPS-side keepalive automation (anti-reclaim from the server itself)

Oracle can reclaim an Always Free ADB left STOPPED too long. A VPS cron that wakes it monthly
keeps it "alive". The VPS has no oci CLI/SDK by default — here is the verified path.

### 6.1 Do NOT hand-roll an OCI request signer
A pure-Python `requests` + `cryptography` signer (date/host/(request-target)/x-content-sha256)
was attempted and failed repeatedly with `NotAuthenticated` — even after fixing the signing string.
Root cause: the VPS `~/.oci/config` fingerprint did NOT match the VPS key file (a different
fingerprint was in that config). Custom signers are brittle; prefer the official SDK.

### 6.2 Install official oci SDK in a venv (verified working)
```bash
# VPS (ubuntu@161.118.248.180): PEP 668 blocks system pip → use venv
python3 -m venv /opt/esggo/.venv-oci
/opt/esggo/.venv-oci/bin/pip install oci        # → OCI_SDK_OK 2.184.1
```

### 6.3 Sync the WORKING fingerprint to the VPS config
The local Windows `~/.oci/config` has the verified fingerprint (the one the local `oci` CLI uses
successfully). Copy the local key file to the VPS and write a config using that exact fingerprint:
```bash
# local → VPS
scp -i ~/.ssh/ci_deploy_key "C:/Users/dingj/.oci/oci_api_key" ubuntu@161.118.248.180:/home/ubuntu/.oci/oci_api_key
# on VPS: write ~/.oci/config with the LOCAL working fingerprint (not the VPS-original one)
printf '[DEFAULT]\nuser=ocid1.user.oc1..aaaaaaaawjs4ufxvz2k2igfw3ktyvyk5dsyvcufxyowcvue3h5hezsa3vgja\ntenancy=ocid1.tenancy.oc1..aaaaaaaadof5rgb76zexk24q6fnhopqjnrqaxwmeuxunoynw46g3lj3lfnlq\nregion=ap-singapore-1\nkey_file=/home/ubuntu/.oci/oci_api_key\nfingerprint=3d:e1:62:cb:be:ef:81:35:20:de:ea:4d:d6:31:fc:e8\n' > ~/.oci/config
chmod 600 ~/.oci/config
```
Pitfall: the working fingerprint this session was `3d:e1:62:cb:...`. If you see `InvalidConfig: {'fingerprint': 'malformed'}`,
you dropped a hex char when writing the config (e.g. wrote `d:e1:...` instead of `3d:e1:...`).
The SDK enforces lowercase `^([0-9a-f]{2}:){15}[0-9a-f]{2}$` — re-check every pair.

### 6.4 Keepalive script (SDK-based, idempotent)
```python
# /opt/esggo/scripts/omni-adb-keepalive.py  (run with the venv python)
import oci, os
DB_ID = os.environ.get('OMNI_ADB_ID', 'ocid1.autonomousdatabase.oc1.ap-singapore-1.anzwsljrkl3rykyabhb7gbnyoywlteaxfsnnjh43h6smzoz6maja5nvvzioa')
cfg = oci.config.from_file(os.path.expanduser('~/.oci/config'), 'DEFAULT')
adb = oci.database.DatabaseClient(cfg).get_autonomous_database(DB_ID).data
state = adb.lifecycle_state
print(f'[omni-adb-keepalive] 當前狀態: {state}')
if state == 'STOPPED':
    oci.database.DatabaseClient(cfg).start_autonomous_database(DB_ID)
    print('[omni-adb-keepalive] START 指令已送出')
elif state == 'AVAILABLE':
    print('[omni-adb-keepalive] 已是 AVAILABLE, 略過')
# PROVISIONING/STARTING/STOPPING/TERMINATING → no-op
```
Deploy: `scp scripts/omni-adb-keepalive.py ubuntu@...:/opt/esggo/scripts/`
Run test: `/opt/esggo/.venv-oci/bin/python /opt/esggo/scripts/omni-adb-keepalive.py`
Expected: `當前狀態: AVAILABLE` → `已是 AVAILABLE, 略過` (idempotent; safe to run often).

### 6.5 Monthly cron
```bash
# VPS crontab
0 3 1 * * /opt/esggo/.venv-oci/bin/python /opt/esggo/scripts/omni-adb-keepalive.py >> /home/ubuntu/logs/omni-adb-keepalive.log 2>&1
```
Log to `$HOME/logs` (NOT `/var/log` — ubuntu has no write permission there; silent EACCES).
Verify after a run: `ls -la $HOME/logs/omni-adb-keepalive.log` must exist.

Commit reference (this session): `1376bbb69` (scripts/omni-adb-keepalive.py), `eda1249aa` (soul §28.2 doc).

## 7. Cross-check before declaring a resource "missing"
Devin/other AI-agent audits may over-claim gaps. This session a subagent claimed "4 POST routes
missing auth" — actually `cron/route.ts` and `memory/route.ts` already had `CRON_SECRET` /
`MEMORY_API_KEY` checks; the audit tool only recognized `unified-auth` middleware pattern.
When an agent reports "X missing / Y broken", re-run the underlying tool yourself and read the
actual code before acting. Numbers from self-assessments are often inflated.
