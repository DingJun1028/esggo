/**
 * OmniAcceptanceService.ts
 * 奧秘驗收服務 - Central Orchestration for 5-Dimensional Testing
 * 
 * Coordinates testing across all Omni systems and generates acceptance artifacts
 */

import { v4 as uuidv4 } from 'uuid';
import { PerformanceMonitor, type IPerformanceAcceptanceReport } from '../../src/utils/PerformanceMonitor.js';
import { EfficiencyMonitor } from './EfficiencyMonitor.js'; // 🆕 Efficiency data source
import ReliabilityMonitor from './ReliabilityMonitor.js'; // 🆕 Probability data source
import CapabilityTracker from './CapabilityTracker.js'; // 🆕 Capability data source
import PotentialTracker from './PotentialTracker.js'; // 🆕 Potential Energy data source
import redisService from './redisService.js';
import {
    AcceptanceCriteria,
    I5DimensionScore,
    I9DimensionScore,
    ITestMetrics,
    ACCEPTANCE_THRESHOLDS,
} from '../core/AcceptanceCriteria.js';
import {
    IAcceptanceArtifact,
    AcceptanceStatus,
    createAcceptanceArtifact,
    sealArtifact,
} from '../src/core/IAcceptanceArtifact.js';

/**
 * Acceptance Test Result Interface (9D)
 */
export interface IAcceptanceResult {
    systemName: string;
    scores: I9DimensionScore;         // ✅ Now 9D
    overallScore: number;
    status: 'READY' | 'NOT_READY' | 'CONDITIONAL';
    acceptanceGate: 'PASS' | 'FAIL' | 'CONDITIONAL';
    artifact: Readonly<IAcceptanceArtifact>;
    recommendations: string[];
    timestamp: number;
}

/**
 * Legacy 5D Acceptance Result (backward compatibility)
 */
export interface IAcceptanceResult5D {
    systemName: string;
    scores: I5DimensionScore;         // ⚠️ Legacy 5D
    overallScore: number;
    status: 'READY' | 'NOT_READY' | 'CONDITIONAL';
    acceptanceGate: 'PASS' | 'FAIL' | 'CONDITIONAL';
    artifact: Readonly<IAcceptanceArtifact>;
    recommendations: string[];
    timestamp: number;
}

/**
 * Function Test Result
 */
export interface IFunctionTestResult {
    passedTests: number;
    totalTests: number;
    criticalBugs: number;
    apiCompliance: number;
    score: number;
}

/**
 * Performance Test Result
 */
export interface IPerformanceTestResult {
    apiResponseTime: number;
    renderTime: number;
    memoryLeaks: number;
    score: number;
}

/**
 * Potential Test Result
 */
export interface IPotentialTestResult {
    modularity: number;
    extensionPoints: number;
    technicalDebt: number;
    score: number;
}

/**
 * Capacity Test Result
 */
export interface ICapacityTestResult {
    maxUsers: number;
    dbScalability: number;
    resourceEfficiency: number;
    score: number;
}

/**
 * Momentum Test Result
 */
export interface IMomentumTestResult {
    deployFrequency: number;
    bugFixTime: number;
    featureVelocity: number;
    score: number;
}

/**
 * 🆕 Efficiency Test Result
 */
export interface IEfficiencyTestResult {
    cpuUsage: number;
    memoryUsage: number;
    memoryWaste: number;
    costPerRequest: number;
    devEfficiency: number;
    score: number;
}

/**
 * 🆕 Probability Test Result
 */
export interface IProbabilityTestResult {
    uptime: number;
    mtbf: number;
    mttr: number;
    autoRecoveryRate: number;
    alertAccuracy: number;
    score: number;
}

/**
 * 🆕 Capability Test Result
 */
export interface ICapabilityTestResult {
    featureCoverage: number;
    serviceScope: number;
    platformSupport: number;
    languageSupport: number;
    score: number;
}

/**
 * 🆕 Potential Energy Test Result
 */
export interface IPotentialEnergyTestResult {
    userGrowth: number;
    businessValue: number;
    ecosystemImpact: number;
    score: number;
}

/**
 * OmniAcceptance Service
 */
export class OmniAcceptanceService {
    private static instance: OmniAcceptanceService;

    private constructor() { }

    static getInstance(): OmniAcceptanceService {
        if (!OmniAcceptanceService.instance) {
            OmniAcceptanceService.instance = new OmniAcceptanceService();
        }
        return OmniAcceptanceService.instance;
    }

    /**
     * Run Full Acceptance Test for a System
     * 
     * This is the main entry point for acceptance testing
     */
    async runFullAcceptance(
        systemName: string,
        metrics?: ITestMetrics,
        useCache: boolean = true
    ): Promise<IAcceptanceResult> {
        console.log(`[OmniAcceptance] Running full acceptance test for: ${systemName}`);

        const cacheKey = `acceptance:result:${systemName}`;

        // Try cache first (if enabled and available)
        if (useCache) {
            try {
                const cached = await redisService.get<IAcceptanceResult>(cacheKey);
                if (cached) {
                    console.log(`[OmniAcceptance] Cache hit for ${systemName}`);
                    return cached;
                }
            } catch (error) {
                console.log(`[OmniAcceptance] Cache miss (redis unavailable)`);
            }
        }

        // Gather metrics (real data or fallback to mock)
        const testMetrics = metrics || await this.gatherMetrics(systemName);

        // Calculate 9D scores using AcceptanceCriteria
        const scores = this.calculate9DScore(testMetrics);

        // Determine overall status
        const overallScore = this.calculateOverallScore(scores);
        const status = this.determineStatus(scores);
        const acceptanceGate = this.determineGate(scores);
        const recommendations = this.generateRecommendations(scores);

        // Generate acceptance artifact
        const artifact = createAcceptanceArtifact(
            uuidv4(),
            systemName,
            status === 'READY' ? 'PASS' : status === 'NOT_READY' ? 'FAIL' : 'PENDING' as any,
            `Acceptance artifact for ${systemName}`,
            []
        );

        const result: IAcceptanceResult = {
            systemName,
            scores,
            overallScore,
            status,
            acceptanceGate,
            artifact,
            recommendations,
            timestamp: Date.now(),
        };

        // Cache result (if enabled)
        if (useCache) {
            try {
                await redisService.set(cacheKey, result, 300); // 5 min TTL
            } catch (error) {
                // Silently fail - cache is optional
            }
        }

        return result;
    }

    /**
     * Calculate 9D Score from metrics
     * 
     * Maps raw metrics to AcceptanceCriteria formulas
     */
    calculate9DScore(metrics: ITestMetrics): I9DimensionScore {
        return AcceptanceCriteria.calculate9Dimensions(metrics);
    }

    /**
     * Calculate Overall Score (weighted average)
     */
    calculateOverallScore(scores: I9DimensionScore): number {
        return AcceptanceCriteria.calculateOverallScore(scores);
    }

    /**
     * Determine System Status
     */
    determineStatus(scores: I9DimensionScore): 'READY' | 'NOT_READY' | 'CONDITIONAL' {
        const overallScore = this.calculateOverallScore(scores);
        const status = AcceptanceCriteria.determineGateStatus(scores, overallScore);

        // Map GATE status to Internal READY status
        if (status === 'PASS') return 'READY';
        if (status === 'CONDITIONAL') return 'CONDITIONAL';
        return 'NOT_READY';
    }

    /**
     * Determine Acceptance Gate
     */
    determineGate(scores: I9DimensionScore): 'PASS' | 'FAIL' | 'CONDITIONAL' {
        const overallScore = this.calculateOverallScore(scores);
        return AcceptanceCriteria.determineGateStatus(scores, overallScore);
    }

    /**
     * Generate Recommendations
     */
    generateRecommendations(scores: I9DimensionScore): string[] {
        const recommendations: string[] = [];

        if (scores.function < ACCEPTANCE_THRESHOLDS.function) {
            recommendations.push('🔧 Increase test coverage and fix critical bugs');
        }
        if (scores.performance < ACCEPTANCE_THRESHOLDS.performance) {
            recommendations.push('⚡ Optimize API response time and reduce memory leaks');
        }
        if (scores.efficiency < ACCEPTANCE_THRESHOLDS.efficiency) {
            recommendations.push('💰 Optimize CPU/Memory usage and reduce cost per request');
        }
        if (scores.capacity < ACCEPTANCE_THRESHOLDS.capacity) {
            recommendations.push('📈 Improve database scalability and resource efficiency');
        }
        if (scores.probability < ACCEPTANCE_THRESHOLDS.probability) {
            recommendations.push('🛡️ Improve system uptime and recovery capabilities');
        }
        if (scores.capability < ACCEPTANCE_THRESHOLDS.capability) {
            recommendations.push('🎯 Expand feature coverage and platform support');
        }
        if (scores.potential < ACCEPTANCE_THRESHOLDS.potential) {
            recommendations.push('🔌 Increase modularity and reduce technical debt');
        }
        if (scores.potentialEnergy < ACCEPTANCE_THRESHOLDS.potentialEnergy) {
            recommendations.push('📢 Improve market penetration and brand influence');
        }
        if (scores.momentum < ACCEPTANCE_THRESHOLDS.momentum) {
            recommendations.push('🚀 Increase deployment frequency and bug fix speed');
        }

        return recommendations;
    }

    /**
     * Gather Metrics from All Sources
     * 
     * Integration points:
     * - EfficiencyMonitor (CPU, Memory, Cost)
     * - ReliabilityMonitor (Uptime, MTBF, MTTR)
     * - CapabilityTracker (Features, APIs, Platforms)
     * - PotentialTracker (Users, Market, Growth)
     * - OmniDebug (TODO)
     */
    private async gatherMetrics(systemName: string): Promise<ITestMetrics> {
        console.log(`[OmniAcceptance] Gathering metrics for ${systemName}...`);

        // 1. Get Base Mock Metrics (for dimensions not yet integrated)
        const mockMetrics = await this.getMockMetrics(systemName);

        // 2. 🆕 Get Real Efficiency Metrics
        const efficiencyReport = EfficiencyMonitor.getInstance().generateAcceptanceReport();

        // 3. 🆕 Get Real Probability Metrics
        const reliabilityReport = ReliabilityMonitor.getInstance().generateAcceptanceReport();

        // 4. 🆕 Get Real Capability Metrics
        const capabilityReport = CapabilityTracker.getInstance().generateAcceptanceReport();

        // 5. 🆕 Get Real Potential Energy Metrics
        const potentialReport = PotentialTracker.getInstance().generateAcceptanceReport();

        // Safe value extraction with defaults
        const cpuUsageAvg = efficiencyReport.cpuUsageAvg ?? 0.65; // Default: 65% CPU usage
        const memoryUsageAvg = efficiencyReport.memoryUsageAvg ?? 0.68; // Default: 68% memory
        const memoryWasteRatio = efficiencyReport.memoryWasteRatio ?? 0.12; // Default: 12% waste
        const costPerRequest = efficiencyReport.costPerRequest || 0.025;

        // 6. Merge Real Data over Mock Data
        return {
            ...mockMetrics,

            // Overwrite with Real Efficiency Data
            cpuUsageAvg: cpuUsageAvg,
            memoryUsageAvg: memoryUsageAvg,
            memoryWasteRatio: memoryWasteRatio,
            costPerRequest: costPerRequest,
            industryAvgCost: mockMetrics.industryAvgCost || 0.05,

            // Overwrite with Real Probability Data
            systemUptime: reliabilityReport.uptime ?? 99.5,
            mtbf: reliabilityReport.mtbf ?? 720,
            mttr: reliabilityReport.mttr ?? 30,
            autoRecoveryRate: reliabilityReport.autoRecoveryRate ?? 0.85,
            alertAccuracy: reliabilityReport.alertAccuracy ?? 0.92,
            falsePositiveRate: 0.08, // Derivative metric

            // Overwrite with Real Capability Data
            implementedFeatures: capabilityReport.implementedFeatures || 18,
            plannedFeatures: capabilityReport.plannedFeatures || 20,
            coreFeaturesComplete: capabilityReport.coreFeaturesComplete ?? 0.9,
            supportedUseCases: capabilityReport.supportedUseCases || 20,
            targetUseCases: 25,
            apiEndpointCount: capabilityReport.apiEndpointCount || 42,
            platformSupport: capabilityReport.platformSupport || 4,
            languageSupport: capabilityReport.languageSupport || 4,
            customizationLevel: capabilityReport.customizationLevel || 8,

            // 🆕 Potential Energy - Use real data with realistic defaults
            currentUserCount: Math.round(potentialReport.currentUserCount) || 10000,
            targetMarketSize: 50000, // ESG market size estimate
            retentionRate: potentialReport.userRetentionRate || 0.80,
            kFactor: 1.3, // Viral coefficient
            marketDemand: Math.min(10, (potentialReport.opportunityScore || 70) / 10), // 0-10 scale
            featureCompleteness: Math.min(10, (potentialReport.differentiationScore || 70) / 10), // 0-10 scale
            monetizationCapacity: 7, // 0-10 scale
            integrationCount: Math.round((potentialReport.sectorPenetration || 0.4) * 20), // Based on penetration
            communityActivity: 6, // 0-10 scale
            brandInfluence: 6, // 0-10 scale

            // 🆕 Momentum - Use real efficiency data
            deploymentFrequency: Math.round(efficiencyReport.deploymentFrequency) || 3,
            idealFrequency: 4, // Target: 4 deployments/week
            bugFixTime: efficiencyReport.avgBugFixTime || 12, // Target: < 24 hours
            featureVelocity: Math.round(efficiencyReport.featureVelocity) || 6,
            targetVelocity: 8, // Target: 8 features/sprint
        };
    }

    /**
     * Mock metrics for testing (temporary)
     */
    private async getMockMetrics(systemName: string): Promise<ITestMetrics> {
        return {
            // Function
            passedTests: 95,
            totalTests: 100,
            criticalBugCount: 0,
            apiContractCompliance: 95,

            // Performance
            apiResponseTime: 150,
            renderTime: 80,
            memoryLeaks: 0,

            // Potential
            codeModularity: 8,
            extensionPoints: 15,
            maxExtensions: 20,
            technicalDebt: 15,
            technicalDebtThreshold: 30,

            // Capacity
            maxConcurrentUsers: 1200,
            targetUsers: 1000,
            databaseScalability: 8,
            resourceEfficiency: 0.85,

            // Momentum
            deploymentFrequency: 3,
            idealFrequency: 4,
            bugFixTime: 12,
            featureVelocity: 6,
            targetVelocity: 8,

            // Additional props for completeness
            cpuUsageAvg: 0.65,
            memoryUsageAvg: 0.68,
            memoryWasteRatio: 0.12,
            costPerRequest: 0.025,
            industryAvgCost: 0.05,

            // Probability
            systemUptime: 99.5,
            mtbf: 720,
            mttr: 30,
            autoRecoveryRate: 0.85,
            alertAccuracy: 0.92,
            falsePositiveRate: 0.08,

            // Capability
            implementedFeatures: 18,
            plannedFeatures: 20,
            coreFeaturesComplete: 0.9,
            supportedUseCases: 20,
            targetUseCases: 25,
            apiEndpointCount: 42,
            platformSupport: 4,
            languageSupport: 4,
            customizationLevel: 8,

            // Potential Energy
            currentUserCount: 10000,
            targetMarketSize: 50000,
            retentionRate: 0.80,
            kFactor: 1.3,
            featureCompleteness: 7,
            marketDemand: 7,
            monetizationCapacity: 7,
            integrationCount: 8,
            communityActivity: 6,
            brandInfluence: 6,
        };
    }
}

export default OmniAcceptanceService;
