import { create } from 'zustand';
import { IAvatarCore, IAssessmentRecord, IVirtueFingerprint } from './omni-types';
import { EvolutionEngine } from './evolution-engine';
import { omniLogger, LogCategory } from './omniLogger';

interface AvatarState {
    avatar: IAvatarCore | null;
    setAvatar: (avatar: IAvatarCore) => void;
    applyAssessment: (assessment: IAssessmentRecord) => void;
    learnKnowledge: (domain: string, expReward: number, isUnlearning?: boolean) => void;
    initializeDefault: () => void;
}

/**
 * 🌀 useAvatarStore
 * 
 * 數位分身的全域狀態管理 (Powered by Zustand)。
 */
export const useAvatarStore = create<AvatarState>((set, get) => ({
    avatar: null,

    setAvatar: (avatar) => set({ avatar }),

    applyAssessment: (assessment) => {
        const currentAvatar = get().avatar;
        if (!currentAvatar) return;

        const evolvedAvatar = EvolutionEngine.evoluteAvatar(currentAvatar, assessment);
        set({ avatar: evolvedAvatar });

        omniLogger.info(LogCategory.SYSTEM, `✨ Avatar State Updated: ${evolvedAvatar.nickname} grew to level ${evolvedAvatar.level}`);
    },

    learnKnowledge: (domain, expReward, isUnlearning = false) => {
        const currentAvatar = get().avatar;
        if (!currentAvatar) return;

        const multiplier = isUnlearning ? -1 : 1;
        const virtueGains = EvolutionEngine.deriveGainsFromKnowledge(domain, expReward);

        // 轉換為評測格式
        const assessment: IAssessmentRecord = {
            uuid: `learn-sync-${Date.now()}`,
            timestamp: Date.now(),
            virtueGains: Object.fromEntries(
                Object.entries(virtueGains).map(([k, v]) => [k, (v as number) * multiplier])
            ) as any,
            expGain: expReward * multiplier
        } as any;

        const evolvedAvatar = EvolutionEngine.evoluteAvatar(currentAvatar, assessment);
        set({ avatar: evolvedAvatar });

        if (!isUnlearning) {
            omniLogger.info(LogCategory.SYSTEM, `📚 Knowledge Synced: Learned ${domain} point, +${expReward} EXP`);
        }
    },

    initializeDefault: () => {
        const defaultAvatar: IAvatarCore = {
            uuid: 'avatar-dingjun-default',
            version: '1.0.0',
            timestamp: Date.now(),
            status: 'Active',
            evidence: {},
            nickname: 'DingJun',
            avatarType: 'SOVEREIGN',
            level: 1,
            exp: 0,
            rank: '初學者 (Novice)',
            virtues: {
                wisdom: 10,
                benevolence: 10,
                courage: 10,
                integrity: 10,
                moderation: 10,
                harmony: 10
            },
            natureLaw: '道法自然，系統毅然，上善若水，善向永續。',
            closingLaw: '以終為始，始終如一，無始無終，善向永續。',
            visualAssets: {
                baseIcon: 'default',
                auraEffect: 'aqua',
                rankBadge: 'lv1'
            },
            impactMetric: '0',
            isFrozen: false
        } as any;

        set({ avatar: defaultAvatar });
    }
}));
