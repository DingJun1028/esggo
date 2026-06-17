/**
 * QPI Score Types and Computation Logic
 * Quality Performance Index for ESG scoring
 */

export interface QPIScoreInput {
  categories?: string[];
  companyId?: string;
  year?: number;
}

export interface QPIScoreResult {
  qpiScore: number;
  categoryScores: Record<string, number>;
  recommendation: string;
}
