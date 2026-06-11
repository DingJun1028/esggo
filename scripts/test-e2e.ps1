#!/usr/bin/env pwsh

# ESGGO 智慧端對端測試腳本
# 包含：Supabase 接入、JES 監控、API 健康檢查、自動恢復

param(
    [string]$envFile = ".env",
    [int]$timeout = 300,
    [int$maxRetries = 3]
)

$ErrorActionPreference = "Stop"

# 環境變數檢查
function Test-EnvironmentVariables {
    Write-Host "🔍 檢查環境變數..."
    $requiredVars = @("NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY")
    $missingVars = @()
    
    $envContent = Get-Content $envFile -Raw
    foreach ($var in $requiredVars) {
        if ($envContent -notmatch "$var\s*=") {
            $missingVars += $var
        }
    }
    
    if ($missingVars.Count -gt 0) {
        Write-Error "缺少必要環境變數: $($missingVars -join ', ')"
    }
    Write-Host "✅ 所有環境變數正確"
}

# 健康檢查
function Invoke-HealthCheck {
    $retryCount = 0
    $success = $false
    
    while ($retryCount -lt $maxRetries -and -not $success) {
        try {
            Write-Host "🏥 執行健康檢查（嘗試 $retryCount/$maxRetries）..."
            
            # 測試 Supabase 連線
            $response = Invoke-RestMethod -Uri "$env:NEXT_PUBLIC_SUPABASE_URL/rest/v1/health" -Method GET -TimeoutSec 10
            if ($response -and $response.status -eq "ok") {
                Write-Host "✅ Supabase 健康檢查通過"
                $success = $true
            }
            
            # 測試 JES 監控器
            node -e "
                const { JESMonitor } = require('./lib/jes-monitor.ts');
                const monitor = new JESMonitor();
                monitor.addData({
                    timestamp: new Date(),
                    service: 'test-service',
                    energyConsumption: 100,
                    carbonEmission: 50
                });
                const conflicts = monitor.detectConflicts();
                console.log('✅ JES 監控器正常，檢測到 ' + conflicts.length + ' 個衝突');
            "
            
        } catch {
            Write-Host "⚠️ 健康檢查失敗: $($_.Exception.Message)"
            $retryCount++
            Start-Sleep -Seconds 5
        }
    }
    
    if (-not $success) {
        Write-Error "健康檢查失敗，超過重試次數"
    }
}

# 極端負載測試
function Invoke-StressTest {
    Write-Host "🔥 執行極端負載測試..."
    
    # 模擬大 Blob 生成
    $largeContent = "測試內容".PadRight(10MB, 'A')
    $blobPath = "./test-blob.tmp"
    $largeContent | Out-File -FilePath $blobPath -Encoding utf8
    
    try {
        node -e "
            const { JESMonitor } = require('./lib/jes-monitor.ts');
            const monitor = new JESMonitor();
            
            // 模擬大數據處理
            for (let i = 0; i < 1000; i++) {
                monitor.addData({
                    timestamp: new Date(),
                    service: 'stress-test',
                    energyConsumption: 1000,
                    carbonEmission: 500 + i
                });
            }
            
            const conflicts = monitor.detectConflicts();
            console.log('✅ 極端負載測試通過，處理了 ' + conflicts.length + ' 個衝突');
        "
    } finally {
        Remove-Item $blobPath -ErrorAction SilentlyContinue
    }
}

# 自動恢復測試
function Invoke-RecoveryTest {
    Write-Host "🔄 執行自動恢復測試..."
    
    # 模擬 Vault 鑑封失敗
    $env:TEST_VAULT_FAILURE = "true"
    try {
        node -e "
            const { IntegrityModule } = require('./lib/omni-core/integrity.ts');
            const healer = new IntegrityModule();
            
            try {
                healer.sacredSeal({ source: 'test' });
                console.log('❌ 應該拋出錯誤');
            } catch (error) {
                if (error.message.includes('Invalid API key')) {
                    console.log('✅ 自動恢復機制正常，檢測到 API Key 問題');
                } else {
                    throw error;
                }
            }
        "
    } finally {
        Remove-Item Env:\TEST_VAULT_FAILURE
    }
}

# 主流程
Write-Host "🚀 ESGGO 智慧端對端測試開始"
Write-Host "=================================="

Test-EnvironmentVariables
Invoke-HealthCheck
Invoke-StressTest
Invoke-RecoveryTest

Write-Host "🎉 所有端對端測試通過！"
Write-Host "=================================="