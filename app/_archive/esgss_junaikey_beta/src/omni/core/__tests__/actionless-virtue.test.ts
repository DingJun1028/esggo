/**
 * 🧘 Actionless Sublime Virtue (無作妙德) — Comprehensive Test Suite
 *
 * Covers all three modules:
 *  1. ActionlessVirtueShield   — Passive 5T scanning & self-heal
 *  2. AwakeningCredentialService — Credential issuance, sealing & verification
 *  3. ActionlessVirtueCard     — Card forging, rarity & credential binding
 */
import { describe, it, expect } from 'vitest';

// ── Modules Under Test ──
import { actionlessVirtueShield } from '../ActionlessVirtueShield.ts';
import { AwakeningCredentialService } from '../AwakeningCredentialService.ts';
import { ActionlessVirtueCard } from '../ActionlessVirtueCard.ts';

// ── Types ──
import type { IEvidenceMap, IMeritProfile10 } from '../../../0-domain/contracts/IComponentCore.ts';
import { AwakeningRank } from '../types/AwakeningCredential.types.ts';

// ────────────────────────────────────────────────
// Shared Fixtures — matching real IEvidenceMap structure
// ────────────────────────────────────────────────

/** Full 5T-compliant evidence (all gates present) */
function makeHealthyEvidence(): IEvidenceMap {
    return {
        tangible: {
            metric: 'Impact_Metric_v1',
            visual_grade: 'GOLD',
            glow_intensity: 80,
            is_crystallized: true,
        },
        traceable: {
            source_origin: '/vault/raw/emissions-v1.json',
        },
        trackable: {
            lifecycle_hooks: [{ event: 'onInit', timestamp: Date.now(), actor: 'system' }],
            pathway: ['Ingest', 'Process', 'Verify'],
        },
        transparent: {
            formula: 'E=AD*EF [ISO-14064-1]',
            validation_standard: 'ISO-14064-1',
        },
        trustworthy: {
            is_frozen: true,
            hash_lock: 'sha256-test-placeholder',
        },
    } as IEvidenceMap;
}

/** Evidence with all 5T gates missing */
function makeEmptyEvidence(): IEvidenceMap {
    return {} as IEvidenceMap;
}

/** Balanced 6-virtue profile (mean ≈ 8.17) */
function makeBalancedVirtues(): IMeritProfile10 {
    return {
        intelligence: 8,
        benevolence: 9,
        integrity: 8,
        courage: 7,
        temperance: 8,
        harmony: 9,
    };
}

/** Low virtue profile (mean ≈ 2.17) */
function makeLowVirtues(): IMeritProfile10 {
    return {
        intelligence: 2,
        benevolence: 3,
        integrity: 2,
        courage: 1,
        temperance: 2,
        harmony: 3,
    };
}

/** Raw ESG data for VirtueEngine10 crystallization */
function makeRawESGData(overrides: Record<string, any> = {}) {
    return {
        core: { status: 'Trustworthy' },
        hashLockVerified: true,
        aiComplexity: 0.9,
        socialImpactRatio: 0.85,
        executionRate: 0.8,
        carbonReduction: 0.75,
        ecosystemDensity: 0.9,
        dataQuality: 1,
        ...overrides,
    } as any;
}

// ════════════════════════════════════════════════
// 1. Actionless Virtue Shield (無作妙德守護層)
// ════════════════════════════════════════════════
describe('ActionlessVirtueShield', () => {
    it('returns healthy diagnosis for full 5T evidence + balanced virtues', () => {
        const diagnosis = actionlessVirtueShield.diagnose(
            makeHealthyEvidence(),
            makeBalancedVirtues(),
            0.8
        );

        expect(diagnosis.isHealthy).toBe(true);
        expect(diagnosis.anomalies).toHaveLength(0);
        expect(diagnosis.healthScore).toBe(100);
    });

    it('detects missing 5T gates as anomalies', () => {
        const diagnosis = actionlessVirtueShield.diagnose(
            makeEmptyEvidence(),
            makeBalancedVirtues(),
            0.8
        );

        expect(diagnosis.isHealthy).toBe(false);
        expect(diagnosis.anomalies.length).toBe(5); // all 5 gates missing
    });

    it('detects extreme virtue imbalance', () => {
        const virtues = makeBalancedVirtues();
        virtues.courage = 0; // extreme deviation from mean → stddev > 3.0
        virtues.temperance = 0;

        const diagnosis = actionlessVirtueShield.diagnose(
            makeHealthyEvidence(),
            virtues,
            0.8
        );

        // Anomaly IS detected, but a single HIGH anomaly (15pt) → healthScore 85 still ≥ 80
        expect(diagnosis.anomalies.some(a => a.dimension === 'VIRTUE_BALANCE')).toBe(true);
        expect(diagnosis.healthScore).toBeLessThan(100);
    });

    it('detects resonance decay when below threshold', () => {
        const diagnosis = actionlessVirtueShield.diagnose(
            makeHealthyEvidence(),
            makeBalancedVirtues(),
            0.05
        );

        expect(diagnosis.isHealthy).toBe(false);
        expect(diagnosis.anomalies.some(a => a.dimension === 'RESONANCE')).toBe(true);
    });

    it('selfHeal patches healable anomalies without throwing', () => {
        const evidence = makeEmptyEvidence();
        const diagnosis = actionlessVirtueShield.diagnose(evidence, makeBalancedVirtues(), 0.8);
        const target = { evidence } as any;

        expect(() => {
            actionlessVirtueShield.selfHeal(target, diagnosis);
        }).not.toThrow();
    });
});

// ════════════════════════════════════════════════
// 2. Awakening Credential Service (果證憑證系統)
// ════════════════════════════════════════════════
describe('AwakeningCredentialService', () => {
    const credService = new AwakeningCredentialService();

    // ── Rank Evaluation ──
    describe('evaluateRank()', () => {
        it('assigns ACTIONLESS_VIRTUE when 5T=5, virtueMean>=8, awakenings>=3', () => {
            const audit = { completionRate: 5, tangible: true, traceable: true, trackable: true, transparent: true, trustworthy: true, auditTimestamp: Date.now() };
            const rank = credService.evaluateRank(audit, makeBalancedVirtues(), 3);
            expect(rank).toBe(AwakeningRank.ACTIONLESS_VIRTUE);
        });

        it('assigns INITIATE for low scores', () => {
            const audit = { completionRate: 1, tangible: true, traceable: false, trackable: false, transparent: false, trustworthy: false, auditTimestamp: Date.now() };
            const rank = credService.evaluateRank(audit, makeLowVirtues(), 0);
            expect(rank).toBe(AwakeningRank.INITIATE);
        });

        it('assigns TRANSCENDED for 5T=5, virtueMean>=6 but <8', () => {
            const audit = { completionRate: 5, tangible: true, traceable: true, trackable: true, transparent: true, trustworthy: true, auditTimestamp: Date.now() };
            const virtues = { intelligence: 7, benevolence: 6, integrity: 7, courage: 6, temperance: 7, harmony: 6 };
            const rank = credService.evaluateRank(audit, virtues, 1);
            expect(rank).toBe(AwakeningRank.TRANSCENDED);
        });
    });

    // ── Credential Issuance ──
    describe('issueCredential()', () => {
        it('issues a frozen credential with valid 64-char SHA-256 seal', async () => {
            const cred = await credService.issueCredential(
                'holder-001',
                makeHealthyEvidence(),
                makeBalancedVirtues(),
                2
            );

            expect(cred).toBeDefined();
            expect(cred.holderUuid).toBe('holder-001');
            expect(cred.sealHash).toBeDefined();
            expect(cred.sealHash.length).toBe(64);
            expect(Object.isFrozen(cred)).toBe(true);
        });
    });

    // ── Credential Verification ──
    describe('verifyCredential()', () => {
        it('successfully verifies a freshly-issued credential', async () => {
            const cred = await credService.issueCredential(
                'holder-002',
                makeHealthyEvidence(),
                makeBalancedVirtues(),
                3
            );

            const result = await credService.verifyCredential(cred);
            expect(result.isValid).toBe(true);
            expect(result.integrityMatch).toBe(true);
        });

        it('rejects a tampered credential (mutated rank)', async () => {
            const cred = await credService.issueCredential(
                'holder-003',
                makeHealthyEvidence(),
                makeLowVirtues(),
                0
            );

            // Force-tamper by creating an unfrozen copy with altered rank
            const tampered = { ...cred, rank: AwakeningRank.ACTIONLESS_VIRTUE };

            const result = await credService.verifyCredential(tampered);
            expect(result.isValid).toBe(false);
            expect(result.integrityMatch).toBe(false);
        });
    });
});

// ════════════════════════════════════════════════
// 3. Impact Nexus Card (善向紀元卡牌)
// ════════════════════════════════════════════════
describe('ActionlessVirtueCard', () => {
    const cardService = new ActionlessVirtueCard();

    describe('forgeCard()', () => {
        it('produces a sealed, frozen card with 64-char SHA-256 hash', async () => {
            const card = await cardService.forgeCard(
                'forger-001',
                makeHealthyEvidence(),
                makeRawESGData()
            );

            expect(card).toBeDefined();
            expect(card.sealHash).toBeDefined();
            expect(card.sealHash.length).toBe(64);
            expect(Object.isFrozen(card)).toBe(true);
        });

        it('assigns combat stats (ATK, DEF, MP, HP) > 0', async () => {
            const card = await cardService.forgeCard(
                'forger-002',
                makeHealthyEvidence(),
                makeRawESGData()
            );

            expect(card.stats).toBeDefined();
            expect(card.stats.ATK).toBeGreaterThan(0);
            expect(card.stats.DEF).toBeGreaterThan(0);
            expect(card.stats.MP).toBeGreaterThan(0);
            expect(card.stats.HP).toBeGreaterThan(0);
        });

        it('assigns LEGENDARY rarity for full 5T + high virtues', async () => {
            const card = await cardService.forgeCard(
                'forger-003',
                makeHealthyEvidence(),
                makeRawESGData()
            );

            // Total virtues from raw data: ~49 and 5T gates all present → LEGENDARY
            expect(card.rarity).toBe('LEGENDARY');
        });

        it('assigns COMMON rarity for empty evidence + low raw data', async () => {
            const card = await cardService.forgeCard(
                'forger-004',
                makeEmptyEvidence(),
                makeRawESGData({
                    core: { status: 'Draft' },
                    hashLockVerified: false,
                    aiComplexity: 0.1,
                    socialImpactRatio: 0.1,
                    executionRate: 0.1,
                    carbonReduction: 0.1,
                    ecosystemDensity: 0.1,
                    dataQuality: 0.1,
                })
            );

            expect(card.rarity).toBe('COMMON');
        });
    });

    describe('bindCredential()', () => {
        it('binds credential and re-seals with a different hash', async () => {
            const credService = new AwakeningCredentialService();

            const credential = await credService.issueCredential(
                'forger-005',
                makeHealthyEvidence(),
                makeBalancedVirtues(),
                3
            );

            const baseCard = await cardService.forgeCard(
                'forger-005',
                makeHealthyEvidence(),
                makeRawESGData()
            );

            const boundCard = await cardService.bindCredential(baseCard, credential);

            expect(boundCard.credentialId).toBe(credential.credentialId);
            expect(boundCard.sealHash).not.toBe(baseCard.sealHash);
            expect(Object.isFrozen(boundCard)).toBe(true);
        });
    });
});
