export type RecordLifecycleStatus = 'draft' | 'pending' | 'inReview' | 'approved' | 'active' | 'completed' | 'warning' | 'rejected' | 'expired' | 'archived';
export type AttentionStatus = 'critical' | 'high' | 'medium' | 'low' | 'none';
export interface StatusPresentation {
    label: string;
    tone: 'neutral' | 'info' | 'success' | 'warning' | 'danger';
    icon?: string;
}
export declare const STATUS_PRESENTATION_MAP: Record<RecordLifecycleStatus, StatusPresentation>;
export interface AuditEvent {
    id: string;
    actor: string;
    action: string;
    timestamp: string;
    details?: string;
    status?: RecordLifecycleStatus;
}
export interface EvidenceFileRef {
    id: string;
    fileName: string;
    fileType: string;
    fileSizeMb?: number;
    uploadedAt: string;
    uploadedBy: string;
    status: 'pending' | 'verified' | 'rejected';
    hashLock?: string;
    zkpProof?: boolean;
}
export interface AuditMeta {
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
    version: number;
    hashLock?: string;
}
export interface LabelValue {
    label: string;
    value: string;
    tone?: 'neutral' | 'info' | 'success' | 'warning' | 'danger';
}
export interface TableColumn<T = Record<string, unknown>> {
    key: keyof T | string;
    label: string;
    width?: number;
    align?: 'left' | 'center' | 'right';
    render?: (row: T) => React.ReactNode;
}
export interface MetricCardData {
    label: string;
    value: string;
    unit?: string;
    trend?: string;
    trendUp?: boolean;
    tone?: 'neutral' | 'info' | 'success' | 'warning' | 'danger';
}
//# sourceMappingURL=shared-types.d.ts.map