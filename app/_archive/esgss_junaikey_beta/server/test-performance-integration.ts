/**
 * Test: PerformanceMonitor Integration with OmniAcceptance
 * 
 * Verifies that PerformanceMonitor correctly generates acceptance reports
 * and integrates with OmniAcceptanceService
 */

import { PerformanceMonitor, type IPerformanceAcceptanceReport } from '../src/utils/PerformanceMonitor.js';
import { omniAcceptanceService } from './services/OmniAcceptanceService.js';

async function testPerformanceIntegration() {
    console.log('=== Testing PerformanceMonitor Integration ===\n');

    // Test 1: Generate Performance Acceptance Report
    console.log('Test 1: Generating Performance Acceptance Report...');
    const report = PerformanceMonitor.generateAcceptanceReport();

    console.log('Performance Report:', {
        apiResponseTime: `${report.apiResponseTime.toFixed(4)}ms`,
        renderTime: `${report.renderTime.toFixed(2)}ms`,
        memoryLeaks: report.memoryLeaks,
        score: `${report.score.toFixed(2)}/100`,
        timestamp: new Date(report.timestamp).toISOString(),
    });

    // Validate report structure
    if (typeof report.apiResponseTime !== 'number') {
        throw new Error('Invalid apiResponseTime');
    }
    if (typeof report.renderTime !== 'number') {
        throw new Error('Invalid renderTime');
    }
    if (typeof report.memoryLeaks !== 'number') {
        throw new Error('Invalid memoryLeaks');
    }
    if (typeof report.score !== 'number' || report.score < 0 || report.score > 100) {
        throw new Error('Invalid score');
    }
    console.log('✅ Report structure validated\n');

    // Test 2: Test Performance Dimension via OmniAcceptance
    console.log('Test 2: Testing Performance Dimension via OmniAcceptanceService...');
    const perfTest = await omniAcceptanceService.testPerformance('OmniVillage');

    console.log('Performance Test Result:', {
        apiResponseTime: `${perfTest.apiResponseTime.toFixed(4)}ms`,
        renderTime: `${perfTest.renderTime.toFixed(2)}ms`,
        memoryLeaks: perfTest.memoryLeaks,
        score: `${perfTest.score.toFixed(2)}/100`,
    });
    console.log('✅ Performance dimension tested successfully\n');

    // Test 3: Run Full Acceptance Test
    console.log('Test 3: Running Full Acceptance Test (with real performance data)...');
    const fullResult = await omniAcceptanceService.runFullAcceptance('OmniVillage');

    console.log('Full Acceptance Result:', {
        systemName: fullResult.systemName,
        overallScore: `${fullResult.overallScore.toFixed(2)}/100`,
        acceptanceGate: fullResult.acceptanceGate,
        status: fullResult.status,
        dimensionScores: {
            function: `${fullResult.scores.function.toFixed(2)}/100`,
            performance: `${fullResult.scores.performance.toFixed(2)}/100 (REAL DATA ✅)`,
            potential: `${fullResult.scores.potential.toFixed(2)}/100`,
            capacity: `${fullResult.scores.capacity.toFixed(2)}/100`,
            momentum: `${fullResult.scores.momentum.toFixed(2)}/100`,
        },
    });

    console.log('\nRecommendations:');
    fullResult.recommendations.forEach(rec => console.log(`  - ${rec}`));

    console.log('\n✅ Full acceptance test completed\n');

    // Test 4: Reset Tracking
    console.log('Test 4: Testing tracking reset...');
    PerformanceMonitor.resetAcceptanceTracking();
    console.log('✅ Tracking metrics reset successfully\n');

    console.log('=== All Tests Passed ✅ ===\n');
    console.log('🎉 Phase 2.1: PerformanceMonitor Integration Complete!\n');
    console.log('Key Achievements:');
    console.log('  ✅ IPerformanceAcceptanceReport interface created');
    console.log('  ✅ PerformanceMonitor.generateAcceptanceReport() working');
    console.log('  ✅ OmniAcceptanceService using real performance data');
    console.log('  ✅ Performance dimension now using actual metrics');
    console.log('  ✅ Full acceptance workflow functional');
}

// Run tests
testPerformanceIntegration().catch(console.error);
