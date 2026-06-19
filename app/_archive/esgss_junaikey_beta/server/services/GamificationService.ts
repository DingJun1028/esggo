import { omniLogger, LogCategory } from './omni/infrastructure/logging/OmniLogger.js';

export interface VillageState {
    level: number;
    xp: number;
    nextLevelAt: number;
    treeGrowth: number; // 0 to 100
    buildings: string[];
}

/**
 * Phase 47: 永續遊戲化 (Gamification)
 * Manages the growth of the Impact Tree and the ESG Go Village state.
 */
export class GamificationService {
    private state: VillageState = {
        level: 1,
        xp: 0,
        nextLevelAt: 1000,
        treeGrowth: 15,
        buildings: ['Foundation Stone']
    };

    /**
     * Records an ESG action and rewards XP/Growth.
     */
    public recordAction(type: string, impact: number): VillageState {
        omniLogger.info(LogCategory.SYSTEM, `[Gamification] Recording action: ${type} | Impact: ${impact}`);

        const xpGain = Math.floor(impact * 100);
        this.state.xp += xpGain;
        this.state.treeGrowth = Math.min(100, this.state.treeGrowth + (impact * 2));

        if (this.state.xp >= this.state.nextLevelAt) {
            this.levelUp();
        }

        return { ...this.state };
    }

    private levelUp() {
        this.state.level += 1;
        this.state.xp -= this.state.nextLevelAt;
        this.state.nextLevelAt = Math.floor(this.state.nextLevelAt * 1.5);

        const newBuildings = ['Solar Array', 'Water Purifier', 'Social Hub', 'Wind Turbine', 'Bio Dome'];
        const nextBuilding = newBuildings[this.state.level % newBuildings.length];
        if (nextBuilding && !this.state.buildings.includes(nextBuilding)) {
            this.state.buildings.push(nextBuilding);
        }

        omniLogger.info(LogCategory.SYSTEM, `[Gamification] LEVEL UP! Now Level ${this.state.level}. New structure: ${nextBuilding}`);
    }

    public getState(): VillageState {
        return { ...this.state };
    }
}

export const gamificationService = new GamificationService();
