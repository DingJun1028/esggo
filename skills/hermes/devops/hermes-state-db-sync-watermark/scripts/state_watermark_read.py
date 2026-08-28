#!/usr/bin/env python3
"""Read Hermes state.db opencode sync watermarks (read-only, WAL-safe)."""
import sqlite3, time, os

p = r"C:/Users/dingj/AppData/Local/hermes/state.db"
if not os.path.exists(p):
    print("ERROR: state.db not found at", p)
    raise SystemExit(2)

con = sqlite3.connect(f"file:{p}?mode=ro", uri=True)
con.execute("PRAGMA busy_timeout=8000")
cur = con.cursor()
now_ms = int(time.time() * 1000)

def fmt(ms):
    if not ms:
        return "n/a"
    try:
        return time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(int(ms) / 1000)) + f" (age={(now_ms-int(ms))/1000/3600:.1f}h)"
    except Exception:
        return str(ms)

print(f"state.db: {p}  size_MB={round(os.path.getsize(p)/1024/1024,1)}")
for k, v in cur.execute("SELECT key,value FROM state_meta WHERE key LIKE '%last_sync%'"):
    print(f"  {k} = {fmt(v)}")
con.close()
