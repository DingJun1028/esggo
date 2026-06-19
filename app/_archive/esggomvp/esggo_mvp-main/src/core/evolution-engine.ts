import {
    IAvatarCore,
    IVirtueFingerprint,
    IAssessmentRecord
} from './omni-types';
import { omniLogger, LogCategory } from './omniLogger';

/**
 * 🌀 EvolutionEngine
 * 
 * 負責處理數位分身的等級演進、稱號授予與屬性加總。
 */
export class EvolutionEngine {
    private static RANKS = [
        "初學者 (Novice)",
        "永續先鋒 (Sustain-Pioneer)",
        "智識守護者 (Knowledge-Guardian)",
        "共鳴導師 (Resonance-Mentor)",
        "萬能行者 (Omni-Walker)",
        "真理編織者 (Truth-Weaver)",
        "因果大師 (Karmic-Master)",
        "虛空見證者 (Void-Witness)",
        "永恆之核 (Eternal-Core)",
        "善向涅槃 (Transcendent-Nirvana)"
    ];

    /**
     * 🔝 calculateLevel: 根據累積 EXP 計算等級
     */
    public static calculateLevel(totalExp: number): { level: number; rank: string } {
        const level = Math.min(10, Math.floor(totalExp / 1000) + 1);
        const rank = this.RANKS[level - 1];
        return { level, rank };
    }

    /**
     * 🧬 deriveGainsFromKnowledge: 將學習到的知識領域轉化為屬性增益
     * E (環境) -> 智 (Wisdom), 節 (Moderation)
     * S (社會) -> 仁 (Benevolence), 和 (Harmony)
     * G (治理) -> 誠 (Integrity), 勇 (Courage)
     */
    public static deriveGainsFromKnowledge(domain: string, expReward: number): Partial<IVirtueFingerprint> {
        const gains: Partial<IVirtueFingerprint> = {};
        const value = Math.max(1, Math.ceil(expReward / 20)); // 基本增益

        switch (domain) {
            case 'E':
                gains.wisdom = value;
                gains.moderation = value;
                break;
            case 'S':
                gains.benevolence = value;
                gains.harmony = value;
                break;
            case 'G':
                gains.integrity = value;
                gains.courage = value;
                break;
        }
        return gains;
    }

    /**
     * 🧬 evoluteAvatar: 應用評測結果至分身核心
     */
    public static evoluteAvatar(avatar: IAvatarCore, assessment: IAssessmentRecord): IAvatarCore {
        omniLogger.info(LogCategory.SYSTEM, `🧬 Evoluting Avatar ${avatar.nickname} with new assessment...`);

        // 1. 更新屬性
        const newVirtues = { ...avatar.virtues };
        Object.entries(assessment.virtueGains).forEach(([key, val]) => {
            const virtueKey = key as keyof IVirtueFingerprint;
            newVirtues[virtueKey] = Math.min(100, (newVirtues[virtueKey] || 0) + (val || 0));
        });

        // 2. 更新 EXP
        const totalGain = (assessment as any).expGain || Object.values(assessment.virtueGains).reduce((a, b) => (a || 0) + (b || 0), 0) || 10;
        const newExp = avatar.exp + totalGain;

        // 3. 計算新等級與稱號
        const { level, rank } = this.calculateLevel(newExp);

        const evolvedAvatar: IAvatarCore = {
            ...avatar,
            virtues: newVirtues,
            exp: newExp,
            level,
            rank,
            lifecycle_events: [
                ...(avatar.lifecycle_events || []),
                {
                    id: `evolve-${Date.now()}`,
                    action: 'EVOLVED',
                    source_module: 'EvolutionEngine',
                    timestamp: Date.now(),
                    metadata: {
                        level: level as any,
                        exp: newExp as any,
                        rank: rank as any
                    }
                }
            ]
        };

        if (level > avatar.level) {
            omniLogger.info(LogCategory.SYSTEM, `🎊 LEVEL UP! ${avatar.nickname} reached Level ${level} [${rank}]`);
        }

        return evolvedAvatar;
    }
}
