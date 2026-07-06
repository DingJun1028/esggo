# ============================================================
# ESGGO VPS Relay Server v2 — Simplified & Robust
# ============================================================
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

param([int]$Port = 9999)

$ErrorActionPreference = "Stop"
$commandQueue = [System.Collections.ArrayList]::new()
$resultsQueue = [System.Collections.ArrayList]::new()
$startTime = Get-Date
$authToken = "esggo-relay-$(Get-Date -Format 'yyyyMMdd')"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  ESGGO VPS Relay Server v2" -ForegroundColor Cyan
Write-Host "  Port: $Port" -ForegroundColor Yellow
Write-Host "  Auth: $authToken" -ForegroundColor Yellow
Write-Host "============================================" -ForegroundColor Cyan

# Use TcpListener for more reliable binding
$ipAddr = [System.Net.IPAddress]::Any
$listener = New-Object System.Net.Sockets.TcpListener($ipAddr, $Port)
$listener.Start()

Write-Host "[OK] Listening on 0.0.0.0:$Port" -ForegroundColor Green
Write-Host "Endpoints: /status /cmd /result /ssh-fix" -ForegroundColor Gray
Write-Host ""

function Parse-Http($client) {
  $stream = $client.GetStream()
  $reader = New-Object System.IO.StreamReader($stream)
  $writer = New-Object System.IO.StreamWriter($stream)
  
  # Read request line
  $requestLine = $reader.ReadLine()
  if (-not $requestLine) { return $null }
  
  $parts = $requestLine -split ' '
  $method = $parts[0]
  $path = if ($parts.Count -gt 1) { $parts[1] } else { '/' }
  
  # Read headers
  $headers = @{}
  $contentLength = 0
  while ($true) {
    $line = $reader.ReadLine()
    if ($line -eq '' -or $null -eq $line) { break }
    if ($line -match '^Content-Length:\s*(\d+)') { $contentLength = [int]$Matches[1] }
    if ($line -match '^X-Auth-Token:\s*(.+)') { $headers['X-Auth-Token'] = $Matches[1].Trim() }
  }
  
  # Read body
  $body = ''
  if ($contentLength -gt 0) {
    $buffer = New-Object char[] $contentLength
    $totalRead = 0
    while ($totalRead -lt $contentLength) {
      $read = $reader.Read($buffer, $totalRead, $contentLength - $totalRead)
      if ($read -eq 0) { break }
      $totalRead += $read
    }
    $body = [string]::new($buffer)
  }
  
  return @{ Method=$method; Path=$path; Headers=$headers; Body=$body; Stream=$stream; Writer=$writer }
}

function Send-Response($req, $statusCode, $contentType, $body) {
  $bodyBytes = [System.Text.Encoding]::UTF8.GetBytes($body)
  $response = "HTTP/1.1 $statusCode OK`r`nContent-Type: $contentType`r`nContent-Length: $($bodyBytes.Length)`r`nAccess-Control-Allow-Origin: *`r`nAccess-Control-Allow-Headers: X-Auth-Token, Content-Type`r`nConnection: close`r`n`r`n"
  $responseBytes = [System.Text.Encoding]::UTF8.GetBytes($response)
  $req.Stream.Write($responseBytes, 0, $responseBytes.Length)
  $req.Stream.Write($bodyBytes, 0, $bodyBytes.Length)
  $req.Stream.Flush()
}

while ($listener.Pending() -or $true) {
  if (-not $listener.Pending()) {
    Start-Sleep -Milliseconds 100
    continue
  }
  
  $client = $listener.AcceptTcpClient()
  
  try {
    $req = Parse-Http $client
    if (-not $req) { $client.Close(); continue }
    
    # CORS preflight
    if ($req.Method -eq 'OPTIONS') {
      Send-Response $req 204 "text/plain" ""
      $client.Close()
      continue
    }
    
    # Auth check (skip for /status)
    if ($req.Path -ne '/status' -and $req.Headers['X-Auth-Token'] -ne $authToken) {
      Send-Response $req 401 "application/json" '{"error":"unauthorized"}'
      $client.Close()
      continue
    }
    
    $ts = Get-Date -Format "HH:mm:ss"
    
    switch ($req.Path) {
      '/status' {
        $status = @{
          relay = "online"
          uptime = [math]::Round(((Get-Date) - $startTime).TotalMinutes, 1)
          commandsQueued = @($commandQueue | Where-Object { $_.status -eq "pending" }).Count
          commandsTotal = $commandQueue.Count
          resultsCount = $resultsQueue.Count
          port = $Port
          ts = (Get-Date).ToString("o")
        }
        Send-Response $req 200 "application/json" ($status | ConvertTo-Json -Compress)
      }
      
      '/cmd' {
        if ($req.Method -eq 'POST') {
          # Queue a command
          $json = $req.Body | ConvertFrom-Json
          $id = "cmd_$(Get-Date -Format 'yyyyMMddHHmmss')_$($commandQueue.Count)"
          $entry = @{ id=$id; command=$json.command; description=($json.description || $json.command.Substring(0, [Math]::Min(60, $json.command.Length))); ts=(Get-Date).ToString("o"); status="pending" }
          [void]$commandQueue.Add($entry)
          Write-Host "[$ts] CMD Queued: $($entry.description)" -ForegroundColor Cyan
          Send-Response $req 200 "application/json" ($entry | ConvertTo-Json -Compress)
        } else {
          # Poll for next command
          $pending = $commandQueue | Where-Object { $_.status -eq "pending" } | Select-Object -First 1
          if ($pending) {
            $pending.status = "dispatched"
            $pending.dispatchedAt = (Get-Date).ToString("o")
            Write-Host "[$ts] CMD Dispatched: $($pending.description)" -ForegroundColor Yellow
            Send-Response $req 200 "application/json" ($pending | ConvertTo-Json -Compress)
          } else {
            Send-Response $req 200 "application/json" '{"idle":true}'
          }
        }
      }
      
      '/result' {
        if ($req.Method -eq 'POST') {
          $result = $req.Body | ConvertFrom-Json
          [void]$resultsQueue.Add($result)
          $cmd = $commandQueue | Where-Object { $_.id -eq $result.commandId }
          if ($cmd) { $cmd.status = "completed" }
          Write-Host "[$ts] RESULT from VPS (cmd: $($result.commandId))" -ForegroundColor Green
          if ($result.stdout) { Write-Host "  OUT: $($result.stdout.Substring(0, [Math]::Min(200, $result.stdout.Length)))" -ForegroundColor DarkGray }
          if ($result.stderr) { Write-Host "  ERR: $($result.stderr.Substring(0, [Math]::Min(200, $result.stderr.Length)))" -ForegroundColor Red }
          Send-Response $req 200 "application/json" '{"ok":true}'
        } else {
          # View results
          $recent = @($resultsQueue | Select-Object -Last 20)
          Send-Response $req 200 "application/json" ($recent | ConvertTo-Json -Depth 5)
        }
      }
      
      '/ssh-fix' {
        $sshCmd = "ufw status | grep -q '22/tcp' && echo 'SSH already open' || (ufw allow 22/tcp && ufw reload && echo 'SSH port 22 opened')"
        $id = "cmd_ssh_$(Get-Date -Format 'yyyyMMddHHmmss')"
        $entry = @{ id=$id; command=$sshCmd; description="Fix SSH port 22"; ts=(Get-Date).ToString("o"); status="pending" }
        [void]$commandQueue.Add($entry)
        Write-Host "[$ts] SSH FIX Queued" -ForegroundColor Magenta
        Send-Response $req 200 "application/json" ($entry | ConvertTo-Json -Compress)
      }
      
      default {
        Send-Response $req 404 "application/json" '{"error":"not found"}'
      }
    }
  } catch {
    Write-Host "[ERR] $($_.Exception.Message)" -ForegroundColor Red
  } finally {
    $client.Close()
  }
}
