# vps/deploy-production.ps1 v2.0 — 主應用部署（含備份回滾）
# 使用方式：.\vps\deploy-production.ps1 -Server root@161.118.248.180 -ProjectPath /var/www/esggo

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
$BackupPath = "$BackupDir\esggo_$Timestamp"

Write-Host "=== ESGGO Production Deploy v2.0 ===" -ForegroundColor Cyan
Write-Host "Server: $Server"
Write-Host "Project: $ProjectPath"
Write-Host "Timestamp: $Timestamp"

# 1. 建立備份
Write-Host "`n[1/6] 建立備份..." -ForegroundColor Yellow
$backupScript = @"
if (-not (Test-Path '$BackupDir')) { New-Item -ItemType Directory -Path '$BackupDir' -Force | Out-Null }
if (Test-Path '$ProjectPath\.next') {
    # 只備份 .next 和 package.json
    `$backupName = 'esggo_$Timestamp'
    `$backupPath = '$BackupDir\$backupName'
    New-Item -ItemType Directory -Path `$backupPath -Force | Out-Null
    Copy-Item '$ProjectPath\.next' -Destination '$backupPath\.next' -Recurse
    Copy-Item '$ProjectPath\package.json' -Destination '$backupPath\package.json'
    Copy-Item '$ProjectPath\pnpm-lock.yaml' -Destination '$backupPath\pnpm-lock.yaml' -ErrorAction SilentlyContinue
    Write-Host "Backup created: `$backupPath"
} else {
    Write-Host "No .next directory found, skipping backup"
}
# 清理舊備份
`$backups = Get-ChildItem '$BackupDir' -Directory | Sort-Object LastWriteTime -Descending
if (`$backups.Count -gt $MaxBackups) {
    `$backups | Select-Object -Skip $MaxBackups | ForEach-Object { Remove-Item `$_.FullName -Recurse -Force }
    Write-Host "Cleaned old backups (kept $MaxBackups)"
}
"@

Invoke-Command -ComputerName ($Server -split '@')[1] -Credential ($Server -split '@')[0] -ScriptBlock {
    param($backupScript)
    Invoke-Expression $backupScript
} -ArgumentList $backupScript

# 2. 同步程式碼
Write-Host "`n[2/6] 同步程式碼..." -ForegroundColor Yellow
$syncCommand = "rsync -avz --delete --exclude='.git' --exclude='node_modules' --exclude='.next' --exclude='logs' ./ ${Server}:${ProjectPath}/"
Invoke-Expression $syncCommand

# 3. 安裝依賴
Write-Host "`n[3/6] 安裝依賴..." -ForegroundColor Yellow
ssh $Server "cd $ProjectPath && pnpm install --frozen-lockfile 2>/dev/null || pnpm install"

# 4. Build
Write-Host "`n[4/6] 建置..." -ForegroundColor Yellow
ssh $Server "cd $ProjectPath && rm -rf .next && pnpm run build"

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n!!! BUILD FAILED !!!" -ForegroundColor Red

    if ($BackupToRollback -eq "") {
        Write-Host "Rolling back to latest backup..." -ForegroundColor Yellow
        $latestBackup = ssh $Server "Get-ChildItem '$BackupDir' -Directory | Sort-Object LastWriteTime -Descending | Select-Object -First 1"
        $BackupToRollback = $latestBackup
    }

    if ($BackupToRollback -ne "") {
        Write-Host "Restoring from: $BackupToRollback" -ForegroundColor Yellow
        ssh $Server "Remove-Item '$ProjectPath\.next' -Recurse -Force; Copy-Item '$BackupToRollback\.next' -Destination '$ProjectPath\.next' -Recurse; Write-Host 'Rollback complete'"
        ssh $Server "cd $ProjectPath && pm2 restart esggo-core"
    }

    exit 1
}

# 5. 重啟服務
Write-Host "`n[5/6] 重啟服務..." -ForegroundColor Yellow
ssh $Server "cd $ProjectPath && pm2 restart esggo-core --update-env"

# 6. 健康檢查
Write-Host "`n[6/6] 健康檢查..." -ForegroundColor Yellow
Start-Sleep -Seconds 5
$healthCheck = ssh $Server "curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3000/api/health"

if ($healthCheck -eq "200") {
    Write-Host "`n=== DEPLOY SUCCESS ===" -ForegroundColor Green
    Write-Host "Backup: $BackupPath"
    Write-Host "Health: OK"
} else {
    Write-Host "`n!!! HEALTH CHECK FAILED (HTTP $healthCheck) !!!" -ForegroundColor Red
    Write-Host "Run rollback: .\deploy-production.ps1 -Server $Server -Rollback -BackupToRollback $BackupPath"
    exit 1
}
