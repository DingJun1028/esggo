@echo off
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0omniauto-pushfix.ps1"
echo EXITCODE=%ERRORLEVEL% >> "%~dp0omniauto-pushfix.log"
pause
