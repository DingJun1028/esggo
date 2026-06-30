import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const tonePrompts: Record<string, string> = {
  approachable: 'Rewrite the following text in a friendly, approachable tone suitable for stakeholder communication. Keep it clear and encouraging.',
  professional: 'Rewrite the text in a formal, professional tone suitable for official ESG reporting. Use precise business language.',
  academic: 'Rewrite the text in an academic, scholarly tone suitable for research publications. Include technical precision and formal structure.',
};

export async function POST(req: NextRequest) {
  try {
    const { text, tone = 'professional' } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    const tonePrompt = tonePrompts[tone as string] || tonePrompts.professional;
    
    if (!process.env.GEMINI_API_KEY) {
      let rewrittenText = text;
      if (tone === 'approachable') {
        rewrittenText = `[親切版] ${text} (感謝您提供這份資料，我們會確保它的完整與透明！)`;
      } else if (tone === 'professional') {
        rewrittenText = `[專業版] ${text} (此資料已依據 5T 協議進行嚴格核實。)`;
      } else if (tone === 'academic') {
        rewrittenText = `[學術版] ${text} (本研究數據指出，此指標具統計顯著性。)`;
      }
      return NextResponse.json({
        success: true,
        originalText: text,
        rewrittenText,
        toneApplied: tone,
        provider: 'mock'
      });
    }
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `${tonePrompt}\n\nOriginal text:\n${text}`,
    });

    const rewrittenText = response.text || text;

    return NextResponse.json({
      success: true,
      originalText: text,
      rewrittenText,
      toneApplied: tone,
      provider: 'gemini'
    });
  } catch (error) {
    console.error('Error processing grammar:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
