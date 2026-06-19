import { OmniOne } from './omni-one';
import { OmniCardData } from '../components/omni/cards/OmniCard';
import { LogCategory, omniLogger } from './omniLogger';
import { v4 as uuidv4 } from 'uuid';

export type GameMode = 'Gnosis' | 'Social' | 'Resilience' | 'Audit' | 'Efficiency' | 'Harmony';

export interface GameState {
    mode: GameMode;
    active: boolean;
    score: number;
    energy: number;
    difficulty: number;
    hand: OmniCardData[];
    deck: OmniCardData[];
    objectives: string[];
    history: any[];
}

/**
 * 🌀 OmniGameEngine: The heart of the Hexa-Virtue Card System.
 * Bridging gameplay with the 5T protocol and the Omni Singularity.
 */
export class OmniGameEngine {
    private static instance: OmniGameEngine;
    private state: GameState;

    private constructor() {
        this.state = this.getInitialState();
    }

    static getInstance(): OmniGameEngine {
        if (!OmniGameEngine.instance) {
            OmniGameEngine.instance = new OmniGameEngine();
        }
        return OmniGameEngine.instance;
    }

    private getInitialState(): GameState {
        return {
            mode: 'Gnosis',
            active: false,
            score: 0,
            energy: 100,
            difficulty: 1,
            hand: [],
            deck: [],
            objectives: [],
            history: []
        };
    }

    /** 🎮 Start a new game mode session */
    startSession(mode: GameMode, initialCards: OmniCardData[]) {
        omniLogger.info(LogCategory.SYSTEM, `OmniGame: Starting ${mode} Mode Session`);
        this.state = {
            ...this.getInitialState(),
            mode,
            active: true,
            deck: initialCards,
            hand: initialCards.slice(0, 5)
        };
        return this.state;
    }

    /** 🎴 Play a card and trigger mode-specific logic */
    async playCard(cardId: string): Promise<GameState> {
        const cardIndex = this.state.hand.findIndex(c => c.card_id === cardId);
        if (cardIndex === -1) throw new Error("Card not found in hand");

        const card = this.state.hand[cardIndex];
        this.state.hand.splice(cardIndex, 1);

        // Mode-specific logic (Hexa-Virtue)
        switch (this.state.mode) {
            case 'Gnosis': // Wisdom: Knowledge matching
                this.state.score += card.power_score * (card.card_type === 'Knowledge' ? 1.5 : 1);
                break;
            case 'Social': // Benevolence: S-Dimension focus
                this.state.score += card.power_score * (card.esg_dimension === 'S' ? 1.8 : 0.8);
                break;
            case 'Resilience': // Courage: Action/Risk mitigation
                this.state.score += card.power_score * (card.card_type === 'Action' ? 2 : 0.5);
                this.state.energy -= 10;
                break;
            case 'Audit': // Integrity: 5T Protocol
                this.state.score += 5; // Fixed small score, progression focused
                break;
            case 'Efficiency': // Efficiency: E-Dimension focus
                this.state.score += card.power_score * (card.esg_dimension === 'E' ? 1.5 : 1);
                this.state.energy -= 5;
                break;
            case 'Harmony': // Harmony: ESG Balance
                this.state.score += card.power_score;
                break;
        }

        // Auto-draw if deck has cards
        if (this.state.deck.length > this.state.hand.length + 1) {
            const nextCard = this.state.deck[this.state.hand.length + 1];
            this.state.hand.push(nextCard);
        }

        return this.state;
    }

    /** 🔒 Seal the session results into the 5T Ledger via OmniOne */
    async endSession(): Promise<any> {
        this.state.active = false;
        omniLogger.info(LogCategory.SYSTEM, `OmniGame: Ending Session. Final Score: ${this.state.score}`);

        // Manifest the game result as an Evidence Atom
        const resultAtom = await OmniOne.manifest({
            intent: `Game Result: ${this.state.mode}`,
            type: 'Accomplishment',
            domainRef: 'OmniGame_Nexus',
            payload: {
                mode: this.state.mode,
                score: this.state.score,
                timestamp: Date.now()
            }
        });

        return resultAtom;
    }

    getState(): GameState {
        return this.state;
    }
}
