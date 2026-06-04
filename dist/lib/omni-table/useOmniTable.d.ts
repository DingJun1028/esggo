import type { OmniTableSpace, OmniTableNode, OmniTableField, OmniTableView, OmniTableRecord, OmniTableRecordsResponse } from '@/lib/omni-table/client';
interface UseOmniTableReturn {
    loading: boolean;
    error: string | null;
    fetchSpaces: () => Promise<OmniTableSpace[]>;
    fetchNodes: (spaceId: string) => Promise<OmniTableNode[]>;
    fetchRecords: (datasheetId: string, opts?: {
        pageSize?: number;
        pageNum?: number;
        viewId?: string;
    }) => Promise<OmniTableRecordsResponse>;
    fetchFields: (datasheetId: string) => Promise<OmniTableField[]>;
    fetchViews: (datasheetId: string) => Promise<OmniTableView[]>;
    createRecords: (datasheetId: string, records: Array<{
        fields: Record<string, unknown>;
    }>) => Promise<OmniTableRecord[]>;
    updateRecords: (datasheetId: string, records: Array<{
        recordId: string;
        fields: Record<string, unknown>;
    }>) => Promise<OmniTableRecord[]>;
    deleteRecords: (datasheetId: string, recordIds: string[]) => Promise<void>;
    createDatasheet: (spaceId: string, name: string, fields: Array<{
        name: string;
        type: string;
    }>) => Promise<{
        id: string;
    }>;
}
export declare function useOmniTable(): UseOmniTableReturn;
export {};
//# sourceMappingURL=useOmniTable.d.ts.map