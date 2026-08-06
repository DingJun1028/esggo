# OpenRouter Free Tier — esggo 接線說明

| 資源 | 免費額度 | 用於 esggo | 備註 |
|---|---|---|---|
| LLM 路由 | 200 req/day 免費層 | 多模型 fallback | 已配置 |

Env/金鑰：
- `OPENROUTER_API_KEY`
- `OPENROUTER_MODEL` = `meta-llama/llama-3.3-70b-instruct:free`

狀態：
- `.env` 內已有 `OPENROUTER_API_KEY=sk-or-...a6fd`

接線：
- `apps/gateway/model-router.mjs`
