# ESGss JunAiKey Beta - 部署驗證腳本 (Windows PowerShell)

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "ESGss JunAiKey Beta - Deployment Verification" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

$PASSED = 0
$FAILED = 0

function Test-Command {
    param([string]$Command)
    
    if (Get-Command $Command -ErrorAction SilentlyContinue) {
        Write-Host "✓ $Command is installed" -ForegroundColor Green
        $script:PASSED++
        return $true
    } else {
        Write-Host "✗ $Command is not installed" -ForegroundColor Red
        $script:FAILED++
        return $false
    }
}

function Test-EnvVariable {
    param([string]$VarName)
    
    $value = [System.Environment]::GetEnvironmentVariable($VarName)
    if ([string]::IsNullOrEmpty($value)) {
        Write-Host "✗ $VarName is not set" -ForegroundColor Red
        $script:FAILED++
        return $false
    } else {
        Write-Host "✓ $VarName is set" -ForegroundColor Green
        $script:PASSED++
        return $true
    }
}

Write-Host "1. Checking Prerequisites..." -ForegroundColor Yellow
Write-Host "-----------------------------------"
Test-Command "docker"
Test-Command "docker-compose"
Test-Command "git"
Write-Host ""

Write-Host "2. Checking Docker Status..." -ForegroundColor Yellow
Write-Host "-----------------------------------"
try {
    docker info | Out-Null
    Write-Host "✓ Docker daemon is running" -ForegroundColor Green
    $PASSED++
} catch {
    Write-Host "✗ Docker daemon is not running" -ForegroundColor Red
    $FAILED++
}
Write-Host ""

Write-Host "3. Checking Environment File..." -ForegroundColor Yellow
Write-Host "-----------------------------------"
if (Test-Path ".env.production") {
    Write-Host "✓ .env.production exists" -ForegroundColor Green
    $PASSED++
    
    # Load and check environment variables
    $envContent = Get-Content ".env.production" | Where-Object { $_ -notmatch '^#' -and $_ -match '=' }
    
    Write-Host ""
    Write-Host "4. Checking Required Environment Variables..." -ForegroundColor Yellow
    Write-Host "-----------------------------------"
    
    $hasDBPassword = $envContent | Select-String -Pattern "^DB_PASSWORD="
    $hasJWTSecret = $envContent | Select-String -Pattern "^JWT_SECRET="
    $hasGemini = $envContent | Select-String -Pattern "^GEMINI_API_KEY="
    $hasOpenAI = $envContent | Select-String -Pattern "^OPENAI_API_KEY="
    
    if ($hasDBPassword) {
        Write-Host "✓ DB_PASSWORD is set" -ForegroundColor Green
        $PASSED++
    } else {
        Write-Host "✗ DB_PASSWORD is not set" -ForegroundColor Red
        $FAILED++
    }
    
    if ($hasJWTSecret) {
        Write-Host "✓ JWT_SECRET is set" -ForegroundColor Green
        $PASSED++
    } else {
        Write-Host "✗ JWT_SECRET is not set" -ForegroundColor Red
        $FAILED++
    }
    
    if ($hasGemini -or $hasOpenAI) {
        Write-Host "✓ At least one AI service is configured" -ForegroundColor Green
        $PASSED++
    } else {
        Write-Host "✗ No AI service configured (GEMINI_API_KEY or OPENAI_API_KEY required)" -ForegroundColor Red
        $FAILED++
    }
} else {
    Write-Host "✗ .env.production does not exist" -ForegroundColor Red
    $FAILED++
    Write-Host "ℹ Run: Copy-Item .env.example .env.production" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "5. Checking Docker Configuration..." -ForegroundColor Yellow
Write-Host "-----------------------------------"
try {
    docker-compose -f docker-compose.prod.yml config | Out-Null
    Write-Host "✓ docker-compose.prod.yml is valid" -ForegroundColor Green
    $PASSED++
} catch {
    Write-Host "✗ docker-compose.prod.yml has errors" -ForegroundColor Red
    $FAILED++
}
Write-Host ""

Write-Host "6. Checking Nginx Configuration..." -ForegroundColor Yellow
Write-Host "-----------------------------------"
if (Test-Path "nginx.conf") {
    Write-Host "✓ nginx.conf exists" -ForegroundColor Green
    $PASSED++
} else {
    Write-Host "✗ nginx.conf not found" -ForegroundColor Red
    $FAILED++
}
Write-Host ""

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Verification Summary" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Passed: $PASSED" -ForegroundColor Green
Write-Host "Failed: $FAILED" -ForegroundColor Red
Write-Host ""

if ($FAILED -eq 0) {
    Write-Host "✓ All checks passed! Ready to deploy." -ForegroundColor Green
    Write-Host ""
    Write-Host "To deploy, run:" -ForegroundColor Cyan
    Write-Host "  docker-compose -f docker-compose.prod.yml up -d --build" -ForegroundColor White
   exit 0
} else {
    Write-Host "✗ Some checks failed. Please fix the issues above." -ForegroundColor Red
    exit 1
}
