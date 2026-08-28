#!/usr/bin/env python3
# probe_corrected.py — read-only opencode/Hermes sync-health probe (native path fix).
import sqlite3, os, time, datetime, json

def utc(ms):
    return datetime.datetime.fromtimestamp(int(ms)/1000, datetime.timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')

def age_h(ms, now_ms):
    return (now_ms - int(ms)) / 3_600_000

# Native Windows path (NOT MSYS /c/...) — required for SQLite WAL resolution.
STATE_DB = r"C:/Users/dingj/AppData/Local/hermes/state.db"
CRON = r"C:/Users/dingj/AppData/Local/hermes/cron"
EXEC_DB = os.path.join(CRON, 'executions.db')
JOBS = os.path.join(CRON, 'jobs.json')
BASELINE = os.path.join(CRON, 'opencode_sync_baseline.json')

OC_CANDIDATES = [
    r"C:/Users/dingj/.local/share/opencode/opencode.db",
    r"C:/Users/dingj/AppData/Local/opencode/opencode.db",
]

now_ms = int(time.time()*1000)
print('NOW:', utc(now_ms), f"({now_ms})")

# 1) watermarks
wm = {}
try:
    con = sqlite3.connect(f"file:{STATE_DB}?mode=ro", uri=True)
    con.execute("PRAGMA busy_timeout=8000")
    cur = con.cursor()
    for k, v in cur.execute("SELECT key,value FROM state_meta WHERE key LIKE '%last_sync%' OR key LIKE '%bridge_last_id%'"):
        wm[k] = v
    con.close()
    print("state.db: OK (read-only)")
except Exception as e:
    print('state.db read error:', repr(e))

print('\n=== sync watermarks ===')
for k in ('opencode_local_last_sync', 'opencode_vps_last_sync'):
    v = wm.get(k)
    if v is None:
        print(f'  {k}: MISSING')
    else:
        print(f'  {k}: {v} | {utc(v)} | age_h={age_h(v, now_ms):.2f}')
bid = wm.get('telegram_vps_bridge_last_id')
print(f'  telegram_vps_bridge_last_id: {bid} (counter, not timestamp)')

# 2) opencode.db activity
print('\n=== opencode.db activity (source) ===')
oc = None
for c in OC_CANDIDATES:
    if os.path.exists(c):
        oc = c
        break
if oc:
    mt_ms = int(os.path.getmtime(oc)*1000)
    wal = os.path.join(os.path.dirname(oc), 'opencode.db-wal')
    wal_b = os.path.getsize(wal) if os.path.exists(wal) else -1
    print(f'  path: {oc}')
    print(f'  main mtime: {utc(mt_ms)}  (idle if old)')
    print(f'  -wal bytes: {wal_b}  (0 = no pending writes)')
    idle = (now_ms - mt_ms) / 3_600_000 > 1 and wal_b <= 0
    print(f'  => source CLASSIFICATION: {"IDLE (benign staleness if watermark old)" if idle else "ACTIVE (watermark staleness = bridge break!)"}')
else:
    print('  opencode.db NOT FOUND')

# 3) cron job liveness (best-effort)
print('\n=== sync cron job liveness ===')
if os.path.exists(JOBS) and os.path.exists(EXEC_DB):
    try:
        jobs = json.load(open(JOBS))
        job_list = jobs.get('jobs', []) if isinstance(jobs, dict) else jobs
        oc_job_ids = {j.get('id'): j.get('name') for j in job_list
                      if 'opencode' in (j.get('name','') + j.get('id','')).lower()}
        con = sqlite3.connect(EXEC_DB)
        cur = con.cursor()
        for jid, name in oc_job_ids.items():
            row = cur.execute(
                "SELECT status, started_at, finished_at FROM executions WHERE job_id=? ORDER BY started_at DESC LIMIT 1",
                (jid,)).fetchone()
            if row:
                print(f'  [{name}] last: status={row[0]} started={row[1]} finished={row[2] or "running"}')
            else:
                print(f'  [{name}] no executions found')
        con.close()
    except Exception as e:
        print('  cron exec read error:', repr(e))
else:
    print(f'  cron store NOT at {CRON} (jobs.json/executions.db absent) — liveness check skipped locally.')

# 4) baseline diff (best-effort write inside cron dir)
print('\n=== baseline diff (vs last run) ===')
snap = {'checked_at_ms': now_ms, 'watermarks': wm, 'opencode_db': oc}
if os.path.exists(BASELINE):
    try:
        prev = json.load(open(BASELINE))
        pwm = prev.get('watermarks', {})
        for k in ('opencode_local_last_sync', 'opencode_vps_last_sync'):
            if wm.get(k) == pwm.get(k):
                print(f'  {k}: UNCHANGED since last run')
            else:
                print(f'  {k}: CHANGED {pwm.get(k)} -> {wm.get(k)}')
    except Exception as e:
        print('  baseline read error:', repr(e))
else:
    print('  no prior baseline (first successful read)')
try:
    os.makedirs(CRON, exist_ok=True)
    json.dump(snap, open(BASELINE, 'w'), ensure_ascii=False, indent=2)
    print('  baseline updated:', BASELINE)
except Exception as e:
    print('  baseline write skipped:', repr(e))

print('\n=== VPS side ===')
print('  UNREACHABLE (Hermes SSH backend broken; no public sync HTTP endpoint). Do not SSH.')
