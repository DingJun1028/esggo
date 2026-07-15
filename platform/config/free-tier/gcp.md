# GCP Free Tier — esggo 接線說明

| 資源 | 免費額度 | 用於 esggo | 備註 |
|---|---|---|---|
| Gemini API | Free RPM/RPD | `apps/gateway/model-router.mjs` | 已在 esggo 接線 |
| Firebase Spark | Firestore 5萬讀/2萬寫 | 使用者快取 | 見 firebase.md |
| BigQuery | 1TB 掃描/月 | ESG 分析 | 待整合 |
| Cloud Run | 200 萬 req/月 | 無伺服器函式 | 待整合 |

Env/金鑰：
- `GOOGLE_APPLICATION_CREDENTIALS`
- `GOOGLE_CLOUD_PROJECT`
- `GCP_LOCATION`

接線：
- `docs/GCP-FREE-TIER-SAFETY-GUIDE.md`
