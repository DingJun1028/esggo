/**
 * 🎴 Impact Nexus Card Types
 * --------------------------------------------------
 * [Philosophy] 善向紀元 — Knowledge assets materialized as cards
 * [Mechanism] VirtueEngine10 crystallization → Combat stats → Rarity evaluation
 * [Protocol] 5T verified, credential-bound knowledge asset cards
 */

/**
 * 💎 Card Rarity
 */
export enum CardRarity {
    /** 普通 — Common knowledge entry */
    COMMON = 'COMMON',
    /** 稀有 — Rare insight */
    RARE = 'RARE',
    /** 史詩 — Epic achievement */
    EPIC = 'EPIC',
    /** 傳說 — Legendary mastery */
    LEGENDARY = 'LEGENDARY',
    /** 神話·無作 — Mythic Actionless: supreme attainment */
    MYTHIC_ACTIONLESS = 'MYTHIC_ACTIONLESS',
}

/**
 * ⚔️ Card Combat Stats (derived from VirtueEngine10)
 */
export interface ICardCombatStats {
    readonly ATK: number;    // Courage (勇氣)
    readonly DEF: number;    // Integrity (誠信)
    readonly MP: number;     // Intelligence (智力)
    readonly HP: number;     // Benevolence (仁愛)
}

/**
 * 🌟 Card Visual Aura
 */
export interface ICardAura {
    readonly glowColor: string;       // Primary glow color
    readonly glowIntensity: number;   // 0-100
    readonly borderStyle: string;     // Visual border effect
    readonly particleEffect: string;  // Particle animation type
}

/**
 * 🎴 Impact Nexus Card: The knowledge asset card
 */
export interface IImpactNexusCard {
    readonly cardId: string;
    readonly name: string;
    readonly description: string;
    readonly rarity: CardRarity;
    readonly meridian: 'INWARD_REN' | 'OUTWARD_DU';

    // Combat attributes
    readonly stats: ICardCombatStats;

    // 5T audit at forge time
    readonly fiveT_completionRate: number;

    // Credential binding (optional — unbound cards are lower grade)
    readonly credentialId?: string;

    // Visual
    readonly aura: ICardAura;

    // ESG Elements (All In One Integration)
    readonly esg?: {
        readonly environmental: number; // 0-100
        readonly social: number;        // 0-100
        readonly governance: number;    // 0-100
        readonly totalScore: number;    // Weighted total
    };

    // Metadata
    readonly forgedAt: number;
    readonly forgedBy: string;           // Forger's UUID
    readonly sealHash: string;           // SHA-256 seal of card data
}
