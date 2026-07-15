# Firebase Free — esggo 接線說明

| 資源 | 免費額度 | 用於 esggo | 備註 |
|---|---|---|---|
| Firestore | 5萬讀/2萬寫/日 | 使用者偏好/session cache | Spark |
| Auth | 匿名 | 訪客身份 | 待整合 |
| Hosting | 10GB | fallback | 若拆分 static export |
| Functions | 125 萬調用/月 | webhook/cron | 待整合 |

Env/金鑰：
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `FIREBASE_DATABASE_URL`

接線：
- 專案：`esg-sunshine`
- 參考：`firebase-service-account.json`
