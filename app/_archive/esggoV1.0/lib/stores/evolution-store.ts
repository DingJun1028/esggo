import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SkillNode {
    id: string;
    name: string;
    level: number;
    maxLevel: number;
    description: string;
    category: 'individual' | 'collective' | 'domain';
    agent: string;
    unlocked: boolean;
    xp: number;
    xpToNextLevel: number;
}

interface EvolutionState {
    skills: SkillNode[];
    totalIntelligence: number;
    unlockedCount: number;
    awardXP: (agentName: string, amount: number) => void;
    unlockSkill: (skillId: string) => void;
}

export const useEvolutionStore = create<EvolutionState>()(
    persist(
        (set, get) => ({
            skills: [
                { id: 'logic-1', name: '5T 數據溯源分析', level: 9, maxLevel: 10, description: '追蹤數據源的數位指紋與完整性，確保符合 5T 協議標準。', category: 'individual', agent: 'OmniSphere', unlocked: true, xp: 850, xpToNextLevel: 1000 },
                { id: 'database-1', name: 'ESG 框架調研', level: 8, maxLevel: 10, description: '整合 GRI, SASB, TCFD 等多項國際永續框架的法規庫。', category: 'collective', agent: 'System-Wide', unlocked: true, xp: 700, xpToNextLevel: 1000 },
                { id: 'zkp-1', name: 'ZKP 隱私驗證', level: 10, maxLevel: 10, description: '透過零知識證明技術驗證數據真實性，而不洩露敏感私鑰。', category: 'collective', agent: 'System-Wide', unlocked: true, xp: 1000, xpToNextLevel: 1000 },
                { id: 'genkit-1', name: 'Genkit 代理流', level: 7, maxLevel: 10, description: '利用自動化 Agent 流生成高品質的永續報告初稿。', category: 'collective', agent: 'System-Wide', unlocked: true, xp: 400, xpToNextLevel: 1000 },
                { id: 'audit-1', name: '全方位合規審計', level: 6, maxLevel: 10, description: '針對 ISO 14064 進行數位化確信，符合 5T 合規標準。', category: 'individual', agent: 'Audit Agent', unlocked: true, xp: 200, xpToNextLevel: 1000 },
                { id: 'voice-1', name: '全域語音導師', level: 8, maxLevel: 10, description: '提供即時語音簡報與 AI 互動式的永續知識引導。', category: 'individual', agent: 'Briefing Agent', unlocked: true, xp: 600, xpToNextLevel: 1000 },
                { id: 'module-gri', name: 'GRI 合規矩陣', level: 9, maxLevel: 10, description: '深度解析 GRI 2024 標準，自動映射企業活動與揭露要求。', category: 'domain', agent: 'Expert Module', unlocked: true, xp: 900, xpToNextLevel: 1000 },
                { id: 'module-carbon', name: '溫室氣體盤查', level: 5, maxLevel: 10, description: '自動換算 Scope 1-3 碳排係數，並生成減碳路徑熱圖。', category: 'domain', agent: 'Expert Module', unlocked: true, xp: 300, xpToNextLevel: 1000 },
                { id: 'module-supply', name: '供應鏈追蹤', level: 3, maxLevel: 10, description: '穿透式追蹤供應商碳足跡與勞工人權風險。', category: 'domain', agent: 'Expert Module', unlocked: false, xp: 120, xpToNextLevel: 500 },
            ],
            totalIntelligence: 42,
            unlockedCount: 15,

            awardXP: (agentName, amount) => {
                set((state) => {
                    const newSkills = state.skills.map(s => {
                        if (s.agent === agentName || (agentName === "Collective" && s.category === "collective")) {
                            const newXP = s.xp + amount;
                            let newLevel = s.level;
                            if (newXP >= s.xpToNextLevel && s.level < s.maxLevel) {
                                newLevel += 1;
                                // 等級提升邏輯
                                return { ...s, xp: newXP - s.xpToNextLevel, level: newLevel, xpToNextLevel: s.xpToNextLevel * 1.2 };
                            }
                            return { ...s, xp: newXP };
                        }
                        return s;
                    });
                    return { skills: newSkills };
                });
            },

            unlockSkill: (skillId) => {
                set((state) => {
                    const newSkills = state.skills.map(s =>
                        s.id === skillId ? { ...s, unlocked: true } : s
                    );
                    return {
                        skills: newSkills,
                        unlockedCount: newSkills.filter(sk => sk.unlocked).length
                    };
                });
            }
        }),
        {
            name: 'evolution-storage',
        }
    )
);
