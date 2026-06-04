import { BaseCrawler, CrawlResult } from './base-crawler';
/**
 * ESGSonar | TWSE ESG Report Crawler
 */
export declare class TWSECrawler extends BaseCrawler {
    private pdfParser;
    crawl(config: {
        url: string;
    }): Promise<CrawlResult>;
}
//# sourceMappingURL=twse-crawler.d.ts.map