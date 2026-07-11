@echo off
# ==========================================
# 完全代主自行 - CLI 啟動腳本 (Windows)
# ==========================================

set SCRIPT_DIR=%~dp0

REM 檢查 Node.js
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
  echo ❌ 錯誤: 找不到 Node.js
  exit /b 1
)

REM 檢查依賴
if not exist "%SCRIPT_DIR%node_modules" (
  echo 📦 安裝依賴...
  cd /d "%SCRIPT_DIR%" && npm install
)

REM 檢查構建
if not exist "%SCRIPT_DIR%dist" (
  echo 🔨 構建 CLI...
  cd /d "%SCRIPT_DIR%" && npm run build
)

REM 執行 CLI
node "%SCRIPT_DIR%dist\delegation.js" %*
