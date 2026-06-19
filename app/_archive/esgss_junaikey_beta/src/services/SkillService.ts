import { omniLogger, LogCategory } from './omniLogger.js';

export interface SkillShard {
    id: string;
    title: string;
    source: string;
    type: 'TECH' | 'ETHIC' | 'STRATEGY';
    rarity: 'COMMON' | 'RARE' | 'SOVEREIGN';
}

export interface MasterySkill {
    id: string;
    name: string;
    level: number;
    xp: number;
    nextLevelXp: number;
    unlocked: boolean;
    category: string;
}

class SkillService {
    private skills: MasterySkill[] = [
        { id: '1', name: '可追溯審計', level: 8, xp: 450, nextLevelXp: 1000, unlocked: true, category: '技術' },
        { id: '2', name: '利他邏輯', level: 5, xp: 200, nextLevelXp: 500, unlocked: true, category: '倫理' },
        { id: '3', name: '主權戰略', level: 3, xp: 120, nextLevelXp: 300, unlocked: true, category: '戰略' },
        { id: '4', name: '折射式 UI 設計', level: 1, xp: 0, nextLevelXp: 100, unlocked: false, category: '技術' },
        { id: '5', name: '[覺醒奧義] 奧秘圓通 (OmniCircle)', level: 1, xp: 0, nextLevelXp: 5000, unlocked: true, category: 'SOVEREIGN' },
    ];

    private shards: SkillShard[] = [
        { id: 's1', title: '碳透明度模式', source: '市場脈動 #AF32', type: 'TECH', rarity: 'RARE' },
        { id: 's2', title: '循環經濟迴路', source: '第 94 階段自審', type: 'STRATEGY', rarity: 'COMMON' },
        { id: 's3', title: '三位一體靈知 (Trinity Gnosis)', source: '三元相位同步', type: 'STRATEGY', rarity: 'SOVEREIGN' },
        { id: 's4', title: '神性倫理', source: '校準會議', type: 'ETHIC', rarity: 'SOVEREIGN' },
    ];

    public getSkills(): MasterySkill[] {
        return this.skills;
    }

    public getAvailableShards(): SkillShard[] {
        return this.shards;
    }

    public performAlchemy(shardIds: string[]): { success: boolean; newSkillId?: string; message: string } {
        omniLogger.info(LogCategory.SYSTEM, `🧪 [SkillAlchemy] Merging shards: ${shardIds.join(', ')}`);

        // Simple logic for prototype: if one is SOVEREIGN, unlock a new skill
        const hasSovereign = this.shards.some(s => shardIds.includes(s.id) && s.rarity === 'SOVEREIGN');

        if (hasSovereign) {
            const lockedSkill = this.skills.find(s => !s.unlocked);
            if (lockedSkill) {
                lockedSkill.unlocked = true;
                return { success: true, newSkillId: lockedSkill.id, message: `新技能已解鎖：${lockedSkill.name}` };
            }
        }

        return { success: true, message: "碎片已精煉為 XP。" };
    }
}

export const skillService = new SkillService();
