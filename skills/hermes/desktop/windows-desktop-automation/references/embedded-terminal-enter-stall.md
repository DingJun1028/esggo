# Embedded Hermes terminal — Enter-stall (reproduced 2026-08-04)

## Symptom
Driving the Hermes desktop app's own bottom TERMINAL pane via `computer_use`:

- `type` / `key` text lands correctly on the prompt line:
  `PS C:\Users\dingj\OneDrive\Documents\Default Project> hermes auth status`
- `key(enter)` / `key(return)` (foreground OR background) **never commits** —
  no command output, no new prompt, the line just sits there.
- Repeating `type`+`enter` does not help. Only `key(ctrl+c)` clears the line.
- `set_value` on the "Terminal input" AX element fails:
  `"does not implement ValuePattern or RangeValuePattern"` — it's a terminal
  canvas, not a real edit field, so UIA value-setting is unavailable.

## Why it's distinct from the other documented failures
- NOT `background_unavailable` (that one refuses `type` outright). Here `type`
  succeeds and the text visibly appears on the prompt.
- NOT the Hermes-chat-TUI takeover (that one shows a `❯` prompt and your
  keystrokes become agent input). Here a bare `hermes` printed the real
  `Hermes Agent v0.19.1 (2026.7.30) · upstream a991dfc2` banner, proving it
  is a genuine PowerShell — the submit just never fires on synthesized Enter.
- Root cause: the embedded xterm's command-submit handler isn't reached by the
  SendInput Enter that works in a standalone console.

## Verified facts this session
- `hermes` IS on PATH locally — bare `hermes` ran and printed the banner.
  No need for the full `& "$env:LOCALAPPDATA\hermes\hermes-agent\venv\Scripts\hermes.exe"` path.
- The SSH backend was DOWN this session (`getsockname failed: Not a socket`),
  so the `terminal` tool (SSH VPS backend) could not run local commands either.
  Both the embedded terminal AND the SSH terminal were unusable for local CLI.

## Workarounds that actually work
1. Standalone external PowerShell window: `key(win)` → type `powershell` →
   `key(enter)`, then run the command there (Enter commits normally).
   Caveat: Win+R / Win / Win+X hotkeys may NOT fire via PostMessage or
   foreground SendInput on this machine (verified elsewhere in this skill) —
   verify a new window appeared before trusting it; if not, pivot.
2. Chat slash command if one exists (e.g. `/auth status`).
3. Workspace runner script (.bat / runner.py) that writes a log artifact
   readable via file tools — the canonical pattern in this skill.
