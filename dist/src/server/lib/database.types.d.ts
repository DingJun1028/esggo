export type EvidenceRow = {
    id: string;
    user_id: string;
    tag: string;
    content: string;
    content_type: string;
    content_hash: string;
    metadata: Record<string, unknown> | null;
    status: 'draft' | 'sealed' | 'anchored' | 'archived' | 'expired';
    integrity_status: 'valid' | 'tampered' | 'unverified' | 'verification_failed';
    blockchain_tx: string | null;
    created_at: string;
    updated_at: string;
    sealed_at: string | null;
    expires_at: string | null;
    archived_at: string | null;
};
export type Database = {
    public: {
        Tables: {
            evidences: {
                Row: EvidenceRow;
                Insert: Omit<EvidenceRow, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<EvidenceRow, 'id' | 'created_at' | 'updated_at'>>;
            };
            ucc_tags: {
                Row: {
                    id: string;
                    name: string;
                    category: string;
                    color: string | null;
                    icon: string | null;
                    parent_tag_id: string | null;
                    metadata: Record<string, unknown> | null;
                    created_at: string;
                };
                Insert: Omit<Database['public']['Tables']['ucc_tags']['Row'], 'id' | 'created_at'>;
                Update: Partial<Omit<Database['public']['Tables']['ucc_tags']['Row'], 'id' | 'created_at'>>;
            };
            ucc_think_tanks: {
                Row: {
                    id: string;
                    evidence_id: string;
                    entity_type: string;
                    entity_name: string;
                    attributes: Array<Record<string, unknown>>;
                    relations: Array<Record<string, unknown>>;
                    knowledge_graph_node_id: string | null;
                    confidence_score: number;
                    extracted_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['ucc_think_tanks']['Row'], 'id' | 'extracted_at' | 'updated_at'>;
                Update: Partial<Omit<Database['public']['Tables']['ucc_think_tanks']['Row'], 'id' | 'extracted_at' | 'updated_at'>>;
            };
            ucc_elements: {
                Row: {
                    id: string;
                    evidence_id: string;
                    element_type: string;
                    content: string | Record<string, unknown>;
                    content_hash: string;
                    position: Record<string, unknown> | null;
                    extracted_text: string | null;
                    ocr_result: Record<string, unknown> | null;
                    analysis: Record<string, unknown> | null;
                    created_at: string;
                };
                Insert: Omit<Database['public']['Tables']['ucc_elements']['Row'], 'id' | 'created_at'>;
                Update: Partial<Omit<Database['public']['Tables']['ucc_elements']['Row'], 'id' | 'created_at'>>;
            };
            audit_logs: {
                Row: {
                    id: string;
                    user_id: string;
                    action: string;
                    severity: string;
                    resource_type: string;
                    resource_id: string;
                    details: Record<string, unknown>;
                    ip_address: string | null;
                    user_agent: string | null;
                    timestamp: string;
                    session_id: string | null;
                };
                Insert: Omit<Database['public']['Tables']['audit_logs']['Row'], 'id' | 'timestamp'>;
                Update: Partial<Omit<Database['public']['Tables']['audit_logs']['Row'], 'id' | 'timestamp'>>;
            };
            integrity_alerts: {
                Row: {
                    id: string;
                    evidence_id: string;
                    alert_type: string;
                    severity: string;
                    status: string;
                    description: string;
                    details: Record<string, unknown>;
                    detected_at: string;
                    resolved_at: string | null;
                    resolved_by: string | null;
                    resolution_notes: string | null;
                };
                Insert: Omit<Database['public']['Tables']['integrity_alerts']['Row'], 'id' | 'detected_at'>;
                Update: Partial<Omit<Database['public']['Tables']['integrity_alerts']['Row'], 'id' | 'detected_at'>>;
            };
            evidence_vault: {
                Row: {
                    id: string;
                    uuid: string;
                    timestamp: number;
                    formula: string;
                    impact_metric: Record<string, unknown>;
                    hash_lock: string;
                    source_origin: string;
                    lifecycle_stage: string;
                    metadata: Record<string, unknown>;
                    created_at: string;
                };
                Insert: Omit<Database['public']['Tables']['evidence_vault']['Row'], 'id' | 'created_at'>;
                Update: Partial<Omit<Database['public']['Tables']['evidence_vault']['Row'], 'id' | 'created_at'>>;
            };
            audit_trail: {
                Row: {
                    id: string;
                    record_id: string;
                    action: string;
                    actor: string;
                    details: Record<string, unknown>;
                    created_at: string;
                };
                Insert: Omit<Database['public']['Tables']['audit_trail']['Row'], 'id' | 'created_at'>;
                Update: Partial<Omit<Database['public']['Tables']['audit_trail']['Row'], 'id' | 'created_at'>>;
            };
        };
        Views: Record<string, never>;
        Functions: Record<string, never>;
        Enums: Record<string, never>;
    };
};
//# sourceMappingURL=database.types.d.ts.map