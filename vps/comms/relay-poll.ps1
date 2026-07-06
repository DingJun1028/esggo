$auth = 'esggo-relay-20260706'
$relay = 'http://localhost:9999'
while ($true) {
  try {
    $status = Invoke-RestMethod -Uri "$relay/status" -Headers @{'X-Auth-Token'=$auth} -TimeoutSec 3
    Write-Output ("[STATUS] uptime=" + $status.uptime + " queued=" + $status.commandsQueued + " total=" + $status.commandsTotal + " results=" + $status.resultsCount)
    $results = Invoke-RestMethod -Uri "$relay/result" -Headers @{'X-Auth-Token'=$auth} -TimeoutSec 3
    if ($results) {
      foreach ($r in $results) {
        if ($r.exitCode -ne -1) {
          Write-Output ('[RESULT] id=' + $r.commandId + ' exit=' + $r.exitCode)
          Write-Output $r.stdout
          if ($r.stderr) { Write-Output ('[STDERR]' + $r.stderr) }
        }
      }
    }
  } catch {
    Write-Output '[WARN] relay poll error'
  }
  Start-Sleep -Seconds 3
}
