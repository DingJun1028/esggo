#!/usr/bin/env python3
# ============================================================
# Oracle ADB Sync — 萬能標籤配對合成層的信任/向量同步
# scripts/oracle-sync.py
# ============================================================
# 依賴 (oci-cli venv 內): oracledb (thin mode, 純 python, 無原生編譯)
# 連線: ADB wallet (TNS) + OMNI_DB_PWD
# 同步目標:
#   - omni_trust.entry     (hash-chain 信任帳本, 防篡改)
#   - omni_profile.component_vector (RAG 向量, embedding 暫 NULL)
#
# 環境變數:
#   OMNI_DB_PWD      ADB schema 密碼 (來自 OCI Vault)
#   OMNI_WALLET_DIR  wallet 目錄 (預設 ./wallet)
#   OMNI_TNS          TNS 名稱 (預設 omni_trust_high)
#
# 用法:
#   python3 oracle-sync.py init                     # 建表 (需 admin 或具備建表權限)
#   python3 oracle-sync.py sync '<tagpair_json>'     # 同步一筆 TagPair
#   python3 oracle-sync.py sync-batch '<json_array>' # 同步多筆
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

OMNI_DB_PWD = os.environ.get("OMNI_DB_PWD")
WALLET_DIR = os.environ.get("OMNI_WALLET_DIR", "./wallet")
TNS = os.environ.get("OMNI_TNS", "omni_trust_high")


def _connect(user: str):
    if not OMNI_DB_PWD:
        raise RuntimeError("OMNI_DB_PWD not set")
    # thin mode: 純 python, 不需 Oracle Instant Client
    return oracledb.connect(
        user=user, password=OMNI_DB_PWD, dsn=f"{user}_{TNS}"
    )


def ensure_schema():
    """建 OMNI_TRUST / OMNI_PROFILE 表 (若無)。需具備建表權限。"""
    conn = _connect("omni_trust")
    cur = conn.cursor()
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS omni_trust.entry (
            seq         NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            prev_hash   VARCHAR2(128),
            curr_hash   VARCHAR2(128),
            uuid        VARCHAR2(64),
            action      VARCHAR2(64),
            timestamp   NUMBER,
            frozen      NUMBER(1) DEFAULT 0,
            created_at  TIMESTAMP DEFAULT SYSTIMESTAMP
        )
        """
    )
    conn.commit()
    cur.close()
    conn.close()

    # vector 表 (embedding 暫 NULL, 未來接 embedding 服務)
    conn = _connect("omni_profile")
    cur = conn.cursor()
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS omni_profile.component_vector (
            uuid        VARCHAR2(64) PRIMARY KEY,
            version     VARCHAR2(32),
            timestamp   NUMBER,
            embedding   VECTOR(1536),
            evidence    CLOB,
            hash        VARCHAR2(128),
            frozen      NUMBER(1) DEFAULT 0,
            created_at  TIMESTAMP DEFAULT SYSTIMESTAMP
        )
        """
    )
    conn.commit()
    cur.close()
    conn.close()
    return {"ok": True, "tables": ["omni_trust.entry", "omni_profile.component_vector"]}


def _compute_hash(prev: str, action: str, uuid: str, ts: int) -> str:
    raw = f"{prev}|{action}|{uuid}|{ts}"
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


def sync_tagpair(pair: dict):
    """將一筆 TagPair 同步進 omni_trust.entry (hash-chain)。"""
    uuid = pair.get("uuid") or pair.get("pairId") or pair.get("anchorId")
    if not uuid:
        return {"ok": False, "error": "no uuid in pair"}
    action = pair.get("action", "TRUST_GRANT")
    ts = int(pair.get("timestamp", datetime.now(timezone.utc).timestamp() * 1000))

    conn = _connect("omni_trust")
    cur = conn.cursor()
    # 取上一筆 hash (鏈尾)
    cur.execute(
        "SELECT curr_hash FROM omni_trust.entry ORDER BY seq DESC FETCH FIRST 1 ROWS ONLY"
    )
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
    results = []
    for p in pairs:
        results.append(sync_tagpair(p))
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
