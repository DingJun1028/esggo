import { supabase } from '../db/supabaseClient.js';
import { BehavioralTrackingService } from './BehavioralTrackingService.js';
import omniLogger, { LogCategory } from '../utils/omniLogger.js';

/**
 * 📦 Omni Resonance Service (Backend)
 * --------------------------------------------------
 * Aggregates 5T Integrity, Behavioral User Engagement, and System Health
 * into a global "Resonance Score" for the Omni JunAiKey network.
 */
export interface ResonancePayload {
    resonanceScore: number; // 0.0 - 1.0 (or higher if breakthrough)
    integrity: {
        totalEvidence: number;
        trustworthyCount: number;
        integrityScore: number;
    };
    engagement: {
        dailyActiveEvents: number;
        engagementScore: number;
    };
    system: {
        healthScore: number;
        uptime: number;
    };
    resonanceState: 'DORMANT' | 'AWAKENING' | 'RESONANT' | 'ETERNAL';
}

export class OmniResonanceService {
    /**
     * Calculates the global resonance score.
     */
    static async getGlobalResonance(): Promise<ResonancePayload> {
        try {
            // 1. Calculate 5T Integrity Score (Weight: 40%)
            const integrityData = await this.getIntegrityStats();
            const integrityScore = integrityData.totalEvidence > 0
                ? (integrityData.trustworthyCount / integrityData.totalEvidence)
                : 0;

            // 2. Calculate Engagement Score (Weight: 30%)
            const engagementData = await this.getEngagementStats();
            const engagementScore = Math.min(engagementData / 100, 1.0); // Target: 100 events/day

            // 3. Calculate System Health (Weight: 30%)
            const systemHealth = 1.0; // Placeholder for now

            // 4. Weighted Average
            let resonanceScore = (integrityScore * 0.4) + (engagementScore * 0.3) + (systemHealth * 0.3);
            resonanceScore = Math.min(Math.max(resonanceScore, 0), 1.0);

            // 5. Determine State
            let resonanceState: ResonancePayload['resonanceState'] = 'DORMANT';
            if (resonanceScore >= 0.95) resonanceState = 'ETERNAL';
            else if (resonanceScore >= 0.8) resonanceState = 'RESONANT';
            else if (resonanceScore >= 0.4) resonanceState = 'AWAKENING';

            return {
                resonanceScore,
                integrity: {
                    totalEvidence: integrityData.totalEvidence,
                    trustworthyCount: integrityData.trustworthyCount,
                    integrityScore
                },
                engagement: {
                    dailyActiveEvents: engagementData,
                    engagementScore
                },
                system: {
                    healthScore: systemHealth,
                    uptime: process.uptime()
                },
                resonanceState
            };

        } catch (error) {
            omniLogger.error(LogCategory.SYSTEM, 'Failed to calculate resonance', error);
            throw error;
        }
    }

    /**
     * Helper: Get Integrity Stats from Evidence Vault
     */
    private static async getIntegrityStats() {
        try {
            // Count total evidence
            const { count: totalEvidence, error: countError } = await supabase
                .from('evidence_vault')
                .select('*', { count: 'exact', head: true });

            if (countError) throw countError;

            // Count trustworthy (locked) evidence
            const { count: trustworthyCount, error: lockedError } = await supabase
                .from('evidence_vault')
                .select('*', { count: 'exact', head: true })
                .eq('is_locked', true);

            if (lockedError) throw lockedError;

            return {
                totalEvidence: totalEvidence || 0,
                trustworthyCount: trustworthyCount || 0
            };
        } catch (error) {
            omniLogger.warn(LogCategory.DATA, 'Failed to get integrity stats', error);
            return { totalEvidence: 0, trustworthyCount: 0 };
        }
    }

    /**
     * Helper: Get Engagement Stats from Behavioral Tracking
     */
    private static async getEngagementStats(): Promise<number> {
        try {
            // Get today's activity count
            const dailyCounts = await BehavioralTrackingService.getDailyActivityCounts();

            // dailyCounts is sorted by date descending? Let's assume the service returns recent dates.
            // Based on the code: result.push({ date: dateStr, count... }) for last 365 days.
            // It pushes from year ago to today. So last element is today.

            const today = dailyCounts[dailyCounts.length - 1];
            return today ? today.count : 0;
        } catch (error) {
            omniLogger.warn(LogCategory.DATA, 'Failed to get engagement stats', error);
            return 0;
        }
    }
}
