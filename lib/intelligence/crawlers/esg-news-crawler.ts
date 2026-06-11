/**
 * ESG GO | Intelligence News Crawler
 * Basic crawler using fetch/cheerio to ingest ESG firsthand info.
 */

import * as cheerio from 'cheerio';

export interface ScrapedNews {
  title: string;
  url: string;
  summary: string;
  source: string;
  publishedAt: string;
}

export class ESGNewsCrawler {
  private sources = [
    { name: 'GRI News', url: 'https://www.globalreporting.org/news/' },
    { name: 'ESG Today', url: 'https://www.esgtoday.com/' },
    // Add more sources as needed
  ];

  public async fetchDailyNews(): Promise<ScrapedNews[]> {
    console.log('[Crawler] Starting daily ESG news ingestion...');
    const results: ScrapedNews[] = [];

    for (const source of this.sources) {
      try {
        const res = await fetch(source.url, { signal: AbortSignal.timeout(10000) });
        if (!res.ok) continue;
        
        const html = await res.text();
        const $ = cheerio.load(html);
        
        // Generic parsing logic (to be customized per source in production)
        $('article, .post, .news-item').slice(0, 5).each((_, el) => {
          const title = $(el).find('h2, h3, .title').first().text().trim();
          const link = $(el).find('a').first().attr('href') || source.url;
          const summary = $(el).find('p, .summary').first().text().trim().substring(0, 200);
          
          if (title) {
            results.push({
              title,
              url: link.startsWith('http') ? link : new URL(link, source.url).href,
              summary,
              source: source.name,
              publishedAt: new Date().toISOString()
            });
          }
        });
      } catch (err) {
        console.error(`[Crawler] Failed to fetch ${source.name}:`, err);
      }
    }

    return results;
  }
}
