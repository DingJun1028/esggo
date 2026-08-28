# install-plugin.ps1 — install / reinstall a Hermes desktop plugin when the
# agent cannot write to $HERMES_HOME directly. Copy from the
# hermes-desktop-plugin-pitfalls skill's templates/ and adjust <ID>/paths.
#
# Usage (user runs on the Windows host):
#   powershell -ExecutionPolicy Bypass -File install-plugin.ps1
# Optional: -ForceBackend to overwrite an existing Python backend.
# Optional: -ID my-plugin to target a different plugin id.

param(
  [string]$HermesHome = "$env:LOCALAPPDATA\hermes",
  [string]$ID = 'esggo-hub',
  [switch]$ForceBackend
)

$ErrorActionPreference = 'Stop'
$here = Split-Path -Parent $MyInvocation.MyCommand.Path

$destPlugin = Join-Path $HermesHome "desktop-plugins\$ID"
$destApi    = Join-Path $HermesHome "plugins\$ID\dashboard"

New-Item -ItemType Directory -Force -Path $destPlugin | Out-Null
New-Item -ItemType Directory -Force -Path $destApi | Out-Null

# 1. Frontend — always overwrite (this is the reinstall / bug-fix target).
Copy-Item (Join-Path $here 'plugin.js') (Join-Path $destPlugin 'plugin.js') -Force
Write-Host "[ok] plugin.js -> $destPlugin"

# 2. Backend — only if missing (or -ForceBackend), to avoid clobbering a custom one.
$apiDest = Join-Path $destApi 'plugin_api.py'
if ($ForceBackend -or -not (Test-Path $apiDest)) {
  if (Test-Path (Join-Path $here 'backend')) {
    Copy-Item (Join-Path $here 'backend\*') $destApi -Recurse -Force
    Write-Host "[ok] backend -> $destApi"
  } else {
    Write-Host "[skip] no backend/ folder staged; skipping Python backend"
  }
} else {
  Write-Host "[skip] backend already present at $apiDest (use -ForceBackend to overwrite)"
}

# 3. Enable plugin in config — MERGE, never clobber other enabled plugins.
try {
  $raw = & hermes config get plugins.enabled 2>$null
  try { $list = $raw | ConvertFrom-Json } catch { $list = @() }
  if ($list -is [string]) { $list = @($list) }
  if ($null -eq $list) { $list = @() }
  if ($list -notcontains $ID) { $list = @($list) + $ID }
  $json = $list | ConvertTo-Json -Compress
  & hermes config set plugins.enabled $json
  Write-Host "[ok] plugins.enabled = $json"
} catch {
  Write-Warning "Could not set plugins.enabled via hermes CLI: $_"
  Write-Host "Action needed: add '$ID' to plugins.enabled in config.yaml, then restart the gateway."
}

Write-Host ""
Write-Host "Next: restart the gateway (e.g. 'hermes update --no-backup --yes' or restart the app),"
Write-Host "then Ctrl/Cmd+K -> 'Reload desktop plugins'."
