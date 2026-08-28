---
name: hermes-windows-tooling
description: Windows Hermes SSH, expanduser, and cron deliver pitfalls.
---

# Hermes Windows Tooling — Operational Gotchas

Hermes runs natively on Windows, but a few backend behaviors differ from
Linux/macOS. These three patterns burned real sessions; encode them so the next
one doesn't re-discover them from scratch.

## Pattern 1 — Terminal SSH backend is broken on Windows

**Symptom:** After `hermes config set terminal.backend ssh`, every `terminal` call
fails with:
```
SSH connection failed: getsockname failed: Not a socket
Read from remote host <host>: Unknown error
```
Even after writing the 6 "ssh_*" keys, the SSH backend never authenticates.

**Root cause:** On Windows the paramiko-based SSH backend can't establish the local
socket. Also, `terminal` only recognizes these keys (from `hermes-agent`
configuration reference):
- `backend` (local | docker | ssh | modal | daytona | singularity)
- `cwd`
- `timeout`

`terminal.ssh_key`, `terminal.ssh_host`, `terminal.ssh_user`, `terminal.ssh_port`
are **NOT recognized config keys** — Hermes prints a benign
"not a recognized config key" warning and ignores them. Setting
`backend: ssh` + those keys locks the `terminal` tool into a failing SSH path, and
even `hermes config set terminal.backend local` *from inside that same session*
fails (the tool tries SSH before reaching the command).

**Fix (verified reliable path):** Keep `terminal.backend: local`. Reach remote
hosts via the local `ssh` binary + a working `~/.ssh/config` alias:
```bash
# ~/.ssh/config
Host esggo-vps
    HostName 161.118.248.180
    User ubuntu
    IdentityFile ~/.ssh/esggo_original
```
Then `ssh esggo-vps "uptime"` works from any `terminal` call. **Do NOT set
`backend: ssh` on Windows.**

**Recovery if already locked:** A background session with `backend: ssh` cannot fix
itself (config changes need a Hermes restart to reload, and the tool fails before
reaching the command). Have the user run `hermes config set terminal.backend local`
in a fresh PowerShell, then fully restart Hermes.

## Pattern 2 — os.path.expanduser("~/...") → mixed-separator paths

**Symptom:** A Python script run under Git-Bash/MSYS on Windows writes a state file
with `os.path.expanduser("~/.hermes/scripts/x.state")`, but on the next run
`os.path.exists` says it's gone, or `subprocess.run([sys.executable, SENDER])`
fails with `can't open file 'C:\Users\dingj/.hermes/scripts/_send_tg_alert.py'`.

**Root cause:** Under Git-Bash, `~` expands to `/c/Users/dingj` while Python's
`expanduser` returns `C:\Users\dingj`, producing a hybrid like
`C:\Users\dingj/.hermes/scripts/...`. `open()` sometimes tolerates it, but
`subprocess` arg resolution and cross-call `exists` checks do not — state silently
fails to persist and sender paths don't resolve.

**Fix:** Use absolute Windows paths with raw strings. Never use `expanduser` for
files the script must reliably read back or pass to subprocesses:
```python
_SCRIPT_DIR = r"C:\Users\dingj\AppData\Local\hermes\scripts"
STATE_FILE  = os.path.join(_SCRIPT_DIR, "oa-twins-tracker.state")
SENDER      = os.path.join(_SCRIPT_DIR, "_send_tg_alert.py")
ALERT_FILE  = os.path.join(_SCRIPT_DIR, "_auto_repair_alert.txt")
```
This was the actual fix that made an OA-TWINS tracker's state persist and its
Telegram sender resolve (previously `telegram_sent: 0` despite a working sender).

## Pattern 3 — cron deliver:all fails on the platform Telegram layer

**Symptom:** A cron job's `last_status` is `error` with
`delivery error: Telegram send failed: httpx.ConnectError: [Errno 11001] getaddrinfo failed`
(or `Timed out`), even though the job's own logic succeeded and `execution_success`
may be false because the agent aborted mid-run.

**Root cause:** `deliver: all` makes the Hermes *platform* attempt to push the run
result to Telegram. If the platform's Telegram delivery isn't configured/parented
correctly, that push throws and the whole cron is marked `error`.

**Fix:** Set `deliver: local` so the platform doesn't try to push. Have the script
send notifications itself via a local sender (e.g. one that reconstructs the bot
token from a local secrets file). Verified: with `deliver: local` the same job runs
`ok` with `last_delivery_error: null`. See `templates/local_telegram_sender.py`
for a reusable sender skeleton.

> Note: the `esggo-oa-team-swarm` skill's cron-notification section previously
> recommended `deliver: all` for notification crons. It has been corrected to match
> the verified Windows behavior above (`deliver: local` + script-self-send).

## Pattern 4 — search_files / read_file path format under git-bash

**Symptom:** `search_files` with `path: "C:/Project/..."` (or `C:\...`) returns:
```
Search failed: rg: ...: IO error for operation on C:\Project\...: 系統找不到指定的路徑。 (os error 3)
```
even though the file EXISTS and `read_file` with the same `C:\...` path opens it fine.

**Root cause:** The rg backend behind `search_files` runs under MSYS/git-bash and does
NOT resolve the `C:/` or `C:\` drive prefix. `read_file` tolerates it; `search_files` doesn't.

**Fix:** Use MSYS-style forward-slash paths with a lowercase drive letter: `/c/Project/...`.
This also works for `terminal` commands. Verified command that WORKED this session:
```bash
grep -nE '^#{1,3} ' /c/Project/esggo/esggo-omni-center/soul-full.md
```
- `read_file` with `C:\Project\...` (backslash) is fine — only `search_files` needs `/c/...`.
- `terminal` itself is git-bash: `/c/...`, `ls`, `$HOME` all work; avoid PowerShell builtins
  (`Get-ChildItem`, `$env:FOO`) — they fail under the bash backend.
- When in doubt and calls are independent, batch `terminal` grep calls in one turn rather
  than fighting `search_files` path parsing.

## Pattern 5 — ESM module path resolution on Windows (fileURLToPath)

**Symptom:** A Node.js ESM script using `new URL(import.meta.url).pathname` to derive
`__dirname`, then calling `path.resolve(__dirname, '..')`, produces paths like
`C:\\C:\\Project\\...` (double drive prefix) or URL-encoded paths with `%3A` for colons.

**Root cause:** `new URL(import.meta.url).pathname` returns a URL-encoded
`file:///C:/Project/...` pathname where `:` is NOT yet decoded back to a native
Windows path separator. On git-bash/MSYS this double-resolves, causing
`ENOENT` errors like `open 'C:\\C:\\Project\\...\\file.ts'`.

**Fix:** Use `fileURLToPath` from `node:url` to properly decode the file URL:
```javascript
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);  // Correctly: C:\Project\...
```
Never use `new URL(import.meta.url).pathname` directly for filesystem paths on Windows.
This was verified in `scripts/verify-float-matrix.mjs` — before the fix, all file reads
failed with ENOENT; after, they resolved correctly.

## Verification checklist
- Terminal: `hermes config get terminal.backend` → must be `local` on Windows.
- Script state: after a run, `cat` the *absolute-path* state file to confirm it
  persisted (don't trust the script's own success print — a later `os.path.exists`
  in a subprocess can disagree).
- Cron: a job that does real work should show `last_status: ok` and
  `last_delivery_error: null` with `deliver: local`.

## Pitfalls
- Don't set `terminal.backend: ssh` on Windows to "fix" remote access — it locks
  the tool. Use local backend + `ssh` alias.
- Don't treat "not a recognized config key" warnings as harmless when they concern
  the exact key you're relying on — Hermes ignores them.
- `gh secret` values are **NOT retrievable** (GitHub API provides no read-value).
  A local cron cannot read a GitHub secret's value; store tokens in a local file
  the script can read instead (see split-token vault pattern in project skills).
- Don't rely on a subagent cron prompt to "parse JSON then call script" — that
  chain is fragile. Put the whole detect→notify→persist logic in ONE script and
  have the cron run only that script.
