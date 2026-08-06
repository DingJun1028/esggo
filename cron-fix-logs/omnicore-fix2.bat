@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo Starting OmniCore CI fix ROUND 2... log: cron-fix-logs\omnicore-fix2.log
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0omnicore-fix2.ps1"
echo.
echo ===== EXIT CODE: %ERRORLEVEL% =====
pause
