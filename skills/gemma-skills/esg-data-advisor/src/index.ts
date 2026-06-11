// Main entry point for the ESG Data Advisor Gemma Skill

import { analyzeESGData } from './utils';
import { checkGRICompliance } from './utils';
import { ESGData, AnalysisResult, GRIComplianceInput, GRIComplianceResult } from './types';

// Action: analyzeESGData
export async function analyzeESGDataAction(input: ESGData): Promise<AnalysisResult> {
    console.log("Received data for analysis:", input);
    if (input.context) {
        console.log("Context provided for analyzeESGData:", input.context);
    }
    // In a real scenario, this would involve complex parsing, AI models, etc.
    // For now, it's a placeholder calling a utility function.
    return analyzeESGData(input);
}

// Action: checkGRICompliance
export async function checkGRIComplianceAction(input: GRIComplianceInput): Promise<GRIComplianceResult> {
    console.log("Received data for GRI compliance check:", input);
    if (input.context) {
        console.log("Context provided for checkGRICompliance:", input.context);
    }
    // In a real scenario, this would involve cross-referencing data with GRI standards.
    // For now, it's a placeholder calling a utility function.
    return checkGRICompliance(input);
}

// Export actions as per Gemma Skill requirements
export { analyzeESGDataAction as analyzeESGData, checkGRIComplianceAction as checkGRICompliance };
