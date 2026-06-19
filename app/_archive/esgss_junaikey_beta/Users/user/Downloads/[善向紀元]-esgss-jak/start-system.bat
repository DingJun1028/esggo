@echo off
REM ESG Sunshine JunAiKey System - 快速啟動腳本 (Windows)
REM 善向永續 萬能元鑰

echo 🌟 ESG Sunshine JunAiKey System - 善向永續 萬能元鑰
echo ==================================================

REM 檢查 Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js 未安裝，請先安裝 Node.js 20+
    pause
    exit /b 1
)

REM 檢查 Docker
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker 未安裝，請先安裝 Docker
    pause
    exit /b 1
)

REM 檢查 Docker Compose
docker-compose --version >nul 2>&1
if errorlevel 1 (
    docker compose version >nul 2>&1
    if errorlevel 1 (
        echo ❌ Docker Compose 未安裝，請先安裝 Docker Compose
        pause
        exit /b 1
    )
)

echo ✅ 系統依賴檢查通過

REM 創建環境配置文件
if not exist .env (
    echo 📋 創建環境配置...
    copy .env.unified .env
    echo ⚠️  請編輯 .env 文件並填入您的 API 金鑰
    echo    - GEMINI_API_KEY
    echo    - OPENAI_API_KEY
    echo    - 其他必要的配置
    echo.
    echo 按任意鍵繼續 (請先配置 .env 文件)...
    pause >nul
)

REM 安裝根目錄依賴
echo 📦 安裝主應用依賴...
call npm install

REM 安裝子系統依賴
echo 📦 安裝子系統依賴...

echo    - 安裝 API 服務...
cd api
call npm install
cd ..

echo    - 安裝 JunAiKey 系統...
cd jun-ai-key
call npm install
cd ..

echo    - 安裝 JunAiKey 資料庫服務器...
cd junaikeydb-server
call npm install
cd ..

echo    - 安裝 Shan Xiang Tech...
cd shan-xiang-tech
call npm install
cd ..

echo    - 安裝主後端服務器...
cd server
call npm install
cd ..

echo ✅ 所有依賴安裝完成

REM 啟動系統
echo 🚀 啟動 ESG Sunshine Universal System...
echo.
echo 系統服務將在以下端口運行：
echo   🌐 API Gateway:     http://localhost
echo   🎨 前端應用:        http://localhost:3000
echo   🔧 主後端API:       http://localhost:3001
echo   📊 舊版API:         http://localhost:3002
echo   🧠 JunAiKey智庫:     http://localhost:3003
echo   🤖 Shan Xiang Tech:  http://localhost:3004
echo   📈 監控面板:        http://localhost:3005
echo.
echo 系統健康檢查: http://localhost/health
echo.

REM 啟動 Docker 服務
docker-compose up --build -d

REM 等待服務啟動
echo ⏳ 等待服務啟動...
timeout /t 10 /nobreak >nul

REM 檢查服務狀態
echo 🔍 檢查服務狀態...
docker-compose ps

echo.
echo 🎉 ESG Sunshine JunAiKey System 啟動成功！
echo 🌟 善向永續 萬能元鑰
echo.
echo 訪問 http://localhost 開始使用系統
echo.
echo 管理命令：
echo   停止系統: docker-compose down
echo   查看日誌: docker-compose logs -f
echo   重啟服務: docker-compose restart
echo.
echo 按任意鍵退出...
pause >nul