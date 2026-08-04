@echo off
setlocal
set RELAY_URL=http://127.0.0.1:9999
set AUTH_TOKEN=esggo-relay-20260707
set SCRIPT=%~dp0relay-cli.sh
if "%~1"=="" (
  echo Usage: relay-cli.bat ^<status^|cmd^|results^|ping^>
  exit /b 1
)
bash "%SCRIPT%" %*
endlocal
