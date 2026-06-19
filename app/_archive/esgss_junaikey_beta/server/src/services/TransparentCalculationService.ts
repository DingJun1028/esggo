import { ITransparentFormula, IFormulaItem } from '../src/omni/core/types/Evidence.types';
import { evidenceVaultService } from './EvidenceVaultService';

/**
 * TransparentCalculationService.ts
 * -------------------------------
 * 透明驗算服務：負責產生具備權重與數據鏈的結構化公式。
 * 
 * 核心準則：TRANSPARENT (可透明) - 算法公式公開化。
 */
export class TransparentCalculationService {
    private static instance: TransparentCalculationService;

    static getInstance(): TransparentCalculationService {
        if (!TransparentCalculationService.instance) {
            TransparentCalculationService.instance = new TransparentCalculationService();
        }
        return TransparentCalculationService.instance;
    }

    /**
     * 產生透明驗算結果
     * @param label 主項目名稱
     * @param rawItems 原始評分項與權重
     * @param standard 參考標準
     */
    public generateFormula(
        items: { label: string; score: number; weight: number; evidenceId?: string }[],
        standard?: string
    ): ITransparentFormula {
        let finalScore = 0;
        const dataChain: string[] = [];

        const formulaItems: IFormulaItem[] = items.map(item => {
            const weightedScore = item.score * item.weight;
            finalScore += weightedScore;

            if (item.evidenceId) {
                dataChain.push(item.evidenceId);
            }

            return {
                label: item.label,
                value: item.score,
                weight: item.weight,
                evidenceId: item.evidenceId
            };
        });

        return {
            finalScore: Math.round(finalScore * 100) / 100,
            items: formulaItems,
            dataChain,
            standard
        };
    }

    /**
     * 格式化公式為精簡描述 (用於傳統 formula 欄位)
     */
    public formatFormulaShort(formula: ITransparentFormula): string {
        return `Score: ${formula.finalScore} | Breakdown: ${formula.items.map(i => `${i.label}(${i.value}*${i.weight})`).join(' + ')}`;
    }
}

export const transparentCalculationService = TransparentCalculationService.getInstance();
