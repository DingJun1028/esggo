export interface GeminiMessage {
    role: 'user' | 'model';
    parts: {
        text: string;
    }[];
}
export interface ESGAnalysisResult {
    greenwashingRisk: 'low' | 'medium' | 'high';
    riskScore: number;
    issues: string[];
    suggestions: string[];
    griAlignment: string[];
    complianceRate: number;
}
export declare function analyzeGreenwashingRisk(text: string): Promise<ESGAnalysisResult>;
export declare function generateGRIContent(chapter: string, persona: 'compliance' | 'harmony' | 'innovation', companyContext: string, existingData?: string): Promise<string>;
export declare function chatWithESGAssistant(messages: GeminiMessage[], persona: string, companyContext?: string): Promise<string>;
export declare function generateESGSummary(reportData: any): Promise<string>;
export declare function refineESGText(text: string, mode: 'expand' | 'refine' | 'proofread' | 'format' | 'translate'): Promise<string>;
//# sourceMappingURL=ai-service.d.ts.map