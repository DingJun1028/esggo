# Recovering a working local shell on Windows (SSH / embedded terminal dead)

## When this applies
- `terminal` tool fails: `SSH connection failed: getsockname failed: Not a socket` (VPS unreachable).
- Hermes embedded "TERMINAL" pane shows old session logs and `read_terminal` returns chat text.
- You need to run git / file operations on the Windows-host repo (e.g. `C:\Project\esggo`).

## Validation test (proves a shell is live)
```powershell
echo PROBE_$PID > C:\Project\esggo\__marker.txt
```
Then read `C:\Project\esggo\__marker.txt` via the MCP file server (`mcp__my_server__read_text_file`).
If it exists with the echoed content, the shell is live. If it does NOT appear, input is not reaching a shell.

## Reliable procedure (computer_use driven)
1. `focus_app` any foreground window (e.g. explorer) so keystrokes have a target.
2. `computer_use` `action:"key"` `keys:"win"` (`delivery_mode:"foreground"`) → opens Start.
3. `action:"type"` `text:"powershell"` `delivery_mode:"foreground"` → Enter.
4. In the new PowerShell window, `type` the git command + `key` `enter`, all `delivery_mode:"foreground"`.
5. Verify with the marker-file read-back above before trusting any output.

## Gotchas
- `delivery_mode:"background"` is dropped by Chromium-class windows and UIAccess-locked surfaces → always use `foreground` for typing into a real local shell.
- The Hermes embedded terminal "Terminal input" SOM element is NOT wired to a live shell — never trust it.
- `read_terminal` returns the chat buffer, not the shell — never use it to confirm terminal state.
- Win+X → i (admin PowerShell) also works but the UIAccess swap can be flaky; Win+R → powershell is the most reliable launch.
