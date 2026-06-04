export interface SustainWriteSection {
    id?: string;
    company_id: string;
    chapter_id: string;
    chapter_name: string;
    content?: string;
    content_md?: string;
    field_values?: Record<string, unknown>;
    notes?: string;
    documents_state?: Record<string, boolean>;
    status?: 'empty' | 'draft' | 'reviewing' | 'completed';
    chapter_order?: number;
    gri_references?: string[];
    hash_lock?: string;
    updated_at?: string;
}
export declare function saveSustainWriteSection(params: SustainWriteSection): Promise<any>;
export declare function loadSustainWriteSections(companyId: string): Promise<SustainWriteSection[]>;
export declare function saveMetric(companyId: string, metric: Record<string, unknown>): Promise<unknown>;
export declare function loadMetrics(companyId: string): Promise<unknown[]>;
export declare function saveMemory(companyId: string, memory: Record<string, unknown>): Promise<unknown>;
export declare function loadMemories(companyId: string): Promise<unknown[]>;
//# sourceMappingURL=dataconnect-memory.d.ts.map