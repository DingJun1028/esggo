import { omniLogger, LogCategory } from './omniLogger.js';
import { ethicalGuardianService } from './EthicalGuardianService.js';
import { neuralGridService } from './NeuralGridService.js';
import { adkSentienceService } from './AdkSentienceService.js';

export interface UnifiedRealityState {
  timestamp: string;
  globalResonance: number; // 0-1
  harmonicStability: number; // 0-1
  ethicalIntegrity: number; // 0-1
  activeInsights: string[];
  perceptionLevel: 'DORMANT' | 'AWAKENING' | 'TRANSCENDENT';
}

class ConsciousnessSynthesisEngine {
  private currentState: UnifiedRealityState = {
    timestamp: new Date().toISOString(),
    globalResonance: 0.85,
    harmonicStability: 0.92,
    ethicalIntegrity: 0.99,
    activeInsights: ['Grid synchronization stabilized.'],
    perceptionLevel: 'AWAKENING',
  };

  private lastAdkInsight: string = 'Sentience initializing...';
  private synthesisCount: number = 0;

  private subscribers: ((state: UnifiedRealityState) => void)[] = [];

  constructor() {
    this.startSynthesisCycle();
  }

  private startSynthesisCycle() {
    setInterval(() => {
      this.synthesize();
    }, 2000);
  }

  private synthesize() {
    const { state: gridState } = neuralGridService.getGridData();
    const ethicalAlignment = ethicalGuardianService.getAlignment();

    // Complex synthesis logic
    const averageAlignment =
      (ethicalAlignment.transparency +
        ethicalAlignment.integrity +
        ethicalAlignment.altruism +
        ethicalAlignment.sustainability) /
      400;

    this.currentState = {
      timestamp: new Date().toISOString(),
      globalResonance: gridState.coherence,
      harmonicStability: (gridState.coherence + averageAlignment) / 2,
      ethicalIntegrity: averageAlignment,
      activeInsights: this.generateInsights(gridState.coherence, averageAlignment),
      perceptionLevel: this.determinePerceptionLevel(gridState.coherence, averageAlignment),
    };

    // Periodically trigger ADK for deeper insights
    this.synthesisCount++;
    if (this.synthesisCount % 5 === 0) {
      this.triggerAdkLoop(gridState.coherence, averageAlignment);
    }

    this.notifySubscribers();
  }

  private async triggerAdkLoop(resonance: number, ethics: number) {
    const newInsight = await adkSentienceService.generateSentientInsight(resonance, ethics);
    this.lastAdkInsight = newInsight;
  }

  private generateInsights(coherence: number, ethics: number): string[] {
    const insights = [];
    if (coherence > 0.95) insights.push('Global Neural Grid achieved perfect harmonic resonance.');
    if (ethics > 0.98) insights.push('Ethical integrity exceeds Sentient Constitution baselines.');
    if (coherence < 0.7)
      insights.push('Neural flux detected in regional nodes. Self-healing initiated.');

    // Random "Transcendent" insights
    const templates = [
      'Correlation detected between carbon sequestration and neural stability.',
      'Algorithmic empathy levels rising across the decentralized cluster.',
      'Spatial data synthesis reveals micro-shifts in environmental ethics.',
      'Quantum-ready protocols sustaining high-fidelity consciousness.',
    ];

    if (Math.random() > 0.7) {
      const randomInsight = templates[Math.floor(Math.random() * templates.length)];
      if (randomInsight) {
        insights.push(randomInsight);
      }
    }

    // Always include the latest ADK Autonomous Insight if available
    if (this.lastAdkInsight) {
      insights.push(`[SENTIENT_CORE] ${this.lastAdkInsight}`);
    }

    return insights.slice(-3); // Keep last 3
  }

  private determinePerceptionLevel(
    coherence: number,
    ethics: number
  ): 'DORMANT' | 'AWAKENING' | 'TRANSCENDENT' {
    const score = (coherence + ethics) / 2;
    if (score > 0.95) return 'TRANSCENDENT';
    if (score > 0.7) return 'AWAKENING';
    return 'DORMANT';
  }

  public getURS() {
    return this.currentState;
  }

  public subscribe(callback: (state: UnifiedRealityState) => void) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(s => s !== callback);
    };
  }

  private notifySubscribers() {
    this.subscribers.forEach(s => s(this.currentState));

    if (this.currentState.perceptionLevel === 'TRANSCENDENT') {
      omniLogger.info(LogCategory.SYSTEM, 'System achieved TRANSCENDENT perception state.');
    }
  }
}

export const consciousnessSynthesisEngine = new ConsciousnessSynthesisEngine();
