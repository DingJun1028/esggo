// Social & Economy Types
import { SubscriptionTier, UserSubscription } from './core/index.js';

// Re-export core types used in social features
export { SubscriptionTier };
export type { UserSubscription };

export interface SocialUserSubscription extends UserSubscription {
  currentEnergy: number;
  limits: {
    dailyEnergyMax: number;
    storageLimit: number;
  };
  wallet: {
    balance: number;
  };
}

export interface DebateCard {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: 'ATTACK' | 'DEFENSE' | 'BUFF' | 'DEBUFF';
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  value: number;
}

export interface DebateState {
  playerHP: number;
  enemyHP: number;
  playerAP: number;
  playerHand: DebateCard[];
  playerDeck: DebateCard[];
  discardPile: DebateCard[];
  enemyIntent: 'ATTACK' | 'DEFENSE' | 'BUFF' | 'DEBUFF';
  round: number;
  status: 'PLAYING' | 'VICTORY' | 'DEFEAT';
  logs: string[];
}

export enum Faction {
  TERRA_GUARDIANS = 'TERRA_GUARDIANS',
  HUMANITY_UNITED = 'HUMANITY_UNITED',
  FUTURE_ARCHITECTS = 'FUTURE_ARCHITECTS',
}

export interface AmbassadorProfile {
  userId: string;
  faction: Faction;
  rank: string;
  totalEarnedGSC: number;
  referralCode: string;
  totalReferrals: number;
}

export interface GuildMember {
  userId: string;
  role: 'LEADER' | 'MEMBER' | 'ELDER';
  joinedAt: number;
}

export interface Guild {
  id: string;
  name: string;
  level: number;
  description: string;
  members: GuildMember[];
  treasury: {
    gold: number;
  };
  technologies: string[]; // Tech IDs
  leaderId?: string; // Derived or explicit
}

// Subscription and UserSubscription are imported from core

export interface WorldEvent {
  id: string;
  title: string;
  description: string;
  status: 'ACTIVE' | 'COMPLETED' | 'PENDING';
  totalProgress: number;
  targetProgress: number;
  participants: number;
  unit: string;
  rewards: {
    buff: string;
  };
}

export type LeaderboardType = 'EXP' | 'GSC' | 'CONTRIBUTION' | 'CARBON_SAVED';

export interface LeaderboardEntry {
  userId: string;
  rank: number;
  nickname: string;
  guildName?: string;
  score: number;
}
