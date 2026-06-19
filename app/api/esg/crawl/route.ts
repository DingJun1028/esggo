import { NextRequest, NextResponse } from 'next/server';
import { getESGCrawler, ESG_SOURCES } from '@/lib/services/firecrawl-esg-crawler';

/**
 * POST /api/esg/crawl
 * Trigger ESG intelligence crawl
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sources, topics } = body;

    const crawler = getESGCrawler();

    // Crawl specific sources
    if (sources && Array.isArray(sources)) {
      const targetSources = ESG_SOURCES.filter(s => sources.includes(s.name));
      const { shards, crawlResults } = await crawler.crawlAndExtractShards(targetSources);
      return NextResponse.json({
        success: true,
        shards: shards.length,
        results: crawlResults,
      });
    }

    // Search specific topics
    if (topics && Array.isArray(topics)) {
      const { results } = await crawler.searchESGTopics(topics);
      return NextResponse.json({ success: true, results });
    }

    // Default: crawl all sources
    const { shards, crawlResults } = await crawler.crawlAndExtractShards();
    return NextResponse.json({
      success: true,
      shards: shards.length,
      results: crawlResults,
    });
  } catch (error: any) {
    console.error('[ESG Crawler API] Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * GET /api/esg/crawl
 * Get ESG sources list
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    sources: ESG_SOURCES,
    total: ESG_SOURCES.length,
  });
}
