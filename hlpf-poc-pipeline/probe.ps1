$ErrorActionPreference = 'Continue'
Set-Location 'C:\Project\esggo-learning-center\hlpf-poc-pipeline'

$log = 'probe_status.txt'
"=== health probe ===" | Out-File -Encoding ascii $log
curl.exe -s -w "health HTTP %{http_code}`n" -o probe_health.json http://127.0.0.1:8082/api/health | Out-File -Append -Encoding ascii $log
"=== beats probe ===" | Out-File -Append -Encoding ascii $log
curl.exe -s -w "beats HTTP %{http_code}`n" -o probe_beats.json http://127.0.0.1:8082/api/beats | Out-File -Append -Encoding ascii $log
"=== jobs POST ===" | Out-File -Append -Encoding ascii $log
curl.exe -s -w "jobs POST HTTP %{http_code}`n" -o probe_jobs.json -X POST http://127.0.0.1:8082/api/jobs | Out-File -Append -Encoding ascii $log
"PROBES DONE" | Out-File -Append -Encoding ascii $log
