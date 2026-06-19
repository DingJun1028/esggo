import {
  omniLogger,
  LogCategory,
} from '../../server/services/omni/infrastructure/logging/OmniLogger.js';

export interface MarketPulse {
  id: string;
  topic: string;
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  impactScore: number; // 0-100
  source: string;
  timestamp: number;
}

export interface CompetitorIntel {
  name: string;
  esgScore: number;
  recentActivity: string;
  threatLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export class MarketIntelligenceService {
  private static instance: MarketIntelligenceService;
  private pulses: MarketPulse[] = [];

  private constructor() {
    omniLogger.info(
      LogCategory.SYSTEM,
      '📡 [MarketIntel] Service Initialized. Scanning frequencies...'
    );
  }

  public static getInstance(): MarketIntelligenceService {
    if (!this.instance) {
      this.instance = new MarketIntelligenceService();
    }
    return this.instance;
  }

  /**
   * Simulates scanning the global market for ESG news/pulses.
   */
  public scanMarket(): MarketPulse[] {
    const topics = [
      '碳稅',
      '綠氫',
      '供應鏈審計',
      '循環經濟',
      '社會治理',
    ];
    const sources = ['彭博 ESG', '路透綠色頻道', '金融時報', '當地環保署'];

    // Simulate 1-3 new pulses
    const count = Math.floor(Math.random() * 3) + 1;
    const newPulses: MarketPulse[] = [];

    for (let i = 0; i < count; i++) {
      const topic = topics[Math.floor(Math.random() * topics.length)] || 'General ESG';
      const sentimentVal = Math.random();
      const sentiment: MarketPulse['sentiment'] =
        sentimentVal > 0.6 ? 'POSITIVE' : sentimentVal > 0.3 ? 'NEUTRAL' : 'NEGATIVE';

      const pulse: MarketPulse = {
        id: `pulse-${Date.now()}-${i}`,
        topic,
        sentiment,
        impactScore: Math.floor(Math.random() * 100),
        source: sources[Math.floor(Math.random() * sources.length)] || 'Global News',
        timestamp: Date.now(),
      };

      newPulses.push(pulse);
      this.pulses.unshift(pulse); // Add to front
    }

    // Keep buffer size limited
    if (this.pulses.length > 50) this.pulses = this.pulses.slice(0, 50);

    omniLogger.info(LogCategory.SYSTEM, `📡 [MarketIntel] Scanned ${newPulses.length} new pulses.`);
    return newPulses;
  }

  public getRecentPulses(limit: number = 10): MarketPulse[] {
    return this.pulses.slice(0, limit);
  }

  public async getLatestIntel(limit: number = 10): Promise<MarketPulse[]> {
    return this.getRecentPulses(limit);
  }

  public getCompetitorIntel(): CompetitorIntel[] {
    // Mock competitor data
    return [
      {
        name: '生態全球企業',
        esgScore: 88,
        recentActivity: '啟動淨零排放車隊',
        threatLevel: 'HIGH',
      },
      {
        name: '綠色未來有限公司',
        esgScore: 75,
        recentActivity: '供應鏈審計待定',
        threatLevel: 'MEDIUM',
      },
      {
        name: '舊世界工業',
        esgScore: 45,
        recentActivity: '碳排放違規罰款',
        threatLevel: 'LOW',
      },
    ];
  }
}

export const marketIntelligenceService = MarketIntelligenceService.getInstance();
