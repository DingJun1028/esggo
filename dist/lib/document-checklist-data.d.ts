export type DocStatus = 'pending' | 'completed' | 'in_progress' | 'missing' | 'needs_update';
export interface ESGDocument {
    id: string;
    name: string;
    standard: string;
    department: string;
    status: DocStatus;
    notes?: string;
    priority?: 'high';
    isNew?: boolean;
    category: 'D' | 'E' | 'S' | 'T' | 'G';
}
export declare const documentChecklist: ESGDocument[];
export declare const categoryMeta: {
    D: {
        label: string;
        color: string;
        bg: string;
        emoji: string;
    };
    E: {
        label: string;
        color: string;
        bg: string;
        emoji: string;
    };
    S: {
        label: string;
        color: string;
        bg: string;
        emoji: string;
    };
    T: {
        label: string;
        color: string;
        bg: string;
        emoji: string;
    };
    G: {
        label: string;
        color: string;
        bg: string;
        emoji: string;
    };
};
export declare const statusMeta: Record<DocStatus, {
    label: string;
    color: string;
    bg: string;
    icon: string;
}>;
//# sourceMappingURL=document-checklist-data.d.ts.map