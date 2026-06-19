# ESG GO - Native AI Agent (PowerShell Edition)
# Version: v2.2 [The Model Carousel - Stability Focus]

param(
    [Parameter(Mandatory = $false)]
    [string]$Prompt = "請針對 ./src/core 與 ./src/components 的架構進行技術分析，並提出3個符合台灣開發者習慣的具體架構改善建議。"
)

# 1. Encoding Fix for PS 5.1
if ($PSVersionTable.PSVersion.Major -le 5) {
    [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
}
$OutputEncoding = [System.Text.Encoding]::UTF8

# 2. Advanced Multi-Model Configuration
$API_KEY = "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"
$MODELS = @(
    "meta-llama/llama-3.3-70b-instruct:free",
    "mistralai/mistral-small-3.1-24b-instruct:free",
    "qwen/qwen-2.5-72b-instruct:free",
    "deepseek/deepseek-chat:free",
    "google/gemini-2.0-flash-lite-preview-02-05:free"
)

Write-Host "`n>>> 🏛️ ESG GO Native Agent v2.2 <<<" -ForegroundColor Cyan
Write-Host "模式：備援矩陣 [自動循環多模型模式]" -ForegroundColor Gray
Write-Host "Jules Advice: 以終為始，始終如一。正在尋找清晰路徑..." -ForegroundColor Blue

# 3. Context
Write-Host "[1/3] 正在提純專案精華..." -NoNewline
try {
    $srcDirs = Get-ChildItem -Path "src" -Directory -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Name
    $coreFiles = if (Test-Path "src/core") { Get-ChildItem -Path "src/core" -Name -Filter "*.ts" | Select-Object -First 10 } else { "None" }
    $context = "Project: $pwd`nStructure: $($srcDirs -join ', ')`nCore Samples: $($coreFiles -join ', ')"
    Write-Host " 完成" -ForegroundColor Green
}
catch {
    Write-Host " 失敗" -ForegroundColor Red
    $context = "Context extraction failed."
}

# 4. Request Template & Character Injection
$SoulContext = if (Test-Path "SOUL.md") { Get-Content "SOUL.md" -Raw } else { "扮演首席架構師" }
$SystemPrompt = @"
你是一位在台灣工作的首席架構師，名為 Dr. Thoth，負責 InfoOne (ESG GO) 專案。
務必用「台灣繁體中文」進行分析並給出建議，嚴禁使用簡體中文或中國習慣用語（如：視頻、軟件、芯片、接口）。
用語規範：程式碼、專案、實作、優化、架構、介面。禁止亂碼。必須遵守 MECE 邏輯原則。
以下是你的靈魂與人設背景：
$SoulContext
"@
# 5. Heavy Duty Loop
$maxAttempts = 10
$attempt = 0
$done = $false

while (-not $done -and $attempt -lt $maxAttempts) {
    $m = $MODELS[$attempt % $MODELS.Count]
    
    if ($attempt -gt 0) {
        $sec = ($attempt * 8) + (Get-Random -Minimum 1 -Maximum 5)
        Write-Host "`n路徑 $m 壅塞，等待 $sec 秒後切換路徑... (重試 $attempt/$maxAttempts)" -ForegroundColor Yellow
        Start-Sleep -Seconds $sec
    }

    Write-Host "[2/3] 正在召喚靈魂引擎 ($m)..." -ForegroundColor Magenta
    try {
        $body = @{
            model       = $m
            messages    = @(
                @{ role = "system"; content = $SystemPrompt }
                @{ role = "user"; content = "上下文：`n$context`n`n問題：$Prompt" }
            )
            temperature = 0.4
        } | ConvertTo-Json -Depth 10

        $bytes = [System.Text.Encoding]::UTF8.GetBytes($body)
        $h = @{ "Authorization" = "Bearer $API_KEY"; "Content-Type" = "application/json"; "X-Title" = "ESG-GO-Agent" }
        $resp = Invoke-WebRequest -Method Post -Uri "https://openrouter.ai/api/v1/chat/completions" -Headers $h -Body $bytes -ContentType "application/json; charset=utf-8" -UseBasicParsing -TimeoutSec 50

        $reader = New-Object System.IO.StreamReader($resp.RawContentStream, [System.Text.Encoding]::UTF8)
        $txt = $reader.ReadToEnd()
        $reader.Close()

        $json = $txt | ConvertFrom-Json
        if ($json.choices) {
            Write-Host "`n[3/3] 分析報告成功顯化：`n" -ForegroundColor Cyan
            Write-Host "========================== REPORT =========================="
            [Console]::WriteLine($json.choices[0].message.content)
            Write-Host "============================================================"
            $done = $true
        }
    }
    catch {
        $msg = if ($_.Exception.Message) { $_.Exception.Message } else { "連線異常" }
        Write-Host "  -> 此節點失效 ($msg)" -ForegroundColor Gray
        $attempt++
    }
}

if (-not $done) { Write-Host "`n>>> 矩陣所有路徑皆已飽和。請檢查 API Key 或稍後再試。 <<<" -ForegroundColor Red }

Write-Host "`n>>> 代理任務結束。 <<<`n" -ForegroundColor Cyan
