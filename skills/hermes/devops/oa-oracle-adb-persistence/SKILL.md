---
name: oa-oracle-adb-persistence
description: Sync OA assets to Oracle ADB; 3-schema sync.
---

# OA Oracle ADB 持久化

## 觸發
- 把 vault 知識分身 / 傳承資產同步進 Oracle ADB
- 設 ADB 防回收（Always Free 7天閒置回收）
- 建 OMNI_* schema 並寫入驗證

## 環境前提
- VPS 161.118.248.180，SSH `-i ~/.ssh/esggo_original`
- OCI SDK: VPS `/opt/esggo/.venv-oci`（`pip install oracledb oci==2.184.1`）
- ADB: OmniUserRAG (`ocid1.autonomousdatabase.oc1.ap-singapore-1...`)，Always Free 20GB
- oci config: `~/.oci/config`（tenancy OCID + fingerprint）

## 步驟

### 1. 設 ADB admin 密碼（免舊密碼）
```python
import oci
cfg = oci.config.from_file()
db = oci.database.DatabaseClient(cfg)
adbc = "ocid1.autonomousdatabase.oc1.ap-singapore-1.xxx"
pw = "生成18位密碼"
db.update_autonomous_database(adbc, oci.database.models.UpdateAutonomousDatabaseDetails(admin_password=pw))
```
存 `~/adb_pw.txt`（`chmod 600`）。

### 2. 下載 Wallet（備用）
```python
from oci.database.models import GenerateAutonomousDatabaseWalletDetails
wallet = db.generate_autonomous_database_wallet(adbc, GenerateAutonomousDatabaseWalletDetails(password="wallet_pw", wallet_type="ALL"))
# 下載 zip 解壓到 ~/wallet
```

### 3. Thin 模式連線（免 Oracle Client 庫）
```python
import oracledb, os
pw = open(os.path.expanduser("~/adb_pw.txt")).read().strip()
dsn = "adb.ap-singapore-1.oraclecloud.com:1522/<adbid>_high.adb.oraclecloud.com"
conn = oracledb.connect(user="ADMIN", password=pw, dsn=dsn,
    params=oracledb.ConnectParams(wallet_location=os.path.expanduser("~/wallet"), wallet_password="wallet_pw"))
```
`oracledb` 4.x 預設 thin；**不要**呼叫 `init_oracle_client`（會觸發 thick 模式找 Oracle Client 庫，VPS 沒裝）。

### 4. 三 Schema 同步
- `OMNI_KNOWLEDGE_INHERITANCE` — 知識傳承本體
- `OMNI_AVATAR_REGISTRY(avatar_id, node, type, source_file, correct, variant, absorbed, projected_to_ontology)` — 對映 `.avatar-registry.json` 的 138 分身
- `OMNI_MOC_INDEX(moc_id, title, linked_nodes)` — 對映 `00-Index.md` 的 `[[wikilink]]`
- `FILE` 是 Oracle reserved word → 欄名用 `source_file`
- 數據源：VPS `/opt/esggo/vault/Agents/context/.avatar-registry.json` + `00-Index.md`

### 5. Cron 自動化
- 月 `0 3 1 * *` `omni-adb-keepalive.py`（喚醒 ADB 防回收）
- 每日 `10 3 * * *` `omni-adb-sync.py`（三 Schema 同步）

## 驗證
- `SELECT COUNT(*) FROM OMNI_AVATAR_REGISTRY` 應回 101（唯一 avatar_id 數）
- ADB 狀態 `get_autonomous_database` → `lifecycle_state == AVAILABLE`

## Pitfall
- `ConnectParams` 無 `get_host` 方法（版本差異）；直接 `connect` 即可
- `oracledb.exceptions.DatabaseError: ORA-03050` = reserved word（FILE）→ 改欄名
- VPS 無 `sqlplus`/`sqlcl`，用 Python oracledb 即可
- wallet 非必須（thin + TCPS 可連），但 `wallet_location` 指向解壓的 wallet 目錄最穩
- ADB 連線字串從 `get_autonomous_database` 的 `connection_strings.tls` 拿（high/low 端點，格式 `adb.region.oraclecloud.com:1522/xxx_high.adb.oraclecloud.com`）
