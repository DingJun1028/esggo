# GUI Terminal Driver — when `terminal`/docker tools are unavailable

Proven 2026-08-21 (session: "最佳實踐覺 esggo"). Use when the Hermes CLI session has
NO `terminal`/`read_file`/`write_file`/`patch` tools AND `execute_code` returns
`Docker command is available but 'docker version' failed`.

## Fallback ladder

1. Confirm `terminal` is absent from the available tool list (don't retry it).
2. Try `execute_code` once. If `Docker ... failed` → sandbox backend is down; stop.
3. `computer_use` `capture app='screen' mode='vision'` → confirm Windows desktop visible.
4. Drive the **already-open Windows Terminal** (real shell at `C:\Project\esggo`) with
   FOREGROUND SendInput.

## Key-sequence recipe

```text
# focus / open a terminal
computer_use  action=key  delivery_mode=foreground  keys=win
   → then type "wt" (or "powershell") + enter to launch/focus Windows Terminal

# OR attach to the existing window
computer_use  action=capture  app=WindowsTerminal.exe  mode=vision
   → vision model reports active tab + prompt; click the right tab if needed

# run a command (ALWAYS clear buffer first — see pitfalls)
computer_use  action=key     delivery_mode=foreground  keys=ctrl+c   # cancel pending line
computer_use  action=type    delivery_mode=foreground  text=cd C:\Project\esggo
computer_use  action=key     delivery_mode=foreground  keys=enter
computer_use  action=type    delivery_mode=foreground  text=pnpm run lint
computer_use  action=key     delivery_mode=foreground  keys=enter

# read real output
computer_use  action=capture  app=WindowsTerminal.exe  mode=vision
   → vision transcription = terminal text (treat as evidence)
```

## Pitfalls (each cost a turn this session)

- **Buffer concat**: `type` appends to the prompt line. A leftover `cat ...txt` made
  `pnpm run lint` become `...txt.tpnpm run lint` → Get-Content error. Clear with
  `enter` (empty) or `ctrl+c` before typing.
- **Pending destructive cmd**: an unexecuted `gh pr close 837` was in the buffer.
  `ctrl+c` first, verify clean `PS C:\Project\esggo>` prompt, THEN type.
- **Wrong tab**: `app=WindowsTerminal.exe` capture sometimes grabs a PowerShell tab
  with old `git` history instead of the cmd.exe tab running lint. Use `ctrl+tab` to
  switch tabs, then re-capture.

## Expected non-failure warnings

`pnpm run lint` emits: `WARN engine ... required Node "20", current v24.19.0`,
eslint/`@types/uuid`/transitive deprecation warnings, `.eslintignore` deprecation.
These are environment warnings, not code errors. Report them honestly; the gate is the
eslint error count from `eslint src/ --fix --max-warnings 200`.
