$ErrorActionPreference = 'Continue'
$log = Join-Path $PSScriptRoot 'omniauto-pushfix.log'
"=== OmniAuto push fix $(Get-Date -Format o) ===" | Out-File $log -Encoding utf8

$root = 'C:\Project\esggo-omniauto'
Set-Location $root
"PWD: $(Get-Location)" | Out-File $log -Append -Encoding utf8

"--- git fetch origin main ---" | Out-File $log -Append -Encoding utf8
git fetch origin main 2>&1 | Out-File $log -Append -Encoding utf8
"fetch exit: $LASTEXITCODE" | Out-File $log -Append -Encoding utf8

"--- git status ---" | Out-File $log -Append -Encoding utf8
git status -sb 2>&1 | Out-File $log -Append -Encoding utf8

"--- git rebase origin/main ---" | Out-File $log -Append -Encoding utf8
git rebase origin/main 2>&1 | Out-File $log -Append -Encoding utf8
"rebase exit: $LASTEXITCODE" | Out-File $log -Append -Encoding utf8

if ($LASTEXITCODE -eq 0) {
    "--- git push ---" | Out-File $log -Append -Encoding utf8
    git push 2>&1 | Out-File $log -Append -Encoding utf8
    "push exit: $LASTEXITCODE" | Out-File $log -Append -Encoding utf8
} else {
    "REBASE CONFLICT - manual intervention needed" | Out-File $log -Append -Encoding utf8
}

"--- git log (last 3) ---" | Out-File $log -Append -Encoding utf8
git log --oneline -3 2>&1 | Out-File $log -Append -Encoding utf8

"EXITCODE=0" | Out-File $log -Append -Encoding utf8
