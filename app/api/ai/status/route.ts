import { jsonResponse } from '@/lib/api-utils';

interface AIStatus {
  timestamp: string;
  providers: {
    groq: {
      available: boolean;
      models: string[];
      rateLimit: string;
    };
    openrouter: {
      available: boolean;
      models: number;
      dailyLimit: string;
    };
    gemini: {
      available: boolean;
    };
  };
  fallbackChain: string[];
  totalFreeModels: number;
}

export async function GET() {
  const status: AIStatus = {
    timestamp: new Date().toISOString(),
    providers: {
      groq: {
        available: !!process.env.GROQ_API_KEY,
        models: [
          'llama-3.3-70b-versatile',
          'llama-3.1-8b-instant',
          'gemma2-9b-it',
          'mixtral-8x7b-32768',
        ],
        rateLimit: '30 req/min',
      },
      openrouter: {
        available: !!process.env.OPENROUTER_API_KEY,
        models: 11,
        dailyLimit: '200 req/day',
      },
      gemini: {
        available: !!process.env.GEMINI_API_KEY,
      },
    },
    fallbackChain: [
      'Local Ollama',
      'Google Gemini',
      'Groq (30 req/min)',
      'OpenRouter :free (200 req/day)',
      'Mock',
    ],
    totalFreeModels: 15,
  };

  return jsonResponse(status);
}
