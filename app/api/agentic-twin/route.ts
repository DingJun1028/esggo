import { NextRequest, NextResponse } from 'next/server';
import { AgenticTwin } from '@/lib/omni-reports/agentic-twin';

export const dynamic = 'force-dynamic';

/**
 * Agentic Twin API (mod-adv-twin-0001)
 * 接收報告數據 → 呼叫 9式果因引擎零幻覺驗算 → 產出 Dr. Thoth 雙棲戰略洞察。
 * 未來接真實 LLM 只需在此路由內替換 analyze 實作，前端不需改動。
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const twin = new AgenticTwin({
      enterpriseName: 'ESGGO',
      industry: 'sustainability',
      currentEntropy: 0.08,
    });
    const insight = await twin.autonomousAnalyze(body);
    return NextResponse.json({ success: true, insight });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
