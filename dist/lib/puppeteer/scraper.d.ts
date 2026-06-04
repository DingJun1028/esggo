export interface ScrapedArticle {
    title: string;
    summary: string;
    url: string;
    source: string;
    publishedAt: string;
    category: string;
    tags: string[];
    impactLevel: 'high' | 'medium' | 'low';
}
export interface ScrapeResult {
    success: boolean;
    articles: ScrapedArticle[];
    scrapedAt: string;
    source: string;
    error?: string;
    totalFound: number;
    executionMs: number;
}
export interface ScrapeTarget {
    id: string;
    name: string;
    url: string;
    category: string;
    selectors: {
        articleContainer: string;
        title: string;
        summary?: string;
        link?: string;
        date?: string;
    };
}
export declare const ESG_SCRAPE_TARGETS: ScrapeTarget[];
export declare function scrapeWithFetch(target: ScrapeTarget): Promise<ScrapeResult>;
export declare function scrapeAllTargets(targetIds?: string[]): Promise<ScrapeResult[]>;
export declare function scrapeUrl(url: string): Promise<{
    title: string;
    content: string;
    links: string[];
    success: boolean;
    error?: string;
}>;
//# sourceMappingURL=scraper.d.ts.map