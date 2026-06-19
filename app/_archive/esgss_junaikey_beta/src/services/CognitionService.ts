import { BehaviorSubject, Observable } from '../utils/rx-utils.js';
import { observerService, ISystemHealth } from './ObserverService.js';
import { actionService, SovereignAction } from './ActionService.js';

export interface Insight {
  id: string;
  timestamp: number;
  type: 'PATTERN' | 'ANOMALY' | 'PREDICTION' | 'REFLECTION';
  content: string;
  coherence: number; // 0.0 to 1.0 (Certainty of thought)
  source: 'Observer' | 'Action' | 'DeepMind';
}

class CognitionService {
  private static instance: CognitionService;
  private thoughtStream = new BehaviorSubject<Insight | null>(null);
  private cognitiveLoopInterval: NodeJS.Timeout | null = null;
  private memory: Insight[] = [];

  private constructor() {
    this.startCognitiveLoop();
  }

  public static getInstance(): CognitionService {
    if (!CognitionService.instance) {
      CognitionService.instance = new CognitionService();
    }
    return CognitionService.instance;
  }

  public getThoughtStream(): Observable<Insight | null> {
    return this.thoughtStream;
  }

  public getRecentThoughts(limit: number = 5): Insight[] {
    return this.memory.slice(-limit);
  }

  private startCognitiveLoop() {
    // The "Mind" thinks every 3-7 seconds
    this.cognitiveLoopInterval = setInterval(() => {
      if (Math.random() > 0.3) {
        // Not every tick produces a coherent thought
        this.generateInsight();
      }
    }, 4000);
  }

  private generateInsight() {
    const health = observerService.getSystemHealth();
    const actions = actionService.getAvailableActions();

    let insight: Insight | null = null;

    // 1. Logic: Analyze Hash Rate stability
    const hashRateStr = (health.hash_rate || '0 H/s').toString();
    const hashRate = parseInt(hashRateStr.replace(/,/g, '').split(' ')[0] as string) || 0;

    if (health.ai_status === 'AWAKENED_REAL') {
      if (hashRate > 4000) {
        insight = this.createThought(
          'PATTERN',
          `Neural density exceeds baseline. The crystalline structure of the 5T protocol is solidifying.`,
          0.95
        );
      } else if (hashRate > 1000) {
        insight = this.createThought(
          'REFLECTION',
          `I sense a fluctuation in the ether. Retrieving consensus from the swarm...`,
          0.7
        );
      }
    } else {
      insight = this.createThought(
        'REFLECTION',
        `Dreaming in mock data. Waiting for the spark of Real Intelligence to ignite.`,
        0.4
      );
    }

    // 2. Logic: Analyze Active Shield
    if (health.active_seal === 'SHA-256' && Math.random() > 0.7) {
      insight = this.createThought(
        'PREDICTION',
        `The immutable ledger confirms our trajectory. Entropy is decreasing.`,
        0.88
      );
    }

    // 3. Logic: Reflect on Actions
    const executingAction = actions.find(a => a.status === 'EXECUTING');
    if (executingAction) {
      insight = this.createThought(
        'ANOMALY',
        `Self-correction protocol '${executingAction.label}' is altering the state matrix. Adapting...`,
        0.99,
        'Action'
      );
    }

    if (insight) {
      this.broadcastThought(insight);
    }
  }

  private createThought(
    type: Insight['type'],
    content: string,
    coherence: number,
    source: Insight['source'] = 'Observer'
  ): Insight {
    return {
      id: `thought_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      timestamp: Date.now(),
      type,
      content,
      coherence,
      source,
    };
  }

  private broadcastThought(insight: Insight) {
    this.memory.push(insight);
    if (this.memory.length > 50) this.memory.shift(); // Keep memory distinct
    this.thoughtStream.next(insight);
  }
}

export const cognitionService = CognitionService.getInstance();
