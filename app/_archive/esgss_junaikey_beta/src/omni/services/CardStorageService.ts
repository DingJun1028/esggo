
import { OmniCard } from "@/types/aiPartner.ts";

import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger.ts';

const STORAGE_KEY = 'omni_deck_v1';

export class CardStorageService {

    /**
     * Load deck from local storage
     */
    public static loadDeck(): OmniCard[] {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            omniLogger.error(LogCategory.SYSTEM, '[CardStorageService] Failed to load deck', { error: e });
            return [];
        }
    }

    /**
     * Save card to deck
     */
    public static saveCard(card: OmniCard): void {
        const deck = this.loadDeck();
        // Avoid duplicates (mock logic: check by ID)
        if (!deck.some(c => c.id === card.id)) {
            deck.push(card);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(deck));
        }
    }

    /**
     * Equip a card (Unlock Service)
     */
    public static equipCard(cardId: string): boolean {
        const deck = this.loadDeck();
        const card = deck.find(c => c.id === cardId);
        if (card) {
            card.isEquipped = true;
            // Update storage
            localStorage.setItem(STORAGE_KEY, JSON.stringify(deck));
            return true;
        }
        return false;
    }

    /**
     * Get equipped cards
     */
    public static getEquippedCards(): OmniCard[] {
        return this.loadDeck().filter(c => c.isEquipped);
    }
}
