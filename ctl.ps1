# ESG GO Platform Control Script (ctl.ps1) v1.2
# Windows PowerShell version - High Compatibility Mode (No Emojis)

$APP_DIR = Get-Location
$LOG_FILE = "./omni_trace.log"
$PID_FILE = "./platform.pid"

function Show-Help {
    Write-Host "Usage: .\ctl.ps1 [start|stop|restart|status|logs]" -ForegroundColor Cyan
}

function Start-Platform {
    if (Test-Path $PID_FILE) {
        $pid_val = Get-Content $PID_FILE
        if (Get-Process -Id $pid_val -ErrorAction SilentlyContinue) {
            Write-Host "[!] Platform is already running (PID: $pid_val)" -ForegroundColor Yellow
            return
        }
        Remove-Item $PID_FILE
    }

    Write-Host "[*] Starting OmniAgent Platform (Next.js + Gateway)..." -ForegroundColor Green
    
    # Start Next.js in background
    $nextProcess = Start-Process npm -ArgumentList "run dev" -NoNewWindow -PassThru -RedirectStandardOutput $LOG_FILE -RedirectStandardError $LOG_FILE
    
    # Start OmniAgent Server in background
    $gatewayProcess = Start-Process node -ArgumentList "vps/omni-server.mjs" -NoNewWindow -PassThru
    
    # Record PIDs
    "$($nextProcess.Id), $($gatewayProcess.Id)" | Out-File -FilePath $PID_FILE -Encoding ascii
    
    Write-Host "[v] Platform processes launched." -ForegroundColor Green
    Write-Host "[i] Logs: Get-Content -Path $LOG_FILE -Wait" -ForegroundColor Cyan
}

function Stop-Platform {
    if (Test-Path $PID_FILE) {
        $pids = (Get-Content $PID_FILE) -split ","
        foreach ($p in $pids) {
            $id = $p.Trim()
            if (Get-Process -Id $id -ErrorAction SilentlyContinue) {
                Write-Host "[-] Stopping Process $id..." -ForegroundColor Red
                Stop-Process -Id $id -Force
            }
        }
        Remove-Item $PID_FILE
        Write-Host "[v] Platform stopped." -ForegroundColor Green
    } else {
        Write-Host "[!] No platform process found." -ForegroundColor Yellow
    }
}

function Get-PlatformStatus {
    if (Test-Path $PID_FILE) {
        $pids = (Get-Content $PID_FILE) -split ","
        Write-Host ">>> Platform Status:" -ForegroundColor Blue
        foreach ($p in $pids) {
            $id = $p.Trim()
            $proc = Get-Process -Id $id -ErrorAction SilentlyContinue
            if ($proc) {
                Write-Host "  [ONLINE] PID: $id ($($proc.ProcessName))" -ForegroundColor Green
            } else {
                Write-Host "  [OFFLINE] PID: $id" -ForegroundColor Red
            }
        }
    } else {
        Write-Host "[.] Platform is not running." -ForegroundColor Gray
    }
}

function Show-Logs {
    if (Test-Path $LOG_FILE) {
        Get-Content -Path $LOG_FILE -Tail 50 -Wait
    } else {
        Write-Host "[!] Log file not found." -ForegroundColor Yellow
    }
}

$action = $args[0]
switch ($action) {
    "start"   { Start-Platform }
    "stop"    { Stop-Platform }
    "restart" { Stop-Platform; Start-Sleep -Seconds 2; Start-Platform }
    "status"  { Get-PlatformStatus }
    "logs"    { Show-Logs }
    default   { Show-Help }
}
