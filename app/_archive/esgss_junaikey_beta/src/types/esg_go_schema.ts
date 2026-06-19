export type TrafficLightStatus = 'Red' | 'Yellow' | 'Green';

// Minimum Viable Data (MVD) for L1 Health Check
export interface L1MinimumViableData {
    companyName: string;
    industry: string;
    employeeCount: number;
    hasSustainabilityReport: boolean;
    lastReportYear?: number;
    hasGhInventory: boolean; // GHG Inventory
    hasCodeOfConduct: boolean;
    supplyChainPolicy: boolean;
    contactPerson: string;
    email: string;
}

export interface L1HealthCheckResult {
    overallStatus: TrafficLightStatus;
    score: number; // 0-100
    missingFields: string[];
    riskFactors: string[];
    ninetyDayTasks: Array<{
        id: string;
        title: string;
        priority: 'High' | 'Medium' | 'Low';
        estimatedEffort: string; // e.g., "2 hours"
    }>;
    generatedAt: number;
}

// 5T Evidence Vault
export type EvidenceStatus = 'Pending_Verification' | 'Verified_Trustworthy' | 'Tampered';

export interface EvidenceItem {
    id: string;
    fileName: string;
    fileSize: number;
    fileType: string;
    uploadDate: number;

    // 5T Protocols
    timestamp: number;          // Traceable (Time)
    source_origin: string;      // Traceable (Identity)
    hash_sha256: string;        // Trustworthy (Immutable)
    linked_indicator?: string;  // Trackable (Link to GRI/SASB)
    status: EvidenceStatus;

    // Metadata
    tags: string[];
    description?: string;
}

// Board Copilot Lite
export interface BoardBrief {
    period: string; // e.g., "February 2026"

    // Financial Impact Lens
    financialImpact: {
        cost_avoidance: string;   // e.g., "NTD 1.2M potential fine avoided"
        investment_required: string;
        roi_projection: string;
    };

    // Compliance & Risk Lens
    complianceStatus: {
        critical_gaps: number;
        upcoming_deadlines: string[];
        overall_risk_level: 'High' | 'Medium' | 'Low';
    };

    // Decision Support
    decisionRequest: {
        title: string;
        context: string;
        recommendation: string;
        implication_if_ignored: string;
    };

    generatedBy: 'ESG GO Board Copilot';
}
