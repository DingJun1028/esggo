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
#   python3 oracle-sync.py read              # 全量回拉 omni_trust.entry (雙向讀取端)
#   python3 oracle-sync.py matrix            # 建立/確保 omni_lifecycle.sync_matrix 終始矩陣表
#   python3 oracle-sync.py reconcile '<cfg>' # 雙向對帳: 比對 origin/terminal seq, 回傳落後/衝突清單
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

# Auto-load project .env so direct invocations inherit OMNI_* vars.
try:
    from pathlib import Path
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).resolve().parent / '.env')
except Exception:
    pass

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

    # omni_lifecycle.sync_matrix (終始矩陣: 每實體的雙向同步狀態)
    #   entity_uuid  全域實體 (universalTag/tagPair/regulation/...)
    #   origin_seq   源端 (app/Prisma) 最後寫入序號
    #   terminal_seq 端端 (Oracle) 最後確認序號
    #   status       synced | behind_app | behind_oracle | conflict | frozen
    #   direction    app->oracle | oracle->app | bidirectional
    #   updated_at   最後對帳時間
    conn = _connect("omni_lifecycle", DB_PWD)
    c = conn.cursor()
    c.execute(
        """
        BEGIN
          EXECUTE IMMEDIATE 'CREATE TABLE omni_lifecycle.sync_matrix (
            entity_uuid  VARCHAR2(64) PRIMARY KEY,
            origin_seq   NUMBER DEFAULT 0,
            terminal_seq NUMBER DEFAULT 0,
            status       VARCHAR2(32) DEFAULT ''synced'',
            direction    VARCHAR2(32) DEFAULT ''bidirectional'',
            updated_at   NUMBER,
            created_at   TIMESTAMP DEFAULT SYSTIMESTAMP
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
    return {"ok": True, "tables": ["omni_trust.entry", "omni_profile.component_vector", "omni_lifecycle.sync_matrix"], "users": ["omni_trust", "omni_profile", "omni_lifecycle"]}


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


def read_entries(limit: int = 0):
    """雙向讀取端 — 全量回拉 omni_trust.entry (hash-chain 信任帳本)。
    供 app 啟動 hydration / 對帳使用。limit=0 表示全量。"""
    conn = _connect("omni_trust", DB_PWD)
    cur = conn.cursor()
    if limit and limit > 0:
        cur.execute(
            "SELECT seq, prev_hash, curr_hash, uuid, action, timestamp FROM omni_trust.entry "
            "ORDER BY seq DESC FETCH FIRST :1 ROWS ONLY",
            [limit],
        )
    else:
        cur.execute(
            "SELECT seq, prev_hash, curr_hash, uuid, action, timestamp FROM omni_trust.entry ORDER BY seq"
        )
    rows = [
        {"seq": r[0], "prev_hash": r[1], "curr_hash": r[2], "uuid": r[3], "action": r[4], "timestamp": r[5]}
        for r in cur.fetchall()
    ]
    cur.close()
    conn.close()
    return {"ok": True, "count": len(rows), "entries": rows}


def ensure_matrix():
    """建立/確保 omni_lifecycle.sync_matrix 表存在 (冪等)。"""
    try:
        ensure_schema()
    except Exception:
        pass
    conn = _connect("omni_lifecycle", DB_PWD)
    c = conn.cursor()
    c.execute(
        """
        BEGIN
          EXECUTE IMMEDIATE 'CREATE TABLE omni_lifecycle.sync_matrix (
            entity_uuid  VARCHAR2(64) PRIMARY KEY,
            origin_seq   NUMBER DEFAULT 0,
            terminal_seq NUMBER DEFAULT 0,
            status       VARCHAR2(32) DEFAULT ''synced'',
            direction    VARCHAR2(32) DEFAULT ''bidirectional'',
            updated_at   NUMBER,
            created_at   TIMESTAMP DEFAULT SYSTIMESTAMP
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
    return {"ok": True, "table": "omni_lifecycle.sync_matrix"}


def upsert_matrix(entity_uuid: str, origin_seq: int = 0, terminal_seq: int = 0, status: str = "synced", direction: str = "bidirectional"):
    """寫入/更新單筆終始矩陣狀態。"""
    conn = _connect("omni_lifecycle", DB_PWD)
    cur = conn.cursor()
    ts = int(datetime.now(timezone.utc).timestamp() * 1000)
    # 命名 bind (oracledb 允許重複引用同一 key, 避免 positional bind 計數錯誤 DPY-4009)
    cur.execute(
        """MERGE INTO omni_lifecycle.sync_matrix m
           USING (SELECT :uuid AS entity_uuid FROM dual) s
           ON (m.entity_uuid = s.entity_uuid)
           WHEN MATCHED THEN
             UPDATE SET m.origin_seq=:oseq, m.terminal_seq=:tseq, m.status=:sts, m.direction=:dir, m.updated_at=:ts
           WHEN NOT MATCHED THEN
             INSERT (entity_uuid, origin_seq, terminal_seq, status, direction, updated_at)
             VALUES (:uuid, :oseq, :tseq, :sts, :dir, :ts)""",
        {"uuid": entity_uuid, "oseq": origin_seq, "tseq": terminal_seq, "sts": status, "dir": direction, "ts": ts},
    )
    conn.commit()
    cur.close()
    conn.close()
    return {"ok": True, "entity_uuid": entity_uuid, "status": status}


def reconcile(cfg: dict):
    """雙向對帳 — 比對 app 端 origin_seq vs Oracle 端 terminal_seq。
    cfg: { entities: [{uuid, origin_seq, terminal_seq}], auto: bool }
      - origin_seq > terminal_seq => behind_oracle (app 落後, 需 push app->oracle)
      - terminal_seq > origin_seq => behind_app   (oracle 落後, 需 pull oracle->app)
      - 兩者皆非 0 且 hash 不一致   => conflict (append-only, 不強蓋, 報警)
    回傳 summary + 各實體 status。auto=true 時自動 upsert 矩陣狀態。"""
    entities = cfg.get("entities", [])
    auto = cfg.get("auto", False)
    results = []
    for e in entities:
        uuid = e.get("uuid")
        oseq = int(e.get("origin_seq", 0) or 0)
        tseq = int(e.get("terminal_seq", 0) or 0)
        if oseq == 0 and tseq == 0:
            status = "synced"
        elif oseq > tseq:
            status = "behind_oracle"   # app 有新增, Oracle 落後 -> push
        elif tseq > oseq:
            status = "behind_app"      # Oracle 有新增, app 落後 -> pull
        else:
            status = "synced"
        results.append({"uuid": uuid, "origin_seq": oseq, "terminal_seq": tseq, "status": status})
        if auto:
            upsert_matrix(uuid, oseq, tseq, status, e.get("direction", "bidirectional"))
    behind_oracle = [r for r in results if r["status"] == "behind_oracle"]
    behind_app = [r for r in results if r["status"] == "behind_app"]
    return {
        "ok": True,
        "summary": {
            "total": len(results),
            "synced": sum(1 for r in results if r["status"] == "synced"),
            "behind_oracle": len(behind_oracle),
            "behind_app": len(behind_app),
        },
        "push": behind_oracle,    # => caller 應 push app->oracle
        "pull": behind_app,       # => caller 應 pull oracle->app
        "matrix": results,
    }


def main():
    if len(sys.argv) < 2:
        print(json.dumps({"ok": False, "error": "usage: init|sync|sync-batch|read|matrix|reconcile"}))
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
        elif cmd == "read":
            # read [limit] — limit 可選, 預設全量
            limit = int(sys.argv[2]) if len(sys.argv) > 2 else 0
            out = read_entries(limit)
        elif cmd == "matrix":
            out = ensure_matrix()
        elif cmd == "reconcile":
            payload = json.loads(sys.argv[2]) if len(sys.argv) > 2 else {"entities": []}
            out = reconcile(payload)
        else:
            out = {"ok": False, "error": f"unknown cmd: {cmd}"}
    except Exception as e:
        print(json.dumps({"ok": False, "error": str(e)}))
        sys.exit(1)
    print(json.dumps(out))
    sys.exit(0)


if __name__ == "__main__":
    main()