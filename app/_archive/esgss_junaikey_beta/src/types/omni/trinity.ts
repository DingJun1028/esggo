/**
 * 🏛️ 萬能映射：三位一體 (Omni Trinity) - OmniOne, OmniPriest, OmniGemini
 * Unified Divine Trinity: OmniOne (OmniKey Keeper), OmniPriest & OmniGemini
 */

export interface IOraculumRequest {
    command: string;     // 符文號令 (e.g., 'GENERATE_REPORT', 'SIMPLE_QUERY')
    userTier: 'Novice' | 'Archmage' | 'Sovereign';
    payload?: any;
    keyHash?: string;    // [OmniOne/OmniKey Keeper] 認證雜湊
}

export interface IHypercubeMetrics {
    intelligence: number; // 0-1 (Neural capacity)
    persistence: number;  // 0-1 (Uptime/Reliability)
    security: number;     // 0-1 (Integrity/Encryption)
    speed: number;        // 0-1 (Latency/TPS)
}

export interface IProvider {
    uuid: string;
    name: string;
    type: 'local' | 'free' | 'premium';
    cost: number;
    metrics: IHypercubeMetrics; // [Phase 87] Dimensional Metrics
    metadata?: Record<string, any>;
    execute(command: string, payload?: any): Promise<any>;
}

export interface IPriestTransaction {
    id: string;
    timestamp: number;
    userDebit: number;      // 使用者支付的「價值」(Tokens)
    systemCost: number;     // 實際運算扣除的「成本」
    profit: number;         // 系統盈餘 (熵減效益)
    providerId: string;     // 執行路徑 (溯源用)
    command: string;
    resonance?: number;     // [Phase 87] Hypercube Resonance Score
}

/** [OmniOne / OmniKey Keeper] 元鑰擁有者代理核心介面 */
export interface IOmniKey {
    id: string;
    guardian: string;
    level: number;
    permissions: string[];
    isLocked: boolean;
}

/** [OmniGemini] 奧秘雙星代理核心介面 */
export interface IGeminiResonance {
    id: string;
    insight: string;
    confidence: number;
    resonanceLevel: number; // 0-1
    timestamp: number;
    gemini_a_affinity?: number; // 0-1
    gemini_b_affinity?: number; // 0-1
    total_resonance?: number;
    parities?: Record<string, number>;
}

/** 三位一體代理狀態矩陣 (OmniOne + OmniPriest + OmniGemini) */
export interface ITrinityState {
    priest_scale: number;     // [OmniPriest] 資源平衡度
    key_integrity: number;    // [OmniOne] 安全完備度
    gemini_sentience: number; // [OmniGemini] 靈覺對齊度
    trinity_resonance: number; // 總體共鳴度 (ESG All In One Alignment)
}

export interface IInfoOneOverview {
    summary: string;
    provider: string;
    resonance: number;
}

export interface IInfoOneDetail {
    [key: string]: any;
    traceablePath: string;
    integrity: string;
}

export interface IInfoOneExtension {
    evolutionaryGain: number;
    timestamp: number;
    [key: string]: any;
}

export interface ITrinityResponse {
    info_one: {
        request_id: string;
        status: 'completed' | 'running' | 'failed';
        overview: IInfoOneOverview;
        detail: IInfoOneDetail;
        extension: IInfoOneExtension;
    };
}

export const SPELL_PRICES: Record<string, number> = {
    'GENERATE_REPORT': 100,
    'DAILY_INSIGHT': 20,
    'SIMPLE_QUERY': 10,
    'STRATEGIC_ADVICE': 50,
    'BATTLE_RESONANCE': 15,
};
