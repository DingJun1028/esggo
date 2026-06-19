import { IESCardCore } from './cards';

/**
 * 🃏 Impact Nexus: Impact Card Interface
 * Extends IESCardCore with game-specific resonance and entropy mechanics.
 */
export interface IImpactCard extends IESCardCore {
    rarity: 'COMMON' | 'UNCOMMON' | 'RARE' | 'LEGENDARY' | 'MYTHIC';
    impactCategory: 'ENVIRONMENTAL' | 'SOCIAL' | 'GOVERNANCE';
    resonance: {
        base: number;
        current: number;
        potential: number;
    };
    entropyImpact: number; // Effectiveness against Entropy Nodes
    isLocked: boolean;     // [5T Trustworthy]
    teachingPoint?: string; // [Service as Teaching]
    learningNexus?: ILearningNexus; // [Knowledge Nexus Expansion]
    signature?: string;    // [5T Cryptographic Binding]
    publicKey?: string;    // [5T Cryptographic Binding]
}

/**
 * 🎓 Learning Nexus: ESG Knowledge & Case Metadata
 */
export interface ILearningNexus {
    knowledgePoint?: IESGKnowledge;
    corporateCase?: ICorporateCase;
}

export interface IESGKnowledge {
    title: string;
    content: string;
    standard?: 'GRI' | 'SASB' | 'TCFD' | 'TNFD' | 'SDGs';
    category: 'E' | 'S' | 'G';
}

export interface ICorporateCase {
    company: string;
    achievement: string;
    context: string;
    impactLevel: number; // 1-100
}

/**
 * 🏰 Sustainability Village Node (Village Building Evolution)
 */
export interface IVillageNode {
    id: string;
    name: string;
    type: 'ENERGY' | 'NATURE' | 'TECH' | 'SOCIAL' | 'GOVERNANCE' | 'MANA' | 'DECOR';
    level: number;
    health: number; // 0-100
    entropyLevel: number; // 0-100
    isCorrupted: boolean;
    position: { x: number; y: number; z: number }; // Isometric alignment
}

/**
 * 🌌 Impact Nexus Game State
 */
export interface IImpactNexusState {
    playerSoul: {
        xp: number;
        level: number;
        resonance: number;
        mana: number;
        rank: string;
    };
    village: {
        nodes: IVillageNode[];
        globalHealth: number;
        entropyPressure: number;
        playerPos: { x: number; y: number; z: number };
        playerDirection: 'N' | 'S' | 'E' | 'W';
    };
    deck: IImpactCard[];
    playerHand: IImpactCard[];
    activeEvents: any[];
    activeQuests: any[];
    entropy: number;
    timestamp: string;      // [5T] State timestamp
    signature?: string;    // [5T] All-state signature
    publicKey?: string;    // [5T] Verifier key
}
