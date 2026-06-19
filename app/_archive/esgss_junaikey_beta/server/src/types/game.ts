/**
 * game.ts
 * 戰鬥系統共用類型定義
 */

export interface Card {
    id: string;
    card_code: string;
    name_tc: string;
    attack_power: number;
    defense_power: number;
    energy_cost: number;
    virtues: {
        intelligence: number;
        benevolence: number;
        integrity: number;
        courage: number;
        temperance: number;
        harmony: number;
    };
    abilities?: any[];
}

export interface Player {
    id: string;
    health: number;
    energy: number;
    hand: Card[];
    deck: Card[];
    field: Card[];
    graveyard: Card[];
    virtues: {
        intelligence: number;
        benevolence: number;
        integrity: number;
        courage: number;
        temperance: number;
        harmony: number;
    };
}

export interface BattleState {
    battleId: string;
    currentRound: number;
    currentTurn: 'player1' | 'player2';
    player1: Player;
    player2: Player;
    battleLog: Array<{
        round: number;
        action: string;
        details: any;
    }>;
    status: 'ONGOING' | 'FINISHED';
    winner?: string;
    battleType: 'PVE' | 'PVP' | 'RANKED' | 'TUTORIAL' | 'CHALLENGE';
    difficulty: 'EASY' | 'NORMAL' | 'HARD' | 'EXPERT' | 'MASTER';
}

export interface BattleAction {
    actionType: 'PLAY_CARD' | 'ATTACK' | 'DEFEND' | 'END_TURN';
    cardId?: string;
    target?: string;
    attackerId?: string;
}

export interface BattleConfig {
    player1Id: string;
    player2Id: string;
    deck1Id: string;
    deck2Id: string;
    battleType: 'PVE' | 'PVP' | 'RANKED' | 'TUTORIAL' | 'CHALLENGE';
    difficulty?: 'EASY' | 'NORMAL' | 'HARD' | 'EXPERT' | 'MASTER';
}
