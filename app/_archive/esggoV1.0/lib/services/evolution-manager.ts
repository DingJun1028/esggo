import { useEvolutionStore } from "../stores/evolution-store";

/**
 * EvolutionManager (演化管理中心)
 * 負責處理全體 AI 智能體的能力成長、經驗值結算與技能解鎖審核。
 */
export class EvolutionManager {
    private static instance: EvolutionManager;

    private constructor() { }

    public static getInstance(): EvolutionManager {
        if (!EvolutionManager.instance) {
            EvolutionManager.instance = new EvolutionManager();
        }
        return EvolutionManager.instance;
    }

    /**
     * 任務結算：根據任務難度與 agent 表現發放經驗值
     */
    public async processTaskCompletion(payload: {
        agentName: string,
        taskComplexity: number,
        resultQuality: number
    }) {
        const xpAmount = Math.round(payload.taskComplexity * payload.resultQuality * 10);
        console.log(`[EvolutionManager] Awarding ${xpAmount} XP to agent ${payload.agentName}`);

        // 更新 Zustand Store (這通常是在 Client Side 調用，但服務層提供邏輯介面)
        // 注意：在 Server 端的服務中，我們可能需要另一個持久化層
        // 這裡我們模擬呼叫狀態更新
        useEvolutionStore.getState().awardXP(payload.agentName, xpAmount);

        // 額外發放「集體經驗值」
        useEvolutionStore.getState().awardXP("Collective", Math.round(xpAmount * 0.2));

        return {
            status: "SUCCESS",
            awardedXP: xpAmount,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * 技能解鎖審核 (Skill Unlock Verification)
     * 基於 5T 協議驗證智能體是否達到解鎖門檻。
     */
    public checkUnlockEligibility(skillId: string): boolean {
        const state = useEvolutionStore.getState();
        const skill = state.skills.find(s => s.id === skillId);

        if (!skill) return false;

        // 簡單邏輯：如果前置能力等級高於一定程度
        // 這裡可擴展更複雜的 5T 驗證
        return true;
    }
}

export const evolutionManager = EvolutionManager.getInstance();
