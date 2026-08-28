# Severe Hermes SSH-backend lock — recovery sequence (verified 2026-08-07)

## Trigger
- Every `terminal` call returns:
  `RuntimeError: SSH connection failed: getsockname failed: Not a socket / Read from remote host <ip>: Unknown error` (traceback ends in `environments/ssh.py`).
- AND you need to run `hermes config set terminal.backend local` to escape, but the `terminal` tool *is* the dead SSH backend, so you cannot run that command through it. Chicken-and-egg.

Root cause: `terminal.backend` was set to `ssh` (e.g. `hermes config set terminal.backend ssh`), but Hermes's Windows SSH backend has a known `getsockname failed: Not a socket` paramiko bug, and it only reads the SSH keys after a full restart — so pre-restart `terminal`/`read_file`/`write_file` all die.

## Recovery via the Hermes desktop app embedded terminal

The Hermes **desktop app** (`Hermes.exe`) has a bottom **TERMINAL** pane that is a *local* Windows shell, independent of the SSH backend. Drive it with `computer_use`.

### Step-by-step (exact calls)
1. **Locate the terminal.** Capture the screen; if `Hermes.exe` is open, its TERMINAL pane is the local shell.
   ```
   computer_use(action='capture', mode='vision')
   computer_use(action='capture', app='Hermes.exe', mode='som')   # find the "Terminal input" element idx
   ```
2. **Type the fix with FOREGROUND delivery** (background typing is dropped by the Chromium `Chrome_WidgetWin_1` class):
   ```
   computer_use(action='click', element=<terminal_input_idx>)   # unverifiable is OK
   computer_use(action='type',  delivery_mode='foreground', element=<terminal_input_idx>, text='hermes config set terminal.backend local')
   computer_use(action='key',   delivery_mode='foreground', keys='enter')
   ```
   - Do NOT use Win+R / foreground hotkeys — they are blocked (no UIAccess worker: `SetForegroundWindow` subject to foreground-lock). Clicking the terminal input + foreground-type is the reliable path.
3. **Confirm success.** Re-capture; the terminal shows:
   `computer_hermes config set terminal.backend local 0.1s` (no error).
   The `hermes config set` writer is the supported safe path — it wrote `terminal.backend: local` to `~/.hermes/config.yaml` without hand-editing.
4. **Full restart required.** Close the Hermes app → reopen so the new backend is reloaded. Until then `terminal`/`read_file`/`write_file` still route through SSH and stay dead. This restart is the **user's** action — tell them to do it and report back. The fix does NOT delete any previously-written SSH keys; they remain for a working SSH setup later.

## Pitfall: embedded terminal kills background children
Verified this session: from the Hermes embedded terminal, `&`, `Start-Process -NoNewWindow`, and even `Start-Process` (new window) all **die the instant the launching command returns**. So:
- You **cannot** host a persistent local server here (`node server.mjs` on :8788 → `http://localhost:8788` = `ERR_CONNECTION_REFUSED`).
- You **cannot** read files via a `python -m http.server` launched here (it dies immediately too).
- For a persistent local service, use the **user's own Windows Terminal / PowerShell** window.
- Reading the embedded terminal's text via the auxiliary vision model is unreliable (drops single-line output; SOM dump includes the whole app tree and gets truncated). Get ground truth by **probing a live HTTP endpoint with the `browser` tool** (reliable literal results). Example used this session:
  - `browser_navigate(url='http://localhost:8788/health')` → `ERR_CONNECTION_REFUSED` proved no local server.
  - `browser_navigate(url='https://translate.esggo.co/health')` → success (HTTP 200) proved the VPS/Cloudflare-tunnel host was live.

## What did NOT work (do not repeat)
- Running `hermes config set` through the `terminal` tool → it first opens the dead SSH connection and fails.
- Win+R / foreground hotkey delivery → blocked by missing UIAccess worker.
- Background `type` into the Hermes app → silently dropped.
- `Start-Process` (any form) to keep a server alive in the embedded terminal → child killed on command return.

## VERIFIED 2026-08-07 refinement: restart alone may NOT un-wedge it
The prior playbook assumed Step 4 (full restart) would reload the backend as local. **This session tested that and it FAILED:**
- The embedded-terminal `config.yaml` write (`terminal.backend: local`) was confirmed done (prior computer_use session's vision log showed the success line).
- User then did a **full Hermes restart** (close app → reopen).
- **Actual result:** `terminal` STILL returned `SSH connection failed: getsockname failed: Not a socket / Read from remote host 161.118.248.180`.
- **Implication:** the `terminal` tool's SSH pin is re-established on restart from a source OTHER than `config.yaml`'s `terminal.backend` (suspected: `TERMINAL_SSH_*` env vars, or the session's stored backend state). So writing `config.yaml` + restart is **not a guaranteed un-wedge**.
- **Escalation path when restart does not clear it:** the SSH-pinning source must be removed at the environment level. Ask the user to either (a) **fully log out and back in to Hermes** (more thorough than a window close — resets terminal env vars), or (b) **delete `TERMINAL_SSH_HOST` / `TERMINAL_SSH_USER` / `TERMINAL_SSH_PORT`** from the system environment, then restart Hermes. Do NOT loop forever re-driving `computer_use` — after one config-write attempt, escalate to the user with the exact env-var list.
- **Win / Win+R hotkey unreliability (verified this session):** sending `Win` or `Win+R` via `computer_use` does NOT reliably open Start/Run. The keystroke lands in whatever window holds focus — both **Chrome** and **Hermes** intercepted `Win`/`Win+R` and turned them into address-bar searches. UIAccess-blocked foreground swaps fail with `Foreground swap ... was rejected ... SetForegroundWindow is subject to the foreground-lock`. Therefore: prefer clicking the embedded terminal input (SOM) and foreground-typing the command; never depend on `Win+R` to surface the Run dialog. To open a separate app, click its desktop icon (SOM `ListItem`) or taskbar button instead of a global hotkey.
