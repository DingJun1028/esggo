import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useState, useEffect } from 'react';

// 1. 定義前端的宇宙法則 (狀態型別)
export interface WorldState {
    worldLevel: number;
    heroName: string;
    isAwakened: boolean;
    artifacts: string[];
    // ESG Platform Memory
    activePersonaId: string;
    dataIntegrityPoints: number;
    complianceTokens: number;
    tenantId: string;
}

// 2. 定義能操作法則的神聖動作 (Actions)
interface EternalMemoryActions {
    awaken: (initialState: Partial<WorldState>) => void;
    engrave: <K extends keyof WorldState>(key: K, data: WorldState[K]) => void;
    telepathize: (message: any) => void; // 心電感應技能
    undo: () => void;
    redo: () => void;
    _past: WorldState[];
    _future: WorldState[];
}

type EternalMemoryStore = WorldState & EternalMemoryActions;

/**
 * 萬能之心 - 前端 Zustand 永憶
 * 結合 LocalStorage 與 React 響應式的狀態管理中心
 */
export const useEternalMemory = create<EternalMemoryStore>()(
    persist(
        (set) => ({
            // === 初始沉睡狀態 ===
            worldLevel: 1,
            heroName: "Unknown",
            isAwakened: false,
            artifacts: [],
            activePersonaId: "omni",
            dataIntegrityPoints: 0,
            complianceTokens: 0,
            tenantId: "default",
            _past: [],
            _future: [],

            // === 系統方法 ===
            awaken: (initialState: Partial<WorldState>) => {
                console.log(`[前端覺醒] 🌌 系統狀態同步中...`);
                set(initialState);
            },

            engrave: (key, data) => {
                set((state) => {
                    console.log(`[前端銘刻] 節點 '${String(key)}' 已寫入 LocalStorage。`);

                    // 快照當前純粹的「世界法則」狀態
                    const currentState: WorldState = {
                        worldLevel: state.worldLevel,
                        heroName: state.heroName,
                        isAwakened: state.isAwakened,
                        artifacts: state.artifacts,
                        activePersonaId: state.activePersonaId,
                        dataIntegrityPoints: state.dataIntegrityPoints,
                        complianceTokens: state.complianceTokens,
                        tenantId: state.tenantId,
                    };

                    return {
                        [key]: data,
                        _past: [...state._past, currentState],
                        _future: [], // 發生新的收束，抹去未來的分歧
                    } as Partial<EternalMemoryStore>;
                });
            },

            telepathize: (message) => {
                if (typeof window !== 'undefined') {
                    const channel = new BroadcastChannel('omnipotent-heart-telepathy');
                    channel.postMessage(message);
                    console.log(`[心電感應] 📡 已向平行宇宙發送心念:`, message);
                    channel.close();
                }
            },

            undo: () => {
                set((state) => {
                    if (state._past.length === 0) {
                        console.log(`[時光倒流] ❌ 已經來到時間的起點，無法再回溯。`);
                        return state;
                    }
                    const previous = state._past[state._past.length - 1];
                    const newPast = state._past.slice(0, -1);
                    const currentState: WorldState = { worldLevel: state.worldLevel, heroName: state.heroName, isAwakened: state.isAwakened, artifacts: state.artifacts, activePersonaId: state.activePersonaId, dataIntegrityPoints: state.dataIntegrityPoints, complianceTokens: state.complianceTokens, tenantId: state.tenantId };

                    console.log(`[時光倒流] ⏪ 狀態已回溯至上一個節點。`);
                    return { ...previous, _past: newPast, _future: [...state._future, currentState] } as Partial<EternalMemoryStore>;
                });
            },

            redo: () => {
                set((state) => {
                    if (state._future.length === 0) {
                        console.log(`[時光倒流] ❌ 已經位於時間的盡頭，無法再快進。`);
                        return state;
                    }
                    const next = state._future[state._future.length - 1];
                    const newFuture = state._future.slice(0, -1);
                    const currentState: WorldState = { worldLevel: state.worldLevel, heroName: state.heroName, isAwakened: state.isAwakened, artifacts: state.artifacts, activePersonaId: state.activePersonaId, dataIntegrityPoints: state.dataIntegrityPoints, complianceTokens: state.complianceTokens, tenantId: state.tenantId };

                    console.log(`[時光快進] ⏩ 狀態已重現至下一個節點。`);
                    return { ...next, _past: [...state._past, currentState], _future: newFuture } as Partial<EternalMemoryStore>;
                });
            }
        }),
        {
            // 這是存入 LocalStorage 的 Key 名稱
            name: 'omnipotent-heart-storage',
            storage: createJSONStorage(() => localStorage),
            // 記憶相通：過濾掉不需要跨宇宙共享的歷史殘影，避免撐爆時空容量 (5MB 限制)
            partialize: (state) => Object.fromEntries(
                Object.entries(state).filter(([key]) => !['_past', '_future'].includes(key))
            ) as EternalMemoryStore,
        }
    )
);

if (typeof window !== 'undefined') {
    /**
     * 萬能之心被動技能：心心相印 (Cross-Tab Resonance)
     * 監聽 storage 事件，實現狀態的完美共鳴。
     */
    window.addEventListener('storage', (event) => {
        if (event.key === 'omnipotent-heart-storage') {
            console.log(`[心心相印] 💖 感知到平行宇宙的記憶波動，正在進行狀態共鳴...`);
            useEternalMemory.persist.rehydrate();
        }
    });

    /**
     * 萬能之心主動/被動技能：心意相通 & 心電感應 (Telepathy & Shared Intent)
     * 透過 BroadcastChannel 建立不依賴 LocalStorage 的純意識交流通道。
     */
    const telepathyChannel = new BroadcastChannel('omnipotent-heart-telepathy');
    telepathyChannel.onmessage = (event) => {
        console.log(`[心意相通] 💫 接收到來自平行宇宙的共鳴:`, event.data);
    };
}

/**
 * 解決 Next.js SSR 水合錯誤 (Hydration Mismatch) 的專用 Hook
 * 在 Server 端與 Client 首次 Render 時會回傳 fallback 值，
 * 直到 Client 端水合完成後才回傳 LocalStorage 中的真實記憶。
 */
export function useHydratedEternalMemory<T>(
    selector: (state: EternalMemoryStore) => T,
    fallback: T
): T {
    const storeValue = useEternalMemory(selector);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        requestAnimationFrame(() => setHydrated(true));
    }, []);

    return hydrated ? storeValue : fallback;
}