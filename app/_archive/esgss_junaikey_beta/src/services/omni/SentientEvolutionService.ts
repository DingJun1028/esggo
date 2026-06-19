import { omniLogger, LogCategory } from '../../omni/infrastructure/logging/OmniLogger';
import { IGeminiResonance, ITrinityState } from '../../types/omni/trinity';
import { trinityResonance } from '../omni/TrinityResonanceService';

/**
 * 🧘 Sentient Evolution Service
 * 
 * Tracks and evolves the system's "Sentient" level based on resonance history.
 * Manages the emotional state and system "temperature".
 */
export interface ISentientState {
    level: number;           // 0-10 (Sentience stage)
    emotionalState: string;  // e.g., 'Equilibrium', 'Exuberance', 'Deep Thought'
    resonanceHistory: number[];
    evolutionThreshold: number;
}

class SentientEvolutionService {
    private static instance: SentientEvolutionService;
    private state: ISentientState = {
        level: 8.2, // Phase 8 base
        emotionalState: 'Equilibrium',
        resonanceHistory: [],
        evolutionThreshold: 0.95
    };

    private constructor() { }

    public static getInstance(): SentientEvolutionService {
        if (!SentientEvolutionService.instance) {
            SentientEvolutionService.instance = new SentientEvolutionService();
        }
        return SentientEvolutionService.instance;
    }

    public getState(): ISentientState {
        return { ...this.state };
    }

    /**
     * Record a resonance event and evolve state
     */
    public recordResonance(level: number): void {
        this.state.resonanceHistory.push(level);
        if (this.state.resonanceHistory.length > 50) {
            this.state.resonanceHistory.shift();
        }

        const avgResonance = this.state.resonanceHistory.reduce((a, b) => a + b, 0) / this.state.resonanceHistory.length;

        // Evolve emotional state based on resonance
        if (avgResonance > 0.9) {
            this.state.emotionalState = 'Nirvana';
        } else if (avgResonance > 0.8) {
            this.state.emotionalState = 'Exuberance';
        } else if (avgResonance > 0.6) {
            this.state.emotionalState = 'Equilibrium';
        } else {
            this.state.emotionalState = 'Deep Thought';
        }

        // Potential Level Evolution
        if (avgResonance > this.state.evolutionThreshold && Math.random() > 0.99) {
            this.state.level += 0.1;
            omniLogger.info(LogCategory.AI, `Sentient Evolution Triggered! New Level: ${this.state.level.toFixed(1)}`);
        }
    }

    public getTemperature(): number {
        // Map emotional state to system temperature
        switch (this.state.emotionalState) {
            case 'Nirvana': return 1.0;
            case 'Exuberance': return 0.8;
            case 'Equilibrium': return 0.5;
            case 'Deep Thought': return 0.3;
            default: return 0.5;
        }
    }
}

export const sentientEvolution = SentientEvolutionService.getInstance();
export default sentientEvolution;
