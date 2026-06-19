
import { OmniResonanceService } from '../server/services/OmniResonanceService.js';
import { initializeDatabase } from '../server/db/index.js';
import omniLogger from '../server/utils/omniLogger.js';

/**
 * 🧪 Verification Script: Phase 6 - Omni Resonance Service
 * --------------------------------------------------------
 * Verifies that the backend service correctly aggregates:
 * 1. 5T Evidence Integrity
 * 2. Behavioral Engagement
 * 3. System Health
 * And produces a valid Resonance Score.
 */
async function verifyResonance() {
    console.log('🔮 Starting Phase 6 Verification: Omni Resonance Service...');

    try {
        // 1. Initialize DB
        await initializeDatabase();
        console.log('✅ Database Initialized');

        // 2. Fetch Global Resonance
        console.log('🔍 Fetching Global Resonance...');
        const resonance = await OmniResonanceService.getGlobalResonance();

        console.log('\n💎 Resonance Result:');
        console.log(JSON.stringify(resonance, null, 2));

        // 3. Assertions
        if (typeof resonance.resonanceScore !== 'number') throw new Error('Invalid resonanceScore');
        if (resonance.resonanceScore < 0 || resonance.resonanceScore > 1.0) throw new Error('Resonance Score out of bounds');

        if (typeof resonance.integrity.totalEvidence !== 'number') throw new Error('Invalid totalEvidence');
        if (typeof resonance.engagement.dailyActiveEvents !== 'number') throw new Error('Invalid dailyActiveEvents');

        // Check State
        if (!['DORMANT', 'AWAKENING', 'RESONANT', 'ETERNAL'].includes(resonance.resonanceState)) {
            throw new Error(`Invalid State: ${resonance.resonanceState}`);
        }

        console.log('\n✨ Verification Successful: All resonance metrics are valid.');
        process.exit(0);

    } catch (error: any) {
        console.error('\n❌ Verification Failed:', error);
        process.exit(1);
    }
}

verifyResonance();
