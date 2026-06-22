import { NextRequest, NextResponse } from 'next/server';
import { getShardStats, getUltimateStats, retrieveMemoryShards } from '@/lib/agent/memory-shards';
import { checkAllAPIs } from '@/lib/agent/memory-api-registry';
import { omniAgentBus } from '@/lib/agents/oa-agent-bus';

/**
 * GET /api/system/memory-health
 * 記憶碎片系統健康檢查
 */
export async function GET() {
  try {
    const [shardStats, ultimateStats, busHealth, recentShards] = await Promise.all([
      getShardStats(),
      getUltimateStats(),
      Promise.resolve(omniAgentBus.getHealth()),
      retrieveMemoryShards({ limit: 5, orderBy: 'timestamp', orderDirection: 'desc' }),
    ]);

    // 計算健康分數
    const totalShards = shardStats.reduce((sum, s) => sum + s.totalShards, 0);
    const totalUltimates = ultimateStats.reduce((sum, s) => sum + s.totalUltimates, 0);
    const avgEntropy =
      shardStats.reduce((sum, s) => sum + (s.avgEntropy || 0), 0) / (shardStats.length || 1);

    let healthScore = 100;
    if (totalShards === 0) healthScore -= 30;
    if (avgEntropy > 70) healthScore -= 20;
    if (busHealth.errorRate > 0.5) healthScore -= 20;
    if (totalUltimates === 0 && totalShards > 5) healthScore -= 10;

    const status = healthScore >= 80 ? 'healthy' : healthScore >= 50 ? 'degraded' : 'critical';

    return NextResponse.json({
      success: true,
      status,
      healthScore,
      summary: {
        totalShards,
        totalUltimates,
        avgEntropy: avgEntropy.toFixed(1),
        busStatus: busHealth.status,
        busUptime: Math.round(busHealth.uptime / 1000),
      },
      shardStats,
      ultimateStats,
      recentShards: recentShards.shards,
      recommendations: generateRecommendations(totalShards, totalUltimates, avgEntropy, busHealth),
    });
  } catch (error: any) {
    console.error('[Memory Health] Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

function generateRecommendations(
  totalShards: number,
  totalUltimates: number,
  avgEntropy: number,
  busHealth: any
): string[] {
  const recommendations: string[] = [];

  if (totalShards === 0) {
    recommendations.push('開始對話或執行任務以自動萃取記憶碎片');
  } else if (totalShards < 5) {
    recommendations.push('持續使用系統以累積更多記憶碎片');
  }

  if (totalShards >= 2 && totalUltimates === 0) {
    recommendations.push('有足夠碎片可合成技能奧義，執行 oa memory synthesize');
  }

  if (avgEntropy > 70) {
    recommendations.push('系統熵值偏高，建議清理低重要性碎片');
  }

  if (busHealth.errorRate > 0.3) {
    recommendations.push('Bus 錯誤率偏高，建議檢查系統日誌');
  }

  if (totalShards > 100 && totalUltimates < 5) {
    recommendations.push('碎片數量充足，建議定期合成奧義以提升系統智慧');
  }

  return recommendations;
}
