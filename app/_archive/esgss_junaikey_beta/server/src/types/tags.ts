/**
 * 🏷️ 系統標籤與屬性類型定義 (Tags & Attributes)
 * --------------------------------------------------
 * 定義用於 Agent DNA 與 ESG 指標分類的標籤系統。
 */

export enum ImpactCategory {
  ENVIRONMENT = 'E',
  SOCIAL = 'S',
  GOVERNANCE = 'G',
  OMNI = 'OMNI'
}

export interface IEvolutionStats {
  patternRecognition: number;
  inferenceSpeed: number;
  ethicalAlignment: number;
  resonanceFrequency: number;
}

export interface ITagInfo {
  id: string;
  label: string;
  category: ImpactCategory;
  definition: string;
}

export interface ESGDataTag {
  id: string;
  createdAt: string;
  updatedAt: string;
  environmental: {
    carbonFootprint: number;
    energyConsumption: number;
    waterUsage: number;
    wasteGeneration: number;
  };
  social: {
    employeeSatisfaction: number;
    diversityIndex: number;
    communityImpact: number;
    humanRightsScore: number;
  };
  governance: {
    transparencyScore: number;
    boardDiversity: number;
    ethicalCompliance: number;
    stakeholderEngagement: number;
  };
  metadata: {
    companyName: string;
  };
}

export interface UniversalResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}
