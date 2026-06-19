import {
  omniLogger,
  LogCategory,
} from '../../server/services/omni/infrastructure/logging/OmniLogger.js';

export interface ResonanceMetrics {
  intentClarity: number; // 0-100: How clear is the user's goal?
  systemAlignment: number; // 0-100: How well does the system support this goal?
  executionVelocity: number; // 0-100: Speed of progress towards the goal
  overallResonance: number; // 0-100: Weighted average
  timestamp: number;
}

export class IntentAnalysisService {
  private static instance: IntentAnalysisService;
  private currentIntent: string = 'General Exploration';
  private intentHistory: string[] = [];

  // Mock concept weights for demo
  private conceptWeights: Record<string, number> = {
    ESG: 1.0,
    Carbon: 0.9,
    Compliance: 0.8,
    Growth: 0.7,
    Strategy: 0.95,
  };

  private constructor() {
    omniLogger.info(LogCategory.SYSTEM, 'Intent Analysis Service Initialized.');
  }

  public static getInstance(): IntentAnalysisService {
    if (!this.instance) {
      this.instance = new IntentAnalysisService();
    }
    return this.instance;
  }

  /**
   * Analyze user action to infer intent and calculate resonance.
   */
  public analyzeAction(actionType: string, context: any): ResonanceMetrics {
    // Simple heuristic for demo: Map action types to potential intents
    let detectedIntent = this.currentIntent;

    if (actionType.includes('REPORT') || context?.view === 'report_gen') {
      detectedIntent = 'Compliance Assurance';
    } else if (actionType.includes('DISCOVERY') || context?.view === 'strategy_hub') {
      detectedIntent = 'Strategic Growth';
    } else if (actionType.includes('OPTIMIZE') || context?.view === 'carbon_wallet') {
      detectedIntent = 'Carbon Efficiency';
    }

    if (detectedIntent !== this.currentIntent) {
      this.intentHistory.push(this.currentIntent);
      this.currentIntent = detectedIntent;
      omniLogger.debug(LogCategory.AGENT, `[Intent] Shift detected: ${detectedIntent}`);
    }

    return this.calculateResonance(detectedIntent);
  }

  private calculateResonance(intent: string): ResonanceMetrics {
    // Calculate alignment based on simple keyword matching with "Core Concepts"
    const keywords = intent.split(' ');
    let alignmentSum = 0;

    keywords.forEach(kw => {
      // Fuzzy match logic placeholder
      const weight =
        Object.entries(this.conceptWeights).find(
          ([key]) => key.includes(kw) || kw.includes(key)
        )?.[1] || 0.5;
      alignmentSum += weight;
    });

    const systemAlignment = Math.min(100, (alignmentSum / keywords.length) * 100);
    const intentClarity = Math.min(100, keywords.length * 30); // More specific words = higher clarity (heuristic)
    const executionVelocity = 85; // Mock velocity

    const overallResonance = Math.round(
      intentClarity * 0.3 + systemAlignment * 0.4 + executionVelocity * 0.3
    );

    return {
      intentClarity,
      systemAlignment,
      executionVelocity,
      overallResonance,
      timestamp: Date.now(),
    };
  }

  public getCurrentIntent(): string {
    return this.currentIntent;
  }
}

export const intentAnalysisService = IntentAnalysisService.getInstance();
