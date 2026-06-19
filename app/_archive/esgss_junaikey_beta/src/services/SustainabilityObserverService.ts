import { omniLogger, LogCategory } from './omniLogger.js';
import { ILocalizedString } from '../types/i18n.types.js';

/**
 * 📰 永續觀察者服務 / Sustainability Observer Service
 * --------------------------------------------------
 * [系列] V6 覺醒架構 (V6 Awakening Architecture)
 * [TC] 自動化抓取全球 ESG 新聞與產業洞察，並產出結構化報導。
 * [EN] Automatically aggregates global ESG news and industry insights,
 *      producing structured reports.
 */

export interface ESGNewsItem {
  id: string;
  title: string;
  source: string;
  url: string;
  timestamp: string;
  summary: string;
  impactScore: number; // -1.0 to 1.0
  confidence?: number;
  crystalHash?: string;
  evidence?: any;
  tags: string[];
}

export interface ObservationReport {
  timestamp: string;
  news: ESGNewsItem[];
  trendAnalysis: string;
}

class SustainabilityObserverService {
  private static instance: SustainabilityObserverService;
  private newsCache: ESGNewsItem[] = [];

  private constructor() { }

  public static getInstance(): SustainabilityObserverService {
    if (!SustainabilityObserverService.instance) {
      SustainabilityObserverService.instance = new SustainabilityObserverService();
    }
    return SustainabilityObserverService.instance;
  }

  /**
   * 📡 抓取最新新聞 / Fetch Latest News
   * --------------------------------------------------
   * [TC] 從後端獲取由爬蟲收集的最新 ESG 新聞。
   * [EN] Fetches the latest ESG news collected by the crawler from the backend.
   */
  public async fetchLatestNews(limit: number = 20): Promise<ESGNewsItem[]> {
    omniLogger.info(LogCategory.SYSTEM, '📡 SustainabilityObserver: Fetching global ESG news from live feeds...');

    try {
      const response = await fetch(`/api/market/news?limit=${limit}`);
      const result = await response.json();

      if (result.status === 'success' && Array.isArray(result.data)) {
        const liveNews: ESGNewsItem[] = result.data.map((art: any) => ({
          id: art.id,
          title: art.title,
          source: art.source_name || art.source || 'Global ESG Feed',
          url: art.url,
          timestamp: art.created_at,
          summary: art.summary || art.content || art.snippet || '',
          impactScore: parseFloat(art.impact_score) || 0.5,
          confidence: art.confidence,
          crystalHash: art.crystal_hash,
          evidence: art.evidence,
          tags: art.tags || [art.source_category || 'ESG', 'Intel']
        }));

        this.newsCache = liveNews;
        return liveNews;
      }
      return [];
    } catch (error: any) {
      omniLogger.error(LogCategory.SYSTEM, `❌ Failed to fetch live ESG news: ${error.message}`);
      return [];
    }
  }


  /**
   * 📝 產出報告 / Generate Report
   * --------------------------------------------------
   * [TC] 根據抓取的新聞生成觀察者報告。
   * [EN] Generates an observer report based on fetched news.
   */
  public async generateReport(): Promise<ObservationReport> {
    if (this.newsCache.length === 0) {
      await this.fetchLatestNews();
    }

    const report: ObservationReport = {
      timestamp: new Date().toISOString(),
      news: this.newsCache,
      trendAnalysis:
        'Current trends show a strong shift towards green energy innovation despite regulatory headwinds.',
    };

    omniLogger.info(LogCategory.SYSTEM, '📝 SustainabilityObserver: Observation report generated.');
    return report;
  }
}

export const sustainabilityObserver = SustainabilityObserverService.getInstance();
