import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface VillageBuilding {
    id: string;
    type: 'ECO' | 'SOCIAL' | 'GOV';
    level: number;
    name: string;
    description: string;
    isLocked: boolean;
}

export interface TCGCard {
    id: string;
    title: string;
    type: 'ACTION' | 'SOCIAL' | 'ENVIRONMENT' | 'LEGACY';
    rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
    image: string;
    timestamp: number;
    auditRef?: string;
}

export interface SkillNode {
    id: string;
    name: string;
    level: number;
    unlocked: boolean;
    requirements: { xp: number; skills?: string[] };
}

export interface Quest {
    id: string;
    title: string;
    description: string;
    target: number;
    progress: number;
    isCompleted: boolean;
    reward: {
        xp: number;
        fragments?: { id: string; amount: number };
    };
}

interface RPGState {
    villageLevel: number;
    influence: number;
    villageXP: number;
    stats: {
        environment: number;
        social: number;
        governance: number;
    };
    buildings: VillageBuilding[];
    inventory: TCGCard[];
    energy: number;
    maxEnergy: number;
    knowledgeXP: number;
    streak: number;
    lastCheckIn: string | null;
    fragments: Record<string, number>;
    FRAGMENTS_NEEDED: number;
    quests: Quest[];
    skills: Record<string, SkillNode>;
    esgCards: any[];
    currentChapter: number;
    storyProgress: number;
    aiMasterMessage: string;
    unlockedModes: string[];
    isConsoleOpen: boolean;
    goodnessCoins: number;
    proofLogs: string[];
    lastClaimTimestamp: number;
    unlockedCards: string[];
    zenZeroMode: boolean;
    sovereigntyScore: number;
    entropy: number;
    networkDensity: number;

    // Actions
    addXP: (amount: number) => void;
    addInfluence: (amount: number) => void;
    updateStat: (category: 'environment' | 'social' | 'governance', amount: number) => void;
    addCard: (card: TCGCard) => void;
    addESGCard: (card: any) => void;
    unlockSkill: (id: string) => boolean;
    syncExternalEvents: () => void;
    addFragments: (id: string, amount: number) => void;
    claimIdleCoins: () => void;
    addProofLog: (log: string | string[]) => void;
    exchangeHero: (id: string) => boolean;
    consumeEnergy: (amount: number) => boolean;
    gainKnowledge: (xp: number) => void;
    checkIn: () => void;
    upgradeBuilding: (id: string) => void;
    updateQuestProgress: (id: string, amount: number) => void;
    setChapter: (chapter: number) => void;
    nextStoryStep: () => void;
    unlockMode: (mode: string) => void;
    setIsConsoleOpen: (open: boolean) => void;
    unlockCard: (id: string) => void;
    toggleZenZero: () => void;
    addSovereigntyScore: (amount: number) => void;
}

export const useRPGStore = create<RPGState>()(
    persist(
        (set, get) => ({
            villageLevel: 1,
            influence: 100,
            villageXP: 0,
            stats: {
                environment: 100,
                social: 100,
                governance: 100,
            },
            buildings: [
                { id: 'solar_farm', type: 'ECO', level: 1, name: 'Solar Farm Array', description: 'Harnesses sunlight for the village.', isLocked: false },
                { id: 'water_purifier', type: 'ECO', level: 0, name: 'Water Filtration Tank', description: 'Ensures crystal clear river water.', isLocked: true },
                { id: 'school', type: 'SOCIAL', level: 1, name: 'Sustainability Academy', description: 'Educating the next generation.', isLocked: false },
                { id: 'audit_temple', type: 'GOV', level: 0, name: 'Temple of 5T Integrity', description: 'Where audits are sealed and immortalized.', isLocked: true },
            ],
            inventory: [],
            energy: 100,
            maxEnergy: 100,
            knowledgeXP: 0,
            streak: 0,
            lastCheckIn: null,
            fragments: {},
            FRAGMENTS_NEEDED: 20,
            quests: [
                {
                    id: 'sc_detective',
                    title: '供應鏈偵探 (Supply Chain Detective)',
                    description: '在地圖上識別並稽核 3 個高風險供應商。',
                    target: 3,
                    progress: 0,
                    isCompleted: false,
                    reward: { xp: 500, fragments: { id: 'OmniSphere', amount: 5 } }
                }
            ],
            skills: {
                'supply_chain_detective': { id: 'supply_chain_detective', name: '供應鏈偵探', level: 1, unlocked: true, requirements: { xp: 0 } },
                'carbon_footprint_expert': { id: 'carbon_footprint_expert', name: '碳足跡專家', level: 0, unlocked: false, requirements: { xp: 1000, skills: ['supply_chain_detective'] } },
                'sovereign_auditor': { id: 'sovereign_auditor', name: '主權稽核官', level: 0, unlocked: false, requirements: { xp: 2500, skills: ['carbon_footprint_expert'] } }
            },
            esgCards: [],
            currentChapter: 1,
            storyProgress: 0,
            aiMasterMessage: "Greetings, Sovereign Walker. Our journey begins.",
            unlockedModes: ["STORY"],
            isConsoleOpen: false,
            goodnessCoins: 1000,
            proofLogs: ["System Initialized.", "Wait for external events..."],
            lastClaimTimestamp: Date.now(),
            unlockedCards: [],
            zenZeroMode: false,
            sovereigntyScore: 0,
            entropy: 100,
            networkDensity: 12,

            addXP: (amount) => {
                const { villageLevel, villageXP } = get();
                let newXP = villageXP + amount;
                let newLevel = villageLevel;
                const xpNeeded = villageLevel * 1000;

                if (newXP >= xpNeeded) {
                    newLevel += 1;
                    newXP -= xpNeeded;
                }
                set({ villageLevel: newLevel, villageXP: newXP });
            },

            addInfluence: (amount) => set((state) => ({ influence: state.influence + amount })),

            updateStat: (category, amount) => set((state) => ({
                stats: { ...state.stats, [category]: Math.min(1000, state.stats[category] + amount) }
            })),

            addCard: (card) => set((state) => ({
                inventory: [card, ...state.inventory].slice(0, 50)
            })),

            addESGCard: (card) => {
                const { unlockedCards } = get();
                if (!unlockedCards.includes(card.id)) {
                    set((state) => ({
                        esgCards: [card, ...state.esgCards].slice(0, 52),
                        unlockedCards: [...state.unlockedCards, card.id]
                    }));
                    get().addSovereigntyScore(50);
                }
            },

            unlockSkill: (id) => {
                const { skills, knowledgeXP, addXP } = get();
                const node = skills[id];
                if (!node || node.unlocked) return false;
                if (knowledgeXP < node.requirements.xp) return false;

                if (node.requirements.skills) {
                    const allMet = node.requirements.skills.every(sid => skills[sid]?.unlocked);
                    if (!allMet) return false;
                }

                set((state) => ({
                    skills: {
                        ...state.skills,
                        [id]: { ...node, unlocked: true, level: 1 }
                    },
                    entropy: Math.max(0, state.entropy - 5),
                    networkDensity: Math.min(100, state.networkDensity + 2)
                }));

                addXP(200);
                return true;
            },

            syncExternalEvents: () => {
                const { addProofLog, currentChapter } = get();

                const reward = 250;
                set((state) => ({
                    goodnessCoins: state.goodnessCoins + reward,
                    quests: state.quests.map(q => ({
                        ...q,
                        progress: Math.min(q.target, q.progress + 1)
                    })),
                    storyProgress: Math.min(100, state.storyProgress + 10)
                }));

                addProofLog([
                    `[SYNC] Successfully reconciled 5T Protocol.`,
                    `[STORY] Resonance with Chapter ${currentChapter} increased.`
                ]);

                if (get().storyProgress >= 100) {
                    get().nextStoryStep();
                }
            },

            addFragments: (id, amount) => set((state) => ({
                fragments: {
                    ...state.fragments,
                    [id]: (state.fragments[id] || 0) + amount
                }
            })),

            claimIdleCoins: () => {
                const now = Date.now();
                const diff = now - get().lastClaimTimestamp;
                const minutes = Math.floor(diff / 60000);

                if (minutes < 1) return;

                const baseRate = 0.5;
                const earnings = Math.floor(minutes * baseRate * get().villageLevel);

                set((state) => ({
                    goodnessCoins: Math.floor(state.goodnessCoins + earnings),
                    lastClaimTimestamp: now
                }));

                get().addProofLog(`[ECONOMY] Claimed ${earnings} Goodness Coins for ${minutes} mins activities.`);
            },

            setChapter: (chapter) => set({ currentChapter: chapter, storyProgress: 0 }),

            nextStoryStep: () => {
                const nextChapter = get().currentChapter + 1;
                if (nextChapter <= 12) {
                    set({ currentChapter: nextChapter, storyProgress: 0 });
                    get().addProofLog(`[EPIC] Chapter ${nextChapter} Unlocked: Sovereign Insight Grew.`);
                }
            },

            unlockMode: (mode) => set((state) => ({
                unlockedModes: [...state.unlockedModes, mode],
                proofLogs: [`[HIDDEN] Mode Unlocked: ${mode}`, ...state.proofLogs]
            })),

            setIsConsoleOpen: (open) => set({ isConsoleOpen: open }),

            unlockCard: (id) => set((state) => ({
                unlockedCards: state.unlockedCards.includes(id) ? state.unlockedCards : [...state.unlockedCards, id]
            })),

            toggleZenZero: () => set((state) => ({
                zenZeroMode: !state.zenZeroMode,
                proofLogs: [`[MODE] Zen Zero Mode ${!state.zenZeroMode ? 'Activated' : 'Deactivated'}`, ...state.proofLogs]
            })),

            addSovereigntyScore: (amount) => set((state) => ({ sovereigntyScore: state.sovereigntyScore + amount })),

            addProofLog: (log) => {
                const newLogs = Array.isArray(log) ? log : [log];
                set((state) => ({
                    proofLogs: [...newLogs, ...state.proofLogs].slice(0, 50)
                }));
            },

            exchangeHero: (id) => {
                const { fragments, FRAGMENTS_NEEDED, addCard } = get();
                const count = fragments[id] || 0;
                if (count < FRAGMENTS_NEEDED) return false;

                set((state) => ({
                    fragments: {
                        ...state.fragments,
                        [id]: (state.fragments[id] || 0) - FRAGMENTS_NEEDED
                    }
                }));

                addCard({
                    id: `hero_${id}_${Date.now()}`,
                    title: `${id} (英雄重臨)`,
                    type: 'LEGACY',
                    rarity: 'LEGENDARY',
                    image: 'https://images.unsplash.com/photo-1559526323-cb2f2fe2591b?auto=format&fit=crop&q=80&w=400',
                    timestamp: Date.now()
                });

                return true;
            },

            consumeEnergy: (amount) => {
                const { energy } = get();
                if (energy < amount) return false;
                set({ energy: energy - amount });
                return true;
            },

            gainKnowledge: (xp) => {
                set((state) => ({ knowledgeXP: state.knowledgeXP + xp }));
                get().addXP(xp / 2);
            },

            checkIn: () => {
                const now = new Date().toISOString().split('T')[0];
                const last = get().lastCheckIn;
                if (last === now) return;

                set((state) => ({
                    streak: (state.streak || 0) + 1,
                    lastCheckIn: now,
                    energy: state.maxEnergy || 100
                }) as Partial<RPGState>);
            },

            upgradeBuilding: (id) => set((state) => ({
                buildings: state.buildings.map(b => b.id === id ? { ...b, level: b.level + 1, isLocked: false } : b)
            })),

            updateQuestProgress: (id, amount) => {
                const { quests, addXP, addFragments } = get();
                const updatedQuests = quests.map(q => {
                    if (q.id === id && !q.isCompleted) {
                        const newProgress = Math.min(q.target, q.progress + amount);
                        const isNowCompleted = newProgress >= q.target;
                        if (isNowCompleted) {
                            addXP(q.reward.xp);
                            if (q.reward.fragments) {
                                addFragments(q.reward.fragments.id, q.reward.fragments.amount);
                            }
                        }
                        return { ...q, progress: newProgress, isCompleted: isNowCompleted };
                    }
                    return q;
                });
                set({ quests: updatedQuests });
            },
        }),
        { name: 'zen-village-storage' }
    )
);
