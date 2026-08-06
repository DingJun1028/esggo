@echo off
echo === ESGGO Full Production Deployment ===
echo.

:: Step 1: Sync & Deploy Main App
echo [1/3] Executing Production Deployment...
powershell.exe -File "C:\\var\\www\\esggo\\vps\\deploy-production.ps1" `
  -Server "Administrator@161.118.248.180" `
  -ProjectPath "/var/www/esggo" `
  -Rollback

if %ERRORLEVEL% neq 0 (
    echo.
    echo !!! DEPLOYMENT FAILED !!!
    pause
    exit /b 1
)

:: Step 2: Deploy Gateway
echo.
echo [2/3] Restarting OmniAgent Gateway...
ssh Administrator@161.118.248.180 "cd /var/www/esggo/omniagent-gateway && pm2 restart omniagent-gateway"

:: Step 3: Health Check
echo.
echo [3/3] Running Health Checks...
curl -s -w "\nHTTP Status: %{http_code}\n" http://161.118.248.180:3000/api/async
echo.
curl -s -w "\nHTTP Status: %{http_code}\n" http://161.118.248.180:8642

echo.
echo === ALL DEPLOYMENTS COMPLETE ===
pause
