import { IVirtueFingerprint } from './omni-types';
import { omniLogger, LogCategory } from './omniLogger';
import { AlchemyEngine } from './alchemy-engine';

export type ISixVirtues = IVirtueFingerprint;

export interface IVillageState {
    prosperity: number; // 0-100
    ecosystemHealth: number; // 0-100
    socialCohesion: number; // 0-100
    transparencyLevel: number; // 0-100
}

/**
 * 🎮 RPGEngine (善向 RPG 核心)
 * 
 * Synchronizes user ESG actions with the "Sustainability Village" environment
 * and the "Digital Avatar" growth.
 */
export class RPGEngine {
    private static avatar: ISixVirtues = {
        wisdom: 10,
        benevolence: 10,
        courage: 10,
        integrity: 10,
        temperance: 10,
        harmony: 10
    };

    private static village: IVillageState = {
        prosperity: 50,
        ecosystemHealth: 50,
        socialCohesion: 50,
        transparencyLevel: 50
    };

    /**
     * 🧬 forgeGrowth: Distribute points to virtues based on achievement types.
     */
    static async forgeGrowth(virtue: keyof ISixVirtues, points: number) {
        this.avatar[virtue] += points;
        omniLogger.info(LogCategory.SYSTEM, `🧬 Avatar Growth: ${virtue} +${points} -> Total: ${this.avatar[virtue]}`);

        // Ripple effect to village
        this.syncVillage();
    }

    /**
     * 🏘️ syncVillage: Update village metrics based on avatar virtues and alchemy stats.
     */
    private static syncVillage() {
        const user = AlchemyEngine.getUser();

        this.village.prosperity = Math.min(100, 50 + (user.level * 5));
        this.village.ecosystemHealth = Math.min(100, ((this.avatar.moderation as number) + (this.avatar.harmony as number)) / 2);
        this.village.socialCohesion = Math.min(100, ((this.avatar.benevolence as number) + (this.avatar.integrity as number)) / 2);
        this.village.transparencyLevel = Math.min(100, ((this.avatar.wisdom as number) + (this.avatar.integrity as number)) / 2);

        omniLogger.info(LogCategory.SYSTEM, `🏘️ Village Synced: Prosperity @ ${this.village.prosperity}%`);
    }

    private static activeQuests: any[] = [
        { id: 'Q1', title: '水源清潔挑戰', description: '村莊水源被污染，需要提交一份「碳盤存報告」原子來淨化。', reward: 50, status: 'available' }
    ];

    /**
     * 🍲 feedAtom: Consume a 5T atom to nourish the avatar's virtues.
     */
    static async feedAtom(atomType: 'ENVIRONMENT' | 'SOCIAL' | 'GOVERNANCE') {
        omniLogger.info(LogCategory.SYSTEM, `🍲 Feeding Avatar with ${atomType} Atom...`);

        switch (atomType) {
            case 'ENVIRONMENT':
                (this.avatar.moderation as number) += 5;
                (this.avatar.harmony as number) += 2;
                break;
            case 'SOCIAL':
                this.avatar.benevolence += 5;
                this.avatar.courage += 2;
                break;
            case 'GOVERNANCE':
                this.avatar.wisdom += 5;
                this.avatar.integrity += 2;
                break;
        }

        this.syncVillage();
        return { success: true, newVirtues: { ...this.avatar } };
    }

    static getQuests() {
        return [...this.activeQuests];
    }

    static getAvatar() {
        return { ...this.avatar };
    }

    static getVillage() {
        return { ...this.village };
    }

    /**
     * 🎭 triggerScenario: Return a plot point based on current states.
     */
    static triggerScenario() {
        if (this.village.ecosystemHealth < 40) {
            return {
                title: "乾涸的溪流",
                content: "村莊的水源因工業過度開發而乾涸。你的「節 (Moderation)」屬性不足以應對。需要解鎖「碳盤存管理」來修復環境。",
                virtueRequired: "moderation"
            };
        }
        return {
            title: "萬物共鳴",
            content: "村莊與自然達成共鳴。你的「和 (Harmony)」屬性正在滋養這片土地。",
            virtueRequired: "harmony"
        };
    }
}
