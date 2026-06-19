import * as dotenv from 'dotenv';
import { join } from 'path';

// 1. Set environment variables BEFORE any other imports
dotenv.config({ path: '.env.local' });
dotenv.config();

process.env.NCB_API_TOKEN = process.env.NCB_API_TOKEN || process.env.NCB_SECRET_KEY || '0ea9096eeb5f972d26b32782969028342635a6980ab088c42150379911e0788f';
process.env.NCB_DATA_API_URL = process.env.NCB_DATA_API_URL || 'https://openapi.nocodebackend.com';
process.env.NCB_INSTANCE = process.env.NCB_INSTANCE || '54686_esg_junaikey_db';

/**
 * 🧪 Phase 22 Verification: Integrity Passport Rank Evolution Engine
 * --------------------------------------------------
 * Validates that users advance in rank only when meeting BOTH
 * score and crystal count requirements.
 */

async function testPhase22() {
    // 2. Dynamic imports to ensure process.env is ready
    const { IntegrityPassportService } = await import('../src/services/IntegrityPassportService.js');
    const { ncb } = await import('../src/lib/ncb/client.js');
    const { default: omniLogger, LogCategory } = await import('../server/utils/omniLogger.js');

    omniLogger.info(LogCategory.SYSTEM, '🚀 Starting Phase 22 Verification: Rank Evolution Engine');

    const testUserId = `test-user-${Date.now()}`;
    const testEmail = `evolver-${Date.now()}@example.com`;

    try {
        // 0. Create Test User (Mandatory for Foreign Key)
        omniLogger.info(LogCategory.BUSINESS, `Step 0: Creating test user: ${testUserId}`);
        const { error: userError } = await ncb.from('ncba_user').insert({
            id: testUserId,
            name: 'Rank Evolver Test',
            email: testEmail
        });
        if (userError) throw new Error(`Failed to create test user: ${JSON.stringify(userError)}`);

        // 1. Initial State Check (Bronze)
        omniLogger.info(LogCategory.BUSINESS, 'Step 1: Checking initial rank (Expected: Bronze)');
        let passport = await IntegrityPassportService.getPassport(testUserId);

        omniLogger.info(LogCategory.BUSINESS, `Current Rank: ${passport.rank}, Score: ${passport.score}, Crystals: ${passport.sealedCrystals.length}`);

        if (passport.rank !== 'Bronze') {
            throw new Error(`Initial rank should be Bronze, but got ${passport.rank}`);
        }

        // 2. Simulate High Score but 0 Crystals (Should stay Bronze)
        omniLogger.info(LogCategory.BUSINESS, 'Step 2: Injecting high-quality readings without hash_lock (High Score, 0 Crystals)');

        // We need score >= 200 to reach Silver, but Silver also needs 1 Crystal.
        // score = avg(pillars) * 10. pillars are % of readings meeting criteria.
        // If we inject 5 readings with all fields except hash_lock:
        // tangible=100, traceable=100, trackable=100, transparent=100, trustworthy=0.
        // avg = 80. score = 800.
        for (let i = 0; i < 5; i++) {
            const { error } = await ncb.from('esg_readings').insert({
                uuid: `read-${testUserId}-${i}`,
                user_id: testUserId,
                metric_id: 'ENV_SCORE',
                org_unit_id: 'ORG_001',
                value: 100,
                data_source: 'VERIFIED_SYSTEM',
                period_start: new Date().toISOString().replace('T', ' ').replace(/\..+/, ''),
                verified_at: new Date().toISOString().replace('T', ' ').replace(/\..+/, ''),
                approved_at: new Date().toISOString().replace('T', ' ').replace(/\..+/, '')
            });
            if (error) throw new Error(`Failed to insert reading ${i}: ${JSON.stringify(error)}`);
        }

        passport = await IntegrityPassportService.getPassport(testUserId);
        omniLogger.info(LogCategory.BUSINESS, `Updated Rank: ${passport.rank}, Score: ${passport.score}, Crystals: ${passport.sealedCrystals.length}`);

        if (passport.rank !== 'Bronze') {
            throw new Error(`Rank should still be Bronze with 0 crystals, but got ${passport.rank}`);
        }

        // 3. Evolve to Silver (Seal 1 Crystal)
        omniLogger.info(LogCategory.BUSINESS, 'Step 3: Sealing 1 Crystal (Expected Evolution: Silver)');
        // sealEvidenceAsCrystal uses OmniDataAdapter which needs a valid UCC-like object or ID.
        // It injects a reading with hash_lock.
        await IntegrityPassportService.sealEvidenceAsCrystal(testUserId, `crystal-${testUserId}-1`);

        passport = await IntegrityPassportService.getPassport(testUserId);
        omniLogger.info(LogCategory.BUSINESS, `Updated Rank: ${passport.rank}, Score: ${passport.score}, Crystals: ${passport.sealedCrystals.length}`);

        if (passport.rank !== 'Silver') {
            throw new Error(`Rank should be Silver with 1 crystal and sufficient score, but got ${passport.rank}`);
        }

        // 4. Evolve to Gold (Score >= 400 + 3 Crystals)
        omniLogger.info(LogCategory.BUSINESS, 'Step 4: Sealing more crystals to reach Gold...');
        await IntegrityPassportService.sealEvidenceAsCrystal(testUserId, `crystal-${testUserId}-2`);
        await IntegrityPassportService.sealEvidenceAsCrystal(testUserId, `crystal-${testUserId}-3`);

        passport = await IntegrityPassportService.getPassport(testUserId);
        omniLogger.info(LogCategory.BUSINESS, `Updated Rank: ${passport.rank}, Score: ${passport.score}, Crystals: ${passport.sealedCrystals.length}`);

        if (passport.rank !== 'Gold') {
            throw new Error(`Rank should be Gold with 3 crystals and sufficient score, but got ${passport.rank}`);
        }

        // 5. Verify Evolution History
        omniLogger.info(LogCategory.BUSINESS, 'Step 5: Verifying evolution history length...');
        if (passport.evolutionHistory.length < 2) {
            throw new Error(`Evolution history should have at least 2 entries (Bronze->Silver, Silver->Gold), but got ${passport.evolutionHistory.length}`);
        }

        passport.evolutionHistory.forEach(ev => {
            omniLogger.info(LogCategory.BUSINESS, `  - ${ev.previousRank} -> ${ev.newRank} Score: ${ev.scoreAtEvolution} at ${new Date(ev.evolvedAt).toLocaleTimeString()}`);
        });

        omniLogger.info(LogCategory.SYSTEM, '✨ Phase 22 Verification Passed!');

    } catch (err: any) {
        omniLogger.error(LogCategory.SYSTEM, `❌ Verification Failed: ${err.message}`);
        if (err.stack) console.error(err.stack);
        process.exit(1);
    }
}

testPhase22();
