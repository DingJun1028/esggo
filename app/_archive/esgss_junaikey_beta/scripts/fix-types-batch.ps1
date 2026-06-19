<#
.SYNOPSIS
    批量修復 TypeScript 類型錯誤的 PowerShell 腳本
    
.DESCRIPTION
    此腳本幫助系統性地修復 TypeScript Strict Mode 的類型錯誤
    
.EXAMPLE
    .\fix-types-batch.ps1 -Mode FixImplicitAny
    
.PARAMETER Mode
    FixImplicitAny - 修復隱式 any 類型錯誤
    FixUnknown    - 修復 unknown 類型錯誤
    FixPromise    - 修復 Promise 屬性訪問錯誤
    FixAll       - 修復所有錯誤
#>

param(
    [string]$Mode = "FixAll",
    [string]$ProjectPath = "esgss_junaikey_beta",
    [switch]$DryRun = $false,
    [switch]$Verbose = $false
)

# 錯誤類型到修復策略的映射
$ErrorFixStrategies = @{
    "TS7006" = @{
        Name = "Implicit Any"
        Description = "函數參數缺少類型定義"
        FixTemplate = @"
// 找到類似的模式並添加類型定義
// 錯誤: Parameter 'xxx' implicitly has an 'any' type
// 修復: 添加明確的類型定義
"@
    }
    
    "TS18046" = @{
        Name = "Unknown Type"
        Description = "變量類型為 unknown，需要類型守衛"
        FixTemplate = @"
// 錯誤: Variable is of type 'unknown'
// 修復: 使用類型守衛
// if (error instanceof Error) { ... }
// 或: const err = error instanceof Error ? error : new Error(String(error));
"@
    }
    
    "TS18048" = @{
        Name = "Possibly Undefined"
        Description = "訪問可能為 undefined 的值"
        FixTemplate = @"
// 錯誤: Object is possibly 'undefined'
// 修復: 添加空值檢查或使用可選鏈
// if (obj?.property) { ... }
// 或: const value = obj?.property ?? defaultValue;
"@
    }
    
    "TS7030" = @{
        Name = "Not All Code Paths Return Value"
        Description = "不是所有代碼路徑都有返回值"
        FixTemplate = @"
// 錯誤: Not all code paths return a value
// 修復: 添加預設返回值或使用 never 類型
"@
    }
    
    "TS2339" = @{
        Name = "Property Does Not Exist"
        Description = "訪問不存在的屬性"
        FixTemplate = @"
// 錯誤: Property 'xxx' does not exist on type 'YYY'
// 修復: 檢查類型定義或添加屬性
"@
    }
    
    "TS2345" = @{
        Name = "Argument Type Mismatch"
        Description = "參數類型不匹配"
        FixTemplate = @"
// 錯誤: Argument of type 'string | undefined' is not assignable
// 修復: 使用空值合併運算符或類型斷言
// const value = input ?? defaultValue;
"@
    
    "TS2307" = @{
        Name = "Module Not Found"
        Description = "找不到模組"
        FixTemplate = @"
# 錯誤: Cannot find module 'xxx'
# 修復: 
# 1. 檢查 import 路徑是否正確
# 2. 確認模組是否已安裝
# 3. 建立類型聲明文件
"@
    }
}

function Get-ErrorCount {
    param([string]$LogFile)
    if (Test-Path $LogFile) {
        return (Select-String -Path $LogFile -Pattern "error TS" | Measure-Object).Count
    }
    return 0
}

function Get-ErrorBreakdown {
    param([string]$LogFile)
    $breakdown = @{}
    foreach ($code in $ErrorFixStrategies.Keys) {
        $count = (Select-String -Path $LogFile -Pattern "error $code" | Measure-Object).Count
        if ($count -gt 0) {
            $breakdown[$code] = $count
        }
    }
    return $breakdown
}

function Format-ErrorSummary {
    param([hashtable]$Breakdown)
    $summary = "TypeScript 錯誤摘要`n"
    $summary += "=" * 50 + "`n"
    
    foreach ($code in $Breakdown.Keys) {
        $strategy = $ErrorFixStrategies[$code]
        $summary += "[$code] $($strategy.Name): $($Breakdown[$code]) 個錯誤`n"
        $summary += "   說明: $($strategy.Description)`n"
        $summary += "`n"
    }
    
    return $summary
}

function New-FixReport {
    param(
        [string]$FilePath,
        [string]$ErrorCode,
        [string]$LineNumber,
        [string]$Description
    )
    
    $report = @"
檔案: $FilePath
錯誤碼: $ErrorCode
行號: $LineNumber
描述: $Description
狀態: 待修復
建議: 請參考 TYPESCRIPT_STRICT_MODE_COMPLIANCE.md 中的修復策略

"@
    
    return $report
}

# 主程序
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TypeScript Strict Mode 批量修復工具" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 步驟 1: 分析當前錯誤狀態
Write-Host "[1/4] 分析類型錯誤狀態..." -ForegroundColor Yellow

$typeCheckLog = "$ProjectPath/current_type_check_utf8_v2.txt"
if (-not (Test-Path $typeCheckLog)) {
    Write-Host "錯誤: 找不到類型檢查日誌檔案: $typeCheckLog" -ForegroundColor Red
    Write-Host "請先執行: pnpm run type-check 2>&1 | tee current_type_check.txt" -ForegroundColor Yellow
    exit 1
}

$totalErrors = Get-ErrorCount -LogFile $typeCheckLog
$errorBreakdown = Get-ErrorBreakdown -LogFile $typeCheckLog

Write-Host "  總錯誤數: $totalErrors" -ForegroundColor White
Write-Host ""
Write-Host (Format-ErrorSummary -Breakdown $errorBreakdown) -ForegroundColor Gray

# 步驟 2: 根據模式分類錯誤
Write-Host "[2/4] 根據錯誤模式分類..." -ForegroundColor Yellow

$filesToFix = @{}
$lines = Get-Content $typeCheckLog | Where-Object { $_ -match "error TS(\d+):" }

foreach ($line in $lines) {
    if ($line -match "(\S+)\((\d+),(\d+)\):.*error TS(\d+)") {
        $file = $Matches[1]
        $lineNum = $Matches[2]
        $errorCode = $Matches[4]
        
        if (-not $filesToFix.ContainsKey($file)) {
            $filesToFix[$file] = @{
                Lines = @()
                Errors = @()
            }
        }
        
        $filesToFix[$file].Lines += $lineNum
        $filesToFix[$file].Errors += $errorCode
    }
}

Write-Host "  發現 $($filesToFix.Count) 個檔案需要修復" -ForegroundColor White
Write-Host ""

# 步驟 3: 生成修復報告
Write-Host "[3/4] 生成修復報告..." -ForegroundColor Yellow

$fixReport = "# TypeScript 類型錯誤修復報告`n"
$fixReport += "# 生成時間: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')`n"
$fixReport += "# 總錯誤數: $totalErrors`n`n"

$fixReport += "## 修復優先順序`n`n"
$fixReport += "### 第一階段: 導致編譯失敗的錯誤 (高優先級)`n"
$fixReport += "- TS2307: 模組找不到`n"
$fixReport += "- TS2724: 導出成員不存在`n"
$fixReport += "`n"

$fixReport += "### 第二階段: 可能導致運行時問題的錯誤 (中優先級)`n"
$fixReport += "- TS2339: Promise 屬性訪問錯誤`n"
$fixReport += "- TS2345: 參數類型不匹配`n"
$fixReport += "- TS2532: 對象可能 undefined`n"
$fixReport += "`n"

$fixReport += "### 第三階段: 類型安全警告 (低優先級)`n"
$fixReport += "- TS7006: 隱式 any 類型`n"
$fixReport += "- TS18046: unknown 類型`n"
$fixReport += "- TS18048: 可能 undefined`n"
$fixReport += "- TS7030: 返回值不完整`n"
$fixReport += "`n"

$fixReport += "## 待修復檔案清單`n`n"

foreach ($file in $filesToFix.Keys) {
    $fixReport += "### $file`n"
    $fixReport += "- 需要修復的行數: $($filesToFix[$file].Lines -join ', ')`n"
    $fixReport += "- 錯誤類型: $($filesToFix[$file].Errors -join ', ')`n"
    $fixReport += "`n"
}

$fixReport | Out-File -FilePath "$ProjectPath/TYPE_FIX_REPORT.md" -Encoding UTF8
Write-Host "  修復報告已生成: $ProjectPath/TYPE_FIX_REPORT.md" -ForegroundColor White

# 步驟 4: 根據模式進行修復
Write-Host "[4/4] 準備修復..." -ForegroundColor Yellow

if ($DryRun) {
    Write-Host "  [Dry Run 模式] 模擬修復過程..." -ForegroundColor Yellow
} else {
    Write-Host "  請手動修復以下檔案，或使用以下命令繼續：" -ForegroundColor Yellow
    Write-Host "  pnpm run type-check 2>&1 | tee type-check-after-fix.txt" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  修復策略摘要" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

foreach ($code in $ErrorFixStrategies.Keys) {
    if ($errorBreakdown.ContainsKey($code)) {
        $strategy = $ErrorFixStrategies[$code]
        Write-Host ""
        Write-Host "[$code] $($strategy.Name)" -ForegroundColor Red
        Write-Host "  數量: $($errorBreakdown[$code]) 個錯誤" -ForegroundColor White
        Write-Host "  說明: $($strategy.Description)" -ForegroundColor Gray
        Write-Host "  修復: $($strategy.FixTemplate.Substring(0, 100))..." -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  完成!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "下一步:" -ForegroundColor Yellow
Write-Host "  1. 查看修復報告: $ProjectPath/TYPE_FIX_REPORT.md" -ForegroundColor White
Write-Host "  2. 參考文檔: $ProjectPath/TYPESCRIPT_STRICT_MODE_COMPLIANCE.md" -ForegroundColor White
Write-Host "  3. 修復錯誤後重新運行類型檢查" -ForegroundColor White
Write-Host ""
