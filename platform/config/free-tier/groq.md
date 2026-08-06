# Groq Free Tier — esggo 接線說明

| 資源 | 免費額度 | 用於 esggo | 備註 |
|---|---|---|---|
| LLM 推理 | 30 req/min，無每日上限 | 主要推論提供者 | 已配置 |

Env/金鑰：
- `GROQ_API_KEY`
- `GROQ_MODEL` = `llama-3.3-70b-versatile`

狀態：
- `.env` 內已有 `GROQ_API_KEY=gsk_dB...RvIi`
- `AI_MODEL=llama-3.3-70b-versatile`

接線：
- `apps/gateway/model-router.mjs` 或 `lib/model-router.ts`
