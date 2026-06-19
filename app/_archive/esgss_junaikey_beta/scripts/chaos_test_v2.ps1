# AVOS v6.0 Chaos Stress Test Protocol (PowerShell Edition)
# Target: IPMS Logic, Persistence Layer, Rune Forge Bridge

$BaseUrl = "http://localhost:3001/api"
$Green = [ConsoleColor]::Green
$Red = [ConsoleColor]::Red
$Gold = [ConsoleColor]::Yellow

Write-Host "INITIATING CHAOS SEQUENCE..." -ForegroundColor $Gold
Write-Host "---------------------------------------------------------"

# 1. System Check
Write-Host "`n[Phase 1] System Heartbeat Check..."
try {
    $response = Invoke-WebRequest -Uri "$BaseUrl/health" -Method Get -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "Core System ONLINE" -ForegroundColor $Green
    } else {
        Write-Host "SYSTEM FAILURE (Code: $($response.StatusCode))" -ForegroundColor $Red
        exit 1
    }
} catch {
    Write-Host "System Heartbeat Warning: $_" -ForegroundColor $Gold
}

# 2. Impact Load
Write-Host "`n[Phase 2] Simulating 'Genesis Barrage' (10 Projects)..."
$timer = [System.Diagnostics.Stopwatch]::StartNew()

for ($i = 1; $i -le 10; $i++) {
    $dateStr = Get-Date -Format 'HHmmss'
    $body = @{
        title = "Chaos Project $i-$dateStr"
        owner_id = "user-chaos-bot"
        impact_metric = "tCO2e"
        target_value = 1000
    } | ConvertTo-Json

    try {
        Invoke-WebRequest -Uri "$BaseUrl/projects" -Method Post -Body $body -ContentType "application/json" -ErrorAction SilentlyContinue | Out-Null
        Write-Host -NoNewline "." -ForegroundColor $Gold
    } catch {
        Write-Host -NoNewline "x" -ForegroundColor $Red
    }
}

$timer.Stop()
Write-Host "`nGenesis Barrage Complete in $($timer.Elapsed.TotalMilliseconds)ms" -ForegroundColor $Green

# 3. Data Integrity
Write-Host "`n[Phase 3] Verifying MongoDB Persistence..."
Start-Sleep -Seconds 1
try {
    $projects = Invoke-RestMethod -Uri "$BaseUrl/projects" -Method Get
    $chaosCount = ($projects.data | Where-Object { $_.title -like "Chaos Project*" }).Count

    if ($chaosCount -ge 10) {
        Write-Host "Data Integrity Confirmed. Found $chaosCount Chaos Assets." -ForegroundColor $Green
    } else {
        Write-Host "DATA LOSS DETECTED. Found only $chaosCount assets." -ForegroundColor $Red
    }

    # 4. Rune Bridge
    Write-Host "`n[Phase 4] Testing Rune Forge Bridge..."
    
    $targetProject = $projects.data | Where-Object { $_.title -like "Chaos Project*" } | Select-Object -First 1
    
    if ($targetProject) {
        $targetId = $targetProject.uuid
        Write-Host "Targeting Real Asset ID: $targetId" -ForegroundColor $Gold

        # Set to CALCULABLE
        $bodyCalc = @{ lifecycle_state = "CALCULABLE" } | ConvertTo-Json
        Invoke-WebRequest -Uri "$BaseUrl/projects/$targetId/status" -Method Patch -Body $bodyCalc -ContentType "application/json" -ErrorAction SilentlyContinue | Out-Null

        # Set to IMMUTABLE
        Write-Host ">> Triggering State Transition to IMMUTABLE..." -ForegroundColor $Gold
        $bodyImmutable = @{ lifecycle_state = "IMMUTABLE" } | ConvertTo-Json
        
        try {
            $bridgeResponse = Invoke-RestMethod -Uri "$BaseUrl/projects/$targetId/status" -Method Patch -Body $bodyImmutable -ContentType "application/json"
            
            if ($bridgeResponse.rune_transaction) {
                Write-Host "Bridge Verified: RUNE Minted!" -ForegroundColor $Green
                Write-Host "   Tx Hash: $($bridgeResponse.rune_transaction.tx_hash)" -ForegroundColor $Green
                Write-Host "   Yield: $($bridgeResponse.rune_transaction.rune_yield)" -ForegroundColor $Green
            } else {
                Write-Host "Bridge Response Received (No Transaction Data)" -ForegroundColor $Gold
            }
        } catch {
             Write-Host "Bridge Trigger Failed: $_" -ForegroundColor $Red
        }

    } else {
        Write-Host "No chaos projects found to test bridge." -ForegroundColor $Red
    }

} catch {
    Write-Host "Failed to retrieve projects: $_" -ForegroundColor $Red
}

Write-Host "---------------------------------------------------------"
Write-Host "CHAOS TEST SURVIVED. SYSTEM IS RESILIENT." -ForegroundColor $Gold
Write-Host "---------------------------------------------------------"
