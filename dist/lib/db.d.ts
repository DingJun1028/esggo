import { listAllTasks, upsertTask } from '@dataconnect/generated';
import { dcGetReportById } from './dataconnect-services';
export { listAllTasks, upsertTask, dcGetReportById };
export interface Report {
    id?: string;
    title: string;
    status: 'draft' | 'verified' | 'error' | 'warning';
    ownerId: string;
    createdAt: unknown;
    updatedAt: unknown;
}
export interface VaultEvidence {
    id?: string;
    reportId: string;
    fileName: string;
    fileUrl: string;
    hashLock: string;
    uploadedAt: unknown;
}
export interface Signature {
    id?: string;
    evidenceId: string;
    signerId: string;
    signature: string;
    timestamp: unknown;
}
export interface GovernanceMetric {
    id?: string;
    [key: string]: unknown;
}
export interface Task {
    id?: string;
    [key: string]: unknown;
}
export interface EvidenceFile {
    id?: string;
    [key: string]: unknown;
}
export interface AuditRecord {
    id?: string;
    [key: string]: unknown;
}
export interface AdvisoryMessage {
    id?: string;
    [key: string]: unknown;
}
export interface EnvironmentalMetric {
    id?: string;
    [key: string]: unknown;
}
export interface RoadmapMilestone {
    id?: string;
    [key: string]: unknown;
}
export interface SocialMetric {
    id?: string;
    [key: string]: unknown;
}
export declare const getGovernanceMetrics: (ownerId?: unknown) => Promise<any>;
export declare const getSocialMetrics: (ownerId?: unknown) => Promise<any>;
export declare const getEnvironmentalData: (activeCategory?: unknown) => Promise<any>;
export declare const upsertEnvironmentalData: (data: unknown) => Promise<any>;
export declare const deleteEnvironmentalData: (id: unknown) => Promise<any>;
export declare const getTasks: (ownerId?: unknown) => Promise<any>;
export declare const getAuditLogs: (ownerId?: unknown) => Promise<any>;
export declare const getRoadmapMilestones: () => Promise<any>;
export declare const logAudit: (record: unknown) => Promise<any>;
export declare const getDashboardStats: (ownerId?: unknown) => Promise<any>;
export declare const getEvidenceFiles: () => Promise<any>;
export declare const getReadingRoomReports: () => Promise<any>;
export declare const secureHash: (data: unknown) => Promise<string>;
export declare const sealRecord: (data: any, ownerId: string) => Promise<string>;
export declare const saveAdvisorySession: (session: unknown, p2?: unknown) => Promise<any>;
export declare const getAdvisorySession: (ownerId: unknown) => Promise<any>;
export declare const upsertRoadmapMilestone: (data: unknown) => Promise<any>;
export declare const updateMilestoneStatus: (id: unknown, status: unknown) => Promise<any>;
export declare const globalSearch: (query: unknown) => Promise<any>;
export declare const reportsRef: import("@firebase/firestore").CollectionReference<import("@firebase/firestore").DocumentData, import("@firebase/firestore").DocumentData>;
export declare const getReportsByOwner: (ownerId: string) => Promise<any[]>;
export declare const getReport: (id: string) => Promise<any>;
export declare const createReport: (data: unknown) => Promise<string>;
export declare const updateReportStatus: (id: string, status: unknown) => Promise<boolean>;
export declare const evidenceRef: import("@firebase/firestore").CollectionReference<import("@firebase/firestore").DocumentData, import("@firebase/firestore").DocumentData>;
export declare const getEvidenceForReport: (reportId: string) => Promise<never[]>;
export declare const addEvidence: (data: unknown) => Promise<string>;
export declare const signaturesRef: import("@firebase/firestore").CollectionReference<import("@firebase/firestore").DocumentData, import("@firebase/firestore").DocumentData>;
export declare const getSignaturesForEvidence: (evidenceId: string) => Promise<never[]>;
export declare const addSignature: (data: unknown) => Promise<string>;
//# sourceMappingURL=db.d.ts.map