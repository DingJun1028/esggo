@echo off
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0omniauto-commit.ps1"
echo EXITCODE=%ERRORLEVEL% >> "%~dp0omniauto-commit.log"
pause
