
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOmniContext } from '@/omni/context/OmniContext';
import DigitalTwin from '@/components/game/DigitalTwin';
import { agencyManager, MissionObjective } from '@/services/AgencyManager';
import {
    IKnowledgeCard,
    CardCategory,
    CardRank,
    IEvidence,
    LogicGateStatus
} from '@/types/game';
import { SmartNotificationSystemUI } from '@/components/services/agency/SmartNotificationSystemUI';
import {
    ShieldCheck,
    Bell,
    Map,
    Scroll,
    Home,
    Zap,
    Database,
    Activity,
    Lock,
    Play,
    CheckCircle,
    Search,
    FileText,
    Hexagon,
    User,
    Box,
    ArrowUp,
    ArrowDown,
    ArrowLeft,
    ArrowRight,
    Globe
} from 'lucide-react';

import SovereignLedgerView from '@/components/village/SovereignLedgerView';
import SwarmMonitor from '@/components/village/SwarmMonitor';
import { sovereignVaultService } from '@/services/SovereignVaultService';
import SwarmConsensusService from '@/services/SwarmConsensusService';

// 🗺️ 村莊區域定義 (Village Zones) Moved to OmniContext
import { VillageZone } from '@/omni/context/OmniContext';

// 🗺️ 村莊區域等級要求 (Zone Requirements)
const ZONE_REQUIREMENTS: Record<VillageZone, number> = {
    'HUT': 1,
    'GUILD': 2,
    'WILD': 3,
    'ALTAR': 4,
    'SOVEREIGN': 5,
    'SWARM': 6
};

// 區域位置配置 (Grid: 3x3)
const ZONE_POSITIONS: Record<VillageZone, { row: number; col: number }> = {
    'HUT': { row: 0, col: 0 },      // 左上
    'GUILD': { row: 0, col: 2 },    // 右上
    'WILD': { row: 2, col: 1 },     // 下中
    'ALTAR': { row: 1, col: 1 },    // 中間
    'SOVEREIGN': { row: 0, col: 1 }, // 上中
    'SWARM': { row: 1, col: 2 }      // 右中
};

// 🏛️ 知識卡片資料庫 (The Knowledge Ledger)
// This serves as the source of truth for all available cards.
const KNOWLEDGE_DATABASE: IKnowledgeCard[] = [
    {
        uuid: 'ESG-E-001', name: 'Scope 1 Emissions', category: 'E', rank: 'Common',
        description: 'Direct greenhouse gas emissions from sources required.', status: 'Trustworthy', isSealed: true, visual_theme: 'Emerald', evidence: { hash_lock: 'GENESIS_HASH' }
    },
    {
        uuid: 'ESG-S-002', name: 'DEI Policy', category: 'S', rank: 'Rare',
        description: 'Diversity, Equity, and Inclusion framework.', status: 'Trustworthy', isSealed: true, visual_theme: 'Pink', evidence: { hash_lock: 'GENESIS_HASH' }
    },
    {
        uuid: 'ESG-G-003', name: 'Board Independence', category: 'G', rank: 'Epic',
        description: 'Ensuring unbiased corporate governance.', status: 'Trustworthy', isSealed: true, visual_theme: 'Blue', evidence: { hash_lock: 'GENESIS_HASH' }
    },
    {
        uuid: 'OMNI-X-999', name: 'Dr. Thoth Access', category: 'Omni', rank: 'Legendary',
        description: 'Grants direct communication channel with the Sage.', status: 'Trustworthy', isSealed: true, visual_theme: 'Gold', evidence: { hash_lock: 'GENESIS_HASH' }
    },
    {
        uuid: 'SAM-POW-001', name: '範疇二：電力排放', category: 'E', rank: 'Rare',
        description: '企業外購電力所產生的間接溫室氣體排放。', status: 'Trustworthy', isSealed: true, visual_theme: 'Emerald', evidence: { hash_lock: 'MISSION_REWARD' }
    }
];

// ---------------------------------------------------------------------------
// 🎭 壽司博士 Dr. Thoth 組件 (The Mentor)
// ---------------------------------------------------------------------------

const DrThoth = ({ message, mood = 'neutral' }: { message: string, mood?: 'neutral' | 'excited' | 'warning' }) => {
    return (
        <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute bottom-6 right-6 flex items-end space-x-4 z-50 pointer-events-none"
        >
            <div className="bg-black/80 backdrop-blur-md border border-aqua-500/30 p-4 rounded-t-2xl rounded-bl-2xl shadow-[0_0_20px_rgba(0,255,255,0.2)] max-w-md pointer-events-auto">
                <div className="flex items-center space-x-2 mb-1">
                    <span className="text-aqua-400 text-xs font-mono tracking-wider">[DR. THOTH]</span>
                    <div className={`h-1.5 w-1.5 rounded-full animate-pulse ${mood === 'warning' ? 'bg-status-red' : 'bg-status-green'}`} />
                </div>
                <p className="text-gray-200 text-sm leading-relaxed font-light">
                    {message}
                </p>
            </div>
            <div className="w-16 h-16 rounded-full border-2 border-aqua-500 bg-slate-900 flex items-center justify-center shadow-[0_0_15px_rgba(0,255,255,0.4)] relative overflow-hidden">
                {/* Ibis Head Icon Representation */}
                <div className="absolute inset-0 bg-gradient-to-t from-aqua-900/50 to-transparent" />
                <span className="text-2xl filter drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">𓅝</span>
            </div>
        </motion.div>
    );
};

// ---------------------------------------------------------------------------
// 🛡️ 5T 能量環組件 (The 5T Ring)
// ---------------------------------------------------------------------------

const FiveTRing = ({ evidence }: { evidence: IEvidence }) => {
    const gates = [
        { id: 'tangible', label: 'Tangible', active: !!evidence.tangible_def, color: 'text-t5-tangible' },
        { id: 'traceable', label: 'Traceable', active: !!evidence.source_origin, color: 'text-t5-traceable' },
        { id: 'trackable', label: 'Trackable', active: !!evidence.lifecycle_hooks?.length, color: 'text-t5-trackable' },
        { id: 'transparent', label: 'Transparent', active: !!evidence.formula_ref, color: 'text-t5-transparent' },
        { id: 'trustworthy', label: 'Trustworthy', active: !!evidence.hash_lock, color: 'text-t5-trustworthy' },
    ];

    return (
        <div className="flex items-center space-x-1 bg-black/40 px-3 py-1.5 rounded-full border border-white/10">
            {gates.map((gate) => (
                <div key={gate.id} className="group relative">
                    <div className={`w-3 h-3 rounded-full border ${gate.active ? `${gate.color} bg-current shadow-[0_0_8px_currentColor]` : 'border-white/20 bg-transparent'}`} />
                    {/* Tooltip */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 text-[10px] text-white px-2 py-1 rounded whitespace-nowrap border border-white/10 pointer-events-none z-50">
                        {gate.label}
                    </div>
                </div>
            ))}
        </div>
    );
};

// ---------------------------------------------------------------------------
// 🎮 RPG 角色培育組件 (RPG Character Navigation)
// ---------------------------------------------------------------------------

const RPGCharacter = ({
    currentZone,
    position,
    level
}: {
    currentZone: VillageZone;
    position: { x: number; y: number; direction: string };
    level: number;
}) => {
    const getDirectionIcon = () => {
        switch (position.direction) {
            case 'up': return <ArrowUp className="w-4 h-4" />;
            case 'down': return <ArrowDown className="w-4 h-4" />;
            case 'left': return <ArrowLeft className="w-4 h-4" />;
            case 'right': return <ArrowRight className="w-4 h-4" />;
            default: return <User className="w-4 h-4" />;
        }
    };

    const getZoneColor = () => {
        switch (currentZone) {
            case 'HUT': return 'from-t5-transparent to-brand-primary';
            case 'GUILD': return 'from-t5-traceable to-blue-600';
            case 'WILD': return 'from-t5-tangible to-status-green';
            case 'ALTAR': return 'from-t5-trackable to-t5-trustworthy';
            default: return 'from-brand-primary to-aqua-400';
        }
    };

    return (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{
                scale: 1,
                opacity: 1,
                x: position.x * 120,
                y: position.y * 100
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="absolute top-8 left-8 z-30"
        >
            {/* Character Body */}
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getZoneColor()} flex items-center justify-center border-2 border-white/30 relative overflow-hidden aqua-glow-md aqua-pulse-slow`}>
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                {/* Character Face/Icon */}
                <div className="relative z-10">
                    {getDirectionIcon()}
                </div>

                {/* Level Badge */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-black rounded-full flex items-center justify-center border border-white/50 text-xs font-bold shadow-lg">
                    {level}
                </div>
            </div>

            {/* Zone Label */}
            <div className="mt-2 text-center">
                <span className="text-xs text-brand-primary font-mono tracking-wider aqua-text-glow">{currentZone}</span>
            </div>
        </motion.div>
    );
};

// ---------------------------------------------------------------------------
// 🗺️ 迷你地圖組件 (Mini Map)
// ---------------------------------------------------------------------------

const MiniMap = ({ currentZone, userLevel }: { currentZone: VillageZone, userLevel: number }) => {
    const zones: VillageZone[] = ['HUT', 'GUILD', 'WILD', 'ALTAR', 'SOVEREIGN', 'SWARM'];
    const positions: Record<VillageZone, { row: number; col: number }> = ZONE_POSITIONS;

    const getZoneColor = (zone: VillageZone) => {
        if (zone === currentZone) return 'bg-aqua-400 shadow-[0_0_10px_rgba(0,255,255,0.8)]';
        return 'bg-slate-600';
    };

    const getZoneIcon = (zone: VillageZone) => {
        switch (zone) {
            case 'HUT': return '🏠';
            case 'GUILD': return '📜';
            case 'WILD': return '🌲';
            case 'ALTAR': return '🔮';
            case 'SOVEREIGN': return '🏛️';
            case 'SWARM': return '🌐';
            default: return '📍';
        }
    };

    return (
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-3 z-30">
            <div className="text-[10px] text-slate-400 mb-2 font-mono text-center">MAP</div>
            <div className="grid grid-cols-3 gap-1 w-20 h-16 relative">
                {/* Grid Lines */}
                <div className="absolute inset-0 grid grid-cols-3 gap-1 opacity-20">
                    {[...Array(9)].map((_, i) => (
                        <div key={i} className="border border-slate-500/30 rounded" />
                    ))}
                </div>

                {/* Zone Markers */}
                {zones.map(zone => {
                    const isLocked = userLevel < ZONE_REQUIREMENTS[zone];
                    const isActive = currentZone === zone;

                    return (
                        <div
                            key={zone}
                            className={`
                                ${getZoneColor(zone)} 
                                rounded-lg flex items-center justify-center 
                                transition-all duration-300 
                                cursor-pointer
                                ${isLocked ? 'grayscale opacity-60' : 'hover:scale-110'}
                                ${isActive ? 'ring-2 ring-white/50 shadow-lg' : ''}
                            `}
                            style={{
                                gridRow: positions[zone].row + 1,
                                gridColumn: positions[zone].col + 1,
                                height: '24px',
                                width: '24px'
                            }}
                            title={`${zone} (Req. Level: ${ZONE_REQUIREMENTS[zone]})`}
                        >
                            <span className="text-[10px] drop-shadow-md">
                                {isLocked ? '🔒' : getZoneIcon(zone)}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Current Zone Label */}
            <div className="mt-2 text-center">
                <span className="text-xs text-aqua-400 font-mono">{currentZone}</span>
            </div>
        </div>
    );
};

// ---------------------------------------------------------------------------
// ⌨️ 鍵盤操作提示 (Keyboard Hints)
// ---------------------------------------------------------------------------

const KeyboardHints = () => (
    <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-3 z-30">
        <div className="text-[10px] text-slate-400 mb-2 font-mono text-center">CONTROLS</div>
        <div className="grid grid-cols-3 gap-1 w-16">
            <div />
            <div className="flex items-center justify-center w-8 h-8 bg-slate-700/50 rounded border border-white/10">
                <ArrowUp className="w-4 h-4 text-slate-300" />
            </div>
            <div />
            <div className="flex items-center justify-center w-8 h-8 bg-slate-700/50 rounded border border-white/10">
                <ArrowLeft className="w-4 h-4 text-slate-300" />
            </div>
            <div className="flex items-center justify-center w-8 h-8 bg-slate-700/50 rounded border border-white/10">
                <ArrowDown className="w-4 h-4 text-slate-300" />
            </div>
            <div className="flex items-center justify-center w-8 h-8 bg-slate-700/50 rounded border border-white/10">
                <ArrowRight className="w-4 h-4 text-slate-300" />
            </div>
        </div>
    </div>
);

// ---------------------------------------------------------------------------
// 🏰 善向永續村主頁面 (Main Page)
// ---------------------------------------------------------------------------

// -------------------------------------------------------------------------
// 🏰 善向永續村主頁面 (Main Page)
// -------------------------------------------------------------------------

const SustainableVillagePage = () => {
    // 🌍 Context Binding
    const { playerState, villageState, updatePlayerState, updateVillageState } = useOmniContext();

    // 核心狀態
    const [activeModule, setActiveModule] = useState<VillageZone>('HUT');
    const [activeCategoryFilter, setActiveCategoryFilter] = useState<CardCategory | 'ALL'>('ALL');
    const [thothMessage, setThothMessage] = useState("歡迎回到善向永續村。您的分身狀態良好，隨時可以開始新的煉金旅程。");
    const [thothMood, setThothMood] = useState<'neutral' | 'excited' | 'warning'>('neutral');

    // 🛡️ Zone Locking Logic
    const requestZoneChange = useCallback((targetZone: VillageZone) => {
        const currentLevel = villageState?.level || 1;
        const requiredLevel = ZONE_REQUIREMENTS[targetZone];

        if (currentLevel >= requiredLevel) {
            setActiveModule(targetZone);
            setThothMood('neutral');

            // 🏛️ Sovereign Resonance: Record successful zone traversal
            sovereignVaultService.sealRecord('ZONE_TRAVERSAL', {
                targetZone,
                entryLevel: currentLevel,
                timestamp: Date.now()
            });

            return true;
        } else {
            console.warn(`[ZONE_LOCK] Level ${currentLevel} insufficient for ${targetZone} (Required: ${requiredLevel})`);
            setThothMood('warning');
            const diff = requiredLevel - currentLevel;
            setThothMessage(`[等級不足] 勇者，你目前的等級為 ${currentLevel}，但進入 ${targetZone} 聖域需要等級 ${requiredLevel}。繼續你的 ESG 煉金，再提升 ${diff} 級智慧後再來吧。`);
            return false;
        }
    }, [villageState?.level]);

    // 🌊 痊癒浴 (Healing Bath) 儀式
    const handleHealingBath = async () => {
        if (!villageState) return;

        setThothMood('excited');
        setThothMessage("上善若水。讓智慧之泉洗滌系統的燥熱... 熵值正在消散。");

        // Reduce entropy and increase reputation slightly
        await updateVillageState({
            entropy: Math.max(0, villageState.entropy - 15),
            reputation: villageState.reputation + 5
        });

        // Trigger a visual feedback or toast if possible, 
        // for now, we rely on Dr. Thoth and state change.
    };

    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    // 🎮 RPG 角色位置狀態 (Character Position State)
    const [charPosition, setCharPosition] = useState<{ x: number; y: number; direction: string }>({
        x: ZONE_POSITIONS['HUT'].col,
        y: ZONE_POSITIONS['HUT'].row,
        direction: 'down'
    });

    // 🎮 鍵盤導航處理 (Keyboard Navigation Handler)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const zones: VillageZone[] = ['HUT', 'GUILD', 'WILD', 'ALTAR', 'SOVEREIGN', 'SWARM'];
            const currentZoneIdx = zones.indexOf(activeModule);

            switch (e.key) {
                case 'ArrowUp':
                    if (currentZoneIdx === 2) { // WILD -> ALTAR
                        requestZoneChange('ALTAR');
                    } else if (currentZoneIdx === 3) { // ALTAR -> SOVEREIGN
                        requestZoneChange('SOVEREIGN');
                    }
                    setCharPosition(prev => ({ ...prev, direction: 'up' }));
                    break;

                case 'ArrowDown':
                    if (currentZoneIdx === 4) { // SOVEREIGN -> ALTAR
                        requestZoneChange('ALTAR');
                    } else if (currentZoneIdx === 3) { // ALTAR -> WILD
                        requestZoneChange('WILD');
                    }
                    setCharPosition(prev => ({ ...prev, direction: 'down' }));
                    break;

                case 'ArrowLeft':
                    if (currentZoneIdx === 1) { // GUILD -> SOVEREIGN
                        requestZoneChange('SOVEREIGN');
                    } else if (currentZoneIdx === 4) { // SOVEREIGN -> HUT
                        requestZoneChange('HUT');
                    } else if (currentZoneIdx === 5) { // SWARM -> ALTAR
                        requestZoneChange('ALTAR');
                    }
                    setCharPosition(prev => ({ ...prev, direction: 'left' }));
                    break;

                case 'ArrowRight':
                    if (currentZoneIdx === 0) { // HUT -> SOVEREIGN
                        requestZoneChange('SOVEREIGN');
                    } else if (currentZoneIdx === 4) { // SOVEREIGN -> GUILD
                        requestZoneChange('GUILD');
                    } else if (currentZoneIdx === 3) { // ALTAR -> SWARM
                        requestZoneChange('SWARM');
                    }
                    setCharPosition(prev => ({ ...prev, direction: 'right' }));
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeModule]);

    // 同步位置到當前區域
    useEffect(() => {
        setCharPosition(prev => ({
            ...prev,
            x: ZONE_POSITIONS[activeModule].col,
            y: ZONE_POSITIONS[activeModule].row
        }));
    }, [activeModule]);

    // Derive Inventory from Player State
    const inventory = React.useMemo(() => {
        // Check if playerState is loaded
        if (!playerState) return [];

        // Map learned IDs back to full card objects from database
        // If strategies are empty (new player), we might want to give them the default starter pack
        // For now, we filter from KNOWLEDGE_DATABASE based on what they have learned.
        // Note: In a real app, we might want to just show 'unlocked' cards from a master list.

        // Temporary Logic: If learnedStrategies is empty, show the 4 starter cards (simulating init)
        // Ideally this init happens in context creation.
        const learnedIds = playerState.learnedStrategies.length > 0
            ? playerState.learnedStrategies
            : ['ESG-E-001', 'ESG-S-002', 'ESG-G-003', 'OMNI-X-999'];

        return KNOWLEDGE_DATABASE.filter(card => learnedIds.includes(card.uuid));
    }, [playerState]);

    // 任務狀態機：山衛科技電力試煉
    const [missionPhase, setMissionPhase] = useState<number>(0);
    // 0: Not Started, 1: Theory, 2: Example, 3: Practice, 4: Confirmation, 5: Sealing

    // 當前正在煉金的卡牌 (Temporary State)
    const [activeCard, setActiveCard] = useState<Partial<IKnowledgeCard>>({});

    // Dr. Thoth 的對話
    // Moved to state at the top for coordination with zone locking

    // AI Generated Cards State
    const [aiCards, setAiCards] = useState<IKnowledgeCard[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleConsultOracle = async () => {
        setIsGenerating(true);
        setThothMessage("正在連結奧秘數據庫... 請稍候，我將為您尋找適合的知識試煉。");
        try {
            const cards = await agencyManager.generateKnowledgeCards("Low entropy, high potential for growth.");
            setAiCards(cards);
            setThothMessage("數據流已穩定。這些是適合您當前狀態的知識卡牌。請選擇一張開始試煉。");
        } catch (error) {
            setThothMessage("數據連結不穩定。請稍後再試。");
        } finally {
            setIsGenerating(false);
        }
    };

    // 🔄 Sync Missions from AgencyManager
    const [missions, setMissions] = useState<MissionObjective[]>([]);

    useEffect(() => {
        const updateMissions = () => {
            setMissions(agencyManager.getMissions());
            setUnreadCount(agencyManager.getNotifications().filter(n => !n.read).length);
        };
        const unsubscribe = agencyManager.subscribe(updateMissions);
        // Initial fetch if empty
        if (agencyManager.getMissions().length === 0) {
            agencyManager.syncMissions();
        } else {
            updateMissions();
        }
        return unsubscribe;
    }, []);

    const selectAiCard = (card: IKnowledgeCard) => {
        startMission();
        setActiveCard({
            ...card,
            status: 'Pending',
            isSealed: false,
            evidence: {}
        });
        setThothMessage(`您選擇了 [${card.name}]。定義它 (Tangible)，讓它成為現實。`);
    };

    // -------------------------------------------------------------------------
    // 🔄 階段處理邏輯 (The 5T Alchemy Flow)
    // -------------------------------------------------------------------------

    const startMission = () => {
        setMissionPhase(1);
        requestZoneChange('GUILD');
        setThothMessage("英雄，山衛科技的電力網絡正處於熵增狀態。要解決它，我們必須先定義『範疇二』。請簽下這份知識契約。");
        setActiveCard({
            uuid: 'SAM-POW-001',
            name: '範疇二：電力排放',
            category: 'E',
            rank: 'Rare',
            description: '企業外購電力所產生的間接溫室氣體排放。',
            status: 'Pending',
            isSealed: false,
            evidence: {}
        });
    };

    const completeTheory = () => {
        setMissionPhase(2);
        setActiveCard(prev => ({
            ...prev,
            status: 'Tangible',
            evidence: { ...prev.evidence, tangible_def: 'Scope 2 Indirect Emissions Definition' }
        }));
        setThothMessage("很好。賦予了名字，知識便有了形體。現在，讓我們前往數據視界，找出這股力量的源頭 (Traceable)。");
    };

    const completeExample = () => {
        setMissionPhase(3);
        setActiveModule('WILD');
        setActiveCard(prev => ({
            ...prev,
            status: 'Traceable',
            evidence: { ...prev.evidence, source_origin: 'Taipower_Bill_2025Q4.pdf' }
        }));
        setThothMessage("數據若無根，便是幻覺。現在我們確立了來源，接著進入實作。我已為您開啟追蹤 Hook，您的每一個決策都將被紀錄。");
    };

    const completePractice = () => {
        setMissionPhase(4);
        setActiveCard(prev => ({
            ...prev,
            status: 'Trackable',
            evidence: { ...prev.evidence, lifecycle_hooks: ['Action_Opt_Chiller', 'Action_Adj_Lighting'] }
        }));
        setThothMessage("漂亮的實作！但要對抗熵魔，光有行動不夠。您必須證明這背後的邏輯是透明的。驗算它！");
    };

    const completeConfirmation = () => {
        setMissionPhase(5);
        requestZoneChange('ALTAR');
        setActiveCard(prev => ({
            ...prev,
            status: 'Transparent',
            evidence: { ...prev.evidence, formula_ref: 'ISO-14064-1: E = AD * EF * GWP' }
        }));
        setThothMessage("真理已現。這張卡牌現在純淨無瑕。前往祭壇，執行最後的雜湊鎖定儀式吧。");
    };

    const sealCard = async () => {
        if (!activeCard.uuid || !playerState) return;

        setMissionPhase(0); // Reset mission
        const finalCard: IKnowledgeCard = {
            ...activeCard as IKnowledgeCard,
            status: 'Trustworthy',
            isSealed: true,
            visual_theme: 'Gold',
            evidence: {
                ...activeCard.evidence,
                hash_lock: 'sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
            }
        };

        // Update Context States
        await updatePlayerState({
            learnedStrategies: [...playerState.learnedStrategies, finalCard.uuid],
            xp: playerState.xp + 500
        });

        if (villageState) {
            await updateVillageState({
                entropy: Math.max(0, villageState.entropy - 5),
                reputation: villageState.reputation + 10
            });
        }

        setActiveModule('HUT');
        setThothMessage("儀式完成！[範疇二：電力知識卡] 已封印至您的奧秘分身倉庫。狀態：Trustworthy (不可篡改)。");
    };

    // -------------------------------------------------------------------------
    // 🖥️ UI 渲染 (Render)
    // -------------------------------------------------------------------------

    return (
        <div className="fixed inset-0 bg-[#0a0f14] text-slate-200 font-sans overflow-hidden flex flex-col">

            {/* 1. 天啟狀態列 (The Avatar Header) */}
            <header className="h-16 border-b border-white/10 bg-[#0a0f14]/80 backdrop-blur-md flex items-center justify-between px-6 z-40 shrink-0">
                <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-aqua-500 to-blue-600 border-2 border-white/20 relative">
                        <User className="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white" />
                        <div className="absolute -bottom-1 -right-1 bg-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center border border-white/20">
                            {villageState?.level || 1}
                        </div>
                    </div>
                    <div>
                        <h1 className="text-sm font-bold tracking-wider text-slate-100">OMNI AVATAR</h1>
                        <div className="w-24 h-1 bg-white/10 rounded-full mt-1 overflow-hidden">
                            <div className="h-full bg-aqua-500" style={{ width: `${((playerState?.xp || 0) % 1000) / 10}%` }} />
                        </div>
                    </div>
                </div>

                {/* 5T 能量環 (Global Mission Context) */}
                {activeCard.evidence && <FiveTRing evidence={activeCard.evidence} />}

                <div className="flex items-center space-x-6 text-xs text-slate-400 font-mono">
                    <div className="flex items-center space-x-2">
                        <Activity className="w-4 h-4 text-emerald-400" />
                        <span>Entropy: {villageState?.entropy || 0}%</span>
                    </div>

                    <button
                        onClick={() => setIsNotificationOpen(true)}
                        className="relative p-2 hover:bg-white/5 rounded-full transition-colors group"
                    >
                        <Bell className="w-5 h-5 text-aqua-400 group-hover:text-white" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-[10px] font-bold text-white rounded-full flex items-center justify-center border border-[#0a0f14]">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    <div className="flex items-center space-x-2">
                        <Box className="w-4 h-4 text-amber-400" />
                        <span>Ware: {inventory.length}/100</span>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex flex-1 overflow-hidden">

                {/* 2. 村莊傳送門 (Village Portal - Sidebar) */}
                <nav className="w-20 bg-[#05080a] border-r border-white/5 flex flex-col items-center py-6 space-y-8 shrink-0">
                    <SidebarBtn icon={Home} label="Hut" active={activeModule === 'HUT'} onClick={() => requestZoneChange('HUT')} />
                    <SidebarBtn icon={Scroll} label="Guild" active={activeModule === 'GUILD'} onClick={() => requestZoneChange('GUILD')} />
                    <SidebarBtn icon={Map} label="Wild" active={activeModule === 'WILD'} onClick={() => requestZoneChange('WILD')} />
                    <SidebarBtn icon={Lock} label="Altar" active={activeModule === 'ALTAR'} onClick={() => requestZoneChange('ALTAR')} />
                    <SidebarBtn icon={Database} label="Vault" active={activeModule === 'SOVEREIGN'} onClick={() => requestZoneChange('SOVEREIGN')} />
                    <SidebarBtn icon={Globe} label="Swarm" active={activeModule === 'SWARM'} onClick={() => requestZoneChange('SWARM')} />
                </nav>

                {/* 3. 靈魂視窗 (The Soul Canvas - Main Stage) */}
                <main className="flex-1 relative bg-slate-900/50 flex flex-col">

                    {/* Background FX */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.05),transparent_70%)]" />
                        <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-aqua-500/20 to-transparent top-10" />
                    </div>

                    {/* 🎮 RPG 角色顯示 (Character Display) */}
                    <RPGCharacter
                        currentZone={activeModule}
                        position={charPosition}
                        level={villageState?.level || 1}
                    />

                    {/* 🗺️ 迷你地圖 */}
                    <MiniMap currentZone={activeModule} userLevel={villageState?.level || 1} />

                    {/* ⌨️ 鍵盤操作提示 */}
                    <KeyboardHints />

                    <div className="flex-1 p-8 overflow-hidden relative">
                        <AnimatePresence mode="wait">

                            {/* === MODULE: MY HUT (DIGITAL TWIN) === */}
                            {activeModule === 'HUT' && (
                                <motion.div
                                    key="hut"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.05 }}
                                    className="w-full h-full"
                                >
                                    <div className="relative w-full h-full flex flex-col">
                                        <DigitalTwin userId={playerState?.id || 'guest'} />

                                        {/* 🌊 Healing Bath Action Button */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="absolute bottom-8 left-1/2 -translate-x-1/2"
                                        >
                                            <button
                                                onClick={handleHealingBath}
                                                className="group relative px-8 py-3 bg-aqua-500/20 hover:bg-aqua-500/40 border border-aqua-500/50 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(0,255,255,0.3)]"
                                            >
                                                <span className="relative z-10 text-aqua-400 font-bold tracking-widest flex items-center space-x-2">
                                                    <span>🚿</span>
                                                    <span>執行：痊癒浴 (Healing Bath)</span>
                                                </span>
                                                <div className="absolute inset-0 rounded-full bg-aqua-400/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </button>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            )}

                            {/* === MODULE: GUILD (THEORY) === */}
                            {activeModule === 'GUILD' && (
                                <motion.div
                                    key="guild"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="w-full h-full flex flex-col items-center justify-center space-y-8"
                                >
                                    <h2 className="text-3xl font-light text-white tracking-widest uppercase">Mission Guild</h2>

                                    {missionPhase === 0 && aiCards.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl px-4">
                                            {aiCards.map((card) => (
                                                <motion.div
                                                    key={card.uuid}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="bg-slate-800/80 border border-aqua-500/30 p-6 rounded-xl hover:border-aqua-500 transition-colors cursor-pointer group relative overflow-hidden"
                                                    onClick={() => selectAiCard(card)}
                                                >
                                                    <div className="absolute top-0 right-0 p-2 opacity-50 text-xs font-mono">{card.category}</div>
                                                    <h4 className="text-xl text-aqua-400 mb-2 font-bold">{card.name}</h4>
                                                    <div className="text-xs text-slate-500 mb-4">{card.rank}</div>
                                                    <p className="text-sm text-slate-300 mb-6">{card.description}</p>
                                                    <button className="w-full py-2 bg-brand-primary/20 text-brand-primary border border-brand-primary/50 rounded hover:bg-brand-primary hover:text-white transition-colors">
                                                        ACCEPT TRIAL
                                                    </button>
                                                </motion.div>
                                            ))}
                                            <div className="col-span-full flex justify-center mt-4">
                                                <button
                                                    onClick={() => setAiCards([])}
                                                    className="text-slate-500 hover:text-slate-300 text-sm underline"
                                                >
                                                    Back to Guild Entrance
                                                </button>
                                            </div>
                                        </div>
                                    ) : missionPhase === 0 ? (
                                        <div className="bg-slate-800/60 p-8 rounded-2xl border border-white/10 max-w-2xl w-full text-center">
                                            <h3 className="text-xl text-aqua-400 mb-4">Mission Guild Entrance</h3>
                                            <p className="text-slate-400 mb-8">
                                                Seek guidance from the Oracle to discover new paths of knowledge.
                                            </p>
                                            <button
                                                onClick={handleConsultOracle}
                                                disabled={isGenerating}
                                                className={`px-8 py-3 bg-aqua-600 hover:bg-aqua-500 text-white rounded-lg font-bold tracking-wider transition-colors shadow-[0_0_20px_rgba(0,255,255,0.4)] flex items-center justify-center mx-auto space-x-2 ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                {isGenerating ? (
                                                    <>
                                                        <span className="animate-spin">🌀</span>
                                                        <span>COMMUNING...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span>🔮</span>
                                                        <span>CONSULT ORACLE (AI)</span>
                                                    </>
                                                )}
                                            </button>

                                            <div className="mt-8 pt-8 border-t border-white/5 w-full">
                                                <div className="flex justify-between items-center mb-4">
                                                    <h4 className="text-sm text-slate-500 uppercase tracking-widest">Active Missions</h4>
                                                    <button onClick={() => agencyManager.syncMissions()} className="text-xs text-aqua-400 hover:text-white">
                                                        REFRESH
                                                    </button>
                                                </div>
                                                <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                                    {missions.map(mission => (
                                                        <div key={mission.id} className="flex justify-between items-center bg-slate-700/30 hover:bg-slate-700/50 p-3 rounded border border-white/5 transition-colors">
                                                            <div>
                                                                <div className="text-sm text-slate-300 font-medium">{mission.objective}</div>
                                                                <div className="flex items-center space-x-2 mt-1">
                                                                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${mission.priority === 'CRITICAL' ? 'bg-red-900/50 text-red-400' : 'bg-slate-800 text-slate-400'}`}>
                                                                        {mission.priority}
                                                                    </span>
                                                                    <span className="text-[10px] text-slate-500">{mission.status5T}</span>
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-col items-end space-y-1">
                                                                <div className="text-xs text-aqua-400">{mission.progress}%</div>
                                                                <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden">
                                                                    <div className="h-full bg-brand-primary" style={{ width: `${mission.progress}%` }} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {missions.length === 0 && (
                                                        <div className="text-sm text-slate-500 italic text-center py-4">
                                                            No active missions. Consult the Oracle or Refresh.
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="mt-6 pt-6 border-t border-white/5 space-y-3">
                                                    <h4 className="text-sm text-slate-500 mb-2 uppercase tracking-widest">Advanced Actions</h4>
                                                    <button
                                                        onClick={() => agencyManager.runStrategicSimulation('Resource_Optimization')}
                                                        className="px-6 py-2 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 rounded border border-indigo-500/30 text-sm w-full flex items-center justify-center space-x-2"
                                                    >
                                                        <Zap className="w-4 h-4" />
                                                        <span>RUN STRATEGIC SIMULATION (AI)</span>
                                                    </button>
                                                    <button
                                                        onClick={startMission}
                                                        className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded border border-white/10 text-sm w-full"
                                                    >
                                                        Demo: Scope 2 Emission (Carbon)
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : missionPhase === 1 ? (
                                        <div className="bg-slate-800/60 p-8 rounded-2xl border border-emerald-500/30 max-w-2xl w-full">
                                            <div className="flex justify-between items-center mb-6">
                                                <h3 className="text-lg text-white">Saint&apos;s Contract</h3>
                                                <span className="text-xs font-mono text-emerald-400 animate-pulse">AWAITING TANGIBLE</span>
                                            </div>
                                            <div className="mt-12 pt-8 border-t border-slate-700/50 text-center text-slate-500 text-sm">
                                                © 2026 ESGss JunAiKey. All Rights Reserved.
                                            </div>
                                            <div className="space-y-4 mb-8 font-mono text-sm text-slate-300">
                                                <div className="flex justify-between border-b border-white/5 py-2">
                                                    <span>Target Knowledge:</span>
                                                    <span className="text-white">Scope 2 Indirect Emissions</span>
                                                </div>
                                                <div className="flex justify-between border-b border-white/5 py-2">
                                                    <span>Category:</span>
                                                    <span className="text-white">Environmental (E)</span>
                                                </div>
                                                <div className="flex justify-between border-b border-white/5 py-2">
                                                    <span>UUID:</span>
                                                    <span className="text-white">SAM-POW-001</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={completeTheory}
                                                className="w-full py-3 border border-t5-tangible text-t5-tangible hover:bg-t5-tangible/10 rounded-lg transition-colors"
                                            >
                                                MATERIALIZE (具象化)
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="text-slate-400">Mission in progress... check Wilderness.</div>
                                    )}
                                </motion.div>
                            )}

                            {/* === MODULE: WILDERNESS (EXAMPLE & PRACTICE) === */}
                            {activeModule === 'WILD' && (
                                <motion.div
                                    key="wild"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="w-full h-full flex flex-col"
                                >
                                    {/* Top Map View */}
                                    <div className="flex-1 bg-black/40 rounded-xl border border-white/10 relative overflow-hidden mb-4 group">
                                        {/* Fake Map UI */}
                                        <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 gap-0.5 opacity-20 pointer-events-none">
                                            {Array.from({ length: 72 }).map((_, i) => <div key={i} className="bg-aqua-500/10 hover:bg-aqua-500/30 transition-colors" />)}
                                        </div>

                                        {missionPhase === 2 && (
                                            <div className="absolute inset-0 flex items-center justify-center flex-col">
                                                <Search className="w-16 h-16 text-t5-traceable mb-4 animate-bounce" />
                                                <h3 className="text-xl text-t5-traceable font-light">Scanning Source Origin...</h3>
                                                <button
                                                    onClick={completeExample}
                                                    className="mt-6 px-6 py-2 bg-t5-traceable/20 border border-t5-traceable text-t5-traceable rounded hover:bg-t5-traceable/40 transition-colors"
                                                >
                                                    LOCK SIGNAL (溯源鎖定)
                                                </button>
                                            </div>
                                        )}

                                        {missionPhase === 3 && (
                                            <div className="absolute inset-0 flex items-center justify-center flex-col relative">
                                                {/* Game Character Dot */}
                                                <motion.div
                                                    animate={{ x: [0, 50, -50, 0], y: [0, 30, -30, 0] }}
                                                    transition={{ duration: 4, repeat: Infinity }}
                                                    className="w-4 h-4 bg-t5-trackable rounded-full shadow-[0_0_10px_var(--color-t5-trackable)] absolute"
                                                />

                                                <h3 className="text-xl text-t5-trackable font-light z-10 bg-black/50 px-4 py-2 rounded">Tracking Lifecycle...</h3>
                                                <div className="w-64 h-32 bg-slate-900/80 border border-t5-trackable/30 mt-8 rounded p-3 font-mono text-xs text-status-green overflow-hidden">
                                                    <div>&gt; Hook_Init: Track_09</div>
                                                    <div>&gt; Action: Optimize_Chiller</div>
                                                    <div>&gt; Delta: -15 kWh</div>
                                                    <div className="animate-pulse">&gt; Recording...</div>
                                                </div>

                                                <button
                                                    onClick={completePractice}
                                                    className="mt-6 px-6 py-2 bg-t5-trackable/20 border border-t5-trackable text-t5-trackable rounded hover:bg-t5-trackable/40 transition-colors z-10"
                                                >
                                                    COMMIT ACTIONS (上傳實作)
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Bottom Evidence Lineage */}
                                    <div className="h-32 bg-slate-800/50 rounded-xl border border-white/5 p-4 flex items-center space-x-4 overflow-x-auto">
                                        <div className="flex-shrink-0 flex flex-col items-center">
                                            <div className="w-10 h-10 rounded bg-slate-700 flex items-center justify-center border border-white/10">
                                                <FileText className="w-5 h-5 text-slate-400" />
                                            </div>
                                            <span className="text-[10px] mt-1 text-slate-500">Bill_2025</span>
                                        </div>
                                        <div className="w-10 h-0.5 bg-slate-700" />
                                        <div className="flex-shrink-0 flex flex-col items-center">
                                            <div className="w-10 h-10 rounded bg-slate-700 flex items-center justify-center border border-white/10">
                                                <Activity className="w-5 h-5 text-slate-400" />
                                            </div>
                                            <span className="text-[10px] mt-1 text-slate-500">Action_Log</span>
                                        </div>
                                        <div className="w-10 h-0.5 bg-slate-700" />
                                        <div className="flex-shrink-0 flex flex-col items-center opacity-50">
                                            <div className="w-10 h-10 rounded border border-dashed border-white/20 flex items-center justify-center">
                                                <ShieldCheck className="w-5 h-5 text-slate-600" />
                                            </div>
                                            <span className="text-[10px] mt-1 text-slate-600">Pending</span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* === MODULE: ALTAR (CONFIRMATION & SEALING) === */}
                            {activeModule === 'ALTAR' && (
                                <motion.div
                                    key="altar"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="w-full h-full flex items-center justify-center flex-col"
                                >
                                    {missionPhase === 4 ? (
                                        <div className="max-w-2xl w-full bg-slate-900/90 border border-amber-500/30 p-8 rounded-2xl relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
                                            <h2 className="text-2xl text-center text-t5-trustworthy font-light mb-8">TRANSPARENT LOGIC GATE</h2>

                                            <div className="flex items-center justify-center space-x-4 mb-8 text-2xl font-mono text-white">
                                                <div className="bg-black/50 px-4 py-2 rounded border border-white/10">1,250 <span className="text-sm text-slate-500">kWh</span></div>
                                                <span>×</span>
                                                <div className="bg-black/50 px-4 py-2 rounded border border-white/10">0.495 <span className="text-sm text-slate-500">kgCO2e</span></div>
                                                <span>=</span>
                                                <div className="text-emerald-400">618.75</div>
                                            </div>

                                            <div className="text-center text-xs font-mono text-slate-500 mb-8">
                                                REF: ISO-14064-1 STANDARD CALCULATION METHOD
                                            </div>

                                            <button
                                                onClick={completeConfirmation}
                                                className="w-full py-4 bg-t5-trustworthy/20 border border-t5-trustworthy text-t5-trustworthy hover:bg-t5-trustworthy/30 rounded-lg tracking-widest transition-all"
                                            >
                                                VERIFY TRUTH (零幻覺驗證)
                                            </button>
                                        </div>
                                    ) : missionPhase === 5 ? (
                                        <div className="flex flex-col items-center">
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                                                className="w-96 h-96 rounded-full border border-white/5 absolute"
                                            />
                                            <motion.div
                                                animate={{ scale: [1, 1.1, 1] }}
                                                transition={{ duration: 3, repeat: Infinity }}
                                                className="w-64 h-96 bg-gradient-to-br from-amber-500/20 via-black/80 to-amber-900/20 border border-amber-500/50 rounded-xl flex flex-col items-center justify-center p-6 backdrop-blur-md relative z-10 shadow-[0_0_50px_rgba(245,158,11,0.3)]"
                                            >
                                                <Zap className="w-16 h-16 text-amber-200 mb-4" />
                                                <h3 className="text-xl text-t5-trustworthy font-bold mb-2">Scope 2 Power</h3>
                                                <p className="text-center text-xs text-amber-200/60 mb-8">
                                                    Tangible: ✅<br />
                                                    Traceable: ✅<br />
                                                    Trackable: ✅<br />
                                                    Transparent: ✅
                                                </p>

                                                <button
                                                    onClick={sealCard}
                                                    className="px-6 py-2 bg-t5-trustworthy text-black font-bold rounded shadow-[0_0_15px_var(--color-t5-trustworthy)] hover:scale-105 transition-transform"
                                                >
                                                    SEAL ASSET (封印)
                                                </button>
                                            </motion.div>
                                            <div className="mt-12 text-center">
                                                <p className="text-amber-500/50 font-mono tracking-[0.5em] text-xs">TRUSTWORTHY RITUAL</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-slate-500">The Altar is dormant.</div>
                                    )}
                                </motion.div>
                            )}

                            {/* === MODULE: SOVEREIGN (LEDGER) === */}
                            {activeModule === 'SOVEREIGN' && (
                                <motion.div
                                    key="sovereign"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.05 }}
                                    className="w-full h-full"
                                >
                                    <SovereignLedgerView />
                                </motion.div>
                            )}

                            {/* === MODULE: SWARM (MONITOR) === */}
                            {activeModule === 'SWARM' && (
                                <motion.div
                                    key="swarm"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.05 }}
                                    className="w-full h-full"
                                >
                                    <SwarmMonitor />
                                </motion.div>
                            )}

                        </AnimatePresence>
                    </div>

                    {/* Dr. Thoth (Floating) */}
                    <DrThoth message={thothMessage} mood={thothMood} />

                </main>
            </div >

            {/* 🔔 Notification Drawer Overlay */}
            <AnimatePresence>
                {isNotificationOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsNotificationOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 w-full max-w-md h-full bg-[#0a0f14] border-l border-white/10 shadow-2xl z-[70] p-6"
                        >
                            <div className="flex justify-end mb-4">
                                <button
                                    onClick={() => setIsNotificationOpen(false)}
                                    className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors"
                                >
                                    <ArrowRight className="w-6 h-6" />
                                </button>
                            </div>
                            <SmartNotificationSystemUI theme="dark" language="zh-TW" />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div >
    );
};

const SidebarBtn = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${active ? 'bg-aqua-500/20 text-aqua-400 border border-aqua-500/50 shadow-[0_0_15px_rgba(0,255,255,0.3)]' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
    >
        <Icon className="w-6 h-6" />
    </button>
);

export default SustainableVillagePage;
