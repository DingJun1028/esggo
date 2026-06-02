// Define types for the ESG Data Advisor Gemma Skill

export interface OmniCoreContext {
    taskId: string;
    userId: string;
    permissions: string[];
    environment: "development" | "staging" | "production";
    // Add other relevant context information as needed
}

export interface ESGData {
    data: string; // Raw ESG data (can be JSON string, CSV string, or plain text)
    dataType: "json" | "csv" | "text";
    focusAreas?: string[]; // Optional: e.g., ["environmental", "social", "governance"]
    context?: OmniCoreContext; // New: Optional context for the skill invocation
}

export interface AnalysisResult {
    metrics: { [key: string]: any }; // Key-value pairs of extracted metrics
    summary: string; // A brief summary of the analysis
}

export interface GRIComplianceInput {
    esgReportSegment: string; // A segment of an ESG report or specific data point
    griStandard: string; // e.g., "GRI 2-7", "GRI 305-1"
    context?: OmniCoreContext; // New: Optional context for the skill invocation
}

export interface GRIComplianceResult {
    complianceStatus: "compliant" | "non-compliant" | "partially-compliant";
    details: string; // Explanation of compliance status
    recommendations: string[]; // Suggestions for improving compliance
}