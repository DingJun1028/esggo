/**
 * @esgss/jun-ai-ceremony
 * SuggestionEngine（淨化建議引擎）
 * 
 * 分析 Rs 共鳴狀態，生成可執行的淨化任務
 * 遵循 5T 協議規範
 */

import { generateOmniUUID } from './IComponentCore.js';
import { ResonanceResult } from './AlchemyForge.js';

/**
 * 淨化行動類型
 */
export type PurificationActionType = 'AUDIT' | 'CLEANUP' | 'OPTIMIZE' | 'MANUAL';

/**
 * 淨化衝擊力
 */
export type PurificationImpact = 'HIGH' | 'MEDIUM' | 'LOW';

/**
 * 淨化建議 (可執行任務)
 */
export interface PurificationSuggestion {
    /** 唯一識別碼 */
    id: string;
    /** 建議標題 */
    title: string;
    /** 詳細描述 */
    description: string;
    /** 行動類型 */
    actionType: PurificationActionType;
    /** 預期提升衝擊力 */
    impact: PurificationImpact;
    /** 是否可自動修復 */
    isAutoFixable: boolean;
    /** 估計 Rs 提升值 */
    estimatedRsBoost?: number;
}

/**
 * SuggestionEngine - 淨化建議生成引擎
 */
export class SuggestionEngine {

    /**
     * 根據共鳴結果生成結構化建議
     * 
     * @param resonance - 共鳴評估結果
     * @param context - 上下文標識
     * @returns PurificationSuggestion[] - 建議列表
     */
    generateSuggestions(
        resonance: ResonanceResult,
        context: string
    ): PurificationSuggestion[] {
        const suggestions: PurificationSuggestion[] = [];
        const { rs_score, tier } = resonance;

        // 規則 1: 低共鳴分數 (Critical)
        if (rs_score < 50) {
            suggestions.push({
                id: generateOmniUUID('sugg-audit'),
                title: '執行深度系統審計 (Deep System Audit)',
                description: `檢測到共鳴分數過低 (${rs_score})。建議立即執行完整性掃描以識別核心漏洞。`,
                actionType: 'AUDIT',
                impact: 'HIGH',
                isAutoFixable: true,
                estimatedRsBoost: 15
            });
        }

        // 規則 2: Coal 等級 (Entropy High)
        if (tier === 'Coal') {
            suggestions.push({
                id: generateOmniUUID('sugg-entropy'),
                title: '啟動熵減儀式 (Entropy Reduction Ritual)',
                description: '系統處於 "Coal" 狀態，熵值過高。需執行煉金轉換以重組資料結構。',
                actionType: 'OPTIMIZE',
                impact: 'HIGH',
                isAutoFixable: false,
                estimatedRsBoost: 20
            });
        }

        // 規則 3: 中等分數優化 (Optimization)
        if (rs_score >= 50 && rs_score < 80) {
            suggestions.push({
                id: generateOmniUUID('sugg-polish'),
                title: '資料結構拋光 (Data Structure Polish)',
                description: '共鳴尚可，但仍有提升空間。建議優化資料一致性以達成 "Pulse" 狀態。',
                actionType: 'CLEANUP',
                impact: 'MEDIUM',
                isAutoFixable: true,
                estimatedRsBoost: 10
            });
        }

        // 規則 4: 通用維護 (Manual)
        if (suggestions.length === 0 && rs_score < 100) {
            suggestions.push({
                id: generateOmniUUID('sugg-maint'),
                title: '例行性共鳴校準',
                description: '系統運行良好。建議進行手動校準以維持高共鳴狀態。',
                actionType: 'MANUAL',
                impact: 'LOW',
                isAutoFixable: false,
                estimatedRsBoost: 5
            });
        }

        return suggestions;
    }
}

/**
 * 創建預設配置的 SuggestionEngine 實例
 */
export function createSuggestionEngine(): SuggestionEngine {
    return new SuggestionEngine();
}
