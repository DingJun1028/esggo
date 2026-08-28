---
name: hermes-auth-lock-repair
version: 1
author: oa-team
license: agpl-3.0
description: Hermes auth 鎖逾時診斷與修復。
metadata:
  hermes:
    tags: [hermes, auth, lock, debug]
    related_skills: [hermes-state-db-maintenance, hermes-webui-slow-diagnose]
---

# Hermes auth-store lock timeout 診斷與修復

Use when an Hermes agent (CLI or desktop) fails init with:
`agent init failed: Timed out waiting for auth store lock`
or any `Timed out waiting for auth store lock` from `hermes_cli/auth.py`.

## How the lock works (read before touching files)
- The lock is a **Windows kernel advisory lock** via `msvcrt.locking()` on a
  `*.lock` file (`auth.json.lock`, `shared/nous_auth.lock`). It is held by a
  **live file handle**, not by the mere presence of the file.
- Lock timeout is `AUTH_LOCK_TIMEOUT_SECONDS = 15.0` in `auth.py`.
- A timeout means a **live** process is holding the lock handle. The store is
  written **atomically**: `auth.json.tmp.{pid}.{uuid}` → `os.replace()` into
  `auth.json`. If a process dies mid-write, that tmp is orphaned.
- On parse failure the loader copies the bad file to `auth.json.corrupt`
  (evidence), then starts with an empty store.

## Do NOT
- Do NOT delete `auth.lock` / `nous_auth.lock` blindly — they are advisory and
  may be held by a live process.
- Do NOT delete `auth.json` — it holds real credentials; only remove `*.tmp.*`.
- Do NOT delete `auth.json.corrupt` — quarantine it for evidence.

## Diagnostic + repair procedure (self-contained)
Run with the Hermes venv Python so the lock logic matches exactly:
`%LOCALAPPDATA%/hermes/hermes-agent/venv/Scripts/python.exe`

```python
import os, json, glob, re, datetime, subprocess, msvcrt
from pathlib import Path

home = Path(os.environ["LOCALAPPDATA"]) / "hermes"
auth = home / "auth.json"

# 1) Validate the real store (do NOT touch if it parses)
print("=== validate auth.json ===")
if auth.exists():
    try:
        raw = json.loads(auth.read_text(encoding="utf-8-sig"))
        ok = isinstance(raw, dict) and (
            isinstance(raw.get("providers"), dict)
            or isinstance(raw.get("credential_pool"), dict)
            or isinstance(raw.get("systems"), dict)
        )
        print("parsed OK; schema_valid =", ok)
    except Exception as e:
        print("!! PARSE FAILED:", repr(e))
else:
    print("auth.json MISSING (fresh store created on next init)")

# 2) Live PIDs — use wmic (ASCII) because tasklist/CSV is not utf-8 safe
print("=== live PIDs ===")
live = set()
try:
    out = subprocess.check_output("wmic process get ProcessId",
                                  shell=True, text=True, errors="ignore")
    for ln in out.splitlines():
        ln = ln.strip()
        if ln.isdigit():
            live.add(int(ln))
except Exception as e:
    print("wmic failed:", e)
print("live pid count:", len(live))

# 3) Remove ONLY orphan auth tmp files (pid not alive)
print("=== remove orphan auth tmp ===")
for tmp in glob.glob(str(home / "auth.json.tmp.*")):
    m = re.search(r"tmp\.(\d+)\.", tmp)
    pid = int(m.group(1)) if m else None
    if pid is None or pid not in live:
        print("  removing orphan tmp (pid=%s): %s" % (pid, tmp))
        try:
            os.remove(tmp); print("    -> removed")
        except Exception as e:
            print("    -> FAILED:", e)
    else:
        print("  KEEPING tmp held by LIVE pid %s: %s" % (pid, tmp))

# 4) Quarantine stale corrupt (keep evidence, never delete)
print("=== quarantine auth.json.corrupt ===")
corrupt = home / "auth.json.corrupt"
if corrupt.exists():
    dst = home / ("auth.json.corrupt.quarantine-%s"
                  % datetime.datetime.now().strftime("%Y%m%d-%H%M%S"))
    try:
        os.replace(str(corrupt), str(dst)); print("  ->", dst)
    except Exception as e:
        print("  FAILED:", e)
else:
    print("  none present")

# 5) Re-test both locks with the EXACT msvcrt logic
print("=== re-test locks ===")
for lp in [str(home / "auth.lock"), str(home / "shared/nous_auth.lock")]:
    p = Path(lp)
    if not p.exists() or p.stat().st_size == 0:
        p.write_text(" ", encoding="utf-8")
    try:
        f = p.open("r+", encoding="utf-8"); f.seek(0)
        msvcrt.locking(f.fileno(), msvcrt.LK_NBLCK, 1)
        f.seek(0); msvcrt.locking(f.fileno(), msvcrt.LK_UNLCK, 1); f.close()
        print("  FREE:", lp)
    except OSError as e:
        print("  HELD (live holder!):", lp, e)
print("=== DONE ===")
```

## Verification (must pass before claiming fixed)
- `auth.json` parses and `schema_valid = True` (or is absent → fresh store OK).
- No `auth.json.tmp.*` remains.
- `auth.json.corrupt` renamed to quarantine.
- Both `auth.lock` and `shared/nous_auth.lock` report `FREE`.

If a lock reports `HELD` after cleanup, a live Hermes process still owns it:
list processes (`wmic process where "name='Hermes.exe'" get ProcessId`), then
stop the offending instance gracefully (do NOT kill -9 mid-write) before retrying.

## Pitfalls
- `tasklist /FO CSV` is NOT utf-8 safe on some locales (byte 0xac decode
  error) — use `wmic process get ProcessId` for ASCII-safe PID enumeration.
- The lock file being FREE does NOT mean "delete it is safe" — only remove
  `*.tmp.*` and quarantine `*.corrupt`. Leave `*.lock` in place.
- Multiple Hermes instances launching together cause 15s contention; if the
  error recurs, stagger startup or reduce concurrent instances rather than
  raising the timeout blindly.
- The venv python path differs per install; verify
  `%LOCALAPPDATA%/hermes/hermes-agent/venv/Scripts/python.exe` exists before
  running the script.
