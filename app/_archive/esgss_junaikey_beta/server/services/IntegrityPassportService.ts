/**
 * 💎 Integrity Passport Service (Phase 8)
 * --------------------------------------------------
 * [Service 3.3] 誠信護照 — Crystal DNA Integration
 *
 * 將 Phase 7 產出的 ICrystalDNA 不可篡改報告注入至護照，
 * 驅動 5T 柱動態評分、段位進化、及封印資產管理。
 *
 * [Protocol] 5T Sentinel Protocol:
 *   Tangible   → Crystal 中有效 impactMetric 的比例
 *   Traceable  → 具備 sourceOrigin 的 Evidence 比例
 *   Trackable  → 具備完整 lifecycle 的 Evidence 比例
 *   Transparent→ 通過公式驗算的比例
 *   Trustworthy→ 已 Hash Lock 且封印的比例
 */

import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import omniLogger, { LogCategory } from '../utils/omniLogger.js';
import type { ICrystalDNA } from './OmniReportService.js';
import { EvidenceVaultService } from './EvidenceVaultService.js';

// ═══════════════════════════════════════════════════════════
// Type Definitions
// ═══════════════════════════════════════════════════════════

export interface PassportData {
    userId: string;
    score: number;
    rank: PassportRank;
    pillars: FiveTScores;
    sealedCrystals: SealedCrystalRecord[];
    lastUpdated: number;
}

/** 5T Pillar Scores (0-100 each) */
export interface FiveTScores {
    tangible: number;
    traceable: number;
    trackable: number;
    transparent: number;
    trustworthy: number;
}

/** Rank Tier */
export type PassportRank =
    | 'Bronze'
    | 'Silver'
    | 'Gold'
    | 'Platinum'
    | 'Diamond';

/** Sealed Crystal Record */
export interface SealedCrystalRecord {
    sealId: string;
    crystalUuid: string;
    crystalHash: string;
    domain: string;
    sealedAt: number;
    verified: boolean;
    signatures?: string[]; // Multi-Sig for Agent Verification
    verifiers?: string[];  // UUIDs of Agents/Humans who verified
    impactMetric?: string; // [Tangible] Concrete impact label for display
}

/** Full Passport State */
export interface PassportState {
    userId: string;
    score: number;
    rank: PassportRank;
    pillars: FiveTScores;
    sealedCrystals: SealedCrystalRecord[];
    lastUpdated: number;
}

// ═══════════════════════════════════════════════════════════
// In-memory Store (Beta: replaced by DB in production)
// ═══════════════════════════════════════════════════════════

const passportStore = new Map<string, PassportState>();
const crystalVault = new Map<string, ICrystalDNA[]>();

// ═══════════════════════════════════════════════════════════
// Service Implementation
// ═══════════════════════════════════════════════════════════

export class IntegrityPassportService {

    /**
     * 取得護照完整狀態
     * 若不存在則初始化空白護照。
     */
    static getPassport(userId: string): PassportState {
        if (!passportStore.has(userId)) {
            const initial: PassportState = {
                userId,
                score: 0,
                rank: 'Bronze',
                pillars: { tangible: 0, traceable: 0, trackable: 0, transparent: 0, trustworthy: 0 },
                sealedCrystals: [],
                lastUpdated: Date.now(),
            };
            passportStore.set(userId, initial);
            omniLogger.info(LogCategory.BUSINESS, `[IntegrityPassport] Initialized passport for ${userId}`);
        }
        return passportStore.get(userId)!;
    }

    /**
     * 封印 Crystal DNA 至護照
     * 驗證 Crystal 完整性後注入護照，重新計算 5T 柱評分與段位。
     * 支援 Multi-Sig (Agent 協作驗證)。
     */
    static sealCrystalToPassport(
        userId: string,
        crystal: ICrystalDNA,
        signatures?: string[],
        verifiers?: string[]
    ): PassportState {
        // ── Step 1: Verify Crystal Hash Integrity ──
        if (!crystal.hashLock) {
            throw new Error('[T5-Trustworthy] Crystal missing hashLock — cannot seal unverified data.');
        }

        const recomputedHash = IntegrityPassportService.computeCrystalHash(crystal);
        if (recomputedHash !== crystal.hashLock) {
            omniLogger.error(LogCategory.SECURITY, `[IntegrityPassport] Hash mismatch for Crystal ${crystal.uuid}`);
            throw new Error('[T5-Trustworthy] Crystal hash integrity check failed — data may be tampered.');
        }

        // ── Step 2: Get or Initialize Passport ──
        const passport = IntegrityPassportService.getPassport(userId);

        // ── Step 3: Prevent Duplicate Seals ──
        if (passport.sealedCrystals.some(s => s.crystalUuid === crystal.uuid)) {
            omniLogger.warn(LogCategory.BUSINESS, `[IntegrityPassport] Crystal ${crystal.uuid} already sealed.`);
            return passport;
        }

        // ── Step 4: Register Crystal in Vault ──
        if (!crystalVault.has(userId)) {
            crystalVault.set(userId, []);
        }
        crystalVault.get(userId)!.push(crystal);

        // ── Step 5: Create Seal Record ──
        const sealRecord: SealedCrystalRecord = {
            sealId: uuidv4(),
            crystalUuid: crystal.uuid,
            crystalHash: crystal.hashLock,
            domain: crystal.nature.domain,
            sealedAt: Date.now(),
            verified: true,
            signatures: signatures || [],
            verifiers: verifiers || []
        };
        passport.sealedCrystals.push(sealRecord);

        // ── Step 6: Recalculate Dynamic 5T Scores ──
        passport.pillars = IntegrityPassportService.calculatePillars(userId);
        passport.score = IntegrityPassportService.calculateOverallScore(passport.pillars);
        passport.rank = IntegrityPassportService.determineRank(passport.score);
        passport.lastUpdated = Date.now();

        passportStore.set(userId, passport);

        omniLogger.info(LogCategory.BUSINESS,
            `[IntegrityPassport] Crystal ${crystal.uuid.slice(0, 8)} sealed. ` +
            `Score: ${passport.score} → Rank: ${passport.rank}` +
            (verifiers ? ` (Verified by ${verifiers.length} Agents)` : '')
        );

        return passport;
    }

    /**
     * 從 EvidenceVault 創建並封印 Crystal
     * 這是 Phase 114 的核心功能：將用戶上傳的 Evidence 轉化為 Crystal DNA。
     */
    static sealEvidenceAsCrystal(
        userId: string,
        evidenceId: string
    ): PassportState {
        // 1. Fetch Evidence
        const evidence = EvidenceVaultService.getEvidence(evidenceId);
        if (!evidence) {
            throw new Error(`[IntegrityPassport] Evidence ${evidenceId} not found.`);
        }

        // 2. Verify Lock
        if (!evidence.lockResult || !evidence.lockResult.isLocked) {
            throw new Error(`[IntegrityPassport] Evidence ${evidenceId} is not sealed (Hash Lock missing).`);
        }

        // 3. Create Crystal DNA Wrapper
        const crystal: ICrystalDNA = {
            uuid: uuidv4(),
            genesis_timestamp: Date.now(),
            nature: {
                intent: 'EVIDENCE', // Fixed: Must be one of 'ESSENCE' | 'EVIDENCE' | 'ACTION' | 'INSIGHT'
                domain: this.mapCategoryToDomain(evidence.metadata.category),
                dnaMarkers: evidence.metadata.tags || []
            },
            resonance: {
                visibility: 'OMNI',
                integrityLevel: 100, // Locked evidence is 100% integrity
                isLocked: true,
                resonanceLevel: 85
            },
            payload: {
                narrative: `Crystallized evidence: ${evidence.metadata.fileName}`,
                quantitative: 100,
                evidenceVault: JSON.stringify([evidenceId]),
                tangibleLabel: evidence.metadata.subType || 'Verified Document'
            },
            hashLock: '' // Placeholder, computed next
        };

        // 4. Compute Crystal Hash (Self-Integrity)
        // The Evidence Lock Proof acts as the "Source of Truth" in the payload/nature, 
        // but the Crystal itself needs its own Hash Lock for the Passport to verify it.
        crystal.hashLock = this.computeCrystalHash(crystal);

        // 5. Seal to Passport
        return this.sealCrystalToPassport(userId, crystal);
    }

    /**
     * 動態計算 5T Pillar 分數
     * 基於該用戶所有已封印 Crystal DNA 的真實數據。
     */
    static calculatePillars(userId: string): FiveTScores {
        const crystals = crystalVault.get(userId) || [];
        const total = crystals.length;

        if (total === 0) {
            return { tangible: 0, traceable: 0, trackable: 0, transparent: 0, trustworthy: 0 };
        }

        // Tangible: Crystal 有 tangibleLabel 或 quantitative > 0 的比例
        const tangibleCount = crystals.filter(c =>
            (c.payload.tangibleLabel && c.payload.tangibleLabel.length > 0) ||
            c.payload.quantitative > 0
        ).length;

        // Traceable: 具有 evidenceVault 非空的 Crystal 比例
        const traceableCount = crystals.filter(c => {
            try {
                const ids = JSON.parse(c.payload.evidenceVault || '[]');
                return Array.isArray(ids) && ids.length > 0;
            } catch { return false; }
        }).length;

        // Trackable: 具有 genesis_timestamp 且 nature.dnaMarkers 非空
        const trackableCount = crystals.filter(c =>
            c.genesis_timestamp > 0 &&
            c.nature.dnaMarkers &&
            c.nature.dnaMarkers.length > 0
        ).length;

        // Transparent: 具有 resonance.integrityLevel >= 80 的比例
        const transparentCount = crystals.filter(c =>
            c.resonance.integrityLevel >= 80
        ).length;

        // Trustworthy: 已 Hash Lock  且 isLocked 的比例
        const trustworthyCount = crystals.filter(c =>
            c.hashLock && c.hashLock.length > 0 && c.resonance.isLocked
        ).length;

        return {
            tangible: Math.round((tangibleCount / total) * 100),
            traceable: Math.round((traceableCount / total) * 100),
            trackable: Math.round((trackableCount / total) * 100),
            transparent: Math.round((transparentCount / total) * 100),
            trustworthy: Math.round((trustworthyCount / total) * 100),
        };
    }

    /**
     * 計算綜合分數 (0-999)
     * 五柱等權加總，映射至 0-999 區間。
     */
    static calculateOverallScore(pillars: FiveTScores): number {
        const avg = (
            pillars.tangible +
            pillars.traceable +
            pillars.trackable +
            pillars.transparent +
            pillars.trustworthy
        ) / 5;
        // Map 0-100 average → 0-999 score
        return Math.min(999, Math.round(avg * 9.99));
    }

    /**
     * 段位進化引擎
     */
    static determineRank(score: number): PassportRank {
        if (score >= 800) return 'Diamond';
        if (score >= 600) return 'Platinum';
        if (score >= 400) return 'Gold';
        if (score >= 200) return 'Silver';
        return 'Bronze';
    }

    /**
     * 重新計算 Crystal Hash（用於驗證完整性）
     * 使用與 OmniReportService.generateCrystal 相同的邏輯。
     */
    static computeCrystalHash(crystal: ICrystalDNA): string {
        const raw = JSON.stringify({
            uuid: crystal.uuid,
            nature: crystal.nature,
            resonance: crystal.resonance,
            payload: crystal.payload,
            genesis_timestamp: crystal.genesis_timestamp,
        });
        return crypto.createHash('sha256').update(raw).digest('hex');
    }

    /**
     * Helper: Map EvidenceCategory to CrystalDomain
     */
    private static mapCategoryToDomain(category: string): 'ENVIRONMENT' | 'SOCIAL' | 'GOVERNANCE' | 'SENTIENCE' {
        const cat = category.toLowerCase();
        if (cat === 'environmental' || cat === 'carbon' || cat === 'energy' || cat === 'waste') return 'ENVIRONMENT';
        if (cat === 'social' || cat === 'employee' || cat === 'diversity') return 'SOCIAL';
        if (cat === 'governance' || cat === 'board' || cat === 'audit' || cat === 'compliance') return 'GOVERNANCE';
        if (cat === 'sentience' || cat === 'ai' || cat === 'innovation') return 'SENTIENCE';
        return 'GOVERNANCE'; // Default fallback
    }
}

// Export instance for easier usage if needed (optional)
export const integrityPassport = IntegrityPassportService;
