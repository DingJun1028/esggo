import { NextRequest, NextResponse } from 'next/server';
import {
  scrapeWithFetch,
  scrapeAllTargets,
  scrapeUrl,
  ESG_SCRAPE_TARGETS,
  ScrapeTarget,
} from '@/lib/puppeteer/scraper';

export const maxDuration = 30;
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action') || 'targets';

  if (action === 'targets') {
    return NextResponse.json({
      success: true,
      targets: ESG_SCRAPE_TARGETS.map((t) => ({
        id: t.id,
        name: t.name,
        url: t.url,
        category: t.category,
      })),
    });
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, targetIds, url, customTarget } = body as {
      action: string;
      targetIds?: string[];
      url?: string;
      customTarget?: ScrapeTarget;
    };

    switch (action) {
      case 'scrape_all': {
        const results = await scrapeAllTargets(targetIds);
        const totalArticles = results.reduce(
          (sum, r) => sum + r.articles.length,
          0
        );
        return NextResponse.json({
          success: true,
          results,
          summary: {
            totalSources: results.length,
            successfulSources: results.filter((r) => r.success).length,
            totalArticles,
            scrapedAt: new Date().toISOString(),
          },
        });
      }

      case 'scrape_target': {
        if (!targetIds?.[0] && !customTarget) {
          return NextResponse.json(
            { error: 'targetId or customTarget required' },
            { status: 400 }
          );
        }
        const target =
          customTarget ||
          ESG_SCRAPE_TARGETS.find((t) => t.id === targetIds![0]);
        if (!target) {
          return NextResponse.json(
            { error: 'Target not found' },
            { status: 404 }
          );
        }
        const result = await scrapeWithFetch(target);
        return NextResponse.json({ success: true, result });
      }

      case 'scrape_url': {
        if (!url) {
          return NextResponse.json(
            { error: 'url is required' },
            { status: 400 }
          );
        }
        const result = await scrapeUrl(url);
        return NextResponse.json({ success: result.success, result });
      }

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}