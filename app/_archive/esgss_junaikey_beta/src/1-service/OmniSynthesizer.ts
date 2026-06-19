import { OmniQuantumCore, QuantumStatus } from './OmniQuantumCore';
import { omniNexus } from './OmniNexusService';
import { OracleNexus } from './OracleNexus';
import { omniLogger, LogCategory } from '@infra/logging/OmniLogger';

/**
 * 💡 OmniSynthesizer (萬能綜合器)
 * --------------------------------------------------
 * "萬法貫通"
 *
 * Aggregates distinct exotic signals into "Synthesized Wisdom".
 * Listens to:
 * 1. Quantum Flux (Energy State)
 * 2. Oracle Dreams (Prophecies)
 * 3. Nexus Events (World State)
 */

export interface SynthesisEvent {
  id: string;
  type: 'MIRACLE' | 'PROPHECY' | 'BREAKTHROUGH' | 'ANOMALY';
  timestamp: number;
  description: string;
  factors: {
    quantumEnergy: number;
    oracleConfidence: number;
    nexusGScore: number;
  };
  synthesizedInsight: string;
}

export class OmniSynthesizer {
  private static instance: OmniSynthesizer;
  private synthesisLog: SynthesisEvent[] = [];
  private synthesisInterval: ReturnType<typeof setInterval> | null = null;

  private constructor() {
    // Start synthesizing background hum
    this.startSynthesisLoop();
  }

  public static getInstance(): OmniSynthesizer {
    if (!OmniSynthesizer.instance) {
      OmniSynthesizer.instance = new OmniSynthesizer();
    }
    return OmniSynthesizer.instance;
  }

  private startSynthesisLoop() {
    if (this.synthesisInterval) return;
    this.synthesisInterval = setInterval(() => {
      this.attemptSynthesis();
    }, 15000); // Pulse every 15s
  }

  /**
   * Attempts to fuse current states into a new Insight
   */
  public attemptSynthesis(): SynthesisEvent | null {
    const quantumState = OmniQuantumCore.getStatus();
    const metrics = omniNexus.getGlobalMetrics();
    // Assuming OracleNexus has a way to get 'current top signal' or average risk
    // For now, mocking Oracle state access since it's mostly static/hook based
    const oracleConfidence = 0.85; // Mock high confidence

    // 1. Miracle Moment: High Energy + High G-Score
    if (quantumState.currentEnergy > 800 && metrics.globalGScore > 85) {
      return this.logEvent(
        'MIRACLE',
        'Quantum-Resonant Harmony Achieved',
        'The system is vibrating at a frequency where thought becomes reality instantly.',
        quantumState,
        metrics,
        oracleConfidence
      );
    }

    // 2. Prophecy Realized: High Oracle Confidence + Low Entropy
    if (oracleConfidence > 0.9 && metrics.totalEntropyReduced > 50) {
      return this.logEvent(
        'PROPHECY',
        'Golden Age Projection Verified',
        'Predictive models confirm a stable trajectory towards Net Zero.',
        quantumState,
        metrics,
        oracleConfidence
      );
    }

    return null;
  }

  private logEvent(
    type: SynthesisEvent['type'],
    title: string,
    insight: string,
    q: QuantumStatus,
    n: any,
    o: number
  ): SynthesisEvent {
    const event: SynthesisEvent = {
      id: `SYN-${Date.now()}`,
      type,
      timestamp: Date.now(),
      description: title,
      factors: {
        quantumEnergy: q.currentEnergy,
        nexusGScore: n.globalGScore,
        oracleConfidence: o,
      },
      synthesizedInsight: insight,
    };

    this.synthesisLog.unshift(event);
    if (this.synthesisLog.length > 50) this.synthesisLog.pop();

    omniLogger.info(LogCategory.SYSTEM, `[OmniSynthesizer] ${title}`, event);
    return event;
  }

  public getLog(): SynthesisEvent[] {
    return this.synthesisLog;
  }

  public static destroy(): void {
    if (OmniSynthesizer.instance) {
      if (OmniSynthesizer.instance.synthesisInterval) {
        clearInterval(OmniSynthesizer.instance.synthesisInterval);
        OmniSynthesizer.instance.synthesisInterval = null;
      }
      OmniSynthesizer.instance = undefined as any;
    }
    omniLogger.info(LogCategory.SYSTEM, 'OmniSynthesizer destroyed');
  }
}

export const omniSynthesizer = OmniSynthesizer.getInstance();
