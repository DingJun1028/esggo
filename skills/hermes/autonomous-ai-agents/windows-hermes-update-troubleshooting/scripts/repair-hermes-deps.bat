@echo off
chcp 65001 >nul
title Hermes 依賴修復 - Repair Interrupted Update
cd /d "%LOCALAPPDATA%\hermes\hermes-agent"

REM ============================================================
REM  修復「update 被中斷」造成的 venv 半完成狀態
REM
REM  適用症狀：
REM    - hermes version 顯示 Up to date 但出現 "Could not auto-recover"
REM    - pip check 報 "X is not installed" 但 import X 卻成功
REM    - repo 根目錄有 *.hermes-update-staging 殘留
REM
REM  為何要用 .bat：
REM    使用者的 shell 可能是 PowerShell（cd /d 與裸引號執行檔都會失敗），
REM    雙擊 .bat 可完全避開 shell 方言問題。
REM
REM  為何 agent 不能自己跑：
REM    鎖住 .pyd 的正是承載 agent session 的 Desktop backend。
REM ============================================================

echo ============================================================
echo   Hermes 依賴修復
echo ============================================================
echo.

echo [1/6] 檢查是否還有 Hermes 行程...
tasklist /FI "IMAGENAME eq hermes.exe" 2>nul | find /I "hermes.exe" >nul
if not errorlevel 1 (
    echo.
    echo   [!] 偵測到 hermes.exe 仍在執行，檔案會被鎖住。
    echo       請完全關閉 Hermes Desktop 後再執行本腳本。
    echo.
    tasklist /FI "IMAGENAME eq hermes.exe"
    echo.
    pause
    exit /b 1
)
echo       OK - 無 hermes.exe 執行中
echo.

echo [2/6] 清除 pip 改名中斷留下的損毀目錄 (~*)...
for /d %%D in ("venv\Lib\site-packages\~*") do (
    echo       移除 %%~nxD
    rd /s /q "%%D" 2>nul
)
echo       OK
echo.

echo [3/6] 刪除版本不一致的 dist-info metadata...
REM pip 依 dist-info 判定是否已安裝；殘骸會讓它誤判而跳過重裝
REM pyyaml 的METADATA可能因update中斷而損毀(name欄無效)，必須先刪再強裝
for /d %%D in ("venv\Lib\site-packages\pyyaml-*.dist-info")      do rd /s /q "%%D" 2>nul
for /d %%D in ("venv\Lib\site-packages\cryptography-*.dist-info") do rd /s /q "%%D" 2>nul
for /d %%D in ("venv\Lib\site-packages\httplib2-*.dist-info")     do rd /s /q "%%D" 2>nul
echo       OK
echo.

echo [4/6] 強制重裝關鍵套件 (繞過快取與誤判)...
"venv\Scripts\python.exe" -m pip install --force-reinstall --no-cache-dir pyyaml cryptography httplib2
if errorlevel 1 goto :failed
echo.

echo [5/6] 補完整依賴...
"venv\Scripts\python.exe" -m pip install -e ".[all]"
if errorlevel 1 goto :failed
echo.

echo [6/6] 清除 update staging 殘留 (檔案型 + 目錄型)...
del /q *.hermes-update-staging 2>nul
for /d %%D in ("*.hermes-update-staging") do rd /s /q "%%D" 2>nul
echo       OK
echo.

echo ============================================================
echo   驗證 (pip check 必須「無任何輸出」才算修好)
echo ============================================================
"venv\Scripts\python.exe" -m pip check
if errorlevel 1 (
    echo.
    echo   [!] pip check 仍有回報，請把上面訊息貼回給 agent。
    pause
    exit /b 1
)
echo   pip check 通過，無依賴問題。
echo.
echo ============================================================
echo   完成！請重新開啟 Hermes Desktop，接著執行 hermes doctor
echo ============================================================
pause
exit /b 0

:failed
echo.
echo ============================================================
echo   [X] 安裝失敗
echo   若錯誤為「存取被拒 / os error 5」，代表仍有行程鎖住檔案：
echo   開工作管理員結束所有 hermes.exe 與相關 python.exe 後重試。
echo ============================================================
pause
exit /b 1
