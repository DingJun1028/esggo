/**
 * 🌳 Impact Nexus Village (善向永續村) 型別定義
 * 核心哲學：將 ESG 成長轉化為 RPG 冒險與資產積累
 */

export enum VillageBuildingType {
    RESIDENTIAL = 'RESIDENTIAL',
    ENERGY = 'ENERGY', // 綠能電廠
    KNOWLEDGE = 'KNOWLEDGE', // 知識聖殿
    COMMERCE = 'COMMERCE', // 永續交易站
    SOCIAL = 'SOCIAL', // 社群廣場
    GOVERNANCE = 'GOVERNANCE', // 聖徒議會
}

export enum CardType {
    KNOWLEDGE = 'KNOWLEDGE', // 智：ESG 知識
    ACTION = 'ACTION', // 勇：執行行動
    RELATIONSHIP = 'RELATIONSHIP', // 仁：社群關係
    RESOURCE = 'RESOURCE', // 誠：資源投入
}

export enum CardRarity {
    COMMON = 'COMMON',
    RARE = 'RARE',
    EPIC = 'EPIC',
    LEGENDARY = 'LEGENDARY',
    TRANSCENDENT = 'TRANSCENDENT',
}

/**
 * 六德 RPG 屬性 (Six Virtues RPG Attributes)
 */
export interface IVillageStats {
    int: number; // 智慧 (Intelligence/WIS) - ESG 知識深度
    str: number; // 力量 (Strength/STR) - 執行行動影響力
    chr: number; // 魅力 (Charisma/CHR) - 社群感染力與領導力
    wis: number; // 叡智 (Wisdom) - 長期策略與治理眼光
    luk: number; // 幸運 (Luck/LUK) - 機遇與商機媒合率
    xp: number;  // 經驗值 (Experience) - 全域成長痕跡
    mana: number; // 靈力 (Mana) - AI 驅動的能量槽
    resonance: number; // 共鳴度 (Resonance) - 與 ESG 指標的連結深度
}

export interface IVillageCharacter {
    id: string;
    name: string;
    gender?: 'MALE' | 'FEMALE' | 'NON_BINARY' | 'SENTIENT';
    avatar: string;
    title: string;
    level: number;
    mission?: string; // 心中使命
    stats: IVillageStats;
    tokens: number; // 善向代幣 (Impact Tokens)
    cards: string[]; // 持有的卡牌 ID
    buildings: string[]; // 已解鎖的建築 ID
    skillTree?: ISkillNode[];
    passives?: string[]; // 被動天賦
    potentialAwakened: boolean; // 潛能解放狀態
    lastActive: number;
}

export interface ISkillNode {
    id: string;
    name: string;
    description: string;
    level: number;
    maxLevel: number;
    requirements: {
        level?: number;
        stats?: Partial<IVillageStats>;
        preSkill?: string;
    };
}

export interface IImpactCard {
    id: string;
    name: string;
    description: string;
    type: CardType;
    rarity: CardRarity;
    ability: string; // 特殊能力描述
    statsBonus?: Partial<IVillageStats>; // 屬性加成
    imageUrl: string;
    isLocked: boolean;
    marketValue: number; // 知識資產價值
}

export interface IBuilding {
    id: string;
    type: VillageBuildingType;
    name: string;
    level: number;
    description: string;
    bonus: string;
    unlockRequirements: {
        level: number;
        stats: Partial<IVillageStats>;
        tokens: number;
    };
    isActive: boolean;
}

export interface ITokenTransaction {
    id: string;
    userId: string;
    amount: number;
    type: 'EARN' | 'SPEND' | 'EXCHANGE';
    reason: string;
    timestamp: number;
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
}
