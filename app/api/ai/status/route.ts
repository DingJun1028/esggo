// ═══════════════════════════════════════════════════════════════
// /api/ai/status — AI Provider Status
// Uses @esggo/shared/config for unified configuration
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server';
import { getConfig } from '@esggo/shared/config';

export const dynamic = 'force-dynamic';

export async function GET() {
  const config = getConfig();

  const status = {
    timestamp: new Date().toISOString(),
    providers: {
      groq: {
        available: !!config.ai.groqApiKey,
        models: [
          'llama-3.3-70b-versatile',
          'llama-3.1-8b-instant',
          'gemma2-9b-it',
          'mixtral-8x7b-32768',
        ],
        rateLimit: '30 req/min',
      },
      openrouter: {
        available: !!config.ai.openrouterApiKey,
        models: 11,
        dailyLimit: '200 req/day',
      },
      gemini: {
        available: !!config.ai.geminiApiKey,
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
    freeTierOnly: config.ai.freeTierOnly,
  };

  return NextResponse.json({ success: true, data: status });
}
