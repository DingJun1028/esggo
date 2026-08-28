---
name: hermes-terminal-cron-troubleshooting
description: "Fix Hermes terminal SSH and cron execution failures."
version: 1.0.0
license: MIT
platforms: [windows, linux, macos]
---

# Hermes Terminal & Cron Troubleshooting

## When to use this skill
- `terminal` tool errors with `SSH connection failed: getsockname failed: Not a socket`
- `hermes config set terminal.ssh_key ...` warns **"not a recognized config key"**
- A cron job fails with `provider authentication error` and its config shows `provider: opencode-zen`
- A `no_agent` script-type cron job fails with `subprocess.run() got multiple values for keyword argument 'encoding'`

---

## Root cause 1 — SSH wedge: missing `terminal.ssh_key` config (NOT an invalid key)

**CORRECTION 2026-08-08**: A prior version of this skill claimed `terminal.ssh_key` is an *"invalid config key"*. That is **false**. Per `hermes-agent` skill §2.3 and verified in this session, `terminal.ssh_key` IS a recognized key — it specifies the SSH private key path for the SSH backend. Omitting it causes the wedge below.

The `terminal` backend config accepts:
- `backend` → `local` | `docker` | `ssh` | `modal` | `daytona` | `singularity`
- `cwd`
- `timeout` (default 180)
- `ssh_host` → SSH target IP/hostname
- `ssh_user` → SSH login user
- `ssh_port` → SSH port (default 22)
- `ssh_key` → absolute path to SSH private key (**REQUIRED when backend=ssh**)

When `backend: ssh` is set but `ssh_key` is missing, the SSH backend falls back to `ssh-agent`. If the key is not loaded in ssh-agent (common for freshly downloaded OCI keys), the handshake fails → `getsockname failed: Not a socket`.

### ✅ Fix (verified 2026-08-03/08)
```powershell
# Set ALL SSH backend keys — the key path MUST be set explicitly
hermes config set terminal.backend ssh
hermes config set terminal.ssh_host 161.118.248.180
hermes config set terminal.ssh_user ubuntu
hermes config set terminal.ssh_port 22
hermes config set terminal.cwd /opt/esggo
hermes config set terminal.ssh_key "C:\Users\dingj\Downloads\ssh-key-2026-07-22.key"

# OR use unlock-ssh.py which writes all 6 keys atomically:
python "C:\Users\dingj\AppData\Local\hermes\skills\software-development\hermes-memory-tencentdb-windows\scripts\unlock-ssh.py" --ssh-key "C:\Users\dingj\Downloads\ssh-key-2026-07-22.key"
```

Then **FULLY restart Hermes** (log out → log in) for the change to take effect.

⚠️ **Pitfall — `unlock-ssh.py` 6-key requirement**: The script must write `terminal.ssh_key` as a 6th key. Older versions wrote only 5 keys (backend, host, user, port, cwd), leaving `ssh_key` unset → SSH handshake falls back to ssh-agent → fails. Verify all 6 keys are present:
```powershell
Get-Content "$env:LOCALAPPDATA\hermes\config.yaml" | Select-String "ssh_key"
# Should show: ssh_key: C:\Users\dingj\Downloads\ssh-key-2026-07-22.key
```

### ⚠️ Pitfall (updated) — `terminal.ssh_key` IS valid config
The previous warning "Never hand-add `ssh_key:` to `config.yaml`" was misdirected. `terminal.ssh_key` is a legitimate key — the pitfall is **omitting it** (not adding it). Use `hermes config set` to avoid YAML formatting issues, but the key itself is valid.

### ✅ Fix (verified 2026-08-06)
```powershell
# Set the backend to local (runs commands on the Windows shell)
hermes config set terminal.backend local
```
Then **restart Hermes** (exit + relaunch, or `/restart` in gateway) for the change to take effect.

After that, reach the remote host through the **local SSH client** instead of the broken backend:
```bash
ssh esggo-vps "uptime && uname -a"
```
This works as long as the user's `~/.ssh/config` defines the `esggo-vps` host alias + key. The local `ssh` client is independent of Hermes's terminal backend.

### ⚠️ Pitfall
Never hand-add `ssh_key:` to `config.yaml`. It is dead config that misleads debugging. Only use `hermes config set` for recognized keys.

### ✅ Verification
```bash
terminal(command="echo OK && pwd && which git")
# → returns local paths (e.g. /c/Project/esggo), NO ssh error
terminal(command="ssh esggo-vps 'echo VPS OK'")
# → returns "VPS OK"
```

## Root cause 1b — full tool-layer SSH wedge requires full Hermes re-login, not just app restart (verified 2026-08-07/15)

If `terminal` still shows `SSH connection failed: getsockname failed: Not a socket` after setting `terminal.backend local`, the persisted terminal/SSH state was not reset by a normal restart.

- `hermes doctor` often does **not** clear this wedge.
- Closing and reopening the Hermes app often does **not** clear it.
- The reliable fix is a **full Hermes re-login**: log out of Hermes completely, then log back in.
- After re-login, rerun `terminal(command='echo OK && pwd')`; it must return local paths with no SSH error.
- Only after that should SSH work be resumed through the local `ssh <host> "..."` client.

**Recovery checklist (reliable order):**
1. User runs `hermes doctor` from Hermes UI — cheap to try, but do NOT depend on it fixing the wedge.
2. If still wedged: user does a **full Hermes re-login** (log out → log in). This is the reliable fix; a plain app restart is often NOT enough.
3. Re-test: `terminal(command='echo OK && pwd')` → must return local paths, no SSH error.
4. Only then proceed with SSH work via the local `ssh esggo-vps "..."` client.

---

## Root cause 2 — cron `opencode-zen` provider is invalid

In this environment the effective provider is `opencode` (model e.g. `north-mini-code-free`). `opencode-zen` has no credentials → cron fails with `provider authentication error`.

### ⚠️ Pitfall
`cronjob action=update` does **NOT** accept `model`/`provider` fields — they are silently ignored and the call returns `No updates provided.` You cannot fix a job by updating its provider.

### ⚠️ Pitfall — `cronjob action=update` may reject ALL updates
In some Hermes versions, `cronjob action=update` returns `No updates provided.` even when valid fields are passed. This is a framework-level limitation, not a parameter typo. Do not retry the same update call.

### ✅ Fix for model drift / unrecoverable cron config
When a cron job's `model_snapshot` points to a removed model (e.g. `deepseek/deepseek-v4-flash-free` returning HTTP 404), or when the job cannot be updated in-place:
1. Inspect `C:\Users\<user>\AppData\Local\hermes\cron\jobs.json` for the exact `last_error`.
2. If the error is model drift or `Skipped to prevent unintended spend`, delete and recreate:
   ```
   cronjob action=remove job_id=<old_id>
   cronjob action=create name=<name> schedule=<cron> prompt=<prompt> deliver=<target>
   ```
3. Recreate with `model`/`provider` **LEFT EMPTY** so the job inherits the session's working provider.
4. This pattern also applies when `update` rejects all changes due to framework limitations.

Verified 2026-08-07: 8 cron jobs were repaired by removal + recreation after `update` returned `No updates provided.` across multiple attempts.

### ✅ Fix
Delete the job and recreate it with `model`/`provider` **LEFT EMPTY** so it inherits the session's working provider:
```
cronjob action=remove job_id=<old_id>
cronjob action=create name=<name> schedule=<cron> prompt=<prompt> deliver=<target>
```
All 5 agent-type cron jobs that referenced `opencode-zen` were successfully repaired this way (2026-08-06).

---

## Root cause 3 — `no_agent` script cron hits framework `subprocess.run` bug

Script-type cron jobs (`script:` field + `no_agent: true`) fail with:
```
Script execution failed: subprocess.run() got multiple values for keyword argument 'encoding'
```
This is a **Hermes framework bug** — the cron runner passes `encoding` both positionally and as a keyword to `subprocess.run()`. It is **NOT** a bug in your `.py` script (confirmed: reading the script shows it never passes `encoding`). Editing the script will not fix it.

### ✅ Fix
Convert the cron job to **agent mode**: remove the `script` job, recreate it as a normal LLM-agent cron with the script's logic rewritten into the `prompt`. Verified: `telegram-vps-bridge` succeeded after conversion (`last_status=ok`).

### ⚠️ Limitation
An agent-mode cron cannot do anything the agent itself cannot. If the Hermes SSH backend is broken, the agent also cannot SSH — design prompts to use Web probing, or explicitly mark VPS-side data as `unreachable`.

---

## Expanded pitfall — total lockout (verified 2026-08-07)

A `getsockname failed` SSH wedge is **more severe than the base skill implies**. Three corrections from a real incident:

### 1. The wedge covers the ENTIRE tool layer, not just `terminal`
When `terminal.backend` points at a dead SSH host, these ALL fail with the same error:
- `terminal` → `SSH connection failed: getsockname failed: Not a socket`
- `read_file` / `write_file` / `patch` / `search_files` → **same** `getsockname failed`

So you cannot read `config.yaml`, edit it, or probe files to diagnose. Do NOT assume `read_file` still works while `terminal` is wedged — in this environment it does NOT.

### 2. The fix command cannot be run BY the wedged tool
`hermes config set terminal.backend local` fails when issued through the agent's own (wedged) `terminal` tool, because the tool opens the SSH session *before* executing the command and dies there. The fix must therefore be applied **out-of-band**, one of:
- The user runs `hermes config set terminal.backend local` in their **own local Windows Terminal / PowerShell** (not via the agent), then fully restarts Hermes; OR
- The user edits `C:\Users\<user>\AppData\Local\hermes\config.yaml` directly, sets `terminal.backend: local`, saves, and restarts Hermes.

After restart, re-test the agent `terminal` with a trivial command. If it STILL errors, the config write didn't take — repeat the manual edit.

### ⚠️ computer_use constraints observed (CORRECTED 2026-08-07 — the "CAN recover" claim below was WRONG)
An earlier version of this skill claimed `computer_use` recovered the wedge via the Hermes embedded TERMINAL pane. **That is false for this user's setup.** The cua-driver daemon runs WITHOUT UIAccess integrity, so:
- `computer_use` `key`/`click` with `delivery_mode='foreground'` is **rejected**: `Foreground swap to target HWND was rejected by Windows ... daemon is not at UIAccess integrity, so SetForegroundWindow is subject to the foreground-lock`.
- `delivery_mode='background'` input is delivered to whatever window is currently foreground — which is the **Hermes DevTools console (a JavaScript REPL)**, NOT the bash terminal pane. Typed commands (`node server.mjs &`, `hermes doctor`, etc.) land in JS and do nothing.
- `F12` / `Alt+F4` are hard-blocked (`destructive system shortcuts`) or return `invalid window handle (0x80070578)` because the DevTools HWND is in a broken state.
- `capture` prefers the Hermes/DevTools window and refuses to screenshot its own auth process, so you cannot even verify what you typed.

**Bottom line: `computer_use` is NOT a recovery path for the SSH wedge here. Do not burn turns on it.**

### 4. `hermes doctor` does NOT fix the wedge — a FULL Hermes re-login DOES (verified 2026-08-07)

- Running `hermes doctor` (via the user's Hermes command palette / settings panel) did **NOT** clear the `TERMINAL_SSH_*` lock. The agent `terminal` tool stayed wedged (`getsockname failed`) afterwards.
- The actual unlock was the user **logging out of Hermes completely and logging back in** — a full auth re-login, NOT just closing/reopening the app. This reset the persisted `TERMINAL_SSH_*` environment variables that the agent's terminal backend was reading.
- After re-login, the agent `terminal` tool returned `local` backend and ran normally (`exit_code: 0`, no SSH error).

**Recovery checklist (reliable order):**
1. User runs `hermes doctor` from Hermes UI — cheap to try, but do NOT depend on it fixing the wedge.
2. If still wedged: user does a **full Hermes re-login** (log out → log in). This is the reliable fix; a plain app restart is often NOT enough.
3. Re-test: `terminal(command='echo OK && pwd')` → must return local paths, no SSH error.
4. Only then proceed with SSH work via the local `ssh esggo-vps-root "..."` client.

### ⚠️ The Hermes embedded terminal does NOT keep child processes alive

### ⚠️ Browser-tool localhost probes are NOT proof of server state
`browser_navigate` / `browser_*` run in a **sandboxed remote browser (Browserbase)**. `http://localhost:PORT` or `http://127.0.0.1:PORT` from these tools resolves to *that* browser's localhost, NOT the user's machine. A `net::ERR_CONNECTION_REFUSED` on a localhost URL from the browser tool is **NOT** evidence the user's local server is down.
- ✅ Verify a user-local server via the **user's own Windows Terminal / PowerShell** (visible in `list_windows` as `WindowsTerminal.exe`), or via `computer_use` typing `curl`/`Invoke-WebRequest` into that terminal.
- ✅ The browser tool IS reliable for **public URLs** (e.g. `https://translate.esggo.co/health` returned 200 in this session).

### ⚠️ The Hermes embedded terminal does NOT keep child processes alive
All backgrounded launches in the embedded terminal died in this session:
- `node server.mjs &` → died when the command returned.
- `Start-Process -NoNewWindow node ...` → died.
- `Start-Process node ...` (new window) → also refused (child killed).
Root cause: the embedded terminal kills child processes when the launching command returns.
**Action**: do NOT try to launch a persistent local server (node/python/http.server) through the Hermes embedded terminal. Tell the user to run it in their **own Windows Terminal / PowerShell** foreground — that keeps it alive (confirmed: user ran `node server.mjs` in their PS and it listened on :8788).

### ✅ `open_preview` IS a real agent tool in this runtime
Past notes claiming `open_preview` is "not an agent tool" are wrong for the current harness. `open_preview(url=...)` is a callable tool that opens the URL in the Hermes desktop app's preview pane. It is the reliable way to **show the user a live UI** (local `http://localhost:PORT`, remote `http://<vps-ip>:PORT`, or a `file://` path). Use it to surface deployed apps to the user. It does NOT return rendered content to the agent — verification still requires a real `curl` (via `terminal` after the wedge is cleared) or the user's report.

### ⚠️ VPS disk-full is a hard blocker for in-container installs
When deploying to the VPS (161.118.248.180, 45G boot volume), the disk hits 100% full from running service images (deer-flow, esggo-core, agentmemory, aistation — ~13GB of images that MUST NOT be deleted). At 100%:
- `docker exec` fails intermittently with `OCI runtime exec failed: write /tmp/runc-process...: no space left on device` (runc can't write its process file to the full `/tmp`/overlay).
- `hermes-agent` installer via `docker exec` fails at the `hermes` command symlink step (`cat: write error: No space left on device`).
- `docker system df` / `prune` time out because the daemon can't write temp files on a full disk.
- Cleaning journald (`journalctl --vacuum-time=2h`) + apt cache frees ~250MB but is NOT enough for a full agent install (needs ~500MB+ for pip + node_modules).
**Action**: before installing anything large on the VPS, check `df -h /`. If >95% full, STOP and tell the user to resize the Oracle boot volume (Console → Block Volumes → resize) — don't try to squeeze an install onto a full disk.

See `references/ssh-wedge-total-lockout.md` for the exact error strings and a copy-paste recovery checklist.

---

## Root cause 4 — cron job model drift / unpinned snapshot mismatch

When a job was created under one provider/model and the global inference config later changes, Hermes may skip execution to prevent unintended spend. Error signatures include:

- `RuntimeError: Skipped to prevent unintended spend: global inference config drifted since this job was created (model 'X' -> 'Y'), and this job is unpinned.`
- `RuntimeError: HTTP 404: Model 'X' not found. The requested model does not exist in our configuration or OpenRouter catalog.`

### ✅ Fix
`cronjob action=update` does **NOT** accept `provider`/`model` fields — they are silently ignored and the call returns `No updates provided.` Do not retry update with model/provider.

Instead, inspect `C:\Users\<user>\AppData\Local\hermes\cron\jobs.json` for the exact `last_error`, then repair by recreation:

```
cronjob action=remove job_id=<old_id>
cronjob action=create name=<name> schedule=<cron> prompt=<prompt> deliver=<target>
```

- Leave `provider`/`model` empty on creation so the job inherits the current session's working config.
- If stability is required, pin only at creation time; otherwise prefer unpinned jobs so scheduled runs follow active config.

Verified 2026-08-07: repaired 8 cron jobs by removal + recreation after repeated `No updates provided.` failures.

---

## Quick diagnostic decision tree
1. Terminal SSH error `getsockname`? → `terminal.backend local` + restart + use `ssh host "..."`.
2. Cron `provider authentication error` + `opencode-zen`? → delete + recreate with empty provider.
3. Cron `subprocess.run encoding`? → it's a `no_agent` script job → convert to agent mode.
4. Cron `model drift` / `Model not found`? → delete + recreate with empty provider/model.

See `references/cron-execution-pitfalls.md` for exact error transcripts and copy-paste fix commands.
See `references/ssh-wedge-total-lockout.md` for the total-lockout variant.

## Root cause 5 — interrupted Windows `hermes update` leaves venv half-installed

On Windows, an interrupted Hermes update can break the venv in ways that look like
general terminal failure: `hermes` is missing from PATH, `import pyyaml` fails with
`ModuleNotFoundError`, and CLI commands print:

```
⚠ A previous `hermes update` was interrupted mid-install — finishing dependency installation now...
✗ Could not auto-recover the interrupted install.
Recover manually with:
  cd <repo>
  <venv>/python.exe -m ensurepip --upgrade
  <venv>/python.exe -m pip install -e '.[all]'
```

### Why plain `pip install --force-reinstall` may fail on Windows

The interrupted install often leaves a broken `yaml/` package with only
`__init__.py` plus the compiled `_yaml.cp311-win_amd64.pyd`. Because Windows locks
loaded `.pyd` files, rerunning `pip install --force-reinstall pyyaml` from the same
interpreter commonly fails with:

```
OSError: [WinError 5] 存取被拒。: '.../yaml/_yaml.cp311-win_amd64.pyd'
```

### Verified Windows repair

```powershell
cd C:\Users\dingj\AppData\Local\hermes\hermes-agent
# 1. remove tilde temp dirs that confuse pip
C:\Users\dingj\AppData\Local\hermes\hermes-agent\venv\Scripts\python.exe -c ^
  "import shutil, pathlib; [shutil.rmtree(p, ignore_errors=True) or print('removed', p) for p in pathlib.Path('venv/Lib/site-packages').glob('~*') if p.is_dir()]"

# 2. rename or delete the broken yaml package when Hermes is closed
cmd.exe /c "ren venv\Lib\site-packages\yaml yaml.corrupted"

# 3. reinstall packages
C:\Users\dingj\AppData\Local\hermes\hermes-agent\venv\Scripts\python.exe -m pip install --no-cache-dir pyyaml==6.0.3 pywinpty==2.0.15

# 4. restore missing console script entry point
notepad venv\Scripts\hermes.cmd
```

`venv/Scripts/hermes.cmd` should contain:

```cmd
@echo off
"C:\Users\dingj\AppData\Local\hermes\hermes-agent\venv\Scripts\python.exe" "C:\Users\dingj\AppData\Local\hermes\hermes-agent\hermes_cli\main.py" %*
```

### Verification

```powershell
cd C:\Users\dingj\AppData\Local\hermes\hermes-agent
venv\Scripts\python.exe -c "import yaml, pywinpty, hermes_cli.main; print('ok')"
```

### Caveats

- If `WinError 5` persists, fully close Hermes before retrying; the `.pyd` may still be held.
- `hermes update` may trigger another recovery pass on the next CLI run.
- Version drift warnings for `certifi`, `openai`, `requests`, `rich`, or `packaging` are common; treat them as secondary unless imports fail.
- A stale `gateway.pid` can remain even after the real process is gone; ignore pid-only stale state after venv repair.

See `references/windows-venv-repair.md` for the exact directory names, error strings, and copy-paste PowerShell commands from this session.

## Quick diagnostic decision tree
1. Terminal SSH error `getsockname`? → `terminal.backend local` + restart + use `ssh host "..."`.
2. Cron `provider authentication error` + `opencode-zen`? → delete + recreate with empty provider.
3. Cron `subprocess.run encoding`? → it's a `no_agent` script job → convert to agent mode.
4. Cron `model drift` / `Model not found`? → delete + recreate with empty provider/model.
5. CLI prints interrupted-update recovery + `Failed to read pyyaml`? → follow Root cause 5 above.
