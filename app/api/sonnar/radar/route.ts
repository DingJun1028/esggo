// ============================================================
// ESGSonar Radar API — Signal overview & topic landscape
// app/api/sonnar/radar/route.ts
// ============================================================

import { NextRequest } from 'next/server';
import { getRegisteredSources } from '@/crawlers/crawler-factory';
import { jsonResponse } from '@/lib/api-utils';

/**
 * Signal Radar — aggregates all detected ESG signals across sources
 * Returns: signal strength per source, trending topics, anomaly flags
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const window = searchParams.get('window') || '24h'; // 24h, 7d, 30d
  
  const sources = getRegisteredSources();
  
  // Simulated radar data (replace with real aggregation from DB/Prisma)
  const signals = [
    {
      source: { id: sources[0]?.id || 'tw-fsc', name: sources[0]?.name || '金管會' },
      signalStrength: 78,
      newItems: 5,
      changedItems: 2,
      anomaly: true,
      anomalyType: 'policy_change',
      topics: ['永續揭露', 'TCFD', '碳權'],
      lastUpdate: new Date().toISOString(),
    },
    {
      source: { id: 'us-sec', name: 'SEC' },
      signalStrength: 45,
      newItems: 1,
      changedItems: 0,
      anomaly: false,
      topics: ['Climate Disclosure', 'Scope 3'],
      lastUpdate: new Date(Date.now() - 14400000).toISOString(),
    },
    {
      source: { id: 'eu-csrd', name: 'EU CSRD' },
      signalStrength: 92,
      newItems: 8,
      changedItems: 3,
      anomaly: true,
      anomalyType: 'new_regulation',
      topics: ['ESRS', '價值鏈', '雙重重大性'],
      lastUpdate: new Date(Date.now() - 7200000).toISOString(),
    },
  ];

  const topicsAggregated = [
    { topic: '碳排放/碳費', count: 23, trend: 'up', sources: ['tw-moenv', 'eu-csrd'] },
    { topic: '永續報導準則', count: 18, trend: 'up', sources: ['tw-fsc', 'int-ifrs'] },
    { topic: '人權/供應鏈', count: 12, trend: 'stable', sources: ['eu-csrd', 'us-sec'] },
    { topic: '公司治理', count: 9, trend: 'down', sources: ['tw-twse'] },
    { topic: '水資源/生物多樣性', count: 6, trend: 'up', sources: ['eu-csrd', 'tw-moenv'] },
  ];

  const radar = {
    window,
    generatedAt: new Date().toISOString(),
    summary: {
      totalSignals: signals.length,
      activeAlerts: signals.filter(s => s.anomaly).length,
      totalNewItems: signals.reduce((sum, s) => sum + s.newItems, 0),
      totalChanged: signals.reduce((sum, s) => sum + s.changedItems, 0),
    },
    signals,
    topicsAggregated,
    healthCheck: {
      crawlerScheduler: 'active',
      lastCrawlTime: new Date(Date.now() - 1800000).toISOString(),
      monitoredSources: sources.length,
      enabledSources: sources.length, // Free tier active count
    },
  };

  return jsonResponse(radar);
}
