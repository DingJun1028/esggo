@echo off
REM OA-Twins :: 一鍵驗證批次（OA-Local 本機執行）
REM 貫徹始終規定：真實輸出才宣稱成功；本檔只跑驗證，不做偽造。
cd /d "%~dp0.."
echo === OA-Twins 自檢 ===
python oab\broker.py --self-test
if errorlevel 1 goto :fail
echo.
echo === 孿生健康檢查 (both) ===
python bin\oa-twin-health.py --check both
if errorlevel 1 goto :fail
echo.
echo === 全部通過（熵<0.1）===  [OA-Local]^<^->[OA-VPS] AWAKE
exit /b 0
:fail
echo.
echo !! 有異常，請見上方 !! 標記。
exit /b 1
