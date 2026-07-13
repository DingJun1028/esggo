#!/usr/bin/env python3
# ============================================================
# Oracle ADB Sync — 萬能標籤配對合成層的信任/向量同步
# scripts/oracle-sync.py
# ============================================================
# 依賴 (oci-cli venv 內): oracledb (thin mode, 純 python, 無原生編譯)
# 連線: ADB wallet (TNS) + 密碼
#   - 建表階段: ADMIN user (OMNI_ADMIN_PWD) — 建立 omni_trust/omni_profile/omni_lifecycle
#   - 同步階段: omni_trust user (OMNI_DB_PWD)
#
# 環境變數:
#   OMNI_ADMIN_PWD   ADB ADMIN user 密碼 (建表用)
#   OMNI_DB_PWD      omni_trust/omni_profile/omni_lifecycle 三 user 密碼 (同步用, 建表時設定)
#   OMNI_WALLET_DIR  wallet 目錄 (預設 ~/.wallet)
#   OMNI_TNS          TNS 名稱 (預設 omniurag_high)
#
# 用法:
#   python3 oracle-sync.py init              # 以 ADMIN 建 OMNI_* schema + 三 user
#   python3 oracle-sync.py sync '<pair>'    # 同步一筆 TagPair 進 trust_ledger
#   python3 oracle-sync.py sync-batch '<[]>' # 同步多筆
# ============================================================
import os
import sys
import json
import hashlib
from datetime import datetime, timezone

try:
    import oracledb
except ImportError as e:
    print(json.dumps({"ok": False, "error": f"oracledb not installed: {e}"}))
    sys.exit(2)

ADMIN_PWD = os.environ.get("OMNI_ADMIN_PWD")
DB_PWD = os.environ.get("OMNI_DB_PWD")
WALLET_DIR = os.environ.get("OMNI_WALLET_DIR", os.path.expanduser("~/.wallet"))
WALLET_PWD = os.environ.get("OMNI_WALLET_PWD")  # wallet (ewallet.p12) 密碼
TNS = os.environ.get("OMNI_TNS", "omniurag_high")

def _connect(user: str, pwd: str):
    if not pwd:
        raise RuntimeError(f"password for {user} not set")
    # thin mode + mTLS: ADB 要求 mutual TLS (is-mtls-connection-required=true)
    # wallet 目錄含 ewallet.p12 (client cert) + tnsnames.ora + sqlnet.ora
    kwargs = dict(
        user=user,
        password=pwd,
        dsn=TNS,
        config_dir=WALLET_DIR,
        wallet_location=WALLET_DIR,
    )
    if WALLET_PWD:
        kwargs["wallet_password"] = WALLET_PWD
    return oracledb.connect(**kwargs)
def ensure_schema():
    """以 ADMIN 建立三個 user + 表。"""
    if not ADMIN_PWD:
        return {"ok": False, "error": "OMNI_ADMIN_PWD not set"}
    if not DB_PWD:
        return {"ok": False, "error": "OMNI_DB_PWD not set (used for omni_* users)"}

    admin = _connect("ADMIN", ADMIN_PWD)
    cur = admin.cursor()
    # 建立三個 schema user (若無)
    for u in ("omni_trust", "omni_profile", "omni_lifecycle"):
        try:
            cur.execute(f'CREATE USER {u} IDENTIFIED BY "{DB_PWD}"')
            cur.execute(f'GRANT CONNECT, RESOURCE, CREATE TABLE, UNLIMITED TABLESPACE TO {u}')
        except Exception as e:
            # ORA-01920 user already exists — 可接受
            if "01920" not in str(e):
                raise
    admin.commit()

    # omni_trust.entry (hash-chain 信任帳本)
    conn = _connect("omni_trust", DB_PWD)
    c = conn.cursor()
    c.execute(
        """
        BEGIN
          EXECUTE IMMEDIATE 'CREATE TABLE omni_trust.entry (
            seq         NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            prev_hash   VARCHAR2(128),
            curr_hash   VARCHAR2(128),
            uuid        VARCHAR2(64),
            action      VARCHAR2(64),
            timestamp   NUMBER,
            frozen      NUMBER(1) DEFAULT 0,
            created_at  TIMESTAMP DEFAULT SYSTIMESTAMP
          )';
        EXCEPTION
          WHEN OTHERS THEN
            IF SQLCODE != -955 THEN RAISE; END IF;  -- ORA-00955 表已存在
        END;
        """
    )
    conn.commit()
    c.close()
    conn.close()

    # omni_profile.component_vector (RAG 向量, embedding 預設 NULL)
    conn = _connect("omni_profile", DB_PWD)
    c = conn.cursor()
    c.execute(
        """
        BEGIN
          EXECUTE IMMEDIATE 'CREATE TABLE omni_profile.component_vector (
            uuid        VARCHAR2(64) PRIMARY KEY,
            version     VARCHAR2(32),
            timestamp   NUMBER,
            embedding   VECTOR(1536),
            evidence    CLOB,
            hash        VARCHAR2(128),
            frozen      NUMBER(1) DEFAULT 0,
            created_at  TIMESTAMP DEFAULT SYSTIMESTAMP
          )';
        EXCEPTION
          WHEN OTHERS THEN
            IF SQLCODE != -955 THEN RAISE; END IF;
        END;
        """
    )
    conn.commit()
    c.close()
    conn.close()

    admin.close()
    return {"ok": True, "tables": ["omni_trust.entry", "omni_profile.component_vector"], "users": ["omni_trust", "omni_profile", "omni_lifecycle"]}


def _compute_hash(prev: str, action: str, uuid: str, ts: int) -> str:
    raw = f"{prev}|{action}|{uuid}|{ts}"
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


def sync_tagpair(pair: dict):
    uuid = pair.get("uuid") or pair.get("pairId") or pair.get("anchorId")
    if not uuid:
        return {"ok": False, "error": "no uuid in pair"}
    action = pair.get("action", "TRUST_GRANT")
    ts = int(pair.get("timestamp", datetime.now(timezone.utc).timestamp() * 1000))

    conn = _connect("omni_trust", DB_PWD)
    cur = conn.cursor()
    cur.execute("SELECT curr_hash FROM omni_trust.entry ORDER BY seq DESC FETCH FIRST 1 ROWS ONLY")
    row = cur.fetchone()
    prev_hash = row[0] if row else "0" * 64
    curr_hash = _compute_hash(prev_hash, action, uuid, ts)

    cur.execute(
        "INSERT INTO omni_trust.entry (prev_hash, curr_hash, uuid, action, timestamp) "
        "VALUES (:1, :2, :3, :4, :5)",
        [prev_hash, curr_hash, uuid, action, ts],
    )
    conn.commit()
    cur.close()
    conn.close()
    return {"ok": True, "uuid": uuid, "curr_hash": curr_hash}


def sync_batch(pairs: list):
    results = [sync_tagpair(p) for p in pairs]
    ok = sum(1 for r in results if r.get("ok"))
    return {"ok": True, "synced": ok, "total": len(results), "details": results}


def main():
    if len(sys.argv) < 2:
        print(json.dumps({"ok": False, "error": "usage: init|sync|sync-batch"}))
        sys.exit(1)
    cmd = sys.argv[1]
    try:
        if cmd == "init":
            out = ensure_schema()
        elif cmd == "sync":
            payload = json.loads(sys.argv[2]) if len(sys.argv) > 2 else {}
            out = sync_tagpair(payload)
        elif cmd == "sync-batch":
            payload = json.loads(sys.argv[2]) if len(sys.argv) > 2 else []
            out = sync_batch(payload)
        else:
            out = {"ok": False, "error": f"unknown cmd: {cmd}"}
    except Exception as e:
        print(json.dumps({"ok": False, "error": str(e)}))
        sys.exit(1)
    print(json.dumps(out))
    sys.exit(0)


if __name__ == "__main__":
    main()
