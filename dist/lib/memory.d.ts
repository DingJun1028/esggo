export type MemoryType = 'field_value' | 'chapter_progress' | 'preference' | 'document_state' | 'session_context' | 'ai_conversation' | 'company_profile' | 'esg_target' | 'template_usage' | 'search_history' | 'agent_memory';
export interface MemoryRecord {
    id?: string;
    user_id: string;
    company_id: string;
    memory_type: MemoryType;
    memory_key: string;
    memory_value: Record<string, unknown>;
    context?: Record<string, unknown>;
    hash_lock?: string;
    version?: number;
    last_accessed?: string;
    created_at?: string;
    updated_at?: string;
}
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
/**
 * Write a memory record (upsert)
 */
export declare function writeMemory(type: MemoryType, key: string, value: Record<string, unknown>, context?: Record<string, unknown>, userId?: string, companyId?: string): Promise<MemoryRecord | null>;
/**
 * Read a memory record (localStorage first, then Supabase)
 */
export declare function readMemory(type: MemoryType, key: string, userId?: string, companyId?: string): Promise<Record<string, unknown> | null>;
/**
 * Read all memories of a given type for a user
 */
export declare function readMemoryByType(type: MemoryType, userId?: string, companyId?: string): Promise<MemoryRecord[]>;
/**
 * Delete a specific memory
 */
export declare function deleteMemory(type: MemoryType, key: string, userId?: string, companyId?: string): Promise<boolean>;
/**
 * Save a SustainWrite chapter (content + field values + documents)
 */
export declare function saveSustainWriteSection(params: SustainWriteSection): Promise<SustainWriteSection | null>;
/**
 * Load all SustainWrite sections for a company
 */
export declare function loadSustainWriteSections(companyId?: string): Promise<SustainWriteSection[]>;
/**
 * Load a single SustainWrite section
 */
export declare function loadSustainWriteSection(chapterId: string, companyId?: string): Promise<SustainWriteSection | null>;
export interface AIMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
    persona?: string;
}
export declare function saveAIConversation(persona: string, messages: AIMessage[], userId?: string, companyId?: string): Promise<void>;
export declare function loadAIConversation(persona: string, userId?: string, companyId?: string): Promise<AIMessage[]>;
export declare function savePreference(key: string, value: unknown): Promise<void>;
export declare function loadPreference<T = unknown>(key: string, defaultValue?: T): Promise<T>;
export declare function saveCompanyProfile(profile: Record<string, unknown>): Promise<void>;
export declare function loadCompanyProfile(): Promise<Record<string, unknown> | null>;
export declare function saveFieldValues(chapterId: string, values: Record<string, string>): Promise<void>;
export declare function loadFieldValues(chapterId: string): Promise<Record<string, string>>;
//# sourceMappingURL=memory.d.ts.map