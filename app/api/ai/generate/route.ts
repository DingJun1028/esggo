export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export async function POST(request: NextRequest) {
  try {
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { prompt, systemInstruction, messages, temperature = 0.7, wordCount, maxTokens = 2048 } = body;

    // 將 wordCount 轉換為大概的 maxOutputTokens (1 token 延遲約 0.75 個字元)
    const calculatedMaxTokens = wordCount ? Math.ceil(wordCount / 0.75) : maxTokens;

    const contents = messages || [{ role: 'user', parts: [{ text: prompt }] }];

    const requestBody: any = {
      contents,
      generationConfig: {
        temperature,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: Math.min(calculatedMaxTokens, 8192), // Gemini 2.0 Flash 支援更高，但暫時限制在 8k 以免過長
      },
    };

    if (systemInstruction) {
      requestBody.systemInstruction = { parts: [{ text: systemInstruction }] };
    }

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errData = await response.json();
      return NextResponse.json(
        { error: errData.error?.message || 'Gemini API error' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return NextResponse.json({
      text,
      usage: data.usageMetadata,
      model: 'gemini-2.0-flash',
    });
  } catch (error: unknown) {
    console.error('AI Generate API Error:', error);
    return NextResponse.json(
      { error: (error as any).message || 'Internal server error' },
      { status: 500 }
    );
  }
}