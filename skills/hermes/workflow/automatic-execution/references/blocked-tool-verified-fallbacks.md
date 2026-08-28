# Blocked-Tool Verified Fallbacks (2026-08 session-proven)

When `terminal` (SSH-wedged: `getsockname failed` / network wall) AND
`web_extract` / `web_search` (Firecrawl credit-exhausted: `Payment Required: Insufficient credits`)
are BOTH unavailable, the two recipes below were verified to still work in a live session.

## 1. GitHub PR review via `browser_navigate` (no login needed for public/merged PRs)
- `browser_navigate(url="https://github.com/<owner>/<repo>/pull/<n>")` returned real metadata:
  title, author, head/base branch, status (Merged / Open), changed-files count, commit list —
  WITHOUT a login wall (public + already-merged PRs).
- `browser_navigate(url=".../pull/<n>/files")` returns the file list + diff hunks (the browser
  rendered the unified diff; read it back via the snapshot text).
- **Caveat — fabricated meta:** GitHub redirects `pull/new/<n>.files` to a "create new PR" page
  if PR #`<n>` doesn't exist. That redirect is itself proof the user-supplied author/branch/URL
  was wrong or invented — always cross-check against the real page before writing a review.
- **Caveat — auth wall:** draft/private PRs hit a Sign-in wall. You cannot proceed without
  credentials. Do NOT type passwords (safety rule). Report the blocker honestly.

## 2. Shell-script verification via `execute_code` → real git-bash (no `terminal`)
Verified when `terminal` is dead. Git-bash lives at `C:\Program Files\Git\bin\bash.exe` even when
the SSH backend is wedged — the wedge is in Hermes's `terminal` tool, not the local bash binary.

```python
import subprocess, os
bash = r"C:\Program Files\Git\bin\bash.exe"
env = dict(os.environ)
env["PATH"] = r"C:\Program Files\Git\bin;" + env.get("PATH", "")
# syntax check
r = subprocess.run([bash, "-n", script_path], capture_output=True, text=True, env=env, timeout=40)
print("syntax exit", r.returncode, "OK" if r.returncode == 0 else r.stderr[:200])
```

### Mock-run to prove `set -e` control flow (no live CLI available)
Create a temp dir with a stub CLI that returns empty JSON, put it FIRST on PATH, then run the real script:

```python
import subprocess, os, tempfile
bash = r"C:\Program Files\Git\bin\bash.exe"
tmp = tempfile.mkdtemp()
stub = os.path.join(tmp, "oci")            # stub the cloud CLI the script calls
open(stub, "w").write("#!/usr/bin/env bash\necho '[]'\nexit 0\n")
os.chmod(stub, 0o755)
env = dict(os.environ)
env["PATH"] = tmp + ";" + r"C:\Program Files\Git\bin;" + r"C:\Program Files\Git\usr\bin;" + env.get("PATH", "")
env.update({"TENANCY_OCID": "x", "COMPARTMENT_OCID": "x", "REGION": "ap-tokyo-1"})
r = subprocess.run([bash, script_path], capture_output=True, text=True, env=env, timeout=90)
print("exit", r.returncode)
print(r.stdout)
# PROOF: script reached its final summary line instead of aborting under set -e
```

- This proves the script does NOT early-abort when a CLI returns empty — the classic
  `set -e` + `grep -c` failure (`grep -c` exits 1 on zero matches → aborts the script).
  **Fix:** append `|| true` to every count-grep, or capture via `$(... || true)`.
- **Honesty rule:** this is **control-flow verification, not live provisioning**. Clearly label
  output as mock-backed; never claim "已安裝 / 已佈建通過" from a stub run. To close the gap,
  have the user unlock `terminal` (`hermes config set terminal.backend local` + restart Hermes),
  then run the real CLI.
