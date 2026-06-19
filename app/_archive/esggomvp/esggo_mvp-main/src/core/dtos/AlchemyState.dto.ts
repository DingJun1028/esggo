/**
 * 🧪 Alchemy DTOs — ESG GO Learning System
 * 
 * 定義學習 Alchemy 的等階、經驗值與成就結構。
 */

export type AlchemyLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface ILevelDefinition {
    level: AlchemyLevel;
    title: string;
    title_zh: string;
    minExp: number;
    perks: string[];
    color: string;
}

export interface IAchievement {
    id: string;
    name: string;
    name_zh: string;
    description: string;
    description_zh: string;
    icon: string;
    unlockedAt?: number;
    category: 'Environment' | 'Social' | 'Governance' | 'Hidden';
    expReward: number;
}

export interface IAlchemyState {
    currentLevel: AlchemyLevel;
    currentExp: number;
    totalExp: number;
    unlockedAchievements: string[];
    lastRankUp?: number;
}

/**
 * 10 等階級定義 (The Decad Matrix)
 */
export const ALCHEMY_LEVELS: Record<AlchemyLevel, ILevelDefinition> = {
    1: { level: 1, title: 'Initiate', title_zh: '初鳴者', minExp: 0, perks: ['Basic Dashboard'], color: '#94a3b8' },
    2: { level: 2, title: 'Resonator', title_zh: '共鳴者', minExp: 500, perks: ['Daily ESG Briefing'], color: '#38bdf8' },
    3: { level: 3, title: 'Strategist', title_zh: '策略師', minExp: 1500, perks: ['AI Strategy Center'], color: '#22d3ee' },
    4: { level: 4, title: 'Validator', title_zh: '驗證官', minExp: 3500, perks: ['5T Evidence Scan'], color: '#2dd4bf' },
    5: { level: 5, title: 'Guardian', title_zh: '守護者', minExp: 7000, perks: ['Sovereign ID NFT'], color: '#4ade80' },
    6: { level: 6, title: 'Adept', title_zh: '精進者', minExp: 12000, perks: ['Advanced Telemetry'], color: '#fbbf24' },
    7: { level: 7, title: 'Master', title_zh: '大師', minExp: 20000, perks: ['Synthesis Engine Control'], color: '#f59e0b' },
    8: { level: 8, title: 'Sovereign', title_zh: '主權者', minExp: 35000, perks: ['Eco-Governance Voice'], color: '#ea580c' },
    9: { level: 9, title: 'Oracle', title_zh: '先知', minExp: 60000, perks: ['Gnosis Engine Link'], color: '#9333ea' },
    10: { level: 10, title: 'Transcended', title_zh: '超脫者', minExp: 100000, perks: ['Eternal & Nirvana Status', 'Omni-Sprite Unlocked'], color: '#6366f1' },
};

/**
 * 初始成就矩陣 (Merged with Master Achievements)
 */
import { MASTER_ACHIEVEMENTS } from "../achievements-data";

export const ALCHEMY_ACHIEVEMENTS: IAchievement[] = [
    ...MASTER_ACHIEVEMENTS
];
