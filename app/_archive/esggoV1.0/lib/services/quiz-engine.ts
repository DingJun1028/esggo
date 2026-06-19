import { retrieveKnowledge } from "./knowledge-base";
import { TCGManager } from "./tcg-manager";
import { useRPGStore } from "../stores/rpg-store";

export interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    answer: string;
    explanation: string;
    rewardXP: number;
}

export class QuizEngine {
    static async generateQuizzes(category: string = "Standards", count: number = 3): Promise<QuizQuestion[]> {
        const knowledge = await retrieveKnowledge(category, count);

        return knowledge.map(k => ({
            id: k.id,
            question: `關於「${k.title}」，下列何者描述正確？`,
            options: [
                k.content,
                "這是企業不需要遵守的非強制性口號。",
                "這項準則主要用於增加行政作業，無實質意義。",
                "這與 ESG (環境、社會、治理) 的核心概念無關。"
            ].sort(() => Math.random() - 0.5),
            answer: k.content,
            explanation: `依據 ${k.source}，${k.title} 是指：${k.content.substring(0, 50)}...`,
            rewardXP: 100
        }));
    }

    static handleQuizCompletion(score: number, category: string) {
        const store = useRPGStore.getState();

        // 知識點增長
        store.gainKnowledge(score);

        // 如果滿分，額外獎勵卡片
        if (score >= 100) {
            TCGManager.awardCardFromLearning(category, score);
        }

        return {
            xpGained: score,
            knowledgeGained: score * 1.5,
            perfect: score >= 100
        };
    }
}
