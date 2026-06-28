import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { text, tone = 'professional' } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    // TODO: In a real implementation, this would call L-Hub or Gemini to rewrite the text based on the tone.
    let rewrittenText = text;
    
    if (tone === 'approachable') {
      rewrittenText = `[親切版] ${text} (感謝您提供這份資料，我們會確保它的完整與透明！)`;
    } else if (tone === 'professional') {
      rewrittenText = `[專業版] ${text} (此資料已依據 5T 協議進行嚴格核實，確保符合國際合規標準。)`;
    } else if (tone === 'academic') {
      rewrittenText = `[學術版] ${text} (本研究數據指出，此指標具統計顯著性，符合 ESG 評級框架。)`;
    }

    return NextResponse.json({
      success: true,
      originalText: text,
      rewrittenText,
      toneApplied: tone
    });
  } catch (error) {
    console.error('Error processing grammar:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
