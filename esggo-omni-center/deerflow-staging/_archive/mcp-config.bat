@echo off
cd /d "C:\Project\esggo-learning-center\deerflow-staging"
powershell -NoProfile -ExecutionPolicy Bypass -File mcp-config-update.ps1
echo DONE_BAT
pause
