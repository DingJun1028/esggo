@echo off
cd /d "C:\Project\esggo-learning-center\esggo-hub-staging"
powershell -NoProfile -ExecutionPolicy Bypass -File "setup-memory-tencentdb.ps1" > memory-setup-console.log 2>&1
echo EXITCODE=%ERRORLEVEL% >> memory-setup-console.log
pause
