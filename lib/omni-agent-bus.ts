import { create } from 'zustand';

/**
 * OmniAgentBus - 實現「全域之脈 (Global Pulse)」與「全通之心 (Omni Heart)」
 * 負責在 UI (液態玻璃介面)、OmniAgent (智慧核) 與 5T 金庫間傳遞無摩擦的共識訊號。
 * 達致「無作妙德，圓通無礙」的運行至境。
 */

export type OmniSignalType = 
    | 'OBSERVE'     // 全知之眼 (感知器) - 捕捉事件
    | 'INTENT'      // 全能之核 (指揮器) - 意圖下達
    | 'MANIFEST'    // 全息之腦 (進化器) - UI 無縫顯化
    | 'SEAL'        // 全境之骨 (治理器) - 5T 防篡改封印
    | 'HEAL';       // 全通之心 (自發治理) - 熵減與自動修復

export interface OmniSignal {
    id: string;
    type: OmniSignalType;
    source: string;
    payload: any;
    timestamp: number;
}

interface OmniAgentBusState {
    signals: OmniSignal[];
    activeResonance: boolean;
    dispatch: (type: OmniSignalType, source: string, payload: any) => void;
    clearSignals: () => void;
}

export const useOmniAgentBus = create<OmniAgentBusState>((set) => ({
    signals: [],
    activeResonance: false,
    
    dispatch: (type, source, payload) => set((state) => {
        const newSignal: OmniSignal = {
            id: crypto.randomUUID(),
            type,
            source,
            payload,
            timestamp: Date.now()
        };

        // 模擬「圓通無礙」：當信號流入時，觸發全局共振 (Resonance)
        return {
            signals: [newSignal, ...state.signals].slice(0, 50), // 保持最新 50 筆意識流
            activeResonance: true
        };
    }),

    clearSignals: () => set({ signals: [], activeResonance: false })
}));

// 自適應感知協議 (Adaptive Perception Protocol)
// 當系統偵測到特定信號時，自動觸發「無作妙德」的治理反應
export const triggerSpontaneousVirtue = (signal: OmniSignal) => {
    if (signal.type === 'HEAL') {
        console.log('[OmniAgentBus] 全息之腦啟動：執行熵減與重構，實現圓通無礙。');
    }
};
