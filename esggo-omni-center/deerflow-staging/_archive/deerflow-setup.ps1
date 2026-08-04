$ErrorActionPreference = 'Continue'

$log = "C:\Project\esggo-learning-center\deerflow-staging\deerflow-setup.log"
$enc = New-Object System.Text.UTF8Encoding($false)

function Log([string]$m) {
  $line = "$([DateTime]::Now.ToString('yyyy-MM-dd HH:mm:ss')) $m"
  [System.IO.File]::AppendAllText($log, $line + [Environment]::NewLine, $enc)
}

if (Test-Path $log) { Remove-Item $log }
[System.IO.File]::WriteAllText($log, "--- DeerFlow setup start ---" + [Environment]::NewLine, $enc)

$target = "C:\Project\esggo-deerflow"
Log "TARGET=$target"

# 1. Ensure target dir exists
if (-not (Test-Path $target)) {
  New-Item -ItemType Directory -Force -Path $target | Out-Null
  Log "CREATED_DIR=yes"
} else {
  Log "CREATED_DIR=already-exists"
}

# 2. Check prerequisites
Log "--- prerequisite checks ---"
foreach ($tool in @('git','make','node','pnpm','python3','python','docker')) {
  $cmd = Get-Command $tool -ErrorAction SilentlyContinue
  if ($cmd) { Log "PREREQ_OK $tool -> $($cmd.Source)" }
  else { Log "PREREQ_MISSING $tool" }
}

# 3. Clone DeerFlow directly into target (repo root = C:\Project\esggo-deerflow)
Log '--- clone ---'
Set-Location $target
if (Test-Path (Join-Path $target 'Makefile')) {
  Log 'CLONE=already-present'
} else {
  git clone https://github.com/bytedance/deer-flow.git . 2>&1 | ForEach-Object { Log "GIT $_" }
  Log "CLONE_EXIT=$LASTEXITCODE"
}

# 4. Verify repo
Log 'REPO_EXISTS=$(Test-Path (Join-Path $target ''Makefile''))'
Log "MAKEFILE=$(Test-Path (Join-Path $target 'Makefile'))"
Log "BACKEND=$(Test-Path (Join-Path $target 'backend'))"
Log "FRONTEND=$(Test-Path (Join-Path $target 'frontend'))"
Log "CONFIG_EXAMPLE=$(Test-Path (Join-Path $target 'config.example.yaml'))"

Log 'DONE=SCRIPT-END'
[System.IO.File]::AppendAllText($log, 'EXITCODE=0' + [Environment]::NewLine, $enc)
