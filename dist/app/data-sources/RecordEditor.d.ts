import type { OmniTableField, OmniTableRecord } from '@/lib/omni-table/client';
export declare function RecordEditorModal({ open, onClose, fields, record, onSave, onDelete, saving }: {
    open: boolean;
    onClose: () => void;
    fields: OmniTableField[];
    record: OmniTableRecord | null;
    onSave: (fields: Record<string, unknown>, recordId?: string) => Promise<void>;
    onDelete?: (recordId: string) => Promise<void>;
    saving: boolean;
}): import("react").JSX.Element;
//# sourceMappingURL=RecordEditor.d.ts.map