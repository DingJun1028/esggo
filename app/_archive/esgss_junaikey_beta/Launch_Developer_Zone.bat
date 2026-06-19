@echo off
REM Developer Zone Quick Launcher
echo.
echo ========================================
echo   🛠️ Developer Zone Launcher
echo ========================================
echo.
echo Opening browser...
echo.

REM Try opening with default browser
start http://localhost:3000/dev-zone
start http://localhost:3000/fortune-encounter

echo ✅ Developer zone and Fortune system opened
echo.
echo 💡 Tip:
echo - This page provides quick access to all features
echo - Available without login
echo.
echo If the page did not open automatically, please visit:
echo http://localhost:3000/dev-zone
echo.
echo Or visit the HTML entry:
echo http://localhost:3000/dev.html
echo.
echo Press any key to close this window...
pause > nul
