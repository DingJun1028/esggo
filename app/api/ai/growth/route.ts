import { NextResponse } from 'next/server';
import { getAuditLogs, getDashboardStats, logAudit } from '../../../../lib/db';
import { callGemini } from '../../../../lib/ai-helper';

/**
 * [Infinite Evolution] Self-Growth Hub API
 * This endpoint performs a meta-analysis of the system's own audit logs 
 * and metrics to suggest governance optimizations.
 */
export async function GET() {
  try {
    const [logs, stats] = await Promise.all([
      getAuditLogs(50),
      getDashboardStats()
    ]);

    const systemPrompt = "你是一位專業的 ESG 治理 AI 調度員 OmniAgent。你的任務是分析系統的審計日誌與當前數據，並提出下一階段的「自我演化」建議。請以 JSON 格式輸出：{\"suggestion\": \"...\", \"impactScore\": 0, \"focusAreas\": []}";

    const prompt = `
當前系統狀態：
- 合規率：${stats.complianceRate}%
- GRI 覆蓋率：${stats.griCoverage}%
- 最近 5 筆審計日誌概要：
${logs.slice(0, 5).map((l: any) => `- ${l.action}: ${l.details}`).join('\n')}

請分析這些數據，並提供一個具體的治理優化建議。`;

    const rawResponse = await callGemini(prompt, systemPrompt);
    const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
    const result = JSON.parse(jsonMatch?.[0] ?? '{"suggestion":"治理分析暫停","impactScore":0,"focusAreas":[]}');

    // Self-evolution record: AI analyzes itself
    await logAudit({
      action: 'SELF_EVOLUTION',
      resource: 'Governance Meta-Analysis',
      user_name: 'Omni-Orchestrator',
      t5_tag: 'T5',
      details: `Analysis complete. Impact Score: ${result.impactScore}%`
    });

    return NextResponse.json({
      status: 'evolution_active',
      analysis: {
        lastScan: new Date().toISOString(),
        growthSuggestion: result.suggestion,
        impactScore: result.impactScore,
        focusAreas: result.focusAreas || ['Integrity']
      },
      auditCount: logs.length
    });
  } catch (error) {
    console.error('Growth API Error:', error);
    return NextResponse.json({ error: 'Evolution pause: analysis failed' }, { status: 500 });
  }
}
