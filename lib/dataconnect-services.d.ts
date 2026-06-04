/**
 * Data Connect Service Layer
 * This module provides type-safe access to the PostgreSQL backend via GraphQL.
 */
export declare const dcListEternalMemories: () => Promise<any>;
export declare const dcInsertEternalMemory: (input: any) => Promise<any>;
export declare const dcListSwarmAgentTasks: () => Promise<any>;
export declare const dcUpsertSwarmAgentTask: (input: any) => Promise<any>;
export declare const dcListRegulatoryPolicies: () => Promise<any>;
export declare const dcGetReports: () => Promise<any>;
export declare const dcGetReportById: (id: string) => Promise<any | null>;
export declare const dcListScrapedArticles: () => Promise<any>;
export declare const dcListAuditRecords: () => Promise<any>;
export declare const dcUpsertAuditRecord: (input: any) => Promise<any>;
export declare const dcGetTasks: () => Promise<any>;
export declare const dcGetRoadmapMilestones: () => Promise<any>;
export declare const dcUpsertMilestone: (input: any) => Promise<any>;
export declare const dcGetCompanyProfile: (id: string) => Promise<any | null>;
export declare const dcUpsertCompanyProfile: (input: any) => Promise<any>;
export declare const dcCreateReport: (input: {
    companyId: string;
    templateId: string;
    title: string;
    language: string;
}) => Promise<any>;
//# sourceMappingURL=dataconnect-services.d.ts.map