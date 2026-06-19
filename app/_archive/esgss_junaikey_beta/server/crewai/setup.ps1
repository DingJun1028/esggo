$requiredVersions = @("3.10", "3.11", "3.12")
$ScriptDir = $PSScriptRoot
Set-Location $ScriptDir
Write-Host "Changed directory to: $ScriptDir" -ForegroundColor Cyan

$pythonCmd = "python"
$pythonVersion = python --version 2>&1
Write-Host "Detected Default Python: $pythonVersion" -ForegroundColor Cyan

# Check if current python is valid
$isValid = $false
foreach ($v in $requiredVersions) {
    if ($pythonVersion -match $v) {
        $isValid = $true
        break
    }
}

# If not valid, check py launcher for alternatives
if (-not $isValid) {
    Write-Host "⚠️  Default Python is strictly incompatible with CrewAI (requires 3.10-3.12)." -ForegroundColor Yellow
    Write-Host "Checking py launcher for compatible versions..."
    
    foreach ($v in $requiredVersions) {
        $check = py -$v --version 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Found compatible version via py launcher: $check" -ForegroundColor Green
            $pythonCmd = "py -$v"
            $isValid = $true
            break
        }
    }
}

if (-not $isValid) {
    Write-Host "❌ No compatible Python version found (3.10, 3.11, or 3.12)." -ForegroundColor Red
    
    $choice = Read-Host "Attempt to install Python 3.11 via Winget? (Y/N)"
    if ($choice -eq 'Y' -or $choice -eq 'y') {
        Write-Host "Installing Python 3.11..."
        winget install -e --id Python.Python.3.11
        
        Write-Host "`n✅ Installation command sent." -ForegroundColor Green
        Write-Host "IMPORTANT: You MUST restart your terminal/VS Code after installation completes to refresh the PATH." -ForegroundColor Yellow
        exit
    }
    else {
        Write-Host "Please manually install Python 3.11 from python.org."
        exit
    }
}

# Create virtual environment if not exists
if (-not (Test-Path ".venv")) {
    Write-Host "Creating virtual environment..." -ForegroundColor Cyan
    & $pythonCmd -m venv .venv
}

$venvPython = "$ScriptDir\.venv\Scripts\python.exe"
$venvPip = "$ScriptDir\.venv\Scripts\pip.exe"

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Cyan
if (Test-Path "requirements.txt") {
    & $venvPython -m pip install --upgrade pip
    & $venvPython -m pip install -r requirements.txt
}
else {
    Write-Host "requirements.txt not found!" -ForegroundColor Red
    exit 1
}

# Run the server
Write-Host "Starting Server..." -ForegroundColor Green
$env:MCP_ENABLE_OAUTH21 = "true"
$env:EXTERNAL_OAUTH21_PROVIDER = "true"
& $venvPython main.py --transport streamable-http
