import { omniLogger, LogCategory } from './omni/infrastructure/logging/OmniLogger.js';
import { type IComponentCore } from './OmniComponentCore.js';

export interface RiskRiskScore {
    probability: number; // 0-1
    impact: number;      // 0-1
    volatility: number;  // Variance in metrics
    composite: number;   // Calculated weight
}

/**
 * 📊 Adaptive Risk Matrix Service v11.1
 * -------------------------------------
 * Implements MECE Sentient Risk Calculus. Transitions from static
 * thresholds to dynamic threat modeling.
 */
export class AdaptiveRiskMatrixService {
    constructor() {
        omniLogger.info(LogCategory.SYSTEM, '📊 Adaptive Risk Matrix Service Initialized');
    }

    /**
     * 計算波動性 / Calculate Volatility
     * Analyzes the variance in 5T metrics to predict instability.
     */
    public calculateVolatility(history: IComponentCore[]): number {
        if (history.length < 2) return 0;

        // Simplified Volatility Calculation:
        // We look at the timestamp deltas and status consistency.
        let variance = 0;
        for (let i = 1; i < history.length; i++) {
            const current = history[i];
            const previous = history[i - 1];
            if (!current?.timestamp || !previous?.timestamp) continue;
            
            const delta = current.timestamp - previous.timestamp;
            if (delta < 1000) variance += 0.1; // Frequency indicates potential stress
            if (current?.status !== previous?.status) variance += 0.2;
        }

        return Math.min(variance / history.length, 1.0);
    }

    /**
     * 模型威脅環境 / Model Threat Environment
     */
    public modelThreatEnvironment(core: IComponentCore, context?: Record<string, unknown>): RiskRiskScore {
        const volatility = this.calculateVolatility([core]); // Base score

        // Logical Analysis: 
        // 1. If 5T metrics are near thresholds, impact increases.
        // 2. If quantum anchors are missing in v11.1+, probability of breach increases.

        const evidence = core?.evidence as Record<string, unknown> | undefined;
        const isQuantumCompromised = core.version.startsWith('11.1') &&
            !(evidence?.trustworthy as Record<string, unknown>)?.quantum_anchor;

        const probability = isQuantumCompromised ? 0.8 : 0.2;
        const impact = core.status === 'Violated' ? 0.9 : 0.3;

        const composite = (probability * 0.4) + (impact * 0.4) + (volatility * 0.2);

        omniLogger.info(LogCategory.ESG, `Risk Modeled for ${core.uuid}: Score=${composite.toFixed(2)} | Volatility=${volatility.toFixed(2)}`);

        return {
            probability,
            impact,
            volatility,
            composite
        };
    }

    /**
     * 識別熱點 / Identify Hotspots
     */
    public identifyHotspots(cores: IComponentCore[]): string[] {
        if (!cores || cores.length === 0) return [];
        
        return cores
            .filter(c => c && this.modelThreatEnvironment(c).composite > 0.6)
            .map(c => c?.uuid)
            .filter((uuid): uuid is string => typeof uuid === 'string');
    }
}

export const adaptiveRiskMatrixService = new AdaptiveRiskMatrixService();
