/**
 * 🌌 Omni Impact Nexus Village (萬能永續善向村定義)
 * 哲學：將 ESG 成長轉化為 RPG 冒險 (Gamification of Goodness)
 */

export enum VillageBuildingType {
    RESIDENTIAL = 'RESIDENTIAL', // 永續居住區 (基礎人口)
    ENERGY = 'ENERGY',           // 綠能中心 (產出 MANA)
    KNOWLEDGE = 'KNOWLEDGE',     // 知識殿堂 (提升 INT)
    COMMERCE = 'COMMERCE',       // 永續交易所 (代幣流通)
    SOCIAL = 'SOCIAL',           // 社群中心 (提升 CHR)
    GOVERNANCE = 'GOVERNANCE',   // 治理議會 (提升 WIS)
}

export enum CardType {
    KNOWLEDGE = 'KNOWLEDGE',     // 知識卡 (ESG 認知與學習)
    ACTION = 'ACTION',           // 行動卡 (具體實踐與減碳)
    RELATIONSHIP = 'RELATIONSHIP',// 關係卡 (社群連結與影響)
    RESOURCE = 'RESOURCE',       // 資源卡 (資本與技術投入)
}

export enum CardRarity {
    COMMON = 'COMMON',           // 普通 (基礎行動)
    RARE = 'RARE',               // 稀有 (進階專案)
    EPIC = 'EPIC',               // 史詩 (區域影響力)
    LEGENDARY = 'LEGENDARY',     // 傳說 (改變產業規則)
    TRANSCENDENT = 'TRANSCENDENT',// 超越 (Omni 級別神蹟)
}

/**
 * 🛡️ 善向六德 RPG 屬性 (Six Virtues RPG Attributes)
 * 對應 ESG 的核心能力指標
 */
export interface IVillageStats {
    int: number;       // 智力 (Intelligence) - ESG 認知深度與數據分析力
    str: number;       // 力量 (Strength)     - 具體行動力與執行強度
    chr: number;       // 魅力 (Charisma)     - 社群號召力與領導力 (Social)
    wis: number;       // 感知 (Wisdom)       - 治理策略與長遠眼界 (Governance)
    luk: number;       // 幸運 (Luck)         - 機遇掌握與風險管理
    xp: number;        // 經驗 (Experience)   - 成長軌跡與歷史累積
    mana: number;      // 靈能 (Mana)         - AI 驅動能量槽 (可用於加速運算)
    resonance: number; // 共鳴 (Resonance)    - 與聯合國 SDGs 的契合深度
}

export interface IVillageCharacter {
    id: string;        // 萬能 UUID
    name: string;      // 角色名稱
    gender?: 'MALE' | 'FEMALE' | 'NON_BINARY' | 'SENTIENT'; // Sentient 為 AI 意識體
    avatar: string;    // 數位分身頭像 URL
    title: string;     // 稱號 (e.g., "碳權先鋒")
    level: number;     // 目前等級
    mission?: string;  // 心中使命 (Personal North Star)
    stats: IVillageStats; // 六德屬性
    tokens: number;    // 善向幣 (Impact Tokens) 餘額
    cards: string[];   // 持有卡牌 ID 列表
    buildings: string[]; // 已解鎖建築 ID 列表
    skillTree?: ISkillNode[]; // 技能樹狀態
    passives?: string[]; // 被動天賦 (Passive Traits)
    potentialAwakened: boolean; // 潛能覺醒狀態 (是否已通過 5T 驗證)
    lastActive: number; // 最後活躍時間戳
}

export interface ISkillNode {
    id: string;
    name: string;
    description: string;
    level: number;
    maxLevel: number;
    requirements: {
        level?: number;
        stats?: Partial<IVillageStats>; // 需求屬性
        preSkill?: string; // 前置技能 ID
    };
}

export interface IImpactCard {
    id: string;
    name: string;
    description: string;
    type: CardType;
    rarity: CardRarity;
    ability: string;   // 能力敘述 (e.g., "提升 5% 綠能轉換率")
    statsBonus?: Partial<IVillageStats>; // 裝備後的屬性加成
    imageUrl: string;  // 卡面視覺
    isLocked: boolean; // 是否鎖定 (需特定條件解鎖)
    marketValue: number; // 市場資產價值 (可交易性)
}

export interface IBuilding {
    id: string;
    type: VillageBuildingType;
    name: string;
    level: number;
    description: string;
    bonus: string;     // 建築加成效果
    unlockRequirements: {
        level: number;
        stats: Partial<IVillageStats>;
        tokens: number;  // 建設所需善向幣
    };
    isActive: boolean; // 是否運作中
}

export interface ITokenTransaction {
    id: string;
    userId: string;
    amount: number;
    type: 'EARN' | 'SPEND' | 'EXCHANGE'; // 賺取 / 花費 / 交換
    reason: string;    // 交易理由 (需符合 Traceable)
    timestamp: number; // 時間戳
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
}
