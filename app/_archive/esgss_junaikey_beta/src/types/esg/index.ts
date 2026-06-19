import { z } from 'zod';
import { Language } from '../core/index.js';

export * from './omniBestPractice.js';

// ==================== ESG DIMENSIONS ====================

export type DimensionID =
  | 'A1'
  | 'A2'
  | 'A3'
  | 'A4'
  | 'A5'
  | 'A6'
  | 'A7'
  | 'A8'
  | 'A9'
  | 'A10'
  | 'A11'
  | 'A12';

export interface DimensionProtocol {
  id: DimensionID;
  name: string;
  description: string;
  status: 'stable' | 'unstable' | 'optimizing';
  integrity: number;
}

// ==================== ACADEMY & COURSE ====================

export interface Course {
  id: string;
  title: string;
  thumbnail: string;
  level: string;
  category: string;
  progress: number;
}

export const CourseSchema = z.object({
  id: z.string(),
  title: z.string(),
  thumbnail: z.string(),
  level: z.string(),
  category: z.string(),
  progress: z.number(),
});

// ==================== USER PROFILE ====================

export const UserTitleSchema = z.object({
  id: z.string(),
  text: z.string(),
  rarity: z.enum(['Common', 'Rare', 'Epic', 'Legendary']),
  bonusEffect: z.string().optional(),
  description: z.string().optional(),
});
export type UserTitle = z.infer<typeof UserTitleSchema>;

export const BadgeSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.enum(['Milestone', 'Achievement', 'Social']),
  unlockedAt: z.number().optional(),
  icon: z.any().optional(),
});
export type Badge = z.infer<typeof BadgeSchema>;

export type UserTier = 'Free' | 'Pro' | 'Enterprise';

export interface UserJournalEntry {
  id: string;
  title: string;
  impact: string;
  xpGained: number;
  timestamp: number;
  type: 'milestone' | 'action' | 'insight';
  tags: string[];
}

// ==================== EVENTS ====================

export const OfficialEventSchema = z.object({
  id: z.string(),
  title: z.string(),
  date: z.string(),
  status: z.enum(['Upcoming', 'Participating', 'Completed']),
  xpReward: z.number(),
});
export type OfficialEvent = z.infer<typeof OfficialEventSchema>;

// ==================== REPORTING ====================

export interface ReportSection {
  id: string;
  title: string;
  template?: string;
  example?: string;
  griStandards?: string;
  subSections?: ReportSection[];
}

export enum AnalysisType {
  STATISTICAL = 'STATISTICAL',
  TREND = 'TREND',
  CORRELATION = 'CORRELATION',
  COMPARISON = 'COMPARISON',
  DISTRIBUTION = 'DISTRIBUTION',
  CUSTOM = 'CUSTOM',
}

// ==================== ESG CARDS ====================

export const EsgCardRaritySchema = z.enum([
  'Common',
  'Rare',
  'Epic',
  'Legendary',
  'Zenith',
  'Emergent',
  'Basic',
]);
export type EsgCardRarity = z.infer<typeof EsgCardRaritySchema>;

export const EsgCardAttributeSchema = z.enum([
  'Vision',
  'Governance',
  'Knowledge',
  'Impact',
  'Virtue',
]);
export type EsgCardAttribute = z.infer<typeof EsgCardAttributeSchema>;

export type MasteryLevel = 'Novice' | 'Intermediate' | 'Advanced' | 'Master';

export const EsgCardTypeSchema = z.enum(['Knowledge', 'Case', 'Action', 'Event']);
export type EsgCardType = z.infer<typeof EsgCardTypeSchema>;

export const EsgCardSchema = z.object({
  id: z.string(),
  title: z.string(),
  term: z.string(),
  definition: z.string(),
  description: z.string(),
  rarity: EsgCardRaritySchema,
  attribute: EsgCardAttributeSchema,
  cardType: EsgCardTypeSchema,
  collectionSet: z.string(),
  stats: z.object({ defense: z.number(), offense: z.number() }).optional(),
  imageUrl: z.string().optional(),
});
export type EsgCard = z.infer<typeof EsgCardSchema>;

// Helper function mock
export const getEsgCards = (language: Language): EsgCard[] => {
  return []; // Implementation handled in constants or data service
};

// ==================== QUESTS & FINANCIALS ====================

export interface ScriptureNode {
  id: string;
  code: string;
  title: string;
  en: string;
  content: string;
  category: string;
  tags: { zh: string; en: string }[];
}

export interface FinancialEntry {
  date: string;
  amount: number;
  category: string;
  description: string;
  amountType?: 'Asset' | 'Liability' | 'Equiity'; // Fixed typo in previous type if exists
}

export interface AuditLogEntry {
  id: string;
  timestamp: number;
  action: string;
  user: string;
  details: string;
  hash: string;
}

export interface LifeEsgQuest {
  id: string;
  category: string;
  title: string;
  enTitle: string;
  impactDesc: string;
  xpReward: number;
  gwcReward: number;
  traitBonus: { trait: string; value: number };
  status: 'ready' | 'completed';
  icon: any;
  verifiedHash?: string;
  rarity?: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  desc?: string;
  type?: string;
}

export interface CarbonMarketHistory {
  time: string;
  price: number;
}

export interface CarbonAssetPackage {
  assetId: string;
  totalValue: number;
}

export interface EntityPlanet {
  taxId: string;
}

export interface ImpactProject {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'paused';
  progress: number;
  impactXP: number;
  sdgs: number[];
  logicModel: {
    inputs: string[];
    activities: string[];
    outputs: string[];
    outcomes: string[];
    impact: string;
  };
  milestones: ProjectMilestone[];
  financials: { budget: number; spent: number; revenue_projected: number; roi_projected: number };
  impactMetrics: {
    label: string;
    current: number;
    target: number;
    unit: string;
    proxy_value: number;
  }[];
  sroi: number;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed';
  xpReward: number;
  description: string;
  verifiedHash?: string;
}

// ==================== WEBHOOKS ====================

export interface WebhookConfig {
  id: string;
  eventType: string;
  url: string;
  status: 'active' | 'inactive';
}

export interface WebhookDelivery {
  id: string;
  webhookId: string;
  timestamp: number;
  status: number;
  response: string;
}
