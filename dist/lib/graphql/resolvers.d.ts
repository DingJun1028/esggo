export declare const resolvers: {
    Query: {
        dashboardStats: () => Promise<{
            complianceRate: number;
            carbonEmissions: number;
            griCoverage: number;
            auditCount: number;
            taskCount: number;
            evidenceCount: number;
            verifiedCount: number;
            lastUpdated: string;
        }>;
        esgMetrics: (_: unknown, { category, year }: {
            category?: string;
            year?: number;
        }) => Promise<{
            id: string;
            companyId: string;
            category: string;
            metricName: string;
            metricValue: number;
            unit: string;
            year: number;
            griStandard: string;
            sourceOrigin: string;
            hashLock: string;
            verified: boolean;
            createdAt: string;
        }[]>;
        evidenceFiles: (_: unknown, { status, category }: {
            status?: string;
            category?: string;
        }) => Promise<{
            id: string;
            fileName: string;
            fileType: string;
            category: string;
            griReference: string;
            uploader: string;
            status: string;
            zkpProof: boolean;
            hashLock: string;
            sealType: string;
            createdAt: string;
        }[]>;
        auditLogs: (_: unknown, { limit, offset }: {
            limit?: number;
            offset?: number;
        }) => Promise<{
            id: string;
            action: string;
            resource: string;
            userName: string;
            department: string;
            griReference: string;
            t5Tag: string;
            hashLock: string;
            details: string;
            createdAt: string;
        }[]>;
        tasks: (_: unknown, { status, priority }: {
            status?: string;
            priority?: string;
        }) => Promise<{
            id: string;
            title: string;
            description: string;
            status: string;
            priority: string;
            assignee: string;
            department: string;
            griReference: string;
            dueDate: string;
            hashLock: string;
            createdAt: string;
        }[]>;
        companyProfile: () => Promise<{
            id: any;
            companyName: any;
            industry: any;
            employeeCount: any;
            revenueTwd: any;
            capitalTwd: any;
            locations: any;
            esgGoals: string;
            reportingYear: any;
        } | null>;
        griDisclosures: (_: unknown, { status }: {
            status?: string;
        }) => Promise<{
            id: string;
            code: string;
            title: string;
            category: string;
            status: string;
            department: string;
            priority: string;
            isNew: boolean;
        }[]>;
        advisorySessions: (_: unknown, { userId }: {
            userId?: string;
        }) => Promise<{
            id: string;
            userId: string;
            persona: string;
            title: string;
            messages: string;
            createdAt: string;
        }[]>;
        environmentalData: (_: unknown, { category, year }: {
            category?: string;
            year?: number;
        }) => Promise<{
            id: string;
            companyId: string;
            category: string;
            metricName: string;
            metricValue: number;
            unit: string;
            year: number;
            griStandard: string;
            verified: boolean;
        }[]>;
        roadmapMilestones: (_: unknown, { status }: {
            status?: string;
        }) => Promise<{
            id: string;
            title: string;
            description: string;
            targetYear: number;
            category: string;
            targetValue: number;
            currentValue: number;
            unit: string;
            status: string;
            sbtiAligned: boolean;
            griReference: string;
            createdAt: string;
        }[]>;
    };
    Mutation: {
        upsertESGMetric: (_: unknown, { input }: {
            input: Record<string, any>;
        }) => Promise<{
            createdAt: string;
            company_id: any;
            category: any;
            metric_name: any;
            metric_value: any;
            unit: any;
            year: any;
            gri_standard: any;
            source_origin: any;
            hash_lock: string;
            verified: boolean;
            id: string;
        }>;
        createTask: (_: unknown, { input }: {
            input: Record<string, any>;
        }) => Promise<{
            id: string;
            title: string;
            description: string;
            status: string;
            priority: string;
            assignee: string;
            department: string;
            griReference: string;
            dueDate: string;
            hashLock: string;
            createdAt: string;
        }>;
        updateTaskStatus: (_: unknown, { id, status }: {
            id: string;
            status: string;
        }) => Promise<{
            id: string;
            title: string;
            description: string;
            status: string;
            priority: string;
            assignee: string;
            department: string;
            griReference: string;
            dueDate: string;
            hashLock: string;
            createdAt: string;
        }>;
        createAuditLog: (_: unknown, { input }: {
            input: Record<string, any>;
        }) => Promise<{
            createdAt: string;
            hash_lock: string;
            user_name: any;
            gri_reference: any;
            t5_tag: any;
            id: string;
        }>;
        createEvidence: (_: unknown, { input }: {
            input: Record<string, any>;
        }) => Promise<{
            id: string;
            fileName: string;
            fileType: string;
            category: string;
            griReference: string;
            uploader: string;
            status: string;
            zkpProof: boolean;
            hashLock: string;
            createdAt: string;
        }>;
        sealEvidence: (_: unknown, { id, sealType }: {
            id: string;
            sealType: string;
        }) => Promise<{
            id: any;
            fileName: any;
            fileType: any;
            category: any;
            griReference: any;
            uploader: any;
            status: any;
            zkpProof: any;
            hashLock: any;
            createdAt: any;
        }>;
        verifyEvidence: (_: unknown, { id, hashLock }: {
            id: string;
            hashLock: string;
        }) => Promise<{
            valid: boolean;
            message: string;
            hashMatch: boolean;
            timestamp: string;
        }>;
        upsertMilestone: (_: unknown, { input }: {
            input: any;
        }) => Promise<{
            id: any;
            title: any;
            description: any;
            targetYear: any;
            category: any;
            targetValue: any;
            currentValue: any;
            unit: any;
            status: any;
            sbtiAligned: any;
            griReference: any;
            createdAt: any;
        }>;
        updateMilestoneStatus: (_: unknown, { id, status }: {
            id: string;
            status: string;
        }) => Promise<{
            id: any;
            title: any;
            description: any;
            targetYear: any;
            category: any;
            targetValue: any;
            currentValue: any;
            unit: any;
            status: any;
            sbtiAligned: any;
            griReference: any;
            createdAt: any;
        }>;
        updateCompanyProfile: (_: unknown, { input }: {
            input: any;
        }) => Promise<{
            id: any;
            companyName: any;
            industry: any;
            employeeCount: any;
            revenueTwd: any;
            capitalTwd: any;
            locations: any;
            esgGoals: string;
            reportingYear: any;
        }>;
        deleteTask: (_: unknown, { id }: {
            id: string;
        }) => Promise<boolean>;
        deleteESGMetric: (_: unknown, { id }: {
            id: string;
        }) => Promise<boolean>;
    };
};
//# sourceMappingURL=resolvers.d.ts.map