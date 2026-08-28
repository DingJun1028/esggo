# install-plugin-array-safe.ps1 — install a Hermes desktop plugin and enable its
# Python backend, guaranteeing plugins.enabled is written as a JSON ARRAY.
#
# Why this exists: `hermes config set plugins.enabled` stores the value verbatim.
# The gateway only mounts the plugin backend when the value is a JSON ARRAY
# (e.g. ["my-plugin"]). Building the value via PowerShell ConvertTo-Json collapses
# a 1-element list to the STRING "my-plugin", which the gateway silently ignores
# (backend never mounts -> pane shows "backend not enabled").
#
# This script ALWAYS emits a proper array string, so the backend mounts after a
# gateway restart.
#
# Usage:
#   powershell -ExecutionPolicy Bypass -File "install-plugin-array-safe.ps1" -ID my-plugin
# Add -ForceBackend to overwrite an existing plugin_api.py.

param(
  [Parameter(Mandatory=$true)][string]$ID,
  [string]$HermesHome = "$env:LOCALAPPDATA\hermes",
  [switch]$ForceBackend
)

$ErrorActionPreference = 'Stop'
$here = Split-Path -Parent $MyInvocation.MyCommand.Path

$destPlugin = Join-Path $HermesHome "desktop-plugins\$ID"
$destApi    = Join-Path $HermesHome "plugins\$ID\dashboard"

New-Item -ItemType Directory -Force -Path $destPlugin | Out-Null
New-Item -ItemType Directory -Force -Path $destApi | Out-Null

# 1. Frontend — always overwrite.
Copy-Item (Join-Path $here 'plugin.js') (Join-Path $destPlugin 'plugin.js') -Force
Write-Host "[ok] plugin.js -> $destPlugin"

# 2. Backend — only if missing (or -ForceBackend).
$apiDest = Join-Path $destApi 'plugin_api.py'
if ($ForceBackend -or -not (Test-Path $apiDest)) {
  if (Test-Path (Join-Path $here 'backend\manifest.json')) {
    Copy-Item (Join-Path $here 'backend\manifest.json') (Join-Path $destApi 'manifest.json') -Force
  }
  if (Test-Path (Join-Path $here 'backend\plugin_api.py')) {
    Copy-Item (Join-Path $here 'backend\plugin_api.py') $apiDest -Force
    Write-Host "[ok] backend -> $destApi"
  } else {
    Write-Host "[skip] no backend/plugin_api.py staged; skipping backend copy"
  }
} else {
  Write-Host "[skip] backend already present at $apiDest (use -ForceBackend to overwrite)"
}

# 3. Enable plugin — merge into plugins.enabled as a JSON ARRAY (never a string).
try {
  $existing = @()
  $raw = & hermes config get plugins.enabled 2>$null
  if ($raw) {
    try {
      $parsed = $raw | ConvertFrom-Json -ErrorAction Stop
      if ($parsed -is [System.Collections.IEnumerable] -and -not ($parsed -is [string])) {
        $existing = @($parsed)
      } elseif ($parsed -is [string] -and $parsed.Trim().Length -gt 0) {
        $existing = @($parsed.Trim())   # tolerate a previously-malformed string
      }
    } catch { } # not valid JSON -> start fresh
  }

  $merged = @()
  foreach ($item in $existing) {
    if ($item -and ($item -is [string]) -and $item.Trim().Length -gt 0 -and $merged -notcontains $item.Trim()) {
      $merged += $item.Trim()
    }
  }
  if ($merged -notcontains $ID) { $merged += $ID }

  # Hand-built JSON array string — avoids ConvertTo-Json single-element bug.
  $json = '[' + (($merged | ForEach-Object { '"{0}"' -f $_ }) -join ',') + ']'
  & hermes config set plugins.enabled $json
  Write-Host "[ok] plugins.enabled = $json"
} catch {
  Write-Warning "Could not set plugins.enabled via hermes CLI: $_"
  Write-Host "Action needed: add '$ID' to plugins.enabled in config.yaml as a JSON array, then restart the gateway."
}

Write-Host ""
Write-Host "Next: restart the gateway (hermes update --no-backup --yes or reopen the app), then Ctrl/Cmd+K -> Reload desktop plugins."
