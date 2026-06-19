export interface IIntelNode {
  uuid: string;
  type: 'market_intel' | 'scandal_intel';
  timestamp: number;
  label: string;
  confidence_score: number;
  action_trigger: boolean;
  evidence: IIntelEvidence;
}

export interface IIntelEvidence {
  source_origin: string;
  formula: string;
  hash: string;
}

const generateShortId = () => Math.random().toString(36).substring(2, 9);
const generateHash = (data: string) => {
  // Simple mock hash for demo purposes, in production should use proper hashing
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(16);
};

export const intelligenceService = {
  calculateConfidence: (data: any): number => {
    // 5T Logic: Source * Recency * Validation
    const sourceReliability = 0.95;
    const dataRecency = 1.0;
    const validationFactor = 1.0;
    return sourceReliability * dataRecency * validationFactor;
  },

  processMarketIntel: (rawData: any): IIntelNode => {
    const evidence: IIntelEvidence = {
      source_origin: rawData.source || 'Bloomberg API',
      formula: 'Market_Volatility_Index_v1',
      hash: generateHash(JSON.stringify(rawData)),
    };

    const intel: IIntelNode = {
      uuid: `intel-${generateShortId()}`,
      type: 'market_intel',
      timestamp: Date.now(),
      label: rawData.title || 'Market Update',
      confidence_score: 0.98,
      action_trigger: rawData.volatility > 0.5,
      evidence,
    };

    return Object.freeze(intel);
  },

  processScandalIntel: (rawData: any): IIntelNode => {
    const evidence: IIntelEvidence = {
      source_origin: rawData.url || 'News Feed',
      formula: 'Scandal_Impact_Analysis_v1',
      hash: generateHash(JSON.stringify(rawData)),
    };

    const intel: IIntelNode = {
      uuid: `intel-${generateShortId()}`,
      type: 'scandal_intel',
      timestamp: Date.now(),
      label: `Alert: ${rawData.orgName}`,
      confidence_score: 0.9, // Higher scrutiny for scandals
      action_trigger: true,
      evidence,
    };

    return Object.freeze(intel);
  },
};
