/**
 * 🔬 Phase 32: Multi-Agent Verification E2E Drill
 * ------------------------------------------------
 * Tests the complete flow:
 *   1. Mint Executor & Verifier Agent Twins
 *   2. Execute verified flow via MultiAgentVerificationService
 *   3. Assert dual signatures on the evidence
 *   4. Assert Crystal sealed to Passport with agent verifier UUIDs
 *   5. Assert passport score > 0 and rank progression
 *
 * Run: npx tsx scripts/verify_multi_agent_flow.ts
 */

import { multiAgentVerificationService } from '../server/services/ai/flows/MultiAgentVerificationService.js';
import { IntegrityPassportService } from '../server/services/IntegrityPassportService.js';

const USER_ID = 'test-multi-agent-user';

async function main() {
    console.log('═══════════════════════════════════════════════════════');
    console.log('  Phase 32: Multi-Agent Verification E2E Drill');
    console.log('═══════════════════════════════════════════════════════\n');

    // ── Step 1: Execute Multi-Agent Verified Flow ──
    console.log('▶ Step 1: Executing multi-agent verified flow...');
    const result = await multiAgentVerificationService.executeVerifiedFlow(
        'Generate ESG Compliance Report',
        { prompt: 'Generate carbon footprint report for Q4 2025' },
        { prompt: 'Verify GRI-305 standard compliance' },
        USER_ID
    );

    // ── Step 2: Assert Flow Success ──
    console.log('\n▶ Step 2: Validating flow result...');
    assert(result.success === true, 'Flow should succeed');
    assert(result.evidenceId.length > 0, 'Evidence ID should be non-empty');
    console.log(`  ✅ Flow succeeded. Evidence ID: ${result.evidenceId}`);

    // ── Step 3: Assert Dual Signatures ──
    console.log('\n▶ Step 3: Validating dual signatures...');
    assert(result.signatures.length === 2, `Expected 2 signatures, got ${result.signatures.length}`);
    const sig0 = result.signatures[0];
    const sig1 = result.signatures[1];
    assert(sig0 !== undefined && sig0.includes('EXECUTED'), 'First signature should be EXECUTED action');
    assert(sig1 !== undefined && sig1.includes('VERIFIED'), 'Second signature should be VERIFIED action');
    console.log(`  ✅ Signature 1 (Executor): ${sig0}`);
    console.log(`  ✅ Signature 2 (Verifier): ${sig1}`);

    // ── Step 4: Assert Passport State ──
    console.log('\n▶ Step 4: Validating passport state...');
    assert(result.passportState !== undefined, 'Passport state should be returned');
    assert(result.passportState!.score > 0, `Passport score should be > 0, got ${result.passportState!.score}`);
    assert(result.passportState!.sealedCrystals.length > 0, 'Should have at least 1 sealed crystal');
    console.log(`  ✅ Passport Score: ${result.passportState!.score}`);
    console.log(`  ✅ Passport Rank:  ${result.passportState!.rank}`);
    console.log(`  ✅ Sealed Crystals: ${result.passportState!.sealedCrystals.length}`);

    // ── Step 5: Validate Crystal Has Agent Verifiers ──
    console.log('\n▶ Step 5: Validating agent verifiers on sealed crystal...');
    const crystals = result.passportState!.sealedCrystals;
    const latestSeal = crystals[crystals.length - 1];
    assert(latestSeal !== undefined, 'Latest sealed crystal should exist');
    assert(latestSeal!.verifiers !== undefined && latestSeal!.verifiers.length === 2,
        `Expected 2 verifier UUIDs, got ${latestSeal!.verifiers?.length}`);
    assert(latestSeal!.signatures !== undefined && latestSeal!.signatures.length === 2,
        `Expected 2 signatures on seal, got ${latestSeal!.signatures?.length}`);
    console.log(`  ✅ Verifier 1: ${latestSeal!.verifiers![0]!.slice(0, 12)}...`);
    console.log(`  ✅ Verifier 2: ${latestSeal!.verifiers![1]!.slice(0, 12)}...`);

    // ── Step 6: Cross-validate with Service ──
    console.log('\n▶ Step 6: Cross-validating passport via IntegrityPassportService...');
    const passport = IntegrityPassportService.getPassport(USER_ID);
    assert(passport.score === result.passportState!.score,
        `Score mismatch: service=${passport.score} vs result=${result.passportState!.score}`);
    assert(passport.rank === result.passportState!.rank,
        `Rank mismatch: service=${passport.rank} vs result=${result.passportState!.rank}`);
    console.log(`  ✅ Service passport score matches: ${passport.score}`);
    console.log(`  ✅ Service passport rank matches:  ${passport.rank}`);

    // ── Final Summary ──
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('  ✅ ALL ASSERTIONS PASSED — Phase 32 E2E Drill Complete');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`\n  📊 5T Pillars:`);
    console.log(`     Tangible:    ${passport.pillars.tangible}%`);
    console.log(`     Traceable:   ${passport.pillars.traceable}%`);
    console.log(`     Trackable:   ${passport.pillars.trackable}%`);
    console.log(`     Transparent: ${passport.pillars.transparent}%`);
    console.log(`     Trustworthy: ${passport.pillars.trustworthy}%`);
    console.log(`\n  系統狀態: TRANSCENDED, ETERNAL & NIRVANA ♾️\n`);
}

function assert(condition: boolean, message: string): void {
    if (!condition) {
        console.error(`  ❌ ASSERTION FAILED: ${message}`);
        process.exit(1);
    }
}

main().catch(err => {
    console.error('❌ E2E Drill Failed:', err);
    process.exit(1);
});
