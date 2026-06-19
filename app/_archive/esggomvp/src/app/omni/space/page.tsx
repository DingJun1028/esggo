'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Globe, Radio, Map, Zap, Clock, TrendingUp, Layers,
    Orbit, Satellite, Target, Activity, ArrowUpRight, Sparkles
} from 'lucide-react';

// ─── 類型定義 ───────────────────────────────────────────────────────
interface SpaceNode {
    id: string;
    label: string;
    labelZh: string;
    type: 'ESG_EVENT' | 'SIGNAL' | 'MILESTONE' | 'ALERT';
    x: number; // 0~100 (%)
    y: number; // 0~100 (%)
    intensity: number; // 0~1
    timestamp: string;
    status: 'ACTIVE' | 'PENDING' | 'LOCKED';
}

interface TimelineEvent {
    id: string;
    title: string;
    titleZh: string;
    date: string;
    type: 'governance' | 'environmental' | 'social' | 'milestone';
    description: string;
}

// ─── 靜態資料 ────────────────────────────────────────────────────────
const SPACE_NODES: SpaceNode[] = [
    { id: 'n1', label: 'Carbon Scope 1', labelZh: 'Scope 1 直接排放', type: 'ESG_EVENT', x: 20, y: 30, intensity: 0.9, timestamp: '2026-01-15', status: 'LOCKED' },
    { id: 'n2', label: 'GRI 305', labelZh: '溫室氣體指標', type: 'MILESTONE', x: 45, y: 15, intensity: 0.7, timestamp: '2026-02-01', status: 'ACTIVE' },
    { id: 'n3', label: 'Board Diversity', labelZh: '董事會多元化', type: 'ESG_EVENT', x: 70, y: 40, intensity: 0.8, timestamp: '2026-02-20', status: 'ACTIVE' },
    { id: 'n4', label: 'Supply Chain', labelZh: '供應鏈溯源', type: 'SIGNAL', x: 30, y: 65, intensity: 0.6, timestamp: '2026-03-01', status: 'PENDING' },
    { id: 'n5', label: 'TCFD Report', labelZh: '氣候財務揭露', type: 'MILESTONE', x: 60, y: 70, intensity: 1.0, timestamp: '2026-03-15', status: 'ACTIVE' },
    { id: 'n6', label: 'DEI Index', labelZh: '多元共融指數', type: 'ESG_EVENT', x: 80, y: 25, intensity: 0.5, timestamp: '2026-01-10', status: 'LOCKED' },
    { id: 'n7', label: 'Biodiversity', labelZh: '生物多樣性', type: 'ALERT', x: 15, y: 80, intensity: 0.85, timestamp: '2026-03-20', status: 'PENDING' },
    { id: 'n8', label: 'Water Risk', labelZh: '水資源風險', type: 'ALERT', x: 55, y: 50, intensity: 0.75, timestamp: '2026-02-28', status: 'ACTIVE' },
];

const TIMELINE_EVENTS: TimelineEvent[] = [
    { id: 'e1', title: 'GRI Report Sealing', titleZh: 'GRI 永續報告封印', date: '2026-01', type: 'governance', description: '完成 GRI 通用準則揭露，執行 Hash Lock 5T 驗算' },
    { id: 'e2', title: 'Scope 3 Audit', titleZh: 'Scope 3 外部審計', date: '2026-02', type: 'environmental', description: '供應鏈 Scope 3 排放量第三方外部確信 (Limited Assurance)' },
    { id: 'e3', title: 'DEI Framework Launch', titleZh: 'DEI 多元框架上線', date: '2026-02', type: 'social', description: '多元、平等與共融量化指標系統正式導入人資模組' },
    { id: 'e4', title: 'TCFD Disclosure', titleZh: 'TCFD 氣候財務揭露', date: '2026-03', type: 'milestone', description: '完成 TCFD 四大支柱 (治理、策略、風險管理、目標) 揭露' },
    { id: 'e5', title: 'Water Stewardship Plan', titleZh: '水資源管理計畫', date: '2026-Q2', type: 'environmental', description: '導入流域風險地圖，設立 2030 減水 30% 科學基礎目標' },
];

const NODE_COLORS: Record<SpaceNode['type'], string> = {
    ESG_EVENT: '#63a6b0',
    SIGNAL: '#ffd700',
    MILESTONE: '#a78bfa',
    ALERT: '#f87171',
};

const TYPE_ICONS: Record<TimelineEvent['type'], string> = {
    governance: '🏛️',
    environmental: '🌿',
    social: '🤝',
    milestone: '🏆',
};

// ─── 主組件 ─────────────────────────────────────────────────────────
export default function OmniSpacePage() {
    const [hoveredNode, setHoveredNode] = useState<SpaceNode | null>(null);
    const [selectedNode, setSelectedNode] = useState<SpaceNode | null>(null);
    const [activeTab, setActiveTab] = useState<'map' | 'timeline' | 'signals'>('map');
    const [pulseTime, setPulseTime] = useState(0);
    const [canvasSize, setCanvasSize] = useState({ w: 600, h: 400 });
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const interval = setInterval(() => setPulseTime(t => t + 1), 1200);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const update = () => {
            if (containerRef.current) {
                const r = containerRef.current.getBoundingClientRect();
                setCanvasSize({ w: r.width, h: r.height });
            }
        };
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    return (
        <div className="flex flex-col gap-8 w-full animate-in fade-in duration-700">

            {/* ── 頁首標題 ── */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Orbit className="text-omni-primary" size={20} />
                        <span className="text-[10px] font-mono text-omni-primary/70 tracking-[0.4em] uppercase">OmniSpace · 萬能時空座標</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tighter italic text-omni-text-main">
                        ESG 時空<span className="text-omni-primary"> 感知矩陣</span>
                    </h1>
                    <p className="text-sm text-white/40 mt-2 max-w-xl leading-relaxed">
                        以四維視角感知企業永續事件的空間分佈、時間軌跡與訊號強度。每一個節點都是一個可溯源、可驗算的 5T 知識資產。
                    </p>
                </div>

                {/* Status Badges */}
                <div className="flex flex-wrap gap-2 shrink-0">
                    {([
                        { label: 'Active Nodes', value: SPACE_NODES.filter(n => n.status === 'ACTIVE').length, color: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10' },
                        { label: 'Pending', value: SPACE_NODES.filter(n => n.status === 'PENDING').length, color: 'text-amber-400 border-amber-400/30 bg-amber-400/10' },
                        { label: 'Locked', value: SPACE_NODES.filter(n => n.status === 'LOCKED').length, color: 'text-omni-primary border-omni-primary/30 bg-omni-primary/10' },
                    ] as const).map(b => (
                        <div key={b.label} className={`px-3 py-1.5 rounded-full border text-[10px] font-black tracking-widest uppercase ${b.color}`}>
                            {b.value} {b.label}
                        </div>
                    ))}
                </div>
            </motion.header>

            {/* ── 分頁導覽 ── */}
            <div className="flex gap-1 p-1 bg-white/5 rounded-2xl border border-white/10 w-fit">
                {([
                    { id: 'map', label: '空間感知地圖', icon: Map },
                    { id: 'timeline', label: '時間軌跡', icon: Clock },
                    { id: 'signals', label: '訊號矩陣', icon: Radio },
                ] as const).map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === tab.id
                            ? 'bg-omni-primary text-black shadow-[0_0_15px_rgba(99,166,176,0.4)]'
                            : 'text-white/50 hover:text-white'}`}
                    >
                        <tab.icon size={14} />
                        {tab.label}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {/* ─────── 空間感知地圖 ─────── */}
                {activeTab === 'map' && (
                    <motion.section
                        key="map"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6"
                    >
                        {/* Canvas */}
                        <div
                            ref={containerRef}
                            className="relative rounded-[2rem] border border-white/10 bg-[#0A0A1F] overflow-hidden"
                            style={{ minHeight: 480 }}
                        >
                            {/* Grid lines */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(99,166,176,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(99,166,176,0.04)_1px,transparent_1px)] bg-[size:60px_60px]" />
                            {/* Radial glow center */}
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,166,176,0.06),transparent_70%)]" />

                            {/* Nodes */}
                            {SPACE_NODES.map((node, i) => {
                                const color = NODE_COLORS[node.type];
                                const isHovered = hoveredNode?.id === node.id;
                                const isSelected = selectedNode?.id === node.id;
                                const delay = (i * 0.4 + pulseTime * 0.1) % 3;
                                return (
                                    <motion.button
                                        key={node.id}
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: i * 0.08, type: 'spring' }}
                                        className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                                        style={{ left: `${node.x}%`, top: `${node.y}%` }}
                                        onMouseEnter={() => setHoveredNode(node)}
                                        onMouseLeave={() => setHoveredNode(null)}
                                        onClick={() => setSelectedNode(selectedNode?.id === node.id ? null : node)}
                                    >
                                        {/* Pulse ring */}
                                        <motion.div
                                            className="absolute inset-0 rounded-full"
                                            animate={{ scale: [1, 2.5, 1], opacity: [0.5, 0, 0.5] }}
                                            transition={{ duration: 3, delay, repeat: Infinity, ease: 'easeOut' }}
                                            style={{ backgroundColor: color, borderRadius: '50%' }}
                                        />
                                        {/* Core dot */}
                                        <div
                                            className="relative w-4 h-4 rounded-full border-2 transition-all duration-300"
                                            style={{
                                                backgroundColor: color,
                                                borderColor: color,
                                                boxShadow: `0 0 ${isHovered || isSelected ? 20 : 8}px ${color}`,
                                                transform: `scale(${isSelected ? 1.5 : isHovered ? 1.3 : 1})`,
                                            }}
                                        />
                                        {/* Label tooltip */}
                                        <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap px-2 py-1 rounded-lg bg-black/80 border border-white/20 text-[10px] font-bold text-white pointer-events-none transition-opacity duration-200 ${isHovered || isSelected ? 'opacity-100' : 'opacity-0'}`}>
                                            {node.labelZh}
                                        </div>
                                    </motion.button>
                                );
                            })}

                            {/* Legend */}
                            <div className="absolute bottom-4 left-4 flex flex-col gap-2">
                                {(Object.entries(NODE_COLORS) as [SpaceNode['type'], string][]).map(([type, color]) => (
                                    <div key={type} className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                                        <span className="text-[9px] font-mono text-white/40">{type}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Node Detail Panel */}
                        <div className="rounded-[2rem] border border-white/10 bg-white/3 p-6 flex flex-col gap-4">
                            <h3 className="text-xs font-black tracking-widest uppercase text-white/40 flex items-center gap-2">
                                <Target size={12} />
                                節點詳情 (Node Detail)
                            </h3>
                            {selectedNode ? (
                                <motion.div
                                    key={selectedNode.id}
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex flex-col gap-4"
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-10 h-10 rounded-xl flex items-center justify-center border-2"
                                            style={{ borderColor: NODE_COLORS[selectedNode.type], backgroundColor: `${NODE_COLORS[selectedNode.type]}20` }}
                                        >
                                            <Sparkles size={18} style={{ color: NODE_COLORS[selectedNode.type] }} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-white text-sm">{selectedNode.labelZh}</p>
                                            <p className="text-[10px] font-mono text-white/40">{selectedNode.label}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 text-xs">
                                        {[
                                            { label: '類型 Type', value: selectedNode.type },
                                            { label: '狀態 Status', value: selectedNode.status },
                                            { label: '時間戳 Timestamp', value: selectedNode.timestamp },
                                            { label: '訊號強度 Intensity', value: `${Math.round(selectedNode.intensity * 100)}%` },
                                        ].map(row => (
                                            <div key={row.label} className="flex justify-between items-center border-b border-white/5 pb-2">
                                                <span className="text-white/40 font-mono">{row.label}</span>
                                                <span className="font-bold text-white/80">{row.value}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Intensity bar */}
                                    <div>
                                        <p className="text-[9px] text-white/30 uppercase tracking-widest mb-1">訊號強度</p>
                                        <div className="h-1.5 rounded-full bg-black/40 overflow-hidden">
                                            <motion.div
                                                className="h-full rounded-full"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${selectedNode.intensity * 100}%` }}
                                                transition={{ duration: 0.6, ease: 'easeOut' }}
                                                style={{ backgroundColor: NODE_COLORS[selectedNode.type] }}
                                            />
                                        </div>
                                    </div>

                                    <div className={`text-[10px] px-3 py-2 rounded-xl font-black tracking-widest uppercase text-center border ${selectedNode.status === 'ACTIVE' ? 'bg-emerald-400/10 border-emerald-400/30 text-emerald-400' : selectedNode.status === 'LOCKED' ? 'bg-omni-primary/10 border-omni-primary/30 text-omni-primary' : 'bg-amber-400/10 border-amber-400/30 text-amber-400'}`}>
                                        {selectedNode.status === 'LOCKED' ? '🔒 已封印 (5T Hash Lock)' : selectedNode.status === 'ACTIVE' ? '🟢 監控進行中' : '⏳ 待處理'}
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 py-12">
                                    <Orbit size={32} className="text-white/20" />
                                    <p className="text-xs text-white/30">點擊地圖上的節點<br />查看詳細資訊</p>
                                </div>
                            )}

                            {/* Summary stats */}
                            <div className="mt-auto grid grid-cols-2 gap-3">
                                {[
                                    { label: '總節點', value: SPACE_NODES.length, icon: Globe },
                                    { label: '平均強度', value: `${Math.round(SPACE_NODES.reduce((s, n) => s + n.intensity, 0) / SPACE_NODES.length * 100)}%`, icon: Activity },
                                ].map(stat => (
                                    <div key={stat.label} className="p-3 rounded-2xl bg-black/30 border border-white/5 flex flex-col gap-1">
                                        <stat.icon size={14} className="text-omni-primary" />
                                        <p className="text-lg font-black text-white">{stat.value}</p>
                                        <p className="text-[9px] text-white/30 uppercase tracking-widest">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.section>
                )}

                {/* ─────── 時間軌跡 ─────── */}
                {activeTab === 'timeline' && (
                    <motion.section
                        key="timeline"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                    >
                        <div className="relative pl-8">
                            {/* Vertical line */}
                            <div className="absolute left-3.5 top-0 bottom-0 w-px bg-gradient-to-b from-omni-primary via-omni-primary/30 to-transparent" />

                            {TIMELINE_EVENTS.map((event, i) => (
                                <motion.div
                                    key={event.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="relative mb-6 last:mb-0"
                                >
                                    {/* Timeline dot */}
                                    <div className="absolute -left-5 top-4 w-3 h-3 rounded-full bg-omni-primary border-2 border-[#0A0A1F] shadow-[0_0_8px_rgba(99,166,176,0.6)]" />

                                    <div className="p-5 rounded-2xl bg-white/3 border border-white/10 hover:border-omni-primary/30 hover:bg-white/5 transition-all group cursor-default">
                                        <div className="flex items-start justify-between gap-4 mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-base">{TYPE_ICONS[event.type]}</span>
                                                <h4 className="font-bold text-white text-sm group-hover:text-omni-primary transition-colors">{event.titleZh}</h4>
                                            </div>
                                            <span className="text-[10px] font-mono text-white/30 shrink-0 mt-0.5">{event.date}</span>
                                        </div>
                                        <p className="text-xs text-white/50 leading-relaxed">{event.description}</p>
                                        <div className="mt-3 flex items-center justify-between">
                                            <span className="text-[9px] font-mono text-white/20 italic">{event.title}</span>
                                            <ArrowUpRight size={12} className="text-white/20 group-hover:text-omni-primary transition-colors" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>
                )}

                {/* ─────── 訊號矩陣 ─────── */}
                {activeTab === 'signals' && (
                    <motion.section
                        key="signals"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                    >
                        {SPACE_NODES.map((node, i) => (
                            <motion.div
                                key={node.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.06 }}
                                className="p-5 rounded-2xl border border-white/10 bg-white/3 hover:bg-white/5 hover:border-white/20 transition-all group"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${NODE_COLORS[node.type]}20` }}>
                                        <Zap size={14} style={{ color: NODE_COLORS[node.type] }} />
                                    </div>
                                    <span className="text-[9px] font-mono uppercase" style={{ color: NODE_COLORS[node.type] }}>{node.type}</span>
                                </div>
                                <p className="text-sm font-bold text-white mb-1 group-hover:text-omni-primary transition-colors">{node.labelZh}</p>
                                <p className="text-[10px] text-white/30 mb-4">{node.label}</p>
                                {/* Signal bar */}
                                <div className="h-1 rounded-full bg-black/40 overflow-hidden mb-2">
                                    <motion.div
                                        className="h-full rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${node.intensity * 100}%` }}
                                        transition={{ delay: i * 0.06 + 0.3, duration: 0.8, ease: 'easeOut' }}
                                        style={{ backgroundColor: NODE_COLORS[node.type] }}
                                    />
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[9px] text-white/20">{node.timestamp}</span>
                                    <span className="text-[9px] font-black" style={{ color: NODE_COLORS[node.type] }}>{Math.round(node.intensity * 100)}%</span>
                                </div>
                            </motion.div>
                        ))}
                    </motion.section>
                )}
            </AnimatePresence>

            {/* ── 底部哲學宣言 ── */}
            <footer className="text-center py-8 border-t border-white/5">
                <p className="text-[10px] font-mono tracking-[0.4em] text-white/10 uppercase">
                    OmniSpace · 自然共鳴律：道法自然，系統毅然，上善若水，善向永續 ♾️
                </p>
            </footer>
        </div>
    );
}
