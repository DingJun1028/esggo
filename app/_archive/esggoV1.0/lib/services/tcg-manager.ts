import { useRPGStore, TCGCard } from '../stores/rpg-store';

export const TCG_IMAGE_MAP: Record<string, string> = {
    ENVIRONMENT: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=400',
    SOCIAL: 'https://images.unsplash.com/photo-1521791136064-7986c2923216?auto=format&fit=crop&q=80&w=400',
    ACTION: 'https://images.unsplash.com/photo-1454165833767-027ffea9e77b?auto=format&fit=crop&q=80&w=400',
    LEGACY: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=400',
};

export class TCGManager {
    static awardCardFromAudit(auditId: string, confidence: number, type: 'ENVIRONMENT' | 'SOCIAL' | 'GOV') {
        const store = useRPGStore.getState();

        // Map confidence to rarity
        let rarity: TCGCard['rarity'] = 'COMMON';
        if (confidence > 0.95) rarity = 'LEGENDARY';
        else if (confidence > 0.90) rarity = 'EPIC';
        else if (confidence > 0.80) rarity = 'RARE';

        // Map ESG type to TCG type
        const cardType: TCGCard['type'] = type === 'ENVIRONMENT' ? 'ENVIRONMENT' : type === 'SOCIAL' ? 'SOCIAL' : 'ACTION';

        const newCard: TCGCard = {
            id: `card_audit_${Date.now()}`,
            title: `${type} Integrity Seal`,
            type: cardType,
            rarity,
            image: TCG_IMAGE_MAP[cardType] || TCG_IMAGE_MAP.ACTION || '',
            timestamp: Date.now(),
            auditRef: auditId
        };

        store.addCard(newCard);
        store.addXP(500 * (rarity === 'LEGENDARY' ? 5 : rarity === 'EPIC' ? 3 : rarity === 'RARE' ? 2 : 1));

        return newCard;
    }

    static awardCardFromLearning(category: string, score: number) {
        const store = useRPGStore.getState();

        // 如果分數極高，加贈英雄碎片
        if (score >= 100) {
            // 隨機抽選一位英雄（目前以 Agent 名稱為主）
            const heroes = ['Audit Agent', 'OmniSphere', 'Carbon Scout'];
            const randomHero = heroes[Math.floor(Math.random() * heroes.length)] || 'Sovereign Hero';
            store.addFragments(randomHero, 2); // 每次滿分給 2 片
        }

        if (score < 80) return;

        const rarity: TCGCard['rarity'] = score >= 100 ? 'RARE' : 'COMMON';

        const newCard: TCGCard = {
            id: `card_learn_${Date.now()}`,
            title: `${category} 學習認證`,
            type: 'ACTION',
            rarity,
            image: TCG_IMAGE_MAP.ACTION || '',
            timestamp: Date.now()
        };

        store.addCard(newCard);
        store.gainKnowledge(score * 2);
        return newCard;
    }
}
