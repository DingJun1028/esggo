$path = 'C:\Users\Administrator\AppData\Local\hermes\profiles\orchestrator\config.yaml'
$content = Get-Content -Raw -Path $path
$content = $content -replace 'API_SERVER_HOST: 0\.0\.0\.0','API_SERVER_HOST: 0.0.0.0' + [Environment]::NewLine + 'API_SERVER_PORT: 8642' + [Environment]::NewLine + 'API_SERVER_KEY: 59552fc4c6b9246d392cffa07101cc8eaaf3fa0bfd2384fa2fb167f248c7ad58'
Set-Content -Path $path -Value $content -Encoding UTF8
Write-Output 'Updated'
