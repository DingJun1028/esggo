$ErrorActionPreference = 'Continue'
$log = Join-Path $PSScriptRoot 'omniauto-commit.log'
"=== OmniAuto commit+pytest $(Get-Date -Format o) ===" | Out-File $log -Encoding utf8

$root = 'C:\Project\esggo-omniauto'
if (-not (Test-Path $root)) { "FATAL: $root missing" | Out-File $log -Append -Encoding utf8; exit 1 }
Set-Location $root
"PWD: $(Get-Location)" | Out-File $log -Append -Encoding utf8

# 0. git status
"--- git status ---" | Out-File $log -Append -Encoding utf8
git status --short 2>&1 | Out-File $log -Append -Encoding utf8

# 1. python syntax check
"--- py_compile ---" | Out-File $log -Append -Encoding utf8
python -m py_compile src/config.py src/renderer.py 2>&1 | Out-File $log -Append -Encoding utf8
"py_compile exit: $LASTEXITCODE" | Out-File $log -Append -Encoding utf8

# 2. pytest (if tests dir exists)
"--- pytest ---" | Out-File $log -Append -Encoding utf8
if (Test-Path 'tests') {
    python -m pytest -q tests 2>&1 | Out-File $log -Append -Encoding utf8
    "pytest exit: $LASTEXITCODE" | Out-File $log -Append -Encoding utf8
} else {
    "no tests/ dir, skipped full pytest" | Out-File $log -Append -Encoding utf8
}

# 3. commit only if there are staged changes
"--- git add + commit ---" | Out-File $log -Append -Encoding utf8
git add src/config.py src/renderer.py 2>&1 | Out-File $log -Append -Encoding utf8
git diff --cached --stat 2>&1 | Out-File $log -Append -Encoding utf8
git diff --cached --quiet 2>&1 | Out-Null
$stagedExit = $LASTEXITCODE
"staged-check exit: $stagedExit (0=no diff, 1=has diff)" | Out-File $log -Append -Encoding utf8
if ($stagedExit -eq 1) {
    git commit -m "feat: H.264 1080p + AAC 48kHz output spec (config.py + renderer.py)" 2>&1 | Out-File $log -Append -Encoding utf8
    "commit exit: $LASTEXITCODE" | Out-File $log -Append -Encoding utf8
} else {
    "nothing staged to commit (files already clean or identical)" | Out-File $log -Append -Encoding utf8
}

# 4. push
"--- git push ---" | Out-File $log -Append -Encoding utf8
git push 2>&1 | Out-File $log -Append -Encoding utf8
"push exit: $LASTEXITCODE" | Out-File $log -Append -Encoding utf8

"EXITCODE=0" | Out-File $log -Append -Encoding utf8
