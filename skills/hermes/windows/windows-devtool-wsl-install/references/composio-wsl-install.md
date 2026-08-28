# Composio CLI on Windows via WSL2 — Worked Example

> Context: user asked to install Composio CLI on a Windows/MSYS host via the official
> `curl -fsSL https://composio.dev/install | sh` then `composio login`. The host was
> MINGW64_NT-10.0 (MSYS), no general-purpose WSL distro (only `docker-desktop`).

## 1. Native install is REFUSED (verified by reading the script)
`https://composio.dev/install` → 302 → `raw.githubusercontent.com/ComposioHQ/composio/refs/heads/next/install.sh` (38 KB, HTTP 200).
The script's `detect_target()` contains:
```bash
'MINGW64'* | 'MSYS'* | 'CYGWIN'*)
    error 'Windows is not supported. Use WSL (...) and run this script inside your WSL distribution.'
```
So `curl ... | sh` on Windows native aborts with that error. Do NOT fight it.

## 2. npm / pip `composio` are NOT the CLI (name-collision dead ends)
- `npm i -g composio` → package v1.0.0, **no `bin`** → placeholder/squatter.
- `pip install composio` → v0.19.0, **no `console_scripts` entry**, `import composio` fails → SDK/library, not CLI.
- Verify-before-assuming commands:
  - npm: `cat "$(npm root -g)/composio/package.json" | python3 -c "import json,sys;print(json.load(sys.stdin).get('bin'))"` → `None`
  - pip: `python3 -c "import importlib.metadata as m; print([e.value for e in m.entry_points(group='console_scripts') if 'compos' in e.value.lower()])"` → `[]`

## 3. WSL2 Ubuntu bootstrap
- `wsl -l -v` (pipe `tr -d '\000'`; MSYS NUL-separates). Only `docker-desktop` present.
- `wsl --install -d Ubuntu` → hit 180s foreground timeout ("Provisioning... This might take a while") BUT already succeeded. Retry → `Wsl/InstallDistro/ERROR_ALREADY_EXISTS` confirms registered. Verify with `wsl -l -v` (Ubuntu STATE Stopped, VERSION 2).
- `wsl -d Ubuntu -- echo WSL_OK` → returns `WSL_OK`, no user-prompt → default user already set.

## 4. Run installer INSIDE WSL (the correct path)
```
wsl -d Ubuntu -- bash -c 'curl -fsSL https://composio.dev/install | sh'
```
NOTE: this `curl | sh` into WSL was flagged as a sensitive action and BLOCKED pending
user consent ("Command timed out without user response. The user has NOT consented").
Do NOT retry/rephrase — ask the user to approve or run it themselves. Once approved,
it downloads the linux-x64 binary to `~/.local/bin` and adds to PATH.

## 5. `composio login` = interactive OAuth → HAND OFF to user
After install, `composio login` opens a browser for OAuth and waits for the user's
Composio account auth. The agent CANNOT complete it. Install up to the login prompt,
then tell the user: "Run `wsl -d Ubuntu` then `composio login` and authenticate in the browser."

## Other gotchas observed
- MSYS `/tmp` path quirk: `curl -o /tmp/x.sh` can silently fail to create the file (path
  translation). Download to `/c/Users/<user>/x.sh` or pipe directly `curl ... | sh`.
- `wsl --version` / `wsl -l -v` output arrives NUL-separated on MSYS → always `tr -d '\000'`
  before grep/head or you'll see garbage.
