// ============================================================
// ESGSonar Crawl API — Trigger crawls, get status
// app/api/sonnar/crawl/route.ts
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { crawlerScheduler } from '@/services/scheduler/crawler-scheduler';

// GET /api/sonnar/crawl — Get scheduler status & job list
export async function GET() {
  const status = crawlerScheduler.getStatus();
  const jobs = crawlerScheduler.getJobs();
  
  return NextResponse.json({
    success: true,
    data: {
      status,
      jobs: jobs.map(j => ({
        id: j.id,
        sourceId: j.sourceId,
        sourceName: j.sourceName,
        cronExpression: j.cronExpression,
        intervalMs: j.intervalMs,
        lastRun: j.lastRun,
        totalRuns: j.totalRuns,
        successfulRuns: j.successfulRuns,
        failedRuns: j.failedRuns,
        enabled: j.enabled,
        lastItemsFound: j.lastResult?.itemsFound,
      })),
    },
  });
}

// POST /api/sonnar/crawl — Trigger crawl (manual)
// Body: { sourceId?: string, all?: boolean }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { sourceId, all } = body;

    if (all) {
      // Crawl all enabled sources
      const results = await crawlerScheduler.crawlAll();
      return NextResponse.json({
        success: true,
        data: {
          message: `Crawl triggered for ${results.length} sources`,
          results,
        },
      });
    }

    if (sourceId) {
      const result = await crawlerScheduler.crawlNow(sourceId);
      if (!result) {
        return NextResponse.json(
          { success: false, error: `Unknown source: ${sourceId}` },
          { status: 404 }
        );
      }
      
      // Get bridge results (last bridge for this source)
      const bridgeHistory = crawlerScheduler.getBridgeResults(sourceId);
      const bridge = bridgeHistory[0] || {
        eventsGenerated: 0,
        matches: [],
        itemsProcessed: 0,
        errors: [],
      };
      
      return NextResponse.json({
        success: true,
        data: {
          message: `Crawl completed for ${sourceId}`,
          result: {
            sourceId: result.sourceId,
            url: result.url,
            itemsFound: result.itemsFound,
            duration: result.duration,
            timestamp: result.timestamp,
          },
          bridge: {
            eventsGenerated: bridge.eventsGenerated,
            subscriptionMatches: bridge.matches.length,
            topMatches: bridge.matches.slice(0, 5).map((m: any) => ({
              subscriber: m.subscriberName,
              target: m.subscriptionTarget,
              score: m.relevanceScore,
            })),
          },
        },
      });
    }

    return NextResponse.json(
      { success: false, error: 'Provide sourceId or all: true' },
      { status: 400 }
    );
  } catch (err) {
    console.error('[Sonar Crawl API] Error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
