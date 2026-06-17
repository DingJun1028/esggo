
export interface QPIScoreInput {
  companyId?: string;
  categories?: string[];
  year?: number;
}

export interface QPIScoreResult {
  qpiScore: number;
  categoryScores: Record<string, number>;
  recommendation: string;
}
