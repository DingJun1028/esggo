/**
 * test_9d_optimized_scores.ts
 * 測試優化後的 9D 評分結果
 */

import { AcceptanceCriteria, ITestMetrics, I9DimensionScore } from './server/core/AcceptanceCriteria.js';

function createRealisticMetrics(): ITestMetrics {
    return {
        // Function Metrics
        passedTests: 142,
        totalTests: 150,
        criticalBugCount: 1,
        apiContractCompliance: 95,

        // Performance Metrics
        apiResponseTime: 180,
        renderTime: 85,
        memoryLeaks: 1,

        // Efficiency Metrics (optimized defaults)
        cpuUsageAvg: 0.70,
        memoryWasteRatio: 0.08,
        costPerRequest: 0.02,
        industryAvgCost: 0.05,
        deploymentFrequency: 4,
        idealFrequency: 5,
        bugFixTime: 18,

        // Potential Metrics
        codeModularity: 8.5,
        extensionPoints: 45,
        maxExtensions: 50,
        technicalDebt: 120,
        technicalDebtThreshold: 150,

        // Capacity Metrics
        maxConcurrentUsers: 2500,
        targetUsers: 2000,
        databaseScalability: 8.5,
        resourceEfficiency: 0.88,

        // Probability Metrics (optimized)
        systemUptime: 99.7,
        mtbf: 720,
        mttr: 20,
        autoRecoveryRate: 0.88,
        alertAccuracy: 0.94,
        falsePositiveRate: 0.06,

        // Capability Metrics (optimized)
        implementedFeatures: 20,
        plannedFeatures: 22,
        coreFeaturesComplete: 0.95,
        supportedUseCases: 24,
        targetUseCases: 28,
        apiEndpointCount: 48,
        platformSupport: 4,
        languageSupport: 5,
        customizationLevel: 8.5,

        // Potential Energy Metrics (optimized)
        currentUserCount: 5000,
        targetMarketSize: 500000,
        retentionRate: 0.82,
        kFactor: 1.3,
        featureCompleteness: 0.90,
        marketDemand: 8.0,
        monetizationCapacity: 7.5,
        integrationCount: 12,
        communityActivity: 8.0,
        brandInfluence: 7.5,
    };
}

function printResults(scores: I9DimensionScore): void {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║           9D 評分結果 - 優化版本 v4.1                      ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    const dimensionNames: Record<keyof I9DimensionScore, string> = {
        function: '🌟 功能 (Function)',
        performance: '⚡ 性能 (Performance)',
        efficiency: '🔧 效能 (Efficiency)',
        capacity: '📊 量能 (Capacity)',
        probability: '🎯 可能 (Probability)',
        capability: '🚀 機能 (Capability)',
        potential: '💡 潛能 (Potential)',
        potentialEnergy: '🌐 勢能 (Potential Energy)',
        momentum: '🔥 動能 (Momentum)',
    };

    const thresholds = {
        function: 88,
        performance: 82,
        efficiency: 72,
        capacity: 72,
        probability: 78,
        capability: 72,
        potential: 68,
        potentialEnergy: 68,
        momentum: 65,
    };

    let totalScore = 0;
    let passedCount = 0;
    const weights = {
        function: 0.16,
        performance: 0.14,
        efficiency: 0.13,
        capacity: 0.11,
        probability: 0.12,
        capability: 0.12,
        potential: 0.11,
        potentialEnergy: 0.11,
        momentum: 0.00,
    };

    for (const [key, value] of Object.entries(scores) as [keyof I9DimensionScore, number][]) {
        const name = dimensionNames[key];
        const threshold = thresholds[key];
        const weight = weights[key];
        const passed = value >= threshold;
        const status = passed ? '✅' : '⚠️';

        console.log(`${status} ${name}: ${value.toFixed(2)}/100 ${passed ? '✓' : '<' + threshold}`);
        totalScore += value * weight;
        if (passed) passedCount++;
    }

    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log(`║  總體評分: ${totalScore.toFixed(2)}/100                               ║`);
    console.log(`║  通過維度: ${passedCount}/9                                         ║`);
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    if (totalScore >= 80 && passedCount >= 7) {
        console.log('🎉 恭喜！達到標準，整體評分通過！\n');
    } else if (totalScore >= 72) {
        console.log('⚠️ 有條件通過，建議進一步優化。\n');
    } else {
        console.log('❌ 未達標準，需要繼續優化。\n');
    }
}

// Run test
const metrics = createRealisticMetrics();
const scores = AcceptanceCriteria.calculate9Dimensions(metrics);
printResults(scores);
