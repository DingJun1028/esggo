import { NextResponse } from 'next/server';
import { ESGNewsCrawler } from '@/../lib/intelligence/crawlers/esg-news-crawler';
import { IntelligenceEngine } from '@/../lib/intelligence/intelligence-engine';

export async function POST() {
  try {
    const crawler = new ESGNewsCrawler();
    const news = await crawler.fetchDailyNews();
    
    if (news.length === 0) {
      return NextResponse.json({ success: false, message: '今日無新情報或抓取失敗' });
    }

    const report = await IntelligenceEngine.synthesize(news);

    return NextResponse.json({
      success: true,
      report
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
