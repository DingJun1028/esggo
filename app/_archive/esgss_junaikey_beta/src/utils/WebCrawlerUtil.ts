import { omniLogger, LogCategory } from '../services/omniLogger';

export interface SearchResult {
    title: string;
    url: string;
    snippet: string;
    source: string;
}

export interface CrawledData {
    results: SearchResult[];
    query: string;
    timestamp: string;
}

/**
 * Web Crawler Utility
 * Responsible for searching and extracting data from external market intelligence sources.
 */
export class WebCrawlerUtil {
    private static readonly SEARCH_LIMIT = 30;

    /**
     * Performs a web search and "crawls" relevant snippets via backend.
     */
    static async crawlCompanyData(query: string, url?: string): Promise<CrawledData> {
        omniLogger.info(LogCategory.AI, `Crawling web for intelligence: ${query || url}`);

        try {
            const response = await fetch('/api/market/crawl', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query, url })
            });

            if (!response.ok) throw new Error('Backend crawl failed');

            const result = await response.json();
            const searchResults: SearchResult[] = result.data.map((r: any) => ({
                title: String(r.title || 'No Title'),
                url: String(r.url || ''),
                snippet: String(r.snippet || r.content?.substring(0, 200) || 'No content available'),
                source: String(r.source || 'unknown')
            }));

            return {
                results: searchResults,
                query: query || url || 'General Search',
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            omniLogger.error(LogCategory.AI, `Backend crawl failed for ${query}`, { error });
            // Fallback to simulation if backend fails (e.g. in dev)
            return {
                results: Array.from({ length: 5 }).map((_, i) => ({
                    title: `${query} (Mock) - Insight ${i + 1}`,
                    url: `https://mock.example.com/${i}`,
                    snippet: `Mock data for ${query}. Backend service may be unavailable.`,
                    source: 'Simulation'
                })),
                query,
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * Extracts full text content from a specific URL via backend.
     */
    static async extractPageContent(url: string): Promise<string> {
        omniLogger.debug(LogCategory.AI, `Extracting full text content from: ${url}`);
        try {
            const response = await fetch('/api/market/crawl', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });

            const result = await response.json();
            if (result.status === 'success' && result.data[0]?.content) {
                return result.data[0].content;
            }
            return "Content extraction failed or returned empty.";
        } catch (error) {
            omniLogger.warn(LogCategory.AI, `Extraction failed for ${url}`, { error });
            return "Content extraction service unavailable.";
        }
    }
}
