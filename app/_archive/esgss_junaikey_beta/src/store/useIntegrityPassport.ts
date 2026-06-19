import { create } from 'zustand';
import { integrityPassport, PassportData, SealedCrystalRecord, FiveTScores, PassportRank, RankEvolutionRecord } from '@/services/IntegrityPassportService';
import { omniLogger, LogCategory } from '@infra/logging/OmniLogger';

/**
 * 💎 Integrity Passport Store (Phase 30)
 * --------------------------------------------------
 * [Service 3.3] 前端狀態管理
 * Refactored to use `IntegrityPassportService` directly for true "Service-as-Brain" architecture.
 */

interface IntegrityPassportState {
    // Data
    userId: string;
    score: number;
    rank: PassportRank;
    pillars: FiveTScores;
    sealedCrystals: SealedCrystalRecord[];
    evolutionHistory: RankEvolutionRecord[];
    lastUpdated: number;

    // Loading states
    isLoading: boolean;
    isSealing: boolean;
    error: string | null;

    // Actions
    fetchPassport: (userId: string) => Promise<void>;
    sealCrystal: (userId: string, crystal: any) => Promise<void>;
    sealEvidence: (userId: string, evidenceId: string) => Promise<void>; // New Action
    recalcRank: () => void;
}

export const useIntegrityPassport = create<IntegrityPassportState>((set, get) => ({
    // ── Initial State ──
    userId: '',
    score: 0,
    rank: 'Bronze',
    pillars: { tangible: 0, traceable: 0, trackable: 0, transparent: 0, trustworthy: 0 },
    sealedCrystals: [],
    evolutionHistory: [],
    lastUpdated: 0,
    isLoading: false,
    isSealing: false,
    error: null,

    // ── Fetch Passport from Service ──
    fetchPassport: async (userId: string) => {
        set({ isLoading: true, error: null });
        try {
            // Direct Service Call
            const data: PassportData = await integrityPassport.getPassport(userId);

            set({
                userId: data.userId,
                score: data.score,
                rank: data.rank,
                pillars: data.pillars,
                sealedCrystals: data.sealedCrystals || [],
                evolutionHistory: data.evolutionHistory || [],
                lastUpdated: data.lastUpdated,
                isLoading: false,
            });
        } catch (err: any) {
            omniLogger.error(LogCategory.UI, 'Fetch Passport Failed', { error: err.message });
            set({ isLoading: false, error: err.message });
        }
    },

    // ── Seal Crystal DNA to Passport ──
    sealCrystal: async (userId: string, crystal: any) => {
        set({ isSealing: true, error: null });
        try {
            const data: PassportData = await integrityPassport.sealAsset(userId, crystal);

            set({
                score: data.score,
                rank: data.rank,
                pillars: data.pillars,
                sealedCrystals: data.sealedCrystals || [],
                evolutionHistory: data.evolutionHistory || [],
                lastUpdated: data.lastUpdated,
                isSealing: false,
            });

            omniLogger.info(LogCategory.UI, 'Crystal Sealed & Passport Updated');
        } catch (err: any) {
            omniLogger.error(LogCategory.UI, 'Seal Crystal Failed', { error: err.message });
            set({ isSealing: false, error: err.message });
        }
    },

    // ── Seal Evidence as Crystal (Phase 114) ──
    sealEvidence: async (userId: string, evidenceId: string) => {
        set({ isSealing: true, error: null });
        try {
            const data: PassportData = await integrityPassport.sealEvidenceAsCrystal(userId, evidenceId);

            set({
                score: data.score,
                rank: data.rank,
                pillars: data.pillars,
                sealedCrystals: data.sealedCrystals || [],
                evolutionHistory: data.evolutionHistory || [],
                lastUpdated: data.lastUpdated,
                isSealing: false,
            });

            omniLogger.info(LogCategory.UI, `Evidence ${evidenceId} Crystallized & Passport Updated`);
        } catch (err: any) {
            omniLogger.error(LogCategory.UI, 'Seal Evidence Failed', { error: err.message });
            set({ isSealing: false, error: err.message });
        }
    },

    // ── Local Rank Recalculation (Optional, service does this) ──
    recalcRank: () => {
        // Redundant if service handles logic, but kept for optimistic updates if needed
    },
}));
