/**
 * 💡 ContextualActionService: Proactive AI Orchestrator
 * --------------------------------------------------
 * Monitors system state and user behavior to trigger proactive interactions.
 * Part of the Phase 21 "Hyper-Personalization" initiative.
 */

import { omniLogger, LogCategory } from '../omni/infrastructure/logging/OmniLogger.ts';

export interface ProactiveAdvice {
  id: string;
  sourceAgentId: string;
  title: string;
  content: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  timestamp: number;
}

class ContextualActionService {
  private activeAdvice: ProactiveAdvice[] = [];
  private listeners: Set<(advice: ProactiveAdvice[]) => void> = new Set();

  public triggerAdvice(advice: Omit<ProactiveAdvice, 'id' | 'timestamp'>) {
    const newAdvice: ProactiveAdvice = {
      ...advice,
      id: `adv_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };

    // Keep only last 5 advice items
    this.activeAdvice = [newAdvice, ...this.activeAdvice].slice(0, 5);
    this.notify();

    omniLogger.info(LogCategory.ACTIVE_AGENT, `[Context] Proactive trigger from ${advice.sourceAgentId}: ${advice.title}`);
  }

  public getAdvice(): ProactiveAdvice[] {
    return this.activeAdvice;
  }

  public subscribe(callback: (advice: ProactiveAdvice[]) => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notify() {
    this.listeners.forEach(cb => cb(this.activeAdvice));
  }

  /**
   * Automatically detect patterns and trigger advice
   */
  public analyzeContext(context: any) {
    // Example: Trigger advice if carbon inventory is high
    if (context.type === 'EMISSION_ALERT' && context.value > 1000) {
      this.triggerAdvice({
        sourceAgentId: 'CarbonSentinel',
        title: 'Emission Spike Detected',
        content:
          'I noticed an unusual flux in Scope 2 emissions. Should we activate the optimization protocol?',
        priority: 'HIGH',
      });
    }

    // Example: Welcome advice for new view
    if (context.type === 'VIEW_SHIFT' && context.view === 'FORGE') {
      this.triggerAdvice({
        sourceAgentId: 'SoulGuide',
        title: 'New Soul Available',
        content:
          'The Genetic Research module has identified a core resonance match for your current goals.',
        priority: 'MEDIUM',
      });
    }
  }

  public dismissAdvice(id: string) {
    this.activeAdvice = this.activeAdvice.filter(a => a.id !== id);
    this.notify();
  }
}

export const contextualActionService = new ContextualActionService();
