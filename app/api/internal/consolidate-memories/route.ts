import { NextRequest, NextResponse } from 'next/server';
import { getOmniAgentAI } from '../../../../lib/omniagent.config';

export async function POST(req: NextRequest) {
  try {
    const { type, memories } = await req.json();

    if (!type || !memories || !Array.isArray(memories)) {
      return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 });
    }

    const prompt = `你現在是 OmniAgent 記憶管理模組。請將以下 ${type} 類型的記憶片段彙整成一段精簡、具備語義價值的總結 (Semantic Summary)。\n\n記憶片段：\n${memories.map((m: any, i: number) => `${i+1}. ${m.content}`).join('\n')}`;

    const response = await (await getOmniAgentAI()).generate({
      system: "你是一個專業的資料彙整 AI，擅長提取多個不連續事件中的核心語義。",
      prompt,
    });

    return NextResponse.json({ success: true, summary: response.text() });
  } catch (e) {
    console.error('[ConsolidateMemories] Genkit consolidation failed:', e);
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}
