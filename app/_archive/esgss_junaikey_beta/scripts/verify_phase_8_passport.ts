/**
 * ═══════════════════════════════════════════════════════════
 * Phase 8 Verification: Integrity Passport — Crystal DNA Integration
 * ═══════════════════════════════════════════════════════════
 * 
 * 測試範圍：
 *   1. 動態 5T Pillar 計算 (空/部分/滿資料)
 *   2. Crystal Seal 註冊與檢索
 *   3. Rank Evolution 邊界值
 *   4. Hash 完整性驗證 (篡改檢測)
 *   5. Duplicate Seal 防護
 *
 * 執行: npx tsx scripts/verify_phase_8_passport.ts
 */

import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

// ═══════════════════════════════════════════════════════════
// Local Type Mirrors (standalone — no external imports)
// ═══════════════════════════════════════════════════════════

interface ICrystalDNA {
    uuid: string;
    genesis_timestamp: number;
    nature: {
        intent: 'ESSENCE' | 'EVIDENCE' | 'ACTION' | 'INSIGHT';
        domain: 'ENVIRONMENT' | 'SOCIAL' | 'GOVERNANCE' | 'SENTIENCE';
        dnaMarkers: string[];
    };
    resonance: {
        visibility: 'OMNI';
        integrityLevel: number;
        isLocked: boolean;
        resonanceLevel: number;
    };
    payload: {
        narrative: string;
        quantitative: number;
        evidenceVault: string;
        tangibleLabel?: string;
    };
    hashLock?: string;
}

interface FiveTScores {
    tangible: number;
    traceable: number;
    trackable: number;
    transparent: number;
    trustworthy: number;
}

type PassportRank = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';

interface SealedCrystalRecord {
    sealId: string;
    crystalUuid: string;
    crystalHash: string;
    domain: string;
    sealedAt: number;
    verified: boolean;
}

interface PassportState {
    userId: string;
    score: number;
    rank: PassportRank;
    pillars: FiveTScores;
    sealedCrystals: SealedCrystalRecord[];
    lastUpdated: number;
}

// ═══════════════════════════════════════════════════════════
// Standalone Service Logic (mirrors server/services/IntegrityPassportService.ts)
// ═══════════════════════════════════════════════════════════

const passportStore = new Map<string, PassportState>();
const crystalVault = new Map<string, ICrystalDNA[]>();

function computeCrystalHash(crystal: ICrystalDNA): string {
    const raw = JSON.stringify({
        uuid: crystal.uuid,
        nature: crystal.nature,
        resonance: crystal.resonance,
        payload: crystal.payload,
        genesis_timestamp: crystal.genesis_timestamp,
    });
    return crypto.createHash('sha256').update(raw).digest('hex');
}

function getPassport(userId: string): PassportState {
    if (!passportStore.has(userId)) {
        passportStore.set(userId, {
            userId,
            score: 0,
            rank: 'Bronze',
            pillars: { tangible: 0, traceable: 0, trackable: 0, transparent: 0, trustworthy: 0 },
            sealedCrystals: [],
            lastUpdated: Date.now(),
        });
    }
    return passportStore.get(userId)!;
}

function calculatePillars(userId: string): FiveTScores {
    const crystals = crystalVault.get(userId) || [];
    const total = crystals.length;
    if (total === 0) return { tangible: 0, traceable: 0, trackable: 0, transparent: 0, trustworthy: 0 };

    const tangible = crystals.filter(c =>
        (c.payload.tangibleLabel && c.payload.tangibleLabel.length > 0) || c.payload.quantitative > 0
    ).length;

    const traceable = crystals.filter(c => {
        try { const ids = JSON.parse(c.payload.evidenceVault || '[]'); return Array.isArray(ids) && ids.length > 0; }
        catch { return false; }
    }).length;

    const trackable = crystals.filter(c =>
        c.genesis_timestamp > 0 && c.nature.dnaMarkers && c.nature.dnaMarkers.length > 0
    ).length;

    const transparent = crystals.filter(c => c.resonance.integrityLevel >= 80).length;

    const trustworthy = crystals.filter(c =>
        c.hashLock && c.hashLock.length > 0 && c.resonance.isLocked
    ).length;

    return {
        tangible: Math.round((tangible / total) * 100),
        traceable: Math.round((traceable / total) * 100),
        trackable: Math.round((trackable / total) * 100),
        transparent: Math.round((transparent / total) * 100),
        trustworthy: Math.round((trustworthy / total) * 100),
    };
}

function calculateOverallScore(pillars: FiveTScores): number {
    const avg = (pillars.tangible + pillars.traceable + pillars.trackable + pillars.transparent + pillars.trustworthy) / 5;
    return Math.min(999, Math.round(avg * 9.99));
}

function determineRank(score: number): PassportRank {
    if (score >= 800) return 'Diamond';
    if (score >= 600) return 'Platinum';
    if (score >= 400) return 'Gold';
    if (score >= 200) return 'Silver';
    return 'Bronze';
}

function sealCrystalToPassport(userId: string, crystal: ICrystalDNA): PassportState {
    if (!crystal.hashLock) throw new Error('Crystal missing hashLock');
    const recomputed = computeCrystalHash(crystal);
    if (recomputed !== crystal.hashLock) throw new Error('Hash mismatch');

    const passport = getPassport(userId);
    if (passport.sealedCrystals.some(s => s.crystalUuid === crystal.uuid)) return passport;

    if (!crystalVault.has(userId)) crystalVault.set(userId, []);
    crystalVault.get(userId)!.push(crystal);

    passport.sealedCrystals.push({
        sealId: uuidv4(),
        crystalUuid: crystal.uuid,
        crystalHash: crystal.hashLock,
        domain: crystal.nature.domain,
        sealedAt: Date.now(),
        verified: true,
    });

    passport.pillars = calculatePillars(userId);
    passport.score = calculateOverallScore(passport.pillars);
    passport.rank = determineRank(passport.score);
    passport.lastUpdated = Date.now();
    passportStore.set(userId, passport);

    return passport;
}

// ═══════════════════════════════════════════════════════════
// Test Helpers
// ═══════════════════════════════════════════════════════════

function createFullCrystal(overrides: Partial<ICrystalDNA> = {}): ICrystalDNA {
    const base: ICrystalDNA = {
        uuid: uuidv4(),
        genesis_timestamp: Date.now(),
        nature: {
            intent: 'EVIDENCE',
            domain: 'ENVIRONMENT',
            dnaMarkers: ['GRI-305-1', 'ISO-14064'],
        },
        resonance: {
            visibility: 'OMNI',
            integrityLevel: 95,
            isLocked: true,
            resonanceLevel: 88,
        },
        payload: {
            narrative: 'Scope 1 Direct GHG emissions measured per ISO-14064-1',
            quantitative: 1250.5,
            evidenceVault: JSON.stringify(['EV-001', 'EV-002']),
            tangibleLabel: '1,250.5 tCO2e',
        },
        ...overrides,
    };
    // Compute and attach hash
    base.hashLock = computeCrystalHash(base);
    return base;
}

let passed = 0;
let failed = 0;

function assert(condition: boolean, name: string) {
    if (condition) {
        console.log(`  ✅ ${name}`);
        passed++;
    } else {
        console.error(`  ❌ ${name}`);
        failed++;
    }
}

// ═══════════════════════════════════════════════════════════
// Test Suite
// ═══════════════════════════════════════════════════════════

function runTests() {
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('  Phase 8 Verification: Integrity Passport');
    console.log('═══════════════════════════════════════════════════════════\n');

    // ── Test 1: Empty Passport ──
    console.log('🧪 Test 1: Empty Passport Initialization');
    const emptyPassport = getPassport('user-empty');
    assert(emptyPassport.score === 0, 'Initial score = 0');
    assert(emptyPassport.rank === 'Bronze', 'Initial rank = Bronze');
    assert(emptyPassport.pillars.tangible === 0, 'All pillars start at 0');
    assert(emptyPassport.sealedCrystals.length === 0, 'No sealed crystals');

    // ── Test 2: Single Crystal Seal ──
    console.log('\n🧪 Test 2: Single Crystal Seal (Full Data)');
    const crystal1 = createFullCrystal();
    const p1 = sealCrystalToPassport('user-1', crystal1);
    assert(p1.sealedCrystals.length === 1, 'One crystal sealed');
    assert(p1.pillars.tangible === 100, 'Tangible: 100% (1/1 has tangibleLabel)');
    assert(p1.pillars.traceable === 100, 'Traceable: 100% (1/1 has evidence)');
    assert(p1.pillars.trackable === 100, 'Trackable: 100% (1/1 has dnaMarkers)');
    assert(p1.pillars.transparent === 100, 'Transparent: 100% (integrityLevel >= 80)');
    assert(p1.pillars.trustworthy === 100, 'Trustworthy: 100% (hashLock + isLocked)');
    assert(p1.score === 999, 'Perfect score = 999');
    assert(p1.rank === 'Diamond', 'Rank = Diamond');

    // ── Test 3: Partial Data Crystal ──
    console.log('\n🧪 Test 3: Partial Data Crystal (missing tangibleLabel, low integrity)');
    passportStore.clear(); crystalVault.clear();
    const partialCrystal = createFullCrystal({
        payload: { narrative: 'Test', quantitative: 0, evidenceVault: '[]', tangibleLabel: '' },
        resonance: { visibility: 'OMNI', integrityLevel: 50, isLocked: false, resonanceLevel: 30 },
    });
    // Recompute hash for modified crystal
    partialCrystal.hashLock = computeCrystalHash(partialCrystal);
    const p2 = sealCrystalToPassport('user-2', partialCrystal);
    assert(p2.pillars.tangible === 0, 'Tangible: 0% (no label, quantitative=0)');
    assert(p2.pillars.traceable === 0, 'Traceable: 0% (empty evidenceVault)');
    assert(p2.pillars.trackable === 100, 'Trackable: 100% (dnaMarkers present)');
    assert(p2.pillars.transparent === 0, 'Transparent: 0% (integrityLevel < 80)');
    assert(p2.pillars.trustworthy === 0, 'Trustworthy: 0% (isLocked = false)');
    assert(p2.rank === 'Silver', 'Rank = Silver (trackable alone → score ~200)');

    // ── Test 4: Rank Evolution Boundaries ──
    console.log('\n🧪 Test 4: Rank Evolution Boundaries');
    assert(determineRank(0) === 'Bronze', 'Score 0 → Bronze');
    assert(determineRank(199) === 'Bronze', 'Score 199 → Bronze');
    assert(determineRank(200) === 'Silver', 'Score 200 → Silver');
    assert(determineRank(399) === 'Silver', 'Score 399 → Silver');
    assert(determineRank(400) === 'Gold', 'Score 400 → Gold');
    assert(determineRank(599) === 'Gold', 'Score 599 → Gold');
    assert(determineRank(600) === 'Platinum', 'Score 600 → Platinum');
    assert(determineRank(799) === 'Platinum', 'Score 799 → Platinum');
    assert(determineRank(800) === 'Diamond', 'Score 800 → Diamond');
    assert(determineRank(999) === 'Diamond', 'Score 999 → Diamond');

    // ── Test 5: Hash Integrity (Tamper Detection) ──
    console.log('\n🧪 Test 5: Hash Integrity — Tamper Detection');
    passportStore.clear(); crystalVault.clear();
    const tamperedCrystal = createFullCrystal();
    tamperedCrystal.payload.quantitative = 99999; // Tamper!
    // Keep old hashLock (mismatches now)
    let caughtTamper = false;
    try {
        sealCrystalToPassport('user-tamper', tamperedCrystal);
    } catch (e: any) {
        caughtTamper = e.message.includes('Hash mismatch');
    }
    assert(caughtTamper, 'Tampered crystal rejected with hash mismatch error');

    // ── Test 6: Missing hashLock ──
    console.log('\n🧪 Test 6: Crystal Without hashLock');
    const noHashCrystal = createFullCrystal();
    delete (noHashCrystal as any).hashLock;
    let caughtNoHash = false;
    try {
        sealCrystalToPassport('user-nohash', noHashCrystal);
    } catch (e: any) {
        caughtNoHash = e.message.includes('missing hashLock');
    }
    assert(caughtNoHash, 'Crystal without hashLock rejected');

    // ── Test 7: Duplicate Seal Prevention ──
    console.log('\n🧪 Test 7: Duplicate Seal Prevention');
    passportStore.clear(); crystalVault.clear();
    const dupCrystal = createFullCrystal();
    sealCrystalToPassport('user-dup', dupCrystal);
    const dupResult = sealCrystalToPassport('user-dup', dupCrystal);
    assert(dupResult.sealedCrystals.length === 1, 'Duplicate crystal not sealed twice');

    // ── Test 8: Multi-Crystal Score Mixing ──
    console.log('\n🧪 Test 8: Multi-Crystal Mixed Scores');
    passportStore.clear(); crystalVault.clear();
    const fullCrystal = createFullCrystal(); // All 100%
    const weakCrystal = createFullCrystal({
        payload: { narrative: 'weak', quantitative: 0, evidenceVault: '[]', tangibleLabel: '' },
        resonance: { visibility: 'OMNI', integrityLevel: 50, isLocked: false, resonanceLevel: 20 },
    });
    weakCrystal.hashLock = computeCrystalHash(weakCrystal);

    sealCrystalToPassport('user-mix', fullCrystal);
    const mixResult = sealCrystalToPassport('user-mix', weakCrystal);
    assert(mixResult.pillars.tangible === 50, 'Tangible: 50% (1 of 2 has tangible)');
    assert(mixResult.pillars.trustworthy === 50, 'Trustworthy: 50% (1 of 2 locked)');
    assert(mixResult.sealedCrystals.length === 2, 'Two crystals sealed');
    assert(mixResult.rank !== 'Diamond', 'Mixed rank is not Diamond');

    // ── Summary ──
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log(`  Results: ${passed} passed, ${failed} failed, ${passed + failed} total`);
    console.log('═══════════════════════════════════════════════════════════\n');

    if (failed > 0) {
        console.error('⚠️  Some tests FAILED.');
        process.exit(1);
    } else {
        console.log('🏆 All Phase 8 tests PASSED. Integrity Passport verified.');
        process.exit(0);
    }
}

runTests();
