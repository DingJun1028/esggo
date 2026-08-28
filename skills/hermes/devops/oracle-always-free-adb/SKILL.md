---
name: oracle-always-free-adb
category: devops
description: Oracle Always Free ADB thin 連線、wallet 下載與三 Schema 同步。
tags: [oracle, adb, oci, always-free, python, oracledb, persistence, wallet]
---

# Oracle Always Free ADB 操作

## When to use
- 把 vault / 知識分身 / 任何結構化資產持久化進 Oracle Always Free Autonomous DB
- ADB 長期 STOPPED 被回收風險 → 需要 keepalive 喚醒
- 用 Python 連 ADB 但不想裝 Oracle Client 庫 (thick mode)
- 從 OCI 下載 ADB wallet 或重設 ADB admin 密碼

## 核心：thin 模式連線 (免 Client 庫)
`oracledb` 4.x 預設 thin mode，**不要**呼叫 `init_oracle_client()` (那是 thick mode，會報 DPI-1047 找不到 libclntsh.so)。

```python
import oracledb, os
pw = open(os.path.expanduser("~/adb_pw.txt")).read().strip()
params = oracledb.ConnectParams(
    config_dir=os.path.expanduser("~/wallet"),
    wallet_location=os.path.expanduser("~/wallet"),
    wallet_password=pw,
)
params.parse_connect_string("omniurag_high")  # 從 ~/wallet/tnsnames.ora 的 service name
conn = oracledb.connect(user="ADMIN", password=pw, params=params)
```

## Wallet 下載 (oci SDK)
`generate_autonomous_database_wallet` **必須**傳 `GenerateAutonomousDatabaseWalletDetails` 物件，否則報 `missing 1 required positional argument`。

```python
import oci
config = oci.config.from_file(os.path.expanduser("~/.oci/config"), "DEFAULT")
db = oci.database.DatabaseClient(config)
details = oci.database.models.GenerateAutonomousDatabaseWalletDetails(
    password="<wallet_password>", wallet_type="SINGLE")
resp = db.generate_autonomous_database_wallet(DB_ID, details)
open("/home/ubuntu/wallet/adw_wallet.zip", "wb").write(resp.data.content)
# unzip → cwallet.sso, tnsnames.ora, ojdbc.properties, sqlnet.ora
```

## ADB 密碼重設 (無舊密碼時)
```python
db.update_autonomous_database(
    DB_ID,
    oci.database.models.UpdateAutonomousDatabaseDetails(db_admin_password="<new_pw>"))
```

## 防回收 keepalive
ADB 長期 STOPPED 可能被 Oracle 回收。每月 cron 檢查狀態，STOPPED 則 START：
```cron
0 3 1 * * /opt/esggo/.venv-oci/bin/python /opt/esggo/scripts/omni-adb-keepalive.py >> ~/logs/omni-adb-keepalive.log 2>&1
```
腳本邏輯：GET 狀態 → AVAILABLE 略過 / STOPPED START / 其他 no-op。

## 三 Schema 同步閉環
模式見 `scripts/omni-adb-sync.py` (VPS `/opt/esggo/scripts/`)。步驟：
1. `ensure_schema` — CREATE TABLE IF NOT EXISTS (三表)
2. 從 vault registry JSON 解析 → INSERT (idempotent: 先 DELETE 再 INSERT)
3. 每日 cron `10 3 * * *` 自動跑 (與 avatar-daily.sh 05:00 錯開)

三表對映 (OA 第二大腦資產)：
- `OMNI_KNOWLEDGE_INHERITANCE` — 知識傳承本體
- `OMNI_AVATAR_REGISTRY` — 分身註冊表 (avatar_id, node, type, source_file, correct, variant, absorbed, projected_to_ontology)
- `OMNI_MOC_INDEX` — 知識地圖結點 (從 `[[wikilink]]` 解析)

## Pitfalls
- **`FILE` 是 Oracle 保留字** → 欄名用 `source_file` 不用 `file` (ORA-03050)
- **thin mode 不要呼叫 `init_oracle_client`** → DPI-1047 libclntsh.so not found
- **wallet download 必須傳 details 物件** → 否則 TypeError missing argument
- **`ConnectParams` 無 `get_host()`** → 直接 connect，不用 inspect
- **`ROWNUM` 在 f-string 裡要小心括號** → ORA-00936 missing expression
- **NODE_OPTIONS 與 ADB 無關** (那是 Vercel build 的事，見 `vercel-nextjs-build-oom`)

## 安全
- ADB 密碼只存 VPS `~/adb_pw.txt` (chmod 600)，不進 git
- Wallet 僅 VPS 本地，不傳本機
- 本機無法直連 ADB (需 VPS 中轉) → 最小暴露

## 相關
- `oa-knowledge-avatar` — 知識分身體系 (TencentDB B-line，本技能是其 Oracle 平行持久層)
- `vercel-nextjs-build-oom` — Vercel build OOM 修復 (NODE_OPTIONS 雙邊設)
