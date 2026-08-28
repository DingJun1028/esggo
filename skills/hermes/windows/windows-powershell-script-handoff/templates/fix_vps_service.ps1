# fix_vps_service.ps1 — restart a pm2 service on the esggo VPS and verify
# Run on the WINDOWS host (sandbox cannot SSH). Right-click -> Run with PowerShell.
$ErrorActionPreference = 'Continue'

# Auto-detect private key (avoid hardcoding a name that may not exist)
$Candidates = @(
  "$HOME\.ssh\ci_deploy_key",
  "$HOME\.ssh\id_rsa",
  "$HOME\.ssh\esggo_original",
  "$HOME\.ssh\esggo_vps"
)
$KEY = $null
foreach ($c in $Candidates) { if (Test-Path $c) { $KEY = $c; break } }
if (-not $KEY) {
  Write-Host "[X] No SSH private key found in: $($Candidates -join ', ')" -ForegroundColor Red
  exit 1
}
Write-Host "[*] Using key: $KEY" -ForegroundColor Green

$RHOST = "ubuntu@161.118.248.180"   # NOTE: $RHOST not $HOST (reserved)
$SVC   = "universal-translator"     # pm2 service name
$REPO  = "/var/www/esggo"           # repo root on VPS
$PORT  = "8788"                     # local port

Write-Host "==[1] pm2 status==" -ForegroundColor Cyan
ssh -i "$KEY" $RHOST "pm2 ls" 2>&1

Write-Host "==[2] service detail==" -ForegroundColor Cyan
ssh -i "$KEY" $RHOST "pm2 describe $SVC 2>&1 | head -30" 2>&1

Write-Host "==[3] restart/start==" -ForegroundColor Cyan
ssh -i "$KEY" $RHOST "cd $REPO && (pm2 describe $SVC >`$null 2>&1 && pm2 restart $SVC || pm2 start apps/$SVC/server.mjs --name $SVC)" 2>&1

Write-Host "==[4] wait 10s==" -ForegroundColor Cyan
Start-Sleep -Seconds 10

Write-Host "==[5] localhost probe==" -ForegroundColor Cyan
ssh -i "$KEY" $RHOST "curl.exe -s -o /dev/null -w 'LOCAL_%PORT%=%{http_code}`n' --max-time 10 http://127.0.0.1:$PORT/ || echo LOCAL_DOWN" 2>&1

Write-Host "==[6] external probe==" -ForegroundColor Cyan
try {
  $r = Invoke-WebRequest -Uri "https://translate.esggo.co/" -TimeoutSec 15 -UseBasicParsing -ErrorAction Stop
  Write-Host "EXT_HTTP=$($r.StatusCode)" -ForegroundColor $(if($r.StatusCode -eq 200){'Green'}else{'Red'})
} catch {
  Write-Host "EXT_HTTP=FAILED ($($_.Exception.Message))" -ForegroundColor Red
}
Write-Host "==[DONE]==" -ForegroundColor Magenta
