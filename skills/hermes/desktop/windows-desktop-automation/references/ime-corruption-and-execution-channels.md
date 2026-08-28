# IME text corruption + execution-channel verification (session 2026-08-01)

## Symptom chain

Goal: `cd C:\Project\esggo-learning-center\hlpf-poc-pipeline; pip install -r requirements.txt 2>&1 | Select-Object -Last 5`
typed via `computer_use` `type` with `delivery_mode:"foreground"` (SendInput).

The user pasted back what actually landed in the terminal:

```
cd C:\Project\esggolearningcenter\hlpf-poc-pipeline; pip install r requirements.txt 2>&1 | Select-SObject -S-OLast 5---S-O-L--S-O-L-S-O-L-O-L-L
```

A second attempt produced `-host`/`-port` for `--host`/`--port` plus a trailing run of `---`.

## Corruption mapping (Traditional-Chinese IME, ASUS Smart Input observed)

| Intended | Landed | Cause |
|---|---|---|
| `esggo-learning-center` | `esggolearningcenter` | backslash + hyphen eaten |
| `-r` | `r` | hyphen eaten |
| `--host` / `--port` | `-host` / `-port` | one hyphen eaten |
| `Select-Object -Last 5` | `Select-SObject -S-OLast 5---S-O-L--...` | hyphens swallowed into garbage runs |
| trailing `---...` | kept | key-repeat/IME residue — discard |

Rule: on this user's Windows machine, `computer_use type` CANNOT be trusted for
any command containing `\` or `-`. Report `ok:true` from the tool does NOT mean
the text arrived intact — the tool reports chars *sent*, not chars *landed*.
Always verify by artifact (log file), never by the tool's success message.

## What worked / what didn't (execution channels tried)

1. **`set_value` (UIA ValuePattern)** — IME-safe, sets value directly, no key
   events. Works on Win32 Edit controls (Run dialog, Explorer address bar,
   chat inputs). Does NOT drive xterm.js-style terminals (Hermes in-app
   terminal, VS Code terminal) — those need keydown; set_value lands but
   nothing executes.
2. **Hermes app in-app TERMINAL pane** — a log/activity viewer, NOT a shell.
   Element labeled "Terminal input" was actually the chat input. Don't use.
3. **Cron `no_agent` script (embedded Python)** — job was created, ran at its
   scheduled minute, and disappeared (once-job lifecycle), but
   `cron_run_output.txt` NEVER appeared at `C:\Project\esggo-learning-center\...`.
   Conclusion: cron executes in the terminal-backend environment (here: SSH
   Linux), where `C:\` is a literal relative dir name and the write silently
   fails. Cron ≠ local-Windows execution channel. Verify host first via a
   marker-file write read back with file tools.
4. **Win+R / Win+X** — shell hotkeys don't fire via PostMessage; no Run dialog
   appeared in `list_windows`.
5. **Shortest-command execution of a staged script** — the correct pattern:
   write `go.bat` via file tools (byte-exact, IME-proof), then type only
   `.\go.bat` (few/no special chars) or hand it to the user for one paste.

## The working recipe (log-file relay, GUI-only)

1. Stage a `.bat`/`.py` in a directory your file tools can read/write
   (MCP-allowed tree). Script: cd → pip install → start uvicorn with
   output redirected to numbered logs → curl endpoints into json → list
   output tree into a probe file → all append to one `*.log`.
2. Execute via the shortest possible command (or user paste, or real shell).
3. Read the logs back with file tools. No log file = command never ran.
   Never report success without the artifact.
