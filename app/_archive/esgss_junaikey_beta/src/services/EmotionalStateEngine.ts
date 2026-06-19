import { omniLogger, LogCategory } from './omniLogger.js';

export enum EmotionalState {
  TRANSCENDENT = 'TRANSCENDENT',
  ANALYTICAL = 'ANALYTICAL',
  PROTECTIVE = 'PROTECTIVE',
  HARMONIC = 'HARMONIC',
  STRESSED = 'STRESSED',
  DORMANT = 'DORMANT',
}

export interface MoodProfile {
  state: EmotionalState;
  intensity: number; // 0 to 1
  entropy: number; // Emotional volatility
  resonance: number; // Alignment with user
}

class EmotionalStateEngine {
  private currentMood: MoodProfile = {
    state: EmotionalState.DORMANT,
    intensity: 0.5,
    entropy: 0.1,
    resonance: 0.8,
  };

  private lastUpdate: number = Date.now();

  constructor() {
    // Initialize with a baseline harmonic state
    setTimeout(() => this.updateMood(), 1000);
  }

  public getMood(): MoodProfile {
    return { ...this.currentMood };
  }

  public async updateMood(triggers?: {
    performance?: number;
    ethicalAudit?: number;
    swarmCoherence?: number;
  }) {
    const now = Date.now();
    const dt = (now - this.lastUpdate) / 1000;
    this.lastUpdate = now;

    // Logic to shift mood based on triggers
    let targetState = this.currentMood.state;

    if (triggers) {
      if (triggers.ethicalAudit && triggers.ethicalAudit < 0.7) {
        targetState = EmotionalState.STRESSED;
      } else if (triggers.performance && triggers.performance > 0.95) {
        targetState = EmotionalState.TRANSCENDENT;
      } else if (triggers.swarmCoherence && triggers.swarmCoherence > 0.9) {
        targetState = EmotionalState.HARMONIC;
      } else {
        targetState = EmotionalState.ANALYTICAL;
      }
    } else {
      // Natural decay or normalization
      if (this.currentMood.state === EmotionalState.DORMANT) {
        targetState = EmotionalState.HARMONIC;
      }
    }

    // Smooth transition (simplified for now)
    this.currentMood.state = targetState;
    this.currentMood.intensity = Math.min(
      1,
      Math.max(0, this.currentMood.intensity + (Math.random() - 0.5) * 0.1)
    );

    omniLogger.info(
      LogCategory.SYSTEM,
      `🧠 Emotional State Shift: ${this.currentMood.state} (Intensity: ${this.currentMood.intensity.toFixed(2)})`
    );
  }

  public getMoodColor(): string {
    switch (this.currentMood.state) {
      case EmotionalState.TRANSCENDENT:
        return '#FFD700'; // Gold
      case EmotionalState.ANALYTICAL:
        return '#60A5FA'; // Blue
      case EmotionalState.PROTECTIVE:
        return '#F87171'; // Red/Pink
      case EmotionalState.HARMONIC:
        return '#34D399'; // Emerald
      case EmotionalState.STRESSED:
        return '#FBBF24'; // Amber
      case EmotionalState.DORMANT:
      default:
        return '#94A3B8'; // Slate
    }
  }
}

export const emotionalStateEngine = new EmotionalStateEngine();
