# Windows Python path gotcha (Git-Bash + Windows Python)

## Symptom
A Python script on Windows that uses `os.path.expanduser("~/...")` produces a
**mixed-separator path** like:
```
C:\Users\dingj/.hermes/scripts/oa-twins-tracker.state
```
Two failures result:
1. `os.path.exists()` / `open()` may intermittently fail to find a file written to
   that same mixed path (state file "disappears" between script runs).
2. `subprocess.run([sys.executable, "C:\Users\dingj/.hermes/scripts/_send_tg_alert.py"])`
   fails with `[Errno 2] No such file or directory` because the mixed separator
   confuses the Windows Python subprocess launcher.

## Root cause
`os.path.expanduser("~")` on Windows Python resolves `~` to the `HOME` env var, which
in Git-Bash is `/c/Users/dingj` (MSYS style), producing a path that mixes `/` and `\`.
Python's path functions are usually tolerant, but `subprocess` + `os.path.exists`
across the bash/Windows boundary are not reliably consistent.

## Fix (verified)
In scripts intended to run under Windows Python, **hardcode absolute Windows paths**
instead of `expanduser`:
```python
_STATE_DIR = r"C:\Users\dingj\AppData\Local\hermes\scripts"
STATE_FILE = os.path.join(_STATE_DIR, "oa-twins-tracker.state")
ALERT_FILE = os.path.join(_STATE_DIR, "_auto_repair_alert.txt")
SENDER     = os.path.join(_STATE_DIR, "_send_tg_alert.py")
```
`os.path.join` with a backslash-rooted `_STATE_DIR` yields consistent `C:\...` paths
that `open`, `os.path.exists`, and `subprocess.run([python, script])` all resolve.

## Caveat
If the user's home dir is not `C:\Users\dingj`, the hardcoded path breaks. For
portability, fall back to a sanitized `expanduser` only after replacing `/` with `\`:
```python
import os, re
home = os.path.expanduser("~").replace("/", "\\")
_STATE_DIR = os.path.join(home, "AppData", "Local", "hermes", "scripts")
```
But the proven-stable approach in the OA-TWINS deployment is the hardcoded path.
