"use client";

import React from "react";
import {
    ShieldCheck,
    Zap,
    BarChart3,
    Compass,
    Sparkles,
    CloudRain,
    Globe,
    LayoutGrid,
    TrendingUp,
    BrainCircuit
} from "lucide-react";
import { ChronoMatrix } from "@/app/src-center/components/ChronoMatrix";
import { OmniServicePath } from "./OmniServicePath";
import { KarmaDiagnostic } from "./KarmaDiagnostic";
import { TaskMatrix } from "./TaskMatrix";
import { KnowledgeTemple } from "./KnowledgeTemple";
import { OmniAvatar } from "@/components/omni/avatar/OmniAvatar";
import { useAvatarStore } from "@/core/omni-avatar-state";
import { SustainabilityVillage } from "./SustainabilityVillage";
import { QuestBoard } from "./QuestBoard";
import { CelestialArtifactCell } from "./CelestialArtifactCell";
import { CelestialLifecycleManager } from "@/core/celestial-lifecycle";
import { toast } from "sonner";
import { EvolutionEngine } from "@/core/evolution-engine";
import { RPGEngine } from "@/core/rpg-engine";
import { AlchemyEngine } from "@/core/alchemy-engine";

/**
 * 🏛️ SovereignDashboard - The Sentinel of InfoOne ESG
 * 
 * Bento-box layout consolidating all 24 MECE services and high-level strategy.
 * Features: Liquid Glass aesthetics, 5T Real-time monitoring, Dr. Thoth insights.
 */
export const SovereignDashboard: React.FC = () => {
    // 💎 Celestial Artifact State
    const [celestialArtifact, setCelestialArtifact] = React.useState<any>(null);
    const [alchemyState, setAlchemyState] = React.useState(AlchemyEngine.getState());
    const { avatar, initializeDefault } = useAvatarStore();

    React.useEffect(() => {
        if (!avatar) {
            initializeDefault();
        }
    }, [avatar, initializeDefault]);

    React.useEffect(() => {
        // Sync alchemy state
        const interval = setInterval(() => {
            setAlchemyState(AlchemyEngine.getState());
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    React.useEffect(() => {
        // Initial Forge (Async)
        const init = async () => {
            const initial = await CelestialLifecycleManager.forgeInit(
                { type: "ESG_STRATEGY", target: "Zero_Waste_2030" },
                "InfoOne_Genesis"
            );
            setCelestialArtifact(initial);
        };
        init();

        // Evolution Engine Audit (Deprecated for new Avatar system)
        // EvolutionEngine.auditEntropy("SovereignDashboard", 45);
    }, []);

    const handleTransfer = async () => {
        if (!celestialArtifact) return;
        const evolved = await CelestialLifecycleManager.onTransfer(
            celestialArtifact,
            "Berkeley_Academy",
            "User_Admin"
        );
        setCelestialArtifact(evolved);
    };

    const stats = [
        { label: "全域信任分 (5T)", val: "94.2", unit: "Score", icon: <ShieldCheck className="w-5 h-5 text-emerald-400" /> },
        { label: "當前等階 (LVL)", val: `${alchemyState.currentLevel}`, unit: "Rank", icon: <Zap className="w-5 h-5 text-amber-400" /> },
        { label: "AI 賦能達成率", val: "88", unit: "%", icon: <BrainCircuit className="w-5 h-5 text-[#63a6b0]" /> },
        { label: "已得成就數", val: `${alchemyState.unlockedAchievements.length}`, unit: "Ach", icon: <TrendingUp className="w-5 h-5 text-indigo-400" /> },
    ];

    const meceCategories = [
        { title: "環境卓越 (Environment)", color: "bg-emerald-400", count: 8 },
        { title: "社會影響 (Social)", color: "bg-indigo-400", count: 8 },
        { title: "治理永恆 (Governance)", color: "bg-slate-400", count: 8 },
    ];

    return (
        <div className="min-h-screen bg-[#F8FBFC] p-8 space-y-8 selection:bg-[#63a6b0]/20">
            {/* Dashboard Top Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                        <Compass className="w-8 h-8 text-[#63a6b0]" /> 智遠導師戰略儀表板
                    </h2>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Sovereign Mentor Dashboard v10.6</p>
                </div>
                <div className="flex gap-4">
                    <button className="bg-white border border-slate-200 px-4 py-2 rounded-2xl text-xs font-black shadow-sm hover:shadow-md transition-all flex items-center gap-2">
                        <Globe className="w-4 h-4 text-[#63a6b0]" /> 全球準則對齊: GRI/SASB
                    </button>
                    <div className="bg-[#63a6b0] text-white px-4 py-2 rounded-2xl text-xs font-black shadow-lg shadow-[#63a6b0]/20 flex items-center gap-2 animate-in fade-in slide-in-from-right-4">
                        <Sparkles className="w-4 h-4" /> Dr. Thoth Sentient Mode
                    </div>
                </div>
            </div>

            {/* Main Grid: Bento Box Style */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-stretch">

                {/* Left Column: Progress & Diagnostics (8/12) */}
                <div className="xl:col-span-8 space-y-8">

                    {/* 👤 Digital Avatar (Digital Agency) */}
                    {avatar && (
                        <OmniAvatar
                            avatar={avatar}
                            onAction={() => toast.info("切換至修煉場...")}
                        />
                    )}

                    {/* TopRow: Quick Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {stats.map((stat, i) => (
                            <div key={i} className="liquid-glass aura-pulse p-6 rounded-3xl flex flex-col gap-2 transition-all group cursor-default">
                                <div className="flex justify-between items-center relative z-10">
                                    <div className="p-2 bg-slate-50 rounded-xl group-hover:scale-110 transition-transform">
                                        {stat.icon}
                                    </div>
                                    <TrendingUp className="w-4 h-4 text-emerald-500 opacity-20" />
                                </div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                <p className="text-2xl font-black text-slate-800 flex items-baseline gap-1">
                                    {stat.val} <span className="text-xs text-slate-300">{stat.unit}</span>
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* 🏘️ Sustainability Village RPG Nexus */}
                    <SustainabilityVillage
                        state={RPGEngine.getVillage()}
                        scenario={RPGEngine.triggerScenario()}
                    />

                    {/* MiddleRow: Chrono Matrix & Insight */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <ChronoMatrix progress={91} />
                        <div className="liquid-glass aura-pulse rounded-3xl p-8 text-white relative overflow-hidden group">
                            <Sparkles className="absolute top-4 right-4 w-12 h-12 text-[#63a6b0] opacity-20 group-hover:opacity-40 transition-opacity" />
                            <div className="space-y-6 relative z-10">
                                <h4 className="text-sm font-black text-[#63a6b0] uppercase tracking-widest flex items-center gap-2">
                                    <BrainCircuit className="w-4 h-4" /> 導師智慧 (Dr. Thoth Insight)
                                </h4>
                                <p className="text-lg font-bold leading-relaxed">
                                    "當前 Alchemy 等階為 {alchemyState.currentLevel}。建議前往 Berkeley Academy 完成專業認證以獲取更多資產點。"
                                </p>
                                <div className="pt-4 flex gap-4">
                                    <button className="bg-[#63a6b0] px-6 py-2.5 rounded-xl font-bold text-xs hover:bg-[#4a8a94] transition-all">
                                        執行優先修復
                                    </button>
                                    <button className="bg-white/10 px-6 py-2.5 rounded-xl font-bold text-xs hover:bg-white/20 transition-all">
                                        查看完整建議集
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Task Matrix: Agent Network Life-cycle */}
                    <div className="bg-white border border-slate-100 rounded-4xl p-8 shadow-sm">
                        <TaskMatrix />
                    </div>
                </div>

                {/* Right Column: Service Matrix & Alerts (4/12) */}
                <div className="xl:col-span-4 space-y-8">

                    {/* MECE Service Matrix */}
                    <div className="bg-white rounded-4xl p-8 border border-slate-100 shadow-sm space-y-6">
                        <div className="flex justify-between items-center">
                            <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                                <LayoutGrid className="w-4 h-4 text-[#63a6b0]" /> 24 項 MECE 服務矩陣
                            </h4>
                            <span className="text-[10px] font-bold text-[#63a6b0] bg-[#63a6b0]/10 px-2 py-0.5 rounded">Sentient-Ready</span>
                        </div>

                        <div className="space-y-4">
                            {meceCategories.map((cat, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                                        <span>{cat.title}</span>
                                        <span>8 / 8 已啟動</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div className={`h-full ${cat.color} transition-all duration-1000`} style={{ width: "100%" }} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <OmniServicePath />
                    </div>

                    {/* 🏛️ Knowledge Temple (Learning Alchemy) */}
                    <KnowledgeTemple
                        ownedBadgeIds={['B1', 'B2']} // Mocking owned badges for initial view
                        userLevel={2}
                    />

                    {/* 📜 Quest Board (RPG Storyline) */}
                    <QuestBoard quests={RPGEngine.getQuests()} />

                    {/* 💎 Celestial Artifact (Liquid Glass) */}
                    {celestialArtifact && (
                        <div onClick={handleTransfer} className="cursor-pointer">
                            <CelestialArtifactCell artifact={celestialArtifact} />
                        </div>
                    )}

                    {/* 5T Protocol Live Flow */}
                    <div className="bg-[#63a6b0]/5 rounded-3xl p-6 border border-[#63a6b0]/10 border-dashed space-y-4">
                        <h4 className="text-[10px] font-black text-[#63a6b0] uppercase tracking-widest">5T Protocol Live Telemetry</h4>
                        <div className="space-y-3">
                            {[
                                { t: "Tangible", status: "Active", val: "98%" },
                                { t: "Traceable", status: "Verifying", val: "85%" },
                                { t: "Trackable", status: "Active", val: "100%" },
                                { t: "Transparent", status: "Active", val: "92%" },
                                { t: "Trustworthy", status: "Locked", val: "100%" }
                            ].map((item, i) => (
                                <div key={i} className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-600">{item.t}</span>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[9px] font-bold uppercase ${item.status === "Active" ? "text-emerald-500" : item.status === "Locked" ? "text-blue-500" : "text-amber-500"}`}>{item.status}</span>
                                        <span className="text-xs font-black text-slate-800">{item.val}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
