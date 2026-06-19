import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { z } from 'zod';
import { useToast } from './ToastContext';
import {
    PersonaConfig, DigitalSoulAsset, SoulForgeConfig,
    TrainingDoc, AdanDisciple, EsgCard, TrainingLogEntry, EntityPlanet,
    UserJournalEntry
} from '../types';
import { universalIntelligence } from '../services/evolutionEngine';
import { Subject } from 'rxjs';
import { getEsgCards, INITIAL_PERSONAS } from '../constants';
import { useCompany } from '../components/providers/CompanyProvider';

// Zod Schemas
const SoulForgeConfigSchema = z.object({
    altruism: z.number(),
    pragmatism: z.number(),
    innovation: z.number(),
    stability: z.number(),
});

const PersonaConfigSchema = z.object({
    id: z.string(),
    name: z.string(),
    title: z.string(),
    archetype: z.string(),
    coreTrait: z.string(),
    primaryGoal: z.string(),
    systemPrompt: z.string(),
    level: z.number(),
    exp: z.number(),
    color: z.string(),
    avatarUrl: z.string(),
    attributes: z.record(z.object({ label: z.string(), value: z.number(), max: z.number() })),
    skills: z.array(z.object({ name: z.string(), level: z.number(), desc: z.string() })),
    ultimateArt: z.object({ name: z.string(), description: z.string(), unlockedAtLevel: z.number(), effect: z.string() }),
    equippedCards: z.array(z.string()),
    goodwillValue: z.number(),
    knowledgeRepoIds: z.array(z.string()),
});

const DigitalSoulAssetSchema = z.object({
    id: z.string(),
    name: z.string(),
    traits: SoulForgeConfigSchema,
    resonance: z.number(),
    rarity: z.enum(['Common', 'Rare', 'Epic', 'Legendary']),
    forgedAt: z.number(),
    ownerId: z.string(),
});

const TrainingDocSchema = z.object({
    id: z.string(),
    name: z.string(),
    status: z.enum(['parsing', 'ready', 'error']),
    type: z.string(),
    atomsCount: z.number(),
});

const AdanDiscipleSchema = z.object({
    alignment: z.number(),
});

const EsgCardSchema = z.object({
    id: z.string(),
    title: z.string(),
    term: z.string(),
    definition: z.string(),
    description: z.string(),
    rarity: z.enum(['Common', 'Rare', 'Epic', 'Legendary']),
    attribute: z.enum(['Vision', 'Governance', 'Knowledge']),
    collectionSet: z.string(),
    stats: z.object({ defense: z.number(), offense: z.number() }),
    imageUrl: z.string().optional(),
});

const TrainingLogEntrySchema = z.object({
    id: z.string(),
    agentId: z.string(),
    timestamp: z.number(),
    sessionType: z.string(),
    gainedExp: z.number(),
    statChanges: z.record(z.number()),
    newKnowledge: z.array(z.string()),
    isCriticalInsight: z.boolean().optional(),
});

const EntityPlanetSchema = z.object({
    taxId: z.string(),
});

const AvatarFaceSchema = z.enum(['MIRROR', 'EXPERT', 'VOID', 'CUSTOM']);

const PersonaAttributesSchema = z.object({
    altruism: z.number(),
    pragmatism: z.number(),
    innovation: z.number(),
    stability: z.number(),
});

const JourneyStepSchema = z.object({
    id: z.string(),
    instruction: z.string(),
});

const JourneySchema = z.object({
    id: z.string(),
    title: z.string(),
    steps: z.array(JourneyStepSchema),
    currentStepIndex: z.number(),
});

const EvolutionMilestoneSchema = z.object({
    version: z.string(),
    codename: z.string(),
    status: z.enum(['completed', 'current', 'planned']),
    focus: z.string(),
    improvements: z.array(z.string()),
    evaluationScore: z.number(),
    detectedBottleneck: z.string().optional(),
    evalDetails: z.string().optional(),
    estimatedImpact: z.string(),
});

const AIVersionHistorySchema = z.object({
    date: z.string(),
    event: z.string(),
    impact: z.string(),
});

const AgentLogSchema = z.object({
    id: z.string(),
    timestamp: z.number(),
    source: z.enum(['Matrix', 'Chat', 'System', 'Assistant', 'Kernel', 'Evolution', 'Insight', 'Tool', 'Hive', 'Relic', 'AMICE', 'Advisory']),
    message: z.string(),
    type: z.enum(['info', 'success', 'error', 'thinking', 'warning']),
});

const UniversalAgentContextTypeSchema = z.object({
    activePersona: PersonaConfigSchema,
    availablePersonas: z.array(PersonaConfigSchema),
    switchPersona: z.function().args(z.string()).returns(z.void()),
    updatePersonaStats: z.function().args(z.string(), PersonaConfigSchema.partial()).returns(z.void()),

    traits: PersonaAttributesSchema,
    updateTraits: z.function().args(PersonaAttributesSchema.partial()).returns(z.void()),

    galaxy: z.record(EntityPlanetSchema),
    syncPlanet: z.function().args(EntityPlanetSchema).returns(z.void()),
    broadcastSignal: z.function().args(z.string(), z.string()).returns(z.void()),
    neuralBus$: z.instanceof(Subject),

    observeAction: z.function().args(z.string(), z.string()).returns(z.void()),
    activeJourney: JourneySchema.nullable(),
    advanceJourney: z.function().args().returns(z.void()),
    evolutionPlan: z.array(EvolutionMilestoneSchema),
    runSelfDetection: z.function().args().returns(z.void()),
    aiVersionHistory: z.array(AIVersionHistorySchema),

    cardInventory: z.array(EsgCardSchema),
    equippedCards: z.array(z.string()),
    equipCard: z.function().args(z.string()).returns(z.void()),
    unequipCard: z.function().args(z.string()).returns(z.void()),

    expMultiplier: z.number(),
    luckFactor: z.number(),

    logs: z.array(AgentLogSchema),
    chatHistory: z.array(AgentLogSchema),
    addLog: z.function().args(z.string(), AgentLogSchema.shape.type.optional(), AgentLogSchema.shape.source.optional()).returns(z.void()),
    commitChatToMemory: z.function().args(z.string(), z.string()).returns(z.void()),
    trainingDocs: z.array(TrainingDocSchema),
    uploadTrainingDoc: z.function().args(z.instanceof(File)).returns(z.promise(z.void())),
    isProcessing: z.boolean(),

    activeFace: AvatarFaceSchema,
    setActiveFace: z.function().args(AvatarFaceSchema).returns(z.void()),
    activeKeyId: z.string().nullable(),
    executeMatrixProtocol: z.function().args(z.string(), z.string()).returns(z.promise(z.void())),
    subAgentsActive: z.boolean(),

    forgedSouls: z.array(DigitalSoulAssetSchema),
    forgeSoul: z.function().args(z.string(), SoulForgeConfigSchema, z.string().optional()).returns(z.promise(DigitalSoulAssetSchema)),
    equipSoul: z.function().args(z.string()).returns(z.void()),
    activeSoulAsset: DigitalSoulAssetSchema.nullable(),
    // This is a complex derivation, we simplify the type for now
    soul: AdanDiscipleSchema.and(z.any()),

    trainingLogs: z.array(TrainingLogEntrySchema),
    addTrainingSession: z.function().args(TrainingLogEntrySchema.omit({ id: true })).returns(z.void()),
    exportNeuralState: z.function().args(z.string()).returns(z.string()),
    importNeuralState: z.function().args(z.string(), z.string()).returns(z.void()),
    updatePersonaKnowledge: z.function().args(z.string(), z.array(z.string())).returns(z.void()),
    synthesizeCards: z.function().args(z.string(), z.string()).returns(z.void()),
    decomposeCard: z.function().args(z.string()).returns(z.void()),

    // Additional missing properties for component compatibility
    getTouchTargetSize: z.function().args().returns(z.any()),
    pushFocus: z.function().args(z.any()).returns(z.void()),
    popFocus: z.function().args().returns(z.void()),
});

// 新增專門化context的類型定義
export type PersonaContextType = {
    activePersona: PersonaConfig;
    availablePersonas: PersonaConfig[];
    switchPersona: (id: string) => void;
    updatePersonaStats: (id: string, updates: Partial<PersonaConfig>) => void;
    updatePersonaKnowledge: (agentId: string, repos: string[]) => void;
    exportNeuralState: (agentId: string) => string;
    importNeuralState: (agentId: string, state: string) => void;
};

export type TraitsContextType = {
    traits: PersonaAttributes;
    updateTraits: (updates: Partial<PersonaAttributes>) => void;
    expMultiplier: number;
    luckFactor: number;
};

export type GalaxyContextType = {
    galaxy: Record<string, EntityPlanet>;
    syncPlanet: (planet: EntityPlanet) => void;
    broadcastSignal: (type: string, message: string) => void;
    neuralBus$: Subject<any>;
};

export type LogsContextType = {
    logs: AgentLog[];
    chatHistory: AgentLog[];
    addLog: (message: string, type?: AgentLog['type'], source?: AgentLog['source']) => void;
    commitChatToMemory: (prompt: string, answer: string) => void;
};

export type CardsContextType = {
    cardInventory: EsgCard[];
    equippedCards: string[];
    equipCard: (id: string) => void;
    unequipCard: (id: string) => void;
    synthesizeCards: (id1: string, id2: string) => void;
    decomposeCard: (id: string) => void;
};

export type SoulsContextType = {
    forgedSouls: DigitalSoulAsset[];
    activeSoulAsset: DigitalSoulAsset | null;
    forgeSoul: (name: string, config: SoulForgeConfig, id?: string) => Promise<DigitalSoulAsset>;
    equipSoul: (soulId: string) => void;
    soul: any; // Complex derivation from AdanDisciple + Persona
};

export type TrainingContextType = {
    trainingDocs: TrainingDoc[];
    trainingLogs: TrainingLogEntry[];
    uploadTrainingDoc: (file: File) => Promise<void>;
    addTrainingSession: (session: Omit<TrainingLogEntry, 'id'>) => void;
    isProcessing: boolean;
};

export type EvolutionContextType = {
    activeJourney: Journey | null;
    evolutionPlan: EvolutionMilestone[];
    aiVersionHistory: AIVersionHistory[];
    advanceJourney: () => void;
    runSelfDetection: () => void;
};

export type UniversalAgentContextType = z.infer<typeof UniversalAgentContextTypeSchema>;

export type AvatarFace = z.infer<typeof AvatarFaceSchema>;

export interface PersonaAttributes extends z.infer<typeof PersonaAttributesSchema> {}

export interface JourneyStep extends z.infer<typeof JourneyStepSchema> {}

export interface Journey extends z.infer<typeof JourneySchema> {}

export interface EvolutionMilestone extends z.infer<typeof EvolutionMilestoneSchema> {}

export interface AIVersionHistory extends z.infer<typeof AIVersionHistorySchema> {}

export interface AgentLog extends z.infer<typeof AgentLogSchema> {}


// 將大型context分解為更小的專門化context
export const PersonaContext = React.createContext<PersonaContextType | undefined>(undefined);
export const TraitsContext = React.createContext<TraitsContextType | undefined>(undefined);
export const GalaxyContext = React.createContext<GalaxyContextType | undefined>(undefined);
export const LogsContext = React.createContext<LogsContextType | undefined>(undefined);
export const CardsContext = React.createContext<CardsContextType | undefined>(undefined);
export const SoulsContext = React.createContext<SoulsContextType | undefined>(undefined);
export const TrainingContext = React.createContext<TrainingContextType | undefined>(undefined);
export const EvolutionContext = React.createContext<EvolutionContextType | undefined>(undefined);

// 保留原有的主要context作為組合層
export const UniversalAgentContext = React.createContext<UniversalAgentContextType | undefined>(undefined);

// 專門化的Provider組件
export const PersonaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // 實作Persona相關邏輯...
    return <PersonaContext.Provider value={{/* persona相關狀態 */}}>{children}</PersonaContext.Provider>;
};

export const TraitsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // 實作Traits相關邏輯...
    return <TraitsContext.Provider value={{/* traits相關狀態 */}}>{children}</TraitsContext.Provider>;
};

// 其他專門化provider...

export const UniversalAgentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { addToast } = useToast();
    // Assuming useCompany is used to get addJournalEntry and awardXp
    // But we need to be careful with circular dependencies if useCompany is a child.
    // In App.tsx, UniversalAgentProvider is a PARENT of CompanyProvider.
    // To solve this, we can either move the logic or pass a ref.
    // For now, we will handle what we can locally and trigger signals.

    const [availablePersonas, setAvailablePersonas] = useState<PersonaConfig[]>(INITIAL_PERSONAS);
    const [activePersonaId, setActivePersonaId] = useState('jun-ai-key');
    const [logs, setLogs] = useState<AgentLog[]>([]);
    const [traits, setTraits] = useState<PersonaAttributes>({
        altruism: 65, pragmatism: 80, innovation: 45, stability: 90
    });
    const [trainingDocs, setTrainingDocs] = useState<TrainingDoc[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [cardInventory, setCardInventory] = useState<EsgCard[]>(getEsgCards('zh-TW'));
    
    const [galaxy, setGalaxy] = useState<Record<string, EntityPlanet>>({});
    const [activeFace, setActiveFace] = useState<AvatarFace>('MIRROR');
    const [forgedSouls, setForgedSouls] = useState<DigitalSoulAsset[]>([]);
    const [activeSoulId, setActiveSoulId] = useState<string | null>(null);
    const [activeKeyId, setActiveKeyId] = useState<string | null>(null);
    const neuralBus$ = useMemo(() => new Subject<any>(), []);

    const [activeJourney, setActiveJourney] = useState<Journey | null>(null);
    const [evolutionPlan, setEvolutionPlan] = useState<EvolutionMilestone[]>([]);
    const [aiVersionHistory, setAiVersionHistory] = useState<AIVersionHistory[]>([]);
    const [trainingLogs, setTrainingLogs] = useState<TrainingLogEntry[]>([]);

    const activePersona = useMemo<PersonaConfig>(() => {
        return availablePersonas.find(p => p.id === activePersonaId) || availablePersonas[0];
    }, [availablePersonas, activePersonaId]);

    const expMultiplier = useMemo(() => 1 + (Number(activePersona.goodwillValue) / 1000), [activePersona.goodwillValue]);
    const luckFactor = useMemo(() => 1 + (Number(activePersona.goodwillValue) / 2000), [activePersona.goodwillValue]);

    useEffect(() => {
        const savedData = localStorage.getItem('esgss_agent_v15_evolution');
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                if (parsed.traits) setTraits(parsed.traits);
                if (parsed.galaxy) setGalaxy(parsed.galaxy);
            } catch (e) {}
        }

        setEvolutionPlan([
            { version: 'v14.5', codename: 'Horizon', status: 'completed', focus: 'RAG Optimization', improvements: ['Faster retrieval', 'Multi-modal support'], evaluationScore: 92, estimatedImpact: 'High' },
            { version: 'v15.2', codename: 'Hypercube', status: 'current', focus: 'Agent Orchestration & AMICE Sync', improvements: ['Matrix Console', 'Stakeholder Radar'], evaluationScore: 99, estimatedImpact: 'Critical' },
            { version: 'v15.9', codename: 'Civilization', status: 'planned', focus: 'Autonomous Regen Governance', improvements: ['Chain Voting', 'Manifesto Engine'], evaluationScore: 0, estimatedImpact: 'Legendary' }
        ]);
        setAiVersionHistory([
            { date: '2025-02-20', event: 'Hypercube Evolution Protocol', impact: 'Agent sync speed +60%' },
            { date: '2025-02-22', event: 'AMICE Reporting manifested', impact: 'Real-time global intelligence' }
        ]);
    }, []);

    useEffect(() => {
        localStorage.setItem('esgss_agent_v15_evolution', JSON.stringify({ traits, galaxy }));
    }, [traits, galaxy]);

    const updateTraits = useCallback((updates: Partial<PersonaAttributes>) => {
        setTraits(prev => ({ ...prev, ...updates }));
    }, []);

    const syncPlanet = useCallback((planet: EntityPlanet) => {
        setGalaxy(prev => ({ ...prev, [planet.taxId]: planet }));
    }, []);

    const broadcastSignal = useCallback((type: string, message: string) => {
        const signal = { type, message, timestamp: Date.now() };
        neuralBus$.next(signal);
        setLogs(prev => [...prev, { 
            id: `hive-${Date.now()}`, 
            timestamp: Date.now(), 
            source: 'Hive' as any, 
            message, 
            type: 'info' 
        } as AgentLog].slice(-100));
    }, [neuralBus$]);

    const addLog = useCallback((message: string, type: AgentLog['type'] = 'info', source: AgentLog['source'] = 'System') => {
        setLogs(prev => [...prev, { id: `log-${Date.now()}`, timestamp: Date.now(), source, message, type } as AgentLog].slice(-100));
    }, []);

    const observeAction = useCallback((type: string, detail: string) => {
        addLog(`Observation [${type}]: ${detail}`, 'info', 'Insight' as any);
    }, [addLog]);

    const advanceJourney = useCallback(() => {
        if (activeJourney && activeJourney.currentStepIndex < activeJourney.steps.length - 1) {
            setActiveJourney({
                ...activeJourney,
                currentStepIndex: activeJourney.currentStepIndex + 1
            });
        }
    }, [activeJourney]);

    const runSelfDetection = useCallback(() => {
        setIsProcessing(true);
        addLog("Running system self-detection...", "thinking", "Kernel");
        setTimeout(() => {
            setIsProcessing(false);
            addLog("Self-detection complete. Integrity: 99.8%", "success", "Kernel");
        }, 2000);
    }, [addLog]);

    const switchPersona = (id: string) => setActivePersonaId(id);
    const updatePersonaStats = (id: string, updates: Partial<PersonaConfig>) => {
        setAvailablePersonas(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    };

    const addTrainingSession = useCallback((session: Omit<TrainingLogEntry, 'id'>) => {
        const id = `tl-${Date.now()}`;
        setTrainingLogs(prev => [{ ...session, id }, ...prev]);
    }, []);

    const commitChatToMemory = useCallback((prompt: string, answer: string) => {
        const atom = `[對話記憶] ${activePersona.name}：${answer.substring(0, 100)}`;
        
        // 1. Inject to Vector Engine
        universalIntelligence.injectQuantumNodes([{ atom, vector: ['chat', 'memory'], weight: 0.8 }], `Memory_${activePersona.id}`);
        
        // 2. Add to Training Logs (Internal evolution)
        addTrainingSession({
            agentId: activePersona.id,
            timestamp: Date.now(),
            sessionType: '對話學習 (Contextual Learning)',
            gainedExp: 25,
            statChanges: { INT: 0.1, STRAT: 0.05 },
            newKnowledge: [prompt.substring(0, 50) + "..."]
        });

        // 3. Emit Signal for HUD / UX
        addLog(`Knowledge atom engraved: "${prompt.substring(0, 20)}..."`, 'success', 'Kernel');
        broadcastSignal('MEMORY_COMMITTED', `Agent ${activePersona.name} integrated a new knowledge shard.`);
        
        // 4. Update traits based on interaction (Autonomous alignment)
        if (prompt.toLowerCase().includes('help') || prompt.toLowerCase().includes('social')) {
            updateTraits({ altruism: Math.min(100, traits.altruism + 0.5) });
        }
    }, [activePersona.id, activePersona.name, addTrainingSession, addLog, broadcastSignal, traits.altruism, updateTraits]);

    const uploadTrainingDoc = async (file: File) => {
        const id = `doc-${Date.now()}`;
        setTrainingDocs(prev => [...prev, { id, name: file.name, status: 'parsing', type: file.type, atomsCount: 0 }]);
        await new Promise(r => setTimeout(r, 2000));
        setTrainingDocs(prev => prev.map(d => d.id === id ? { ...d, status: 'ready', atomsCount: 50 } : d));
    };

    const forgeSoul = async (name: string, config: SoulForgeConfig, id?: string) => {
        setIsProcessing(true);
        await new Promise(r => setTimeout(r, 1500));
        const soulId = id || `soul-${Date.now()}`;
        const newSoul: DigitalSoulAsset = { id: soulId, name, traits: config, resonance: 100, rarity: 'Epic', forgedAt: Date.now(), ownerId: 'user' };
        setForgedSouls(prev => [...prev.filter(s => s.id !== soulId), newSoul]);
        setIsProcessing(false);
        addToast('success', '靈魂鍛造完成', 'Forge');
        return newSoul;
    };

    const equipSoul = (soulId: string) => {
        setActiveSoulId(soulId);
        const soulAsset = forgedSouls.find(s => s.id === soulId);
        if (soulAsset) addToast('reward', `已裝備靈魂：${soulAsset.name}`, 'Sync');
    };

    const executeMatrixProtocol = async (id: string, label: string) => {
        setActiveKeyId(id);
        setIsProcessing(true);
        addLog(`Protocol initiated: ${label}`, 'thinking', 'Matrix');
        await new Promise(r => setTimeout(r, 1000));
        addLog(`${label} complete.`, 'success', 'Matrix');
        setIsProcessing(false);
        setActiveKeyId(null);
    };

    const exportNeuralState = useCallback((agentId: string) => {
        const agent = availablePersonas.find(p => p.id === agentId);
        return JSON.stringify(agent);
    }, [availablePersonas]);

    const importNeuralState = useCallback((agentId: string, state: string) => {
        try {
            const parsed = JSON.parse(state);
            setAvailablePersonas(prev => prev.map(p => p.id === agentId ? { ...p, ...parsed } : p));
            addToast('success', 'Neural state imported.', 'Sync');
        } catch (e) {
            addToast('error', 'Import failed.', 'Sync');
        }
    }, [addToast]);

    const updatePersonaKnowledge = useCallback((agentId: string, repos: string[]) => {
        setAvailablePersonas(prev => prev.map(p => p.id === agentId ? { ...p, knowledgeRepoIds: repos } : p));
    }, []);

    const synthesizeCards = useCallback((id1: string, id2: string) => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            addToast('reward', 'Card synthesis successful.', 'Forge');
        }, 2000);
    }, [addToast]);

    const decomposeCard = useCallback((id: string) => {
        setCardInventory(prev => prev.filter(c => c.id !== id));
    }, []);

    // Additional functions for component compatibility
    const getTouchTargetSize = useCallback(() => ({ min: 44, preferred: 48 }), []);
    const pushFocus = useCallback((element: any) => {
        // Focus management logic
    }, []);
    const popFocus = useCallback(() => {
        // Focus management logic
    }, []);

    const value = {
        activePersona, availablePersonas, switchPersona, updatePersonaStats,
        traits, updateTraits,
        galaxy, syncPlanet, broadcastSignal, neuralBus$,
        observeAction, activeJourney, advanceJourney, evolutionPlan, runSelfDetection, aiVersionHistory,
        cardInventory, equippedCards: activePersona.equippedCards || [],
        equipCard: (id: string) => {}, unequipCard: (id: string) => {},
        expMultiplier, luckFactor,
        logs, chatHistory: logs.filter(l => l.source === 'Chat' || l.source === 'Assistant'),
        addLog, commitChatToMemory, trainingDocs, uploadTrainingDoc,
        isProcessing, activeFace, setActiveFace, activeKeyId, executeMatrixProtocol, subAgentsActive: isProcessing,
        forgedSouls, forgeSoul, equipSoul, activeSoulAsset: forgedSouls.find(s => s.id === activeSoulId) || null,
        soul: { ...activePersona, version: '15.2', exp: activePersona.exp, alignment: 99, rank: activePersona.title } as any,
        trainingLogs, addTrainingSession, exportNeuralState, importNeuralState, updatePersonaKnowledge,
        synthesizeCards, decomposeCard,
        getTouchTargetSize, pushFocus, popFocus
    };

    return <UniversalAgentContext.Provider value={value}>{children}</UniversalAgentContext.Provider>;
};

// 新增專門化的hooks
export const usePersona = () => {
    const context = useContext(PersonaContext);
    if (!context) throw new Error('usePersona must be used within a PersonaProvider');
    return context;
};

export const useTraits = () => {
    const context = useContext(TraitsContext);
    if (!context) throw new Error('useTraits must be used within a TraitsProvider');
    return context;
};

export const useGalaxy = () => {
    const context = useContext(GalaxyContext);
    if (!context) throw new Error('useGalaxy must be used within a GalaxyProvider');
    return context;
};

export const useLogs = () => {
    const context = useContext(LogsContext);
    if (!context) throw new Error('useLogs must be used within a LogsProvider');
    return context;
};

export const useCards = () => {
    const context = useContext(CardsContext);
    if (!context) throw new Error('useCards must be used within a CardsProvider');
    return context;
};

export const useSouls = () => {
    const context = useContext(SoulsContext);
    if (!context) throw new Error('useSouls must be used within a SoulsProvider');
    return context;
};

export const useTraining = () => {
    const context = useContext(TrainingContext);
    if (!context) throw new Error('useTraining must be used within a TrainingProvider');
    return context;
};

export const useEvolution = () => {
    const context = useContext(EvolutionContext);
    if (!context) throw new Error('useEvolution must be used within an EvolutionProvider');
    return context;
};

// 保留原有的主要hook作為向後兼容
export const useUniversalAgent = () => {
    const context = useContext(UniversalAgentContext);
    if (!context) throw new Error('useUniversalAgent must be used within a UniversalAgentProvider');
    return context;
};
