/**
 * 合約變更歷史追蹤 (Contract Change History Tracker)
 * 維護型別變更的時間軸記錄，確保治理可追溯
 */
export interface ContractChangeEvent {
    timestamp: string;
    file: string;
    changeType: 'added' | 'modified' | 'removed';
    schemaName: string;
    commitHash?: string;
    author?: string;
}
export declare function recordContractChange(event: ContractChangeEvent): void;
export declare function getContractHistory(): ContractChangeEvent[];
export declare function exportHistoryToADR(): string;
//# sourceMappingURL=contract-history-tracker.d.ts.map