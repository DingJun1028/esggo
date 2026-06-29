// ============================================================
// FSC Crawler — 金管會法规/公告
// src/crawlers/fsc-crawler.ts
// ============================================================

import { BaseCrawler, CrawlResultItem, CrawlerConfig } from './base-crawler';

export class FSCCrawler extends BaseCrawler {
  constructor() {
    const config: CrawlerConfig = {
      sourceId: 'tw-fsc',
      name: '金融監督管理委員會',
      baseUrl: 'https://www.fsc.gov.tw',
      listUrl: 'https://www.fsc.gov.tw/ch/home.jsp?id=97&parentpath=0,2',
      selectors: {
        list: 'table.list tr, .list_table tr, table tr',
        title: 'a',
        link: 'a',
        date: 'td:nth-child(2), .date',
      },
      maxItems: 15,
      requestDelay: 2000,
    };
    super(config);
  }

  protected extractItems(html: string, maxItems: number, opts?: any): CrawlResultItem[] {
    // Regex-based extraction for FSC site (less structured HTML)
    const results: CrawlResultItem[] = [];
    
    const linkPattern = /<a[^>]+href="([^"]+)"[^>]*>([^<]+)<\/a>/gi;
    
    let match: RegExpExecArray | null;
    const urls = new Set<string>();
    
    while ((match = linkPattern.exec(html)) !== null && results.length < maxItems) {
      const [, href, title] = match;
      const cleanTitle = title.trim().replace(/&[^;]+/g, '');
      
      if (!cleanTitle || cleanTitle.length < 5 || urls.has(href)) continue;
      if (!href.includes('.jsp') && !href.includes('/ch/')) continue;
      
      urls.add(href);
      const fullUrl = href.startsWith('http') ? href : `${this.config.baseUrl}${href}`;
      
      results.push({
        title: cleanTitle.substring(0, 200),
        url: fullUrl,
        summary: '',
        hash: this.computeHash(`${cleanTitle}${fullUrl}`),
      });
    }
    
    return results;
  }
}

// ============================================================
// MOENV Crawler — 環境部公告
// src/crawlers/moenv-crawler.ts
// ============================================================

export class MOENVCrawler extends BaseCrawler {
  constructor() {
    const config: CrawlerConfig = {
      sourceId: 'tw-moenv',
      name: '環境部',
      baseUrl: 'https://www.moenv.gov.tw',
      listUrl: 'https://www.moenv.gov.tw/reformation/news-list',
      selectors: {
        list: '.news-list-item, .list-item',
        title: 'a',
        link: 'a',
        date: '.date',
      },
      maxItems: 15,
      requestDelay: 2000,
    };
    super(config);
  }
}

// ============================================================
// TWSE Crawler — 證交所永續報告書揭露
// src/crawlers/twse-crawler.ts
// ============================================================

export class TWSECrawler extends BaseCrawler {
  constructor() {
    const config: CrawlerConfig = {
      sourceId: 'tw-twse',
      name: '臺灣證券交易所',
      baseUrl: 'https://www.twse.com.tw',
      listUrl: 'https://twse-regulation.twse.com.tw/m/LawNewNoticesPrintView.aspx',
      selectors: {
        list: 'table tr',
        title: 'td a',
        link: 'td a',
        date: 'td:first-child',
      },
      maxItems: 10,
      requestDelay: 3000,
    };
    super(config);
  }
}

// ============================================================
// EU CSRD Crawler
// src/crawlers/eu-csrd-crawler.ts
// ============================================================

export class EUCSRDCrawler extends BaseCrawler {
  constructor() {
    const config: CrawlerConfig = {
      sourceId: 'eu-csrd',
      name: 'European Commission — CSRD',
      baseUrl: 'https://finance.ec.europa.eu',
      listUrl: 'https://finance.ec.europa.eu/capital-markets-union-and-financial-markets/company-reporting-and-auditing/company-reporting/corporate-sustainability-reporting_en',
      selectors: {
        list: '.ecl-list-item, article, .node',
        title: 'a',
        link: 'a',
        date: '.date',
      },
      maxItems: 10,
      requestDelay: 3000,
    };
    super(config);
  }
}

// ============================================================
// US SEC Crawler
// src/crawlers/sec-crawler.ts
// ============================================================

export class SECCrawler extends BaseCrawler {
  constructor() {
    const config: CrawlerConfig = {
      sourceId: 'us-sec',
      name: 'U.S. SEC',
      baseUrl: 'https://www.sec.gov',
      listUrl: 'https://www.sec.gov/news/whatsnew/wn-today',
      selectors: {
        list: 'table tr, .list-item',
        title: 'a',
        link: 'a',
        date: 'td:first-child',
      },
      maxItems: 10,
      requestDelay: 3000,
    };
    super(config);
  }
}
