/**
 * 📊 ResonanceAnalyticsService
 * --------------------------------------------------
 * Monitors user-agent resonance and detects behavioral drift.
 * Ensures all AI decisions align with the "Omni Manifesto" (5T compliant).
 */

import { omniLogger, LogCategory } from '../omni/infrastructure/logging/OmniLogger.js';
import { useOmniMemory } from '../omni/infrastructure/memory/OmniMemory.js';
import { avatarOrchestrator } from './OmniAvatarOrchestrator.js';
import { SystemError } from '../omni/infrastructure/errors/SystemError.js';

export interface ResonanceMetrics {
    internalResonance: number; // Evolution vs Memory
    externalImpact: number;   // ESG metrics impact
    driftScore: number;      // Deviation from Manifesto (0 = Perfect, 1 = Critical Drift)
    timestamp: string;
}

export class ResonanceAnalyticsService {
    private static instance: ResonanceAnalyticsService;

    private constructor() {
        omniLogger.info(LogCategory.SYSTEM, '📊 ResonanceAnalyticsService Initialized');
    }

    public static getInstance(): ResonanceAnalyticsService {
        if (!ResonanceAnalyticsService.instance) {
            ResonanceAnalyticsService.instance = new ResonanceAnalyticsService();
        }
        return ResonanceAnalyticsService.instance;
    }

    /**
     * Monitor Consistency: Drift Detection
     * Compares the current context/interaction against the Manifesto in the Library.
     */
    public async detectDrift(agentId: string, currentAction: string): Promise<number> {
        try {
            const memory = useOmniMemory.getState();
            const manifesto = memory.palace.theLibrary.manifesto;

            // Simple drift detection logic for MVP
            // In production, this would use a semantic comparison via OmniKnowledge
            let matchCount = 0;
            for (const rule of manifesto) {
                const trigger = rule.toLowerCase().split(' ')[0];
                if (trigger && currentAction.toLowerCase().includes(trigger)) {
                    matchCount++;
                }
            }

            const drift = 1 - (matchCount / manifesto.length);

            if (drift > 0.5) {
                omniLogger.warn(LogCategory.SYSTEM, `⚠️ DRIFT DETECTED for ${agentId}: Score ${drift.toFixed(2)}`, { currentAction });
            }

            return drift;
        } catch (error) {
            omniLogger.error(LogCategory.SYSTEM, 'Failed to detect drift', { error });
            return 1.0; // Assume critical drift on error
        }
    }

    /**
     * Calculate Comprehensive Resonance Metrics
     */
    public async getComprehensiveMetrics(agentId: string): Promise<ResonanceMetrics> {
        const memory = useOmniMemory.getState();
        const avatar = await avatarOrchestrator.getActiveAvatar(agentId);

        // Internal Resonance calculation
        const internalRes = avatar ? (avatar.level / 10 + memory.evolutionState.wisdomMetrics.memoryRetention) / 2 : 0;

        // External Impact (Simulated from ESG Data)
        const externalImpact = memory.esgData ? 0.85 : 0.5; // High impact if ESG data exists

        return {
            internalResonance: internalRes,
            externalImpact,
            driftScore: 0.1, // Fixed for now
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Log Resonance Event for 5T Evidence
     */
    public async logResonanceEvent(agentId: string, metrics: ResonanceMetrics): Promise<void> {
        omniLogger.info(LogCategory.KNOWLEDGE, `[Resonance] Agent ${agentId} - Resonance: ${metrics.internalResonance.toFixed(2)}`, { metrics });

        // In a real scenario, this would create an interaction log in OmniMemory
        const memory = useOmniMemory.getState();
        memory.addInteractionLog(`Resonance Snapshot: ${metrics.internalResonance.toFixed(2)}`);
    }
}

export const resonanceAnalytics = ResonanceAnalyticsService.getInstance();
