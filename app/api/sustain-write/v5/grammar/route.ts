import { NextRequest, NextResponse } from 'next/server';
import { jsonError } from '@/lib/api-utils';

/**
 * 安全柵欄：預設 FREE_TIER_ONLY 為 true
 * 即使設了 GEMINI_API_KEY，只要 FREE_TIER_ONLY 未設 false 就不會呼叫 Gemini
 */
const FREE_TIER_ONLY = process.env.FREE_TIER_ONLY !== 'false';
const HAS_API_KEY = !!process.env.GEMINI_API_KEY;
const USE_REAL_AI = HAS_API_KEY && !FREE_TIER_ONLY;

type Tone = 'approachable' | 'professional' | 'academic';

const tonePrompts: Record<Tone, string> = {
  approachable: 'Rewrite the following text in a friendly, approachable tone suitable for stakeholder communication. Keep it clear and encouraging.',
  professional: 'Rewrite the text in a formal, professional tone suitable for official ESG reporting. Use precise business language.',
  academic: 'Rewrite the text in an academic, scholarly tone suitable for research publications. Include technical precision and formal structure.',
};

function mockRewrite(text: string, tone: Tone): string {
  const prefixMap: Record<Tone, string> = {
    approachable: '【親切版】',
    professional: '【專業版】',
    academic: '【學術版】',
  };
  return `${prefixMap[tone]} ${text}`;
}

export async function POST(req: NextRequest) {
  try {
    const { text, tone = 'professional' } = await req.json() as { text?: string; tone?: Tone };

    if (!text) {
      return jsonError('INVALID_PARAMS', 'No text provided', 400);
    }

    if (!USE_REAL_AI) {
      return NextResponse.json({
        success: true,
        originalText: text,
        rewrittenText: mockRewrite(text, tone),
        toneApplied: tone,
        provider: 'mock',
        note: FREE_TIER_ONLY ? 'Free-tier mode active' : 'No API key configured',
      });
    }

    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
    const tonePrompt = tonePrompts[tone] || tonePrompts.professional;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `${tonePrompt}\n\nOriginal text:\n${text}`,
    });

    return NextResponse.json({
      success: true,
      originalText: text,
      rewrittenText: response.text || text,
      toneApplied: tone,
      provider: 'gemini',
    });
  } catch (error) {
    console.error('Error processing grammar:', error);
    return jsonError('INTERNAL_ERROR', 'Internal Server Error', 500);
  }
}
