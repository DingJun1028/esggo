import { NextRequest, NextResponse } from 'next/server';
import { GeminiRotator } from '@/lib/gemini-key-rotator';

const keys = [
  process.env.GEMINI_API_KEY_1,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3,
].filter(Boolean) as string[];

const geminiRotator = new GeminiRotator(keys);

export async function POST(req: NextRequest) {
  try {
    const { matrix } = await req.json();

    const lowCompleteness = matrix.filter((n: any) => n.completeness < 70);
    const sealedCount = matrix.filter((n: any) => n.isSealed).length;
    
    const prompt = `你是一位 ESG 合規專家 (GRI Gap Guardian)。
請針對以下企業的 GRI 合規矩険數據進行「缺口分析 (Gap Analysis)」：

1. 整體數據：總指標數 ${matrix.length}，已完成封印 (T5 Sealed) ${sealedCount} 項。
2. 低完成度指標：${lowCompleteness.map((n: any) => `${n.code} (${n.completeness}%)`).join(', ')}

請給出 3 點具體的「合規優化建議」與一個「優先執行順序」。
回應應符合 ESG GO 的品牌口吻（專業、嚴謹、具備 5T 治理思維）。
請以繁體中文回應，約 200 字以內。`;

    const result = await geminiRotator.generateContent('gemini-1.5-flash', prompt);
    const advice = result.response.text();

    return NextResponse.json({ success: true, advice });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}