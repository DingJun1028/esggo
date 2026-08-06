@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo Starting OmniCore CI fix... log: cron-fix-logs\omnicore-fix.log
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0omnicore-fix.ps1"
echo.
echo ===== EXIT CODE: %ERRORLEVEL% =====
pause
