#!/bin/bash

BASE_URL="http://localhost:3000/api/vault"

echo "========================================="
echo "Evidence Vault API 完整測試"
echo "========================================="

# 1. 寫入測試
echo "\n1. 測試寫入 API..."
RESPONSE=$(curl -s -X POST $BASE_URL/write \
  -H "Content-Type: application/json" \
  -d '{
    "formula": "E = Σ(AD × EF)",
    "impactMetric": {"source": "ISO-14064-1", "value": 1234.56, "unit": "tCO2e"},
    "sourceOrigin": "ISO-14064-1",
    "lifecycleStage": "verified"
  }')

UUID=$(echo $RESPONSE | jq -r '.data.uuid')
echo "✅ 寫入成功，UUID: $UUID"

# 2. 讀取測試
echo "\n2. 測試讀取 API..."
curl -s "$BASE_URL/read?uuid=$UUID" | jq

# 3. 驗證測試
echo "\n3. 測試驗證 API..."
curl -s -X POST $BASE_URL/verify \
  -H "Content-Type: application/json" \
  -d "{\"uuid\": \"$UUID\"}" | jq

# 4. 列表測試
echo "\n4. 測試列表 API..."
curl -s "$BASE_URL/list?page=1&limit=5" | jq

# 5. 統計測試
echo "\n5. 測試統計 API..."
curl -s "$BASE_URL/stats" | jq

echo "\n========================================="
echo "✅ 所有測試完成！"
echo "========================================="
