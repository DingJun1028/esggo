# Windows Path Handling for Swarm Scripts

## Session Context
During OA-Team 30 swarm deployment on Windows host (C:\Users\dingj), scripts using `/tmp/` paths failed with "No such file or directory" errors.

## Root Cause
The bash shell in Windows (git-bash/MSYS) maps `/c/` to `C:\`, but does NOT map `/tmp/` to `C:\tmp\`. Bare `/tmp/` paths resolve to `\tmp\...` which doesn't exist on Windows.

## Error Example
```
C:\Users\dingj\AppData\Roaming\uv\python\cpython-3.11-windows-x86_64-none\python.exe: 
can't open file 'C:\\tmp\\oateam-scripts\\monitor_health.py': [Errno 2] No such file or directory
```

## Fix Applied
Changed script execution from:
```bash
python /tmp/oateam-scripts/monitor_health.py
```
To:
```bash
python C:/tmp/oateam-scripts/monitor_health.py
```

And created directories with Windows paths:
```bash
mkdir -p C:/tmp/oateam-data C:/tmp/oateam-metrics C:/tmp/oateam-scripts C:/tmp/oateam-templates
```

## Path Mapping Reference

| Unix Path | Windows MSYS Path | Windows Native Path |
|-----------|-------------------|---------------------|
| `/tmp/` | `/c/tmp/` | `C:\tmp\` |
| `/home/user/` | `/c/Users/user/` | `C:\Users\user\` |
| `/var/log/` | `/c/var/log/` | `C:\var\log\` |

## Script Configuration Pattern
```python
import os
import platform

# Detect platform and set base path
if platform.system() == 'Windows':
    BASE_DIR = '/c/tmp/oateam-data'
else:
    BASE_DIR = '/tmp/oateam-data'

# Or use environment variable with fallback
BASE_DIR = os.environ.get('OATEAM_DATA_DIR', '/c/tmp/oateam-data')
```

## Verification Commands
```bash
# Check directory exists
ls -d C:/tmp/oateam-data

# Check scripts are deployed
ls C:/tmp/oateam-scripts/

# Test script execution
python C:/tmp/oateam-scripts/monitor_health.py

# Check file outputs
ls -la C:/tmp/oateam-data/
```