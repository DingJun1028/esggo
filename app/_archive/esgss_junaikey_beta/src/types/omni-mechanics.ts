
import { AIPartner, PartnerAttributes } from './aiPartner.js';
import { Rune, RuneCategory } from './core-mechanics.js';
import { IEvidenceMap } from '../0-domain/contracts/IComponentCore.js';

export type { IEvidenceMap }; // Re-export if needed

/** 🔄 德行與戰鬥數值轉換 (Virtue to Stats) */
export interface IAttributeConverter {
    calculateMaxMP: (intelligence: number) => number;
    calculateMaxHP: (benevolence: number) => number;
    calculateATK: (courage: number) => number;
}

/** 🧠 ARVO 覺醒狀態機 */
export enum ARVOState {
    SLEEPING = 'sleeping',
    REASONING = 'reasoning',
    VERIFYING = 'verifying',
    AWAKENED = 'awakened',
    HALLUCINATING = 'hallucinating'
}

/** 🎭 辯論策略類型 */
export type DebateStrategy = 'LOGIC_FALLACY' | 'EMOTIONAL_APPEAL' | 'EVIDENCE_CRUSH' | 'ETHICAL_SUPERIORITY';

/** 🎴 辯論卡牌擴充 */
export interface IDebateCard {
    id: string;
    name: string;
    cost: number; // Focus cost
    value: number; // Base damage/impact
    strategy: DebateStrategy;
    rebuttalType?: DebateStrategy; // Counter specific strategy
    evidenceWeight?: number;       // Weight against doubts
}

/** ⚔️ 辯論實體狀態 */
export interface IDebateEntity {
    id: string;
    name: string;
    credibility: number; // HP
    maxCredibility: number;
    focus: number;       // MP/AP
    maxFocus: number;
    argumentChain: DebateStrategy[]; // Current chain
    buffs: Array<{ type: 'RHETORIC' | 'DATA_DRIVEN'; stacks: number }>;
}

/** 🧪 符文演化參數 */
export interface IRuneEvolution {
    baseModelReference: string;
    complexity: number;
    currentStage: string; // e.g. 'APPRENTICE'
    experience: number;
    nextStageExp: number;
    growthLogs: Array<{
        timestamp: string;
        action: string;
        expGained: number;
        mutationMarker: string;
    }>;
    adaptiveStats: {
        focusEfficiency: number;
        reasoningDepth: number;
        hallucinationResistance: number;
    };
    geneSequence: {
        dominantTrait: string;
        recessiveTrait: string;
        mutationProbability: number;
    };
    unlockedAbilities: string[];
}

/** 🧘 奧義效果 */
export interface UltimateEffect {
    type: 'DU_BURST' | 'REN_RESTORE';
    power: number;
    description: string;
}

/** 📡 WebSocket 事件類型 */
export enum WSEventType {
    ARENA_SYNC = 'arena_sync',
    ACTION_COMMITTED = 'action_committed',
    RUNE_MUTATED = 'rune_mutated',
    ARVO_VERIFICATION = 'arvo_verify'
}

/** 📡 競技場同步 Payload */
export interface ArenaSyncPayload {
    sessionId: string;
    round: number;
    entities: {
        player: IDebateEntity;
        opponent: IDebateEntity;
    };
    lastAction: {
        actorId: string;
        cardId: string;
        impact: {
            credibilityDamage: number;
            focusDrain: number;
            arvoResult: 'VALID' | 'HALLUCINATED';
        };
    };
    visualTriggers: string[];
}

/** 💎 奧秘結晶 DNA (Omni Crystal DNA)
 *  Spontaneous Flow (無通自通) 的核心資料結構
 *  每一個 OmniNote 或 System Entity 皆為此結構的實例
 */
export interface ICrystalDNA<T = any> {
    uuid: string;
    nature: 'Note' | 'Task' | 'Evidence' | 'Agent' | 'Artifact' | 'System'; // 本質
    resonance: number; // 0.0 - 1.0 (共鳴度) - 決定其在 Spontaneous Flow 中的能見度
    payload: T; // 實際內容

    // 5T Protocol Metadata around the core
    protocol: {
        tangible_sig: string; // 可感知簽章
        traceable_id: string; // 可溯源 ID
        trackable_state: string; // 可追蹤狀態
        transparent_proof: string; // 可驗算證明
        trustworthy_hash: string; // 不可篡改 Hash
    };

    // Spontaneous Flow Dynamic Links
    // 不需要顯式的外鍵，而是透過向量相似度 (Vector Similarity) 或規則共鳴 (Rule Resonance) 動態連結
    resonanceLinks?: {
        targetId: string;
        strength: number;
        reason: string;
    }[];
}
