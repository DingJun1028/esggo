# Windows Hermes update — directory-type .hermes-update-staging pitfall

Captured 2026-08 from a real interrupted `hermes update` on Windows.

## Symptom
After an interrupted update, `git status` / repo root shows leftover
`.hermes-update-staging` entries. `del /q *.hermes-update-staging` removes
NONE of them — because the interrupted rename turned SOURCE DIRECTORIES into
directories named `xxx.hermes-update-staging` (not files).

Confirmed count in the incident: 181 leftovers = 176 files + 5 directories
(`acp_adapter`, `agent`, `apps`, `assets`, `contributors`).

## Detection
```bash
ls -d *.hermes-update-staging   # directories only
ls  *.hermes-update-staging     # files only
```
If the first returns entries, you have directory-type leftovers.

## Fix (in the .bat, BEFORE git reset)
```bat
del /q *.hermes-update-staging 2>nul
for /d %%D in ("*.hermes-update-staging") do rd /s /q "%%D" 2>nul
```
The `for /d` is mandatory — `del /q` only deletes files.

## Why this matters
`hermes update` renames source dirs to `*.hermes-update-staging` mid-copy; if it
is killed (e.g. Desktop app lock, closed laptop), the rename half-completes and
leaves dir-type debris. A stale `.bat` using only `del /q` will silently skip
them, and the NEXT update attempt can collide with the same dir names.

## Cron watchdog caveat
A `cron` job that polls "update when Hermes is closed" does NOT fire when Hermes
is closed — the scheduler lives inside hermes.exe. So the watchdog is a no-op on
shutdown. The reliable path remains: close Hermes fully, then double-click the
hardened .bat manually.
