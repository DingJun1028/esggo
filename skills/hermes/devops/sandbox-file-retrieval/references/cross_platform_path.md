# Cross-platform path pitfall when porting Windows-authored code

## Symptom
A path helper that worked on the user's Windows host fails under the Docker
sandbox (Linux) test run with:
```
AssertionError: '/c/Users/...' == 'C:/Users/...'
```
or `os.path.abspath` prefixes the cwd because the path was treated as relative.

## Root cause
`os.path.isabs("C:\\Users\\x.mp4")` returns **False** on Linux/macOS — those
platforms don't recognize a Windows drive letter as an absolute path. So a
helper built on `os.path.abspath(file_path)` silently rewrites
`C:\Users\x.mp4` into `<cwd>/C:/Users/x.mp4` on Linux.

## Fix
Detect Windows drive-letter paths explicitly before calling abspath:
```python
import os, re

def format_concat_path(file_path: str) -> str:
    is_windows_abs = bool(re.match(r"^[A-Za-z]:[\\/]", file_path or ""))
    if os.path.isabs(file_path) or is_windows_abs:
        absolute = file_path
    else:
        absolute = os.path.abspath(file_path)
    return absolute.replace("\\", "/")
```

## Testing note
When writing cross-platform tests, assert both a POSIX absolute path
(`/abs/x.mp4`) and a Windows drive path (`C:\x.mp4`) resolve unchanged. Don't
use a Windows path alone on a Linux host — that is an invalid test case, not a
code bug.

## Real occurrence
Porting MoneyPrinterTurbo's `format_ffmpeg_concat_path` into aistation's
`src/mpt_core.py`: the original `os.path.abspath` broke under the Linux pytest
venv. Fixed with the explicit drive-letter guard above.
