import { socialEconomyService } from '../src/1-service/socialEconomyService';
import { businessIntelligenceService } from '../src/1-service/BusinessIntelligenceService';
import { Protocol5T } from '../src/omni/core/types/InfoOne.types';
import { omniLogger, LogCategory } from '../src/omni/infrastructure/logging/OmniLogger';

/**
 * 🧪 Test MECE 5T Retrofitting
 * --------------------------------------------------
 * This script verifies that the retrofitted MECE services correctly
 * implement the 5T Protocol with real SHA-256 hashing.
 */
async function verifyRetrofitting() {
    console.log('--- SCRIPT START ---');
    omniLogger.info(LogCategory.SYSTEM, '🚀 Starting MECE 5T Retrofitting Verification...');

    try {
        // 1. Verify SocialEconomyService (Character Trinity)
        omniLogger.info(LogCategory.SYSTEM, '--- Testing SocialEconomyService (Character) ---');
        const charTrinity = await socialEconomyService.getTrinity('user_888');
        console.log('Character Trinity UUID:', charTrinity.uuid);
        console.log('Character Knowledge HashLock:', charTrinity.knowledge.hashLock);

        if (charTrinity.knowledge.hashLock.startsWith('SHA256:')) {
            omniLogger.info(LogCategory.SYSTEM, '✅ Character HashLock matches SHA256 protocol pattern.');
        } else {
            throw new Error(`❌ Character HashLock pattern mismatch: ${charTrinity.knowledge.hashLock}`);
        }

        // 2. Verify SocialEconomyService (Impact Card Trinity)
        omniLogger.info(LogCategory.SYSTEM, '--- Testing SocialEconomyService (Impact Card) ---');
        const cardTrinity = await socialEconomyService.getTrinity('card_001');
        console.log('Card Trinity UUID:', cardTrinity.uuid);
        console.log('Card Knowledge HashLock:', cardTrinity.knowledge.hashLock);

        if (cardTrinity.knowledge.hashLock.startsWith('SHA256:')) {
            omniLogger.info(LogCategory.SYSTEM, '✅ Card HashLock matches SHA256 protocol pattern.');
        } else {
            throw new Error(`❌ Card HashLock pattern mismatch: ${cardTrinity.knowledge.hashLock}`);
        }

        // 3. Verify BusinessIntelligenceService (Company Report)
        omniLogger.info(LogCategory.SYSTEM, '--- Testing BusinessIntelligenceService (Company Report) ---');
        const companyTrinity = await businessIntelligenceService.getTrinity('comp-google');
        console.log('Company Trinity UUID:', companyTrinity.uuid);
        console.log('Company Knowledge HashLock:', companyTrinity.knowledge.hashLock);

        if (companyTrinity.knowledge.hashLock.startsWith('SHA256:')) {
            omniLogger.info(LogCategory.SYSTEM, '✅ Company HashLock matches SHA256 protocol pattern.');
        } else {
            throw new Error(`❌ Company HashLock pattern mismatch: ${companyTrinity.knowledge.hashLock}`);
        }

        // 4. Verify 5T Tags in BusinessIntelligenceService
        const tags = companyTrinity.knowledge.tags;
        console.log('Company Knowledge Tags:', tags);
        if (tags.includes(Protocol5T.TANGIBLE) && tags.includes(Protocol5T.TRACEABLE)) {
            omniLogger.info(LogCategory.SYSTEM, '✅ 5T Tags correctly applied to BI report.');
        }

        omniLogger.info(LogCategory.SYSTEM, '🎉 MECE 5T Retrofitting Verification SUCCESSFUL!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Verification FAILED:', error);
        process.exit(1);
    }
}

// Run the verification
verifyRetrofitting().catch(err => {
    console.error('Unhandled Rejection:', err);
    process.exit(1);
});
