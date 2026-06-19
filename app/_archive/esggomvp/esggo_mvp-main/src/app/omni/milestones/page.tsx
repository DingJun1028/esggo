'use client';

import * as React from 'react';
import { OMNI_MODULES } from "@/config/omni-modules";
import { Calendar, Flag, Sparkles, RefreshCcw, LayoutGrid } from "lucide-react";
import { LiquidGlassContainer } from "@/components/omni/liquid-glass/LiquidGlassContainer";
import { motion, AnimatePresence } from "framer-motion";
import GanttChart from "@/components/charts/GanttChart";
import { OmniMangaTutorial } from "@/components/omni/UI/OmniMangaTutorial";

const MILESTONES_MANGA_PANELS = [
    {
        id: 1,
        src: '/assets/manga/milestones-panel-1.png',
        title: '戰略規劃',
        description: '定義長期永續願景，將宏大的目標拆解為可執行的階段性戰略。',
        pill: 'PLAN'
    },
    {
        id: 2,
        src: '/assets/manga/milestones-panel-2.png',
        title: '關鍵路徑',
        description: '視覺化演化甘特圖，識別影響進度的關鍵節點（Critical Path）。',
        pill: 'PATH'
    },
    {
        id: 3,
        src: '/assets/manga/milestones-panel-3.png',
        title: '5T 里程碑',
        description: '每一項任務的完成皆需通過 5T 協議查驗，確保証據鏈的完整性。',
        pill: 'PROOF'
    },
    {
        id: 4,
        src: '/assets/manga/milestones-panel-4.png',
        title: '淨零視界',
        description: '動態觀測轉型藍圖，穩定邁向淨零碳排（Net Zero）的「無邊」視界。',
        pill: 'HORIZON'
    }
];

export default function MilestonesPage() {
    const moduleInfo = OMNI_MODULES.MILESTONES;
    const [tasks, setTasks] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    const fetchGanttData = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/analytics/gantt');
            const result = await res.json();
            if (result.success) {
                setTasks(result.data);
            }
        } catch (err) {
            console.error("Failed to fetch milestone data", err);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchGanttData();
    }, []);

    return (
        <div className="flex flex-col gap-10 w-full animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20 relative">

            {/* Background Texture */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden bg-[#050C14]">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#63a6b0]/5 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#ffd700]/5 rounded-full blur-[120px]" />
            </div>

            {/* Header Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10 px-4">
                <div className="flex flex-col gap-3">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#63a6b0]/10 border border-[#63a6b0]/30 text-[10px] font-black tracking-[0.4em] uppercase text-[#63a6b0] w-fit shadow-[0_0_20px_rgba(99,166,176,0.2)]">
                        <Flag size={12} className="animate-pulse" />
                        {moduleInfo.domain} Evolution · {moduleInfo.uuid}
                    </div>
                    <h1 className="text-6xl font-black tracking-tighter italic text-omni-text-main uppercase leading-none">
                        Transformation <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#63a6b0] via-white to-[#ffd700]">Milestones</span>
                    </h1>
                    <p className="text-[#CBD5E1] text-sm font-medium max-w-2xl font-['Outfit'] opacity-80 pl-2 border-l-2 border-[#63a6b0]">
                        {moduleInfo.description} — 視覺化您的永續進化路徑，確保每一項承諾皆能如期顯化。
                    </p>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={fetchGanttData}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-[#63a6b0]/20 hover:border-[#63a6b0]/50 transition-all text-sm font-bold text-white group"
                    >
                        <RefreshCcw size={16} className={`${isLoading ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-700`} />
                        Synchronize
                    </button>
                </div>
            </div>

            {/* 📖 漫畫教學導引 - Global Manifestation */}
            <div className="relative z-10 px-4">
                <OmniMangaTutorial 
                    title="Transformation Milestones：演化路徑導引" 
                    subtitle="Visualizing the Journey to Net Zero" 
                    panels={MILESTONES_MANGA_PANELS} 
                />
            </div>

            {/* Matrix View */}
            <div className="grid grid-cols-1 gap-10 relative z-10 px-4">
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <div className="h-[500px] flex flex-col items-center justify-center gap-4 text-[#63a6b0]">
                            <motion.div
                                animate={{ scale: [1, 1.2, 1], rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="size-8 rounded-lg border-2 border-[#63a6b0] border-t-transparent"
                            />
                            <span className="text-[10px] font-black uppercase tracking-[0.5em]">Tuning Temporal Resonance...</span>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <GanttChart
                                title="Sustainability Evolution Roadmap 2026"
                                tasks={tasks}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <LiquidGlassContainer glowColor="aqua" className="p-8 flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <Sparkles size={20} className="text-[#63a6b0]" />
                            <h4 className="text-xs font-black uppercase tracking-widest text-white">Active Evolution</h4>
                        </div>
                        <div className="text-3xl font-black text-white italic">
                            {tasks.filter(t => t.status === 'Active').length} <span className="text-sm font-bold text-gray-500 not-italic">TASKS</span>
                        </div>
                        <p className="text-[10px] text-gray-400 font-medium">當前正在執行中的永續任務，需密切監控資源配置。</p>
                    </LiquidGlassContainer>

                    <LiquidGlassContainer glowColor="gold" className="p-8 flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <LayoutGrid size={20} className="text-[#ffd700]" />
                            <h4 className="text-xs font-black uppercase tracking-widest text-white">5T Mastery</h4>
                        </div>
                        <div className="text-3xl font-black text-[#ffd700] italic">
                            {tasks.filter(t => t.status === 'Completed').length} <span className="text-sm font-bold text-gray-500 not-italic">ARCHIEVED</span>
                        </div>
                        <p className="text-[10px] text-gray-400 font-medium">已完成並通過 5T 協議驗證的里程碑，已轉化為永恆資產。</p>
                    </LiquidGlassContainer>

                    <LiquidGlassContainer glowColor="ruby" className="p-8 flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <Calendar size={20} className="text-rose-400" />
                            <h4 className="text-xs font-black uppercase tracking-widest text-white">Next Milestone</h4>
                        </div>
                        <div className="text-xl font-black text-white truncate">
                            {tasks.find(t => t.status === 'Planned')?.name || 'None'}
                        </div>
                        <p className="text-[10px] text-gray-400 font-medium">即將到來的下一個轉型目標，請預先進行風險演算。</p>
                    </LiquidGlassContainer>
                </div>
            </div>

            {/* Navigation Aid */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex gap-4 px-6 py-3 rounded-full bg-black/80 border border-white/10 backdrop-blur-xl"
            >
                <div className="flex items-center gap-2 pr-4 border-r border-white/10">
                    <div className="size-2 bg-[#63a6b0] rounded-full shadow-[0_0_10px_#63a6b0]" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Milestone View</span>
                </div>
                <a href="/omni/bi-analytics" className="text-[10px] font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest">Analytics Center</a>
                <a href="/omni" className="text-[10px] font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest">Omni Hub</a>
            </motion.div>
        </div>
    );
}
