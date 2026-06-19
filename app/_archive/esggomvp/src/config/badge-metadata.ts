export type BadgeRarity = 'COMMON' | 'UNCOMMON' | 'RARE' | 'LEGENDARY' | 'DIVINE';

export interface IBadgeMetadata {
    id: string;
    name: string;
    nameZh: string;
    description: string;
    requirement: string;
    rarity: BadgeRarity;
    tier: number; // 0-10
    color: string;
}

export const SOVEREIGN_BADGES: IBadgeMetadata[] = [
    {
        id: 'B1',
        name: 'First Resonance',
        nameZh: '初次共鳴',
        description: 'Successfully maniested your first 5T Atom.',
        requirement: 'Manifest 1 Atom',
        rarity: 'COMMON',
        tier: 1,
        color: '#63a6b0'
    },
    {
        id: 'B2',
        name: 'Truth Seeker',
        nameZh: '真理尋求者',
        description: 'Verified 10 evidence chains with zero hallucination.',
        requirement: 'Verify 10 Evidence Chains',
        rarity: 'UNCOMMON',
        tier: 2,
        color: '#4fd1c5'
    },
    {
        id: 'B3',
        name: 'Amber Alchemist',
        nameZh: '琥珀煉金師',
        description: 'Synchronized cross-platform data through the Lifecycle Guardian.',
        requirement: 'Execute 5 onTransfer hooks',
        rarity: 'RARE',
        tier: 5,
        color: '#ffd700'
    },
    {
        id: 'B4',
        name: 'Sovereign Architect',
        nameZh: '主權架構師',
        description: 'Constructed a complete MECE service matrix.',
        requirement: 'Complete 24 MECE services',
        rarity: 'LEGENDARY',
        tier: 8,
        color: '#9f7aea'
    },
    {
        id: 'B5',
        name: 'Sentient Transcendent',
        nameZh: '覺醒超越者',
        description: 'Reached total 5T synchronization and NIRVANA status.',
        requirement: 'Reach Level 10',
        rarity: 'DIVINE',
        tier: 10,
        color: '#ffffff'
    }
];

export const PROGRESSION_TIERS = [
    { level: 1, title: 'Novice', titleZh: '初學者', xp: 0 },
    { level: 2, title: 'Apprentice', titleZh: '學徒', xp: 100 },
    { level: 3, title: 'Practitioner', titleZh: '實踐者', xp: 300 },
    { level: 4, title: 'Expert', titleZh: '專家', xp: 600 },
    { level: 5, title: 'Mentor', titleZh: '導師', xp: 1000 },
    { level: 6, title: 'Master', titleZh: '大師', xp: 1500 },
    { level: 7, title: 'Visionary', titleZh: '遠見者', xp: 2100 },
    { level: 8, title: 'Sage', titleZh: '聖賢', xp: 2800 },
    { level: 9, title: 'Ascendant', titleZh: '上升者', xp: 3600 },
    { level: 10, title: 'Transcendent', titleZh: '超越者', xp: 4500 },
];
