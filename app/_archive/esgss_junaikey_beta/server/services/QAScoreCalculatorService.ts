/**
 * 📊 QA Score Calculator Service
 * Sprint 2: ESG Report Quality Assessment
 * --------------------------------------------------
 * 實作 QA Score v0 演算法：5 維度評分系統
 */

import crypto from 'crypto';
import type {
    QAScoreResult,
    QAScoreDimensions,
    QAGap,
    ReportData
} from '../../src/types/esg-go/qa-score.types.js';

export class QAScoreCalculatorService {
    /**
     * 計算 QA Score（主流程）
     */
    static async calculate(
        reportData: ReportData,
        evidenceCount: number = 0,
        lockedEvidenceCount: number = 0
    ): Promise<QAScoreResult> {
        // 1. Calculate each dimension
        const completenessScore = this.calculateCompleteness(reportData);
        const accuracyScore = this.calculateAccuracy(reportData);
        const consistencyScore = this.calculateConsistency(reportData);
        const comparabilityScore = this.calculateComparability(reportData);
        const trustworthyScore = this.calculateTrustworthiness(
            reportData,
            evidenceCount,
            lockedEvidenceCount
        );

        // 2. Apply weights
        const dimensions: QAScoreDimensions = {
            completeness: completenessScore,
            accuracy: accuracyScore,
            consistency: consistencyScore,
            comparability: comparabilityScore,
            trustworthy: trustworthyScore
        };

        const weights = {
            completeness: 0.25,
            accuracy: 0.25,
            consistency: 0.20,
            comparability: 0.15,
            trustworthy: 0.15
        };

        const overallScore = Math.round(
            completenessScore * weights.completeness +
            accuracyScore * weights.accuracy +
            consistencyScore * weights.consistency +
            comparabilityScore * weights.comparability +
            trustworthyScore * weights.trustworthy
        );

        // 3. Assign grade
        const grade = this.assignGrade(overallScore);

        // 4. Identify gaps
        const gaps = this.identifyGaps(dimensions, reportData);

        // 5. Generate recommendations
        const recommendations = this.generateRecommendations(gaps);

        // 6. Check certification eligibility
        const isCertifiable = this.checkCertificationEligibility(dimensions);
        const certificationRequirements = this.getCertificationRequirements(dimensions);

        return {
            overallScore,
            grade,
            dimensions,
            gaps,
            recommendations,
            isCertifiable,
            certificationRequirements,
            timestamp: new Date()
        };
    }

    /**
     * 1. Completeness (完整性) - 25%
     * 評估報告是否涵蓋所有必要的 ESG 指標
     */
    private static calculateCompleteness(data: ReportData): number {
        let score = 0;
        const maxScore = 100;

        // GRI Core Indicators (40 points)
        const griCoreCount = data.griIndicators?.filter(i => i.isCoreIndicator).length || 0;
        const griRequired = 33; // GRI 核心指標數量
        score += Math.min((griCoreCount / griRequired) * 40, 40);

        // G/E/S Coverage (30 points)
        const hasPolicies = data.hasBoardESGPolicy ? 10 : 0;
        const hasEmissions = data.hasEmissionsData ? 10 : 0;
        const hasEmployeeData = data.hasEmployeeWelfareData ? 10 : 0;
        score += hasPolicies + hasEmissions + hasEmployeeData;

        // Materiality Assessment (15 points)
        if (data.hasMaterialityAssessment) score += 15;

        // Stakeholder Engagement (15 points)
        if (data.hasStakeholderEngagement) score += 15;

        return Math.min(Math.round(score), maxScore);
    }

    /**
     * 2. Accuracy (準確性) - 25%
     * 評估數據計算方法與國際標準的符合度
     */
    private static calculateAccuracy(data: ReportData): number {
        let score = 0;
        const maxScore = 100;

        // ISO 14064-1 Compliance (30 points)
        if (data.ghgProtocolCompliance === 'full') score += 30;
        else if (data.ghgProtocolCompliance === 'partial') score += 15;

        // Third-party Verification (40 points)
        if (data.hasThirdPartyVerification) score += 40;

        // Data Quality Checks (30 points)
        const dataQualityScore = (data.dataQualityScore || 0) * 30 / 100;
        score += dataQualityScore;

        return Math.min(Math.round(score), maxScore);
    }

    /**
     * 3. Consistency (一致性) - 20%
     * 評估跨年度數據的一致性與可比性
     */
    private static calculateConsistency(data: ReportData): number {
        let score = 0;
        const maxScore = 100;

        // Year-over-Year Comparability (50 points)
        if (data.hasYearOverYearData) {
            score += 50;

            // Restatement disclosure (bonus)
            if (data.hasRestatementDisclosure) score += 10;
        }

        // Methodology Consistency (40 points)
        if (data.usesConsistentMethodology) score += 40;

        return Math.min(Math.round(score), maxScore);
    }

    /**
     * 4. Comparability (可比性) - 15%
     * 評估報告與同業的可比性（產業標準、框架對齊）
     */
    private static calculateComparability(data: ReportData): number {
        let score = 0;
        const maxScore = 100;

        // Framework Alignment (60 points)
        const frameworks = data.reportingFrameworks || [];
        if (frameworks.includes('GRI')) score += 20;
        if (frameworks.includes('TCFD')) score += 20;
        if (frameworks.includes('SASB')) score += 20;

        // Industry Benchmarks (40 points)
        if (data.includesIndustryBenchmarks) score += 40;

        return Math.min(Math.round(score), maxScore);
    }

    /**
     * 5. Trustworthy (可信度) - 15%
     * 評估報告的可信度（證據數量、Hash Lock、區塊鏈錨定）
     */
    private static calculateTrustworthiness(
        data: ReportData,
        evidenceCount: number,
        lockedEvidenceCount: number
    ): number {
        let score = 0;
        const maxScore = 100;

        // Evidence Count (40 points)
        const evidenceScore = Math.min((evidenceCount / 20) * 40, 40);
        score += evidenceScore;

        // Hash Lock Ratio (30 points)
        if (evidenceCount > 0) {
            const lockRatio = lockedEvidenceCount / evidenceCount;
            score += lockRatio * 30;
        }

        // Third-party Assurance (30 points)
        if (data.hasThirdPartyVerification) score += 30;

        return Math.min(Math.round(score), maxScore);
    }

    /**
     * 分配等級
     */
    private static assignGrade(score: number): string {
        if (score >= 95) return 'A+';
        if (score >= 90) return 'A';
        if (score >= 85) return 'B+';
        if (score >= 80) return 'B';
        if (score >= 75) return 'C+';
        if (score >= 70) return 'C';
        if (score >= 60) return 'D';
        return 'F';
    }

    /**
     * 識別缺失
     */
    private static identifyGaps(
        dimensions: QAScoreDimensions,
        data: ReportData
    ): QAGap[] {
        const gaps: QAGap[] = [];

        // Completeness gaps
        if (dimensions.completeness < 80) {
            gaps.push({
                dimension: 'completeness',
                severity: 'high',
                description: 'GRI 核心指標覆蓋不足',
                recommendation: '補充遺漏的 GRI 核心指標（目標 33 項）',
                impactOnScore: 100 - dimensions.completeness
            });
        }

        // Accuracy gaps
        if (dimensions.accuracy < 80 && !data.hasThirdPartyVerification) {
            gaps.push({
                dimension: 'accuracy',
                severity: 'high',
                description: '缺少第三方查證',
                recommendation: '委託 ISO 14064-1 查證機構進行驗證',
                impactOnScore: 40
            });
        }

        // Trustworthy gaps
        if (dimensions.trustworthy < 70) {
            gaps.push({
                dimension: 'trustworthy',
                severity: 'medium',
                description: '證據數量不足或未 Hash Lock',
                recommendation: '上傳更多佐證文件並執行 Hash Lock',
                impactOnScore: 100 - dimensions.trustworthy
            });
        }

        // Sort by impact
        return gaps.sort((a, b) => b.impactOnScore - a.impactOnScore);
    }

    /**
     * 生成改進建議
     */
    private static generateRecommendations(gaps: QAGap[]): string[] {
        return gaps.map(gap => gap.recommendation);
    }

    /**
     * 檢查是否符合認證標準
     */
    private static checkCertificationEligibility(dimensions: QAScoreDimensions): boolean {
        // 認證門檻：所有維度 >= 80 分
        return Object.values(dimensions).every(score => score >= 80);
    }

    /**
     * 取得認證要求清單
     */
    private static getCertificationRequirements(dimensions: QAScoreDimensions): string[] {
        const requirements: string[] = [];

        if (dimensions.completeness < 80) {
            requirements.push('完整性需達 80 分（目前 ' + dimensions.completeness + ' 分）');
        }
        if (dimensions.accuracy < 80) {
            requirements.push('準確性需達 80 分（目前 ' + dimensions.accuracy + ' 分）');
        }
        if (dimensions.consistency < 80) {
            requirements.push('一致性需達 80 分（目前 ' + dimensions.consistency + ' 分）');
        }
        if (dimensions.comparability < 80) {
            requirements.push('可比性需達 80 分（目前 ' + dimensions.comparability + ' 分）');
        }
        if (dimensions.trustworthy < 80) {
            requirements.push('可信度需達 80 分（目前 ' + dimensions.trustworthy + ' 分）');
        }

        return requirements;
    }

    /**
     * 生成 Hash Signature（for 5T Protocol）
     */
    static generateHashSignature(result: QAScoreResult): string {
        const dataString = JSON.stringify({
            overallScore: result.overallScore,
            dimensions: result.dimensions,
            timestamp: result.timestamp.toISOString()
        });

        return crypto
            .createHash('sha256')
            .update(dataString)
            .digest('hex');
    }
}
