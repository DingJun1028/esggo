// ─────────────────────────────────────────────
// ESG GO Alpha — Central Type Declarations
// Re-export shared types from AppContext, and
// declare view-specific domain types here.
// ─────────────────────────────────────────────

// Core app-context types (single source of truth)
// Core app-context types (single source of truth)
// Core app-context types (single source of truth)
export type ReportStatus = "draft" | "department_review" | "committee_approval" | "legal_review" | "published" | "completed";

export interface ReportApproval {
    role: "department_head" | "committee_member" | "legal_counsel";
    user: string;
    timestamp: string;
    signatureHash?: string;
    comment?: string;
}

export interface Report {
    id: string;
    title: string;
    year: number;
    chapters: number;
    sections: number;
    completedSections: number;
    progress: number;
    status: ReportStatus;
    lastEdited: string;
    linkedSourceCount: number;
    issaReadiness: number;
    trustSeal: "Bronze" | "Silver" | "Gold" | "SECURE_MAX" | "5T_MAX";
    sectionContents?: Record<string, string>;
    templateId?: string;
    completedSectionIds?: string[];
    lastAutosave?: string;
    approvals?: ReportApproval[];
}

export interface Task {
    id: string;
    title: string;
    description?: string | null;
    completed: boolean;
    createdAt: string;
}

export interface AppNotification {
    id: string;
    type: "info" | "success" | "warning" | "error";
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
}

export type SustainWriteSubView = "home" | "list" | "templates" | "editor" | "preview" | "library" | "ocr" | "integration" | "ai-assist";

export interface TraceTarget {
    reportId: string;
    sectionId: string;
}

export interface AppContextType {
    activeView: string;
    setActiveView: (view: string) => void;
    setAssistantPersona: (persona: "compliance" | "harmony" | "innovation") => void;
    activeSubView: SustainWriteSubView;
    setActiveSubView: (subView: SustainWriteSubView) => void;
    selectedReportId: string | null;
    setSelectedReportId: (id: string | null) => void;
    traceTarget: TraceTarget | null;
    setTraceTarget: (target: TraceTarget | null) => void;
    isSpiritOpen: boolean;
    setIsSpiritOpen: (open: boolean) => void;
    globalEsgData: GlobalEsgData;
    setGlobalEsgData: React.Dispatch<React.SetStateAction<any>>;
    companyProfile: CompanyProfile;
    setCompanyProfile: React.Dispatch<React.SetStateAction<CompanyProfile>>;
    benchmarkHistory: any[];
    setBenchmarkHistory: React.Dispatch<React.SetStateAction<any[]>>;
    todoCount: number;
    achievements: any[];
    addActivity: (action: string, metadata?: any) => void;
    activities: any[];
    reports: Report[];
    addReport: (report: Partial<Report>) => void;
    updateReport: (id: string, updates: Partial<Report>) => void;
    updateSectionContent: (reportId: string, sectionId: string, content: string) => void;
    deleteReport: (id: string) => void;
    notifications: AppNotification[];
    addNotification: (notification: Omit<AppNotification, "id" | "timestamp" | "read">) => void;
    markNotificationAsRead: (id: string) => void;
    hiddenGoals: {
        systemHarmony: number;
        dataPurity: number;
        governanceWisdom: number;
        ecosystemCoordination: number;
    };
    language: "zh" | "en";
    toggleLanguage: () => void;

    // Data Connect Tasks
    tasks: Task[];
    addTask: (title: string, description?: string) => Promise<void>;
    toggleTask: (id: string, completed: boolean) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
    auditRecords: any[];
    addAuditRecord: (record: any) => Promise<any>;
    updateAuditRecord: (vars: any) => Promise<any>;
    deleteAuditRecord: (id: string) => Promise<any>;
    selectedSpirit: "compliance" | "harmony" | "innovation";
    setSelectedSpirit: React.Dispatch<React.SetStateAction<"compliance" | "harmony" | "innovation">>;

    // Intelligence Center
    intelligenceModules: IntelligenceModule[];
    intelligenceSources: IntelligenceSourceData[];
    isIntelligenceLoading: boolean;
    upsertIntelligenceModule: (module: IntelligenceModule) => Promise<void>;
    upsertIntelligenceSource: (source: IntelligenceSourceData) => Promise<void>;
    toggleIntelligenceSource: (id: string) => Promise<void>;
}

export interface IntelligenceModule {
    id: string;
    titleZh: string;
    titleEn: string;
    descriptionZh: string;
    descriptionEn: string;
    iconName: string;
    color: string;
    details: string[];
}

export interface IntelligenceSourceData {
    id: string;
    category: string;
    name: string;
    type: string;
    status: string;
}


// ─── Language ───────────────────────────────
export type Language = "zh" | "en";

// ─── Company Profile ────────────────────────
export interface CompanyProfile {
    name: string;
    industry: string;
    reportYear: number;
    goals: string[];
    scope: string;
    commitments: string[];
    customFields: { key: string; value: string }[];
}

// ─── Global ESG Data ────────────────────────
export interface CompanyMetric {
    category: string;
    label: string;
    value: string | number;
    unit: string;
    trend: string;
    trust_score: number;
}

export interface GlobalEsgData {
    totalReports: number;
    completedReports: number;
    linkedSourcesCount: number;
    complianceRate: number;
    trustScore: number;
    readinessScore: number;
    companyMetrics: CompanyMetric[];
}

// ─── Activity Log ───────────────────────────
export interface ActivityLog {
    id?: string;
    action: string;
    metadata?: Record<string, unknown>;
    timestamp: string;
    serverTime?: unknown;
}

// ─── Compliance Indicator (FSC 97) ──────────
export type ComplianceStatus = "已完成" | "處理中" | "缺失預警" | "未啟動";
export type ComplianceRequirement = "金管會強制揭露" | "指標查驗" | "法律合規" | "產業標準" | "標準查核";

export interface ComplianceIndicator {
    id: string;
    title: string;
    status: ComplianceStatus;
    category: string;
    requirement: ComplianceRequirement;
    requirementDesc: string;
    progress: number;
}

// ─── Evidence Vault (5T / ZKP) ──────────────
export type ZKPStatus = "Pending" | "Verifying" | "Verified" | "Failed";

export interface AuditRecord {
    id: string;
    title: string;
    dataType: string;
    source: string;
    category?: string;
    standard?: string;
    description?: string;
    contentHash: string;
    zkpStatus: string;
    createdAt: string;
    metadata?: string | null;
}

export interface VaultRecord {
    id: string;
    dataType: string;
    source: string;
    timestamp: string;
    hiddenFields: string[];
    originalData: Record<string, string>;
}

export interface AuditNode extends VaultRecord {
    zkpContext: {
        algorithm: string;
        publicInputsHash: string;
        verifierKey: string;
        proofSignature: string;
    };
    maskedData: Record<string, string>;
    protocol: {
        tangible: boolean;
        traceable: boolean;
        trackable: boolean;
        transparent: boolean;
        trustworthy: boolean;
    };
    zkpStatus: ZKPStatus;
}

// ─── Integration ──────────────────────────── 
export type SyncStatus = "connected" | "disconnected" | "syncing";

export interface IntegrationSource {
    id: string;
    name: string;
    description: string;
    status: SyncStatus;
    icon: string;
    lastSync?: string;
    metrics?: { label: string; value: string }[];
}

// ─── OCR ─────────────────────────────────────
export type OCRState = "idle" | "extracting" | "done" | "error";

export interface OCRResult {
    text: string;
    tables: string[];
    charts: string[];
    rawResponse: string;
}

// ─── Integrity & Compliance ──────────────────
export interface IntegrityCheck {
    status: string;
    mark: string;
    protocol: string;
    timestamp: string;
    signer?: string;
}
