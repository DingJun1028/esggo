#!/usr/bin/env python3
# debug_state.py — investigate state.db table visibility + WAL state
import sqlite3, os, time

p = r"C:/Users/dingj/AppData/Local/hermes/state.db"
wal = p + "-wal"
shm = p + "-shm"
print("main exists:", os.path.exists(p), "size:", os.path.getsize(p) if os.path.exists(p) else -1)
print("wal exists:", os.path.exists(wal), "size:", os.path.getsize(wal) if os.path.exists(wal) else -1)
print("shm exists:", os.path.exists(shm), "size:", os.path.getsize(shm) if os.path.exists(shm) else -1)

for label, uri in [
    ("ro_uri", f"file:{p}?mode=ro"),
    ("normal_uri", f"file:{p}"),
    ("ro_immutable", f"file:{p}?mode=ro&immutable=1"),
]:
    print(f"\n=== {label} ===")
    try:
        con = sqlite3.connect(uri, uri=True)
        con.execute("PRAGMA busy_timeout=8000")
        try:
            pc = con.execute("PRAGMA page_count").fetchone()[0]
            print("  page_count:", pc)
        except Exception as e:
            print("  page_count err:", e)
        rows = con.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall()
        print("  tables:", [r[0] for r in rows])
        con.close()
    except Exception as e:
        print("  OPEN ERR:", e)
