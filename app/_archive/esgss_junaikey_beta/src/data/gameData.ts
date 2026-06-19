import { ESGCard, Enemy } from '@/types/game';

// 敵人類型定義
export const ENEMIES: Record<string, Enemy> = {
    carbon: {
        id: 'carbon-lord',
        name: '高碳排魔王',
        title: 'Lord of Carbon',
        type: 'environment',
        health: 100,
        maxHealth: 100,
        attack: 15,
        defense: 5,
        description: '散發著二氧化碳黑煙的巨型魔王',
        weakness: ['renewable', 'carbon-capture'],
        avatar: '🔥'
    },
    pollution: {
        id: 'pollution-beast',
        name: '資源浪費獸',
        title: 'Resource Waste Beast',
        type: 'environment',
        health: 80,
        maxHealth: 80,
        attack: 12,
        defense: 8,
        description: '吞噬各種資源的可怕怪獸',
        weakness: ['circular-economy', 'recycling'],
        avatar: '🐉'
    },
    labor: {
        id: 'labor-ghost',
        name: '血汗工廠怪',
        title: 'Sweatshop Spirit',
        type: 'social',
        health: 90,
        maxHealth: 90,
        attack: 18,
        defense: 3,
        description: '被困在惡劣工作環境中的幽靈',
        weakness: ['fair-labor', 'human-rights'],
        avatar: '👻'
    },
    governance: {
        id: 'transparency-dragon',
        name: '黑箱治理龍',
        title: 'Opacity Dragon',
        type: 'governance',
        health: 120,
        maxHealth: 120,
        attack: 10,
        defense: 15,
        description: '盤踞在黑暗中的巨龍',
        weakness: ['transparency', 'audit'],
        avatar: '🐲'
    }
};

// 可用卡牌
export const AVAILABLE_CARDS: ESGCard[] = [
    {
        id: 'card-001',
        name: '循環水系統',
        type: 'strategy',
        category: 'environment',
        power: 25,
        cost: 3,
        effect: '減少水資源浪費',
        description: '建立封閉式水循環系統，減少 80% 取水量',
        rarity: 'rare',
        weaknessTarget: ['pollution'],
        isoReference: 'ISO-14046'
    },
    {
        id: 'card-002',
        name: '演算法造林',
        type: 'strategy',
        category: 'environment',
        power: 30,
        cost: 4,
        effect: '碳吸收增加',
        description: '結合 AI 優化植栽計劃，提升碳匯效率',
        rarity: 'epic',
        weaknessTarget: ['carbon'],
        isoReference: 'ISO-14064-1'
    },
    {
        id: 'card-003',
        name: '公平貿易',
        type: 'strategy',
        category: 'social',
        power: 28,
        cost: 3,
        effect: '供應商合規',
        description: '確保供應鏈符合國際勞工標準',
        rarity: 'rare',
        weaknessTarget: ['labor'],
        isoReference: 'SA8000'
    },
    {
        id: 'card-004',
        name: '碳捕捉協議',
        type: 'strategy',
        category: 'environment',
        power: 35,
        cost: 5,
        effect: '直接減碳',
        description: '與工業夥伴實施碳捕集與封存',
        rarity: 'legendary',
        weaknessTarget: ['carbon'],
        isoReference: 'ISO-14067'
    },
    {
        id: 'card-005',
        name: '透明供應鏈',
        type: 'strategy',
        category: 'governance',
        power: 22,
        cost: 2,
        effect: '可追溯性',
        description: '建立區塊鏈溯源系統',
        rarity: 'uncommon',
        weaknessTarget: ['governance'],
        isoReference: 'ISO-20400'
    },
    {
        id: 'card-006',
        name: '零幻覺驗算',
        type: 'strategy',
        category: 'governance',
        power: 30,
        cost: 4,
        effect: '數據真實性',
        description: '第三方獨立碳排放審計',
        rarity: 'epic',
        weaknessTarget: ['governance'],
        isoReference: 'ISO-14064-3'
    }
];
