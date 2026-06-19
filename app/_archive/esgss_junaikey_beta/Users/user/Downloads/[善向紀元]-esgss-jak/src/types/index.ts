// Global TypeScript Type Definitions
export interface ESGData {
  environmental: EnvironmentalMetrics;
  social: SocialMetrics;
  governance: GovernanceMetrics;
}

export interface EnvironmentalMetrics {
  carbonFootprint: number;
  energyConsumption: number;
  waterUsage: number;
  wasteGeneration: number;
}

export interface SocialMetrics {
  employeeSatisfaction: number;
  diversityIndex: number;
  communityImpact: number;
  humanRightsScore: number;
}

export interface GovernanceMetrics {
  transparencyScore: number;
  boardDiversity: number;
  ethicalCompliance: number;
  stakeholderEngagement: number;
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  permissions: Permission[];
}

export type UserRole = 'admin' | 'manager' | 'analyst' | 'viewer';

export interface Permission {
  resource: string;
  action: 'read' | 'write' | 'delete' | 'admin';
}

export interface APIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}