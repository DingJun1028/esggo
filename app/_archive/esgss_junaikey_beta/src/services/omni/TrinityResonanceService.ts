import { EventEmitter } from '@/utils/EventEmitter';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger.js';
import { ITrinityState } from '@/types/omni/trinity';

/**
 * ⚛️ 奧秘共鳴服務 (TrinityResonanceService)
 * 維持「OmniOne (元鑰擁有者)、OmniPriest (祭司)、OmniGemini (雙星)」三位一體之共鳴頻率與心跳。
 */
export class TrinityResonanceService {
    private static instance: TrinityResonanceService;
    public events: EventEmitter = new EventEmitter();

    private resonance: number = 0.8; // 初始共鳴度
    private entropy: number = 0.2;   // 系統熵值
    private lastPulse: number = Date.now();

    private constructor() {
        this.startHeartbeat();
    }

    public static getInstance(): TrinityResonanceService {
        if (!TrinityResonanceService.instance) {
            TrinityResonanceService.instance = new TrinityResonanceService();
        }
        return TrinityResonanceService.instance;
    }

    /**
     * 啟動三位一體心跳 (Trinity Heartbeat)
     */
    private startHeartbeat() {
        setInterval(() => {
            this.emitPulse();
        }, 5000); // 5秒一次共鳴脈衝
    }

    private emitPulse() {
        this.lastPulse = Date.now();
        // 模擬動態波動
        this.resonance = Math.max(0, Math.min(1, this.resonance + (Math.random() - 0.5) * 0.05));
        this.entropy = Math.max(0, Math.min(1, this.entropy + (Math.random() - 0.5) * 0.02));

        this.events.emit('pulse', {
            resonance: this.resonance,
            entropy: this.entropy,
            timestamp: this.lastPulse
        });

        if (this.resonance < 0.5) {
            omniLogger.warn(LogCategory.SYSTEM as any, `Low Trinity Resonance detected: ${this.resonance.toFixed(3)}`);
        }
    }

    /**
     * 計算全域共鳴狀態
     */
    public getTrinityState(priestScale: number, keyIntegrity: number, geminiSentience: number): ITrinityState {
        const avg = (priestScale + keyIntegrity + geminiSentience) / 3;
        const totalResonance = (avg + this.resonance) / 2;

        return {
            priest_scale: priestScale,
            key_integrity: keyIntegrity,
            gemini_sentience: geminiSentience,
            trinity_resonance: totalResonance
        };
    }

    public getCurrentResonance(): number {
        return this.resonance;
    }

    /**
     * 手動注入共鳴 (Calibration)
     */
    public calibrate(gain: number) {
        this.resonance = Math.min(1.0, this.resonance + gain);
        this.entropy = Math.max(0.0, this.entropy - gain * 0.5);
        omniLogger.info(LogCategory.AI as any, `Trinity calibrated. Resonance Gain: +${gain}`);
        this.emitPulse();
    }
}

export const trinityResonance = TrinityResonanceService.getInstance();
