# ============================================================
# ESGGO VPS Command Tool — Send commands to VPS from local
# ============================================================
# Usage:
#   .\vps-cmd.ps1 "ls -la /var/www"
#   .\vps-cmd.ps1 -Status
#   .\vps-cmd.ps1 -SshFix
#   .\vps-cmd.ps1 -Results
#   .\vps-cmd.ps1 -Interactive
# ============================================================

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

[CmdletBinding()]
param(
  [string]$Command,
  [switch]$Status,
  [switch]$SshFix,
  [switch]$Results,
  [switch]$Interactive,
  [int]$Port = 9999,
  [string]$AuthToken = "esggo-relay-$(Get-Date -Format 'yyyyMMdd')"
)

$Relay = "http://localhost:${Port}"

function Show-Help {
  Write-Host "ESGGO VPS Command Tool" -ForegroundColor Cyan
  Write-Host ""
  Write-Host "Usage:" -ForegroundColor Yellow
  Write-Host "  .\vps-cmd.ps1 `"ls -la`"           — Send command to VPS"
  Write-Host "  .\vps-cmd.ps1 -Status              — Check relay status"
  Write-Host "  .\vps-cmd.ps1 -SshFix              — Queue SSH repair"
  Write-Host "  .\vps-cmd.ps1 -Results             — View latest results"
  Write-Host "  .\vps-cmd.ps1 -Interactive         — Interactive mode"
  Write-Host ""
}

function Send-Cmd($cmd, $desc = "") {
  $body = @{ command = $cmd; description = $desc } | ConvertTo-Json -Compress
  try {
    $r = Invoke-RestMethod -Uri "$Relay/cmd" -Method POST -Body $body -ContentType "application/json" -Headers @{"X-Auth-Token"=$AuthToken} -TimeoutSec 5
    Write-Host "[QUEUED] $($r.id) — $($r.description)" -ForegroundColor Green
    return $r
  } catch {
    Write-Host "[ERROR] Cannot reach relay. Is vps-relay-server.ps1 running?" -ForegroundColor Red
    return $null
  }
}

function Get-Status {
  try {
    $r = Invoke-RestMethod -Uri "$Relay/status" -Headers @{"X-Auth-Token"=$AuthToken} -TimeoutSec 5
    Write-Host "Relay Status:" -ForegroundColor Cyan
    Write-Host "  Uptime:         $($r.uptime) min" -ForegroundColor White
    Write-Host "  Commands Queued: $($r.commandsQueued)" -ForegroundColor White
    Write-Host "  Commands Total:  $($r.commandsTotal)" -ForegroundColor White
    Write-Host "  Results:         $($r.resultsCount)" -ForegroundColor White
    Write-Host "  VPS IP:          $($r.vpsIp)" -ForegroundColor White
    return $r
  } catch {
    Write-Host "[ERROR] Cannot reach relay" -ForegroundColor Red
    return $null
  }
}

function Get-Results {
  try {
    $r = Invoke-RestMethod -Uri "$Relay/result" -Headers @{"X-Auth-Token"=$AuthToken} -TimeoutSec 5
    if ($r.Count -eq 0) {
      Write-Host "No results yet" -ForegroundColor Gray
      return
    }
    foreach ($res in $r) {
      Write-Host ""
      Write-Host "--- $($res.commandId) ---" -ForegroundColor Yellow
      Write-Host "  Exit: $($res.exitCode)" -ForegroundColor $(if ($res.exitCode -eq 0) { "Green" } else { "Red" })
      Write-Host "  Host: $($res.hostname)" -ForegroundColor Gray
      Write-Host "  Time: $($res.ts)" -ForegroundColor Gray
      if ($res.stdout) { Write-Host "  STDOUT:" -ForegroundColor Cyan; Write-Host $res.stdout }
      if ($res.stderr) { Write-Host "  STDERR:" -ForegroundColor Red; Write-Host $res.stderr }
    }
  } catch {
    Write-Host "[ERROR] Cannot reach relay" -ForegroundColor Red
  }
}

function Start-Interactive {
  Write-Host "Interactive VPS Shell (type 'exit' to quit)" -ForegroundColor Cyan
  Write-Host "Relay: $Relay" -ForegroundColor Gray
  Write-Host ""
  
  while ($true) {
    $input_cmd = Read-Host "vps>"
    if ($input_cmd -eq "exit" -or $input_cmd -eq "quit") { break }
    if ($input_cmd -eq "status") { Get-Status; continue }
    if ($input_cmd -eq "results") { Get-Results; continue }
    if ($input_cmd -eq "ssh-fix") { Send-Cmd "ufw allow 22/tcp && ufw reload && systemctl restart ssh" "SSH repair"; continue }
    if ([string]::IsNullOrWhiteSpace($input_cmd)) { continue }
    
    $r = Send-Cmd $input_cmd
    if ($r) {
      Write-Host "Waiting for result..." -ForegroundColor DarkGray
      # Poll for result
      for ($i = 0; $i -lt 30; $i++) {
        Start-Sleep -Seconds 2
        $results = Invoke-RestMethod -Uri "$Relay/result" -Headers @{"X-Auth-Token"=$AuthToken} -TimeoutSec 3 -ErrorAction SilentlyContinue
        $latest = $results | Where-Object { $_.commandId -eq $r.id }
        if ($latest) {
          if ($latest.exitCode -eq 0) {
            Write-Host $latest.stdout -ForegroundColor White
          } else {
            Write-Host "Exit code: $($latest.exitCode)" -ForegroundColor Red
            if ($latest.stdout) { Write-Host $latest.stdout }
            if ($latest.stderr) { Write-Host $latest.stderr -ForegroundColor Red }
          }
          break
        }
      }
    }
  }
}

# ── Main ────────────────────────────────────────────────────
if ($Status) { Get-Status }
elseif ($SshFix) { Send-Cmd "ufw allow 22/tcp && ufw reload && systemctl restart ssh && echo 'SSH port 22 opened'" "Fix SSH port 22" }
elseif ($Results) { Get-Results }
elseif ($Interactive) { Start-Interactive }
elseif ($Command) { Send-Cmd $Command }
else { Show-Help }
