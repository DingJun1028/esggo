$ErrorActionPreference = 'Continue'

$log = "C:\Project\esggo-learning-center\deerflow-staging\mcp-test.log"
$enc = New-Object System.Text.UTF8Encoding($false)

function Log([string]$m) {
  $line = "$([DateTime]::Now.ToString('yyyy-MM-dd HH:mm:ss')) $m"
  [System.IO.File]::AppendAllText($log, $line + [Environment]::NewLine, $enc)
}

if (Test-Path $log) { Remove-Item $log }
[System.IO.File]::WriteAllText($log, "--- MCP test start ---" + [Environment]::NewLine, $enc)

$hermes = "$env:LOCALAPPDATA\hermes\hermes-agent\venv\Scripts\hermes.exe"

Log '--- testing my-server ---'
$r = & $hermes mcp test my-server 2>&1
Log "TEST_EXIT=$LASTEXITCODE"
$r | ForEach-Object { Log "TEST_OUT: $_" }

# Reload MCP
Log '--- reloading my-server ---'
$r2 = & $hermes mcp reload my-server 2>&1
Log "RELOAD_EXIT=$LASTEXITCODE"
$r2 | ForEach-Object { Log "RELOAD_OUT: $_" }

Log 'DONE=SCRIPT-END'
[System.IO.File]::AppendAllText($log, 'EXITCODE=0' + [Environment]::NewLine, $enc)
