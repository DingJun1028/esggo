# 遊戲 API 測試腳本
# 用途：驗證 Phase 6.2 遊戲後端 API 端點

$baseUrl = "http://localhost:5000/api/game"
$token = "YOUR_JWT_TOKEN_HERE" # 需要先登入獲取 JWT Token

# 測試端點列表
$endpoints = @(
    @{Method="GET"; Path="/cards/collection"; Name="獲取卡牌收藏"},
    @{Method="GET"; Path="/cards/statistics"; Name="獲取卡牌統計"},
    @{Method="GET"; Path="/decks"; Name="獲取牌組列表"},
    @{Method="GET"; Path="/ai/companion"; Name="獲取 AI 數位分身"},
    @{Method="GET"; Path="/ai/companion/suggestions"; Name="獲取 AI 成長建議"}
)

Write-Host "🎮 遊戲 API 測試開始" -ForegroundColor Cyan
Write-Host "=" * 50

foreach ($endpoint in $endpoints) {
    Write-Host "`n測試: $($endpoint.Name)" -ForegroundColor Yellow
    Write-Host "端點: $($endpoint.Method) $($endpoint.Path)"
    
    try {
        $headers = @{
            "Authorization" = "Bearer $token"
            "Content-Type" = "application/json"
        }
        
        $url = "$baseUrl$($endpoint.Path)"
        
        if ($endpoint.Method -eq "GET") {
            $response = Invoke-RestMethod -Uri $url -Method Get -Headers $headers -ErrorAction Stop
        }
        
        Write-Host "✅ 成功" -ForegroundColor Green
        Write-Host "回應: $($response | ConvertTo-Json -Depth 2)"
    }
    catch {
        Write-Host "❌ 失敗: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n" + "=" * 50
Write-Host "測試完成" -ForegroundColor Cyan
