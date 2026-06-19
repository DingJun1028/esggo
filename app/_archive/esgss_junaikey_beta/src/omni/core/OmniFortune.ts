import { omniLogger, LogCategory } from '../infrastructure/logging/OmniLogger.ts';
import { OmniRequest, IVerifiedResponse } from './types/OmniCore.types.ts';

/**
 * 🧧 OmniFortune: The Sovereign Fortune (斯福氣)
 * --------------------------------------------------
 * [Core] 福氣乘數與加成管理系統 (Fortune Multiplier & Bonus System)
 * [Concept] "斯福氣" (Sovereign Fortune) - User's cumulative luck/merit.
 * [5T Alignment] Tangible (Visual Feedback), Trustworthy (Hash-sealed Luck)
 */
export interface FortuneState {
    merit: number;          // 功德/福報值
    multiplier: number;     // 幸運乘數
    lastUpdated: number;
}

export class OmniFortune {
    private static instance: OmniFortune;
    private state: FortuneState = {
        merit: 100,
        multiplier: 1.0,
        lastUpdated: Date.now()
    };

    private constructor() {
        omniLogger.info(LogCategory.SYSTEM, '🧧 OmniFortune Initialized: 斯福氣核心啟動');
    }

    public static getInstance(): OmniFortune {
        if (!OmniFortune.instance) {
            OmniFortune.instance = new OmniFortune();
        }
        return OmniFortune.instance;
    }

    /**
     * 獲取當前福氣狀態 (Get Current Fortune State)
     */
    public getState(): FortuneState {
        return { ...this.state };
    }

    /**
     * 增加功德/福氣 (Add Merit/Fortune)
     * @param amount 增加的量
     */
    public async addMerit(amount: number): Promise<IVerifiedResponse> {
        this.state.merit += amount;
        this.state.multiplier = 1.0 + (this.state.merit / 1000); // 簡單乘數邏輯
        this.state.lastUpdated = Date.now();

        const validRequest: OmniRequest = {
            id: crypto.randomUUID(),
            type: 'COMMAND',
            content: `FORTUNE:ADD_MERIT:${amount}`,
            timestamp: this.state.lastUpdated,
            source: 'OmniFortune',
            tags: ['fortune', 'merit', 'sync'],
            payload: { amount, newState: this.state }
        };

        return {
            core: validRequest,
            message: `Merit increased by ${amount}. Total: ${this.state.merit}`,
            verified: true,
            data: this.state,
            source_origin: 'OmniFortune',
            five_t_ref: `FORTUNE-${this.state.lastUpdated}`
        };
    }

    /**
     * 計算幸運加成 (Calculate Luck Bonus)
     * 用於影響 OmniChance 的 Roll 結果
     */
    public calculateBonus(): number {
        // 福氣越高，加成越高 (0-10 之間)
        return Math.min(10, this.state.multiplier * 2);
    }
}

export const omniFortune = OmniFortune.getInstance();
