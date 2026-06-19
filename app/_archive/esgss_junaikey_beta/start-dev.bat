@echo off
REM AVOS v6.0 本地開發啟動腳本（Windows 版本）

echo ========================================
echo   AVOS v6.0 開發環境啟動
echo ========================================
echo.

REM 檢查 ngrok 是否安裝
where ngrok >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [警告] ngrok 未安裝
    echo 請訪問 https://ngrok.com/download 下載安裝
    echo 或使用: choco install ngrok
    pause
    exit /b 1
)

REM 檢查 ngrok.yml
if not exist "ngrok.yml" (
    echo [錯誤] ngrok.yml 未找到
    pause
    exit /b 1
)

echo [1/3] 啟動前端開發服務器 (Port 5173)...
start "AVOS Frontend" cmd /c "npm run dev"
timeout /t 3 /nobreak >nul

REM echo [2/3] 啟動後端 API 服務器 (Port 3001)...
REM start "AVOS Backend" cmd /c "npm run dev:server"
REM timeout /t 2 /nobreak >nul

echo.
echo [3/3] 請選擇 ngrok 啟動模式：
echo 1) 啟動所有隧道 (Frontend + Backend)
echo 2) 只啟動 Frontend
echo 3) 只啟動 Backend
echo.
set /p choice="請選擇 (1-3): "

if "%choice%"=="1" (
    echo 啟動所有隧道...
    ngrok start --all --config=ngrok.yml
) else if "%choice%"=="2" (
    echo 啟動 Frontend 隧道...
    ngrok start avos-frontend --config=ngrok.yml
) else if "%choice%"=="3" (
    echo 啟動 Backend 隧道...
    ngrok start avos-backend --config=ngrok.yml
) else (
    echo 無效選擇，啟動所有隧道
    ngrok start --all --config=ngrok.yml
)

pause
