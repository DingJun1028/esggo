/**
 * OmniAgent | ESG Regulation Scraper (inspired by Supabase Puppeteer pattern)
 * Automated intelligence gathering for GRI/CBAM compliance.
 */
export interface ScrapeResult {
    title: string;
    url: string;
    summary: string;
    publishedAt: string;
}
export declare function scrapeEsgRegulations(source: 'EU' | 'TW' | 'GRI'): Promise<ScrapeResult[]>;
//# sourceMappingURL=scraper.d.ts.map