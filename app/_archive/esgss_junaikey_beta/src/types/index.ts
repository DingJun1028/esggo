// Global TypeScript Type Definitions
// This is the new centralized entry point for all types

export * from './core/index.js';
export * from './omni/index.js';
export * from './agency/index.js';
export * from './esg/index.js';
export * from './mcp.js';
export * from './content.js';
export * from './aiPartner.js';
export * from './world.js';
export * from './social.js';
export * from './npc.js';
export * from './i18n.types.js';
// Support for existing imports of Omni-*.types.ts if needed (or we can deprecate them)
// For now, we assume the specific files might be imported directly by some legacy code?
// No, we are standardizing.

// Re-export specific legacy types if they were in the original index.ts and not yet moved?
// Original index.ts had: ESGData, User (permission related), APIResponse (moved to core).

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

// User interface from old index.ts (merging into core/agency usually, but keeping here for compat if needed,
// though Agency has UserRole and Permission)
import { UserRole, Permission } from './agency/index.js';

export interface User {
  id: string;
  uuid?: string;
  email: string;
  role: UserRole;
  permissions: Permission[];
}
