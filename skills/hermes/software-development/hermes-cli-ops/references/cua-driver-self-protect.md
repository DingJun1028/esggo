# cua-driver self-protection blocks computer_use on Hermes.exe

## Error observed (2026-08-07, later turn)
When the agent tried `computer_use(action='capture', app='screen')` / click / type
against the Hermes desktop app while the SSH backend was wedged:

```
{"mode": "vision", ... "app": "Hermes.exe", ...}
vision_analysis: ... screenshot of Hermes.exe ...
```
and any click/type/key attempt returned:

```
Permission denied: Cua Driver refuses operations that target its own authorization process
```

## What this means
- cua-driver treats `Hermes.exe` as its OWN authorization process.
- It refuses ALL cua operations (capture-with-action, click, type, key, foreground
  or background) that target the Hermes app window.
- Therefore the `hermes-cli-ops` "Severe lock → drive embedded terminal via
  computer_use" recovery path is NO LONGER viable. Do not retry it.

## What still works
- `computer_use` against OTHER apps (Windows Terminal, browsers, file explorers)
  is unaffected — only Hermes.exe itself is shielded.
- The only escape from an SSH-wedged terminal is user action:
  user runs `hermes config set terminal.backend local` in their OWN shell +
  full Hermes restart, OR hand-edits `%LOCALAPPDATA%\hermes\config.yaml`
  (`terminal.backend: local`) + restart.

## Pitfall
Do not "helpfully" try to type the fix into the Hermes embedded terminal via
computer_use — cua-driver will refuse and you waste a turn. State the blocker
honestly and hand the two-step fix to the user.
