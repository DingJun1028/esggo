# Hermes in-app terminal: the FRESH-TAB focus workaround (verified 2026-08-04)

Counter-case to the blanket "the in-app TERMINAL pane is not typeable / synthesized Enter
never commits" rows in SKILL.md. On a **fresh tab** the embedded xterm DOES take input and
DOES commit Enter. Use this BEFORE giving up on the pane.

## The reliable input pattern
1. Make sure Hermes is the frontmost window: `focus_app(app='Hermes', raise_window=true)`.
2. Click the **新增終端機 / New Terminal** button (`Button '新增終端機'`, bottom of the
   terminal pane, ~(1891,891) in a 1920x1032 window) with `delivery_mode='foreground'`
   **BY ELEMENT INDEX from a fresh capture**. Foreground *coordinate* clicks fail with
   "The foreground click did not activate its target window"; element-index clicks resolve
   through UIA and land.
3. A new tab opens and **auto-focuses** its xterm input. Immediately `type` (foreground),
   then `key enter`.
4. Verify with `read_terminal` — real output means the command landed.

Verified clean on fresh tabs:
- `pwd` → printed `C:\Users\dingj` (took the cwd from a fresh `PS C:\>discuz` root).
- `hermes auth status` → returned the real CLI usage error
  `error: the following arguments are required: provider` — proof the command was deliveormance
  to the actual CLI (the right check is `hermes auth list` / `hermes auth status nous`).

## Facts that matter
- Element indexes go stale between captures — always re-capture immediately before acting.
- A normal-loop `type`+`enter` stops landing when focus drifts back to the chat pane;
  a fresh tab is the reset.
- New tabs start in the HOME dir (`PS C:\Users\...>`), not the last cwd — prefix
  `cd C:\Project\...;` when the command targets a repo.
- read_terminal shows only ~12 viewport lines and canvas scrollback isn't AX-readable;
  prefer short commands whose full output fits the viewport.

## Pitfalls
- **Another app in front corrupts everything**: element bounds resolve to negative /
  off-screen coords and clicks land in the void; Hermes may even vanish from
  `list_windows` / `focus_app` returns "No on-screen window found". Re-raise Hermes, then
  re-capture, then act.
- **Hermes on another (virtual) desktop**: `list_windows` won't list it and `focus_app`
  returns "No on-screen window found for app 'Hermes'". STOP fighting cua-driver — switch
  to MCP `edit_file`/`write_file` for file changes and hand the remaining local commands to
  the user (one slate pasted).
- **IME pollution**: typing into a STALE focused tab produced garbage (`& "$`). A fresh
  tab typed cleanly — treat "open a fresh tab" as the corruption reset.