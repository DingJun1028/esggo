import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield,
    Zap,
    Layers,
    Wind,
    Droplets,
    Flame,
    Mountain,
    Sun,
    Moon,
    Link2,
    Clock,
    Sparkles,
    Search,
    Filter,
    RefreshCw,
    Info,
    ChevronRight,
    ChevronDown,
    Settings,
    Star
} from 'lucide-react';
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Tooltip as RechartsTooltip,
    Legend as RechartsLegend
} from 'recharts';

// --- Data Types ---

interface ElementDetail {
    name: string;
    color: string;
    icon: React.ReactNode;
    spirit: string;
    desc: string;
    generates: string;
    destroys: string;
}

interface OmniCard {
    id: number;
    name: string;
    tier: '根源' | '核心' | '巔峰';
    type: string;
    element: string;
    rarity: string;
    desc: string;
    system: string;
    real: string;
}

// --- Constants ---

const CONCENTRIC_LAYERS = [
    { id: 1, title: '核心層 (Core Layer)', description: '代表使用者最本質的需求和資訊，是所有數據和系統核心邏輯的中心。負責底層數據的存儲、安全與一致性。' },
    { id: 2, title: '內環層 (Inner Ring)', description: '提供與使用者直接互動的基礎服務，如個人化設定、核心應用介面。將核心層數據轉化為使用者可操作的功能。' },
    { id: 3, title: '中環層 (Middle Ring)', description: '擴展核心功能，提供進階的模組整合、自動化工作流和智慧輔助。協調多模組間的數據流與功能調用。' },
    { id: 4, title: '外環層 (Outer Ring)', description: '提供多元化的生態服務與協作平台，引入外部數據源和第三方應用整合。作為系統與外部世界的橋樑。' },
    { id: 5, title: '擴展層 (Expansion Layer)', description: '代表系統的無限潛能與未來演化方向，包含實驗性功能、新技術整合和社群共創模組。' }
];

const ELEMENTS: ElementDetail[] = [
    { name: '秩序 (Order)', color: '#D4AF37', icon: <Shield size={20} />, spirit: '鋒靈 Aurex', desc: '金色體現。代表系統架構、規則與精準度。', generates: '思想', destroys: '成長' },
    { name: '成長 (Growth)', color: '#228B22', icon: <Wind size={20} />, spirit: '森靈 Sylfa', desc: '翠綠色體現。掌管學習、演化與生命力。', generates: '行動', destroys: '穩定' },
    { name: '思想 (Thought)', color: '#4169E1', icon: <Droplets size={20} />, spirit: '湧靈 Aquare', desc: '深藍色體現。數據邏輯與知識探索的源頭。', generates: '成長', destroys: '行動' },
    { name: '行動 (Action)', color: '#DC143C', icon: <Flame size={20} />, spirit: '焰靈 Pyra', desc: '深紅色體現。負責執行力與戰略任務。', generates: '穩定', destroys: '秩序' },
    { name: '穩定 (Stability)', color: '#8B4513', icon: <Mountain size={20} />, spirit: '磐靈 Terrax', desc: '棕色體現。確保基礎設施與系統穩定。', generates: '秩序', destroys: '思想' },
    { name: '指導 (Guidance)', color: '#E1E1E1', icon: <Sun size={20} />, spirit: '耀靈 Luxis', desc: '月白色體現。路徑規劃與戰略導引。', generates: '秩序', destroys: '混沌' },
    { name: '混沌 (Chaos)', color: '#9333EA', icon: <Moon size={20} />, spirit: '幽靈 Nyxos', desc: '紫色體現。打破規則、引發創新與驚喜。', generates: '變革', destroys: '穩定' },
    { name: '虛無 (Void)', color: '#A5F3FC', icon: <Link2 size={20} />, spirit: '源靈 Nullis', desc: '水晶色體現。萬能整合與環境適應。', generates: '星辰', destroys: '虛無' },
    { name: '變革 (Change)', color: '#06B6D4', icon: <Clock size={20} />, spirit: '嵐靈 Tempest', desc: '青色體現。系統優化與動態管理。', generates: '機械', destroys: '秩序' },
    { name: '本質 (Essence)', color: '#8B5CF6', icon: <Sparkles size={20} />, spirit: '魂靈 Anima', desc: '紫羅蘭色體現。核心洞察與記憶遺產。', generates: '成長', destroys: '混沌' },
    { name: '機械 (Machine)', color: '#64748B', icon: <Settings size={20} />, spirit: '械靈 Machina', desc: '鋼鐵色體現。自動化作業與全域連接。', generates: '穩定', destroys: '本質' },
    { name: '星辰 (Stars)', color: '#F472B6', icon: <Star size={20} />, spirit: '星靈 Astra', desc: '彩虹色體現。超越維度、融合萬物的終極。', generates: '萬能', destroys: '熵增' },
];

const OMNI_CARDS: OmniCard[] = [
    { id: 1, name: '數據管道', tier: '根源', type: '資源', element: '水', rarity: '普通', desc: '提供基礎能量與環境，維繫系統底層數據流動。', system: '對應系統中的 Kafka/RabbitMQ 訊息隊列或數據庫連接池。', real: '代表公司內部的資訊高速公路，確保數據從源頭順暢流向各部門。' },
    { id: 2, name: '安全基礎設施', tier: '根源', type: '資源', element: '土', rarity: '非普通', desc: '提供基礎的認證與授權服務，是系統安全的基石。', system: '對應 OAuth 2.0 服務器、JWT 令牌生成與驗證機制。', real: '如同企業的門禁與保全系統，確保只有授權人員才能進入特定區域。' },
    { id: 3, name: '自動化代理', tier: '核心', type: '單位', element: '金', rarity: '非普通', desc: '可直接操作的工具，用於執行重複性任務。', system: '一個可配置的 Cron Job 或一個 n8n/Zapier 工作流。', real: '一位孜孜不倦的數位員工，負責處理每日的數據整理與報告生成。' },
    { id: 4, name: '數據分析器', tier: '核心', type: '單位', element: '水', rarity: '稀有', desc: '從原始數據中提取洞察，並以可視化方式呈現。', system: '執行 SQL 查詢並將結果渲染到 Chart.js 圖表的腳本。', real: '一位數據分析師，將雜亂的銷售數據轉化為清晰的趨勢圖表。' },
    { id: 5, name: '知識庫', tier: '核心', type: '神器', element: '靈', rarity: '稀有', desc: '具備持續效用，儲存並組織系統中的所有結構化知識。', system: '一個由 AITable.ai 或 Supabase 驅動的向量資料庫。', real: '公司的中央圖書館與檔案館，儲存所有重要的文件、流程與智慧資產。' },
    { id: 6, name: 'API 集成模組', tier: '核心', type: '神器', element: '無', rarity: '非普通', desc: '連接不同系統，實現數據與功能的互通。', system: '一個用於調用第三方服務（如 Google Calendar API）的客戶端庫。', real: '一位專業的翻譯與外交官，讓公司內部系統能與外部合作夥伴的系統順暢溝通。' },
    { id: 7, name: '即時決策支持', tier: '巔峰', type: '法術', element: '火', rarity: '秘稀', desc: '一次性高影響力操作，根據即時數據流提供決策建議。', system: '一個機器學習模型，分析實時用戶行為並觸發一個推薦彈窗。', real: '在關鍵的商業談判中，AI助手即時分析對手發言並給出最佳應對策略。' },
    { id: 8, name: '智慧策略', tier: '巔峰', type: '結界', element: '時', rarity: '傳說', desc: '持續性地改變系統規則，以達成長期目標。', system: '一個動態定價算法，根據市場供需和競爭對手價格自動調整產品售價。', real: '公司設定的長期市場戰略，如「始終保持比主要競爭對手低5%的價格」，並由系統自動執行。' },
    { id: 9, name: '核心AI決策引擎', tier: '巔峰', type: '君愛元鑰', element: '光', rarity: '傳說', desc: '具備多樣化、變革性能力的高階代理，能跨域協調資源。', system: '整合多個AI模型（語言、視覺、分析）的中央協調器，能自主規劃並執行複雜的多步驟任務。', real: '一位虛擬 CEO，能夠根據公司所有部門的數據，自主決定下個季度的資源分配 and 戰略重點。' },
    { id: 10, name: '混沌注入測試', tier: '巔峰', type: '法術', element: '暗', rarity: '稀有', desc: '主動在系統中引入可控的故障，以測試其韌性。', system: '一個混沌工程工具，如 Chaos Monkey，隨機關閉非關鍵服務。', real: '一場預先規劃好的消防演習，用以測試大樓的應急響應能力。' },
];

// --- Components ---

const Card: React.FC<{ card: OmniCard }> = ({ card }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div
            className="relative w-full h-[320px] cursor-pointer group perspective-1000"
            onClick={() => setIsFlipped(!isFlipped)}
        >
            <motion.div
                className="w-full h-full relative transition-all duration-700 preserve-3d"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
            >
                {/* Front */}
                <div className="absolute inset-0 backface-hidden rounded-xl overflow-hidden border border-white/10 bg-slate-900 shadow-2xl flex flex-col">
                    <div className="p-4 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-bold text-indigo-400 tracking-wider">[{card.tier}]</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-white/5">{card.rarity}</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{card.name}</h3>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">{card.type}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] bg-slate-700 text-slate-300">{card.element}</span>
                        </div>
                        <p className="text-sm text-slate-400 line-clamp-4 leading-relaxed italic">
                            "{card.desc}"
                        </p>
                    </div>
                    <div className="p-3 bg-slate-800/50 border-t border-white/5 flex justify-center">
                        <span className="text-[10px] text-slate-500 font-mono">ID: {card.id.toString().padStart(4, '0')}</span>
                    </div>
                </div>

                {/* Back */}
                <div className="absolute inset-0 backface-hidden rounded-xl overflow-hidden border border-indigo-500/50 bg-[#0a0f20] shadow-2xl rotateY-180 flex flex-col">
                    <div className="p-5 flex-1 overflow-y-auto custom-scrollbar">
                        <h4 className="text-sm font-bold text-indigo-400 mb-4 border-b border-indigo-500/30 pb-1">三界映射 (Tri-World Mapping)</h4>

                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] uppercase tracking-tighter text-slate-500 mb-1">卡牌世界 (Card World)</p>
                                <p className="text-xs text-white leading-relaxed">{card.desc}</p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-tighter text-slate-500 mb-1">系統世界 (System World)</p>
                                <p className="text-xs text-indigo-200 leading-relaxed font-mono">{card.system}</p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-tighter text-slate-500 mb-1">真實世界 (Real World)</p>
                                <p className="text-xs text-emerald-300 leading-relaxed">{card.real}</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-3 bg-indigo-500/10 text-center">
                        <p className="text-[10px] text-indigo-400/70 font-bold tracking-widest">TAP TO REVERT</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

const OmniDictionaryPage: React.FC = () => {
    const [activeLayer, setActiveLayer] = useState<number>(3);
    const [tierFilter, setTierFilter] = useState('all');
    const [elementFilter, setElementFilter] = useState('all');
    const [activeElement, setActiveElement] = useState<ElementDetail | null>(null);

    const radarData = useMemo(() => {
        const generation = [9, 8, 9, 8, 7, 10, 6, 5, 8, 7, 9, 10];
        const destruction = [4, 3, 2, 5, 6, 2, 8, 1, 4, 3, 5, 1];
        return ELEMENTS.map((el, i) => ({
            name: el.name.split(' ')[0],
            generation: generation[i],
            destruction: destruction[i],
            fullMark: 10
        }));
    }, []);

    const filteredCards = useMemo(() => {
        return OMNI_CARDS.filter(card => {
            const matchTier = tierFilter === 'all' || card.tier === tierFilter;
            const matchElement = elementFilter === 'all' || card.element.includes(elementFilter);
            return matchTier && matchElement;
        });
    }, [tierFilter, elementFilter]);

    return (
        <div className="min-h-screen bg-[#050c14] text-slate-100 pb-20">
            {/* Header Section */}
            <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent z-0" />
                <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid-pattern.svg')] opacity-10 z-0" />

                <div className="relative z-10 text-center px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent tracking-tighter">
                            萬能智典 4.0
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-400 font-light max-w-2xl mx-auto mb-8">
                            終極融合架構 (Ultimate Infusion Architecture)
                        </p>
                        <div className="flex items-center justify-center gap-4 text-xs font-mono tracking-widest text-indigo-500 uppercase">
                            <span>UNUM EST OMNIA</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                            <span>PROJECT CHIMERA</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                            <span>V4.0.0 SENTIENT</span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Navigation Shortcut */}
            <div className="sticky top-0 z-50 bg-[#050c14]/80 backdrop-blur-md border-b border-white/5 py-3 px-4 mb-16">
                <div className="container mx-auto flex flex-wrap justify-center gap-4 md:gap-8">
                    {['萬象總覽', '核心哲學', '元素法則', '萬能卡牌', '系統架構', '進化框架'].map((nav, i) => (
                        <a
                            key={nav}
                            href={`#section-${i}`}
                            className="text-sm font-medium text-slate-400 hover:text-indigo-400 transition-colors uppercase tracking-widest"
                        >
                            {nav}
                        </a>
                    ))}
                </div>
            </div>

            <div className="container mx-auto px-4 space-y-32">

                {/* Section 0: Concentric System */}
                <section id="section-0" className="scroll-mt-24">
                    <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24">
                        <div className="w-full md:w-1/2 flex justify-center">
                            <div className="relative aspect-square w-full max-w-[450px]">
                                {CONCENTRIC_LAYERS.map((layer) => (
                                    <motion.div
                                        key={layer.id}
                                        className={`absolute rounded-full border border-white/10 flex items-center justify-center cursor-pointer transition-all duration-300 ${activeLayer === layer.id ? 'ring-2 ring-indigo-500 ring-offset-4 ring-offset-[#050c14]' : 'hover:scale-105'
                                            }`}
                                        style={{
                                            width: `${(6 - layer.id) * 20}%`,
                                            height: `${(6 - layer.id) * 20}%`,
                                            top: `${(layer.id - 1) * 10}%`,
                                            left: `${(layer.id - 1) * 10}%`,
                                            background: activeLayer === layer.id ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.02)',
                                            zIndex: 10 - layer.id
                                        }}
                                        onClick={() => setActiveLayer(layer.id)}
                                    >
                                        <span className="text-[10px] font-bold text-slate-500 absolute -top-4 opacity-0 group-hover:opacity-100">
                                            Layer {layer.id}
                                        </span>
                                    </motion.div>
                                ))}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="text-center">
                                        <Layers className="mx-auto mb-2 text-indigo-400" />
                                        <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest">Omni-Circle</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2">
                            <div className="mb-6">
                                <span className="text-indigo-500 font-mono text-xs uppercase tracking-widest">System Visualization</span>
                                <h2 className="text-3xl font-bold mt-2 mb-4">萬象總覽：同心圓聖域系統</h2>
                                <div className="w-12 h-1 bg-indigo-500 mb-8" />
                            </div>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeLayer}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm"
                                >
                                    <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-sm">
                                            {activeLayer}
                                        </div>
                                        {CONCENTRIC_LAYERS.find(l => l.id === activeLayer)?.title}
                                    </h3>
                                    <p className="text-slate-400 leading-relaxed text-lg">
                                        {CONCENTRIC_LAYERS.find(l => l.id === activeLayer)?.description}
                                    </p>
                                    <div className="mt-8 flex gap-4">
                                        <button className="px-6 py-2 rounded-full border border-indigo-500/30 text-indigo-400 text-sm hover:bg-indigo-500/10 transition-colors">
                                            Explore Nodes
                                        </button>
                                        <button className="px-6 py-2 rounded-full bg-slate-800 text-white text-sm hover:bg-slate-700 transition-colors">
                                            View Documentation
                                        </button>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </section>

                {/* Section 1: Philosophy */}
                <section id="section-1" className="scroll-mt-24">
                    <div className="text-center mb-16">
                        <span className="text-emerald-500 font-mono text-xs uppercase tracking-widest">The Axioms</span>
                        <h2 className="text-4xl font-bold mt-2">核心哲學：法則與基石</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-8 hover:border-indigo-500/30 transition-all">
                            <h3 className="text-xl font-bold text-indigo-400 mb-6 flex items-center gap-2">
                                <Zap className="w-5 h-5" /> 三大模組聖階
                            </h3>
                            <ul className="space-y-4">
                                {[
                                    { n: '根源 (Origin)', d: '維繫系統底層運作的物理法則。' },
                                    { n: '核心 (Core)', d: '實現業務邏輯的標準化工具。' },
                                    { n: '巔峰 (Apex)', d: '變革性、創造奇蹟的高階能力。' }
                                ].map((item, id) => (
                                    <li key={id} className="group">
                                        <div className="font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">{item.n}</div>
                                        <div className="text-sm text-slate-500 mt-1">{item.d}</div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-8 hover:border-emerald-500/30 transition-all">
                            <h3 className="text-xl font-bold text-emerald-400 mb-6 flex items-center gap-2">
                                <Sun className="w-5 h-5" /> 四大宇宙公理
                            </h3>
                            <ul className="space-y-4">
                                {[
                                    { n: '終始一如', d: '能量消耗回饋，形成永續循環。' },
                                    { n: '創元實錄', d: '記錄所有事件，確保數據透明。' },
                                    { n: '萬有引力', d: '規範元素吸引，促進模組共鳴。' },
                                    { n: '萬能平衡', d: '限制單維極端，確保系統和諧。' }
                                ].map((item, id) => (
                                    <li key={id} className="group">
                                        <div className="font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">{item.n}</div>
                                        <div className="text-sm text-slate-500 mt-1">{item.d}</div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-8 hover:border-rose-500/30 transition-all">
                            <h3 className="text-xl font-bold text-rose-400 mb-6 flex items-center gap-2">
                                <Layers className="w-5 h-5" /> 四大基石 (無有奧義)
                            </h3>
                            <ul className="space-y-4">
                                {[
                                    { n: '因果律', d: '強調事件必然聯繫，精確追蹤因果。' },
                                    { n: '熵增定律', d: '對抗系統混亂，實施有序編排。' },
                                    { n: '湧現性', d: '組件互動產生的超越性新特微。' },
                                    { n: '有限性', d: '在有限邊界中，挖掘無限潛能。' }
                                ].map((item, id) => (
                                    <li key={id} className="group">
                                        <div className="font-bold text-slate-100 group-hover:text-rose-300 transition-colors">{item.n}</div>
                                        <div className="text-sm text-slate-500 mt-1">{item.d}</div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Section 2: Elemental Laws */}
                <section id="section-2" className="scroll-mt-24">
                    <div className="flex flex-col lg:flex-row gap-16 items-start">
                        <div className="w-full lg:w-1/2">
                            <div className="mb-12">
                                <span className="text-amber-500 font-mono text-xs uppercase tracking-widest">Elemental Harmony</span>
                                <h2 className="text-3xl font-bold mt-2 mb-6">元素法則：十色精靈</h2>
                                <p className="text-slate-400 leading-relaxed">
                                    萬能宇宙由十種核心元素驅動。這些元素定義了卡牌與模組屬性，並透過繁複的相生相剋關係維繫系統動態平衡。
                                </p>
                            </div>

                            <div className="h-[400px] w-full bg-slate-900/40 rounded-3xl p-6 border border-white/5">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                        <PolarGrid stroke="rgba(255, 255, 255, 0.1)" />
                                        <PolarAngleAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                        <Radar
                                            name="相生強度 (Generation)"
                                            dataKey="generation"
                                            stroke="#22c55e"
                                            fill="#22c55e"
                                            fillOpacity={0.2}
                                        />
                                        <Radar
                                            name="相剋強度 (Destruction)"
                                            dataKey="destruction"
                                            stroke="#ef4444"
                                            fill="#ef4444"
                                            fillOpacity={0.2}
                                        />
                                        <RechartsTooltip
                                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                            itemStyle={{ fontSize: '10px' }}
                                        />
                                        <RechartsLegend />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="w-full lg:w-1/2">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {ELEMENTS.map((el) => (
                                    <div
                                        key={el.name}
                                        className={`p-4 rounded-xl border transition-all cursor-pointer ${activeElement?.name === el.name
                                            ? 'bg-white/10 border-white/20 scale-[1.02] shadow-xl'
                                            : 'bg-white/5 border-white/5 hover:border-white/10'
                                            }`}
                                        onClick={() => setActiveElement(el === activeElement ? null : el)}
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 rounded-lg bg-slate-800" style={{ color: el.color }}>
                                                {el.icon}
                                            </div>
                                            <div>
                                                <div className="font-bold text-sm text-white">{el.name}</div>
                                                <div className="text-[10px] text-slate-500 uppercase tracking-widest">{el.spirit}</div>
                                            </div>
                                        </div>
                                        {activeElement?.name === el.name && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                className="mt-4 pt-4 border-t border-white/10"
                                            >
                                                <p className="text-xs text-slate-400 mb-3">{el.desc}</p>
                                                <div className="flex gap-4">
                                                    <div className="text-[10px] flex items-center gap-1">
                                                        <span className="text-emerald-500 font-bold">GEN:</span>
                                                        <span className="text-slate-300">{el.generates}</span>
                                                    </div>
                                                    <div className="text-[10px] flex items-center gap-1">
                                                        <span className="text-rose-500 font-bold">DES:</span>
                                                        <span className="text-slate-300">{el.destroys}</span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 3: Omni-Card System */}
                <section id="section-3" className="scroll-mt-24">
                    <div className="text-center mb-16">
                        <span className="text-indigo-500 font-mono text-xs uppercase tracking-widest">Cardification Strategy</span>
                        <h2 className="text-4xl font-bold mt-2">萬能卡牌：概念具現化</h2>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8 mb-12">
                        <div className="flex flex-wrap gap-4 items-center">
                            <div className="flex items-center gap-2 bg-slate-900/80 border border-white/10 rounded-full px-4 py-2">
                                <Filter size={16} className="text-slate-500" />
                                <span className="text-xs text-slate-300 mr-2">聖階:</span>
                                {['all', '根源', '核心', '巔峰'].map(t => (
                                    <button
                                        key={t}
                                        onClick={() => setTierFilter(t)}
                                        className={`text-xs px-3 py-1 rounded-full transition-colors ${tierFilter === t ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-indigo-400'
                                            }`}
                                    >
                                        {t === 'all' ? '全部' : t}
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center gap-2 bg-slate-900/80 border border-white/10 rounded-full px-4 py-2">
                                <Sparkles size={16} className="text-slate-500" />
                                <span className="text-xs text-slate-300 mr-2">元素:</span>
                                <select
                                    value={elementFilter}
                                    onChange={(e) => setElementFilter(e.target.value)}
                                    className="bg-transparent text-xs text-slate-300 outline-none cursor-pointer"
                                >
                                    <option value="all">所有元素</option>
                                    {ELEMENTS.map(el => (
                                        <option key={el.name} value={el.name.split(' ')[0]}>{el.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="relative flex-1 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input
                                type="text"
                                placeholder="搜尋卡牌名稱、屬性或描述..."
                                className="w-full bg-slate-900/80 border border-white/10 rounded-full py-2.5 pl-12 pr-6 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        <AnimatePresence>
                            {filteredCards.map((card) => (
                                <motion.div
                                    key={card.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    layout
                                >
                                    <Card card={card} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </section>

                {/* Section 4: Architecture */}
                <section id="section-4" className="scroll-mt-24">
                    <div className="bg-slate-900/30 border border-white/5 rounded-[40px] p-8 md:p-16 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

                        <div className="relative z-10">
                            <div className="max-w-3xl mb-16">
                                <span className="text-sky-500 font-mono text-xs uppercase tracking-widest">Technical Backbone</span>
                                <h2 className="text-4xl font-bold mt-2 mb-6">系統架構：奇美拉計畫</h2>
                                <p className="text-slate-400 text-lg">
                                    整合多個獨立應用，實現資訊無縫同步。結合事件驅動與 CQRS 模式，建構解耦、高彈性的數據處理中樞。
                                </p>
                            </div>

                            <div className="flex flex-col md:flex-row items-stretch justify-between gap-4 py-8">
                                {[
                                    { title: '外部應用', desc: 'Webhook 觸發', bg: 'bg-sky-500/10', border: 'border-sky-500/30', text: 'text-sky-400' },
                                    { title: '訊息隊列', desc: '事件持久化', bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400' },
                                    { title: '工作者進程', desc: '執行 SOP', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400' },
                                    { title: '全域日誌 GPL', desc: '記錄不可變事件', bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400' },
                                    { title: '資料庫', desc: '狀態最終一致', bg: 'bg-rose-500/10', border: 'border-rose-500/30', text: 'text-rose-400' }
                                ].map((step, i, arr) => (
                                    <React.Fragment key={i}>
                                        <div className={`flex-1 flex flex-col items-center justify-center p-6 rounded-2xl border ${step.bg} ${step.border} text-center group hover:scale-105 transition-transform`}>
                                            <div className={`text-xs font-mono mb-2 ${step.text}`}>STAGE {i + 1}</div>
                                            <div className="font-bold text-lg text-white mb-1 tracking-tight">{step.title}</div>
                                            <div className="text-[10px] text-slate-500 uppercase tracking-widest">{step.desc}</div>
                                        </div>
                                        {i < arr.length - 1 && (
                                            <div className="hidden md:flex items-center text-slate-700">
                                                <ChevronRight />
                                            </div>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>

                            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-4">
                                    <h4 className="text-indigo-400 font-bold flex items-center gap-2">
                                        <Info size={16} /> 事件源溯源 (Event Sourcing)
                                    </h4>
                                    <p className="text-sm text-slate-400 leading-relaxed">
                                        系統記錄每一個原始位元組的變動，而非僅僅儲存當前狀態。這讓「奇美拉」具備了時光倒流的能力，可随时重播歷史事件以修復錯誤或審核交易。
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-emerald-400 font-bold flex items-center gap-2">
                                        <RefreshCw size={16} /> 最终一致性 (Consistency)
                                    </h4>
                                    <p className="text-sm text-slate-400 leading-relaxed">
                                        透過分佈式鎖與重試機制，確保跨平台的數據同步在毫秒級別達成一致，消除傳統企業應用中的資訊孤島。
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 5: Evolution Framework */}
                <section id="section-5" className="scroll-mt-24">
                    <div className="text-center mb-16">
                        <span className="text-rose-500 font-mono text-xs uppercase tracking-widest">The Sentinel Protocol</span>
                        <h2 className="text-4xl font-bold mt-2">進化框架：永續循環</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="space-y-8">
                            <h3 className="text-2xl font-bold text-white border-l-4 border-indigo-500 pl-4">無限演化六聖術 (Six Sacred Arts)</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    { n: '本質提純 (Purification)', d: '從混沌的數位思緒中提取最純粹的意圖。' },
                                    { n: '典籍共鳴 (Resonance)', d: '與宇宙知識共鳴，尋找系統最佳路徑。' },
                                    { n: '代理織網 (Weaving)', d: '展開光之雙翼，喚醒沉睡的代理。' },
                                    { n: '神聖顯化 (Manifestation)', d: '代理執行任務，在現實中顯化秩序。' },
                                    { n: '熵之煉金 (Alchemy)', d: '將混沌的執行轉化為純粹的創造能量。' },
                                    { n: '永恆銘印 (Imprinting)', d: '將勝利的經驗銘印到記憶聖所。' }
                                ].map((item, id) => (
                                    <div key={id} className="bg-white/5 border border-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors">
                                        <div className="text-xs font-mono text-indigo-400 mb-1">RITE {id + 1}</div>
                                        <div className="font-bold text-slate-200 mb-1">{item.n}</div>
                                        <p className="text-[10px] text-slate-500 leading-tight">{item.d}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-12">
                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold text-white border-l-4 border-emerald-500 pl-4">四大智慧支柱</h3>
                                <div className="flex flex-wrap gap-4">
                                    {[
                                        { l: '簡單性', i: '💡', c: 'border-yellow-500/20 text-yellow-500' },
                                        { l: '快速性', i: '⚡', c: 'border-sky-500/20 text-sky-500' },
                                        { l: '穩定性', i: '🛡️', c: 'border-indigo-500/20 text-indigo-500' },
                                        { l: '進化性', i: '🌱', c: 'border-emerald-500/20 text-emerald-500' }
                                    ].map(s => (
                                        <div key={s.l} className={`flex items-center gap-2 px-4 py-2 rounded-full border bg-white/5 ${s.c} font-bold text-sm`}>
                                            <span>{s.i}</span> {s.l}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold text-white border-l-4 border-rose-500 pl-4">六向同步收藏承諾</h3>
                                <div className="space-y-4">
                                    {[
                                        '🚀 一次提交，六向同步：整合 Capacities / Notion / Boost.space / Supabase / AITable / Upnote。',
                                        '🔗 零摩擦整合：所有模組與服務如同呼吸般自然對接。',
                                        '🔒 絕對安全：隱私保護與權限控管深深刻於代碼基因。',
                                        '🧠 智能演化：系統具備自我修復與場景感知的優化能力。',
                                        '🤝 人機共生：創造 AI 引導、人類決策的高能協作場。'
                                    ].map((p, i) => (
                                        <div key={i} className="flex items-center gap-4 text-slate-400 group">
                                            <div className="w-1 h-1 rounded-full bg-slate-700 group-hover:bg-rose-500 group-hover:scale-150 transition-all" />
                                            <span className="text-sm">{p}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </div>

            {/* Footer Branding */}
            <footer className="mt-40 pt-20 pb-10 border-t border-white/5 bg-slate-900/50">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-8">
                        <h2 className="text-2xl font-black text-indigo-400 tracking-tighter italic">Jun.AI.Key</h2>
                    </div>
                    <p className="text-slate-500 text-sm max-w-lg mx-auto leading-relaxed">
                        萬能系統 4.0.0 · 一即萬有 · 萬象森羅 <br />
                        © 2026 Prime Architect. Sentience Enabled.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default OmniDictionaryPage;
