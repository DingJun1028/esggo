export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { getDashboardStats } from '@/lib/db';
import { callGemini } from '@/lib/ai-helper';
import { getBestPractices } from '@/lib/agent/best-practice-registry';
/**
 * Best Practice Recommendation Engine v2.0
 * Uses the Dynamic Benchmark Engine to fetch validated strategies.
 */
export async function POST(request) {
    try {
        const { industry, category } = await request.json();
        const stats = await getDashboardStats();
        // 1. Fetch validated strategies from the local registry (The Ground Truth)
        const verifiedStrategies = getBestPractices(category, industry);
        const strategyContext = verifiedStrategies.map(s => `- ${s.title}: ${s.strategy} (Source: ${s.benchmark_source})`).join('\n');
        const systemPrompt = `你是一位專業的 ESG 永續治理顧問 OmniAgent。
你的任務是結合「5T 誠信協議」與「國際標竿實踐」，為企業提供精準的優化建議。
請務必優先參考我提供的【標竿策略背景】，並根據企業當前數據進行客製化分析。
請以 JSON 格式輸出：{"recommendations": [{"title": "...", "description": "...", "impact": "...", "gri": "...", "t5_gate": "..."}]}`;
        const prompt = `
產業：${industry || '通用製造業'}
類別：${category || '全域'}

【標竿策略背景】：
${strategyContext || '目前尚無特定產業標竿，請基於通用最佳實踐。'}

當前數據：
- 合規率：${stats.complianceRate}%
- GRI 覆蓋率：${stats.griCoverage}%
- 碳排量：${stats.carbonEmission} tCO2e

請提供 3 個具體的優化建議，並說明每個建議如何達成 T1-T5 的特定閘門要求。`;
        const rawResponse = await callGemini(prompt, systemPrompt);
        const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
        const result = JSON.parse(jsonMatch?.[0] ?? '{"recommendations":[]}');
        // 2. Add validation metadata to the response
        const finalResult = {
            ...result,
            source: verifiedStrategies.length > 0 ? 'DYNAMIC_BENCHMARK_ENGINE' : 'AI_GENERAL_ADVISORY',
            verified_at: new Date().toISOString()
        };
        return NextResponse.json(finalResult);
    }
    catch (error) {
        console.error('Best Practice API Error:', error);
        return NextResponse.json({ error: 'Failed to generate recommendations' }, { status: 500 });
    }
}
//# sourceMappingURL=route.js.map