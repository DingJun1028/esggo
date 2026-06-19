/**
 * scripts/verify-behavioral-analytics.ts
 * Verification for Phase 3
 */
import { BehavioralTrackingService } from '../server/services/BehavioralTrackingService.js';
import { BehaviorAnalyticsService } from '../server/services/BehaviorAnalyticsService.js';
import omniLogger, { LogCategory } from '../server/utils/omniLogger.js';

async function verify() {
    const testUserId = '00000000-0000-0000-0000-000000000000'; // Mock/Test User

    console.log('--- Phase 3 Verification Start ---');

    // 1. Track Events
    console.log('[1/3] Tracking mock events...');
    await BehavioralTrackingService.track({
        userId: testUserId,
        eventType: 'view_assessment_report',
        pageUrl: '/esg-report',
        metadata: { source: 'dashboard' }
    });
    await BehavioralTrackingService.track({
        userId: testUserId,
        eventType: 'click_intelligence_card',
        pageUrl: '/intelligence',
        metadata: { cardId: 'sample_001' }
    });

    // 2. Trigger Analysis
    console.log('[2/3] Triggering habit analysis...');
    const analysis = await BehaviorAnalyticsService.analyzeUserHabits(testUserId);
    console.log('Analysis Result:', analysis);

    // 3. Global Trends
    console.log('[3/3] Generating global trends...');
    await BehaviorAnalyticsService.summarizeGlobalTrends();

    console.log('--- Verification Complete ---');
}

verify().catch(err => {
    console.error('Verification failed:', err);
    process.exit(1);
});
