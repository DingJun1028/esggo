// @ts-nocheck
/**
 * Firecrawl 爬取整合服務
 * 用於商情中心每日 ESG 情報爬取
 *
 * 功能：
 * 1. 從 ESG 前30大情報點爬取最新資訊
 * 2. 清洗、排列、重組爬取內容
 * 3. 萃取記憶碎片
 * 4. 與 OmniAgentBus 深度整合
 */

import { extractShardFromWebCrawl, type MemoryShard } from '../agent/memory-shards';

// ─── ESG 情報來源設定 ──────────────────────────────────────────────────────
const ESG_SOURCES = [
  { name: 'GRI Standards', url: 'https://www.globalreporting.org/standards/', type: 'standard' },
  { name: 'SASB Standards', url: 'https://www.sasb.org/standards/', type: 'standard' },
  { name: 'TCFD Recommendations', url: 'https://www.fsb-tcfd.org/recommendations/', type: 'framework' },
  { name: 'CDP Climate Change', url: 'https://www.cdp.net/en/climate', type: 'disclosure' },
  { name: 'UN Global Compact', url: 'https://www.unglobalcompact.org/', type: 'initiative' },
  { name: 'ISSB Standards', url: 'https://www.ifrs.org/issued-standards/issb-standards/', type: 'standard' },
  { name: 'EU Taxonomy', url: 'https://ec.europa.eu/sustainable-finance-taxonomy/', type: 'regulation' },
  { name: 'SEC Climate Disclosure', url: 'https://www.sec.gov/spotlight/climate-disclosure', type: 'regulation' },
  { name: 'MSCI ESG Research', url: 'https://www.msci.com/esg-investing', type: 'research' },
  { name: 'Sustainalytics', url: 'https://www.sustainalytics.com/esg-ratings', type: 'rating' },
  { name: 'Bloomberg ESG', url: 'https://www.bloomberg.com/professional/solution/esg/', type: 'data' },
  { name: 'Refinitiv ESG', url: 'https://www.refinitiv.com/en/financial-data/company-data/esg-data', type: 'data' },
  { name: 'Carbon Disclosure Project', url: 'https://www.cdp.net/', type: 'disclosure' },
  { name: 'Climate Action 100+', url: 'https://www.climateaction100.org/', type: 'initiative' },
  { name: 'Science Based Targets', url: 'https://sciencebasedtargets.org/', type: 'initiative' },
  { name: 'Net Zero Tracker', url: 'https://zerotracker.net/', type: 'tracker' },
  { name: 'ESG Today', url: 'https://esgtoday.com/', type: 'news' },
  { name: 'GreenBiz', url: 'https://www.greenbiz.com/', type: 'news' },
  { name: 'Sustainable Brands', url: 'https://sustainablebrands.com/', type: 'news' },
  { name: 'Climate Home News', url: 'https://www.climatechangenews.com/', type: 'news' },
  { name: 'Reuters ESG', url: 'https://www.reuters.com/sustainability/', type: 'news' },
  { name: 'FT Moral Money', url: 'https://www.ft.com/moral-money', type: 'news' },
  { name: 'WSJ ESG', url: 'https://www.wsj.com/news/types/esg', type: 'news' },
  { name: 'PRI ESG', url: 'https://www.unpri.org/', type: 'initiative' },
  { name: 'World Economic Forum ESG', url: 'https://www.weforum.org/agenda/archive/esg/', type: 'research' },
  { name: 'OECD ESG', url: 'https://www.oecd.org/finance/esg-investing/', type: 'research' },
  { name: 'EPA GHG Reporting', url: 'https://www.epa.gov/ghgreporting', type: 'regulation' },
  { name: 'Taiwan EPA ESG', url: 'https://www.epa.gov.tw/Page/4B98A075A80D6A9C', type: 'regulation' },
  { name: 'Taiwan FSC ESG', url: 'https://www.fsc.gov.tw/ch/home.jsp?id=130&parentpath=0,2', type: 'regulation' },
  { name: 'CSRone', url: 'https://csrone.com/', type: 'taiwan' },
];

// ─── Firecrawl Client ──────────────────────────────────────────────────────
class FirecrawlClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.FIRECRAWL_API_KEY || '';
    this.baseUrl = 'https://api.firecrawl.dev/v2';
  }

  async scrape(url: string, options?: {
    formats?: string[];
    onlyMainContent?: boolean;
    waitFor?: number;
  }): Promise<{ success: boolean; data?: any; error?: string }> {
    if (!this.apiKey) {
      console.warn('[Firecrawl] API key not configured');
      return { success: false, error: 'API key not configured' };
    }

    try {
      const response = await fetch(`${this.baseUrl}/scrape`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          formats: options?.formats || ['markdown'],
          onlyMainContent: options?.onlyMainContent ?? true,
          waitFor: options?.waitFor || 1000,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        return { success: false, error: `HTTP ${response.status}: ${errText}` };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async crawl(url: string, options?: {
    limit?: number;
    maxDepth?: number;
    includePaths?: string[];
    excludePaths?: string[];
  }): Promise<{ success: boolean; jobId?: string; error?: string }> {
    if (!this.apiKey) {
      return { success: false, error: 'API key not configured' };
    }

    try {
      const response = await fetch(`${this.baseUrl}/crawl`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          limit: options?.limit || 10,
          maxDepth: options?.maxDepth || 2,
          includePaths: options?.includePaths,
          excludePaths: options?.excludePaths,
          scrapeOptions: { formats: ['markdown'], onlyMainContent: true },
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        return { success: false, error: `HTTP ${response.status}: ${errText}` };
      }

      const data = await response.json();
      return { success: true, jobId: data.id };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async search(query: string, options?: {
    limit?: number;
    scrapeFormats?: string[];
  }): Promise<{ success: boolean; data?: any; error?: string }> {
    if (!this.apiKey) {
      return { success: false, error: 'API key not configured' };
    }

    try {
      const response = await fetch(`${this.baseUrl}/search`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          limit: options?.limit || 10,
          scrapeOptions: { formats: options?.scrapeFormats || ['markdown'], onlyMainContent: true },
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        return { success: false, error: `HTTP ${response.status}: ${errText}` };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}

// ─── ESG 情報爬取服務 ──────────────────────────────────────────────────────
export class ESGIntelligenceCrawler {
  private client: FirecrawlClient;

  constructor(apiKey?: string) {
    this.client = new FirecrawlClient(apiKey);
  }

  /**
   * 從 ESG 資訊來源爬取最新情報
   */
  async crawlESGSources(sources?: typeof ESG_SOURCES): Promise<{
    results: Array<{ source: string; url: string; success: boolean; content?: string; error?: string }>;
    totalFetched: number;
    totalFailed: number;
  }> {
    const targetSources = sources || ESG_SOURCES;
    const results: Array<{ source: string; url: string; success: boolean; content?: string; error?: string }> = [];
    let totalFetched = 0;
    let totalFailed = 0;

    for (const source of targetSources) {
      console.log(`[ESG Crawler] 爬取: ${source.name} (${source.url})`);
      const result = await this.client.scrape(source.url, {
        formats: ['markdown'],
        onlyMainContent: true,
        waitFor: 2000,
      });

      if (result.success && result.data) {
        const content = result.data.markdown || result.data.data?.markdown || '';
        results.push({ source: source.name, url: source.url, success: true, content });
        totalFetched++;
      } else {
        results.push({ source: source.name, url: source.url, success: false, error: result.error });
        totalFailed++;
      }

      // Rate limiting: 1 second between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return { results, totalFetched, totalFailed };
  }

  /**
   * 搜尋 ESG 相關資訊
   */
  async searchESGTopics(topics: string[]): Promise<{
    results: Array<{ topic: string; success: boolean; data?: any; error?: string }>;
  }> {
    const results: Array<{ topic: string; success: boolean; data?: any; error?: string }> = [];

    for (const topic of topics) {
      console.log(`[ESG Crawler] 搜尋: ${topic}`);
      const result = await this.client.search(topic, { limit: 5, scrapeFormats: ['markdown'] });

      if (result.success) {
        results.push({ topic, success: true, data: result.data });
      } else {
        results.push({ topic, success: false, error: result.error });
      }

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return { results };
  }

  /**
   * 爬取並萃取記憶碎片
   */
  async crawlAndExtractShards(sources?: typeof ESG_SOURCES): Promise<{
    shards: MemoryShard[];
    crawlResults: Array<{ source: string; success: boolean }>;
  }> {
    const shards: MemoryShard[] = [];
    const crawlResults: Array<{ source: string; success: boolean }> = [];

    const targetSources = sources || ESG_SOURCES.slice(0, 5); // Default: first 5 sources

    for (const source of targetSources) {
      const result = await this.client.scrape(source.url, {
        formats: ['markdown'],
        onlyMainContent: true,
        waitFor: 2000,
      });

      if (result.success && result.data) {
        const content = result.data.markdown || result.data.data?.markdown || '';
        const summary = content.substring(0, 500);

        try {
          const shard = await extractShardFromWebCrawl(source.url, content, summary);
          shard.tags = [...new Set([...shard.tags, 'esg-intelligence', source.type, 'daily-crawl'])];
          shards.push(shard);
        } catch (e: any) {
          console.warn(`[ESG Crawler] 萃取碎片失敗: ${source.name}`, e.message);
        }

        crawlResults.push({ source: source.name, success: true });
      } else {
        crawlResults.push({ source: source.name, success: false });
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return { shards, crawlResults };
  }
}

// ─── 單例 ──────────────────────────────────────────────────────────────────
let esgCrawlerInstance: ESGIntelligenceCrawler | null = null;

export function getESGCrawler(apiKey?: string): ESGIntelligenceCrawler {
  if (!esgCrawlerInstance) {
    esgCrawlerInstance = new ESGIntelligenceCrawler(apiKey);
  }
  return esgCrawlerInstance;
}

export { ESG_SOURCES, FirecrawlClient };
export default ESGIntelligenceCrawler;
