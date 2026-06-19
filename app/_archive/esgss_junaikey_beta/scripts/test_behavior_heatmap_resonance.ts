import { BehavioralTrackingService } from '../server/services/BehavioralTrackingService.js';
import { HeatmapService } from '../server/services/HeatmapService.js';
import { junAiKeyService as celestialService } from '../server/services/JunAiKeyService.js';
import omniLogger, { LogCategory } from '../server/utils/omniLogger.js';

/**
 * scripts/test_behavior_heatmap_resonance.ts
 * Verification of Phase 11: Behavioral Intelligence & Heatmap Orchestration
 */

async function runVerification() {
    console.log('--- Phase 11 Verification Starting ---');

    try {
        // 1. Test Behavioral Tracking
        console.log('\n[1/3] Testing Behavioral Tracking...');
        await BehavioralTrackingService.track({
            userId: 'test-user-uuid',
            eventType: 'verification_passed',
            pageUrl: '/dashboard/test',
            metadata: { step: 11, status: 'verifying' }
        });
        console.log('✅ Behavioral event tracked (Check logs for dataHash)');

        // 2. Test Heatmap Aggregation
        console.log('\n[2/3] Testing Heatmap Aggregation...');
        const heatmap = await HeatmapService.getBehavioralHeatmap();
        console.log(`✅ Heatmap generated with ${heatmap.length} points.`);
        console.table(heatmap.slice(0, 5));

        // 3. Test Celestial Resonance Loop (9D Integration)
        console.log('\n[3/3] Testing Celestial Resonance Loop...');
        const stream = await celestialService.interact({
            agentId: '00000000-0000-0000-0000-000000000001', // Example agent ID
            message: 'What is the current system health state?'
        });
        console.log('✅ Celestial interaction initiated with 9D resonance context.');

        console.log('\n--- Phase 11 Verification Complete! ---');
    } catch (error) {
        console.error('\n❌ Verification failed:', error);
    }
}

runVerification();
