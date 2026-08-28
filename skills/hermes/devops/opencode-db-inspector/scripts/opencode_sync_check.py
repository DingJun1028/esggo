#!/usr/bin/env python3
"""opencode.db local sync/consistency check (read-only).

Run via terminal (execute_code is BLOCKED in cron mode):
  "/c/Users/dingj/AppData/Local/hermes/hermes-agent/venv/Scripts/python" opencode_sync_check.py
  # or: python3 opencode_sync_check.py

Exit codes: 0 = CONSISTENT, 1 = INCONSISTENT, 2 = DB not found.
"""
import sqlite3, os, sys

CANDIDATES = [
    os.path.expanduser("~/.local/share/opencode/opencode.db"),
    os.path.join(os.environ.get("LOCALAPPDATA", ""), "opencode", "opencode.db"),
    os.path.join(os.environ.get("APPDATA", ""), "..", "opencode", "opencode.db"),
    r"C:\Users\dingj\AppData\opencode\opencode.db",
]


def find_db():
    for c in CANDIDATES:
        p = os.path.normpath(c)
        if p and os.path.exists(p):
            return p
    return None


def main():
    db = find_db()
    if not db:
        print("ERROR: opencode.db not found in any candidate path")
        sys.exit(2)
    print(f"DB: {db}  size_MB={round(os.path.getsize(db) / 1024 / 1024, 1)}")

    con = sqlite3.connect(db)
    cur = con.cursor()

    def q1(s, *a):
        cur.execute(s, a)
        return cur.fetchone()[0]

    n_session = q1("SELECT COUNT(*) FROM session")
    n_message = q1("SELECT COUNT(*) FROM message")
    n_sm = q1("SELECT COUNT(*) FROM session_message")
    n_event = q1("SELECT COUNT(*) FROM event")
    n_wm = q1("SELECT COUNT(*) FROM event_sequence")
    n_mig = q1("SELECT COUNT(*) FROM migration")
    print(f"counts: session={n_session} message={n_message} session_message={n_sm} "
          f"event={n_event} event_sequence(watermark)={n_wm} migration={n_mig}")

    orphan_msg = q1("SELECT COUNT(*) FROM message WHERE session_id NOT IN (SELECT id FROM session)")

    lag = ahead = orphan_wm = 0
    for agg, seq in cur.execute("SELECT aggregate_id, seq FROM event_sequence").fetchall():
        if not q1("SELECT COUNT(*) FROM session WHERE id=?", agg):
            orphan_wm += 1
            continue
        mx = q1("SELECT COALESCE(MAX(seq), 0) FROM event WHERE aggregate_id=?", agg)
        if seq < mx:
            lag += 1
        elif seq > mx:
            ahead += 1

    pending = q1("SELECT COUNT(*) FROM migration WHERE time_completed IS NULL")
    print(f"orphan_messages={orphan_msg}  watermark_lag={lag}  watermark_ahead={ahead}  "
          f"orphan_watermark={orphan_wm}  migrations_pending={pending}")

    con.close()
    ok = (orphan_msg == 0 and lag == 0 and ahead == 0 and orphan_wm == 0 and pending == 0)
    print("RESULT:", "CONSISTENT" if ok else "INCONSISTENT — review above")
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
