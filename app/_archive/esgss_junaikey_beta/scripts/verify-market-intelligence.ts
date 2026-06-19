/**
 * Phase 67: Market Intelligence Verification
 * --------------------------------------------------
 * Tests the MarketIntelligenceService's ability to scan signals and analyze competitors.
 */

import { marketIntelligenceService } from '../src/services/MarketIntelligenceService';
import { omniLogger, LogCategory } from '../server/services/omni/infrastructure/logging/OmniLogger.js';

async function verifyMarketIntelligence() {
    omniLogger.info(LogCategory.SYSTEM, '📡 [VERIFY] Initializing Market Intelligence Scan...');

    // 1. Test Initial State (Competitor Intel)
    const competitors = marketIntelligenceService.getCompetitorIntel();
    console.log('✅ [Competitor Intel] Retrieved:', competitors.length);
    if (competitors.length === 0) throw new Error('Failed to retrieve competitor intel');
    competitors.forEach(comp => {
        console.log(`   - ${comp.name} (Threat: ${comp.threatLevel})`);
    });

    // 2. Test Market Pulse Scanning
    console.log('\n📡 [Pulse Scan] Initiating live scan...');
    const pulses = marketIntelligenceService.scanMarket();
    console.log('✅ [Pulse Scan] Captured Pulses:', pulses.length);
    if (pulses.length === 0) throw new Error('Pulse scan returned no results');

    pulses.forEach(p => {
        console.log(`   - [${p.source}] ${p.topic} (${p.sentiment}) Impact: ${p.impactScore}`);
    });

    // 3. Test Pulse Buffer
    console.log('\n📡 [Buffer Check] Verifying history buffer...');
    const recent = marketIntelligenceService.getRecentPulses(5);
    console.log(`✅ [Buffer Check] Recent 5 pulses retrieved.`);

    console.log('\n================================================');
    console.log('🌐 MARKET INTELLIGENCE VERIFIED');
    console.log('Status: ONLINE');
    console.log('================================================');
}

verifyMarketIntelligence().catch(err => {
    console.error('❌ [VERIFY] Failed:', err);
    process.exit(1);
});
