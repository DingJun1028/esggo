# Offline Bash Verification (no terminal tool)

Proven recipe used when `terminal`/SSH is locked. `execute_code` runs Python and can
shell out to a local Git-bash binary even though the `terminal` tool is dead.

## 1. Find Git-bash
```python
import os, glob
cands = glob.glob(r"C:\Program Files\Git\bin\bash.exe") \
      + glob.glob(r"C:\Program Files\Git\usr\bin\bash.exe")
bash = cands[0] if cands else None   # typically C:\Program Files\Git\bin\bash.exe
```
Do NOT assume `bash`/`sh` is on PATH — the WSL relay may report "sh not found on PATH".

## 2. Syntax check
```python
import subprocess
r = subprocess.run([bash, "-n", path], capture_output=True, text=True,
                   env={**os.environ, "PATH": r"C:\Program Files\Git\bin;"+os.environ.get("PATH","")})
# exit 0 => SYNTAX OK
```

## 3. set -e hazard scan
```python
for ln in open(path, encoding="utf-8").read().splitlines():
    if ("grep -c" in ln or "grep -vc" in ln) and "|| true" not in ln:
        print("HAZARD:", ln.strip())
```
Fix: append `|| true` and compute the boolean explicitly, e.g.
`BAD=$(echo "$X" | grep -vc 'pat' || true); [ "${BAD:-0}" = "0" ] && echo 1 || echo 0`

## 4. Mock-run (control-flow verification)
```python
import tempfile, os
tmp = tempfile.mkdtemp()
open(f"{tmp}/oci","w").write("#!/usr/bin/env bash\necho '[]'\nexit 0\n"); os.chmod(f"{tmp}/oci",0o755)
e = {**os.environ, "PATH": f"{tmp};C:\\Program Files\\Git\\bin;"+os.environ.get("PATH",""),
     "TENANCY_OCID":"ocid1.t","COMPARTMENT_OCID":"ocid1.c", ...export all the script needs }
r = subprocess.run([bash, script_path], capture_output=True, text=True, env=e, timeout=90)
# r.returncode==0 and "最終總結/佈建完成" in r.stdout  => reached end, no early abort
```
This proves the script does NOT abort under `set -euo pipefail` and that all steps run.
It is NOT live provisioning — the `oci` calls are stubbed. Say so in the report.

## 5. Extract & verify a heredoc-embedded sub-script
```python
import re
txt = open(script, encoding="utf-8").read()
m = re.search(r"cat > (\S+) <<'(\w+)'\n(.*?)\n\2", txt, re.S)
open(out_path,"w").write(m.group(3)+"\n")   # then bash -n it
```
