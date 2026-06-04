import { Browser } from 'playwright';
import * as cheerio from 'cheerio';
/**
 * ESGSonar | Base Crawler Engine
 * Abstract class for all data source crawlers.
 */
export interface CrawlResult {
    url: string;
    timestamp: string;
    itemsFound: number;
    data: unknown[];
    hashLock: string;
    error?: string;
}
export declare abstract class BaseCrawler {
    protected browser: Browser | null;
    /**
     * Main crawl implementation
     */
    abstract crawl(config: {
        url: string;
    }): Promise<CrawlResult>;
    /**
     * Initialize dynamic browser (Playwright)
     */
    protected initBrowser(): Promise<Browser>;
    /**
     * Fetch static HTML (Cheerio)
     */
    protected fetchStatic(url: string): Promise<ReturnType<typeof cheerio.load>>;
    /**
     * Exponential Backoff Retry
     */
    protected withRetry<T>(fn: () => Promise<T>, retries?: number): Promise<T>;
    /**
     * Close browser
     */
    close(): Promise<void>;
}
//# sourceMappingURL=base-crawler.d.ts.map