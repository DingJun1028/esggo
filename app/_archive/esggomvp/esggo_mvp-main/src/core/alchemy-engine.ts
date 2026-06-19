/**
 * 🧪 Alchemy Engine — Progression & Gamification Logic
 * "Knowledge as Asset, Skill as Alchemy"
 */

import {
    IAlchemyState,
    ALCHEMY_LEVELS,
    ALCHEMY_ACHIEVEMENTS,
    AlchemyLevel
} from "./dtos/AlchemyState.dto";
// import { OmniOne } from "./omni-one"; // Refactored to dynamic import for client compatibility

export class AlchemyEngine {
    private static STORAGE_KEY = 'esggo_alchemy_state';

    /**
     * Get current state from storage (mocked for MVP)
     */
    static getState(): IAlchemyState {
        if (typeof window === 'undefined') {
            return { currentLevel: 1, currentExp: 0, totalExp: 0, unlockedAchievements: [] };
        }
        const saved = localStorage.getItem(this.STORAGE_KEY);
        if (saved) return JSON.parse(saved);

        return { currentLevel: 1, currentExp: 0, totalExp: 0, unlockedAchievements: [] };
    }

    /**
     * Save state to storage
     */
    static saveState(state: IAlchemyState) {
        if (typeof window !== 'undefined') {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
        }
    }

    /**
     * Add Experience Points (XP)
     */
    static async addExp(amount: number): Promise<{ levelUp: boolean, newState: IAlchemyState }> {
        const state = this.getState();
        state.currentExp += amount;
        state.totalExp += amount;

        let levelUp = false;
        let nextLevel = (state.currentLevel + 1) as AlchemyLevel;

        while (nextLevel <= 10 && state.currentExp >= ALCHEMY_LEVELS[nextLevel].minExp) {
            state.currentLevel = nextLevel;
            state.lastRankUp = Date.now();
            levelUp = true;
            nextLevel = (state.currentLevel + 1) as AlchemyLevel;
        }

        this.saveState(state);
        return { levelUp, newState: state };
    }

    /**
     * Unlock an Achievement
     */
    static async unlockAchievement(id: string): Promise<{ success: boolean, rewardXp: number }> {
        const state = this.getState();
        if (state.unlockedAchievements.includes(id)) return { success: false, rewardXp: 0 };

        const achievement = ALCHEMY_ACHIEVEMENTS.find(a => a.id === id);
        if (!achievement) return { success: false, rewardXp: 0 };

        state.unlockedAchievements.push(id);
        const { newState } = await this.addExp(achievement.expReward);

        // Manifest as a 5T Atom (Server-only)
        if (typeof window === 'undefined') {
            try {
                const { OmniOne } = await import("./omni-one");
                await OmniOne.manifest({
                    intent: `Achievement Unlocked: ${achievement.name}`,
                    type: "Accomplishment",
                    domainRef: "Alchemy_Portal",
                    payload: { achievementId: id, name: achievement.name },
                    impactMetric: `Earned ${achievement.expReward} XP`,
                    sourceOrigin: "AlchemyEngine_V1"
                });
            } catch (err) {
                console.error("[AlchemyEngine] Manifestation failed (Server-only logic called in non-optimal context or missing deps):", err);
            }
        }

        this.saveState(state);
        return { success: true, rewardXp: achievement.expReward };
    }

    /**
     * Calculate progress percentage to next level
     */
    static getProgress(state: IAlchemyState): number {
        const currentLevelDef = ALCHEMY_LEVELS[state.currentLevel];
        const nextLevel = (state.currentLevel + 1) as AlchemyLevel;

        if (nextLevel > 10) return 100;

        const nextLevelDef = ALCHEMY_LEVELS[nextLevel];
        const range = nextLevelDef.minExp - currentLevelDef.minExp;
        const progress = state.currentExp - currentLevelDef.minExp;

        return Math.min(Math.max((progress / range) * 100, 0), 100);
    }

    /**
     * 💡 計算煉金狀態 (Calculate State)
     */
    static calculateState(exp: number, unlockedIds: string[]): IAlchemyState {
        const level = Math.floor(exp / 1000) + 1;
        return {
            currentLevel: level as AlchemyLevel,
            currentExp: exp % 1000,
            totalExp: exp,
            unlockedAchievements: unlockedIds
        };
    }

    /**
     * 🔮 執行轉化 (Transmutate)
     */
    static async transmutate(userId: string, expOrTargetId: string | number) {
        console.log(`[Alchemy] Transmutating for user ${userId}: ${expOrTargetId}`);
        return {
            success: true,
            newAtomId: `atom-${Math.random().toString(36).slice(2, 11)}`,
            gainedExp: typeof expOrTargetId === 'number' ? expOrTargetId : 150,
            unlockedBadges: [
                { id: 'badge-new', nameZh: '新覺醒者', nameEn: 'New Awakened' }
            ],
            timestamp: Date.now()
        };
    }

    /**
     * 👤 獲取用戶 (Get User)
     */
    static getUser(userId: string = "default") {
        return {
            id: userId,
            name: "Omni Traveler",
            level: 1,
            exp: 1250,
            currentExp: 1250,
            unlockedIds: ["init-gnosis", "first-step"],
            ownedBadges: [
                { id: 'badge-1', nameZh: '初測者' },
                { id: 'badge-2', nameZh: '永續種子' }
            ],
            title: "Gnosis Seeker"
        };
    }
}
