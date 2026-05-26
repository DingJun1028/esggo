import { NextRequest, NextResponse } from 'next/server';
import { getDashboardStats } from '@/lib/db';
import { callGemini } from '@/lib/ai-helper';

/**
 * Best Practice Recommendation Engine
 * Analyzes current company stats and industry to suggest benchmarks.
 */
export async function POST(request: NextRequest) {
  try {
    const { industry } = await request.json();
    const stats = await getDashboardStats();

    const systemPrompt = `你是一位專業的 ESG 永續治理顧問 OmniAgent。
你的任務是根據企業的當前數據與產業背景，從「最佳實踐庫」中推薦最合適的優化策略。
請以 JSON 格式輸出：{"recommendations": [{"title": "...", "description": "...", "impact": "...", "gri": "..."}]}`;

    const prompt = `
產業：${industry || '通用製造業'}
當前數據：
- 合規率：${stats.complianceRate}%
- GRI 覆蓋率：${stats.griCoverage}%
- 碳排量：${stats.carbonEmission} tCO2e

請提供 3 個具體的最佳實踐建議，並參考國際標竿（如台積電、Google 或國泰金控）。`;

    const rawResponse = await callGemini(prompt, systemPrompt);
    const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
    const result = JSON.parse(jsonMatch?.[0] ?? '{"recommendations":[]}');

    return NextResponse.json(result);
  } catch (error) {
    console.error('Best Practice API Error:', error);
    return NextResponse.json({ error: 'Failed to generate recommendations' }, { status: 500 });
  }
}
