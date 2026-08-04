@echo off
setlocal
cd /d C:\Project\esggo-learning-center\hlpf-poc-pipeline
set LOG=pipeline.log
set OUT_DIR=out

echo === HLPF POC Pipeline v0.3.0 === > %LOG% 2>&1
echo === Started: %date% %time% === >> %LOG% 2>&1

echo === kill old :8082 === >> %LOG% 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8082 ^| findstr LISTENING') do taskkill /f /pid %%a >> %LOG% 2>&1
timeout /t 2 /nobreak > nul

echo === pip install === >> %LOG% 2>&1
python -m pip install -r requirements.txt >> %LOG% 2>&1
echo PIP_EXIT=%errorlevel% >> %LOG% 2>&1

echo === start uvicorn === >> %LOG% 2>&1
start "hlpf-uvicorn" /min cmd /c "python -m uvicorn app:app --host 127.0.0.1 --port 8082 > uvicorn.log 2>&1"
timeout /t 10 /nobreak > nul

echo === health probe === >> %LOG% 2>&1
curl.exe -s -o health_probe.json -w "health HTTP %%{http_code}" http://127.0.0.1:8082/api/health >> %LOG% 2>&1
echo. >> %LOG% 2>&1

echo === beats probe === >> %LOG% 2>&1
curl.exe -s -o beats_probe.json -w "beats HTTP %%{http_code}" http://127.0.0.1:8082/api/beats >> %LOG% 2>&1
echo. >> %LOG% 2>&1

echo === jobs POST === >> %LOG% 2>&1
curl.exe -s -o jobs_probe.json -w "jobs HTTP %%{http_code}" -X POST http://127.0.0.1:8082/api/jobs >> %LOG% 2>&1
echo. >> %LOG% 2>&1

echo === job_result.json === >> %LOG% 2>&1
if exist job_result.json (
    type job_result.json >> %LOG% 2>&1
) else (
    echo job_result.json not found >> %LOG% 2>&1
)

echo === out/ tree === >> %LOG% 2>&1
if exist %OUT_DIR% (
    dir /s /b %OUT_DIR% >> %LOG% 2>&1
) else (
    echo %OUT_DIR% directory not found >> %LOG% 2>&1
)

echo === ALL DONE === >> %LOG% 2>&1
echo === See %LOG% for details ===
