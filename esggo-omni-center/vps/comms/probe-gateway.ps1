$base = 'http://127.0.0.1:8642'
try {
  $r1 = Invoke-WebRequest -Uri ($base + '/health') -UseBasicParsing -TimeoutSec 5
  Write-Output ('/health STATUS=' + $r1.StatusCode)
  Write-Output $r1.Content
} catch {
  Write-Output ('/health ERROR=' + $_.Exception.Message)
}
try {
  $r2 = Invoke-WebRequest -Uri ($base + '/api/v1/status') -UseBasicParsing -TimeoutSec 5
  Write-Output ('/api/v1/status STATUS=' + $r2.StatusCode)
  Write-Output $r2.Content
} catch {
  Write-Output ('/api/v1/status ERROR=' + $_.Exception.Message)
}
