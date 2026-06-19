'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, MessageSquare, Book, Zap, ShieldCheck, PenTool, Save, Search, History, Settings, Send } from 'lucide-react';
import { useLanguage } from './LanguageProvider';
import { UserKnowledgeBase } from '@/core/user-knowledge-base';
import { useSpriteStore } from '@/core/omni-sprite-engine';
import { omniNexusTrinity } from '@/core/omni-nexus-trinity';

/**
 * Custom ESG SUNSHINE Logo (Flame-Drop shape with circle)
 */
const EsgSunshineLogo = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="aquaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8be9fd" />
                <stop offset="100%" stopColor="#63a6b0" />
            </linearGradient>
            <linearGradient id="goldGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffb86c" />
                <stop offset="100%" stopColor="#ffd700" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
        </defs>
        {/* Outer Aqua Flame */}
        <path d="M50 5 C 10 40, 10 70, 30 85 C 40 92, 50 95, 50 95 C 50 95, 30 70, 50 45 C 50 45, 55 35, 60 30 C 50 40, 45 60, 50 80 C 40 70, 35 55, 50 5"
            fill="url(#aquaGrad)" filter="url(#glow)" />
        {/* Inner Gold Flame */}
        <path d="M50 95 C 80 95, 95 70, 85 40 C 75 10, 50 5, 50 5 C 50 5, 75 30, 60 60 C 60 60, 55 70, 70 75 C 60 85, 50 95, 50 95"
            fill="url(#goldGrad)" filter="url(#glow)" />
        {/* Center Dot */}
        <circle cx="50" cy="70" r="8" fill="url(#goldGrad)" filter="url(#glow)" />
    </svg>
);


/**
 * 🗝️ JunAiKey (萬能光球 428 AI 代理精靈介面 / Omni-Sprite)
 */
export default function JunAiKey({ hideOrb = false }: { hideOrb?: boolean }) {
    // UI states
    const [isMenuExpanded, setIsMenuExpanded] = useState(false);
    const [activeTab, setActiveTab] = useState<'chat' | 'note' | 'gnosis' | 'settings' | null>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 }); // To control centering if activeTab is open

    const [julesKeyInput, setJulesKeyInput] = useState('');
    const [geminiKeyInput, setGeminiKeyInput] = useState('');
    const [isSettingsSaved, setIsSettingsSaved] = useState(false);
    const [noteTitle, setNoteTitle] = useState('');
    const [noteContent, setNoteContent] = useState('');
    const [isSaved, setIsSaved] = useState(false);
    const [gnosisQuery, setGnosisQuery] = useState('');

    const { t, locale } = useLanguage();
    const { mood, messages, addMessage, setMood } = useSpriteStore();
    const [chatInput, setChatInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Scroll chat to bottom
    useEffect(() => {
        if (scrollRef.current && activeTab === 'chat') {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, activeTab]);

    React.useEffect(() => {
        const toggleHandler = () => setIsMenuExpanded(prev => !prev);
        window.addEventListener('toggle-junaikey', toggleHandler);

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'm') {
                e.preventDefault();
                setIsMenuExpanded(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);

        if (typeof window !== 'undefined') {
            setJulesKeyInput(localStorage.getItem('JULES_API_KEY') || '');
            setGeminiKeyInput(localStorage.getItem('GEMINI_API_KEY') || '');
        }

        return () => {
            window.removeEventListener('toggle-junaikey', toggleHandler);
            window.removeEventListener('keydown', handleKeyDown);
        }
    }, []);

    const handleSaveSettings = () => {
        if (julesKeyInput) {
            import('@/lib/jules-client').then(m => m.julesClient.setApiKey(julesKeyInput));
        }
        if (geminiKeyInput) {
            import('@/core/GeminiService').then(m => m.GeminiService.setApiKey(geminiKeyInput));
        }
        setIsSettingsSaved(true);
        setTimeout(() => setIsSettingsSaved(false), 2000);
    };

    const handleSaveNote = async () => {
        if (!noteTitle || !noteContent) return;

        try {
            const { saveNoteAction } = await import('@/app/actions/jun-ai-actions');
            const atom = await saveNoteAction(noteTitle, noteContent);

            // 🧠 手動寫入本地內存（確保列表即時更新，不依賴全局重新整理）
            UserKnowledgeBase.distill(atom);

            setIsSaved(true);
            setTimeout(() => {
                setIsSaved(false);
                setNoteTitle('');
                setNoteContent('');
            }, 2000);
        } catch (error) {
            console.error('Failed to engrave note:', error);
        }
    };

    const [cloudAssets, setCloudAssets] = useState<any[]>([]);

    useEffect(() => {
        if (activeTab === 'gnosis') {
            fetch('/api/kb-recall')
                .then(res => res.json())
                .then(res => {
                    if (res.success) setCloudAssets(res.data);
                })
                .catch(err => console.error("Failed to load cloud assets:", err));
        }
    }, [activeTab]);

    const knowledgeAssets = useMemo(() => {
        const local = UserKnowledgeBase.getLibrary();
        // Merge local memory and cloud assets, ensuring no duplicates by UUID
        const merged = [...local];
        cloudAssets.forEach(ca => {
            if (!merged.find(l => l.uuid === ca.uuid)) {
                merged.push(ca);
            }
        });

        if (!gnosisQuery) return merged;
        return merged.filter(item =>
            item.payload?.title?.toLowerCase().includes(gnosisQuery.toLowerCase()) ||
            item.payload?.content?.toLowerCase().includes(gnosisQuery.toLowerCase())
        );
    }, [gnosisQuery, activeTab, cloudAssets]);

    const handleSend = async () => {
        if (!chatInput.trim() || isTyping) return;

        const userMsg = chatInput;
        setChatInput('');
        addMessage(userMsg, 'user');

        setIsTyping(true);
        setMood('thinking');

        try {
            const response = await omniNexusTrinity.dispatch('ask_jules', { prompt: userMsg });
            if (response.success) {
                addMessage(response.data as string, 'sprite');
            } else {
                addMessage('抱歉，我現在無法連結至智慧母體。', 'sprite');
            }
        } catch (error) {
            addMessage('量子通道不穩定，請稍後再試。', 'sprite');
        } finally {
            setIsTyping(false);
            setMood('idle');
        }
    };

    const handleQuickAction = (action: string) => {
        setChatInput(action);
        // Auto send could be added here if desired
    };


    const menuItems = [
        { id: 'chat', label: locale === 'zh-TW' ? '智能對話' : 'Chat', icon: MessageSquare, color: 'text-omni-primary', bg: 'bg-omni-primary/10', border: 'border-omni-primary/30' },
        { id: 'note', label: locale === 'zh-TW' ? '無作筆記' : 'Note', icon: PenTool, color: 'text-omni-accent', bg: 'bg-omni-accent/10', border: 'border-omni-accent/30' },
        { id: 'gnosis', label: locale === 'zh-TW' ? '萬能智庫' : 'Gnosis', icon: Book, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
        { id: 'settings', label: locale === 'zh-TW' ? '系統設定' : 'Settings', icon: Settings, color: 'text-indigo-500', bg: 'bg-indigo-500/10', border: 'border-indigo-500/30' },
    ] as const;

    const ORB_RADIUS = 36;
    const MENU_RADIUS = 90; // Distance of menu items from center

    return (
        <>
            {/* The Draggable Orb and Radial Menu — hidden if hideOrb is true */}
            {!hideOrb && (
                <motion.div
                className="hidden md:block fixed bottom-12 right-12 z-[100]"
                drag
                dragMomentum={false}
                dragConstraints={{ top: -2000, left: -2000, right: 2000, bottom: 2000 }}
            // If the user drags, we can optionally snap it or just let it float
            >
                <div className="relative">
                    {/* Radial Menu Items */}
                    <AnimatePresence>
                        {isMenuExpanded && !activeTab && menuItems.map((item, index) => {
                            // Calculate angle for radial distribution (top arc)
                            const angle = -Math.PI / 2 + (index - 1.5) * (Math.PI / 3.5);
                            const x = Math.cos(angle) * MENU_RADIUS;
                            const y = Math.sin(angle) * MENU_RADIUS;

                            return (
                                <motion.button
                                    key={item.id}
                                    initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                                    animate={{ opacity: 1, scale: 1, x, y }}
                                    exit={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20, delay: index * 0.05 }}
                                    onClick={(e) => { e.stopPropagation(); setActiveTab(item.id); }}
                                    className={`absolute flex flex-col items-center justify-center size-14 rounded-full border shadow-xl bg-white/90 dark:bg-black/90 backdrop-blur-md hover:scale-110 active:scale-95 transition-transform cursor-pointer ${item.color} ${item.bg} ${item.border}`}
                                    style={{ left: '50%', top: '50%', marginLeft: -28, marginTop: -28 }}
                                    onPointerDownCapture={(e) => e.stopPropagation()} // prevent drag conflict
                                >
                                    <item.icon size={20} />
                                </motion.button>
                            );
                        })}
                    </AnimatePresence>

                    {/* Center Light Orb */}
                    <motion.button
                        layoutId="omni-light-orb"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                            if (activeTab) {
                                setActiveTab(null);
                                setIsMenuExpanded(true);
                            } else {
                                setIsMenuExpanded(!isMenuExpanded);
                            }
                        }}
                        className={`size-[72px] rounded-full items-center justify-center shadow-2xl transition-all duration-500 relative flex border-2 border-transparent hover:border-omni-primary/50 cursor-move bg-[#0A0A1F]/30 backdrop-blur-sm`}
                    >
                        {/* Glow Behind */}
                        <div className="absolute inset-0 rounded-full bg-omni-primary/20 blur-xl animate-pulse" />

                        {/* Custom ESG SUNSHINE SVG */}
                        <EsgSunshineLogo className={`w-12 h-12 relative z-10 transition-transform duration-700 ${isMenuExpanded ? 'scale-110 drop-shadow-[0_0_15px_rgba(99,166,176,0.8)]' : ''}`} />

                        {/* "Close" state when active tab is open */}
                        <AnimatePresence>
                            {activeTab && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0 }}
                                    className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 shadow-md z-20 cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveTab(null);
                                    }}
                                >
                                    <X size={12} strokeWidth={3} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </div>
            </motion.div>
            )}


            {/* Expanded Active Tab Window (Centered) */}
            <AnimatePresence>
                {activeTab && (
                    <div className="fixed inset-0 pointer-events-none z-[90] flex items-center justify-center p-4">
                        {/* Backdrop to close */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setActiveTab(null)}
                            className="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-auto"
                        />

                        {/* Main Modal Window */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="w-full max-w-[420px] bg-[var(--theme-surface)] border border-omni-glass-border rounded-[2rem] shadow-2xl overflow-hidden flex flex-col h-[70vh] lg:h-[600px] pointer-events-auto"
                        >
                            {/* Window Header */}
                            <div className="p-5 bg-omni-primary-muted border-b border-omni-glass-border flex justify-between items-center shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-white shadow-sm ${menuItems.find(m => m.id === activeTab)?.color}`}>
                                        {React.createElement(menuItems.find(m => m.id === activeTab)?.icon || Sparkles, { size: 18 })}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm tracking-tight text-omni-text-main">{menuItems.find(m => m.id === activeTab)?.label}</h3>
                                        <p className="text-[10px] text-omni-primary uppercase tracking-widest font-black">Omni-Sprite Core</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setActiveTab(null)}
                                    className="p-1.5 bg-black/5 hover:bg-black/10 rounded-full transition-colors text-omni-text-muted"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Content */}
                            <div
                                ref={activeTab === 'chat' ? scrollRef : null}
                                className="flex-1 p-6 overflow-y-auto space-y-4 bg-transparent cursor-default scrollbar-hide"
                            >
                                {activeTab === 'chat' && (
                                    <div className="space-y-5">
                                        <div className="p-4 rounded-2xl bg-omni-surface-2 border border-omni-glass-border italic text-sm text-omni-text-sub font-medium">
                                            {t.ai.prompt || '我是您的萬能代理。您想了解 ESG 知識、分析報告還是管理筆記？'}
                                        </div>

                                        {/* 快捷路徑 (Quick Shortcuts) - Updated to be functional */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                onClick={() => handleQuickAction('請解析當前 5T 協議的合規標準')}
                                                className="p-4 rounded-2xl bg-omni-surface-2 border border-omni-glass-border hover:bg-omni-primary-muted hover:border-omni-primary/30 transition-all group flex flex-col items-center gap-2"
                                            >
                                                <ShieldCheck size={20} className="text-omni-primary" />
                                                <span className="text-[10px] font-black uppercase tracking-wider text-omni-text-main">5T Protocol</span>
                                            </button>
                                            <button
                                                onClick={() => handleQuickAction('幫我檢查 UCC 組件的顯化狀態')}
                                                className="p-4 rounded-2xl bg-omni-surface-2 border border-omni-glass-border hover:bg-omni-accent/10 hover:border-omni-accent/30 transition-all group flex flex-col items-center gap-2"
                                            >
                                                <Zap size={20} className="text-omni-accent" />
                                                <span className="text-[10px] font-black uppercase tracking-wider text-omni-text-main">UCC Engine</span>
                                            </button>
                                        </div>

                                        {messages.map((msg, i) => (
                                            <motion.div
                                                key={msg.id}
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                transition={{ delay: i * 0.05 }}
                                                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                                            >
                                                <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed font-medium shadow-sm ${msg.sender === 'user'
                                                    ? 'bg-omni-primary text-white rounded-tr-none'
                                                    : 'bg-omni-surface-2 border border-omni-glass-border text-omni-text-main rounded-tl-none'
                                                    }`}>
                                                    {msg.content}
                                                </div>
                                                <span className="text-[10px] font-black text-omni-text-muted uppercase mt-2 tracking-tighter opacity-70">
                                                    {msg.sender === 'user' ? 'Gnosis Seeker' : 'JunAiKey'} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </motion.div>
                                        ))}

                                        {isTyping && (
                                            <div className="flex items-center gap-3">
                                                <div className="flex gap-1">
                                                    {[0, 1, 2].map((i) => (
                                                        <motion.div
                                                            key={i}
                                                            animate={{ opacity: [0.2, 1, 0.2] }}
                                                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                                            className="w-1.5 h-1.5 rounded-full bg-omni-primary"
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-omni-primary animate-pulse">精靈正在調取智慧座標...</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'note' && (
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-omni-primary uppercase tracking-widest">Note Title</label>
                                            <input
                                                value={noteTitle}
                                                onChange={(e) => setNoteTitle(e.target.value)}
                                                placeholder={locale === 'zh-TW' ? '輸入筆記標題...' : 'Enter title...'}
                                                className="w-full bg-omni-surface-2 border border-omni-glass-border rounded-xl px-4 py-3 text-sm outline-none focus:border-omni-primary transition-all text-omni-text-main font-bold"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-omni-primary uppercase tracking-widest">Content Insight</label>
                                            <textarea
                                                value={noteContent}
                                                onChange={(e) => setNoteContent(e.target.value)}
                                                placeholder={locale === 'zh-TW' ? '在此記錄您的 ESG 洞察...' : 'Capture your ESG insights here...'}
                                                className="w-full h-40 bg-omni-surface-2 border border-omni-glass-border rounded-xl px-4 py-3 text-sm outline-none focus:border-omni-primary transition-all resize-none text-omni-text-main font-medium leading-relaxed"
                                            />
                                        </div>
                                        <button
                                            onClick={handleSaveNote}
                                            disabled={!noteTitle || !noteContent}
                                            className="w-full py-3 bg-omni-text-main text-white rounded-xl font-black text-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all disabled:opacity-30"
                                        >
                                            {isSaved ? <ShieldCheck size={18} /> : <Save size={18} />}
                                            {isSaved ? (locale === 'zh-TW' ? '已存入永恆宮殿' : 'Engraved in Eternal Palace') : (locale === 'zh-TW' ? '無作刻印 (Engrave)' : 'Engrave Note')}
                                        </button>
                                    </div>
                                )}

                                {activeTab === 'gnosis' && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 bg-omni-surface-2 border border-omni-glass-border rounded-full px-4 py-3 shadow-inner">
                                            <Search size={16} className="text-omni-text-muted" />
                                            <input
                                                value={gnosisQuery}
                                                onChange={(e) => setGnosisQuery(e.target.value)}
                                                placeholder={locale === 'zh-TW' ? '搜尋智慧資產...' : 'Search assets...'}
                                                className="bg-transparent border-none outline-none text-sm flex-1 text-omni-text-main font-bold"
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            {knowledgeAssets.length > 0 ? (
                                                knowledgeAssets.map((asset: any, i: number) => (
                                                    <motion.div
                                                        key={asset.uuid}
                                                        initial={{ opacity: 0, scale: 0.95 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ delay: i * 0.05 }}
                                                        className="p-4 rounded-2xl bg-omni-surface-2 border border-omni-glass-border hover:border-omni-primary/30 transition-all cursor-pointer group shadow-sm flex flex-col gap-2"
                                                    >
                                                        <div className="flex justify-between items-start">
                                                            <div className="flex flex-col gap-1">
                                                                <div className="flex items-center gap-1.5">
                                                                    <span className="text-[9px] font-black text-omni-primary uppercase tracking-tighter bg-omni-primary/10 px-1.5 py-0.5 rounded border border-omni-primary/20">
                                                                        {asset.uuid.slice(0, 13)}...
                                                                    </span>
                                                                    <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                                                                        <ShieldCheck size={8} /> 5T Sealed
                                                                    </span>
                                                                </div>
                                                                <h4 className="text-sm font-black text-omni-text-main group-hover:text-omni-primary transition-colors">{asset.payload?.title}</h4>
                                                            </div>
                                                            <History size={12} className="text-omni-text-muted transition-colors opacity-30 group-hover:opacity-100" />
                                                        </div>

                                                        <p className="text-xs text-omni-text-sub line-clamp-2 font-medium leading-relaxed">
                                                            {asset.payload?.content}
                                                        </p>

                                                        <div className="pt-2 border-t border-black/5 flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <div className="flex -space-x-1">
                                                                    {(asset.payload?.tags || []).slice(0, 3).map((tag: string, ti: number) => (
                                                                        <div key={ti} className="text-[8px] font-bold px-1.5 py-0.5 bg-black/5 rounded-full border border-black/5 text-gray-500 uppercase">
                                                                            {tag}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <span className="text-[8px] font-mono text-gray-400 opacity-50">
                                                                LOCK: {asset.signature?.slice(0, 8) || 'N/A'}
                                                            </span>
                                                        </div>

                                                        {asset.impactMetric && (
                                                            <div className="text-[8px] font-black italic text-omni-primary/70 tracking-tight">
                                                                Impact: {asset.impactMetric}
                                                            </div>
                                                        )}
                                                    </motion.div>
                                                ))
                                            ) : (
                                                <div className="flex flex-col items-center justify-center py-16 text-center opacity-30">
                                                    <Book size={48} className="text-omni-text-muted mb-4 opacity-50" />
                                                    <p className="text-xs uppercase font-black tracking-widest text-omni-text-main">Knowledge Temple is Empty</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'settings' && (
                                    <div className="space-y-6 pt-2">
                                        <div className="space-y-3">
                                            <label className="text-xs font-black text-omni-primary uppercase tracking-widest flex items-center gap-2">
                                                <Zap size={14} /> Jules API Key
                                            </label>
                                            <input
                                                type="password"
                                                value={julesKeyInput}
                                                onChange={(e) => setJulesKeyInput(e.target.value)}
                                                placeholder="AI Insight Configuration"
                                                className="w-full bg-omni-surface-2 border border-omni-glass-border rounded-xl px-4 py-3 text-sm outline-none focus:border-omni-primary transition-all text-omni-text-main font-mono"
                                            />
                                            <p className="text-[10px] text-omni-text-muted font-bold ml-1">Configures Jules omni-agent cause-effect repair.</p>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-xs font-black text-omni-primary uppercase tracking-widest flex items-center gap-2">
                                                <Sparkles size={14} /> Gemini API Key
                                            </label>
                                            <input
                                                type="password"
                                                value={geminiKeyInput}
                                                onChange={(e) => setGeminiKeyInput(e.target.value)}
                                                placeholder="Omni Core Configuration"
                                                className="w-full bg-omni-surface-2 border border-omni-glass-border rounded-xl px-4 py-3 text-sm outline-none focus:border-omni-primary transition-all text-omni-text-main font-mono"
                                            />
                                            <p className="text-[10px] text-omni-text-muted font-bold ml-1">Configures basic Omni-Sprite interactions.</p>
                                        </div>
                                        <button
                                            onClick={handleSaveSettings}
                                            className="w-full py-4 mt-8 bg-omni-primary text-white rounded-xl font-black text-base flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-omni-primary/30"
                                        >
                                            {isSettingsSaved ? <ShieldCheck size={20} /> : <Save size={20} />}
                                            {isSettingsSaved ? (locale === 'zh-TW' ? '設定已儲存 (Saved)' : 'Settings Saved') : (locale === 'zh-TW' ? '儲存設定 (Save)' : 'Save Settings')}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {activeTab === 'chat' && (
                                <div className="p-4 bg-[var(--theme-surface)] border-t border-omni-glass-border flex items-center gap-3 shrink-0">
                                    <input
                                        type="text"
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                        placeholder={locale === 'zh-TW' ? '與萬能光球對話...' : 'Chat with Omni-Sprite...'}
                                        className="flex-1 bg-omni-surface-2 border border-omni-glass-border rounded-full px-4 py-2.5 text-sm outline-none focus:border-omni-primary transition-all text-omni-text-main font-medium placeholder-omni-text-muted shadow-inner"
                                    />
                                    <button
                                        onClick={handleSend}
                                        disabled={!chatInput.trim() || isTyping}
                                        className="size-10 bg-omni-primary rounded-full flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-transform shadow-lg shadow-omni-primary/30 shrink-0 disabled:opacity-30 disabled:grayscale"
                                    >
                                        <Send size={18} />
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
