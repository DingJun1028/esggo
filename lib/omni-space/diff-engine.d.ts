import { OmniCard } from '@/src/shared/types';
/**
 * 差異對比結果契約
 */
export interface DiffResult {
    isAligned: boolean;
    differences: Record<string, {
        truth: unknown;
        snapshot: unknown;
    }>;
    severity: 'NONE' | 'LOW' | 'HIGH' | 'CRITICAL';
}
/**
 * 狀態對比演算法核心 (Diff Engine)
 * 實現硬制定的數據差異優先順序
 */
export declare class StateDiffEngine {
    /**
     * 比較真理狀態與外部快照，返回精確的差異結果
     * 優先順序硬制定：
     * 1. CRITICAL: 狀態 (status) 不一致
     * 2. HIGH: 核心屬性 (attributes/abilities) 數量或內容不一致
     * 3. LOW: 名稱 (name) 等文案欄位不一致
     */
    static compare(truth: OmniCard, snapshot: OmniCard): DiffResult;
    private static severityWeight;
}
//# sourceMappingURL=diff-engine.d.ts.map