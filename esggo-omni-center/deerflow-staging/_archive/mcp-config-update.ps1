$ErrorActionPreference = 'Continue'

$log = "C:\Project\esggo-learning-center\deerflow-staging\mcp-config-update.log"
$enc = New-Object System.Text.UTF8Encoding($false)

function Log([string]$m) {
  $line = "$([DateTime]::Now.ToString('yyyy-MM-dd HH:mm:ss')) $m"
  [System.IO.File]::AppendAllText($log, $line + [Environment]::NewLine, $enc)
}

if (Test-Path $log) { Remove-Item $log }
[System.IO.File]::WriteAllText($log, "--- MCP config update start ---" + [Environment]::NewLine, $enc)

$hermes = "$env:LOCALAPPDATA\hermes\hermes-agent\venv\Scripts\hermes.exe"
Log "HERMES_EXE=$hermes"
Log "HERMES_EXISTS=$(Test-Path $hermes)"

if (-not (Test-Path $hermes)) {
  Log 'FATAL: hermes.exe not found'
  [System.IO.File]::AppendAllText($log, 'EXITCODE=1' + [Environment]::NewLine, $enc)
  exit 1
}

# 1. Point command at the new tri launcher
Log '--- setting command ---'
$r1 = & $hermes config set mcp_servers.my-server.command "C:\Project\esggo-learning-center\fs_server_tri.bat" 2>&1
Log "SET_CMD_EXIT=$LASTEXITCODE"
$r1 | ForEach-Object { Log "SET_CMD_OUT: $_" }

# 2. Clear args so the .bat owns the command line
Log '--- unsetting args ---'
$r2 = & $hermes config unset mcp_servers.my-server.args 2>&1
Log "UNSET_ARGS_EXIT=$LASTEXITCODE"
$r2 | ForEach-Object { Log "UNSET_ARGS_OUT: $_" }

# 3. Verify current config
Log '--- verifying config ---'
$r3 = & $hermes config get mcp_servers.my-server.command 2>&1
Log "GET_CMD_EXIT=$LASTEXITCODE"
$r3 | ForEach-Object { Log "GET_CMD_OUT: $_" }

Log 'DONE=SCRIPT-END'
[System.IO.File]::AppendAllText($log, 'EXITCODE=0' + [Environment]::NewLine, $enc)
