'use client';

import React, { useState, useEffect } from 'react';
import { LiquidGlassContainer } from "@/components/omni/liquid-glass/LiquidGlassContainer";
import { OMNI_MODULES } from "@/config/omni-modules";
import {
    Activity,
    BarChart3,
    Target,
    Zap,
    ShieldCheck,
    Globe,
    TrendingUp,
    ArrowUpRight,
    MousePointer2,
    Compass,
    Sparkles
} from "lucide-react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { OmniTable } from "@/components/omni/liquid-glass/OmniTable";
import { OmniImpactCalculator, type ImpactMetrics } from "@/core/omni-impact-calculator";
import { OmniMangaTutorial } from "@/components/omni/UI/OmniMangaTutorial";

const METRICS_MANGA_PANELS = [
    {
        id: 1,
        src: '/assets/manga/metrics-panel-1.png',
        title: '原始信號',
        description: '在數據森林中監測全球 ESG 基準數值，捕捉最微小的變動信號。',
        pill: 'SIGNALS'
    },
    {
        id: 2,
        src: '/assets/manga/metrics-panel-2.png',
        title: '深度透視',
        description: '透過 4D 透視引擎穿透表象，揭示每一個指標背後的 5T 驗證證據。',
        pill: 'DRILL'
    },
    {
        id: 3,
        src: '/assets/manga/metrics-panel-3.png',
        title: '稽核同步',
        description: '內外部稽核數據即時同步，確保透明度（Transparent）達到全球標準。',
        pill: 'SYNC'
    },
    {
        id: 4,
        src: '/assets/manga/metrics-panel-4.png',
        title: '戰略洞察',
        description: '將數據轉化為具備「超凡」（Transcendent）價值的未來轉型指引。',
        pill: 'INSIGHT'
    }
];

/**
 * 📊 ESG Metrics Dashboard (ESG 指標儀表板)
 * 
 * 升級版 Phase A：導入極致 3D 旋轉透視引擎與水晶球 (Crystal Ball) 光影特效。
 */
export default function MetricsDashboardPage() {
    const moduleInfo = OMNI_MODULES.METRICS_DASHBOARD;

    const [impact, setImpact] = useState<ImpactMetrics>({
        sroi: 4.2,
        carbonReduction: 12500,
        waterSaved: 85000,
        communityBeneficiaries: 45000,
        jobsCreated: 1200,
        carbonByYear: [],
        waterByYear: []
    });

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const calculator = OmniImpactCalculator.getInstance();
                // If getImpactMetrics doesn't exist, we fallback to dashboard data or mock
                const data = (calculator as any).getImpactMetrics ? await (calculator as any).getImpactMetrics() : impact;
                setImpact(data);
            } catch (error) {
                console.error("Failed to fetch impact metrics:", error);
            }
        };
        fetchMetrics();
    }, []);

    return (
        <div className="relative flex flex-col gap-10 w-full min-h-screen animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20 overflow-hidden">

            {/* 🌐 4D Crystal Core Background */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] pointer-events-none -z-10 opacity-30 mix-blend-screen">
                <motion.div
                    animate={{ rotateZ: 360, rotateX: [0, 20, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="w-full h-full rounded-full bg-gradient-to-tr from-cyan-500/50 via-purple-500/20 to-transparent blur-[120px]"
                />
            </div>

            {/* 🌟 Header Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="flex flex-col gap-2 relative z-10"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-omni-primary/10 border border-omni-primary/30 text-[10px] font-black tracking-[0.3em] uppercase text-omni-primary w-fit shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                    <Activity size={10} className="animate-pulse" />
                    {moduleInfo.domain} Core · {moduleInfo.uuid}
                </div>
                <h1 className="text-5xl font-black tracking-tighter italic text-omni-text-main uppercase drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                    ESG <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">METRICS</span> 3D HUB
                </h1>
                <p className="text-omni-text-muted text-sm font-medium max-w-2xl font-['Outfit']">
                    {moduleInfo.description} — 透過 4D 透視引擎展示全球 ESG 基準數值，猶如觀測水晶球般掌控全局。
                </p>
            </motion.div>

            {/* 📖 漫畫教學導引 - Global Manifestation */}
            <div className="relative z-10">
                <OmniMangaTutorial 
                    title="Metrics Dashboard：4D 洞察導引" 
                    subtitle="Real-time Hologram Observation" 
                    panels={METRICS_MANGA_PANELS} 
                />
            </div>

            {/* 📈 3D Key Indicators Stage */}
            <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                style={{ perspective: 1500 }}
                className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 mt-4"
            >
                <TiltCard
                    title="環境得分 (Env Score)"
                    value={impact.carbonReduction > 0 ? "88" : "84"}
                    unit="/100"
                    icon={Globe}
                    color="aqua"
                    trend="+4.2%"
                    description="Carbon intensity reduced by 12% YOY."
                />
                <TiltCard
                    title="社會貢獻 (Social Impact)"
                    value={(impact.communityBeneficiaries / 1000).toFixed(1)}
                    unit="k Pts"
                    icon={Target}
                    color="rose"
                    trend="+15.1%"
                    description="45k beneficiaries globally synced."
                />
                <TiltCard
                    title="治理完善度 (Gov Index)"
                    value="99.8"
                    unit="%"
                    icon={ShieldCheck}
                    color="indigo"
                    trend="Stable"
                    description="Governance verification 100% complete."
                />
            </motion.div>

            {/* 🧬 Deep Analytics Hologram Matrix */}
            <motion.div
                initial={{ rotateX: 20, opacity: 0 }}
                animate={{ rotateX: 0, opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                style={{ transformStyle: "preserve-3d", perspective: 2000 }}
                className="group relative z-10"
            >
                <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/30 via-transparent to-purple-500/30 rounded-3xl blur-2xl opacity-40 group-hover:opacity-70 transition duration-1000"></div>

                <OmniTable
                    title="即時 ESG 數據矩陣 (Real-time Hologram Matrix)"
                    subtitle="5T Protocol Synchronized · SHA-256 Anchored Observation"
                    columns={[
                        { key: 'indicator', header: '指標名稱 (Indicator)' },
                        { key: 'value', header: '當前數值 (Value)' },
                        { key: 'benchmark', header: '基準線 (Benchmark)' },
                        {
                            key: 'status',
                            header: '果証狀態 (Validation)',
                            render: (val) => (
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase flex items-center w-fit gap-1.5 ${val === 'Optimal' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                    }`}>
                                    <Sparkles size={10} /> {val}
                                </span>
                            )
                        }
                    ]}
                    data={MOCK_METRICS_DATA as any}
                />
            </motion.div>

            {/* 🛸 3D Mini Stats Modules */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10 mt-4">
                <motion.div whileHover={{ scale: 1.02, rotateY: -5 }} style={{ perspective: 1000 }}>
                    <LiquidGlassContainer glowColor="blue">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-2">
                                <h3 className="text-xl font-black italic text-white uppercase flex items-center gap-2 tracking-tighter">
                                    <TrendingUp size={24} className="text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]" /> Carbon Strategy AI
                                </h3>
                                <p className="text-xs text-omni-text-muted font-medium font-['Outfit']">根據目前排放數據，Dr. Thoth 建議優化範疇二能源採購。</p>
                            </div>
                            <button className="p-4 rounded-xl bg-gradient-to-br from-white/10 to-transparent border border-white/20 hover:bg-omni-primary/30 transition-all text-omni-primary shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                                <ArrowUpRight size={28} />
                            </button>
                        </div>
                    </LiquidGlassContainer>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02, rotateY: 5 }} style={{ perspective: 1000 }}>
                    <LiquidGlassContainer glowColor="emerald">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-2">
                                <h3 className="text-xl font-black italic text-white uppercase flex items-center gap-2 tracking-tighter">
                                    <Compass size={24} className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" /> Sustainability Roadmap
                                </h3>
                                <p className="text-xs text-omni-text-muted font-medium font-['Outfit']">本季度目標已完成 85%，距離淨零里程碑僅一步之遙。</p>
                            </div>
                            <div className="flex items-center gap-4 relative">
                                <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full"></div>
                                <div className="h-14 w-14 rounded-full border-[6px] border-emerald-500/10 border-t-emerald-400 border-l-emerald-400 animate-spin flex items-center justify-center shadow-[0_0_20px_rgba(52,211,153,0.4)]" />
                                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-black text-white italic tracking-tighter mix-blend-screen">85%</span>
                            </div>
                        </div>
                    </LiquidGlassContainer>
                </motion.div>
            </div>
        </div>
    );
}

function TiltCard({ title, value, unit, icon: Icon, color, trend, description }: any) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
    const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["20deg", "-20deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-20deg", "20deg"]);
    const translateZ = useTransform(mouseXSpring, [-0.5, 0.5], ["0px", "40px"]); // Enhanced depth

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateY,
                rotateX,
                translateZ,
                transformStyle: "preserve-3d",
            }}
            className="relative h-[280px] w-full transition-shadow duration-300 ease-out hover:shadow-[0_0_50px_rgba(255,255,255,0.1)] rounded-[3rem]"
        >
            <LiquidGlassContainer
                glowColor={color}
                intensity="high"
                className="absolute inset-0 group"
            >
                <div
                    style={{ transform: "translateZ(80px)" }}
                    className="flex flex-col h-full justify-between p-2"
                >
                    <div className="flex justify-between items-start">
                        <div className={`p-4 rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/20 text-${color}-400 group-hover:text-white transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)]`}>
                            <Icon size={28} className="drop-shadow-lg" />
                        </div>
                        <div className="flex flex-col items-end gap-1.5">
                            <div className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30 uppercase tracking-widest shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                                {trend}
                            </div>
                            <span className="text-[9px] font-black text-cyan-300/60 uppercase tracking-[0.3em] flex items-center gap-1">
                                <Sparkles size={8} /> 5T Validated
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col pt-4">
                        <h4 className="text-[11px] font-black text-omni-text-muted uppercase tracking-[0.3em] mb-2 italic">{title}</h4>
                        <div className="flex items-baseline gap-2">
                            <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 tracking-tighter font-['Outfit'] drop-shadow-2xl">{value}</span>
                            <span className="text-sm font-black text-white/40 uppercase">{unit}</span>
                        </div>
                        <p className="mt-3 text-[11px] text-white/50 font-medium font-['Outfit'] leading-relaxed">
                            {description}
                        </p>
                    </div>

                    <div className="pt-5 mt-auto flex items-center justify-between border-t border-white/10">
                        <div className="flex -space-x-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className={`w-6 h-6 rounded-full border-2 border-[#12141C] bg-gradient-to-tr from-${color}-500 to-transparent opacity-80`} />
                            ))}
                        </div>
                        <div className="flex items-center gap-1 text-white/20 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MousePointer2 size={12} className="animate-pulse" />
                            <span className="text-[8px] font-black uppercase tracking-widest">3D Look</span>
                        </div>
                    </div>
                </div>
            </LiquidGlassContainer>
        </motion.div>
    );
}

const MOCK_METRICS_DATA: any[] = [
    {
        uuid: 'atom-metrics-001',
        payload: { indicator: '能源消耗強度 (Energy Intensity)', value: '14.2', benchmark: '15.5', status: 'Optimal' },
        tags: [{ semantic: '#Env_Efficiency' }],
        isFrozen: true,
        originHash: '0x3f...a2e1',
        impactMetric: '相比去年同期降低了 8.4%，展現了卓越的減碳效能。'
    },
    {
        uuid: 'atom-metrics-002',
        payload: { indicator: '員工留任率 (Retention Rate)', value: '92%', benchmark: '85%', status: 'Optimal' },
        tags: [{ semantic: '#Social_Capital' }],
        isFrozen: true,
        originHash: '0x7e...b9d0',
        impactMetric: '高於行業平均水準 7%，內部文化共鳴度極高。'
    },
    {
        uuid: 'atom-metrics-003',
        payload: { indicator: '董事會多元化 (Board Diversity)', value: '45%', benchmark: '30%', status: 'Optimal' },
        tags: [{ semantic: '#Governance' }],
        isFrozen: true,
        originHash: '0x9d...f231',
        impactMetric: '女性董事比例提升至 45%，符合國際最佳實踐。'
    }
];
