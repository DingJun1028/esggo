// ESG Card Service - M5 Knowledge Module
// Classified under: 靈性智能層 (Cognitive Intelligence Layer) & 平台體驗層 (Platform Experience Layer)
import { omniLogger, LogCategory } from '@infra/logging/OmniLogger';
import { BehaviorSubject } from 'rxjs';

// Card Type Enum
export enum CardType {
  NEWS = 'news',
  INSIGHT = 'insight',
  REGULATION = 'regulation',
  CASE_STUDY = 'case_study',
  TECH_UPDATE = 'tech_update',
  EVENT = 'event',
  PROBLEM = 'problem',
  SOLUTION = 'solution',
}

// ESG Card Interface
export interface EsgCard {
  id: string;
  title: string;
  summary: string;
  content: string; // Markdown or HTML
  type: CardType;
  tags: string[];
  source: string;
  author: string;
  publishDate: number;
  imageUrl?: string;
  impactScore?: number; // 0-100
  relatedCards?: string[]; // IDs
  esgCategory?: 'E' | 'S' | 'G';
  status?: 'active' | 'resolved' | 'pending';
}

// Service Class
export class EsgCardService {
  private static instance: EsgCardService;
  private cards: Map<string, EsgCard> = new Map();
  private cardsSubject = new BehaviorSubject<EsgCard[]>([]);

  private constructor() {
    this.initializeMockData();
  }

  static getInstance(): EsgCardService {
    if (!EsgCardService.instance) {
      EsgCardService.instance = new EsgCardService();
    }
    return EsgCardService.instance;
  }

  // Get All Cards Observable
  getCardsObservable() {
    return this.cardsSubject.asObservable();
  }

  // Get Cards (Sync snapshot)
  getCards(): EsgCard[] {
    return Array.from(this.cards.values()).sort((a, b) => b.publishDate - a.publishDate);
  }

  // Get Card by ID
  getCardById(id: string): EsgCard | undefined {
    return this.cards.get(id);
  }

  // Get Cards by Type
  getCardsByType(type: CardType): EsgCard[] {
    return this.getCards().filter(card => card.type === type);
  }

  // Search Cards
  searchCards(query: string): EsgCard[] {
    const lowerQuery = query.toLowerCase();
    return this.getCards().filter(
      card =>
        card.title.toLowerCase().includes(lowerQuery) ||
        card.summary.toLowerCase().includes(lowerQuery) ||
        card.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  // Private: Mock Data
  private initializeMockData() {
    const mockCards: EsgCard[] = [
      {
        id: 'news_001',
        title: 'Global Carbon Pricing Reaches New High',
        summary: 'Major economies agree to standardized carbon pricing mechanisms at COP30.',
        content: 'Full report content...',
        type: CardType.NEWS,
        tags: ['Carbon', 'Policy', 'Economy'],
        source: 'Global ESG Watch',
        author: 'AI Analyst',
        publishDate: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
        impactScore: 92,
        imageUrl: '/assets/news/carbon_pricing.jpg',
      },
      {
        id: 'tech_001',
        title: 'New AI Model Optimizes Supply Chain Energy',
        summary: 'DeepMind releases AlphaSupply, reducing logistics energy consumption by 15%.',
        content: 'Technical breakdown...',
        type: CardType.TECH_UPDATE,
        tags: ['AI', 'Supply Chain', 'Efficiency'],
        source: 'Tech Tomorrow',
        author: 'System',
        publishDate: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
        impactScore: 88,
      },
      {
        id: 'reg_001',
        title: 'EU Green Claims Directive Text Finalized',
        summary:
          'Anti-greenwashing regulations to enforce stricter verification starting next quarter.',
        content: 'Regulation details...',
        type: CardType.REGULATION,
        tags: ['EU', 'Regulation', 'Compliance'],
        source: 'Legal Nexus',
        author: 'Policy Bot',
        publishDate: Date.now() - 1000 * 60 * 60 * 48, // 2 days ago
        impactScore: 95,
      },
    ];

    mockCards.forEach(card => this.cards.set(card.id, card));
    this.cardsSubject.next(this.getCards());
    omniLogger.info(LogCategory.BUSINESS, 'ESG Card Service initialized with mock data', {
      count: mockCards.length,
    });
  }

  // Problem & Solution Card Logic (OmniCore Support)
  getPendingProblemCards(): EsgCard[] {
    // Mock: return empty or random cards
    return [];
  }

  generateSolutionCard(problemCard: EsgCard): EsgCard {
    const solution: EsgCard = {
      id: `sol_${problemCard.id}`,
      title: `Solution for ${problemCard.title}`,
      summary: `Proposed solution...`,
      content: 'Full solution details...',
      type: CardType.INSIGHT,
      tags: ['Solution', ...problemCard.tags],
      source: 'OmniCore',
      author: 'OmniAgent',
      publishDate: Date.now(),
      impactScore: (problemCard.impactScore || 50) + 10,
      relatedCards: [problemCard.id],
    };
    this.cards.set(solution.id, solution);
    this.cardsSubject.next(this.getCards());
    return solution;
  }

  activateCard(cardId: string): void {
    const card = this.cards.get(cardId);
    if (card) {
      omniLogger.info(LogCategory.BUSINESS, `Card Activated: ${card.title}`, { cardId });
    }
  }

  resolveCard(cardId: string): void {
    const card = this.cards.get(cardId);
    if (card) {
      omniLogger.info(LogCategory.BUSINESS, `Card Resolved: ${card.title}`, { cardId });
    }
  }

  // OmniCore Support Methods
  getActiveCards(): EsgCard[] {
    return this.getCards(); // Return all for now
  }

  generateEventCardsFromMetrics(metrics: any): EsgCard[] {
    // Stub implementation
    return [];
  }
}

export const esgCardService = EsgCardService.getInstance();
