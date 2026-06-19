/**
 * 🏥 L1 Assessment Service
 * Sprint 2: Health Check Module
 * --------------------------------------------------
 * 負責 L1 快篩評估的核心計算邏輯
 */

import type {
    L1MinimalData,
    L1AssessmentResult,
    Gap,
    L1_SCORING_WEIGHTS
} from '../../src/types/esg-go/l1-mvd.types.js';
import crypto from 'crypto';

export class L1AssessmentService {
    /**
     * 主評估函數
     */
    static async assess(data: L1MinimalData, userId: string, ipAddress?: string): Promise<L1AssessmentResult> {
        // 1. 計算各維度分數
        const governanceScore = this.calculateGovernanceScore(data.governance);
        const environmentalScore = this.calculateEnvironmentalScore(data.environmental);
        const socialScore = this.calculateSocialScore(data.social);

        // 2. 加權總分
        const overallScore = Math.round(
            governanceScore * 0.35 +
            environmentalScore * 0.35 +
            socialScore * 0.30
        );

        // 3. 識別缺失 (< 60 分項目優先)
        const gaps = this.identifyGaps(data, {
            governance: governanceScore,
            environmental: environmentalScore,
            social: socialScore
        });

        // 4. 生成建議
        const recommendations = this.generateRecommendations(gaps);

        // 5. 預估工時
        const estimatedWorkload = gaps.reduce((total, gap) => total + (gap.estimatedHoursToFix || 0), 0);

        // 6. 生成 Hash Signature (5T: Trustworthy)
        const hashSignature = this.generateHashSignature(data);

        return {
            id: crypto.randomUUID(),
            score: overallScore,
            overallScore,
            dimensionScores: {
                governance: governanceScore,
                environmental: environmentalScore,
                social: socialScore,
            },
            gaps: gaps.slice(0, 10), // 只返回前 10 大缺失
            recommendations,
            estimatedHours: estimatedWorkload,
            estimatedWorkload,
            upgradeRecommendation: overallScore < 70,
            metadata: {
                hashSignature,
                sourceOrigin: 'web_portal',
                ipAddress,
                assessedAt: new Date(),
            },
            createdAt: new Date()
        };
    }

    /**
     * 治理維度評分
     */
    private static calculateGovernanceScore(governance: any): number {
        let score = 0;
        const maxScore = 100;

        // 董事會 ESG 監督 (25%)
        if (governance.hasBoardESGOversight) score += 25;

        // 誠信政策 (25%)
        if (governance.hasEthicsPolicy) score += 25;

        // 利害關係人溝通 (25%)
        if (governance.hasStakeholderEngagement) score += 25;

        // 風險管理 (25%)
        if (governance.hasRiskManagement) score += 25;

        return Math.min(score, maxScore);
    }

    /**
     * 環境維度評分
     */
    private static calculateEnvironmentalScore(environmental: any): number {
        let score = 0;
        const maxScore = 100;

        // 碳排放盤查 (30%)
        if (environmental.hasCarbonInventory) score += 30;

        // 能源管理 (25%)
        if (environmental.hasEnergyManagement) score += 25;

        // 廢棄物管理 (25%)
        if (environmental.hasWasteManagement) score += 25;

        // 水資源管理 (20%)
        if (environmental.hasWaterManagement) score += 20;

        return Math.min(score, maxScore);
    }

    /**
     * 社會維度評分
     */
    private static calculateSocialScore(social: any): number {
        let score = 0;
        const maxScore = 100;

        // 員工滿意度 (25%)
        if (social.hasEmployeeSatisfaction) score += 25;

        // 職業健康安全 (30%)
        if (social.hasOccupationalHealth) score += 30;

        // 人權政策 (25%)
        if (social.hasHumanRightsPolicy) score += 25;

        // 社區參與 (20%)
        if (social.hasCommunityEngagement) score += 20;

        return Math.min(score, maxScore);
    }

    /**
     * 識別缺失項目
     */
    private static identifyGaps(data: L1MinimalData, scores: any): Gap[] {
        const gaps: Gap[] = [];

        // 治理缺失
        if (!data.governance.hasBoardESGOversight) {
            gaps.push({
                dimension: 'governance',
                category: 'governance',
                item: '董事會 ESG 監督機制',
                title: '建立董事會 ESG 監督機制',
                description: '公司目前缺少董事會層級的 ESG 監督機制，這會影響治理評分與投資人信任。',
                severity: 'high',
                currentStatus: '未建立',
                targetStatus: '每季度討論 ESG 議題',
                estimatedHours: 10,
                estimatedHoursToFix: 10,
                recommendedAction: '建議董事會設立 ESG 委員會或指定專責董事',
                priority: 'high',
            });
        }

        if (!data.governance.hasEthicsPolicy) {
            gaps.push({
                dimension: 'governance',
                category: 'governance',
                item: '誠信經營政策',
                title: '建立誠信經營政策',
                description: '尚未制定正式的誠信經營政策，可能導致合規風險。',
                severity: 'high',
                currentStatus: '未制定',
                targetStatus: '完整政策文件 + 教育訓練',
                estimatedHours: 8,
                estimatedHoursToFix: 8,
                recommendedAction: '參考模板制定誠信政策並公告',
                priority: 'medium',
            });
        }

        // 環境缺失
        if (!data.environmental.hasCarbonInventory) {
            gaps.push({
                dimension: 'environmental',
                category: 'environmental',
                item: '碳排放盤查',
                title: '實施碳排放盤查',
                description: '缺乏碳排放盤查數據，是目前最嚴重的環境維度缺失。',
                severity: 'critical',
                currentStatus: '未盤查',
                targetStatus: 'Scope 1+2 完整盤查',
                estimatedHours: 40,
                estimatedHoursToFix: 40,
                recommendedAction: '委託顧問執行 ISO 14064-1 碳盤查',
                priority: 'high',
            });
        }

        if (!data.environmental.hasEnergyManagement) {
            gaps.push({
                dimension: 'environmental',
                category: 'environmental',
                item: '能源管理制度',
                title: '建立能源管理系統',
                description: '缺少系統化的能源監控與管理制度。',
                severity: 'high',
                currentStatus: '未建立',
                targetStatus: '能源監控系統',
                estimatedHours: 20,
                estimatedHoursToFix: 20,
                recommendedAction: '安裝智能電表並建立月度追蹤表',
                priority: 'medium',
            });
        }

        // 社會缺失
        if (!data.social.hasEmployeeSatisfaction) {
            gaps.push({
                dimension: 'social',
                category: 'social',
                item: '員工滿意度調查',
                title: '執行員工滿意度調查',
                description: '尚未建立定期的員工反饋機制。',
                severity: 'medium',
                currentStatus: '未執行',
                targetStatus: '年度調查 + 改進計畫',
                estimatedHours: 15,
                estimatedHoursToFix: 15,
                recommendedAction: '使用線上問卷工具執行年度調查',
                priority: 'low',
            });
        }

        if (!data.social.hasOccupationalHealth) {
            gaps.push({
                dimension: 'social',
                category: 'social',
                item: '職業健康安全管理',
                title: '優化職安管理制度',
                description: '職安管理尚未標準化，存在潛在的勞動風險。',
                severity: 'high',
                currentStatus: '未系統化',
                targetStatus: 'ISO 45001 框架',
                estimatedHours: 30,
                estimatedHoursToFix: 30,
                recommendedAction: '建立職安委員會並制定管理程序',
                priority: 'medium',
            });
        }

        // 按優先級 + 預估工時排序
        const priorityMap: Record<string, number> = { high: 1, medium: 2, low: 3 };
        return gaps.sort((a, b) => {
            const pa = priorityMap[a.priority || 'medium'];
            const pb = priorityMap[b.priority || 'medium'];
            if (pa !== pb) return pa - pb;
            return (b.estimatedHours || 0) - (a.estimatedHours || 0);
        });
    }

    /**
     * 生成改進建議
     */
    private static generateRecommendations(gaps: Gap[]): string[] {
        const recommendations: string[] = [];

        // 基於缺失提供具體建議
        const criticalGaps = gaps.filter(g => g.severity === 'critical');
        const highGaps = gaps.filter(g => g.severity === 'high');

        if (criticalGaps.length > 0) {
            recommendations.push('⚠️ 建議優先處理 Critical 等級缺失，這些是客戶/監管單位最關注的項目');
        }

        if (highGaps.length > 2) {
            recommendations.push('📋 高優先級項目較多，建議升級 Pro 版取得顧問模板與協作工具');
        }

        if (gaps.some(g => g.dimension === 'environmental' && (g.item || '').includes('碳排放'))) {
            recommendations.push('🌱 碳盤查建議委託專業顧問，確保符合 ISO 14064-1 標準');
        }

        if (gaps.some(g => g.dimension === 'governance')) {
            recommendations.push('🏛️ 治理缺失會影響投資人信任，建議盡快建立董事會 ESG 機制');
        }

        recommendations.push('💡 使用 Evidence Vault 跨部門收集證據，可節省 50% 協調時間');

        return recommendations;
    }

    /**
     * 生成 Hash Signature (5T: Trustworthy)
     * 使用深度排序確保物件內容一致時產生相同的 Hash
     */
    private static generateHashSignature(data: any): string {
        if (!data) return '';

        try {
            // 深度排序鍵值以獲取穩定字串
            const sortedData = this.deepSortObject(data);
            const dataString = JSON.stringify(sortedData);
            return crypto.createHash('sha256').update(dataString).digest('hex');
        } catch (error) {
            console.error('[L1Assessment] Hash generation failed:', error);
            return '';
        }
    }

    /**
     * 深度排序物件的所有鍵
     */
    private static deepSortObject(obj: any): any {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }

        if (obj instanceof Date) {
            return obj.toISOString();
        }

        if (Array.isArray(obj)) {
            return obj.map(item => this.deepSortObject(item));
        }

        const sortedKeys = Object.keys(obj).sort();
        const result: any = {};
        for (const key of sortedKeys) {
            result[key] = this.deepSortObject(obj[key]);
        }
        return result;
    }

    /**
     * 驗證 Hash Signature
     */
    static verifyHashSignature(data: L1MinimalData, signature: string): boolean {
        const calculatedHash = this.generateHashSignature(data);
        return calculatedHash === signature;
    }
}
