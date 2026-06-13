import { NextRequest, NextResponse } from 'next/server';
import { streamText } from 'ai';
import { agnes } from '@/lib/ai/agnes';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { prompt, systemInstruction } = await req.json();

    const result = streamText({
      model: agnes('agnes-2.0-flash'),
      system: systemInstruction,
      prompt: prompt,
      temperature: 0.7,
      topP: 0.95,
      maxOutputTokens: 4096,
    });

    return result.toTextStreamResponse();
  } catch (err: any) {
    console.error('[AI Stream API] Fatal Error:', err);
    return NextResponse.json({ error: (err as any).message }, { status: 500 });
  }
}
