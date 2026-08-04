# setup-memory-tencentdb.ps1 — install TencentDB Agent Memory into an EXISTING Hermes install (Windows native)
# Adapted from TencentCloud/TencentDB-Agent-Memory README sections 2.B / 3 (MIT).
# Usage:
#   powershell -NoProfile -ExecutionPolicy Bypass -File setup-memory-tencentdb.ps1
# Env (optional): TDAI_LLM_API_KEY, TDAI_LLM_BASE_URL, TDAI_LLM_MODEL
# Everything is logged to memory-setup.log in the same directory as this script.

param()

$ErrorActionPreference = 'Stop'
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$log = Join-Path $here 'memory-setup.log'
if (Test-Path $log) { Remove-Item $log -Force }

function Log($m) {
  $line = "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] $m"
  Add-Content -Path $log -Value $line -Encoding UTF8
  Write-Host $line
}

try {
  Log "=== TencentDB Agent Memory setup start ==="

  # ---------- 0. Prereqs ----------
  $nodeVer = (node --version 2>$null)
  if (-not $nodeVer) { throw "node not found on PATH" }
  Log "node: $nodeVer"
  $ver = $nodeVer.TrimStart('v')
  if ([version]$ver -lt [version]'22.16.0') { throw "Node >= 22.16.0 required (have $ver)" }

  $npmVer = (npm --version 2>$null)
  Log "npm: $npmVer"

  # ---------- 1. Detect Hermes home ----------
  $candidates = @("$env:LOCALAPPDATA\hermes", "$env:USERPROFILE\.hermes")
  $hermesHome = $null
  foreach ($c in $candidates) {
    if ((Test-Path (Join-Path $c 'config.yaml')) -or (Test-Path (Join-Path $c 'hermes-agent'))) { $hermesHome = $c; break }
  }
  if (-not $hermesHome) { $hermesHome = "$env:LOCALAPPDATA\hermes"; New-Item -ItemType Directory -Force -Path $hermesHome | Out-Null }
  Log "hermes home = $hermesHome"
  $configPath = Join-Path $hermesHome 'config.yaml'
  $envPath    = Join-Path $hermesHome '.env'
  Log "config.yaml = $configPath (exists: $(Test-Path $configPath))"
  Log ".env        = $envPath (exists: $(Test-Path $envPath))"

  # ---------- 2. Install the plugin package into ~/.memory-tencentdb ----------
  $memBase = Join-Path $env:USERPROFILE '.memory-tencentdb'
  $pluginRoot = Join-Path $memBase 'tdai-memory-openclaw-plugin'
  $pkgDir = Join-Path $pluginRoot 'node_modules\@tencentdb-agent-memory\memory-tencentdb'
  New-Item -ItemType Directory -Force -Path $pluginRoot | Out-Null
  if (-not (Test-Path (Join-Path $pkgDir 'package.json'))) {
    Log "installing @tencentdb-agent-memory/memory-tencentdb@latest (npm) ..."
    Push-Location $pluginRoot
    npm init -y --silent | Out-Null
    npm install @tencentdb-agent-memory/memory-tencentdb@latest --omit=dev 2>&1 | ForEach-Object { Log "npm: $_" }
    Pop-Location
    if (-not (Test-Path (Join-Path $pkgDir 'package.json'))) { throw "npm install did not produce the package at $pkgDir" }
  } else {
    Log "package already present: $pkgDir"
  }

  Log "installing gateway deps (npm install --omit=dev; npm install tsx) ..."
  Push-Location $pluginRoot
  npm install --omit=dev 2>&1 | ForEach-Object { Log "npm: $_" }
  npm install tsx 2>&1 | ForEach-Object { Log "npm: $_" }
  Pop-Location

  # ---------- 3. Link/copy provider into Hermes plugins dir (name MUST be memory_tencentdb) ----------
  $providerSrc = Join-Path $pkgDir 'hermes-plugin\memory\memory_tencentdb'
  if (-not (Test-Path $providerSrc)) { throw "provider source missing: $providerSrc" }
  $pluginsRoot = Join-Path $hermesHome 'plugins'
  New-Item -ItemType Directory -Force -Path (Join-Path $pluginsRoot 'memory') | Out-Null
  $providerDest = Join-Path $pluginsRoot 'memory\memory_tencentdb'
  if (Test-Path $providerDest) { Remove-Item $providerDest -Recurse -Force; Log "removed stale provider dir" }
  $linked = $false
  try {
    New-Item -ItemType SymbolicLink -Path $providerDest -Target $providerSrc -ErrorAction Stop | Out-Null
    $linked = $true
  } catch {
    Log "symlink not available ($($_.Exception.Message)) -> using copy"
  }
  if (-not $linked) { Copy-Item -Path $providerSrc -Destination $providerDest -Recurse -Force }
  Log "provider -> $providerDest (symlink=$linked)"

  # ---------- 4. config.yaml: backup + ensure memory.provider ----------
  if (Test-Path $configPath) {
    $backup = "$configPath.bak-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    Copy-Item $configPath $backup -Force
    Log "config backup -> $backup"
    $raw = Get-Content $configPath -Raw -Encoding UTF8
    if ($raw -match '(?ms)^memory:\s*$') {
      # replace the provider line inside the memory: block
      $new = $raw -replace '(?ms)(^memory:\s*\r?\n(\s+)provider:\s*[^\r\n]*)', "`$1`n`$2provider: memory_tencentdb"
      if ($new -eq $raw) { $new = $raw -replace '(?ms)^memory:\s*\r?\n', "memory:`n  provider: memory_tencentdb`n" }
      $raw = $new
      Log "memory.provider set (block existed)"
    } else {
      $raw = $raw.TrimEnd() + "`n`nmemory:`n  provider: memory_tencentdb`n"
      Log "memory.provider appended"
    }
    Set-Content -Path $configPath -Value $raw -Encoding UTF8 -NoNewline
  } else {
    Set-Content -Path $configPath -Value "memory:`n  provider: memory_tencentdb`n" -Encoding UTF8
    Log "config.yaml created with memory.provider"
  }

  # ---------- 5. .env: append gateway vars + LLM creds ----------
  $gatewayCmd = "sh -c 'cd $pluginRoot && exec npx tsx src/gateway/server.ts'"
  $apiKey = $env:TDAI_LLM_API_KEY
  $baseUrl = $env:TDAI_LLM_BASE_URL
  if (-not $baseUrl) { $baseUrl = 'https://api.openai.com/v1' }
  $model = $env:TDAI_LLM_MODEL
  if (-not $model) { $model = 'gpt-4o' }

  $envLines = @(
    "MEMORY_TENCENTDB_GATEWAY_CMD=`"$gatewayCmd`"",
    "MEMORY_TENCENTDB_GATEWAY_HOST=`"127.0.0.1`"",
    "MEMORY_TENCENTDB_GATEWAY_PORT=`"8420`"",
    "TDAI_LLM_API_KEY=`"$apiKey`"",
    "TDAI_LLM_BASE_URL=`"$baseUrl`"",
    "TDAI_LLM_MODEL=`"$model`""
  )
  $existing = ''
  if (Test-Path $envPath) { $existing = Get-Content $envPath -Raw -Encoding UTF8 }
  $added = @()
  foreach ($l in $envLines) {
    $key = ($l -split '=')[0]
    if ($existing -match [regex]::Escape($key)) { Log "env $key already present, skipped" }
    else { $added += $l; Log "env += $key" }
  }
  if ($added.Count -gt 0) {
    $out = $existing.TrimEnd() + "`n" + ($added -join "`n") + "`n"
    Set-Content -Path $envPath -Value $out -Encoding UTF8 -NoNewline
  }

  # ---------- 5.5 Port 8420 conflict pre-check ----------
  $portBusy = $false
  try { $c = Get-NetTCPConnection -LocalPort 8420 -State Listen -ErrorAction SilentlyContinue; if ($c) { $portBusy = $true } } catch { }
  if ($portBusy) {
    Log "WARN: port 8420 already in use (gateway may already be running) — skipping start, will health-check"
  } else {
    Log "port 8420 free"
  }

  # ---------- 6. Start gateway (manual) + health check ----------
  $server = Join-Path $pluginRoot 'src\gateway\server.ts'
  Log "starting gateway: npx tsx $server"
  $gwLog = Join-Path $here 'memory-gateway.log'
  $gw = Start-Process -FilePath 'cmd.exe' -ArgumentList @('/c', "cd /d `"$pluginRoot`" && npx tsx src/gateway/server.ts > `"$gwLog`" 2>&1") -WindowStyle Hidden -PassThru
  Log "gateway pid = $($gw.Id)"
  $ok = $false
  for ($i = 0; $i -lt 30; $i++) {
    Start-Sleep -Seconds 2
    try {
      $r = curl.exe -s -m 3 http://127.0.0.1:8420/health
      if ($r) { Log "health: $r"; $ok = $true; break }
    } catch { }
  }
  if (-not $ok) {
    Log "WARN: health check did not return ok. gateway log tail:"
    if (Test-Path $gwLog) { Get-Content $gwLog -Tail 15 | ForEach-Object { Log "  $_" } }
  }

  if (-not $apiKey) {
    Log "WARN: TDAI_LLM_API_KEY is EMPTY - memory extraction needs a real key."
    Log "      Set it before running:  set TDAI_LLM_API_KEY=sk-..."
    Log "      or edit the TDAI_LLM_API_KEY line in $envPath after setup"
  }
  Log "=== setup finished (health_ok=$ok) ==="
} catch {
  Log "ERROR: $($_.Exception.Message)"
  exit 1
}
