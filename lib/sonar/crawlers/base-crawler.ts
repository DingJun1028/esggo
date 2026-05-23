import { chromium, Browser, Page } from 'playwright';
import * as cheerio from 'cheerio';
import { HashLock } from '../core/hash-lock';

/**
 * ESGSonar | Base Crawler Engine
 * Abstract class for all data source crawlers.
 */

export interface CrawlResult {
  url: string;
  timestamp: string;
  itemsFound: number;
  data: any[];
  hashLock: string;
  error?: string;
}

export abstract class BaseCrawler {
  protected browser: Browser | null = null;

  /**
   * Main crawl implementation
   */
  abstract crawl(config: { url: string }): Promise<CrawlResult>;

  /**
   * Initialize dynamic browser (Playwright)
   */
  protected async initBrowser(): Promise<Browser> {
    if (!this.browser) {
      this.browser = await chromium.launch({ headless: true });
    }
    return this.browser;
  }

  /**
   * Fetch static HTML (Cheerio)
   */
  protected async fetchStatic(url: string): Promise<cheerio.CheerioAPI> {
    const response = await fetch(url);
    const html = await response.text();
    return cheerio.load(html);
  }

  /**
   * Exponential Backoff Retry
   */
  protected async withRetry<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
    let lastError: any;
    for (let i = 0; i < retries; i++) {
      try {
        return await fn();
      } catch (err) {
        lastError = err;
        const delay = Math.pow(2, i) * 1000;
        await new Promise(r => setTimeout(r, delay));
      }
    }
    throw lastError;
  }

  /**
   * Close browser
   */
  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}
