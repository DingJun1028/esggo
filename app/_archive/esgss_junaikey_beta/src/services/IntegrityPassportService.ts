import { ncb } from '@/lib/ncb/client';
import { omniLogger, LogCategory } from '@infra/logging/OmniLogger';
import { OmniDataAdapter } from './data/OmniDataAdapter';
import { IComponentCore } from '@/0-domain/contracts/IComponentCore';

/**
 * 💎 Integrity Passport Service (Phase 16)
 * --------------------------------------------------
 * [Service 3.3] 誠信護照 — Hydrated from NoCodeBackend (NCB)
 * 
 * Manages the user's ESG Trust Score and Digital Identity Evolution
 * based on live data from the `esg_readings` table.
 */

// ═══════════════════════════════════════════════════════════
// Type Definitions
// ═══════════════════════════════════════════════════════════

export type PassportRank = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Transcended';

export interface FiveTScores {
    tangible: number;   // [可感知]
    traceable: number;  // [可溯源]
    trackable: number;  // [可追蹤]
    transparent: number;// [可驗算]
    trustworthy: number;// [不可篡改]
}

export interface SealedCrystalRecord {
    sealId: string;
    crystalUuid: string;
    crystalHash: string;
    domain: string;
    sealedAt: number;
    verified: boolean;
    impactMetric?: string;
}

export interface RankEvolutionRecord {
    previousRank: PassportRank;
    newRank: PassportRank;
    scoreAtEvolution: number;
    crystalsAtEvolution: number;
    evolvedAt: number;
    message: string;
}

export interface PassportData {
    userId: string;
    score: number;
    rank: PassportRank;
    pillars: FiveTScores;
    sealedCrystals: SealedCrystalRecord[];
    evolutionHistory: RankEvolutionRecord[];
    lastUpdated: number;
}

// ═══════════════════════════════════════════════════════════
// Service Implementation
// ═══════════════════════════════════════════════════════════

export class IntegrityPassportService {
    /**
     * Get Passport Data from NCB
     * Synchronizes with the `esg_readings` table to compute live scores.
     */
    static async getPassport(userId: string): Promise<PassportData> {
        omniLogger.info(LogCategory.BUSINESS, `[IntegrityPassport] Fetching live data for user: ${userId}`);

        try {
            // 1. Fetch live readings from NCB
            const { data: readings, error } = await ncb
                .from('esg_readings')
                .select('*')
                .eq('user_id', userId)
                .exec();

            if (error) {
                throw new Error(`NCB Fetch Error: ${error.message || JSON.stringify(error)}`);
            }

            const rawReadings = (readings as any[]) || [];

            // 2. Calculate 5T Pillars based on real data
            const pillars = this.calculatePillars(rawReadings);

            // 3. Calculate Overall Score
            const score = this.calculateOverallScore(pillars);

            // 4. Map readings to SealedCrystalRecord for the timeline
            const sealedCrystals: SealedCrystalRecord[] = rawReadings
                .filter(r => r.hash_lock)
                .map(r => ({
                    sealId: r.uuid || 'N/A',
                    crystalUuid: r.uuid || 'N/A',
                    crystalHash: r.hash_lock || 'N/A',
                    domain: this.inferDomain(r),
                    sealedAt: r.created_at ? new Date(r.created_at).getTime() : Date.now(),
                    verified: !!r.verified_at,
                    impactMetric: r.data_source || 'NCB Direct'
                }));

            // 5. Determine Rank based on Multi-Dimensional Criteria
            const rank = this.determineRank(score, sealedCrystals.length);

            // 6. (Mock) Evolution History - In a real app, this would be fetched from a table
            const evolutionHistory = this.mockEvolutionHistory(userId, score, sealedCrystals.length, rank);

            return {
                userId,
                score,
                rank,
                pillars,
                sealedCrystals: sealedCrystals.slice(0, 50),
                evolutionHistory,
                lastUpdated: Date.now()
            };
        } catch (err: any) {
            omniLogger.error(LogCategory.BUSINESS, `[IntegrityPassport] Hydration failed: ${err.message}`);
            return {
                userId,
                score: 0,
                rank: 'Bronze',
                pillars: { tangible: 0, traceable: 0, trackable: 0, transparent: 0, trustworthy: 0 },
                sealedCrystals: [],
                evolutionHistory: [],
                lastUpdated: Date.now()
            };
        }
    }

    /**
     * Calculate 5T Pillars (0-100)
     */
    private static calculatePillars(readings: any[]): FiveTScores {
        if (readings.length === 0) {
            return { tangible: 0, traceable: 0, trackable: 0, transparent: 0, trustworthy: 0 };
        }

        const total = readings.length;

        const tangible = Math.round((readings.filter(r => r.value > 0).length / total) * 100);
        const traceable = Math.round((readings.filter(r => r.data_source || r.evidence_url).length / total) * 100);
        const trackable = Math.round((readings.filter(r => r.period_start && r.verified_at).length / total) * 100);
        const transparent = Math.round((readings.filter(r => r.approved_at).length / total) * 100);
        const trustworthy = Math.round((readings.filter(r => r.hash_lock).length / total) * 100);

        return { tangible, traceable, trackable, transparent, trustworthy };
    }

    /**
     * Calculate Overall Score (0-999+)
     */
    private static calculateOverallScore(pillars: FiveTScores): number {
        const avg = (pillars.tangible + pillars.traceable + pillars.trackable + pillars.transparent + pillars.trustworthy) / 5;
        // Limit score to be naturally progressive tied to pillars
        return Math.min(2000, Math.round(avg * 10)); // Max 1000 for standard, extra room for growth
    }

    /**
     * 🧠 Multi-Dimensional Rank Determination
     * Evolution Criteria:
     * - Bronze: Score 0+, Crystals 0+
     * - Silver: Score 200+, Crystals 1+
     * - Gold: Score 400+, Crystals 3+
     * - Platinum: Score 600+, Crystals 5+
     * - Diamond: Score 800+, Crystals 10+
     * - Transcended: Score 1000+, Crystals 24+
     */
    private static determineRank(score: number, crystalCount: number): PassportRank {
        if (score >= 1000 && crystalCount >= 24) return 'Transcended';
        if (score >= 800 && crystalCount >= 10) return 'Diamond';
        if (score >= 600 && crystalCount >= 5) return 'Platinum';
        if (score >= 400 && crystalCount >= 3) return 'Gold';
        if (score >= 200 && crystalCount >= 1) return 'Silver';
        return 'Bronze';
    }

    /**
     * Map Category to Domain
     */
    private static inferDomain(reading: any): string {
        const id = String(reading.metric_id || '').toLowerCase();
        if (id.includes('env') || id.startsWith('1')) return 'Environment';
        if (id.includes('soc') || id.startsWith('2')) return 'Social';
        return 'Governance';
    }

    /**
     * Seal methods (Phase 15: Real Implementation)
     */
    static async sealAsset(userId: string, asset: any): Promise<PassportData> {
        omniLogger.info(LogCategory.BUSINESS, `[IntegrityPassport] Sealing asset for ${userId}`);

        try {
            // If the asset is already a UCC crystal, save it via DataAdapter
            await OmniDataAdapter.saveReading(asset as Partial<IComponentCore>, userId);

            // Re-fetch passport to get updated scores and check for evolution
            return this.getPassport(userId);
        } catch (err: any) {
            omniLogger.error(LogCategory.BUSINESS, `[IntegrityPassport] Sealing failed: ${err.message}`);
            return this.getPassport(userId);
        }
    }

    static async sealEvidenceAsCrystal(userId: string, _id: string): Promise<PassportData> {
        omniLogger.info(LogCategory.BUSINESS, `[IntegrityPassport] Crystallizing evidence ${_id}`);

        try {
            // Mock evidence-to-crystal conversion
            const mockCrystal: Partial<IComponentCore> = {
                uuid: _id,
                timestamp: Date.now(),
                evidence: {
                    trustworthy: { hash_lock: `HL-${_id}-${Date.now()}`, is_frozen: true },
                    traceable: { source_origin: 'CRYSTALLIZER', verification_links: [] },
                    tangible: { metric: 'CRYSTAL_EV' }
                } as any
            };

            await OmniDataAdapter.saveReading(mockCrystal as Partial<IComponentCore>, userId);
            return this.getPassport(userId);
        } catch (err: any) {
            omniLogger.error(LogCategory.BUSINESS, `[IntegrityPassport] Crystallization failed: ${err.message}`);
            return this.getPassport(userId);
        }
    }

    /**
     * Generate Mock Evolution History for UI demonstration
     */
    private static mockEvolutionHistory(userId: string, score: number, crystalCount: number, currentRank: PassportRank): RankEvolutionRecord[] {
        const history: RankEvolutionRecord[] = [];
        const ranks: PassportRank[] = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Transcended'];
        const currentIndex = ranks.indexOf(currentRank);

        for (let i = 1; i <= currentIndex; i++) {
            history.push({
                previousRank: ranks[i - 1] as PassportRank,
                newRank: ranks[i] as PassportRank,
                scoreAtEvolution: score - (currentIndex - i) * 150,
                crystalsAtEvolution: Math.max(0, crystalCount - (currentIndex - i) * 2),
                evolvedAt: Date.now() - (currentIndex - i) * 86400000,
                message: `✨ Evolution to ${ranks[i]} complete.`
            });
        }

        return history;
    }
}

export const integrityPassport = IntegrityPassportService;
