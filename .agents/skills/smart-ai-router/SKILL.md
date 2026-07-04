---
name: smart-ai-router
description: Smart AI model routing for ESG domain tasks. Routes carbon_calculation, compliance_review, tcfd_analysis, sdg_mapping, evidence_ocr, and other ESG task types to optimal AI models with 3-level fallback chains. Use when building AI routing logic, choosing models for ESG tasks, or implementing fallback strategies.
uuid: "e5f6a7b8-c9d0-1234-efab-345678901234"
version: "1.0.0"
---

# Smart AI Router Skill

Route ESG tasks to optimal AI models with automatic fallback.

## Architecture

```
User Request
    ↓
inferTaskType() ─── Regex keyword matching
    ↓
routeModel() ────── Select Primary / Fallback1 / Fallback2
    ↓
dispatchAI() ────── Try each model in order
    ↓
Mock Fallback ──── Guaranteed response
```

## ESG Task Type Router Table

| Task Type | Primary Model | Fallback 1 | Fallback 2 |
|-----------|--------------|------------|------------|
| `carbon_calculation` | Groq Llama 70B | Qwen 80B | Hermes 405B |
| `compliance_review` | Qwen 80B | Hermes 405B | Groq Llama 70B |
| `gri_report_draft` | Qwen 80B | Hermes 405B | Groq Llama 70B |
| `tcfd_analysis` | Qwen 80B | Hermes 405B | Groq Llama 70B |
| `sdg_mapping` | Groq Llama 70B | Qwen 80B | Llama 70B |
| `evidence_ocr` | Groq Llama 8B | Gemma 9B | Groq Llama 70B |
| `email_archive` | Groq Llama 8B | Gemma 9B | Groq Llama 70B |
| `general` | Groq Llama 70B | Llama 70B | Hermes 405B |

## Task Type Inference (Regex)

```typescript
function inferTaskType(message: string): string {
  const lower = message.toLowerCase();

  if (/carbon|碳|排放|scope [123]/.test(lower)) return 'carbon_calculation';
  if (/compliance|合規|gri|csrd|iso.?14064/.test(lower)) return 'compliance_review';
  if (/tcfd|氣候|風險披露/.test(lower)) return 'tcfd_analysis';
  if (/sdg|永續發展目標/.test(lower)) return 'sdg_mapping';
  if (/ocr|掃描|辨識|pdf/.test(lower)) return 'evidence_ocr';
  if (/email|郵件|存檔/.test(lower)) return 'email_archive';
  if (/report|報告|gri/.test(lower)) return 'gri_report_draft';
  return 'general';
}
```

## Model Selection Criteria

| Criterion | Groq Llama 70B | Qwen 80B | Hermes 405B | Groq Llama 8B |
|-----------|----------------|----------|-------------|----------------|
| Speed | ★★★★★ | ★★★ | ★★ | ★★★★★ |
| Reasoning | ★★★★ | ★★★★★ | ★★★★★ | ★★★ |
| Context | 128K | 32K | 128K | 8K |
| Cost | Free | Free | Free | Free |
| Rate Limit | 30 req/min | 200/day | 200/day | 30 req/min |

## Provider Priority

```
1. Groq (fastest, no daily cap, 30 req/min)
2. OpenRouter :free (200 req/day, good models)
3. Gemini (if available)
4. Mock fallback (guaranteed)
```

## Implementation: Express Gateway

```javascript
// model-router.mjs
import { inferTaskType, routeModel } from './model-router.mjs';

app.post('/gateway/omni-one', async (req, res) => {
  const taskType = inferTaskType(req.body.message);
  const strategy = routeModel(taskType);
  
  // Try primary → fallback1 → fallback2
  for (const tier of ['primary', 'fallback1', 'fallback2']) {
    const model = strategy[tier];
    try {
      const result = await callModel(model, req.body.message);
      return res.json({ ...result, taskType, strategy: tier });
    } catch (err) {
      if (err.status === 429) continue; // rate limited, try next
      throw err;
    }
  }
  
  // Mock fallback
  return res.json({ content: generateMockResponse(taskType), taskType, strategy: 'mock' });
});
```

## Implementation: Next.js API Route

```typescript
// src/core/ai/model-router.ts
export interface ModelConfig {
  provider: 'groq' | 'openrouter';
  model: string;
  maxTokens: number;
  temperature: number;
}

export interface RoutingStrategy {
  taskType: string;
  primary: ModelConfig;
  fallback1: ModelConfig;
  fallback2: ModelConfig;
}

export function routeModel(taskType: string): RoutingStrategy {
  const table: Record<string, RoutingStrategy> = {
    carbon_calculation: {
      taskType,
      primary: { provider: 'groq', model: 'llama-3.3-70b-versatile', maxTokens: 4096, temperature: 0.3 },
      fallback1: { provider: 'openrouter', model: 'qwen/qwen3-next-80b-a3b-instruct:free', maxTokens: 4096, temperature: 0.3 },
      fallback2: { provider: 'openrouter', model: 'hermes-3-llama-3.1-405b:free', maxTokens: 4096, temperature: 0.3 },
    },
    // ... more task types
  };
  return table[taskType] || table.general;
}
```

## Free Model Limits

| Provider | Rate Limit | Daily Cap |
|----------|-----------|-----------|
| Groq | 30 req/min | Unlimited |
| OpenRouter :free | ~10 req/min | 200/day |
| Gemini | 15 req/min | 1500/day |

## Key Rules

1. **Always try Groq first** — fastest, no daily cap
2. **Use `:free` suffix** on OpenRouter —否则會扣費
3. **3-level fallback** — never fail silently
4. **Return taskType + strategy** — for monitoring and analytics
5. **Mock fallback** — guaranteed response for UI stability
