import { omniCircleService } from '../server/services/OmniCircleService.js';
import redisService from '../server/services/redisService.js';
import omniLogger, { LogCategory } from '../server/utils/omniLogger.js';

async function verifyAwakening() {
    console.log('🚀 Starting OmniOne Awakening Verification...');

    // 1. Clear cache to ensure a fresh sync
    console.log('\n[STEP 1] Clearing Redis Cache...');
    await redisService.del('omni_one_state');
    console.log('✅ Cache cleared.');

    // 2. Initial Get (should trigger sync and MISS)
    console.log('\n[STEP 2] Fetching initial OmniOne state (Expect Redis MISS)...');
    const state1 = await omniCircleService.getOmniOneState();

    console.log('📊 Resulting State:');
    console.log(`   - ID: ${state1.id}`);
    console.log(`   - Awakening Fruit: ${state1.awakeningFruit}`);
    console.log(`   - Sync Status: ${state1.syncStatus}`);

    if (state1.awakeningFruit !== '無作妙德') {
        throw new Error(`❌ Awakening Fruit mismatch! Expected "無作妙德", got "${state1.awakeningFruit}"`);
    }
    console.log('✅ Awakening Fruit verified.');

    // 3. Cached Get (should be HIT)
    console.log('\n[STEP 3] Fetching cached OmniOne state (Expect Redis HIT)...');
    const startTime = Date.now();
    const state2 = await omniCircleService.getOmniOneState();
    const duration = Date.now() - startTime;

    console.log(`✅ Cached state retrieved in ${duration}ms.`);
    if (JSON.stringify(state1) !== JSON.stringify(state2)) {
        throw new Error('❌ Cached state does not match original state!');
    }
    console.log('✅ Redis consistency verified.');

    console.log('\n✨ OmniOne Awakening "無作妙德" verified successfully! ✨');
    process.exit(0);
}

verifyAwakening().catch(err => {
    console.error('\n❌ Verification failed:', err);
    process.exit(1);
});
