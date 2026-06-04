import { chromium } from 'playwright';
import * as cheerio from 'cheerio';
export class BaseCrawler {
    constructor() {
        this.browser = null;
    }
    /**
     * Initialize dynamic browser (Playwright)
     */
    async initBrowser() {
        if (!this.browser) {
            this.browser = await chromium.launch({ headless: true });
        }
        return this.browser;
    }
    /**
     * Fetch static HTML (Cheerio)
     */
    async fetchStatic(url) {
        const response = await fetch(url);
        const html = await response.text();
        return cheerio.load(html);
    }
    /**
     * Exponential Backoff Retry
     */
    async withRetry(fn, retries = 3) {
        let lastError;
        for (let i = 0; i < retries; i++) {
            try {
                return await fn();
            }
            catch (err) {
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
    async close() {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }
}
//# sourceMappingURL=base-crawler.js.map