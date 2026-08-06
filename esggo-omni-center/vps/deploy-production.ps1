# vps/deploy-production.ps1 v3.0 — 主應用部署（MECE monorepo 相容）
# 使用方式：.\vps\deploy-production.ps1 -Server root@161.118.248.180

param(
    [Parameter(Mandatory=$true)]
    [string]$Server,

    [string]$ProjectPath = "/var/www/esggo",

    [string]$BackupDir = "/var/backups/esggo",

    [int]$MaxBackups = 5,

    [switch]$Rollback,

    [string]$BackupToRollback = ""
)

$ErrorActionPreference = "Stop"
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$BackupPath = "$BackupDir/esggo_$Timestamp"

Write-Host "=== ESGGO Production Deploy v3.0 (Monorepo) ===" -ForegroundColor Cyan
Write-Host "Server: $Server"
Write-Host "Project: $ProjectPath"

# 1. 備份
Write-Host "`n[1/6] Backup..." -ForegroundColor Yellow
ssh $Server "mkdir -p $BackupDir; if (Test-Path '$ProjectPath/.next') { Copy-Item '$ProjectPath/.next' '$BackupPath/.next' -Recurse; Copy-Item '$ProjectPath/package.json' '$BackupPath/package.json'; Copy-Item '$ProjectPath/pnpm-lock.yaml' '$BackupPath/pnpm-lock.yaml'; Get-ChildItem '$BackupDir' -Directory | Sort-Object LastWriteTime -Descending | Select-Object -Skip $MaxBackups | Remove-Item -Recurse -Force; Write-Host 'Backup: $BackupPath' } else { Write-Host 'No .next, skipping backup' }"

# 2. 同步程式碼（monorepo 感知）
Write-Host "`n[2/6] Rsync..." -ForegroundColor Yellow
$excludes = @(
    "--exclude='.git'", "--exclude='node_modules'", "--exclude='.next'",
    "--exclude='logs'", "--exclude='*.db'", "--exclude='.env*'",
    "--exclude='packages/*/node_modules'", "--exclude='apps/*/node_modules'",
    "--exclude='*.bak'"
)
$excludeStr = $excludes -join ' '
$syncCmd = "rsync -avz --delete $excludeStr ./ ${Server}:${ProjectPath}/"
Invoke-Expression $syncCmd

# 3. 安裝依賴
Write-Host "`n[3/6] Install deps..." -ForegroundColor Yellow
ssh $Server "cd $ProjectPath && pnpm install --frozen-lockfile 2>/dev/null || pnpm install"

# 4. Build
Write-Host "`n[4/6] Build..." -ForegroundColor Yellow
ssh $Server "cd $ProjectPath && rm -rf .next && pnpm run build"

if ($LASTEXITCODE -ne 0) {
    Write-Host "BUILD FAILED!" -ForegroundColor Red
    if ($BackupToRollback -eq "") {
        $BackupToRollback = ssh $Server "Get-ChildItem '$BackupDir' -Directory | Sort-Object LastWriteTime -Descending | Select-Object -First 1 -ExpandProperty Name"
    }
    if ($BackupToRollback -ne "") {
        ssh $Server "Remove-Item '$ProjectPath/.next' -Recurse -Force; Copy-Item '$BackupDir/$BackupToRollback/.next' -Destination '$ProjectPath/.next' -Recurse"
        ssh $Server "cd $ProjectPath && pm2 restart esggo-core"
        Write-Host "Rolled back to: $BackupToRollback" -ForegroundColor Yellow
    }
    exit 1
}

# 5. 重啟
Write-Host "`n[5/6] Restart..." -ForegroundColor Yellow
ssh $Server "cd $ProjectPath && pm2 restart ecosystem.config.cjs --update-env"

# 6. 健康檢查
Write-Host "`n[6/6] Health check..." -ForegroundColor Yellow
Start-Sleep -Seconds 5
$web = ssh $Server "curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3000/api/health"
$gw = ssh $Server "curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8642/status"

Write-Host "  Web:     $web"
Write-Host "  Gateway: $gw"

if ($web -eq "200" -and $gw -eq "200") {
    Write-Host "`n=== DEPLOY SUCCESS ===" -ForegroundColor Green
} else {
    Write-Host "`nHealth check FAILED (web=$web, gateway=$gw)" -ForegroundColor Red
    exit 1
}
