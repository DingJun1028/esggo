/**
 * 🧚 omni-sprite-engine.ts
 * Epic 11: 萬能精靈 (JunAiKey) 指導引擎
 * 功能：管理精靈的狀態、情緒與主動引導邏輯。
 */

import { create } from 'zustand';
import { IKnowledgePoint } from './village-knowledge';

export type SpriteMood = 'idle' | 'thinking' | 'excited' | 'observing' | 'warning' | 'happy' | 'sad';

interface SpriteMessage {
    id: string;
    sender: 'sprite' | 'user';
    content: string;
    timestamp: number;
}

interface SpriteStore {
    isOpen: boolean;
    mood: SpriteMood;
    messages: SpriteMessage[];
    activeNotice: string | null;

    // Actions
    toggle: () => void;
    setMood: (mood: SpriteMood) => void;
    addMessage: (content: string, sender: 'sprite' | 'user') => void;
    clearMessages: () => void;
    setNotice: (notice: string | null) => void;
}

/**
 * 🧠 OmniSpriteStore - 精靈狀態持久化與響應中心
 */
export const useSpriteStore = create<SpriteStore>((set) => ({
    isOpen: false,
    mood: 'idle',
    messages: [
        {
            id: 'init',
            sender: 'sprite',
            content: '主人，我是 JunAiKey。隨時準備好協助您顯化永續資產！',
            timestamp: Date.now()
        }
    ],
    activeNotice: null,

    toggle: () => set((state) => ({ isOpen: !state.isOpen })),
    setMood: (mood) => set({ mood }),
    addMessage: (content, sender) => set((state) => ({
        messages: [
            ...state.messages,
            { id: Math.random().toString(36), sender, content, timestamp: Date.now() }
        ]
    })),
    clearMessages: () => set({ messages: [] }),
    setNotice: (activeNotice) => set({ activeNotice }),
}));

/**
 * 🕵️ SpriteProactiveEngine - 主動引導邏輯
 */
export class SpriteProactiveEngine {
    private static instance: SpriteProactiveEngine;

    public static getInstance() {
        if (!SpriteProactiveEngine.instance) {
            SpriteProactiveEngine.instance = new SpriteProactiveEngine();
        }
        return SpriteProactiveEngine.instance;
    }

    /**
     * 👁️ 監測場景並觸發智慧提醒
     */
    public checkContext(learnedCount: number, domainStats: { E: number; S: number; G: number }) {
        const store = useSpriteStore.getState();

        // 情境 1: 能量集滿，提醒顯化
        if (domainStats.E >= 3 || domainStats.S >= 3 || domainStats.G >= 3) {
            if (store.activeNotice !== 'MANIFEST_READY') {
                store.setNotice('MANIFEST_READY');
                this.notify('偵測到高度聚合的知識能量！您可以前往顯化聖殿產出典範報告了。', 'excited');
            }
        }

        // 情境 2: 初次進入圖書館
        if (learnedCount === 0 && store.messages.length <= 1) {
            this.notify('歡迎來到智識庫！建議先從標記「一重感知」開始您的修煉。', 'observing');
        }
    }

    private notify(content: string, mood: SpriteMood) {
        const store = useSpriteStore.getState();
        store.setMood(mood);
        store.addMessage(content, 'sprite');
    }
}

export const spriteProactiveEngine = SpriteProactiveEngine.getInstance();
