# Patch orchestrator config.yaml with API_SERVER_PORT and API_SERVER_KEY from environment
param(
    [Parameter(Mandatory=$true)]
    [string]$ApiKey
)

$path = 'C:\Users\Administrator\AppData\Local\hermes\profiles\orchestrator\config.yaml'
$content = Get-Content -Raw -Path $path
$content = $content -replace 'API_SERVER_HOST: 0\.0\.0\.0',"API_SERVER_HOST: 0.0.0.0$([Environment]::NewLine)API_SERVER_PORT: 8642$([Environment]::NewLine)API_SERVER_KEY: $ApiKey"
Set-Content -Path $path -Value $content -Encoding UTF8
Write-Output 'Updated'
