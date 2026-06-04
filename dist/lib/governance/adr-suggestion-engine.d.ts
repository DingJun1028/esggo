/**
 * 智能 ADR 建議引擎 (ADR Suggestion Engine)
 * 分析程式碼變更，自動生成 ADR 建議與版本追蹤
 */
export interface TypeChange {
    file: string;
    type: 'added' | 'modified' | 'removed';
    schemaName?: string;
}
export interface ADRSuggestion {
    adrNumber: number;
    title: string;
    rationale: string;
    impact: string;
    relatedTypes: string[];
}
export declare function analyzeTypeChanges(sourceDir?: string): TypeChange[];
export declare function generateADRSuggestion(changes: TypeChange[]): ADRSuggestion;
//# sourceMappingURL=adr-suggestion-engine.d.ts.map