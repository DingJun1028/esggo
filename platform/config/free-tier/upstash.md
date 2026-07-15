# Upstash Redis Free — esggo 接線說明

| 資源 | 免費額度 | 用於 esggo | 備註 |
|---|---|---|---|
| Redis | 10K req/日 | rate limit / session | REST API |

Env/金鑰：
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

接線：
- 未來 `apps/gateway` Middleware
