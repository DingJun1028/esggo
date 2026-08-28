---
name: windows-devtool-wsl-install
description: Install Linux-only CLIs on Windows via WSL2.
---

# Windows Dev-Tool Install via WSL2

## When to use
- User asks to install a CLI/tool that ships a `curl ... | sh` bash installer, on a Windows/MSYS host.
- An installer errors: `Windows is not supported. Use WSL (...)` (seen verbatim in Composio's `install.sh` — it detects `MINGW64`/`MSYS`/`CYGWIN` and `error`s out).
- `npm i -g <tool>` or `pip install <tool>` installs something but `<tool> --version` says "command not found", or the package has no `bin`/console_scripts entry.

## Core pattern
Many dev CLIs ship a **Linux/macOS-only binary** installed by a bash script (downloads to `~/.local/bin`, adds to PATH). On Windows native (MINGW64/MSYS/CYGWIN) the script either refuses or installs a linux binary that won't execute. The reliable path is **WSL2 Ubuntu + run the installer inside WSL** (real Linux).

## Steps
1. Check WSL state: `wsl -l -v` (pipe through `tr -d '\000'` — MSYS emits NUL-separated output that breaks grep/head).
2. If no general-purpose distro exists (only `docker-desktop` is present by default): install Ubuntu —
   `wsl --install -d Ubuntu`  (run in background or with a generous timeout — see Pitfalls).
3. Verify it launches: `wsl -d Ubuntu -- echo WSL_OK`.
4. Inside WSL, run the official installer:
   `wsl -d Ubuntu -- bash -c 'curl -fsSL <install-url> | sh'`
   (This may require user consent — see Pitfalls.)
5. Verify: `wsl -d Ubuntu -- <tool> --version`.

## Pitfalls
- **Installer refuses Windows**: Don't fight it. The script detects the MSYS platform and `error`s. Running it inside WSL (real Linux) is exactly what it expects. Don't pipe `curl|sh` on the Windows host.
- **npm/pip name collision (squatters / SDK-only)**: The `composio` npm package (v1.0.0) has NO `bin` — a placeholder, not the CLI. The `composio` pip package (v0.19.0) installs but exposes NO `console_scripts` entry and isn't even importable — also not the CLI. The real Composio CLI is the **Linux binary from `install.sh`**. Always verify a package is actually the CLI BEFORE assuming `npm/pip install` gives you it:
  - npm: `cat "$(npm root -g)/<pkg>/package.json" | python3 -c "import json,sys;print(json.load(sys.stdin).get('bin'))"`
  - pip: `python3 -c "import importlib.metadata as m; print([e.value for e in m.entry_points(group='console_scripts') if 'tool' in e.value.lower()])"`
  - If both are empty, the package is not a CLI — stop and use the WSL path.
- **`wsl --install` timeout illusion**: The first `wsl --install -d Ubuntu` often hits the 180s foreground timeout ("Provisioning the new WSL instance... This might take a while") but has ALREADY succeeded. A retry prints `Wsl/InstallDistro/ERROR_ALREADY_EXISTS`, confirming the distro is registered. Always verify with `wsl -l -v` rather than trusting the timeout. Prefer `background=true` + `notify_on_complete=true` for the install command.
- **`curl | sh` consent block**: Piping a remote script into WSL may be flagged as a sensitive action and BLOCKED pending user consent ("Command timed out without user response. The user has NOT consented"). Do NOT retry or rephrase automatically — stop and ask the user to approve or run it themselves.
- **Interactive OAuth login**: After install, `<tool> login` (e.g. `composio login`) opens a browser for OAuth and waits for the user's account auth. The agent CANNOT complete this. Install up to the point of printing the login prompt/URL, then hand off to the user explicitly.
- **MSYS `/tmp` path quirk**: Writing `curl -o /tmp/x.sh` then operating on it can fail silently (file not created) due to MSYS path translation. Download to a Windows path like `/c/Users/<user>/x.sh`, or pipe directly `curl ... | sh`.
- **First-launch user setup**: A fresh Ubuntu may prompt for username/password on first `wsl -d Ubuntu` launch. Test with `wsl -d Ubuntu -- echo OK` first; if it returns OK without a prompt, the default user is already set and you can proceed.

## References
- `references/composio-wsl-install.md` — full worked example: Composio CLI on Windows via WSL2, including the native-refusal investigation, npm/pip dead ends, the WSL bootstrap, and the login handoff.
