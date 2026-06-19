import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserAvatarProfile } from '@/types/user';
import { PlayerState, BattleHistory, PersonalityProfile, ITrinityGameResponse } from '@/types/game';
import { STORAGE_KEYS } from '@/constants/app';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';
import { VillageState, Building } from '@/types/game';
import { SystemVital } from '@/types/system';

export type VillageZone = 'HUT' | 'GUILD' | 'WILD' | 'ALTAR' | 'SOVEREIGN' | 'SWARM';

interface OmniContextType {
    playerState: PlayerState | null;
    avatarProfile: UserAvatarProfile | null;
    villageState: VillageState | null;
    systemVitals: SystemVital | null; // 🌟 Awakening
    isLoading: boolean;
    isDevMode: boolean;
    lastTrinityResult: ITrinityGameResponse | null;
    updatePlayerState: (updates: Partial<PlayerState>) => void;
    updateVillageState: (updates: Partial<VillageState>) => void;
    toggleDevMode: () => void;
    syncDigitalTwin: () => void;
    recordBattleResult: (win: boolean, xpEarned: number, context?: any) => void;
    sealSacredContract: (contractData: any) => void;
    clearLastResult: () => void;
}

const OmniContext = createContext<OmniContextType | undefined>(undefined);

export const useOmniContext = () => {
    const context = useContext(OmniContext);
    if (context === undefined) {
        throw new Error('useOmniContext must be used within an OmniProvider');
    }
    return context;
};

// Default Village State Factory
const createInitialVillageState = (): VillageState => {
    return {
        entropy: 15, // Initial entropy
        level: 1,
        reputation: 100,
        lastActionTime: Date.now(),
        buildings: [
            { id: 'hut', name: 'Alchemist Hut', level: 1, unlocked: true, description: 'Your base of operations' },
            { id: 'guild', name: 'Mission Guild', level: 1, unlocked: true, description: 'Take on contracts' },
            { id: 'altar', name: 'Truth Altar', level: 0, unlocked: false, description: 'Verify knowledge' }
        ]
    };
};

// Default Player State Factory
const createInitialPlayerState = (profile: UserAvatarProfile): PlayerState => {
    return {
        id: profile.id || 'unknown',
        level: profile.level || 1,
        xp: 0,
        xpToNext: 1000,
        title: profile.archetype === 'analyst' ? '初級分析師 (Junior Analyst)' : '永續實踐者',
        intimacy: 50,
        personalityProfile: {
            environmental: 50,
            social: 50,
            governance: 50,
            innovation: 50
        },
        deck: ['card-001', 'card-002', 'card-003', 'card-005'],
        learnedStrategies: ['card-001', 'card-002', 'card-003', 'card-005', 'card-006'], // card-004 is locked
        battleHistory: {
            wins: 0,
            losses: 0,
            streak: 0,
            totalDamage: 0,
            enemiesDefeated: []
        },
        certificates: [] // Initial empty certificates
    };
};

export const OmniProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [playerState, setPlayerState] = useState<PlayerState | null>(null);
    const [avatarProfile, setAvatarProfile] = useState<UserAvatarProfile | null>(null);
    const [villageState, setVillageState] = useState<VillageState | null>(null);
    const [lastTrinityResult, setLastTrinityResult] = useState<ITrinityGameResponse | null>(null);
    const [systemVitals, setSystemVitals] = useState<SystemVital | null>(null); // 🌟 Awakening
    const [isDevMode, setIsDevMode] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Load from LocalStorage on mount
    useEffect(() => {
        const loadState = () => {
            try {
                const storedProfile = localStorage.getItem(STORAGE_KEYS.USER_AVATAR_DATA);
                if (storedProfile) {
                    const parsedProfile: UserAvatarProfile = JSON.parse(storedProfile);
                    setAvatarProfile(parsedProfile);

                    // Player State
                    const storedPlayerState = localStorage.getItem('omni_player_state');
                    if (storedPlayerState) {
                        setPlayerState(JSON.parse(storedPlayerState));
                    } else {
                        const initialState = createInitialPlayerState(parsedProfile);
                        setPlayerState(initialState);
                        localStorage.setItem('omni_player_state', JSON.stringify(initialState));
                    }

                    // Village State
                    const storedVillageState = localStorage.getItem('omni_village_state');
                    if (storedVillageState) {
                        setVillageState(JSON.parse(storedVillageState));
                    } else {
                        const initialVillage = createInitialVillageState();
                        setVillageState(initialVillage);
                        localStorage.setItem('omni_village_state', JSON.stringify(initialVillage));
                    }
                }
            } catch (error) {
                omniLogger.error(LogCategory.SYSTEM, 'Failed to load OmniContext state', { error });
            } finally {
                setIsLoading(false);
            }
        };

        loadState();
    }, []);

    const updatePlayerState = (updates: Partial<PlayerState>) => {
        setPlayerState(prev => {
            if (!prev) return null;
            const newState = { ...prev, ...updates };
            localStorage.setItem('omni_player_state', JSON.stringify(newState));
            return newState;
        });
    };

    const updateVillageState = (updates: Partial<VillageState>) => {
        setVillageState(prev => {
            if (!prev) return null;
            const newState = { ...prev, ...updates };
            localStorage.setItem('omni_village_state', JSON.stringify(newState));
            return newState;
        });
    };



    const toggleDevMode = () => setIsDevMode(prev => !prev);

    // 🌟 Awakening: Poll System Vitals
    useEffect(() => {
        const fetchVitals = async () => {
            try {
                const response = await fetch('/api/omni/health/detailed');
                if (response.ok) {
                    const responseData = await response.json();

                    if (responseData.success && responseData.data) {
                        const healthData = responseData.data.health;
                        const cacheData = responseData.data.cache;

                        // Transform API response to SystemVital
                        const vitals: SystemVital = {
                            status: healthData.overall === 'HEALTHY' ? 'healthy' : healthData.overall === 'DEGRADED' ? 'degraded' : 'unhealthy',
                            integrityScore: healthData.integrityStatus === 'SECURE' ? 100 : 50,
                            resonance: healthData.overall === 'HEALTHY' ? 'HARMONIC' : 'DISSONANT',
                            redis: {
                                memoryUsage: cacheData?.used_memory || 0,
                                fragmentation: cacheData?.fragmentation_ratio || 0,
                                hitRate: cacheData?.hitRate || 0.95,
                                connected: cacheData?.mode !== 'standalone' // simplified check
                            },
                            uptime: process.uptime?.() || 0,
                            latency: responseData.data.performance?.responseTime || 0
                        };
                        setSystemVitals(vitals);
                    }
                }
            } catch (error) {
                // Silent fail for vitals to not disrupt UX
                console.warn('[SystemAwakening] Failed to sense system vitals', error);
            }
        };

        const interval = setInterval(fetchVitals, 10000); // Pulse every 10s
        fetchVitals(); // Initial pulse

        return () => clearInterval(interval);
    }, []);

    const syncDigitalTwin = () => {
        omniLogger.info(LogCategory.NETWORK, 'Syncing Digital Twin...');

        // Generate a Trinity-aligned sync result
        const syncResult: ITrinityGameResponse = {
            info_one: {
                transaction_id: `sync-${Date.now()}`,
                type: 'digital_twin_sync',
                timestamp: Date.now(),
                overview: {
                    summary: 'Digital Twin Synchronized across Omni-Link.',
                    primary_gain: { type: 'Consistency', value: '100%' },
                    resonance_delta: 0.5
                },
                detail: {
                    actions: [{ name: 'State Alignment', impact: 1 }, { name: 'Context Refresh', impact: 1 }],
                    efficiency_score: 98,
                    raw_metrics: { syncTime: '45ms', objectsProcessed: 12 }
                },
                extension: {
                    evolutionary_gain: 'Structural stability improved. Ready for high-resonance operations.',
                    next_steps: ['Check Mission Matrix for new opportunities', 'Resonate in the Soul Chamber'],
                    metadata: {}
                }
            }
        };
        setLastTrinityResult(syncResult);
    };

    const clearLastResult = () => setLastTrinityResult(null);

    const recordBattleResult = (win: boolean, xpEarned: number, battleContext?: any) => {
        // 1. Update Player
        setPlayerState(prev => {
            if (!prev) return null;

            const newHistory = { ...prev.battleHistory };
            newHistory.wins += win ? 1 : 0;
            newHistory.losses += win ? 0 : 1;
            newHistory.streak = win ? newHistory.streak + 1 : 0;

            const newState = {
                ...prev,
                xp: prev.xp + xpEarned,
                battleHistory: newHistory
            };

            // Check level up (simple logic)
            if (newState.xp >= newState.xpToNext) {
                newState.level += 1;
                newState.xp -= newState.xpToNext;
                newState.xpToNext = Math.floor(newState.xpToNext * 1.5);
            }

            localStorage.setItem('omni_player_state', JSON.stringify(newState));
            return newState;
        });

        // 2. Update Village (Entropy Reduction on Win)
        if (win) {
            setVillageState(prev => {
                if (!prev) return null;
                // Reduce entropy by 5% on win, min 0
                const newEntropy = Math.max(0, prev.entropy - 5);
                const newState = { ...prev, entropy: newEntropy };
                localStorage.setItem('omni_village_state', JSON.stringify(newState));
                return newState;
            });
        }

        // 3. Generate Trinity Result
        const result: ITrinityGameResponse = {
            info_one: {
                transaction_id: `battle-${Date.now()}`,
                type: 'battle_result',
                timestamp: Date.now(),
                overview: {
                    summary: win ? 'Resonance Victory achieved against Entity.' : 'Tactical Retreat executed.',
                    primary_gain: { type: 'XP', value: xpEarned },
                    resonance_delta: win ? 2.5 : -1.0
                },
                detail: {
                    actions: battleContext?.actions || [],
                    efficiency_score: win ? 85 : 40,
                    raw_metrics: { damageDealt: battleContext?.damage || 0, turns: battleContext?.turns || 1 }
                },
                extension: {
                    evolutionary_gain: win ? 'New knowledge pattern synthesized from enemy frequencies.' : 'Rethink strategy to overcome resonance dissonance.',
                    next_steps: win ? ['Upgrade cards', 'Purify next node'] : ['Train in training grounds', 'Check weaknesses'],
                    metadata: {}
                }
            }
        };
        setLastTrinityResult(result);
    };

    const sealSacredContract = (contractData: any) => {
        const result: ITrinityGameResponse = {
            info_one: {
                transaction_id: `TXN-${Date.now()}`,
                type: 'contract_sealed',
                timestamp: Date.now(),
                overview: {
                    summary: `Sacred Covenant Sealed: ${contractData.contractId}`,
                    primary_gain: { type: 'Trust', value: 'Immutable' },
                    resonance_delta: 15
                },
                detail: {
                    actions: contractData.strategies.map((s: string) => ({ name: s, impact: 100 })),
                    efficiency_score: 100,
                    raw_metrics: {
                        xp_committed: contractData.totalXP,
                        hash: contractData.hash
                    }
                },
                extension: {
                    evolutionary_gain: "Digital Sovereignty Established",
                    next_steps: ["Download Certificate", "Anchor to Blockchain", "Share Achievements"],
                    metadata: { contractId: contractData.contractId }
                }
            }
        };
        setLastTrinityResult(result);

        // Add certificate to player state
        if (playerState) {
            updatePlayerState({
                certificates: [
                    ...playerState.certificates,
                    {
                        id: contractData.contractId,
                        title: "ESG Mastery Certificate",
                        earnedAt: new Date().toISOString().substring(0, 10),
                        hash: contractData.hash,
                        verified: true
                    }
                ]
            });
        }
    };

    return (
        <OmniContext.Provider value={{
            playerState,
            avatarProfile,
            villageState,
            isLoading,
            isDevMode,
            updatePlayerState,
            updateVillageState,
            toggleDevMode,
            systemVitals, // 🌟 Awakening
            syncDigitalTwin,
            recordBattleResult,
            sealSacredContract,
            lastTrinityResult,
            clearLastResult
        }}>
            {children}
        </OmniContext.Provider>
    );
};
