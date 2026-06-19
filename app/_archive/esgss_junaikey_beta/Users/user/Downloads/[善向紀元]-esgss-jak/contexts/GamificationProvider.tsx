
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
    LifeEsgQuest, UserTitle, Badge, OfficialEvent, 
    UserTier, VocationType, UserJournalEntry 
} from '../types';
import { INITIAL_TITLES, INITIAL_BADGES, MOCK_EVENTS, VOCATIONS } from '../constants';

interface VocationState {
    type: VocationType;
    level: number;
    exp: number;
    nextLevelExp: number;
    perks: string[];
}

interface GamificationContextType {
    quests: LifeEsgQuest[];
    completeQuest: (id: string, xp: number) => void;
    xp: number;
    awardXp: (amount: number) => void;
    level: number;
    goodwillBalance: number;
    updateGoodwillBalance: (amount: number) => void;
    journal: UserJournalEntry[];
    addJournalEntry: (title: string, impact: string, xp: number, type: 'milestone' | 'action' | 'insight', tags: string[]) => void;
    collectedCards: string[];
    unlockCard: (id: string) => void;
    vocation: VocationState;
    activeTitle: UserTitle | null;
    ownedTitles: UserTitle[];
    setActiveTitle: (id: string) => void;
    socialFrequency: number;
    badges: Badge[];
    events: OfficialEvent[];
    activityPulse: { date: string, intensity: number }[];
    tier: UserTier;
    upgradeTier: (tier: UserTier) => void;
    purifyCard: (id: string) => void;
    updateCardMastery: (id: string, level: string) => void;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export const GamificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [quests, setQuests] = useState<LifeEsgQuest[]>([
        { id: 'l1', category: 'NetZero', title: '低碳交通實踐', enTitle: 'Eco Transport', impactDesc: '減少 2.5kg CO2e', xpReward: 120, gwcReward: 50, traitBonus: { trait: 'pragmatism', value: 2 }, status: 'ready', icon: null },
        { id: 'l2', category: 'NetZero', title: '自備餐具減塑', enTitle: 'Zero Waste', impactDesc: '減少 3 件塑料', xpReward: 80, gwcReward: 30, traitBonus: { trait: 'stability', value: 1 }, status: 'ready', icon: null },
    ]);
    
    const [xp, setXp] = useState(1250);
    const [goodwillBalance, setGoodwillBalance] = useState(2450);
    const [journal, setJournal] = useState<UserJournalEntry[]>([]);
    const [collectedCards, setCollectedCards] = useState<string[]>(['card-legend-001', 'relic-knowledge-base']);
    const [vocation, setVocation] = useState<VocationState>({ type: 'Architect', level: 3, exp: 1250, nextLevelExp: 2000, perks: ['Blueprint Gen', 'System View'] });
    const [ownedTitles, setOwnedTitles] = useState<UserTitle[]>(INITIAL_TITLES);
    const [activeTitle, setActiveTitleState] = useState<UserTitle | null>(INITIAL_TITLES[0]);
    const [tier, setTier] = useState<UserTier>('Pro');

    const socialFrequency = 78;
    const badges = INITIAL_BADGES;
    const events = MOCK_EVENTS;
    const activityPulse = Array.from({ length: 35 }).map((_, i) => ({
        date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
        intensity: Math.floor(Math.random() * 4)
    }));

    const level = Math.floor(xp / 1000) + 1;

    const awardXp = (amount: number) => {
        setXp(prev => prev + amount);
        setVocation(prev => ({ ...prev, exp: prev.exp + amount }));
    };

    const completeQuest = (id: string, xpReward: number) => {
        setQuests(prev => prev.map(q => q.id === id ? { ...q, status: 'completed' as const } : q));
        awardXp(xpReward);
    };

    const updateGoodwillBalance = (amount: number) => setGoodwillBalance(prev => prev + amount);

    const addJournalEntry = (title: string, impact: string, xpGained: number, type: 'milestone' | 'action' | 'insight', tags: string[]) => {
        const entry: UserJournalEntry = {
            id: `j-${Date.now()}`,
            title,
            impact,
            xpGained,
            timestamp: Date.now(),
            type,
            tags
        };
        setJournal(prev => [entry, ...prev]);
    };

    const unlockCard = (id: string) => {
        if (!collectedCards.includes(id)) {
            setCollectedCards(prev => [...prev, id]);
        }
    };

    const setActiveTitle = (id: string) => {
        const found = ownedTitles.find(t => t.id === id);
        if (found) setActiveTitleState(found);
    };

    const upgradeTier = (newTier: UserTier) => setTier(newTier);

    const purifyCard = (id: string) => { /* Logic to mark card as purified */ };
    const updateCardMastery = (id: string, level: string) => { /* Logic to update card mastery */ };

    const value: GamificationContextType = {
        quests, completeQuest, xp, awardXp, level, goodwillBalance, updateGoodwillBalance,
        journal, addJournalEntry, collectedCards, unlockCard,
        vocation, activeTitle, ownedTitles, setActiveTitle, socialFrequency, badges, events, activityPulse,
        tier, upgradeTier, purifyCard, updateCardMastery
    };

    return <GamificationContext.Provider value={value}>{children}</GamificationContext.Provider>;
};

export const useGamification = () => {
    const context = useContext(GamificationContext);
    if (!context) throw new Error('useGamification must be used within a GamificationProvider');
    return context;
};
