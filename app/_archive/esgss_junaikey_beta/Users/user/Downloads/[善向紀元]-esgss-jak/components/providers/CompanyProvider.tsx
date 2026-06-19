
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { 
    AgentTask, TaskStatus, TaskPriority, AuditLogEntry, WebhookConfig, 
    NoteItem, NoteLevel, AppFile, LifeEsgQuest, UserTitle, Badge, 
    OfficialEvent, UserTier, VocationType, UserJournalEntry
} from '../../types';
import { INITIAL_TITLES, INITIAL_BADGES, MOCK_EVENTS, VOCATIONS } from '../../constants';

interface EsgScores {
    environmental: number;
    social: number;
    governance: number;
}

interface VocationState {
    type: VocationType;
    level: number;
    exp: number;
    nextLevelExp: number;
    perks: string[];
}

interface CompanyContextType {
    companyName: string;
    setCompanyName: (name: string) => void;
    industrySector: string;
    setIndustrySector: (sector: string) => void;
    userName: string;
    setUserName: (name: string) => void;
    userRole: string;
    setUserRole: (role: string) => void;
    externalUrl: string;
    setExternalUrl: (url: string) => void;
    budget: number;
    setBudget: (budget: number) => void;
    carbonCredits: number;
    setCarbonCredits: (credits: number) => void;
    esgScores: EsgScores;
    totalScore: number;
    updateEsgScore: (category: keyof EsgScores, score: number) => void;
    resetData: () => void;
    
    // Audit & Logs
    addAuditLog: (action: string, details: string) => void;
    auditLogs: AuditLogEntry[];
    
    // External API
    externalApiKeys: { openai: string; straico: string; github: string };
    updateExternalApiKeys: (keys: Partial<{ openai: string; straico: string; github: string }>) => void;
    
    // Agent Tasks
    agentTasks: AgentTask[];
    addAgentTask: (task: Omit<AgentTask, 'id' | 'createdAt' | 'status' | 'progress'>) => void;
    updateAgentTaskStatus: (id: string, status: TaskStatus) => void;
    deleteAgentTask: (id: string) => void;
    
    // Webhooks
    webhooks: WebhookConfig[];
    addWebhook: (webhook: Omit<WebhookConfig, 'id'>) => void;
    deleteWebhook: (id: string) => void;
    updateWebhookStatus: (id: string, status: 'active' | 'inactive') => void;
    
    // Universal Notes
    universalNotes: NoteItem[];
    addNote: (content: string, tags: string[], title: string, manifested?: string, aiMetadata?: any, type?: string) => void;
    deleteNote: (id: string) => void;
    updateNote: (id: string, content: string, title?: string, tags?: string[], aiMetadata?: any) => void;
    
    // Files
    files: AppFile[];
    addFile: (file: File, category: string) => void;
    removeFile: (id: string) => void;
    
    // Gamification
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
    
    // Carbon Data
    carbonData: { fuelConsumption: number; electricityConsumption: number; scope1: number; scope2: number };
    updateCarbonData: (data: Partial<{ fuelConsumption: number; electricityConsumption: number }>) => void;
    
    language: 'zh-TW' | 'en-US'; // Just for context, though handled in App.tsx mainly
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [companyName, setCompanyName] = useState('ESG Sunshine');
    const [industrySector, setIndustrySector] = useState('Technology');
    const [userName, setUserName] = useState('Jun');
    const [userRole, setUserRole] = useState('Admin'); // Can be 'Admin', 'Partner', 'Agent', 'Parent'
    const [externalUrl, setExternalUrl] = useState('');
    const [budget, setBudget] = useState(1000000);
    const [carbonCredits, setCarbonCredits] = useState(5000);
    const [esgScores, setEsgScores] = useState<EsgScores>({ environmental: 78, social: 85, governance: 92 });
    
    const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
    const [externalApiKeys, setExternalApiKeys] = useState({ openai: '', straico: '', github: '' });
    
    const [agentTasks, setAgentTasks] = useState<AgentTask[]>([
        {
            id: 'task-kyc-001',
            title: 'Complete KYC Verification',
            description: 'Verify identity documents and background checks for new Tier 1 suppliers.',
            assigneeId: 'jun-ai-key',
            status: 'COMPLETED',
            progress: 100,
            createdAt: Date.now() - 86400000,
            dueDate: new Date().toISOString().split('T')[0],
            priority: TaskPriority.CRITICAL,
            locationId: 'tpe'
        },
        {
            id: 'task-sc-002',
            title: 'Analyze Supply Chain Data',
            description: 'Deep dive into Scope 3 emissions data from verified suppliers.',
            assigneeId: 'jun-ai-key',
            status: 'PENDING',
            progress: 0,
            createdAt: Date.now(),
            dueDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
            priority: TaskPriority.HIGH,
            locationId: 'tpe',
            dependencies: ['task-kyc-001']
        }
    ]);

    const [webhooks, setWebhooks] = useState<WebhookConfig[]>([]);
    const [universalNotes, setUniversalNotes] = useState<NoteItem[]>([]);
    const [files, setFiles] = useState<AppFile[]>([]);
    
    const [quests, setQuests] = useState<LifeEsgQuest[]>([
        { id: 'l1', category: 'NetZero', title: '低碳交通實踐', enTitle: 'Eco Transport', impactDesc: '減少 2.5kg CO2e', xpReward: 120, gwcReward: 50, traitBonus: { trait: 'pragmatism', value: 2 }, status: 'ready', icon: null }, // Icon handled in component
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
    const [carbonData, setCarbonDataState] = useState({ fuelConsumption: 1200, electricityConsumption: 45000, scope1: 125.4, scope2: 340.2 });

    // Dummy data for gamification stats
    const socialFrequency = 78;
    const badges = INITIAL_BADGES;
    const events = MOCK_EVENTS;
    const activityPulse = Array.from({ length: 35 }).map((_, i) => ({
        date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
        intensity: Math.floor(Math.random() * 4)
    }));

    const level = Math.floor(xp / 1000) + 1;
    const totalScore = Math.round((esgScores.environmental + esgScores.social + esgScores.governance) / 3);

    const updateEsgScore = (category: keyof EsgScores, score: number) => {
        setEsgScores(prev => ({ ...prev, [category]: score }));
    };

    const addAuditLog = (action: string, details: string) => {
        const newLog: AuditLogEntry = {
            id: `log-${Date.now()}`,
            timestamp: Date.now(),
            action,
            user: userName,
            details,
            hash: '0x' + Math.random().toString(16).substr(2, 8).toUpperCase()
        };
        setAuditLogs(prev => [newLog, ...prev]);
    };

    const updateExternalApiKeys = (keys: any) => {
        setExternalApiKeys(prev => ({ ...prev, ...keys }));
    };

    const addAgentTask = useCallback((task: Omit<AgentTask, 'id' | 'createdAt' | 'status' | 'progress'>) => {
        const newTask: AgentTask = {
            id: `task-${Date.now()}`,
            createdAt: Date.now(),
            status: 'PENDING',
            progress: 0,
            ...task
        };
        setAgentTasks(prev => [newTask, ...prev]);
    }, []);

    const updateAgentTaskStatus = (id: string, status: TaskStatus) => {
        setAgentTasks(prev => prev.map(t => t.id === id ? { ...t, status, progress: status === 'COMPLETED' ? 100 : t.progress } : t));
    };

    const deleteAgentTask = (id: string) => {
        setAgentTasks(prev => prev.filter(t => t.id !== id));
    };

    const addWebhook = (webhook: Omit<WebhookConfig, 'id'>) => {
        const newWebhook: WebhookConfig = {
            id: `wh-${Date.now()}`,
            ...webhook
        };
        setWebhooks(prev => [...prev, newWebhook]);
    };

    const deleteWebhook = (id: string) => setWebhooks(prev => prev.filter(w => w.id !== id));
    const updateWebhookStatus = (id: string, status: 'active' | 'inactive') => setWebhooks(prev => prev.map(w => w.id === id ? { ...w, status } : w));

    const addNote = (content: string, tags: string[], title: string, manifested?: string, aiMetadata?: any, type: string = 'Note') => {
        const newNote: NoteItem = {
            id: `note-${Date.now()}`,
            title: title || 'Untitled',
            content,
            timestamp: Date.now(),
            tags,
            level: 'L1', // Default
            aiMetadata,
            manifestedContent: manifested
        };
        setUniversalNotes(prev => [newNote, ...prev]);
    };

    const deleteNote = (id: string) => setUniversalNotes(prev => prev.filter(n => n.id !== id));
    const updateNote = (id: string, content: string, title?: string, tags?: string[], aiMetadata?: any) => {
        setUniversalNotes(prev => prev.map(n => n.id === id ? { ...n, content, title: title || n.title, tags: tags || n.tags, aiMetadata: aiMetadata || n.aiMetadata } : n));
    };

    const addFile = (file: File, category: string) => {
        const newFile: AppFile = {
            id: `file-${Date.now()}`,
            name: file.name,
            size: file.size,
            type: file.type,
            category,
            uploadedAt: Date.now(),
            url: URL.createObjectURL(file)
        };
        setFiles(prev => [newFile, ...prev]);
    };

    const removeFile = (id: string) => setFiles(prev => prev.filter(f => f.id !== id));

    const awardXp = (amount: number) => {
        setXp(prev => prev + amount);
        // Vocation logic could be here
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

    const purifyCard = (id: string) => {
        // Logic to mark card as purified (e.g. unlock advanced stats or visuals)
    };

    const updateCardMastery = (id: string, level: string) => {
        // Logic to update card mastery
    };

    const updateCarbonData = (data: Partial<{ fuelConsumption: number; electricityConsumption: number }>) => {
        setCarbonDataState(prev => {
            const next = { ...prev, ...data };
            // Simple recalculation logic
            const scope1 = next.fuelConsumption * 2.68 / 1000 * 1000; // Fake calc
            const scope2 = next.electricityConsumption * 0.502 / 1000;
            return { ...next, scope1, scope2 };
        });
    };

    const resetData = () => {
        setCompanyName('ESG Sunshine');
        setBudget(1000000);
        // ... reset other fields
    };

    const value: CompanyContextType = {
        companyName, setCompanyName, industrySector, setIndustrySector,
        userName, setUserName, userRole, setUserRole, externalUrl, setExternalUrl,
        budget, setBudget, carbonCredits, setCarbonCredits,
        esgScores, totalScore, updateEsgScore, resetData,
        addAuditLog, auditLogs, externalApiKeys, updateExternalApiKeys,
        agentTasks, addAgentTask, updateAgentTaskStatus, deleteAgentTask,
        webhooks, addWebhook, deleteWebhook, updateWebhookStatus,
        universalNotes, addNote, deleteNote, updateNote,
        files, addFile, removeFile,
        quests, completeQuest, xp, awardXp, level, goodwillBalance, updateGoodwillBalance,
        journal, addJournalEntry, collectedCards, unlockCard,
        vocation, activeTitle, ownedTitles, setActiveTitle, socialFrequency, badges, events, activityPulse,
        tier, upgradeTier, purifyCard, updateCardMastery,
        carbonData, updateCarbonData, language: 'zh-TW'
    };

    return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>;
};

export const useCompany = () => {
    const context = useContext(CompanyContext);
    if (!context) throw new Error('useCompany must be used within a CompanyProvider');
    return context;
};
