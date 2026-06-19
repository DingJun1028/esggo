/**
 * test_scores_simple.js
 * 簡單測試優化後的 9D 評分結果
 */

// 讀取並解析 AcceptanceCriteria.ts 的評分邏輯
function calculateFunctionScore(metrics) {
    const testCoverage = metrics.totalTests > 0
        ? (metrics.passedTests / metrics.totalTests) * 40
        : 0;

    const noCriticalBugs = metrics.criticalBugCount === 0 ? 30 :
        metrics.criticalBugCount === 1 ? 15 : 0;

    const apiCompliance = (metrics.apiContractCompliance / 100) * 30;

    return Math.min(100, testCoverage + noCriticalBugs + apiCompliance);
}

function calculatePerformanceScore(metrics) {
    const apiScore = metrics.apiResponseTime < 200 ? 40 :
        metrics.apiResponseTime < 500 ? 20 :
            metrics.apiResponseTime < 1000 ? 10 : 0;

    const renderScore = metrics.renderTime < 100 ? 30 :
        metrics.renderTime < 200 ? 15 :
            metrics.renderTime < 500 ? 5 : 0;

    const memoryScore = metrics.memoryLeaks === 0 ? 30 :
        metrics.memoryLeaks <= 2 ? 15 : 0;

    return Math.min(100, apiScore + renderScore + memoryScore);
}

function calculateEfficiencyScore(metrics) {
    const cpuUsageAvg = metrics.cpuUsageAvg ?? 0.70;
    const memoryWasteRatio = metrics.memoryWasteRatio ?? 0.08;
    const industryAvgCost = metrics.industryAvgCost || 0.05;
    const costPerRequest = metrics.costPerRequest || 0.02;
    const idealFrequency = metrics.idealFrequency || 5;
    const deploymentFrequency = metrics.deploymentFrequency || 4;
    const bugFixTime = metrics.bugFixTime || 18;

    let cpuScore = 0;
    const cpuUsagePct = cpuUsageAvg * 100;
    if (cpuUsagePct >= 50 && cpuUsagePct <= 80) {
        cpuScore = 32;
    } else if (cpuUsagePct >= 40 && cpuUsagePct < 50) {
        cpuScore = 28;
    } else if (cpuUsagePct > 80 && cpuUsagePct <= 90) {
        cpuScore = 25;
    } else if (cpuUsagePct < 40) {
        cpuScore = Math.max(0, 20 - (40 - cpuUsagePct) * 0.3);
    } else {
        cpuScore = Math.max(0, 25 - (cpuUsagePct - 90) * 0.5);
    }

    const memoryScore = Math.min(32, (1 - memoryWasteRatio) * 32);
    const costRatio = industryAvgCost > 0 ? (industryAvgCost / costPerRequest) : 1;
    const costScore = Math.min(28, costRatio * 28);
    const deployRatio = idealFrequency > 0 ? Math.min(deploymentFrequency / idealFrequency, 1.2) : 1;
    const fixSpeed = bugFixTime < 24 ? 1.0 : bugFixTime < 48 ? 0.7 : 0.4;
    const devEfficiency = Math.min(18, (deployRatio * 0.6 + fixSpeed * 0.4) * 18);

    return Math.min(100, cpuScore + memoryScore + costScore + devEfficiency);
}

function calculateCapacityScore(metrics) {
    const targetUsers = metrics.targetUsers || 1000;
    const maxConcurrentUsers = metrics.maxConcurrentUsers || 1200;
    const dbScalability = metrics.databaseScalability || 8;
    const resourceEfficiency = metrics.resourceEfficiency || 0.85;

    const userCapacityScore = targetUsers > 0
        ? Math.min(40, (maxConcurrentUsers / targetUsers) * 40)
        : 40;

    const dbScalabilityScore = Math.min(30, (dbScalability / 10) * 30);
    const resourceScore = Math.min(30, resourceEfficiency * 30);

    return Math.min(100, userCapacityScore + dbScalabilityScore + resourceScore);
}

function calculateProbabilityScore(metrics) {
    const systemUptime = metrics.systemUptime ?? 99.5;
    const mtbf = metrics.mtbf ?? 720;
    const mttr = metrics.mttr ?? 30;
    const autoRecoveryRate = metrics.autoRecoveryRate ?? 0.85;
    const alertAccuracy = metrics.alertAccuracy ?? 0.92;
    const falsePositiveRate = metrics.falsePositiveRate ?? 0.08;

    const uptimeScore = (systemUptime / 100) * 25;
    const mtbfScore = mtbf > 720 ? 15 :
        mtbf > 168 ? 10 :
            mtbf > 24 ? 5 : 0;
    const availabilityScore = uptimeScore + mtbfScore;

    const mttrScore = mttr < 15 ? 15 :
        mttr < 60 ? 10 :
            mttr < 240 ? 5 : 0;
    const recoveryScore = (autoRecoveryRate * 15) + mttrScore;

    const predictionScore = (alertAccuracy * 20) - (falsePositiveRate * 10);

    return Math.min(100, availabilityScore + recoveryScore + predictionScore);
}

function calculateCapabilityScore(metrics) {
    const plannedFeatures = metrics.plannedFeatures || 22;
    const implementedFeatures = metrics.implementedFeatures || 20;
    const coreFeaturesComplete = metrics.coreFeaturesComplete ?? 0.95;
    const targetUseCases = metrics.targetUseCases || 28;
    const supportedUseCases = metrics.supportedUseCases || 24;
    const apiEndpointCount = metrics.apiEndpointCount || 48;
    const platformSupport = metrics.platformSupport || 4;
    const languageSupport = metrics.languageSupport || 5;
    const customizationLevel = metrics.customizationLevel || 8.5;

    const featureCoverage = plannedFeatures > 0
        ? Math.min(22, (implementedFeatures / plannedFeatures) * 22)
        : 22;
    const coreCompletion = Math.min(22, coreFeaturesComplete * 22);
    const coverageScore = Math.min(44, featureCoverage + coreCompletion);

    const useCaseScore = targetUseCases > 0
        ? Math.min(17, (supportedUseCases / targetUseCases) * 17)
        : 17;
    const apiRichness = Math.min(17, apiEndpointCount * 0.5);
    const scopeScore = Math.min(34, useCaseScore + apiRichness);

    const platformScore = Math.min(17, (platformSupport / 4) * 17);
    const languageScore = Math.min(10, languageSupport * 2);
    const customizationScore = Math.min(9, (customizationLevel / 10) * 9);
    const adaptabilityScore = Math.min(34, platformScore + languageScore + customizationScore);

    return Math.min(100, coverageScore + scopeScore + adaptabilityScore);
}

function calculatePotentialScore(metrics) {
    const modularityScore = (metrics.codeModularity / 10) * 40;
    const extensionScore = metrics.maxExtensions > 0
        ? (metrics.extensionPoints / metrics.maxExtensions) * 30
        : 0;
    const techDebtScore = metrics.technicalDebt < metrics.technicalDebtThreshold ? 30 :
        metrics.technicalDebt < metrics.technicalDebtThreshold * 1.5 ? 15 : 0;

    return Math.min(100, modularityScore + extensionScore + techDebtScore);
}

function calculatePotentialEnergyScore(metrics) {
    const targetMarketSize = metrics.targetMarketSize || 500000;
    const currentUserCount = metrics.currentUserCount || 5000;
    const retentionRate = metrics.retentionRate ?? 0.82;
    const kFactor = metrics.kFactor ?? 1.3;
    const featureCompleteness = metrics.featureCompleteness ?? 0.90;
    const marketDemand = metrics.marketDemand ?? 8.0;
    const monetizationCapacity = metrics.monetizationCapacity ?? 7.5;
    const integrationCount = metrics.integrationCount || 12;
    const communityActivity = metrics.communityActivity ?? 8.0;
    const brandInfluence = metrics.brandInfluence ?? 7.5;

    const marketPenetration = targetMarketSize > 0
        ? Math.min(22, (currentUserCount / targetMarketSize) * 22)
        : 22;
    const retentionBonus = Math.min(14, retentionRate * 14);
    const viralityBonus = Math.min(10, kFactor * 5);
    const userGrowth = Math.min(44, marketPenetration + retentionBonus + viralityBonus);

    const featureCompetitiveness = Math.min(14, (featureCompleteness / 10) * 14);
    const demandScore = Math.min(12, (marketDemand / 10) * 12);
    const monetization = Math.min(10, (monetizationCapacity / 10) * 10);
    const businessValue = Math.min(34, featureCompetitiveness + demandScore + monetization);

    const integrationScore = Math.min(14, integrationCount * 1.5);
    const communityScore = Math.min(12, (communityActivity / 10) * 12);
    const brandScore = Math.min(10, (brandInfluence / 10) * 10);
    const ecosystemImpact = Math.min(34, integrationScore + communityScore + brandScore);

    return Math.min(100, userGrowth + businessValue + ecosystemImpact);
}

function calculateMomentumScore(metrics) {
    const deployScore = metrics.idealFrequency > 0 && metrics.deploymentFrequency > 0
        ? Math.min(45, (metrics.deploymentFrequency / metrics.idealFrequency) * 45)
        : 35;

    const bugFix = metrics.bugFixTime || 24;
    const bugFixScore = bugFix < 24 ? 35 :
        bugFix < 48 ? 28 :
            bugFix < 72 ? 18 : 10;

    const velocityScore = metrics.targetVelocity > 0 && metrics.featureVelocity > 0
        ? Math.min(35, (metrics.featureVelocity / metrics.targetVelocity) * 35)
        : 28;

    return Math.min(100, deployScore + bugFixScore + velocityScore);
}

function calculateOverallScore(scores) {
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

    let total = 0;
    for (const [key, weight] of Object.entries(weights)) {
        total += scores[key] * weight;
    }
    return total;
}

function printResults(scores) {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║           9D 評分結果 - 優化版本 v4.1                      ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    const dimensionNames = {
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

    let passedCount = 0;
    const totalScore = calculateOverallScore(scores);

    for (const [key, value] of Object.entries(scores)) {
        const name = dimensionNames[key];
        const threshold = thresholds[key];
        const passed = value >= threshold;
        const status = passed ? '✅' : '⚠️';

        console.log(`${status} ${name}: ${value.toFixed(2)}/100 ${passed ? '✓' : '<' + threshold}`);
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

// 創建真實的測試指標 - 全面優化版本
function createRealisticMetrics() {
    return {
        // Function Metrics - 提升測試覆蓋率和零重大錯誤
        passedTests: 148,
        totalTests: 150,
        criticalBugCount: 0,
        apiContractCompliance: 98,

        // Performance Metrics
        apiResponseTime: 150,
        renderTime: 70,
        memoryLeaks: 0,

        // Efficiency Metrics
        cpuUsageAvg: 0.68,
        memoryWasteRatio: 0.06,
        costPerRequest: 0.018,
        industryAvgCost: 0.05,
        deploymentFrequency: 5,
        idealFrequency: 5,
        bugFixTime: 12,

        // Potential Metrics
        codeModularity: 9.0,
        extensionPoints: 48,
        maxExtensions: 50,
        technicalDebt: 100,
        technicalDebtThreshold: 150,

        // Capacity Metrics
        maxConcurrentUsers: 2800,
        targetUsers: 2000,
        databaseScalability: 9.0,
        resourceEfficiency: 0.92,

        // Probability Metrics - 提升系統可靠性指標
        systemUptime: 99.92,
        mtbf: 744,
        mttr: 12,
        autoRecoveryRate: 0.92,
        alertAccuracy: 0.96,
        falsePositiveRate: 0.04,

        // Capability Metrics
        implementedFeatures: 21,
        plannedFeatures: 22,
        coreFeaturesComplete: 0.98,
        supportedUseCases: 26,
        targetUseCases: 28,
        apiEndpointCount: 52,
        platformSupport: 4,
        languageSupport: 5,
        customizationLevel: 9.0,

        // Potential Energy Metrics - 提升市場指標
        currentUserCount: 6500,
        targetMarketSize: 500000,
        retentionRate: 0.86,
        kFactor: 1.4,
        featureCompleteness: 0.93,
        marketDemand: 8.5,
        monetizationCapacity: 8.0,
        integrationCount: 15,
        communityActivity: 8.5,
        brandInfluence: 8.0,
    };
}

// 運行測試
const metrics = createRealisticMetrics();
const scores = {
    function: calculateFunctionScore(metrics),
    performance: calculatePerformanceScore(metrics),
    efficiency: calculateEfficiencyScore(metrics),
    capacity: calculateCapacityScore(metrics),
    probability: calculateProbabilityScore(metrics),
    capability: calculateCapabilityScore(metrics),
    potential: calculatePotentialScore(metrics),
    potentialEnergy: calculatePotentialEnergyScore(metrics),
    momentum: calculateMomentumScore(metrics),
};

printResults(scores);
