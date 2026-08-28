# verify-hy-memory.ps1
# Ad-hoc verification: opencode.json change -> ollama provider resolvable + local model callable
$ErrorActionPreference = 'Stop'

# 1. JSON validity
$configPath = "C:\Users\dingj\.config\opencode\opencode.json"
try {
    $cfg = Get-Content $configPath -Raw | ConvertFrom-Json
    Write-Host "[1] JSON_VALID: $configPath"
} catch {
    Write-Host "[1] JSON_INVALID: $_"
    exit 1
}

# 2. ollama provider present + baseURL
$ollama = $cfg.provider.ollama
if ($ollama -and $ollama.options.baseURL -eq 'http://localhost:11434/v1') {
    Write-Host "[2] OLLAMA_PROVIDER_OK: baseURL=$($ollama.options.baseURL)"
} else {
    Write-Host "[2] OLLAMA_PROVIDER_MISSING"
    exit 1
}

# 3. default model switched
if ($cfg.model -eq 'ollama/qwen2.5:3b-instruct-q4_K_M') {
    Write-Host "[3] DEFAULT_MODEL_OK: $($cfg.model)"
} else {
    Write-Host "[3] DEFAULT_MODEL_WRONG: $($cfg.model)"
    exit 1
}

# 4. Ollama server reachable
try {
    $r = Invoke-WebRequest -Uri 'http://localhost:11434/v1/models' -UseBasicParsing -TimeoutSec 10
    $data = ($r.Content | ConvertFrom-Json).data
    $names = $data | ForEach-Object { $_.id }
    if ($names -contains 'qwen2.5:3b-instruct-q4_K_M') {
        Write-Host "[4] OLLAMA_SERVER_OK: model present"
    } else {
        Write-Host "[4] OLLAMA_MODEL_MISSING: $($names -join ', ')"
        exit 1
    }
} catch {
    Write-Host "[4] OLLAMA_SERVER_UNREACHABLE: $_"
    exit 1
}

# 5. opencode resolves ollama provider
$opencode = "C:\Users\dingj\.opencode\bin\opencode"
$out = & $opencode models ollama 2>&1
if ($out -match 'ollama/qwen2.5:3b-instruct-q4_K_M') {
    Write-Host "[5] OPENCODE_RESOLVE_OK: $($out.Trim())"
} else {
    Write-Host "[5] OPENCODE_RESOLVE_FAILED: $out"
    exit 1
}

Write-Host "ALL_CHECKS_PASSED"
