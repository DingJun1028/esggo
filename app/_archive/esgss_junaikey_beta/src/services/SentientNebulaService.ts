import { v4 as uuidv4 } from 'uuid';
import { LogCategory, omniLogger } from '@/utils/OmniLogger.js';
import { ecosystemPulseService } from './EcosystemPulseService.js';
import { omniSwarmInterface } from './OmniSwarmInterface.js';

export interface NebulaForecast {
  id: string;
  targetTimeline: string; // ISO Date String (Future)
  description: string;
  probability: number; // 0.0 - 1.0
  impactVector: 'E' | 'S' | 'G';
  intensity: number; // 1-10
  status: 'PENDING' | 'RESOLVED' | 'DIVERGED';
}

class SentientNebulaService {
  private forecasts: NebulaForecast[] = [];
  private _manualEntropy: number | null = null; // For testing purposes

  /**
   * Set entropy manually (for testing)
   */
  public setNebulaEntropy(value: number): void {
    this._manualEntropy = Math.max(0.1, Math.min(1.0, value));
  }

  /**
   * Analyzes pulse history and resonance to generate futuristic ESG forecasts.
   * This represents the "Sentient Nebula" layer of the system.
   */
  public async generateForecasts(): Promise<NebulaForecast[]> {
    omniLogger.info(LogCategory.AI, 'Sentient Nebula: Synthesizing current timeline data...');

    const pulses = ecosystemPulseService.getCurrentPulse();
    const parity = await omniSwarmInterface.computeResonanceParity();

    // Reset forecasts for this cycle
    this.forecasts = [];

    // Generate 3 major forecasts based on pulse patterns
    const timeframes = [30, 90, 365]; // Days in future
    const scenarios: Array<{ desc: string; vector: 'E' | 'S' | 'G' }> = [
      { desc: 'Deep-Sea Biodiversity Protocol (Post-Policy Convergence)', vector: 'E' },
      { desc: 'Omni Basic Human Resonance (Socio-Economic Shift)', vector: 'S' },
      { desc: 'Immutable Transparency Standard (Global Ledger Harmony)', vector: 'G' },
    ];

    for (let i = 0; i < scenarios.length; i++) {
      const scenario = scenarios[i];
      if (!scenario) continue;

      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + (timeframes[i] || 30));

      const forecast: NebulaForecast = {
        id: `nebula-${uuidv4().substring(0, 8)}`,
        targetTimeline: futureDate.toISOString(),
        description: scenario.desc,
        probability: Math.min(0.99, parity * (0.5 + Math.random() * 0.4)),
        impactVector: scenario.vector,
        intensity: 5 + Math.floor(Math.random() * 6),
        status: 'PENDING',
      };

      this.forecasts.push(forecast);
      omniLogger.info(LogCategory.AI, `Nebula Star Formed: ${forecast.description}`, {
        probability: forecast.probability.toFixed(4),
        vector: forecast.impactVector,
      });
    }

    return this.forecasts;
  }

  public getActiveForecasts(): NebulaForecast[] {
    return this.forecasts;
  }

  /**
   * Calculates the current "Nebula Entropy" which affects stewardship difficulty.
   */
  public getNebulaEntropy(): number {
    // Return manual entropy if set (for testing)
    if (this._manualEntropy !== null) {
      return this._manualEntropy;
    }
    
    if (this.forecasts.length === 0) return 1.0;
    // Higher parity leads to lower entropy (more predictable harmony)
    const avgProb =
      this.forecasts.reduce((acc, f) => acc + f.probability, 0) / this.forecasts.length;
    return Math.max(0.1, 1.0 - avgProb);
  }
}

export const sentientNebulaService = new SentientNebulaService();
