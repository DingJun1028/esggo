# Git Push via Explorer Double-Click

When `my_server`/terminal is unavailable for a repo operation (e.g., `C:\Project\esggo-omniauto` is outside the my_server open directory), use this fallback workflow.

## Pattern

1. Write a PowerShell script (`pushfix.ps1`) with **proper PowerShell syntax** — NOT Bash-style `if (cmd; $LASTEXITCODE -eq 0)`. Use `if ($LASTEXITCODE -eq 0) { ... } else { ... }`.
2. Wrap it in a `.bat` file that calls PowerShell with `-NoProfile -ExecutionPolicy Bypass`.
3. Use `computer_use` to navigate to the script directory in Explorer, then **double-click the `.bat`** to execute.
4. Read the output log to verify results.

## Key Syntax Rules

- PowerShell `if`/`else` blocks use curly braces `{ }`, NOT semicolons.
- `$LASTEXITCODE` is the correct variable for native command exit codes in PowerShell.
- `Out-File -Append -Encoding utf8` for log writes (not `>>` which can have encoding issues).
- Use `Set-Location` instead of `cd` for path changes.

## Example: Pushfix Script Structure

```powershell
$ErrorActionPreference = 'Continue'
$log = Join-Path $PSScriptRoot 'pushfix.log'
"=== Push fix ===" | Out-File $log -Encoding utf8

Set-Location 'C:\Project\esggo-omniauto'

"--- git fetch origin main ---" | Out-File $log -Append -Encoding utf8
git fetch origin main 2>&1 | Out-File $log -Append -Encoding utf8

"--- git rebase origin/main ---" | Out-File $log -Append -Encoding utf8
git rebase origin/main 2>&1 | Out-File $log -Append -Encoding utf8

if ($LASTEXITCODE -eq 0) {
    "--- git push ---" | Out-File $log -Append -Encoding utf8
    git push 2>&1 | Out-File $log -Append -Encoding utf8
} else {
    "REBASE CONFLICT - manual intervention needed" | Out-File $log -Append -Encoding utf8
}

"EXITCODE=0" | Out-File $log -Append -Encoding utf8
```

## Pitfall

The first attempt at this workflow used Bash-style syntax (`if (git diff --cached --quiet; $LASTEXITCODE -eq 1)`) which caused a PowerShell `ParserError` — the script never executed. Always use PowerShell-native `if/else` with `$LASTEXITCODE`.

## Verification

After double-click execution, read the log file to confirm:
- `fetch exit: 0`
- `rebase exit: 0`
- `push exit: 0` (or the specific error if push failed)
- No `ParserError` lines in the log