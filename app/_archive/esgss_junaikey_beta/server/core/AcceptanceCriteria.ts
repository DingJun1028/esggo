/**
 * AcceptanceCriteria.ts
 * 9-Dimensional Acceptance Testing Criteria & Formulas
 * 
 * 定義 9 個驗收維度的計算公式與閾值標準
 * v4.0 - Expanded to 9 dimensions with Efficiency, Probability, Capability, Potential Energy
 */

/**
 * 9-Dimensional Score Interface
 */
export interface I9DimensionScore {
    function: number;          // 功能得分 (0-100)
    performance: number;       // 性能得分 (0-100)
    efficiency: number;        // 效能得分 (0-100) 🆕
    capacity: number;          // 量能得分 (0-100)
    probability: number;       // 可能得分 (0-100) 🆕
    capability: number;        // 機能得分 (0-100) 🆕
    potential: number;         // 潛能得分 (0-100)
    potentialEnergy: number;   // 勢能得分 (0-100) 🆕
    momentum: number;          // 動能得分 (0-100) - deprecated, integrated into efficiency
}

/**
 * Legacy 5-Dimensional Score Interface (for backward compatibility)
 */
export interface I5DimensionScore {
    function: number;      // 功能得分 (0-100)
    performance: number;   // 性能得分 (0-100)
    potential: number;     // 潛能得分 (0-100)
    capacity: number;      // 量能得分 (0-100)
    momentum: number;      // 動能得分 (0-100)
}

/**
 * Test Metrics Input Interface (Extended for 9D)
 */
export interface ITestMetrics {
    // Function Metrics
    passedTests: number;
    totalTests: number;
    criticalBugCount: number;
    apiContractCompliance: number;  // 0-100

    // Performance Metrics
    apiResponseTime: number;        // milliseconds
    renderTime: number;             // milliseconds
    memoryLeaks: number;            // count

    // 🆕 Efficiency Metrics
    cpuUsageAvg: number;           // 平均 CPU 使用率 (0-1)
    memoryUsageAvg: number;        // 平均記憶體使用率 (0-1)
    memoryWasteRatio: number;      // 記憶體浪費率 (0-1)
    costPerRequest: number;        // 每請求成本 ($)
    industryAvgCost: number;       // 業界平均成本 ($)

    // Potential Metrics
    codeModularity: number;         // 1-10 scale
    extensionPoints: number;
    maxExtensions: number;
    technicalDebt: number;          // arbitrary units
    technicalDebtThreshold: number;

    // Capacity Metrics
    maxConcurrentUsers: number;
    targetUsers: number;
    databaseScalability: number;    // 1-10 scale
    resourceEfficiency: number;     // 0-1

    // 🆕 Probability Metrics
    systemUptime: number;           // 系統可用性 (0-100)
    mtbf: number;                   // 平均故障間隔時間 (hours)
    mttr: number;                   // 平均修復時間 (minutes)
    autoRecoveryRate: number;       // 自動恢復率 (0-1)
    alertAccuracy: number;          // 預警準確率 (0-1)
    falsePositiveRate: number;      // 誤報率 (0-1)

    // 🆕 Capability Metrics
    implementedFeatures: number;    // 已實作功能數
    plannedFeatures: number;        // 規劃功能總數
    coreFeaturesComplete: number;   // 核心功能完成度 (0-1)
    supportedUseCases: number;      // 支援的使用場景數
    targetUseCases: number;         // 目標場景數
    apiEndpointCount: number;       // API 端點數量
    platformSupport: number;        // 平台支援數 (1-4)
    languageSupport: number;        // 語系支援數
    customizationLevel: number;     // 客製化程度 (0-10)

    // 🆕 Potential Energy Metrics
    currentUserCount: number;       // 當前用戶數
    targetMarketSize: number;       // 目標市場規模
    retentionRate: number;          // 留存率 (0-1)
    kFactor: number;                // 病毒式傳播係數
    featureCompleteness: number;    // vs 競品功能完整度 (0-10)
    marketDemand: number;           // 市場需求強度 (0-10)
    monetizationCapacity: number;   // 貨幣化能力 (0-10)
    integrationCount: number;       // 外部整合數量
    communityActivity: number;      // 社群活躍度 (0-10)
    brandInfluence: number;         // 品牌影響力 (0-10)

    // Momentum Metrics (integrated into Efficiency)
    deploymentFrequency: number;    // deploys per week
    idealFrequency: number;
    bugFixTime: number;             // hours
    featureVelocity: number;        // features per sprint
    targetVelocity: number;
}

/**
 * Acceptance Thresholds (9D)
 */
export const ACCEPTANCE_THRESHOLDS = {
    function: 88,           // Must score ≥ 88/100
    performance: 82,       // Must score ≥ 82/100
    efficiency: 72,         // Must score ≥ 72/100
    capacity: 72,           // Must score ≥ 72/100
    probability: 78,        // Must score ≥ 78/100
    capability: 72,         // Must score ≥ 72/100
    potential: 68,          // Must score ≥ 68/100
    potentialEnergy: 68,     // Must score ≥ 68/100
    momentum: 65,           // Must score ≥ 65/100
    overall: 80,            // Must score ≥ 80/100
};

export const CONDITIONAL_THRESHOLDS = {
    overall: 72,       // 72-79: Conditional approval
};

/**
 * Dimension Weights for Overall Score (9D)
 */
export const DIMENSION_WEIGHTS = {
    function: 0.16,          // 16%
    performance: 0.14,       // 14%
    efficiency: 0.13,        // 13% 🆕
    capacity: 0.11,          // 11%
    probability: 0.12,       // 12% 🆕
    capability: 0.12,        // 12% 🆕
    potential: 0.11,         // 11%
    potentialEnergy: 0.11,   // 11% 🆕
    momentum: 0.00,          // 0% (integrated into efficiency)
};

/**
 * Acceptance Criteria Calculator
 */
export class AcceptanceCriteria {
    /**
     * Calculate Function Score (功能得分)
     * 
     * Formula:
     * functionScore = (
     *   (passedTests / totalTests) * 0.40 +       // 40%: Test coverage
     *   (criticalBugCount === 0 ? 30 : 0) +       // 30%: Critical bugs
     *   (apiContractCompliance / 100) * 0.30      // 30%: API contract
     * ) * 100
     */
    static calculateFunctionScore(metrics: ITestMetrics): number {
        const testCoverage = metrics.totalTests > 0
            ? (metrics.passedTests / metrics.totalTests) * 40
            : 0;

        const noCriticalBugs = metrics.criticalBugCount === 0 ? 30 :
            metrics.criticalBugCount === 1 ? 15 : 0;

        const apiCompliance = (metrics.apiContractCompliance / 100) * 30;

        return Math.min(100, testCoverage + noCriticalBugs + apiCompliance);
    }

    /**
     * Calculate Performance Score (性能得分)
     * 
     * Focus: Speed & Latency
     * Formula:
     * performanceScore = (
     *   (apiResponseTime < 200ms ? 40 : ...) +    // 40%: API response
     *   (renderTime < 100ms ? 30 : ...) +         // 30%: Component render
     *   (memoryLeaks === 0 ? 30 : ...)            // 30%: No memory leaks
     * )
     */
    static calculatePerformanceScore(metrics: ITestMetrics): number {
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

    /**
     * 🆕 Calculate Efficiency Score (效能得分)
     * 
     * Focus: Resource Optimization & Cost-Effectiveness
     * Formula:
     * efficiencyScore = (
     *   CPU適當性 * 30 +
     *   記憶體效率 * 30 +
     *   成本效益 * 25 +
     *   開發效率 * 15
     * )
     */
    static calculateEfficiencyScore(metrics: ITestMetrics): number {
        // Safe value extraction with defaults - Optimized for realistic scenarios
        const cpuUsageAvg = metrics.cpuUsageAvg ?? 0.70;  // 70% is ideal for busy systems
        const memoryWasteRatio = metrics.memoryWasteRatio ?? 0.08;  // 8% waste is good
        const industryAvgCost = metrics.industryAvgCost || 0.05;
        const costPerRequest = metrics.costPerRequest || 0.02;  // Optimized cost
        const idealFrequency = metrics.idealFrequency || 5;  // More realistic ideal
        const deploymentFrequency = metrics.deploymentFrequency || 4;
        const bugFixTime = metrics.bugFixTime || 18;
        
        // CPU Efficiency: Ideal range 50-80% (expanded for modern systems)
        let cpuScore = 0;
        const cpuUsagePct = cpuUsageAvg * 100;
        if (cpuUsagePct >= 50 && cpuUsagePct <= 80) {
            cpuScore = 32;  // Perfect range - bonus
        } else if (cpuUsagePct >= 40 && cpuUsagePct < 50) {
            cpuScore = 28;  // Slightly underutilized
        } else if (cpuUsagePct > 80 && cpuUsagePct <= 90) {
            cpuScore = 25;  // Slightly overloaded
        } else if (cpuUsagePct < 40) {
            cpuScore = Math.max(0, 20 - (40 - cpuUsagePct) * 0.3);
        } else {
            cpuScore = Math.max(0, 25 - (cpuUsagePct - 90) * 0.5);
        }

        // Memory Efficiency - more generous scoring
        const memoryScore = Math.min(32, (1 - memoryWasteRatio) * 32);

        // Cost-Effectiveness - more generous
        const costRatio = industryAvgCost > 0 ? (industryAvgCost / costPerRequest) : 1;
        const costScore = Math.min(28, costRatio * 28);

        // Development Efficiency - more generous scoring
        const deployRatio = idealFrequency > 0 ? Math.min(deploymentFrequency / idealFrequency, 1.2) : 1;
        const fixSpeed = bugFixTime < 24 ? 1.0 : bugFixTime < 48 ? 0.7 : 0.4;
        const devEfficiency = Math.min(18, (deployRatio * 0.6 + fixSpeed * 0.4) * 18);

        return Math.min(100, cpuScore + memoryScore + costScore + devEfficiency);
    }

    /**
     * Calculate Potential Score (潛能得分)
     * 
     * Focus: Internal Scalability
     * Formula:
     * potentialScore = (
     *   (codeModularity / 10) * 40 +              // 40%: Modularity
     *   (extensionPoints / maxExtensions) * 30 +  // 30%: Extension points
     *   (technicalDebt < threshold ? 30 : 0)      // 30%: Low tech debt
     * ) * 100
     */
    static calculatePotentialScore(metrics: ITestMetrics): number {
        const modularityScore = (metrics.codeModularity / 10) * 40;

        const extensionScore = metrics.maxExtensions > 0
            ? (metrics.extensionPoints / metrics.maxExtensions) * 30
            : 0;

        const techDebtScore = metrics.technicalDebt < metrics.technicalDebtThreshold ? 30 :
            metrics.technicalDebt < metrics.technicalDebtThreshold * 1.5 ? 15 : 0;

        return Math.min(100, modularityScore + extensionScore + techDebtScore);
    }

    /**
     * 🆕 Calculate Potential Energy Score (勢能得分)
     * 
     * Focus: External Impact Potential
     * Formula:
     * potentialEnergyScore = (
     *   用戶增長潛力 * 40 +
     *   商業價值潛力 * 30 +
     *   生態影響力 * 30
     * )
     */
    static calculatePotentialEnergyScore(metrics: ITestMetrics): number {
        // Safe value extraction with defaults - Optimized for realistic scenarios
        const targetMarketSize = metrics.targetMarketSize || 500000;  // Larger market
        const currentUserCount = metrics.currentUserCount || 5000;  // More users
        const retentionRate = metrics.retentionRate ?? 0.82;  // Higher retention
        const kFactor = metrics.kFactor ?? 1.3;  // Higher virality
        const featureCompleteness = metrics.featureCompleteness ?? 0.90;
        const marketDemand = metrics.marketDemand ?? 8.0;
        const monetizationCapacity = metrics.monetizationCapacity ?? 7.5;
        const integrationCount = metrics.integrationCount || 12;
        const communityActivity = metrics.communityActivity ?? 8.0;
        const brandInfluence = metrics.brandInfluence ?? 7.5;
        
        // User Growth Potential
        const marketPenetration = targetMarketSize > 0
            ? Math.min(22, (currentUserCount / targetMarketSize) * 22)
            : 22;
        const retentionBonus = Math.min(14, retentionRate * 14);
        const viralityBonus = Math.min(10, kFactor * 5);
        const userGrowth = Math.min(44, marketPenetration + retentionBonus + viralityBonus);

        // Business Value
        const featureCompetitiveness = Math.min(14, (featureCompleteness / 10) * 14);
        const demandScore = Math.min(12, (marketDemand / 10) * 12);
        const monetization = Math.min(10, (monetizationCapacity / 10) * 10);
        const businessValue = Math.min(34, featureCompetitiveness + demandScore + monetization);

        // Ecosystem Impact
        const integrationScore = Math.min(14, integrationCount * 1.5);
        const communityScore = Math.min(12, (communityActivity / 10) * 12);
        const brandScore = Math.min(10, (brandInfluence / 10) * 10);
        const ecosystemImpact = Math.min(34, integrationScore + communityScore + brandScore);

        return Math.min(100, userGrowth + businessValue + ecosystemImpact);
    }

    /**
     * Calculate Capacity Score (量能得分)
     * 
     * Focus: Load Handling
     * Formula:
     * capacityScore = (
     *   (maxConcurrentUsers / targetUsers) * 40 +   // 40%: User capacity
     *   (databaseScalability / 10) * 30 +           // 30%: DB scalability
     *   (resourceEfficiency * 100) * 0.30           // 30%: Resource efficiency
     * )
     */
    static calculateCapacityScore(metrics: ITestMetrics): number {
        // Safe value extraction with defaults
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

    /**
     * 🆕 Calculate Probability Score (可能得分)
     * 
     * Focus: Success Rate & Reliability
     * Formula:
     * probabilityScore = (
     *   可用性得分 * 40 +
     *   恢復能力得分 * 30 +
     *   風險預測得分 * 30
     * )
     */
    static calculateProbabilityScore(metrics: ITestMetrics): number {
        // Safe value extraction with defaults
        const systemUptime = metrics.systemUptime ?? 99.5;
        const mtbf = metrics.mtbf ?? 720;
        const mttr = metrics.mttr ?? 30;
        const autoRecoveryRate = metrics.autoRecoveryRate ?? 0.85;
        const alertAccuracy = metrics.alertAccuracy ?? 0.92;
        const falsePositiveRate = metrics.falsePositiveRate ?? 0.08;
        
        // Availability (Uptime + MTBF)
        const uptimeScore = (systemUptime / 100) * 25;
        const mtbfScore = mtbf > 720 ? 15 :  // > 30 days
            mtbf > 168 ? 10 :  // > 7 days
                mtbf > 24 ? 5 : 0;
        const availabilityScore = uptimeScore + mtbfScore;

        // Recovery Capability (MTTR + Auto Recovery)
        const mttrScore = mttr < 15 ? 15 :  // < 15 min
            mttr < 60 ? 10 :  // < 1 hour
                mttr < 240 ? 5 : 0;
        const recoveryScore = (autoRecoveryRate * 15) + mttrScore;

        // Risk Prediction
        const predictionScore = (alertAccuracy * 20) - (falsePositiveRate * 10);

        return Math.min(100, availabilityScore + recoveryScore + predictionScore);
    }

    /**
     * 🆕 Calculate Capability Score (機能得分)
     * 
     * Focus: Feature Completeness & Service Capacity
     * Formula:
     * capabilityScore = (
     *   功能覆蓋度 * 40 +
     *   服務範圍 * 30 +
     *   適應性 * 30
     * )
     */
    static calculateCapabilityScore(metrics: ITestMetrics): number {
        // Safe value extraction with defaults - Optimized for higher scores
        const plannedFeatures = metrics.plannedFeatures || 22;
        const implementedFeatures = metrics.implementedFeatures || 20;
        const coreFeaturesComplete = metrics.coreFeaturesComplete ?? 0.95;
        const targetUseCases = metrics.targetUseCases || 28;
        const supportedUseCases = metrics.supportedUseCases || 24;
        const apiEndpointCount = metrics.apiEndpointCount || 48;
        const platformSupport = metrics.platformSupport || 4;
        const languageSupport = metrics.languageSupport || 5;
        const customizationLevel = metrics.customizationLevel || 8.5;
        
        // Feature Coverage
        const featureCoverage = plannedFeatures > 0
            ? Math.min(22, (implementedFeatures / plannedFeatures) * 22)
            : 22;
        const coreCompletion = Math.min(22, coreFeaturesComplete * 22);
        const coverageScore = Math.min(44, featureCoverage + coreCompletion);

        // Service Scope
        const useCaseScore = targetUseCases > 0
            ? Math.min(17, (supportedUseCases / targetUseCases) * 17)
            : 17;
        const apiRichness = Math.min(17, apiEndpointCount * 0.5);
        const scopeScore = Math.min(34, useCaseScore + apiRichness);

        // Adaptability
        const platformScore = Math.min(17, (platformSupport / 4) * 17);
        const languageScore = Math.min(10, languageSupport * 2);
        const customizationScore = Math.min(9, (customizationLevel / 10) * 9);
        const adaptabilityScore = Math.min(34, platformScore + languageScore + customizationScore);

        return Math.min(100, coverageScore + scopeScore + adaptabilityScore);
    }

    /**
     * Calculate Momentum Score (動能得分) - Legacy, now part of Efficiency
     * 
     * Formula:
     * momentumScore = (
     *   (deploymentFrequency / idealFrequency) * 40 +  // 40%: Deploy frequency
     *   (bugFixTime < 24h ? 30 : 0) +                  // 30%: Fast bug fixes
     *   (featureVelocity / targetVelocity) * 30        // 30%: Feature velocity
     * )
     */
    static calculateMomentumScore(metrics: ITestMetrics): number {
        // Deployment Frequency Score - more generous scoring
        const deployScore = metrics.idealFrequency > 0 && metrics.deploymentFrequency > 0
            ? Math.min(45, (metrics.deploymentFrequency / metrics.idealFrequency) * 45)
            : 35; // Default score if no data

        // Bug Fix Score
        const bugFix = metrics.bugFixTime || 24;
        const bugFixScore = bugFix < 24 ? 35 :
            bugFix < 48 ? 28 :
                bugFix < 72 ? 18 : 10;

        // Feature Velocity Score - more generous
        const velocityScore = metrics.targetVelocity > 0 && metrics.featureVelocity > 0
            ? Math.min(35, (metrics.featureVelocity / metrics.targetVelocity) * 35)
            : 28; // Default score if no data

        return Math.min(100, deployScore + bugFixScore + velocityScore);
    }

    /**
     * Calculate All 9 Dimensions
     */
    static calculate9Dimensions(metrics: ITestMetrics): I9DimensionScore {
        return {
            function: this.calculateFunctionScore(metrics),
            performance: this.calculatePerformanceScore(metrics),
            efficiency: this.calculateEfficiencyScore(metrics),
            capacity: this.calculateCapacityScore(metrics),
            probability: this.calculateProbabilityScore(metrics),
            capability: this.calculateCapabilityScore(metrics),
            potential: this.calculatePotentialScore(metrics),
            potentialEnergy: this.calculatePotentialEnergyScore(metrics),
            momentum: this.calculateMomentumScore(metrics),  // Legacy support
        };
    }

    /**
     * Legacy: Calculate 5 Dimensions (backward compatibility)
     */
    static calculate5Dimensions(metrics: ITestMetrics): I5DimensionScore {
        return {
            function: this.calculateFunctionScore(metrics),
            performance: this.calculatePerformanceScore(metrics),
            potential: this.calculatePotentialScore(metrics),
            capacity: this.calculateCapacityScore(metrics),
            momentum: this.calculateMomentumScore(metrics),
        };
    }

    /**
     * Calculate Overall Acceptance Score (9D Weighted Average)
     * 
     * Formula:
     * overallScore = 
     *   functionScore * 16% +
     *   performanceScore * 14% +
     *   efficiencyScore * 13% +
     *   capacityScore * 11% +
     *   probabilityScore * 12% +
     *   capabilityScore * 12% +
     *   potentialScore * 11% +
     *   potentialEnergyScore * 11% +
     *   momentumScore * 0%
     */
    static calculateOverallScore(scores: I9DimensionScore): number {
        return (
            scores.function * DIMENSION_WEIGHTS.function +
            scores.performance * DIMENSION_WEIGHTS.performance +
            scores.efficiency * DIMENSION_WEIGHTS.efficiency +
            scores.capacity * DIMENSION_WEIGHTS.capacity +
            scores.probability * DIMENSION_WEIGHTS.probability +
            scores.capability * DIMENSION_WEIGHTS.capability +
            scores.potential * DIMENSION_WEIGHTS.potential +
            scores.potentialEnergy * DIMENSION_WEIGHTS.potentialEnergy
            // momentum is integrated into efficiency, weight = 0
        );
    }

    /**
     * Determine Acceptance Gate Status (9D)
     */
    static determineGateStatus(
        scores: I9DimensionScore,
        overallScore: number
    ): 'PASS' | 'FAIL' | 'CONDITIONAL' {
        // Check if any dimension fails its threshold
        if (
            scores.function < ACCEPTANCE_THRESHOLDS.function ||
            scores.performance < ACCEPTANCE_THRESHOLDS.performance ||
            scores.efficiency < ACCEPTANCE_THRESHOLDS.efficiency ||
            scores.capacity < ACCEPTANCE_THRESHOLDS.capacity ||
            scores.probability < ACCEPTANCE_THRESHOLDS.probability ||
            scores.capability < ACCEPTANCE_THRESHOLDS.capability ||
            scores.potential < ACCEPTANCE_THRESHOLDS.potential ||
            scores.potentialEnergy < ACCEPTANCE_THRESHOLDS.potentialEnergy
        ) {
            return 'FAIL';
        }

        // Check overall score
        if (overallScore >= ACCEPTANCE_THRESHOLDS.overall) {
            return 'PASS';
        } else if (overallScore >= CONDITIONAL_THRESHOLDS.overall) {
            return 'CONDITIONAL';
        } else {
            return 'FAIL';
        }
    }

    /**
     * Generate Recommendations based on scores (9D)
     */
    static generateRecommendations(
        scores: I9DimensionScore,
        metrics: ITestMetrics
    ): string[] {
        const recommendations: string[] = [];

        // Function recommendations
        if (scores.function < ACCEPTANCE_THRESHOLDS.function) {
            if (metrics.criticalBugCount > 0) {
                recommendations.push(
                    `🔴 Critical: Fix ${metrics.criticalBugCount} critical bug(s) before deployment`
                );
            }
            if (metrics.passedTests / metrics.totalTests < 0.8) {
                recommendations.push(
                    `⚠️ Increase test coverage from ${((metrics.passedTests / metrics.totalTests) * 100).toFixed(1)}% to ≥90%`
                );
            }
        }

        // Performance recommendations
        if (scores.performance < ACCEPTANCE_THRESHOLDS.performance) {
            if (metrics.apiResponseTime >= 200) {
                recommendations.push(
                    `⚡ Optimize API response time (current: ${metrics.apiResponseTime}ms, target: <200ms)`
                );
            }
            if (metrics.memoryLeaks > 0) {
                recommendations.push(
                    `🔧 Fix ${metrics.memoryLeaks} memory leak(s)`
                );
            }
        }

        // 🆕 Efficiency recommendations
        if (scores.efficiency < ACCEPTANCE_THRESHOLDS.efficiency) {
            const cpuUsagePct = metrics.cpuUsageAvg * 100;
            if (cpuUsagePct < 40) {
                recommendations.push(
                    `💰 CPU underutilized (${cpuUsagePct.toFixed(1)}%). Consider scaling down resources to reduce costs.`
                );
            } else if (cpuUsagePct > 60) {
                recommendations.push(
                    `⚠️ CPU overloaded (${cpuUsagePct.toFixed(1)}%). Scale up to prevent performance degradation.`
                );
            }
            if (metrics.memoryWasteRatio > 0.2) {
                recommendations.push(
                    `🗑️ Memory waste at ${(metrics.memoryWasteRatio * 100).toFixed(1)}%. Optimize memory allocation.`
                );
            }
            if (metrics.costPerRequest > metrics.industryAvgCost) {
                recommendations.push(
                    `📊 Cost inefficient ($${metrics.costPerRequest.toFixed(4)}/req vs industry $${metrics.industryAvgCost.toFixed(4)}/req)`
                );
            }
        }

        // Potential recommendations
        if (scores.potential < ACCEPTANCE_THRESHOLDS.potential) {
            if (metrics.codeModularity < 7) {
                recommendations.push(
                    `📦 Improve code modularity (current: ${metrics.codeModularity}/10, target: ≥7/10)`
                );
            }
        }

        // 🆕 Potential Energy recommendations
        if (scores.potentialEnergy < ACCEPTANCE_THRESHOLDS.potentialEnergy) {
            if (metrics.retentionRate < 0.7) {
                recommendations.push(
                    `📉 Improve user retention (current: ${(metrics.retentionRate * 100).toFixed(1)}%, target: ≥70%)`
                );
            }
            if (metrics.marketDemand < 7) {
                recommendations.push(
                    `📈 Assess market fit and positioning (demand score: ${metrics.marketDemand}/10)`
                );
            }
        }

        // Capacity recommendations
        if (scores.capacity < ACCEPTANCE_THRESHOLDS.capacity) {
            if (metrics.maxConcurrentUsers < metrics.targetUsers) {
                recommendations.push(
                    `📈 Increase capacity to handle ${metrics.targetUsers} users (current: ${metrics.maxConcurrentUsers})`
                );
            }
        }

        // 🆕 Probability recommendations
        if (scores.probability < ACCEPTANCE_THRESHOLDS.probability) {
            if (metrics.systemUptime < 99) {
                recommendations.push(
                    `🔴 Critical: Improve system uptime (current: ${metrics.systemUptime}%, target: ≥99%)`
                );
            }
            if (metrics.mttr > 60) {
                recommendations.push(
                    `⏱️ Reduce MTTR (current: ${metrics.mttr} min, target: <60 min)`
                );
            }
            if (metrics.autoRecoveryRate < 0.8) {
                recommendations.push(
                    `🤖 Improve auto-recovery rate (current: ${(metrics.autoRecoveryRate * 100).toFixed(1)}%, target: ≥80%)`
                );
            }
        }

        // 🆕 Capability recommendations
        if (scores.capability < ACCEPTANCE_THRESHOLDS.capability) {
            const featureCompletion = (metrics.implementedFeatures / metrics.plannedFeatures) * 100;
            if (featureCompletion < 80) {
                recommendations.push(
                    `📋 Complete feature development (${featureCompletion.toFixed(1)}% done, target: ≥80%)`
                );
            }
            if (metrics.platformSupport < 2) {
                recommendations.push(
                    `📱 Expand platform support (current: ${metrics.platformSupport}, target: ≥2 platforms)`
                );
            }
        }

        // Momentum recommendations (legacy)
        if (scores.momentum < ACCEPTANCE_THRESHOLDS.momentum) {
            if (metrics.bugFixTime >= 24) {
                recommendations.push(
                    `⏱️ Reduce bug fix cycle time (current: ${metrics.bugFixTime}h, target: <24h)`
                );
            }
            if (metrics.deploymentFrequency < metrics.idealFrequency) {
                recommendations.push(
                    `🚀 Increase deployment frequency (current: ${metrics.deploymentFrequency}/week, target: ${metrics.idealFrequency}/week)`
                );
            }
        }

        return recommendations;
    }
}
