# Gemini Free Tier — esggo 接線說明

| 資源 | 免費額度 | 用於 esggo | 備註 |
|---|---|---|---|
| Gemini API | Free RPM/RPD | 主要/備用模型 | 已配置 |

Env/金鑰：
- `GEMINI_API_KEY`
- `GOOGLE_CLOUD_PROJECT`

狀態：
- `.env` 內已有 `GEMINI_API_KEY=AQ.Ab8RN6K8...`
- `@google/genai` 為依賴

接線：
- `apps/gateway/model-router.mjs` provider = `gemini`
