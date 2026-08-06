@echo off
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0omniauto-patch.ps1"
echo EXITCODE=%ERRORLEVEL% >> "%~dp0omniauto-output-patch.log"
pause
