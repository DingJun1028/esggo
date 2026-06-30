/**
 * AGNES API Client — OpenRouter :free integration
 * 
 * Supports:
 * - OpenRouter :free models (200 req/day free tier)
 * - Fallback chain: try multiple :free models
 * - Rate limit awareness
 * - ESG-specific system prompts
 */

export interface AgnesResponse {
  success: boolean;
  data: any;
  error?: string;
  metadata: {
    timestamp: number;
    provider: string;
    model?: string;
    usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
  };
}

// OpenRouter :free models (rotate for higher throughput)
const FREE_MODELS = [
  'google/gemini-2.0-flash-001',
  'meta-llama/llama-3.3-70b-instruct',
  'mistralai/mistral-7b-instruct',
  'openchat/openchat-7b',
] as const;

const SYSTEM_PROMPT = `你是 ESGGO 永續報告 AI 助手，專注於 ESG（環境、社會、治理）領域分析。
回答時請：
1. 使用繁體中文
2. 引用 GRI / ISSB / TCFD / TNFD 標準
3. 提供具體數據和案例
4. 保持專業且簡潔`;

export class AgnesClient {
  private apiKey: string;
  private modelIndex: number = 0;
  private freeTierOnly: boolean;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.OPENROUTER_API_KEY || '';
    this.freeTierOnly = process.env.FREE_TIER_ONLY === 'false' ? false : true;
  }

  /**
   * Process a request via OpenRouter :free models
   */
  async processRequest(input: string, context?: { systemPrompt?: string; temperature?: number }): Promise<AgnesResponse> {
    if (!this.apiKey || this.freeTierOnly) {
      return this.mockResponse(input);
    }

    // Try each :free model in rotation
    for (let attempt = 0; attempt < FREE_MODELS.length; attempt++) {
      const model = FREE_MODELS[(this.modelIndex + attempt) % FREE_MODELS.length];
      
      try {
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
            'X-Title': 'ESGGO',
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: context?.systemPrompt || SYSTEM_PROMPT },
              { role: 'user', content: input },
            ],
            temperature: context?.temperature ?? 0.7,
            max_tokens: 2048,
          }),
        });

        if (res.status === 429) {
          // Rate limited — try next model
          continue;
        }

        if (!res.ok) {
          const errText = await res.text();
          console.warn(`[AGNES] Model ${model} failed (${res.status}): ${errText.slice(0, 200)}`);
          continue;
        }

        const data = await res.json();
        const output = data.choices?.[0]?.message?.content || '';
        
        // Rotate to next model for load balancing
        this.modelIndex = (this.modelIndex + 1) % FREE_MODELS.length;

        return {
          success: true,
          data: {
            output,
            confidence: 0.9,
          },
          metadata: {
            timestamp: Date.now(),
            provider: 'openrouter',
            model,
            usage: data.usage,
          },
        };
      } catch (e) {
        console.warn(`[AGNES] Model ${model} error:`, e);
        continue;
      }
    }

    // All models failed — fallback to mock
    return this.mockResponse(input);
  }

  /**
   * Get system metrics
   */
  async getMetrics(): Promise<AgnesResponse> {
    return {
      success: true,
      data: {
        activeNodes: FREE_MODELS.length,
        throughput: 'OpenRouter :free',
        models: [...FREE_MODELS],
        currentModel: FREE_MODELS[this.modelIndex],
      },
      metadata: {
        timestamp: Date.now(),
        provider: 'openrouter',
      },
    };
  }

  /**
   * Mock fallback when no API key or all models fail
   */
  private async mockResponse(input: string): Promise<AgnesResponse> {
    return {
      success: true,
      data: {
        output: `[AGNES Mock] 已收到您的 ESG 查詢：「${input.slice(0, 100)}」。設定 OPENROUTER_API_KEY 即可啟用真實 AI 回應。`,
        confidence: 0.5,
        mock: true,
      },
      metadata: {
        timestamp: Date.now(),
        provider: 'mock',
      },
    };
  }
}

// Singleton instance for server-side usage
export const agnesApi = new AgnesClient();
