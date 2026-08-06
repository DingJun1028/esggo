# Hermes 免費模型指南 (Hermes Free Model Guide)

> ESG GO / OmniHermes 的 $0/月 AI 推理方案：以 Groq + OpenRouter `:free` 模型為核心，
> 透過智慧路由表自動選型並具備 Fallback Chain 自動故障轉移。

## 1. 免費模型清單

完整清單見 `model/hermes-free-models.json`（與 `model/models.txt` 對齊），
亦可由腳本列出：

```bash
node scripts/hermes-model.mjs list
```

預設模型：`meta-llama/llama-3.2-90b-vision:free`

| # | 模型 id | 強項 |
| - | ------- | ---- |
| 1 | `meta-llama/llama-3.2-90b-vision:free` | 多模態 / 圖表分析 / 複雜邏輯 |
| 2 | `qwen/qwen3-next-80b-a3b-instruct:free` | 中文最強 / ESG 報告 / 法規理解 |
| 3 | `meta-llama/llama-3.3-70b-instruct:free` | 通用高品質 |
| 4 | `deepseek/deepseek-r1:free` | 深度推理 / 複雜分析 |
| 5 | `google/gemma-4-31b-it:free` | Google 品質 |
| 6 | `google/gemma-2-12b-it:free` | 輕量高效 |
| 7 | `microsoft/phi-4:free` | 微軟輕量高效 |
| 8 | `google/gemini-2.0-flash-exp:free` | 多模態 / 長上下文 |
| 9 | `cohere/command-r-plus-08-2024:free` | 工具呼叫 / 搜尋 |
| 10 | `mistralai/mistral-small-3.1-24b:free` | 輕量均衡 |

## 2. 切換模型（Hermes Agent）

使用 `scripts/hermes-model.mjs` 產生切換指令：

```bash
# 列出可用模型
node scripts/hermes-model.mjs list

# 產生切換指令（複製執行即可）
node scripts/hermes-model.mjs set meta-llama/llama-3.2-90b-vision:free
# => hermes model set meta-llama/llama-3.2-90b-vision:free

# 顯示預設模型
node scripts/hermes-model.mjs default

# 顯示某任務的免費模型回落鏈
node scripts/hermes-model.mjs pool compliance_review
```

或直接呼叫 Hermes：

```bash
hermes model set <模型 id>
```

## 3. 程式內呼叫（Free Provider 代理層）

在 TypeScript 程式碼中，直接透過 `src/core/ai/model-router.ts` 的 Free Provider 層取得
自帶故障轉移的免費推理：

```ts
import { callFreeProvider, selectFreeModel, getFreeModelPool } from '@/core/ai/model-router';

// 自動沿路由鏈與整個免費模型池故障轉移（含逾時、Provider 健康降級、未配置 Key 跳過），
// 回傳實際採用 provider
const { content, used } = await callFreeProvider('compliance_review', [
  { role: 'system', content: '你是 ESG 合規助手' },
  { role: 'user',   content: '請審查此 CSRD 揭露' },
]);

// 為 Hermes 選定最佳免費模型
const modelId = selectFreeModel('compliance_review'); // => qwen/...:free

// 取得完整免費模型池
const pool = getFreeModelPool();
```

## 4. Fallback Chain（自動故障轉移）

每個 ESG 任務類型以路由鏈 `primary → fallback1 → fallback2` 為優先順序；
若三者皆不可用，會自動補位到**其餘免費模型池**。轉移時會：

- 跳過**未配置 API Key** 的 Provider；
- 跳過**已降級**的模型（失敗後進入 5 分鐘冷卻，期滿自動恢復；以模型為單位，不連累同 Provider 其他模型）；
- 對每次呼叫設 **15s 逾時**（`AbortController`），避免單點 hang 拖垮整條轉移；
- 敏感任務（碳排 / 合規 / TCFD / 重大性 / SDG）可傳 `excludePublicFree: true`，
  拒絕將真實 ESG 資料送往公開免費端點（5T 治理守門）。

全程 $0/月成本。

## 5. 環境變數

| Provider | 環境變數 |
| -------- | -------- |
| Groq | `GROQ_API_KEY` |
| OpenRouter | `OPENROUTER_API_KEY` |
| Cloudflare | `CLOUDFLARE_ACCOUNT_ID` + `CLOUDFLARE_API_TOKEN` |
| Together | `TOGETHER_API_KEY` |
| Mistral | `MISTRAL_API_KEY` |

未設定 API Key 的 Provider 會在故障轉移時自動跳過，不影響整體可用性。
