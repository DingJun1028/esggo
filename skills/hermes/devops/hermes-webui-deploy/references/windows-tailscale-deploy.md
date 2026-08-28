# Hermes WebUI on Native Windows + Tailscale (VERIFIED WORKING)

The umbrella SKILL.md said "Native Windows not supported" — that is WRONG for
the `nesquena/hermes-webui` repo. It is a Python (FastAPI) app, not Node. It
runs fine on native Windows IF you bypass `ctl.sh` (which has an MSYS path bug)
and launch `bootstrap.py` directly with the native Windows Python.

## Environment facts (this machine)
- OS: MINGW64_NT-10.0 (Git-Bash / MSYS on Windows 10/11). NOT WSL.
- Python: native `C:\Users\dingj\AppData\Local\Python\pythoncore-3.14-64\python.exe`
  (NOT the `Microsoft\WindowsApps\python3` store stub, and NOT the hermes venv py).
- Repo cloned at `C:\Project\hermes-webui`. `package.json` has NO deps/scripts —
  ignore any "it's a Node app" assumption.
- Tailscale already installed + authenticated to tailnet
  `dingjun.tail658f8b.ts.net`, machine IP e.g. `100.103.244.34`.

## Why `./ctl.sh start` FAILS on Windows
`ctl.sh` computes `REPO_ROOT=/c/Project/hermes-webui` then execs
`nohup python "${REPO_ROOT}/bootstrap.py"`. MSYS translates the arg to a native
path but DOUBLES the drive letter → `C:\c\Project\hermes-webui\bootstrap.py`
→ `python.exe: can't open file ... No such file or directory`.

FIX: do NOT use `ctl.sh`. Launch `bootstrap.py` yourself with the native Windows
Python and a **native Windows absolute path** (forward or back slashes both OK for
the native exe). bootstrap.py loads `REPO_ROOT/.env` itself on import, so env vars
in `.env` are picked up.

## Step-by-step (verified)
1. Generate a 24-char password:
   `python3 -c "import secrets,string;print(''.join(secrets.choice(string.ascii_letters+string.digits) for _ in range(24)))"`
2. Write `C:\Project\hermes-webui\.env` (bootstrap reads it):
   ```
   HERMES_WEBUI_PORT=8787
   HERMES_WEBUI_HOST=0.0.0.0
   HERMES_WEBUI_PASSWORD=<generated>
   HERMES_WEBUI_STATE_DIR=C:\Users\dingj\.hermes\webui
   HERMES_HOME=C:\Users\dingj\.hermes
   ```
   Password MUST be set BEFORE binding 0.0.0.0 — see safety gate below.
3. Launch directly (background=true in Hermes terminal; nohup/& are rejected):
   ```
   "C:\Users\dingj\AppData\Local\Python\pythoncore-3.14-64\python.exe" \
     "C:\Project\hermes-webui\bootstrap.py" --no-browser --host 0.0.0.0 8787
   ```
   bootstrap creates its venv + pip-installs deps on first run (~1-3 min), then
   execs `server.py`.

## SAFETY GATE (do not skip)
`server.py` (lines ~598-604) REFUSES to bind `0.0.0.0`/`::` unless
`is_auth_enabled()` (i.e. `HERMES_WEBUI_PASSWORD` is set). So binding 0.0.0.0 is
only allowed when password-protected. Never set HOST=0.0.0.0 without the password.
This is exactly the "never expose an unauthenticated WebUI" rule.

## Tailscale exposure
- PREFER: `tailscale serve --bg 8787` (HTTPS + `*.ts.net` hostname, proxies to
  loopback). BUT if your tailnet has Serve disabled it prints
  `Serve is not enabled on your tailnet` + an enable URL — then FALL BACK to the
  0.0.0.0 bind above (password still enforces auth).
- With 0.0.0.0 bind, the service is reachable on the tailnet at
  `http://<tailscale-ip>:8787` (e.g. `http://100.103.244.34:8787`).

## Verify (all three must pass)
```
netstat -ano | grep ":8787" | grep LISTENING   # 0.0.0.0:8787
curl -s http://100.103.244.34:8787/health      # {"status":"ok",...}
curl -s -o /dev/null -w "%{http_code}" http://100.103.244.34:8787/api/sessions  # 401
curl -s -o /dev/null -w "%{http_code}" http://100.103.244.34:8787/             # 302 (login)
```
The `/health` 401-vs-ok split confirms password auth is live.

## bootstrap "did not become healthy" red herring
bootstrap.py health-checks `http://0.0.0.0:8787/health` — that literal address is
unroutable, so bootstrap prints `ERROR: Web UI did not become healthy ... Server
PID: <n>` and its wrapper process exits 1. THE CHILD SERVER KEEPS RUNNING FINE.
Ignore that warning; verify with the curl commands above (loopback or tailscale
IP both work). The background process "exit code 1" in Hermes is this wrapper, not
the server.

## Windows auto-start (survives reboot)
- `schtasks /Create /XML ...` FAILS under MSYS: bash mangless `//Create`→`/Create`
  and the XML import also errors (rc=1, likely admin/principal). Do NOT rely on it.
- WORKING: Startup folder `.lnk` (same pattern as the existing `Ollama.lnk` on
  this machine). Create via a `.ps1` executed with `powershell -File` (inline
  `powershell -Command "..."` fails the parser under bash due to `$`/quotes):
  ```powershell
  $s = New-Object -ComObject WScript.Shell
  $l = $s.CreateShortcut('C:\Users\dingj\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup\HermesWebUI.lnk')
  $l.TargetPath = 'C:\Users\dingj\.hermes\start-webui.cmd'
  $l.WorkingDirectory = 'C:\Project\hermes-webui'
  $l.WindowStyle = 7   # minimized
  $l.Save()
  ```
- The `start-webui.cmd` just sets the env vars (host/port/state/hermes) and calls
  the native python + bootstrap.py line above. Password stays ONLY in `.env`
  (not in the .cmd), so the launcher is safe to leave around.

## iPhone / Hermex client
Server URL in Hermex: `http://100.103.244.34:8787` (or
`http://dingjun.tail658f8b.ts.net:8787`). Enter the generated password. iPhone
must be on the same tailnet (confirmed: `iphone-11-1` etc. listed under the same
`dingjunhong1028@` account).
