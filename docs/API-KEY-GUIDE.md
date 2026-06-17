# ESGGO API Key 系統詳細設定指南

## API Key 格式與前綴

```
格式: esggo_sk_[32碼隨機字串]
範例: esggo_sk_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

## 快速開始

### 1. 建立 API Key

```bash
curl -X POST https://your-domain.com/api/auth/api-key \
  -H "Content-Type: application/json" \
  -d '{
    "action": "create",
    "userId": "your-user-uuid",
    "keyName": "My App Key",
    "scopes": ["read", "write", "reports"]
  }'
```

回應:

```json
{
  "id": "uuid",
  "keyName": "My App Key",
  "apiKey": "esggo_sk_a1b2c3d4...",
  "scopes": ["read", "write", "reports"],
  "rateLimit": 1000
}
```

**重要**: `apiKey` 僅回傳一次，請務必保存！

### 2. 使用 API Key

```bash
curl https://your-domain.com/api/gri \
  -H "Authorization: Bearer esggo_sk_a1b2c3d4..."
```

### 3. 權限範圍 (Scopes)

| Scope     | 說明       | 可存取端點                                    |
| --------- | ---------- | --------------------------------------------- |
| `read`    | 讀取數據   | GET /api/matrix, /api/gri, /api/cbam          |
| `write`   | 寫入數據   | POST /api/sustain-write, /api/data/integrator |
| `reports` | 報告生成   | /api/sustain-write/generate                   |
| `admin`   | 管理員權限 | /api/admin/\*                                 |

## 進階設定

### Rate Limiting

預設 1000 請求/小時，可於建立時設定：

```javascript
const key = await generateApiKey(userId, 'High Volume', ['read'], 10000);
```

### Key 過期設定

```javascript
const key = await generateApiKey(userId, 'Temporary', ['read'], 1000, {
  expiresAt: '2025-12-31T23:59:59Z',
});
```

### 更新與撤銷

```bash
# 撤銷 Key
curl -X POST https://your-domain.com/api/auth/api-key \
  -H "Authorization: Bearer esggo_sk_xxx" \
  -d '{"action": "revoke", "keyId": "uuid"}'

# 列出所有 Key
curl -X POST https://your-domain.com/api/auth/api-key \
  -H "Authorization: Bearer esggo_sk_xxx" \
  -d '{"action": "list", "userId": "your-uuid"}'
```

## 環境變數

```bash
# .env.local
ESGGO_API_KEY_TTL_DAYS=365
ESGGO_API_KEY_PREFIX=esggo_sk_
ESGGO_API_RATE_LIMIT=1000
ESGGO_API_RATE_WINDOW=3600
```

## 安全建議

1. **儲存安全**: 將 API Key 儲存於環境變數或秘密管理系統
2. **權限最小化**: 僅給予必要權限
3. **定期輪換**: 每 90 天更新 Key
4. **監控使用**: 定期檢查 `last_used_at`

## SDK 範例

### JavaScript/Node.js

```javascript
import { ESGApiClient } from '@esggo/sdk';

const client = new ESGApiClient({
  apiKey: process.env.ESGGO_API_KEY,
});

const standards = await client.getGRIStandards();
const report = await client.generateReport({ company: 'ABC Corp' });
```

### Python

```python
import esggo

client = esggo.Client(api_key=os.getenv('ESGGO_API_KEY'))
standards = client.gri.list()
```

## 錯誤碼

| 碼  | 說明                      |
| --- | ------------------------- |
| 401 | 缺少 Authorization header |
| 403 | API Key 無效或過期        |
| 429 | 超過 rate limit           |
| 500 | 伺服器錯誤                |
