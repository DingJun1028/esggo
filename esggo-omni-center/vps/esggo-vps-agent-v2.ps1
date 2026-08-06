#!/usr/bin/env pwsh
<#
.SYNOPSIS
ESGGO VPS Agent v2 — health, remediation, evidence
#>
$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

$VPS_IP = '161.118.248.180'
$APP_PORT = 3000
$GATEWAY_PORT = 8642

function Show-Header() {
  param([string]$Title)
  Write-Host ("`n" + ('=' * 72))
  Write-Host "  $Title"
  Write-Host ('=' * 72)
}

function Invoke-Remote {
  param([Parameter(ValueFromRemainingArguments=$true)][string[]]$Cmd)
  & ssh -o StrictHostKeyChecking=no -o ConnectTimeout=8 root@$VPS_IP $Cmd
}

Show-Header 'VPS Agent v2 — Connectivity baseline'
try {
  $r = Invoke-Remote -Cmd 'hostnamectl --static && whoami && uname -rm'
  Write-Host "REMOTE_HOST: $r"
} catch {
  Write-Host "SSH_PORT22=FAILED"
}

Show-Header 'VPS Agent v2 — App / Gateway probe'
try { $r1 = Invoke-WebRequest -UseBasicParsing -Uri "http://${VPS_IP}:${APP_PORT}" -TimeoutSec 5; Write-Host ("APP_HTTP=" + $r1.StatusCode) } catch { Write-Host 'APP_HTTP=UNREACHABLE' }
try { $r2 = Invoke-WebRequest -UseBasicParsing -Uri "http://${VPS_IP}:${GATEWAY_PORT}/health" -TimeoutSec 5; Write-Host ("GATEWAY_HEALTH=" + $r2.StatusCode) } catch { Write-Host 'GATEWAY_HEALTH=UNREACHABLE' }

Show-Header 'VPS Agent v2 — Remediation (needs SSH)'
if (Get-Command ssh -ErrorAction SilentlyContinue) {
  Write-Host 'REMEDIATE=READY_ON_SSH'
} else {
  Write-Host 'REMEDIATE=NO_SSH_BINARY'
}

Show-Header 'VPS Agent v2 — Redeploy candidate scripts'
Write-Host '...'
