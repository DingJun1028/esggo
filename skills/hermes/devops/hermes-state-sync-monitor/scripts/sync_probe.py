#!/usr/bin/env python3
# scripts/sync_probe.py — read-only opencode/Hermes sync-health probe.
# Run: python3 scripts/sync_probe.py
# No writes to state.db. Safe for cron check jobs.
import sqlite3, json, os, time, datetime, re

def native_path(p):
    # git-bash/MSYS passes /c/Users/... — SQLite on Windows can't resolve that
    # to the real WAL; convert to native C:/Users/... (see 2026-08-06 probe failure).
    if re.match(r'^/[a-zA-Z]/', p):
        p = p[1].upper() + ':' + p[2:]
    return os.path.normpath(p)

def utc(ms):
    return datetime.datetime.fromtimestamp(int(ms)/1000, datetime.timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')

def age_h(ms, now_ms):
    return (now_ms - int(ms)) / 3_600_000

LOCAL = native_path(os.environ.get('LOCALAPPDATA', os.path.expanduser('~/.local/share')))
HERMES = os.path.join(LOCAL, 'hermes')
STATE_DB = os.path.join(HERMES, 'state.db')
CRON = os.path.join(HERMES, 'cron')
EXEC_DB = os.path.join(CRON, 'executions.db')
JOBS = os.path.join(CRON, 'jobs.json')
BASELINE = os.path.join(CRON, 'opencode_sync_baseline.json')

# opencode.db candidates
OC_CANDIDATES = [
    os.path.expanduser('~/.local/share/opencode/opencode.db'),
    os.path.join(LOCAL, '..', 'opencode', 'opencode.db'),
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
except Exception as e:
    print('state.db read error:', e)

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
print('\n=== opencode.db activity ===')
oc = None
for c in OC_CANDIDATES:
    if os.path.exists(c):
        oc = c
        break
if oc:
    mt = utc(int(os.path.getmtime(oc)*1000))
    wal = os.path.join(os.path.dirname(oc), 'opencode.db-wal')
    wal_b = os.path.getsize(wal) if os.path.exists(wal) else -1
    shm = os.path.join(os.path.dirname(oc), 'opencode.db-shm')
    shm_mt = utc(int(os.path.getmtime(shm)*1000)) if os.path.exists(shm) else 'n/a'
    print(f'  path: {oc}')
    print(f'  main mtime: {mt}  (idle if old)')
    print(f'  -wal bytes: {wal_b}  (0 = no pending writes)')
    print(f'  -shm mtime: {shm_mt}  (open signal, NOT a write signal)')
    idle = (now_ms - int(os.path.getmtime(oc)*1000)) / 3_600_000 > 1 and wal_b <= 0
    print(f'  => CLASSIFICATION: {"BENIGN staleness (idle, wal empty)" if idle else "CHECK: source may be active"}')
else:
    print('  opencode.db NOT FOUND')

# 3) cron job liveness
print('\n=== sync cron job liveness ===')
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
    print('  cron exec read error:', e)

# 4) baseline diff
print('\n=== baseline diff (vs last run) ===')
snap = {
    'checked_at_ms': now_ms,
    'watermarks': wm,
    'opencode_db': oc,
}
if os.path.exists(BASELINE):
    prev = json.load(open(BASELINE))
    pwm = prev.get('watermarks', {})
    for k in ('opencode_local_last_sync', 'opencode_vps_last_sync'):
        if wm.get(k) == pwm.get(k):
            print(f'  {k}: UNCHANGED since last run')
        else:
            print(f'  {k}: CHANGED {pwm.get(k)} -> {wm.get(k)}')
else:
    print('  no prior baseline (first run)')
json.dump(snap, open(BASELINE, 'w'), ensure_ascii=False, indent=2)
print('  baseline updated:', BASELINE)

print('\n=== VPS side ===')
print('  UNREACHABLE (Hermes SSH backend broken; no public sync HTTP endpoint). Do not SSH.')
