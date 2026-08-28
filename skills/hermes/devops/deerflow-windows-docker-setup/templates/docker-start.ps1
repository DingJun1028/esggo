# docker-start.ps1 — DeerFlow compose bring-up (Docker Desktop daemon-ready + compose up)
# 背景: Docker Desktop 程序在跑 != daemon 就緒; 首次引擎啟動 2-5 分鐘+, git bash 呼叫可能 hang 30-100s
# 用法: 配 .bat wrapper (@echo off\ncd /d C:\Project\esggo-deerflow\npowershell -NoProfile -ExecutionPolicy Bypass -File .\_sandbox\docker-start.ps1\npause)
$ErrorActionPreference = 'Continue'
$log = "$PSScriptRoot\docker-start.log"
function Log($m){ Add-Content -Path $log -Value ($m) -Encoding utf8NOBOM }
Set-Content -Path $log -Value ($(Get-Date -Format s) + " BEGIN") -Encoding utf8NOBOM
$gitBash = "C:\Program Files\Git\bin\bash.exe"   # 絶不能只寫 bash (WSL 攔截)
$root = "C:\Project\esggo-deerflow"

# STEP1: waIT until docker daemon ready (長超時, 不要誤判)
$deadline = (Get-Date).AddMinutes(8)          # daemon ready 總時長 8 分鐘
$dockerOK = $false
while ((Get-Date) -lt $deadline) {
    Log "STEP1 daemon-check ..."
    $info = & $gitBash -lc 'docker version --server 2>/dev/null; echo RC=$?'
    if ($LASTEXITCODE -eq 0 -and $info -match 'RC=0') { $dockerOK = $true; break }
    Start-Sleep -Seconds 15
}
if (-not $dockerOK) {
    Log "DAEMON_NOT_READY"
    # 重啟 Docker Desktop 再試一輪
    Get-Process -Name "Docker Desktop" -ErrorAction SilentlyContinue | Stop-Process -Force
    Start-Sleep 5
    Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    Start-Sleep 120
}
Log ("DAEMON_READY=" + $dockerOK)

# STEP2: compose up (使用正確路徑 docker/docker-compose-dev.yaml, 不是 _sandbox)
& $gitBash -lc "cd $($root -replace 'C:','/c' -replace '\\','/') && docker compose -f docker/docker-compose-dev.yaml up -d --build"
Log ("DOCKER_START_EXIT=" + $LASTEXITCODE)

# STEP3: 驗證容器
& $gitBash -lc "docker ps --format '{{.Names}} {{.Status}}'"
Log "DONE=SCRIPT-END"