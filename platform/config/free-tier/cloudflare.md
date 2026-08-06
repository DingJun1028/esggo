# Cloudflare Free Tier — esggo 接線說明

| 資源 | 免費額度 | 用於 esggo | 備註 |
|---|---|---|---|
| AI Workers | 10K req/日 | 免費 LLM 兜底 | Llama 8B/70B / Mistral |
| WAF | 免費規則 | 邊界防護 | 待整合 |
| Zero Trust | 免費 |  tightened egress | 待規劃 |

Env/金鑰：
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_AI_GATEWAY_URL`

接線：
- `apps/gateway/model-router.mjs` 路由含 `cloudflare` provider
