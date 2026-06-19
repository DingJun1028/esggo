/**
 * GoodwardVillageService.ts
 * ----------------------------
 * 善向永續村核心服務：遊戲化 ESG 實踐
 */

export interface VillageStats {
    level: number;
    population: number;
    environmentScore: number;
    happiness: number;
    totalCo2Saved: number;
}

export interface Building {
    id: string;
    name: string;
    type: 'Eco' | 'Social' | 'Governance';
    level: number;
    unlocked: boolean;
    buff: string;
}

export interface KnowledgeCard {
    id: string;
    name: string;
    rarity: 'Common' | 'Rare' | 'Epic' | 'Trustworthy';
    power: number;
    attribute: 'Wisdom' | 'Benevolence' | 'Courage' | 'Integrity' | 'Temperance' | 'Harmony';
    dataLink: string; // 連結回 5T 原始數據
}

export class GoodwardVillageService {
    private static instance: GoodwardVillageService;

    static getInstance(): GoodwardVillageService {
        if (!GoodwardVillageService.instance) {
            GoodwardVillageService.instance = new GoodwardVillageService();
        }
        return GoodwardVillageService.instance;
    }

    /**
     * 獲取村莊現狀
     */
    async getVillageState(userId: string): Promise<{ stats: VillageStats, buildings: Building[] }> {
        return {
            stats: {
                level: 5,
                population: 120,
                environmentScore: 780,
                happiness: 85,
                totalCo2Saved: 2500
            },
            buildings: [
                { id: 'b-001', name: '太陽能發電站', type: 'Eco', level: 3, unlocked: true, buff: '環境分數 +10%' },
                { id: 'b-002', name: '職能培訓中心', type: 'Social', level: 2, unlocked: true, buff: '人口成長 +5%' },
                { id: 'b-003', name: '誠信議事廳', type: 'Governance', level: 1, unlocked: false, buff: '合規獎勵 +15%' }
            ]
        };
    }

    /**
     * 知識卡牌合成 (Synthesis)
     * 將碎片化的學習成果結晶化為遊戲資產
     */
    synthesizeCard(evidenceHash: string, attribute: KnowledgeCard['attribute']): KnowledgeCard {
        // 基於證據雜湊與屬性生成卡牌
        return {
            id: `card-${Math.random().toString(36).substr(2, 9)}`,
            name: `${attribute} 之結晶`,
            rarity: 'Rare',
            power: Math.floor(Math.random() * 50) + 50,
            attribute,
            dataLink: evidenceHash
        };
    }

    /**
     * 進化檢查：判定村莊是否能升級
     */
    checkEvolution(stats: VillageStats): { canEvolve: boolean; requirement?: string } {
        if (stats.environmentScore >= 1000 && stats.happiness >= 90) {
            return { canEvolve: true };
        }
        return {
            canEvolve: false,
            requirement: `需要環境分數 ${1000 - stats.environmentScore} 點與滿意度 ${90 - stats.happiness}%`
        };
    }
}

export const goodwardVillageService = GoodwardVillageService.getInstance();
