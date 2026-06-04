/**
 * ESGSonar | Version Difference Engine
 * Handles comparison between regulation/report versions.
 */
export type DiffMode = 'word' | 'line' | 'char';
export interface DiffResult {
    added: string[];
    removed: string[];
    changed: boolean;
    count: number;
    unifiedDiff?: string;
    esgTags?: string[];
}
export declare class DiffEngine {
    /**
     * Simple line-based comparison
     */
    static compareLines(oldText: string, newText: string): DiffResult;
    /**
     * Structured JSON comparison
     */
    static compareJSON(oldObj: unknown, newObj: unknown): boolean;
    /**
     * Detect ESG-related keywords in changes
     */
    private static detectESGTags;
}
//# sourceMappingURL=diff-engine.d.ts.map