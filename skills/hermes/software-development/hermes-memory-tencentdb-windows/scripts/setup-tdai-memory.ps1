# setup-tdai-memory.ps1 — TencentDB Agent Memory 最佳實踐安裝（Windows native，官方 bat 薄包裝）
# 2026-08-01 實證: npm tarball 內無 .bat（scripts/ 只有 .sh）→ 必須抓 GitHub repo
# 用法:
#   $env:TDAI_LLM_API_KEY="gsk_你的GroqKey"          # console.groq.com 免費申請
#   powershell -ExecutionPolicy Bypass -File setup-tdai-memory.ps1
# npm registry 不穩（曾 11 分鐘 stall）：先設 $env:TDAI_USE_MIRROR="1"
$ErrorActionPreference = 'Continue'
$log = Join-Path $PSScriptRoot 'tdai-memory-setup.log'
Start-Transcript -Path $log -Append | Out-Null
Write-Host "=== TDAI memory setup $(Get-Date -Format o) ==="

# ---------- 1/7 前置檢查 ----------
$hermesHome = 'C:\Users\dingj\AppData\Local\hermes'
$env:HERMES_HOME = $hermesHome
Write-Host "[1/7] HERMES_HOME=$hermesHome"
node -v; npm -v
if (-not (Test-Path $hermesHome)) { Write-Host "!! Hermes home 不存在: $hermesHome"; Stop-Transcript; exit 1 }

# ---------- 2/7 抓官方 repo（含 Windows .bat） ----------
Write-Host "[2/7] 下載官方 repo (github.com/TencentCloud/TencentDB-Agent-Memory)"
$work = Join-Path $env:USERPROFILE '.tdai-setup-work'
New-Item -ItemType Directory -Force $work | Out-Null
Push-Location $work
Get-ChildItem -Force | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
$tarball = Join-Path $work 'tdai-main.tar.gz'
curl.exe -L --connect-timeout 20 -o $tarball 'https://github.com/TencentCloud/TencentDB-Agent-Memory/archive/refs/heads/main.tar.gz'
if (-not (Test-Path $tarball) -or (Get-Item $tarball).Length -lt 100000) { Write-Host "!! repo 下載失敗（檢查網路/代理）"; Stop-Transcript; exit 1 }
tar -xzf $tarball
$repo = (Get-ChildItem -Directory | Where-Object { $_.Name -like 'TencentDB-Agent-Memory*' } | Select-Object -First 1).FullName
if (-not (Test-Path (Join-Path $repo 'scripts\setup-hermes-memory-tencentdb.bat'))) { Write-Host "!! repo 內找不到官方 bat: $repo"; Stop-Transcript; exit 1 }
Write-Host "   repo: $repo"
if ($env:TDAI_USE_MIRROR -eq '1') { Set-Content (Join-Path $repo '.npmrc') 'registry=https://registry.npmmirror.com'; Write-Host '   已設 npmmirror 鏡像（僅 repo 內 npm install 生效）' }

# ---------- 3/7 LLM（Groq 免費） ----------
Write-Host "[3/7] LLM = Groq 免費 API"
$env:TDAI_LLM_BASE_URL = 'https://api.groq.com/openai/v1'
if (-not $env:TDAI_LLM_MODEL) { $env:TDAI_LLM_MODEL = 'openai/gpt-oss-20b' }  # 30 RPM/1K RPD；qwen 系改用 'qwen/qwen3-32b' + TDAI_LLM_DISABLE_THINKING=dashscope
if (-not $env:TDAI_LLM_API_KEY) { Write-Host "!! TDAI_LLM_API_KEY 未設定 — Gateway 仍會起，但 L1/L2/L3 抽取停擺。先申請 Groq key 再重跑" }
else { Write-Host "   key=已設定 model=$env:TDAI_LLM_MODEL" }

# ---------- 4/7 官方安裝腳本 ----------
Write-Host "[4/7] 執行官方 setup-hermes-memory-tencentdb.bat（npm install 可能數分鐘）"
Push-Location $repo
cmd /c "scripts\setup-hermes-memory-tencentdb.bat" 2>&1 | Tee-Object -Append $log | Select-Object -Last 15
Pop-Location

# ---------- 5/7 config.yaml 補 memory.provider ----------
Write-Host "[5/7] config.yaml memory.provider"
$cfg = Join-Path $hermesHome 'config.yaml'
if (Test-Path $cfg) {
  $c = Get-Content $cfg -Raw
  if ($c -notmatch '(?m)^memory:\s*$') {
    $c = $c.TrimEnd() + "`nmemory:`n  provider: memory_tencentdb`n"
    Set-Content $cfg $c -NoNewline
    Write-Host "   已追加 memory.provider（YAML 換行已處理）"
  } else { Write-Host "   memory: 段已存在（確認 provider 值）" }
} else { Set-Content $cfg "memory:`n  provider: memory_tencentdb"; Write-Host "   已建立 config.yaml" }

# ---------- 6/7 Gateway Bearer 鑑權（最佳實踐） ----------
Write-Host "[6/7] Gateway Bearer 鑑權"
if (-not $env:TDAI_GATEWAY_API_KEY) {
  $chars = 'abcdef0123456789'.ToCharArray()
  $env:TDAI_GATEWAY_API_KEY = -join (1..32 | ForEach-Object { $chars | Get-Random })
}
$envFile = Join-Path $hermesHome '.env'
function Set-EnvLine([string]$name, [string]$value) {
  $q = '"' + $value + '"'
  $content = if (Test-Path $envFile) { Get-Content $envFile -Raw } else { '' }
  if ($content -match "(?m)^$name=.*$") {
    $content = $content -replace "(?m)^$name=.*$", "$name=$q"
    Write-Host "   $name 已更新（原行存在，覆寫）"
  } else {
    $content = $content.TrimEnd() + "`r`n" + "$name=$q`r`n"
    Write-Host "   $name 已新增"
  }
  Set-Content $envFile $content -NoNewline
}
Set-EnvLine 'TDAI_GATEWAY_API_KEY' $env:TDAI_GATEWAY_API_KEY
Set-EnvLine 'MEMORY_TENCENTDB_GATEWAY_API_KEY' $env:TDAI_GATEWAY_API_KEY
Write-Host "   Gateway API key 已寫入 .env（請另存供 GitHub Secrets 使用: $($env:TDAI_GATEWAY_API_KEY)）"

# ---------- 7/7 驗證 ----------
Write-Host "[7/7] 驗證 Gateway /health"
Start-Sleep -Seconds 2
try { $h = Invoke-RestMethod -TimeoutSec 5 'http://127.0.0.1:8420/health'; Write-Host "   health: $($h | ConvertTo-Json -Compress)" }
catch { Write-Host "   health 失敗: $($_.Exception.Message) → 手動跑: cd $repo; node --import tsx/esm src/gateway/server.ts" }

Write-Host "=== 完成。下一步: 重啟 Hermes 桌面 app → 首輪對話自動起 Gateway（略慢正常） ==="
Write-Host "log: $log"
Stop-Transcript | Out-Null
