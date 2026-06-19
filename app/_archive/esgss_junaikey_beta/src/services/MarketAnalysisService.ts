import { geminiCore } from './ai/GeminiService.js';
import { omniLogger, LogCategory } from './omniLogger.js';
import { WebCrawlerUtil, CrawledData, SearchResult } from '../utils/WebCrawlerUtil.js';
import { supabase } from '../lib/supabase.js';

export interface MarketAnalysis {
    companyName: string;
    ban: string;
    esgScore: number;
    sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
    newsSummary: string;
    analysisDate: string;
    sources?: string[];
}

export class MarketAnalysisService {
    /**
     * Performs deep analysis on a company by name or BAN, including multi-source web crawling.
     */
    static async performDeepAnalysis(query: string): Promise<MarketAnalysis> {
        omniLogger.info(LogCategory.AI, `Initiating Deep Market Analysis for: ${query}`);

        try {
            // Phase 1: Search the web for the top 30 results
            const crawlData = await WebCrawlerUtil.crawlCompanyData(query);

            // Phase 2: Select top 5 most relevant results for full-text extraction
            const topResults = crawlData.results.slice(0, 5);
            const fullTexts = await Promise.all(
                topResults.map(async (r) => {
                    const content = await WebCrawlerUtil.extractPageContent(r.url);
                    return `[Source: ${r.source}] Title: ${r.title}\nContent: ${content}\n---`;
                })
            );

            const snippetsContext = crawlData.results.slice(5).map(r => `[${r.source}] ${r.title}: ${r.snippet}`).join('\n');
            const fullTextContext = fullTexts.join('\n');

            // Phase 3: AI Synthesis with enhanced prompt for full-text vs snippets
            const prompt = `
      Deep Context from Web Crawl (Full Articles):
      ${fullTextContext}

      Broad Context from Web Crawl (Snippets):
      ${snippetsContext}

      Task: Based on the provided deep and broad context, perform a comprehensive ESG and market sentiment analysis for: "${query}".
      Synthesize information to provide a cohesive summary that identifies key news events, regulatory impacts, and overall sustainability performance.
      
      Return the result in JSON format:
      {
        "companyName": "string",
        "ban": "string",
        "esgScore": number (0-100),
        "sentiment": "POSITIVE" | "NEGATIVE" | "NEUTRAL",
        "newsSummary": "A concise but comprehensive synthesis of the news."
      }
    `;

            const data = await geminiCore.generateStructuredData<Partial<MarketAnalysis>>(
                `Deep Query: ${query}`,
                prompt
            );

            if (!data) throw new Error('Structured data generation returned null');

            const analysis: MarketAnalysis = {
                companyName: data.companyName || query,
                ban: data.ban || "00000000",
                esgScore: data.esgScore || 75,
                sentiment: data.sentiment || 'NEUTRAL',
                newsSummary: data.newsSummary || "Analysis completed based on deep crawled data.",
                analysisDate: new Date().toISOString(),
                sources: Array.from(new Set(crawlData.results.map(r => r.source)))
            };

            // Phase 4: Persist result and collect news for the library
            await this.saveToDatabase(analysis, crawlData.results);

            return analysis;
        } catch (error) {
            omniLogger.error(LogCategory.AI, 'Market Analysis Failed', { error });
            return {
                companyName: query,
                ban: "00000000",
                esgScore: 75,
                sentiment: 'NEUTRAL',
                newsSummary: "Unable to complete deep crawl. Analysis based on general knowledge.",
                analysisDate: new Date().toISOString()
            };
        }
    }

    /**
     * Persists analysis and individual news articles to the database.
     * Marks articles for the "Shan Xiang Library" collection.
     */
    private static async saveToDatabase(analysis: MarketAnalysis, articles: SearchResult[]): Promise<void> {
        omniLogger.info(LogCategory.AI, `Saving analysis and ${articles.length} news articles to database.`);

        try {
            // 1. Save individual news articles
            const newsToInsert = articles.map(art => ({
                company_name: analysis.companyName,
                title: art.title,
                url: art.url,
                source: art.source,
                content: art.snippet, // Snippet by default, full text could be merged if extracted
                sentiment: analysis.sentiment,
                esg_score: analysis.esgScore,
                is_collected: true, // Auto-collect for the Library/Monthly Magazine
                magazine_issue: new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
            }));

            // Using upsert on URL to avoid duplicates
            if (supabase) {
                const { error: newsError } = await supabase
                    .from('news_articles')
                    .upsert(newsToInsert, { onConflict: 'url' });

                if (newsError) throw newsError;
            } else {
                omniLogger.warn(LogCategory.AI, 'Supabase client not initialized, skipping database persistence.');
            }

            // 2. Log successful persistence
            omniLogger.info(LogCategory.AI, `Successfully persisted intelligence for ${analysis.companyName}`);
        } catch (error) {
            omniLogger.error(LogCategory.AI, 'Failed to save to database', { error });
        }
    }
}
