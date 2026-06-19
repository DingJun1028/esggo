export type ElementTier = 'Sleep' | 'Awakened' | 'Resonance' | 'Fusion' | 'Transcendence' | 'Legendary' | 'Eternal';
export type AvatarRole = 'Nexus' | 'CoreLaw' | 'SystemBuild' | 'InsightCreate' | 'ExecutionGuard' | 'Apex' | 'Special';
export type CareerPath = 'Insight' | 'Construction' | 'Creation' | 'Execution' | 'AllPowerful' | 'Astra';

export interface ElementalSpirit {
    id: string;
    name: string;
    icon: string;
    description: string;
    tier: ElementTier;
    resonanceXP: number;
    resonanceLevel: number;
    unlockedSkills: string[];
    passiveEffect: string;
}

export interface AvatarIdentity {
    id: string;
    name: string;
    role: AvatarRole;
    description: string;
    synergyXP: number;
    synergyLevel: number;
    unlockedDialogues: string[];
    synergyBuff: string;
    awakened: boolean;
}

export interface SummonerProfile {
    username: string;
    level: number;
    totalXP: number;
    careerPath: CareerPath;
    awakeningMilestone: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Universal';
    trinityStats: {
        elementalMastery: number;
        avatarSynergy: number;
        careerEvolution: number;
    };
    unlockedAvatars: string[]; // IDs
    unlockedElements: string[]; // IDs
}

export interface DailyMission {
    id: string;
    title: string;
    type: 'Elemental' | 'Avatar' | 'Career';
    description: string;
    rewardXP: number;
    completed: boolean;
}
