@echo off
REM ESG儀表板品質門腳本 (Windows)

echo 🔍 執行品質門檢查...

REM 變數
set COVERAGE_THRESHOLD=80
set PERFORMANCE_BUDGET=2000

REM 1. 程式碼品質檢查
echo 檢查程式碼品質...

REM ESLint
echo 運行 ESLint...
call npx eslint . --ext .ts,.tsx --max-warnings 0
if %errorlevel% neq 0 (
    echo ❌ ESLint 檢查失敗
    exit /b 1
)
echo ✅ ESLint 檢查通過

REM TypeScript 類型檢查
echo 運行 TypeScript 類型檢查...
call npx tsc --noEmit
if %errorlevel% neq 0 (
    echo ❌ TypeScript 類型檢查失敗
    exit /b 1
)
echo ✅ TypeScript 類型檢查通過

REM 2. 測試覆蓋率檢查
echo 檢查測試覆蓋率...

call npm run test:coverage
if %errorlevel% neq 0 (
    echo ❌ 測試運行失敗
    exit /b 1
)

REM 檢查覆蓋率閾值
if exist "coverage\coverage-summary.json" (
    REM 使用 PowerShell 解析 JSON
    for /f "tokens=*" %%i in ('powershell -Command "(Get-Content coverage/coverage-summary.json | ConvertFrom-Json).total.lines.pct"') do set LINES_COVERAGE=%%i
    for /f "tokens=*" %%i in ('powershell -Command "(Get-Content coverage/coverage-summary.json | ConvertFrom-Json).total.functions.pct"') do set FUNCTIONS_COVERAGE=%%i

    echo 覆蓋率報告:
    echo   行覆蓋率: %LINES_COVERAGE%%
    echo   函數覆蓋率: %FUNCTIONS_COVERAGE%%

    REM 檢查是否達到閾值
    REM 注意: Windows batch 沒有浮點比較，這裡簡化處理
    if %LINES_COVERAGE% lss %COVERAGE_THRESHOLD% (
        echo ❌ 行覆蓋率未達到 %COVERAGE_THRESHOLD%% 閾值
        exit /b 1
    )

    if %FUNCTIONS_COVERAGE% lss %COVERAGE_THRESHOLD% (
        echo ❌ 函數覆蓋率未達到 %COVERAGE_THRESHOLD%% 閾值
        exit /b 1
    )

    echo ✅ 測試覆蓋率檢查通過
) else (
    echo ❌ 找不到覆蓋率報告文件
    exit /b 1
)

REM 3. 安全性檢查
echo 執行安全性檢查...

REM 檢查是否有安全漏洞
call npm audit --audit-level moderate
if %errorlevel% neq 0 (
    echo ❌ 發現安全漏洞
    exit /b 1
)
echo ✅ 安全性檢查通過

REM 4. 效能檢查
echo 檢查應用效能...

REM 建構應用
call npm run build
if %errorlevel% neq 0 (
    echo ❌ 應用建構失敗
    exit /b 1
)

REM 檢查 Bundle 大小 (簡化檢查)
if exist "dist\assets\*.js" (
    for %%A in (dist\assets\*.js) do set BUNDLE_SIZE=%%~zA
    set /a BUNDLE_SIZE_KB=%BUNDLE_SIZE%/1024

    echo Bundle 大小: %BUNDLE_SIZE_KB%KB

    if %BUNDLE_SIZE_KB% gtr 2048 (
        echo ❌ Bundle 大小超過 2MB 限制
        exit /b 1
    )
    echo ✅ Bundle 大小檢查通過
)

echo.
echo 🎉 所有品質門檢查通過！
echo.
echo 檢查摘要:
echo   ✅ ESLint 檢查
echo   ✅ TypeScript 類型檢查
echo   ✅ 測試覆蓋率 (%COVERAGE_THRESHOLD%+)
echo   ✅ 安全性審計
echo   ✅ Bundle 大小檢查

pause