export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { agnes } from '@/lib/ai/agnes';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, systemInstruction, messages, temperature = 0.7, wordCount, maxTokens = 2048 } = body;

    // 將 wordCount 轉換為大概的 maxOutputTokens (1 token 延遲約 0.75 個字元)
    const calculatedMaxTokens = wordCount ? Math.ceil(wordCount / 0.75) : maxTokens;

    // 若有提供 messages (OpenAI 格式)，則可以考慮轉換，或直接將 prompt 餵給 generateText
    // ai SDK 支援 messages 和 prompt，這裡根據原本的邏輯
    
    const result = await generateText({
      model: agnes('agnes-2.0-flash'),
      system: systemInstruction,
      prompt: prompt || (messages ? messages.map((m: any) => m.content).join('\n') : undefined),
      temperature,
      maxOutputTokens: Math.min(calculatedMaxTokens, 8192),
    });

    return NextResponse.json({
      text: result.text,
      usage: result.usage,
      model: 'agnes-2.0-flash',
    });
  } catch (error: any) {
    console.error('AI Generate API Error:', error);
    return NextResponse.json(
      { error: (error as any).message || 'Internal server error' },
      { status: 500 }
    );
  }
}