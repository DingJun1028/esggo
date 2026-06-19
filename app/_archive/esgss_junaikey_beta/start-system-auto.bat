@echo off
REM ESG Sunshine JunAiKey System - Automated Launch Script
REM 善向永續 奧秘元鑰 - 自動展示模式

echo 🌟 ESG Sunshine JunAiKey System - AUTO LAUNCH
echo ==================================================

REM Check Node
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js missing.
    exit /b 1
)

REM Check Docker
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker missing.
    exit /b 1
)

REM Env Config
if not exist .env (
    echo 📋 Creating default .env...
    copy .env.unified .env >nul
)

REM Install Root Deps
echo 📦 Installing Root Deps...
call npm install --silent

REM Install Sub-systems (Parallel or Sequential)
echo 📦 Installing Sub-system Deps...

cd api
if exist package.json call npm install --silent
cd ..

cd server
if exist package.json call npm install --silent
cd ..

REM Skip others for speed if they are dockerized, but script implies they are needed.
REM Running strictly necessary ones.

echo ✅ Dependencies checked.

REM Docker Compose Up
echo 🚀 Launching Docker Containers...
docker-compose up --build -d

echo ⏳ Waiting for services to stabilize (15s)...
timeout /t 15 /nobreak >nul

echo 🔍 Service Status:
docker-compose ps

echo.
echo 🎉 SYSTEM ACTIVE
echo --------------------------------------------------
echo 🌐 Frontend:    http://localhost:3000
echo 🔧 Backend:     http://localhost:3001
echo --------------------------------------------------
echo.
