@echo off
setlocal EnableDelayedExpansion
cd /d C:\Project\esggo-learning-center\hlpf-poc-pipeline

REM =====================================================================
REM  HLPF POC Pipeline v0.3.0 - one-command runner + spec verification
REM  Usage: double-click, or:  run_hlpf.bat
REM  Requires: python, ffmpeg/ffprobe (auto-detected via WinGet path)
REM =====================================================================

set LOG=pipeline_run.log
set PORT=8082
set BASE=http://127.0.0.1:%PORT%
set OUT_DIR=out

echo ============================================ > %LOG%
echo HLPF POC Pipeline v0.3.0  run %date% %time% >> %LOG%
echo ============================================ >> %LOG%

REM ---- resolve ffprobe (same candidate list as app.py) ----
set FFPROBE=ffprobe
where ffprobe >nul 2>nul || set "FFPROBE=C:\Users\dingj\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wek3d8bbwe\ffmpeg-8.1.2-full_build\bin\ffprobe.exe"

REM [1/6] kill any old server on :PORT
echo [1/6] killing old :%PORT% ...
echo [1/6] killing old :%PORT% ... >> %LOG%
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :%PORT% ^| findstr LISTENING') do taskkill /f /pid %%a >> %LOG% 2>&1
timeout /t 2 /nobreak > nul

REM [2/6] install deps
echo [2/6] pip install -r requirements.txt ...
echo [2/6] pip install ... >> %LOG%
python -m pip install -r requirements.txt >> %LOG% 2>&1
echo PIP_EXIT=%errorlevel% >> %LOG%

REM [3/6] start uvicorn in background
echo [3/6] starting uvicorn (background) ...
echo [3/6] starting uvicorn ... >> %LOG%
start "hlpf-uvicorn" /min cmd /c "python -m uvicorn app:app --host 127.0.0.1 --port %PORT% > uvicorn.log 2>&1"

REM [4/6] wait for health (poll up to 30s)
echo [4/6] waiting for /api/health ...
echo [4/6] waiting for health ... >> %LOG%
set READY=0
for /L %%i in (1,1,30) do (
  curl.exe -s -o nul -w "%%{http_code}" %BASE%/api/health 2>nul | findstr "200" >nul && (set READY=1 & goto :health_ok)
  timeout /t 1 /nobreak > nul
)
:health_ok
if "!READY!"=="0" (
  echo [FAIL] server did not become healthy. See uvicorn.log
  echo HEALTH_TIMEOUT >> %LOG%
  type %LOG%
  exit /b 1
)
echo health OK >> %LOG%
echo        health OK

REM [5/6] trigger the job (renders posters + TTS + assembles final.mp4)
echo [5/6] POST /api/jobs (this takes ~60-90s) ...
echo [5/6] POST /api/jobs ... >> %LOG%
for /f "delims=" %%r in ('curl.exe -s -m 300 -o job_result.json -w "jobs HTTP %%{http_code} in %%{time_total}s" -X POST %BASE%/api/jobs') do set JOBMSG=%%r
echo !JOBMSG!
echo !JOBMSG! >> %LOG%
echo. >> %LOG%

REM [6/6] locate final.mp4 and verify codec spec
echo [6/6] verifying final.mp4 against spec ...
echo [6/6] verifying final.mp4 ... >> %LOG%
set FINAL=
for /r "%OUT_DIR%" %%f in (final.mp4) do (
  if not defined FINAL set FINAL=%%f
)
if not defined FINAL (
  echo [FAIL] final.mp4 not found under %OUT_DIR%
  echo FINAL_NOT_FOUND >> %LOG%
  echo ============================================ >> %LOG%
  type %LOG%
  exit /b 1
)

for /f "delims=" %%v in ('"%FFPROBE%" -v error -select_streams v:0 -show_entries stream^=codec_name^,width^,height -of csv^=p^=0 "%FINAL%"') do set VINFO=%%v
for /f "delims=" %%a in ('"%FFPROBE%" -v error -select_streams a:0 -show_entries stream^=codec_name^,sample_rate -of csv^=p^=0 "%FINAL%"') do set AINFO=%%a

echo video: %VINFO% >> %LOG%
echo audio: %AINFO% >> %LOG%
echo        video = %VINFO%
echo        audio = %AINFO%

if "%VINFO%"=="h264,1920,1080" (
  if "%AINFO%"=="aac,48000" (
    echo.
    echo ============================================================
    echo  [VERIFIED] final.mp4 matches the POC spec
    echo    video = %VINFO%
    echo    audio = %AINFO%
    echo    path  = %FINAL%
    echo ============================================================
    echo [VERIFIED] video=%VINFO% audio=%AINFO% >> %LOG%
    echo ============================================ >> %LOG%
    exit /b 0
  )
)
echo.
echo ============================================================
echo  [MISMATCH] spec not met
echo    expected video = h264,1920,1080   got = %VINFO%
echo    expected audio = aac,48000        got = %AINFO%
echo ============================================================
echo [MISMATCH] expected h264,1920,1080 / aac,48000 got %VINFO% / %AINFO% >> %LOG%
echo ============================================ >> %LOG%
exit /b 2
